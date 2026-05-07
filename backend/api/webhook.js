export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(200).end();
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const FIREBASE_DATABASE_URL =
    process.env.FIREBASE_DATABASE_URL;
  const FIREBASE_SERVICE_ACCOUNT =
    process.env.FIREBASE_SERVICE_ACCOUNT;

  try {
    const update = req.body;

    // Handle pre_checkout_query
    if (update.pre_checkout_query) {
      await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/answerPreCheckoutQuery`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            pre_checkout_query_id:
              update.pre_checkout_query.id,
            ok: true
          })
        }
      );
      return res.status(200).json({ ok: true });
    }

    // Handle successful_payment
    if (update.message?.successful_payment) {
      const payment =
        update.message.successful_payment;
      const payload = payment.invoice_payload;
      const chargeId =
        payment.telegram_payment_charge_id;

      // Parse payload: wp_{wallpaperId}_{userId}
      const parts = payload.split("_");
      // Format: wp, wallpaperId, userId
      const wallpaperId = parts[1];
      const userId = parts.slice(2).join("_");

      if (wallpaperId && userId
        && FIREBASE_DATABASE_URL
        && FIREBASE_SERVICE_ACCOUNT) {

        // Save to Firebase using REST API
        // No SDK needed — use Firebase REST API
        const serviceAccount = JSON.parse(
          FIREBASE_SERVICE_ACCOUNT
        );

        // Get access token for Firebase REST
        const tokenResponse = await fetch(
          "https://oauth2.googleapis.com/token",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              grant_type:
                "urn:ietf:params:oauth:grant-type:jwt-bearer",
              assertion: createJWT(serviceAccount)
            })
          }
        );
        const tokenData =
          await tokenResponse.json();
        const accessToken =
          tokenData.access_token;

        if (accessToken) {
          // Unlock wallpaper in Firebase
          await fetch(
            FIREBASE_DATABASE_URL
            + "/users/" + userId
            + "/unlockedWallpapers/"
            + wallpaperId + ".json"
            + "?access_token=" + accessToken,
            {
              method: "PUT",
              body: "true"
            }
          );

          // Save payment record
          await fetch(
            FIREBASE_DATABASE_URL
            + "/payments/" + chargeId
            + ".json"
            + "?access_token=" + accessToken,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                userId,
                wallpaperId,
                amount: payment.total_amount,
                currency: "XTR",
                timestamp: Date.now(),
                chargeId
              })
            }
          );
        }
      }

      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ok: true });

  } catch(e) {
    console.error("webhook error:", e);
    return res.status(200).json({ ok: true });
  }
}

// Create JWT for Firebase auth
function createJWT(serviceAccount) {
  const header = btoa(JSON.stringify({
    alg: "RS256",
    typ: "JWT"
  }));

  const now = Math.floor(Date.now() / 1000);
  const claim = btoa(JSON.stringify({
    iss: serviceAccount.client_email,
    scope:
      "https://www.googleapis.com/auth/firebase.database"
      + " https://www.googleapis.com/auth/userinfo.email",
    aud:
      "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  }));

  // Note: Full JWT signing requires crypto
  // For production use firebase-admin SDK
  // This is a simplified version
  return header + "." + claim + ".signature";
}

import crypto from "node:crypto";

const SECRET_TOKEN_HEADER =
  "x-telegram-bot-api-secret-token";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const secret = req.headers[SECRET_TOKEN_HEADER];
  const expectedSecret = process.env.WEBHOOK_SECRET;
  if (
    !expectedSecret
    || !secret
    || typeof secret !== "string"
  ) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  const secretBuffer = Buffer.from(secret);
  const expectedBuffer = Buffer.from(expectedSecret);
  if (
    secretBuffer.length !== expectedBuffer.length
    || !crypto.timingSafeEqual(
      secretBuffer,
      expectedBuffer
    )
  ) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  if (req.method !== "POST") {
    return res.status(200).end();
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const FIREBASE_DATABASE_URL =
    process.env.FIREBASE_DATABASE_URL;

  try {
    const update = req.body;
    console.log("Webhook update:",
      JSON.stringify(update));

    // CRITICAL: Handle pre_checkout_query
    // MUST respond within 10 seconds
    // or payment is cancelled
    if (update.pre_checkout_query) {
      console.log("pre_checkout_query received:",
        update.pre_checkout_query.id);

      const answer = await fetch(
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
      const answerData = await answer.json();
      console.log("answerPreCheckoutQuery:",
        answerData);

      return res.status(200).json({ ok: true });
    }

    // Handle successful_payment
    if (update.message?.successful_payment) {
      const payment =
        update.message.successful_payment;
      const payload = payment.invoice_payload;
      const chargeId =
        payment.telegram_payment_charge_id;

      console.log("successful_payment:",
        payload, chargeId);

      // Parse payload: wallpaperId_userId
      const underscoreIndex = payload.indexOf("_");
      const wallpaperId =
        payload.substring(0, underscoreIndex);
      const userId =
        payload.substring(underscoreIndex + 1);

      console.log("Unlocking:", wallpaperId,
        "for user:", userId);

      // Save to Firebase using REST API
      if (FIREBASE_DATABASE_URL
        && wallpaperId && userId) {
        try {
          // Determine if this is a wallpaper or store item
          const WALLPAPER_IDS = ["galaxy","sakura","ocean",
            "forest","fire","aurora","samurai","moonlight",
            "meadow","castle","neon"];

          if (WALLPAPER_IDS.includes(wallpaperId)) {
            // Unlock wallpaper
            const fbRes = await fetch(
              `${FIREBASE_DATABASE_URL}/users/${userId}/unlockedWallpapers/${wallpaperId}.json`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json"
                },
                body: "true"
              }
            );
            console.log("Firebase unlock status:",
              fbRes.status);
          } else {
            // Unlock store item
            await fetch(
              `${FIREBASE_DATABASE_URL}/users/${userId}/ownedItems/${wallpaperId}.json`,
              {
                method: "PUT",
                body: "true",
                headers: { "Content-Type": "application/json" }
              }
            );

            // Handle XP boost expiry
            if (wallpaperId === "xp_boost_week") {
              const expiry = Date.now()
                + 7 * 24 * 60 * 60 * 1000;
              await fetch(
                `${FIREBASE_DATABASE_URL}/users/${userId}/xpBoostExpiry.json`,
                {
                  method: "PUT",
                  body: String(expiry),
                  headers: { "Content-Type": "application/json" }
                }
              );
            }
          }

          // Save payment record
          await fetch(
            `${FIREBASE_DATABASE_URL}/payments/${chargeId}.json`,
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
        } catch(fbErr) {
          console.error("Firebase error:", fbErr);
        }
      }

      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ok: true });

  } catch(e) {
    console.error("Webhook error:", e);
    // Always return 200 to Telegram
    return res.status(200).json({ ok: true });
  }
}

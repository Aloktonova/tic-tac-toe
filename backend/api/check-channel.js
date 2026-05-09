const JOIN_CHANNEL_REWARD = 50;
const COIN_UPDATE_RETRIES = 3;
const CHANNEL_USERNAME = "@tictactoeclub";

async function addCoinsAtomic(baseUrl, userId, amount) {
  const coinsUrl = `${baseUrl}/users/${userId}/coins.json`;

  for (let i = 0; i < COIN_UPDATE_RETRIES; i++) {
    const coinsRes = await fetch(coinsUrl, {
      headers: {
        "X-Firebase-ETag": "true"
      }
    });
    const currentCoinsRaw = await coinsRes.json();
    const currentCoins =
      Number.isFinite(Number(currentCoinsRaw))
        ? Number(currentCoinsRaw)
        : 0;
    const etag = coinsRes.headers.get("etag");

    const writeRes = await fetch(coinsUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "If-Match": etag || "*"
      },
      body: JSON.stringify(currentCoins + amount)
    });

    if (writeRes.ok) {
      return;
    }

    if (writeRes.status !== 412) {
      throw new Error("Failed to update coins");
    }
  }

  throw new Error("Coin update conflict");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers",
    "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const FIREBASE_DATABASE_URL =
    process.env.FIREBASE_DATABASE_URL;
  if (!BOT_TOKEN) {
    return res.status(500).json({
      error: "Bot token not configured"
    });
  }

  try {
    const { userId, telegramId } = req.body;

    if (!userId || !telegramId) {
      return res.status(400).json({
        error: "Missing userId or telegramId"
      });
    }

    // Check if user is member of channel
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${CHANNEL_USERNAME}&user_id=${telegramId}`
    );
    const data = await response.json();

    const status = data?.result?.status;
    const isMember = ["member", "administrator",
      "creator", "restricted"].includes(status);

    if (!isMember) {
      return res.status(200).json({
        isMember: false,
        message: "Please join @tictactoeclub first"
      });
    }

    if (!FIREBASE_DATABASE_URL) {
      return res.status(500).json({
        error: "Firebase database URL not configured"
      });
    }

    // Award coins and mark achievement
    const achievementRes = await fetch(
      `${FIREBASE_DATABASE_URL}/users/${userId}/achievements/join_channel.json`
    );
    if (!achievementRes.ok) {
      throw new Error("Failed to read achievement state");
    }
    const achievementData = await achievementRes.json();
    if (achievementData?.claimed) {
      return res.status(200).json({
        isMember: true,
        coinsAwarded: 0,
        alreadyClaimed: true
      });
    }

    const markClaimedRes = await fetch(
      `${FIREBASE_DATABASE_URL}/users/${userId}/achievements/join_channel.json`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimed: true,
          claimedAt: Date.now(),
          pendingReward: true
        })
      }
    );
    if (!markClaimedRes.ok) {
      throw new Error("Failed to mark achievement claimed");
    }

    try {
      await addCoinsAtomic(
        FIREBASE_DATABASE_URL,
        userId,
        JOIN_CHANNEL_REWARD
      );
    } catch (coinError) {
      await fetch(
        `${FIREBASE_DATABASE_URL}/users/${userId}/achievements/join_channel.json`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            claimed: false,
            claimedAt: null,
            pendingReward: false
          })
        }
      );
      throw coinError;
    }

    const finalizeClaimRes = await fetch(
      `${FIREBASE_DATABASE_URL}/users/${userId}/achievements/join_channel.json`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pendingReward: false
        })
      }
    );
    if (!finalizeClaimRes.ok) {
      throw new Error("Failed to finalize achievement claim");
    }

    return res.status(200).json({
      isMember: true,
      coinsAwarded: JOIN_CHANNEL_REWARD
    });

  } catch(e) {
    console.error("check-channel error:", e);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
}

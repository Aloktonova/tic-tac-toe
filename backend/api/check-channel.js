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

  try {
    const { userId, telegramId } = req.body;

    if (!userId || !telegramId) {
      return res.status(400).json({
        error: "Missing userId or telegramId"
      });
    }

    // Check if user is member of channel
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=@tictactoeclub&user_id=${telegramId}`
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

    // Award coins and mark achievement
    if (FIREBASE_DATABASE_URL) {
      // Mark achievement as claimed
      await fetch(
        `${FIREBASE_DATABASE_URL}/users/${userId}/achievements/join_channel.json`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            claimed: true,
            claimedAt: Date.now()
          })
        }
      );

      // Award 50 coins
      const coinsRes = await fetch(
        `${FIREBASE_DATABASE_URL}/users/${userId}/coins.json`
      );
      const currentCoins = await coinsRes.json() || 0;

      await fetch(
        `${FIREBASE_DATABASE_URL}/users/${userId}/coins.json`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentCoins + 50)
        }
      );
    }

    return res.status(200).json({
      isMember: true,
      coinsAwarded: 50
    });

  } catch(e) {
    console.error("check-channel error:", e);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
}

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
  if (!BOT_TOKEN) {
    return res.status(500).json({
      error: "Bot token not configured"
    });
  }

  try {
    const { wallpaperId, wallpaperName,
      price, userId } = req.body;

    if (!wallpaperId || !price || !userId) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: wallpaperName + " Wallpaper",
          description: "Unlock " + wallpaperName
            + " wallpaper permanently in Tic Tac Toe",
          payload: wallpaperId + "_" + userId,
          provider_token: "",
          currency: "XTR",
          prices: [{
            label: wallpaperName + " Wallpaper",
            amount: price
          }]
        })
      }
    );

    const data = await telegramRes.json();
    console.log("Telegram createInvoiceLink:", data);

    if (!data.ok) {
      return res.status(500).json({
        error: data.description || "Telegram API error"
      });
    }

    return res.status(200).json({
      invoiceLink: data.result
    });

  } catch(e) {
    console.error("create-invoice error:", e);
    return res.status(500).json({
      error: e.message || "Internal server error"
    });
  }
}

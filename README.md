# Tic Tac Toe

## Play on Telegram

Play the game directly on Telegram: [@Tictocgame22_bot](https://t.me/Tictocgame22_bot)

<a href="https://t.me/Tictocgame22_bot"><img src="https://img.shields.io/badge/Play-Telegram-blue" alt="Play on Telegram"></a>

## Intro

Tic Tac Toe is a multiplayer + AI game built for Telegram.  
It is available as a Telegram Mini App via bot, so users can launch and play directly from Telegram.

## Features

- Play with friends (online multiplayer via Firebase Realtime Database)
- Play with computer (Easy, Medium, Hard, Adaptive AI)
- Smart AI with human-like behavior
- Instant play via Telegram bot
- No login required (uses Telegram account)
- Player stats (wins, games, XP)
- Daily country detection (stored once per day)
- Responsive UI (mobile + browser)

## Tech Stack

- HTML
- CSS
- JavaScript
- Firebase Realtime Database
- Telegram WebApp SDK

## How to Run

1. Clone this repository.
2. Add your Firebase configuration in `script.js`.
3. Start Telegram Stars backend endpoint:
   - `TELEGRAM_BOT_TOKEN=<your_bot_token> node backend/server.js`
4. Configure frontend endpoint before loading `script.js`:
   - `window.__TG_STARS_INVOICE_ENDPOINT__ = "https://<your-domain>/api/telegram/stars/invoice";`
5. Register Telegram webhook with secret token:
   - `https://api.telegram.org/bot{TOKEN}/setWebhook?url=https://tic-tac-toe-alpha-six-65.vercel.app/api/webhook&secret_token=mySecretKey123XYZ`
6. Open `index.html` locally or deploy the project.

## Project Structure

- `index.html` — Main app layout and Telegram/Firebase script imports.
- `style.css` — UI styling for screens, board, modals, and responsive layout.
- `script.js` — Game logic, AI modes, Firebase multiplayer sync, Telegram WebApp integration, and player stats.
- `backend/server.js` — Telegram Stars invoice endpoint using Bot API `createInvoiceLink`.

## Telegram Stars Payments

- Frontend sends `telegramUserId`, `itemType`, `wallpaperId`/`itemId`, and `starsAmount` to backend endpoint.
- Backend validates against server-side catalog and calls Telegram Bot API `createInvoiceLink` with:
  - `title`
  - `description`
  - `payload`
  - `currency: "XTR"`
  - `prices`
- Frontend opens checkout via `Telegram.WebApp.openInvoice(invoiceUrl)`.
- Wallpaper unlock happens only after callback status is `paid`.
- Purchases are stored in Firebase per user under:
  - `users/{telegramUserId}/ownedWallpapers/{wallpaperId}: true`

## Gameplay

### How to Play on Telegram

1. Open Telegram.
2. Search for `@Tictocgame22_bot`.
3. Tap **Start**.
4. Launch the game.

### Game Modes

- **Multiplayer:** Create or join a room using a shareable room link and play with friends online.
- **AI Mode:** Play against computer in Easy, Medium, Hard, or Adaptive difficulty.

## Future Improvements

- Leaderboard
- Match history
- More AI personalities
- UI animations

## Credits

Made with ❤️ by **Alok Maurya**  
Telegram: [@alokmaurya22](https://t.me/alokmaurya22)

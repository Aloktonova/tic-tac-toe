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
3. Deploy/run the backend API routes in `backend/api` (for example on Vercel) with:
   - `BOT_TOKEN`
   - `APP_ORIGIN`
   - `FIREBASE_DATABASE_URL`
   - `PAYMENT_PAYLOAD_SECRET`
   - `TELEGRAM_WEBHOOK_SECRET`
4. Configure frontend endpoint before loading `script.js`:
   - `window.__TG_STARS_INVOICE_ENDPOINT__ = "https://<your-domain>/api/telegram/stars/invoice";`
5. Open `index.html` locally or deploy the project.

## Project Structure

- `index.html` — Main app layout and Telegram/Firebase script imports.
- `style.css` — UI styling for screens, board, modals, and responsive layout.
- `script.js` — Game logic, AI modes, Firebase multiplayer sync, Telegram WebApp integration, and player stats.
- `backend/api/create-invoice.js` — Creates Telegram Stars invoice links from server-side catalog data.
- `backend/api/webhook.js` — Verifies Telegram payment updates and grants entitlements server-side.

## Telegram Stars Payments

- Frontend sends only `wallpaperId` and `userId` to backend.
- Backend uses a server-side catalog and signed payload, then calls Telegram Bot API `createInvoiceLink` with:
  - `title`
  - `description`
  - `payload`
  - `currency: "XTR"`
  - `prices`
- Frontend opens checkout via `Telegram.WebApp.openInvoice(invoiceUrl)`.
- Frontend treats callback `status === "paid"` as provisional and waits for backend verification.
- Webhook validates secret header, payload signature, user binding, and amount/currency before entitlement write.
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

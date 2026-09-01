# 🎮 Tic-Tac-Toe Advanced Animation & Sound System
## Integration Guide for GitHub Copilot
### Target: https://github.com/Aloktonova/tic-tac-toe/

---

## 📦 What You're Integrating

This system adds **zero-dependency** advanced animations and procedural audio to your Telegram Mini App Tic-Tac-Toe game:

| Feature | Description |
|---------|-------------|
| 🎵 **Background Music** | Generative ambient melody (C Major Pentatonic, 72 BPM) — soft, non-intrusive, improves focus |
| 🔊 **Procedural SFX** | 9 synthesized sounds: click, hover, invalid, win, draw, match start, coin, turn switch, tick |
| ✨ **Particle System** | Canvas 2D overlay: dust on tap, confetti on win, ambient sparkles, win-line glow |
| 🎯 **Board Animations** | Cell hover glow (mouse-tracking), mark placement spring, win pulse, invalid shake, score bump |
| 🎬 **Screen Transitions** | Smooth fade/slide between screens with staggered child entrances |
| ⚙️ **Settings Panel** | Sound ON/OFF toggle, Music ON/OFF toggle, Master Volume slider, Music Volume slider |
| 💾 **Persistent Settings** | All preferences saved to `localStorage` |

**Zero external files. Zero CDN. Zero MP3s.** Everything is generated in real-time using Web Audio API and Canvas 2D.

---

## 📁 Files to Create

### File 1: `animations.js` (NEW)
Save the provided `animations.js` to your repo root (same folder as `script.js`).

### File 2: `animations.css` (NEW)
Save the provided `animations.css` to your repo root (same folder as `style.css`).

---

## 🔧 Step-by-Step Integration

### STEP 1: Link the new files in `index.html`

Add these two lines inside `<head>` AFTER your existing `style.css` link:

```html
<link rel="stylesheet" href="animations.css">
```

Add this line at the bottom of `<body>` AFTER your existing `script.js`:

```html
<script src="animations.js"></script>
```

**OR** if you prefer to merge into existing files, copy the JS contents to the bottom of `script.js` and the CSS contents to the bottom of `style.css`.

---

### STEP 2: Hook into your existing `handleCellClick()` function

Find your `handleCellClick(index)` function in `script.js` and modify it like this:

```javascript
function handleCellClick(index) {
  const cell = document.querySelector(`[data-index="${index}"]`);

  // Get cell center for particles
  const rect = cell.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Check if move is valid
  if (!gameActive || board[index] !== '') {
    // INVALID MOVE
    window.TTTAnimations?.sfx?.playInvalid();
    window.TTTAnimations?.anim?.shakeCell(cell);
    return;
  }

  // VALID MOVE
  window.TTTAnimations?.sfx?.playClick();
  window.TTTAnimations?.particles?.dust(centerX, centerY, currentPlayer.toLowerCase());

  // Place the mark (your existing logic)
  board[index] = currentPlayer;

  // Animate the mark placement
  // Add this class to your mark element after rendering X or O
  const markElement = cell.querySelector('.cell-mark');
  if (markElement) {
    markElement.classList.add('placed');
  }

  // Add data attribute for styling
  cell.setAttribute('data-player', currentPlayer.toLowerCase());
  cell.classList.add('occupied');

  // ... rest of your existing logic (check win, switch turn, etc.)
}
```

---

### STEP 3: Hook into cell hover

Add this event listener near your board initialization:

```javascript
const boardEl = document.getElementById('board');
if (boardEl) {
  boardEl.addEventListener('mouseover', (e) => {
    const cell = e.target.closest('.cell');
    if (cell && !cell.classList.contains('occupied')) {
      window.TTTAnimations?.sfx?.playHover();
    }
  });
}
```

---

### STEP 4: Hook into win detection

Find your win-checking logic and add this when a win is detected:

```javascript
function checkWin() {
  // ... your existing win checking logic ...

  if (winningCombination) {
    gameActive = false;

    // Play win sound
    window.TTTAnimations?.sfx?.playWin();

    // Get winning cells
    const winningCells = winningCombination.map(i => 
      document.querySelector(`[data-index="${i}"]`)
    ).filter(Boolean);

    // Animate winning cells
    window.TTTAnimations?.anim?.animateWin(winningCells);

    // Particle glow on winning cells
    window.TTTAnimations?.particles?.winLineGlow(winningCells);

    // Confetti from board center
    const boardEl = document.getElementById('board');
    if (boardEl) {
      const rect = boardEl.getBoundingClientRect();
      window.TTTAnimations?.particles?.confetti(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
    }

    // Animate score update
    const scoreEl = currentPlayer === 'X' 
      ? document.querySelector('.player-x .score') 
      : document.querySelector('.player-o .score');
    if (scoreEl) {
      const newScore = parseInt(scoreEl.textContent || '0') + 1;
      window.TTTAnimations?.anim?.animateScore(scoreEl, newScore);
    }

    // ... your existing win handling ...
    return true;
  }
  return false;
}
```

---

### STEP 5: Hook into draw detection

```javascript
function checkDraw() {
  if (board.every(cell => cell !== '')) {
    gameActive = false;
    window.TTTAnimations?.sfx?.playDraw();
    // ... your existing draw handling ...
    return true;
  }
  return false;
}
```

---

### STEP 6: Hook into turn switching

When switching turns between players:

```javascript
function switchTurn() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  // Play subtle turn switch sound
  window.TTTAnimations?.sfx?.playTurnSwitch();

  // Update turn indicator visuals
  const playerXCard = document.querySelector('.player-x');
  const playerOCard = document.querySelector('.player-o');

  if (currentPlayer === 'X') {
    window.TTTAnimations?.anim?.setTurnIndicator(playerXCard, playerOCard);
  } else {
    window.TTTAnimations?.anim?.setTurnIndicator(playerOCard, playerXCard);
  }

  // Update "Your Turn" text with subtle animation
  const turnIndicator = document.querySelector('.turn-indicator');
  if (turnIndicator) {
    turnIndicator.style.animation = 'none';
    turnIndicator.offsetHeight; // trigger reflow
    turnIndicator.style.animation = 'turnPulse 0.5s ease';
  }
}
```

Add this CSS animation if not already present:
```css
@keyframes turnPulse {
  0% { opacity: 0.5; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1); }
}
```

---

### STEP 7: Hook into game start

```javascript
function startGame(mode) {
  // Play match start sound
  window.TTTAnimations?.sfx?.playMatchStart();

  // Animate board entrance
  setTimeout(() => {
    window.TTTAnimations?.anim?.animateBoardEntrance();
  }, 100);

  // Set initial turn indicator
  const playerXCard = document.querySelector('.player-x');
  const playerOCard = document.querySelector('.player-o');
  window.TTTAnimations?.anim?.setTurnIndicator(playerXCard, playerOCard);

  // ... your existing startGame logic ...
}
```

---

### STEP 8: Hook into menu screen (ambient particles)

```javascript
function showMenu() {
  // ... your existing show menu logic ...

  // Start ambient background particles
  const ambientInterval = setInterval(() => {
    const menuScreen = document.getElementById('screen-menu');
    if (!menuScreen || !menuScreen.classList.contains('active')) {
      window.TTTAnimations?.particles?.clearAmbient();
      clearInterval(ambientInterval);
      return;
    }
    window.TTTAnimations?.particles?.ambient();
  }, 300);
}
```

---

### STEP 9: Hook into coin/reward system

```javascript
function earnCoins(amount) {
  window.TTTAnimations?.sfx?.playCoin();

  // Show floating coin animation
  const coinBtn = document.querySelector('.coin-display, .reward-btn');
  if (coinBtn) {
    const rect = coinBtn.getBoundingClientRect();
    window.TTTAnimations?.anim?.animateCoinEarn(
      amount, 
      rect.left + rect.width / 2, 
      rect.top
    );
  }

  // ... your existing coin logic ...
}
```

---

### STEP 10: Hook into screen transitions

Replace your existing screen switching with animated transitions:

```javascript
function showScreen(screenId) {
  const currentActive = document.querySelector('.screen.active');
  const targetScreen = document.getElementById(screenId);

  window.TTTAnimations?.anim?.transitionScreen(currentActive, targetScreen, () => {
    // Callback after transition completes
    if (screenId === 'screen-menu') {
      showMenu(); // triggers ambient particles
    }
  });
}
```

---

### STEP 11: Hook into reset/new round

```javascript
function resetBoard() {
  // Clear win animations
  window.TTTAnimations?.anim?.clearWin();

  // Remove occupied/data-player classes
  document.querySelectorAll('.cell').forEach(cell => {
    cell.classList.remove('occupied', 'winner', 'shake');
    cell.removeAttribute('data-player');
    const mark = cell.querySelector('.cell-mark');
    if (mark) mark.classList.remove('placed');
  });

  // Reset turn indicator
  const playerXCard = document.querySelector('.player-x');
  const playerOCard = document.querySelector('.player-o');
  if (playerXCard) {
    playerXCard.classList.remove('turn-active', 'turn-inactive');
  }
  if (playerOCard) {
    playerOCard.classList.remove('turn-active', 'turn-inactive');
  }

  // ... your existing reset logic ...
}
```

---

### STEP 12: Initialize Settings UI

The SettingsManager auto-initializes when `animations.js` loads, but ensure your Settings screen has a container. The code looks for `#screen-settings` and injects the sound controls into the first `.settings-content`, `.screen-content`, or `div` child.

If your settings screen has a different structure, adjust the selector in `SettingsManager.createSettingsUI()`:

```javascript
// In animations.js, inside createSettingsUI(), change this line:
let settingsScreen = document.getElementById('screen-settings');
// to match your actual settings screen ID, e.g.:
// let settingsScreen = document.getElementById('settings');
```

---

## 🎨 CSS Class Reference

Apply these classes to your existing HTML elements:

| Class | Apply To | Effect |
|-------|----------|--------|
| `.cell` | Each board cell | Hover glow, press feedback, transitions |
| `.cell-mark` | X or O element inside cell | Placement pop-in animation |
| `.cell.occupied` | Cells with X or O | Disables hover effects |
| `.cell.winner` | Winning cells | Green pulse + glow |
| `.cell.shake` | Invalid move cell | Red shake animation |
| `.player-card` | Player info cards | Turn active/inactive states |
| `.player-card.turn-active` | Current player's card | Glow + scale up |
| `.player-card.turn-inactive` | Waiting player's card | Dim + grayscale |
| `.screen` | Screen containers | Transition animations |
| `.screen.active` | Visible screen | Fade + slide in |
| `.menu-btn` | Menu buttons | Staggered entrance |
| `.score-bump` | Score number element | Pop animation on update |
| `.floating-coin` | Auto-created | Coin earn float animation |

---

## 🔊 Sound & Music Controls

The Settings panel provides 4 controls:

1. **Background Music** toggle — ON/OFF the generative ambient melody
2. **Sound Effects** toggle — ON/OFF all SFX (click, win, etc.)
3. **Master Volume** slider — 0% to 100% (controls both music + SFX)
4. **Music Volume** slider — 0% to 100% (independent music control)

Settings persist in `localStorage` under key `ttt_sound_settings`.

---

## 🧹 PART 7: FINAL CODE CHECKLIST — Clean Up & Optimize

After integrating everything, run through this checklist to remove unused code and ensure fast loading:

### ✅ Step A: Remove Unused/Dead Code

Search your `script.js` for these patterns and remove if unused:

```
□ console.log() statements (keep only error logs in production)
□ Any old animation functions you previously had
□ Any old sound libraries or CDN imports (Howler.js, Tone.js, etc.)
□ Unused Firebase listeners or event subscriptions
□ Commented-out code blocks older than 2 weeks
□ Any `debugger;` statements
□ Unused variables flagged by your linter
```

### ✅ Step B: Optimize Loading Performance

```
□ Minify animations.css (use a CSS minifier or build step)
□ Minify animations.js (use a JS minifier or build step)
□ Add `defer` to your script tags if not already present:
    <script src="script.js" defer></script>
    <script src="animations.js" defer></script>
□ Ensure CSS is in <head> and JS is before </body>
□ Add preload for critical fonts if you use custom fonts:
    <link rel="preload" href="your-font.woff2" as="font" crossorigin>
□ Compress images (your wallpapers/assets) using TinyPNG or Squoosh
□ Lazy-load non-critical images:
    <img loading="lazy" src="...">
```

### ✅ Step C: Verify No Console Errors

Open DevTools Console and check:

```
□ No "undefined" errors when clicking cells
□ No AudioContext warnings (should auto-init on first click)
□ No Canvas errors (particle overlay should be transparent)
□ No CSS class conflicts (check for duplicate class names)
□ No Firebase permission errors
```

### ✅ Step D: Test on Mobile

```
□ Touch events work (hover effects gracefully degrade)
□ Particles don't cause lag (reduce counts if needed)
□ Sound plays on mobile (may need user gesture first)
□ Layout doesn't break on small screens
□ Bottom nav bar doesn't overlap game board
□ Settings sliders are thumb-friendly (min 44px touch target)
```

### ✅ Step E: Accessibility Check

```
□ Add `aria-label` to sound toggle:
    <input type="checkbox" id="music-toggle" aria-label="Toggle background music">
□ Respect `prefers-reduced-motion` (already in CSS — verify it works)
□ Ensure color contrast meets WCAG AA (dark theme usually good)
□ Test with screen reader if possible
```

### ✅ Step F: Performance Tuning (if needed)

If particles cause lag on low-end devices, edit these values in `animations.js`:

```javascript
// In ParticleSystem.dust() — reduce from 14 to 8:
for (let i = 0; i < 8; i++) { ... }

// In ParticleSystem.confetti() — reduce from 80 to 50:
for (let i = 0; i < 50; i++) { ... }

// In ParticleSystem.ambient() — reduce from 3 to 2:
for (let i = 0; i < 2; i++) { ... }

// In ParticleSystem.winLineGlow() — reduce from 20 to 12:
for (let i = 0; i < 12; i++) { ... }
```

### ✅ Step G: Production Build Checklist

```
□ Remove all console.log() from animations.js
□ Set SoundEngine debug output to silent:
    // Comment out: console.log('[SoundEngine] Initialized');
□ Verify localStorage keys don't conflict with other apps:
    Current key: 'ttt_sound_settings' ✓ (unique)
□ Test that settings persist across page reloads
□ Test that music resumes after app backgrounding (Telegram Mini App)
```

### ✅ Step H: Telegram Mini App Specific

```
□ Test inside Telegram WebView (iOS & Android)
□ Verify Telegram.WebApp.ready() is called before animations init
□ Check that back button in Telegram doesn't break animation state
□ Ensure haptic feedback doesn't conflict with sound:
    Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    // Call this alongside sfx.playWin() for extra juice
□ Test with Telegram's "Expand" button — particles should resize correctly
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **No sound at all** | Browsers block AudioContext until user interaction. Click anywhere first. The `initSound` handler is attached automatically. |
| **Music doesn't start** | Check that `music-toggle` is ON in settings. Music starts after first click + 0.1s delay. |
| **Particles not visible** | Check `#particle-overlay` has `z-index: 9999` and `pointer-events: none`. Check console for errors. |
| **Lag on old phones** | Reduce particle counts (see Performance Tuning above). |
| **CSS conflicts** | Ensure `animations.css` is loaded AFTER your main `style.css` so it can override. |
| **Settings not showing** | Verify your settings screen has id `screen-settings` or update the selector in `animations.js`. |
| **Win line not animating** | Ensure winning cells get `.winner` class and the win-line SVG is positioned correctly. |

---

## 📝 Copilot Prompt (Copy-Paste Ready)

```
I have a vanilla JS Tic-Tac-Toe Telegram Mini App with HTML/CSS/JS + Firebase.
I want to integrate an advanced animation and sound system.

I have two files ready:
1. animations.js — contains SoundEngine, BackgroundMusic, ParticleSystem, AnimationController, SettingsManager
2. animations.css — contains all animation styles

Please:
1. Add <link rel="stylesheet" href="animations.css"> to index.html <head>
2. Add <script src="animations.js"></script> to index.html before </body>
3. Hook window.TTTAnimations into my existing functions:
   - handleCellClick() — playClick() + dust() on valid, playInvalid() + shake on invalid
   - checkWin() — playWin() + confetti() + animateWin() + winLineGlow() + animateScore()
   - checkDraw() — playDraw()
   - switchTurn() — playTurnSwitch() + setTurnIndicator()
   - startGame() — playMatchStart() + animateBoardEntrance()
   - showMenu() — ambient particles
   - resetBoard() — clearWin() + remove classes
   - earnCoins() — playCoin() + animateCoinEarn()
   - showScreen() — transitionScreen()
   - cell hover — playHover()
4. Add 'cell-mark', 'occupied', 'data-player' classes/attributes to cells
5. Add 'player-card', 'player-x', 'player-o' classes to player cards
6. Ensure sfx.init() triggers on first user click (already handled in animations.js)
7. Make sure particle canvas overlay has pointer-events: none and z-index: 9999
8. Add the CSS classes from the guide to my existing elements

Do NOT break my Firebase multiplayer logic or Telegram WebApp integration.
Show me the modified files with clear comments marking new lines.
```

---

## 🎯 Expected Result

After integration, your game will have:
- **Smooth ambient background music** that plays during gameplay (toggleable in Settings)
- **Satisfying click sounds** when placing X or O
- **Particle dust bursts** on every valid move
- **Confetti explosion** on win
- **Green pulse animation** on winning cells
- **Red shake** on invalid moves
- **Mouse-tracking glow** on cell hover
- **Spring physics** on all buttons
- **Staggered entrance** animations for board cells
- **Turn indicator** glow on active player card
- **Volume control** with persistent settings

All with **zero external dependencies** and **~31KB of JavaScript** + **~15KB of CSS**.

---

*Made for Alok Maurya's Tic-Tac-Toe Telegram Mini App*
*Repository: https://github.com/Aloktonova/tic-tac-toe/*

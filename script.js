/* ===== FIREBASE CONFIG ===== */
const firebaseConfig = {
  apiKey: "AIzaSyB-voWV6lb7JK_gSs_XyzHqpWD78PcMBZk",
  authDomain: "tic-tac-toe-a19ae.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-a19ae-default-rtdb.firebaseio.com",
  projectId: "tic-tac-toe-a19ae",
  storageBucket: "tic-tac-toe-a19ae.firebasestorage.app",
  messagingSenderId: "353669749306",
  appId: "1:353669749306:web:158045cfc536ed324df303"
};

/* ===== CONSTANTS ===== */
const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6]              // diagonals
];

const AI_MOVE_DELAY_MS = 420; // brief pause so AI feels more natural

const AVATAR_COLORS = [
  '#7c3aed', '#4f46e5', '#818cf8', '#6d28d9',
  '#5b21b6', '#4338ca', '#3730a3', '#312e81'
];

const BOT_NAMES = [
  'Alex K.', 'Maria S.', 'Chen W.', 'Sofia L.', 'Lucas M.',
  'Aisha O.', 'Ivan P.', 'Yuki T.', 'Emma R.', 'Omar H.',
  'Nina B.', 'Carlos V.', 'Priya N.', 'Jake D.', 'Zoe F.'
];

const BOT_COUNTRIES = [
  'US', 'GB', 'DE', 'FR', 'JP', 'BR', 'IN', 'RU',
  'ES', 'IT', 'KR', 'AU', 'CA', 'MX', 'TR', 'PL', 'UA', 'NL'
];

/* ===== STATE ===== */
let db = null;

let currentUser = {
  id: null,
  name: 'Player',
  xp: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  games: 0,
  xpBoostExpiry: 0,
  country: ''
};

// Game state
let gameMode    = null; // 'ai' | 'online'
let aiDifficulty = 'medium';
let board        = Array(9).fill('');
let currentTurn  = 'X';
let gameOver     = false;
let playerMark   = 'X';  // current user's mark in online
let playerXWins  = 0;
let playerOWins  = 0;
let xpAwarded    = false;
let roomFirstTurn = 'X'; // tracks who starts each round in online mode

// Firebase refs
let roomId         = null;
let roomListenerRef = null;
let chatListenerRef = null;
let queueRef        = null;

// Battle state
let battleTimer    = null;
let battleCancelled = false;
let dotsInterval   = null;

// Settings state
let settingsStatsRef = null;

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', async () => {
  initTelegram();
  initFirebase();
  setupEventListeners();
  await identifyUser();
  renderRulesDefault(); // render default rules immediately
  checkUrlParams();
  showScreen('home');
});

function initTelegram() {
  try {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }
  } catch (e) {
    console.warn('Telegram init:', e);
  }
}

function initFirebase() {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.database();
  } catch (e) {
    console.warn('Firebase init failed — AI-only mode:', e);
    db = null;
  }
}

/* ===== USER IDENTITY ===== */
async function identifyUser() {
  try {
    const tg = window.Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;

    if (tgUser?.id) {
      currentUser.id = String(tgUser.id);
      const parts = [tgUser.first_name];
      if (tgUser.last_name) parts.push(tgUser.last_name);
      currentUser.name = parts.join(' ').trim() || tgUser.username || 'Player';
    } else {
      let fid = localStorage.getItem('fallbackId');
      if (!fid) {
        fid = 'u_' + Math.random().toString(36).slice(2, 11);
        localStorage.setItem('fallbackId', fid);
      }
      currentUser.id = fid;
      const storedName = localStorage.getItem('fallbackName');
      currentUser.name = storedName || ('Player ' + fid.slice(-4));
    }

    updateHomeUI();

    if (!db) return;

    // Load existing user data
    const snap = await db.ref('users/' + currentUser.id).once('value');
    if (snap.exists()) {
      const d = snap.val();
      currentUser.xp             = d.xp             || 0;
      currentUser.wins           = d.wins            || 0;
      currentUser.losses         = d.losses          || 0;
      currentUser.draws          = d.draws           || 0;
      currentUser.games          = d.games           || 0;
      currentUser.xpBoostExpiry  = d.xpBoostExpiry   || 0;
      currentUser.country        = d.country         || '';
    }

    // Update / create user doc
    const updates = { name: currentUser.name, lastActive: Date.now() };
    if (!snap.exists()) updates.createdAt = Date.now();
    await db.ref('users/' + currentUser.id).update(updates);

    // Fetch country (once per day)
    const today        = new Date().toDateString();
    const lastFetch    = localStorage.getItem('countryFetchDate');
    const storedCountry = localStorage.getItem('userCountry');
    if (storedCountry && lastFetch === today) {
      currentUser.country = storedCountry;
    } else {
      fetchCountry(); // non-blocking
    }

  } catch (e) {
    console.warn('User init error:', e);
  }
}

async function fetchCountry() {
  try {
    const res  = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    if (data.country_code) {
      currentUser.country = data.country_code;
      localStorage.setItem('userCountry',    data.country_code);
      localStorage.setItem('countryFetchDate', new Date().toDateString());
      if (db) {
        await db.ref('users/' + currentUser.id).update({ country: data.country_code });
      }
    }
  } catch (e) {
    console.warn('Country fetch:', e);
  }
}

function countryToFlag(code) {
  if (!code || code.length !== 2) return '🌍';
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map(c => 0x1F1E0 - 65 + c.charCodeAt(0))
  );
}

/* ===== SCREEN MANAGEMENT ===== */
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById('screen-' + name)?.classList.remove('hidden');
}

/* ===== HOME UI ===== */
function updateHomeUI() {
  const avatarEl   = document.getElementById('home-avatar');
  const usernameEl = document.getElementById('home-username');
  avatarEl.textContent = currentUser.name.charAt(0).toUpperCase();
  usernameEl.textContent = currentUser.name;
  setAvatarColor(avatarEl, currentUser.name);
}

function setAvatarColor(el, name) {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  el.style.background = AVATAR_COLORS[idx];
}

/* ===== URL PARAMS (invite link) ===== */
function checkUrlParams() {
  try {
    const params     = new URLSearchParams(window.location.search);
    const inviteRoom = params.get('room');
    if (inviteRoom) joinRoomAsO(inviteRoom);
  } catch (e) {
    console.warn('URL params:', e);
  }
}

/* ===== EVENT LISTENERS ===== */
function setupEventListeners() {
  // Home
  document.getElementById('user-avatar-btn').addEventListener('click', openSettings);
  document.getElementById('btn-play-ai').addEventListener('click', startAIGame);
  document.getElementById('btn-play-online').addEventListener('click', startOnlineMatchmaking);

  // Game
  document.getElementById('btn-back').addEventListener('click', leaveGame);
  document.getElementById('btn-play-again').addEventListener('click', playAgain);
  document.getElementById('btn-invite').addEventListener('click', handleInvite);
  document.getElementById('btn-send-chat').addEventListener('click', sendChatMessage);
  document.getElementById('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') sendChatMessage();
  });

  // Difficulty dropdown
  const diffBtn  = document.getElementById('difficulty-btn');
  const diffMenu = document.getElementById('difficulty-menu');

  diffBtn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = !diffMenu.classList.contains('hidden');
    diffMenu.classList.toggle('hidden', isOpen);
    diffBtn.classList.toggle('open', !isOpen);
  });

  document.querySelectorAll('.difficulty-option').forEach(opt => {
    opt.addEventListener('click', () => {
      aiDifficulty = opt.dataset.value;
      document.getElementById('difficulty-label').textContent = opt.textContent.trim();
      diffMenu.classList.add('hidden');
      diffBtn.classList.remove('open');
      document.querySelectorAll('.difficulty-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  document.addEventListener('click', () => {
    diffMenu.classList.add('hidden');
    diffBtn.classList.remove('open');
  });

  // Board clicks and keyboard
  const boardEl = document.getElementById('game-board');
  boardEl.addEventListener('click', e => {
    const cell = e.target.closest('.cell');
    if (cell) handleCellClick(parseInt(cell.dataset.index, 10));
  });
  boardEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const cell = e.target.closest('.cell');
      if (cell) handleCellClick(parseInt(cell.dataset.index, 10));
    }
  });

  // Waiting (old online screen)
  document.getElementById('btn-cancel-wait').addEventListener('click', cancelWaiting);

  // Battle modal cancel
  document.getElementById('btn-cancel-battle').addEventListener('click', cancelBattleSearch);

  // Bottom nav (all nav instances)
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const screen = btn.dataset.screen;

      if (screen === 'battle') {
        startBattleSearch();
        return;
      }

      if (screen === 'settings') {
        openSettings();
        return;
      }

      if (screen === 'leaderboard') loadLeaderboard();
      showScreen(screen);
      document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.screen === screen);
      });
    });
  });

  // Settings modal
  document.getElementById('settings-close').addEventListener('click', closeSettings);
  document.getElementById('modal-settings').addEventListener('click', e => {
    if (e.target.id === 'modal-settings') closeSettings();
  });
  document.getElementById('btn-settings-home').addEventListener('click', () => {
    closeSettings();
    showScreen('home');
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.screen === 'home');
    });
  });
  document.getElementById('btn-save-name').addEventListener('click', saveName);
  document.getElementById('settings-language').addEventListener('change', e => {
    localStorage.setItem('language', e.target.value);
  });
}

/* ===== AI GAME ===== */
function startAIGame() {
  gameMode     = 'ai';
  xpAwarded    = false;
  playerMark   = 'X';
  playerXWins  = 0;
  playerOWins  = 0;
  board        = Array(9).fill('');
  currentTurn  = 'X';
  gameOver     = false;

  document.getElementById('difficulty-container').classList.remove('hidden');
  document.getElementById('btn-invite').classList.add('hidden');
  document.getElementById('chat-container').classList.add('hidden');
  document.getElementById('result-overlay').classList.add('hidden');

  document.getElementById('player-x-name').textContent = currentUser.name;
  document.getElementById('player-o-name').textContent = 'AI (' + aiDifficulty + ')';
  document.getElementById('player-x-wins').textContent = '0';
  document.getElementById('player-o-wins').textContent = '0';

  renderBoard();
  setStatus('Your Turn');
  updateActiveTurn();
  showScreen('game');
}

/* ===== ONLINE MATCHMAKING ===== */
async function startOnlineMatchmaking() {
  if (!db) {
    alert('Online play requires an internet connection. Try "Play with Computer" for offline play.');
    return;
  }

  showScreen('waiting');

  try {
    // Look for a waiting player (not ourselves)
    const queueSnap = await db.ref('queue')
      .orderByChild('status').equalTo('waiting').once('value');

    let matchMade = false;

    if (queueSnap.exists()) {
      const entries = queueSnap.val();
      const candidates = Object.entries(entries).filter(([uid]) => uid !== currentUser.id);

      for (const [opponentId] of candidates) {
        // Atomic claim via transaction
        const opRef = db.ref('queue/' + opponentId);
        const txResult = await opRef.transaction(data => {
          if (data && data.status === 'waiting') {
            return { ...data, status: 'taken' };
          }
          return undefined; // abort
        });

        if (!txResult.committed) continue;

        // Create the room
        const opUserSnap = await db.ref('users/' + opponentId).once('value');
        const opUser     = opUserSnap.val() || {};

        const roomRef  = db.ref('rooms').push();
        const newRoomId = roomRef.key;
        const emptyBoard = Array(9).fill('');

        await roomRef.set({
          playerX: opponentId,
          playerO: currentUser.id,
          board:   emptyBoard,
          turn:    'X',
          winner:  null,
          winningCells: null,
          playerXWins: 0,
          playerOWins: 0,
          createdAt: Date.now(),
          players: {
            X: { id: opponentId, name: opUser.name || 'Player' },
            O: { id: currentUser.id, name: currentUser.name }
          },
          stats: { matchId: Date.now(), awardedKey: null }
        });

        // Notify opponent
        await opRef.update({ status: 'matched', roomId: newRoomId });

        matchMade = true;
        joinRoom(newRoomId, 'O');
        break;
      }
    }

    if (!matchMade) {
      // Add self to queue and wait
      await db.ref('queue/' + currentUser.id).set({
        userId:    currentUser.id,
        timestamp: Date.now(),
        status:    'waiting'
      });
      listenForMatch();
    }

  } catch (e) {
    console.warn('Matchmaking error:', e);
    showScreen('home');
  }
}

function listenForMatch() {
  if (!db) return;
  queueRef = db.ref('queue/' + currentUser.id);
  queueRef.on('value', async snap => {
    if (!snap.exists()) return;
    const data = snap.val();
    if (data.status === 'matched' && data.roomId) {
      cleanupQueueListener();
      joinRoom(data.roomId, 'X');
    }
  });
}

function cleanupQueueListener() {
  if (queueRef) {
    queueRef.off('value');
    queueRef = null;
  }
}

function cancelWaiting() {
  cleanupQueueListener();
  if (db) {
    db.ref('queue/' + currentUser.id).remove().catch(() => {});
  }
  showScreen('home');
}

/* ===== ROOM MANAGEMENT ===== */
function joinRoom(rId, mark) {
  roomId      = rId;
  playerMark  = mark;
  gameMode    = 'online';
  xpAwarded   = false;
  playerXWins = 0;
  playerOWins = 0;
  board       = Array(9).fill('');
  currentTurn = 'X';
  gameOver    = false;
  roomFirstTurn = 'X';

  document.getElementById('difficulty-container').classList.add('hidden');
  document.getElementById('btn-invite').classList.remove('hidden');
  document.getElementById('chat-container').classList.remove('hidden');
  document.getElementById('result-overlay').classList.add('hidden');
  document.getElementById('chat-messages').innerHTML = '';

  showScreen('game');
  listenToRoom();
}

async function joinRoomAsO(rId) {
  if (!db) return;
  try {
    const snap = await db.ref('rooms/' + rId).once('value');
    if (!snap.exists()) return;
    const room = snap.val();

    // Determine our mark
    const mark = (room.players?.X?.id === currentUser.id) ? 'X' : 'O';

    // Register as O if slot is free
    if (!room.players?.O && mark === 'O') {
      await db.ref('rooms/' + rId).update({
        playerO: currentUser.id,
        'players/O': { id: currentUser.id, name: currentUser.name }
      });
    }

    joinRoom(rId, mark);
  } catch (e) {
    console.warn('joinRoomAsO:', e);
  }
}

function listenToRoom() {
  if (!db || !roomId) return;
  cleanupRoomListener();

  roomListenerRef = db.ref('rooms/' + roomId);
  roomListenerRef.on('value', snap => {
    if (!snap.exists()) return;
    renderOnlineRoom(snap.val());
  });

  chatListenerRef = db.ref('rooms/' + roomId + '/messages').limitToLast(50);
  chatListenerRef.on('child_added', snap => appendChatMessage(snap.val()));
}

function cleanupRoomListener() {
  if (roomListenerRef) { roomListenerRef.off('value'); roomListenerRef = null; }
  if (chatListenerRef) { chatListenerRef.off('child_added'); chatListenerRef = null; }
}

function renderOnlineRoom(room) {
  board = normalizeBoard(room.board);
  currentTurn  = room.turn || 'X';
  playerXWins  = room.playerXWins || 0;
  playerOWins  = room.playerOWins || 0;

  const pX = room.players?.X || {};
  const pO = room.players?.O || {};

  document.getElementById('player-x-name').textContent = pX.name || 'Player X';
  document.getElementById('player-o-name').textContent = pO.name || 'Waiting...';
  document.getElementById('player-x-wins').textContent = playerXWins;
  document.getElementById('player-o-wins').textContent = playerOWins;

  const winCells = normalizeArrayField(room.winningCells);

  if (room.winner) {
    gameOver = true;
    renderBoard(winCells);

    let outcome;
    if (room.winner === 'draw')         outcome = 'draw';
    else if (room.winner === playerMark) outcome = 'win';
    else                                 outcome = 'lose';

    setStatus({ win: 'You Win! 🎉', lose: 'You Lose! 😔', draw: "It's a Draw! 🤝" }[outcome]);
    showResultOverlay(outcome);

    if (!xpAwarded) {
      xpAwarded = true;
      awardXP(outcome);
    }
  } else {
    gameOver = false;
    renderBoard();

    if (!room.players?.O || !room.playerO) {
      setStatus('Waiting for opponent...');
    } else if (currentTurn === playerMark) {
      setStatus('Your Turn');
    } else {
      setStatus("Opponent's Turn");
    }
    updateActiveTurn();
    document.getElementById('result-overlay').classList.add('hidden');
  }
}

/* ===== BOARD RENDERING ===== */
function renderBoard(winCells) {
  const cells = document.querySelectorAll('.cell');

  const shouldDisable = gameOver
    || (gameMode === 'ai'     && currentTurn === 'O')
    || (gameMode === 'online' && currentTurn !== playerMark);

  cells.forEach((cell, i) => {
    cell.className = 'cell';
    const val = board[i];

    if (val === 'X') {
      cell.textContent = '✕';
      cell.classList.add('x-cell', 'taken', 'disabled');
    } else if (val === 'O') {
      cell.textContent = '○';
      cell.classList.add('o-cell', 'taken', 'disabled');
    } else {
      cell.textContent = '';
      if (shouldDisable) cell.classList.add('disabled');
    }

    if (winCells && winCells.includes(i)) cell.classList.add('winning');
  });
}

function updateActiveTurn() {
  document.getElementById('player-x-info').classList.toggle('active-turn', currentTurn === 'X');
  document.getElementById('player-o-info').classList.toggle('active-turn', currentTurn === 'O');
}

function setStatus(text) {
  document.getElementById('game-status').textContent = text;
}

/* ===== CELL CLICK ===== */
function handleCellClick(index) {
  if (gameOver || board[index] !== '') return;

  if (gameMode === 'ai') {
    if (currentTurn !== 'X') return;
    processAIGameMove(index, 'X');
  } else if (gameMode === 'online') {
    if (currentTurn !== playerMark) return;
    makeOnlineMove(index);
  }
}

/* ===== AI GAME LOGIC ===== */
function processAIGameMove(index, mark) {
  if (board[index] !== '') return;

  board[index] = mark;
  const result = checkWinner(board);

  if (result) {
    gameOver = true;
    currentTurn = mark; // keep for renderBoard disabled logic
    renderBoard(result.cells);
    updateActiveTurn();

    let outcome;
    if (result.winner === 'draw') {
      outcome = 'draw';
      setStatus("It's a Draw! 🤝");
    } else if (result.winner === playerMark) {
      outcome = 'win';
      playerXWins++;
      document.getElementById('player-x-wins').textContent = playerXWins;
      setStatus('You Win! 🎉');
    } else {
      outcome = 'lose';
      playerOWins++;
      document.getElementById('player-o-wins').textContent = playerOWins;
      setStatus('AI Wins! 🤖');
    }

    showResultOverlay(outcome);
    if (!xpAwarded) { xpAwarded = true; awardXP(outcome); }
    return;
  }

  currentTurn = mark === 'X' ? 'O' : 'X';
  renderBoard();
  updateActiveTurn();

  if (mark === 'X') {
    setStatus('AI Thinking...');
    setTimeout(doAITurn, AI_MOVE_DELAY_MS);
  } else {
    setStatus('Your Turn');
  }
}

function doAITurn() {
  if (gameOver || gameMode !== 'ai') return;
  const idx = getAIMove(board);
  if (idx !== null && idx !== undefined) {
    processAIGameMove(idx, 'O');
  }
}

/* ===== AI MOVE SELECTION ===== */
function getAIMove(b) {
  if (aiDifficulty === 'easy') {
    return randomMove(b);
  } else if (aiDifficulty === 'medium') {
    return Math.random() < 0.5 ? minimaxMove(b) : randomMove(b);
  } else {
    return minimaxMove(b);
  }
}

function randomMove(b) {
  const empties = b.map((v, i) => v === '' ? i : -1).filter(v => v >= 0);
  return empties.length ? empties[Math.floor(Math.random() * empties.length)] : null;
}

function minimaxMove(b) {
  let bestScore = -Infinity;
  let bestMove  = null;

  for (let i = 0; i < 9; i++) {
    if (b[i] === '') {
      b[i] = 'O';
      const score = minimax(b, 0, false, -Infinity, Infinity);
      b[i] = '';
      if (score > bestScore) { bestScore = score; bestMove = i; }
    }
  }
  return bestMove;
}

function minimax(b, depth, isMax, alpha, beta) {
  const res = checkWinner(b);
  if (res) {
    if (res.winner === 'O')    return 10 - depth;
    if (res.winner === 'X')    return depth - 10;
    return 0;
  }

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i] === '') {
        b[i] = 'O';
        best = Math.max(best, minimax(b, depth + 1, false, alpha, beta));
        b[i] = '';
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i] === '') {
        b[i] = 'X';
        best = Math.min(best, minimax(b, depth + 1, true, alpha, beta));
        b[i] = '';
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
}

/* ===== WIN DETECTION ===== */
function checkWinner(b) {
  for (const combo of WINNING_COMBOS) {
    const [i0, i1, i2] = combo;
    if (b[i0] && b[i0] === b[i1] && b[i0] === b[i2]) {
      return { winner: b[i0], cells: combo };
    }
  }
  if (b.every(v => v !== '')) return { winner: 'draw', cells: [] };
  return null;
}

/* ===== ONLINE MOVE ===== */
async function makeOnlineMove(index) {
  if (!db || !roomId || gameOver || board[index] !== '') return;

  const newBoard = [...board];
  newBoard[index] = playerMark;
  const result  = checkWinner(newBoard);
  const nextTurn = playerMark === 'X' ? 'O' : 'X';

  const update = {
    board:       newBoard,
    turn:        result ? currentTurn : nextTurn,
    winner:      result ? (result.winner) : null,
    winningCells: result ? result.cells : null
  };

  if (result && result.winner !== 'draw') {
    if (result.winner === 'X') {
      update.playerXWins = firebase.database.ServerValue.increment(1);
    } else {
      update.playerOWins = firebase.database.ServerValue.increment(1);
    }
  }

  try {
    await db.ref('rooms/' + roomId).update(update);
  } catch (e) {
    console.warn('Online move error:', e);
  }
}

/* ===== RESULT OVERLAY ===== */
function showResultOverlay(outcome) {
  const emojiMap  = { win: '🎉', lose: '😔', draw: '🤝' };
  const textMap   = { win: 'You Win!', lose: 'You Lose!', draw: "It's a Draw!" };
  const colorMap  = { win: 'var(--accent-green)', lose: 'var(--accent-red)', draw: 'var(--accent-orange)' };

  document.getElementById('result-emoji').textContent = emojiMap[outcome];
  const textEl = document.getElementById('result-text');
  textEl.textContent  = textMap[outcome];
  textEl.style.color  = colorMap[outcome];

  const boost    = Date.now() < (currentUser.xpBoostExpiry || 0);
  const xpAmounts = { win: boost ? 20 : 10, draw: boost ? 14 : 7, lose: boost ? 10 : 5 };
  document.getElementById('result-xp').textContent =
    '+' + xpAmounts[outcome] + ' XP' + (boost ? ' ⚡ 2x Boost' : '');

  document.getElementById('result-overlay').classList.remove('hidden');
}

/* ===== PLAY AGAIN ===== */
function playAgain() {
  if (gameMode === 'ai') {
    board       = Array(9).fill('');
    currentTurn = 'X';
    gameOver    = false;
    xpAwarded   = false;
    renderBoard();
    setStatus('Your Turn');
    updateActiveTurn();
    document.getElementById('result-overlay').classList.add('hidden');
  } else if (gameMode === 'online' && db && roomId) {
    // Alternate who goes first each round
    roomFirstTurn = roomFirstTurn === 'X' ? 'O' : 'X';
    xpAwarded = false; // reset for the new round
    db.ref('rooms/' + roomId).update({
      board:        Array(9).fill(''),
      turn:         roomFirstTurn,
      winner:       null,
      winningCells: null,
      'stats/awardedKey': null
    }).catch(e => console.warn('Play again error:', e));
  }
}

/* ===== LEAVE GAME ===== */
function leaveGame() {
  cleanupRoomListener();
  cleanupQueueListener();
  roomId    = null;
  gameMode  = null;
  gameOver  = false;
  board     = Array(9).fill('');
  showScreen('home');
}

/* ===== XP SYSTEM ===== */
async function awardXP(outcome) {
  const boost = Date.now() < (currentUser.xpBoostExpiry || 0);
  const xpMap = { win: boost ? 20 : 10, draw: boost ? 14 : 7, lose: boost ? 10 : 5 };
  const xpGain = xpMap[outcome] || 0;

  currentUser.xp     = (currentUser.xp     || 0) + xpGain;
  currentUser.games  = (currentUser.games   || 0) + 1;
  if (outcome === 'win')  currentUser.wins   = (currentUser.wins   || 0) + 1;
  if (outcome === 'lose') currentUser.losses = (currentUser.losses  || 0) + 1;
  if (outcome === 'draw') currentUser.draws  = (currentUser.draws   || 0) + 1;

  if (!db) return;
  try {
    await db.ref('users/' + currentUser.id).update({
      xp:         currentUser.xp,
      wins:       currentUser.wins,
      losses:     currentUser.losses,
      draws:      currentUser.draws,
      games:      currentUser.games,
      lastActive: Date.now()
    });
  } catch (e) {
    console.warn('XP update error:', e);
  }
}

/* ===== INVITE ===== */
function handleInvite() {
  if (!roomId) return;
  const base = window.location.origin + window.location.pathname;
  const url  = base + '?room=' + encodeURIComponent(roomId);
  const tg   = window.Telegram?.WebApp;

  if (tg?.openTelegramLink) {
    const shareUrl = 'https://t.me/share/url?url=' + encodeURIComponent(url)
      + '&text=' + encodeURIComponent('Join my Tic Tac Toe game! 🎮');
    try { tg.openTelegramLink(shareUrl); return; } catch (e) { /* fallthrough */ }
  }

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url)
      .then(() => showToast('Invite link copied! 📋'))
      .catch(() => prompt('Copy invite link:', url));
  } else {
    prompt('Copy invite link:', url);
  }
}

/* ===== CHAT ===== */
async function sendChatMessage() {
  if (!db || !roomId) return;
  const input = document.getElementById('chat-input');
  const text  = input.value.trim();
  if (!text) return;
  input.value = '';

  try {
    await db.ref('rooms/' + roomId + '/messages').push({
      userId: currentUser.id,
      name:   currentUser.name,
      text:   text,
      time:   Date.now()
    });
  } catch (e) {
    console.warn('Chat send error:', e);
  }
}

function appendChatMessage(msg) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg';

  const senderSpan = document.createElement('span');
  senderSpan.className = 'msg-sender';
  senderSpan.textContent = (msg.name || 'Player') + ':';

  const textSpan = document.createElement('span');
  textSpan.className = 'msg-text';
  textSpan.textContent = ' ' + (msg.text || '');

  div.appendChild(senderSpan);
  div.appendChild(textSpan);
  container.appendChild(div);

  // Cap at 50 messages
  while (container.children.length > 50) {
    container.removeChild(container.firstChild);
  }
  container.scrollTop = container.scrollHeight;
}

/* ===== LEADERBOARD ===== */
async function loadLeaderboard() {
  const list = document.getElementById('leaderboard-list');
  list.innerHTML = '<div class="loading-text">Loading...</div>';

  if (!db) {
    list.innerHTML = '<div class="loading-text">Leaderboard requires an internet connection.</div>';
    return;
  }

  try {
    const snap = await db.ref('users').orderByChild('wins').limitToLast(20).once('value');
    const users = [];
    snap.forEach(child => {
      const d = child.val();
      if (d) users.push({ id: child.key, ...d });
    });

    users.sort((a, b) => (b.wins || 0) - (a.wins || 0));

    if (!users.length) {
      list.innerHTML = '<div class="loading-text">No players yet. Be the first!</div>';
      return;
    }

    list.innerHTML = '';
    const medals = ['🥇', '🥈', '🥉'];

    users.forEach((user, i) => {
      const rank = i + 1;
      const isMe = user.id === currentUser.id;
      const flag = countryToFlag(user.country);

      const row = document.createElement('div');
      row.className = 'leaderboard-row' + (isMe ? ' me' : '');
      row.setAttribute('role', 'listitem');

      const rankDiv = document.createElement('div');
      rankDiv.className = 'rank' + (rank <= 3 ? ' top-3' : '');
      rankDiv.textContent = rank <= 3 ? medals[rank - 1] : String(rank);

      const flagDiv = document.createElement('div');
      flagDiv.className = 'lb-flag';
      flagDiv.textContent = flag;

      const nameDiv = document.createElement('div');
      nameDiv.className = 'lb-name';
      nameDiv.textContent = user.name || 'Player';

      const statsDiv = document.createElement('div');
      statsDiv.className = 'lb-stats';

      const winsDiv = document.createElement('div');
      winsDiv.className = 'lb-wins';
      winsDiv.textContent = (user.wins || 0) + 'W';

      const gamesDiv = document.createElement('div');
      gamesDiv.className = 'lb-games';
      gamesDiv.textContent = (user.games || 0) + ' games';

      statsDiv.appendChild(winsDiv);
      statsDiv.appendChild(gamesDiv);
      row.appendChild(rankDiv);
      row.appendChild(flagDiv);
      row.appendChild(nameDiv);
      row.appendChild(statsDiv);
      list.appendChild(row);
    });

  } catch (e) {
    console.warn('Leaderboard error:', e);
    list.innerHTML = '<div class="loading-text">Failed to load leaderboard.</div>';
  }
}

/* ===== RULES ===== */
function renderRulesDefault() {
  const defaultSections = [
    {
      title: 'Objective',
      content: 'Be the first player to get 3 of your marks in a row — horizontally, vertically, or diagonally.'
    },
    {
      title: 'How to Play',
      items: [
        'The game is played on a 3×3 grid.',
        'Player X always goes first.',
        'Players take turns placing their mark (X or O) on an empty cell.',
        'The first player to align 3 marks wins the game.',
        'If all 9 cells are filled with no winner, the game is a draw.'
      ]
    },
    {
      title: 'Game Modes',
      items: [
        '🤖 Play with Computer – Challenge the AI at Easy, Medium, or Hard difficulty.',
        '🌐 Play with Friends – Match with a random opponent online, or send an invite link.'
      ]
    },
    {
      title: 'XP & Levels',
      items: [
        'Win: +10 XP  (20 XP with 2× Boost)',
        'Draw: +7 XP  (14 XP with 2× Boost)',
        'Loss: +5 XP  (10 XP with 2× Boost)',
        'Level up every 100 XP.',
        'Purchase a 7-day 2× XP Boost via your profile.'
      ]
    },
    {
      title: 'Tips',
      items: [
        'Control the center cell for the best strategic position.',
        'Watch out for opponent forks — two winning threats at once.',
        'A draw is always possible with perfect play from both sides.'
      ]
    }
  ];

  const container = document.getElementById('rules-content');
  container.innerHTML = '';

  defaultSections.forEach(sec => {
    const section = document.createElement('div');
    section.className = 'rules-section';
    if (sec.title) {
      const h = document.createElement('h3');
      h.textContent = sec.title;
      section.appendChild(h);
    }
    if (sec.content) {
      const p = document.createElement('p');
      p.textContent = sec.content;
      section.appendChild(p);
    }
    if (sec.items) {
      const ul = document.createElement('ul');
      sec.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      section.appendChild(ul);
    }
    container.appendChild(section);
  });
}

/* ===== BATTLE TAB ===== */
function startBattleSearch() {
  battleCancelled = false;
  document.getElementById('modal-battle').classList.remove('hidden');
  document.body.style.pointerEvents = 'none';
  document.getElementById('modal-battle').style.pointerEvents = 'auto';
  startDotsAnimation();

  if (!db) {
    battleTimer = setTimeout(() => {
      if (!battleCancelled) startBotGame();
    }, 3000);
    return;
  }

  // Add to Firebase queue (with future tournament fields)
  db.ref('queue/' + currentUser.id).set({
    userId:    currentUser.id,
    timestamp: Date.now(),
    status:    'waiting',
    entry_paid: false
  }).then(() => {
    searchBattleOpponent();
  }).catch(e => {
    console.warn('Battle queue error:', e);
    battleTimer = setTimeout(() => {
      if (!battleCancelled) startBotGame();
    }, 3000);
  });

  // 3-second timeout → bot fallback
  battleTimer = setTimeout(() => {
    if (!battleCancelled) {
      cleanupQueueListener();
      if (db) db.ref('queue/' + currentUser.id).remove().catch(() => {});
      startBotGame();
    }
  }, 3000);
}

async function searchBattleOpponent() {
  if (!db || battleCancelled) return;
  try {
    const queueSnap = await db.ref('queue')
      .orderByChild('status').equalTo('waiting').once('value');

    if (battleCancelled) return;

    if (queueSnap.exists()) {
      const entries = queueSnap.val();
      const candidates = Object.entries(entries).filter(([uid]) => uid !== currentUser.id);

      for (const [opponentId] of candidates) {
        const opRef = db.ref('queue/' + opponentId);
        const txResult = await opRef.transaction(data => {
          if (data && data.status === 'waiting') {
            return { ...data, status: 'taken' };
          }
          return undefined;
        });

        if (!txResult.committed || battleCancelled) continue;

        clearTimeout(battleTimer);

        const opUserSnap = await db.ref('users/' + opponentId).once('value');
        const opUser     = opUserSnap.val() || {};

        const roomRef   = db.ref('rooms').push();
        const newRoomId = roomRef.key;

        await roomRef.set({
          playerX: opponentId,
          playerO: currentUser.id,
          board:   Array(9).fill(''),
          turn:    'X',
          winner:  null,
          winningCells: null,
          playerXWins: 0,
          playerOWins: 0,
          createdAt: Date.now(),
          tournament_id: null,
          players: {
            X: { id: opponentId, name: opUser.name || 'Player' },
            O: { id: currentUser.id, name: currentUser.name }
          },
          stats: { matchId: Date.now(), awardedKey: null }
        });

        await opRef.update({ status: 'matched', roomId: newRoomId });

        hideBattleModal();
        joinRoom(newRoomId, 'O');
        return;
      }
    }

    // No immediate opponent — listen for match signal
    listenForBattleMatch();

  } catch (e) {
    console.warn('Battle search error:', e);
  }
}

function listenForBattleMatch() {
  if (!db || battleCancelled) return;
  queueRef = db.ref('queue/' + currentUser.id);
  queueRef.on('value', snap => {
    if (!snap.exists() || battleCancelled) return;
    const data = snap.val();
    if (data.status === 'matched' && data.roomId) {
      clearTimeout(battleTimer);
      cleanupQueueListener();
      hideBattleModal();
      joinRoom(data.roomId, 'X');
    }
  });
}

function cancelBattleSearch() {
  battleCancelled = true;
  clearTimeout(battleTimer);
  stopDotsAnimation();
  cleanupQueueListener();
  if (db) db.ref('queue/' + currentUser.id).remove().catch(() => {});
  hideBattleModal();
  showScreen('home');
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.screen === 'home');
  });
}

function startBotGame() {
  hideBattleModal();

  const botIdx      = Math.floor(Math.random() * BOT_NAMES.length);
  const countryIdx  = Math.floor(Math.random() * BOT_COUNTRIES.length);
  const botName     = countryToFlag(BOT_COUNTRIES[countryIdx]) + ' ' + BOT_NAMES[botIdx];

  gameMode     = 'ai';
  xpAwarded    = false;
  playerMark   = 'X';
  playerXWins  = 0;
  playerOWins  = 0;
  board        = Array(9).fill('');
  currentTurn  = 'X';
  gameOver     = false;
  aiDifficulty = 'medium';

  document.getElementById('difficulty-container').classList.add('hidden');
  document.getElementById('btn-invite').classList.add('hidden');
  document.getElementById('chat-container').classList.add('hidden');
  document.getElementById('result-overlay').classList.add('hidden');

  document.getElementById('player-x-name').textContent = currentUser.name;
  document.getElementById('player-o-name').textContent = botName;
  document.getElementById('player-x-wins').textContent = '0';
  document.getElementById('player-o-wins').textContent = '0';

  renderBoard();
  setStatus('Your Turn');
  updateActiveTurn();
  showScreen('game');
}

function hideBattleModal() {
  document.getElementById('modal-battle').classList.add('hidden');
  document.body.style.pointerEvents = 'auto';
  stopDotsAnimation();
}

function startDotsAnimation() {
  stopDotsAnimation();
  const spans = document.querySelectorAll('.dots-animation span');
  let step = 0;
  dotsInterval = setInterval(() => {
    spans.forEach((s, i) => {
      s.style.opacity = (i === step % 3) ? '1' : '0.3';
      s.style.transform = (i === step % 3) ? 'scale(1.2)' : 'scale(0.8)';
    });
    step++;
  }, 350);
}

function stopDotsAnimation() {
  if (dotsInterval) {
    clearInterval(dotsInterval);
    dotsInterval = null;
  }
}

/* ===== SETTINGS MODAL ===== */
function openSettings() {
  document.getElementById('settings-name-input').value = currentUser.name;

  const lang = localStorage.getItem('language') || 'en';
  const langSelect = document.getElementById('settings-language');
  if (langSelect) langSelect.value = lang;

  populateSettingsStats();

  if (db) {
    if (settingsStatsRef) settingsStatsRef.off('value');
    settingsStatsRef = db.ref('users/' + currentUser.id);
    settingsStatsRef.on('value', snap => {
      if (!snap.exists()) return;
      const d = snap.val();
      currentUser.xp     = d.xp     || currentUser.xp;
      currentUser.wins   = d.wins   || currentUser.wins;
      currentUser.losses = d.losses || currentUser.losses;
      currentUser.draws  = d.draws  || currentUser.draws;
      currentUser.games  = d.games  || currentUser.games;
      populateSettingsStats();
    });
  }

  document.getElementById('modal-settings').classList.remove('hidden');
  document.body.style.pointerEvents = 'auto';
}

function populateSettingsStats() {
  const xp       = currentUser.xp || 0;
  const level    = Math.floor(xp / 100);
  const progress = xp % 100;

  document.getElementById('settings-level').textContent   = level;
  document.getElementById('settings-xp-text').textContent = progress + ' / 100 XP';
  const bar = document.getElementById('settings-xp-bar');
  bar.style.width = progress + '%';
  bar.parentElement.setAttribute('aria-valuenow', progress);

  document.getElementById('settings-wins').textContent   = currentUser.wins   || 0;
  document.getElementById('settings-losses').textContent = currentUser.losses  || 0;
  document.getElementById('settings-draws').textContent  = currentUser.draws   || 0;
}

function closeSettings() {
  document.getElementById('modal-settings').classList.add('hidden');
  document.body.style.pointerEvents = 'auto';
  detachSettingsListener();
}

function detachSettingsListener() {
  if (settingsStatsRef) {
    settingsStatsRef.off('value');
    settingsStatsRef = null;
  }
}

async function saveName() {
  const input   = document.getElementById('settings-name-input');
  const newName = input.value.trim();
  if (!newName) return;

  currentUser.name = newName;
  localStorage.setItem('fallbackName', newName);
  updateHomeUI();

  if (db) {
    try {
      await db.ref('users/' + currentUser.id).update({ name: newName });
      showToast('Name saved!');
    } catch (e) {
      console.warn('Save name error:', e);
      showToast('Name updated locally.');
    }
  } else {
    showToast('Name saved!');
  }
}

/* ===== HELPERS ===== */
function normalizeBoard(raw) {
  const arr = Array(9).fill('');
  if (!raw) return arr;
  for (let i = 0; i < 9; i++) {
    arr[i] = raw[i] || '';
  }
  return arr;
}

function normalizeArrayField(raw) {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw;
  // Firebase may return an object with numeric string keys
  return Object.keys(raw).sort((a, b) => Number(a) - Number(b)).map(k => raw[k]);
}

let toastTimer = null;
function showToast(msg) {
  let toast = document.getElementById('toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.style.cssText = [
      'position:fixed', 'bottom:80px', 'left:50%', 'transform:translateX(-50%)',
      'background:#333', 'color:#fff', 'padding:10px 20px', 'border-radius:20px',
      'font-size:14px', 'z-index:9999', 'pointer-events:none',
      'transition:opacity 0.3s', 'max-width:320px', 'text-align:center'
    ].join(';');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

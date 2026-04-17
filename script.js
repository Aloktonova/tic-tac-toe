// 📱 Telegram
const tg = window.Telegram.WebApp;
tg.expand();

let user = {};
// Only use the real Telegram ID — no random fallback for online play
let userId = null;
let normalizedUserId = null;
let currentUserName = "Player";

function syncTelegramUserContext() {
  user = tg.initDataUnsafe?.user || {};
  userId = user.id ?? null;
  normalizedUserId = userId === null ? null : String(userId);
  currentUserName = user.username || user.first_name || "Player";
}

syncTelegramUserContext();

// 🔥 Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB-voWV6lb7JK_gSs_XyzHqpWD78PcMBZk",
  authDomain: "tic-tac-toe-a19ae.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-a19ae-default-rtdb.firebaseio.com",
  projectId: "tic-tac-toe-a19ae"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🎯 GLOBAL STATE
let board = ["","","","","","","","",""];
let currentPlayer = "X";
let winner = null;
let winningCells = [];
let gameMode = "online";

let roomId = null;
let roomRef = null;
let roomValueListener = null;
let chatMessagesRef = null;
let chatEnabled = false;

// Tracks room readiness and the current user's role
let roomLoaded = false;
let myRole = null;        // "X", "O", or null (spectator)
let hasAttemptedJoin = false;
let isJoinAttemptInFlight = false;

const MAX_MESSAGE_LENGTH = 500;

// 🎯 UI ELEMENTS
let userInfo, boardDiv, statusText, playersDiv;
let homeScreen, gameScreen;
let messagesDiv, chatInputEl, sendBtnEl;
let inviteBtn, restartBtn, homeBtn;

// =======================
// 🔔 TOAST
// =======================
function showToast(msg, duration) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = msg;
  toast.style.display = "block";
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.display = "none"; }, duration || 2500);
}

// =======================
// 🧹 NORMALIZE ROOM DATA
// =======================
function normalizeRoomData(raw) {
  let board = ["","","","","","","","",""];
  if (Array.isArray(raw.board)) {
    board = raw.board;
  } else if (raw.board && typeof raw.board === "object") {
    board = Array.from({ length: 9 }, (_, i) => String(raw.board[i] || ""));
  }
  return {
    board,
    turn: raw.turn || null,
    winner: raw.winner || null,
    winningCells: Array.isArray(raw.winningCells) ? raw.winningCells : [],
    players: {
      X: raw.players?.X || null,
      O: raw.players?.O || null
    }
  };
}

// =======================
// 🔒 WRITE GUARD
// =======================
function canWrite() {
  return gameMode === "online" && !!roomRef && roomLoaded;
}

// =======================
// 🎛️ ACTION BUTTONS STATE
// =======================
function updateActionButtons() {
  if (!restartBtn) return;
  if (gameMode === "online") {
    restartBtn.disabled = !roomLoaded || !myRole;
    // Spectators can see chat messages but cannot send
    if (chatInputEl && sendBtnEl) {
      const canChat = !!myRole && roomLoaded;
      chatEnabled = canChat;
      chatInputEl.disabled = !canChat;
      sendBtnEl.disabled = !canChat;
      if (!canChat && roomLoaded && !myRole) {
        chatInputEl.placeholder = "Spectators cannot chat";
      }
    }
  } else {
    restartBtn.disabled = false;
  }
}

// =======================
// 🚀 INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {
  syncTelegramUserContext();

  console.log("App Loaded ✅");

  // UI
  userInfo = document.getElementById("userInfo");
  boardDiv = document.getElementById("board");
  statusText = document.getElementById("statusText");
  playersDiv = document.getElementById("players");

  homeScreen = document.getElementById("homeScreen");
  gameScreen = document.getElementById("gameScreen");
  messagesDiv = document.getElementById("messages");
  chatInputEl = document.getElementById("chatInput");
  sendBtnEl = document.getElementById("sendBtn");

  const createBtn = document.getElementById("createGame");
  const aiBtn = document.getElementById("playAI");
  inviteBtn = document.getElementById("inviteBtn");
  restartBtn = document.getElementById("restartBtn");
  homeBtn = document.getElementById("homeBtn");

  // 👤 Show user
  userInfo.innerText = "Player: " + currentUserName;

  // 🔥 BUTTON FIX (IMPORTANT)
  createBtn.addEventListener("click", createGame);
  aiBtn.addEventListener("click", playAI);
  sendBtnEl.addEventListener("click", sendChatMessage);
  chatInputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendChatMessage();
    }
  });
  setChatEnabled(false, "Chat is disabled in AI mode");
  inviteBtn.addEventListener("click", shareGame);
  restartBtn.addEventListener("click", restartGame);
  homeBtn.addEventListener("click", goHome);

  autoJoinRoomFromLocation();
  window.addEventListener("hashchange", autoJoinRoomFromLocation);
});

function getRoomIdFromLocation() {
  const hash = window.location.hash || "";
  const hashMatch = hash.match(/(?:^#|[?&])room=([^&]+)/);
  if (hashMatch && hashMatch[1]) return decodeURIComponent(hashMatch[1]);

  const roomFromQuery = new URLSearchParams(window.location.search).get("room");
  if (roomFromQuery) return roomFromQuery;

  return null;
}

function autoJoinRoomFromLocation() {
  const detectedRoomId = getRoomIdFromLocation();
  if (!detectedRoomId) return;
  if (roomId === detectedRoomId && roomRef) return;

  stopRoomListener();
  stopChatListener();

  roomId = detectedRoomId;
  roomRef = db.ref("rooms/" + roomId);
  gameMode = "online";

  showGame();
  setInviteButtonState();
  listenRoom();

  console.log("Joined Room:", roomId);
}

// =======================
// 🎮 CREATE GAME
// =======================
function createGame() {
  if (!normalizedUserId) {
    showToast("Unable to verify Telegram identity");
    return;
  }

  console.log("Create Game Clicked");

  gameMode = "online";

  roomId = Math.random().toString(36).substr(2, 6);
  roomRef = db.ref("rooms/" + roomId);

  roomRef.set({
    board: ["","","","","","","","",""],
    turn: "X",
    winner: null,
    winningCells: [],
    players: {
      X: {
        id: normalizedUserId,
        name: currentUserName
      },
      O: null
    }
  }).catch(err => {
    console.error("Create game failed:", err);
    showToast("Failed to create room. Try again.");
  });

  showGame();
  setInviteButtonState();
  listenRoom();
  shareGame();
}

// =======================
// 🤖 AI MODE
// =======================
function playAI() {
  console.log("AI Mode");

  gameMode = "ai";

  board = ["","","","","","","","",""];
  currentPlayer = "X";
  winner = null;
  winningCells = [];

  showGame();
  disableChatForAI();
  setInviteButtonState();
  updateStatus();
  renderBoard();
}

// 📩 Invite visibility
function setInviteButtonState() {
  if (!inviteBtn) return;
  const isOnlineMode = gameMode === "online";
  inviteBtn.style.display = isOnlineMode ? "" : "none";
}

// =======================
// 👀 LISTEN ROOM
// =======================
function listenRoom() {
  if (!roomRef) return;

  if (roomValueListener) {
    roomRef.off("value", roomValueListener);
  }

  hasAttemptedJoin = false;
  isJoinAttemptInFlight = false;

  roomValueListener = (snap) => {
    const raw = snap.val();
    if (!raw) return;

    const data = normalizeRoomData(raw);
    window.currentRoomData = data;
    roomLoaded = true;

    board = data.board;
    currentPlayer = data.turn;
    winner = data.winner;
    winningCells = data.winningCells;

    // Derive this user's role from room data
    const xId = normalizePlayerId(data.players.X?.id);
    const oId = normalizePlayerId(data.players.O?.id);
    if (xId && xId === normalizedUserId) myRole = "X";
    else if (oId && oId === normalizedUserId) myRole = "O";
    else myRole = null;

    const x = data.players.X?.name || "X";
    const o = data.players.O?.name || "Waiting...";
    playersDiv.innerText = `❌ ${x} vs ⭕ ${o}`;

    updateStatus();
    renderBoard();
    updateActionButtons();

    // Atomically claim O slot (only once, only if eligible after room value loads)
    const shouldAttemptJoinAsO =
      !hasAttemptedJoin &&
      !isJoinAttemptInFlight &&
      !!normalizedUserId &&
      data.players.O === null &&
      !!xId &&
      xId !== normalizedUserId;

    if (shouldAttemptJoinAsO) {
      isJoinAttemptInFlight = true;
      roomRef.child("players/O").transaction(currentO => {
        if (currentO !== null) return undefined; // already taken — abort
        return { id: normalizedUserId, name: currentUserName };
      }, (err, committed) => {
        isJoinAttemptInFlight = false;
        if (err) {
          console.error("Failed to join as O:", err);
          return;
        }

        hasAttemptedJoin = true;
        if (!committed) showToast("Room is full — you are spectating");
      });
    }
  };

  roomRef.on("value", roomValueListener);

  startChatListener();
  setChatEnabled(true, "Type message...");
}

// =======================
// 🎯 GAME LOGIC
// =======================
function checkWinner(b) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let combo of wins) {
    const [a,b1,c] = combo;
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
      return { winner: b[a], cells: combo };
    }
  }

  if (b.every(x => x !== "")) return { winner: "draw", cells: [] };

  return null;
}

// =======================
// 🎮 RENDER
// =======================
function renderBoard() {
  boardDiv.innerHTML = "";

  board.forEach((cell, i) => {
    const btn = document.createElement("button");
    btn.className = "cell";
    btn.innerText = cell;

    if (winningCells.includes(i)) {
      btn.style.background = "#22c55e";
    }

    let disabled;
    if (gameMode === "ai") {
      // Disable when cell is filled, game over, or AI is thinking
      disabled = !!(cell || winner || currentPlayer === "O");
    } else {
      // Disable when: cell filled, game over, room not ready, spectator, or wrong turn
      disabled = !!(cell || winner || !roomLoaded || !myRole || myRole !== currentPlayer);
    }

    btn.disabled = disabled;
    btn.onclick = () => makeMove(i);

    boardDiv.appendChild(btn);
  });
}

// =======================
// ✍️ MOVE
// =======================
function makeMove(i) {
  if (board[i] !== "" || winner) return;

  if (gameMode === "ai") {
    board[i] = "X";

    let res = checkWinner(board);
    if (res) {
      winner = res.winner;
      winningCells = res.cells;
    } else {
      currentPlayer = "O";
      setTimeout(aiMove, 400);
    }

    updateStatus();
    renderBoard();
    return;
  }

  // Online mode guards
  if (!roomLoaded || !roomRef) return;
  if (!myRole) { showToast("You are spectating"); return; }
  if (myRole !== currentPlayer) { showToast("Not your turn"); return; }
  if (winner) return;

  const newBoard = [...board];
  newBoard[i] = myRole;

  const res = checkWinner(newBoard);

  if (res) {
    roomRef.update({
      board: newBoard,
      winner: res.winner,
      winningCells: res.cells,
      turn: null
    }).catch(err => {
      console.error("Move failed:", err);
      showToast("Move failed. Please try again.");
    });
  } else {
    roomRef.update({
      board: newBoard,
      turn: myRole === "X" ? "O" : "X"
    }).catch(err => {
      console.error("Move failed:", err);
      showToast("Move failed. Please try again.");
    });
  }
}

function getPlayerSymbol() {
  const data = window.currentRoomData;
  if (!data || !data.players) return null;
  const xId = normalizePlayerId(data.players.X?.id);
  const oId = normalizePlayerId(data.players.O?.id);
  if (xId && xId === normalizedUserId) return "X";
  if (oId && oId === normalizedUserId) return "O";
  return null;
}

function normalizePlayerId(id) {
  if (id === null || id === undefined) return null;
  return String(id);
}

// 🤖 AI MOVE
function aiMove() {

  // 🎲 40% chance to play RANDOM (to make it beatable)
  if (Math.random() < 0.4) {
    playRandom();
    return;
  }

  // 1️⃣ Try to WIN
  let move = findBestMove("O");
  if (move !== null) {
    makeAIMove(move);
    return;
  }

  // 🎲 30% chance to IGNORE blocking (intentional mistake)
  if (Math.random() < 0.3) {
    playSmartPosition();
    return;
  }

  // 2️⃣ Block player WIN
  move = findBestMove("X");
  if (move !== null) {
    makeAIMove(move);
    return;
  }

  // 3️⃣ Smart positioning
  playSmartPosition();
}

function findBestMove(symbol) {
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== "") continue;
    const testBoard = [...board];
    testBoard[i] = symbol;
    const result = checkWinner(testBoard);
    if (result?.winner === symbol) return i;
  }
  return null;
}

function makeAIMove(i) {
  if (i === null || i === undefined || board[i] !== "" || winner) return;

  board[i] = "O";
  const res = checkWinner(board);

  if (res) {
    winner = res.winner;
    winningCells = res.cells;
  } else {
    currentPlayer = "X";
  }

  updateStatus();
  renderBoard();
}

// 🎯 Smart positioning (not perfect)
function playSmartPosition() {

  // Take center sometimes
  if (board[4] === "" && Math.random() < 0.7) {
    makeAIMove(4);
    return;
  }

  // Take corner sometimes
  const corners = [0,2,6,8].filter(i => board[i] === "");
  if (corners.length && Math.random() < 0.7) {
    const move = corners[Math.floor(Math.random() * corners.length)];
    makeAIMove(move);
    return;
  }

  // Otherwise random
  playRandom();
}

// 🎲 Random move
function playRandom() {
  const empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  const move = empty[Math.floor(Math.random()*empty.length)];
  makeAIMove(move);
}

// =======================
// 📊 STATUS
// =======================
function updateStatus() {
  if (gameMode === "ai") {
    if (winner === "draw") return statusText.innerText = "Draw";
    if (winner) return statusText.innerText = winner === "X" ? "You Win 🎉" : "AI Wins 🤖";
    return statusText.innerText = currentPlayer === "X" ? "Your Turn" : "AI Thinking…";
  }

  const data = window.currentRoomData;
  if (!data || !data.players) {
    statusText.innerText = "Loading room...";
    return;
  }

  if (!data.players.O) {
    statusText.innerText = "Waiting for player...";
    return;
  }

  if (winner === "draw") statusText.innerText = "Draw!";
  else if (winner) statusText.innerText = winner + " Wins! 🎉";
  else if (!myRole) statusText.innerText = currentPlayer + "'s Turn (you are spectating)";
  else if (myRole === currentPlayer) statusText.innerText = "Your Turn (" + myRole + ")";
  else statusText.innerText = "Waiting for " + currentPlayer + "...";
}

// =======================
// 🔁 RESTART
// =======================
function restartGame() {
  if (gameMode === "ai") {
    board = ["","","","","","","","",""];
    currentPlayer = "X";
    winner = null;
    winningCells = [];
    updateStatus();
    renderBoard();
    return;
  }

  if (!canWrite() || !myRole) {
    showToast("Only players can restart");
    return;
  }

  roomRef.update({
    board: ["","","","","","","","",""],
    turn: "X",
    winner: null,
    winningCells: []
  }).catch(err => {
    console.error("Restart failed:", err);
    showToast("Restart failed. Try again.");
  });
}

// =======================
// 📩 SHARE (FIXED)
// =======================
function shareGame() {
  if (gameMode !== "online" || !roomId) {
    console.warn("Invite is only available in online mode with a valid room.");
    return;
  }

  const link = `${window.location.origin}${window.location.pathname}#room=${roomId}`;

  tg.openTelegramLink(
    "https://t.me/share/url?url=" + encodeURIComponent(link)
  );
}

// =======================
// 🏠 NAV
// =======================
function showGame() {
  homeScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
}

function goHome() {
  stopRoomListener();
  stopChatListener();
  roomId = null;
  roomRef = null;
  setChatEnabled(false, "Chat is disabled in AI mode");
  gameScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
}

function stopRoomListener() {
  if (roomRef && roomValueListener) {
    roomRef.off("value", roomValueListener);
  }
  roomValueListener = null;
  roomLoaded = false;
  myRole = null;
  hasAttemptedJoin = false;
  isJoinAttemptInFlight = false;
  window.currentRoomData = null;
}

function startChatListener() {
  if (!roomRef) return;

  stopChatListener();
  chatMessagesRef = roomRef.child("messages");

  chatMessagesRef.orderByChild("timestamp").on("value", snap => {
    const messages = [];

    snap.forEach(child => {
      const data = child.val() || {};
      const text = typeof data.text === "string" ? data.text.trim() : "";
      if (!text) return;

      messages.push({
        senderId: data.senderId,
        senderName: data.senderName || "Player",
        text,
        timestamp: data.timestamp || 0
      });
    });

    renderMessages(messages);
  });
}

function stopChatListener() {
  if (chatMessagesRef) {
    chatMessagesRef.off();
    chatMessagesRef = null;
  }
}

function sendChatMessage() {
  if (!chatEnabled || gameMode !== "online" || !roomRef || !chatInputEl) return;
  if (!normalizedUserId) return;
  if (!myRole) { showToast("Only players can chat"); return; }

  const text = chatInputEl.value.trim();
  if (!text || text.length > MAX_MESSAGE_LENGTH) return;

  roomRef.child("messages").push({
    senderId: normalizedUserId,
    senderName: currentUserName,
    text,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  }).then(() => {
    chatInputEl.value = "";
    chatInputEl.focus();
  }).catch((error) => {
    console.error("Send message failed:", error);
    showToast("Failed to send message.");
  });
}

function renderMessages(messages) {
  if (!messagesDiv) return;

  messagesDiv.innerHTML = "";

  if (!messages.length) {
    const empty = document.createElement("div");
    empty.className = "empty-message";
    empty.innerText = "No messages yet";
    messagesDiv.appendChild(empty);
    return;
  }

  messages.forEach((msg) => {
    const item = document.createElement("div");
    item.className = "message-item";
    if (msg.senderId === normalizedUserId) item.classList.add("mine");

    const sender = document.createElement("div");
    sender.className = "message-sender";
    sender.innerText = msg.senderName;

    const text = document.createElement("div");
    text.className = "message-text";
    text.innerText = msg.text;

    item.appendChild(sender);
    item.appendChild(text);
    messagesDiv.appendChild(item);
  });

  autoScrollMessages();
}

function autoScrollMessages() {
  if (!messagesDiv) return;
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function setChatEnabled(enabled, placeholderText) {
  chatEnabled = enabled;
  if (!chatInputEl || !sendBtnEl) return;

  chatInputEl.disabled = !enabled;
  sendBtnEl.disabled = !enabled;
  chatInputEl.placeholder = placeholderText || "Type message...";

  if (!enabled) {
    chatInputEl.value = "";
    if (messagesDiv) {
      messagesDiv.innerHTML = "";
      const disabledNote = document.createElement("div");
      disabledNote.className = "empty-message";
      disabledNote.innerText = "Chat disabled in AI mode";
      messagesDiv.appendChild(disabledNote);
    }
  }
}

function disableChatForAI() {
  stopChatListener();
  setChatEnabled(false, "Chat is disabled in AI mode");
}

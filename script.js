// 📱 Telegram
const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe?.user || {};
const userId = user.id || Math.floor(Math.random() * 1000000);
const normalizedUserId = normalizePlayerId(userId);

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

// 🎯 UI ELEMENTS
let userInfo, boardDiv, statusText, playersDiv;
let homeScreen, gameScreen;
let messagesDiv, chatInputEl, sendBtnEl;
const currentUserName = user.username || user.first_name || "Player";
let inviteBtn, restartBtn, homeBtn;

// =======================
// 🚀 INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {

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
  userInfo.innerText = "Player: " + (user.username || user.first_name || "Guest");

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
        name: user.username || user.first_name || "Player"
      },
      O: null
    }
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

// 📩 Invite availability
function setInviteButtonState() {
  if (!inviteBtn) return;
  const isOnlineMode = gameMode === "online";
  inviteBtn.disabled = !isOnlineMode;
  inviteBtn.title = isOnlineMode ? "" : "Only available in online mode";
  inviteBtn.setAttribute(
    "aria-label",
    isOnlineMode ? "Invite" : "Invite (only available in online mode)"
  );
}

// =======================
// 👀 LISTEN ROOM
// =======================
function listenRoom() {
  if (!roomRef) return;

  if (roomValueListener) {
    roomRef.off("value", roomValueListener);
  }

  roomValueListener = (snap) => {
    const data = snap.val();
    if (!data) return;

    window.currentRoomData = data;

    board = data.board;
    currentPlayer = data.turn;
    winner = data.winner;
    winningCells = data.winningCells || [];

    const x = data.players.X?.name || "X";
    const o = data.players.O?.name || "Waiting...";

    playersDiv.innerText = `❌ ${x} vs ⭕ ${o}`;

    updateStatus();
    renderBoard();
  };
  roomRef.on("value", roomValueListener);

  startChatListener();
  setChatEnabled(true, "Type message...");

  // JOIN AS O
  roomRef.once("value", snap => {
    const data = snap.val();
    if (!data?.players) return;

    const xId = normalizePlayerId(data.players?.X?.id);
    const oId = normalizePlayerId(data.players?.O?.id);
    if (!oId && xId && xId !== normalizedUserId) {
      roomRef.update({
        "players/O": {
          id: normalizedUserId,
          name: user.username || user.first_name || "Player"
        }
      });
    }
  });
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

    if (cell || winner) btn.disabled = true;

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

  const symbol = getPlayerSymbol();

  if (!symbol) return alert("Spectator");
  if (symbol !== currentPlayer) return alert("Not your turn");

  board[i] = currentPlayer;

  let res = checkWinner(board);

  if (res) {
    roomRef.update({
      board,
      winner: res.winner,
      winningCells: res.cells,
      turn: null
    });
  } else {
    roomRef.update({
      board,
      turn: currentPlayer === "X" ? "O" : "X"
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
    if (winner) return statusText.innerText = winner === "X" ? "You Win" : "AI Wins";
    return statusText.innerText = currentPlayer === "X" ? "Your Turn" : "AI Thinking";
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

  if (winner === "draw") statusText.innerText = "Draw";
  else if (winner) statusText.innerText = winner + " Wins";
  else statusText.innerText = currentPlayer + "'s Turn";
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

  roomRef.update({
    board: ["","","","","","","","",""],
    turn: "X",
    winner: null,
    winningCells: []
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
  setChatEnabled(false, "Chat is disabled in AI mode");
  gameScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
}

function stopRoomListener() {
  if (roomRef && roomValueListener) {
    roomRef.off("value", roomValueListener);
  }
  roomValueListener = null;
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

  const text = chatInputEl.value.trim();
  if (!text) return;

  roomRef.child("messages").push({
    senderId: userId,
    senderName: currentUserName,
    text,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  }).then(() => {
    chatInputEl.value = "";
    chatInputEl.focus();
  }).catch((error) => {
    console.error("Send message failed:", error);
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
    if (msg.senderId === userId) item.classList.add("mine");

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

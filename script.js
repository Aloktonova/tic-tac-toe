// 📱 Telegram
const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe?.user || {};
const userId = user.id || Math.floor(Math.random() * 1000000);

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

// 🎯 UI ELEMENTS
let userInfo, boardDiv, statusText, playersDiv;
let homeScreen, gameScreen;
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
  inviteBtn.addEventListener("click", shareGame);
  restartBtn.addEventListener("click", restartGame);
  homeBtn.addEventListener("click", goHome);

  // 🔗 AUTO JOIN (IMPORTANT FIX)
  const hash = window.location.hash;

  if (hash.startsWith("#room=")) {
    roomId = hash.replace("#room=", "");
    roomRef = db.ref("rooms/" + roomId);

    gameMode = "online";
    showGame();
    setInviteButtonState();
    listenRoom();

    console.log("Joined Room:", roomId);
  }
});

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
        id: userId,
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
  setInviteButtonState();
  updateStatus();
  renderBoard();
}

function setInviteButtonState() {
  if (!inviteBtn) return;
  inviteBtn.disabled = gameMode !== "online";
}

// =======================
// 👀 LISTEN ROOM
// =======================
function listenRoom() {
  roomRef.on("value", snap => {
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
  });

  // JOIN AS O
  roomRef.once("value", snap => {
    const data = snap.val();

    if (!data.players.O && data.players.X.id !== userId) {
      roomRef.update({
        "players/O": {
          id: userId,
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
  if (gameMode !== "online" || !roomId) return;

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
  gameScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
}

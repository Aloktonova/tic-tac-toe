// 📱 Telegram
const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe?.user;
const userId = user?.id || Math.random().toString(36);

// 🔥 Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB-voWV6lb7JK_gSs_XyzHqpWD78PcMBZk",
  authDomain: "tic-tac-toe-a19ae.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-a19ae-default-rtdb.firebaseio.com",
  projectId: "tic-tac-toe-a19ae"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🧠 State
let board = ["","","","","","","","",""];
let currentPlayer = "X";
let winner = null;
let winningCells = [];
let gameMode = "online";

let roomId = null;
let roomRef = null;

// 🎯 UI
let boardDiv, statusText, playersDiv;
let homeScreen, gameScreen;
let messagesDiv, chatInput;

// ===============================
// 🚀 INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  boardDiv = document.getElementById("board");
  statusText = document.getElementById("statusText");
  playersDiv = document.getElementById("players");

  homeScreen = document.getElementById("homeScreen");
  gameScreen = document.getElementById("gameScreen");

  messagesDiv = document.getElementById("messages");
  chatInput = document.getElementById("chatInput");

  document.getElementById("userInfo").innerText =
    "Player: " + (user?.username || user?.first_name || "Guest");

  // 🎮 BUTTONS
  document.getElementById("createGame").onclick = startFriendGame;
  document.getElementById("playAI").onclick = startAIGame;
  document.getElementById("inviteBtn").onclick = shareGame;
  document.getElementById("restartBtn").onclick = restartGame;
  document.getElementById("homeBtn").onclick = goHome;
  document.getElementById("sendBtn").onclick = sendMessage;

  // 🔗 Auto join
  const params = new URLSearchParams(window.location.search);
  const roomFromUrl = params.get("room");

  if (roomFromUrl) {
    roomId = roomFromUrl;
    roomRef = db.ref("rooms/" + roomId);
    gameMode = "online";

    showGame();
    listenRoom();
  }
});

// ===============================
// 🎮 START FRIEND GAME
// ===============================
function startFriendGame() {
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
        name: user?.username || user?.first_name || "Player"
      },
      O: null
    }
  });

  showGame();
  listenRoom();
  shareGame();
}

// ===============================
// 🤖 START AI GAME
// ===============================
function startAIGame() {
  gameMode = "ai";

  board = ["","","","","","","","",""];
  currentPlayer = "X";
  winner = null;
  winningCells = [];

  showGame();
  updateStatus();
  renderBoard();
}

// ===============================
// 🏠 NAVIGATION
// ===============================
function showGame() {
  homeScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
}

function goHome() {
  gameScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
}

// ===============================
// 👀 LISTEN ROOM
// ===============================
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

  // join as O
  roomRef.once("value", snap => {
    const data = snap.val();

    if (!data.players.O && data.players.X.id !== userId) {
      roomRef.update({
        "players/O": {
          id: userId,
          name: user?.username || user?.first_name || "Player"
        }
      });
    }
  });

  // 💬 Chat
  db.ref(`rooms/${roomId}/messages`).on("value", snap => {
    const data = snap.val();
    if (!data) return;

    messagesDiv.innerHTML = "";

    Object.values(data).forEach(m => {
      const div = document.createElement("div");
      div.innerText = `${m.user}: ${m.text}`;
      messagesDiv.appendChild(div);
    });

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}

// ===============================
// 🎯 WIN CHECK
// ===============================
function checkWinner(b) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let c of wins) {
    const [a,b1,c1] = c;
    if (b[a] && b[a] === b[b1] && b[a] === b[c1]) {
      return { winner: b[a], cells: c };
    }
  }

  if (b.every(x => x !== "")) return { winner: "draw", cells: [] };
  return null;
}

// ===============================
// 🎮 RENDER
// ===============================
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

// ===============================
// ✍️ MOVE
// ===============================
function makeMove(i) {
  if (board[i] || winner) return;

  if (gameMode === "ai") {
    board[i] = "X";

    let r = checkWinner(board);
    if (r) {
      winner = r.winner;
      winningCells = r.cells;
    } else {
      currentPlayer = "O";
      setTimeout(aiMove, 400);
    }

    updateStatus();
    renderBoard();
    return;
  }

  const symbol = getPlayerSymbol();
  if (!symbol) return showMessage("Spectator");
  if (symbol !== currentPlayer) return showMessage("Wait turn");

  board[i] = currentPlayer;

  let r = checkWinner(board);

  if (r) {
    roomRef.update({
      board,
      winner: r.winner,
      winningCells: r.cells,
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
  let empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  let move = empty[Math.floor(Math.random()*empty.length)];

  board[move] = "O";

  let r = checkWinner(board);
  if (r) {
    winner = r.winner;
    winningCells = r.cells;
  } else {
    currentPlayer = "X";
  }

  updateStatus();
  renderBoard();
}

// ===============================
// 🔒 PLAYER SYMBOL
// ===============================
function getPlayerSymbol() {
  const d = window.currentRoomData;
  if (!d) return null;

  if (d.players.X?.id === userId) return "X";
  if (d.players.O?.id === userId) return "O";
  return null;
}

// ===============================
// 📊 STATUS
// ===============================
function updateStatus() {
  if (gameMode === "ai") {
    if (winner === "draw") return statusText.innerText = "Draw 🤝";
    if (winner) return statusText.innerText = winner === "X" ? "You Win 🎉" : "AI Wins 🤖";
    return statusText.innerText = currentPlayer === "X" ? "Your Turn" : "AI Thinking...";
  }

  const d = window.currentRoomData;

  if (!d.players.O) return statusText.innerText = "Waiting for opponent...";

  if (winner === "draw") statusText.innerText = "Draw 🤝";
  else if (winner) statusText.innerText = winner + " Wins 🎉";
  else statusText.innerText = currentPlayer + "'s Turn";
}

// ===============================
// 🔁 RESTART
// ===============================
function restartGame() {
  if (gameMode === "ai") {
    startAIGame();
    return;
  }

  roomRef.update({
    board: ["","","","","","","","",""],
    turn: "X",
    winner: null,
    winningCells: []
  });
}

// ===============================
// 📩 SHARE
// ===============================
function shareGame() {
  if (!roomId) return;

  const link = `${window.location.origin}${window.location.pathname}?room=${roomId}`;

  tg.openTelegramLink(
    "https://t.me/share/url?url=" + encodeURIComponent(link)
  );
}

// ===============================
// 💬 CHAT
// ===============================
function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  db.ref(`rooms/${roomId}/messages`).push({
    user: user?.username || user?.first_name || "Player",
    text,
    time: Date.now()
  });

  chatInput.value = "";
}

// ===============================
// 💬 TOAST
// ===============================
function showMessage(t) {
  const msg = document.getElementById("toast");
  msg.innerText = t;
  msg.style.display = "block";
  setTimeout(()=>msg.style.display="none",2000);
}

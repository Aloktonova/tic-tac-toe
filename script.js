// 📱 Telegram
const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe?.user;
const userId = user?.id;

// 👤 UI
const userInfo = document.getElementById("userInfo");
const boardDiv = document.getElementById("board");
const statusText = document.getElementById("statusText");
const playersDiv = document.getElementById("players");

const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");

const createGameBtn = document.getElementById("createGame");
const playAIBtn = document.getElementById("playAI");

const messagesDiv = document.getElementById("messages");
const chatInput = document.getElementById("chatInput");

// 👤 Show user
if (user) {
  userInfo.innerText = "Player: " + (user.username || user.first_name);
}

// 🔊 Sounds
const sounds = {
  move: new Audio("https://www.soundjay.com/buttons/sounds/button-09.mp3"),
  win: new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3")
};

// 🔥 Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB-voWV6lb7JK_gSs_XyzHqpWD78PcMBZk",
  authDomain: "tic-tac-toe-a19ae.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-a19ae-default-rtdb.firebaseio.com",
  projectId: "tic-tac-toe-a19ae"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🧠 Game State
let board = ["","","","","","","","",""];
let currentPlayer = "X";
let winner = null;
let winningCells = [];
let gameMode = "online";

let roomId = null;
let roomRef = null;

// 🏠 Navigation
function showGame() {
  homeScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
}

function goHome() {
  gameScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
}

// 🎮 PLAY WITH FRIEND
createGameBtn.onclick = () => {
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
        name: user.username || user.first_name
      },
      O: null
    }
  });

  listenRoom();
  showGame();
  shareGame();
};

// 🤖 PLAY WITH AI
playAIBtn.onclick = () => {
  gameMode = "ai";

  board = ["","","","","","","","",""];
  currentPlayer = "X";
  winner = null;
  winningCells = [];

  showGame();
  updateStatus();
  renderBoard();
};

// 👀 LISTEN ROOM
function listenRoom() {
  roomRef.on("value", snapshot => {
    const data = snapshot.val();
    if (!data) return;

    window.currentRoomData = data;

    board = data.board;
    currentPlayer = data.turn;
    winner = data.winner;
    winningCells = data.winningCells || [];

    // 👤 Player UI
    const x = data.players.X?.name || "Player X";
    const o = data.players.O?.name || "Waiting...";

    const xActive = currentPlayer === "X" ? "🟢" : "";
    const oActive = currentPlayer === "O" ? "🟢" : "";

    if (playersDiv) {
      playersDiv.innerText = `❌ ${x} ${xActive} vs ⭕ ${o} ${oActive}`;
    }

    updateStatus();
    renderBoard();
  });

  // 👥 Join as O
  roomRef.once("value", snap => {
    const data = snap.val();
    if (!data.players.O && data.players.X.id !== userId) {
      roomRef.update({
        "players/O": {
          id: userId,
          name: user.username || user.first_name
        }
      });
    }
  });

  // 💬 CHAT LISTENER
  db.ref(`rooms/${roomId}/messages`).on("value", snap => {
    const data = snap.val();
    if (!data || !messagesDiv) return;

    messagesDiv.innerHTML = "";

    Object.values(data).forEach(m => {
      const div = document.createElement("div");
      div.innerText = `${m.user}: ${m.text}`;
      messagesDiv.appendChild(div);
    });

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}

// 🎯 CHECK WINNER
function checkWinner(board) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let combo of wins) {
    const [a,b,c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], cells: combo };
    }
  }

  if (board.every(c => c !== "")) return { winner: "draw", cells: [] };
  return null;
}

// 🎮 RENDER BOARD
function renderBoard() {
  boardDiv.innerHTML = "";

  board.forEach((cell, index) => {
    const btn = document.createElement("button");
    btn.classList.add("cell");
    btn.innerText = cell;

    if (cell === "X") btn.style.color = "#22c55e";
    if (cell === "O") btn.style.color = "#3b82f6";

    if (winningCells.includes(index)) {
      btn.style.background = "#22c55e";
      btn.style.animation = "winPulse 0.5s infinite alternate";
    }

    if (cell !== "" || winner) btn.disabled = true;

    btn.onclick = () => makeMove(index);

    boardDiv.appendChild(btn);
  });
}

// ✍️ MOVE
function makeMove(index) {
  if (board[index] !== "" || winner) return;

  sounds.move.currentTime = 0;
  sounds.move.play();

  // 🤖 AI MODE
  if (gameMode === "ai") {
    if (currentPlayer !== "X") return;

    board[index] = "X";

    let result = checkWinner(board);
    if (result) {
      winner = result.winner;
      winningCells = result.cells;
      sounds.win.play();
    } else {
      currentPlayer = "O";
      setTimeout(aiMove, 400);
    }

    updateStatus();
    renderBoard();
    return;
  }

  // 🌐 ONLINE MODE
  const playerSymbol = getPlayerSymbol();

  if (!playerSymbol) return showMessage("Spectator 👀");
  if (currentPlayer !== playerSymbol) return showMessage("Not your turn ⏳");

  board[index] = currentPlayer;

  const result = checkWinner(board);

  if (result) {
    sounds.win.play();

    roomRef.update({
      board,
      winner: result.winner,
      winningCells: result.cells,
      turn: null
    });
  } else {
    roomRef.update({
      board,
      turn: currentPlayer === "X" ? "O" : "X"
    });
  }
}

// 🤖 SMART AI
function aiMove() {
  if (winner) return;

  let move = findBestMove("O") || findBestMove("X");

  if (move === null) {
    let empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
    move = empty[Math.floor(Math.random()*empty.length)];
  }

  board[move] = "O";

  let result = checkWinner(board);
  if (result) {
    winner = result.winner;
    winningCells = result.cells;
    sounds.win.play();
  } else {
    currentPlayer = "X";
  }

  updateStatus();
  renderBoard();
}

// 🧠 AI HELPER
function findBestMove(player) {
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = player;
      let win = checkWinner(board);
      board[i] = "";

      if (win && win.winner === player) return i;
    }
  }
  return null;
}

// 🔒 SYMBOL
function getPlayerSymbol() {
  const data = window.currentRoomData;
  if (!data) return null;

  if (data.players.X?.id === userId) return "X";
  if (data.players.O?.id === userId) return "O";
  return null;
}

// 📊 STATUS
function updateStatus() {
  if (gameMode === "ai") {
    if (winner === "draw") return statusText.innerText = "Draw 🤝";
    if (winner) return statusText.innerText = winner === "X" ? "You Win 🎉" : "AI Wins 🤖";
    return statusText.innerText = currentPlayer === "X" ? "Your Turn" : "AI Thinking...";
  }

  const data = window.currentRoomData;
  if (!data.players.O) return statusText.innerText = "Waiting for opponent... ⏳";

  if (winner === "draw") statusText.innerText = "Draw 🤝";
  else if (winner) statusText.innerText = winner + " Wins 🎉";
  else statusText.innerText = currentPlayer + "'s Turn";
}

// 🔁 RESTART
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

// 📩 SHARE
function shareGame() {
  const link = window.location.origin + window.location.pathname + "?room=" + roomId;
  tg.openTelegramLink("https://t.me/share/url?url=" + encodeURIComponent(link));
}

// 💬 SEND MESSAGE
function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  const msg = {
    user: user.username || user.first_name,
    text: text,
    time: Date.now()
  };

  db.ref(`rooms/${roomId}/messages`).push(msg);
  chatInput.value = "";
}

// 💬 TOAST
function showMessage(text) {
  const msg = document.getElementById("toast");
  msg.innerText = text;
  msg.style.display = "block";
  setTimeout(() => msg.style.display = "none", 2000);
}

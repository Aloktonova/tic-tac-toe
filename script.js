// 📱 Telegram
const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe?.user;
const userId = user?.id;

const userInfo = document.getElementById("userInfo");

if (user) {
  userInfo.innerText = "Player: " + (user.username || user.first_name);
}

// 🔥 Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB-voWV6lb7JK_gSs_XyzHqpWD78PcMBZk",
  authDomain: "tic-tac-toe-a19ae.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-a19ae-default-rtdb.firebaseio.com",
  projectId: "tic-tac-toe-a19ae"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const boardDiv = document.getElementById("board");
const statusText = document.getElementById("statusText");

let board = ["","","","","","","","",""];
let currentPlayer = "X";
let winner = null;
let winningCells = [];

// 🔗 Room system
const params = new URLSearchParams(window.location.search);
let roomId = params.get("room");

// 🎮 Create new room
if (!roomId) {
  roomId = Math.random().toString(36).substr(2, 6);

  db.ref("rooms/" + roomId).set({
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

  const gameLink = window.location.origin + window.location.pathname + "?room=" + roomId;

  navigator.clipboard.writeText(gameLink);
  setTimeout(() => shareGame(), 500);
}

// 👥 Join as player O
const roomRef = db.ref("rooms/" + roomId);

roomRef.once("value", snapshot => {
  const data = snapshot.val();

  if (!data.players.O && data.players.X.id !== userId) {
    roomRef.update({
      "players/O": {
        id: userId,
        name: user.username || user.first_name
      }
    });
  }
});

// 👀 Listen updates
roomRef.on("value", snapshot => {
  const data = snapshot.val();
  if (!data) return;

  window.currentRoomData = data;

  board = data.board;
  currentPlayer = data.turn;
  winner = data.winner;
  winningCells = data.winningCells || [];

  updateStatus();
  renderBoard();
});

// 🎯 Check winner
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

  if (board.every(cell => cell !== "")) {
    return { winner: "draw", cells: [] };
  }

  return null;
}

// 🎮 Render board
function renderBoard() {
  boardDiv.innerHTML = "";

  board.forEach((cell, index) => {
    const btn = document.createElement("button");
    btn.classList.add("cell");
    btn.innerText = cell;

    // 🎨 Highlight winning cells
    if (winningCells.includes(index)) {
      btn.style.background = "#22c55e";
    }

    btn.onclick = () => makeMove(index);

    boardDiv.appendChild(btn);
  });
}

// 🔒 Get player symbol
function getPlayerSymbol() {
  const data = window.currentRoomData;
  if (!data) return null;

  if (data.players.X?.id === userId) return "X";
  if (data.players.O?.id === userId) return "O";

  return null;
}

// ✍️ Move logic
function makeMove(index) {
  if (board[index] !== "" || winner) return;

  const playerSymbol = getPlayerSymbol();

  if (!playerSymbol) {
    showMessage("You are a spectator 👀");
    return;
  }

  if (currentPlayer !== playerSymbol) {
    showMessage("Not your turn ⏳");
    return;
  }

  board[index] = currentPlayer;

  const result = checkWinner(board);

  if (result) {
    roomRef.update({
      board: board,
      winner: result.winner,
      winningCells: result.cells,
      turn: null
    });
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    roomRef.update({
      board: board,
      turn: currentPlayer
    });
  }
}

// 📊 Status text
function updateStatus() {
  if (winner === "draw") {
    statusText.innerText = "Draw 🤝";
  } else if (winner) {
    statusText.innerText = winner + " Wins 🎉";
  } else {
    statusText.innerText = currentPlayer + "'s Turn";
  }
}

// 🔁 Restart game
function restartGame() {
  roomRef.update({
    board: ["","","","","","","","",""],
    turn: "X",
    winner: null,
    winningCells: []
  });
}

// 📩 Share via Telegram
function shareGame() {
  const gameLink = window.location.origin + window.location.pathname + "?room=" + roomId;

  tg.openTelegramLink(
    "https://t.me/share/url?url=" + encodeURIComponent(gameLink)
  );
}

// 💬 Toast message
function showMessage(text) {
  let msg = document.getElementById("toast");

  if (!msg) {
    msg = document.createElement("div");
    msg.id = "toast";
    msg.style.position = "fixed";
    msg.style.bottom = "20px";
    msg.style.left = "50%";
    msg.style.transform = "translateX(-50%)";
    msg.style.background = "#333";
    msg.style.color = "#fff";
    msg.style.padding = "10px 20px";
    msg.style.borderRadius = "10px";
    document.body.appendChild(msg);
  }

  msg.innerText = text;
  msg.style.display = "block";

  setTimeout(() => {
    msg.style.display = "none";
  }, 2000);
}

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

let board = ["","","","","","","","",""];
let currentPlayer = "X";

// 🔗 Room system
const params = new URLSearchParams(window.location.search);
let roomId = params.get("room");

if (!roomId) {
  roomId = Math.random().toString(36).substr(2, 6);

  db.ref("rooms/" + roomId).set({
    board: ["","","","","","","","",""],
    turn: "X",
    players: {
      X: userId,
      O: null
    }
  });

  alert("Share this link:\n" + window.location.href + "?room=" + roomId);
}

// 👥 Join as player O
const roomRef = db.ref("rooms/" + roomId);

roomRef.once("value", snapshot => {
  const data = snapshot.val();

  if (data.players.O === null && userId !== data.players.X) {
    roomRef.update({
      "players/O": userId
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

  renderBoard();
});

// 🎮 Render board
function renderBoard() {
  boardDiv.innerHTML = "";

  board.forEach((cell, index) => {
    const btn = document.createElement("button");
    btn.classList.add("cell");
    btn.innerText = cell;

    btn.onclick = () => makeMove(index);

    boardDiv.appendChild(btn);
  });
}

// 🔒 Get player symbol
function getPlayerSymbol() {
  const data = window.currentRoomData;
  if (!data) return null;

  if (data.players.X === userId) return "X";
  if (data.players.O === userId) return "O";

  return null;
}

// ✍️ Move logic
function makeMove(index) {
  if (board[index] !== "") return;

  const playerSymbol = getPlayerSymbol();

  if (!playerSymbol) {
    alert("You are a spectator!");
    return;
  }

  if (currentPlayer !== playerSymbol) {
    alert("Not your turn!");
    return;
  }

  board[index] = currentPlayer;
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  roomRef.update({
    board: board,
    turn: currentPlayer
  });
}

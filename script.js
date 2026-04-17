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

// Room system
const params = new URLSearchParams(window.location.search);
let roomId = params.get("room");

if (!roomId) {
  roomId = Math.random().toString(36).substr(2, 6);

  db.ref("rooms/" + roomId).set({
    board: ["","","","","","","","",""],
    turn: "X"
  });

  alert("Share this link:\n" + window.location.href + "?room=" + roomId);
}

// Listen for updates
db.ref("rooms/" + roomId).on("value", snapshot => {
  const data = snapshot.val();
  if (!data) return;

  board = data.board;
  currentPlayer = data.turn;

  renderBoard();
});

// Render board
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

// Make move
function makeMove(index) {
  if (board[index] !== "") return;

  board[index] = currentPlayer;
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  db.ref("rooms/" + roomId).update({
    board: board,
    turn: currentPlayer
  });
}

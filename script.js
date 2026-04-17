console.log("Game loaded");

const boardDiv = document.getElementById("board");

let board = ["","","","","","","","",""];
let currentPlayer = "X";

// create board UI
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

function makeMove(index) {
  if (board[index] !== "") return;

  board[index] = currentPlayer;
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  renderBoard();
}

renderBoard();

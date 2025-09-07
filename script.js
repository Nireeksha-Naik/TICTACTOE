const boardEl = document.getElementById("board");
const turnStatusEl = document.getElementById("turnStatus");
const gameStatusEl = document.getElementById("gameStatus");
const xWinsEl = document.getElementById("xWins");
const oWinsEl = document.getElementById("oWins");
const drawsEl = document.getElementById("draws");
const modeEl = document.getElementById("mode");

let board = Array(9).fill(null);
let currentPlayer = "x";
let scores = JSON.parse(localStorage.getItem("scores")) || { x: 0, o: 0, d: 0 };
updateScores();

function renderBoard() {
  boardEl.innerHTML = "";
  board.forEach((val, i) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    if (val) cell.classList.add(val);
    cell.textContent = val ? val.toUpperCase() : "";
    cell.addEventListener("click", () => makeMove(i));
    boardEl.appendChild(cell);
  });
}
renderBoard();

function makeMove(i) {
  if (board[i] || checkWinner(board)) return;
  board[i] = currentPlayer;
  currentPlayer = currentPlayer === "x" ? "o" : "x";
  renderBoard();
  checkGameEnd();
}

function checkWinner(b) {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let combo of combos) {
    const [a,b1,c] = combo;
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) return combo;
  }
  return null;
}

function checkGameEnd() {
  const winCombo = checkWinner(board);
  if (winCombo) {
    winCombo.forEach(i => boardEl.children[i].classList.add("win"));
    const winner = board[winCombo[0]];
    gameStatusEl.textContent = `${winner.toUpperCase()} Wins!`;
    scores[winner]++; updateScores();
    launchConfetti();
    return;
  }
  if (!board.includes(null)) {
    gameStatusEl.textContent = "Draw!";
    scores.d++; updateScores();
  } else {
    turnStatusEl.textContent = `${currentPlayer.toUpperCase()}'s turn`;
  }
}

function updateScores() {
  xWinsEl.textContent = scores.x;
  oWinsEl.textContent = scores.o;
  drawsEl.textContent = scores.d;
  localStorage.setItem("scores", JSON.stringify(scores));
}

document.getElementById("newRound").addEventListener("click", () => {
  board = Array(9).fill(null);
  currentPlayer = "x";
  gameStatusEl.textContent = "";
  renderBoard();
  turnStatusEl.textContent = "X's turn";
});

document.getElementById("resetScores").addEventListener("click", () => {
  scores = { x: 0, o: 0, d: 0 };
  updateScores();
});

// 🎉 Confetti
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti() {
  particles = Array.from({length:150}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    r: Math.random() * 6 + 4,
    d: Math.random() * 10 + 10,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    tilt: Math.random() * 10,
    tiltAngle: Math.random() * Math.PI
  }));
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();
    p.y += p.d * 0.5;
    p.x += Math.sin(p.tiltAngle) * 2;
    p.tiltAngle += 0.05;
  });
  particles = particles.filter(p => p.y < canvas.height + 20);
  if (particles.length) requestAnimationFrame(animateConfetti);
}

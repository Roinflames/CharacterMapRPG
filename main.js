const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const TILE = 32;
const MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const player = { x: 1, y: 1, won: false };

function canMove(nextX, nextY) {
  if (nextY < 0 || nextY >= MAP.length) return false;
  if (nextX < 0 || nextX >= MAP[0].length) return false;
  return MAP[nextY][nextX] !== 1;
}

function move(dx, dy) {
  if (player.won) return;

  const nextX = player.x + dx;
  const nextY = player.y + dy;

  if (!canMove(nextX, nextY)) return;

  player.x = nextX;
  player.y = nextY;

  if (MAP[player.y][player.x] === 2) {
    player.won = true;
  }
}

function drawTile(tile, x, y) {
  const px = x * TILE;
  const py = y * TILE;

  if (tile === 1) {
    ctx.fillStyle = "#1e2e3a";
  } else {
    ctx.fillStyle = (x + y) % 2 === 0 ? "#2a4f62" : "#315f76";
  }

  ctx.fillRect(px, py, TILE, TILE);

  if (tile === 2) {
    ctx.fillStyle = "#ffd166";
    ctx.beginPath();
    ctx.arc(px + TILE / 2, py + TILE / 2, TILE / 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPlayer() {
  const px = player.x * TILE + TILE / 2;
  const py = player.y * TILE + TILE / 2;

  ctx.fillStyle = "#ef476f";
  ctx.beginPath();
  ctx.arc(px, py, TILE / 2.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(px - 5, py - 4, 3, 0, Math.PI * 2);
  ctx.arc(px + 5, py - 4, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawWinMessage() {
  if (!player.won) return;

  ctx.fillStyle = "rgba(11, 29, 38, 0.8)";
  ctx.fillRect(0, canvas.height / 2 - 36, canvas.width, 72);

  ctx.fillStyle = "#ffd166";
  ctx.font = "700 28px 'Trebuchet MS', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Meta alcanzada", canvas.width / 2, canvas.height / 2 + 10);
}

function render() {
  for (let y = 0; y < MAP.length; y += 1) {
    for (let x = 0; x < MAP[y].length; x += 1) {
      drawTile(MAP[y][x], x, y);
    }
  }

  drawPlayer();
  drawWinMessage();
  requestAnimationFrame(render);
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (key === "arrowup" || key === "w") move(0, -1);
  if (key === "arrowdown" || key === "s") move(0, 1);
  if (key === "arrowleft" || key === "a") move(-1, 0);
  if (key === "arrowright" || key === "d") move(1, 0);

  if (key === "r") {
    player.x = 1;
    player.y = 1;
    player.won = false;
  }
});

document.querySelectorAll("button[data-dir]").forEach((button) => {
  button.addEventListener("click", () => {
    const dir = button.getAttribute("data-dir");
    if (dir === "up") move(0, -1);
    if (dir === "down") move(0, 1);
    if (dir === "left") move(-1, 0);
    if (dir === "right") move(1, 0);
  });
});

render();

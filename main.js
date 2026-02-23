const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const statusElement = document.getElementById("milestones-status");
const messageElement = document.getElementById("milestone-message");
const routeSelect = document.getElementById("route-select");
const encounterPanel = document.getElementById("encounter-panel");
const enemyNameElement = document.getElementById("enemy-name");
const combatStatsElement = document.getElementById("combat-stats");
const battleLogElement = document.getElementById("battle-log");
const attackButton = document.getElementById("attack-btn");
const healButton = document.getElementById("heal-btn");

const TILE = 32;

const ROUTES = {
  route1: {
    label: "Ruta 1",
    start: { x: 1, y: 1 },
    map: [
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
    ],
    milestones: [
      { id: "r1m1", x: 4, y: 1, enemy: "Lobo Sombrio", hp: 12, completed: false },
      { id: "r1m2", x: 8, y: 5, enemy: "Bandido del Valle", hp: 14, completed: false },
      { id: "r1m3", x: 13, y: 7, enemy: "Guardian de Piedra", hp: 16, completed: false },
      { id: "r1m4", x: 17, y: 9, enemy: "Capitan del Portal", hp: 18, completed: false },
    ],
  },
  route2: {
    label: "Ruta 2",
    start: { x: 1, y: 9 },
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    milestones: [
      { id: "r2m1", x: 3, y: 9, enemy: "Bruja del Pantano", hp: 13, completed: false },
      { id: "r2m2", x: 7, y: 6, enemy: "Caballero Perdido", hp: 15, completed: false },
      { id: "r2m3", x: 11, y: 5, enemy: "Bestia de Ceniza", hp: 17, completed: false },
      { id: "r2m4", x: 15, y: 3, enemy: "Arquero del Eclipse", hp: 18, completed: false },
      { id: "r2m5", x: 17, y: 1, enemy: "Dragon Menor", hp: 20, completed: false },
    ],
  },
};

const player = { x: 1, y: 1, hp: 24, maxHp: 24, won: false };
const state = {
  activeEncounter: null,
  routeId: "route1",
  route: ROUTES.route1,
};

function resetRun(customMessage) {
  const route = state.route;
  player.x = route.start.x;
  player.y = route.start.y;
  player.hp = player.maxHp;
  player.won = false;
  state.activeEncounter = null;

  route.milestones.forEach((milestone) => {
    milestone.completed = false;
  });

  encounterPanel.classList.add("hidden");
  messageElement.textContent = customMessage || `Reinicio en ${route.label}.`;
  updateStatus();
}

function switchRoute(routeId) {
  state.routeId = routeId;
  state.route = ROUTES[routeId];
  resetRun(`Entraste en ${state.route.label}.`);
}

function canMove(nextX, nextY) {
  const map = state.route.map;
  if (nextY < 0 || nextY >= map.length) return false;
  if (nextX < 0 || nextX >= map[0].length) return false;
  return map[nextY][nextX] !== 1;
}

function getMilestoneAt(x, y) {
  return state.route.milestones.find((milestone) => milestone.x === x && milestone.y === y);
}

function updateStatus() {
  const completed = state.route.milestones.filter((milestone) => milestone.completed).length;
  statusElement.textContent = `${state.route.label} | Hitos: ${completed}/${state.route.milestones.length} | HP: ${player.hp}/${player.maxHp}`;
}

function updateCombatStats() {
  if (!state.activeEncounter) return;
  combatStatsElement.textContent = `HP jugador: ${player.hp}/${player.maxHp} | HP enemigo: ${state.activeEncounter.hp}`;
}

function endEncounterWithVictory() {
  const milestone = state.activeEncounter.milestone;
  milestone.completed = true;
  state.activeEncounter = null;
  encounterPanel.classList.add("hidden");
  messageElement.textContent = `Hito superado: ${milestone.enemy}`;
  updateStatus();
}

function enemyTurn() {
  if (!state.activeEncounter) return;

  const damage = Math.floor(Math.random() * 4) + 2;
  player.hp = Math.max(0, player.hp - damage);

  if (player.hp <= 0) {
    battleLogElement.textContent = `Recibiste ${damage}. Has caido.`;
    resetRun(`Derrota en ${state.route.label}.`);
    return;
  }

  battleLogElement.textContent = `El enemigo contraataca y hace ${damage} de dano.`;
  updateCombatStats();
  updateStatus();
}

function startEncounter(milestone) {
  state.activeEncounter = {
    milestone,
    hp: milestone.hp,
  };

  encounterPanel.classList.remove("hidden");
  enemyNameElement.textContent = `Enfrentamiento: ${milestone.enemy}`;
  battleLogElement.textContent = "Tu turno: Ataca o curate.";
  updateCombatStats();
}

function tryFinishMap() {
  const map = state.route.map;
  if (map[player.y][player.x] !== 2) return;

  const completedAll = state.route.milestones.every((milestone) => milestone.completed);

  if (completedAll) {
    player.won = true;
    messageElement.textContent = `Victoria total en ${state.route.label}.`;
    return;
  }

  messageElement.textContent = "La meta final esta sellada. Completa todos los hitos.";
}

function move(dx, dy) {
  if (player.won || state.activeEncounter) return;

  const nextX = player.x + dx;
  const nextY = player.y + dy;

  if (!canMove(nextX, nextY)) return;

  player.x = nextX;
  player.y = nextY;

  const milestone = getMilestoneAt(player.x, player.y);
  if (milestone && !milestone.completed) {
    messageElement.textContent = `Hito detectado: ${milestone.enemy}`;
    startEncounter(milestone);
  }

  tryFinishMap();
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

function drawMilestones() {
  state.route.milestones.forEach((milestone) => {
    const px = milestone.x * TILE;
    const py = milestone.y * TILE;

    ctx.fillStyle = milestone.completed ? "#54d38a" : "#ff5a5f";
    ctx.beginPath();
    ctx.moveTo(px + TILE / 2, py + 6);
    ctx.lineTo(px + TILE - 6, py + TILE / 2);
    ctx.lineTo(px + TILE / 2, py + TILE - 6);
    ctx.lineTo(px + 6, py + TILE / 2);
    ctx.closePath();
    ctx.fill();
  });
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

  ctx.fillStyle = "rgba(11, 29, 38, 0.85)";
  ctx.fillRect(0, canvas.height / 2 - 36, canvas.width, 72);

  ctx.fillStyle = "#ffd166";
  ctx.font = "700 28px 'Trebuchet MS', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Ruta completada", canvas.width / 2, canvas.height / 2 + 10);
}

function render() {
  const map = state.route.map;
  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      drawTile(map[y][x], x, y);
    }
  }

  drawMilestones();
  drawPlayer();
  drawWinMessage();
  requestAnimationFrame(render);
}

attackButton.addEventListener("click", () => {
  if (!state.activeEncounter) return;

  const damage = Math.floor(Math.random() * 5) + 4;
  state.activeEncounter.hp = Math.max(0, state.activeEncounter.hp - damage);

  if (state.activeEncounter.hp <= 0) {
    battleLogElement.textContent = `Golpe de ${damage}. Enemigo derrotado.`;
    endEncounterWithVictory();
    return;
  }

  battleLogElement.textContent = `Golpe de ${damage}. El enemigo sigue en pie.`;
  updateCombatStats();
  enemyTurn();
});

healButton.addEventListener("click", () => {
  if (!state.activeEncounter) return;

  const heal = Math.floor(Math.random() * 4) + 3;
  player.hp = Math.min(player.maxHp, player.hp + heal);
  battleLogElement.textContent = `Te curas ${heal} puntos.`;
  updateCombatStats();
  updateStatus();
  enemyTurn();
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (key === "arrowup" || key === "w") move(0, -1);
  if (key === "arrowdown" || key === "s") move(0, 1);
  if (key === "arrowleft" || key === "a") move(-1, 0);
  if (key === "arrowright" || key === "d") move(1, 0);

  if (key === "r") resetRun(`Reinicio manual en ${state.route.label}.`);
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

routeSelect.addEventListener("change", () => {
  switchRoute(routeSelect.value);
});

switchRoute(routeSelect.value);
render();

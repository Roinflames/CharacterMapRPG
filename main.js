const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const statusElement = document.getElementById("milestones-status");
const messageElement = document.getElementById("milestone-message");
const routeSelect = document.getElementById("route-select");
const characterStatsElement = document.getElementById("character-stats");
const characterBonusElement = document.getElementById("character-bonus");
const partyListElement = document.getElementById("party-list");
const recruitListElement = document.getElementById("recruit-list");
const combatBackdrop = document.getElementById("combat-backdrop");
const combatSceneImageElement = document.getElementById("combat-scene-image");
const encounterPanel = document.getElementById("encounter-panel");
const enemyImageElement = document.getElementById("enemy-image");
const enemyNameElement = document.getElementById("enemy-name");
const combatStatsElement = document.getElementById("combat-stats");
const battleLogElement = document.getElementById("battle-log");
const inventoryListElement = document.getElementById("inventory-list");
const attackButton = document.getElementById("attack-btn");
const healButton = document.getElementById("heal-btn");

const TILE = 32;
const MAX_PARTY_SIZE = 3;

const ITEM_DEFS = {
  potion: { name: "Pocion", effect: "Recupera 8 HP" },
  bomb: { name: "Bomba", effect: "Hace 9 dano al enemigo" },
  elixir: { name: "Elixir", effect: "Sube HP maximo +2 y cura 5" },
};

const LOOT_TABLE = ["potion", "potion", "bomb", "elixir"];
const COMBAT_SCENE_ASSET = "assets/combat/arena.svg";
const ENEMY_ASSETS = {
  "Lobo Sombrio": "assets/enemies/lobo-sombrio.svg",
  "Bandido del Valle": "assets/enemies/bandido-del-valle.svg",
  "Guardian de Piedra": "assets/enemies/guardian-de-piedra.svg",
  "Capitan del Portal": "assets/enemies/capitan-del-portal.svg",
  "Bruja del Pantano": "assets/enemies/bruja-del-pantano.svg",
  "Caballero Perdido": "assets/enemies/caballero-perdido.svg",
  "Bestia de Ceniza": "assets/enemies/bestia-de-ceniza.svg",
  "Arquero del Eclipse": "assets/enemies/arquero-del-eclipse.svg",
  "Dragon Menor": "assets/enemies/dragon-menor.svg",
};

const COMPANIONS = [
  { id: "tank", name: "Bran Escudo", atk: 1, def: 1, hp: 4 },
  { id: "rogue", name: "Lyra Veloz", atk: 2, def: 0, hp: 0 },
  { id: "sage", name: "Nora Savia", atk: 0, def: 1, hp: 3 },
  { id: "hunter", name: "Kael Cazador", atk: 1, def: 0, hp: 2 },
];

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

const player = {
  x: 1,
  y: 1,
  hp: 24,
  baseMaxHp: 24,
  level: 1,
  exp: 0,
  nextExp: 20,
  baseAtk: 4,
  baseDef: 1,
  won: false,
};

const state = {
  activeEncounter: null,
  routeId: "route1",
  route: ROUTES.route1,
  inventory: [],
  nextItemId: 1,
  party: [],
};

function setCombatModalOpen(isOpen) {
  encounterPanel.classList.toggle("hidden", !isOpen);
  combatBackdrop.classList.toggle("hidden", !isOpen);
}

function getPartyBonus() {
  return state.party.reduce(
    (acc, member) => {
      acc.atk += member.atk;
      acc.def += member.def;
      acc.hp += member.hp;
      return acc;
    },
    { atk: 0, def: 0, hp: 0 },
  );
}

function getMaxHp() {
  return player.baseMaxHp + getPartyBonus().hp;
}

function getTotalItems() {
  return state.inventory.reduce((sum, item) => sum + item.qty, 0);
}

function getPlayerAtk() {
  return player.baseAtk + getPartyBonus().atk;
}

function getPlayerDef() {
  return player.baseDef + getPartyBonus().def;
}

function findItem(type) {
  return state.inventory.find((item) => item.type === type);
}

function addItem(type, qty = 1) {
  const existing = findItem(type);
  if (existing) {
    existing.qty += qty;
  } else {
    state.inventory.push({ id: state.nextItemId++, type, qty });
  }
  renderInventory();
}

function removeItem(itemId, qty = 1) {
  const item = state.inventory.find((entry) => entry.id === itemId);
  if (!item) return false;

  item.qty -= qty;
  if (item.qty <= 0) {
    state.inventory = state.inventory.filter((entry) => entry.id !== itemId);
  }

  renderInventory();
  return true;
}

function renderInventory() {
  if (state.inventory.length === 0) {
    inventoryListElement.innerHTML = '<li class="inventory-empty">Sin items todavia.</li>';
    updateStatus();
    return;
  }

  inventoryListElement.innerHTML = state.inventory
    .map((item) => {
      const def = ITEM_DEFS[item.type];
      return `
        <li class="inventory-item">
          <div>
            <strong>${def.name}</strong> x${item.qty}
            <p>${def.effect}</p>
          </div>
          <div class="inventory-actions">
            <button data-action="use" data-item-id="${item.id}" type="button">Usar</button>
            <button data-action="drop" data-item-id="${item.id}" type="button">Descartar</button>
          </div>
        </li>
      `;
    })
    .join("");

  updateStatus();
}

function renderParty() {
  if (state.party.length === 0) {
    partyListElement.innerHTML = '<li class="inventory-empty">No tienes aliados activos.</li>';
  } else {
    partyListElement.innerHTML = state.party
      .map(
        (member) => `
          <li>
            <span>${member.name} (+${member.atk} ATQ, +${member.def} DEF, +${member.hp} HP)</span>
            <div class="party-actions">
              <button data-party-action="remove" data-member-id="${member.id}" type="button">Quitar</button>
            </div>
          </li>
        `,
      )
      .join("");
  }

  const recruits = COMPANIONS.filter((member) => !state.party.some((ally) => ally.id === member.id));
  if (recruits.length === 0) {
    recruitListElement.innerHTML = '<li class="inventory-empty">Todos los reclutas ya estan en equipo.</li>';
  } else {
    recruitListElement.innerHTML = recruits
      .map(
        (member) => `
          <li>
            <span>${member.name} (+${member.atk} ATQ, +${member.def} DEF, +${member.hp} HP)</span>
            <div class="party-actions">
              <button data-party-action="add" data-member-id="${member.id}" type="button">Reclutar</button>
            </div>
          </li>
        `,
      )
      .join("");
  }

  const maxHp = getMaxHp();
  if (player.hp > maxHp) player.hp = maxHp;
  updateStatsPanel();
  updateStatus();
}

function updateStatsPanel() {
  const maxHp = getMaxHp();
  const bonus = getPartyBonus();
  characterStatsElement.textContent = `Nivel ${player.level} | EXP ${player.exp}/${player.nextExp} | HP ${player.hp}/${maxHp} | ATQ ${getPlayerAtk()} | DEF ${getPlayerDef()}`;
  characterBonusElement.textContent = `Bonos de equipo: +${bonus.atk} ATQ, +${bonus.def} DEF, +${bonus.hp} HP.`;
}

function addPartyMember(memberId) {
  if (state.party.length >= MAX_PARTY_SIZE) {
    messageElement.textContent = "Tu equipo ya esta completo (max 3).";
    return;
  }

  const candidate = COMPANIONS.find((member) => member.id === memberId);
  if (!candidate) return;
  if (state.party.some((member) => member.id === candidate.id)) return;

  state.party.push(candidate);
  messageElement.textContent = `${candidate.name} se unio al equipo.`;
  renderParty();
}

function removePartyMember(memberId) {
  const existing = state.party.find((member) => member.id === memberId);
  if (!existing) return;

  state.party = state.party.filter((member) => member.id !== memberId);
  messageElement.textContent = `${existing.name} salio del equipo.`;
  renderParty();
}

function gainExp(amount) {
  player.exp += amount;
  let leveled = false;

  while (player.exp >= player.nextExp) {
    player.exp -= player.nextExp;
    player.level += 1;
    player.nextExp = Math.floor(player.nextExp * 1.35);
    player.baseMaxHp += 3;
    player.baseAtk += 1;
    player.baseDef += 1;
    player.hp = Math.min(getMaxHp(), player.hp + 4);
    leveled = true;
  }

  if (leveled) {
    messageElement.textContent = `Subiste a nivel ${player.level}.`;
  }

  updateStatsPanel();
  updateStatus();
}

function resetRun(customMessage) {
  const route = state.route;
  player.x = route.start.x;
  player.y = route.start.y;
  player.hp = getMaxHp();
  player.won = false;
  state.activeEncounter = null;

  route.milestones.forEach((milestone) => {
    milestone.completed = false;
  });

  setCombatModalOpen(false);
  messageElement.textContent = customMessage || `Reinicio en ${route.label}.`;
  updateStatsPanel();
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
  statusElement.textContent = `${state.route.label} | Hitos: ${completed}/${state.route.milestones.length} | Nivel: ${player.level} | Items: ${getTotalItems()}`;
}

function updateCombatStats() {
  if (!state.activeEncounter) return;
  combatStatsElement.textContent = `HP jugador: ${player.hp}/${getMaxHp()} | HP enemigo: ${state.activeEncounter.hp}`;
}

function rollLoot() {
  const lootType = LOOT_TABLE[Math.floor(Math.random() * LOOT_TABLE.length)];
  addItem(lootType, 1);
  return ITEM_DEFS[lootType].name;
}

function endEncounterWithVictory() {
  const milestone = state.activeEncounter.milestone;
  const earnedExp = milestone.hp + 6;
  milestone.completed = true;
  state.activeEncounter = null;
  setCombatModalOpen(false);

  const lootName = rollLoot();
  gainExp(earnedExp);
  messageElement.textContent = `Hito superado: ${milestone.enemy}. +${earnedExp} EXP, loot: ${lootName}.`;
  updateStatus();
}

function enemyTurn() {
  if (!state.activeEncounter) return;

  const rawDamage = Math.floor(Math.random() * 4) + 2;
  const reducedDamage = Math.max(1, rawDamage - getPlayerDef());
  player.hp = Math.max(0, player.hp - reducedDamage);

  if (player.hp <= 0) {
    battleLogElement.textContent = `Recibiste ${reducedDamage}. Has caido.`;
    resetRun(`Derrota en ${state.route.label}.`);
    return;
  }

  battleLogElement.textContent = `El enemigo contraataca y hace ${reducedDamage} de dano.`;
  updateCombatStats();
  updateStatsPanel();
  updateStatus();
}

function startEncounter(milestone) {
  state.activeEncounter = {
    milestone,
    hp: milestone.hp,
  };

  combatSceneImageElement.src = COMBAT_SCENE_ASSET;
  enemyImageElement.src = ENEMY_ASSETS[milestone.enemy] || COMBAT_SCENE_ASSET;
  enemyImageElement.alt = `Retrato de ${milestone.enemy}`;
  setCombatModalOpen(true);
  enemyNameElement.textContent = `Enfrentamiento: ${milestone.enemy}`;
  battleLogElement.textContent = "Tu turno: Ataca, curate o usa un item.";
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

function applyDamageToEnemy(damage, label) {
  if (!state.activeEncounter) return;

  state.activeEncounter.hp = Math.max(0, state.activeEncounter.hp - damage);

  if (state.activeEncounter.hp <= 0) {
    battleLogElement.textContent = `${label} hace ${damage}. Enemigo derrotado.`;
    endEncounterWithVictory();
    return;
  }

  battleLogElement.textContent = `${label} hace ${damage}. El enemigo sigue en pie.`;
  updateCombatStats();
  enemyTurn();
}

function useItemById(itemId) {
  const item = state.inventory.find((entry) => entry.id === itemId);
  if (!item) return;

  if (item.type === "potion") {
    const heal = 8;
    player.hp = Math.min(getMaxHp(), player.hp + heal);
    removeItem(itemId, 1);
    messageElement.textContent = `Usaste Pocion (+${heal} HP).`;
    if (state.activeEncounter) {
      battleLogElement.textContent = `Usaste Pocion y recuperaste ${heal} HP.`;
      updateCombatStats();
      enemyTurn();
    }
    updateStatsPanel();
    updateStatus();
    return;
  }

  if (item.type === "elixir") {
    player.baseMaxHp += 2;
    player.hp = Math.min(getMaxHp(), player.hp + 5);
    removeItem(itemId, 1);
    messageElement.textContent = "Usaste Elixir (+2 HP base, +5 HP).";
    if (state.activeEncounter) {
      battleLogElement.textContent = "Elixir activado. El enemigo toma su turno.";
      updateCombatStats();
      enemyTurn();
    }
    updateStatsPanel();
    updateStatus();
    return;
  }

  if (item.type === "bomb") {
    if (!state.activeEncounter) {
      messageElement.textContent = "La Bomba solo se puede usar en combate.";
      return;
    }

    removeItem(itemId, 1);
    applyDamageToEnemy(9, "Bomba");
  }
}

function dropItemById(itemId) {
  const item = state.inventory.find((entry) => entry.id === itemId);
  if (!item) return;

  const itemName = ITEM_DEFS[item.type].name;
  removeItem(itemId, 1);
  messageElement.textContent = `Descartaste 1 ${itemName}.`;
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

  const minDamage = getPlayerAtk();
  const damage = minDamage + Math.floor(Math.random() * 4);
  applyDamageToEnemy(damage, "Ataque");
});

healButton.addEventListener("click", () => {
  if (!state.activeEncounter) return;

  const heal = Math.floor(Math.random() * 4) + 3;
  player.hp = Math.min(getMaxHp(), player.hp + heal);
  battleLogElement.textContent = `Te curas ${heal} puntos.`;
  updateCombatStats();
  updateStatsPanel();
  updateStatus();
  enemyTurn();
});

inventoryListElement.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const action = target.getAttribute("data-action");
  const itemId = Number(target.getAttribute("data-item-id"));
  if (!itemId) return;

  if (action === "use") useItemById(itemId);
  if (action === "drop") dropItemById(itemId);
});

partyListElement.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const action = target.getAttribute("data-party-action");
  const memberId = target.getAttribute("data-member-id");
  if (!memberId) return;

  if (action === "remove") removePartyMember(memberId);
});

recruitListElement.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const action = target.getAttribute("data-party-action");
  const memberId = target.getAttribute("data-member-id");
  if (!memberId) return;

  if (action === "add") addPartyMember(memberId);
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

renderInventory();
renderParty();
switchRoute(routeSelect.value);
render();

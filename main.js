const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const statusElement = document.getElementById("milestones-status");
const messageElement = document.getElementById("milestone-message");
const storyLineElement = document.getElementById("story-line");
const routeSelect = document.getElementById("route-select");
const progressRouteElement = document.getElementById("progress-route");
const progressTotalElement = document.getElementById("progress-total");
const progressEtaElement = document.getElementById("progress-eta");
const progressNextElement = document.getElementById("progress-next");
const heroAliasElement = document.getElementById("hero-alias");
const weaponSelectElement = document.getElementById("weapon-select");
const armorSelectElement = document.getElementById("armor-select");
const characterStatsElement = document.getElementById("character-stats");
const characterBonusElement = document.getElementById("character-bonus");
const partyListElement = document.getElementById("party-list");
const recruitListElement = document.getElementById("recruit-list");
const summonEssenceElement = document.getElementById("summon-essence");
const summonListElement = document.getElementById("summon-list");
const combatHistoryElement = document.getElementById("combat-history");
const combatBackdrop = document.getElementById("combat-backdrop");
const combatSceneBackElement = document.getElementById("combat-scene-back");
const combatSceneFrontElement = document.getElementById("combat-scene-front");
const encounterPanel = document.getElementById("encounter-panel");
const enemyImageElement = document.getElementById("enemy-image");
const enemyNameElement = document.getElementById("enemy-name");
const combatStatsElement = document.getElementById("combat-stats");
const diceRollElement = document.getElementById("dice-roll");
const turnIndicatorElement = document.getElementById("turn-indicator");
const battleLogElement = document.getElementById("battle-log");
const inventoryListElement = document.getElementById("inventory-list");
const attackButton = document.getElementById("attack-btn");
const healButton = document.getElementById("heal-btn");
const escapeButton = document.getElementById("escape-btn");
const fullscreenButton = document.getElementById("fullscreen-btn");

const TILE = 32;
const MAX_PARTY_SIZE = 3;
const MAIN_HERO = {
  publicName: "Jisuo Tenma",
  hiddenLoreName: "Jesus",
  title: "Portador de la Luz",
};

const ITEM_DEFS = {
  potion: { name: "Pocion", effect: "Recupera 8 HP" },
  bomb: { name: "Bomba", effect: "Hace 9 dano al enemigo" },
  elixir: { name: "Elixir", effect: "Sube HP maximo +2 y cura 5" },
};

const WEAPONS = [
  { id: "none", name: "Sin arma", atk: 0, def: 0, hp: 0 },
  { id: "blade_light", name: "Katana de Luz", atk: 3, def: 0, hp: 0 },
  { id: "spear_heaven", name: "Lanza Celeste", atk: 2, def: 1, hp: 0 },
  { id: "infernal_hammer", name: "Martillo Infernal", atk: 4, def: -1, hp: 0 },
];

const ARMORS = [
  { id: "none", name: "Sin armadura", atk: 0, def: 0, hp: 0 },
  { id: "aegis_cloth", name: "Manto Aegis", atk: 0, def: 2, hp: 2 },
  { id: "dragon_plate", name: "Placas Draconicas", atk: 0, def: 3, hp: 1 },
  { id: "shadow_mail", name: "Cota Umbria", atk: 1, def: 1, hp: 0 },
];

const LOOT_TABLE = ["potion", "potion", "bomb", "elixir"];
const ROUTE_ORDER = ["route1", "route2"];
const COMBAT_SCENE_ASSET = "assets/combat/arena.svg";
const ENEMY_PORTRAIT_CACHE = new Map();
const ENEMY_ASSETS = {
  "Lobo Sombrio": "assets/enemies/lobo-sombrio.webp",
  "Bandido del Valle": "assets/enemies/bandido-del-valle.webp",
  "Guardian de Piedra": "assets/enemies/guardian-de-piedra.webp",
  "Capitan del Portal": "assets/enemies/capitan-del-portal.webp",
  "Bruja del Pantano": "assets/enemies/bruja-del-pantano.webp",
  "Caballero Perdido": "assets/enemies/caballero-perdido.webp",
  "Bestia de Ceniza": "assets/enemies/bestia-de-ceniza.webp",
  "Arquero del Eclipse": "assets/enemies/arquero-del-eclipse.webp",
  "Dragon Menor": "assets/enemies/dragon-menor.webp",
};

const RACES = {
  humano: { label: "Humano", color: "#f59e0b", style: "fisico", faction: "cielo" },
  elfo: { label: "Elfo", color: "#10b981", style: "magico", faction: "cielo" },
  enano: { label: "Enano", color: "#ef4444", style: "fisico", faction: "cielo" },
  orco: { label: "Orco", color: "#84cc16", style: "fisico", faction: "infierno" },
  draconico: { label: "Draconico", color: "#f97316", style: "magico", faction: "infierno" },
  umbrio: { label: "Umbrio", color: "#a855f7", style: "magico", faction: "infierno", dominateAll: true, hardToOccupy: true },
  celestial: { label: "Celestial", color: "#22d3ee", style: "magico", faction: "cielo" },
};

const COMPANIONS = [
  { id: "tank", name: "Bran Escudo", atk: 1, def: 1, hp: 4, race: "humano" },
  { id: "rogue", name: "Lyra Veloz", atk: 2, def: 0, hp: 0, race: "elfo" },
  { id: "sage", name: "Nora Savia", atk: 0, def: 1, hp: 3, race: "celestial" },
  { id: "hunter", name: "Kael Cazador", atk: 1, def: 0, hp: 2, race: "enano" },
  { id: "warlord", name: "Gorn Filo", atk: 2, def: 1, hp: 1, race: "orco" },
  { id: "flame", name: "Syr Vahn", atk: 1, def: 0, hp: 3, race: "draconico" },
  { id: "shade", name: "Mira Noctis", atk: 1, def: 1, hp: 1, race: "umbrio" },
];

const SUMMONS = [
  { id: "phoenix", name: "Fenix Rojo", race: "draconico", atk: 2, def: 0, hp: 2, level: 1 },
  { id: "warden", name: "Centinela Verde", race: "elfo", atk: 1, def: 2, hp: 1, level: 1 },
  { id: "golem", name: "Golem Escarlata", race: "enano", atk: 1, def: 2, hp: 2, level: 1 },
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
      { id: "r1m1", x: 4, y: 1, enemy: "Lobo Sombrio", race: "umbrio", hp: 12, completed: false },
      { id: "r1m2", x: 8, y: 5, enemy: "Bandido del Valle", race: "humano", hp: 14, completed: false },
      { id: "r1m3", x: 13, y: 7, enemy: "Guardian de Piedra", race: "enano", hp: 16, completed: false },
      { id: "r1m4", x: 17, y: 9, enemy: "Capitan del Portal", race: "celestial", hp: 18, completed: false },
    ],
  },
  route2: {
    label: "Ruta 2",
    start: { x: 1, y: 9 },
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    milestones: [
      { id: "r2m1", x: 3, y: 9, enemy: "Bruja del Pantano", race: "draconico", hp: 13, completed: false },
      { id: "r2m2", x: 7, y: 9, enemy: "Caballero Perdido", race: "humano", hp: 15, completed: false },
      { id: "r2m3", x: 11, y: 7, enemy: "Bestia de Ceniza", race: "orco", hp: 17, completed: false },
      { id: "r2m4", x: 15, y: 3, enemy: "Arquero del Eclipse", race: "elfo", hp: 18, completed: false },
      { id: "r2m5", x: 17, y: 1, enemy: "Dragon Menor", race: "umbrio", hp: 20, completed: false },
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
  routeState: Object.fromEntries(
    ROUTE_ORDER.map((routeId) => [
      routeId,
      { x: ROUTES[routeId].start.x, y: ROUTES[routeId].start.y, initialized: false },
    ]),
  ),
  inventory: [],
  nextItemId: 1,
  party: [],
  summons: SUMMONS.map((summon) => ({ ...summon })),
  activeSummonId: "phoenix",
  equipment: { weaponId: "none", armorId: "none" },
  summonEssence: 0,
  combatHistory: [],
  combatTurn: "player",
  combatLocked: false,
};

function setCombatModalOpen(isOpen) {
  encounterPanel.classList.toggle("hidden", !isOpen);
  combatBackdrop.classList.toggle("hidden", !isOpen);
  if (!isOpen) {
    resetSceneParallax();
    encounterPanel.removeAttribute("data-faction");
    encounterPanel.removeAttribute("data-race");
    encounterPanel.removeAttribute("data-style");
    encounterPanel.style.removeProperty("--encounter-race-color");
    encounterPanel.style.removeProperty("--encounter-faction-glow");
    encounterPanel.style.removeProperty("--enemy-portrait");
  }
}

function resetSceneParallax() {
  if (combatSceneBackElement) combatSceneBackElement.style.transform = "";
  if (combatSceneFrontElement) combatSceneFrontElement.style.transform = "";
  if (enemyImageElement) enemyImageElement.style.transform = "";
}

function updateSceneParallaxFromPointer(event) {
  if (!encounterPanel || !combatSceneBackElement || !combatSceneFrontElement || !enemyImageElement) return;
  if (encounterPanel.classList.contains("hidden")) return;
  const rect = encounterPanel.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
  const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
  const px = Math.max(-0.5, Math.min(0.5, normalizedX));
  const py = Math.max(-0.5, Math.min(0.5, normalizedY));

  const backX = Math.round(px * 8);
  const backY = Math.round(py * 6);
  const frontX = Math.round(px * 16);
  const frontY = Math.round(py * 10);
  const enemyX = Math.round(px * 12);
  const enemyY = Math.round(py * 8);

  combatSceneBackElement.style.transform = `translate(${backX}px, ${backY}px) scale(1.03)`;
  combatSceneFrontElement.style.transform = `translate(${frontX}px, ${frontY}px) scale(1.08)`;
  enemyImageElement.style.transform = `translate(${enemyX}px, ${enemyY}px) scale(1.02)`;
}

function getRaceMeta(raceKey) {
  return RACES[raceKey] || RACES.humano;
}

function getFactionLabel(raceKey) {
  const faction = getRaceMeta(raceKey).faction;
  return faction === "infierno" ? "Infierno" : "Cielo";
}

function getEnemyAssetWithFallback(enemyName) {
  const primary = ENEMY_ASSETS[enemyName] || COMBAT_SCENE_ASSET;
  if (!primary.endsWith(".webp")) {
    return { primary, fallback: COMBAT_SCENE_ASSET };
  }
  const fallback = primary.replace(/\.webp$/i, ".svg");
  return { primary, fallback };
}

function hashString(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function makeRng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function fillRoundRect(ctx2d, x, y, width, height, radius) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  ctx2d.beginPath();
  ctx2d.moveTo(x + r, y);
  ctx2d.lineTo(x + width - r, y);
  ctx2d.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx2d.lineTo(x + width, y + height - r);
  ctx2d.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx2d.lineTo(x + r, y + height);
  ctx2d.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx2d.lineTo(x, y + r);
  ctx2d.quadraticCurveTo(x, y, x + r, y);
  ctx2d.closePath();
  ctx2d.fill();
}

function getEnemyArchetype(enemyName) {
  const key = (enemyName || "").toLowerCase();
  if (key.includes("lobo")) return "wolf";
  if (key.includes("bandido")) return "bandit";
  if (key.includes("guardian")) return "guardian";
  if (key.includes("capitan")) return "captain";
  if (key.includes("bruja")) return "witch";
  if (key.includes("caballero")) return "knight";
  if (key.includes("bestia")) return "beast";
  if (key.includes("arquero")) return "archer";
  if (key.includes("dragon")) return "dragon";
  return "default";
}

function drawEnemyPortrait(milestone) {
  const raceKey = milestone.race || "humano";
  const race = getRaceMeta(raceKey);
  const style = race.style || "fisico";
  const archetype = getEnemyArchetype(milestone.enemy);
  const cacheKey = `${milestone.enemy}|${raceKey}|${style}|${archetype}|v2`;
  if (ENEMY_PORTRAIT_CACHE.has(cacheKey)) return ENEMY_PORTRAIT_CACHE.get(cacheKey);

  const paletteByRace = {
    humano: { base: "#633244", shade: "#1f1a2b", skin: "#ce8e87", accent: "#f3c067" },
    elfo: { base: "#2d5a4f", shade: "#152a28", skin: "#a0d4be", accent: "#7cebc2" },
    enano: { base: "#6a4632", shade: "#231914", skin: "#b9855f", accent: "#f0bc7a" },
    orco: { base: "#485c2f", shade: "#1c2718", skin: "#83a55e", accent: "#c4f277" },
    draconico: { base: "#7b3724", shade: "#28150e", skin: "#b4775d", accent: "#ffa15f" },
    umbrio: { base: "#4c3d6a", shade: "#1b1730", skin: "#9884ba", accent: "#d2adff" },
    celestial: { base: "#315a7a", shade: "#152238", skin: "#9bc7db", accent: "#a3e9ff" },
  };

  const palette = paletteByRace[raceKey] || paletteByRace.humano;
  const seed = hashString(cacheKey);
  const rand = makeRng(seed);

  const canvasEl = document.createElement("canvas");
  canvasEl.width = 640;
  canvasEl.height = 360;
  const ctx2d = canvasEl.getContext("2d");
  if (!ctx2d) return COMBAT_SCENE_ASSET;

  const bg = ctx2d.createLinearGradient(0, 0, 640, 360);
  bg.addColorStop(0, palette.shade);
  bg.addColorStop(0.55, palette.base);
  bg.addColorStop(1, "#0f121b");
  ctx2d.fillStyle = bg;
  ctx2d.fillRect(0, 0, 640, 360);

  for (let i = 0; i < 7; i += 1) {
    const x = rand() * 640;
    const y = rand() * 360;
    const radius = 56 + rand() * 180;
    const glow = ctx2d.createRadialGradient(x, y, 6, x, y, radius);
    glow.addColorStop(0, `${palette.accent}44`);
    glow.addColorStop(1, `${palette.accent}00`);
    ctx2d.fillStyle = glow;
    ctx2d.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  ctx2d.fillStyle = "rgba(0,0,0,0.34)";
  ctx2d.beginPath();
  ctx2d.ellipse(320, 308, 196, 42, 0, 0, Math.PI * 2);
  ctx2d.fill();

  const torso = ctx2d.createLinearGradient(320, 166, 320, 334);
  torso.addColorStop(0, `${palette.base}`);
  torso.addColorStop(1, `${palette.shade}`);
  ctx2d.fillStyle = torso;
  ctx2d.beginPath();
  ctx2d.moveTo(206, 330);
  ctx2d.quadraticCurveTo(250, 240, 320, 228);
  ctx2d.quadraticCurveTo(390, 240, 434, 330);
  ctx2d.closePath();
  ctx2d.fill();

  const skinGrad = ctx2d.createLinearGradient(320, 94, 320, 254);
  skinGrad.addColorStop(0, "#f1d8c6");
  skinGrad.addColorStop(0.5, palette.skin);
  skinGrad.addColorStop(1, `${palette.shade}`);
  ctx2d.fillStyle = skinGrad;
  ctx2d.beginPath();
  ctx2d.moveTo(320, 98);
  ctx2d.bezierCurveTo(262, 104, 224, 152, 228, 210);
  ctx2d.bezierCurveTo(232, 246, 256, 280, 320, 286);
  ctx2d.bezierCurveTo(384, 280, 408, 246, 412, 210);
  ctx2d.bezierCurveTo(416, 152, 378, 104, 320, 98);
  ctx2d.closePath();
  ctx2d.fill();

  ctx2d.fillStyle = "rgba(0,0,0,0.16)";
  ctx2d.beginPath();
  ctx2d.moveTo(260, 238);
  ctx2d.quadraticCurveTo(320, 260, 380, 238);
  ctx2d.quadraticCurveTo(348, 292, 320, 296);
  ctx2d.quadraticCurveTo(292, 292, 260, 238);
  ctx2d.fill();

  const browY = 170 + Math.round(rand() * 10);
  const eyeSpan = 62 + Math.round(rand() * 8);
  const eyeHeight = style === "magico" ? 12 : 15;
  const eyeWidth = style === "magico" ? 44 : 42;

  ctx2d.fillStyle = "rgba(10, 12, 18, 0.9)";
  fillRoundRect(ctx2d, 320 - eyeSpan - eyeWidth / 2, browY, eyeWidth, eyeHeight, 5);
  fillRoundRect(ctx2d, 320 + eyeSpan - eyeWidth / 2, browY, eyeWidth, eyeHeight, 5);

  const eyeGlow = ctx2d.createRadialGradient(320 - eyeSpan, browY + eyeHeight / 2, 2, 320 - eyeSpan, browY + eyeHeight / 2, 16);
  eyeGlow.addColorStop(0, `${palette.accent}`);
  eyeGlow.addColorStop(1, `${palette.accent}00`);
  ctx2d.fillStyle = eyeGlow;
  ctx2d.beginPath();
  ctx2d.arc(320 - eyeSpan, browY + eyeHeight / 2, 16, 0, Math.PI * 2);
  ctx2d.fill();
  const eyeGlowB = ctx2d.createRadialGradient(320 + eyeSpan, browY + eyeHeight / 2, 2, 320 + eyeSpan, browY + eyeHeight / 2, 16);
  eyeGlowB.addColorStop(0, `${palette.accent}`);
  eyeGlowB.addColorStop(1, `${palette.accent}00`);
  ctx2d.fillStyle = eyeGlowB;
  ctx2d.beginPath();
  ctx2d.arc(320 + eyeSpan, browY + eyeHeight / 2, 16, 0, Math.PI * 2);
  ctx2d.fill();

  ctx2d.fillStyle = "#e8eef8";
  ctx2d.beginPath();
  ctx2d.arc(320 - eyeSpan, browY + eyeHeight / 2, 3.4, 0, Math.PI * 2);
  ctx2d.arc(320 + eyeSpan, browY + eyeHeight / 2, 3.4, 0, Math.PI * 2);
  ctx2d.fill();

  if (archetype === "bandit" || archetype === "captain") {
    ctx2d.fillStyle = "rgba(12, 14, 20, 0.84)";
    fillRoundRect(ctx2d, 232, browY - 6, 176, eyeHeight + 16, 8);
    ctx2d.strokeStyle = `${palette.accent}aa`;
    ctx2d.lineWidth = 2;
    ctx2d.strokeRect(236, browY - 2, 168, eyeHeight + 8);
  }

  if (archetype === "knight" || archetype === "guardian") {
    ctx2d.fillStyle = "rgba(40, 44, 58, 0.82)";
    fillRoundRect(ctx2d, 248, 114, 144, 26, 8);
    ctx2d.fillStyle = "rgba(222, 229, 240, 0.14)";
    fillRoundRect(ctx2d, 258, 118, 124, 8, 4);
  }

  if (archetype === "witch" || style === "magico") {
    ctx2d.strokeStyle = `${palette.accent}cc`;
    ctx2d.lineWidth = 2.5;
    for (let i = 0; i < 3; i += 1) {
      ctx2d.beginPath();
      ctx2d.arc(320, 176, 94 + i * 16, 0.25, Math.PI - 0.25);
      ctx2d.stroke();
    }
  }

  if (archetype === "wolf" || archetype === "beast") {
    ctx2d.fillStyle = palette.skin;
    ctx2d.beginPath();
    ctx2d.moveTo(248, 134);
    ctx2d.lineTo(288, 70);
    ctx2d.lineTo(302, 142);
    ctx2d.closePath();
    ctx2d.fill();
    ctx2d.beginPath();
    ctx2d.moveTo(392, 134);
    ctx2d.lineTo(352, 70);
    ctx2d.lineTo(338, 142);
    ctx2d.closePath();
    ctx2d.fill();
  }

  if (archetype === "dragon") {
    ctx2d.fillStyle = `${palette.accent}aa`;
    ctx2d.beginPath();
    ctx2d.moveTo(268, 112);
    ctx2d.lineTo(242, 84);
    ctx2d.lineTo(274, 94);
    ctx2d.closePath();
    ctx2d.fill();
    ctx2d.beginPath();
    ctx2d.moveTo(372, 112);
    ctx2d.lineTo(398, 84);
    ctx2d.lineTo(366, 94);
    ctx2d.closePath();
    ctx2d.fill();
  }

  if (archetype === "archer") {
    ctx2d.strokeStyle = `${palette.accent}bb`;
    ctx2d.lineWidth = 3;
    ctx2d.beginPath();
    ctx2d.arc(404, 194, 36, -1.3, 1.3);
    ctx2d.stroke();
    ctx2d.beginPath();
    ctx2d.moveTo(404, 158);
    ctx2d.lineTo(404, 230);
    ctx2d.stroke();
  }

  ctx2d.fillStyle = style === "fisico" ? "#2d1f1a" : "#1c2637";
  fillRoundRect(ctx2d, 272, 236, 96, 48, 12);
  ctx2d.fillStyle = style === "fisico" ? "#e8d8bc" : "#cbe9ff";
  fillRoundRect(ctx2d, 278, 242, 84, 36, 10);

  if (style === "fisico") {
    ctx2d.fillStyle = `${palette.shade}cc`;
    ctx2d.beginPath();
    ctx2d.moveTo(254, 272);
    ctx2d.lineTo(214, 316);
    ctx2d.lineTo(278, 318);
    ctx2d.closePath();
    ctx2d.fill();
    ctx2d.beginPath();
    ctx2d.moveTo(386, 272);
    ctx2d.lineTo(362, 316);
    ctx2d.lineTo(428, 316);
    ctx2d.closePath();
    ctx2d.fill();
  } else {
    ctx2d.strokeStyle = `${palette.accent}88`;
    ctx2d.lineWidth = 2;
    ctx2d.beginPath();
    ctx2d.moveTo(236, 302);
    ctx2d.quadraticCurveTo(320, 284, 404, 302);
    ctx2d.stroke();
  }

  ctx2d.strokeStyle = "rgba(255,255,255,0.11)";
  ctx2d.lineWidth = 1.8;
  for (let i = 0; i < 5; i += 1) {
    const y = 26 + i * 68 + rand() * 16;
    ctx2d.beginPath();
    ctx2d.moveTo(0, y);
    ctx2d.bezierCurveTo(160, y - 16, 468, y + 18, 640, y - 8);
    ctx2d.stroke();
  }

  const vignette = ctx2d.createRadialGradient(320, 180, 120, 320, 180, 360);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.36)");
  ctx2d.fillStyle = vignette;
  ctx2d.fillRect(0, 0, 640, 360);

  const data = canvasEl.toDataURL("image/webp", 0.92);
  ENEMY_PORTRAIT_CACHE.set(cacheKey, data);
  return data;
}

function getRaceBadgeHTML(raceKey) {
  const race = getRaceMeta(raceKey);
  return `<span class="race-badge" style="--race-color:${race.color}">${race.label}</span>`;
}

function applyEncounterVisualTheme(raceKey) {
  const raceMeta = getRaceMeta(raceKey);
  const factionGlow = raceMeta.faction === "infierno" ? "rgba(255, 104, 104, 0.45)" : "rgba(116, 214, 255, 0.42)";
  encounterPanel.style.setProperty("--encounter-race-color", raceMeta.color);
  encounterPanel.style.setProperty("--encounter-faction-glow", factionGlow);
}

function applyEnemyPortraitBackdrop(assetPath) {
  if (!assetPath) return;
  encounterPanel.style.setProperty("--enemy-portrait", `url(${JSON.stringify(assetPath)})`);
}

function getActiveSummon() {
  return state.summons.find((summon) => summon.id === state.activeSummonId) || null;
}

function getSummonBonus() {
  const summon = getActiveSummon();
  if (!summon) return { atk: 0, def: 0, hp: 0 };
  const scale = Math.max(1, summon.level);
  return {
    atk: summon.atk + (scale - 1),
    def: summon.def + Math.floor((scale - 1) / 2),
    hp: summon.hp + (scale - 1),
  };
}

function logCombatEvent(message) {
  state.combatHistory.unshift(message);
  state.combatHistory = state.combatHistory.slice(0, 12);
  renderCombatHistory();
}

function renderCombatHistory() {
  if (!combatHistoryElement) return;
  if (state.combatHistory.length === 0) {
    combatHistoryElement.innerHTML = '<li class="inventory-empty">Sin eventos aun.</li>';
    return;
  }
  combatHistoryElement.innerHTML = state.combatHistory.map((event) => `<li>${event}</li>`).join("");
}

function setCombatControlsEnabled(enabled) {
  attackButton.disabled = !enabled;
  healButton.disabled = !enabled;
  escapeButton.disabled = !enabled;
}

function setCombatTurn(turn) {
  state.combatTurn = turn;
  turnIndicatorElement.textContent = turn === "player" ? "Turno: Jugador" : "Turno: Enemigo";
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function playTemporaryClass(element, className, ms) {
  element.classList.add(className);
  await wait(ms);
  element.classList.remove(className);
}

async function runPlayerAction(action) {
  if (!state.activeEncounter) return;
  if (state.combatTurn !== "player" || state.combatLocked) return;

  state.combatLocked = true;
  setCombatControlsEnabled(false);
  try {
    await action();
  } finally {
    state.combatLocked = false;
    if (state.activeEncounter && state.combatTurn === "player") {
      setCombatControlsEnabled(true);
    }
  }
}

function getNextRouteId(routeId) {
  const idx = ROUTE_ORDER.indexOf(routeId);
  if (idx === -1) return null;
  return ROUTE_ORDER[idx + 1] || null;
}

function getEquipmentBonus() {
  const weapon = WEAPONS.find((entry) => entry.id === state.equipment.weaponId) || WEAPONS[0];
  const armor = ARMORS.find((entry) => entry.id === state.equipment.armorId) || ARMORS[0];
  return {
    atk: weapon.atk + armor.atk,
    def: weapon.def + armor.def,
    hp: weapon.hp + armor.hp,
    weapon,
    armor,
  };
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
  return player.baseMaxHp + getPartyBonus().hp + getSummonBonus().hp + getEquipmentBonus().hp;
}

function getTotalItems() {
  return state.inventory.reduce((sum, item) => sum + item.qty, 0);
}

function getPlayerAtk() {
  return player.baseAtk + getPartyBonus().atk + getSummonBonus().atk + getEquipmentBonus().atk;
}

function getPlayerDef() {
  return player.baseDef + getPartyBonus().def + getSummonBonus().def + getEquipmentBonus().def;
}

function getPlayerRaceKey() {
  const summon = getActiveSummon();
  if (summon) return summon.race;
  if (state.party.length > 0) return state.party[0].race;
  return "humano";
}

function getRaceDamageMultiplier(attackerRaceKey, defenderRaceKey) {
  const attacker = getRaceMeta(attackerRaceKey);
  const defender = getRaceMeta(defenderRaceKey);
  let multiplier = 1;

  if (attacker.dominateAll) multiplier *= 1.22;
  if (defender.dominateAll) multiplier *= 0.82;
  if (attacker.style === "fisico" && defender.style === "magico") multiplier *= 1.08;
  if (attacker.style === "magico" && defender.style === "fisico") multiplier *= 1.08;

  return multiplier;
}

function computeRouteProgress(route) {
  const total = route.milestones.length;
  const completed = route.milestones.filter((milestone) => milestone.completed).length;
  const percentage = total === 0 ? 100 : Math.round((completed / total) * 100);
  return { total, completed, percentage };
}

function updateProgressPanel() {
  const current = computeRouteProgress(state.route);
  const allRoutes = ROUTE_ORDER.map((routeId) => ROUTES[routeId]);
  const totalMilestones = allRoutes.reduce((sum, route) => sum + route.milestones.length, 0);
  const completedMilestones = allRoutes.reduce(
    (sum, route) => sum + route.milestones.filter((milestone) => milestone.completed).length,
    0,
  );
  const totalPercentage = totalMilestones === 0 ? 100 : Math.round((completedMilestones / totalMilestones) * 100);

  const pendingInRoute = current.total - current.completed;
  const etaMinutes = pendingInRoute * 2;
  const nextMilestone = state.route.milestones.find((milestone) => !milestone.completed);
  const nextLabel = nextMilestone ? `${nextMilestone.enemy} (${getRaceMeta(nextMilestone.race).label})` : "Completar meta final";

  progressRouteElement.textContent = `${state.route.label}: ${current.percentage}% completada (${current.completed}/${current.total} hitos)`;
  progressTotalElement.textContent = `Progreso total: ${totalPercentage}% (${completedMilestones}/${totalMilestones} hitos)`;
  progressEtaElement.textContent = pendingInRoute === 0 ? "ETA ruta actual: lista para cierre" : `ETA ruta actual: ~${etaMinutes} min`;
  progressNextElement.textContent = `Siguiente objetivo: ${nextLabel}`;
}

function updateStoryLine(message) {
  if (!storyLineElement) return;
  storyLineElement.textContent = message;
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
            <span>${member.name} ${getRaceBadgeHTML(member.race)} (+${member.atk} ATQ, +${member.def} DEF, +${member.hp} HP)</span>
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
            <span>${member.name} ${getRaceBadgeHTML(member.race)} (+${member.atk} ATQ, +${member.def} DEF, +${member.hp} HP)</span>
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

function renderSummons() {
  summonEssenceElement.textContent = `Esencia de invocacion: ${state.summonEssence}`;

  if (state.summons.length === 0) {
    summonListElement.innerHTML = '<li class="inventory-empty">Sin invocaciones.</li>';
    return;
  }

  summonListElement.innerHTML = state.summons
    .map((summon) => {
      const isActive = summon.id === state.activeSummonId;
      return `
        <li class="inventory-item">
          <div>
            <strong>${summon.name}</strong> ${getRaceBadgeHTML(summon.race)}
            <p>Nivel ${summon.level} (+${summon.atk + summon.level - 1} ATQ, +${summon.def + Math.floor((summon.level - 1) / 2)} DEF, +${summon.hp + summon.level - 1} HP)</p>
          </div>
          <div class="inventory-actions">
            <button class="secondary-btn" data-summon-action="activate" data-summon-id="${summon.id}" type="button">${isActive ? "Activa" : "Invocar"}</button>
            <button class="secondary-btn" data-summon-action="train" data-summon-id="${summon.id}" type="button">Entrenar</button>
          </div>
        </li>
      `;
    })
    .join("");
}

function activateSummon(summonId) {
  if (!state.summons.some((summon) => summon.id === summonId)) return;
  state.activeSummonId = summonId;
  const summon = getActiveSummon();
  messageElement.textContent = `Invocacion activa: ${summon.name}.`;
  logCombatEvent(`Invocacion activa: ${summon.name}.`);
  updateStatsPanel();
  updateCombatStats();
  updateStatus();
  renderSummons();
}

function trainSummon(summonId) {
  if (state.activeEncounter) {
    messageElement.textContent = "Entrena invocaciones fuera de combate.";
    return;
  }

  const summon = state.summons.find((entry) => entry.id === summonId);
  if (!summon) return;

  const cost = summon.level;
  if (state.summonEssence < cost) {
    messageElement.textContent = `Falta esencia para entrenar (${cost}).`;
    return;
  }

  state.summonEssence -= cost;
  summon.level += 1;
  messageElement.textContent = `${summon.name} sube a nivel ${summon.level}.`;
  logCombatEvent(`Entrenamiento: ${summon.name} alcanza nivel ${summon.level}.`);
  updateStatsPanel();
  updateCombatStats();
  updateStatus();
  renderSummons();
}

function updateStatsPanel() {
  const maxHp = getMaxHp();
  const bonus = getPartyBonus();
  const equip = getEquipmentBonus();
  heroAliasElement.textContent = `Alias: ${MAIN_HERO.publicName} (${MAIN_HERO.title})`;
  characterStatsElement.textContent = `Nivel ${player.level} | EXP ${player.exp}/${player.nextExp} | HP ${player.hp}/${maxHp} | ATQ ${getPlayerAtk()} | DEF ${getPlayerDef()}`;
  characterBonusElement.textContent = `Bonos aliados: +${bonus.atk} ATQ, +${bonus.def} DEF, +${bonus.hp} HP | Equipo: ${equip.weapon.name} / ${equip.armor.name}.`;
}

function renderEquipment() {
  weaponSelectElement.innerHTML = WEAPONS.map((entry) => `<option value="${entry.id}">${entry.name}</option>`).join("");
  armorSelectElement.innerHTML = ARMORS.map((entry) => `<option value="${entry.id}">${entry.name}</option>`).join("");
  weaponSelectElement.value = state.equipment.weaponId;
  armorSelectElement.value = state.equipment.armorId;
}

function addPartyMember(memberId) {
  if (state.party.length >= MAX_PARTY_SIZE) {
    messageElement.textContent = "Tu equipo ya esta completo (max 3).";
    return;
  }

  const candidate = COMPANIONS.find((member) => member.id === memberId);
  if (!candidate) return;
  if (state.party.some((member) => member.id === candidate.id)) return;

  const raceMeta = getRaceMeta(candidate.race);
  if (raceMeta.hardToOccupy && Math.random() > 0.35) {
    messageElement.textContent = `${candidate.name} (${raceMeta.label}) resiste la ocupacion. Intenta de nuevo.`;
    logCombatEvent(`Reclutamiento fallido: ${candidate.name} (${raceMeta.label}).`);
    return;
  }

  state.party.push(candidate);
  messageElement.textContent = `${candidate.name} se unio al equipo.`;
  logCombatEvent(`Reclutado: ${candidate.name}.`);
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
  state.routeState[state.routeId] = { x: route.start.x, y: route.start.y, initialized: true };

  state.combatLocked = false;
  setCombatTurn("player");
  setCombatControlsEnabled(true);
  setCombatModalOpen(false);
  messageElement.textContent = customMessage || `Reinicio en ${route.label}.`;
  updateStatsPanel();
  updateStatus();
}

function switchRoute(routeId, customMessage) {
  if (state.activeEncounter) return;

  state.routeState[state.routeId] = { x: player.x, y: player.y, initialized: true };
  state.routeId = routeId;
  state.route = ROUTES[routeId];
  routeSelect.value = routeId;
  const saved = state.routeState[routeId];
  const spawn = saved && saved.initialized ? saved : state.route.start;
  player.x = spawn.x;
  player.y = spawn.y;
  player.won = false;
  state.activeEncounter = null;
  state.combatLocked = false;
  setCombatTurn("player");
  setCombatControlsEnabled(true);
  setCombatModalOpen(false);
  messageElement.textContent = customMessage || `${MAIN_HERO.publicName} entra en ${state.route.label}.`;
  updateStatsPanel();
  updateStatus();
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
  statusElement.textContent = `${state.route.label} | Hitos: ${completed}/${state.route.milestones.length} | Nivel: ${player.level} | Items: ${getTotalItems()} | Esencia: ${state.summonEssence}`;
  updateProgressPanel();
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
  state.combatLocked = false;
  setCombatTurn("player");
  setCombatControlsEnabled(true);
  setCombatModalOpen(false);

  const lootName = rollLoot();
  state.summonEssence += 1;
  gainExp(earnedExp);
  renderSummons();
  const faction = getFactionLabel(milestone.race || "humano");
  updateStoryLine(`La balanza se inclina hacia ${faction} tras vencer a ${milestone.enemy}.`);
  logCombatEvent(`Victoria sobre ${milestone.enemy}: +${earnedExp} EXP, +1 esencia.`);
  messageElement.textContent = `Hito superado: ${milestone.enemy}. +${earnedExp} EXP, loot: ${lootName}.`;
  updateStatus();
}

async function enemyTurn() {
  if (!state.activeEncounter) return;

  setCombatTurn("enemy");
  await playTemporaryClass(combatSceneFrontElement || encounterPanel, "enemy-turn-anim", 280);

  const enemyRace = state.activeEncounter.milestone.race || "humano";
  const playerRace = getPlayerRaceKey();
  const raceMult = getRaceDamageMultiplier(enemyRace, playerRace);
  const rawDamage = Math.round((Math.floor(Math.random() * 4) + 2) * raceMult);
  const reducedDamage = Math.max(1, rawDamage - getPlayerDef());
  await playTemporaryClass(encounterPanel, "player-hit-anim", 300);
  player.hp = Math.max(0, player.hp - reducedDamage);

  if (player.hp <= 0) {
    battleLogElement.textContent = `Recibiste ${reducedDamage}. Has caido.`;
    logCombatEvent(`Derrota: recibes ${reducedDamage} de dano.`);
    resetRun(`Derrota en ${state.route.label}.`);
    return;
  }

  battleLogElement.textContent = `El enemigo contraataca y hace ${reducedDamage} de dano (${getRaceMeta(enemyRace).style}).`;
  logCombatEvent(`Enemigo golpea por ${reducedDamage} (${getRaceMeta(enemyRace).label}).`);
  updateCombatStats();
  updateStatsPanel();
  updateStatus();
  setCombatTurn("player");
}

function startEncounter(milestone) {
  state.activeEncounter = {
    milestone,
    hp: milestone.hp,
  };
  state.combatLocked = false;

  if (combatSceneBackElement) combatSceneBackElement.src = COMBAT_SCENE_ASSET;
  if (combatSceneFrontElement) combatSceneFrontElement.src = COMBAT_SCENE_ASSET;
  resetSceneParallax();
  const enemyAsset = getEnemyAssetWithFallback(milestone.enemy);
  let portraitSource = drawEnemyPortrait(milestone);
  if (!portraitSource) {
    portraitSource = enemyAsset.primary;
  }
  applyEnemyPortraitBackdrop(portraitSource);
  enemyImageElement.onerror = () => {
    enemyImageElement.onerror = null;
    applyEnemyPortraitBackdrop(enemyAsset.fallback);
    enemyImageElement.src = enemyAsset.fallback;
  };
  enemyImageElement.src = portraitSource;
  enemyImageElement.alt = `Retrato de ${milestone.enemy}`;
  setCombatModalOpen(true);
  setCombatTurn("player");
  setCombatControlsEnabled(true);
  const raceMeta = getRaceMeta(milestone.race || "humano");
  const factionLabel = getFactionLabel(milestone.race || "humano");
  encounterPanel.dataset.faction = raceMeta.faction || "cielo";
  encounterPanel.dataset.race = milestone.race || "humano";
  encounterPanel.dataset.style = raceMeta.style || "fisico";
  applyEncounterVisualTheme(milestone.race || "humano");
  enemyNameElement.innerHTML = `Enfrentamiento: ${milestone.enemy} ${getRaceBadgeHTML(milestone.race || "humano")} (${raceMeta.style} | ${factionLabel})`;
  battleLogElement.textContent = "Tu turno: Ataca, curate o usa un item.";
  updateStoryLine(`Combate activo: ${milestone.enemy} representa al ${factionLabel}.`);
  diceRollElement.textContent = "d20: --";
  logCombatEvent(`Inicia combate contra ${milestone.enemy}.`);
  updateCombatStats();
}

function tryFinishMap() {
  const map = state.route.map;
  if (map[player.y][player.x] !== 2) return;

  const completedAll = state.route.milestones.every((milestone) => milestone.completed);

  if (completedAll) {
    const nextRouteId = getNextRouteId(state.routeId);
    if (nextRouteId) {
      const currentLabel = state.route.label;
      const nextLabel = ROUTES[nextRouteId].label;
      switchRoute(nextRouteId, `${currentLabel} completada. Pasas automaticamente a ${nextLabel}.`);
      return;
    }

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
  state.routeState[state.routeId] = { x: player.x, y: player.y, initialized: true };

  const milestone = getMilestoneAt(player.x, player.y);
  if (milestone && !milestone.completed) {
    messageElement.textContent = `Hito detectado: ${milestone.enemy}`;
    startEncounter(milestone);
  }

  tryFinishMap();
}

async function applyDamageToEnemy(damage, label) {
  if (!state.activeEncounter) return;

  await playTemporaryClass(encounterPanel, "player-attack-anim", 260);
  await playTemporaryClass(enemyImageElement, "enemy-hit-anim", 300);
  const playerRace = getPlayerRaceKey();
  const enemyRace = state.activeEncounter.milestone.race || "humano";
  const raceMult = getRaceDamageMultiplier(playerRace, enemyRace);
  let finalDamage = Math.max(1, Math.round(damage * raceMult));
  let rollText = "d20: --";

  if (label === "Ataque") {
    const d20 = Math.floor(Math.random() * 20) + 1;
    if (d20 === 20) {
      finalDamage = Math.max(1, Math.round(finalDamage * 2));
      rollText = `d20: 20 (CRITICO x2)`;
    } else if (d20 === 1) {
      finalDamage = Math.max(1, Math.floor(finalDamage * 0.5));
      rollText = `d20: 1 (FALLO DURO x0.5)`;
    } else {
      rollText = `d20: ${d20}`;
    }
    diceRollElement.textContent = rollText;
  } else {
    diceRollElement.textContent = "d20: n/a";
  }

  state.activeEncounter.hp = Math.max(0, state.activeEncounter.hp - finalDamage);

  if (state.activeEncounter.hp <= 0) {
    battleLogElement.textContent = `${label} hace ${finalDamage}. Enemigo derrotado.`;
    logCombatEvent(`${label}: ${finalDamage} de dano final (${getRaceMeta(playerRace).label}) ${rollText}.`);
    endEncounterWithVictory();
    return;
  }

  battleLogElement.textContent = `${label} hace ${finalDamage}. El enemigo sigue en pie.`;
  logCombatEvent(`${label}: ${finalDamage} de dano (${getRaceMeta(playerRace).label}) ${rollText}.`);
  updateCombatStats();
  await enemyTurn();
}

async function useItemById(itemId) {
  const item = state.inventory.find((entry) => entry.id === itemId);
  if (!item) return;

  if (item.type === "potion") {
    const heal = 8;
    player.hp = Math.min(getMaxHp(), player.hp + heal);
    removeItem(itemId, 1);
    messageElement.textContent = `Usaste Pocion (+${heal} HP).`;
    if (state.activeEncounter) {
      battleLogElement.textContent = `Usaste Pocion y recuperaste ${heal} HP.`;
      logCombatEvent(`Pocion: +${heal} HP.`);
      updateCombatStats();
      await enemyTurn();
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
      logCombatEvent("Elixir activado.");
      updateCombatStats();
      await enemyTurn();
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
    logCombatEvent("Bomba lanzada.");
    await applyDamageToEnemy(9, "Bomba");
  }
}

async function attemptEscape() {
  if (!state.activeEncounter) return;

  const enemyRace = state.activeEncounter.milestone.race || "humano";
  const escapeChance = getRaceMeta(enemyRace).dominateAll ? 0.25 : 0.6;
  const escaped = Math.random() < escapeChance;

  if (escaped) {
    const start = state.route.start;
    player.x = start.x;
    player.y = start.y;
    state.routeState[state.routeId] = { x: start.x, y: start.y, initialized: true };
    const enemy = state.activeEncounter.milestone.enemy;
    state.activeEncounter = null;
    setCombatModalOpen(false);
    messageElement.textContent = `Escapaste del combate contra ${enemy}.`;
    logCombatEvent(`Escape exitoso (${Math.round(escapeChance * 100)}%).`);
    updateStatus();
    return;
  }

  battleLogElement.textContent = "Intento de escape fallido. El enemigo contraataca.";
  logCombatEvent(`Escape fallido (${Math.round(escapeChance * 100)}%).`);
  await enemyTurn();
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

attackButton.addEventListener("click", async () => {
  await runPlayerAction(async () => {
    const minDamage = getPlayerAtk();
    const damage = minDamage + Math.floor(Math.random() * 4);
    await applyDamageToEnemy(damage, "Ataque");
  });
});

healButton.addEventListener("click", async () => {
  await runPlayerAction(async () => {
    const heal = Math.floor(Math.random() * 4) + 3;
    player.hp = Math.min(getMaxHp(), player.hp + heal);
    battleLogElement.textContent = `Te curas ${heal} puntos.`;
    logCombatEvent(`Curacion de turno: +${heal}.`);
    updateCombatStats();
    updateStatsPanel();
    updateStatus();
    await enemyTurn();
  });
});

escapeButton.addEventListener("click", async () => {
  await runPlayerAction(async () => {
    await attemptEscape();
  });
});

inventoryListElement.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const action = target.getAttribute("data-action");
  const itemId = Number(target.getAttribute("data-item-id"));
  if (!itemId) return;

  if (action === "use") {
    if (state.activeEncounter) {
      await runPlayerAction(async () => {
        await useItemById(itemId);
      });
      return;
    }
    await useItemById(itemId);
  }
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

summonListElement.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;
  const action = target.getAttribute("data-summon-action");
  const summonId = target.getAttribute("data-summon-id");
  if (!summonId) return;
  if (action === "activate") activateSummon(summonId);
  if (action === "train") trainSummon(summonId);
});

weaponSelectElement.addEventListener("change", () => {
  if (state.activeEncounter) {
    weaponSelectElement.value = state.equipment.weaponId;
    messageElement.textContent = "No puedes cambiar arma durante combate.";
    return;
  }
  state.equipment.weaponId = weaponSelectElement.value;
  const equipped = getEquipmentBonus().weapon.name;
  messageElement.textContent = `Arma equipada: ${equipped}.`;
  logCombatEvent(`Arma equipada: ${equipped}.`);
  updateStatsPanel();
  updateStatus();
});

armorSelectElement.addEventListener("change", () => {
  if (state.activeEncounter) {
    armorSelectElement.value = state.equipment.armorId;
    messageElement.textContent = "No puedes cambiar armadura durante combate.";
    return;
  }
  state.equipment.armorId = armorSelectElement.value;
  const equipped = getEquipmentBonus().armor.name;
  messageElement.textContent = `Armadura equipada: ${equipped}.`;
  logCombatEvent(`Armadura equipada: ${equipped}.`);
  updateStatsPanel();
  updateStatus();
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (state.activeEncounter) {
    if (key === "a") {
      attackButton.click();
      return;
    }
    if (key === "c") {
      healButton.click();
      return;
    }
    if (key === "e") {
      escapeButton.click();
      return;
    }
  }

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
  if (state.activeEncounter) {
    routeSelect.value = state.routeId;
    messageElement.textContent = "No puedes cambiar de ruta en combate.";
    return;
  }
  switchRoute(routeSelect.value);
});

fullscreenButton.addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      fullscreenButton.textContent = "Salir pantalla completa";
    } else {
      await document.exitFullscreen();
      fullscreenButton.textContent = "Pantalla completa";
    }
  } catch {
    messageElement.textContent = "Pantalla completa no disponible en este navegador.";
  }
});

document.addEventListener("fullscreenchange", () => {
  fullscreenButton.textContent = document.fullscreenElement ? "Salir pantalla completa" : "Pantalla completa";
});

encounterPanel.addEventListener("pointermove", (event) => {
  updateSceneParallaxFromPointer(event);
});

encounterPanel.addEventListener("pointerleave", () => {
  resetSceneParallax();
});

setCombatTurn("player");
setCombatControlsEnabled(true);
renderInventory();
renderParty();
renderSummons();
renderEquipment();
renderCombatHistory();
switchRoute(routeSelect.value);
render();

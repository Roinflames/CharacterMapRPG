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
const enemy3dElement = document.getElementById("enemy-3d");
const enemyImageElement = document.getElementById("enemy-image");
const enemyNameElement = document.getElementById("enemy-name");
const combatStatsElement = document.getElementById("combat-stats");
const diceRollElement = document.getElementById("dice-roll");
const attackPreviewElement = document.getElementById("attack-preview");
const turnIndicatorElement = document.getElementById("turn-indicator");
const playerHpFillElement = document.getElementById("player-hp-fill");
const enemyHpFillElement = document.getElementById("enemy-hp-fill");
const battleLogElement = document.getElementById("battle-log");
const enemyFloatTextElement = document.getElementById("enemy-float-text");
const playerFloatTextElement = document.getElementById("player-float-text");
const inventoryListElement = document.getElementById("inventory-list");
const attackButton = document.getElementById("attack-btn");
const healButton = document.getElementById("heal-btn");
const escapeButton = document.getElementById("escape-btn");
const fullscreenButton = document.getElementById("fullscreen-btn");
const inventoryOpenButton = document.getElementById("inventory-open-btn");
const inventoryOverlay = document.getElementById("inventory-overlay");
const inventoryCloseButton = document.getElementById("inventory-close-btn");
const debugLevelOpenButton = document.getElementById("debug-level-open-btn");
const levelSkipOverlay = document.getElementById("level-skip-overlay");
const levelSkipInput = document.getElementById("level-skip-input");
const levelSkipRouteInput = document.getElementById("level-skip-route-input");
const levelSkipApplyButton = document.getElementById("level-skip-apply-btn");
const levelSkipRouteApplyButton = document.getElementById("level-skip-route-apply-btn");
const levelSkipCloseButton = document.getElementById("level-skip-close-btn");
const inventoryGridElement = document.getElementById("inventory-grid");
const inventoryDetailNameElement = document.getElementById("inventory-detail-name");
const inventoryDetailEffectElement = document.getElementById("inventory-detail-effect");
const inventoryDetailQtyElement = document.getElementById("inventory-detail-qty");
const inventoryUseButton = document.getElementById("inventory-use-btn");
const inventoryDropButton = document.getElementById("inventory-drop-btn");
const audioToggleButton = document.getElementById("audio-toggle-btn");
const audioVolumeInput = document.getElementById("audio-volume");
const worldThemeButton = document.getElementById("world-theme-btn");
const composeThemeButton = document.getElementById("compose-theme-btn");
const startScreen = document.getElementById("start-screen");
const loreScreen = document.getElementById("lore-screen");
const startBtn = document.getElementById("start-btn");
const loreSkipBtn = document.getElementById("lore-skip-btn");
const loreChapterEl = document.getElementById("lore-chapter");
const loreTitleEl = document.getElementById("lore-title");
const loreTextEl = document.getElementById("lore-text");
const gameShellElement = document.querySelector(".game-shell");

const TILE = 32;
const MAX_PARTY_SIZE = 3;
const BASE_VISION_RADIUS = 2.6;
const DARK_BRUTAL_MODE = true;
const MAIN_HERO = {
  publicName: "Jisuo Tenma",
  hiddenLoreName: "Jesus",
  title: "Portador de la Luz",
};

const AUDIO_STORAGE_KEY = "character-map-audio-v1";
const AUDIO_NOTES = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B3: 246.94,
  C5: 523.25,
  D5: 587.33,
};
const WORLD_THEME_PRESETS = [
  { name: "M1-A", notes: ["C4", "E4", "G4", "A4", "G4", "E4", "D4", "E4"], type: "triangle", gain: 0.13, beatMs: 430 },
  { name: "M1-B", notes: ["A4", "F4", "E4", "D4", "E4", "G4", "E4", "C4"], type: "sine", gain: 0.12, beatMs: 410 },
  { name: "M1-C", notes: ["D4", "F4", "A4", "G4", "F4", "E4", "D4", "C4"], type: "triangle", gain: 0.14, beatMs: 390 },
];
const BGM_PROFILES = {
  world: {
    pattern: [AUDIO_NOTES.C4, AUDIO_NOTES.E4, AUDIO_NOTES.G4, AUDIO_NOTES.D4],
    type: "triangle",
    gain: 0.11,
    harmonyGain: 0.055,
    bassGain: 0.045,
    accentGain: 0.03,
    harmonySemitones: [7, 12],
    bassSteps: [0, -5, -7, -12],
    beatMs: 460,
  },
  battle: {
    pattern: [AUDIO_NOTES.C4, AUDIO_NOTES.B3, AUDIO_NOTES.D4, AUDIO_NOTES.C4, AUDIO_NOTES.F4, AUDIO_NOTES.D4],
    type: "sawtooth",
    gain: 0.15,
    harmonyGain: 0.05,
    bassGain: 0.09,
    accentGain: 0.06,
    harmonySemitones: [7],
    bassSteps: [-12, -12, -7, -12, -5, -12],
    beatMs: 240,
  },
  lore: {
    pattern: [AUDIO_NOTES.E4, AUDIO_NOTES.D4, AUDIO_NOTES.C4, AUDIO_NOTES.D4, AUDIO_NOTES.E4, AUDIO_NOTES.G4],
    type: "sine",
    gain: 0.11,
    harmonyGain: 0.04,
    bassGain: 0.03,
    accentGain: 0.02,
    harmonySemitones: [12],
    bassSteps: [-12, -7, -12, -5],
    beatMs: 500,
  },
  victory: {
    pattern: [AUDIO_NOTES.C4, AUDIO_NOTES.E4, AUDIO_NOTES.G4, AUDIO_NOTES.C5, AUDIO_NOTES.D5, AUDIO_NOTES.C5],
    type: "triangle",
    gain: 0.15,
    harmonyGain: 0.06,
    bassGain: 0.05,
    accentGain: 0.05,
    harmonySemitones: [7, 12],
    bassSteps: [-12, -7, -5, -12],
    beatMs: 380,
  },
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
const ROUTE_ORDER = Array.from({ length: 13 }, (_, i) => `route${i + 1}`);
const COMBAT_SCENE_ASSET = "assets/combat/arena.svg";
const ENABLE_ENEMY_3D = false;
const MINI_DUNGEON_ICON_PATHS = {
  enemy: "kenney_mini-dungeon/Previews/character-orc.png",
  loot: "kenney_mini-dungeon/Previews/chest.png",
  goal: "kenney_mini-dungeon/Previews/gate.png",
};
const ENEMY_PORTRAIT_CACHE = new Map();
const ENEMY_ASSETS = {
  "Lobo Sombrio": "assets/enemies/lobo-sombrio-ai.jpg",
  "Bandido del Valle": "assets/enemies/bandido-del-valle-ai.jpg",
  "Guardian de Piedra": "assets/enemies/guardian-de-piedra-ai.jpg",
  "Capitan del Portal": "assets/enemies/capitan-del-portal-ai.jpg",
  "Bruja del Pantano": "assets/enemies/bruja-del-pantano-ai.jpg",
  "Caballero Perdido": "assets/enemies/caballero-perdido-ai.jpg",
  "Bestia de Ceniza": "assets/enemies/bestia-de-ceniza-ai.jpg",
  "Arquero del Eclipse": "assets/enemies/arquero-del-eclipse-ai.jpg",
  "Dragon Menor": "assets/enemies/dragon-menor-ai.jpg",
  "Centinela del Umbral": "assets/enemies/centinela-del-umbral.svg",
  "Quimera del Vacio": "assets/enemies/quimera-del-vacio.svg",
  "Oraculo Caido": "assets/enemies/oraculo-caido.svg",
  "Soberano del Abismo": "assets/enemies/soberano-del-abismo.svg",
};
const ENEMY_3D_MODEL_BY_ENEMY = {
  "Lobo Sombrio": "kenney_mini-dungeon/Models/GLB format/character-orc.glb",
  "Bandido del Valle": "kenney_mini-dungeon/Models/GLB format/character-human.glb",
  "Guardian de Piedra": "kenney_mini-dungeon/Models/GLB format/character-orc.glb",
  "Capitan del Portal": "kenney_mini-dungeon/Models/GLB format/character-human.glb",
  "Bruja del Pantano": "kenney_mini-dungeon/Models/GLB format/character-human.glb",
  "Caballero Perdido": "kenney_mini-dungeon/Models/GLB format/character-human.glb",
  "Bestia de Ceniza": "kenney_mini-dungeon/Models/GLB format/character-orc.glb",
  "Arquero del Eclipse": "kenney_mini-dungeon/Models/GLB format/character-human.glb",
  "Dragon Menor": "kenney_mini-dungeon/Models/GLB format/character-orc.glb",
  "Centinela del Umbral": "kenney_mini-dungeon/Models/GLB format/character-human.glb",
  "Quimera del Vacio": "kenney_mini-dungeon/Models/GLB format/character-orc.glb",
  "Oraculo Caido": "kenney_mini-dungeon/Models/GLB format/character-human.glb",
  "Soberano del Abismo": "kenney_mini-dungeon/Models/GLB format/character-orc.glb",
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
const PASSIVE_PRIORITY = ["humano", "elfo", "enano", "orco", "draconico", "umbrio", "celestial"];
const RACE_PASSIVES = {
  humano: {
    name: "Ambra Vanguard",
    short: "Lider equilibrado",
    effectText: "+1 ATQ, +1 DEF.",
    atkFlat: 1,
    defFlat: 1,
  },
  elfo: {
    name: "Verdant Archer",
    short: "Critico refinado",
    effectText: "Critico ampliado (18-20).",
    critWindowBonus: 2,
  },
  enano: {
    name: "Crimson Bulwark",
    short: "Muralla frontal",
    effectText: "+2 DEF fija.",
    defFlat: 2,
  },
  orco: {
    name: "Lime Berserker",
    short: "Furia al limite",
    effectText: "+20% dano con HP <= 50%.",
    lowHpDamageMult: 1.2,
  },
  draconico: {
    name: "Inferno Fang",
    short: "Quemadura ofensiva",
    effectText: "25% de aplicar +2 dano de llama.",
    burnChance: 0.25,
    burnDamage: 2,
  },
  umbrio: {
    name: "Violet Phantom",
    short: "Golpe y huida",
    effectText: "+10% escape, critico 19-20.",
    critWindowBonus: 1,
    escapeBonus: 0.1,
  },
  celestial: {
    name: "Azure Grace",
    short: "Sosten magico",
    effectText: "Regenera +1 HP al inicio de tu turno.",
    turnRegen: 1,
  },
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
  route3: {
    label: "Ruta 3",
    start: { x: 1, y: 9 },
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    milestones: [
      { id: "r3m1", x: 4, y: 9, enemy: "Centinela del Umbral", race: "enano", hp: 18, completed: false },
      { id: "r3m2", x: 9, y: 7, enemy: "Quimera del Vacio", race: "orco", hp: 21, completed: false },
      { id: "r3m3", x: 14, y: 5, enemy: "Oraculo Caido", race: "celestial", hp: 24, completed: false },
      { id: "r3boss", x: 17, y: 1, enemy: "Soberano del Abismo", race: "umbrio", hp: 32, completed: false },
    ],
  },
};

const GENERATED_ROUTE_TEMPLATES = [
  {
    start: { x: 1, y: 1 },
    map: ROUTES.route1.map,
    milestones: [
      { x: 4, y: 1 },
      { x: 8, y: 5 },
      { x: 13, y: 7 },
      { x: 17, y: 9 },
    ],
  },
  {
    start: { x: 1, y: 9 },
    map: ROUTES.route2.map,
    milestones: [
      { x: 3, y: 9 },
      { x: 7, y: 9 },
      { x: 11, y: 7 },
      { x: 15, y: 3 },
      { x: 17, y: 1 },
    ],
  },
  {
    start: { x: 1, y: 9 },
    map: ROUTES.route3.map,
    milestones: [
      { x: 4, y: 9 },
      { x: 9, y: 7 },
      { x: 14, y: 5 },
      { x: 17, y: 1 },
    ],
  },
];

const GENERATED_ENEMY_PREFIX = [
  "Legionario",
  "Sombra",
  "Centinela",
  "Verdugo",
  "Oraculo",
  "Cazador",
  "Titán",
  "Abisario",
];
const GENERATED_ENEMY_SUFFIX = [
  "del Hierro",
  "del Eclipse",
  "del Panteon",
  "del Velo",
  "del Umbral",
  "del Foso",
  "de Ceniza",
  "de la Noche",
];
const GENERATED_RACE_CYCLE = ["humano", "elfo", "enano", "orco", "draconico", "umbrio", "celestial"];

function cloneMapLayout(map) {
  return map.map((row) => row.slice());
}

function generateEnemyName(routeNumber, milestoneIndex) {
  const p = GENERATED_ENEMY_PREFIX[(routeNumber + milestoneIndex) % GENERATED_ENEMY_PREFIX.length];
  const s = GENERATED_ENEMY_SUFFIX[(routeNumber * 2 + milestoneIndex) % GENERATED_ENEMY_SUFFIX.length];
  return `${p} ${s}`;
}

function appendGeneratedRoutes() {
  for (let routeNum = 4; routeNum <= 13; routeNum += 1) {
    const routeId = `route${routeNum}`;
    if (ROUTES[routeId]) continue;
    const template = GENERATED_ROUTE_TEMPLATES[(routeNum - 1) % GENERATED_ROUTE_TEMPLATES.length];
    const milestones = template.milestones.map((pos, idx) => {
      const isBoss = idx === template.milestones.length - 1;
      const race = GENERATED_RACE_CYCLE[(routeNum + idx) % GENERATED_RACE_CYCLE.length];
      const hpBase = 12 + routeNum * 2 + idx * 2 + (isBoss ? 8 : 0);
      return {
        id: `r${routeNum}m${idx + 1}`,
        x: pos.x,
        y: pos.y,
        enemy: isBoss ? `Jefe del Mundo ${routeNum}` : generateEnemyName(routeNum, idx),
        race,
        hp: hpBase,
        completed: false,
      };
    });
    ROUTES[routeId] = {
      label: `Ruta ${routeNum}`,
      start: { ...template.start },
      map: cloneMapLayout(template.map),
      milestones,
    };
  }
}

appendGeneratedRoutes();

function initializeMilestones() {
  ROUTE_ORDER.forEach((routeId) => {
    ROUTES[routeId].milestones.forEach((milestone, index) => {
      if (typeof milestone.spawnX !== "number") milestone.spawnX = milestone.x;
      if (typeof milestone.spawnY !== "number") milestone.spawnY = milestone.y;
      if (typeof milestone.aiMode !== "string") milestone.aiMode = "idle";
      if (typeof milestone.aiPatrolBias !== "number") milestone.aiPatrolBias = (index % 4) * 0.08;
      if (typeof milestone.aiLastSeenAt !== "number") milestone.aiLastSeenAt = -Infinity;
    });
  });
}

initializeMilestones();

const LORE_SEQUENCE = [
  {
    chapter: "PRÓLOGO",
    title: "La Guerra Final",
    lines: [
      "Dos reinos en guerra desgajan los mundos.",
      "El Cielo y el Infierno llevan siglos en un conflicto que consume todo a su paso. Jisuo Tenma, Portador de la Luz, recibe su misión: recorrer los trece mundos corrompidos y liberar a sus doce discípulos, cada uno capturado por una fuerza oscura distinta.",
      "El primer frente te espera. El Infierno ha enviado a sus guardianes. Avanza.",
    ],
    onAdvance() {
      state.gameScreen = "playing";
      loreScreen.classList.add("hidden");
    },
  },
  {
    chapter: "INTERMEDIO I",
    title: "El Portal Sellado",
    lines: [
      "El Capitán del Portal ha caído. La primera brecha se cierra y el Cielo gana terreno.",
      "Pero la travesía apenas comienza. Las criaturas del siguiente frente son más oscuras. El Infierno tiene más frentes abiertos.",
      "Abre la segunda ruta.",
    ],
    onAdvance() {
      state.gameScreen = "playing";
      loreScreen.classList.add("hidden");
      switchRoute("route2", "Ruta 2 desbloqueada.");
    },
  },
  {
    chapter: "INTERMEDIO II",
    title: "El Dragón Doblegado",
    lines: [
      "El Dragón Menor yace derrotado. Dos frentes liberados, la luz avanza.",
      "Un tercer frente acaba de abrirse: el Umbral del Abismo.",
      "Allí espera un jefe capaz de romper escuadrones completos.",
      "Abre la tercera ruta.",
    ],
    onAdvance() {
      state.gameScreen = "playing";
      loreScreen.classList.add("hidden");
      switchRoute("route3", "Ruta 3 desbloqueada. El jefe te espera.");
    },
  },
  {
    chapter: "EPILOGO",
    title: "El Abismo Cede",
    lines: [
      "El Soberano del Abismo ha caido. El tercer frente se derrumba.",
      "La guerra no termina, pero hoy la balanza vuelve al Cielo.",
      "Victoria total en tres rutas.",
    ],
    onAdvance() {
      state.gameScreen = "playing";
      loreScreen.classList.add("hidden");
      player.won = true;
      messageElement.textContent = "Victoria total en las tres rutas.";
    },
  },
];

const player = {
  x: 1,
  y: 1,
  visualX: 1 * 32,
  visualY: 1 * 32,
  hp: 24,
  baseMaxHp: 24,
  level: 1,
  exp: 0,
  nextExp: 20,
  baseAtk: 4,
  baseDef: 1,
  won: false,
};
const PLAYER_LEVEL_BASE = {
  level: 1,
  exp: 0,
  nextExp: 20,
  baseMaxHp: 24,
  baseAtk: 4,
  baseDef: 1,
};

const state = {
  gameScreen: "start",
  activeLoreEntry: null,
  walkAnim: null,
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
  pendingAttackPreview: null,
  hpVisual: { player: 100, enemy: 100 },
  hpAnimationFrame: { player: null, enemy: null },
  audio: { enabled: false, volume: 0.65, worldThemeIndex: 0, customWorldNotes: null },
  debugWorldPhaseOverride: null,
  worldThreat: { level: "low", distance: Infinity, lastPulseAt: 0 },
  fearLastStingAt: 0,
  inventorySelectedItemId: null,
  enemyAiLastStepAt: 0,
};

const audioRuntime = {
  context: null,
  masterGain: null,
  bgmGain: null,
  bgmTimer: null,
  bgmStep: 0,
  unlocked: false,
  currentBgmProfile: "",
};
const enemy3dRuntime = {
  ready: false,
  renderer: null,
  scene: null,
  camera: null,
  loader: null,
  mixer: null,
  clock: null,
  modelRoot: null,
  rafId: 0,
  active: false,
  spin: 0,
  hitUntil: 0,
  lungeUntil: 0,
  baseY: 0,
};

function createMapIcon(path) {
  const image = new Image();
  image.src = path;
  return image;
}

const mapIcons = {
  enemy: createMapIcon(MINI_DUNGEON_ICON_PATHS.enemy),
  loot: createMapIcon(MINI_DUNGEON_ICON_PATHS.loot),
  goal: createMapIcon(MINI_DUNGEON_ICON_PATHS.goal),
};

function drawMapIcon(icon, centerX, centerY, size) {
  if (!icon || !icon.complete || icon.naturalWidth <= 0 || icon.naturalHeight <= 0) return false;
  const ratio = icon.naturalWidth / icon.naturalHeight;
  const drawW = ratio >= 1 ? size : size * ratio;
  const drawH = ratio >= 1 ? size / ratio : size;
  ctx.drawImage(icon, centerX - drawW / 2, centerY - drawH / 2, drawW, drawH);
  return true;
}

function setEnemyVisualMode(mode) {
  const use3d = mode === "3d";
  if (encounterPanel) encounterPanel.dataset.enemyVisual = use3d ? "3d" : "2d";
  if (enemy3dElement) {
    enemy3dElement.classList.toggle("hidden", !use3d);
    enemy3dElement.setAttribute("aria-hidden", String(!use3d));
  }
  if (enemyImageElement) {
    enemyImageElement.classList.toggle("hidden", use3d);
  }
}

function ensureEnemy3DReady() {
  if (enemy3dRuntime.ready) return true;
  if (!enemy3dElement || typeof window.THREE === "undefined" || typeof window.THREE.GLTFLoader === "undefined") return false;
  const three = window.THREE;
  const renderer = new three.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = three.sRGBEncoding;
  enemy3dElement.innerHTML = "";
  enemy3dElement.appendChild(renderer.domElement);

  const scene = new three.Scene();
  scene.background = new three.Color(0x08111a);
  const camera = new three.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0.9, 2.55);
  camera.lookAt(0, 0.15, 0);

  const key = new three.DirectionalLight(0xffffff, 1.55);
  key.position.set(2.8, 3.5, 2.2);
  scene.add(key);
  const rim = new three.DirectionalLight(0x8bd3ff, 0.8);
  rim.position.set(-2.5, 1.9, -2.4);
  scene.add(rim);
  scene.add(new three.HemisphereLight(0xaedcff, 0x0a1119, 1.05));
  scene.add(new three.AmbientLight(0x8fb8d2, 0.55));

  const floor = new three.Mesh(
    new three.CircleGeometry(1.4, 40),
    new three.MeshStandardMaterial({ color: 0x0d1e2a, transparent: true, opacity: 0.55 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.86;
  scene.add(floor);

  enemy3dRuntime.renderer = renderer;
  enemy3dRuntime.scene = scene;
  enemy3dRuntime.camera = camera;
  enemy3dRuntime.loader = new three.GLTFLoader();
  enemy3dRuntime.clock = new three.Clock();
  enemy3dRuntime.ready = true;
  return true;
}

function resizeEnemy3DRenderer() {
  if (!enemy3dRuntime.ready || !enemy3dElement || !enemy3dRuntime.renderer || !enemy3dRuntime.camera) return;
  const width = Math.max(10, Math.floor(enemy3dElement.clientWidth || 1));
  const height = Math.max(10, Math.floor(enemy3dElement.clientHeight || 1));
  enemy3dRuntime.renderer.setSize(width, height, false);
  enemy3dRuntime.camera.aspect = width / height;
  enemy3dRuntime.camera.updateProjectionMatrix();
}

function clearEnemy3DModel() {
  if (!enemy3dRuntime.ready || !enemy3dRuntime.modelRoot || !enemy3dRuntime.scene) return;
  if (enemy3dRuntime.mixer) {
    enemy3dRuntime.mixer.stopAllAction();
    enemy3dRuntime.mixer = null;
  }
  enemy3dRuntime.scene.remove(enemy3dRuntime.modelRoot);
  enemy3dRuntime.modelRoot = null;
}

function stopEnemy3DLoop() {
  enemy3dRuntime.active = false;
  if (enemy3dRuntime.rafId) {
    cancelAnimationFrame(enemy3dRuntime.rafId);
    enemy3dRuntime.rafId = 0;
  }
}

function startEnemy3DLoop() {
  if (!enemy3dRuntime.ready || !enemy3dRuntime.renderer || !enemy3dRuntime.scene || !enemy3dRuntime.camera) return;
  if (enemy3dRuntime.active) return;
  enemy3dRuntime.active = true;
  const tick = () => {
    if (!enemy3dRuntime.active) return;
    const delta = enemy3dRuntime.clock ? Math.min(0.05, enemy3dRuntime.clock.getDelta()) : 0.016;
    enemy3dRuntime.spin += delta * 2.2;
    if (enemy3dRuntime.mixer) enemy3dRuntime.mixer.update(delta);
    if (enemy3dRuntime.modelRoot) {
      const now = performance.now();
      const root = enemy3dRuntime.modelRoot;
      const baseScale = root.userData.baseScale || 1;
      const idleYaw = Math.sin(enemy3dRuntime.spin * 0.9) * 0.2;
      const idleRoll = Math.sin(enemy3dRuntime.spin * 0.6) * 0.04;
      const bob = Math.sin(enemy3dRuntime.spin * 1.8) * 0.05;
      const hitPhase = Math.max(0, (enemy3dRuntime.hitUntil - now) / 180);
      const lungePhase = Math.max(0, (enemy3dRuntime.lungeUntil - now) / 250);
      const lunge = Math.sin((1 - lungePhase) * Math.PI) * 0.24 * (lungePhase > 0 ? 1 : 0);
      const shakeX = hitPhase > 0 ? (Math.random() - 0.5) * 0.06 * hitPhase : 0;

      root.rotation.y = idleYaw;
      root.rotation.z = idleRoll;
      root.position.y = enemy3dRuntime.baseY + bob - hitPhase * 0.03;
      root.position.z = -lunge;
      root.position.x = shakeX;
      root.scale.setScalar(baseScale * (1 + hitPhase * 0.08));
    }
    enemy3dRuntime.renderer.render(enemy3dRuntime.scene, enemy3dRuntime.camera);
    enemy3dRuntime.rafId = requestAnimationFrame(tick);
  };
  tick();
}

function triggerEnemy3DHit() {
  enemy3dRuntime.hitUntil = performance.now() + 180;
}

function triggerEnemy3DLunge() {
  enemy3dRuntime.lungeUntil = performance.now() + 250;
}

function loadEnemy3D(enemyName, raceKey = "humano") {
  if (!ensureEnemy3DReady()) return Promise.resolve(false);
  resizeEnemy3DRenderer();
  clearEnemy3DModel();
  const three = window.THREE;
  const modelPath = ENEMY_3D_MODEL_BY_ENEMY[enemyName] || "kenney_mini-dungeon/Models/GLB format/character-orc.glb";
  const raceColor = getRaceMeta(raceKey).color || "#8de0ff";
  const emissiveTint = new three.Color(raceColor).multiplyScalar(0.14);

  return new Promise((resolve) => {
    enemy3dRuntime.loader.load(
      modelPath,
      (gltf) => {
        const root = gltf.scene || (gltf.scenes && gltf.scenes[0]);
        if (!root) {
          resolve(false);
          return;
        }
        const box = new three.Box3().setFromObject(root);
        const size = box.getSize(new three.Vector3());
        const center = box.getCenter(new three.Vector3());
        root.position.x -= center.x;
        root.position.y -= center.y;
        root.position.z -= center.z;
        const maxAxis = Math.max(size.x, size.y, size.z) || 1;
        const scale = 2 / maxAxis;
        root.scale.setScalar(scale);
        root.userData.baseScale = scale;
        root.position.y -= 0.15;
        enemy3dRuntime.baseY = root.position.y;
        enemy3dRuntime.hitUntil = 0;
        enemy3dRuntime.lungeUntil = 0;
        root.traverse((node) => {
          if (!node.isMesh) return;
          const materials = Array.isArray(node.material) ? node.material : [node.material];
          materials.forEach((mat) => {
            if (!mat) return;
            if (typeof mat.roughness === "number") mat.roughness = Math.max(0.45, Math.min(1, mat.roughness));
            if (typeof mat.metalness === "number") mat.metalness = Math.min(0.22, mat.metalness);
            if ("emissive" in mat && mat.emissive) mat.emissive.copy(emissiveTint);
            if ("emissiveIntensity" in mat) mat.emissiveIntensity = 0.35;
            mat.needsUpdate = true;
          });
        });
        enemy3dRuntime.scene.add(root);
        enemy3dRuntime.modelRoot = root;
        if (gltf.animations && gltf.animations.length > 0) {
          enemy3dRuntime.mixer = new three.AnimationMixer(root);
          gltf.animations.forEach((clip) => {
            const action = enemy3dRuntime.mixer.clipAction(clip);
            action.setEffectiveWeight(1);
            action.play();
          });
        }
        startEnemy3DLoop();
        resolve(true);
      },
      undefined,
      () => {
        resolve(false);
      },
    );
  });
}

function setCombatModalOpen(isOpen) {
  encounterPanel.classList.toggle("hidden", !isOpen);
  combatBackdrop.classList.toggle("hidden", !isOpen);
  if (isOpen) {
    // Safe default: always start visual in 2D, then opt-in to 3D later if enabled.
    setEnemyVisualMode("2d");
  }
  if (!isOpen) {
    stopEnemy3DLoop();
    clearEnemy3DModel();
    setEnemyVisualMode("2d");
    resetSceneParallax();
    encounterPanel.removeAttribute("data-faction");
    encounterPanel.removeAttribute("data-race");
    encounterPanel.removeAttribute("data-style");
    encounterPanel.removeAttribute("data-archetype");
    encounterPanel.style.removeProperty("--encounter-race-color");
    encounterPanel.style.removeProperty("--encounter-faction-glow");
    encounterPanel.style.removeProperty("--enemy-portrait");
    if (enemyImageElement) {
      enemyImageElement.src = "";
      enemyImageElement.alt = "Retrato del enemigo";
    }
    encounterPanel.classList.remove("enemy-defeated-anim");
    if (enemyFloatTextElement) {
      enemyFloatTextElement.textContent = "";
      enemyFloatTextElement.className = "float-text hidden";
    }
    if (playerFloatTextElement) {
      playerFloatTextElement.textContent = "";
      playerFloatTextElement.className = "float-text player-float hidden";
    }
    state.pendingAttackPreview = null;
    if (attackPreviewElement) attackPreviewElement.textContent = "Ataque previsto: --";
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

function getPassiveByRace(raceKey) {
  return RACE_PASSIVES[raceKey] || RACE_PASSIVES.humano;
}

function getDominantRaceKey() {
  const score = Object.fromEntries(PASSIVE_PRIORITY.map((raceKey) => [raceKey, 0]));
  score.humano += 1;
  const summon = getActiveSummon();
  if (summon) score[summon.race] = (score[summon.race] || 0) + 2;
  state.party.forEach((member) => {
    score[member.race] = (score[member.race] || 0) + 1;
  });
  let bestRace = "humano";
  let bestScore = -1;
  PASSIVE_PRIORITY.forEach((raceKey) => {
    const value = score[raceKey] || 0;
    if (value > bestScore) {
      bestScore = value;
      bestRace = raceKey;
    }
  });
  return bestRace;
}

function getActivePassive() {
  const raceKey = getDominantRaceKey();
  return {
    raceKey,
    race: getRaceMeta(raceKey),
    passive: getPassiveByRace(raceKey),
  };
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
  if (key.includes("centinela")) return "guardian";
  if (key.includes("quimera")) return "beast";
  if (key.includes("oraculo")) return "witch";
  if (key.includes("soberano")) return "captain";
  return "default";
}

function drawEnemyPortrait(milestone) {
  const raceKey = milestone.race || "humano";
  const race = getRaceMeta(raceKey);
  const style = race.style || "fisico";
  const archetype = getEnemyArchetype(milestone.enemy);
  const cacheKey = `${milestone.enemy}|${raceKey}|${style}|${archetype}|v5`;
  if (ENEMY_PORTRAIT_CACHE.has(cacheKey)) return ENEMY_PORTRAIT_CACHE.get(cacheKey);

  const paletteByRace = {
    humano: { base: "#5f2f40", shade: "#1a1623", skin: "#cc9288", accent: "#f0c16c", line: "#28131a" },
    elfo: { base: "#2c584b", shade: "#132723", skin: "#a3d9c0", accent: "#79e7c6", line: "#15261f" },
    enano: { base: "#65432e", shade: "#211811", skin: "#bd8a62", accent: "#f4be84", line: "#2b1d12" },
    orco: { base: "#485d30", shade: "#192515", skin: "#82a75f", accent: "#c5f078", line: "#1f2914" },
    draconico: { base: "#7a3524", shade: "#27140d", skin: "#ba7c61", accent: "#ff9f66", line: "#2e140f" },
    umbrio: { base: "#4b3c68", shade: "#1a162f", skin: "#a18bc5", accent: "#d8b4ff", line: "#221533" },
    celestial: { base: "#315978", shade: "#152436", skin: "#a1cce0", accent: "#a8edff", line: "#172b3a" },
  };

  const palette = paletteByRace[raceKey] || paletteByRace.humano;
  const seed = hashString(cacheKey);
  const rand = makeRng(seed);

  const canvasEl = document.createElement("canvas");
  canvasEl.width = 768;
  canvasEl.height = 432;
  const ctx2d = canvasEl.getContext("2d");
  if (!ctx2d) return COMBAT_SCENE_ASSET;

  const centerX = canvasEl.width / 2;
  const centerY = canvasEl.height / 2;

  const bg = ctx2d.createLinearGradient(0, 0, canvasEl.width, canvasEl.height);
  bg.addColorStop(0, palette.shade);
  bg.addColorStop(0.45, palette.base);
  bg.addColorStop(1, "#0e1118");
  ctx2d.fillStyle = bg;
  ctx2d.fillRect(0, 0, canvasEl.width, canvasEl.height);

  for (let i = 0; i < 9; i += 1) {
    const x = rand() * canvasEl.width;
    const y = rand() * canvasEl.height;
    const radius = 80 + rand() * 220;
    const glow = ctx2d.createRadialGradient(x, y, 6, x, y, radius);
    glow.addColorStop(0, `${palette.accent}4a`);
    glow.addColorStop(1, `${palette.accent}00`);
    ctx2d.fillStyle = glow;
    ctx2d.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  const haze = ctx2d.createLinearGradient(0, 0, 0, canvasEl.height);
  haze.addColorStop(0, "rgba(255,255,255,0.06)");
  haze.addColorStop(0.6, "rgba(255,255,255,0)");
  haze.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx2d.fillStyle = haze;
  ctx2d.fillRect(0, 0, canvasEl.width, canvasEl.height);

  ctx2d.strokeStyle = "rgba(255,255,255,0.12)";
  ctx2d.lineWidth = 2;
  for (let i = 0; i < 6; i += 1) {
    const y = 30 + i * 72 + rand() * 16;
    ctx2d.beginPath();
    ctx2d.moveTo(0, y);
    ctx2d.bezierCurveTo(180, y - 20, 560, y + 20, canvasEl.width, y - 8);
    ctx2d.stroke();
  }

  const shoulderShadow = ctx2d.createRadialGradient(centerX, canvasEl.height + 8, 20, centerX, canvasEl.height + 8, 300);
  shoulderShadow.addColorStop(0, "rgba(0,0,0,0.5)");
  shoulderShadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx2d.fillStyle = shoulderShadow;
  ctx2d.fillRect(0, canvasEl.height - 130, canvasEl.width, 130);

  ctx2d.fillStyle = "rgba(0,0,0,0.34)";
  ctx2d.beginPath();
  ctx2d.ellipse(centerX, 374, 250, 52, 0, 0, Math.PI * 2);
  ctx2d.fill();

  const torso = ctx2d.createLinearGradient(centerX, 210, centerX, 400);
  torso.addColorStop(0, `${palette.base}`);
  torso.addColorStop(1, `${palette.shade}`);
  ctx2d.fillStyle = torso;
  ctx2d.beginPath();
  ctx2d.moveTo(214, 396);
  ctx2d.quadraticCurveTo(284, 262, centerX, 246);
  ctx2d.quadraticCurveTo(484, 262, 554, 396);
  ctx2d.closePath();
  ctx2d.fill();

  const neckGrad = ctx2d.createLinearGradient(centerX, 214, centerX, 306);
  neckGrad.addColorStop(0, `${palette.skin}`);
  neckGrad.addColorStop(1, `${palette.shade}`);
  ctx2d.fillStyle = neckGrad;
  fillRoundRect(ctx2d, centerX - 36, 214, 72, 84, 22);

  const skinGrad = ctx2d.createLinearGradient(centerX, 72, centerX, 304);
  skinGrad.addColorStop(0, "#f3ded2");
  skinGrad.addColorStop(0.4, palette.skin);
  skinGrad.addColorStop(1, `${palette.shade}`);
  ctx2d.fillStyle = skinGrad;
  ctx2d.beginPath();
  ctx2d.moveTo(centerX, 82);
  ctx2d.bezierCurveTo(298, 84, 242, 136, 244, 218);
  ctx2d.bezierCurveTo(248, 278, 286, 330, centerX, 336);
  ctx2d.bezierCurveTo(482, 330, 520, 278, 524, 218);
  ctx2d.bezierCurveTo(526, 136, 470, 84, centerX, 82);
  ctx2d.closePath();
  ctx2d.fill();

  const leftFaceShade = ctx2d.createLinearGradient(240, 130, 370, 300);
  leftFaceShade.addColorStop(0, "rgba(0,0,0,0.28)");
  leftFaceShade.addColorStop(1, "rgba(0,0,0,0)");
  ctx2d.fillStyle = leftFaceShade;
  ctx2d.beginPath();
  ctx2d.moveTo(centerX - 124, 134);
  ctx2d.quadraticCurveTo(centerX - 20, 188, centerX - 38, 302);
  ctx2d.quadraticCurveTo(centerX - 118, 276, centerX - 124, 134);
  ctx2d.closePath();
  ctx2d.fill();

  ctx2d.fillStyle = "rgba(0,0,0,0.2)";
  ctx2d.beginPath();
  ctx2d.moveTo(centerX - 68, 276);
  ctx2d.quadraticCurveTo(centerX, 302, centerX + 68, 276);
  ctx2d.quadraticCurveTo(centerX + 36, 338, centerX, 342);
  ctx2d.quadraticCurveTo(centerX - 36, 338, centerX - 68, 276);
  ctx2d.fill();

  const browY = 178 + Math.round(rand() * 6);
  const eyeSpan = 66 + Math.round(rand() * 8);
  const eyeHeight = style === "magico" ? 13 : 15;
  const eyeWidth = style === "magico" ? 46 : 42;

  ctx2d.fillStyle = "rgba(10, 12, 18, 0.92)";
  fillRoundRect(ctx2d, centerX - eyeSpan - eyeWidth / 2, browY, eyeWidth, eyeHeight, 6);
  fillRoundRect(ctx2d, centerX + eyeSpan - eyeWidth / 2, browY, eyeWidth, eyeHeight, 6);

  const eyeGlow = ctx2d.createRadialGradient(centerX - eyeSpan, browY + eyeHeight / 2, 2, centerX - eyeSpan, browY + eyeHeight / 2, 22);
  eyeGlow.addColorStop(0, `${palette.accent}`);
  eyeGlow.addColorStop(1, `${palette.accent}00`);
  ctx2d.fillStyle = eyeGlow;
  ctx2d.beginPath();
  ctx2d.arc(centerX - eyeSpan, browY + eyeHeight / 2, 22, 0, Math.PI * 2);
  ctx2d.fill();
  const eyeGlowB = ctx2d.createRadialGradient(centerX + eyeSpan, browY + eyeHeight / 2, 2, centerX + eyeSpan, browY + eyeHeight / 2, 22);
  eyeGlowB.addColorStop(0, `${palette.accent}`);
  eyeGlowB.addColorStop(1, `${palette.accent}00`);
  ctx2d.fillStyle = eyeGlowB;
  ctx2d.beginPath();
  ctx2d.arc(centerX + eyeSpan, browY + eyeHeight / 2, 22, 0, Math.PI * 2);
  ctx2d.fill();

  ctx2d.fillStyle = "#f3f7ff";
  ctx2d.beginPath();
  ctx2d.arc(centerX - eyeSpan, browY + eyeHeight / 2, 6, 0, Math.PI * 2);
  ctx2d.arc(centerX + eyeSpan, browY + eyeHeight / 2, 6, 0, Math.PI * 2);
  ctx2d.fill();

  const drawHorn = (x, y, leftSide) => {
    ctx2d.fillStyle = `${palette.accent}aa`;
    ctx2d.beginPath();
    if (leftSide) {
      ctx2d.moveTo(x, y);
      ctx2d.lineTo(x - 36, y - 46);
      ctx2d.lineTo(x + 10, y - 28);
    } else {
      ctx2d.moveTo(x, y);
      ctx2d.lineTo(x + 36, y - 46);
      ctx2d.lineTo(x - 10, y - 28);
    }
    ctx2d.closePath();
    ctx2d.fill();
  };

  const drawArcaneRing = () => {
    ctx2d.strokeStyle = `${palette.accent}cc`;
    ctx2d.lineWidth = 2.8;
    for (let i = 0; i < 3; i += 1) {
      ctx2d.beginPath();
      ctx2d.arc(centerX, 192, 120 + i * 18, 0.24, Math.PI - 0.24);
      ctx2d.stroke();
    }
  };

  if (archetype === "bandit" || archetype === "captain" || archetype === "archer") {
    ctx2d.fillStyle = "rgba(10, 12, 18, 0.88)";
    fillRoundRect(ctx2d, centerX - 106, browY - 24, 212, 18, 7);
    ctx2d.fillStyle = "rgba(10, 12, 18, 0.64)";
    fillRoundRect(ctx2d, centerX - 102, browY + 18, 30, 42, 8);
    fillRoundRect(ctx2d, centerX + 72, browY + 18, 30, 42, 8);
    ctx2d.strokeStyle = `${palette.accent}bb`;
    ctx2d.lineWidth = 2;
    ctx2d.strokeRect(centerX - 98, browY - 19, 196, 9);
  }

  if (archetype === "knight" || archetype === "guardian") {
    ctx2d.fillStyle = "rgba(38, 44, 58, 0.86)";
    fillRoundRect(ctx2d, centerX - 98, 116, 196, 36, 12);
    ctx2d.fillStyle = "rgba(228, 236, 247, 0.15)";
    fillRoundRect(ctx2d, centerX - 84, 124, 168, 10, 5);
    ctx2d.strokeStyle = "rgba(239,244,251,0.22)";
    ctx2d.strokeRect(centerX - 92, 120, 184, 24);
  }

  if (archetype === "witch" || style === "magico" || raceKey === "celestial") {
    drawArcaneRing();
  }

  if (archetype === "wolf" || archetype === "beast") {
    ctx2d.fillStyle = palette.skin;
    ctx2d.beginPath();
    ctx2d.moveTo(centerX - 88, 150);
    ctx2d.lineTo(centerX - 42, 66);
    ctx2d.lineTo(centerX - 16, 156);
    ctx2d.closePath();
    ctx2d.fill();
    ctx2d.beginPath();
    ctx2d.moveTo(centerX + 88, 150);
    ctx2d.lineTo(centerX + 42, 66);
    ctx2d.lineTo(centerX + 16, 156);
    ctx2d.closePath();
    ctx2d.fill();
  }

  if (archetype === "dragon" || raceKey === "draconico") {
    drawHorn(centerX - 52, 124, true);
    drawHorn(centerX + 52, 124, false);
    ctx2d.strokeStyle = `${palette.accent}88`;
    ctx2d.lineWidth = 3;
    ctx2d.beginPath();
    ctx2d.moveTo(centerX - 118, 238);
    ctx2d.lineTo(centerX - 60, 266);
    ctx2d.lineTo(centerX - 8, 246);
    ctx2d.stroke();
  }

  if (archetype === "archer") {
    ctx2d.strokeStyle = `${palette.accent}c8`;
    ctx2d.lineWidth = 3;
    ctx2d.beginPath();
    ctx2d.arc(centerX + 120, 220, 44, -1.35, 1.35);
    ctx2d.stroke();
    ctx2d.beginPath();
    ctx2d.moveTo(centerX + 120, 176);
    ctx2d.lineTo(centerX + 120, 264);
    ctx2d.stroke();
  }

  if (archetype === "captain") {
    ctx2d.fillStyle = "rgba(20,26,36,0.72)";
    fillRoundRect(ctx2d, centerX - 126, 124, 252, 26, 10);
    ctx2d.strokeStyle = `${palette.accent}99`;
    ctx2d.strokeRect(centerX - 116, 130, 232, 10);
  }

  const jawY = archetype === "wolf" || archetype === "beast" ? 274 : 282;
  const jawW = archetype === "knight" || archetype === "guardian" ? 108 : 100;
  ctx2d.fillStyle = style === "fisico" ? "#2d1f1a" : "#1c2637";
  fillRoundRect(ctx2d, centerX - (jawW + 8) / 2, jawY - 8, jawW + 8, 60, 14);
  ctx2d.fillStyle = style === "fisico" ? "#e8d8bc" : "#cbe9ff";
  fillRoundRect(ctx2d, centerX - jawW / 2, jawY, jawW, 44, 12);

  ctx2d.strokeStyle = "rgba(0,0,0,0.4)";
  ctx2d.lineWidth = 2.5;
  ctx2d.beginPath();
  ctx2d.moveTo(centerX + 2, 214);
  ctx2d.lineTo(centerX - 8, 248);
  ctx2d.lineTo(centerX + 10, 248);
  ctx2d.stroke();

  ctx2d.strokeStyle = "rgba(35, 24, 22, 0.62)";
  ctx2d.lineWidth = 2.4;
  ctx2d.beginPath();
  ctx2d.moveTo(centerX - 48, 260);
  ctx2d.quadraticCurveTo(centerX, 282, centerX + 48, 260);
  ctx2d.stroke();

  if (style === "fisico") {
    ctx2d.fillStyle = `${palette.shade}cc`;
    ctx2d.beginPath();
    ctx2d.moveTo(centerX - 84, 320);
    ctx2d.lineTo(centerX - 130, 384);
    ctx2d.lineTo(centerX - 44, 388);
    ctx2d.closePath();
    ctx2d.fill();
    ctx2d.beginPath();
    ctx2d.moveTo(centerX + 84, 320);
    ctx2d.lineTo(centerX + 52, 384);
    ctx2d.lineTo(centerX + 132, 384);
    ctx2d.closePath();
    ctx2d.fill();
  } else {
    ctx2d.strokeStyle = `${palette.accent}88`;
    ctx2d.lineWidth = 2.6;
    ctx2d.beginPath();
    ctx2d.moveTo(centerX - 108, 360);
    ctx2d.quadraticCurveTo(centerX, 334, centerX + 108, 360);
    ctx2d.stroke();
  }

  ctx2d.strokeStyle = `${palette.line}bb`;
  ctx2d.lineWidth = 2.2;
  ctx2d.strokeRect(2, 2, canvasEl.width - 4, canvasEl.height - 4);

  const rim = ctx2d.createRadialGradient(centerX, 178, 20, centerX, 178, 268);
  rim.addColorStop(0, `${palette.accent}5a`);
  rim.addColorStop(1, `${palette.accent}00`);
  ctx2d.fillStyle = rim;
  ctx2d.fillRect(0, 0, canvasEl.width, canvasEl.height);

  const vignette = ctx2d.createRadialGradient(centerX, centerY, 150, centerX, centerY, 430);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx2d.fillStyle = vignette;
  ctx2d.fillRect(0, 0, canvasEl.width, canvasEl.height);

  for (let i = 0; i < 520; i += 1) {
    const x = rand() * canvasEl.width;
    const y = rand() * canvasEl.height;
    const alpha = 0.03 + rand() * 0.04;
    ctx2d.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
    ctx2d.fillRect(x, y, 1, 1);
  }

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
  if (turn === "player") {
    if (state.activeEncounter) {
      const active = getActivePassive();
      const regen = active.passive.turnRegen || 0;
      if (regen > 0 && player.hp > 0) {
        const before = player.hp;
        player.hp = Math.min(getMaxHp(), player.hp + regen);
        const gained = player.hp - before;
        if (gained > 0) {
          battleLogElement.textContent = `Aura ${active.race.label}: recuperas ${gained} HP.`;
          logCombatEvent(`Pasiva ${active.passive.name}: +${gained} HP.`);
          updateCombatStats();
          updateStatsPanel();
        }
      }
    }
    refreshAttackPreview();
  } else {
    state.pendingAttackPreview = null;
    if (attackPreviewElement) attackPreviewElement.textContent = "Ataque previsto: --";
  }
}

function computeAttackOutcome(baseDamage, d20, playerRace, enemyRace) {
  const raceMult = getRaceDamageMultiplier(playerRace, enemyRace);
  const passive = getPassiveByRace(playerRace);
  let passiveMult = 1;
  if ((passive.lowHpDamageMult || 0) > 1 && player.hp <= getMaxHp() * 0.5) {
    passiveMult *= passive.lowHpDamageMult;
  }
  let finalDamage = Math.max(1, Math.round(baseDamage * raceMult * passiveMult));
  let rollText = `d20: ${d20}`;
  const critThreshold = Math.max(2, 20 - (passive.critWindowBonus || 0));
  if (d20 >= critThreshold) {
    finalDamage = Math.max(1, Math.round(finalDamage * 2));
    rollText = d20 === 20 ? "d20: 20 (CRITICO x2)" : `d20: ${d20} (CRITICO PASIVO x2)`;
  } else if (d20 === 1) {
    finalDamage = Math.max(1, Math.floor(finalDamage * 0.5));
    rollText = "d20: 1 (FALLO DURO x0.5)";
  }
  return { finalDamage, rollText, d20, baseDamage };
}

function refreshAttackPreview() {
  if (!state.activeEncounter || state.combatTurn !== "player") {
    state.pendingAttackPreview = null;
    if (attackPreviewElement) attackPreviewElement.textContent = "Ataque previsto: --";
    return;
  }

  const playerRace = getPlayerRaceKey();
  const enemyRace = state.activeEncounter.milestone.race || "humano";
  const baseDamage = getPlayerAtk() + Math.floor(Math.random() * 4);
  const d20 = Math.floor(Math.random() * 20) + 1;
  const outcome = computeAttackOutcome(baseDamage, d20, playerRace, enemyRace);
  state.pendingAttackPreview = outcome;
  if (attackPreviewElement) {
    attackPreviewElement.textContent = `Ataque previsto: ${outcome.finalDamage} dano (${outcome.rollText})`;
  }
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function loadAudioPrefs() {
  try {
    const raw = window.localStorage.getItem(AUDIO_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (typeof parsed.enabled === "boolean") state.audio.enabled = parsed.enabled;
    if (typeof parsed.volume === "number") state.audio.volume = Math.max(0, Math.min(1, parsed.volume));
    if (typeof parsed.worldThemeIndex === "number") {
      state.audio.worldThemeIndex = Math.max(0, Math.floor(parsed.worldThemeIndex)) % WORLD_THEME_PRESETS.length;
    }
    if (Array.isArray(parsed.customWorldNotes) && parsed.customWorldNotes.length >= 4) {
      const notes = parsed.customWorldNotes
        .map((note) => String(note).trim().toUpperCase())
        .filter((note) => AUDIO_NOTES[note]);
      state.audio.customWorldNotes = notes.length >= 4 ? notes.slice(0, 16) : null;
    }
  } catch {
    // Ignore invalid local storage payloads.
  }
}

function saveAudioPrefs() {
  try {
    window.localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(state.audio));
  } catch {
    // Storage may be unavailable in private mode.
  }
}

function getAudioContext() {
  if (audioRuntime.context) return audioRuntime.context;
  const ContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!ContextCtor) return null;

  const context = new ContextCtor();
  const masterGain = context.createGain();
  const bgmGain = context.createGain();
  masterGain.gain.value = state.audio.enabled ? state.audio.volume : 0;
  bgmGain.gain.value = 0.36;
  bgmGain.connect(masterGain);
  masterGain.connect(context.destination);

  audioRuntime.context = context;
  audioRuntime.masterGain = masterGain;
  audioRuntime.bgmGain = bgmGain;
  return context;
}

function updateAudioUI() {
  if (audioToggleButton) {
    audioToggleButton.textContent = state.audio.enabled ? "Audio: ON" : "Audio: OFF";
    audioToggleButton.classList.toggle("is-on", state.audio.enabled);
  }
  if (audioVolumeInput) {
    audioVolumeInput.value = String(Math.round(state.audio.volume * 100));
  }
  if (worldThemeButton) {
    const preset = WORLD_THEME_PRESETS[state.audio.worldThemeIndex] || WORLD_THEME_PRESETS[0];
    worldThemeButton.textContent = state.audio.customWorldNotes ? "Exterior: Custom" : `Exterior: ${preset.name}`;
  }
  if (composeThemeButton) {
    composeThemeButton.classList.toggle("is-on", Boolean(state.audio.customWorldNotes));
  }
}

function getWorldProfile() {
  if (Array.isArray(state.audio.customWorldNotes) && state.audio.customWorldNotes.length >= 4) {
    const pattern = state.audio.customWorldNotes.map((note) => AUDIO_NOTES[note]).filter(Boolean);
    if (pattern.length >= 4) {
      return { pattern, type: "square", gain: 0.13, beatMs: 340, token: "world:custom" };
    }
  }
  const preset = WORLD_THEME_PRESETS[state.audio.worldThemeIndex] || WORLD_THEME_PRESETS[0];
  return {
    pattern: preset.notes.map((note) => AUDIO_NOTES[note]).filter(Boolean),
    type: preset.type,
    gain: preset.gain,
    beatMs: preset.beatMs,
    token: `world:${preset.name}`,
  };
}

function applyAudioMaster() {
  if (!audioRuntime.masterGain || !audioRuntime.context) return;
  const target = state.audio.enabled ? state.audio.volume : 0;
  audioRuntime.masterGain.gain.setTargetAtTime(target, audioRuntime.context.currentTime, 0.03);
}

async function ensureAudioReady() {
  const context = getAudioContext();
  if (!context) return false;
  if (context.state === "suspended") {
    try {
      await context.resume();
    } catch {
      return false;
    }
  }
  audioRuntime.unlocked = context.state === "running";
  return true;
}

async function unlockAudioFromGesture() {
  if (!state.audio.enabled) return;
  const ready = await ensureAudioReady();
  if (!ready) return;
  applyAudioMaster();
  startBgmLoop();
}

function playTone(freq, durationMs, type = "sine", volume = 0.2, detune = 0) {
  const context = audioRuntime.context;
  if (!context || !audioRuntime.masterGain) return;
  if (!state.audio.enabled) return;

  const now = context.currentTime;
  const gain = context.createGain();
  const osc = context.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  osc.detune.setValueAtTime(detune, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume), now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
  osc.connect(gain);
  gain.connect(audioRuntime.masterGain);
  osc.start(now);
  osc.stop(now + durationMs / 1000 + 0.03);
}

function playImpactHitSfx() {
  const context = audioRuntime.context;
  if (!context || !audioRuntime.masterGain || !state.audio.enabled) return;
  const now = context.currentTime;

  // Body thump.
  const bodyOsc = context.createOscillator();
  const bodyGain = context.createGain();
  const bodyFilter = context.createBiquadFilter();
  bodyFilter.type = "lowpass";
  bodyFilter.frequency.setValueAtTime(220, now);
  bodyOsc.type = "triangle";
  bodyOsc.frequency.setValueAtTime(132, now);
  bodyOsc.frequency.exponentialRampToValueAtTime(74, now + 0.11);
  bodyGain.gain.setValueAtTime(0.0001, now);
  bodyGain.gain.exponentialRampToValueAtTime(0.14, now + 0.01);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
  bodyOsc.connect(bodyFilter);
  bodyFilter.connect(bodyGain);
  bodyGain.connect(audioRuntime.masterGain);
  bodyOsc.start(now);
  bodyOsc.stop(now + 0.16);

  // High crack transient.
  const crackOsc = context.createOscillator();
  const crackGain = context.createGain();
  const crackFilter = context.createBiquadFilter();
  crackFilter.type = "bandpass";
  crackFilter.frequency.setValueAtTime(1600, now);
  crackFilter.Q.value = 1.8;
  crackOsc.type = "square";
  crackOsc.frequency.setValueAtTime(760, now);
  crackOsc.frequency.exponentialRampToValueAtTime(420, now + 0.045);
  crackGain.gain.setValueAtTime(0.0001, now);
  crackGain.gain.exponentialRampToValueAtTime(0.05, now + 0.004);
  crackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  crackOsc.connect(crackFilter);
  crackFilter.connect(crackGain);
  crackGain.connect(audioRuntime.masterGain);
  crackOsc.start(now);
  crackOsc.stop(now + 0.06);

  // Short noise burst for contact texture.
  const noiseLength = Math.floor(context.sampleRate * 0.07);
  const noiseBuffer = context.createBuffer(1, noiseLength, context.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseLength; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / noiseLength);
  const noiseSrc = context.createBufferSource();
  const noiseFilter = context.createBiquadFilter();
  const noiseGain = context.createGain();
  noiseFilter.type = "highpass";
  noiseFilter.frequency.setValueAtTime(900, now);
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.045, now + 0.004);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
  noiseSrc.buffer = noiseBuffer;
  noiseSrc.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(audioRuntime.masterGain);
  noiseSrc.start(now);
  noiseSrc.stop(now + 0.08);
}

function playWolfHowlSfx() {
  const context = audioRuntime.context;
  if (!context || !audioRuntime.masterGain || !state.audio.enabled) return;
  const now = context.currentTime;

  // Castlevania-like core: darker pulse + triangle, slight detune, shorter attack.
  const corePulse = context.createOscillator();
  const coreTri = context.createOscillator();
  const coreGain = context.createGain();
  const coreFilter = context.createBiquadFilter();
  corePulse.type = "square";
  coreTri.type = "triangle";
  corePulse.frequency.setValueAtTime(232, now);
  corePulse.frequency.exponentialRampToValueAtTime(340, now + 0.3);
  corePulse.frequency.exponentialRampToValueAtTime(212, now + 1.22);
  coreTri.frequency.setValueAtTime(220, now);
  coreTri.frequency.exponentialRampToValueAtTime(320, now + 0.32);
  coreTri.frequency.exponentialRampToValueAtTime(202, now + 1.26);
  coreTri.detune.setValueAtTime(-8, now);
  coreFilter.type = "bandpass";
  coreFilter.frequency.setValueAtTime(720, now);
  coreFilter.Q.value = 1.3;
  coreGain.gain.setValueAtTime(0.0001, now);
  coreGain.gain.exponentialRampToValueAtTime(0.1, now + 0.028);
  coreGain.gain.exponentialRampToValueAtTime(0.052, now + 0.56);
  coreGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
  corePulse.connect(coreFilter);
  coreTri.connect(coreFilter);
  coreFilter.connect(coreGain);
  coreGain.connect(audioRuntime.masterGain);
  corePulse.start(now);
  coreTri.start(now);
  corePulse.stop(now + 1.45);
  coreTri.stop(now + 1.45);

  // Controlled noise for throat/air texture.
  const noiseLength = Math.floor(context.sampleRate * 1.35);
  const noiseBuffer = context.createBuffer(1, noiseLength, context.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseLength; i += 1) {
    const t = i / noiseLength;
    const env = t < 0.1 ? t / 0.1 : 1 - (t - 0.1) / 0.9;
    data[i] = (Math.random() * 2 - 1) * env;
  }
  const breath = context.createBufferSource();
  const breathFilter = context.createBiquadFilter();
  const breathGain = context.createGain();
  breath.buffer = noiseBuffer;
  breathFilter.type = "bandpass";
  breathFilter.frequency.setValueAtTime(860, now);
  breathFilter.Q.value = 1.15;
  breathGain.gain.setValueAtTime(0.0001, now);
  breathGain.gain.exponentialRampToValueAtTime(0.05, now + 0.03);
  breathGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.32);
  breath.connect(breathFilter);
  breathFilter.connect(breathGain);
  breathGain.connect(audioRuntime.masterGain);
  breath.start(now);
  breath.stop(now + 1.34);

  // Dark echo tail.
  const echo = context.createOscillator();
  const echoGain = context.createGain();
  const echoFilter = context.createBiquadFilter();
  echo.type = "triangle";
  echo.frequency.setValueAtTime(194, now + 0.68);
  echo.frequency.exponentialRampToValueAtTime(162, now + 1.36);
  echoFilter.type = "lowpass";
  echoFilter.frequency.setValueAtTime(540, now + 0.68);
  echoGain.gain.setValueAtTime(0.0001, now + 0.66);
  echoGain.gain.exponentialRampToValueAtTime(0.03, now + 0.72);
  echoGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.46);
  echo.connect(echoFilter);
  echoFilter.connect(echoGain);
  echoGain.connect(audioRuntime.masterGain);
  echo.start(now + 0.66);
  echo.stop(now + 1.5);
}

function playWolfGrowlSfx() {
  const context = audioRuntime.context;
  if (!context || !audioRuntime.masterGain || !state.audio.enabled) return;
  const now = context.currentTime;

  // Dual detuned oscillators for raspy throat.
  const growlA = context.createOscillator();
  const growlB = context.createOscillator();
  const growlGain = context.createGain();
  const growlFilter = context.createBiquadFilter();
  growlA.type = "sawtooth";
  growlB.type = "triangle";
  growlA.frequency.setValueAtTime(190, now);
  growlA.frequency.exponentialRampToValueAtTime(145, now + 0.2);
  growlB.frequency.setValueAtTime(176, now);
  growlB.frequency.exponentialRampToValueAtTime(132, now + 0.2);
  growlFilter.type = "lowpass";
  growlFilter.frequency.setValueAtTime(620, now);
  growlFilter.Q.value = 0.8;
  growlGain.gain.setValueAtTime(0.0001, now);
  growlGain.gain.exponentialRampToValueAtTime(0.09, now + 0.02);
  growlGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
  growlA.connect(growlFilter);
  growlB.connect(growlFilter);
  growlFilter.connect(growlGain);
  growlGain.connect(audioRuntime.masterGain);
  growlA.start(now);
  growlB.start(now);
  growlA.stop(now + 0.28);
  growlB.stop(now + 0.28);

  // Short noisy bite transient.
  const noiseLength = Math.floor(context.sampleRate * 0.12);
  const noiseBuffer = context.createBuffer(1, noiseLength, context.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseLength; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / noiseLength);
  const bite = context.createBufferSource();
  const biteFilter = context.createBiquadFilter();
  const biteGain = context.createGain();
  bite.buffer = noiseBuffer;
  biteFilter.type = "bandpass";
  biteFilter.frequency.setValueAtTime(820, now);
  biteFilter.Q.value = 1.1;
  biteGain.gain.setValueAtTime(0.0001, now);
  biteGain.gain.exponentialRampToValueAtTime(0.035, now + 0.01);
  biteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
  bite.connect(biteFilter);
  biteFilter.connect(biteGain);
  biteGain.connect(audioRuntime.masterGain);
  bite.start(now);
  bite.stop(now + 0.12);
}

function semitoneShift(freq, semitones) {
  return freq * Math.pow(2, semitones / 12);
}

function playBgmVoice(freq, type, gainValue, durationSec, attackSec = 0.02, releaseSec = 0.16, detune = 0) {
  const context = audioRuntime.context;
  if (!context || !audioRuntime.bgmGain || !state.audio.enabled) return;
  const now = context.currentTime;
  const osc = context.createOscillator();
  const gain = context.createGain();
  const lowPass = context.createBiquadFilter();
  lowPass.type = "lowpass";
  lowPass.frequency.setValueAtTime(1400, now);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  osc.detune.setValueAtTime(detune, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0008, gainValue), now + attackSec);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(attackSec + 0.04, durationSec - releaseSec));
  osc.connect(lowPass);
  lowPass.connect(gain);
  gain.connect(audioRuntime.bgmGain);
  osc.start(now);
  osc.stop(now + durationSec + 0.03);
}

function playHeartbeat(level) {
  const context = audioRuntime.context;
  if (!context || !audioRuntime.masterGain || !state.audio.enabled) return;
  const baseByLevel = { medium: 62, high: 56, critical: 48 };
  const volByLevel = { medium: 0.05, high: 0.07, critical: 0.1 };
  const base = baseByLevel[level] || 62;
  const volume = volByLevel[level] || 0.05;
  const now = context.currentTime;

  const makeBeat = (offset, gainScale, decay) => {
    const osc = context.createOscillator();
    const gain = context.createGain();
    const lowPass = context.createBiquadFilter();
    lowPass.type = "lowpass";
    lowPass.frequency.setValueAtTime(190, now + offset);
    lowPass.Q.value = 0.9;
    osc.type = "triangle";
    osc.frequency.setValueAtTime(base, now + offset);
    gain.gain.setValueAtTime(0.0001, now + offset);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume * gainScale), now + offset + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + decay);
    osc.connect(lowPass);
    lowPass.connect(gain);
    gain.connect(audioRuntime.masterGain);
    osc.start(now + offset);
    osc.stop(now + offset + decay + 0.03);
  };

  // lub
  makeBeat(0, 1, 0.17);
  // dub (shorter second beat)
  makeBeat(0.14, 0.72, 0.11);
}

function playDreadSting(level) {
  const context = audioRuntime.context;
  if (!context || !audioRuntime.masterGain || !state.audio.enabled) return;
  const now = context.currentTime;
  const isCritical = level === "critical";
  const base = isCritical ? 44 : 52;
  const peak = isCritical ? 0.08 : 0.055;

  const osc = context.createOscillator();
  const sub = context.createOscillator();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  osc.type = "sawtooth";
  sub.type = "triangle";
  osc.frequency.setValueAtTime(base, now);
  osc.frequency.exponentialRampToValueAtTime(base * 0.7, now + (isCritical ? 0.6 : 0.42));
  sub.frequency.setValueAtTime(base * 0.5, now);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(isCritical ? 360 : 430, now);
  filter.Q.value = 0.9;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (isCritical ? 0.64 : 0.45));

  osc.connect(filter);
  sub.connect(filter);
  filter.connect(gain);
  gain.connect(audioRuntime.masterGain);

  osc.start(now);
  sub.start(now);
  osc.stop(now + (isCritical ? 0.7 : 0.52));
  sub.stop(now + (isCritical ? 0.7 : 0.52));
}

function playSfx(kind) {
  if (!audioRuntime.context || !state.audio.enabled) return;
  if (kind === "ui") playTone(AUDIO_NOTES.E4, 60, "triangle", 0.07);
  if (kind === "move") playTone(AUDIO_NOTES.C4, 45, "square", 0.04);
  if (kind === "encounter") playTone(AUDIO_NOTES.D4, 120, "sawtooth", 0.08, -80);
  if (kind === "attack") playImpactHitSfx();
  if (kind === "crit") {
    playTone(AUDIO_NOTES.A4, 85, "triangle", 0.11);
    setTimeout(() => playTone(AUDIO_NOTES.C4 * 2, 120, "triangle", 0.1), 65);
  }
  if (kind === "enemyHit") playTone(AUDIO_NOTES.C4, 100, "sawtooth", 0.09, -120);
  if (kind === "heal") playTone(AUDIO_NOTES.E4, 130, "sine", 0.11);
  if (kind === "escape") playTone(AUDIO_NOTES.G4, 95, "triangle", 0.09);
  if (kind === "victory") {
    playTone(AUDIO_NOTES.C4, 140, "triangle", 0.1);
    setTimeout(() => playTone(AUDIO_NOTES.E4, 150, "triangle", 0.1), 120);
    setTimeout(() => playTone(AUDIO_NOTES.G4, 180, "triangle", 0.1), 250);
  }
  if (kind === "defeat") playTone(AUDIO_NOTES.C4, 260, "sawtooth", 0.11, -220);
  if (kind === "threatPulse") {
    const level = state.worldThreat.level;
    if (level === "medium" || level === "high" || level === "critical") playHeartbeat(level);
  }
}

function startBgmLoop() {
  if (!audioRuntime.context || !audioRuntime.bgmGain || audioRuntime.bgmTimer) return;
  audioRuntime.bgmStep = 0;
  const tick = () => {
    if (!state.audio.enabled || !audioRuntime.context || !audioRuntime.bgmGain) return;
    let profileKey = "world";
    if (player.won) profileKey = "victory";
    else if (state.activeEncounter) profileKey = "battle";
    else if (state.gameScreen === "lore") profileKey = "lore";
    let profile = BGM_PROFILES[profileKey] || BGM_PROFILES.world;
    let profileToken = profileKey;
    if (profileKey === "world") {
      profile = getWorldProfile();
      profileToken = profile.token;
    }
    if (audioRuntime.currentBgmProfile !== profileToken) {
      audioRuntime.currentBgmProfile = profileToken;
      audioRuntime.bgmStep = 0;
    }
    const base = profile.pattern[audioRuntime.bgmStep % profile.pattern.length];
    const leadType = profile.type || "triangle";
    const beatMs = profile.beatMs || 420;
    const beatSec = beatMs / 1000;
    const leadGain = profile.gain ?? 0.11;
    const harmonyGain = profile.harmonyGain ?? 0.045;
    const bassGain = profile.bassGain ?? 0.04;
    const accentGain = profile.accentGain ?? 0.03;
    const harmonySemitones = profile.harmonySemitones || [7];
    const bassSteps = profile.bassSteps || [-12, -7, -5, -12];

    // Lead line
    playBgmVoice(base, leadType, leadGain, Math.min(0.38, beatSec * 0.85), 0.018, 0.15);

    // Harmony voice alternates to avoid static loops.
    const harmonyShift = harmonySemitones[audioRuntime.bgmStep % harmonySemitones.length];
    playBgmVoice(semitoneShift(base, harmonyShift), "triangle", harmonyGain, Math.min(0.34, beatSec * 0.78), 0.03, 0.16, 4);

    // Bass anchors rhythm.
    const bassShift = bassSteps[audioRuntime.bgmStep % bassSteps.length];
    playBgmVoice(semitoneShift(base, bassShift), "square", bassGain, Math.min(0.22, beatSec * 0.58), 0.012, 0.11, -6);

    // Rhythmic accent on alternating beats.
    if (audioRuntime.bgmStep % 2 === 0) {
      playBgmVoice(semitoneShift(base, 12), "sine", accentGain, Math.min(0.14, beatSec * 0.42), 0.01, 0.08, 2);
    }

    // Extra edge in battle.
    if (profileKey === "battle" && audioRuntime.bgmStep % 3 === 0) {
      playBgmVoice(semitoneShift(base, -19), "sawtooth", 0.045, Math.min(0.16, beatSec * 0.5), 0.01, 0.08, -9);
    }

    audioRuntime.bgmStep += 1;
    audioRuntime.bgmTimer = window.setTimeout(tick, beatMs);
  };
  tick();
}

function stopBgmLoop() {
  if (!audioRuntime.bgmTimer) return;
  clearTimeout(audioRuntime.bgmTimer);
  audioRuntime.bgmTimer = null;
}

async function setAudioEnabled(enabled) {
  state.audio.enabled = enabled;
  if (enabled && state.audio.volume < 0.05) state.audio.volume = 0.65;
  updateAudioUI();
  saveAudioPrefs();
  if (enabled) {
    const ready = await ensureAudioReady();
    if (!ready) {
      state.audio.enabled = false;
      updateAudioUI();
      messageElement.textContent = "Audio bloqueado por navegador. Intenta otro click en Audio.";
      return;
    }
    applyAudioMaster();
    startBgmLoop();
    playSfx("ui");
    messageElement.textContent = "Audio activado.";
    return;
  }
  applyAudioMaster();
  stopBgmLoop();
  messageElement.textContent = "Audio desactivado.";
}

function setAudioVolume(volumeValue) {
  state.audio.volume = Math.max(0, Math.min(1, volumeValue));
  applyAudioMaster();
  updateAudioUI();
  saveAudioPrefs();
}

function composeWorldTheme() {
  const base =
    (Array.isArray(state.audio.customWorldNotes) && state.audio.customWorldNotes.join(" ")) ||
    WORLD_THEME_PRESETS[state.audio.worldThemeIndex].notes.join(" ");
  const input = window.prompt(
    "Compone tema exterior (4-16 notas). Usa notas como: C4 D4 E4 F4 G4 A4 B3 C5 D5. Deja vacio para quitar custom.",
    base,
  );
  if (input === null) return;
  const trimmed = input.trim();
  if (!trimmed) {
    state.audio.customWorldNotes = null;
    audioRuntime.currentBgmProfile = "";
    updateAudioUI();
    saveAudioPrefs();
    messageElement.textContent = "Composicion exterior eliminada. Volviendo a preset.";
    playSfx("ui");
    return;
  }

  const notes = trimmed
    .split(/[\s,]+/)
    .map((note) => note.trim().toUpperCase())
    .filter(Boolean);
  if (notes.length < 4 || notes.length > 16 || notes.some((note) => !AUDIO_NOTES[note])) {
    messageElement.textContent = "Notas invalidas. Usa 4-16 notas validas (ej: C4 E4 G4 D4).";
    return;
  }
  state.audio.customWorldNotes = notes;
  audioRuntime.currentBgmProfile = "";
  updateAudioUI();
  saveAudioPrefs();
  messageElement.textContent = `Composicion exterior guardada (${notes.length} notas).`;
  playSfx("ui");
}

function syncDocumentTitleWithVersion() {
  const versionLabel = document.querySelector(".version")?.textContent?.trim() || "UI v0.0.0";
  document.title = `Character Map RPG | ${versionLabel}`;
}

async function playTemporaryClass(element, className, ms) {
  element.classList.add(className);
  await wait(ms);
  element.classList.remove(className);
}

async function showFloatingText(element, text, className, ms = 760) {
  if (!element) return;
  element.textContent = text;
  element.className = `float-text ${className} float-pop`;
  await wait(ms);
  element.className = element.id === "player-float-text" ? "float-text player-float hidden" : "float-text hidden";
  element.textContent = "";
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
  const passive = getActivePassive().passive;
  return player.baseAtk + getPartyBonus().atk + getSummonBonus().atk + getEquipmentBonus().atk + (passive.atkFlat || 0);
}

function getPlayerDef() {
  const passive = getActivePassive().passive;
  return player.baseDef + getPartyBonus().def + getSummonBonus().def + getEquipmentBonus().def + (passive.defFlat || 0);
}

function getPlayerRaceKey() {
  return getActivePassive().raceKey;
}

function getRaceDamageMultiplier(attackerRaceKey, defenderRaceKey) {
  const AURA_ADVANTAGE = {
    humano: "umbrio",
    elfo: "orco",
    enano: "draconico",
    orco: "humano",
    draconico: "elfo",
    umbrio: "celestial",
    celestial: "enano",
  };

  const attacker = getRaceMeta(attackerRaceKey);
  const defender = getRaceMeta(defenderRaceKey);
  let multiplier = 1;

  if (attacker.dominateAll) multiplier *= 1.22;
  if (defender.dominateAll) multiplier *= 0.82;
  if (attacker.style === "fisico" && defender.style === "magico") multiplier *= 1.08;
  if (attacker.style === "magico" && defender.style === "fisico") multiplier *= 1.08;
  if (AURA_ADVANTAGE[attackerRaceKey] === defenderRaceKey) multiplier *= 1.2;
  if (AURA_ADVANTAGE[defenderRaceKey] === attackerRaceKey) multiplier *= 0.85;

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

function setInventoryOverlayOpen(isOpen) {
  if (!inventoryOverlay) return;
  inventoryOverlay.classList.toggle("hidden", !isOpen);
  inventoryOverlay.setAttribute("aria-hidden", String(!isOpen));
  if (isOpen) renderInventory();
}

function setLevelSkipOverlayOpen(isOpen) {
  if (!levelSkipOverlay) return;
  levelSkipOverlay.classList.toggle("hidden", !isOpen);
  levelSkipOverlay.setAttribute("aria-hidden", String(!isOpen));
  if (isOpen && levelSkipInput) {
    populateLevelRouteOptions();
    levelSkipInput.value = String(player.level);
    if (levelSkipRouteInput) levelSkipRouteInput.value = state.routeId;
    levelSkipInput.focus();
    levelSkipInput.select();
  }
}

function populateLevelRouteOptions() {
  if (!levelSkipRouteInput) return;
  levelSkipRouteInput.innerHTML = ROUTE_ORDER
    .map((routeId, index) => `<option value="${routeId}">Ruta ${index + 1} (${ROUTES[routeId].label})</option>`)
    .join("");
}

function setPlayerLevelExact(targetLevel) {
  player.level = PLAYER_LEVEL_BASE.level;
  player.exp = PLAYER_LEVEL_BASE.exp;
  player.nextExp = PLAYER_LEVEL_BASE.nextExp;
  player.baseMaxHp = PLAYER_LEVEL_BASE.baseMaxHp;
  player.baseAtk = PLAYER_LEVEL_BASE.baseAtk;
  player.baseDef = PLAYER_LEVEL_BASE.baseDef;

  while (player.level < targetLevel) {
    player.level += 1;
    player.nextExp = Math.floor(player.nextExp * 1.35);
    player.baseMaxHp += 3;
    player.baseAtk += 1;
    player.baseDef += 1;
  }
  player.hp = getMaxHp();
}

function applyLevelSkipFromInput() {
  if (!levelSkipInput) return;
  if (state.activeEncounter) {
    messageElement.textContent = "No puedes saltar nivel durante combate.";
    return;
  }
  const requested = Math.floor(Number(levelSkipInput.value));
  const target = Math.max(1, Math.min(99, Number.isFinite(requested) ? requested : player.level));
  levelSkipInput.value = String(target);

  const before = player.level;
  if (target === before) {
    messageElement.textContent = `Ya estas en nivel ${before}.`;
    return;
  }

  setPlayerLevelExact(target);
  updateStatsPanel();
  updateCombatStats();
  updateStatus();
  playSfx("ui");
  messageElement.textContent = `Debug nivel: ${before} -> ${player.level}.`;
  setLevelSkipOverlayOpen(false);
}

function applyRouteSkipFromInput() {
  if (!levelSkipRouteInput) return;
  if (state.activeEncounter) {
    messageElement.textContent = "No puedes saltar de ruta durante combate.";
    return;
  }
  if (state.gameScreen === "start") {
    messageElement.textContent = "Pulsa Jugar para habilitar salto de ruta.";
    return;
  }

  const targetRouteId = levelSkipRouteInput.value;
  if (!ROUTES[targetRouteId]) {
    messageElement.textContent = "Ruta invalida.";
    return;
  }
  if (targetRouteId === state.routeId) {
    messageElement.textContent = `Ya estas en ${state.route.label}.`;
    return;
  }

  if (state.gameScreen === "lore") {
    state.gameScreen = "playing";
    loreScreen.classList.add("hidden");
  }

  const fromLabel = state.route.label;
  playSfx("ui");
  switchRoute(targetRouteId, `Debug ruta: ${fromLabel} -> ${ROUTES[targetRouteId].label}.`);
  setLevelSkipOverlayOpen(false);
}

function getSelectedInventoryItem() {
  if (!state.inventorySelectedItemId) return null;
  return state.inventory.find((entry) => entry.id === state.inventorySelectedItemId) || null;
}

function setSelectedInventoryItem(itemId) {
  state.inventorySelectedItemId = itemId || null;
  renderInventory();
}

function renderInventoryGrid() {
  if (!inventoryGridElement) return;
  const slots = 12;
  const selectedId = state.inventorySelectedItemId;
  const cells = [];
  for (let i = 0; i < slots; i += 1) {
    const item = state.inventory[i];
    if (!item) {
      cells.push('<button class="inventory-slot empty" type="button" disabled>Vacio</button>');
      continue;
    }
    const def = ITEM_DEFS[item.type];
    const activeClass = selectedId === item.id ? " is-active" : "";
    cells.push(
      `<button class="inventory-slot${activeClass}" data-inventory-slot-id="${item.id}" type="button"><div><strong>${def.name}</strong><span>x${item.qty}</span></div></button>`,
    );
  }
  inventoryGridElement.innerHTML = cells.join("");
}

function renderInventoryDetails() {
  if (!inventoryDetailNameElement || !inventoryDetailEffectElement || !inventoryDetailQtyElement) return;
  const selected = getSelectedInventoryItem();
  if (!selected) {
    inventoryDetailNameElement.textContent = "Sin item seleccionado";
    inventoryDetailEffectElement.textContent = "Abre el inventario y elige un objeto.";
    inventoryDetailQtyElement.textContent = "Cantidad: --";
    if (inventoryUseButton) inventoryUseButton.disabled = true;
    if (inventoryDropButton) inventoryDropButton.disabled = true;
    return;
  }
  const def = ITEM_DEFS[selected.type];
  inventoryDetailNameElement.textContent = def.name;
  inventoryDetailEffectElement.textContent = def.effect;
  inventoryDetailQtyElement.textContent = `Cantidad: ${selected.qty}`;
  if (inventoryUseButton) inventoryUseButton.disabled = false;
  if (inventoryDropButton) inventoryDropButton.disabled = false;
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
  } else {
    const markup = state.inventory
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
    inventoryListElement.innerHTML = markup;
  }
  if (!getSelectedInventoryItem()) {
    state.inventorySelectedItemId = state.inventory[0]?.id || null;
  }
  renderInventoryGrid();
  renderInventoryDetails();
  updateStatus();
}

async function handleInventoryActionById(action, itemId) {
  if (!itemId) return;
  if (action === "use") {
    playSfx("ui");
    if (state.activeEncounter) {
      await runPlayerAction(async () => {
        await useItemById(itemId);
      });
      setInventoryOverlayOpen(false);
      return;
    }
    await useItemById(itemId);
    setInventoryOverlayOpen(false);
    return;
  }
  if (action === "drop") {
    dropItemById(itemId);
    if (!getSelectedInventoryItem()) state.inventorySelectedItemId = state.inventory[0]?.id || null;
    renderInventory();
  }
}

async function handleInventoryAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;
  const action = target.getAttribute("data-action");
  const itemId = Number(target.getAttribute("data-item-id"));
  await handleInventoryActionById(action, itemId);
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
  player.visualX = route.start.x * TILE;
  player.visualY = route.start.y * TILE;
  player.hp = getMaxHp();
  player.won = false;
  state.walkAnim = null;
  state.activeEncounter = null;

  route.milestones.forEach((milestone) => {
    milestone.completed = false;
    milestone.x = milestone.spawnX;
    milestone.y = milestone.spawnY;
    milestone.aiMode = "idle";
  });
  state.routeState[state.routeId] = { x: route.start.x, y: route.start.y, initialized: true };

  state.combatLocked = false;
  setCombatTurn("player");
  setCombatControlsEnabled(true);
  setCombatModalOpen(false);
  state.enemyAiLastStepAt = 0;
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
  player.visualX = spawn.x * TILE;
  player.visualY = spawn.y * TILE;
  player.won = false;
  state.walkAnim = null;
  state.activeEncounter = null;
  state.combatLocked = false;
  setCombatTurn("player");
  setCombatControlsEnabled(true);
  setCombatModalOpen(false);
  state.enemyAiLastStepAt = 0;
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

function canEnemyMoveTo(nextX, nextY, movingMilestoneId) {
  if (!canMove(nextX, nextY)) return false;
  if (nextX === player.x && nextY === player.y) return true;
  const occupied = state.route.milestones.some(
    (milestone) => !milestone.completed && milestone.id !== movingMilestoneId && milestone.x === nextX && milestone.y === nextY,
  );
  return !occupied;
}

function hasLineOfSight(fromX, fromY, toX, toY) {
  const map = state.route.map;
  let x0 = fromX;
  let y0 = fromY;
  const x1 = toX;
  const y1 = toY;
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (!(x0 === x1 && y0 === y1)) {
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
    if (x0 === x1 && y0 === y1) return true;
    if (y0 < 0 || y0 >= map.length || x0 < 0 || x0 >= map[0].length) return false;
    if (map[y0][x0] === 1) return false;
  }
  return true;
}

function getMilestoneAt(x, y) {
  return state.route.milestones.find((milestone) => milestone.x === x && milestone.y === y);
}

function tryMoveMilestone(milestone, dx, dy) {
  if (dx === 0 && dy === 0) return false;
  const nextX = milestone.x + dx;
  const nextY = milestone.y + dy;
  if (!canEnemyMoveTo(nextX, nextY, milestone.id)) return false;
  milestone.x = nextX;
  milestone.y = nextY;
  return true;
}

function updateEnemyAi(now) {
  if (state.gameScreen !== "playing") return;
  if (state.activeEncounter || state.walkAnim) return;
  if (now - state.enemyAiLastStepAt < 760) return;
  state.enemyAiLastStepAt = now;

  const pending = state.route.milestones.filter((milestone) => !milestone.completed);
  pending.forEach((milestone) => {
    const dx = player.x - milestone.x;
    const dy = player.y - milestone.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const distance = Math.hypot(dx, dy);
    const canSeePlayer = hasLineOfSight(milestone.x, milestone.y, player.x, player.y);
    const shouldChase = distance <= 6.2 && canSeePlayer;
    milestone.aiMode = shouldChase ? "chase" : "idle";

    const stepX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
    const stepY = dy === 0 ? 0 : dy > 0 ? 1 : -1;
    let moved = false;

    if (milestone.aiMode === "chase") {
      const first = absDx >= absDy ? [stepX, 0] : [0, stepY];
      const second = absDx >= absDy ? [0, stepY] : [stepX, 0];
      moved = tryMoveMilestone(milestone, first[0], first[1]) || tryMoveMilestone(milestone, second[0], second[1]);
      if (!moved) moved = tryMoveMilestone(milestone, -first[0], -first[1]) || tryMoveMilestone(milestone, -second[0], -second[1]);
    } else if (Math.random() < 0.16 + milestone.aiPatrolBias) {
      const options = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];
      for (let i = options.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      moved = options.some(([mx, my]) => tryMoveMilestone(milestone, mx, my));
    }

    if (moved && milestone.x === player.x && milestone.y === player.y && !state.activeEncounter) {
      messageElement.textContent = `Te encontro ${milestone.enemy}.`;
      startEncounter(milestone);
    }
  });
}

function updateStatus() {
  const completed = state.route.milestones.filter((milestone) => milestone.completed).length;
  const worldVisual = getWorldVisualPreset();
  const worldLabel =
    worldVisual.label === "purificado"
      ? "Purificado"
      : worldVisual.label === "fracturado"
        ? "Fracturado"
        : worldVisual.label === "corrupto"
          ? "Corrupto"
          : "Neutral";
  const threatLabel =
    state.worldThreat.level === "critical"
      ? "Critica"
      : state.worldThreat.level === "high"
        ? "Alta"
        : state.worldThreat.level === "medium"
          ? "Media"
          : "Baja";
  statusElement.textContent = `${state.route.label} | Hitos: ${completed}/${state.route.milestones.length} | Estado: ${worldLabel} | Nivel: ${player.level} | Items: ${getTotalItems()} | Esencia: ${state.summonEssence} | Amenaza: ${threatLabel}`;
  updateProgressPanel();
}

function updateCombatStats() {
  if (!state.activeEncounter) return;
  combatStatsElement.textContent = `HP jugador: ${player.hp}/${getMaxHp()} | HP enemigo: ${state.activeEncounter.hp}`;
  const playerPercent = (player.hp / getMaxHp()) * 100;
  const enemyPercent = (state.activeEncounter.hp / state.activeEncounter.milestone.hp) * 100;
  animateHpFill("player", Math.max(0, Math.min(100, playerPercent)));
  animateHpFill("enemy", Math.max(0, Math.min(100, enemyPercent)));
}

function animateHpFill(kind, targetPercent, immediate = false) {
  const element = kind === "player" ? playerHpFillElement : enemyHpFillElement;
  if (!element) return;
  const previous = state.hpVisual[kind] ?? targetPercent;
  const clampedTarget = Math.max(0, Math.min(100, targetPercent));

  if (state.hpAnimationFrame[kind]) {
    cancelAnimationFrame(state.hpAnimationFrame[kind]);
    state.hpAnimationFrame[kind] = null;
  }

  if (immediate) {
    state.hpVisual[kind] = clampedTarget;
    element.style.width = `${clampedTarget}%`;
    return;
  }

  const delta = Math.abs(clampedTarget - previous);
  const duration = Math.max(420, Math.min(1300, 420 + delta * 12));
  const startedAt = performance.now();

  const step = (now) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - (1 - progress) * (1 - progress);
    const current = previous + (clampedTarget - previous) * eased;
    state.hpVisual[kind] = current;
    element.style.width = `${current}%`;

    if (progress < 1) {
      state.hpAnimationFrame[kind] = requestAnimationFrame(step);
    } else {
      state.hpAnimationFrame[kind] = null;
      state.hpVisual[kind] = clampedTarget;
      element.style.width = `${clampedTarget}%`;
    }
  };

  state.hpAnimationFrame[kind] = requestAnimationFrame(step);
}

function rollLoot() {
  const lootType = LOOT_TABLE[Math.floor(Math.random() * LOOT_TABLE.length)];
  addItem(lootType, 1);
  return ITEM_DEFS[lootType].name;
}

async function endEncounterWithVictory() {
  const milestone = state.activeEncounter.milestone;
  const earnedExp = milestone.hp + 6;
  setCombatControlsEnabled(false);
  playSfx("victory");
  const defeatLabel = `Derrotado: ${milestone.enemy}`;
  battleLogElement.textContent = `${milestone.enemy} cae en combate.`;
  await Promise.all([
    playTemporaryClass(encounterPanel, "victory-anim", 900),
    playTemporaryClass(enemyImageElement, "victory-hit-anim", 900),
    showFloatingText(enemyFloatTextElement, defeatLabel, "float-defeat", 980),
  ]);
  encounterPanel.classList.add("enemy-defeated-anim");
  await wait(360);
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
  if (getEnemyArchetype(state.activeEncounter.milestone.enemy) === "wolf") {
    if (Math.random() < 0.72) playWolfGrowlSfx();
  }

  const enemyRace = state.activeEncounter.milestone.race || "humano";
  const playerRace = getPlayerRaceKey();
  const raceMult = getRaceDamageMultiplier(enemyRace, playerRace);
  const rawDamage = Math.round((Math.floor(Math.random() * 4) + 2) * raceMult);
  const reducedDamage = Math.max(1, rawDamage - getPlayerDef());
  triggerEnemy3DLunge();
  playSfx("enemyHit");
  await playTemporaryClass(encounterPanel, "player-hit-anim", 300);
  player.hp = Math.max(0, player.hp - reducedDamage);

  if (player.hp <= 0) {
    battleLogElement.textContent = `Recibiste ${reducedDamage}. Has caido.`;
    logCombatEvent(`Derrota: recibes ${reducedDamage} de dano.`);
    updateCombatStats();
    await wait(220);
    setCombatControlsEnabled(false);
    playSfx("defeat");
    await Promise.all([
      playTemporaryClass(encounterPanel, "defeat-anim", 900),
      playTemporaryClass(enemyImageElement, "defeat-hit-anim", 900),
    ]);
    await wait(120);
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
  setInventoryOverlayOpen(false);
  if (gameShellElement) {
    gameShellElement.classList.add("encounter-flash");
    window.setTimeout(() => gameShellElement.classList.remove("encounter-flash"), 260);
  }
  state.activeEncounter = {
    milestone,
    hp: milestone.hp,
  };
  state.combatLocked = false;
  state.pendingAttackPreview = null;
  playSfx("encounter");
  if (getEnemyArchetype(milestone.enemy) === "wolf") {
    playWolfHowlSfx();
  }

  if (combatSceneBackElement) combatSceneBackElement.src = COMBAT_SCENE_ASSET;
  if (combatSceneFrontElement) combatSceneFrontElement.src = COMBAT_SCENE_ASSET;
  resetSceneParallax();
  const enemyAsset = getEnemyAssetWithFallback(milestone.enemy);
  const canvasPortrait = drawEnemyPortrait(milestone);
  const portraitSource = ENEMY_ASSETS[milestone.enemy] || canvasPortrait || enemyAsset.primary;
  applyEnemyPortraitBackdrop(portraitSource);
  enemyImageElement.onerror = () => {
    enemyImageElement.onerror = null;
    const fallback = canvasPortrait || enemyAsset.fallback;
    applyEnemyPortraitBackdrop(fallback);
    enemyImageElement.src = fallback;
  };
  enemyImageElement.src = portraitSource;
  enemyImageElement.alt = `Retrato de ${milestone.enemy}`;
  setEnemyVisualMode("2d");
  setCombatModalOpen(true);
  if (ENABLE_ENEMY_3D) {
    loadEnemy3D(milestone.enemy, milestone.race || "humano").then((loaded) => {
      if (!loaded || !state.activeEncounter || state.activeEncounter.milestone.id !== milestone.id) return;
      resizeEnemy3DRenderer();
      setEnemyVisualMode("3d");
    });
  }
  setCombatTurn("player");
  setCombatControlsEnabled(true);
  const raceMeta = getRaceMeta(milestone.race || "humano");
  const factionLabel = getFactionLabel(milestone.race || "humano");
  const enemyArchetype = getEnemyArchetype(milestone.enemy);
  encounterPanel.dataset.faction = raceMeta.faction || "cielo";
  encounterPanel.dataset.race = milestone.race || "humano";
  encounterPanel.dataset.style = raceMeta.style || "fisico";
  encounterPanel.dataset.archetype = enemyArchetype;
  applyEncounterVisualTheme(milestone.race || "humano");
  enemyNameElement.innerHTML = `Enfrentamiento: ${milestone.enemy} ${getRaceBadgeHTML(milestone.race || "humano")} (${raceMeta.style} | ${factionLabel})`;
  battleLogElement.textContent = "Tu turno: Attack, Item o Run.";
  updateStoryLine(`Combate activo: ${milestone.enemy} representa al ${factionLabel}.`);
  diceRollElement.textContent = "d20: --";
  logCombatEvent(`Inicia combate contra ${milestone.enemy}.`);
  const startPlayerPercent = (player.hp / getMaxHp()) * 100;
  animateHpFill("player", Math.max(0, Math.min(100, startPlayerPercent)), true);
  animateHpFill("enemy", 100, true);
  updateCombatStats();
}

function tryFinishMap() {
  const map = state.route.map;
  if (map[player.y][player.x] !== 2) return;

  const completedAll = state.route.milestones.every((milestone) => milestone.completed);

  if (completedAll) {
    const routeIdx = ROUTE_ORDER.indexOf(state.routeId);
    const nextLoreIdx = routeIdx + 1;
    if (nextLoreIdx < LORE_SEQUENCE.length) {
      showLoreScreen(nextLoreIdx);
      return;
    }

    player.won = true;
    messageElement.textContent = `Victoria total en ${state.route.label}.`;
    return;
  }

  messageElement.textContent = "La meta final esta sellada. Completa todos los hitos.";
}

function move(dx, dy) {
  if (state.gameScreen !== "playing") return;
  if (player.won || state.activeEncounter || state.walkAnim) return;

  const nextX = player.x + dx;
  const nextY = player.y + dy;

  if (!canMove(nextX, nextY)) return;
  playSfx("move");

  state.walkAnim = {
    startX: player.visualX,
    startY: player.visualY,
    targetX: nextX * TILE,
    targetY: nextY * TILE,
    startTime: performance.now(),
    duration: 110,
  };

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

async function applyDamageToEnemy(damage, label, fixedAttackOutcome = null) {
  if (!state.activeEncounter) return;

  await playTemporaryClass(encounterPanel, "player-attack-anim", 260);
  await playTemporaryClass(enemyImageElement, "enemy-hit-anim", 300);
  triggerEnemy3DHit();
  const playerRace = getPlayerRaceKey();
  const enemyRace = state.activeEncounter.milestone.race || "humano";
  let finalDamage = 0;
  let rollText = "d20: --";

  if (label === "Ataque") {
    if (fixedAttackOutcome) {
      finalDamage = fixedAttackOutcome.finalDamage;
      rollText = fixedAttackOutcome.rollText;
    } else {
      const d20 = Math.floor(Math.random() * 20) + 1;
      const outcome = computeAttackOutcome(damage, d20, playerRace, enemyRace);
      finalDamage = outcome.finalDamage;
      rollText = outcome.rollText;
    }
    diceRollElement.textContent = rollText;
    if (fixedAttackOutcome?.d20 === 20) playSfx("crit");
    else playSfx("attack");
    state.pendingAttackPreview = null;
    if (attackPreviewElement) attackPreviewElement.textContent = "Ataque previsto: --";
  } else {
    const raceMult = getRaceDamageMultiplier(playerRace, enemyRace);
    finalDamage = Math.max(1, Math.round(damage * raceMult));
    diceRollElement.textContent = "d20: n/a";
    playSfx("attack");
  }

  state.activeEncounter.hp = Math.max(0, state.activeEncounter.hp - finalDamage);
  if (label === "Ataque" && state.activeEncounter.hp > 0) {
    const passive = getPassiveByRace(playerRace);
    if ((passive.burnChance || 0) > 0 && Math.random() < passive.burnChance) {
      state.activeEncounter.hp = Math.max(0, state.activeEncounter.hp - (passive.burnDamage || 0));
      battleLogElement.textContent = `${label} hace ${finalDamage} + llama ${passive.burnDamage || 0}.`;
      logCombatEvent(`Pasiva ${passive.name}: llama +${passive.burnDamage || 0} dano.`);
    }
  }

  if (state.activeEncounter.hp <= 0) {
    battleLogElement.textContent = `${label} hace ${finalDamage}. Enemigo derrotado.`;
    logCombatEvent(`${label}: ${finalDamage} de dano final (${getRaceMeta(playerRace).label}) ${rollText}.`);
    updateCombatStats();
    await wait(200);
    await endEncounterWithVictory();
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
  const passive = getActivePassive().passive;
  const escapeChance = (getRaceMeta(enemyRace).dominateAll ? 0.25 : 0.6) + (passive.escapeBonus || 0);
  const escaped = Math.random() < escapeChance;

  if (escaped) {
    const enemy = state.activeEncounter.milestone.enemy;
    state.activeEncounter = null;
    setCombatModalOpen(false);
    state.routeState[state.routeId] = { x: player.x, y: player.y, initialized: true };
    messageElement.textContent = `Escapaste del combate contra ${enemy} sin cambiar de posicion.`;
    playSfx("escape");
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

function tileNoise(x, y, seed = 0) {
  const n = Math.sin((x + 1.37) * 127.1 + (y + 9.73) * 311.7 + seed * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

function getWorldPhaseProgress() {
  if (typeof state.debugWorldPhaseOverride === "number") {
    return Math.max(0, Math.min(1, state.debugWorldPhaseOverride));
  }
  const total = state.route.milestones.length || 1;
  const completed = state.route.milestones.filter((milestone) => milestone.completed).length;
  return completed / total;
}

function getWorldVisualPreset() {
  const phase = getWorldPhaseProgress();
  if (phase < 0.34) {
    return {
      phase,
      label: "corrupto",
      tint: "rgba(8, 14, 24, 0.34)",
      fogAlpha: 0.83,
      floorBoost: -14,
      holyGlow: 0.02,
    };
  }
  if (phase < 0.67) {
    return {
      phase,
      label: "fracturado",
      tint: "rgba(12, 18, 28, 0.18)",
      fogAlpha: 0.66,
      floorBoost: 4,
      holyGlow: 0.18,
    };
  }
  return {
    phase,
    label: "purificado",
    tint: "rgba(20, 26, 38, 0.06)",
    fogAlpha: 0.48,
    floorBoost: 22,
    holyGlow: 0.42,
  };
}

function getNearestPendingMilestoneDistance() {
  const pending = state.route.milestones.filter((milestone) => !milestone.completed);
  if (pending.length === 0) return Infinity;
  return pending.reduce((minDist, milestone) => {
    const dist = Math.hypot(player.x - milestone.x, player.y - milestone.y);
    return Math.min(minDist, dist);
  }, Infinity);
}

function getWorldThreatLevel() {
  if (state.gameScreen !== "playing" || player.won) {
    return { level: "low", distance: Infinity };
  }
  const distance = getNearestPendingMilestoneDistance();
  let level = "low";
  if (distance <= 2.8) level = "critical";
  else if (distance <= 4.8) level = "high";
  else if (distance <= 7) level = "medium";
  return { level, distance };
}

function updateWorldThreat() {
  const next = getWorldThreatLevel();
  state.worldThreat.level = next.level;
  state.worldThreat.distance = next.distance;
  document.body.dataset.threat = next.level;
}

function maybePlayThreatPulse() {
  if (!state.audio.enabled || state.activeEncounter) return;
  if (state.gameScreen !== "playing") return;
  const now = performance.now();
  const intervals = { low: Infinity, medium: 1600, high: 980, critical: 560 };
  const waitMs = intervals[state.worldThreat.level] || Infinity;
  if (!Number.isFinite(waitMs)) return;
  if (now - state.worldThreat.lastPulseAt < waitMs) return;
  state.worldThreat.lastPulseAt = now;
  playSfx("threatPulse");

  if (DARK_BRUTAL_MODE && gameShellElement && state.worldThreat.level !== "low") {
    gameShellElement.classList.remove("fear-hit");
    void gameShellElement.offsetWidth;
    gameShellElement.classList.add("fear-hit");
    window.setTimeout(() => gameShellElement.classList.remove("fear-hit"), 260);
  }

  const stingGapMs = 1600;
  if (now - state.fearLastStingAt >= stingGapMs) {
    const odds = state.worldThreat.level === "critical" ? 0.46 : state.worldThreat.level === "high" ? 0.24 : 0.08;
    if (Math.random() < odds) {
      state.fearLastStingAt = now;
      playDreadSting(state.worldThreat.level);
    }
  }
}

function drawTile(tile, x, y) {
  const px = x * TILE;
  const py = y * TILE;
  const n1 = tileNoise(x, y, 1);
  const n2 = tileNoise(x, y, 2);
  const n3 = tileNoise(x, y, 3);
  const worldVisual = getWorldVisualPreset();
  const worldPhase = worldVisual.phase;
  const auraBoost = Math.round(worldPhase * 58);

  if (tile === 1) {
    const base = 18 + Math.floor(n1 * 20) + Math.round(worldPhase * 14);
    const r = base + Math.round(worldVisual.floorBoost * 0.5);
    const g = base + 10 + Math.round(worldVisual.floorBoost * 0.75);
    const b = base + 18 + Math.round(worldVisual.floorBoost * 1.25);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(px, py, TILE, TILE);

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(px, py, TILE, 2);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(px, py + TILE - 2, TILE, 2);

    if (n2 > 0.55) {
      ctx.strokeStyle = "rgba(180, 210, 230, 0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px + 4, py + 6 + Math.floor(n3 * 6));
      ctx.lineTo(px + TILE - 5, py + TILE - 6 - Math.floor(n2 * 4));
      ctx.stroke();
    }
  } else {
    const hueShift = Math.floor(n1 * 18);
    const g = 68 + Math.floor(n2 * 24) + Math.round(worldPhase * 34) + Math.round(worldVisual.floorBoost * 0.8);
    const b = 78 + Math.floor(n3 * 30) + Math.round(worldPhase * 48) + Math.round(worldVisual.floorBoost * 1.2);
    const r = 18 + hueShift + Math.round(worldPhase * 16);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(px, py, TILE, TILE);

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(px, py, TILE, 1);
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fillRect(px, py + TILE - 1, TILE, 1);

    ctx.fillStyle = "rgba(18, 38, 49, 0.24)";
    ctx.fillRect(px + 3 + Math.floor(n1 * 4), py + 4 + Math.floor(n2 * 4), 3, 2);
    ctx.fillRect(px + 17 + Math.floor(n2 * 3), py + 12 + Math.floor(n3 * 4), 2, 2);

    if (worldPhase > 0.2 && n2 > 0.55) {
      const shine = 0.08 + worldVisual.holyGlow * 0.62;
      ctx.strokeStyle = `rgba(255, 224, 146, ${shine.toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px + 5, py + 6);
      ctx.lineTo(px + TILE - 6, py + TILE - 7);
      ctx.stroke();
    }
  }

  if (tile === 2) {
    const glow = ctx.createRadialGradient(px + TILE / 2, py + TILE / 2, 2, px + TILE / 2, py + TILE / 2, TILE / 2);
    glow.addColorStop(0, "rgba(255, 222, 128, 0.95)");
    glow.addColorStop(1, "rgba(255, 175, 64, 0.35)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(px + TILE / 2, py + TILE / 2, TILE / 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 245, 190, 0.88)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px + TILE / 2, py + 8);
    ctx.lineTo(px + TILE / 2, py + TILE - 8);
    ctx.moveTo(px + 8, py + TILE / 2);
    ctx.lineTo(px + TILE - 8, py + TILE / 2);
    ctx.stroke();
  }

  if (state.routeId) {
    const veil = 0.28 - worldPhase * 0.23;
    if (veil > 0.01) {
      ctx.fillStyle = `rgba(2, 8, 14, ${veil.toFixed(3)})`;
      ctx.fillRect(px, py, TILE, TILE);
    }
    if (worldPhase > 0.42 && n3 > 0.58) {
      ctx.fillStyle = `rgba(120, 210, 255, ${(0.05 + worldVisual.holyGlow * 0.45).toFixed(3)})`;
      ctx.fillRect(px + 2, py + 2, 1, 1);
    }
  }
}

function drawWorldAtmosphereLayer() {
  const visual = getWorldVisualPreset();
  const mapHeight = state.route.map.length * TILE;
  const mapWidth = state.route.map[0].length * TILE;
  const now = performance.now();

  ctx.save();
  ctx.fillStyle = visual.tint;
  ctx.fillRect(0, 0, mapWidth, mapHeight);

  if (visual.label !== "corrupto") {
    const shafts = 3 + Math.floor(visual.phase * 4);
    for (let i = 0; i < shafts; i += 1) {
      const x = ((i * 137 + now * 0.018) % (mapWidth + 120)) - 60;
      const beam = ctx.createLinearGradient(x, 0, x + 70, mapHeight);
      beam.addColorStop(0, `rgba(255, 230, 170, ${(0.02 + visual.holyGlow * 0.22).toFixed(3)})`);
      beam.addColorStop(1, "rgba(255, 230, 170, 0)");
      ctx.fillStyle = beam;
      ctx.fillRect(x, 0, 100, mapHeight);
    }
  }

  if (visual.label === "corrupto" || visual.label === "fracturado") {
    const haze = 8;
    for (let i = 0; i < haze; i += 1) {
      const p = (now / (1200 + i * 120) + i * 0.19) % 1;
      const x = p * mapWidth;
      const y = ((i * 57 + now * 0.01) % mapHeight);
      const radius = 18 + (i % 3) * 10;
      const g = ctx.createRadialGradient(x, y, 2, x, y, radius);
      g.addColorStop(0, `rgba(95, 130, 165, ${(0.06 + (1 - visual.phase) * 0.08).toFixed(3)})`);
      g.addColorStop(1, "rgba(95, 130, 165, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (DARK_BRUTAL_MODE) {
    const rust = ctx.createLinearGradient(0, 0, mapWidth, mapHeight);
    rust.addColorStop(0, "rgba(38, 12, 10, 0.2)");
    rust.addColorStop(0.52, "rgba(16, 7, 11, 0.14)");
    rust.addColorStop(1, "rgba(8, 4, 7, 0.24)");
    ctx.fillStyle = rust;
    ctx.fillRect(0, 0, mapWidth, mapHeight);

    // Ash drift for oppressive atmosphere.
    for (let i = 0; i < 34; i += 1) {
      const x = (now * 0.02 + i * 47) % mapWidth;
      const y = (now * 0.012 + i * 29) % mapHeight;
      const alpha = 0.03 + (i % 5) * 0.008;
      ctx.fillStyle = `rgba(188, 172, 156, ${alpha.toFixed(3)})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  ctx.restore();
}

function applyDarkBrutalTheme() {
  if (DARK_BRUTAL_MODE) document.body.dataset.theme = "dark-brutal";
  else document.body.dataset.theme = "default";
}

function getGoalTiles() {
  const goals = [];
  const map = state.route.map;
  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      if (map[y][x] === 2) goals.push({ x, y });
    }
  }
  return goals;
}

function drawMilestoneGlyph(milestone, centerX, centerY, isCompleted) {
  const archetype = getEnemyArchetype(milestone.enemy);
  ctx.save();
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = isCompleted ? "rgba(225, 255, 237, 0.92)" : "rgba(255, 248, 232, 0.96)";
  ctx.fillStyle = isCompleted ? "rgba(188, 255, 213, 0.44)" : "rgba(255, 240, 196, 0.38)";

  if (archetype === "wolf") {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 5);
    ctx.lineTo(centerX + 4, centerY + 3);
    ctx.lineTo(centerX - 4, centerY + 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (archetype === "bandit") {
    ctx.beginPath();
    ctx.moveTo(centerX - 4, centerY - 4);
    ctx.lineTo(centerX + 4, centerY + 4);
    ctx.moveTo(centerX + 4, centerY - 4);
    ctx.lineTo(centerX - 4, centerY + 4);
    ctx.stroke();
  } else if (archetype === "guardian") {
    ctx.beginPath();
    ctx.rect(centerX - 3.5, centerY - 3.5, 7, 7);
    ctx.fill();
    ctx.stroke();
  } else if (archetype === "captain") {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 5);
    ctx.lineTo(centerX + 5, centerY);
    ctx.lineTo(centerX, centerY + 5);
    ctx.stroke();
  } else if (archetype === "witch") {
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX + 1, centerY - 2);
    ctx.lineTo(centerX + 3.5, centerY - 4.5);
    ctx.stroke();
  } else if (archetype === "knight") {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 5);
    ctx.lineTo(centerX + 4, centerY - 1);
    ctx.lineTo(centerX + 3, centerY + 5);
    ctx.lineTo(centerX - 3, centerY + 5);
    ctx.lineTo(centerX - 4, centerY - 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (archetype === "beast") {
    ctx.beginPath();
    ctx.moveTo(centerX - 4, centerY + 4);
    ctx.lineTo(centerX - 1, centerY - 5);
    ctx.lineTo(centerX + 1, centerY + 3);
    ctx.lineTo(centerX + 4, centerY - 4);
    ctx.stroke();
  } else if (archetype === "archer") {
    ctx.beginPath();
    ctx.moveTo(centerX - 4, centerY + 4);
    ctx.lineTo(centerX + 4, centerY - 4);
    ctx.moveTo(centerX + 4, centerY - 4);
    ctx.lineTo(centerX + 1, centerY - 4);
    ctx.lineTo(centerX + 4, centerY - 1);
    ctx.stroke();
  } else if (archetype === "dragon") {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 5);
    ctx.lineTo(centerX + 2, centerY - 1);
    ctx.lineTo(centerX + 5, centerY - 1);
    ctx.lineTo(centerX + 2.4, centerY + 1.5);
    ctx.lineTo(centerX + 3.4, centerY + 5);
    ctx.lineTo(centerX, centerY + 2.6);
    ctx.lineTo(centerX - 3.4, centerY + 5);
    ctx.lineTo(centerX - 2.4, centerY + 1.5);
    ctx.lineTo(centerX - 5, centerY - 1);
    ctx.lineTo(centerX - 2, centerY - 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(centerX, centerY, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function drawMilestones() {
  state.route.milestones.forEach((milestone) => {
    const revealMode = getMilestoneRevealMode(milestone.x, milestone.y);
    if (!milestone.completed && revealMode === "hidden") return;
    const px = milestone.x * TILE;
    const py = milestone.y * TILE;

    if (!milestone.completed && revealMode === "echo") {
      if (state.walkAnim === null) return;
      ctx.strokeStyle = "rgba(255, 160, 160, 0.52)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px + TILE / 2, py + 8);
      ctx.lineTo(px + TILE - 8, py + TILE / 2);
      ctx.lineTo(px + TILE / 2, py + TILE - 8);
      ctx.lineTo(px + 8, py + TILE / 2);
      ctx.closePath();
      ctx.stroke();
      return;
    }

    const centerX = px + TILE / 2;
    const centerY = py + TILE / 2;
    const icon = milestone.completed ? mapIcons.loot : mapIcons.enemy;
    const iconDrawn = drawMapIcon(icon, centerX, centerY, TILE * 0.92);
    if (!iconDrawn) {
      ctx.fillStyle = milestone.completed ? "#54d38a" : "#ff5a5f";
      ctx.beginPath();
      ctx.moveTo(centerX, py + 6);
      ctx.lineTo(px + TILE - 6, centerY);
      ctx.lineTo(centerX, py + TILE - 6);
      ctx.lineTo(px + 6, centerY);
      ctx.closePath();
      ctx.fill();
      drawMilestoneGlyph(milestone, centerX, centerY, milestone.completed);
      if (!milestone.completed) {
        ctx.strokeStyle = "rgba(255, 236, 200, 0.9)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    } else if (!milestone.completed) {
      ctx.strokeStyle = "rgba(255, 236, 200, 0.85)";
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 4, py + 4, TILE - 8, TILE - 8);
    }

    if (!milestone.completed && state.routeId === "route1") {
      const pulse = 0.35 + Math.sin(performance.now() / 220 + milestone.x * 0.7 + milestone.y * 0.5) * 0.2;
      ctx.strokeStyle = `rgba(255, 120, 120, ${Math.max(0.12, pulse).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(px + TILE / 2, py + TILE / 2, TILE * 0.42, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}

function drawWorldPresenceEchoes() {
  if (state.walkAnim === null) return;
  const pending = state.route.milestones.filter((milestone) => !milestone.completed);
  if (pending.length === 0) return;
  const level = state.worldThreat.level;
  const threatBoost = level === "critical" ? 1 : level === "high" ? 0.65 : level === "medium" ? 0.3 : 0;

  const now = performance.now();
  pending.forEach((milestone, idx) => {
    const dist = Math.hypot(player.x - milestone.x, player.y - milestone.y);
    const cap = 3.6 + threatBoost * 2.2;
    if (dist > cap) return;
    const px = milestone.x * TILE + TILE / 2;
    const py = milestone.y * TILE + TILE / 2;
    const phase = (now / 380 + idx * 0.9) % (Math.PI * 2);
    const radius = TILE * (0.35 + ((Math.sin(phase) + 1) / 2) * 0.34);
    const alpha = Math.max(0.02, 0.12 + threatBoost * 0.1 - dist * 0.02);
    const gradient = ctx.createRadialGradient(px, py, 2, px, py, radius + TILE * 0.35);
    gradient.addColorStop(0, `rgba(255, 118, 118, ${Math.min(0.16, alpha + 0.04).toFixed(3)})`);
    gradient.addColorStop(1, "rgba(255, 118, 118, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(px, py, radius + TILE * 0.35, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawPlayer() {
  const px = player.visualX + TILE / 2;
  const py = player.visualY + TILE / 2;

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

function getVisionRadius() {
  // Vision improves a little with progression but remains challenging.
  return BASE_VISION_RADIUS + Math.min(1.7, player.level * 0.12);
}

function isTileRevealed(x, y) {
  const dx = x - player.x;
  const dy = y - player.y;
  return Math.hypot(dx, dy) <= getVisionRadius();
}

function isMilestoneRevealed(x, y) {
  const dx = x - player.x;
  const dy = y - player.y;
  return Math.hypot(dx, dy) <= getVisionRadius() + 0.85;
}

function getMilestoneRevealMode(x, y) {
  const dx = x - player.x;
  const dy = y - player.y;
  const dist = Math.hypot(dx, dy);
  const base = getVisionRadius();
  if (dist <= base + 0.25) return "full";
  if (dist <= base + 0.85) return "echo";
  return "hidden";
}

function drawFogOfWar() {
  const mapHeight = state.route.map.length * TILE;
  const mapWidth = state.route.map[0].length * TILE;
  const px = player.visualX + TILE / 2;
  const py = player.visualY + TILE / 2;
  const threatPenalty =
    state.worldThreat.level === "critical" ? 0.24
      : state.worldThreat.level === "high" ? 0.16
        : state.worldThreat.level === "medium" ? 0.08
          : 0;
  const softRadius = getVisionRadius() * TILE * (1 - threatPenalty);
  const hardRadius = softRadius * 0.8;
  const visual = getWorldVisualPreset();

  ctx.save();
  const fogAlpha = Math.max(0.34, visual.fogAlpha - 0.12);
  ctx.fillStyle = `rgba(3, 9, 16, ${fogAlpha})`;
  ctx.fillRect(0, 0, mapWidth, mapHeight);
  ctx.globalCompositeOperation = "destination-out";

  const vision = ctx.createRadialGradient(px, py, hardRadius, px, py, softRadius);
  vision.addColorStop(0, "rgba(0,0,0,1)");
  vision.addColorStop(0.74, "rgba(0,0,0,0.6)");
  vision.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = vision;
  ctx.beginPath();
  ctx.arc(px, py, softRadius, 0, Math.PI * 2);
  ctx.fill();

  // Keep goal markers visible through fog so navigation remains readable.
  const goalRadius = TILE * 0.72;
  getGoalTiles().forEach((goal) => {
    const gx = goal.x * TILE + TILE / 2;
    const gy = goal.y * TILE + TILE / 2;
    const goalDrawn = drawMapIcon(mapIcons.goal, gx, gy, TILE * 1.04);
    if (!goalDrawn) {
      ctx.beginPath();
      ctx.arc(gx, gy, goalRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.restore();
}

function applyFearCamera(now) {
  if (!DARK_BRUTAL_MODE || state.activeEncounter || state.gameScreen !== "playing") {
    canvas.style.transform = "";
    return;
  }
  const intensity =
    state.worldThreat.level === "critical" ? 1
      : state.worldThreat.level === "high" ? 0.66
        : state.worldThreat.level === "medium" ? 0.34
          : 0;
  if (intensity <= 0) {
    canvas.style.transform = "";
    return;
  }

  const x = Math.sin(now * 0.0057) * intensity * 1.8;
  const y = Math.cos(now * 0.0048 + 0.6) * intensity * 1.4;
  const zoom = 1 + intensity * 0.012;
  canvas.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${zoom.toFixed(3)})`;
  canvas.style.transformOrigin = "50% 50%";
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
  const now = performance.now();
  updateWorldThreat();
  maybePlayThreatPulse();
  updateEnemyAi(now);
  applyFearCamera(now);
  const map = state.route.map;
  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      drawTile(map[y][x], x, y);
    }
  }
  drawWorldAtmosphereLayer();

  if (state.walkAnim) {
    const elapsed = performance.now() - state.walkAnim.startTime;
    const t = Math.min(1, elapsed / state.walkAnim.duration);
    const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    player.visualX = state.walkAnim.startX + (state.walkAnim.targetX - state.walkAnim.startX) * eased;
    player.visualY = state.walkAnim.startY + (state.walkAnim.targetY - state.walkAnim.startY) * eased;
    if (t >= 1) state.walkAnim = null;
  }

  drawFogOfWar();
  drawMilestones();
  drawWorldPresenceEchoes();
  drawPlayer();
  drawWinMessage();
  requestAnimationFrame(render);
}

attackButton.addEventListener("click", async () => {
  playSfx("ui");
  await runPlayerAction(async () => {
    if (!state.pendingAttackPreview) refreshAttackPreview();
    const preview = state.pendingAttackPreview;
    if (!preview) return;
    await applyDamageToEnemy(preview.baseDamage, "Ataque", preview);
  });
});

healButton.addEventListener("click", async () => {
  playSfx("ui");
  if (!state.activeEncounter) return;
  if (state.inventory.length === 0) {
    battleLogElement.textContent = "No tienes items para usar.";
    messageElement.textContent = "Mochila vacia.";
    return;
  }
  setInventoryOverlayOpen(true);
  battleLogElement.textContent = "Selecciona un item y pulsa Usar.";
});

escapeButton.addEventListener("click", async () => {
  playSfx("ui");
  await runPlayerAction(async () => {
    await attemptEscape();
  });
});

inventoryListElement.addEventListener("click", async (event) => {
  await handleInventoryAction(event);
});

inventoryOpenButton?.addEventListener("click", () => {
  playSfx("ui");
  setInventoryOverlayOpen(true);
});

inventoryCloseButton?.addEventListener("click", () => {
  playSfx("ui");
  setInventoryOverlayOpen(false);
});

inventoryOverlay?.addEventListener("click", (event) => {
  if (event.target === inventoryOverlay) setInventoryOverlayOpen(false);
});

debugLevelOpenButton?.addEventListener("click", () => {
  playSfx("ui");
  setLevelSkipOverlayOpen(true);
});

levelSkipCloseButton?.addEventListener("click", () => {
  playSfx("ui");
  setLevelSkipOverlayOpen(false);
});

levelSkipApplyButton?.addEventListener("click", () => {
  applyLevelSkipFromInput();
});

levelSkipRouteApplyButton?.addEventListener("click", () => {
  applyRouteSkipFromInput();
});

levelSkipInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    applyLevelSkipFromInput();
  }
});

levelSkipOverlay?.addEventListener("click", (event) => {
  if (event.target === levelSkipOverlay) setLevelSkipOverlayOpen(false);
});

inventoryGridElement?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest("button[data-inventory-slot-id]");
  if (!(button instanceof HTMLButtonElement)) return;
  const itemId = Number(button.getAttribute("data-inventory-slot-id"));
  if (!itemId) return;
  setSelectedInventoryItem(itemId);
  playSfx("ui");
});

inventoryUseButton?.addEventListener("click", async () => {
  const selected = getSelectedInventoryItem();
  if (!selected) return;
  await handleInventoryActionById("use", selected.id);
});

inventoryDropButton?.addEventListener("click", async () => {
  const selected = getSelectedInventoryItem();
  if (!selected) return;
  await handleInventoryActionById("drop", selected.id);
});

partyListElement.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const action = target.getAttribute("data-party-action");
  const memberId = target.getAttribute("data-member-id");
  if (!memberId) return;

  if (action === "remove") {
    playSfx("ui");
    removePartyMember(memberId);
  }
});

recruitListElement.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const action = target.getAttribute("data-party-action");
  const memberId = target.getAttribute("data-member-id");
  if (!memberId) return;

  if (action === "add") {
    playSfx("ui");
    addPartyMember(memberId);
  }
});

summonListElement.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;
  const action = target.getAttribute("data-summon-action");
  const summonId = target.getAttribute("data-summon-id");
  if (!summonId) return;
  if (action === "activate") {
    playSfx("ui");
    activateSummon(summonId);
  }
  if (action === "train") {
    playSfx("ui");
    trainSummon(summonId);
  }
});

weaponSelectElement.addEventListener("change", () => {
  if (state.activeEncounter) {
    weaponSelectElement.value = state.equipment.weaponId;
    messageElement.textContent = "No puedes cambiar arma durante combate.";
    return;
  }
  state.equipment.weaponId = weaponSelectElement.value;
  playSfx("ui");
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
  playSfx("ui");
  const equipped = getEquipmentBonus().armor.name;
  messageElement.textContent = `Armadura equipada: ${equipped}.`;
  logCombatEvent(`Armadura equipada: ${equipped}.`);
  updateStatsPanel();
  updateStatus();
});

window.addEventListener("keydown", (event) => {
  const activeTag = document.activeElement?.tagName || "";
  const isTypingContext =
    activeTag === "INPUT" ||
    activeTag === "TEXTAREA" ||
    activeTag === "SELECT" ||
    document.activeElement?.isContentEditable;
  const key = event.key.toLowerCase();
  const isMovementKey =
    key === "arrowup" ||
    key === "arrowdown" ||
    key === "arrowleft" ||
    key === "arrowright" ||
    key === "w" ||
    key === "a" ||
    key === "s" ||
    key === "d";

  if (isMovementKey && !isTypingContext) {
    event.preventDefault();
  }

  if (state.gameScreen === "lore" && (key === "enter" || key === " " || key === "spacebar")) {
    event.preventDefault();
    playSfx("ui");
    advanceActiveLore();
    return;
  }

  if (key === "[") {
    const current = typeof state.debugWorldPhaseOverride === "number" ? state.debugWorldPhaseOverride : getWorldPhaseProgress();
    state.debugWorldPhaseOverride = Math.max(0, current - 0.1);
    messageElement.textContent = `Debug mundo 1: fase ${(state.debugWorldPhaseOverride * 100).toFixed(0)}%`;
    return;
  }
  if (key === "]") {
    const current = typeof state.debugWorldPhaseOverride === "number" ? state.debugWorldPhaseOverride : getWorldPhaseProgress();
    state.debugWorldPhaseOverride = Math.min(1, current + 0.1);
    messageElement.textContent = `Debug mundo 1: fase ${(state.debugWorldPhaseOverride * 100).toFixed(0)}%`;
    return;
  }
  if (key === "0") {
    state.debugWorldPhaseOverride = null;
    messageElement.textContent = "Debug mundo 1 desactivado (vuelve a progreso real).";
    return;
  }
  if (key === "l") {
    const neededExp = Math.max(1, player.nextExp - player.exp);
    gainExp(neededExp);
    messageElement.textContent = `Debug nivel: subiste a ${player.level}.`;
    playSfx("ui");
    return;
  }

  if (state.activeEncounter) {
    if (key === "a") {
      attackButton.click();
      return;
    }
    if (key === "c" || key === "i") {
      healButton.click();
      return;
    }
    if (key === "e" || key === "r") {
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

window.addEventListener("pointerdown", () => {
  unlockAudioFromGesture();
}, { capture: true });

window.addEventListener("keydown", () => {
  unlockAudioFromGesture();
}, { capture: true });

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
  if (state.gameScreen !== "playing") {
    routeSelect.value = state.routeId;
    return;
  }
  if (state.activeEncounter) {
    routeSelect.value = state.routeId;
    messageElement.textContent = "No puedes cambiar de ruta en combate.";
    return;
  }
  playSfx("ui");
  switchRoute(routeSelect.value);
});

fullscreenButton.addEventListener("click", async () => {
  playSfx("ui");
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
  document.body.classList.toggle("game-focus-fullscreen", Boolean(document.fullscreenElement));
  fullscreenButton.textContent = document.fullscreenElement ? "Salir pantalla completa" : "Pantalla completa";
  resizeEnemy3DRenderer();
});

window.addEventListener("resize", () => {
  resizeEnemy3DRenderer();
});

encounterPanel.addEventListener("pointermove", (event) => {
  updateSceneParallaxFromPointer(event);
});

encounterPanel.addEventListener("pointerleave", () => {
  resetSceneParallax();
});

function showLoreScreen(index) {
  const entry = LORE_SEQUENCE[index];
  if (!entry) return;
  state.gameScreen = "lore";
  state.activeLoreEntry = entry;
  loreChapterEl.textContent = entry.chapter;
  loreTitleEl.textContent = entry.title;
  loreTextEl.innerHTML = entry.lines.map((line) => `<p>${line}</p>`).join("");
  loreScreen.classList.remove("hidden");
}

function advanceActiveLore() {
  if (state.activeLoreEntry) state.activeLoreEntry.onAdvance();
}

startBtn.addEventListener("click", () => {
  if (state.audio.enabled) setAudioEnabled(true);
  playSfx("ui");
  startScreen.classList.add("hidden");
  showLoreScreen(0);
});

loreSkipBtn.addEventListener("click", () => {
  playSfx("ui");
  advanceActiveLore();
});

loreScreen.addEventListener("click", (event) => {
  if (state.gameScreen !== "lore") return;
  if (event.target.closest("#lore-skip-btn")) return;
  playSfx("ui");
  advanceActiveLore();
});

audioToggleButton?.addEventListener("click", async () => {
  await setAudioEnabled(!state.audio.enabled);
});

audioVolumeInput?.addEventListener("input", () => {
  const value = Number(audioVolumeInput.value);
  if (!Number.isFinite(value)) return;
  setAudioVolume(value / 100);
});

worldThemeButton?.addEventListener("click", () => {
  state.audio.worldThemeIndex = (state.audio.worldThemeIndex + 1) % WORLD_THEME_PRESETS.length;
  state.audio.customWorldNotes = null;
  audioRuntime.currentBgmProfile = "";
  updateAudioUI();
  saveAudioPrefs();
  const preset = WORLD_THEME_PRESETS[state.audio.worldThemeIndex];
  messageElement.textContent = `Tema exterior activo: ${preset.name}.`;
  playSfx("ui");
});

composeThemeButton?.addEventListener("click", () => {
  composeWorldTheme();
});

loadAudioPrefs();
updateAudioUI();
applyDarkBrutalTheme();
setCombatTurn("player");
setCombatControlsEnabled(true);
renderInventory();
renderParty();
renderSummons();
renderEquipment();
renderCombatHistory();
switchRoute(routeSelect.value);
syncDocumentTitleWithVersion();
render();

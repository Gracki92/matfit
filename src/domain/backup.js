export const MAX_BACKUP_FILE_BYTES = 15 * 1024 * 1024;

const APP_NAME = "MatFit Pro";
const SCHEMA_VERSION = 1;
const DATA_VERSION = 25;
const MAX_NESTING_DEPTH = 20;
const FORBIDDEN_KEYS = new Set(["__proto__", "prototype", "constructor"]);

const SECTION_ALIASES = Object.freeze({
  theme: ["theme", "tn"],
  profile: ["profile"],
  planer: ["planer"],
  recipes: ["recipes"],
  hiddenRecipes: ["hiddenRecipes", "hidden_recipes"],
  products: ["products"],
  favorites: ["favorites"],
  productFavorites: ["productFavorites", "product_favorites"],
  recentProducts: ["recentProducts", "recent_products"],
  productGrams: ["productGrams", "product_grams"],
  dayTypes: ["dayTypes"],
  bodyLog: ["bodyLog", "body"],
  waterLog: ["waterLog", "water"],
  waterSettings: ["waterSettings", "water_settings"],
  shoppingChecked: ["shoppingChecked", "zakupy"],
  shoppingManual: ["shoppingManual", "shopping_manual"],
});

const SECTION_LABELS = Object.freeze({
  theme: "motyw",
  profile: "profil",
  planer: "planer",
  recipes: "przepisy",
  hiddenRecipes: "ukryte przepisy",
  products: "produkty",
  favorites: "ulubione",
  productFavorites: "ulubione produkty",
  recentProducts: "ostatnie produkty",
  productGrams: "zapamiętane gramatury",
  dayTypes: "typy dni",
  bodyLog: "pomiary",
  waterLog: "woda",
  waterSettings: "ustawienia wody",
  shoppingChecked: "lista zakupów",
  shoppingManual: "ręcznie dodane zakupy",
});

const OBJECT_SECTIONS = [
  "profile",
  "planer",
  "productGrams",
  "dayTypes",
  "bodyLog",
  "waterLog",
  "waterSettings",
  "shoppingChecked",
  "shoppingManual",
];
const ARRAY_SECTIONS = [
  "recipes",
  "hiddenRecipes",
  "products",
  "favorites",
  "productFavorites",
  "recentProducts",
];

function isPlainBackupObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function backupHas(source, names) {
  return names.some((name) => Object.prototype.hasOwnProperty.call(source, name));
}

function backupRead(source, names, fallback) {
  for (const name of names) {
    if (Object.prototype.hasOwnProperty.call(source, name)) return source[name];
  }
  return fallback;
}

function assertSafeBackupValue(value, depth = 0) {
  if (depth > MAX_NESTING_DEPTH) throw new Error("Kopia ma zbyt głęboko zagnieżdżone dane");
  if (!value || typeof value !== "object") return;

  if (Array.isArray(value)) {
    value.forEach((item) => assertSafeBackupValue(item, depth + 1));
    return;
  }

  Object.keys(value).forEach((key) => {
    if (FORBIDDEN_KEYS.has(key)) throw new Error("Kopia zawiera niedozwolony klucz danych");
    assertSafeBackupValue(value[key], depth + 1);
  });
}

function readNormalizedSection(source, key, fallback) {
  return backupRead(source, SECTION_ALIASES[key], fallback);
}

export function createBackupData(data, exportedAt = new Date().toISOString()) {
  return {
    app: APP_NAME,
    schemaVersion: SCHEMA_VERSION,
    version: DATA_VERSION,
    exportedAt,
    data,
  };
}

export function normalizeBackupData(raw, options = {}) {
  if (!isPlainBackupObject(raw)) throw new Error("Plik nie zawiera kopii MatFit");
  assertSafeBackupValue(raw);

  const modern =
    raw.app === APP_NAME &&
    Number(raw.schemaVersion) >= 1 &&
    isPlainBackupObject(raw.data);
  if (!modern && !raw.version) throw new Error("To nie jest kopia MatFit");
  if (modern && Number(raw.schemaVersion) > SCHEMA_VERSION) {
    throw new Error("Kopia pochodzi z nowszej wersji MatFit");
  }

  const source = modern ? raw.data : raw;
  const present = {};
  Object.keys(SECTION_ALIASES).forEach((key) => {
    present[key] = backupHas(source, SECTION_ALIASES[key]);
  });
  if (!Object.values(present).some(Boolean)) {
    throw new Error("Kopia nie zawiera rozpoznanych danych");
  }

  OBJECT_SECTIONS.forEach((key) => {
    if (present[key] && !isPlainBackupObject(readNormalizedSection(source, key, null))) {
      throw new Error(`Uszkodzona sekcja kopii: ${SECTION_LABELS[key]}`);
    }
  });
  ARRAY_SECTIONS.forEach((key) => {
    if (present[key] && !Array.isArray(readNormalizedSection(source, key, null))) {
      throw new Error(`Uszkodzona sekcja kopii: ${SECTION_LABELS[key]}`);
    }
  });

  const validThemes = options.validThemes || ["royal", "light"];
  const themeValue = readNormalizedSection(source, "theme", "royal");
  if (present.theme && !validThemes.includes(themeValue)) {
    throw new Error("Uszkodzona sekcja kopii: motyw");
  }
  const filterRecipes = options.filterRecipes || ((records) => records);
  const filterProducts = options.filterProducts || ((records) => records);

  const normalized = {
    theme: validThemes.includes(themeValue) ? themeValue : "royal",
    profile: readNormalizedSection(source, "profile", {}),
    planer: readNormalizedSection(source, "planer", {}),
    recipes: filterRecipes(readNormalizedSection(source, "recipes", [])),
    hiddenRecipes: readNormalizedSection(source, "hiddenRecipes", []),
    products: filterProducts(readNormalizedSection(source, "products", [])),
    favorites: readNormalizedSection(source, "favorites", []),
    productFavorites: readNormalizedSection(source, "productFavorites", []),
    recentProducts: readNormalizedSection(source, "recentProducts", []).slice(0, 8),
    productGrams: readNormalizedSection(source, "productGrams", {}),
    dayTypes: readNormalizedSection(source, "dayTypes", {}),
    bodyLog: readNormalizedSection(source, "bodyLog", {}),
    waterLog: readNormalizedSection(source, "waterLog", {}),
    waterSettings: readNormalizedSection(source, "waterSettings", {}),
    shoppingChecked: readNormalizedSection(source, "shoppingChecked", {}),
    shoppingManual: readNormalizedSection(source, "shoppingManual", {}),
  };
  const missing = Object.keys(present)
    .filter((key) => !present[key])
    .map((key) => SECTION_LABELS[key]);

  return {
    data: normalized,
    present,
    missing,
    legacy: !modern,
    schemaVersion: modern ? Number(raw.schemaVersion) : Number(raw.version),
    exportedAt: raw.exportedAt || "",
    summary: {
      planDays: Object.keys(normalized.planer).length,
      measurements: Object.keys(normalized.bodyLog).length,
      waterDays: Object.keys(normalized.waterLog).length,
      recipes: normalized.recipes.length,
      products: normalized.products.length,
    },
  };
}

export function parseBackupJson(text, options) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Plik kopii ma nieprawidłowy format JSON");
  }
  return normalizeBackupData(parsed, options);
}

export function mergeBackupRecords(current, incoming) {
  const records = new Map();
  (Array.isArray(current) ? current : []).forEach((item) => {
    if (item && item.id !== undefined && item.id !== null) records.set(String(item.id), item);
  });
  (Array.isArray(incoming) ? incoming : []).forEach((item) => {
    if (item && item.id !== undefined && item.id !== null) records.set(String(item.id), item);
  });
  return Array.from(records.values());
}

export function mergeBackupIds(current, incoming) {
  const values = new Map();
  (Array.isArray(current) ? current : []).forEach((value) => values.set(String(value), value));
  (Array.isArray(incoming) ? incoming : []).forEach((value) => values.set(String(value), value));
  return Array.from(values.values());
}

import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_BACKUP_FILE_BYTES,
  createBackupData,
  mergeBackupIds,
  mergeBackupRecords,
  normalizeBackupData,
  parseBackupJson,
} from "../src/domain/backup.js";

function completeData() {
  return {
    theme: "royal",
    profile: { weight: 97 },
    planer: { "2026-09-04": [{ id: 1, kcal: 500 }] },
    recipes: [{ id: "own-recipe" }],
    hiddenRecipes: ["base-recipe"],
    products: [{ id: "own-product" }],
    favorites: ["own-recipe"],
    productFavorites: ["own-product"],
    recentProducts: ["a", "b"],
    productGrams: { "own-product": 150 },
    dayTypes: { "2026-09-04": "training" },
    bodyLog: { "2026-09-04": { weight: 97 } },
    waterLog: { "2026-09-04": { amount: 2500 } },
    waterSettings: { manualTarget: 3000 },
    shoppingChecked: { "own-product": true },
    shoppingManual: { "own-product": 250 },
    pantry: [{ id: "pantry_own-product", productId: "own-product", grams: 500, expiresAt: "2026-09-07" }],
  };
}

test("eksport tworzy wersjonowaną kopię z ustaloną datą", () => {
  const data = completeData();
  const backup = createBackupData(data, "2026-09-04T21:00:00.000Z");
  assert.equal(backup.app, "MatFit Pro");
  assert.equal(backup.schemaVersion, 1);
  assert.equal(backup.version, 26);
  assert.equal(backup.exportedAt, "2026-09-04T21:00:00.000Z");
  assert.strictEqual(backup.data, data);
  assert.equal(MAX_BACKUP_FILE_BYTES, 15 * 1024 * 1024);
});

test("pełna współczesna kopia przechodzi normalizację i podsumowanie", () => {
  const normalized = normalizeBackupData(createBackupData(completeData(), "2026-09-04T21:00:00.000Z"));
  assert.equal(normalized.legacy, false);
  assert.equal(normalized.missing.length, 0);
  assert.equal(normalized.data.profile.weight, 97);
  assert.equal(normalized.data.shoppingManual["own-product"], 250);
  assert.equal(normalized.data.pantry[0].grams, 500);
  assert.deepEqual(normalized.summary, {
    planDays: 1,
    measurements: 1,
    waterDays: 1,
    recipes: 1,
    products: 1,
  });
});

test("stare aliasy danych pozostają obsługiwane", () => {
  const legacy = normalizeBackupData({
    version: 23,
    tn: "light",
    profile: { weight: 95 },
    body: { "2026-08-01": { weight: 95 } },
    water: { "2026-08-01": { amount: 2000 } },
    zakupy: { rice: true },
    product_favorites: ["rice"],
    recent_products: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  });
  assert.equal(legacy.legacy, true);
  assert.equal(legacy.data.theme, "light");
  assert.equal(legacy.data.bodyLog["2026-08-01"].weight, 95);
  assert.equal(legacy.data.waterLog["2026-08-01"].amount, 2000);
  assert.equal(legacy.data.shoppingChecked.rice, true);
  assert.equal(legacy.data.recentProducts.length, 8);
});

test("filtry katalogów są stosowane dopiero po walidacji tablic", () => {
  const raw = createBackupData({
    recipes: [{ id: "base" }, { id: "own" }],
    products: [{ id: "base" }, { id: "own" }],
  });
  const normalized = normalizeBackupData(raw, {
    filterRecipes: (items) => items.filter((item) => item.id === "own"),
    filterProducts: (items) => items.filter((item) => item.id === "own"),
  });
  assert.deepEqual(normalized.data.recipes, [{ id: "own" }]);
  assert.deepEqual(normalized.data.products, [{ id: "own" }]);
  assert.throws(
    () => normalizeBackupData(createBackupData({ products: {} })),
    /Uszkodzona sekcja kopii: produkty/,
  );
});

test("import odrzuca obcy format, nowszy schemat i błędny JSON", () => {
  assert.throws(() => normalizeBackupData({ hello: "world" }), /To nie jest kopia MatFit/);
  assert.throws(
    () => normalizeBackupData({ app: "MatFit Pro", schemaVersion: 2, data: { profile: {} } }),
    /nowszej wersji MatFit/,
  );
  assert.throws(() => parseBackupJson("{nie-json"), /nieprawidłowy format JSON/);
});

test("import blokuje klucze mogące modyfikować prototyp obiektów", () => {
  const malicious = '{"app":"MatFit Pro","schemaVersion":1,"data":{"profile":{"__proto__":{"polluted":true}}}}';
  assert.throws(() => parseBackupJson(malicious), /niedozwolony klucz danych/);
  assert.equal({}.polluted, undefined);
});

test("import odrzuca nadmiernie zagnieżdżoną strukturę", () => {
  const profile = {};
  let cursor = profile;
  for (let index = 0; index < 22; index += 1) {
    cursor.next = {};
    cursor = cursor.next;
  }
  assert.throws(
    () => normalizeBackupData(createBackupData({ profile })),
    /zbyt głęboko zagnieżdżone dane/,
  );
});

test("scalanie rekordów i identyfikatorów zachowuje nowsze dane", () => {
  assert.deepEqual(
    mergeBackupRecords(
      [{ id: 1, name: "stary" }, { id: 2, name: "zostaje" }],
      [{ id: "1", name: "nowy" }, { id: 3, name: "dochodzi" }],
    ),
    [{ id: "1", name: "nowy" }, { id: 2, name: "zostaje" }, { id: 3, name: "dochodzi" }],
  );
  assert.deepEqual(mergeBackupIds([1, 2], ["1", 3]), ["1", 2, 3]);
});

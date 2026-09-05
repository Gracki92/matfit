import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizePantryEntries,
  pantryExpiryStatus,
  rankRecipeMatchesByExpiry,
  removePantryEntry,
  sortPantryEntries,
  upsertPantryEntry,
} from "../src/domain/pantry.js";

test("status terminu rozróżnia produkt po terminie, dzisiejszy, bliski i bez daty", () => {
  assert.deepEqual(pantryExpiryStatus("2026-09-04", "2026-09-05").kind, "expired");
  assert.equal(pantryExpiryStatus("2026-09-05", "2026-09-05").label, "termin dzisiaj");
  assert.equal(pantryExpiryStatus("2026-09-06", "2026-09-05").label, "termin jutro");
  assert.equal(pantryExpiryStatus("", "2026-09-05").kind, "none");
  assert.equal(pantryExpiryStatus("2026-02-30", "2026-09-05").kind, "none");
});

test("spiżarnia odrzuca błędne wpisy i utrzymuje jeden rekord produktu", () => {
  const normalized = normalizePantryEntries([
    { id: "old", productId: "kefir", grams: 100, expiresAt: "2026-09-08" },
    { id: "new", productId: "kefir", grams: 250, expiresAt: "2026-09-07" },
    { id: "bad", productId: "rice", grams: -1 },
  ]);
  assert.deepEqual(normalized, [{
    id: "new",
    productId: "kefir",
    grams: 250,
    expiresAt: "2026-09-07",
    addedAt: "",
  }]);
});

test("dodanie ponowne aktualizuje ilość i termin zamiast dublować produkt", () => {
  const initial = [{ id: "p1", productId: "kefir", grams: 100, expiresAt: "2026-09-08" }];
  const updated = upsertPantryEntry(initial, {
    productId: "kefir",
    grams: 300,
    expiresAt: "2026-09-06",
    addedAt: "2026-09-05",
  });
  assert.equal(updated.length, 1);
  assert.deepEqual(updated[0], {
    id: "p1",
    productId: "kefir",
    grams: 300,
    expiresAt: "2026-09-06",
    addedAt: "2026-09-05",
  });
  assert.deepEqual(removePantryEntry(updated, "kefir"), []);
});

test("spiżarnia sortuje produkty według pilności terminu", () => {
  const sorted = sortPantryEntries([
    { productId: "later", grams: 1, expiresAt: "2026-09-20" },
    { productId: "today", grams: 1, expiresAt: "2026-09-05" },
    { productId: "expired", grams: 1, expiresAt: "2026-09-04" },
  ], "2026-09-05");
  assert.deepEqual(sorted.map((entry) => entry.productId), ["expired", "today", "later"]);
});

test("tryb zużyj najpierw pokazuje przepisy z produktami spiżarni i preferuje pilne", () => {
  const matches = [
    { recipe: { id: "oats", ingredients: [{ productId: "oats" }] } },
    { recipe: { id: "kefir", ingredients: [{ productId: "kefir" }] } },
    { recipe: { id: "rice", ingredients: [{ productId: "rice" }] } },
    { recipe: { id: "milk", ingredients: [{ productId: "milk" }] } },
  ];
  const ranked = rankRecipeMatchesByExpiry(matches, [
    { productId: "oats", grams: 100, expiresAt: "2026-09-20" },
    { productId: "kefir", grams: 200, expiresAt: "2026-09-05" },
    { productId: "milk", grams: 200, expiresAt: "2026-09-04" },
  ], [
    { id: "oats", name: "Płatki" },
    { id: "kefir", name: "Kefir" },
    { id: "rice", name: "Ryż" },
    { id: "milk", name: "Mleko" },
  ], "2026-09-05");
  assert.deepEqual(ranked.map((match) => match.recipe.id), ["kefir", "oats"]);
  assert.equal(ranked[0].priority.products[0].status.kind, "today");
  assert.equal(ranked.some((match) => match.recipe.id === "milk"), false);
});

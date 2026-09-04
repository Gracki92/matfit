import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const app = await readFile(new URL("../src/app.js", import.meta.url), "utf8");

function loadCopyHelpers() {
  const start = app.indexOf("function plannedMealCopyKey");
  const end = app.indexOf("function App()", start);
  assert.ok(start >= 0 && end > start, "funkcje kopiowania powinny istnieć");
  const source = app.slice(start, end);
  const factory = new Function(
    "_objectSpread",
    "rGram",
    `${source}; return { plannedMealCopyKey, clonePlannedMeal };`,
  );
  return factory((...parts) => Object.assign({}, ...parts), (value) => Math.round(value * 10) / 10);
}

test("kod aplikacji ma poprawną składnię", () => {
  assert.doesNotThrow(() => new Function(app));
});

test("identyczny posiłek jest rozpoznawany mimo innego id", () => {
  const { plannedMealCopyKey } = loadCopyHelpers();
  const meal = {
    id: 1,
    type: "product",
    sourceId: "skyr",
    name: "Skyr",
    mealTime: "sniadanie",
    grams: 150,
    items: [{ productId: "skyr", grams: 150 }],
  };
  assert.equal(plannedMealCopyKey(meal), plannedMealCopyKey({ ...meal, id: 999 }));
  assert.notEqual(plannedMealCopyKey(meal), plannedMealCopyKey({ ...meal, grams: 200 }));
});

test("kopia posiłku nie współdzieli tablicy składników ze źródłem", () => {
  const { clonePlannedMeal } = loadCopyHelpers();
  const meal = { id: 1, mealTime: "obiad", items: [{ productId: "ryz", grams: 100 }] };
  const clone = clonePlannedMeal(meal, { mealTime: "kolacja" });
  assert.notEqual(clone.id, meal.id);
  assert.equal(clone.mealTime, "kolacja");
  assert.notStrictEqual(clone.items, meal.items);
  assert.notStrictEqual(clone.items[0], meal.items[0]);
});

test("dane użytkownika zachowują dotychczasowe klucze localStorage", () => {
  for (const key of [
    "fb10_profile",
    "fb10_planer",
    "fb10_recipes",
    "fb10_products",
    "fb10_body",
    "fb10_water",
    "fb10_product_favorites",
    "fb10_recent_products",
    "fb10_product_grams",
  ]) {
    assert.ok(app.includes(key), `brak klucza ${key}`);
  }
});

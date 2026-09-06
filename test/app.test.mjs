import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  clonePlannedMeal,
  createMealTemplate,
  instantiateMealTemplate,
  normalizeMealTemplates,
  plannedMealCopyKey,
  removeMealTemplate,
  upsertMealTemplate,
} from "../src/domain/planner.js";

const app = await readFile(new URL("../src/app.js", import.meta.url), "utf8");

test("kod aplikacji ma poprawną składnię", () => {
  const appPath = fileURLToPath(new URL("../src/app.js", import.meta.url));
  assert.doesNotThrow(() => execFileSync(process.execPath, ["--check", appPath]));
});

test("identyczny posiłek jest rozpoznawany mimo innego id", () => {
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
  assert.notEqual(plannedMealCopyKey(meal), plannedMealCopyKey({ ...meal, mealTime: "kolacja" }));
});

test("kopia posiłku nie współdzieli tablicy składników ze źródłem", () => {
  const meal = { id: 1, mealTime: "obiad", items: [{ productId: "ryz", grams: 100 }] };
  const clone = clonePlannedMeal(meal, { mealTime: "kolacja", id: 999 }, () => 42);
  assert.equal(clone.id, 42);
  assert.equal(clone.mealTime, "kolacja");
  assert.notStrictEqual(clone.items, meal.items);
  assert.notStrictEqual(clone.items[0], meal.items[0]);
  clone.items[0].grams = 200;
  assert.equal(meal.items[0].grams, 100);
});

test("klucz planera zachowuje precyzję gramów do dwóch miejsc", () => {
  const meal = { type: "recipe", sourceId: "owsianka", items: [{ productId: "mleko", grams: 100 }] };
  assert.equal(
    plannedMealCopyKey(meal),
    plannedMealCopyKey({ ...meal, items: [{ productId: "mleko", grams: 100.004 }] }),
  );
  assert.notEqual(
    plannedMealCopyKey(meal),
    plannedMealCopyKey({ ...meal, items: [{ productId: "mleko", grams: 100.006 }] }),
  );
});

test("szablon posiłku przechowuje kopię pozycji bez identyfikatorów planera", () => {
  const meal = {
    id: 10,
    type: "product",
    sourceId: "skyr",
    name: "Skyr",
    mealTime: "kolacja",
    items: [{ productId: "skyr", grams: 200 }],
  };
  const template = createMealTemplate({ id: "protein", name: "  Białkowa kolacja  ", meals: [meal] });
  assert.equal(template.name, "Białkowa kolacja");
  assert.equal(template.meals[0].id, undefined);
  assert.equal(template.meals[0].mealTime, undefined);
  template.meals[0].items[0].grams = 300;
  assert.equal(meal.items[0].grams, 200);
});

test("użycie szablonu tworzy nowe pozycje we wskazanej porze dnia", () => {
  let id = 40;
  const template = createMealTemplate({
    id: "breakfast",
    name: "Śniadanie",
    meals: [
      { name: "Owsianka", items: [{ productId: "oats", grams: 80 }] },
      { name: "Banan", items: [{ productId: "banana", grams: 120 }] },
    ],
  });
  const meals = instantiateMealTemplate(template, "sniadanie", () => ++id);
  assert.deepEqual(meals.map((meal) => meal.id), [41, 42]);
  assert.deepEqual(meals.map((meal) => meal.mealTime), ["sniadanie", "sniadanie"]);
  assert.notStrictEqual(meals[0].items, template.meals[0].items);
});

test("normalizacja, aktualizacja i usuwanie szablonów odrzucają puste rekordy", () => {
  const valid = { id: "one", name: "Pierwszy", meals: [{ name: "Ryż", items: [{ productId: "rice", grams: 100 }] }] };
  assert.equal(normalizeMealTemplates([null, { id: "bad", name: "", meals: [] }, valid]).length, 1);
  const updated = upsertMealTemplate([valid], { ...valid, name: "Nowa nazwa" });
  assert.equal(updated.length, 1);
  assert.equal(updated[0].name, "Nowa nazwa");
  assert.deepEqual(removeMealTemplate(updated, "one"), []);
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
    "fb10_meal_templates",
  ]) {
    assert.ok(app.includes(key), `brak klucza ${key}`);
  }
});

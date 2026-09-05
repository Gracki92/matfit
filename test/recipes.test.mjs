import assert from "node:assert/strict";
import test from "node:test";
import {
  filterRecipesByPantry,
  normalizeRecipeTerm,
  parsePantryTerms,
  recipePantryMatch,
} from "../src/domain/recipes.js";

const products = [
  { id: "chicken", name: "Pierś z kurczaka", brand: "MatFit", state: "surowa" },
  { id: "rice", name: "Ryż basmati", brand: "MatFit", state: "suchy" },
  { id: "broccoli", name: "Brokuł", brand: "MatFit" },
  { id: "tomato", name: "Pomidor", brand: "MatFit" },
  { id: "oats", name: "Płatki owsiane", brand: "MatFit" },
];

const recipes = [
  {
    id: "chicken-rice",
    name: "Kurczak z ryżem",
    cat: "obiad",
    ingredients: [{ productId: "chicken" }, { productId: "rice" }, { productId: "broccoli" }],
  },
  {
    id: "chicken-salad",
    name: "Sałatka z kurczakiem",
    cat: "kolacja",
    ingredients: [{ productId: "chicken" }, { productId: "tomato" }],
  },
  {
    id: "oatmeal",
    name: "Owsianka",
    cat: "sniadanie",
    ingredients: [{ productId: "oats" }],
  },
];

test("frazy spiżarni ignorują wielkość liter, polskie znaki i duplikaty", () => {
  assert.equal(normalizeRecipeTerm("  PIERŚ   z Kurczaka "), "piers z kurczaka");
  assert.deepEqual(parsePantryTerms("Ryż, kurczak; RYŻ\n brokuł"), ["ryz", "kurczak", "brokul"]);
});

test("wszystkie wpisane składniki są obowiązkowe", () => {
  const results = filterRecipesByPantry(recipes, products, { pantry: "kurczak, ryż" });
  assert.equal(results.length, 1);
  assert.equal(results[0].recipe.id, "chicken-rice");
  assert.equal(results[0].pantry.matchPercent, 67);
  assert.deepEqual(results[0].pantry.missingIngredients, ["Brokuł"]);
});

test("dopasowanie wielowyrazowe toleruje słowa łączące w nazwie produktu", () => {
  const match = recipePantryMatch(recipes[0], products, "pierś kurczaka");
  assert.equal(match.matchesAll, true);
  assert.deepEqual(match.matchedTerms, ["piers kurczaka"]);
});

test("przepisy są sortowane od najlepszego pokrycia spiżarni", () => {
  const results = filterRecipesByPantry(recipes, products, { pantry: "kurczak" });
  assert.deepEqual(results.map(({ recipe }) => recipe.id), ["chicken-salad", "chicken-rice"]);
  assert.deepEqual(results.map(({ pantry }) => pantry.matchPercent), [50, 33]);
});

test("zwykłe wyszukiwanie obejmuje nazwy składników i współpracuje z kategorią", () => {
  const byIngredient = filterRecipesByPantry(recipes, products, { search: "brokuł" });
  assert.deepEqual(byIngredient.map(({ recipe }) => recipe.id), ["chicken-rice"]);
  const wrongCategory = filterRecipesByPantry(recipes, products, {
    category: "kolacja",
    pantry: "ryż",
  });
  assert.deepEqual(wrongCategory, []);
});

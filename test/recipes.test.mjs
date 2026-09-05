import assert from "node:assert/strict";
import test from "node:test";
import {
  filterRecipesByPantry,
  normalizeRecipeTerm,
  parsePantryTerms,
  recipeSubstitutionOptions,
  recipePantryMatch,
  replaceRecipeIngredient,
  summarizeRecipeSubstitutions,
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
  assert.deepEqual(results[0].pantry.missingIngredientIndexes, [2]);
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

test("zamienniki pochodzą z tej samej kategorii i pokazują oryginał jako pierwszy", () => {
  const catalog = [
    { id: "kefir", name: "Kefir", category: "dairy", custom: false },
    { id: "yogurt", name: "Jogurt naturalny", category: "dairy", custom: false },
    { id: "own-skyr", name: "Mój skyr", category: "dairy", custom: true },
    { id: "rice", name: "Ryż", category: "carbs", custom: false },
  ];
  const options = recipeSubstitutionOptions("yogurt", catalog);
  assert.deepEqual(options.map((product) => product.id), ["yogurt", "own-skyr", "kefir"]);
});

test("zamiana produktu zachowuje gramaturę i nie modyfikuje wejściowej tablicy", () => {
  const items = [{ productId: "yogurt", grams: 150 }, { productId: "rice", grams: 80 }];
  const changed = replaceRecipeIngredient(items, 0, "kefir", [
    { id: "yogurt" },
    { id: "kefir" },
    { id: "rice" },
  ]);
  assert.deepEqual(changed, [{ productId: "kefir", grams: 150 }, { productId: "rice", grams: 80 }]);
  assert.deepEqual(items, [{ productId: "yogurt", grams: 150 }, { productId: "rice", grams: 80 }]);
});

test("podsumowanie zamienników liczy różnicę makro przy tej samej gramaturze", () => {
  const catalog = [
    { id: "yogurt", name: "Jogurt", kcal: 60, protein: 4, carbs: 5, fat: 2 },
    { id: "kefir", name: "Kefir", kcal: 50, protein: 3, carbs: 4, fat: 2 },
  ];
  const summary = summarizeRecipeSubstitutions(
    [{ productId: "yogurt", grams: 200 }],
    [{ productId: "kefir", grams: 300 }],
    catalog,
  );
  assert.equal(summary.count, 1);
  assert.deepEqual(summary.substitutions[0], {
    index: 0,
    fromProductId: "yogurt",
    toProductId: "kefir",
    fromName: "Jogurt",
    toName: "Kefir",
  });
  assert.deepEqual(summary.delta, { kcal: -30, protein: -3, carbs: -3, fat: 0 });
});

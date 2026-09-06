import assert from "node:assert/strict";
import test from "node:test";
import {
  filterRecipesByPantry,
  normalizeRecipeTerm,
  parsePantryTerms,
  recipeDietarySummary,
  recipeNutritionPerServing,
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

test("filtry czasu i trudności współpracują z pozostałymi filtrami", () => {
  const recipesWithMeta = [
    { id: "quick", name: "Szybki", cat: "obiad", prepMinutes: 10, difficulty: "easy", ingredients: [] },
    { id: "medium", name: "Średni", cat: "obiad", prepMinutes: 25, difficulty: "medium", ingredients: [] },
    { id: "long", name: "Długi", cat: "obiad", prepMinutes: 45, difficulty: "hard", ingredients: [] },
    { id: "unknown", name: "Bez danych", cat: "obiad", ingredients: [] },
  ];
  assert.deepEqual(
    filterRecipesByPantry(recipesWithMeta, [], { time: "max20" }).map((match) => match.recipe.id),
    ["quick"],
  );
  assert.deepEqual(
    filterRecipesByPantry(recipesWithMeta, [], { time: "over30", difficulty: "hard" }).map((match) => match.recipe.id),
    ["long"],
  );
  assert.deepEqual(
    filterRecipesByPantry(recipesWithMeta, [], { time: "all", difficulty: "all" }).map((match) => match.recipe.id),
    ["quick", "medium", "long", "unknown"],
  );
});

test("makro przepisu jest liczone na porcję z katalogu lub zapisanych danych", () => {
  const catalog = [
    { id: "rice", kcal: 350, protein: 8, carbs: 78, fat: 1 },
    { id: "chicken", kcal: 110, protein: 23, carbs: 0, fat: 2 },
  ];
  assert.deepEqual(
    recipeNutritionPerServing({
      servings: 2,
      ingredients: [{ productId: "rice", grams: 100 }, { productId: "chicken", grams: 200 }],
    }, catalog),
    { known: true, kcal: 285, protein: 27 },
  );
  assert.deepEqual(
    recipeNutritionPerServing({ servings: 2, kcal: 800, protein: 60 }, []),
    { known: true, kcal: 400, protein: 30 },
  );
  assert.equal(recipeNutritionPerServing({ ingredients: [{ name: "Produkt" }] }, []).known, false);
});

test("filtry kalorii i białka działają na wartości jednej porcji", () => {
  const catalog = [
    { id: "lean", kcal: 200, protein: 30, carbs: 10, fat: 4 },
    { id: "dense", kcal: 800, protein: 60, carbs: 80, fat: 30 },
  ];
  const recipesWithNutrition = [
    { id: "light", name: "Lekki", servings: 1, ingredients: [{ productId: "lean", grams: 100 }] },
    { id: "balanced", name: "Dwie porcje", servings: 2, ingredients: [{ productId: "dense", grams: 100 }] },
    { id: "large", name: "Duży", servings: 1, ingredients: [{ productId: "dense", grams: 100 }] },
    { id: "unknown", name: "Bez danych", ingredients: [{ name: "Nieznany" }] },
  ];
  assert.deepEqual(
    filterRecipesByPantry(recipesWithNutrition, catalog, { calories: "max500", protein: "min30" })
      .map((match) => match.recipe.id),
    ["light", "balanced"],
  );
  assert.deepEqual(
    filterRecipesByPantry(recipesWithNutrition, catalog, { calories: "over700", protein: "min40" })
      .map((match) => match.recipe.id),
    ["large"],
  );
});

test("filtr sprzętu obsługuje przepisy z wieloma wymaganiami", () => {
  const recipesWithEquipment = [
    { id: "cold", name: "Na zimno", equipment: ["none"], ingredients: [] },
    { id: "pan", name: "Z patelni", equipment: ["pan"], ingredients: [] },
    { id: "combo", name: "Patelnia i garnek", equipment: ["pan", "pot"], ingredients: [] },
    { id: "legacy", name: "Starszy przepis", ingredients: [] },
  ];
  assert.deepEqual(
    filterRecipesByPantry(recipesWithEquipment, [], { equipment: "pan" })
      .map((match) => match.recipe.id),
    ["pan", "combo"],
  );
  assert.deepEqual(
    filterRecipesByPantry(recipesWithEquipment, [], { equipment: "none" })
      .map((match) => match.recipe.id),
    ["cold"],
  );
});

test("filtr wegetariański nie zgaduje statusu brakujących danych", () => {
  const recipesWithDiet = [
    { id: "verified", name: "MatFit", vegetarian: true, vegetarianVerification: "matfit", ingredients: [] },
    { id: "declared", name: "Własny", vegetarian: true, vegetarianVerification: "user", ingredients: [] },
    { id: "meat", name: "Mięsny", vegetarian: false, ingredients: [] },
    { id: "unknown", name: "Bez danych", ingredients: [] },
  ];
  assert.deepEqual(
    filterRecipesByPantry(recipesWithDiet, [], { vegetarian: "yes" })
      .map((match) => match.recipe.id),
    ["verified", "declared"],
  );
});

test("analiza diety wykrywa alergeny i nie potwierdza niepełnych danych", () => {
  const catalog = [
    { id: "base_oats", name: "Płatki", category: "carbs", source: "matfit" },
    { id: "base_milk_2", name: "Mleko", category: "dairy", source: "matfit" },
    { id: "base_banana", name: "Banan", category: "fruit", source: "matfit" },
    { id: "own", name: "Własny produkt", custom: true },
    { id: "declared", name: "Sprawdzony produkt", custom: true, allergenDataStatus: "user", allergens: [], containsLactose: false },
  ];
  assert.deepEqual(
    recipeDietarySummary({ ingredients: [
      { productId: "base_oats" }, { productId: "base_milk_2" }, { productId: "base_banana" },
    ] }, catalog),
    { complete: true, verification: "matfit", allergens: ["gluten", "milk"], unknownIngredients: [], gluten: "contains", lactose: "contains" },
  );
  assert.deepEqual(
    recipeDietarySummary({ ingredients: [{ productId: "base_banana" }] }, catalog),
    { complete: true, verification: "matfit", allergens: [], unknownIngredients: [], gluten: "clear", lactose: "clear" },
  );
  const unknown = recipeDietarySummary({ ingredients: [{ productId: "own" }] }, catalog);
  assert.equal(unknown.complete, false);
  assert.equal(unknown.gluten, "unknown");
  assert.deepEqual(unknown.unknownIngredients, ["Własny produkt"]);
  assert.deepEqual(
    recipeDietarySummary({ ingredients: [{ productId: "declared" }] }, catalog),
    { complete: true, verification: "user", allergens: [], unknownIngredients: [], gluten: "clear", lactose: "clear" },
  );
});

test("filtry bez glutenu, laktozy i alergenu wymagają kompletnych danych", () => {
  const catalog = [
    { id: "base_rice_white_dry", name: "Ryż", category: "carbs", source: "matfit" },
    { id: "base_egg_whole", name: "Jajko", category: "protein", source: "matfit" },
    { id: "base_oats", name: "Płatki", category: "carbs", source: "matfit" },
    { id: "own", name: "Własny produkt", custom: true },
  ];
  const recipesWithClaims = [
    { id: "rice", name: "Ryż", ingredients: [{ productId: "base_rice_white_dry" }] },
    { id: "egg", name: "Jajko z ryżem", ingredients: [{ productId: "base_egg_whole" }, { productId: "base_rice_white_dry" }] },
    { id: "oats", name: "Owsianka", ingredients: [{ productId: "base_oats" }] },
    { id: "unknown", name: "Niepewny", ingredients: [{ productId: "own" }] },
  ];
  assert.deepEqual(
    filterRecipesByPantry(recipesWithClaims, catalog, { gluten: "clear", lactose: "clear" })
      .map((match) => match.recipe.id),
    ["rice", "egg"],
  );
  assert.deepEqual(
    filterRecipesByPantry(recipesWithClaims, catalog, { excludeAllergen: "eggs" })
      .map((match) => match.recipe.id),
    ["rice", "oats"],
  );
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

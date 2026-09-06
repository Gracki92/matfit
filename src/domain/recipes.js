export function normalizeRecipeTerm(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[łŁ]/g, "l")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function parsePantryTerms(value) {
  const seen = new Set();
  return String(value || "")
    .split(/[,;\n]+/)
    .map(normalizeRecipeTerm)
    .filter((term) => {
      if (!term || seen.has(term)) return false;
      seen.add(term);
      return true;
    });
}

function termMatchesText(term, text) {
  const words = term.split(" ").filter(Boolean);
  return words.length > 0 && words.every((word) => text.includes(word));
}

function ingredientDetails(recipe, products) {
  const productById = new Map(
    (Array.isArray(products) ? products : [])
      .filter((product) => product && product.id !== undefined)
      .map((product) => [String(product.id), product]),
  );

  return (Array.isArray(recipe && recipe.ingredients) ? recipe.ingredients : []).map((item, index) => {
    const product = productById.get(String(item && item.productId));
    const label = String((product && product.name) || (item && item.name) || "Nieznany produkt").trim();
    const text = normalizeRecipeTerm([
      label,
      product && product.brand,
      product && product.state,
    ].filter(Boolean).join(" "));
    return { index, label, text };
  });
}

export const RECIPE_ALLERGEN_LABELS = {
  gluten: "gluten",
  milk: "mleko",
  eggs: "jaja",
  fish: "ryby",
  crustaceans: "skorupiaki",
  soy: "soja",
  peanuts: "orzeszki ziemne",
  treeNuts: "orzechy",
  celery: "seler",
};

const GLUTEN_PRODUCT_IDS = new Set([
  "pasta_wheat_dry", "pasta_wheat_cooked", "pasta_wholegrain_dry", "oats",
  "couscous_dry", "bread_wheat", "bread_rye_whole", "graham_roll", "tortilla_wheat",
  "wheat_flour_450", "oat_flour", "barley_pearl_dry", "bulgur_dry", "semolina",
  "bread_whole_wheat",
]);
const EGG_PRODUCT_IDS = new Set(["egg_whole", "egg_white"]);
const FISH_PRODUCT_IDS = new Set([
  "tuna_water", "cod_raw", "salmon_raw", "mackerel_smoked", "sardines_oil", "tilapia_raw",
]);
const SOY_PRODUCT_IDS = new Set(["tofu_natural", "edamame_cooked"]);
const TREE_NUT_PRODUCT_IDS = new Set(["almonds", "walnuts", "cashews", "hazelnuts"]);

function baseProductDietaryData(product) {
  const id = String(product && product.id || "").replace(/^base_/, "");
  const allergens = [];
  if (GLUTEN_PRODUCT_IDS.has(id)) allergens.push("gluten");
  if ((product && product.category === "dairy") || id === "butter_82" || id === "ghee") allergens.push("milk");
  if (EGG_PRODUCT_IDS.has(id)) allergens.push("eggs");
  if (FISH_PRODUCT_IDS.has(id)) allergens.push("fish");
  if (id === "shrimp_cooked") allergens.push("crustaceans");
  if (SOY_PRODUCT_IDS.has(id)) allergens.push("soy");
  if (id === "peanut_butter") allergens.push("peanuts");
  if (TREE_NUT_PRODUCT_IDS.has(id)) allergens.push("treeNuts");
  if (id === "celeriac") allergens.push("celery");
  return {
    allergens,
    containsLactose: (product && product.category === "dairy") || id === "butter_82" || id === "ghee",
  };
}

export function recipeDietarySummary(recipe, products) {
  const productsById = productMap(products);
  const ingredients = Array.isArray(recipe && recipe.ingredients) ? recipe.ingredients : [];
  const allergens = new Set();
  const unknownIngredients = [];
  let containsLactose = false;
  let userDeclaredIngredients = 0;

  ingredients.forEach((item) => {
    const product = productsById.get(String(item && item.productId));
    if (!product) {
      unknownIngredients.push(String(item && item.name || "Nieznany produkt"));
      return;
    }
    let data = null;
    if (product.source === "matfit" || String(product.id || "").startsWith("base_")) {
      data = baseProductDietaryData(product);
    } else if (product.allergenDataStatus === "user" && Array.isArray(product.allergens)) {
      data = { allergens: product.allergens, containsLactose: product.containsLactose === true };
      userDeclaredIngredients += 1;
    }
    if (!data) {
      unknownIngredients.push(product.name || "Nieznany produkt");
      return;
    }
    data.allergens.filter((key) => RECIPE_ALLERGEN_LABELS[key]).forEach((key) => allergens.add(key));
    if (data.containsLactose) containsLactose = true;
  });

  const complete = ingredients.length > 0 && unknownIngredients.length === 0;
  return {
    complete,
    verification: complete ? userDeclaredIngredients > 0 ? "user" : "matfit" : "incomplete",
    allergens: [...allergens],
    unknownIngredients: [...new Set(unknownIngredients)],
    gluten: allergens.has("gluten") ? "contains" : complete ? "clear" : "unknown",
    lactose: containsLactose ? "contains" : complete ? "clear" : "unknown",
  };
}

export function recipePantryMatch(recipe, products, pantryValue) {
  const terms = parsePantryTerms(pantryValue);
  const ingredients = ingredientDetails(recipe, products);
  const matchedIngredientIndexes = new Set();
  const matchedTerms = terms.filter((term) =>
    ingredients.some((ingredient) => {
      const matches = termMatchesText(term, ingredient.text);
      if (matches) matchedIngredientIndexes.add(ingredient.index);
      return matches;
    }),
  );
  const missingIngredients = ingredients
    .filter((ingredient) => !matchedIngredientIndexes.has(ingredient.index))
    .map((ingredient) => ingredient.label)
    .filter((label, index, labels) => labels.indexOf(label) === index);

  return {
    active: terms.length > 0,
    matchesAll: terms.length > 0 && matchedTerms.length === terms.length,
    matchedTerms,
    missingIngredientIndexes: ingredients
      .filter((ingredient) => !matchedIngredientIndexes.has(ingredient.index))
      .map((ingredient) => ingredient.index),
    missingIngredients,
    matchPercent: ingredients.length > 0
      ? Math.round((matchedIngredientIndexes.size / ingredients.length) * 100)
      : 0,
  };
}

export function recipeNutritionPerServing(recipe, products) {
  const servings = Math.max(0.1, Number(recipe && recipe.servings) || 1);
  const ingredients = Array.isArray(recipe && recipe.ingredients) ? recipe.ingredients : [];
  const productsById = productMap(products);
  const linkedIngredients = ingredients.length > 0
    && ingredients.every((item) => item && item.productId !== undefined);
  const completeCatalog = linkedIngredients
    && ingredients.every((item) => productsById.has(String(item.productId)));

  if (completeCatalog) {
    const macro = macroForRecipeItems(ingredients, productsById);
    return {
      known: true,
      kcal: macro.kcal / servings,
      protein: macro.protein / servings,
    };
  }

  const kcal = Number(recipe && recipe.kcal);
  const protein = Number(recipe && recipe.protein);
  if (Number.isFinite(kcal) && kcal >= 0 && Number.isFinite(protein) && protein >= 0) {
    return { known: true, kcal: kcal / servings, protein: protein / servings };
  }
  return { known: false, kcal: 0, protein: 0 };
}

export function filterRecipesByPantry(recipes, products, options = {}) {
  const category = options.category || "all";
  const search = normalizeRecipeTerm(options.search);
  const pantry = options.pantry || "";
  const time = options.time || "all";
  const difficulty = options.difficulty || "all";
  const calories = options.calories || "all";
  const protein = options.protein || "all";
  const equipment = options.equipment || "all";
  const vegetarian = options.vegetarian || "all";
  const gluten = options.gluten || "all";
  const lactose = options.lactose || "all";
  const excludeAllergen = options.excludeAllergen || "all";

  return (Array.isArray(recipes) ? recipes : [])
    .map((recipe, index) => ({
      recipe,
      pantry: recipePantryMatch(recipe, products, pantry),
      index,
    }))
    .filter(({ recipe, pantry: match }) => {
      const nutrition = recipeNutritionPerServing(recipe, products);
      const dietary = recipeDietarySummary(recipe, products);
      if (category !== "all" && recipe.cat !== category) return false;
      if (difficulty !== "all" && recipe.difficulty !== difficulty) return false;
      if (equipment !== "all") {
        const recipeEquipment = Array.isArray(recipe.equipment) ? recipe.equipment : [];
        if (!recipeEquipment.includes(equipment)) return false;
      }
      if (vegetarian === "yes" && recipe.vegetarian !== true) return false;
      if (gluten === "clear" && dietary.gluten !== "clear") return false;
      if (lactose === "clear" && dietary.lactose !== "clear") return false;
      if (excludeAllergen !== "all" && (!dietary.complete || dietary.allergens.includes(excludeAllergen))) return false;
      if (time !== "all") {
        const minutes = Number(recipe.prepMinutes);
        if (!Number.isFinite(minutes) || minutes <= 0) return false;
        if (time === "max10" && minutes > 10) return false;
        if (time === "max20" && minutes > 20) return false;
        if (time === "max30" && minutes > 30) return false;
        if (time === "over30" && minutes <= 30) return false;
      }
      if (calories !== "all") {
        if (!nutrition.known) return false;
        if (calories === "max300" && nutrition.kcal > 300) return false;
        if (calories === "max500" && nutrition.kcal > 500) return false;
        if (calories === "max700" && nutrition.kcal > 700) return false;
        if (calories === "over700" && nutrition.kcal <= 700) return false;
      }
      if (protein !== "all") {
        if (!nutrition.known) return false;
        if (protein === "min20" && nutrition.protein < 20) return false;
        if (protein === "min30" && nutrition.protein < 30) return false;
        if (protein === "min40" && nutrition.protein < 40) return false;
      }
      if (match.active && !match.matchesAll) return false;
      if (!search) return true;

      const ingredientText = ingredientDetails(recipe, products)
        .map((ingredient) => ingredient.text)
        .join(" ");
      return normalizeRecipeTerm(recipe.name).includes(search) || ingredientText.includes(search);
    })
    .sort((left, right) => {
      if (!left.pantry.active) return left.index - right.index;
      return right.pantry.matchPercent - left.pantry.matchPercent
        || left.pantry.missingIngredients.length - right.pantry.missingIngredients.length
        || left.index - right.index;
    })
    .map(({ recipe, pantry: match }) => ({ recipe, pantry: match }));
}

function productMap(products) {
  return new Map(
    (Array.isArray(products) ? products : [])
      .filter((product) => product && product.id !== undefined)
      .map((product) => [String(product.id), product]),
  );
}

export function recipeSubstitutionOptions(originalProductId, products) {
  const list = Array.isArray(products) ? products.filter(Boolean) : [];
  const original = list.find((product) => String(product.id) === String(originalProductId));
  if (!original) return [];

  return list
    .filter((product) => product.category === original.category)
    .sort((left, right) => {
      const leftOriginal = String(left.id) === String(originalProductId);
      const rightOriginal = String(right.id) === String(originalProductId);
      if (leftOriginal !== rightOriginal) return leftOriginal ? -1 : 1;
      if (!!left.custom !== !!right.custom) return left.custom ? -1 : 1;
      return String(left.name || "").localeCompare(String(right.name || ""), "pl");
    });
}

export function replaceRecipeIngredient(items, index, nextProductId, products) {
  const list = Array.isArray(items) ? items : [];
  const validProduct = (Array.isArray(products) ? products : []).some(
    (product) => product && String(product.id) === String(nextProductId),
  );
  if (!validProduct || index < 0 || index >= list.length) return list.map((item) => ({ ...item }));

  return list.map((item, itemIndex) =>
    itemIndex === index ? { ...item, productId: nextProductId } : { ...item },
  );
}

function macroForRecipeItems(items, productsById) {
  return (Array.isArray(items) ? items : []).reduce((total, item) => {
    const product = productsById.get(String(item && item.productId));
    const factor = Math.max(0, Number(item && item.grams) || 0) / 100;
    if (!product) return total;
    total.kcal += (Number(product.kcal) || 0) * factor;
    total.protein += (Number(product.protein) || 0) * factor;
    total.carbs += (Number(product.carbs) || 0) * factor;
    total.fat += (Number(product.fat) || 0) * factor;
    return total;
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
}

export function summarizeRecipeSubstitutions(originalIngredients, currentItems, products) {
  const originalList = Array.isArray(originalIngredients) ? originalIngredients : [];
  const currentList = Array.isArray(currentItems) ? currentItems : [];
  const productsById = productMap(products);
  const substitutions = [];
  const comparableOriginalItems = currentList.map((item, index) => {
    const originalProductId = originalList[index] && originalList[index].productId;
    const productId = originalProductId === undefined ? item.productId : originalProductId;
    if (String(productId) !== String(item.productId)) {
      const from = productsById.get(String(productId));
      const to = productsById.get(String(item.productId));
      substitutions.push({
        index,
        fromProductId: productId,
        toProductId: item.productId,
        fromName: (from && from.name) || "Nieznany produkt",
        toName: (to && to.name) || "Nieznany produkt",
      });
    }
    return { ...item, productId };
  });
  const originalMacro = macroForRecipeItems(comparableOriginalItems, productsById);
  const currentMacro = macroForRecipeItems(currentList, productsById);

  return {
    count: substitutions.length,
    substitutions,
    delta: {
      kcal: currentMacro.kcal - originalMacro.kcal,
      protein: currentMacro.protein - originalMacro.protein,
      carbs: currentMacro.carbs - originalMacro.carbs,
      fat: currentMacro.fat - originalMacro.fat,
    },
  };
}

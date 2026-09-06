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

export function filterRecipesByPantry(recipes, products, options = {}) {
  const category = options.category || "all";
  const search = normalizeRecipeTerm(options.search);
  const pantry = options.pantry || "";
  const time = options.time || "all";
  const difficulty = options.difficulty || "all";

  return (Array.isArray(recipes) ? recipes : [])
    .map((recipe, index) => ({
      recipe,
      pantry: recipePantryMatch(recipe, products, pantry),
      index,
    }))
    .filter(({ recipe, pantry: match }) => {
      if (category !== "all" && recipe.cat !== category) return false;
      if (difficulty !== "all" && recipe.difficulty !== difficulty) return false;
      if (time !== "all") {
        const minutes = Number(recipe.prepMinutes);
        if (!Number.isFinite(minutes) || minutes <= 0) return false;
        if (time === "max10" && minutes > 10) return false;
        if (time === "max20" && minutes > 20) return false;
        if (time === "max30" && minutes > 30) return false;
        if (time === "over30" && minutes <= 30) return false;
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

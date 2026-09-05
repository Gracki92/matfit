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

  return (Array.isArray(recipes) ? recipes : [])
    .map((recipe, index) => ({
      recipe,
      pantry: recipePantryMatch(recipe, products, pantry),
      index,
    }))
    .filter(({ recipe, pantry: match }) => {
      if (category !== "all" && recipe.cat !== category) return false;
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

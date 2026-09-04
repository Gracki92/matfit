function roundGrams(value) {
  return Math.round(value * 100) / 100;
}

export function plannedMealCopyKey(meal) {
  const items = (meal && Array.isArray(meal.items) ? meal.items : [])
    .map((item) => `${String(item.productId || "")}:${String(roundGrams(parseFloat(item.grams) || 0))}`)
    .join("|");

  return [
    (meal && meal.type) || "",
    (meal && (meal.sourceId || meal.name)) || "",
    (meal && meal.mealTime) || "",
    (meal && meal.grams) || "",
    (meal && meal.portions) || "",
    items,
  ].join("::");
}

export function clonePlannedMeal(
  meal,
  overrides = {},
  createId = () => Date.now() + Math.random(),
) {
  return {
    ...(meal || {}),
    ...overrides,
    id: createId(),
    items: (meal && Array.isArray(meal.items) ? meal.items : []).map((item) => ({ ...item })),
  };
}

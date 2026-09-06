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

export function createMealTemplate(candidate) {
  const name = String((candidate && candidate.name) || "").trim().slice(0, 80);
  const sourceMeals = candidate && Array.isArray(candidate.meals) ? candidate.meals : [];
  if (!name || !sourceMeals.length) return null;
  const meals = sourceMeals
    .filter((meal) => meal && Array.isArray(meal.items) && meal.items.length)
    .map((meal) => {
      const { id, mealTime, ...storedMeal } = meal;
      return {
        ...storedMeal,
        items: meal.items.map((item) => ({ ...item })),
      };
    });
  if (!meals.length) return null;
  return {
    id: String(candidate.id || `meal_template_${Date.now()}`),
    name,
    meals,
    createdAt: String(candidate.createdAt || ""),
  };
}

export function normalizeMealTemplates(value) {
  const templates = new Map();
  (Array.isArray(value) ? value : []).forEach((candidate) => {
    const template = createMealTemplate(candidate);
    if (template) templates.set(template.id, template);
  });
  return Array.from(templates.values());
}

export function upsertMealTemplate(templates, candidate) {
  const next = createMealTemplate(candidate);
  const normalized = normalizeMealTemplates(templates);
  if (!next) return normalized;
  return [next, ...normalized.filter((template) => template.id !== next.id)];
}

export function removeMealTemplate(templates, templateId) {
  return normalizeMealTemplates(templates).filter((template) => template.id !== String(templateId));
}

export function instantiateMealTemplate(template, mealTime, createId = () => Date.now() + Math.random()) {
  const normalized = createMealTemplate(template);
  if (!normalized) return [];
  return normalized.meals.map((meal) => clonePlannedMeal(meal, {
    mealTime: String(mealTime || "sniadanie"),
  }, createId));
}

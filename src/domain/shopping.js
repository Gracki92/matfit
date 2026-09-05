function safeGrams(value) {
  const grams = Number(value);
  return Number.isFinite(grams) && grams > 0 ? grams : 0;
}

export function normalizeShoppingQuantities(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const normalized = {};
  Object.entries(source).forEach(([productId, grams]) => {
    const quantity = safeGrams(grams);
    if (productId && quantity > 0) normalized[productId] = quantity;
  });
  return normalized;
}

export function missingRecipeShoppingItems(currentItems, missingIngredientIndexes) {
  const items = Array.isArray(currentItems) ? currentItems : [];
  const indexes = new Set(
    (Array.isArray(missingIngredientIndexes) ? missingIngredientIndexes : [])
      .map(Number)
      .filter((index) => Number.isInteger(index) && index >= 0 && index < items.length),
  );
  const quantities = new Map();
  indexes.forEach((index) => {
    const item = items[index];
    if (!item || item.productId === undefined || item.productId === null) return;
    const productId = String(item.productId);
    const grams = safeGrams(item.grams);
    if (!productId || grams <= 0) return;
    quantities.set(productId, (quantities.get(productId) || 0) + grams);
  });
  return Array.from(quantities, ([productId, grams]) => ({ productId, grams }));
}

export function mergeShoppingQuantities(current, items) {
  const next = normalizeShoppingQuantities(current);
  (Array.isArray(items) ? items : []).forEach((item) => {
    if (!item || item.productId === undefined || item.productId === null) return;
    const productId = String(item.productId);
    const grams = safeGrams(item.grams);
    if (!productId || grams <= 0) return;
    next[productId] = (next[productId] || 0) + grams;
  });
  return next;
}

export function removeManualShoppingProduct(current, productId) {
  const next = normalizeShoppingQuantities(current);
  delete next[String(productId)];
  return next;
}

export function buildShoppingMap(plannedItems, products, manualQuantities) {
  const catalog = new Map(
    (Array.isArray(products) ? products : [])
      .filter((product) => product && product.id !== undefined)
      .map((product) => [String(product.id), product]),
  );
  const map = {};
  function add(productId, grams, source) {
    const id = String(productId);
    const product = catalog.get(id);
    const quantity = safeGrams(grams);
    if (!product || quantity <= 0) return;
    if (!map[id]) {
      map[id] = {
        name: product.name,
        qty: 0,
        plannedQty: 0,
        manualQty: 0,
        packageSize: product.packageSize || null,
      };
    }
    map[id].qty += quantity;
    map[id][source] += quantity;
  }

  (Array.isArray(plannedItems) ? plannedItems : []).forEach((item) => {
    if (item) add(item.productId, item.grams, "plannedQty");
  });
  Object.entries(normalizeShoppingQuantities(manualQuantities)).forEach(([productId, grams]) => {
    add(productId, grams, "manualQty");
  });
  return map;
}

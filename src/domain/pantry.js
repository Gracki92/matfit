const DAY_MS = 24 * 60 * 60 * 1000;

function validIsoDay(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
  if (!match) return "";
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
    ? match[0]
    : "";
}

function dayNumber(value) {
  const valid = validIsoDay(value);
  if (!valid) return null;
  const [year, month, day] = valid.split("-").map(Number);
  return Date.UTC(year, month - 1, day) / DAY_MS;
}

export function pantryExpiryStatus(expiresAt, today) {
  const expiry = dayNumber(expiresAt);
  const current = dayNumber(today);
  if (expiry === null || current === null) {
    return { kind: "none", days: null, label: "bez terminu", urgency: 1 };
  }
  const days = expiry - current;
  if (days < 0) {
    const overdue = Math.abs(days);
    return {
      kind: "expired",
      days,
      label: overdue === 1 ? "1 dzień po terminie" : `${overdue} dni po terminie`,
      urgency: 1000 + Math.min(30, overdue),
    };
  }
  if (days === 0) return { kind: "today", days, label: "termin dzisiaj", urgency: 900 };
  if (days === 1) return { kind: "soon", days, label: "termin jutro", urgency: 800 };
  if (days <= 7) return { kind: "soon", days, label: `termin za ${days} dni`, urgency: 800 - days };
  return { kind: "later", days, label: `termin za ${days} dni`, urgency: Math.max(2, 200 - days) };
}

export function normalizePantryEntries(value) {
  const entries = Array.isArray(value) ? value : [];
  const byProduct = new Map();
  entries.forEach((entry) => {
    if (!entry || entry.productId === undefined || entry.productId === null) return;
    const productId = String(entry.productId).trim();
    const grams = Number(entry.grams);
    if (!productId || !Number.isFinite(grams) || grams <= 0) return;
    byProduct.set(productId, {
      id: String(entry.id || `pantry_${productId}`),
      productId,
      grams,
      expiresAt: validIsoDay(entry.expiresAt),
      addedAt: validIsoDay(entry.addedAt),
    });
  });
  return Array.from(byProduct.values());
}

export function upsertPantryEntry(entries, candidate) {
  const normalized = normalizePantryEntries(entries);
  const productId = String((candidate && candidate.productId) || "").trim();
  const grams = Number(candidate && candidate.grams);
  if (!productId || !Number.isFinite(grams) || grams <= 0) return normalized;
  const existing = normalized.find((entry) => entry.productId === productId);
  const nextEntry = {
    id: existing ? existing.id : String(candidate.id || `pantry_${productId}`),
    productId,
    grams,
    expiresAt: validIsoDay(candidate.expiresAt),
    addedAt: validIsoDay(candidate.addedAt),
  };
  return [nextEntry, ...normalized.filter((entry) => entry.productId !== productId)];
}

export function removePantryEntry(entries, productId) {
  return normalizePantryEntries(entries).filter((entry) => entry.productId !== String(productId));
}

export function sortPantryEntries(entries, today) {
  return normalizePantryEntries(entries).sort((left, right) => {
    const leftStatus = pantryExpiryStatus(left.expiresAt, today);
    const rightStatus = pantryExpiryStatus(right.expiresAt, today);
    return rightStatus.urgency - leftStatus.urgency || left.productId.localeCompare(right.productId);
  });
}

export function rankRecipeMatchesByExpiry(matches, pantryEntries, products, today) {
  const catalog = new Map(
    (Array.isArray(products) ? products : [])
      .filter((product) => product && product.id !== undefined)
      .map((product) => [String(product.id), product]),
  );
  const pantry = sortPantryEntries(pantryEntries, today);
  return (Array.isArray(matches) ? matches : [])
    .map((match, index) => {
      const recipeIds = new Set(
        (Array.isArray(match && match.recipe && match.recipe.ingredients) ? match.recipe.ingredients : [])
          .map((item) => String(item && item.productId)),
      );
      const used = pantry.filter((entry) => recipeIds.has(entry.productId))
        .map((entry) => {
        const product = catalog.get(entry.productId);
        return {
          ...entry,
          name: (product && product.name) || "Nieznany produkt",
          status: pantryExpiryStatus(entry.expiresAt, today),
        };
        })
        .filter((entry) => entry.status.kind !== "expired");
      const maxUrgency = used.reduce((maximum, entry) => Math.max(maximum, entry.status.urgency), 0);
      const urgencyTotal = used.reduce((sum, entry) => sum + entry.status.urgency, 0);
      return {
        ...match,
        priority: {
          active: true,
          products: used,
          score: maxUrgency * 100 + urgencyTotal,
        },
        index,
      };
    })
    .filter((match) => match.priority.products.length > 0)
    .sort((left, right) => right.priority.score - left.priority.score
      || right.priority.products.length - left.priority.products.length
      || left.index - right.index)
    .map(({ index, ...match }) => match);
}

export function normalizeBarcode(value) {
  return String(value || "").replace(/\D/g, "");
}

export function isValidGtin(value) {
  const code = normalizeBarcode(value);
  if (![8, 12, 13, 14].includes(code.length)) return false;

  let sum = 0;
  const payload = code.slice(0, -1);
  for (let index = payload.length - 1, weight = 3; index >= 0; index -= 1) {
    sum += Number(payload[index]) * weight;
    weight = weight === 3 ? 1 : 3;
  }
  return (10 - (sum % 10)) % 10 === Number(code[code.length - 1]);
}

function baseProductIds(defaultProducts) {
  return new Set((Array.isArray(defaultProducts) ? defaultProducts : []).map((product) => product.id));
}

export function mergeProductCatalog(storedProducts, defaultProducts) {
  const baseIds = baseProductIds(defaultProducts);
  const seenIds = new Set();
  const userProducts = (Array.isArray(storedProducts) ? storedProducts : []).filter((product) => {
    if (!product || !product.id || baseIds.has(product.id) || seenIds.has(product.id)) return false;
    seenIds.add(product.id);
    return true;
  });
  return userProducts.concat(Array.isArray(defaultProducts) ? defaultProducts : []);
}

export function onlyUserProducts(products, defaultProducts) {
  const baseIds = baseProductIds(defaultProducts);
  return (Array.isArray(products) ? products : []).filter(
    (product) => product && product.id && !baseIds.has(product.id),
  );
}

export function findProductByBarcode(products, barcode) {
  const normalized = normalizeBarcode(barcode);
  if (!normalized) return undefined;
  return (Array.isArray(products) ? products : []).find(
    (product) => normalizeBarcode(product && product.ean) === normalized,
  );
}

export function findDuplicateProduct(products, candidate) {
  const normalizedEan = normalizeBarcode(candidate && candidate.ean);
  if (normalizedEan) return findProductByBarcode(products, normalizedEan);

  const name = String((candidate && candidate.name) || "").toLowerCase();
  const brand = String((candidate && candidate.brand) || "").trim().toLowerCase();
  return (Array.isArray(products) ? products : []).find(
    (product) =>
      String((product && product.name) || "").toLowerCase() === name &&
      String((product && product.brand) || "").trim().toLowerCase() === brand,
  );
}

export function filterProductCatalog(products, options = {}) {
  const category = options.category || "all";
  const searchNeedle = String(options.search || "").trim().toLowerCase();
  const favoriteIds = Array.isArray(options.favoriteIds) ? options.favoriteIds : [];
  const categories = Array.isArray(options.categories) ? options.categories : [];

  return (Array.isArray(products) ? products : []).filter((product) => {
    const categoryMatch =
      category === "all" ||
      (category === "own" && product.custom) ||
      (category === "favorite" && favoriteIds.includes(product.id)) ||
      product.category === category;
    if (!categoryMatch) return false;
    if (!searchNeedle) return true;

    const categoryLabel =
      (categories.find((option) => option.key === product.category) || {}).label || "";
    return [product.name, product.brand, product.state, categoryLabel].some((value) =>
      String(value || "").toLowerCase().includes(searchNeedle),
    );
  });
}

export function countProductTypes(products) {
  const list = Array.isArray(products) ? products : [];
  const user = list.filter((product) => product && product.custom).length;
  return { user, base: list.length - user };
}

export function toggleProductId(current, id) {
  const ids = Array.isArray(current) ? current : [];
  return ids.includes(id) ? ids.filter((value) => value !== id) : [id, ...ids];
}

export function nextRecentProductIds(current, id, limit = 8) {
  if (!id) return Array.isArray(current) ? current.slice(0, limit) : [];
  const ids = (Array.isArray(current) ? current : []).filter((value) => value !== id);
  return [id, ...ids].slice(0, limit);
}

// Szczegółowe wartości referencyjne na 100 g: [cukry, błonnik, tł. nasycone, sól, FDC ID].
// Źródło: USDA FoodData Central, SR Legacy. Sól = sód x 2,5; brak lub niespójny pomiar pozostaje null.
// Produkty zależne od marki (np. skyr, WPC, pudding) celowo nie dostają wartości „na oko”.
const BASE_PRODUCT_NUTRITION = {
  chicken_breast_raw: [0, 0, 0.563, 0.113, 171077],
  chicken_breast_cooked: [0, 0, 1.01, 0.185, 171477],
  chicken_thigh_skinless: [0, 0, 1.097, 0.237, 173627],
  turkey_breast_raw: [0, 0, 0.344, 0.185, 174515],
  turkey_mince: [0, 0, 2.17, 0.172, 172850],
  pork_loin_raw: [0, 0, 0.801, 0.217, 168263],
  pork_tenderloin: [0, 0, 0.698, 0.133, 168249],
  beef_lean: [0, 0, 1.508, 0.14, 174055],
  beef_mince_5: [0, 0, 2.182, 0.165, 171790],
  egg_whole: [0.37, 0, 3.126, 0.355, 171287],
  egg_white: [0.7, 0, 0, 0.415, 172183],
  tuna_water: [0, 0, 0.211, 0.618, 173709],
  cod_raw: [0, 0, 0.131, 0.135, 171955],
  salmon_raw: [0, 0, 3.05, 0.147, 175167],
  shrimp_cooked: [null, null, 0.056, 0.278, 175180],
  tofu_natural: [0.62, 0.3, 0.691, 0.018, 172476],
  sardines_oil: [0, 0, 1.528, 0.767, 175139],
  tilapia_raw: [0, 0, 0.585, 0.13, 175176],
  edamame_cooked: [2.18, 5.2, 0.62, 0.015, 168411],
  greek_yogurt_0: [3.24, 0, 0.117, 0.09, 170894],
  yogurt_natural_2: [null, 0, 1, 0.175, 170886],
  cottage_light: [null, 0, 1.235, 0.77, 172182],
  cottage_regular: [null, 0, 1.718, 0.787, 172179],
  milk_2: [null, 0, 1.257, 0.117, 171267],
  gouda: [null, 0, 17.614, 2.047, 171241],
  greek_yogurt_whole: [4, 0, 2.395, 0.087, 171304],
  mozzarella_regular: [0, 0, 13.9, 1.215, 170845],
  feta: [0, 0, 13.3, 2.848, 173420],
  cheddar: [0.48, 0, 18.867, 1.633, 173414],
  buttermilk: [null, 0, 0.66, 0.37, 170874],
  rice_white_dry: [0.12, 1.3, 0.18, 0.013, 169756],
  rice_basmati_dry: [0.12, 1.3, 0.18, 0.013, 169756],
  rice_white_cooked: [0.05, 0.4, 0.077, 0.003, 169757],
  pasta_wheat_dry: [2.67, 3.2, 0.277, 0.015, 169736],
  pasta_wheat_cooked: [0.56, 1.8, 0.176, 0.003, 168928],
  pasta_wholegrain_dry: [2.74, 9.2, 0.428, 0.015, 169738],
  oats: [null, 10.6, 1.217, 0.005, 169705],
  rice_cereal: [0.3, 0.7, 0.136, 0.015, 173900],
  buckwheat_dry: [null, 10.3, 0.591, 0.028, 170685],
  millet_dry: [null, 8.5, 0.723, 0.013, 169702],
  couscous_dry: [null, 5, 0.117, 0.025, 169699],
  bread_wheat: [5.67, 2.7, 0.698, 1.225, 174924],
  bread_rye_whole: [3.85, 5.8, 0.626, 1.508, 172684],
  graham_roll: [8.46, 7.5, 0.836, 1.302, 172794],
  tortilla_wheat: [null, 3.3, 1.745, 1.195, 173242],
  potato_raw: [0.82, 2.1, 0.025, 0.015, 170026],
  sweet_potato_raw: [4.18, 3, 0.018, 0.138, 168482],
  rice_cakes: [0.88, 4.2, 0.57, 0.065, 170250],
  cornflakes: [7.84, 2.7, 0.227, 1.427, 174648],
  wheat_flour_450: [0.27, 2.7, 0.155, 0.005, 168894],
  oat_flour: [null, 10.6, 1.217, 0.005, 169705],
  lentils_red_dry: [2.03, 10.7, 0.154, 0.015, 172420],
  chickpeas_canned: [4.01, 6.4, 0.214, 0.615, 173800],
  kidney_beans_canned: [1.85, 4.3, 0.141, 0.74, 173741],
  rice_brown_dry: [0.66, 3.6, 0.591, 0.013, 169703],
  rice_brown_cooked: [0.24, 1.6, 0.26, 0.01, 169704],
  quinoa_dry: [null, 7, 0.706, 0.013, 168874],
  quinoa_cooked: [0.87, 2.8, 0.231, 0.018, 168917],
  barley_pearl_dry: [0.8, 15.6, 0.244, 0.022, 170284],
  bulgur_dry: [0.41, 12.5, 0.232, 0.043, 170688],
  rice_noodles_dry: [0.12, 1.6, 0.153, 0.455, 169742],
  corn_flour: [0.64, 7.3, 0.543, 0.013, 170290],
  cornstarch: [0, 0.9, 0.009, 0.022, 169698],
  semolina: [null, 3.9, 0.15, 0.003, 168933],
  bread_whole_wheat: [4.34, 6, 0.722, 1.137, 172688],
  tortilla_corn: [0.88, 6.3, 0.453, 0.113, 175036],
  cocoa_unsweetened: [1.75, 37, 8.07, 0.052, 169593],
  honey: [82.12, 0.2, 0, 0.01, 169640],
  sugar_white: [99.8, 0, 0, 0.003, 169655],
  olive_oil: [0, 0, 13.808, 0.005, 171413],
  rapeseed_oil: [0, 0, 7.365, 0, 172336],
  butter_82: [0.06, 0, 50.489, 0.028, 173430],
  peanut_butter: [10.49, 5, 10.325, 0.043, 172470],
  almonds: [4.35, 12.5, 3.802, 0.003, 170567],
  walnuts: [2.61, 6.7, 6.126, 0.005, 170187],
  flaxseed: [1.55, 27.3, 3.663, 0.075, 169414],
  chia: [null, 34.4, 3.33, 0.04, 170554],
  avocado: [0.66, 6.7, 2.126, 0.018, 171705],
  ghee: [0, 0, 61.924, 0.005, 173412],
  cashews: [5.91, 3.3, 7.783, 0.03, 170162],
  hazelnuts: [4.34, 9.7, 4.464, 0, 170581],
  pumpkin_seeds: [1.4, 6, 8.659, 0.018, 170556],
  sunflower_seeds: [2.62, 8.6, 4.455, 0.022, 170562],
  coconut_dried: [7.35, 16.3, 57.218, 0.092, 170170],
  tomato: [2.63, 1.2, 0.028, 0.013, 170457],
  cucumber: [1.67, 0.5, 0.037, 0.005, 168409],
  pepper_red: [4.2, 2.1, 0.059, 0.01, 170108],
  zucchini: [2.5, 1, 0.084, 0.02, 169291],
  broccoli: [1.7, 2.6, 0.114, 0.083, 170379],
  cauliflower: [1.91, 2, 0.13, 0.075, 169986],
  carrot: [4.74, 2.8, 0.032, 0.172, 170393],
  onion: [4.24, 1.7, 0.042, 0.01, 170000],
  spinach: [0.42, 2.2, 0.063, 0.198, 168462],
  peas_frozen: [5, 4.5, 0.066, 0.27, 170016],
  cabbage_white: [3.2, 2.5, 0.034, 0.045, 169975],
  mushrooms_white: [1.98, 1, 0.05, 0.013, 169251],
  green_beans: [3.26, 2.7, 0.05, 0.015, 169961],
  sweetcorn_canned: [4.44, 2, 0.245, 0.512, 169214],
  beetroot: [6.76, 2.8, 0.027, 0.195, 169145],
  lettuce_green: [0.78, 1.3, 0.02, 0.07, 169249],
  garlic: [1, 2.1, 0.089, 0.043, 169230],
  celeriac: [1.6, 1.8, 0.079, 0.25, 170400],
  tomato_puree: [4.83, 1.9, 0.029, 0.07, 170460],
  tomatoes_canned: [4.4, 1.9, 0.04, 0.465, 170501],
  banana: [12.23, 2.6, 0.112, 0.003, 173944],
  apple: [10.39, 2.4, 0.028, 0.003, 171688],
  strawberry: [4.89, 2, 0.015, 0.003, 167762],
  blueberry: [9.96, 2.4, 0.028, 0.003, 171711],
  raspberry: [4.42, 6.5, 0.019, 0.003, 167755],
  orange: [9.35, 2.4, 0.015, 0, 169097],
  kiwi: [8.99, 3, 0.029, 0.007, 168153],
  grapes: [15.48, 0.9, 0.054, 0.005, 174683],
  pear: [9.75, 3.1, 0.022, 0.003, 169118],
  peach: [8.39, 1.5, 0.019, 0, 169928],
  plum: [9.92, 1.4, 0.017, 0, 169949],
  mango: [13.66, 1.6, 0.092, 0.003, 169910],
  pineapple: [9.85, 1.4, 0.009, 0.003, 169124],
  lemon: [2.5, 2.8, 0.039, 0.005, 167746],
  cherries: [12.82, 2.1, 0.038, 0, 171719]
};
function baseProduct(id, name, emoji, kcal, protein, carbs, fat, category, state) {
  var details = BASE_PRODUCT_NUTRITION[id] || null;
  return {
    id: "base_" + id,
    name: name,
    emoji: emoji,
    brand: "MatFit",
    ean: null,
    kcal: kcal,
    protein: protein,
    carbs: carbs,
    fat: fat,
    sugars: details ? details[0] : null,
    fiber: details ? details[1] : null,
    saturatedFat: details ? details[2] : null,
    salt: details ? details[3] : null,
    packageSize: null,
    category: category,
    state: state || "",
    source: "matfit",
    nutritionSource: details ? "USDA FoodData Central · SR Legacy 2018" : null,
    nutritionRef: details ? "FDC " + details[4] : null,
    lastVerified: details ? "2026-09-04" : null,
    custom: false
  };
}
export const PRODUCT_CATEGORIES = [{
  key: "all",
  label: "Wszystkie"
}, {
  key: "own",
  label: "Własne"
}, {
  key: "favorite",
  label: "⭐ Ulubione"
}, {
  key: "protein",
  label: "Mięso i białko"
}, {
  key: "dairy",
  label: "Nabiał"
}, {
  key: "carbs",
  label: "Węglowodany"
}, {
  key: "fats",
  label: "Tłuszcze"
}, {
  key: "vegetables",
  label: "Warzywa"
}, {
  key: "fruit",
  label: "Owoce"
}];
// Wartości orientacyjne na 100 g, dopasowane do typowych polskich etykiet.
// Produkt markowy zawsze powinien korzystać z etykiety lub skanera EAN.
export const PRODUCTS_DEFAULT = [
  baseProduct("chicken_breast_raw", "Pierś z kurczaka", "🍗", 99, 21.5, 0, 1.3, "protein", "surowa"),
  baseProduct("chicken_breast_cooked", "Pierś z kurczaka", "🍗", 165, 31, 0, 3.6, "protein", "grillowana bez tłuszczu"),
  baseProduct("chicken_thigh_skinless", "Udziec z kurczaka bez skóry", "🍗", 119, 19.7, 0, 4.7, "protein", "surowy"),
  baseProduct("turkey_breast_raw", "Pierś z indyka", "🦃", 104, 23.4, 0, 1.2, "protein", "surowa"),
  baseProduct("turkey_mince", "Mięso mielone z indyka", "🦃", 152, 20, 0, 8, "protein", "surowe, ok. 7–8% tłuszczu"),
  baseProduct("pork_loin_raw", "Schab wieprzowy bez kości", "🥩", 129, 22.5, 0, 4.2, "protein", "surowy"),
  baseProduct("pork_tenderloin", "Polędwiczka wieprzowa", "🥩", 120, 22, 0, 3.5, "protein", "surowa"),
  baseProduct("beef_lean", "Wołowina chuda", "🥩", 137, 21, 0, 5.5, "protein", "surowa"),
  baseProduct("beef_mince_5", "Wołowina mielona 5%", "🥩", 137, 21.4, 0, 5, "protein", "surowa"),
  baseProduct("egg_whole", "Jajko kurze całe", "🥚", 143, 12.6, 0.7, 9.5, "protein", "surowe, bez skorupki"),
  baseProduct("egg_white", "Białko jaja", "🥚", 43, 10.9, 0.7, 0.2, "protein", "płynne"),
  baseProduct("tuna_water", "Tuńczyk w sosie własnym", "🐟", 116, 25.5, 0, 1, "protein", "po odsączeniu"),
  baseProduct("cod_raw", "Dorsz", "🐟", 82, 18, 0, 0.7, "protein", "surowy"),
  baseProduct("salmon_raw", "Łosoś atlantycki", "🐟", 208, 20.4, 0, 13.4, "protein", "surowy"),
  baseProduct("mackerel_smoked", "Makrela wędzona", "🐟", 221, 20.7, 0, 15.5, "protein", "gotowa do spożycia"),
  baseProduct("shrimp_cooked", "Krewetki", "🦐", 99, 24, 0.2, 0.3, "protein", "gotowane"),
  baseProduct("tofu_natural", "Tofu naturalne", "🌱", 126, 12, 2.3, 7.5, "protein", "gotowe"),
  baseProduct("sardines_oil", "Sardynki w oleju", "🐟", 208, 24.6, 0, 11.5, "protein", "konserwowe, po odsączeniu"),
  baseProduct("tilapia_raw", "Tilapia", "🐟", 96, 20.1, 0, 1.7, "protein", "surowa"),
  baseProduct("edamame_cooked", "Edamame", "🫛", 121, 11.9, 8.9, 5.2, "protein", "ugotowane"),

  baseProduct("skyr_natural", "Skyr naturalny", "🥣", 62, 11, 3.8, 0.2, "dairy", "typowa polska etykieta"),
  baseProduct("greek_yogurt_0", "Jogurt typu greckiego 0%", "🥣", 59, 10.3, 3.6, 0.4, "dairy", "naturalny"),
  baseProduct("yogurt_natural_2", "Jogurt naturalny 2%", "🥣", 60, 4.3, 5.2, 2, "dairy", "naturalny"),
  baseProduct("kefir_2", "Kefir 2%", "🥛", 51, 3.4, 4.7, 2, "dairy", "naturalny"),
  baseProduct("cottage_light", "Serek wiejski lekki", "🧀", 81, 11, 2.4, 3, "dairy", "gotowy"),
  baseProduct("cottage_regular", "Serek wiejski", "🧀", 97, 11, 2, 5, "dairy", "klasyczny"),
  baseProduct("quark_lean", "Twaróg chudy", "🧀", 99, 19.8, 3.5, 0.5, "dairy", "gotowy"),
  baseProduct("quark_semi", "Twaróg półtłusty", "🧀", 133, 18.7, 3.7, 4.7, "dairy", "gotowy"),
  baseProduct("milk_15", "Mleko 1,5%", "🥛", 47, 3.4, 4.8, 1.5, "dairy", "wartości na 100 ml"),
  baseProduct("milk_2", "Mleko 2%", "🥛", 50, 3.4, 4.8, 2, "dairy", "wartości na 100 ml"),
  baseProduct("mozzarella_light", "Mozzarella light", "🧀", 172, 24, 2, 8, "dairy", "typowa etykieta"),
  baseProduct("gouda", "Ser Gouda", "🧀", 356, 25, 2.2, 27, "dairy", "pełnotłusty"),
  baseProduct("wpc_80", "Odżywka białkowa WPC 80", "🥤", 390, 78, 8, 6, "dairy", "wartość orientacyjna — sprawdź etykietę"),
  baseProduct("protein_pudding", "Pudding proteinowy", "🥣", 75, 10, 5.5, 1.5, "dairy", "wartość orientacyjna — sprawdź etykietę"),
  baseProduct("greek_yogurt_whole", "Jogurt grecki pełnotłusty", "🥣", 97, 9, 4, 5, "dairy", "naturalny"),
  baseProduct("mozzarella_regular", "Mozzarella", "🧀", 299, 22.2, 2.4, 22.1, "dairy", "pełnotłusta"),
  baseProduct("feta", "Ser feta", "🧀", 265, 14.2, 3.9, 21.5, "dairy", "gotowy"),
  baseProduct("cheddar", "Ser cheddar", "🧀", 403, 22.9, 3.4, 33.3, "dairy", "pełnotłusty"),
  baseProduct("buttermilk", "Maślanka naturalna", "🥛", 40, 3.3, 4.8, 1.1, "dairy", "wartości na 100 ml"),

  baseProduct("rice_white_dry", "Ryż biały", "🍚", 350, 7, 78, 0.7, "carbs", "suchy"),
  baseProduct("rice_basmati_dry", "Ryż basmati", "🍚", 354, 8.8, 77.7, 1, "carbs", "suchy"),
  baseProduct("rice_white_cooked", "Ryż biały", "🍚", 130, 2.7, 28.2, 0.3, "carbs", "ugotowany"),
  baseProduct("pasta_wheat_dry", "Makaron pszenny", "🍝", 359, 12.5, 72, 2, "carbs", "suchy"),
  baseProduct("pasta_wheat_cooked", "Makaron pszenny", "🍝", 158, 5.8, 30.9, 0.9, "carbs", "ugotowany"),
  baseProduct("pasta_wholegrain_dry", "Makaron pełnoziarnisty", "🍝", 350, 13, 66, 2.5, "carbs", "suchy"),
  baseProduct("oats", "Płatki owsiane", "🥣", 370, 13, 60, 7, "carbs", "suche"),
  baseProduct("rice_cereal", "Kleik ryżowy", "🥣", 360, 7, 79, 1, "carbs", "suchy"),
  baseProduct("buckwheat_dry", "Kasza gryczana", "🌾", 336, 12.6, 69.3, 3.1, "carbs", "sucha"),
  baseProduct("millet_dry", "Kasza jaglana", "🌾", 348, 10.5, 71.6, 2.9, "carbs", "sucha"),
  baseProduct("couscous_dry", "Kuskus", "🌾", 376, 12.8, 77.4, 0.6, "carbs", "suchy"),
  baseProduct("bread_wheat", "Chleb pszenny", "🍞", 247, 8.5, 49, 3.2, "carbs", "gotowy"),
  baseProduct("bread_rye_whole", "Chleb żytni razowy", "🍞", 225, 6.5, 44, 2, "carbs", "gotowy"),
  baseProduct("graham_roll", "Bułka grahamka", "🥖", 270, 9, 53, 2.5, "carbs", "gotowa"),
  baseProduct("tortilla_wheat", "Tortilla pszenna", "🌯", 310, 8.5, 52, 8, "carbs", "wartość orientacyjna — sprawdź etykietę"),
  baseProduct("potato_raw", "Ziemniaki", "🥔", 77, 2, 17, 0.1, "carbs", "surowe, obrane"),
  baseProduct("sweet_potato_raw", "Bataty", "🍠", 86, 1.6, 20.1, 0.1, "carbs", "surowe, obrane"),
  baseProduct("rice_cakes", "Wafle ryżowe", "🍘", 385, 8, 81, 3, "carbs", "naturalne"),
  baseProduct("cornflakes", "Płatki kukurydziane", "🥣", 370, 7, 83, 1, "carbs", "bez dodatków"),
  baseProduct("wheat_flour_450", "Mąka pszenna typ 450", "🌾", 347, 11, 72, 1.5, "carbs", "sucha"),
  baseProduct("oat_flour", "Mąka owsiana", "🌾", 370, 13, 60, 7, "carbs", "sucha"),
  baseProduct("lentils_red_dry", "Soczewica czerwona", "🫘", 350, 25, 54, 2, "carbs", "sucha"),
  baseProduct("chickpeas_canned", "Ciecierzyca konserwowa", "🫘", 132, 7, 19, 2.2, "carbs", "po odsączeniu"),
  baseProduct("kidney_beans_canned", "Fasola czerwona konserwowa", "🫘", 99, 6.7, 14, 0.5, "carbs", "po odsączeniu"),
  baseProduct("rice_brown_dry", "Ryż brązowy", "🍚", 367, 7.5, 76.3, 3.2, "carbs", "suchy"),
  baseProduct("rice_brown_cooked", "Ryż brązowy", "🍚", 123, 2.7, 25.6, 1, "carbs", "ugotowany"),
  baseProduct("quinoa_dry", "Komosa ryżowa", "🌾", 368, 14.1, 64.2, 6.1, "carbs", "sucha"),
  baseProduct("quinoa_cooked", "Komosa ryżowa", "🌾", 120, 4.4, 21.3, 1.9, "carbs", "ugotowana"),
  baseProduct("barley_pearl_dry", "Kasza jęczmienna pęczak", "🌾", 352, 9.9, 77.7, 1.2, "carbs", "sucha"),
  baseProduct("bulgur_dry", "Kasza bulgur", "🌾", 342, 12.3, 75.9, 1.3, "carbs", "sucha"),
  baseProduct("rice_noodles_dry", "Makaron ryżowy", "🍜", 364, 6, 80.2, 0.6, "carbs", "suchy"),
  baseProduct("corn_flour", "Mąka kukurydziana", "🌽", 361, 6.9, 76.9, 3.9, "carbs", "sucha"),
  baseProduct("cornstarch", "Skrobia kukurydziana", "🌽", 381, 0.3, 91.3, 0.1, "carbs", "sucha"),
  baseProduct("semolina", "Kasza manna", "🌾", 360, 12.7, 72.8, 1.1, "carbs", "sucha"),
  baseProduct("bread_whole_wheat", "Chleb pełnoziarnisty", "🍞", 252, 12.5, 42.7, 3.5, "carbs", "gotowy"),
  baseProduct("tortilla_corn", "Tortilla kukurydziana", "🌮", 218, 5.7, 44.6, 2.9, "carbs", "gotowa"),
  baseProduct("cocoa_unsweetened", "Kakao naturalne", "🍫", 228, 19.6, 57.9, 13.7, "carbs", "proszek bez cukru"),
  baseProduct("honey", "Miód", "🍯", 304, 0.3, 82.4, 0, "carbs", "naturalny"),
  baseProduct("sugar_white", "Cukier biały", "🧂", 387, 0, 100, 0, "carbs", "sypki"),

  baseProduct("olive_oil", "Oliwa z oliwek", "🫒", 884, 0, 0, 100, "fats", "wartości na 100 g"),
  baseProduct("rapeseed_oil", "Olej rzepakowy", "🌻", 884, 0, 0, 100, "fats", "wartości na 100 g"),
  baseProduct("butter_82", "Masło 82%", "🧈", 744, 0.7, 0.7, 82, "fats", "gotowe"),
  baseProduct("peanut_butter", "Masło orzechowe 100%", "🥜", 620, 26, 12, 50, "fats", "bez dodatków"),
  baseProduct("almonds", "Migdały", "🥜", 604, 20, 10, 52, "fats", "naturalne"),
  baseProduct("walnuts", "Orzechy włoskie", "🥜", 654, 15, 7, 65, "fats", "naturalne"),
  baseProduct("flaxseed", "Siemię lniane", "🌾", 534, 18.3, 1.6, 42.2, "fats", "suche"),
  baseProduct("chia", "Nasiona chia", "🌾", 486, 16.5, 7.7, 30.7, "fats", "suche"),
  baseProduct("avocado", "Awokado", "🥑", 160, 2, 8.5, 14.7, "fats", "miąższ"),
  baseProduct("ghee", "Masło klarowane (ghee)", "🧈", 876, 0.3, 0, 99.5, "fats", "gotowe"),
  baseProduct("cashews", "Orzechy nerkowca", "🥜", 553, 18.2, 30.2, 43.9, "fats", "naturalne"),
  baseProduct("hazelnuts", "Orzechy laskowe", "🥜", 628, 15, 16.7, 60.8, "fats", "naturalne"),
  baseProduct("pumpkin_seeds", "Pestki dyni", "🎃", 559, 30.2, 10.7, 49.1, "fats", "łuskane"),
  baseProduct("sunflower_seeds", "Pestki słonecznika", "🌻", 584, 20.8, 20, 51.5, "fats", "łuskane"),
  baseProduct("coconut_dried", "Wiórki kokosowe", "🥥", 660, 6.9, 23.7, 64.5, "fats", "suszone, niesłodzone"),

  baseProduct("tomato", "Pomidor", "🍅", 18, 0.9, 3.9, 0.2, "vegetables", "surowy"),
  baseProduct("cucumber", "Ogórek", "🥒", 15, 0.7, 3.6, 0.1, "vegetables", "surowy"),
  baseProduct("pepper_red", "Papryka czerwona", "🫑", 31, 1, 6, 0.3, "vegetables", "surowa"),
  baseProduct("zucchini", "Cukinia", "🥒", 17, 1.2, 3.1, 0.3, "vegetables", "surowa"),
  baseProduct("broccoli", "Brokuł", "🥦", 34, 2.8, 4, 0.4, "vegetables", "surowy"),
  baseProduct("cauliflower", "Kalafior", "🥦", 25, 1.9, 3, 0.3, "vegetables", "surowy"),
  baseProduct("carrot", "Marchew", "🥕", 41, 0.9, 9.6, 0.2, "vegetables", "surowa"),
  baseProduct("onion", "Cebula", "🧅", 40, 1.1, 9.3, 0.1, "vegetables", "surowa"),
  baseProduct("spinach", "Szpinak", "🥬", 23, 2.9, 3.6, 0.4, "vegetables", "surowy"),
  baseProduct("peas_frozen", "Groszek zielony", "🫛", 77, 5.2, 11, 0.4, "vegetables", "mrożony"),
  baseProduct("cabbage_white", "Kapusta biała", "🥬", 25, 1.3, 5.8, 0.1, "vegetables", "surowa"),
  baseProduct("mushrooms_white", "Pieczarki białe", "🍄", 22, 3.1, 3.3, 0.3, "vegetables", "surowe"),
  baseProduct("green_beans", "Fasolka szparagowa", "🫛", 31, 1.8, 7, 0.2, "vegetables", "surowa"),
  baseProduct("sweetcorn_canned", "Kukurydza konserwowa", "🌽", 67, 2.3, 14.3, 1.2, "vegetables", "po odsączeniu"),
  baseProduct("beetroot", "Burak", "🫜", 43, 1.6, 9.6, 0.2, "vegetables", "surowy"),
  baseProduct("lettuce_green", "Sałata zielona", "🥬", 15, 1.4, 2.9, 0.2, "vegetables", "surowa"),
  baseProduct("garlic", "Czosnek", "🧄", 149, 6.4, 33.1, 0.5, "vegetables", "surowy"),
  baseProduct("celeriac", "Seler korzeniowy", "🥬", 42, 1.5, 9.2, 0.3, "vegetables", "surowy"),
  baseProduct("tomato_puree", "Przecier pomidorowy", "🍅", 38, 1.7, 9, 0.2, "vegetables", "bez dodatków"),
  baseProduct("tomatoes_canned", "Pomidory krojone", "🥫", 32, 1.6, 7.3, 0.3, "vegetables", "konserwowe"),

  baseProduct("banana", "Banan", "🍌", 89, 1.1, 22.8, 0.3, "fruit", "bez skórki"),
  baseProduct("apple", "Jabłko", "🍎", 52, 0.3, 13.8, 0.2, "fruit", "ze skórką"),
  baseProduct("strawberry", "Truskawki", "🍓", 32, 0.7, 7.7, 0.3, "fruit", "świeże"),
  baseProduct("blueberry", "Borówki", "🫐", 57, 0.7, 14.5, 0.3, "fruit", "świeże"),
  baseProduct("raspberry", "Maliny", "🫐", 52, 1.2, 11.9, 0.7, "fruit", "świeże"),
  baseProduct("orange", "Pomarańcza", "🍊", 47, 0.9, 11.8, 0.1, "fruit", "bez skórki"),
  baseProduct("kiwi", "Kiwi", "🥝", 61, 1.1, 14.7, 0.5, "fruit", "bez skórki"),
  baseProduct("grapes", "Winogrona", "🍇", 69, 0.7, 18.1, 0.2, "fruit", "świeże"),
  baseProduct("pear", "Gruszka", "🍐", 57, 0.4, 15.2, 0.1, "fruit", "ze skórką"),
  baseProduct("peach", "Brzoskwinia", "🍑", 39, 0.9, 9.5, 0.3, "fruit", "świeża"),
  baseProduct("plum", "Śliwka", "🫐", 46, 0.7, 11.4, 0.3, "fruit", "świeża"),
  baseProduct("mango", "Mango", "🥭", 60, 0.8, 15, 0.4, "fruit", "miąższ"),
  baseProduct("pineapple", "Ananas", "🍍", 50, 0.5, 13.1, 0.1, "fruit", "miąższ"),
  baseProduct("lemon", "Cytryna", "🍋", 29, 1.1, 9.3, 0.3, "fruit", "bez skórki"),
  baseProduct("cherries", "Czereśnie", "🍒", 63, 1.1, 16, 0.2, "fruit", "świeże")
];

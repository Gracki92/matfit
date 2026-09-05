import { clonePlannedMeal, plannedMealCopyKey } from "./domain/planner.js";
import {
  getWeek,
  getWeekNumber,
  mfDate,
  mfDaysBetween,
  mfFormatDate,
  mfFormatShortDate,
  mfISODate,
  mfShiftISO,
} from "./domain/date.js";
import {
  ACTIVITY_MULTIPLIERS,
  DAY_TYPE_MULTIPLIERS,
  NUTRITION_DETAIL_FIELDS,
  calcBMR,
  calcFormulaTDEE,
  calcMacro,
  calcNavyBodyFat,
  calcTDEE,
  calcTargets,
  completeMealNutrition,
  fmtPortions,
  nutritionDetailCompleteness,
  nutritionPeriodSummary,
  optionalNutritionNumber,
  r2,
  rGram,
  scaledNutritionDetails,
  sumMealNutrition,
} from "./domain/nutrition.js";
import {
  MAX_BACKUP_FILE_BYTES,
  createBackupData,
  mergeBackupIds,
  mergeBackupRecords,
  parseBackupJson,
} from "./domain/backup.js";
import {
  PRODUCT_CATEGORIES,
  PRODUCTS_DEFAULT,
  countProductTypes,
  filterProductCatalog,
  findDuplicateProduct,
  findProductByBarcode,
  isValidGtin,
  mergeProductCatalog,
  nextRecentProductIds,
  normalizeBarcode,
  onlyUserProducts,
  toggleProductId,
} from "./domain/products.js";

(function() {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var _Recharts = Recharts,
  ComposedChart = _Recharts.ComposedChart,
  Area = _Recharts.Area,
  LineChart = _Recharts.LineChart,
  Line = _Recharts.Line,
  ReferenceLine = _Recharts.ReferenceLine,
  XAxis = _Recharts.XAxis,
  YAxis = _Recharts.YAxis,
  CartesianGrid = _Recharts.CartesianGrid,
  Tooltip = _Recharts.Tooltip,
  ResponsiveContainer = _Recharts.ResponsiveContainer;
var _React = React,
  useState = _React.useState,
  useMemo = _React.useMemo,
  useCallback = _React.useCallback,
  useRef = _React.useRef,
  useEffect = _React.useEffect;

var THEMES = {
  royal: {
    bg: "#070b16", surf: "#0d1628", surf2: "#13213a", border: "#2a3d62",
    acc: "#E0B84B", acc2: "#F5D878", text: "#f7f2e4", text2: "#b7c4df", text3: "#91a4cf",
    prot: "#F5D878", carbs: "#60a5fa", fat: "#fb923c", kcal: "#F5D878",
    navbg: "rgba(7,11,22,.92)", name: "👑 Royal"
  },
light: {
  bg: "#f3f8ff", surf: "#ffffff", surf2: "#eef4fc", border: "#ccdaf0",
  acc: "#1D4ED8", acc2: "#3B82F6",
  text: "#0b1730", text2: "#344766", text3: "#5f708b",
  prot: "#1D4ED8", carbs: "#0369a1", fat: "#c2410c", kcal: "#1D4ED8",
  navbg: "rgba(247,250,255,.92)", name: "☀️ Jasny"
}
};
function baseRecipe(id, name, emoji, cat, servings, ingredients, steps, finishedWeight) {
  return {
    id: "base_recipe_" + id,
    name: name,
    emoji: emoji,
    cat: cat,
    servings: servings,
    ingredients: ingredients,
    steps: steps,
    finishedWeight: finishedWeight || "",
    source: "matfit",
    custom: false
  };
}
var RECIPES_DEFAULT = [
  baseRecipe("protein_owsianka", "Owsianka proteinowa z bananem", "🥣", "sniadanie", 1, [{
    productId: "base_oats",
    grams: 70
  }, {
    productId: "base_skyr_natural",
    grams: 200
  }, {
    productId: "base_banana",
    grams: 120
  }, {
    productId: "base_wpc_80",
    grams: 25
  }, {
    productId: "base_peanut_butter",
    grams: 15
  }], ["Płatki zalej niewielką ilością gorącej wody i odstaw na kilka minut.", "Dodaj skyr i odżywkę białkową, dokładnie wymieszaj.", "Na wierzchu ułóż banana i masło orzechowe."], 430),
  baseRecipe("protein_pancakes", "Naleśniki proteinowe", "🥞", "slodkie", 2, [{
    productId: "base_oat_flour",
    grams: 80
  }, {
    productId: "base_egg_whole",
    grams: 100
  }, {
    productId: "base_skyr_natural",
    grams: 150
  }, {
    productId: "base_wpc_80",
    grams: 30
  }, {
    productId: "base_banana",
    grams: 100
  }], ["Zblenduj wszystkie składniki na gładkie ciasto.", "Smaż cienkie naleśniki na dobrej patelni bez dodatku tłuszczu.", "Podziel na dwie równe porcje."], 430),
  baseRecipe("chicken_rice", "Kurczak z ryżem i brokułem", "🍗", "obiad", 2, [{
    productId: "base_chicken_breast_raw",
    grams: 300
  }, {
    productId: "base_rice_basmati_dry",
    grams: 160
  }, {
    productId: "base_broccoli",
    grams: 300
  }, {
    productId: "base_olive_oil",
    grams: 10
  }], ["Ryż ugotuj zgodnie z instrukcją na opakowaniu.", "Kurczaka dopraw i usmaż lub ugrilluj, używając odmierzonej oliwy.", "Brokuł ugotuj na parze i podziel całość na dwie porcje."], ""),
  baseRecipe("chicken_tortilla", "Tortilla fit z kurczakiem", "🌯", "wytrawne", 1, [{
    productId: "base_tortilla_wheat",
    grams: 60
  }, {
    productId: "base_chicken_breast_cooked",
    grams: 150
  }, {
    productId: "base_yogurt_natural_2",
    grams: 60
  }, {
    productId: "base_tomato",
    grams: 100
  }, {
    productId: "base_cucumber",
    grams: 80
  }], ["Podgrzej tortillę na suchej patelni.", "Dodaj pokrojonego kurczaka i warzywa.", "Polej jogurtem doprawionym według uznania i zawiń."], 450),
  baseRecipe("tuna_pasta", "Makaron z tuńczykiem", "🍝", "obiad", 2, [{
    productId: "base_pasta_wheat_dry",
    grams: 160
  }, {
    productId: "base_tuna_water",
    grams: 240
  }, {
    productId: "base_yogurt_natural_2",
    grams: 120
  }, {
    productId: "base_tomato",
    grams: 200
  }, {
    productId: "base_onion",
    grams: 60
  }], ["Ugotuj makaron al dente.", "Dodaj odsączonego tuńczyka, pomidora i drobno posiekaną cebulę.", "Po lekkim przestudzeniu połącz z jogurtem i podziel na dwie porcje."], ""),
  baseRecipe("quark_bowl", "Miska twarogowa z borówkami", "🫐", "kolacja", 1, [{
    productId: "base_quark_lean",
    grams: 250
  }, {
    productId: "base_yogurt_natural_2",
    grams: 100
  }, {
    productId: "base_blueberry",
    grams: 100
  }, {
    productId: "base_almonds",
    grams: 15
  }], ["Twaróg rozgnieć z jogurtem na kremową masę.", "Dodaj borówki i posyp posiekanymi migdałami."], 465),
  baseRecipe("protein_shake", "Shake białkowy z bananem", "🥤", "slodkie", 1, [{
    productId: "base_milk_15",
    grams: 300
  }, {
    productId: "base_wpc_80",
    grams: 30
  }, {
    productId: "base_banana",
    grams: 120
  }, {
    productId: "base_peanut_butter",
    grams: 15
  }], ["Wszystkie składniki umieść w blenderze.", "Blenduj do uzyskania gładkiej konsystencji."], 465),
  baseRecipe("salmon_potatoes", "Łosoś z ziemniakami i brokułem", "🐟", "obiad", 2, [{
    productId: "base_salmon_raw",
    grams: 300
  }, {
    productId: "base_potato_raw",
    grams: 600
  }, {
    productId: "base_broccoli",
    grams: 300
  }, {
    productId: "base_olive_oil",
    grams: 10
  }], ["Ziemniaki ugotuj lub upiecz.", "Łososia dopraw i upiecz, a brokuł ugotuj na parze.", "Dodaj odmierzoną oliwę i podziel całość na dwie porcje."], ""),
  baseRecipe("tofu_rice", "Tofu z ryżem i warzywami", "🌱", "obiad", 2, [{
    productId: "base_tofu_natural",
    grams: 300
  }, {
    productId: "base_rice_basmati_dry",
    grams: 140
  }, {
    productId: "base_zucchini",
    grams: 250
  }, {
    productId: "base_pepper_red",
    grams: 200
  }, {
    productId: "base_rapeseed_oil",
    grams: 10
  }], ["Ryż ugotuj zgodnie z instrukcją.", "Tofu i warzywa pokrój, następnie podsmaż na odmierzonej ilości oleju.", "Połącz składniki i podziel na dwie porcje."], ""),
  baseRecipe("egg_breakfast", "Jajka z pieczywem i pomidorem", "🍳", "sniadanie", 1, [{
    productId: "base_egg_whole",
    grams: 150
  }, {
    productId: "base_egg_white",
    grams: 150
  }, {
    productId: "base_bread_rye_whole",
    grams: 100
  }, {
    productId: "base_tomato",
    grams: 150
  }], ["Jajka i białka przygotuj na patelni bez dodatku tłuszczu.", "Podaj z pieczywem i pokrojonym pomidorem."], 550)
];
function isBaseRecipeId(id) {
  return RECIPES_DEFAULT.some(function (recipe) {
    return String(recipe.id) === String(id);
  });
}
function mergeRecipeCatalog(storedRecipes, hiddenRecipeIds) {
  var hidden = new Set((Array.isArray(hiddenRecipeIds) ? hiddenRecipeIds : []).map(String));
  var stored = Array.isArray(storedRecipes) ? storedRecipes : [];
  var overrides = new Map();
  var userRecipes = [];
  var seenUserIds = new Set();
  stored.forEach(function (recipe) {
    if (!recipe || recipe.id === undefined || recipe.id === null) return;
    var id = String(recipe.id);
    if (isBaseRecipeId(id)) {
      if (recipe.overridden) overrides.set(id, recipe);
      return;
    }
    if (seenUserIds.has(id)) return;
    seenUserIds.add(id);
    userRecipes.push(recipe);
  });
  var baseRecipes = RECIPES_DEFAULT.filter(function (recipe) {
    return !hidden.has(String(recipe.id));
  }).map(function (recipe) {
    return overrides.get(String(recipe.id)) || recipe;
  });
  return userRecipes.concat(baseRecipes);
}
function onlyStoredRecipes(recipes) {
  return (Array.isArray(recipes) ? recipes : []).filter(function (recipe) {
    return recipe && recipe.id !== undefined && (!isBaseRecipeId(recipe.id) || recipe.overridden);
  });
}
var TODAY = mfISODate(new Date());
var DAYS = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Ndz"];
var CAT_LABELS = {
  slodkie: "🍰 Słodkie",
  wytrawne: "🥩 Wytrawne",
  sniadanie: "☀️ Śniadanie",
  obiad: "🍽️ Obiad",
  kolacja: "🌙 Kolacja"
};

// Pory dnia
var MEAL_TIMES = [{
  key: "sniadanie",
  label: "☀️ Śniadanie"
}, {
  key: "ii_sniadanie",
  label: "🥪 II Śniadanie"
}, {
  key: "obiad",
  label: "🍽️ Obiad"
}, {
  key: "przekaska",
  label: "🍎 Przekąska"
}, {
  key: "kolacja",
  label: "🌙 Kolacja"
}];
var DAY_TYPES = [{
  key: "training",
  label: "🏋️ Trening",
  desc: "Siłownia, bieganie, boks, spacer do pracy — Twój normalny dzień",
  mul: DAY_TYPE_MULTIPLIERS.training
}, {
  key: "rest",
  label: "😴 Odpoczynek",
  desc: "Leżysz plackiem lub krótki spacer",
  mul: DAY_TYPE_MULTIPLIERS.rest
}];
var ACTIVITY = [{
  key: "sedentary",
  label: "🪑 Siedzący",
  desc: "Biuro, auto, dom — max 2km dziennie, zero sportu",
  mul: ACTIVITY_MULTIPLIERS.sedentary
}, {
  key: "light",
  label: "🚶 Lekko aktywny",
  desc: "Spacery 4-10km dziennie, sporadyczny trening",
  mul: ACTIVITY_MULTIPLIERS.light
}, {
  key: "moderate",
  label: "🏋️ Sport 3-4x/tydzień",
  desc: "Regularne treningi 3-4 razy w tygodniu",
  mul: ACTIVITY_MULTIPLIERS.moderate
}, {
  key: "active4",
  label: "⚡ Sport 4-5x/tydzień",
  desc: "Regularne treningi 4-5 razy w tygodniu",
  mul: ACTIVITY_MULTIPLIERS.active4
}, {
  key: "active",
  label: "🔥 Sport 5-6x/tydzień",
  desc: "Intensywne treningi 5-6 razy w tygodniu",
  mul: ACTIVITY_MULTIPLIERS.active
}, {
  key: "very",
  label: "💪 Wyczynowy",
  desc: "2x dziennie treningi lub bardzo ciężka praca fizyczna",
  mul: ACTIVITY_MULTIPLIERS.very
}];
var STORAGE_PATH = window.location.pathname || "";
var IS_DEV_STORAGE = STORAGE_PATH.indexOf("/dev/") !== -1 || STORAGE_PATH.indexOf("/matfit-dev/") !== -1 || /\/[0-9a-f]{40}\//i.test(STORAGE_PATH) || new URLSearchParams(window.location.search).get("env") === "dev";
var STORAGE_PREFIX = IS_DEV_STORAGE ? "matfit_dev_" : "";
function useLS(key, def) {
  var _useState = useState(function () {
      try {
        var storageKey = STORAGE_PREFIX + key;
        var s = localStorage.getItem(storageKey);
        if (!s && STORAGE_PREFIX) {
          var productionSnapshot = localStorage.getItem(key);
          if (productionSnapshot) {
            localStorage.setItem(storageKey, productionSnapshot);
            s = productionSnapshot;
          }
        }
        return s ? JSON.parse(s) : def;
      } catch (_unused) {
        return def;
      }
    }),
    _useState2 = _slicedToArray(_useState, 2),
    v = _useState2[0],
    sv = _useState2[1];
  var set = useCallback(function (val) {
    sv(function (prev) {
      var next = typeof val === "function" ? val(prev) : val;
      try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(next));
      } catch (_unused2) {}
      return next;
    });
  }, [key]);
  return [v, set];
}
function mfWeightTrend(entries) {
  var maxDays = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 42;
  var valid = (entries || []).filter(function (item) {
    return item && item.date && isFinite(item.weight) && item.weight > 0;
  }).sort(function (a, b) {
    return a.date.localeCompare(b.date);
  });
  if (valid.length < 3) return null;
  var endDate = valid[valid.length - 1].date;
  var recent = valid.filter(function (item) {
    return mfDaysBetween(item.date, endDate) <= maxDays;
  });
  if (recent.length < 3 || mfDaysBetween(recent[0].date, endDate) < 14) return null;
  var start = recent[0].date;
  var points = recent.map(function (item) {
    return { x: mfDaysBetween(start, item.date), y: item.weight };
  });
  var n = points.length;
  var sumX = points.reduce(function (sum, p) { return sum + p.x; }, 0);
  var sumY = points.reduce(function (sum, p) { return sum + p.y; }, 0);
  var meanX = sumX / n;
  var meanY = sumY / n;
  var numerator = points.reduce(function (sum, p) { return sum + (p.x - meanX) * (p.y - meanY); }, 0);
  var denominator = points.reduce(function (sum, p) { return sum + Math.pow(p.x - meanX, 2); }, 0);
  if (!denominator) return null;
  var slope = numerator / denominator;
  var intercept = meanY - slope * meanX;
  var total = points.reduce(function (sum, p) { return sum + Math.pow(p.y - meanY, 2); }, 0);
  var residual = points.reduce(function (sum, p) {
    return sum + Math.pow(p.y - (intercept + slope * p.x), 2);
  }, 0);
  return {
    weekly: slope * 7,
    count: n,
    spanDays: mfDaysBetween(start, endDate),
    r2: total > 0 ? Math.max(0, Math.min(1, 1 - residual / total)) : 0,
    residualKg: Math.sqrt(residual / n)
  };
}
function mfPearson(pairs) {
  var valid = (pairs || []).filter(function (pair) {
    return pair && isFinite(pair[0]) && isFinite(pair[1]);
  });
  if (valid.length < 2) return null;
  var meanX = valid.reduce(function (sum, pair) { return sum + pair[0]; }, 0) / valid.length;
  var meanY = valid.reduce(function (sum, pair) { return sum + pair[1]; }, 0) / valid.length;
  var numerator = valid.reduce(function (sum, pair) { return sum + (pair[0] - meanX) * (pair[1] - meanY); }, 0);
  var dx = valid.reduce(function (sum, pair) { return sum + Math.pow(pair[0] - meanX, 2); }, 0);
  var dy = valid.reduce(function (sum, pair) { return sum + Math.pow(pair[1] - meanY, 2); }, 0);
  return dx > 0 && dy > 0 ? numerator / Math.sqrt(dx * dy) : null;
}
function mfCorrelationLabel(value) {
  if (!isFinite(value)) return "brak wyraźnej zależności";
  var strength = Math.abs(value);
  if (strength >= 0.75) return "silna";
  if (strength >= 0.5) return "umiarkowana";
  if (strength >= 0.3) return "słaba";
  return "bardzo słaba";
}
function mfBodyWeightEntries(bodyLog, endISO) {
  return Object.entries(bodyLog || {}).filter(function (item) {
    var weight = parseFloat(item[1] && item[1].weight);
    return item[0] && (!endISO || item[0] <= endISO) && isFinite(weight) && weight > 0;
  }).sort(function (a, b) {
    return a[0].localeCompare(b[0]);
  }).map(function (item) {
    return {
      date: item[0],
      weight: parseFloat(item[1].weight)
    };
  });
}
function mfPlannerKcal(planer, date) {
  var meals = planer && planer[date];
  if (!Array.isArray(meals) || !meals.length) return null;
  return meals.reduce(function (sum, meal) {
    return sum + (parseFloat(meal && meal.kcal) || 0);
  }, 0);
}
function mfAverage(values) {
  var valid = (values || []).filter(function (value) {
    return isFinite(value);
  });
  return valid.length ? valid.reduce(function (sum, value) {
    return sum + value;
  }, 0) / valid.length : null;
}
function mfWeeklySummary(planer, bodyLog, profile, dayTypes, endISO) {
  var currentStart = mfShiftISO(endISO, -6);
  var previousStart = mfShiftISO(endISO, -13);
  var previousEnd = mfShiftISO(endISO, -7);
  var currentDays = [];
  var previousDays = [];
  for (var dayIndex = 0; dayIndex < 7; dayIndex++) {
    currentDays.push(mfShiftISO(currentStart, dayIndex));
    previousDays.push(mfShiftISO(previousStart, dayIndex));
  }
  function periodNutrition(days) {
    var rows = days.map(function (date) {
      var kcal = mfPlannerKcal(planer, date);
      if (kcal === null) return null;
      var typeKey = dayTypes && dayTypes[date] || "training";
      var multiplier = (DAY_TYPES.find(function (type) {
        return type.key === typeKey;
      }) || DAY_TYPES[0]).mul;
      return {
        kcal: kcal,
        target: calcTargets(profile, multiplier).kcal
      };
    }).filter(Boolean);
    return {
      loggedDays: rows.length,
      avgKcal: mfAverage(rows.map(function (row) {
        return row.kcal;
      })),
      avgTarget: mfAverage(rows.map(function (row) {
        return row.target;
      }))
    };
  }
  var currentNutrition = periodNutrition(currentDays);
  var previousNutrition = periodNutrition(previousDays);
  var weights = mfBodyWeightEntries(bodyLog, endISO);
  var currentWeights = weights.filter(function (entry) {
    return entry.date >= currentStart;
  });
  var previousWeights = weights.filter(function (entry) {
    return entry.date >= previousStart && entry.date <= previousEnd;
  });
  var currentAverageWeight = mfAverage(currentWeights.map(function (entry) {
    return entry.weight;
  }));
  var previousAverageWeight = mfAverage(previousWeights.map(function (entry) {
    return entry.weight;
  }));
  var bodyEntries = Object.entries(bodyLog || {}).filter(function (item) {
    return item[0] <= endISO && item[1] && Object.keys(item[1]).length;
  }).sort(function (a, b) {
    return a[0].localeCompare(b[0]);
  });
  function waistValue(item) {
    return parseFloat(item && item[1] && (item[1].belly || item[1].waist));
  }
  var currentWaist = bodyEntries.filter(function (item) {
    return item[0] >= currentStart && isFinite(waistValue(item)) && waistValue(item) > 0;
  }).pop();
  var previousWaist = bodyEntries.filter(function (item) {
    return item[0] < currentStart && mfDaysBetween(item[0], currentStart) <= 28 && isFinite(waistValue(item)) && waistValue(item) > 0;
  }).pop();
  var trend = mfWeightTrend(weights, 42);
  var priorWeights = weights.filter(function (entry) {
    return entry.date <= previousEnd;
  });
  var priorTrend = mfWeightTrend(priorWeights, 42);
  var targetWeight = parseFloat(profile && profile.targetWeight);
  var latestWeight = weights.length ? weights[weights.length - 1] : null;
  var priorLatestWeight = priorWeights.length ? priorWeights[priorWeights.length - 1] : null;
  if (!(targetWeight > 0) && latestWeight && parseFloat(profile && profile.targetBf) > 0 && bodyEntries.length) {
    var latestBodyEntry = bodyLog && bodyLog[latestWeight.date] || bodyEntries[bodyEntries.length - 1][1];
    var currentBodyFat = parseFloat(latestBodyEntry && latestBodyEntry.bfManual) || calcNavyBodyFat(profile, latestBodyEntry);
    var targetBodyFat = parseFloat(profile.targetBf);
    if (currentBodyFat > 0 && targetBodyFat > 0 && targetBodyFat < 60) {
      targetWeight = latestWeight.weight * (1 - currentBodyFat / 100) / (1 - targetBodyFat / 100);
    }
  }
  var finishISO = null;
  var finishShiftDays = null;
  if (targetWeight > 0 && latestWeight && trend && trend.weekly && (targetWeight - latestWeight.weight) * trend.weekly > 0) {
    var finishWeeks = Math.abs(targetWeight - latestWeight.weight) / Math.abs(trend.weekly);
    if (finishWeeks <= 156) finishISO = mfShiftISO(endISO, finishWeeks * 7);
  }
  if (finishISO && priorLatestWeight && priorTrend && priorTrend.weekly && (targetWeight - priorLatestWeight.weight) * priorTrend.weekly > 0) {
    var priorFinishWeeks = Math.abs(targetWeight - priorLatestWeight.weight) / Math.abs(priorTrend.weekly);
    if (priorFinishWeeks <= 156) {
      var priorFinishISO = mfShiftISO(previousEnd, priorFinishWeeks * 7);
      finishShiftDays = mfDaysBetween(priorFinishISO, finishISO);
    }
  }
  return {
    from: currentStart,
    to: endISO,
    nutrition: currentNutrition,
    previousNutrition: previousNutrition,
    averageWeight: currentAverageWeight,
    previousAverageWeight: previousAverageWeight,
    weightCount: currentWeights.length,
    previousWeightCount: previousWeights.length,
    weeklyWeightChange: currentAverageWeight !== null && previousAverageWeight !== null ? currentAverageWeight - previousAverageWeight : null,
    trend: trend,
    waistChange: currentWaist && previousWaist ? waistValue(currentWaist) - waistValue(previousWaist) : null,
    finishISO: finishISO,
    finishShiftDays: finishShiftDays
  };
}
function mfTdeeCalibration(planer, bodyLog, profile, endISO) {
  var currentTdee = calcTDEE(profile);
  var latestApplied = profile && profile.tdeeCalibrationAppliedAt;
  var sinceApplied = latestApplied ? mfDaysBetween(latestApplied, endISO) : null;
  var cooldownDays = sinceApplied !== null && sinceApplied >= 0 && sinceApplied < 28 ? 28 - sinceApplied : 0;
  var allWeights = mfBodyWeightEntries(bodyLog, endISO);
  var latestWeight = allWeights.length ? allWeights[allWeights.length - 1] : null;
  var periodEnd = latestWeight ? latestWeight.date : endISO;
  var periodStart = mfShiftISO(periodEnd, -28);
  var periodWeights = allWeights.filter(function (entry) {
    return entry.date >= periodStart && entry.date <= periodEnd;
  });
  var trend = mfWeightTrend(periodWeights, 42);
  var loggedKcal = [];
  for (var dayIndex = 1; dayIndex <= 28; dayIndex++) {
    var kcal = mfPlannerKcal(planer, mfShiftISO(periodStart, dayIndex));
    if (kcal !== null) loggedKcal.push(kcal);
  }
  var spanDays = periodWeights.length >= 2 ? mfDaysBetween(periodWeights[0].date, periodWeights[periodWeights.length - 1].date) : 0;
  var coverage = loggedKcal.length / 28;
  var stableEnough = !!(trend && (Math.abs(trend.weekly) <= 0.15 || trend.r2 >= 0.25));
  var newDataSinceApplied = !latestApplied || mfDaysBetween(latestApplied, periodEnd) >= 28;
  var dataReady = currentTdee > 0 && periodWeights.length >= 4 && spanDays >= 28 && coverage >= 0.7 && stableEnough && newDataSinceApplied;
  var averageIntake = mfAverage(loggedKcal);
  var observedTdee = dataReady && averageIntake !== null ? Math.round(averageIntake - trend.weekly * 7700 / 7) : null;
  if (!(observedTdee >= 1200 && observedTdee <= 6000)) {
    dataReady = false;
    observedTdee = null;
  }
  var rawDifference = observedTdee !== null ? observedTdee - currentTdee : null;
  var suggestedChange = 0;
  if (dataReady && Math.abs(rawDifference) >= 100) {
    suggestedChange = (rawDifference > 0 ? 1 : -1) * (Math.abs(rawDifference) >= 250 ? 150 : 100);
  }
  var suggestedTdee = dataReady ? Math.max(1200, Math.min(6000, currentTdee + suggestedChange)) : null;
  var goalFactor = 1 + (parseFloat(profile && profile.tdeeAdjust) || 0) / 100;
  return {
    ready: dataReady,
    currentTdee: currentTdee,
    observedTdee: observedTdee,
    suggestedChange: suggestedChange,
    suggestedTdee: suggestedTdee,
    currentGoalKcal: currentTdee ? Math.round(currentTdee * goalFactor) : null,
    suggestedGoalKcal: suggestedTdee ? Math.round(suggestedTdee * goalFactor) : null,
    averageIntake: averageIntake,
    weightTrend: trend,
    weightCount: periodWeights.length,
    spanDays: spanDays,
    loggedDays: loggedKcal.length,
    coverage: coverage,
    stableEnough: stableEnough,
    newDataSinceApplied: newDataSinceApplied,
    cooldownDays: cooldownDays,
    periodStart: periodStart,
    periodEnd: periodEnd
  };
}
function MG(_ref) {
  var kcal = _ref.kcal,
    protein = _ref.protein,
    carbs = _ref.carbs,
    fat = _ref.fat,
    sugars = _ref.sugars,
    fiber = _ref.fiber,
    saturatedFat = _ref.saturatedFat,
    salt = _ref.salt,
    showDetails = _ref.showDetails,
    T = _ref.T;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr",
      gap: 6,
      margin: "8px 0"
    }
  }, [[Math.round(kcal), "Kcal", T.kcal], [r2(protein) + "g", "Białko", T.prot], [r2(carbs) + "g", "Węgle", T.carbs], [r2(fat) + "g", "Tłuszcz", T.fat]].map(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 3),
      v = _ref3[0],
      l = _ref3[1],
      c = _ref3[2];
    return /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        background: T.surf2,
        borderRadius: 10,
        padding: "9px 6px",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "monospace",
        fontSize: 13,
        fontWeight: 600,
        color: c
      }
    }, v), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text2,
        marginTop: 2
      }
    }, l));
  })), showDetails && /*#__PURE__*/React.createElement(NutritionDetails, {
    sugars: sugars,
    fiber: fiber,
    saturatedFat: saturatedFat,
    salt: salt,
    T: T
  }));
}
function NutritionDetails(_refNutritionDetails) {
  var T = _refNutritionDetails.T;
  var knownRows = NUTRITION_DETAIL_FIELDS.map(function (field) {
    return {
      key: field.key,
      label: field.label,
      value: optionalNutritionNumber(_refNutritionDetails[field.key])
    };
  }).filter(function (row) {
    return row.value !== null;
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 5,
      margin: "-2px 0 9px"
    }
  }, knownRows.length ? knownRows.map(function (row) {
    return /*#__PURE__*/React.createElement("span", {
      key: row.key,
      style: {
        background: T.surf2,
        border: "1px solid " + T.border,
        borderRadius: 999,
        padding: "4px 7px",
        fontSize: 10,
        color: T.text2
      }
    }, row.label, " ", /*#__PURE__*/React.createElement("strong", {
      style: { color: T.text, fontFamily: "monospace" }
    }, r2(row.value), " g"));
  }) : /*#__PURE__*/React.createElement("span", {
    style: { fontSize: 10, color: T.text3 }
  }, "Brak szczegółowych danych — nie liczymy ich jako zera."));
}
function ExtendedNutritionReport(_refExtendedNutritionReport) {
  var summary = _refExtendedNutritionReport.summary,
    targetKcal = _refExtendedNutritionReport.targetKcal,
    periodDays = _refExtendedNutritionReport.periodDays,
    onPeriodChange = _refExtendedNutritionReport.onPeriodChange,
    T = _refExtendedNutritionReport.T;
  var details = summary.details;
  var saturatedReference = Math.max(1, Math.round(((summary.avgKcal || targetKcal || 2000) * 0.1 / 9) * 10) / 10);
  var cards = [{
    key: "protein",
    label: "Białko",
    reference: summary.avgProteinTarget ? "cel śr. " + Math.round(summary.avgProteinTarget) + " g" : "cel z profilu",
    limit: summary.avgProteinTarget,
    direction: "min",
    primary: true,
    row: {
      average: summary.avgProtein,
      coverage: summary.loggedDays ? 1 : 0,
      coveragePct: summary.loggedDays ? 100 : 0
    }
  }, {
    key: "fiber",
    label: "Błonnik",
    reference: "cel ≥25 g",
    limit: 25,
    direction: "min"
  }, {
    key: "salt",
    label: "Sól",
    reference: "limit <5 g",
    limit: 5,
    direction: "max"
  }, {
    key: "saturatedFat",
    label: "Tł. nasycone",
    reference: "≤10% energii (~" + saturatedReference + " g)",
    limit: saturatedReference,
    direction: "max"
  }, {
    key: "sugars",
    label: "Cukry ogółem",
    reference: "bez celu",
    limit: null,
    direction: null
  }];
  function cardColor(card, row) {
    if (row.average === null || row.coverage < 0.9 || !card.limit) return T.text;
    var onTarget = card.direction === "min" ? row.average >= card.limit : row.average <= card.limit;
    return onTarget ? "#22c55e" : "#f59e0b";
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "mf-section-card",
    "aria-label": "Średnie wartości odżywcze z " + periodDays + " dni",
    style: {
      background: T.surf,
      border: "1px solid " + T.border,
      borderRadius: 16,
      padding: 13,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start", marginBottom: 9 }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: { fontSize: 9, color: T.acc, textTransform: "uppercase", letterSpacing: 1.1, fontWeight: 800 }
  }, "ODŻYWIANIE · ", periodDays, " DNI"), /*#__PURE__*/React.createElement("div", {
    style: { fontSize: 15, color: T.text, fontWeight: 800, marginTop: 2 }
  }, "Średnia z wpisanych dni")), /*#__PURE__*/React.createElement("div", {
    style: { display: "grid", justifyItems: "end", gap: 5 }
  }, /*#__PURE__*/React.createElement("span", {
    style: { fontSize: 9, color: T.text3, textAlign: "right", lineHeight: 1.4 }
  }, summary.loggedDays, "/", periodDays, " dni z jedzeniem"), /*#__PURE__*/React.createElement("div", {
    role: "group",
    "aria-label": "Zakres analizy odżywiania",
    style: { display: "flex", gap: 3, padding: 3, borderRadius: 9, background: T.surf2, border: "1px solid " + T.border }
  }, [7, 30].map(function (days) {
    var active = periodDays === days;
    return /*#__PURE__*/React.createElement("button", {
      key: days,
      type: "button",
      "aria-pressed": active,
      onClick: function onClick() { return onPeriodChange(days); },
      style: {
        border: "1px solid " + (active ? T.acc : "transparent"),
        borderRadius: 7,
        background: active ? T.acc + "22" : "transparent",
        color: active ? T.acc : T.text3,
        padding: "4px 7px",
        minHeight: 28,
        fontSize: 9,
        fontWeight: active ? 800 : 600,
        cursor: "pointer"
      }
    }, days, " dni");
  })))), /*#__PURE__*/React.createElement("div", {
    style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }
  }, cards.map(function (card) {
    var row = card.row || details[card.key];
    var enough = row.average !== null;
    var partial = !card.primary && enough && row.coveragePct < 100;
    var badge = card.primary && summary.avgProteinTarget && enough ? Math.round(row.average / summary.avgProteinTarget * 100) + "% celu" : row.coveragePct + "% danych";
    return /*#__PURE__*/React.createElement("div", {
      key: card.key,
      style: { background: T.surf2, border: "1px solid " + T.border, borderRadius: 10, padding: "9px 8px", minWidth: 0 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }
    }, /*#__PURE__*/React.createElement("strong", {
      style: { color: cardColor(card, row), fontFamily: "monospace", fontSize: 14 }
    }, enough ? (partial ? "min. " : "") + r2(row.average) + " g" : "—"), /*#__PURE__*/React.createElement("span", {
      style: { color: T.text3, fontSize: 8, whiteSpace: "nowrap" }
    }, badge)), /*#__PURE__*/React.createElement("div", {
      style: { color: T.text, fontSize: 10, fontWeight: 700, marginTop: 3 }
    }, card.label), /*#__PURE__*/React.createElement("div", {
      style: { color: T.text3, fontSize: 8, marginTop: 2 }
    }, enough ? card.reference : card.primary ? "Dodaj jedzenie do planera" : "Potrzeba ≥70% pokrycia"));
  })), /*#__PURE__*/React.createElement("div", {
    style: { fontSize: 9, lineHeight: 1.45, color: T.text3, marginTop: 8 }
  }, "Białko porównujemy ze średnim celem zapisanym w profilu i typami wpisanych dni. Cukry ogółem obejmują też naturalne cukry z owoców i nabiału, dlatego nie porównujemy ich z limitem cukrów wolnych. Ocena pozostałych celów lub limitów pojawia się dopiero przy ≥90% pokrycia danych. Dane produktów referencyjnych: ", /*#__PURE__*/React.createElement("a", {
    href: "https://fdc.nal.usda.gov/data-documentation.html",
    target: "_blank",
    rel: "noopener noreferrer",
    style: { color: T.acc }
  }, "USDA FoodData Central"), ". Punkty odniesienia dla zdrowych dorosłych: ", /*#__PURE__*/React.createElement("a", {
    href: "https://www.efsa.europa.eu/en/press/news/nda100326",
    target: "_blank",
    rel: "noopener noreferrer",
    style: { color: T.acc }
  }, "EFSA"), " / ", /*#__PURE__*/React.createElement("a", {
    href: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
    target: "_blank",
    rel: "noopener noreferrer",
    style: { color: T.acc }
  }, "WHO"), "."));
}

// Podgląd makro dla wybranego produktu — wyodrębniony komponent zamiast IIFE
function ProdPreview(_ref4) {
  var selP = _ref4.selP,
    selG = _ref4.selG,
    products = _ref4.products,
    showDetails = _ref4.showDetails,
    T = _ref4.T;
  if (!selP || !selG) return null;
  var p = products.find(function (x) {
    return x.id === selP;
  });
  if (!p) return null;
  var f = parseFloat(selG) / 100;
  if (isNaN(f) || f <= 0) return null;
  return /*#__PURE__*/React.createElement(MG, {
    kcal: p.kcal * f,
    protein: p.protein * f,
    carbs: p.carbs * f,
    fat: p.fat * f,
    sugars: scaledNutritionDetails(p, f).sugars,
    fiber: scaledNutritionDetails(p, f).fiber,
    saturatedFat: scaledNutritionDetails(p, f).saturatedFat,
    salt: scaledNutritionDetails(p, f).salt,
    showDetails: showDetails,
    T: T
  });
}
function Builder(_ref5) {
  var items = _ref5.items,
    setItems = _ref5.setItems,
    products = _ref5.products,
    T = _ref5.T,
    inp = _ref5.inp,
    btnA = _ref5.btnA;
  var _useState3 = useState(""),
    _useState4 = _slicedToArray(_useState3, 2),
    sp = _useState4[0],
    setSp = _useState4[1];
  var _useState5 = useState("100"),
    _useState6 = _slicedToArray(_useState5, 2),
    sg = _useState6[0],
    setSg = _useState6[1];
  function add() {
    if (!sp) return;
    setItems(function (prev) {
      return [].concat(_toConsumableArray(prev), [{
        productId: sp,
        grams: parseFloat(sg) || 100
      }]);
    });
    setSp("");
    setSg("100");
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, items.map(function (item, i) {
    var p = products.find(function (x) {
      return x.id === item.productId;
    });
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 10px",
        background: T.surf2,
        borderRadius: 8,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 13,
        color: T.text
      }
    }, p === null || p === void 0 ? void 0 : p.emoji, " ", (p === null || p === void 0 ? void 0 : p.name) || "?", p !== null && p !== void 0 && p.state ? " · " + p.state : ""), /*#__PURE__*/React.createElement("input", {
      value: item.grams,
      onChange: function onChange(e) {
        var g = parseFloat(e.target.value) || 0;
        setItems(function (prev) {
          return prev.map(function (x, j) {
            return j === i ? _objectSpread(_objectSpread({}, x), {}, {
              grams: g
            }) : x;
          });
        });
      },
      type: "number",
      min: "1",
      style: {
        width: 60,
        background: T.surf,
        border: "1px solid " + T.border,
        borderRadius: 6,
        color: T.acc,
        fontFamily: "monospace",
        fontSize: 13,
        padding: "4px 6px",
        outline: "none",
        textAlign: "center"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: T.text3
      }
    }, "g"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      "aria-label": "Usuń składnik " + ((p === null || p === void 0 ? void 0 : p.name) || "z przepisu"),
      onClick: function onClick() {
        return setItems(function (prev) {
          return prev.filter(function (_, j) {
            return j !== i;
          });
        });
      },
      style: {
        color: T.text3,
        cursor: "pointer",
        fontSize: 17,
        width: 36,
        height: 36,
        border: "none",
        borderRadius: 8,
        background: "transparent"
      }
    }, "×"));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: sp,
    onChange: function onChange(e) {
      return setSp(e.target.value);
    },
    style: _objectSpread(_objectSpread({}, inp), {}, {
      flex: 1,
      fontSize: 12
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "+ Dodaj sk\u0142adnik..."), products.map(function (p) {
    return /*#__PURE__*/React.createElement("option", {
      key: p.id,
      value: p.id
    }, p.name, p.state ? " · " + p.state : "");
  })), /*#__PURE__*/React.createElement("input", {
    value: sg,
    onChange: function onChange(e) {
      return setSg(e.target.value);
    },
    type: "number",
    min: "1",
    style: _objectSpread(_objectSpread({}, inp), {}, {
      width: 64,
      textAlign: "center",
      fontFamily: "monospace",
      padding: "10px 6px"
    })
  }), /*#__PURE__*/React.createElement("button", {
    onClick: add,
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      padding: "10px 14px",
      fontSize: 17
    })
  }, "+")));
}
function Modal(_ref6) {
  var title = _ref6.title,
    onClose = _ref6.onClose,
    children = _ref6.children,
    T = _ref6.T;
  var panelRef = useRef(null);
  useEffect(function () {
    var previousFocus = document.activeElement;
    var panel = panelRef.current;
    var focusTimer = setTimeout(function () {
      if (!panel) return;
      var preferred = panel.querySelector("[autofocus], input:not([type='hidden']), select, textarea, button");
      (preferred || panel).focus();
    }, 0);
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      var focusable = Array.prototype.slice.call(panel.querySelectorAll("button:not([disabled]), input:not([disabled]):not([type='hidden']), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])")).filter(function (element) {
        return element.offsetParent !== null;
      });
      if (!focusable.length) {
        event.preventDefault();
        panel.focus();
        return;
      }
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return function () {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    className: "mf-modal-backdrop",
    role: "presentation",
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.88)",
      zIndex: 200,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: panelRef,
    tabIndex: -1,
    onClick: function onClick(e) {
      return e.stopPropagation();
    },
    className: "mf-modal-panel",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "mf-modal-title",
    style: {
      background: T.surf,
      borderRadius: "20px 20px 0 0",
      border: "1px solid " + T.border,
      borderBottom: "none",
      width: "100%",
      maxWidth: 430,
      padding: 20,
      maxHeight: "93vh",
      overflowY: "auto",
      paddingBottom: 300
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 18,
      marginBottom: 12,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: T.text
    }
  }, /*#__PURE__*/React.createElement("span", {
    id: "mf-modal-title"
  }, title), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    className: "mf-modal-close",
    "aria-label": "Zamknij okno",
    style: {
      cursor: "pointer",
      color: T.text2,
      fontSize: 22
    }
  }, "\u2715")), children));
}
function DS(_ref7) {
  var value = _ref7.value,
    _onChange = _ref7.onChange,
    week = _ref7.week,
    T = _ref7.T,
    inp = _ref7.inp;
  return /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: function onChange(e) {
      return _onChange(e.target.value);
    },
    style: inp
  }, week.map(function (d) {
    var k = mfISODate(d),
      dow = d.getDay() === 0 ? 6 : d.getDay() - 1;
    return /*#__PURE__*/React.createElement("option", {
      key: k,
      value: k
    }, DAYS[dow], " ", d.toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "short"
    }), k === TODAY ? " (dziś)" : "");
  }));
}
function Lbl(_ref8) {
  var children = _ref8.children,
    mt = _ref8.mt,
    T = _ref8.T;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: 1,
      color: T.text3,
      marginBottom: 5,
      marginTop: mt || 10
    }
  }, children);
}
function PageHeader(_refPageHeader) {
  var eyebrow = _refPageHeader.eyebrow,
    title = _refPageHeader.title,
    subtitle = _refPageHeader.subtitle,
    action = _refPageHeader.action,
    T = _refPageHeader.T;
  return /*#__PURE__*/React.createElement("header", {
    className: "mf-page-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mf-page-copy"
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    className: "mf-page-eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement("h1", {
    className: "mf-page-title",
    style: { color: T.text }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    className: "mf-page-subtitle",
    style: { color: T.text2 }
  }, subtitle)), action && /*#__PURE__*/React.createElement("div", {
    className: "mf-page-action"
  }, action));
}
function EmptyState(_refEmptyState) {
  var icon = _refEmptyState.icon,
    title = _refEmptyState.title,
    copy = _refEmptyState.copy,
    action = _refEmptyState.action,
    T = _refEmptyState.T;
  return /*#__PURE__*/React.createElement("div", {
    className: "mf-empty-state",
    style: { background: T.surf, color: T.text }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mf-empty-icon",
    "aria-hidden": "true"
  }, icon || "·"), /*#__PURE__*/React.createElement("div", {
    className: "mf-empty-title"
  }, title), copy && /*#__PURE__*/React.createElement("div", {
    className: "mf-empty-copy",
    style: { color: T.text2 }
  }, copy), action && /*#__PURE__*/React.createElement("div", {
    className: "mf-empty-action"
  }, action));
}
function ScanModal(_ref9) {
  var T = _ref9.T,
    inp = _ref9.inp,
    btnA = _ref9.btnA,
    btnB = _ref9.btnB,
    onClose = _ref9.onClose,
    onScan = _ref9.onScan,
    scanLoading = _ref9.scanLoading,
    scanResult = _ref9.scanResult,
    scanError = _ref9.scanError,
    onAccept = _ref9.onAccept,
    onReset = _ref9.onReset,
    onManualAdd = _ref9.onManualAdd,
    onEdit = _ref9.onEdit;
  var _useState7 = useState(""),
    _useState8 = _slicedToArray(_useState7, 2),
    manualEan = _useState8[0],
    setManualEan = _useState8[1];
  var _useState9 = useState(false),
    _useState0 = _slicedToArray(_useState9, 2),
    cameraActive = _useState0[0],
    setCameraActive = _useState0[1];
  var _useState1 = useState(""),
    _useState10 = _slicedToArray(_useState1, 2),
    cameraError = _useState10[0],
    setCameraError = _useState10[1];
  var _useState11 = useState(""),
    _useState12 = _slicedToArray(_useState11, 2),
    eanError = _useState12[0],
    setEanError = _useState12[1];
  var scannerRef = useRef(null);
  var cameraRequestedRef = useRef(false);
  var scanPanelRef = useRef(null);
  function startCamera() {
    setCameraError("");
    cameraRequestedRef.current = true;
    setCameraActive(true);
    // Dynamicznie ładujemy html5-qrcode
    if (window.Html5Qrcode) {
      initScanner();
      return;
    }
    var script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js";
    script.onload = initScanner;
    script.onerror = function () {
      setCameraActive(false);
      setCameraError("Nie można załadować skanera. Wpisz kod ręcznie.");
    };
    document.head.appendChild(script);
  }
  function initScanner() {
    setTimeout(function () {
      if (!cameraRequestedRef.current) return;
      try {
        var scanner = new window.Html5Qrcode("qr-reader");
        scannerRef.current = scanner;
        scanner.start({
          facingMode: "environment"
        }, {
          fps: 10,
          qrbox: {
            width: 250,
            height: 150
          }
        }, function (ean) {
          var normalized = normalizeBarcode(ean);
          if (!isValidGtin(normalized)) return;
          scanner.stop().then(function () {
            return scanner.clear();
          }).catch(function () {});
          scannerRef.current = null;
          cameraRequestedRef.current = false;
          setCameraActive(false);
          onScan(normalized);
        }, function () {}).catch(function (e) {
          scannerRef.current = null;
          cameraRequestedRef.current = false;
          scanner.clear().catch(function () {});
          setCameraError("Brak dostępu do kamery: " + e);
          setCameraActive(false);
        });
      } catch (e) {
        scannerRef.current = null;
        cameraRequestedRef.current = false;
        setCameraError("Błąd skanera: " + e);
        setCameraActive(false);
      }
    }, 300);
  }
  function stopCamera() {
    cameraRequestedRef.current = false;
    if (scannerRef.current) {
      var scanner = scannerRef.current;
      scannerRef.current = null;
      scanner.stop().then(function () {
        return scanner.clear();
      }).catch(function () {});
    }
    setCameraActive(false);
  }
  useEffect(function () {
    var previousFocus = document.activeElement;
    var timer = setTimeout(function () {
      if (scanPanelRef.current) scanPanelRef.current.focus();
    }, 0);
    function handleScanKeys(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        stopCamera();
        onClose();
      }
    }
    document.addEventListener("keydown", handleScanKeys);
    return function () {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleScanKeys);
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    role: "presentation",
    onClick: function onClick() {
      stopCamera();
      onClose();
    },
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.88)",
      zIndex: 200,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: scanPanelRef,
    tabIndex: -1,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "mf-scan-title",
    onClick: function onClick(e) {
      return e.stopPropagation();
    },
    style: {
      background: T.surf,
      borderRadius: "20px 20px 0 0",
      border: "1px solid " + T.border,
      borderBottom: "none",
      width: "100%",
      maxWidth: 430,
      padding: 20,
      maxHeight: "93vh",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 18,
      marginBottom: 12,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: T.text
    }
  }, /*#__PURE__*/React.createElement("span", {
    id: "mf-scan-title"
  }, "\uD83D\uDCF7 Skanuj kod EAN"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Zamknij skaner kodu EAN",
    onClick: function onClick() {
      stopCamera();
      onClose();
    },
    style: {
      cursor: "pointer",
      color: T.text2,
      fontSize: 22,
      border: "none",
      borderRadius: 8,
      background: "transparent",
      width: 42,
      height: 42
    }
  }, "\u2715")), !scanResult && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    id: "qr-reader",
    style: {
      width: "100%",
      borderRadius: 12,
      overflow: "hidden",
      background: T.surf2,
      minHeight: cameraActive ? 200 : 0
    }
  }), cameraError && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#ff6b6b",
      padding: "8px 0"
    }
  }, cameraError), !cameraActive && !scanLoading && /*#__PURE__*/React.createElement("button", {
    onClick: startCamera,
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      width: "100%",
      marginBottom: 12,
      fontSize: 14
    })
  }, "\uD83D\uDCF7 Uruchom kamer\u0119"), cameraActive && /*#__PURE__*/React.createElement("button", {
    onClick: stopCamera,
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      width: "100%",
      marginBottom: 12,
      fontSize: 12
    })
  }, "\u23F9 Zatrzymaj kamer\u0119"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: 1,
      color: T.text3,
      marginBottom: 6,
      marginTop: 4
    }
  }, "lub wpisz kod r\u0119cznie"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: manualEan,
    onChange: function onChange(e) {
      setManualEan(normalizeBarcode(e.target.value));
      setEanError("");
    },
    placeholder: "np. 5900617008053",
    style: _objectSpread(_objectSpread({}, inp), {}, {
      flex: 1,
      fontFamily: "monospace"
    }),
    maxLength: 14
  }), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      if (isValidGtin(manualEan)) {
        stopCamera();
        onScan(manualEan);
      } else {
        setEanError("Wpisz poprawny kod EAN/GTIN (8, 12, 13 lub 14 cyfr).");
      }
    },
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      padding: "10px 14px",
      flexShrink: 0,
      opacity: isValidGtin(manualEan) ? 1 : 0.5
    })
  }, "Szukaj")), eanError && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#ff6b6b",
      marginTop: 6
    }
  }, eanError)), scanLoading && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "30px 0",
      color: T.text2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      marginBottom: 8
    }
  }, "\uD83D\uDD0D"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13
    }
  }, "Szukam produktu...")), scanResult && !scanLoading && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: T.surf2,
      borderRadius: 12,
      padding: 14,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      color: T.text,
      marginBottom: 4
    }
  }, "\uD83D\uDED2 ", scanResult.name || "Brak nazwy"), scanResult.brand && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text3,
      marginBottom: 8
    }
  }, scanResult.brand), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr",
      gap: 6
    }
  }, [[Math.round(scanResult.kcal), "kcal", T.kcal], [scanResult.protein + "g", "Białko", T.prot], [scanResult.carbs + "g", "Węgle", T.carbs], [scanResult.fat + "g", "Tłuszcz", T.fat]].map(function (_ref0) {
    var _ref1 = _slicedToArray(_ref0, 3),
      v = _ref1[0],
      l = _ref1[1],
      c = _ref1[2];
    return /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        background: T.surf,
        borderRadius: 8,
        padding: "7px 4px",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: c,
        fontFamily: "monospace"
      }
    }, v), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: T.text3,
        marginTop: 1
      }
    }, l));
  })), /*#__PURE__*/React.createElement(NutritionDetails, {
    sugars: scanResult.sugars,
    fiber: scanResult.fiber,
    saturatedFat: scanResult.saturatedFat,
    salt: scanResult.salt,
    T: T
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      lineHeight: 1.4,
      marginBottom: 10
    }
  }, scanResult.source === "local" ? "Produkt zapisany wcześniej w MatFit. Szczegóły: " + nutritionDetailCompleteness(scanResult) + "/4." : "Dane: Open Food Facts · szczegóły " + nutritionDetailCompleteness(scanResult) + "/4. Sprawdź etykietę — baza społecznościowa może zawierać braki."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, scanResult.source !== "local" && /*#__PURE__*/React.createElement("button", {
    onClick: onEdit,
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      flex: 1
    })
  }, "Popraw dane"), /*#__PURE__*/React.createElement("button", {
    onClick: onAccept,
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      flex: 2
    })
  }, "Dodaj do planera"))), scanError && !scanLoading && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "#ff6b6b",
      marginBottom: 12
    }
  }, scanError), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setManualEan("");
      setEanError("");
      onReset();
    },
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      fontSize: 12
    })
  }, "Spr\xF3buj ponownie"), /*#__PURE__*/React.createElement("button", {
    onClick: onManualAdd,
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      fontSize: 12
    })
  }, "Dodaj r\u0119cznie")))));
}
function App() {
  var _products$find, _recipes$find, _recipes$find2;
  var _useLS = useLS("fb_theme", "royal"),
    _useLS2 = _slicedToArray(_useLS, 2),
    tn = _useLS2[0],
    setTn = _useLS2[1];
  var safeTn = THEMES[tn] ? tn : "royal";
  var T = THEMES[safeTn];
  var _useState11 = useState("planer"),
    _useState12 = _slicedToArray(_useState11, 2),
    page = _useState12[0],
    setPage = _useState12[1];
  function navigateToPage(nextPage) {
    setPage(nextPage);
    setTimeout(function () {
      var main = document.getElementById("mf-main");
      if (main) main.focus();
    }, 0);
  }
  var _useLSRecipes = useLS("fb10_recipes", []),
    _useLSRecipes2 = _slicedToArray(_useLSRecipes, 2),
    storedRecipes = _useLSRecipes2[0],
    setStoredRecipes = _useLSRecipes2[1];
  var _useLSHiddenRecipes = useLS("fb10_hidden_recipes", []),
    _useLSHiddenRecipes2 = _slicedToArray(_useLSHiddenRecipes, 2),
    hiddenRecipes = _useLSHiddenRecipes2[0],
    setHiddenRecipes = _useLSHiddenRecipes2[1];
  var recipes = useMemo(function () {
    return mergeRecipeCatalog(storedRecipes, hiddenRecipes);
  }, [storedRecipes, hiddenRecipes]);
  function setRecipes(value) {
    setStoredRecipes(function (previousStored) {
      var currentCatalog = mergeRecipeCatalog(previousStored, hiddenRecipes);
      var nextCatalog = typeof value === "function" ? value(currentCatalog) : value;
      return onlyStoredRecipes(nextCatalog);
    });
  }
  var _useLS5 = useLS("fb10_products", PRODUCTS_DEFAULT),
    _useLS6 = _slicedToArray(_useLS5, 2),
    storedProducts = _useLS6[0],
    setStoredProducts = _useLS6[1];
  var products = useMemo(function () {
    return mergeProductCatalog(storedProducts, PRODUCTS_DEFAULT);
  }, [storedProducts]);
  function setProducts(value) {
    setStoredProducts(function (previousStored) {
      var currentCatalog = mergeProductCatalog(previousStored, PRODUCTS_DEFAULT);
      var nextCatalog = typeof value === "function" ? value(currentCatalog) : value;
      return onlyUserProducts(nextCatalog, PRODUCTS_DEFAULT);
    });
  }
  var _useLSNutritionDetails = useLS("fb10_nutrition_details", false),
    _useLSNutritionDetails2 = _slicedToArray(_useLSNutritionDetails, 2),
    showNutritionDetails = _useLSNutritionDetails2[0],
    setShowNutritionDetails = _useLSNutritionDetails2[1];
  var _useStateNutritionPeriod = useState(7),
    _useStateNutritionPeriod2 = _slicedToArray(_useStateNutritionPeriod, 2),
    nutritionPeriodDays = _useStateNutritionPeriod2[0],
    setNutritionPeriodDays = _useStateNutritionPeriod2[1];
  var _useLS7 = useLS("fb10_planer", {}),
    _useLS8 = _slicedToArray(_useLS7, 2),
    planer = _useLS8[0],
    setPlaner = _useLS8[1];
  var _useLS9 = useLS("fb10_profile", {
      weight: "",
      height: "",
      age: "",
      gender: "m",
      activity: "active",
      tdeeAdjust: 0,
      macroMode: "auto",
      macroProt: "30",
      macroFat: "25",
      macroCarb: "45",
      targetWeight: "",
      targetBf: "",
      goalStartWeight: "",
      goalStartBf: "",
      goalStartDate: "",
      tdeeManual: "",
      tdeeCalibrationAppliedAt: ""
    }),
    _useLS0 = _slicedToArray(_useLS9, 2),
    profile = _useLS0[0],
    setProfile = _useLS0[1];
  var _useLS1 = useLS("fb10_favorites", []),
    _useLS10 = _slicedToArray(_useLS1, 2),
    favorites = _useLS10[0],
    setFavorites = _useLS10[1];
  var _useLSProductFavorites = useLS("fb10_product_favorites", []),
    _useLSProductFavorites2 = _slicedToArray(_useLSProductFavorites, 2),
    productFavorites = _useLSProductFavorites2[0],
    setProductFavorites = _useLSProductFavorites2[1];
  var _useLSRecentProducts = useLS("fb10_recent_products", []),
    _useLSRecentProducts2 = _slicedToArray(_useLSRecentProducts, 2),
    recentProducts = _useLSRecentProducts2[0],
    setRecentProducts = _useLSRecentProducts2[1];
  var _useLSProductGrams = useLS("fb10_product_grams", {}),
    _useLSProductGrams2 = _slicedToArray(_useLSProductGrams, 2),
    productGrams = _useLSProductGrams2[0],
    setProductGrams = _useLSProductGrams2[1];
  var _useLS11 = useLS("fb10_dayTypes", {}),
    _useLS12 = _slicedToArray(_useLS11, 2),
    dayTypes = _useLS12[0],
    setDayTypes = _useLS12[1];
  var _useLS13 = useLS("fb10_body", {}),
    _useLS14 = _slicedToArray(_useLS13, 2),
    bodyLog = _useLS14[0],
    setBodyLog = _useLS14[1];
  var _useState13 = useState("neck"),
    _useState14 = _slicedToArray(_useState13, 2),
    activeChart = _useState14[0],
    setActiveChart = _useState14[1];
  var _useState15 = useState({}),
    _useState16 = _slicedToArray(_useState15, 2),
    bodyForm = _useState16[0],
    setBodyForm = _useState16[1];
  var _useStateBodyDate = useState(TODAY),
    _useStateBodyDate2 = _slicedToArray(_useStateBodyDate, 2),
    bodyDate = _useStateBodyDate2[0],
    setBodyDate = _useStateBodyDate2[1];
  var _useLSWater = useLS("fb10_water", {}),
    _useLSWater2 = _slicedToArray(_useLSWater, 2),
    waterLog = _useLSWater2[0],
    setWaterLog = _useLSWater2[1];
  var _useLSWaterSettings = useLS("fb10_water_settings", {
      manualTarget: ""
    }),
    _useLSWaterSettings2 = _slicedToArray(_useLSWaterSettings, 2),
    waterSettings = _useLSWaterSettings2[0],
    setWaterSettings = _useLSWaterSettings2[1];
  var _useStateWaterDate = useState(TODAY),
    _useStateWaterDate2 = _slicedToArray(_useStateWaterDate, 2),
    waterDate = _useStateWaterDate2[0],
    setWaterDate = _useStateWaterDate2[1];
  var _useStateWaterCustom = useState(""),
    _useStateWaterCustom2 = _slicedToArray(_useStateWaterCustom, 2),
    waterCustom = _useStateWaterCustom2[0],
    setWaterCustom = _useStateWaterCustom2[1];
  var _useState17 = useState(null),
    _useState18 = _slicedToArray(_useState17, 2),
    modal = _useState18[0],
    setModal = _useState18[1];
  useEffect(function () {
    if (modal !== "recipeCard") return undefined;
    var previousFocus = document.activeElement;
    var timer = setTimeout(function () {
      var cardDialog = document.querySelector('[role="dialog"][aria-label^="Karta przepisu"]');
      if (cardDialog) cardDialog.focus();
    }, 0);
    function closeRecipeCard(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setModal(null);
      }
    }
    document.addEventListener("keydown", closeRecipeCard);
    return function () {
      clearTimeout(timer);
      document.removeEventListener("keydown", closeRecipeCard);
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    };
  }, [modal]);
  var _useState19 = useState(""),
    _useState20 = _slicedToArray(_useState19, 2),
    toast = _useState20[0],
    setToast = _useState20[1];

    function toast_(msg) {
      setToast(msg);
      setTimeout(function () {
        setToast("");
      }, 2500);
    }

  var _useState21 = useState(null),
    _useState22 = _slicedToArray(_useState21, 2),
    expanded = _useState22[0],
    setExpanded = _useState22[1];
  var _useState23 = useState({}),
    _useState24 = _slicedToArray(_useState23, 2),
    scales = _useState24[0],
    setScales = _useState24[1];
  var _useStateRecipeVariants = useState({}),
    _useStateRecipeVariants2 = _slicedToArray(_useStateRecipeVariants, 2),
    recipeVariants = _useStateRecipeVariants2[0],
    setRecipeVariants = _useStateRecipeVariants2[1];
  var _useState25 = useState(""),
    _useState26 = _slicedToArray(_useState25, 2),
    prodSearch = _useState26[0],
    setProdSearch = _useState26[1];
  var _useStateRecipeSearch = useState(""),
    _useStateRecipeSearch2 = _slicedToArray(_useStateRecipeSearch, 2),
    recipeSearch = _useStateRecipeSearch2[0],
    setRecipeSearch = _useStateRecipeSearch2[1];
  var _useStateRecipeCategory = useState("all"),
    _useStateRecipeCategory2 = _slicedToArray(_useStateRecipeCategory, 2),
    recipeCategory = _useStateRecipeCategory2[0],
    setRecipeCategory = _useStateRecipeCategory2[1];
  var _useStateProductCategory = useState("all"),
    _useStateProductCategory2 = _slicedToArray(_useStateProductCategory, 2),
    productCategory = _useStateProductCategory2[0],
    setProductCategory = _useStateProductCategory2[1];
  var _useState27 = useState(1),
    _useState28 = _slicedToArray(_useState27, 2),
    zDays = _useState28[0],
    setZDays = _useState28[1];
  var _useLS15 = useLS("fb10_zakupy", {}),
    _useLS16 = _slicedToArray(_useLS15, 2),
    zChecked = _useLS16[0],
    setZChecked = _useLS16[1];
  var _useState29 = useState(TODAY),
    _useState30 = _slicedToArray(_useState29, 2),
    cpFrom = _useState30[0],
    setCpFrom = _useState30[1];
  var _useState31 = useState(TODAY),
    _useState32 = _slicedToArray(_useState31, 2),
    cpTo = _useState32[0],
    setCpTo = _useState32[1];
  var _useStateCopyMealSource = useState(null),
    _useStateCopyMealSource2 = _slicedToArray(_useStateCopyMealSource, 2),
    copyMealSource = _useStateCopyMealSource2[0],
    setCopyMealSource = _useStateCopyMealSource2[1];
  var _useStateCopyMealTo = useState(TODAY),
    _useStateCopyMealTo2 = _slicedToArray(_useStateCopyMealTo, 2),
    copyMealTo = _useStateCopyMealTo2[0],
    setCopyMealTo = _useStateCopyMealTo2[1];
  var _useStateCopyMealTime = useState("sniadanie"),
    _useStateCopyMealTime2 = _slicedToArray(_useStateCopyMealTime, 2),
    copyMealTime = _useStateCopyMealTime2[0],
    setCopyMealTime = _useStateCopyMealTime2[1];
  var _useState33 = useState(TODAY),
    _useState34 = _slicedToArray(_useState33, 2),
    addDay = _useState34[0],
    setAddDay = _useState34[1];
  var _useState35 = useState("sniadanie"),
    _useState36 = _slicedToArray(_useState35, 2),
    addMealTime = _useState36[0],
    setAddMealTime = _useState36[1];
  var _useState37 = useState(""),
    _useState38 = _slicedToArray(_useState37, 2),
    selP = _useState38[0],
    setSelP = _useState38[1];
  var _useState39 = useState("100"),
    _useState40 = _slicedToArray(_useState39, 2),
    selG = _useState40[0],
    setSelG = _useState40[1];
  var _useState41 = useState(TODAY),
    _useState42 = _slicedToArray(_useState41, 2),
    selRDay = _useState42[0],
    setSelRDay = _useState42[1];
  var _useState43 = useState("sniadanie"),
    _useState44 = _slicedToArray(_useState43, 2),
    selRMealTime = _useState44[0],
    setSelRMealTime = _useState44[1];
  var _useState45 = useState(""),
    _useState46 = _slicedToArray(_useState45, 2),
    selRId = _useState46[0],
    setSelRId = _useState46[1];
  var _useStateRecipePortions = useState("1"),
    _useStateRecipePortions2 = _slicedToArray(_useStateRecipePortions, 2),
    selRPortions = _useStateRecipePortions2[0],
    setSelRPortions = _useStateRecipePortions2[1];
  var _useStateSelectedRecipeItems = useState(null),
    _useStateSelectedRecipeItems2 = _slicedToArray(_useStateSelectedRecipeItems, 2),
    selRItems = _useStateSelectedRecipeItems2[0],
    setSelRItems = _useStateSelectedRecipeItems2[1];
  var _useState47 = useState(null),
    _useState48 = _slicedToArray(_useState47, 2),
    emKey = _useState48[0],
    setEmKey = _useState48[1];
  var _useState49 = useState(null),
    _useState50 = _slicedToArray(_useState49, 2),
    emId = _useState50[0],
    setEmId = _useState50[1];
  var _useState51 = useState([]),
    _useState52 = _slicedToArray(_useState51, 2),
    emItems = _useState52[0],
    setEmItems = _useState52[1];
  var _useState53 = useState({
      name: "",
      emoji: "",
      cat: "slodkie",
      servings: "1",
      finishedWeight: "",
      steps: ""
    }),
    _useState54 = _slicedToArray(_useState53, 2),
    rf = _useState54[0],
    setRf = _useState54[1];
  var _useState55 = useState([]),
    _useState56 = _slicedToArray(_useState55, 2),
    bItems = _useState56[0],
    setBItems = _useState56[1];
  var _useState57 = useState(null),
    _useState58 = _slicedToArray(_useState57, 2),
    editRId = _useState58[0],
    setEditRId = _useState58[1];
  var _useState59 = useState({
      name: "",
      emoji: "",
      brand: "",
      ean: "",
      kcal: "",
      protein: "",
      carbs: "",
      fat: "",
      sugars: "",
      fiber: "",
      saturatedFat: "",
      salt: "",
      packageSize: ""
    }),
    _useState60 = _slicedToArray(_useState59, 2),
    pf = _useState60[0],
    setPf = _useState60[1];
  var _useState61 = useState(null),
    _useState62 = _slicedToArray(_useState61, 2),
    scanResult = _useState62[0],
    setScanResult = _useState62[1];
  var _useState63 = useState(false),
    _useState64 = _slicedToArray(_useState63, 2),
    scanLoading = _useState64[0],
    setScanLoading = _useState64[1];
  var _useState65 = useState(""),
    _useState66 = _slicedToArray(_useState65, 2),
    scanError = _useState66[0],
    setScanError = _useState66[1];
  var _useStateScanEan = useState(""),
    _useStateScanEan2 = _slicedToArray(_useStateScanEan, 2),
    lastScanEan = _useStateScanEan2[0],
    setLastScanEan = _useStateScanEan2[1];
  var _useState67 = useState(""),
    _useState68 = _slicedToArray(_useState67, 2),
    modalProdSearch = _useState68[0],
    setModalProdSearch = _useState68[1];
  var _useState69 = useState(""),
    _useState70 = _slicedToArray(_useState69, 2),
    modalRecipeSearch = _useState70[0],
    setModalRecipeSearch = _useState70[1];
  var _useState71 = useState(false),
    _useState72 = _slicedToArray(_useState71, 2),
    showRecipeList = _useState72[0],
    setShowRecipeList = _useState72[1];
  var _useState73 = useState(null),
    _useState74 = _slicedToArray(_useState73, 2),
    cardRecipe = _useState74[0],
    setCardRecipe = _useState74[1];
  var _useState75 = useState(null),
    _useState76 = _slicedToArray(_useState75, 2),
    cardImg = _useState76[0],
    setCardImg = _useState76[1];
  var _useState77 = useState(false),
      _useState78 = _slicedToArray(_useState77, 2),
      cardLoading = _useState78[0],
      setCardLoading = _useState78[1];
  var _useStateCardStyle = useState("savory"),
      _useStateCardStyle2 = _slicedToArray(_useStateCardStyle, 2),
      cardStyle = _useStateCardStyle2[0],
      setCardStyle = _useStateCardStyle2[1];
  var _useStatePendingBackup = useState(null),
      _useStatePendingBackup2 = _slicedToArray(_useStatePendingBackup, 2),
      pendingBackup = _useStatePendingBackup2[0],
      setPendingBackup = _useStatePendingBackup2[1];
  var _useStateBackupResult = useState(null),
      _useStateBackupResult2 = _slicedToArray(_useStateBackupResult, 2),
      backupResult = _useStateBackupResult2[0],
      setBackupResult = _useStateBackupResult2[1];

  var _useStateCollapsedMeals = useState({}),
      _useStateCollapsedMeals2 = _slicedToArray(_useStateCollapsedMeals, 2),
      collapsedMeals = _useStateCollapsedMeals2[0],
      setCollapsedMeals = _useStateCollapsedMeals2[1];

  function openRecipeCard(r) {
    var name = String(r && r.name || "");
    var inferredSweet = r && (r.cardStyle === "sweet" || r.cat === "slodkie") || /owsiank|naleś|gofr|shake|twarog|sernik|drożdż|racuch|deser|brownie|ciast/i.test(name);
    setCardRecipe(r);
    setCardImg(r && r.image ? r.image : null);
    setCardStyle(inferredSweet ? "sweet" : "savory");
    setCardLoading(false);
    setModal("recipeCard");
  }
  function handleCardImageUpload(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!String(file.type || "").startsWith("image/")) {
      toast_("Wybierz plik graficzny");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast_("Zdjęcie może mieć maksymalnie 10 MB");
      return;
    }
    var reader = new FileReader();
    reader.onload = function (event) {
      setCardImg(event.target.result);
      toast_("Zdjęcie dodane");
    };
    reader.onerror = function () {
      toast_("Nie udało się wczytać zdjęcia");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }
  function downloadRecipeCardPNG() {
    var node = document.getElementById("recipe-card");
    if (!node) {
      toast_("Nie znaleziono karty");
      return;
    }
    setCardLoading(true);
    try {
      var width = node.scrollWidth;
      var height = node.scrollHeight;
      var clone = node.cloneNode(true);
      clone.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
      clone.style.width = width + "px";
      clone.style.height = height + "px";
      clone.style.margin = "0";
      var html = new XMLSerializer().serializeToString(clone);
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '"><foreignObject width="100%" height="100%">' + html + '</foreignObject></svg>';
      var blob = new Blob([svg], {
        type: "image/svg+xml;charset=utf-8"
      });
      var url = URL.createObjectURL(blob);
      var image = new Image();
      image.onload = function () {
        var scale = 1080 / width;
        var canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = Math.ceil(height * scale);
        var context = canvas.getContext("2d");
        context.fillStyle = "#f8f3e8";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob(function (png) {
          if (!png) {
            setCardLoading(false);
            toast_("Nie udało się utworzyć PNG");
            return;
          }
          var pngUrl = URL.createObjectURL(png);
          var link = document.createElement("a");
          link.href = pngUrl;
          link.download = "matfit-" + String(cardRecipe && cardRecipe.name || "przepis").toLowerCase().replace(/[^a-z0-9ąćęłńóśźż]+/gi, "-").replace(/^-|-$/g, "") + ".png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(function () {
            return URL.revokeObjectURL(pngUrl);
          }, 1000);
          setCardLoading(false);
          toast_("PNG pobrane");
        }, "image/png", 0.95);
      };
      image.onerror = function () {
        URL.revokeObjectURL(url);
        setCardLoading(false);
        toast_("Przeglądarka nie pozwoliła zapisać PNG — użyj PDF/druk");
      };
      image.src = url;
    } catch (_unusedCardExport) {
      setCardLoading(false);
      toast_("Nie udało się utworzyć PNG");
    }
  }
  function shareDay(key) {
    var meals = planer[key] || [];
    if (!meals.length) {
      toast_("Brak posiłków do udostępnienia");
      return;
    }
    var data = {
      v: 1,
      date: key,
      meals: meals.map(function (m) {
        return {
          type: m.type,
          name: m.name,
          mealTime: m.mealTime,
          kcal: m.kcal,
          protein: m.protein,
          carbs: m.carbs,
          fat: m.fat,
          sugars: m.sugars,
          fiber: m.fiber,
          saturatedFat: m.saturatedFat,
          salt: m.salt,
          grams: m.grams,
          items: m.items
        };
      })
    };
    var encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    var url = window.location.href.split("?")[0] + "?share=" + encoded;
    if (navigator.share) {
      navigator.share({
        title: "MatFit Pro — plan żywieniowy",
        text: "Mój plan na " + mfDate(key).toLocaleDateString("pl-PL", {
          day: "numeric",
          month: "long"
        }),
        url: url
      }).catch(function () {
        return copyToClipboard(url);
      });
    } else {
      copyToClipboard(url);
    }
  }
  function copyToClipboard(text) {
    navigator.clipboard && navigator.clipboard.writeText(text).then(function () {
      return toast_("Link skopiowany!");
    }).catch(function () {
      return toast_("Błąd kopiowania");
    });
  }

  // Sprawdź URL przy starcie — czy jest share param
  var _useState79 = useState(function () {
      try {
        var params = new URLSearchParams(window.location.search);
        var share = params.get("share");
        if (!share) return null;
        var data = JSON.parse(decodeURIComponent(escape(atob(share))));
        if (data.v === 1 && data.meals) return data;
        return null;
      } catch (_unused3) {
        return null;
      }
    }),
    _useState80 = _slicedToArray(_useState79, 2),
    sharedData = _useState80[0],
    setSharedData = _useState80[1];
  function toggleFav(id) {
    setFavorites(function (prev) {
      return prev.includes(id) ? prev.filter(function (x) {
        return x !== id;
      }) : [].concat(_toConsumableArray(prev), [id]);
    });
  }
  var isFav = function isFav(id) {
    return favorites.includes(id);
  };
  function toggleProductFavorite(id) {
    setProductFavorites(function (prev) {
      return toggleProductId(prev, id);
    });
  }
  function isProductFavorite(id) {
    return (Array.isArray(productFavorites) ? productFavorites : []).includes(id);
  }
  function rememberedProductGrams(id) {
    var value = parseFloat(productGrams && productGrams[id]);
    return Number.isFinite(value) && value > 0 ? rGram(value) : 100;
  }
  function selectPlannerProduct(product) {
    if (!product) return;
    setSelP(product.id);
    setSelG(String(rememberedProductGrams(product.id)));
    setModalProdSearch(product.name + (product.state ? " (" + product.state + ")" : product.brand && product.brand !== "—" ? " (" + product.brand + ")" : ""));
  }
  function rememberProductUse(id, grams) {
    if (!id) return;
    var amount = parseFloat(grams);
    setRecentProducts(function (prev) {
      return nextRecentProductIds(prev, id);
    });
    if (Number.isFinite(amount) && amount > 0) setProductGrams(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, id, rGram(amount)));
    });
  }
  var todayDayType = dayTypes[TODAY] || "training";
  var todayDayMul = (DAY_TYPES.find(function (d) {
    return d.key === todayDayType;
  }) || DAY_TYPES[0]).mul;
  var TARGETS = calcTargets(profile, todayDayMul);
  var _useState81 = useState(0),
    _useState82 = _slicedToArray(_useState81, 2),
    weekOffset = _useState82[0],
    setWeekOffset = _useState82[1];

  var _useState181 = useState(function () {
      return TODAY;
    }),
    _useState182 = _slicedToArray(_useState181, 2),
    selectedDay = _useState182[0],
    setSelectedDay = _useState182[1];

  var week = useMemo(function () {
    return getWeek(weekOffset);
  }, [weekOffset]);

  var selectedDate = week.find(function (d) {
    return mfISODate(d) === selectedDay;
  }) || week[0];

  var selectedKey = mfISODate(selectedDate);
  var todayMeals = planer[TODAY] || [];
  var eaten = sumMealNutrition(todayMeals, products);
  var periodNutrition = nutritionPeriodSummary(planer, products, TODAY, nutritionPeriodDays, profile, dayTypes);
  var pct = Math.round(eaten.kcal / TARGETS.kcal * 100);
  var pctBar = Math.min(pct, 100);
  var inp = {
    width: "100%",
    background: T.surf2,
    border: "1px solid " + T.border,
    borderRadius: 14,
    color: T.text,
    padding: "12px 14px",
    fontFamily: "inherit",
    fontSize: 16,
    minHeight: 46,
    outline: "none",
    boxSizing: "border-box"
  };
  var btnA = {
    background: "linear-gradient(135deg, " + T.acc + ", " + T.acc2 + ")",
    color: safeTn === "light" ? "#fff" : "#000",
    border: "1px solid " + T.acc,
    borderRadius: 14,
    padding: "11px 16px",
    fontWeight: 700,
    fontSize: 14,
    minHeight: 44,
    cursor: "pointer",
    boxShadow: "0 10px 24px " + T.acc + "22"
  };
  var btnB = {
    background: T.surf2,
    border: "1px solid " + T.border,
    borderRadius: 14,
    color: T.text,
    padding: "11px 16px",
    fontSize: 14,
    minHeight: 44,
    cursor: "pointer"
  };

  // recipeM — bezpieczna wersja, nigdy nie crashuje
  function recipeM(r) {
    var _r$ingredients$;
    if (!r) return {
      kcal: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };
    if (r.ingredients && r.ingredients.length > 0 && (_r$ingredients$ = r.ingredients[0]) !== null && _r$ingredients$ !== void 0 && _r$ingredients$.productId) {
      return calcMacro(r.ingredients, products);
    }
    return {
      kcal: r.kcal || 0,
      protein: r.protein || 0,
      carbs: r.carbs || 0,
      fat: r.fat || 0
    };
  }
  function setRecipeVariant(id, portions, items, extra) {
    var key = String(id);
    setRecipeVariants(function (prev) {
      var next = _objectSpread({}, prev);
      next[key] = _objectSpread(_objectSpread(_objectSpread({}, prev[key] || {}), {}, {
        portions: portions,
        items: (items || []).map(function (item) {
          return _objectSpread({}, item);
        })
      }), extra || {});
      return next;
    });
  }
  function changeRecipePortions(r, currentPortions, currentItems, nextPortions) {
    var oldPortions = Math.max(0.1, parseFloat(currentPortions) || 1);
    var rawPortions = parseFloat(nextPortions);
    var portions = Math.min(12, Math.max(0.1, Math.round((rawPortions || 0.1) * 20) / 20));
    var factor = portions / oldPortions;
    var items = (currentItems || []).map(function (item) {
      return _objectSpread(_objectSpread({}, item), {}, {
        grams: rGram((parseFloat(item.grams) || 0) * factor)
      });
    });
    setScales(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, r.id, portions));
    });
    setRecipeVariant(r.id, portions, items, {
      targetGrams: "",
      targetKcal: "",
      targetProtein: ""
    });
  }
  function changeRecipeIngredient(r, portions, currentItems, index, value) {
    var grams = value === "" ? "" : Math.max(0, parseFloat(value) || 0);
    var items = (currentItems || []).map(function (item, itemIndex) {
      return itemIndex === index ? _objectSpread(_objectSpread({}, item), {}, {
        grams: grams
      }) : _objectSpread({}, item);
    });
    setRecipeVariant(r.id, portions, items, {
      targetGrams: "",
      targetKcal: "",
      targetProtein: ""
    });
  }
  function setRecipeTarget(r, portions, currentItems, field, value) {
    var targets = {
      targetGrams: "",
      targetKcal: "",
      targetProtein: ""
    };
    targets[field] = value;
    setRecipeVariant(r.id, portions, currentItems, targets);
  }
  function applyRecipeTarget(r, portions, currentItems, kind, value) {
    var target = parseFloat(value);
    var macro = calcMacro(currentItems, products);
    var totalGrams = (currentItems || []).reduce(function (sum, item) {
      return sum + (parseFloat(item.grams) || 0);
    }, 0);
    var current = kind === "targetGrams" ? totalGrams : kind === "targetKcal" ? macro.kcal : macro.protein;
    var minimum = kind === "targetProtein" ? 1 : 10;
    var maximum = kind === "targetProtein" ? 1000 : 20000;
    if (!target || target < minimum || target > maximum) {
      toast_(kind === "targetProtein" ? "Podaj białko od 1 do 1000 g" : "Podaj wartość od 10 do 20000");
      return;
    }
    if (!current || current <= 0) {
      toast_("Nie można przeliczyć tego przepisu");
      return;
    }
    var factor = target / current;
    if (factor < 0.05 || factor > 20) {
      toast_("Zmiana jest zbyt duża — sprawdź wartość");
      return;
    }
    var items = (currentItems || []).map(function (item) {
      return _objectSpread(_objectSpread({}, item), {}, {
        grams: rGram((parseFloat(item.grams) || 0) * factor)
      });
    });
    var targets = {
      targetGrams: "",
      targetKcal: "",
      targetProtein: ""
    };
    targets[kind] = String(target);
    setRecipeVariant(r.id, portions, items, targets);
    toast_("Przeliczono proporcjonalnie");
  }
  function resetRecipeVariant(r) {
    setRecipeVariants(function (prev) {
      var next = _objectSpread({}, prev);
      delete next[String(r.id)];
      return next;
    });
    setScales(function (prev) {
      var next = _objectSpread({}, prev);
      delete next[r.id];
      return next;
    });
    toast_("Przywrócono oryginalny przepis");
  }
  function changeSelectedRecipePortions(value) {
    var oldPortions = Math.max(0.1, parseFloat(selRPortions) || 1);
    var nextPortions = parseFloat(value);
    if (Array.isArray(selRItems) && selRItems.length && nextPortions > 0) {
      var factor = nextPortions / oldPortions;
      setSelRItems(function (items) {
        return (items || []).map(function (item) {
          return _objectSpread(_objectSpread({}, item), {}, {
            grams: rGram((parseFloat(item.grams) || 0) * factor)
          });
        });
      });
    }
    setSelRPortions(value);
  }

  // NAPRAWIONE: addProd z porą dnia
  function addProd() {
    if (!selP) {
      toast_("Wybierz produkt");
      return;
    }
    var g = parseFloat(selG) || 100;
    var p = products.find(function (x) {
      return x.id === selP;
    });
    if (!p) {
      toast_("Nie znaleziono produktu");
      return;
    }
    var f = g / 100;
    var meal = {
      id: Date.now(),
      type: "product",
      sourceId: selP,
      mealTime: addMealTime,
      name: p.name,
      grams: g,
      kcal: Math.round(p.kcal * f),
      protein: r2(p.protein * f),
      carbs: r2(p.carbs * f),
      fat: r2(p.fat * f),
      sugars: scaledNutritionDetails(p, f).sugars,
      fiber: scaledNutritionDetails(p, f).fiber,
      saturatedFat: scaledNutritionDetails(p, f).saturatedFat,
      salt: scaledNutritionDetails(p, f).salt,
      items: [{
        productId: selP,
        grams: g
      }]
    };
    setPlaner(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, addDay, [].concat(_toConsumableArray(prev[addDay] || []), [meal])));
    });
    rememberProductUse(selP, g);
    setModal(null);
    toast_("✅ Dodano do planera!");
  }

  // NAPRAWIONE: addRecipe z porą dnia
  function addRecipe() {
    if (!selRId) {
      toast_("Wybierz przepis");
      return;
    }
    var rid = String(selRId);
    var r = recipes.find(function (x) {
      return String(x.id) === rid;
    });
    if (!r) {
      toast_("Nie znaleziono przepisu");
      return;
    }
    var portions = Math.max(0.1, parseFloat(selRPortions) || 1);
    var factor = portions / Math.max(0.1, parseFloat(r.servings) || 1);
    var sourceItems = Array.isArray(selRItems) && selRItems.length ? selRItems : r.ingredients || [];
    var customItemsSelected = Array.isArray(selRItems) && selRItems.length;
    var scaledItems = sourceItems.map(function (item) {
      return _objectSpread(_objectSpread({}, item), {}, {
        grams: customItemsSelected ? rGram(parseFloat(item.grams) || 0) : rGram((parseFloat(item.grams) || 0) * factor)
      });
    });
    var mealMacro = calcMacro(scaledItems, products);
    var meal = {
      id: Date.now(),
      type: "recipe",
      sourceId: r.id,
      mealTime: selRMealTime,
      name: r.name,
      portions: portions,
      kcal: Math.round(mealMacro.kcal),
      protein: r2(mealMacro.protein),
      carbs: r2(mealMacro.carbs),
      fat: r2(mealMacro.fat),
      sugars: mealMacro.sugars === null ? null : r2(mealMacro.sugars),
      fiber: mealMacro.fiber === null ? null : r2(mealMacro.fiber),
      saturatedFat: mealMacro.saturatedFat === null ? null : r2(mealMacro.saturatedFat),
      salt: mealMacro.salt === null ? null : r2(mealMacro.salt),
      items: scaledItems
    };
    setPlaner(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, selRDay, [].concat(_toConsumableArray(prev[selRDay] || []), [meal])));
    });
    setSelRItems(null);
    setModal(null);
    toast_("✅ Dodano do planera!");
  }

  // Dodaj przepis z scalonego modalu (używa addDay/addMealTime)
  function addRecipeFromMeal() {
    if (!selRId) {
      toast_("Wybierz przepis");
      return;
    }
    var rid = String(selRId);
    var r = recipes.find(function (x) {
      return String(x.id) === rid;
    });
    if (!r) {
      toast_("Nie znaleziono przepisu");
      return;
    }
    var portions = Math.max(0.1, parseFloat(selRPortions) || 1);
    var factor = portions / Math.max(0.1, parseFloat(r.servings) || 1);
    var sourceItems = Array.isArray(selRItems) && selRItems.length ? selRItems : r.ingredients || [];
    var customItemsSelected = Array.isArray(selRItems) && selRItems.length;
    var scaledItems = sourceItems.map(function (item) {
      return _objectSpread(_objectSpread({}, item), {}, {
        grams: customItemsSelected ? rGram(parseFloat(item.grams) || 0) : rGram((parseFloat(item.grams) || 0) * factor)
      });
    });
    var mealMacro = calcMacro(scaledItems, products);
    var meal = {
      id: Date.now(),
      type: "recipe",
      sourceId: r.id,
      mealTime: addMealTime,
      name: r.name,
      portions: portions,
      kcal: Math.round(mealMacro.kcal),
      protein: r2(mealMacro.protein),
      carbs: r2(mealMacro.carbs),
      fat: r2(mealMacro.fat),
      sugars: mealMacro.sugars === null ? null : r2(mealMacro.sugars),
      fiber: mealMacro.fiber === null ? null : r2(mealMacro.fiber),
      saturatedFat: mealMacro.saturatedFat === null ? null : r2(mealMacro.saturatedFat),
      salt: mealMacro.salt === null ? null : r2(mealMacro.salt),
      items: scaledItems
    };
    setPlaner(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, addDay, [].concat(_toConsumableArray(prev[addDay] || []), [meal])));
    });
    setSelRItems(null);
    setModal(null);
    toast_("✅ Dodano do planera!");
  }
  function removeMeal(key, id) {
    setPlaner(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, key, (prev[key] || []).filter(function (m) {
        return m.id !== id;
      })));
    });
  }
  function openEM(key, meal) {
    setEmKey(key);
    setEmId(meal.id);
    setEmItems(_toConsumableArray(meal.items || []));
    setModal("editMeal");
  }
  function saveEM() {
    if (!emItems.length) {
      toast_("Brak składników");
      return;
    }
    var m = calcMacro(emItems, products);
    var editedMeal = (planer[emKey] || []).find(function (meal) {
      return meal.id === emId;
    });
    setPlaner(function (prev) {
      var day = _toConsumableArray(prev[emKey] || []);
      var idx = day.findIndex(function (x) {
        return x.id === emId;
      });
      if (idx < 0) return prev;
      day[idx] = _objectSpread(_objectSpread({}, day[idx]), {}, {
        items: emItems,
        grams: day[idx].type === "product" && emItems.length === 1 ? rGram(parseFloat(emItems[0].grams) || 0) : day[idx].grams,
        kcal: Math.round(m.kcal),
        protein: r2(m.protein),
        carbs: r2(m.carbs),
        fat: r2(m.fat),
        sugars: m.sugars === null ? null : r2(m.sugars),
        fiber: m.fiber === null ? null : r2(m.fiber),
        saturatedFat: m.saturatedFat === null ? null : r2(m.saturatedFat),
        salt: m.salt === null ? null : r2(m.salt)
      });
      return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, emKey, day));
    });
    if (editedMeal && editedMeal.type === "product" && emItems.length === 1) {
      rememberProductUse(editedMeal.sourceId || emItems[0].productId, emItems[0].grams);
    }
    setModal(null);
    toast_("Zapisano!");
  }
  function openCopyMeal(dayKey, meal) {
    var visibleDays = week.map(mfISODate);
    var preferredDay = dayKey !== TODAY && visibleDays.includes(TODAY) ? TODAY : mfShiftISO(dayKey, 1);
    if (!visibleDays.includes(preferredDay) || preferredDay === dayKey) {
      preferredDay = mfShiftISO(dayKey, -1);
    }
    if (!visibleDays.includes(preferredDay) || preferredDay === dayKey) {
      preferredDay = visibleDays.find(function (key) {
        return key !== dayKey;
      }) || dayKey;
    }
    setCopyMealSource({
      day: dayKey,
      meal: meal
    });
    setCopyMealTo(preferredDay);
    setCopyMealTime(meal.mealTime || "sniadanie");
    setModal("copyMeal");
  }
  function copySingleMeal() {
    if (!copyMealSource || !copyMealSource.meal) return;
    if (!copyMealTo) {
      toast_("Wybierz dzień docelowy");
      return;
    }
    var candidate = clonePlannedMeal(copyMealSource.meal, {
      mealTime: copyMealTime
    });
    var target = planer[copyMealTo] || [];
    if (target.some(function (meal) {
      return plannedMealCopyKey(meal) === plannedMealCopyKey(candidate);
    })) {
      toast_("Ten posiłek już jest w wybranym dniu");
      return;
    }
    setPlaner(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, copyMealTo, [].concat(_toConsumableArray(prev[copyMealTo] || []), [candidate])));
    });
    setModal(null);
    setCopyMealSource(null);
    toast_("Skopiowano posiłek!");
  }
  function copyDay() {
    if (cpFrom === cpTo) {
      toast_("Wybierz inne dni!");
      return;
    }
    var src = planer[cpFrom] || [];
    if (!src.length) {
      toast_("Brak posiłków");
      return;
    }
    var target = planer[cpTo] || [];
    var existingKeys = new Set(target.map(plannedMealCopyKey));
    var toCopy = src.filter(function (meal) {
      return !existingKeys.has(plannedMealCopyKey(meal));
    });
    var skipped = src.length - toCopy.length;
    if (!toCopy.length) {
      toast_("Ten dzień ma już wszystkie kopiowane posiłki");
      return;
    }
    setPlaner(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, cpTo, [].concat(_toConsumableArray(prev[cpTo] || []), _toConsumableArray(toCopy.map(function (meal) {
        return clonePlannedMeal(meal);
      })))));
    });
    toast_(skipped ? "Skopiowano " + toCopy.length + ", pominięto " + skipped + " duplikatów" : "Skopiowano cały dzień!");
    setModal(null);
  }
  var _useState83 = useState(false),
    _useState84 = _slicedToArray(_useState83, 2),
    addRecipeToPlaner = _useState84[0],
    setAddRecipeToPlaner = _useState84[1];
  function openNR() {
    setEditRId(null);
    setRf({
      name: "",
      emoji: "",
      cat: "slodkie",
      servings: "1",
      finishedWeight: "",
      steps: ""
    });
    setBItems([]);
    setSelRPortions("1");
    setSelRItems(null);
    setAddRecipeToPlaner(false);
    setModal("recipe");
  }
  function openNRFromPlaner() {
    setEditRId(null);
    setRf({
      name: "",
      emoji: "",
      cat: "slodkie",
      servings: "1",
      finishedWeight: "",
      steps: ""
    });
    setBItems([]);
    setSelRPortions("1");
    setSelRItems(null);
    setAddRecipeToPlaner(true);
    setModal("recipe");
  }
  function openER(r) {
    var _r$ingredients$2;
    setEditRId(r.id);
    setRf({
      name: r.name,
      emoji: r.emoji || "",
      cat: r.cat,
      servings: String(r.servings),
      finishedWeight: r.finishedWeight ? String(r.finishedWeight) : "",
      steps: (r.steps || []).join("\n")
    });
    setBItems(r.ingredients && (_r$ingredients$2 = r.ingredients[0]) !== null && _r$ingredients$2 !== void 0 && _r$ingredients$2.productId ? _toConsumableArray(r.ingredients) : []);
    setAddRecipeToPlaner(false);
    setModal("recipe");
  }
  function saveRecipe() {
    if (!rf.name.trim()) {
      toast_("Podaj nazwę");
      return;
    }
    if (!bItems.length) {
      toast_("Dodaj składnik");
      return;
    }
    var m = calcMacro(bItems, products);
    var newId = editRId || Date.now();
    var r = {
      id: newId,
      name: rf.name.trim(),
      emoji: rf.emoji || "",
      cat: rf.cat,
      servings: parseInt(rf.servings) || 1,
      finishedWeight: parseFloat(rf.finishedWeight) > 0 ? r2(parseFloat(rf.finishedWeight)) : "",
      kcal: Math.round(m.kcal),
      protein: r2(m.protein),
      carbs: r2(m.carbs),
      fat: r2(m.fat),
      sugars: m.sugars === null ? null : r2(m.sugars),
      fiber: m.fiber === null ? null : r2(m.fiber),
      saturatedFat: m.saturatedFat === null ? null : r2(m.saturatedFat),
      salt: m.salt === null ? null : r2(m.salt),
      ingredients: _toConsumableArray(bItems),
      steps: rf.steps.split("\n").filter(function (s) {
        return s.trim();
      }),
      source: editRId && isBaseRecipeId(editRId) ? "user-override" : "user",
      custom: true,
      overridden: !!(editRId && isBaseRecipeId(editRId))
    };
    if (editRId) {
      setRecipes(function (prev) {
        return prev.map(function (x) {
          return x.id === editRId ? r : x;
        });
      });
      setRecipeVariants(function (prev) {
        var next = _objectSpread({}, prev);
        delete next[String(editRId)];
        return next;
      });
      setScales(function (prev) {
        var next = _objectSpread({}, prev);
        delete next[editRId];
        return next;
      });
    } else {
      setRecipes(function (prev) {
        return [r].concat(_toConsumableArray(prev));
      });
    }
    // Jeśli otwarto z planera — od razu dodaj do planera
    if (addRecipeToPlaner && !editRId) {
      var portions = 1;
      var factor = portions / Math.max(1, r.servings);
      var meal = {
        id: Date.now() + 1,
        type: "recipe",
        sourceId: newId,
        mealTime: addMealTime,
        name: r.name,
        portions: portions,
        kcal: Math.round(m.kcal * factor),
        protein: r2(m.protein * factor),
        carbs: r2(m.carbs * factor),
        fat: r2(m.fat * factor),
        sugars: m.sugars === null ? null : r2(m.sugars * factor),
        fiber: m.fiber === null ? null : r2(m.fiber * factor),
        saturatedFat: m.saturatedFat === null ? null : r2(m.saturatedFat * factor),
        salt: m.salt === null ? null : r2(m.salt * factor),
        items: bItems.map(function (item) {
          return _objectSpread(_objectSpread({}, item), {}, {
            grams: rGram((parseFloat(item.grams) || 0) * factor)
          });
        })
      };
      setPlaner(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, addDay, [].concat(_toConsumableArray(prev[addDay] || []), [meal])));
      });
      toast_("Zapisano i dodano do planera!");
    } else {
      toast_(editRId ? "Zaktualizowano!" : "Zapisano!");
    }
    setModal(null);
  }
  function removeRecipe(r) {
    if (!r || !window.confirm("Usunąć przepis „" + r.name + "”?")) return;
    if (isBaseRecipeId(r.id)) {
      setHiddenRecipes(function (prev) {
        var ids = Array.isArray(prev) ? prev.map(String) : [];
        return ids.includes(String(r.id)) ? ids : ids.concat([String(r.id)]);
      });
      setStoredRecipes(function (prev) {
        return (Array.isArray(prev) ? prev : []).filter(function (item) {
          return String(item.id) !== String(r.id);
        });
      });
    } else {
      setRecipes(function (prev) {
        return prev.filter(function (item) {
          return String(item.id) !== String(r.id);
        });
      });
    }
    setFavorites(function (prev) {
      return (Array.isArray(prev) ? prev : []).filter(function (id) {
        return String(id) !== String(r.id);
      });
    });
    setRecipeVariants(function (prev) {
      var next = _objectSpread({}, prev);
      delete next[String(r.id)];
      return next;
    });
    setScales(function (prev) {
      var next = _objectSpread({}, prev);
      delete next[r.id];
      return next;
    });
    setExpanded(null);
    toast_("Usunięto przepis");
  }
  function lookupBarcode(value) {
    var ean = normalizeBarcode(value);
    setLastScanEan(ean);
    setScanError("");
    setScanResult(null);
    if (!isValidGtin(ean)) {
      setScanLoading(false);
      setScanError("Kod EAN/GTIN jest nieprawidłowy. Sprawdź cyfry pod kodem kreskowym.");
      return;
    }
    setScanLoading(true);
    var existing = findProductByBarcode(products, ean);
    if (existing) {
      setScanResult(_objectSpread(_objectSpread({}, existing), {}, {
        ean: ean,
        source: "local"
      }));
      setScanLoading(false);
      return;
    }
    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timeoutId = setTimeout(function () {
      if (controller) controller.abort();
    }, 10000);
    fetch("https://world.openfoodfacts.org/api/v3.6/product/" + encodeURIComponent(ean) + ".json", controller ? {
      signal: controller.signal
    } : undefined).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    }).then(function (data) {
      if (!data || data.status !== "success" || !data.product) {
        setScanError("Nie znaleziono produktu. Możesz dodać go ręcznie z tym kodem.");
        return;
      }
      var product = data.product;
      var nutrients = product.nutriments || {};
      function nutrient(value) {
        var parsed = parseFloat(value);
        return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
      }
      function optionalNutrient(value) {
        return optionalNutritionNumber(value);
      }
      var kcal = nutrient(nutrients["energy-kcal_100g"]);
      if (!kcal) kcal = nutrient(nutrients.energy_100g) / 4.184;
      var salt = optionalNutrient(nutrients.salt_100g);
      var sodium = optionalNutrient(nutrients.sodium_100g);
      if (salt === null && sodium !== null) salt = sodium * 2.5;
      setScanResult({
        name: product.product_name_pl || product.product_name || "Produkt " + ean,
        brand: product.brands || "",
        kcal: Math.round(kcal || 0),
        protein: r2(nutrient(nutrients.proteins_100g)),
        carbs: r2(nutrient(nutrients.carbohydrates_100g)),
        fat: r2(nutrient(nutrients.fat_100g)),
        sugars: optionalNutrient(nutrients.sugars_100g) === null ? null : r2(optionalNutrient(nutrients.sugars_100g)),
        fiber: optionalNutrient(nutrients.fiber_100g) === null ? null : r2(optionalNutrient(nutrients.fiber_100g)),
        saturatedFat: optionalNutrient(nutrients["saturated-fat_100g"]) === null ? null : r2(optionalNutrient(nutrients["saturated-fat_100g"])),
        salt: salt === null ? null : r2(salt),
        packageSize: nutrient(product.product_quantity) || null,
        ean: ean,
        source: "openfoodfacts",
        nutritionSource: "Open Food Facts",
        lastVerified: mfISODate(new Date())
      });
    }).catch(function (error) {
      setScanError(error && error.name === "AbortError" ? "Wyszukiwanie trwało zbyt długo. Spróbuj ponownie lub dodaj produkt ręcznie." : "Brak połączenia z bazą produktów. Spróbuj ponownie lub dodaj produkt ręcznie.");
    }).finally(function () {
      clearTimeout(timeoutId);
      setScanLoading(false);
    });
  }
  function acceptScanResult() {
    if (!scanResult) return;
    // Produkt markowy rozpoznajemy po EAN. Sama nazwa może być taka sama jak produkt bazowy MatFit.
    var scanEan = normalizeBarcode(scanResult.ean);
    var dup = findDuplicateProduct(products, scanResult);
    if (dup) {
      selectPlannerProduct(dup);
      setModal("addProd");
      toast_("Produkt już w bazie!");
      return;
    }
    // Dodaj do bazy i od razu zaznacz
    var newProd = _objectSpread(_objectSpread({}, scanResult), {}, {
      id: "u" + Date.now(),
      emoji: "🛒",
      ean: scanEan || null,
      custom: true
    });
    setProducts(function (prev) {
      return [newProd].concat(_toConsumableArray(prev));
    });
    setSelP(newProd.id);
    setSelG("100");
    setModalProdSearch(newProd.name);
    setModal("addProd");
    toast_("Dodano do bazy!");
  }
  function openManualScannedProduct(result) {
    var source = result || {};
    setPf({
      name: source.name || "",
      emoji: source.emoji || "🛒",
      brand: source.brand || "",
      ean: normalizeBarcode(source.ean || lastScanEan),
      kcal: source.kcal === undefined ? "" : source.kcal,
      protein: source.protein === undefined ? "" : source.protein,
      carbs: source.carbs === undefined ? "" : source.carbs,
      fat: source.fat === undefined ? "" : source.fat,
      sugars: source.sugars === null || source.sugars === undefined ? "" : source.sugars,
      fiber: source.fiber === null || source.fiber === undefined ? "" : source.fiber,
      saturatedFat: source.saturatedFat === null || source.saturatedFat === undefined ? "" : source.saturatedFat,
      salt: source.salt === null || source.salt === undefined ? "" : source.salt,
      packageSize: source.packageSize || ""
    });
    setScanResult(null);
    setScanError("");
    setModal("newProdFromPlanner");
  }
  function saveProd() {
    if (!pf.name.trim()) {
      toast_("Podaj nazwę");
      return;
    }
    var normalizedEan = normalizeBarcode(pf.ean);
    if (normalizedEan && !isValidGtin(normalizedEan)) {
      toast_("Kod EAN/GTIN jest nieprawidłowy");
      return;
    }
    if (normalizedEan && findProductByBarcode(products, normalizedEan)) {
      toast_("Produkt z tym kodem już istnieje");
      return;
    }
    var optionalValues = NUTRITION_DETAIL_FIELDS.reduce(function (values, field) {
      values[field.key] = optionalNutritionNumber(pf[field.key]);
      return values;
    }, {});
    var hasInvalidOptional = NUTRITION_DETAIL_FIELDS.some(function (field) {
      return pf[field.key] !== "" && optionalValues[field.key] === null;
    });
    if (hasInvalidOptional) {
      toast_("Szczegółowe wartości muszą być liczbą równą lub większą od zera");
      return;
    }
    var carbs = parseFloat(pf.carbs) || 0;
    var fat = parseFloat(pf.fat) || 0;
    if (optionalValues.sugars !== null && optionalValues.sugars > carbs) {
      toast_("Cukry nie mogą być większe niż wszystkie węglowodany");
      return;
    }
    if (optionalValues.saturatedFat !== null && optionalValues.saturatedFat > fat) {
      toast_("Tłuszcze nasycone nie mogą być większe niż wszystkie tłuszcze");
      return;
    }
    var returnToPlanner = modal === "newProdFromPlanner";
    var newProd = _objectSpread(_objectSpread({}, pf), {}, {
      id: "u" + Date.now(),
      name: pf.name.trim(),
      brand: (pf.brand || "").trim(),
      ean: normalizedEan || null,
      kcal: parseFloat(pf.kcal) || 0,
      protein: parseFloat(pf.protein) || 0,
      carbs: carbs,
      fat: fat,
      sugars: optionalValues.sugars,
      fiber: optionalValues.fiber,
      saturatedFat: optionalValues.saturatedFat,
      salt: optionalValues.salt,
      packageSize: parseFloat(pf.packageSize) || null,
      nutritionSource: "Dane użytkownika / etykieta",
      lastVerified: TODAY,
      custom: true
    });
    setProducts(function (prev) {
      return [newProd].concat(_toConsumableArray(prev));
    });
    setPf({
      name: "",
      emoji: "",
      brand: "",
      ean: "",
      kcal: "",
      protein: "",
      carbs: "",
      fat: "",
      sugars: "",
      fiber: "",
      saturatedFat: "",
      salt: "",
      packageSize: ""
    });
    if (returnToPlanner) {
      setSelP(newProd.id);
      setSelG("100");
      setModalProdSearch(newProd.name + (newProd.brand ? " (" + newProd.brand + ")" : ""));
      setModal("addProd");
      toast_("Dodano do bazy — ustaw gramaturę");
    } else {
      setModal(null);
      toast_("Dodano!");
    }
  }
  function getIngMap(days) {
    var map = {};
    for (var dayIndex = 0; dayIndex < days; dayIndex++) {
      var dayKey = mfShiftISO(selectedDay || TODAY, dayIndex);
      (planer[dayKey] || []).forEach(function (m) {
        (m.items || []).forEach(function (item) {
          var p = products.find(function (x) {
            return x.id === item.productId;
          });
          if (!p) return;
          if (!map[p.id]) map[p.id] = {
            name: p.name,
            qty: 0,
            packageSize: p.packageSize || null
          };
          map[p.id].qty += item.grams;
        });
      });
    }
    return Object.entries(map);
  }
  function exportZ() {
    var items = getIngMap(zDays);
    if (!items.length) {
      toast_("Brak posiłków");
      return;
    }
    var text = ["LISTA ZAKUPÓW MatFit Pro", "Na " + zDays + (zDays === 1 ? " dzień" : " dni"), "---"].concat(_toConsumableArray(items.map(function (_ref10) {
      var _ref11 = _slicedToArray(_ref10, 2),
        id = _ref11[0],
        _ref11$ = _ref11[1],
        name = _ref11$.name,
        qty = _ref11$.qty;
      return (zChecked[id] ? "[x]" : "[ ]") + " " + name + " - " + Math.round(qty) + "g";
    })), ["---", new Date().toLocaleDateString("pl-PL")]).join("\n");
    navigator.clipboard && navigator.clipboard.writeText(text).then(function () {
      return toast_("Skopiowano!");
    });
  }
  function currentBackupSnapshot() {
    return createBackupData({
      theme: safeTn,
      profile: profile,
      planer: planer,
      recipes: onlyStoredRecipes(storedRecipes),
      hiddenRecipes: hiddenRecipes,
      products: onlyUserProducts(storedProducts, PRODUCTS_DEFAULT),
      favorites: favorites,
      productFavorites: productFavorites,
      recentProducts: recentProducts,
      productGrams: productGrams,
      dayTypes: dayTypes,
      bodyLog: bodyLog,
      waterLog: waterLog,
      waterSettings: waterSettings,
      shoppingChecked: zChecked
    });
  }
  function exportData() {
    var data = currentBackupSnapshot();
    var json = JSON.stringify(data, null, 2);
    var filename = "matfit_backup_" + TODAY + ".json";
    downloadJson(json, filename);
  }
  function downloadJson(json, filename) {
    var showToast = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var blob = new Blob([json], {
      type: "application/json"
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () {
      return URL.revokeObjectURL(url);
    }, 1000);
    if (showToast) toast_("Pełna kopia została zapisana");
  }
  function importData(e) {
    var _e$target$files;
    var file = (_e$target$files = e.target.files) === null || _e$target$files === void 0 ? void 0 : _e$target$files[0];
    if (!file) return;
    e.target.value = "";
    if (file.size > MAX_BACKUP_FILE_BYTES) {
      toast_("Kopia może mieć maksymalnie 15 MB");
      return;
    }
    var reader = new FileReader();
    reader.onload = function (ev) {
      try {
        var normalized = parseBackupJson(ev.target.result, {
          validThemes: Object.keys(THEMES),
          filterRecipes: onlyStoredRecipes,
          filterProducts: function filterProducts(records) {
            return onlyUserProducts(records, PRODUCTS_DEFAULT);
          }
        });
        setPendingBackup(_objectSpread(_objectSpread({}, normalized), {}, {
          filename: file.name
        }));
        setModal("restoreBackup");
      } catch (error) {
        toast_(error && error.message ? error.message : "Nie udało się odczytać kopii");
      }
    };
    reader.onerror = function () {
      toast_("Nie udało się odczytać pliku");
    };
    reader.readAsText(file);
  }
  function applyBackup(mode) {
    if (!pendingBackup) return;
    var incoming = pendingBackup.data;
    var present = pendingBackup.present;
    var profileDefaults = {
      weight: "",
      height: "",
      age: "",
      gender: "m",
      activity: "active",
      tdeeAdjust: 0,
      macroMode: "auto",
      macroProt: "30",
      macroFat: "25",
      macroCarb: "45",
      targetWeight: "",
      targetBf: "",
      goalStartWeight: "",
      goalStartBf: "",
      goalStartDate: "",
      tdeeManual: "",
      tdeeCalibrationAppliedAt: ""
    };
    if (mode === "replace") {
      var safetyName = "matfit_kopia_ratunkowa_" + new Date().toISOString().replace(/[:.]/g, "-") + ".json";
      downloadJson(JSON.stringify(currentBackupSnapshot(), null, 2), safetyName, false);
      setTn(incoming.theme || "royal");
      setProfile(_objectSpread(_objectSpread({}, profileDefaults), incoming.profile));
      setPlaner(incoming.planer);
      setStoredRecipes(incoming.recipes);
      setHiddenRecipes(incoming.hiddenRecipes);
      setStoredProducts(incoming.products);
      setFavorites(incoming.favorites);
      setProductFavorites(incoming.productFavorites);
      setRecentProducts(incoming.recentProducts);
      setProductGrams(incoming.productGrams);
      setDayTypes(incoming.dayTypes);
      setBodyLog(incoming.bodyLog);
      setWaterLog(incoming.waterLog);
      setWaterSettings(_objectSpread({
        manualTarget: ""
      }, incoming.waterSettings));
      setZChecked(incoming.shoppingChecked);
    } else {
      if (present.theme) setTn(incoming.theme);
      if (present.profile) setProfile(function (prev) {
        return _objectSpread(_objectSpread({}, prev), incoming.profile);
      });
      if (present.planer) setPlaner(function (prev) {
        return _objectSpread(_objectSpread({}, prev), incoming.planer);
      });
      if (present.recipes) setStoredRecipes(function (prev) {
        return mergeBackupRecords(prev, incoming.recipes);
      });
      if (present.hiddenRecipes) setHiddenRecipes(function (prev) {
        return mergeBackupIds(prev, incoming.hiddenRecipes);
      });
      if (present.products) setStoredProducts(function (prev) {
        return mergeBackupRecords(onlyUserProducts(prev, PRODUCTS_DEFAULT), incoming.products);
      });
      if (present.favorites) setFavorites(function (prev) {
        return mergeBackupIds(prev, incoming.favorites);
      });
      if (present.productFavorites) setProductFavorites(function (prev) {
        return mergeBackupIds(prev, incoming.productFavorites);
      });
      if (present.recentProducts) setRecentProducts(function (prev) {
        return mergeBackupIds(incoming.recentProducts, prev).slice(0, 8);
      });
      if (present.productGrams) setProductGrams(function (prev) {
        return _objectSpread(_objectSpread({}, prev), incoming.productGrams);
      });
      if (present.dayTypes) setDayTypes(function (prev) {
        return _objectSpread(_objectSpread({}, prev), incoming.dayTypes);
      });
      if (present.bodyLog) setBodyLog(function (prev) {
        return _objectSpread(_objectSpread({}, prev), incoming.bodyLog);
      });
      if (present.waterLog) setWaterLog(function (prev) {
        return _objectSpread(_objectSpread({}, prev), incoming.waterLog);
      });
      if (present.waterSettings) setWaterSettings(function (prev) {
        return _objectSpread(_objectSpread({}, prev), incoming.waterSettings);
      });
      if (present.shoppingChecked) setZChecked(function (prev) {
        return _objectSpread(_objectSpread({}, prev), incoming.shoppingChecked);
      });
    }
    setBackupResult({
      mode: mode,
      summary: pendingBackup.summary,
      filename: pendingBackup.filename,
      safetyCreated: mode === "replace"
    });
    setPendingBackup(null);
    setModal("backupResult");
  }
  var emMacro = calcMacro(emItems, products);
  var bMacro = calcMacro(bItems, products);
  var selectedRecipeForPlaner = recipes.find(function (recipe) {
    return String(recipe.id) === String(selRId);
  });
  var selectedRecipeFactor = selectedRecipeForPlaner ? Math.max(0.1, parseFloat(selRPortions) || 1) / Math.max(0.1, parseFloat(selectedRecipeForPlaner.servings) || 1) : 1;
  var selectedRecipeItems = Array.isArray(selRItems) && selRItems.length ? selRItems : selectedRecipeForPlaner ? (selectedRecipeForPlaner.ingredients || []).map(function (item) {
    return _objectSpread(_objectSpread({}, item), {}, {
      grams: rGram((parseFloat(item.grams) || 0) * selectedRecipeFactor)
    });
  }) : [];
  var selectedRecipeMacro = calcMacro(selectedRecipeItems, products);
  var safeProductFavorites = Array.isArray(productFavorites) ? productFavorites : [];
  var safeRecentProducts = Array.isArray(recentProducts) ? recentProducts : [];
  var favoriteProductList = safeProductFavorites.map(function (id) {
    return products.find(function (product) {
      return product.id === id;
    });
  }).filter(Boolean).slice(0, 8);
  var recentProductList = safeRecentProducts.filter(function (id) {
    return !safeProductFavorites.includes(id);
  }).map(function (id) {
    return products.find(function (product) {
      return product.id === id;
    });
  }).filter(Boolean).slice(0, 8);
  var filtProd = filterProductCatalog(products, {
    category: productCategory,
    search: prodSearch,
    favoriteIds: safeProductFavorites,
    categories: PRODUCT_CATEGORIES
  });
  var _countProductTypes = countProductTypes(products),
    userProductCount = _countProductTypes.user,
    baseProductCount = _countProductTypes.base;
  var tdee = calcTDEE(profile),
    bmr = Math.round(calcBMR(profile));
  var weeklySummary = mfWeeklySummary(planer, bodyLog, profile, dayTypes, TODAY);
  var tdeeCalibration = mfTdeeCalibration(planer, bodyLog, profile, TODAY);

  // Selektor pory dnia
  function MealTimePicker(_ref12) {
    var value = _ref12.value,
      onChange = _ref12.onChange;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 5,
        flexWrap: "wrap",
        marginBottom: 2
      }
    }, MEAL_TIMES.map(function (mt) {
      return /*#__PURE__*/React.createElement("button", {
        key: mt.key,
        type: "button",
        "aria-pressed": value === mt.key,
        onClick: function onClick() {
          return onChange(mt.key);
        },
        style: {
          padding: "6px 10px",
          borderRadius: 20,
          fontSize: 11,
          fontWeight: value === mt.key ? 700 : 400,
          cursor: "pointer",
          border: "1px solid " + (value === mt.key ? T.acc : T.border),
          background: value === mt.key ? T.acc : "transparent",
          color: value === mt.key ? safeTn === "light" ? "#fff" : "#000" : T.text2,
          whiteSpace: "nowrap"
        }
      }, mt.label);
    }));
  }
  function QuickProductRow(_refQuickProductRow) {
    var label = _refQuickProductRow.label,
      items = _refQuickProductRow.items;
    if (!items.length) return null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 5,
        color: T.text3,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: 0.7,
        textTransform: "uppercase"
      }
    }, label), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6,
        overflowX: "auto",
        paddingBottom: 4
      }
    }, items.map(function (product) {
      return /*#__PURE__*/React.createElement("button", {
        key: product.id,
        type: "button",
        onClick: function onClick() {
          return selectPlannerProduct(product);
        },
        style: {
          flex: "0 0 auto",
          maxWidth: 160,
          minHeight: 42,
          padding: "7px 9px",
          border: "1px solid " + T.border,
          borderRadius: 11,
          background: T.surf2,
          color: T.text,
          cursor: "pointer",
          textAlign: "left"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontSize: 11,
          fontWeight: 700
        }
      }, product.emoji, " ", product.name), /*#__PURE__*/React.createElement("span", {
        style: {
          display: "block",
          marginTop: 2,
          color: T.text3,
          fontSize: 9
        }
      }, rememberedProductGrams(product.id), " g · ", product.kcal, " kcal/100 g"));
    })));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "mf-shell",
    "data-theme": safeTn,
    style: {
      background: T.bg,
      minHeight: "100vh",
      color: T.text,
      fontFamily: "system-ui,sans-serif",
      maxWidth: 430,
      margin: "0 auto",
      paddingBottom: 74
    }
  }, /*#__PURE__*/React.createElement("style", null, "*{box-sizing:border-box}"), /*#__PURE__*/React.createElement("a", {
    className: "mf-skip",
    href: "#mf-main"
  }, "Przejdź do treści"), /*#__PURE__*/React.createElement("header", {
    className: "mf-topbar",
    style: {
      padding: "16px 16px 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mf-brand",
    style: {
      fontSize: 26,
      fontWeight: 900,
      letterSpacing: 2,
      color: T.acc
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mf-brand-mark",
    "aria-hidden": "true"
  }, "M"), /*#__PURE__*/React.createElement("span", {
    className: "mf-brand-copy"
  }, "MatFit ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: 1,
      color: T.text3,
      verticalAlign: "middle"
    }
  }, "PRO"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      var n = Object.keys(THEMES);
      setTn(n[(n.indexOf(tn) + 1) % n.length]);
    },
    className: "mf-theme-button",
    "aria-label": safeTn === "royal" ? "Włącz jasny motyw" : "Włącz motyw Royal",
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      padding: "8px 11px",
      fontSize: 16
    }),
    title: "Zmie\u0144 motyw"
  }, safeTn === "royal" ? "👑" : "☀️"))), /*#__PURE__*/React.createElement("section", {
    className: "mf-daily-card",
    "aria-label": "Dzisiejsza realizacja kalorii i makroskładników",
    style: {
      margin: "12px 16px 0",
      background: T.surf,
      border: "1px solid " + T.border,
      borderRadius: 14,
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: 1,
      color: T.text3
    }
  }, "Dzi\u015B"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: T.text3
    }
  }, (DAY_TYPES.find(function (d) {
    return d.key === todayDayType;
  }) || DAY_TYPES[1]).label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: T.text3
    }
  }, pct, "%"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 5,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      color: eaten.kcal > TARGETS.kcal ? "#dc2626" : T.acc,
      lineHeight: 1,
      letterSpacing: -0.5
    }
  }, Math.round(eaten.kcal)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: T.text2,
      lineHeight: 1.3
    }
  }, "/"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: T.text2,
      lineHeight: 1.3
    }
  }, TARGETS.kcal), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: T.text2,
      lineHeight: 1.3
    }
  }, "kcal")), /*#__PURE__*/React.createElement("div", {
    role: "progressbar",
    "aria-label": "Realizacja dziennego celu kalorii",
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-valuenow": pctBar,
    "aria-valuetext": pct + "% celu kalorii",
    style: {
      height: 8,
      background: T.surf2,
      borderRadius: 999,
      overflow: "hidden",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: pctBar + "%",
      background: pct > 108 ? T.acc2 : T.kcal,
      borderRadius: 3,
      transition: "width .5s"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 6
    }
  }, [["Białko", Math.round(eaten.protein), TARGETS.protein, T.prot], ["Węgle", Math.round(eaten.carbs), TARGETS.carbs, T.carbs], ["Tłuszcz", Math.round(eaten.fat), TARGETS.fat, T.fat]].map(function (_ref13) {
    var _ref14 = _slicedToArray(_ref13, 4),
      l = _ref14[0],
      v = _ref14[1],
      t = _ref14[2],
      c = _ref14[3];
    return /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        background: T.surf2,
        borderRadius: 8,
        padding: "7px 6px",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "monospace",
        fontSize: 12,
        color: c
      }
    }, v, "/", t, "g"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginTop: 2
      }
    }, l));
  })), showNutritionDetails && /*#__PURE__*/React.createElement(NutritionDetails, {
    sugars: eaten.sugars,
    fiber: eaten.fiber,
    saturatedFat: eaten.saturatedFat,
    salt: eaten.salt,
    T: T
  })), /*#__PURE__*/React.createElement("nav", {
    className: "mf-topnav",
    "aria-label": "Główna nawigacja",
    style: {
      display: "flex",
      gap: 5,
      padding: "12px 16px 0",
      overflowX: "hidden",
      justifyContent: "space-between"
    }
  }, [["profil", "Profil"], ["pomiary", "Pomiary"], ["woda", "Woda"], ["planer", "Planer"], ["przepisy", "Przepisy"], ["produkty", "Produkty"], ["zakupy", "Zakupy"]].map(function (_ref15) {
    var _ref16 = _slicedToArray(_ref15, 2),
      id = _ref16[0],
      label = _ref16[1];
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      type: "button",
      className: "mf-nav-tab",
      "aria-current": page === id ? "page" : undefined,
      onClick: function onClick() {
        return navigateToPage(id);
      },
      style: {
        flex: "1 1 0",
        minWidth: 0,
        padding: "7px 4px",
        borderRadius: 100,
        fontSize: 10,
        fontWeight: page === id ? 700 : 400,
        cursor: "pointer",
        border: "1px solid " + (page === id ? T.acc : T.border),
        background: page === id ? T.acc : "transparent",
        color: page === id ? safeTn === "light" ? "#fff" : "#000" : T.text2,
        whiteSpace: "nowrap"
      }
    }, label);
  })), /*#__PURE__*/React.createElement("main", {
    id: "mf-main",
    className: "mf-main",
    tabIndex: -1,
    style: {
      padding: "12px 16px 8px"
    }
}, page === "planer" && React.createElement(React.Fragment, null,
  React.createElement(PageHeader, {
    eyebrow: "Twój tydzień",
    title: "Planer posiłków",
    subtitle: "Zaplanuj dzień, wpisuj faktycznie zjedzone porcje i obserwuj realizację celu.",
    action: React.createElement("button", {
      type: "button",
      "aria-pressed": !!showNutritionDetails,
      onClick: function onClick() {
        return setShowNutritionDetails(!showNutritionDetails);
      },
      style: _objectSpread(_objectSpread({}, btnB), {}, {
        padding: "8px 10px",
        fontSize: 10,
        whiteSpace: "nowrap"
      })
    }, showNutritionDetails ? "Ukryj analizę" : "Analiza 7/30 dni"),
    T: T
  }),
  function () {
    var nutrition = weeklySummary.nutrition;
    var averageKcal = nutrition.avgKcal;
    var caloriePercent = averageKcal !== null && nutrition.avgTarget ? Math.round(averageKcal / nutrition.avgTarget * 100) : null;
    var weightChange = weeklySummary.weeklyWeightChange;
    var pace = weeklySummary.trend && weeklySummary.trend.weekly;
    var waistChange = weeklySummary.waistChange;
    var metricCards = [[averageKcal !== null ? Math.round(averageKcal) : "—", "Śr. kcal", nutrition.loggedDays + "/7 dni"], [caloriePercent !== null ? caloriePercent + "%" : "—", "Cel kcal", nutrition.loggedDays ? "z wpisanych dni" : "brak wpisów"], [weeklySummary.averageWeight !== null ? weeklySummary.averageWeight.toFixed(1) + " kg" : "—", "Śr. waga", weeklySummary.weightCount + " pom."], [weightChange !== null ? (weightChange > 0 ? "+" : "") + weightChange.toFixed(1) + " kg" : "—", "vs poprzednie 7 dni", weeklySummary.previousWeightCount + " pom. wcześniej"], [pace ? (pace > 0 ? "+" : "") + pace.toFixed(2) + " kg" : "—", "Tempo / tydz.", weeklySummary.trend ? weeklySummary.trend.count + " pom. / " + weeklySummary.trend.spanDays + " dni" : "min. 3 pom. / 14 dni"], [waistChange !== null ? (waistChange > 0 ? "+" : "") + waistChange.toFixed(1) + " cm" : "—", "Zmiana pasa", waistChange !== null ? "ostatni vs wcześniejszy" : "dodaj pomiar pasa"]];
    var finishText = weeklySummary.finishISO ? "Finisz przy obecnym trendzie: " + mfFormatDate(weeklySummary.finishISO) : "Ustaw cel i zbieraj pomiary, aby zobaczyć przewidywany finisz.";
    if (weeklySummary.finishISO && weeklySummary.finishShiftDays !== null) {
      var shift = weeklySummary.finishShiftDays;
      finishText += Math.abs(shift) <= 3 ? " Termin stabilny względem poprzedniego tygodnia." : shift > 0 ? " To około " + Math.abs(shift) + " dni później niż tydzień temu." : " To około " + Math.abs(shift) + " dni wcześniej niż tydzień temu.";
    }
    return React.createElement("div", {
      className: "mf-section-card",
      style: {
        background: safeTn === "light" ? "linear-gradient(145deg, #f8fbff, #eef4ff)" : "linear-gradient(145deg, " + T.surf + ", " + T.surf2 + ")",
        border: "1px solid " + T.acc + "66",
        borderRadius: 16,
        padding: 13,
        marginBottom: 12,
        boxShadow: safeTn === "light" ? "0 6px 18px rgba(37,99,235,0.09)" : "none"
      }
    }, React.createElement("div", {
      style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 9 }
    }, React.createElement("div", null, React.createElement("div", {
      style: { fontSize: 9, textTransform: "uppercase", letterSpacing: 1.2, color: T.acc, fontWeight: 800 }
    }, "AUTOMATYCZNY RAPORT"), React.createElement("div", {
      style: { fontSize: 15, fontWeight: 850, color: T.text, marginTop: 2 }
    }, "Ostatnie 7 dni")), React.createElement("span", {
      style: { fontSize: 9, color: T.text3, textAlign: "right", lineHeight: 1.4 }
    }, mfFormatShortDate(weeklySummary.from), "–", mfFormatShortDate(weeklySummary.to))), React.createElement("div", {
      style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }
    }, metricCards.map(function (metric) {
      return React.createElement("div", {
        key: metric[1],
        style: { background: T.surf, border: "1px solid " + T.border, borderRadius: 9, padding: "8px 5px", textAlign: "center", minWidth: 0 }
      }, React.createElement("div", {
        style: { fontFamily: "monospace", fontSize: 13, fontWeight: 800, color: T.text, whiteSpace: "nowrap" }
      }, metric[0]), React.createElement("div", {
        style: { fontSize: 8, color: T.text2, marginTop: 3, lineHeight: 1.25 }
      }, metric[1]), React.createElement("div", {
        style: { fontSize: 7, color: T.text3, marginTop: 2, lineHeight: 1.2 }
      }, metric[2]));
    })), React.createElement("div", {
      style: { fontSize: 9, color: T.text2, lineHeight: 1.45, marginTop: 8, padding: "7px 8px", borderRadius: 8, background: T.acc + "12" }
    }, finishText), React.createElement("div", {
      style: { marginTop: 8, borderTop: "1px solid " + T.border, paddingTop: 8 }
    }, React.createElement("div", {
      style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }
    }, React.createElement("b", {
      style: { fontSize: 10, color: T.text }
    }, "Kalibracja TDEE · minimum 28 dni"), React.createElement("span", {
      style: { fontSize: 8, color: tdeeCalibration.ready ? "#6aaa7a" : T.text3 }
    }, tdeeCalibration.cooldownDays ? "ponownie za " + tdeeCalibration.cooldownDays + " dni" : tdeeCalibration.ready ? "dane gotowe" : "zbieranie danych")), tdeeCalibration.cooldownDays ? React.createElement("div", {
      style: { fontSize: 9, color: T.text3, lineHeight: 1.45, marginTop: 5 }
    }, "Ostatnią propozycję zastosowano ", mfFormatDate(profile.tdeeCalibrationAppliedAt), ". MatFit poczeka pełne 28 dni, zanim zaproponuje następną zmianę.") : tdeeCalibration.ready ? React.createElement(React.Fragment, null, React.createElement("div", {
      style: { fontSize: 10, color: T.text2, lineHeight: 1.5, marginTop: 5 }
    }, tdeeCalibration.suggestedChange === 0 ? "Obecne TDEE " + tdeeCalibration.currentTdee + " kcal pasuje do trendu. Bez zmian." : "Szacowane TDEE z trendu: " + tdeeCalibration.observedTdee + " kcal. Bezpieczna propozycja: " + tdeeCalibration.currentTdee + " → " + tdeeCalibration.suggestedTdee + " kcal. Cel dzienny zmieni się z około " + tdeeCalibration.currentGoalKcal + " na " + tdeeCalibration.suggestedGoalKcal + " kcal."), tdeeCalibration.suggestedChange !== 0 ? React.createElement("button", {
      onClick: function onClick() {
        setProfile(_objectSpread(_objectSpread({}, profile), {}, {
          tdeeManual: String(tdeeCalibration.suggestedTdee),
          tdeeCalibrationAppliedAt: TODAY
        }));
        toast_("Zastosowano skalibrowane TDEE");
      },
      style: _objectSpread(_objectSpread({}, btnA), {}, { width: "100%", marginTop: 7, padding: "9px 10px", fontSize: 11 })
    }, "Zastosuj TDEE ", tdeeCalibration.suggestedTdee, " kcal") : null) : React.createElement("div", {
      style: { fontSize: 9, color: T.text3, lineHeight: 1.5, marginTop: 5 }
    }, "Do analizy: ", tdeeCalibration.loggedDays, "/20 dni z wpisanym jedzeniem · ", tdeeCalibration.weightCount, "/4 pomiary wagi · ", Math.min(tdeeCalibration.spanDays, 28), "/28 dni rozpiętości.", !tdeeCalibration.newDataSinceApplied ? " Potrzeba pełnych 28 dni nowych danych po ostatniej kalibracji." : tdeeCalibration.weightCount >= 4 && tdeeCalibration.spanDays >= 28 && tdeeCalibration.loggedDays >= 20 && !tdeeCalibration.stableEnough ? " Trend wagi jest jeszcze zbyt niestabilny." : "")), React.createElement("div", {
      style: { fontSize: 8, color: T.text3, lineHeight: 1.4, marginTop: 7 }
    }, "Wpis w planerze traktujemy jako faktycznie zjedzony. TDEE to całkowity wydatek energii — BMR pozostaje wyliczeniem podstawowej przemiany materii. MatFit nigdy nie zmienia celu bez Twojej zgody."));
  }(),
  showNutritionDetails && React.createElement(ExtendedNutritionReport, {
    summary: periodNutrition,
    targetKcal: TARGETS.kcal,
    periodDays: nutritionPeriodDays,
    onPeriodChange: setNutritionPeriodDays,
    T: T
  }),
  React.createElement("div", {
    style: {
      fontSize: 10,
      textTransform: "uppercase",
      letterSpacing: 2,
      color: T.text3,
      marginBottom: 1,
      textAlign: "center"
    }
  }, "TYDZIEŃ " + getWeekNumber(week[0])),

  React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3,
      marginBottom: 8,
      textAlign: "center"
    }
  },
    week[0].toLocaleDateString("pl-PL", { day: "numeric" }) +
    "\u2013" +
    week[6].toLocaleDateString("pl-PL", { day: "numeric", month: "long" })
  ),

  React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      marginBottom: 10
    }
  },
    React.createElement("button", {
      type: "button",
      "aria-label": "Poprzedni tydzień",
      onClick: function () {
        setWeekOffset(function (w) {
          return w - 1;
        });
      },
      style: {
        background: "none",
        border: "none",
        fontSize: 20,
        cursor: "pointer",
        color: T.text2,
        padding: "0 6px"
      }
    }, "\u2039"),

    week.map(function (d) {
      var k = mfISODate(d);
      var dow = d.getDay() === 0 ? 6 : d.getDay() - 1;
      var labels = ["Pn", "Wt", "\u015Ar", "Cz", "Pt", "Sb", "Nd"];
      var isSel = k === selectedDay;
      var isToday = k === TODAY;

      return React.createElement("button", {
        key: k,
        type: "button",
        "aria-label": (isToday ? "Dzisiaj, " : "") + d.toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" }),
        "aria-pressed": isSel,
        onClick: function () {
          setSelectedDay(k);
        },
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          padding: "2px 3px",
          border: "none",
          background: "transparent",
          color: "inherit",
          borderRadius: 12
        }
      },
        React.createElement("div", {
          style: {
            fontSize: 9,
            color: isSel ? T.acc : T.text3,
            fontWeight: isSel ? 700 : 400,
            marginBottom: 3
          }
        }, labels[dow]),

        React.createElement("div", {
          style: {
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: isSel ? T.acc : "transparent",
            border: "1px solid " + (isSel ? T.acc : isToday ? T.acc + "66" : T.border),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: isSel ? 700 : 400,
            color: isSel ? (tn === "light" ? "#fff" : "#000") : isToday ? T.acc : T.text2
          }
        }, d.getDate())
      );
    }),

    React.createElement("button", {
      type: "button",
      "aria-label": "Następny tydzień",
      onClick: function () {
        setWeekOffset(function (w) {
          return w + 1;
        });
      },
      style: {
        background: "none",
        border: "none",
        fontSize: 20,
        cursor: "pointer",
        color: T.text2,
        padding: "0 6px"
      }
    }, "\u203A")
  ),

  [selectedDate].map(function (d) {

    var key = mfISODate(d);
    var meals = planer[key] || [];
    var total = meals.reduce(function (a, m) {
      return a + m.kcal;
    }, 0);
    var isT = key === TODAY;
    var dow = d.getDay() === 0 ? 6 : d.getDay() - 1;
    // Grupuj posiłki wg pory dnia
    var grouped = {};
    meals.forEach(function (m) {
      var mt = m.mealTime || "sniadanie";
      if (!grouped[mt]) grouped[mt] = [];
      grouped[mt].push(m);
    });
    return /*#__PURE__*/React.createElement("div", {
      key: key,
      style: {
        background: isT && safeTn === "light" ? "linear-gradient(180deg, rgba(37,99,235,0.045), rgba(255,255,255,1))" : T.surf,
        border: "1px solid " + (isT ? T.acc : T.border),
        borderRadius: 16,
        marginBottom: 10,
        overflow: "hidden",
        boxShadow: safeTn === "light" ? (isT ? "0 6px 18px rgba(37,99,235,0.14)" : "0 3px 10px rgba(15,23,42,0.06)") : "none"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 9,
        height: 9,
        borderRadius: "50%",
        background: meals.length ? T.acc : T.border,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: 14,
        color: T.text
      }
    }, DAYS[dow], " ", isT ? "(dziś)" : ""), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text2
      }
    }, d.toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "short"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 3
      }
    }, DAY_TYPES.map(function (dt) {
      return /*#__PURE__*/React.createElement("button", {
        key: dt.key,
        type: "button",
        "aria-pressed": (dayTypes[key] || "training") === dt.key,
        "aria-label": dt.label + ": " + dt.desc,
        onClick: function onClick() {
          return setDayTypes(function (prev) {
            return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, key, dt.key));
          });
        },
        title: dt.desc,
        style: {
          padding: "4px 7px",
          borderRadius: 20,
          fontSize: 11,
          cursor: "pointer",
          border: "1px solid " + ((dayTypes[key] || "training") === dt.key ? T.acc : T.border),
          background: (dayTypes[key] || "training") === dt.key ? T.acc + "22" : "transparent",
          color: (dayTypes[key] || "training") === dt.key ? T.acc : T.text3,
          fontWeight: (dayTypes[key] || "training") === dt.key ? 700 : 400
        }
      }, dt.label.split(" ")[0]);
    })), /*#__PURE__*/React.createElement("button", {
      type: "button",
      "aria-label": "Kopiuj posiłki z tego dnia",
      onClick: function onClick() {
        setCpFrom(key);
        setCpTo(TODAY);
        setModal("copy");
      },
      title: "Kopiuj dzień",
      style: {
        background: "none",
        border: "none",
        fontSize: 14,
        cursor: "pointer",
        padding: "4px",
        color: T.text3
      }
    }, "📄"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      "aria-label": "Udostępnij podsumowanie dnia",
      onClick: function onClick() {
        return shareDay(key);
      },
      style: {
        background: "none",
        border: "none",
        fontSize: 14,
        cursor: "pointer",
        padding: "4px",
        color: T.text3
      }
    }, "\uD83D\uDCE4"), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 20,
        fontWeight: 900,
        color: T.kcal
      }
    }, total), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3
      }
    }, "kcal"))), meals.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: "1px solid " + T.border
      }
    }, MEAL_TIMES.filter(function (mt) {
      return grouped[mt.key] && grouped[mt.key].length > 0;
    }).map(function (mt) {
      var mealSectionKey = key + ":" + mt.key;
      var mealKcal = Math.round(grouped[mt.key].reduce(function (sum, m) {
        return sum + (m.kcal || 0);
      }, 0));
      var mealProtein = Math.round(grouped[mt.key].reduce(function (sum, m) {
        return sum + (m.protein || 0);
      }, 0));
      var mealCarbs = Math.round(grouped[mt.key].reduce(function (sum, m) {
        return sum + (m.carbs || 0);
      }, 0));
      var mealFat = Math.round(grouped[mt.key].reduce(function (sum, m) {
        return sum + (m.fat || 0);
      }, 0));
      var isMealCollapsed = !!collapsedMeals[mealSectionKey];
      return /*#__PURE__*/React.createElement("div", {
        key: mt.key
      }, /*#__PURE__*/React.createElement("button", {
        type: "button",
        className: "mf-meal-toggle",
        "aria-expanded": !isMealCollapsed,
        style: {
          padding: "8px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          color: T.text,
          background: T.surf2,
          cursor: "pointer",
          border: "none",
          width: "100%",
          textAlign: "left"
          },
          onClick: function onClick() {
            setCollapsedMeals(function (prev) {
              var next = Object.assign({}, prev);
              next[mealSectionKey] = !next[mealSectionKey];
              return next;
            });
          }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          fontWeight: 600
        }
      }, mt.label), /*#__PURE__*/React.createElement("span", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          fontWeight: 800,
          color: T.kcal
        }
      }, mealKcal, " kcal ", /*#__PURE__*/React.createElement("span", {
        style: {
          color: T.text2,
          fontSize: 13
        }
      }, isMealCollapsed ? "▸" : "▾"))), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: "0 14px 7px",
          fontSize: 11,
          fontWeight: 600,
          color: T.text2,
          background: T.surf2
        }
      }, "B " + mealProtein + "g • W " + mealCarbs + "g • T " + mealFat + "g"), isMealCollapsed ? null : grouped[mt.key].map(function (m) {
        var fullMealNutrition = completeMealNutrition(m, products);
        return /*#__PURE__*/React.createElement("div", {
          key: m.id,
          style: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderBottom: "1px solid " + T.border,
            minHeight: 52
          }
        }, /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "mf-meal-row-action",
          "aria-label": "Edytuj " + m.name,
          onClick: function onClick() {
            return openEM(key, m);
          },
          style: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            flex: 1,
            minWidth: 0,
            padding: "9px 0 9px 14px"
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 13,
            color: T.text
          }
        }, m.name, m.type === "product" && m.items && m.items[0] ? " · " + fmtPortions(m.items[0].grams) + "g" : m.type === "product" && m.grams ? " · " + fmtPortions(m.grams) + "g" : m.items && m.items.length > 1 ? " · " + m.items.length + " skł." : ""), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11,
            color: T.text2,
            marginTop: 2,
            fontFamily: "monospace"
          }
        }, m.kcal, " kcal  B:", m.protein, "g  W:", m.carbs, "g  T:", m.fat, "g"), showNutritionDetails && /*#__PURE__*/React.createElement(NutritionDetails, {
          sugars: fullMealNutrition.sugars,
          fiber: fullMealNutrition.fiber,
          saturatedFat: fullMealNutrition.saturatedFat,
          salt: fullMealNutrition.salt,
          T: T
        })), /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 12,
            color: T.acc
          }
        }, "Edit")), /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "mf-danger-icon",
          "aria-label": "Kopiuj " + m.name + " do innego dnia",
          onClick: function onClick() {
            return openCopyMeal(key, m);
          },
          title: "Kopiuj posiłek",
          style: {
            color: T.acc,
            cursor: "pointer",
            fontSize: 17,
            padding: "0 5px"
          }
        }, "⧉"), /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "mf-danger-icon",
          "aria-label": "Usuń " + m.name,
          onClick: function onClick() {
            removeMeal(key, m.id);
          },
          style: {
            color: T.text3,
            cursor: "pointer",
            fontSize: 18,
            padding: "0 14px"
          }
        }, "\xD7"));
      }));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "6px 12px",
        display: "flex",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setAddDay(key);
        setAddMealTime("sniadanie");
        setSelP("");
        setSelG("100");
        setSelRId("");
        setModalProdSearch("");
        setModal("addProd");
      },
      style: _objectSpread(_objectSpread({}, btnB), {}, {
        flex: 1,
        fontSize: 12,
        padding: "9px",
        background: safeTn === "light" ? "#ffffff" : T.surf2,
        borderColor: safeTn === "light" ? "#dbeafe" : T.border,
        color: safeTn === "light" ? "#0f172a" : T.text,
        fontWeight: 700
      })
    }, "+ Produkt"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setAddDay(key);
        setAddMealTime("sniadanie");
        setSelRId("");
        setSelRPortions("1");
        setSelRItems(null);
        setModalProdSearch("");
        setShowRecipeList(false);
        setModal("addRecipeSearch");
      },
      style: _objectSpread(_objectSpread({}, btnB), {}, {
        flex: 1,
        fontSize: 12,
        padding: "9px",
        background: safeTn === "light" ? "#ffffff" : T.surf2,
        borderColor: safeTn === "light" ? "#dbeafe" : T.border,
        color: safeTn === "light" ? "#0f172a" : T.text,
        fontWeight: 700
      })
    }, "+ Przepis")));
  })), page === "przepisy" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Twoja kuchnia",
    title: "Przepisy",
    subtitle: recipes.length + " w bazie · makro liczone bezpośrednio ze składników",
    action: /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: openNR,
      style: _objectSpread(_objectSpread({}, btnA), {}, {
        padding: "10px 13px",
        whiteSpace: "nowrap"
      })
    }, "+ ", /*#__PURE__*/React.createElement("span", { className: "mf-action-label" }, "Nowy przepis")),
    T: T
  }), /*#__PURE__*/React.createElement("input", {
    value: recipeSearch,
    onChange: function onChange(e) {
      return setRecipeSearch(e.target.value);
    },
    placeholder: "Szukaj przepisu...",
    "aria-label": "Szukaj przepisu",
    style: _objectSpread({}, inp)
  }), /*#__PURE__*/React.createElement("div", {
    className: "mf-chip-row",
    style: {
      display: "flex",
      gap: 6,
      overflowX: "auto",
      paddingBottom: 8,
      marginBottom: 4
    }
  }, [["all", "Wszystkie"], ["sniadanie", "Śniadanie"], ["obiad", "Obiad"], ["kolacja", "Kolacja"], ["slodkie", "Słodkie"], ["wytrawne", "Wytrawne"]].map(function (_refRecipeCategory) {
    var _refRecipeCategory2 = _slicedToArray(_refRecipeCategory, 2),
      key = _refRecipeCategory2[0],
      label = _refRecipeCategory2[1];
    var active = recipeCategory === key;
    return /*#__PURE__*/React.createElement("button", {
      key: key,
      type: "button",
      className: "mf-chip",
      "aria-pressed": active,
      onClick: function onClick() {
        return setRecipeCategory(key);
      },
      style: {
        border: "1px solid " + (active ? T.acc : T.border),
        background: active ? T.acc + "22" : T.surf,
        color: active ? T.acc : T.text2,
        borderRadius: 999,
        padding: "7px 10px",
        fontSize: 11,
        whiteSpace: "nowrap",
        cursor: "pointer"
      }
    }, label);
  })), recipes.filter(function (r) {
    var matchesCategory = recipeCategory === "all" || r.cat === recipeCategory;
    var q = recipeSearch.trim().toLowerCase();
    return matchesCategory && (!q || (r.name || "").toLowerCase().includes(q));
  }).length === 0 && /*#__PURE__*/React.createElement(EmptyState, {
    icon: "◇",
    title: "Nie znaleźliśmy takiego przepisu",
    copy: "Zmień kategorię albo skróć wyszukiwaną frazę.",
    T: T
  }), recipes.filter(function (r) {
    var matchesCategory = recipeCategory === "all" || r.cat === recipeCategory;
    var q = recipeSearch.trim().toLowerCase();
    return matchesCategory && (!q || (r.name || "").toLowerCase().includes(q));
  }).map(function (r) {
    var exp = expanded === r.id,
      sc = scales[r.id] || r.servings,
      f = sc / r.servings,
      variant = recipeVariants[String(r.id)] || null,
      baseItems = (r.ingredients || []).map(function (item) {
        return _objectSpread(_objectSpread({}, item), {}, {
          grams: rGram((parseFloat(item.grams) || 0) * f)
        });
      }),
      currentItems = variant && variant.portions === sc && Array.isArray(variant.items) ? variant.items : baseItems,
      m = calcMacro(currentItems, products),
      perServingFactor = 1 / Math.max(0.1, parseFloat(sc) || 1),
      baseIngredientWeight = (r.ingredients || []).reduce(function (sum, item) {
        return sum + (parseFloat(item.grams) || 0);
      }, 0),
      currentIngredientWeight = currentItems.reduce(function (sum, item) {
        return sum + (parseFloat(item.grams) || 0);
      }, 0),
      originalFinishedWeight = parseFloat(r.finishedWeight) || 0,
      finishedWeight = originalFinishedWeight > 0 && baseIngredientWeight > 0 ? originalFinishedWeight * (currentIngredientWeight / baseIngredientWeight) : 0,
      per100Factor = finishedWeight > 0 ? 100 / finishedWeight : 0,
      isCustomized = !!variant;
    return /*#__PURE__*/React.createElement("div", {
      key: r.id,
      className: "mf-list-card",
      style: {
        background: T.surf,
        border: "1px solid " + (exp ? T.acc : T.border),
        borderRadius: 14,
        marginBottom: 10,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        padding: 12,
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      "aria-expanded": exp,
      "aria-label": (exp ? "Zwiń przepis " : "Rozwiń przepis ") + r.name,
      onClick: function onClick(e) {
        e.stopPropagation();
        setExpanded(exp ? null : r.id);
      },
      style: {
        flex: 1,
        minWidth: 0,
        border: "none",
        background: "transparent",
        textAlign: "left",
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: 14,
        color: T.text
      }
    }, r.emoji, " ", r.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text2,
        marginTop: 2
      }
    }, r.servings, r.servings === 1 ? " porcja · " : " porcje · ", CAT_LABELS[r.cat] || r.cat, r.custom === false ? " · MatFit" : " · Własny")), /*#__PURE__*/React.createElement("button", {
      type: "button",
      "aria-label": isFav(r.id) ? "Usuń z ulubionych: " + r.name : "Dodaj do ulubionych: " + r.name,
      "aria-pressed": isFav(r.id),
      onClick: function onClick(e) {
        e.stopPropagation();
        toggleFav(r.id);
      },
      style: {
        fontSize: 20,
        cursor: "pointer",
        color: isFav(r.id) ? T.acc : T.text3,
        padding: "0 4px",
        flexShrink: 0,
        border: "none",
        background: "transparent"
      }
    }, isFav(r.id) ? "★" : "☆"), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right",
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 20,
        fontWeight: 900,
        color: T.kcal
      }
    }, Math.round(m.kcal * perServingFactor)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: T.text3
      }
    }, "kcal / porcję"))), exp && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "0 12px 12px",
        borderTop: "1px solid " + T.border
      },
      onClick: function onClick(e) {
        return e.stopPropagation();
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        padding: "10px 0",
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 12,
        color: T.text2
      }
    }, "Skaluj liczbę porcji"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return changeRecipePortions(r, sc, currentItems, sc - 0.1);
      },
      style: {
        width: 30,
        height: 30,
        background: T.surf2,
        border: "1px solid " + T.border,
        borderRadius: 8,
        color: T.text,
        fontSize: 18,
        cursor: "pointer"
      }
    }, "-"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "monospace",
        fontSize: 15,
        color: T.acc,
        minWidth: 24,
        textAlign: "center"
      }
    }, sc), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return changeRecipePortions(r, sc, currentItems, sc + 0.1);
      },
      style: {
        width: 30,
        height: 30,
        background: T.surf2,
        border: "1px solid " + T.border,
        borderRadius: 8,
        color: T.text,
        fontSize: 18,
        cursor: "pointer"
      }
    }, "+"))), /*#__PURE__*/React.createElement("input", {
      type: "range",
      min: "0.1",
      max: "12",
      step: "0.05",
      value: sc,
      onChange: function onChange(e) {
        return changeRecipePortions(r, sc, currentItems, e.target.value);
      },
      style: {
        width: "100%",
        accentColor: T.acc,
        margin: "0 0 10px"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: 1,
        color: T.text3,
        marginBottom: 2
      }
    }, "Razem dla ", fmtPortions(sc), sc === 1 ? " porcji" : " porcji", " (", Math.round(sc * 100), "% porcji)"), /*#__PURE__*/React.createElement(MG, {
      kcal: m.kcal,
      protein: m.protein,
      carbs: m.carbs,
      fat: m.fat,
      sugars: m.sugars,
      fiber: m.fiber,
      saturatedFat: m.saturatedFat,
      salt: m.salt,
      showDetails: showNutritionDetails,
      T: T
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: finishedWeight > 0 ? "1fr 1fr" : "1fr",
        gap: 6,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: T.surf2,
        borderRadius: 8,
        padding: "8px 9px",
        fontSize: 10,
        color: T.text2,
        lineHeight: 1.5
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: T.text,
        fontWeight: 600
      }
    }, "1 porcja"), Math.round(m.kcal * perServingFactor), " kcal · B ", r2(m.protein * perServingFactor), "g · W ", r2(m.carbs * perServingFactor), "g · T ", r2(m.fat * perServingFactor), "g"), finishedWeight > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        background: T.surf2,
        borderRadius: 8,
        padding: "8px 9px",
        fontSize: 10,
        color: T.text2,
        lineHeight: 1.5
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: T.text,
        fontWeight: 600
      }
    }, isCustomized ? "100 g gotowego dania (szac.)" : "100 g gotowego dania"), Math.round(m.kcal * per100Factor), " kcal · B ", r2(m.protein * per100Factor), "g · W ", r2(m.carbs * per100Factor), "g · T ", r2(m.fat * per100Factor), "g")), !finishedWeight && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        margin: "-4px 0 10px"
      }
    }, "Wpisz masę gotowego dania w edycji, aby zobaczyć wartości na 100 g."), /*#__PURE__*/React.createElement("div", {
      style: {
        background: T.surf2,
        border: "1px solid " + (isCustomized ? T.acc : T.border),
        borderRadius: 10,
        padding: 10,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 12,
        fontWeight: 600,
        color: T.text
      }
    }, "Dopasuj przepis", isCustomized && /*#__PURE__*/React.createElement("span", {
      style: {
        color: T.acc,
        fontSize: 9,
        marginLeft: 6
      }
    }, "● WARIANT AKTYWNY")), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return resetRecipeVariant(r);
      },
      disabled: !isCustomized,
      style: {
        background: "transparent",
        border: "1px solid " + T.border,
        borderRadius: 7,
        color: isCustomized ? T.text2 : T.text3,
        padding: "6px 8px",
        fontSize: 10,
        cursor: isCustomized ? "pointer" : "default",
        opacity: isCustomized ? 1 : 0.55
      }
    }, "↺ Oryginał")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: T.text3,
        lineHeight: 1.4,
        marginBottom: 8
      }
    }, "Cele skalują wszystkie składniki proporcjonalnie. Każdy cel działa osobno — ostatni wybór zastępuje poprzedni. Pojedyncze składniki możesz poprawić niżej."), [["Łączna gramatura", "targetGrams", "g", Math.round(currentIngredientWeight)], ["Docelowe kalorie", "targetKcal", "kcal", Math.round(m.kcal)], ["Docelowe białko", "targetProtein", "g", r2(m.protein)]].map(function (_refRecipeTarget) {
      var _refRecipeTarget2 = _slicedToArray(_refRecipeTarget, 4),
        label = _refRecipeTarget2[0],
        field = _refRecipeTarget2[1],
        unit = _refRecipeTarget2[2],
        currentValue = _refRecipeTarget2[3];
      var targetValue = variant && variant[field] !== undefined ? variant[field] : "";
      return /*#__PURE__*/React.createElement("div", {
        key: field,
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 82px 48px",
          gap: 6,
          alignItems: "center",
          marginTop: 6
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: T.text2
        }
      }, label, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 8,
          color: T.text3
        }
      }, "Teraz: ", currentValue, " ", unit)), /*#__PURE__*/React.createElement("input", {
        value: targetValue,
        onChange: function onChange(e) {
          return setRecipeTarget(r, sc, currentItems, field, e.target.value);
        },
        type: "number",
        min: "1",
        placeholder: String(currentValue),
        style: {
          width: "100%",
          boxSizing: "border-box",
          background: T.surf,
          border: "1px solid " + T.border,
          borderRadius: 7,
          color: T.text,
          padding: "7px 6px",
          fontSize: 11,
          textAlign: "center",
          outline: "none"
        }
      }), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() {
          return applyRecipeTarget(r, sc, currentItems, field, targetValue);
        },
        style: {
          background: T.acc,
          border: "none",
          borderRadius: 7,
          color: safeTn === "light" ? "#fff" : "#000",
          padding: "8px 4px",
          fontSize: 9,
          fontWeight: 600,
          cursor: "pointer"
        }
      }, "Ustaw"));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: 1,
        color: T.text3,
        marginBottom: 6
      }
    }, "Sk\u0142adniki — gramaturę możesz zmienić ręcznie"), currentItems.map(function (item, i) {
      var p = products.find(function (x) {
        return x.id === item.productId;
      });
      return p ? /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 0",
          borderBottom: "1px solid " + T.border,
          fontSize: 13
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: T.text2,
          flex: 1,
          minWidth: 0
        }
      }, p.name, p.state ? /*#__PURE__*/React.createElement("span", {
        style: {
          display: "block",
          fontSize: 8,
          color: T.text3
        }
      }, p.state) : null), /*#__PURE__*/React.createElement("input", {
        value: item.grams,
        onChange: function onChange(e) {
          return changeRecipeIngredient(r, sc, currentItems, i, e.target.value);
        },
        type: "number",
        min: "0",
        step: "0.01",
        style: {
          width: 68,
          boxSizing: "border-box",
          background: T.surf2,
          border: "1px solid " + T.border,
          borderRadius: 7,
          color: T.acc,
          fontFamily: "monospace",
          fontSize: 12,
          padding: "6px",
          textAlign: "center",
          outline: "none"
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          color: T.text3
        }
      }, "g")) : null;
    }), (r.steps || []).length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: 1,
        color: T.text3,
        margin: "10px 0 6px"
      }
    }, "Przygotowanie"), r.steps.map(function (st, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          fontSize: 12,
          color: T.text2,
          padding: "4px 0"
        }
      }, i + 1, ". ", st);
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        setSelRDay(TODAY);
        setSelRMealTime("sniadanie");
        setSelRId(String(r.id));
        setSelRPortions(String(sc));
        setSelRItems(currentItems.map(function (item) {
          return _objectSpread({}, item);
        }));
        setModalRecipeSearch(r.name);
        setModal("addRecipe");
      },
      style: _objectSpread(_objectSpread({}, btnA), {}, {
        flex: "1 1 150px",
        fontSize: 12
      })
    }, isCustomized ? "+ Wariant do planera" : "+ Planer"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return openRecipeCard(_objectSpread(_objectSpread({}, r), {}, {
          servings: sc,
          ingredients: currentItems.map(function (item) {
            return _objectSpread({}, item);
          }),
          finishedWeight: finishedWeight || ""
        }));
      },
      style: _objectSpread(_objectSpread({}, btnB), {}, {
        padding: "10px 14px",
        fontSize: 13
      })
    }, "\uD83D\uDDA8\uFE0F"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return openER(r);
      },
      style: _objectSpread(_objectSpread({}, btnB), {}, {
        padding: "10px 14px"
      })
    }, "Edytuj"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return removeRecipe(r);
      },
      style: _objectSpread(_objectSpread({}, btnB), {}, {
        padding: "10px 14px"
      })
    }, "Usuń"))));
  })), page === "produkty" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Baza żywności",
    title: "Produkty",
    subtitle: "Wartości bazowe są orientacyjne na 100 g. Dla produktu markowego użyj etykiety lub skanera EAN.",
    action: /*#__PURE__*/React.createElement("button", {
      type: "button",
      "aria-pressed": !!showNutritionDetails,
      onClick: function onClick() {
        return setShowNutritionDetails(!showNutritionDetails);
      },
      style: _objectSpread(_objectSpread({}, btnB), {}, {
        padding: "8px 10px",
        fontSize: 10,
        whiteSpace: "nowrap"
      })
    }, showNutritionDetails ? "Ukryj szczegóły" : "Pokaż szczegóły"),
    T: T
  }), /*#__PURE__*/React.createElement("div", {
    className: "mf-toolbar",
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: prodSearch,
    onChange: function onChange(e) {
      return setProdSearch(e.target.value);
    },
    placeholder: "Szukaj...",
    "aria-label": "Szukaj produktu",
    style: _objectSpread(_objectSpread({}, inp), {}, {
      flex: 1
    })
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Dodaj nowy produkt",
    onClick: function onClick() {
      setPf({
        name: "",
        emoji: "",
        brand: "",
        ean: "",
        kcal: "",
        protein: "",
        carbs: "",
        fat: "",
        sugars: "",
        fiber: "",
        saturatedFat: "",
        salt: "",
        packageSize: ""
      });
      setModal("newProd");
    },
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      padding: "10px 14px",
      flexShrink: 0
    })
  }, "+")), /*#__PURE__*/React.createElement("div", {
    className: "mf-chip-row",
    style: {
      display: "flex",
      gap: 6,
      overflowX: "auto",
      paddingBottom: 7,
      marginBottom: 4
    }
  }, PRODUCT_CATEGORIES.map(function (category) {
    var active = productCategory === category.key;
    return /*#__PURE__*/React.createElement("button", {
      key: category.key,
      type: "button",
      className: "mf-chip",
      "aria-pressed": active,
      onClick: function onClick() {
        return setProductCategory(category.key);
      },
      style: {
        flexShrink: 0,
        border: "1px solid " + (active ? T.acc : T.border),
        background: active ? T.acc : T.surf,
        color: active ? safeTn === "light" ? "#fff" : "#000" : T.text2,
        borderRadius: 100,
        padding: "6px 9px",
        fontSize: 10,
        fontWeight: active ? 700 : 400,
        cursor: "pointer"
      }
    }, category.label);
  })), /*#__PURE__*/React.createElement("div", {
    className: "mf-count-line",
    style: {
      fontSize: 11,
      color: T.text3,
      marginBottom: 10
    }
  }, filtProd.length, " z ", products.length, " produktów · MatFit ", baseProductCount, " · własne ", userProductCount), filtProd.length === 0 && /*#__PURE__*/React.createElement(EmptyState, {
    icon: "▤",
    title: "Brak pasujących produktów",
    copy: "Wybierz inną kategorię, zmień wyszukiwanie albo dodaj własny produkt.",
    T: T
  }), filtProd.map(function (p) {
    var productCategoryLabel = (PRODUCT_CATEGORIES.find(function (category) {
      return category.key === p.category;
    }) || {}).label || "Inne";
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: "mf-list-card",
      style: {
        background: T.surf,
        border: "1px solid " + T.border,
        borderRadius: 12,
        marginBottom: 8,
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 500,
        color: T.text,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, p.emoji, " ", p.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text3,
        marginTop: 1
      }
    }, p.custom ? (p.brand && p.brand !== "—" ? p.brand + " · " : "") + "własny · na 100 g" : productCategoryLabel + (p.state ? " · " + p.state : "") + " · MatFit · na 100 g"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 5,
        marginTop: 4,
        flexWrap: "wrap"
      }
    }, [[p.kcal + " kcal", T.kcal], ["B:" + p.protein + "g", T.prot], ["W:" + p.carbs + "g", T.carbs], ["T:" + p.fat + "g", T.fat]].map(function (_ref17) {
      var _ref18 = _slicedToArray(_ref17, 2),
        t = _ref18[0],
        c = _ref18[1];
      return /*#__PURE__*/React.createElement("span", {
        key: t,
        style: {
          fontFamily: "monospace",
          fontSize: 10,
          padding: "2px 6px",
          borderRadius: 4,
          background: T.surf2,
          color: c
        }
      }, t);
    })), showNutritionDetails && /*#__PURE__*/React.createElement(NutritionDetails, {
      sugars: p.sugars,
      fiber: p.fiber,
      saturatedFat: p.saturatedFat,
      salt: p.salt,
      T: T
    }), showNutritionDetails && /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 9, color: T.text3, marginTop: -4 }
    }, "Szczegóły ", nutritionDetailCompleteness(p), "/4", p.nutritionSource ? " · " + p.nutritionSource : "", p.nutritionRef ? " · " + p.nutritionRef : "", p.lastVerified ? " · sprawdzono " + p.lastVerified : "")), /*#__PURE__*/React.createElement("button", {
      type: "button",
      "aria-label": (isProductFavorite(p.id) ? "Usuń z ulubionych: " : "Dodaj do ulubionych: ") + p.name,
      "aria-pressed": isProductFavorite(p.id),
      onClick: function onClick() {
        return toggleProductFavorite(p.id);
      },
      style: {
        width: 42,
        minWidth: 42,
        minHeight: 42,
        border: "none",
        borderRadius: 12,
        background: isProductFavorite(p.id) ? T.acc + "22" : "transparent",
        color: isProductFavorite(p.id) ? T.acc : T.text3,
        fontSize: 20,
        cursor: "pointer"
      }
    }, isProductFavorite(p.id) ? "★" : "☆"), p.custom && /*#__PURE__*/React.createElement("button", {
      type: "button",
      "aria-label": "Usuń produkt " + p.name,
      onClick: function onClick() {
        setProducts(products.filter(function (x) {
          return x.id !== p.id;
        }));
        setProductFavorites(function (prev) {
          return (Array.isArray(prev) ? prev : []).filter(function (id) {
            return id !== p.id;
          });
        });
        setRecentProducts(function (prev) {
          return (Array.isArray(prev) ? prev : []).filter(function (id) {
            return id !== p.id;
          });
        });
        setProductGrams(function (prev) {
          var next = _objectSpread({}, prev);
          delete next[p.id];
          return next;
        });
      },
      style: {
        background: "none",
        border: "none",
        fontSize: 16,
        cursor: "pointer",
        color: T.text3
      }
    }, "Del"));
  })), page === "zakupy" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Z planu na listę",
    title: "Lista zakupów",
    subtitle: "MatFit sumuje składniki z wybranego zakresu i przelicza potrzebne opakowania.",
    T: T
  }), /*#__PURE__*/React.createElement("div", {
    className: "mf-chip-row",
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 12
    }
  }, [1, 3, 7].map(function (d) {
    return /*#__PURE__*/React.createElement("button", {
      key: d,
      className: "mf-chip",
      "aria-pressed": zDays === d,
      onClick: function onClick() {
        return setZDays(d);
      },
      style: {
        flex: 1,
        background: zDays === d ? T.acc : T.surf,
        border: "1px solid " + (zDays === d ? T.acc : T.border),
        borderRadius: 10,
        color: zDays === d ? safeTn === "light" ? "#fff" : "#000" : T.text,
        padding: "9px",
        fontSize: 12,
        fontWeight: zDays === d ? 700 : 400,
        cursor: "pointer"
      }
    }, d, " ", d === 1 ? "dzień" : "dni");
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      textAlign: "center",
      margin: "-5px 0 10px"
    }
  }, zDays === 1 ? "Zakupy na " + mfFormatShortDate(selectedDay || TODAY) : "Zakupy od " + mfFormatShortDate(selectedDay || TODAY) + " do " + mfFormatShortDate(mfShiftISO(selectedDay || TODAY, zDays - 1))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: exportZ,
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      flex: 1,
      fontSize: 12
    })
  }, "Eksportuj"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setZChecked({});
    },
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      flex: 1,
      fontSize: 12
    })
  }, "Reset")), function () {
    var items = getIngMap(zDays);
    if (!items.length) return /*#__PURE__*/React.createElement(EmptyState, {
      icon: "✓",
      title: "Lista jest jeszcze pusta",
      copy: "Dodaj posiłki do planera w wybranym zakresie, a składniki pojawią się tutaj automatycznie.",
      action: /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: function onClick() { return navigateToPage("planer"); },
        style: btnA
      }, "Przejdź do planera"),
      T: T
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, items.map(function (_ref19) {
      var _ref20 = _slicedToArray(_ref19, 2),
        id = _ref20[0],
        _ref20$ = _ref20[1],
        name = _ref20$.name,
        qty = _ref20$.qty,
        packageSize = _ref20$.packageSize;
      var chk = zChecked[id] || false;
      var pkgs = packageSize ? Math.ceil(qty / packageSize) : null;
      return /*#__PURE__*/React.createElement("button", {
        key: id,
        type: "button",
        className: "mf-list-card mf-shopping-item",
        "aria-pressed": chk,
        "aria-label": (chk ? "Odznacz " : "Oznacz jako kupione ") + name + ", " + Math.round(qty) + " gramów",
        onClick: function onClick() {
          return setZChecked(_objectSpread(_objectSpread({}, zChecked), {}, _defineProperty({}, id, !chk)));
        },
        style: {
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          background: T.surf,
          border: "1px solid " + T.border,
          borderRadius: 10,
          marginBottom: 6,
          cursor: "pointer",
          opacity: chk ? 0.55 : 1,
          width: "100%",
          color: "inherit",
          textAlign: "left"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 20,
          height: 20,
          border: "2px solid " + (chk ? T.acc : T.border),
          borderRadius: 6,
          background: chk ? T.acc : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          flexShrink: 0
        }
      }, chk ? "✓" : ""), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 13,
          color: T.text,
          textDecoration: chk ? "line-through" : "none"
        }
      }, name), packageSize && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: T.text3
        }
      }, " \xB7 ", packageSize, "g/szt.")), /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: "right",
          flexShrink: 0
        }
      }, pkgs && /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 14,
          fontWeight: 700,
          color: T.acc
        }
      }, "\xD7 ", pkgs, " szt."), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: "monospace",
          fontSize: 11,
          color: T.text3
        }
      }, Math.round(qty), "g")));
    }));
  }()), page === "profil" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Ustawienia i cel",
    title: "Twój profil",
    subtitle: "Tutaj MatFit wylicza zapotrzebowanie, makro i bezpieczną prognozę celu na podstawie Twoich danych.",
    T: T
  }), bmr > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mf-section-card",
    style: {
      background: T.surf,
      border: "1px solid " + T.acc,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: T.surf2,
      borderRadius: 10,
      padding: 12,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "monospace",
      fontSize: 22,
      fontWeight: 700,
      color: T.text2
    }
  }, bmr), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      marginTop: 2
    }
  }, "BMR kcal/dzie\u0144")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: T.surf2,
      borderRadius: 10,
      padding: 12,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "monospace",
      fontSize: 22,
      fontWeight: 700,
      color: T.kcal
    }
  }, tdee), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      marginTop: 2
    }
  }, profile.tdeeManual ? "TDEE skalibrowane" : "TDEE ze wzoru"))), /*#__PURE__*/React.createElement(MG, {
    kcal: TARGETS.kcal,
    protein: TARGETS.protein,
    carbs: TARGETS.carbs,
    fat: TARGETS.fat,
    T: T
  })), function () {
    var latest = Object.entries(bodyLog).sort(function (a, b) { return b[0].localeCompare(a[0]); }).find(function (x) { return x[1] && Object.keys(x[1]).length; });
    var measures = latest ? latest[1] : {};
    var latestDate = latest ? new Date(latest[0] + "T12:00:00").toLocaleDateString("pl-PL") : null;
    var currentWeight = parseFloat(measures.weight) || parseFloat(profile.weight) || 0;
    var targetWeightValue = parseFloat(profile.targetWeight);
    var targetWeight = targetWeightValue >= 30 && targetWeightValue <= 300 ? targetWeightValue : 0;
    var targetBfValue = parseFloat(profile.targetBf);
    var targetBf = targetBfValue >= 3 && targetBfValue <= 50 ? targetBfValue : 0;
    var navyBf = calcNavyBodyFat(profile, measures) || 0;
    var manualBf = parseFloat(measures.bfManual) || 0;
    var currentBf = manualBf || navyBf || parseFloat(measures.bf) || 0;
    var leanMass = currentWeight && currentBf ? currentWeight * (1 - currentBf / 100) : 0;
    var weightAtTargetBf = leanMass && targetBf > 2 && targetBf < 60 ? leanMass / (1 - targetBf / 100) : 0;
    var bfAtTargetWeight = leanMass && targetWeight ? (1 - leanMass / targetWeight) * 100 : 0;
    var minReasonableBf = profile.gender === "f" ? 12 : 5;
    var targetWeightWarning = targetWeight && bfAtTargetWeight > 0 && bfAtTargetWeight < minReasonableBf;
    var effectiveTargetWeight = targetWeight || weightAtTargetBf;
    var startWeight = parseFloat(profile.goalStartWeight) || currentWeight;
    var startBf = parseFloat(profile.goalStartBf) || 0;
    var goalStartDate = profile.goalStartDate || (latest ? latest[0] : TODAY);
    var delta = effectiveTargetWeight && currentWeight ? effectiveTargetWeight - currentWeight : 0;
    var calorieBalance = tdee ? TARGETS.kcal - tdee : 0;
    var directionOk = delta < 0 && calorieBalance < 0 || delta > 0 && calorieBalance > 0;
    var theoreticalWeekly = directionOk ? Math.abs(calorieBalance) * 7 / 7700 : 0;
    var goalWeightEntries = Object.entries(bodyLog || {}).filter(function (item) {
      return item[0] <= TODAY && item[1] && isFinite(parseFloat(item[1].weight)) && parseFloat(item[1].weight) > 0;
    }).map(function (item) {
      return { date: item[0], weight: parseFloat(item[1].weight) };
    }).sort(function (a, b) {
      return a.date.localeCompare(b.date);
    });
    var weightTrend = mfWeightTrend(goalWeightEntries, 42);
    var goalDirection = delta < 0 ? -1 : delta > 0 ? 1 : 0;
    var observedDirectionOk = !!(weightTrend && goalDirection && weightTrend.weekly * goalDirection > 0 && Math.abs(weightTrend.weekly) >= 0.05);
    var theoreticalSigned = goalDirection * theoreticalWeekly;
    var observedShare = weightTrend && weightTrend.count >= 5 && weightTrend.spanDays >= 28 && weightTrend.r2 >= 0.35 ? 0.75 : 0.55;
    var adaptiveSigned = observedDirectionOk ? directionOk ? weightTrend.weekly * observedShare + theoreticalSigned * (1 - observedShare) : weightTrend.weekly : directionOk ? theoreticalSigned : 0;
    var maxWeeklyRate = currentWeight * (goalDirection < 0 ? 0.015 : 0.01);
    var adaptiveWeekly = Math.abs(adaptiveSigned) >= 0.05 ? Math.min(Math.abs(adaptiveSigned), Math.max(0.2, maxWeeklyRate)) : 0;
    var forecastMode = observedDirectionOk ? "adaptacyjna" : directionOk ? "teoretyczna" : "brak";
    var forecastUncertainty = observedDirectionOk && weightTrend.count >= 5 && weightTrend.spanDays >= 28 ? 0.2 : 0.3;
    var fastWeekly = adaptiveWeekly * (1 + forecastUncertainty);
    var slowWeekly = adaptiveWeekly * (1 - forecastUncertainty);
    var finishCentralDays = adaptiveWeekly ? Math.abs(delta) / adaptiveWeekly * 7 : 0;
    var finishFastDays = fastWeekly ? Math.abs(delta) / fastWeekly * 7 : 0;
    var finishSlowDays = slowWeekly ? Math.abs(delta) / slowWeekly * 7 : 0;
    var finishCentralISO = adaptiveWeekly ? mfShiftISO(TODAY, finishCentralDays) : null;
    var finishFastISO = adaptiveWeekly ? mfShiftISO(TODAY, finishFastDays) : null;
    var finishSlowISO = adaptiveWeekly ? mfShiftISO(TODAY, finishSlowDays) : null;
    var startFatMass = startWeight && startBf ? startWeight * startBf / 100 : 0;
    var currentFatMass = currentWeight && currentBf ? currentWeight * currentBf / 100 : 0;
    var goalFatChange = startFatMass && currentFatMass ? currentFatMass - startFatMass : null;
    var goalOtherChange = goalFatChange !== null ? currentWeight - startWeight - goalFatChange : null;
    var goalChartData = [];
    if (effectiveTargetWeight && currentWeight) {
      var chartActual = goalWeightEntries.filter(function (item) {
        return mfDaysBetween(item.date, TODAY) <= 90;
      });
      chartActual.forEach(function (item) {
        var rolling = chartActual.filter(function (candidate) {
          var age = mfDaysBetween(candidate.date, item.date);
          return age >= 0 && age <= 6;
        });
        var rollingWeight = rolling.reduce(function (sum, candidate) { return sum + candidate.weight; }, 0) / rolling.length;
        goalChartData.push({ iso: item.date, label: mfFormatShortDate(item.date), actual: item.weight, trend: r2(rollingWeight) });
      });
      if (!goalChartData.length || goalChartData[goalChartData.length - 1].iso !== TODAY) {
        goalChartData.push({ iso: TODAY, label: mfFormatShortDate(TODAY), actual: null, trend: currentWeight, forecast: currentWeight, range: [currentWeight, currentWeight] });
      } else {
        goalChartData[goalChartData.length - 1].forecast = currentWeight;
        goalChartData[goalChartData.length - 1].range = [currentWeight, currentWeight];
      }
      if (adaptiveWeekly) {
        var projectionLimit = Math.min(730, Math.max(7, Math.ceil(finishSlowDays / 7) * 7));
        for (var projectionDay = 7; projectionDay <= projectionLimit; projectionDay += 7) {
          var projectionWeeks = projectionDay / 7;
          var capGoal = function capGoal(value) {
            return goalDirection < 0 ? Math.max(effectiveTargetWeight, value) : Math.min(effectiveTargetWeight, value);
          };
          var centralWeight = capGoal(currentWeight + goalDirection * adaptiveWeekly * projectionWeeks);
          var fastWeight = capGoal(currentWeight + goalDirection * fastWeekly * projectionWeeks);
          var slowWeight = capGoal(currentWeight + goalDirection * slowWeekly * projectionWeeks);
          var projectionISO = mfShiftISO(TODAY, projectionDay);
          goalChartData.push({
            iso: projectionISO,
            label: mfFormatShortDate(projectionISO),
            forecast: r2(centralWeight),
            range: [r2(Math.min(fastWeight, slowWeight)), r2(Math.max(fastWeight, slowWeight))]
          });
        }
      }
    }
    var goalChartValues = goalChartData.reduce(function (values, item) {
      [item.actual, item.trend, item.forecast].forEach(function (value) { if (typeof value === "number" && isFinite(value)) values.push(value); });
      if (Array.isArray(item.range)) values.push(item.range[0], item.range[1]);
      return values;
    }, effectiveTargetWeight ? [effectiveTargetWeight] : []);
    var goalChartMin = goalChartValues.length ? Math.min.apply(Math, _toConsumableArray(goalChartValues)) - 0.8 : 0;
    var goalChartMax = goalChartValues.length ? Math.max.apply(Math, _toConsumableArray(goalChartValues)) + 0.8 : 100;
    var progress = effectiveTargetWeight && startWeight !== effectiveTargetWeight ? Math.max(0, Math.min(100, Math.round((startWeight - currentWeight) / (startWeight - effectiveTargetWeight) * 100))) : 0;
    return /*#__PURE__*/React.createElement("div", {
      className: "mf-section-card",
      style: { background: T.surf, border: "1px solid " + T.border, borderRadius: 14, padding: 14, marginBottom: 12 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 14, fontWeight: 800, color: T.text }
    }, "🎯 Cel sylwetkowy PRO"), /*#__PURE__*/React.createElement("span", {
      style: { fontSize: 10, color: T.text3 }
    }, latestDate ? "pomiar: " + latestDate : "brak pomiaru")), currentBf ? /*#__PURE__*/React.createElement("div", {
      style: { background: T.surf2, borderRadius: 10, padding: "10px 11px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 10, color: T.text3 }
    }, manualBf ? "AKTUALNY BF — WARTOŚĆ RĘCZNA" : "AKTUALNY BF — SZACUNEK NAVY"), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 10, color: T.text3, marginTop: 2 }
    }, manualBf ? "Navy z obwodów: " + (navyBf ? navyBf.toFixed(1) + "%" : "brak") : "Możliwy błąd kilku p.p.; liczy się trend")), /*#__PURE__*/React.createElement("b", {
      style: { fontSize: 22, color: T.acc, fontFamily: "monospace" }
    }, currentBf.toFixed(1), "%")) : /*#__PURE__*/React.createElement("div", {
      style: { background: T.acc2 + "14", border: "1px solid " + T.acc2 + "55", borderRadius: 10, padding: 10, marginBottom: 10, fontSize: 11, lineHeight: 1.5, color: T.text2 }
    }, "Do obliczenia BF metodą Navy potrzebujemy datowanego pomiaru: wagi, pasa, szyi", profile.gender === "f" ? " i bioder" : "", ".", /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() { return navigateToPage("pomiary"); },
      style: _objectSpread(_objectSpread({}, btnB), {}, { width: "100%", marginTop: 8, padding: "8px" })
    }, "+ Dodaj pomiar")), /*#__PURE__*/React.createElement("div", {
      style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, { mt: 0, T: T }, "Waga docelowa (kg)"), /*#__PURE__*/React.createElement("input", {
      value: profile.targetWeight || "", type: "number", min: "30", max: "300", step: "0.1", placeholder: "np. 90", style: inp,
      onChange: function onChange(e) {
        var value = e.target.value;
        return setProfile(_objectSpread(_objectSpread({}, profile), {}, {
          targetWeight: value,
          goalStartWeight: profile.goalStartWeight || (value ? String(currentWeight || "") : ""),
          goalStartBf: profile.goalStartBf || (value && currentBf ? String(r2(currentBf)) : ""),
          goalStartDate: profile.goalStartDate || (value ? latest ? latest[0] : TODAY : "")
        }));
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, { mt: 0, T: T }, "Docelowy BF%"), /*#__PURE__*/React.createElement("input", {
      value: profile.targetBf || "", type: "number", min: "3", max: "50", step: "0.1", placeholder: "np. 12", style: inp,
      onChange: function onChange(e) { return setProfile(_objectSpread(_objectSpread({}, profile), {}, {
        targetBf: e.target.value,
        goalStartWeight: profile.goalStartWeight || (e.target.value ? String(currentWeight || "") : ""),
        goalStartBf: profile.goalStartBf || (e.target.value && currentBf ? String(r2(currentBf)) : ""),
        goalStartDate: profile.goalStartDate || (e.target.value ? latest ? latest[0] : TODAY : "")
      })); }
    }))), (targetWeight || targetBf) && currentWeight ? /*#__PURE__*/React.createElement("div", {
      style: { marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, fontSize: 9, color: T.text3 }
    }, /*#__PURE__*/React.createElement("span", null, "Punkt startowy: ", /*#__PURE__*/React.createElement("b", { style: { color: T.text2 } }, startWeight.toFixed(1), " kg"), profile.goalStartDate ? " · " + mfFormatDate(goalStartDate) : ""), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        if (!window.confirm("Ustawić aktualny pomiar jako nowy punkt startowy celu?")) return;
        setProfile(_objectSpread(_objectSpread({}, profile), {}, {
          goalStartWeight: String(currentWeight),
          goalStartBf: currentBf ? String(r2(currentBf)) : "",
          goalStartDate: latest ? latest[0] : TODAY
        }));
      },
      style: _objectSpread(_objectSpread({}, btnB), {}, { padding: "5px 8px", fontSize: 9, flexShrink: 0 })
    }, "Ustaw od teraz")) : null, currentBf && (targetWeight || targetBf) ? /*#__PURE__*/React.createElement("div", {
      style: { marginTop: 10, background: T.acc + "12", borderRadius: 10, padding: 10, fontSize: 11, lineHeight: 1.6, color: T.text2 }
    }, targetBf && weightAtTargetBf ? /*#__PURE__*/React.createElement("div", null, "Przy ", /*#__PURE__*/React.createElement("b", { style: { color: T.acc } }, targetBf, "% BF"), " orientacyjna waga: ", /*#__PURE__*/React.createElement("b", { style: { color: T.text } }, weightAtTargetBf.toFixed(1), " kg")) : null, targetWeight && bfAtTargetWeight > 1 && bfAtTargetWeight < 60 ? /*#__PURE__*/React.createElement("div", null, "Przy wadze ", /*#__PURE__*/React.createElement("b", { style: { color: T.text } }, targetWeight, " kg"), " szacowany BF: ", /*#__PURE__*/React.createElement("b", { style: { color: targetWeightWarning ? T.acc2 : T.acc } }, bfAtTargetWeight.toFixed(1), "%")) : null, targetWeightWarning ? /*#__PURE__*/React.createElement("div", { style: { color: T.acc2, fontSize: 10, marginTop: 4, fontWeight: 700 } }, "⚠ Ten wynik byłby skrajnie niski. Zweryfikuj obwody albo załóż, że część spadku masy nie będzie samym tłuszczem.") : null, /*#__PURE__*/React.createElement("div", { style: { color: T.text3, fontSize: 10, marginTop: 3 } }, "Założenie: beztłuszczowa masa ciała pozostaje bez zmian. Rzeczywisty wynik może się różnić.")) : null, effectiveTargetWeight && currentWeight ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: { marginTop: 12, background: T.surf2, borderRadius: 10, padding: 11 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 7 }
    }, /*#__PURE__*/React.createElement("span", { style: { color: T.text2 } }, currentWeight.toFixed(1), " kg → ", effectiveTargetWeight.toFixed(1), " kg"), /*#__PURE__*/React.createElement("b", { style: { color: T.acc } }, progress, "%")), /*#__PURE__*/React.createElement("div", {
      style: { height: 7, borderRadius: 8, overflow: "hidden", background: T.border }
    }, /*#__PURE__*/React.createElement("div", { style: { width: progress + "%", height: "100%", background: T.acc, transition: "width .25s" } })), /*#__PURE__*/React.createElement("div", {
      style: { marginTop: 8, fontSize: 11, color: T.text3, lineHeight: 1.5 }
    }, "Do celu: ", /*#__PURE__*/React.createElement("b", { style: { color: T.text } }, Math.abs(delta).toFixed(1), " kg"), currentBf ? " • Aktualny BF: " + currentBf.toFixed(1) + "%" : ""), goalFatChange !== null ? /*#__PURE__*/React.createElement("div", {
      style: { marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }
    }, [[currentWeight - startWeight, "Masa", "kg", T.text2], [goalFatChange, "Tłuszcz*", "kg", "#7daa6e"], [goalOtherChange, "Pozostałe*", "kg", "#8fa3c4"]].map(function (item) {
      var value = item[0], label = item[1], unit = item[2], color = item[3];
      return /*#__PURE__*/React.createElement("div", { key: label, style: { background: T.surf, borderRadius: 8, padding: "7px 4px", textAlign: "center" } }, /*#__PURE__*/React.createElement("div", { style: { fontFamily: "monospace", fontSize: 13, fontWeight: 800, color: color } }, value > 0 ? "+" : "", value.toFixed(1), " ", unit), /*#__PURE__*/React.createElement("div", { style: { fontSize: 8, color: T.text3, marginTop: 2 } }, label));
    }), /*#__PURE__*/React.createElement("div", { style: { gridColumn: "1 / -1", fontSize: 8, lineHeight: 1.35, color: T.text3 } }, "*Szacunek z BF. „Pozostałe” obejmuje m.in. wodę, glikogen i masę beztłuszczową — nie oznacza automatycznie utraty mięśni.")) : null), /*#__PURE__*/React.createElement("div", {
      style: { marginTop: 8, borderRadius: 10, padding: "10px 11px", background: adaptiveWeekly ? T.acc + "18" : T.acc2 + "14", fontSize: 11, lineHeight: 1.55, color: T.text2 }
    }, adaptiveWeekly ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", { style: { color: T.acc } }, "Przewidywany finisz: ", mfFormatDate(finishFastISO), " – ", mfFormatDate(finishSlowISO)), /*#__PURE__*/React.createElement("div", { style: { color: T.text2 } }, "Najbardziej prawdopodobnie: ", /*#__PURE__*/React.createElement("b", null, mfFormatDate(finishCentralISO))), /*#__PURE__*/React.createElement("div", { style: { color: T.text3, marginTop: 3 } }, forecastMode === "adaptacyjna" ? "Prognoza adaptacyjna: " + adaptiveWeekly.toFixed(2) + " kg/tydz. · trend pomiarów " + Math.abs(weightTrend.weekly).toFixed(2) + " kg/tydz. · " + weightTrend.count + " wpisy / " + weightTrend.spanDays + " dni." : "Prognoza teoretyczna: " + adaptiveWeekly.toFixed(2) + " kg/tydz. Dodaj min. 3 pomiary przez 14 dni, aby MatFit skalibrował ją rzeczywistym trendem."), /*#__PURE__*/React.createElement("div", { style: { color: T.text3, fontSize: 9, marginTop: 4 } }, "7700 kcal/kg to punkt startowy, nie obietnica. Zakres uwzględnia typowe odchylenia i zmienia się wraz z danymi.")) : delta === 0 ? "Cel osiągnięty — dobra robota." : "Brak wiarygodnej prognozy. Ustaw deficyt/nadwyżkę zgodną z celem albo dodaj co najmniej 3 pomiary w ciągu 14 dni."), adaptiveWeekly && goalChartData.length > 1 ? /*#__PURE__*/React.createElement("div", {
      style: { marginTop: 10, background: T.surf2, borderRadius: 10, padding: "9px 6px 4px" }
    }, /*#__PURE__*/React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 5px 5px" } }, /*#__PURE__*/React.createElement("b", { style: { fontSize: 10, color: T.text2 } }, "Prognoza masy"), /*#__PURE__*/React.createElement("span", { style: { fontSize: 8, color: T.text3 } }, "linia przerywana = prognoza")), /*#__PURE__*/React.createElement(ResponsiveContainer, {
      width: "100%", height: 190
    }, /*#__PURE__*/React.createElement(ComposedChart, {
      data: goalChartData, margin: { top: 5, right: 8, left: -8, bottom: 3 }
    }, /*#__PURE__*/React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: T.border }), /*#__PURE__*/React.createElement(XAxis, { dataKey: "label", tick: { fontSize: 8, fill: T.text3 }, interval: "preserveStartEnd" }), /*#__PURE__*/React.createElement(YAxis, { domain: [goalChartMin, goalChartMax], tick: { fontSize: 8, fill: T.text3 }, width: 38 }), /*#__PURE__*/React.createElement(Tooltip, {
      contentStyle: { background: T.surf2, border: "1px solid " + T.border, borderRadius: 8, fontSize: 10 },
      formatter: function formatter(value, name) {
        if (Array.isArray(value)) return [value[0].toFixed(1) + "–" + value[1].toFixed(1) + " kg", "Zakres"];
        return [Number(value).toFixed(1) + " kg", name];
      }
    }), /*#__PURE__*/React.createElement(Area, { type: "monotone", dataKey: "range", name: "Zakres", stroke: "none", fill: T.acc, fillOpacity: 0.12, connectNulls: true, isAnimationActive: false }), /*#__PURE__*/React.createElement(ReferenceLine, { y: effectiveTargetWeight, stroke: T.acc2, strokeDasharray: "4 3", label: { value: "cel", fill: T.acc2, fontSize: 8 } }), /*#__PURE__*/React.createElement(Line, { type: "monotone", dataKey: "actual", name: "Pomiar", stroke: "#8fa3c4", strokeWidth: 2, dot: { r: 3 }, connectNulls: true, isAnimationActive: false }), /*#__PURE__*/React.createElement(Line, { type: "monotone", dataKey: "trend", name: "Średnia 7 dni", stroke: "#7daa6e", strokeWidth: 2, dot: false, connectNulls: true, isAnimationActive: false }), /*#__PURE__*/React.createElement(Line, { type: "monotone", dataKey: "forecast", name: "Prognoza", stroke: T.acc, strokeWidth: 2, strokeDasharray: "5 4", dot: false, connectNulls: true, isAnimationActive: false })))) : null) : /*#__PURE__*/React.createElement("div", {
      style: { marginTop: 10, fontSize: 11, color: T.text3, lineHeight: 1.5 }
    }, currentBf ? "Ustaw wagę docelową albo docelowy BF%. Finisz policzymy z TDEE oraz deficytu lub nadwyżki." : "Najpierw dodaj komplet pomiarów — bez nich nie będziemy udawać, że znamy Twój BF%."));
  }(), /*#__PURE__*/React.createElement("div", {
    style: {
      background: T.surf,
      border: "1px solid " + T.border,
      borderRadius: 14,
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, {
    mt: 0,
    T: T
  }, "Waga (kg)"), /*#__PURE__*/React.createElement("input", {
    value: profile.weight,
    onChange: function onChange(e) {
      return setProfile(_objectSpread(_objectSpread({}, profile), {}, {
        weight: e.target.value
      }));
    },
    type: "number",
    placeholder: "80",
    style: inp
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, {
    mt: 0,
    T: T
  }, "Wzrost (cm)"), /*#__PURE__*/React.createElement("input", {
    value: profile.height,
    onChange: function onChange(e) {
      return setProfile(_objectSpread(_objectSpread({}, profile), {}, {
        height: e.target.value
      }));
    },
    type: "number",
    placeholder: "175",
    style: inp
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, {
    mt: 0,
    T: T
  }, "Wiek"), /*#__PURE__*/React.createElement("input", {
    value: profile.age,
    onChange: function onChange(e) {
      return setProfile(_objectSpread(_objectSpread({}, profile), {}, {
        age: e.target.value
      }));
    },
    type: "number",
    placeholder: "25",
    style: inp
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, {
    mt: 0,
    T: T
  }, "P\u0142e\u0107"), /*#__PURE__*/React.createElement("select", {
    value: profile.gender,
    onChange: function onChange(e) {
      return setProfile(_objectSpread(_objectSpread({}, profile), {}, {
        gender: e.target.value
      }));
    },
    style: inp
  }, /*#__PURE__*/React.createElement("option", {
    value: "m"
  }, "M\u0119\u017Cczyzna"), /*#__PURE__*/React.createElement("option", {
    value: "f"
  }, "Kobieta")))), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Aktywno\u015B\u0107"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      marginBottom: 8
    }
  }, ACTIVITY.map(function (a) {
    return /*#__PURE__*/React.createElement("button", {
      key: a.key,
      type: "button",
      "aria-pressed": profile.activity === a.key,
      onClick: function onClick() {
        return setProfile(_objectSpread(_objectSpread({}, profile), {}, {
          activity: a.key
        }));
      },
      style: {
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid " + (profile.activity === a.key ? T.acc : T.border),
        background: profile.activity === a.key ? T.acc + "22" : "transparent",
        cursor: "pointer",
        width: "100%",
        textAlign: "left"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: profile.activity === a.key ? 700 : 400,
        color: profile.activity === a.key ? T.acc : T.text
      }
    }, a.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text3,
        marginTop: 2
      }
    }, a.desc));
  })), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "TDEE skalibrowane (opcjonalnie)"), /*#__PURE__*/React.createElement("div", {
    style: { background: T.surf2, borderRadius: 10, padding: 10, marginBottom: 4 }
  }, /*#__PURE__*/React.createElement("div", {
    style: { display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" }
  }, /*#__PURE__*/React.createElement("input", {
    value: profile.tdeeManual || "",
    onChange: function onChange(e) { return setProfile(_objectSpread(_objectSpread({}, profile), {}, { tdeeManual: e.target.value, tdeeCalibrationAppliedAt: "" })); },
    type: "number", min: "1200", max: "6000", step: "10", placeholder: "np. 2900 kcal", style: inp
  }), profile.tdeeManual ? /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() { return setProfile(_objectSpread(_objectSpread({}, profile), {}, { tdeeManual: "", tdeeCalibrationAppliedAt: "" })); },
    style: _objectSpread(_objectSpread({}, btnB), {}, { padding: "9px 10px" })
  }, "Wyczyść") : null), /*#__PURE__*/React.createElement("div", {
    style: { fontSize: 10, color: T.text3, lineHeight: 1.5, marginTop: 5 }
  }, profile.tdeeManual ? "✓ Używamy Twojego skalibrowanego TDEE zamiast mnożnika aktywności." : "Wzór daje tylko punkt startowy: " + calcFormulaTDEE(profile) + " kcal. Automatyczna analiza może zaproponować korektę dopiero po minimum 28 dniach wiarygodnych danych.")), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Cel kalorii względem TDEE"), function () {
    var adj = profile.tdeeAdjust || 0;
    var tdee = calcTDEE(profile);
    var resultKcal = tdee ? Math.round(tdee * (1 + adj / 100)) : null;
    var label = adj === 0 ? "⚖️ Utrzymanie" : adj < 0 ? "\uD83D\uDCC9 Deficyt ".concat(adj, "%") : "\uD83D\uDCC8 Nadwy\u017Cka +".concat(adj, "%");
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: adj < 0 ? T.acc2 : adj > 0 ? "#60a5fa" : T.acc,
        fontWeight: 700
      }
    }, label), resultKcal && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontFamily: "monospace",
        color: T.kcal,
        fontWeight: 700
      }
    }, resultKcal, " kcal")), /*#__PURE__*/React.createElement("input", {
      type: "range",
      min: "-30",
      max: "30",
      step: "5",
      value: adj,
      onChange: function onChange(e) {
        return setProfile(_objectSpread(_objectSpread({}, profile), {}, {
          tdeeAdjust: parseInt(e.target.value)
        }));
      },
      style: {
        width: "100%",
        accentColor: T.acc,
        height: 6,
        marginBottom: 4
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 10,
        color: T.text3
      }
    }, /*#__PURE__*/React.createElement("span", null, "-30%"), /*#__PURE__*/React.createElement("span", null, "-20%"), /*#__PURE__*/React.createElement("span", null, "-10%"), /*#__PURE__*/React.createElement("span", null, "0%"), /*#__PURE__*/React.createElement("span", null, "+10%"), /*#__PURE__*/React.createElement("span", null, "+20%"), /*#__PURE__*/React.createElement("span", null, "+30%")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 6,
        fontSize: 11,
        color: T.text3
      }
    }, adj <= -20 ? "Agresywna redukcja — uważaj na mięśnie" : adj < 0 ? "Deficyt względem TDEE — redukcja" : adj === 0 ? "Cel równy TDEE — utrzymanie wagi" : adj <= 15 ? "Nadwyżka względem TDEE — budowanie masy" : "Agresywna nadwyżka"));
  }(), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      textAlign: "center",
      fontSize: 11,
      color: T.text3
    }
  }, "\u2713 Zmiany zapisuj\u0105 si\u0119 automatycznie"), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Rozk\u0142ad makro"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginBottom: 10
    }
  }, [["auto", "🤖 Auto"], ["manual", "✏️ Ręczny"]].map(function (_ref21) {
    var _ref22 = _slicedToArray(_ref21, 2),
      v = _ref22[0],
      l = _ref22[1];
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      onClick: function onClick() {
        return setProfile(_objectSpread(_objectSpread({}, profile), {}, {
          macroMode: v
        }));
      },
      style: {
        flex: 1,
        padding: "9px 4px",
        borderRadius: 10,
        fontSize: 12,
        fontWeight: profile.macroMode === v ? 700 : 400,
        cursor: "pointer",
        border: "1px solid " + (profile.macroMode === v ? T.acc : T.border),
        background: profile.macroMode === v ? T.acc + "22" : "transparent",
        color: profile.macroMode === v ? T.acc : T.text2
      }
    }, l);
  })), profile.macroMode === "auto" && function () {
    var t = calcTargets(profile, todayDayMul);
    var kcal = t.kcal || 2800;
    var pProt = Math.round(t.protein * 4 / kcal * 100);
    var pFat = Math.round(t.fat * 9 / kcal * 100);
    var pCarb = Math.round(t.carbs * 4 / kcal * 100);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: T.surf2,
        borderRadius: 10,
        padding: "10px 12px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text3,
        marginBottom: 8
      }
    }, "Obliczane automatycznie (bia\u0142ko 2.2g/kg, t\u0142uszcz 25%, reszta w\u0119gle)"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6
      }
    }, [[pProt + "%", "Białko", t.protein + "g", T.prot], [pFat + "%", "Tłuszcz", t.fat + "g", T.fat], [pCarb + "%", "Węgle", t.carbs + "g", T.carbs]].map(function (_ref23) {
      var _ref24 = _slicedToArray(_ref23, 4),
        pct = _ref24[0],
        l = _ref24[1],
        g = _ref24[2],
        c = _ref24[3];
      return /*#__PURE__*/React.createElement("div", {
        key: l,
        style: {
          flex: 1,
          background: T.surf,
          borderRadius: 8,
          padding: "8px 6px",
          textAlign: "center"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 14,
          fontWeight: 700,
          color: c
        }
      }, pct), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: T.text2,
          marginTop: 1
        }
      }, g), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: T.text3
        }
      }, l));
    })));
  }(), profile.macroMode === "manual" && function () {
    var total = (parseFloat(profile.macroProt) || 0) + (parseFloat(profile.macroFat) || 0) + (parseFloat(profile.macroCarb) || 0);
    var kcal = calcTargets(profile, todayDayMul).kcal || 2800;
    var gProt = total > 0 ? Math.round(kcal * (parseFloat(profile.macroProt) || 0) / total / 4) : 0;
    var gFat = total > 0 ? Math.round(kcal * (parseFloat(profile.macroFat) || 0) / total / 9) : 0;
    var gCarb = total > 0 ? Math.round(kcal * (parseFloat(profile.macroCarb) || 0) / total / 4) : 0;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 8,
        marginBottom: 8
      }
    }, [["Białko %", "macroProt", T.prot], ["Tłuszcz %", "macroFat", T.fat], ["Węgle %", "macroCarb", T.carbs]].map(function (_ref25) {
      var _ref26 = _slicedToArray(_ref25, 3),
        l = _ref26[0],
        k = _ref26[1],
        c = _ref26[2];
      return /*#__PURE__*/React.createElement("div", {
        key: k
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: c,
          marginBottom: 4,
          textTransform: "uppercase",
          letterSpacing: 0.5
        }
      }, l), /*#__PURE__*/React.createElement("input", {
        value: profile[k],
        onChange: function onChange(e) {
          return setProfile(_objectSpread(_objectSpread({}, profile), {}, _defineProperty({}, k, e.target.value)));
        },
        type: "number",
        min: "5",
        max: "80",
        style: _objectSpread(_objectSpread({}, inp), {}, {
          textAlign: "center",
          fontFamily: "monospace",
          fontSize: 16,
          padding: "8px 4px",
          color: c
        })
      }));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        background: T.surf2,
        borderRadius: 10,
        padding: "8px 12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: total === 100 ? T.acc : T.acc2,
        fontWeight: 700
      }
    }, "Suma: ", total, "% ", total === 100 ? "✓" : "≠ 100%"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10
      }
    }, [[gProt + "g", "B", T.prot], [gFat + "g", "T", T.fat], [gCarb + "g", "W", T.carbs]].map(function (_ref27) {
      var _ref28 = _slicedToArray(_ref27, 3),
        g = _ref28[0],
        l = _ref28[1],
        c = _ref28[2];
      return /*#__PURE__*/React.createElement("span", {
        key: l,
        style: {
          fontSize: 11,
          fontFamily: "monospace",
          color: c
        }
      }, l, ":", g);
    }))));
  }(), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      borderTop: "1px solid " + T.border,
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: 1,
      color: T.text3,
      marginBottom: 10
    }
  }, "Pełna kopia zapasowa"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: exportData,
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      flex: 1,
      fontSize: 12,
      padding: "10px 8px"
    })
  }, "\u2B07 Pobierz kopię"), /*#__PURE__*/React.createElement("label", {
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      flex: 1,
      fontSize: 12,
      padding: "10px 8px",
      textAlign: "center",
      cursor: "pointer"
    })
  }, "\u2B06 Przywróć kopię", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".json,application/json",
    onChange: importData,
    style: {
      display: "none"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 10,
      color: T.text3,
      lineHeight: 1.5
    }
  }, "Kopia obejmuje profil, planer, pomiary, wodę, przepisy, produkty, ulubione, typy dni, listę zakupów i motyw. Przed importem wybierzesz scalanie albo pełne zastąpienie.")))), page === "woda" && function () {
    var selectedWaterDay = waterLog[waterDate] || {};
    var waterEntries = Array.isArray(selectedWaterDay.entries) ? selectedWaterDay.entries : [];
    var measurementDates = Object.keys(bodyLog || {}).filter(function (date) {
      return date <= waterDate && bodyLog[date] && Number(bodyLog[date].weight) > 0;
    }).sort();
    var latestMeasurement = measurementDates.length ? bodyLog[measurementDates[measurementDates.length - 1]] : null;
    var waterWeight = Number(latestMeasurement && latestMeasurement.weight || profile.weight || 0);
    var waterBase = Math.round((waterWeight > 0 ? waterWeight * 30 : profile.gender === "f" ? 2000 : 2500) / 50) * 50;
    var trainingMinutes = Math.max(0, Number(selectedWaterDay.trainingMinutes || 0));
    var heatLevel = selectedWaterDay.heat || "normal";
    var trainingExtra = Math.round(trainingMinutes * 7 / 50) * 50;
    var heatExtra = heatLevel === "hot" ? 600 : heatLevel === "warm" ? 300 : 0;
    var suggestedWaterTarget = Math.max(1500, Math.min(6000, waterBase + trainingExtra + heatExtra));
    var manualWaterTarget = Number(waterSettings.manualTarget || 0);
    var waterTarget = manualWaterTarget >= 500 ? manualWaterTarget : suggestedWaterTarget;
    var waterTotal = waterEntries.reduce(function (sum, entry) {
      return sum + Number(entry.ml || 0);
    }, 0);
    var waterPct = waterTarget > 0 ? Math.round(waterTotal / waterTarget * 100) : 0;
    var waterBarPct = Math.min(waterPct, 100);
    var waterRemaining = Math.max(waterTarget - waterTotal, 0);
    var waterOver = Math.max(waterTotal - waterTarget, 0);

    function updateWaterDay(field, value) {
      setWaterLog(function (previous) {
        var next = Object.assign({}, previous);
        var nextDay = Object.assign({
          entries: []
        }, previous[waterDate] || {});
        nextDay[field] = value;
        next[waterDate] = nextDay;
        return next;
      });
    }

    function addWaterAmount(amount) {
      var ml = Math.round(Number(amount));
      if (!ml || ml < 50 || ml > 2000) {
        toast_("Wpisz ilość od 50 do 2000 ml");
        return;
      }
      setWaterLog(function (previous) {
        var next = Object.assign({}, previous);
        var nextDay = Object.assign({
          entries: []
        }, previous[waterDate] || {});
        var previousEntries = Array.isArray(nextDay.entries) ? nextDay.entries : [];
        nextDay.entries = previousEntries.concat([{
          id: Date.now() + Math.random(),
          ml: ml,
          time: new Date().toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit"
          })
        }]);
        next[waterDate] = nextDay;
        return next;
      });
      setWaterCustom("");
      toast_("Dodano " + ml + " ml");
    }

    function undoLastWater() {
      if (!waterEntries.length) {
        toast_("Nie ma czego cofnąć");
        return;
      }
      setWaterLog(function (previous) {
        var next = Object.assign({}, previous);
        var nextDay = Object.assign({}, previous[waterDate] || {});
        nextDay.entries = (Array.isArray(nextDay.entries) ? nextDay.entries : []).slice(0, -1);
        next[waterDate] = nextDay;
        return next;
      });
      toast_("Cofnięto ostatni wpis");
    }

    function waterDayTarget(day) {
      var dayTraining = Math.max(0, Number(day && day.trainingMinutes || 0));
      var dayHeat = day && day.heat || "normal";
      var extraTraining = Math.round(dayTraining * 7 / 50) * 50;
      var extraHeat = dayHeat === "hot" ? 600 : dayHeat === "warm" ? 300 : 0;
      return manualWaterTarget >= 500 ? manualWaterTarget : Math.max(1500, Math.min(6000, waterBase + extraTraining + extraHeat));
    }

    var waterHistory = Array.from({
      length: 7
    }, function (_, index) {
      var date = new Date(TODAY + "T12:00:00");
      date.setDate(date.getDate() - index);
      var key = mfISODate(date);
      var day = waterLog[key] || {};
      var entries = Array.isArray(day.entries) ? day.entries : [];
      return {
        key: key,
        label: index === 0 ? "Dziś" : date.toLocaleDateString("pl-PL", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit"
        }),
        total: entries.reduce(function (sum, entry) {
          return sum + Number(entry.ml || 0);
        }, 0),
        target: waterDayTarget(day)
      };
    });

    var sectionCard = {
      background: T.surf,
      border: "1px solid " + T.border,
      borderRadius: 14,
      padding: 14,
      marginBottom: 12
    };
    var smallLabel = {
      fontSize: 10,
      color: T.text3,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 5
    };

    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageHeader, {
      eyebrow: "Codzienny nawyk",
      title: "Nawodnienie",
      subtitle: "Dodawaj wodę jednym ruchem i dopasuj cel do masy ciała, treningu oraz temperatury.",
      T: T
    }), /*#__PURE__*/React.createElement("div", {
      className: "mf-section-card",
      style: _objectSpread(_objectSpread({}, sectionCard), {}, {
        borderColor: T.acc
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: smallLabel
    }, "Wybrany dzień"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.text2
      }
    }, waterDate === TODAY ? "Dzisiaj" : waterDate)), /*#__PURE__*/React.createElement("input", {
      type: "date",
      className: "water-compact",
      value: waterDate,
      max: TODAY,
      onChange: function onChange(e) {
        return setWaterDate(e.target.value || TODAY);
      },
      style: _objectSpread(_objectSpread({}, inp), {}, {
        width: 140,
        padding: "8px 10px"
      })
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 26,
        lineHeight: 1.1,
        fontWeight: 700,
        color: T.acc
      }
    }, (waterTotal / 1000).toFixed(2).replace(".", ","), " / ", (waterTarget / 1000).toFixed(2).replace(".", ","), " l"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text3,
        marginTop: 5
      }
    }, waterOver > 0 ? "Cel przekroczony o " + waterOver + " ml" : "Zostało " + waterRemaining + " ml", " · ", waterPct, "%")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 9,
        background: T.surf2,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: waterBarPct + "%",
        height: "100%",
        borderRadius: 20,
        background: T.acc,
        transition: "width .2s ease"
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 7,
        marginBottom: 8
      }
    }, [250, 500, 750].map(function (amount) {
      return /*#__PURE__*/React.createElement("button", {
        key: amount,
        onClick: function onClick() {
          return addWaterAmount(amount);
        },
        style: _objectSpread(_objectSpread({}, btnA), {}, {
          padding: "9px 5px",
          fontSize: 12,
          fontWeight: 500
        })
      }, "+", amount, " ml");
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 7
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "number",
      className: "water-compact",
      min: "50",
      max: "2000",
      step: "50",
      value: waterCustom,
      placeholder: "Inna ilość (ml)",
      onChange: function onChange(e) {
        return setWaterCustom(e.target.value);
      },
      onKeyDown: function onKeyDown(e) {
        if (e.key === "Enter") addWaterAmount(waterCustom);
      },
      style: inp
    }), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return addWaterAmount(waterCustom);
      },
      style: _objectSpread(_objectSpread({}, btnA), {}, {
        whiteSpace: "nowrap",
        fontSize: 12,
        fontWeight: 500
      })
    }, "+ Dodaj"))), /*#__PURE__*/React.createElement("div", {
      className: "mf-section-card",
      style: sectionCard
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: 14,
        color: T.text
      }
    }, "Cel dzienny"), /*#__PURE__*/React.createElement("button", {
      onClick: undoLastWater,
      disabled: !waterEntries.length,
      style: _objectSpread(_objectSpread({}, btnB), {}, {
        padding: "7px 10px",
        fontSize: 11,
        opacity: waterEntries.length ? 1 : .5
      })
    }, "↶ Cofnij dolewkę")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("div", {
      style: smallLabel
    }, "Własny cel (ml)"), /*#__PURE__*/React.createElement("input", {
      type: "number",
      className: "water-compact",
      min: "500",
      max: "8000",
      step: "50",
      value: waterSettings.manualTarget || "",
      placeholder: suggestedWaterTarget + " (sugestia)",
      onChange: function onChange(e) {
        var value = e.target.value;
        setWaterSettings(function (previous) {
          return Object.assign({}, previous, {
            manualTarget: value
          });
        });
      },
      style: inp
    })), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("div", {
      style: smallLabel
    }, "Trening (min)"), /*#__PURE__*/React.createElement("input", {
      type: "number",
      className: "water-compact",
      min: "0",
      max: "300",
      step: "5",
      value: selectedWaterDay.trainingMinutes || "",
      placeholder: "0",
      onChange: function onChange(e) {
        return updateWaterDay("trainingMinutes", e.target.value);
      },
      style: inp
    }))), /*#__PURE__*/React.createElement("label", {
      style: {
        display: "block",
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: smallLabel
    }, "Temperatura / warunki"), /*#__PURE__*/React.createElement("select", {
      className: "water-compact",
      value: heatLevel,
      onChange: function onChange(e) {
        return updateWaterDay("heat", e.target.value);
      },
      style: inp
    }, /*#__PURE__*/React.createElement("option", {
      value: "normal"
    }, "Normalnie"), /*#__PURE__*/React.createElement("option", {
      value: "warm"
    }, "Ciepło (+300 ml)"), /*#__PURE__*/React.createElement("option", {
      value: "hot"
    }, "Upał (+600 ml)"))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: T.surf2,
        borderRadius: 10,
        padding: 10,
        fontSize: 11,
        lineHeight: 1.7,
        color: T.text2
      }
    }, /*#__PURE__*/React.createElement("div", null, "Baza: ", waterBase, " ml", waterWeight > 0 ? " przy " + waterWeight + " kg" : ""), /*#__PURE__*/React.createElement("div", null, "Trening: +", trainingExtra, " ml · Warunki: +", heatExtra, " ml"), /*#__PURE__*/React.createElement("div", {
      style: {
        color: T.acc,
        fontWeight: 600
      }
    }, manualWaterTarget >= 500 ? "Aktywny własny cel: " + manualWaterTarget + " ml" : "Sugerowany cel: " + suggestedWaterTarget + " ml")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        lineHeight: 1.45,
        marginTop: 8
      }
    }, "To orientacyjna sugestia, nie zalecenie medyczne. Potrzeby zależą też m.in. od jedzenia, zdrowia, pogody i intensywności wysiłku.")), /*#__PURE__*/React.createElement("div", {
      className: "mf-section-card",
      style: sectionCard
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: 14,
        color: T.text,
        marginBottom: 10
      }
    }, "Ostatnie 7 dni"), waterHistory.map(function (day) {
      var dayPct = day.target > 0 ? Math.round(day.total / day.target * 100) : 0;
      return /*#__PURE__*/React.createElement("button", {
        key: day.key,
        type: "button",
        "aria-pressed": day.key === waterDate,
        "aria-label": day.label + ": " + day.total + " z " + day.target + " mililitrów, " + dayPct + " procent",
        onClick: function onClick() {
          return setWaterDate(day.key);
        },
        style: {
          padding: "8px 0",
          borderBottom: day.key === waterHistory[waterHistory.length - 1].key ? "none" : "1px solid " + T.border,
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          background: "transparent",
          color: "inherit",
          width: "100%",
          cursor: "pointer"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          marginBottom: 5
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: day.key === waterDate ? T.acc : T.text2,
          fontWeight: day.key === waterDate ? 600 : 400
        }
      }, day.label), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: "monospace",
          fontSize: 11,
          color: T.text
        }
      }, day.total, " / ", day.target, " ml · ", dayPct, "%")), /*#__PURE__*/React.createElement("div", {
        style: {
          height: 5,
          borderRadius: 10,
          background: T.surf2,
          overflow: "hidden"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: Math.min(dayPct, 100) + "%",
          height: "100%",
          borderRadius: 10,
          background: dayPct >= 100 ? "#22c55e" : T.acc
        }
      })));
    })), waterEntries.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "mf-section-card",
      style: sectionCard
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: 14,
        color: T.text,
        marginBottom: 8
      }
    }, "Dolewki · ", waterDate), waterEntries.slice().reverse().map(function (entry) {
      return /*#__PURE__*/React.createElement("div", {
        key: entry.id,
        style: {
          display: "flex",
          justifyContent: "space-between",
          padding: "7px 0",
          borderBottom: "1px solid " + T.border,
          fontSize: 12,
          color: T.text2
        }
      }, /*#__PURE__*/React.createElement("span", null, entry.time || "—"), /*#__PURE__*/React.createElement("strong", {
        style: {
          color: T.acc
        }
      }, "+", entry.ml, " ml"));
    })));
  }(), page === "pomiary" && function () {
    var MEASURE_TIPS = {
      neck: "Mierz poziomo przez środek szyi, poniżej jabłka Adama.",
      chest: "Mierz poziomo przez najszersze miejsce klatki, przy wydechu.",
      waist: "Najwęższe miejsce tułowia, między żebrami a pępkiem. Przy normalnym wydechu.",
      belly: "Poziomo przez pępek. Stój prosto, normalny oddech.",
      hips: "Najszersze miejsce bioder i pośladków, stopy razem.",
      bicep: "Środek bicepsa napiętego, ramię poziomo.",
      forearm: "Najszersze miejsce przedramienia, tuż poniżej łokcia.",
      thigh: "Najszersze miejsce uda, stojąc z nogami lekko rozstawionymi.",
      calf: "Najszersze miejsce łydki, stojąc."
    };
    var MEASURES = [{
      key: "neck",
      label: "Szyja",
      unit: "cm",
      color: "#6b9bbf"
    }, {
      key: "chest",
      label: "Klatka",
      unit: "cm",
      color: "#7daa6e"
    }, {
      key: "waist",
      label: "Talia",
      unit: "cm",
      color: "#8fa3c4"
    }, {
      key: "belly",
      label: "Pas",
      unit: "cm",
      color: "#c4a45a"
    }, {
      key: "hips",
      label: "Biodra",
      unit: "cm",
      color: "#a07db5"
    }, {
      key: "bicep",
      label: "Biceps",
      unit: "cm",
      color: "#6aab8e"
    }, {
      key: "forearm",
      label: "Przedramię",
      unit: "cm",
      color: "#c47a5a"
    }, {
      key: "thigh",
      label: "Udo",
      unit: "cm",
      color: "#8b84c4"
    }, {
      key: "calf",
      label: "Łydka",
      unit: "cm",
      color: "#b56a7a"
    }];
    var selectedEntry = bodyLog[bodyDate] || {};
    var formData = Object.keys(bodyForm).length > 0 ? _objectSpread(_objectSpread({}, selectedEntry), bodyForm) : selectedEntry;
    var autoNavyBF = calcNavyBodyFat(profile, formData);
    function saveEntry() {
      var editableKeys = ["weight", "bfManual"].concat(MEASURES.map(function (measure) { return measure.key; }));
      var hasMeasurement = editableKeys.some(function (key) {
        return formData[key] !== undefined && formData[key] !== "";
      });
      if (!hasMeasurement) {
        toast_("Wpisz przynajmniej jeden pomiar");
        return;
      }
      var limits = {
        weight: [30, 350, "waga"],
        bfManual: [2, 60, "BF"],
        neck: [15, 100, "szyja"],
        chest: [30, 250, "klatka"],
        waist: [30, 250, "talia"],
        belly: [30, 250, "pas"],
        hips: [30, 250, "biodra"],
        bicep: [10, 100, "biceps"],
        forearm: [10, 80, "przedramię"],
        thigh: [20, 150, "udo"],
        calf: [15, 100, "łydka"]
      };
      var invalidKey = editableKeys.find(function (key) {
        if (formData[key] === undefined || formData[key] === "") return false;
        var value = parseFloat(formData[key]);
        var range = limits[key] || [1, 300, key];
        return !isFinite(value) || value < range[0] || value > range[1];
      });
      if (invalidKey) {
        toast_("Sprawdź pole: " + limits[invalidKey][2]);
        return;
      }
      var entry = _objectSpread(_objectSpread({}, formData), {}, {
        date: bodyDate
      });
      if (autoNavyBF) entry.bfNavy = String(autoNavyBF);
      entry.bf = entry.bfManual ? String(entry.bfManual) : autoNavyBF ? String(autoNavyBF) : "";
      setBodyLog(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, bodyDate, entry));
      });
      var latestExistingDate = Object.keys(bodyLog || {}).sort().pop();
      if (entry.weight && (!latestExistingDate || bodyDate >= latestExistingDate)) {
        setProfile(_objectSpread(_objectSpread({}, profile), {}, { weight: String(entry.weight) }));
      }
      setBodyForm({});
      setBodyDate(TODAY);
      toast_(bodyLog[bodyDate] ? "Pomiar zaktualizowany!" : "Pomiar zapisany!");
    }
    function editEntry(date, entry) {
      setBodyDate(date);
      setBodyForm(entry);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    function deleteEntry(date) {
      if (!window.confirm("Usunąć pomiar z " + new Date(date + "T12:00:00").toLocaleDateString("pl-PL") + "?")) return;
      setBodyLog(function (prev) {
        var next = _objectSpread({}, prev);
        delete next[date];
        return next;
      });
      if (bodyDate === date) {
        setBodyForm({});
        setBodyDate(TODAY);
      }
      toast_("Pomiar usunięty");
    }
    var sortedBodyEntries = Object.entries(bodyLog).filter(function (x) { return x[1] && Object.keys(x[1]).length; }).sort(function (a, b) { return a[0].localeCompare(b[0]); });
    var firstBody = sortedBodyEntries.length ? sortedBodyEntries[0] : null;
    var latestBody = sortedBodyEntries.length ? sortedBodyEntries[sortedBodyEntries.length - 1] : null;
    var previousBody = sortedBodyEntries.length > 1 ? sortedBodyEntries[sortedBodyEntries.length - 2] : null;
    function entryBf(entry) {
      return parseFloat(entry && entry.bfManual) || calcNavyBodyFat(profile, entry || {}) || parseFloat(entry && entry.bf) || 0;
    }
    function metricDelta(entry, reference, key) {
      var a = key === "bf" ? entryBf(entry) : parseFloat(entry && entry[key]);
      var b = key === "bf" ? entryBf(reference) : parseFloat(reference && reference[key]);
      return isFinite(a) && isFinite(b) ? Math.round((a - b) * 10) / 10 : null;
    }
    var weightData = Object.entries(bodyLog).filter(function (_ref29) {
      var _ref30 = _slicedToArray(_ref29, 2),
        e = _ref30[1];
      return e.weight !== undefined && e.weight !== "";
    }).sort(function (_ref31, _ref32) {
      var _ref33 = _slicedToArray(_ref31, 1),
        a = _ref33[0];
      var _ref34 = _slicedToArray(_ref32, 1),
        b = _ref34[0];
      return a.localeCompare(b);
    }).map(function (_ref35) {
      var _ref36 = _slicedToArray(_ref35, 2),
        date = _ref36[0],
        e = _ref36[1];
      return {
        date: mfFormatShortDate(date),
        value: parseFloat(e.weight)
      };
    });
    var bfData = Object.entries(bodyLog).filter(function (_ref37) {
      var _ref38 = _slicedToArray(_ref37, 2),
        e = _ref38[1];
      return entryBf(e) > 0;
    }).sort(function (_ref39, _ref40) {
      var _ref41 = _slicedToArray(_ref39, 1),
        a = _ref41[0];
      var _ref42 = _slicedToArray(_ref40, 1),
        b = _ref42[0];
      return a.localeCompare(b);
    }).map(function (_ref43) {
      var _ref44 = _slicedToArray(_ref43, 2),
        date = _ref44[0],
        e = _ref44[1];
      return {
        date: mfFormatShortDate(date),
        value: entryBf(e)
      };
    });
    var fatMassData = Object.entries(bodyLog).filter(function (item) {
      return parseFloat(item[1] && item[1].weight) > 0 && entryBf(item[1]) > 0;
    }).sort(function (a, b) {
      return a[0].localeCompare(b[0]);
    }).map(function (item) {
      var weight = parseFloat(item[1].weight);
      var bf = entryBf(item[1]);
      return {
        date: new Date(item[0] + "T12:00:00").toLocaleDateString("pl-PL", { day: "numeric", month: "short" }),
        value: r2(weight * bf / 100)
      };
    });
    var activeMeasure = MEASURES.find(function (m) {
      return m.key === activeChart;
    }) || MEASURES[0];
    var circumData = Object.entries(bodyLog).filter(function (_ref45) {
      var _ref46 = _slicedToArray(_ref45, 2),
        e = _ref46[1];
      return e[activeChart] !== undefined && e[activeChart] !== "";
    }).sort(function (_ref47, _ref48) {
      var _ref49 = _slicedToArray(_ref47, 1),
        a = _ref49[0];
      var _ref50 = _slicedToArray(_ref48, 1),
        b = _ref50[0];
      return a.localeCompare(b);
    }).map(function (_ref51) {
      var _ref52 = _slicedToArray(_ref51, 2),
        date = _ref52[0],
        e = _ref52[1];
      return {
        date: mfFormatShortDate(date),
        value: parseFloat(e[activeChart])
      };
    });
    var bodySpanDays = firstBody && latestBody ? mfDaysBetween(firstBody[0], latestBody[0]) : 0;
    var compositionEntries = sortedBodyEntries.filter(function (item) {
      return parseFloat(item[1].weight) > 0 && entryBf(item[1]) > 0;
    });
    var firstComposition = compositionEntries.length ? compositionEntries[0] : null;
    var latestComposition = compositionEntries.length ? compositionEntries[compositionEntries.length - 1] : null;
    var compositionSpanDays = firstComposition && latestComposition ? mfDaysBetween(firstComposition[0], latestComposition[0]) : 0;
    var firstWeight = firstComposition ? parseFloat(firstComposition[1].weight) : 0;
    var latestWeight = latestComposition ? parseFloat(latestComposition[1].weight) : 0;
    var firstBf = firstComposition ? entryBf(firstComposition[1]) : 0;
    var latestBf = latestComposition ? entryBf(latestComposition[1]) : 0;
    var bodyCompositionReady = compositionEntries.length >= 2 && compositionSpanDays >= 7 && firstWeight > 0 && latestWeight > 0 && firstBf > 0 && latestBf > 0;
    var totalBodyChange = bodyCompositionReady ? latestWeight - firstWeight : null;
    var fatMassStart = bodyCompositionReady ? firstWeight * firstBf / 100 : null;
    var fatMassLatest = bodyCompositionReady ? latestWeight * latestBf / 100 : null;
    var fatMassChange = bodyCompositionReady ? fatMassLatest - fatMassStart : null;
    var otherMassChange = bodyCompositionReady ? totalBodyChange - fatMassChange : null;
    var bodyCompositionConfidence = bodyCompositionReady && firstComposition[1].bfManual && latestComposition[1].bfManual ? "średnia" : "orientacyjna";
    function bodyMetric(entry, key) {
      if (key === "bf") return entryBf(entry);
      if (key === "belly") return parseFloat(entry && (entry.belly || entry.waist));
      return parseFloat(entry && entry[key]);
    }
    function bodyCorrelation(keyX, keyY) {
      var points = sortedBodyEntries.map(function (item) {
        return { date: item[0], pair: [bodyMetric(item[1], keyX), bodyMetric(item[1], keyY)] };
      }).filter(function (point) {
        return isFinite(point.pair[0]) && point.pair[0] > 0 && isFinite(point.pair[1]) && point.pair[1] > 0;
      });
      var pairSpan = points.length >= 2 ? mfDaysBetween(points[0].date, points[points.length - 1].date) : 0;
      var pairs = points.map(function (point) { return point.pair; });
      return { value: mfPearson(pairs), count: pairs.length, spanDays: pairSpan, ready: pairs.length >= 6 && pairSpan >= 42 };
    }
    var weightWaistCorrelation = bodyCorrelation("weight", "belly");
    var weightBfCorrelation = bodyCorrelation("weight", "bf");
    var waistBfCorrelation = bodyCorrelation("belly", "bf");
    var energyPairs = [];
    if (tdee > 0 && sortedBodyEntries.length >= 2) {
      for (var intervalIndex = 1; intervalIndex < sortedBodyEntries.length; intervalIndex++) {
        var intervalStart = sortedBodyEntries[intervalIndex - 1];
        var intervalEnd = sortedBodyEntries[intervalIndex];
        var intervalDays = mfDaysBetween(intervalStart[0], intervalEnd[0]);
        var intervalStartWeight = parseFloat(intervalStart[1].weight);
        var intervalEndWeight = parseFloat(intervalEnd[1].weight);
        if (!intervalStartWeight || !intervalEndWeight || intervalDays < 3 || intervalDays > 35) continue;
        var intervalDeficit = 0;
        var loggedDays = 0;
        for (var intervalDay = 1; intervalDay <= intervalDays; intervalDay++) {
          var intervalDate = mfShiftISO(intervalStart[0], intervalDay);
          var intervalMeals = planer[intervalDate];
          if (!Array.isArray(intervalMeals) || !intervalMeals.length) continue;
          var intervalKcal = intervalMeals.reduce(function (sum, meal) {
            return sum + (parseFloat(meal.kcal) || 0);
          }, 0);
          var intervalDayType = dayTypes[intervalDate] || "training";
          var intervalMultiplier = (DAY_TYPES.find(function (type) { return type.key === intervalDayType; }) || DAY_TYPES[0]).mul;
          intervalDeficit += tdee * intervalMultiplier - intervalKcal;
          loggedDays++;
        }
        var intervalCoverage = loggedDays / intervalDays;
        if (intervalCoverage >= 0.7) {
          energyPairs.push([intervalDeficit / loggedDays, (intervalStartWeight - intervalEndWeight) * 7 / intervalDays]);
        }
      }
    }
    var energyCorrelation = {
      value: mfPearson(energyPairs),
      count: energyPairs.length,
      ready: energyPairs.length >= 4 && bodySpanDays >= 42
    };
    var correlationCards = [{
      title: "Waga ↔ pas",
      result: weightWaistCorrelation,
      required: 6,
      hint: "Czy spadek masy idzie w parze ze zmianą obwodu pasa."
    }, {
      title: "Waga ↔ BF",
      result: weightBfCorrelation,
      required: 6,
      hint: "Zależność masy ciała i szacowanego poziomu tłuszczu."
    }, {
      title: "Pas ↔ BF",
      result: waistBfCorrelation,
      required: 6,
      hint: "Pomaga ocenić, czy trend BF zgadza się z obwodami."
    }, {
      title: "Deficyt ↔ tempo",
      result: energyCorrelation,
      required: 4,
      hint: "Na podstawie wpisanych kcal; wymagane ≥70% dni między pomiarami."
    }];
    function miniChart(data, color, unit) {
      if (data.length < 1) return /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: "center",
          padding: "16px 0",
          color: T.text3,
          fontSize: 11
        }
      }, "Brak wpis\xF3w");
      if (data.length < 2) return /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: "center",
          padding: "16px 0"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: "monospace",
          fontSize: 18,
          color: color,
          fontWeight: 700
        }
      }, data[0].value, " ", unit), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: T.text3,
          marginTop: 4
        }
      }, data[0].date, " \xB7 Dodaj kolejny wpis \u017Ceby zobaczy\u0107 trend"));
      var vals = data.map(function (d) {
          return d.value;
        }),
        mn = Math.min.apply(Math, _toConsumableArray(vals)),
        mx = Math.max.apply(Math, _toConsumableArray(vals)),
        pd = (mx - mn) * 0.15 || 0.5;
      return /*#__PURE__*/React.createElement(ResponsiveContainer, {
        width: "100%",
        height: 160
      }, /*#__PURE__*/React.createElement(LineChart, {
        data: data,
        margin: {
          top: 4,
          right: 12,
          left: 0,
          bottom: 4
        }
      }, /*#__PURE__*/React.createElement(CartesianGrid, {
        strokeDasharray: "3 3",
        stroke: T.border
      }), /*#__PURE__*/React.createElement(XAxis, {
        dataKey: "date",
        tick: {
          fontSize: 9,
          fill: T.text3
        },
        interval: "preserveStartEnd"
      }), /*#__PURE__*/React.createElement(YAxis, {
        domain: [mn - pd, mx + pd],
        tick: {
          fontSize: 9,
          fill: T.text3
        },
        width: 36
      }), /*#__PURE__*/React.createElement(Tooltip, {
        contentStyle: {
          background: T.surf2,
          border: "1px solid " + T.border,
          borderRadius: 8,
          fontSize: 11
        },
        labelStyle: {
          color: T.text2
        },
        itemStyle: {
          color: color
        },
        formatter: function formatter(v) {
          return [v + " " + unit];
        }
      }), /*#__PURE__*/React.createElement(Line, {
        type: "monotone",
        dataKey: "value",
        stroke: color,
        strokeWidth: 2,
        dot: {
          fill: color,
          r: 3
        },
        activeDot: {
          r: 5
        }
      })));
    }
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageHeader, {
      eyebrow: "Postęp bez zgadywania",
      title: "Pomiary ciała",
      subtitle: "Zapisuj wagę i obwody. MatFit pokaże trend, skład zmiany masy oraz ostrożne korelacje.",
      T: T
    }), !latestBody && /*#__PURE__*/React.createElement(EmptyState, {
      icon: "↗",
      title: "Zacznij od pierwszego pomiaru",
      copy: "Wpisz przynajmniej wagę. Pas i szyja pozwolą dodatkowo śledzić orientacyjny BF oraz masę tłuszczową.",
      T: T
    }), latestBody && function () {
      var latestEntry = latestBody[1];
      var metrics = [["weight", "Waga", "kg", "#8fa3c4"], ["belly", "Pas", "cm", "#c4a45a"], ["bf", "BF", "%", "#7daa6e"]];
      return /*#__PURE__*/React.createElement("div", {
        className: "mf-section-card",
        style: { background: T.surf, border: "1px solid " + T.acc, borderRadius: 14, padding: 12, marginBottom: 10 }
      }, /*#__PURE__*/React.createElement("div", {
        style: { display: "flex", justifyContent: "space-between", marginBottom: 8, alignItems: "center" }
      }, /*#__PURE__*/React.createElement("b", { style: { fontSize: 12, color: T.text } }, "Podsumowanie zmian"), /*#__PURE__*/React.createElement("span", { style: { fontSize: 9, color: T.text3 } }, "ostatni pomiar: ", new Date(latestBody[0] + "T12:00:00").toLocaleDateString("pl-PL"))), /*#__PURE__*/React.createElement("div", {
        style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }
      }, metrics.map(function (m) {
        var key = m[0], label = m[1], unit = m[2], color = m[3];
        var value = key === "bf" ? entryBf(latestEntry) : parseFloat(latestEntry[key]);
        if (!isFinite(value)) return /*#__PURE__*/React.createElement("div", { key: key, style: { background: T.surf2, borderRadius: 8, padding: 8, textAlign: "center", color: T.text3, fontSize: 10 } }, label, ": —");
        var prevDelta = previousBody ? metricDelta(latestEntry, previousBody[1], key) : null;
        var startDelta = firstBody && firstBody[0] !== latestBody[0] ? metricDelta(latestEntry, firstBody[1], key) : null;
        var fmt = function fmt(v) { return v === null ? "—" : (v > 0 ? "+" : "") + v.toFixed(1); };
        return /*#__PURE__*/React.createElement("div", { key: key, style: { background: T.surf2, borderRadius: 8, padding: "8px 5px", textAlign: "center" } }, /*#__PURE__*/React.createElement("div", { style: { fontSize: 9, color: T.text3 } }, label), /*#__PURE__*/React.createElement("div", { style: { fontFamily: "monospace", fontSize: 16, fontWeight: 800, color: color, margin: "2px 0" } }, value.toFixed(1), unit), /*#__PURE__*/React.createElement("div", { style: { fontSize: 8, color: T.text3, lineHeight: 1.4 } }, "poprz.: ", fmt(prevDelta), /*#__PURE__*/React.createElement("br"), "start: ", fmt(startDelta)));
      })));
    }(), latestBody ? /*#__PURE__*/React.createElement("div", {
      style: { background: T.surf, border: "1px solid " + T.border, borderRadius: 14, padding: 12, marginBottom: 10 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }
    }, /*#__PURE__*/React.createElement("b", { style: { fontSize: 12, color: T.text } }, "Skład zmiany masy"), /*#__PURE__*/React.createElement("span", { style: { fontSize: 8, color: T.text3 } }, bodyCompositionReady ? bodyCompositionConfidence + " wiarygodność" : "potrzeba więcej danych")), bodyCompositionReady ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }
    }, [[totalBodyChange, "Masa łącznie", "#8fa3c4"], [fatMassChange, "Tłuszcz — szac.", "#7daa6e"], [otherMassChange, "Pozostała masa*", "#c4a45a"]].map(function (item) {
      var value = item[0], label = item[1], color = item[2];
      return /*#__PURE__*/React.createElement("div", { key: label, style: { background: T.surf2, borderRadius: 8, padding: "8px 4px", textAlign: "center" } }, /*#__PURE__*/React.createElement("div", { style: { fontFamily: "monospace", fontWeight: 800, fontSize: 15, color: color } }, value > 0 ? "+" : "", value.toFixed(1), " kg"), /*#__PURE__*/React.createElement("div", { style: { fontSize: 8, color: T.text3, marginTop: 3, lineHeight: 1.2 } }, label));
    })), /*#__PURE__*/React.createElement("div", { style: { fontSize: 8, color: T.text3, lineHeight: 1.4, marginTop: 7 } }, mfFormatDate(firstComposition[0]), " → ", mfFormatDate(latestComposition[0]), ". *To nie jest „utrata mięśni”: ta wartość obejmuje wodę, glikogen i całą masę beztłuszczową. BF z obwodów lub wagi jest szacunkiem, dlatego patrzymy na trend.")) : /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 10, color: T.text3, lineHeight: 1.45, background: T.surf2, borderRadius: 8, padding: 9 }
    }, "Dodaj co najmniej dwa kompletne pomiary w odstępie 7 dni: waga + BF ręczny albo waga, pas i szyja", profile.gender === "f" ? " + biodra" : "", ". Wtedy MatFit oszacuje zmianę tłuszczu bez udawania laboratoryjnej dokładności.")) : null, /*#__PURE__*/React.createElement("div", {
      className: "mf-section-card",
      style: {
        background: T.surf,
        border: "1px solid " + T.border,
        borderRadius: 14,
        padding: 14,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10 }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 9, textTransform: "uppercase", letterSpacing: 1, color: T.text3, marginBottom: 3 }
    }, "Data pomiaru"), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 10, color: bodyLog[bodyDate] ? T.acc : T.text3 }
    }, bodyLog[bodyDate] ? "Edytujesz zapisany wpis" : "Nowy wpis")), /*#__PURE__*/React.createElement("input", {
      type: "date", value: bodyDate, max: TODAY,
      onChange: function onChange(e) { setBodyDate(e.target.value || TODAY); setBodyForm({}); },
      style: _objectSpread(_objectSpread({}, inp), {}, { width: 145, padding: "7px 8px", fontSize: 11 })
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 6,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: T.text3,
        marginBottom: 2
      }
    }, "\u2696\uFE0F Waga (kg)"), /*#__PURE__*/React.createElement("input", {
      value: formData.weight || "",
      onChange: function onChange(e) {
        return setBodyForm(function (f) {
          return _objectSpread(_objectSpread({}, f), {}, {
            weight: e.target.value
          });
        });
      },
      type: "number",
      min: "30",
      max: "350",
      step: "0.1",
      inputMode: "decimal",
      placeholder: "\u2014",
      style: _objectSpread(_objectSpread({}, inp), {}, {
        padding: "6px 8px",
        fontSize: 13,
        fontFamily: "monospace",
        textAlign: "center"
      })
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        color: T.text3,
        marginBottom: 2
      }
    }, "\uD83D\uDCCA BF% ręczny ", autoNavyBF && /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#7daa6e",
        fontWeight: 700
      }
    }, "Navy: ", autoNavyBF, "%")), /*#__PURE__*/React.createElement("input", {
      value: formData.bfManual || "",
      onChange: function onChange(e) { return setBodyForm(function (f) { return _objectSpread(_objectSpread({}, f), {}, { bfManual: e.target.value }); }); },
      type: "number", min: "2", max: "60", step: "0.1", placeholder: autoNavyBF ? "Navy " + autoNavyBF + "%" : "opcjonalnie",
      style: _objectSpread(_objectSpread({}, inp), {}, {
        padding: "6px 8px",
        fontSize: 13,
        fontFamily: "monospace",
        textAlign: "center",
        color: formData.bfManual ? T.acc : T.text3
      })
    }))), [0, 2, 4, 6, 8].map(function (i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
          marginBottom: 6
        }
      }, MEASURES.slice(i, i + 2).map(function (m) {
        return /*#__PURE__*/React.createElement("div", {
          key: m.key
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 9,
            color: T.text3,
            marginBottom: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }
        }, /*#__PURE__*/React.createElement("span", null, m.label, " (cm)"), /*#__PURE__*/React.createElement("span", {
          title: MEASURE_TIPS[m.key] || "",
          style: {
            cursor: "help",
            color: T.text3,
            fontSize: 9
          }
        }, "\u2139\uFE0F")), /*#__PURE__*/React.createElement("input", {
          value: formData[m.key] || "",
          onChange: function onChange(e) {
            return setBodyForm(function (f) {
              return _objectSpread(_objectSpread({}, f), {}, _defineProperty({}, m.key, e.target.value));
            });
          },
          type: "number",
          min: "10",
          max: "250",
          step: "0.1",
          inputMode: "decimal",
          placeholder: "\u2014",
          style: _objectSpread(_objectSpread({}, inp), {}, {
            padding: "6px 8px",
            fontSize: 13,
            fontFamily: "monospace",
            textAlign: "center"
          })
        }), MEASURE_TIPS[m.key] && /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 8,
            color: T.text3,
            marginTop: 2,
            lineHeight: 1.3
          }
        }, MEASURE_TIPS[m.key]));
      }));
    }), !profile.height && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "#c4a45a",
        marginTop: 4
      }
    }, "\u26A0\uFE0F Uzupe\u0142nij wzrost w Profilu \u2192 auto BF%"))), /*#__PURE__*/React.createElement("button", {
      onClick: saveEntry,
      style: _objectSpread(_objectSpread({}, btnA), {}, {
        width: "100%",
        marginTop: 10
      })
    }, bodyLog[bodyDate] ? "\uD83D\uDCBE Zaktualizuj wpis" : "\uD83D\uDCBE Zapisz wpis")), weightData.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        background: T.surf,
        border: "1px solid " + T.border,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: T.text2,
        marginBottom: 8
      }
    }, "\u2696\uFE0F Waga (kg)"), miniChart(weightData, "#8fa3c4", "kg")), bfData.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        background: T.surf,
        border: "1px solid " + T.border,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: T.text2,
        marginBottom: 8
      }
    }, "\uD83D\uDCCA BF%"), miniChart(bfData, "#7daa6e", "%")), fatMassData.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        background: T.surf,
        border: "1px solid " + T.border,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 12, fontWeight: 700, color: T.text2, marginBottom: 3 }
    }, "🟢 Szacowana masa tłuszczowa (kg)"), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 8, color: T.text3, marginBottom: 8, lineHeight: 1.35 }
    }, "Wyliczenie: masa ciała × BF%. To trend orientacyjny, nie pomiar DEXA."), miniChart(fatMassData, "#6aab8e", "kg")), circumData.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        background: T.surf,
        border: "1px solid " + T.border,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: T.text2,
        marginBottom: 8
      }
    }, "\uD83D\uDCCF Obwody (cm)"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 5,
        flexWrap: "wrap",
        marginBottom: 10
      }
    }, MEASURES.map(function (m) {
      return /*#__PURE__*/React.createElement("button", {
        key: m.key,
        onClick: function onClick() {
          return setActiveChart(m.key);
        },
        style: {
          padding: "4px 9px",
          borderRadius: 20,
          fontSize: 10,
          cursor: "pointer",
          border: "1px solid " + (activeChart === m.key ? m.color : T.border),
          background: activeChart === m.key ? m.color + "33" : "transparent",
          color: activeChart === m.key ? m.color : T.text3,
          fontWeight: activeChart === m.key ? 700 : 400
        }
      }, m.label);
    })), miniChart(circumData, activeMeasure.color, "cm")), sortedBodyEntries.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: { background: T.surf, border: "1px solid " + T.border, borderRadius: 14, padding: 12, marginBottom: 10 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }
    }, /*#__PURE__*/React.createElement("b", { style: { fontSize: 12, color: T.text } }, "🔎 Analiza zależności"), /*#__PURE__*/React.createElement("span", { style: { fontSize: 8, color: T.text3 } }, "minimum 4–6 serii / 42 dni")), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 9, color: T.text3, lineHeight: 1.4, marginBottom: 8 }
    }, "MatFit odblokowuje wynik dopiero przy wystarczającej historii. Dzięki temu pojedynczy skok wody nie zostaje ogłoszony odkryciem naukowym."), /*#__PURE__*/React.createElement("div", {
      style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }
    }, correlationCards.map(function (card) {
      var result = card.result;
      var valueReady = result.ready && typeof result.value === "number" && isFinite(result.value);
      var signedValue = valueReady ? (result.value > 0 ? "+" : "") + result.value.toFixed(2) : "";
      return /*#__PURE__*/React.createElement("div", {
        key: card.title,
        style: { background: T.surf2, borderRadius: 9, padding: 9, minHeight: 80 }
      }, /*#__PURE__*/React.createElement("div", { style: { fontSize: 10, fontWeight: 800, color: T.text2 } }, card.title), valueReady ? /*#__PURE__*/React.createElement("div", {
        style: { fontFamily: "monospace", fontSize: 13, fontWeight: 800, color: T.acc, margin: "5px 0 3px" }
      }, "r ", signedValue, " · ", mfCorrelationLabel(result.value)) : /*#__PURE__*/React.createElement("div", {
        style: { fontSize: 9, fontWeight: 700, color: T.acc2, margin: "5px 0 3px" }
      }, result.ready ? "Brak zróżnicowania danych" : result.count + "/" + card.required + " wymaganych serii"), /*#__PURE__*/React.createElement("div", { style: { fontSize: 8, color: T.text3, lineHeight: 1.35 } }, card.hint));
    })), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 8, color: T.text3, marginTop: 7, lineHeight: 1.35 }
    }, "Współczynnik r opisuje współwystępowanie zmian, nie dowodzi przyczyny. Deficyt jest liczony z obecnego TDEE i dni z wpisanym jedzeniem.")), Object.keys(bodyLog).length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: 1,
        color: T.text3,
        marginBottom: 8
      }
    }, "Historia"), Object.entries(bodyLog).sort(function (_ref53, _ref54) {
      var _ref55 = _slicedToArray(_ref53, 1),
        a = _ref55[0];
      var _ref56 = _slicedToArray(_ref54, 1),
        b = _ref56[0];
      return b.localeCompare(a);
    }).slice(0, 15).map(function (_ref57) {
      var _ref58 = _slicedToArray(_ref57, 2),
        date = _ref58[0],
        entry = _ref58[1];
      var historyBf = entryBf(entry);
      var historyBfMethod = entry.bfManual ? "ręczny" : "Navy";
      return /*#__PURE__*/React.createElement("div", {
        key: date,
        style: {
          background: T.surf,
          border: "1px solid " + T.border,
          borderRadius: 10,
          padding: "10px 12px",
          marginBottom: 6
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          fontWeight: 700,
          color: T.text2,
          marginBottom: 5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }
      }, /*#__PURE__*/React.createElement("span", null, new Date(date + "T12:00:00").toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })), /*#__PURE__*/React.createElement("span", { style: { display: "flex", gap: 5 } }, /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() { return editEntry(date, entry); },
        style: _objectSpread(_objectSpread({}, btnB), {}, { padding: "4px 7px", fontSize: 9 })
      }, "Edytuj"), /*#__PURE__*/React.createElement("button", {
        onClick: function onClick() { return deleteEntry(date); },
        style: { border: "1px solid " + T.acc2 + "66", background: "transparent", color: T.acc2, borderRadius: 7, padding: "4px 7px", fontSize: 9, cursor: "pointer" }
      }, "Usuń"))), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: 4
        }
      }, entry.weight && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          padding: "2px 6px",
          borderRadius: 5,
          background: T.surf2,
          color: T.text2,
          fontFamily: "monospace"
        }
      }, "\u2696\uFE0F ", entry.weight, "kg"), historyBf > 0 && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          padding: "2px 6px",
          borderRadius: 5,
          background: T.surf2,
          color: "#7daa6e",
          fontFamily: "monospace"
        }
      }, "BF ", historyBf.toFixed(1), "% · ", historyBfMethod), MEASURES.filter(function (m) {
        return entry[m.key] !== undefined && entry[m.key] !== "";
      }).map(function (m) {
        return /*#__PURE__*/React.createElement("span", {
          key: m.key,
          style: {
            fontSize: 10,
            padding: "2px 6px",
            borderRadius: 5,
            background: T.surf2,
            color: m.color,
            fontFamily: "monospace"
          }
        }, m.label, ": ", entry[m.key]);
      })));
    })));
  }()), /*#__PURE__*/React.createElement("nav", {
    className: "mf-bottom-nav",
    "aria-label": "Główna nawigacja mobilna",
    style: {
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 430,
      height: 64,
      background: T.navbg,
      borderTop: "1px solid " + T.border,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      zIndex: 100
    }
  }, [["profil", "Profil", "◎"], ["pomiary", "Pom.", "↗"], ["woda", "Woda", "◒"], ["planer", "Planer", "▦"], ["przepisy", "Przepisy", "◇"], ["produkty", "Prod.", "▤"], ["zakupy", "Zakupy", "✓"]].map(function (_ref59) {
    var _ref60 = _slicedToArray(_ref59, 3),
      id = _ref60[0],
      label = _ref60[1],
      icon = _ref60[2];
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      type: "button",
      className: "mf-bottom-item",
      "aria-label": id === "pomiary" ? "Pomiary" : id === "produkty" ? "Produkty" : label,
      "aria-current": page === id ? "page" : undefined,
      onClick: function onClick() {
        return navigateToPage(id);
      },
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        cursor: "pointer",
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "mf-bottom-icon",
      "aria-hidden": "true",
      style: {
        color: page === id ? T.acc : T.text3
      }
    }, icon), /*#__PURE__*/React.createElement("span", {
      className: "mf-bottom-label",
      style: {
        color: page === id ? T.acc : T.text3,
        fontWeight: page === id ? 700 : 400,
        textAlign: "center"
      }
    }, label));
  })), modal === "addProd" && /*#__PURE__*/React.createElement(Modal, {
    title: "Dodaj produkt",
    onClose: function onClose() {
      return setModal(null);
    },
    T: T
  }, /*#__PURE__*/React.createElement(Lbl, {
    mt: 0,
    T: T
  }, "Dzie\u0144"), /*#__PURE__*/React.createElement(DS, {
    value: addDay,
    onChange: setAddDay,
    week: week,
    T: T,
    inp: inp
  }), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Pora dnia"), /*#__PURE__*/React.createElement(MealTimePicker, {
    value: addMealTime,
    onChange: setAddMealTime
  }), !selP && !modalProdSearch && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(QuickProductRow, {
    label: "⭐ Ulubione",
    items: favoriteProductList
  }), /*#__PURE__*/React.createElement(QuickProductRow, {
    label: "Ostatnio używane",
    items: recentProductList
  })), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Szukaj produktu"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: modalProdSearch,
    "aria-label": "Szukaj produktu do posiłku",
    onChange: function onChange(e) {
      setModalProdSearch(e.target.value);
      setSelP("");
    },
    placeholder: "Wpisz nazw\u0119...",
    style: _objectSpread(_objectSpread({}, inp), {}, {
      flex: 1
    }),
    autoFocus: true
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Skanuj kod kreskowy produktu",
    onClick: function onClick() {
      setScanResult(null);
      setScanError("");
      setLastScanEan("");
      setModal("scanBarcode");
    },
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      padding: "10px 12px",
      fontSize: 18,
      flexShrink: 0
    }),
    title: "Skanuj kod kreskowy"
  }, "\uD83D\uDCF7")), modalProdSearch.length > 0 && !selP && function () {
    var modalSearchNeedle = modalProdSearch.toLowerCase();
    var hits = products.filter(function (p) {
      return [p.name, p.brand, p.state].some(function (value) {
        return String(value || "").toLowerCase().includes(modalSearchNeedle);
      });
    }).slice(0, 8);
    if (!hits.length) return /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: T.text3,
        padding: "8px 0"
      }
    }, "Brak wynik\xF3w");
    return /*#__PURE__*/React.createElement("div", {
      style: {
        borderRadius: 10,
        border: "1px solid " + T.border,
        overflow: "hidden",
        marginTop: 4
      }
    }, hits.map(function (p, i) {
      return /*#__PURE__*/React.createElement("button", {
        key: p.id,
        type: "button",
        onClick: function onClick() {
          selectPlannerProduct(p);
        },
        style: {
          padding: "10px 12px",
          borderBottom: i < hits.length - 1 ? "1px solid " + T.border : "none",
          cursor: "pointer",
          background: T.surf2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          color: "inherit",
          textAlign: "left"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 13,
          color: T.text
        }
      }, p.emoji, " ", p.name, p.state ? " · " + p.state : p.brand && p.brand !== "—" ? " · " + p.brand : ""), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          fontFamily: "monospace",
          color: T.kcal
        }
      }, p.kcal, " kcal"));
    }));
  }(), !selP && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setPf({
        name: modalProdSearch.trim(),
        emoji: "",
        brand: "",
        ean: "",
        kcal: "",
        protein: "",
        carbs: "",
        fat: "",
        sugars: "",
        fiber: "",
        saturatedFat: "",
        salt: "",
        packageSize: ""
      });
      setModal("newProdFromPlanner");
    },
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      width: "100%",
      marginTop: 8,
      borderColor: T.acc,
      color: T.acc,
      fontWeight: 700
    })
  }, "+ Dodaj nowy produkt"), selP && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "6px 0 2px",
      fontSize: 12,
      color: T.acc
    }
  }, "\u2713 ", (_products$find = products.find(function (x) {
    return x.id === selP;
  })) === null || _products$find === void 0 ? void 0 : _products$find.name, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": isProductFavorite(selP) ? "Usuń wybrany produkt z ulubionych" : "Dodaj wybrany produkt do ulubionych",
    "aria-pressed": isProductFavorite(selP),
    onClick: function onClick() {
      return toggleProductFavorite(selP);
    },
    style: {
      marginLeft: 8,
      padding: "3px 7px",
      border: "1px solid " + T.border,
      borderRadius: 8,
      background: isProductFavorite(selP) ? T.acc + "22" : "transparent",
      color: isProductFavorite(selP) ? T.acc : T.text3,
      cursor: "pointer"
    }
  }, isProductFavorite(selP) ? "★" : "☆")), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Gramatura (g)"), /*#__PURE__*/React.createElement("div", {
    role: "group",
    "aria-label": "Szybki wybór gramatury",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 5,
      marginBottom: 7
    }
  }, [50, 100, 150, 200].map(function (grams) {
    var active = parseFloat(selG) === grams;
    return /*#__PURE__*/React.createElement("button", {
      key: grams,
      type: "button",
      "aria-pressed": active,
      onClick: function onClick() {
        return setSelG(String(grams));
      },
      style: {
        minHeight: 36,
        border: "1px solid " + (active ? T.acc : T.border),
        borderRadius: 9,
        background: active ? T.acc + "22" : T.surf2,
        color: active ? T.acc : T.text2,
        fontSize: 11,
        fontWeight: active ? 800 : 600,
        cursor: "pointer"
      }
    }, grams, " g");
  })), /*#__PURE__*/React.createElement("input", {
    value: selG,
    onChange: function onChange(e) {
      return setSelG(e.target.value);
    },
    type: "number",
    min: "1",
    style: inp
  }), /*#__PURE__*/React.createElement(ProdPreview, {
    selP: selP,
    selG: selG,
    products: products,
    showDetails: showNutritionDetails,
    T: T
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setModal(null);
    },
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      flex: 1
    })
  }, "Anuluj"), /*#__PURE__*/React.createElement("button", {
    onClick: addProd,
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      flex: 2
    })
  }, "Dodaj do planera"))), modal === "addRecipeSearch" && /*#__PURE__*/React.createElement(Modal, {
    title: "Dodaj przepis",
    onClose: function onClose() {
      return setModal(null);
    },
    T: T
  }, /*#__PURE__*/React.createElement(Lbl, {
    mt: 0,
    T: T
  }, "Dzie\u0144"), /*#__PURE__*/React.createElement(DS, {
    value: addDay,
    onChange: setAddDay,
    week: week,
    T: T,
    inp: inp
  }), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Pora dnia"), /*#__PURE__*/React.createElement(MealTimePicker, {
    value: addMealTime,
    onChange: setAddMealTime
  }), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Szukaj lub wybierz przepis"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: modalProdSearch,
    "aria-label": "Szukaj przepisu do planera",
    onChange: function onChange(e) {
      setModalProdSearch(e.target.value);
      setSelRId("");
      setSelRPortions("1");
      setSelRItems(null);
      setShowRecipeList(false);
    },
    onFocus: function onFocus() {
      if (!modalProdSearch) setShowRecipeList(true);
    },
    placeholder: "Wpisz nazw\u0119...",
    style: inp,
    autoFocus: true
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": showRecipeList ? "Zwiń listę przepisów" : "Rozwiń listę przepisów",
    "aria-expanded": showRecipeList,
    onClick: function onClick() {
      return setShowRecipeList(function (v) {
        return !v;
      });
    },
    style: {
      position: "absolute",
      right: 8,
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: 14,
      color: T.text3,
      padding: "4px 6px"
    }
  }, showRecipeList ? "▲" : "▼"), (showRecipeList || modalProdSearch.length > 0) && function () {
    var base = modalProdSearch.length > 0 ? recipes.filter(function (r) {
      return r.name.toLowerCase().includes(modalProdSearch.toLowerCase());
    }) : recipes;
    // Ulubione na górze
    var hits = [].concat(_toConsumableArray(base.filter(function (r) {
      return isFav(r.id);
    })), _toConsumableArray(base.filter(function (r) {
      return !isFav(r.id);
    })));
    if (!hits.length) return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: "calc(100% + 4px)",
        left: 0,
        right: 0,
        zIndex: 999,
        background: T.surf,
        border: "1px solid " + T.border,
        borderRadius: 10,
        padding: "10px 12px",
        fontSize: 12,
        color: T.text3
      }
    }, "Brak przepis\xF3w");
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: "calc(100% + 4px)",
        left: 0,
        right: 0,
        zIndex: 999,
        background: T.surf,
        border: "1px solid " + T.border,
        borderRadius: 10,
        overflow: "hidden",
        maxHeight: 240,
        overflowY: "auto",
        boxShadow: "0 8px 24px rgba(0,0,0,.4)"
      }
    }, hits.map(function (r, i) {
      var m = recipeM(r);
      var selected = selRId === String(r.id);
      var fav = isFav(r.id);
      return /*#__PURE__*/React.createElement("button", {
        key: String(r.id),
        type: "button",
        "aria-pressed": selected,
        onClick: function onClick() {
          setSelRId(selected ? "" : String(r.id));
          setSelRPortions("1");
          setSelRItems(null);
          setShowRecipeList(false);
          setModalProdSearch("");
        },
        style: {
          padding: "10px 12px",
          borderBottom: i < hits.length - 1 ? "1px solid " + T.border : "none",
          cursor: "pointer",
          background: selected ? T.acc + "33" : T.surf2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          width: "100%",
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          color: "inherit",
          textAlign: "left"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 13,
          color: selected ? T.acc : T.text,
          fontWeight: selected ? 700 : 400
        }
      }, fav && /*#__PURE__*/React.createElement("span", {
        style: {
          color: T.acc,
          marginRight: 4
        }
      }, "\u2605"), r.emoji || "🍽️", " ", r.name), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          fontFamily: "monospace",
          color: T.kcal
        }
      }, Math.round(m.kcal / Math.max(1, parseFloat(r.servings) || 1)), " kcal/porcję"), selected && /*#__PURE__*/React.createElement("span", {
        style: {
          color: T.acc,
          fontSize: 14
        }
      }, "\u2713")));
    }));
  }()), selRId && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      padding: "8px 12px",
      borderRadius: 8,
      background: T.acc + "22",
      border: "1px solid " + T.acc + "44",
      fontSize: 13,
      color: T.acc,
      fontWeight: 600
    }
  }, "\u2713 ", (_recipes$find = recipes.find(function (x) {
    return String(x.id) === selRId;
  })) === null || _recipes$find === void 0 ? void 0 : _recipes$find.name), selRId && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Ilość porcji (np. 0,35 = 35%)"), /*#__PURE__*/React.createElement("input", {
    value: selRPortions,
    onChange: function onChange(e) {
      return changeSelectedRecipePortions(e.target.value);
    },
    type: "number",
    min: "0.1",
    step: "0.05",
    style: inp
  }), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0.1",
    max: "4",
    step: "0.05",
    value: Math.min(4, Math.max(0.1, parseFloat(selRPortions) || 1)),
    onChange: function onChange(e) {
      return changeSelectedRecipePortions(e.target.value);
    },
    style: {
      width: "100%",
      accentColor: T.acc,
      marginTop: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      textAlign: "right",
      marginTop: 2
    }
  }, fmtPortions(parseFloat(selRPortions) || 1), " porcji · ", Math.round((parseFloat(selRPortions) || 1) * 100), "%")), selRId && selectedRecipeMacro.kcal > 0 && /*#__PURE__*/React.createElement(MG, {
    kcal: selectedRecipeMacro.kcal,
    protein: selectedRecipeMacro.protein,
    carbs: selectedRecipeMacro.carbs,
    fat: selectedRecipeMacro.fat,
    sugars: selectedRecipeMacro.sugars,
    fiber: selectedRecipeMacro.fiber,
    saturatedFat: selectedRecipeMacro.saturatedFat,
    salt: selectedRecipeMacro.salt,
    showDetails: showNutritionDetails,
    T: T
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setModal(null);
    },
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      flex: 1
    })
  }, "Anuluj"), /*#__PURE__*/React.createElement("button", {
    onClick: addRecipeFromMeal,
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      flex: 2
    })
  }, "Dodaj do planera")), /*#__PURE__*/React.createElement("button", {
    onClick: openNRFromPlaner,
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      width: "100%",
      marginTop: 8,
      fontSize: 12,
      color: T.acc,
      borderColor: T.acc
    })
  }, "\uFF0B Stw\xF3rz nowy przepis i dodaj")), modal === "addRecipe" && /*#__PURE__*/React.createElement(Modal, {
    title: "Dodaj przepis do planera",
    onClose: function onClose() {
      return setModal(null);
    },
    T: T
  }, /*#__PURE__*/React.createElement(Lbl, {
    mt: 0,
    T: T
  }, "Dzie\u0144"), /*#__PURE__*/React.createElement(DS, {
    value: selRDay,
    onChange: setSelRDay,
    week: week,
    T: T,
    inp: inp
  }), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Pora dnia"), /*#__PURE__*/React.createElement(MealTimePicker, {
    value: selRMealTime,
    onChange: setSelRMealTime
  }), selRId && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "6px 0 8px",
      fontSize: 13,
      color: T.acc,
      fontWeight: 600
    }
  }, "\u2713 ", (_recipes$find2 = recipes.find(function (x) {
    return String(x.id) === selRId;
  })) === null || _recipes$find2 === void 0 ? void 0 : _recipes$find2.name), selRId && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Ilość porcji (np. 0,35 = 35%)"), /*#__PURE__*/React.createElement("input", {
    value: selRPortions,
    onChange: function onChange(e) {
      return changeSelectedRecipePortions(e.target.value);
    },
    type: "number",
    min: "0.1",
    step: "0.05",
    style: inp
  }), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0.1",
    max: "4",
    step: "0.05",
    value: Math.min(4, Math.max(0.1, parseFloat(selRPortions) || 1)),
    onChange: function onChange(e) {
      return changeSelectedRecipePortions(e.target.value);
    },
    style: {
      width: "100%",
      accentColor: T.acc,
      marginTop: 8
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      textAlign: "right",
      marginTop: 2
    }
  }, fmtPortions(parseFloat(selRPortions) || 1), " porcji · ", Math.round((parseFloat(selRPortions) || 1) * 100), "%")), selRId && selectedRecipeMacro.kcal > 0 && /*#__PURE__*/React.createElement(MG, {
    kcal: selectedRecipeMacro.kcal,
    protein: selectedRecipeMacro.protein,
    carbs: selectedRecipeMacro.carbs,
    fat: selectedRecipeMacro.fat,
    sugars: selectedRecipeMacro.sugars,
    fiber: selectedRecipeMacro.fiber,
    saturatedFat: selectedRecipeMacro.saturatedFat,
    salt: selectedRecipeMacro.salt,
    showDetails: showNutritionDetails,
    T: T
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setModal(null);
    },
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      flex: 1
    })
  }, "Anuluj"), /*#__PURE__*/React.createElement("button", {
    onClick: addRecipe,
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      flex: 2
    })
  }, "Dodaj"))), modal === "editMeal" && /*#__PURE__*/React.createElement(Modal, {
    title: "Edytuj posi\u0142ek",
    onClose: function onClose() {
      return setModal(null);
    },
    T: T
  }, /*#__PURE__*/React.createElement(Builder, {
    items: emItems,
    setItems: setEmItems,
    products: products,
    T: T,
    inp: inp,
    btnA: btnA
  }), emItems.length > 0 && /*#__PURE__*/React.createElement(MG, {
    kcal: emMacro.kcal,
    protein: emMacro.protein,
    carbs: emMacro.carbs,
    fat: emMacro.fat,
    sugars: emMacro.sugars,
    fiber: emMacro.fiber,
    saturatedFat: emMacro.saturatedFat,
    salt: emMacro.salt,
    showDetails: showNutritionDetails,
    T: T
  }), emItems.length > 0 && /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setEditRId(null);
      setRf({
        name: "",
        emoji: "",
        cat: "wytrawne",
        servings: "1",
        finishedWeight: "",
        steps: ""
      });
      setBItems(_toConsumableArray(emItems));
      setModal("recipe");
    },
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      width: "100%",
      marginTop: 4,
      fontSize: 12,
      color: T.acc,
      borderColor: T.acc
    })
  }, "\uD83D\uDCBE Zapisz jako przepis"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setModal(null);
    },
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      flex: 1
    })
  }, "Anuluj"), /*#__PURE__*/React.createElement("button", {
    onClick: saveEM,
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      flex: 2
    })
  }, "Zapisz"))), modal === "copy" && /*#__PURE__*/React.createElement(Modal, {
    title: "Kopiuj dzie\u0144",
    onClose: function onClose() {
      return setModal(null);
    },
    T: T
  }, /*#__PURE__*/React.createElement(Lbl, {
    mt: 0,
    T: T
  }, "Z:"), /*#__PURE__*/React.createElement(DS, {
    value: cpFrom,
    onChange: setCpFrom,
    week: week,
    T: T,
    inp: inp
  }), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Do:"), /*#__PURE__*/React.createElement(DS, {
    value: cpTo,
    onChange: setCpTo,
    week: week,
    T: T,
    inp: inp
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setModal(null);
    },
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      flex: 1
    })
  }, "Anuluj"), /*#__PURE__*/React.createElement("button", {
    onClick: copyDay,
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      flex: 2
    })
  }, "Kopiuj"))), modal === "copyMeal" && copyMealSource && /*#__PURE__*/React.createElement(Modal, {
    title: "Kopiuj posiłek",
    onClose: function onClose() {
      setCopyMealSource(null);
      setModal(null);
    },
    T: T
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 12px",
      border: "1px solid " + T.border,
      borderRadius: 11,
      background: T.surf2,
      color: T.text,
      fontSize: 13,
      fontWeight: 700
    }
  }, copyMealSource.meal.name, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 3,
      color: T.text3,
      fontSize: 10,
      fontWeight: 500
    }
  }, copyMealSource.meal.kcal, " kcal · z ", mfDate(copyMealSource.day).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short"
  }))), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Do dnia"), /*#__PURE__*/React.createElement(DS, {
    value: copyMealTo,
    onChange: setCopyMealTo,
    week: week,
    T: T,
    inp: inp
  }), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Pora dnia"), /*#__PURE__*/React.createElement(MealTimePicker, {
    value: copyMealTime,
    onChange: setCopyMealTime
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setCopyMealSource(null);
      setModal(null);
    },
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      flex: 1
    })
  }, "Anuluj"), /*#__PURE__*/React.createElement("button", {
    onClick: copySingleMeal,
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      flex: 2
    })
  }, "Kopiuj posiłek"))), modal === "recipe" && /*#__PURE__*/React.createElement(Modal, {
    title: editRId ? "Edytuj przepis" : "Nowy przepis",
    onClose: function onClose() {
      return setModal(null);
    },
    T: T
  }, /*#__PURE__*/React.createElement(Lbl, {
    mt: 0,
    T: T
  }, "Nazwa"), /*#__PURE__*/React.createElement("input", {
    value: rf.name,
    onChange: function onChange(e) {
      return setRf(_objectSpread(_objectSpread({}, rf), {}, {
        name: e.target.value
      }));
    },
    style: inp,
    placeholder: "np. Sernik Proteinowy"
  }), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Emoji — opcjonalnie"), /*#__PURE__*/React.createElement("input", {
    value: rf.emoji,
    onChange: function onChange(e) {
      return setRf(_objectSpread(_objectSpread({}, rf), {}, {
        emoji: e.target.value.slice(0, 4)
      }));
    },
    style: inp,
    placeholder: "np. 🥞"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Kategoria"), /*#__PURE__*/React.createElement("select", {
    value: rf.cat,
    onChange: function onChange(e) {
      return setRf(_objectSpread(_objectSpread({}, rf), {}, {
        cat: e.target.value
      }));
    },
    style: inp
  }, Object.entries(CAT_LABELS).map(function (_ref61) {
    var _ref62 = _slicedToArray(_ref61, 2),
      v = _ref62[0],
      l = _ref62[1];
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Porcje"), /*#__PURE__*/React.createElement("input", {
    value: rf.servings,
    onChange: function onChange(e) {
      return setRf(_objectSpread(_objectSpread({}, rf), {}, {
        servings: e.target.value
      }));
    },
    type: "number",
    min: "1",
    style: inp
  }))), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Sk\u0142adniki"), /*#__PURE__*/React.createElement(Builder, {
    items: bItems,
    setItems: setBItems,
    products: products,
    T: T,
    inp: inp,
    btnA: btnA
  }), bItems.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      marginTop: 10
    }
  }, "MAKRO CAŁEGO PRZEPISU"), /*#__PURE__*/React.createElement(MG, {
    kcal: bMacro.kcal,
    protein: bMacro.protein,
    carbs: bMacro.carbs,
    fat: bMacro.fat,
    sugars: bMacro.sugars,
    fiber: bMacro.fiber,
    saturatedFat: bMacro.saturatedFat,
    salt: bMacro.salt,
    showDetails: showNutritionDetails,
    T: T
  })), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Masa gotowego dania (g) — opcjonalnie"), /*#__PURE__*/React.createElement("input", {
    value: rf.finishedWeight || "",
    onChange: function onChange(e) {
      return setRf(_objectSpread(_objectSpread({}, rf), {}, {
        finishedWeight: e.target.value
      }));
    },
    type: "number",
    min: "1",
    style: inp,
    placeholder: "Zważ całość po przygotowaniu"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      lineHeight: 1.4,
      marginTop: 4
    }
  }, "Po wpisaniu masy aplikacja pokaże prawidłowe makro na 100 g gotowego dania."), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Przygotowanie"), /*#__PURE__*/React.createElement("textarea", {
    value: rf.steps,
    onChange: function onChange(e) {
      return setRf(_objectSpread(_objectSpread({}, rf), {}, {
        steps: e.target.value
      }));
    },
    style: _objectSpread(_objectSpread({}, inp), {}, {
      resize: "vertical"
    }),
    rows: 3,
    placeholder: "Krok 1\nKrok 2"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setModal(null);
    },
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      flex: 1
    })
  }, "Anuluj"), /*#__PURE__*/React.createElement("button", {
    onClick: saveRecipe,
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      flex: 2
    })
  }, editRId ? "Zapisz zmiany" : "Zapisz przepis"))), (modal === "newProd" || modal === "newProdFromPlanner") && /*#__PURE__*/React.createElement(Modal, {
    title: modal === "newProdFromPlanner" ? "Nowy produkt do planera" : "Nowy produkt",
    onClose: function onClose() {
      return setModal(modal === "newProdFromPlanner" ? "addProd" : null);
    },
    T: T
  }, /*#__PURE__*/React.createElement(Lbl, {
    mt: 0,
    T: T
  }, "Nazwa"), /*#__PURE__*/React.createElement("input", {
    value: pf.name,
    onChange: function onChange(e) {
      return setPf(_objectSpread(_objectSpread({}, pf), {}, {
        name: e.target.value
      }));
    },
    style: inp,
    placeholder: "Twar\xF3g chudy"
  }), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Marka"), /*#__PURE__*/React.createElement("input", {
    value: pf.brand,
    onChange: function onChange(e) {
      return setPf(_objectSpread(_objectSpread({}, pf), {}, {
        brand: e.target.value
      }));
    },
    style: inp,
    placeholder: "Biedronka"
  }), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Kod kreskowy — opcjonalnie"), /*#__PURE__*/React.createElement("input", {
    value: pf.ean || "",
    onChange: function onChange(e) {
      return setPf(_objectSpread(_objectSpread({}, pf), {}, {
        ean: e.target.value.replace(/\D/g, "")
      }));
    },
    inputMode: "numeric",
    placeholder: "np. 5901234123457",
    style: inp
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3,
      margin: "12px 0 6px"
    }
  }, "MAKRO NA 100G"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, [["Kcal", "kcal"], ["Białko (g)", "protein"], ["Węglowodany (g)", "carbs"], ["Tłuszcze (g)", "fat"]].map(function (_ref63) {
    var _ref64 = _slicedToArray(_ref63, 2),
      l = _ref64[0],
      k = _ref64[1];
    return /*#__PURE__*/React.createElement("div", {
      key: k
    }, /*#__PURE__*/React.createElement(Lbl, {
      mt: 0,
      T: T
    }, l), /*#__PURE__*/React.createElement("input", {
      value: pf[k],
      onChange: function onChange(e) {
        return setPf(_objectSpread(_objectSpread({}, pf), {}, _defineProperty({}, k, e.target.value)));
      },
      type: "number",
      min: "0",
      step: "0.01",
      placeholder: "0",
      style: inp
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.text3,
      margin: "14px 0 3px",
      textTransform: "uppercase",
      letterSpacing: 0.8
    }
  }, "Dane dodatkowe na 100 g — opcjonalne"), /*#__PURE__*/React.createElement("div", {
    style: { fontSize: 10, color: T.text3, lineHeight: 1.45, marginBottom: 8 }
  }, "Zostaw puste, jeśli etykieta ich nie podaje. Pusta wartość oznacza brak danych, nie zero."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, [["w tym cukry (g)", "sugars"], ["Błonnik (g)", "fiber"], ["Tł. nasycone (g)", "saturatedFat"], ["Sól (g)", "salt"]].map(function (_refNutritionInput) {
    var _refNutritionInput2 = _slicedToArray(_refNutritionInput, 2),
      label = _refNutritionInput2[0],
      key = _refNutritionInput2[1];
    return /*#__PURE__*/React.createElement("div", {
      key: key
    }, /*#__PURE__*/React.createElement(Lbl, {
      mt: 0,
      T: T
    }, label), /*#__PURE__*/React.createElement("input", {
      value: pf[key] === null || pf[key] === undefined ? "" : pf[key],
      onChange: function onChange(e) {
        return setPf(_objectSpread(_objectSpread({}, pf), {}, _defineProperty({}, key, e.target.value)));
      },
      type: "number",
      min: "0",
      step: "0.01",
      placeholder: "brak danych",
      style: inp
    }));
  })), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Rozmiar opakowania (g) \u2014 opcjonalne"), /*#__PURE__*/React.createElement("input", {
    value: pf.packageSize,
    onChange: function onChange(e) {
      return setPf(_objectSpread(_objectSpread({}, pf), {}, {
        packageSize: e.target.value
      }));
    },
    type: "number",
    placeholder: "np. 250",
    style: inp
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setModal(modal === "newProdFromPlanner" ? "addProd" : null);
    },
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      flex: 1
    })
  }, "Anuluj"), /*#__PURE__*/React.createElement("button", {
    onClick: saveProd,
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      flex: 2
    })
  }, "Zapisz produkt"))), modal === "scanBarcode" && /*#__PURE__*/React.createElement(ScanModal, {
    T: T,
    inp: inp,
    btnA: btnA,
    btnB: btnB,
    onClose: function onClose() {
      setScanResult(null);
      setScanError("");
      return setModal("addProd");
    },
    onScan: function onScan(ean) {
      return lookupBarcode(ean);
    },
    scanLoading: scanLoading,
    scanResult: scanResult,
    scanError: scanError,
    onAccept: acceptScanResult,
    onReset: function onReset() {
      setScanResult(null);
      setScanError("");
    },
    onManualAdd: function onManualAdd() {
      return openManualScannedProduct(null);
    },
    onEdit: function onEdit() {
      return openManualScannedProduct(scanResult);
    }
  }), sharedData && /*#__PURE__*/React.createElement(Modal, {
    title: "\uD83D\uDCE4 Udost\u0119pniony plan",
    onClose: function onClose() {
      return setSharedData(null);
    },
    T: T
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.text3,
      marginBottom: 10
    }
  }, "Plan na ", mfDate(sharedData.date).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })), sharedData.meals.map(function (m, i) {
    var _MEAL_TIMES$find;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        padding: "8px 10px",
        background: T.surf2,
        borderRadius: 8,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: T.text
      }
    }, m.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: T.text2,
        marginTop: 2,
        fontFamily: "monospace"
      }
    }, m.kcal, " kcal \xB7 B:", m.protein, "g W:", m.carbs, "g T:", m.fat, "g"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: T.text3,
        marginTop: 1
      }
    }, ((_MEAL_TIMES$find = MEAL_TIMES.find(function (mt) {
      return mt.key === m.mealTime;
    })) === null || _MEAL_TIMES$find === void 0 ? void 0 : _MEAL_TIMES$find.label) || ""));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      padding: "8px 10px",
      background: T.surf2,
      borderRadius: 8,
      fontSize: 12,
      color: T.text2
    }
  }, "\u0141\u0105cznie: ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.kcal,
      fontWeight: 700
    }
  }, sharedData.meals.reduce(function (a, m) {
    return a + m.kcal;
  }, 0), " kcal"), " · ", "B:", Math.round(sharedData.meals.reduce(function (a, m) {
    return a + (m.protein || 0);
  }, 0)), "g", " · ", "W:", Math.round(sharedData.meals.reduce(function (a, m) {
    return a + (m.carbs || 0);
  }, 0)), "g", " · ", "T:", Math.round(sharedData.meals.reduce(function (a, m) {
    return a + (m.fat || 0);
  }, 0)), "g"), /*#__PURE__*/React.createElement(Lbl, {
    T: T
  }, "Dodaj do dnia"), /*#__PURE__*/React.createElement(DS, {
    value: addDay,
    onChange: setAddDay,
    week: week,
    T: T,
    inp: inp
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return setSharedData(null);
    },
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      flex: 1
    })
  }, "Anuluj"), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      var newMeals = sharedData.meals.map(function (m) {
        return _objectSpread(_objectSpread({}, m), {}, {
          id: Date.now() + Math.random()
        });
      });
      setPlaner(function (prev) {
        return _objectSpread(_objectSpread({}, prev), {}, _defineProperty({}, addDay, [].concat(_toConsumableArray(prev[addDay] || []), _toConsumableArray(newMeals))));
      });
      setSharedData(null);
      window.history.replaceState({}, "", window.location.pathname);
      toast_("Dodano do planera!");
    },
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      flex: 2
    })
  }, "Dodaj do planera"))), modal === "restoreBackup" && pendingBackup && /*#__PURE__*/React.createElement(Modal, {
    title: "Przywracanie kopii",
    onClose: function onClose() {
      setPendingBackup(null);
      setModal(null);
    },
    T: T
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: T.surf2,
      border: "1px solid " + T.border,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: T.text,
      overflowWrap: "anywhere"
    }
  }, pendingBackup.filename), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: T.text3,
      marginTop: 3
    }
  }, pendingBackup.exportedAt ? "Utworzono: " + new Date(pendingBackup.exportedAt).toLocaleString("pl-PL") : "Kopia bez zapisanej daty")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(5,1fr)",
      gap: 5,
      marginBottom: 12
    }
  }, [[pendingBackup.summary.planDays, "dni"], [pendingBackup.summary.measurements, "pomiary"], [pendingBackup.summary.waterDays, "woda"], [pendingBackup.summary.recipes, "przepisy"], [pendingBackup.summary.products, "produkty"]].map(function (_refBackupSummary) {
    var _refBackupSummary2 = _slicedToArray(_refBackupSummary, 2),
      value = _refBackupSummary2[0],
      label = _refBackupSummary2[1];
    return /*#__PURE__*/React.createElement("div", {
      key: label,
      style: {
        textAlign: "center",
        background: T.surf2,
        borderRadius: 9,
        padding: "8px 2px",
        border: "1px solid " + T.border
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: T.acc,
        fontWeight: 800,
        fontSize: 15
      }
    }, value), /*#__PURE__*/React.createElement("div", {
      style: {
        color: T.text3,
        fontSize: 8
      }
    }, label));
  })), pendingBackup.missing.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(232,131,74,.12)",
      border: "1px solid " + T.fat,
      borderRadius: 10,
      padding: 10,
      color: T.text2,
      fontSize: 10,
      lineHeight: 1.45,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: T.fat
    }
  }, pendingBackup.legacy ? "Starsza kopia. " : "Niepełna kopia. "), "Brakuje: ", pendingBackup.missing.join(", "), ". Przy scalaniu obecne dane z tych działów zostaną zachowane."), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return applyBackup("merge");
    },
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      width: "100%",
      padding: 12,
      fontSize: 13,
      marginBottom: 6
    })
  }, "Scal z obecnymi danymi"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: T.text3,
      fontSize: 9,
      lineHeight: 1.4,
      margin: "0 4px 14px"
    }
  }, "Najbezpieczniejsza opcja. Dodaje dane z kopii, aktualizuje rekordy o tych samych identyfikatorach i niczego samodzielnie nie usuwa."), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      if (window.confirm("Zastąpić wszystkie dane MatFit zawartością tej kopii? Najpierw automatycznie pobierzemy kopię ratunkową obecnych danych.")) applyBackup("replace");
    },
    style: _objectSpread(_objectSpread({}, btnB), {}, {
      width: "100%",
      padding: 11,
      fontSize: 12,
      color: T.fat,
      borderColor: T.fat
    })
  }, "Zastąp wszystkie dane"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: T.text3,
      fontSize: 9,
      lineHeight: 1.4,
      margin: "6px 4px 0"
    }
  }, "Obecne dane zostaną zastąpione. MatFit przed operacją pobierze osobny plik ratunkowy.")), modal === "backupResult" && backupResult && /*#__PURE__*/React.createElement(Modal, {
    title: "Kopia przywrócona",
    onClose: function onClose() {
      setBackupResult(null);
      setModal(null);
    },
    T: T
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "4px 0 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 38,
      marginBottom: 5
    }
  }, "✅"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: T.text,
      fontSize: 14,
      fontWeight: 700
    }
  }, backupResult.mode === "replace" ? "Dane zostały zastąpione" : "Dane zostały bezpiecznie scalone")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: T.surf2,
      border: "1px solid " + T.border,
      borderRadius: 11,
      padding: 11,
      color: T.text2,
      fontSize: 11,
      lineHeight: 1.65,
      marginBottom: 12
    }
  }, "Planer: ", /*#__PURE__*/React.createElement("strong", null, backupResult.summary.planDays), " dni · Pomiary: ", /*#__PURE__*/React.createElement("strong", null, backupResult.summary.measurements), " · Woda: ", /*#__PURE__*/React.createElement("strong", null, backupResult.summary.waterDays), " dni", /*#__PURE__*/React.createElement("br", null), "Własne przepisy: ", /*#__PURE__*/React.createElement("strong", null, backupResult.summary.recipes), " · Produkty: ", /*#__PURE__*/React.createElement("strong", null, backupResult.summary.products)), backupResult.safetyCreated && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(74,158,255,.1)",
      borderRadius: 9,
      padding: 9,
      color: T.text2,
      fontSize: 10,
      lineHeight: 1.4,
      marginBottom: 12
    }
  }, "Kopia ratunkowa wcześniejszych danych została automatycznie pobrana na urządzenie."), /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      setBackupResult(null);
      setModal(null);
    },
    style: _objectSpread(_objectSpread({}, btnA), {}, {
      width: "100%",
      padding: 11
    })
  }, "Gotowe")), modal === "recipeCard" && cardRecipe && function () {
    var r = cardRecipe;
    var m = recipeM(r);
    var servings = Math.max(1, parseFloat(r.servings) || 1);
    var finishedWeight = parseFloat(r.finishedWeight) || 0;
    var per100Factor = finishedWeight > 0 ? 100 / finishedWeight : 0;
    var perServingFactor = 1 / servings;
    var sweet = cardStyle === "sweet";
    var theme = sweet ? {
      bg: "#fbf7ef",
      panel: "#fffdf8",
      soft: "#f2e4cf",
      accent: "#b57a2a",
      accent2: "#e0b865",
      dark: "#211912",
      muted: "#6f6256",
      line: "#dbcdb9",
      hero: "linear-gradient(135deg,#f4e5c9,#d7a85a)"
    } : {
      bg: "#f7f4ea",
      panel: "#fffdf7",
      soft: "#e5ecdd",
      accent: "#245735",
      accent2: "#9fb27f",
      dark: "#14271a",
      muted: "#5c695d",
      line: "#cdd5c4",
      hero: "linear-gradient(135deg,#dfe9d6,#6f8f65)"
    };
    var category = CAT_LABELS[r.cat] || (sweet ? "Słodkie" : "Wytrawne");
    var proteinPerServing = m.protein * perServingFactor;
    var ingredients = r.ingredients || [];
    var steps = r.steps || [];
    return /*#__PURE__*/React.createElement("div", {
      role: "presentation",
      onClick: function onClick() {
        return setModal(null);
      },
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.9)",
        zIndex: 200,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Karta przepisu " + r.name,
      tabIndex: -1,
      onClick: function onClick(e) {
        return e.stopPropagation();
      },
      style: {
        background: "#eef2f5",
        borderRadius: "20px 20px 0 0",
        width: "100%",
        maxWidth: 460,
        maxHeight: "97vh",
        overflowY: "auto",
        boxShadow: "0 -12px 40px rgba(0,0,0,.35)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-controls",
      style: {
        padding: "12px",
        position: "sticky",
        top: 0,
        zIndex: 5,
        background: "rgba(238,242,245,.97)",
        borderBottom: "1px solid #d8dee5"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontWeight: 700,
        fontSize: 14,
        color: "#17202a"
      }
    }, "Karta MatFit"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      "aria-label": "Zamknij kartę przepisu",
      onClick: function onClick() {
        return setModal(null);
      },
      style: {
        background: "transparent",
        border: "none",
        fontSize: 22,
        color: "#64748b",
        cursor: "pointer"
      }
    }, "×")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 6,
        marginBottom: 8
      }
    }, [["sweet", "🍰 Sweet"], ["savory", "🥗 Savory"]].map(function (_refCardStyle) {
      var _refCardStyle2 = _slicedToArray(_refCardStyle, 2),
        key = _refCardStyle2[0],
        label = _refCardStyle2[1];
      var active = cardStyle === key;
      return /*#__PURE__*/React.createElement("button", {
        key: key,
        type: "button",
        "aria-pressed": active,
        onClick: function onClick() {
          return setCardStyle(key);
        },
        style: {
          border: "1px solid " + (active ? theme.accent : "#cbd5e1"),
          background: active ? theme.soft : "#fff",
          color: active ? theme.dark : "#475569",
          borderRadius: 9,
          padding: "8px",
          fontWeight: active ? 700 : 500,
          fontSize: 11,
          cursor: "pointer"
        }
      }, label);
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("input", {
      id: "recipe-card-image-input",
      type: "file",
      accept: "image/*",
      onChange: handleCardImageUpload,
      style: {
        display: "none"
      }
    }), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        var input = document.getElementById("recipe-card-image-input");
        if (input) input.click();
      },
      style: {
        flex: "1 1 110px",
        background: "#fff",
        border: "1px solid #cbd5e1",
        borderRadius: 9,
        padding: "8px",
        color: "#334155",
        fontSize: 10,
        cursor: "pointer"
      }
    }, cardImg ? "🖼️ Zmień zdjęcie" : "🖼️ Dodaj zdjęcie"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return toast_("Zdjęcia AI podłączymy przez bezpieczny serwer — bez klucza w HTML");
      },
      style: {
        flex: "1 1 110px",
        background: "#fff",
        border: "1px solid #cbd5e1",
        borderRadius: 9,
        padding: "8px",
        color: "#334155",
        fontSize: 10,
        cursor: "pointer"
      }
    }, "✨ Zdjęcie AI"), cardImg && /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return setCardImg(null);
      },
      style: {
        background: "#fff",
        border: "1px solid #cbd5e1",
        borderRadius: 9,
        padding: "8px",
        color: "#64748b",
        fontSize: 10,
        cursor: "pointer"
      }
    }, "Usuń"), /*#__PURE__*/React.createElement("button", {
      onClick: downloadRecipeCardPNG,
      disabled: cardLoading,
      style: {
        flex: "1 1 90px",
        background: theme.accent,
        border: "none",
        borderRadius: 9,
        padding: "8px",
        color: "#fff",
        fontWeight: 700,
        fontSize: 10,
        cursor: cardLoading ? "wait" : "pointer",
        opacity: cardLoading ? .6 : 1
      }
    }, cardLoading ? "Tworzę..." : "↓ PNG"), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return window.print();
      },
      style: {
        flex: "1 1 90px",
        background: theme.dark,
        border: "none",
        borderRadius: 9,
        padding: "8px",
        color: "#fff",
        fontWeight: 700,
        fontSize: 10,
        cursor: "pointer"
      }
    }, "PDF / druk"))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      id: "recipe-card",
      style: {
        background: theme.bg,
        color: theme.dark,
        fontFamily: "Arial, Helvetica, sans-serif",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid " + theme.line,
        boxShadow: "0 10px 30px rgba(34,25,18,.12)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "12px 14px 9px",
        background: theme.panel,
        borderBottom: "1px solid " + theme.line
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "42",
      height: "42",
      viewBox: "0 0 64 64",
      role: "img",
      "aria-label": "MatFit"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "1",
      y: "1",
      width: "62",
      height: "62",
      rx: "14",
      fill: theme.dark
    }), /*#__PURE__*/React.createElement("polygon", {
      points: "10,50 10,14 20,14 20,50",
      fill: theme.bg
    }), /*#__PURE__*/React.createElement("polygon", {
      points: "22,14 30,10 38,28 31,39",
      fill: theme.bg
    }), /*#__PURE__*/React.createElement("polygon", {
      points: "42,10 51,14 35,40 28,29",
      fill: theme.bg
    }), /*#__PURE__*/React.createElement("polygon", {
      points: "46,14 56,14 56,50 46,50",
      fill: theme.bg
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        fontWeight: 900,
        letterSpacing: -.5
      }
    }, "MatFit", /*#__PURE__*/React.createElement("span", {
      style: {
        color: theme.accent,
        fontSize: 10,
        marginLeft: 5,
        letterSpacing: 1
      }
    }, "PRO")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: theme.muted,
        fontStyle: "italic"
      }
    }, "Smacznie · zdrowo · z balansem")), /*#__PURE__*/React.createElement("div", {
      style: {
        background: theme.dark,
        color: "#fff",
        borderRadius: 999,
        padding: "6px 8px",
        fontSize: 8,
        fontWeight: 800,
        letterSpacing: .6,
        textTransform: "uppercase"
      }
    }, proteinPerServing >= 20 ? "High Protein" : "MatFit Recipe")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1.05fr .95fr",
        minHeight: 190,
        background: theme.panel
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "18px 14px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "inline-block",
        alignSelf: "flex-start",
        background: theme.accent,
        color: "#fff",
        padding: "5px 8px",
        fontSize: 8,
        fontWeight: 800,
        letterSpacing: 1,
        textTransform: "uppercase",
        marginBottom: 9,
        transform: "rotate(-1deg)"
      }
    }, sweet ? "Sweet Edition" : "Savory Edition"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 25,
        lineHeight: .96,
        fontWeight: 950,
        textTransform: "uppercase",
        letterSpacing: -.7,
        overflowWrap: "anywhere"
      }
    }, r.name), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        fontSize: 9,
        color: theme.muted,
        fontWeight: 600
      }
    }, servings, servings === 1 ? " porcja" : " porcje", " · ", category)), /*#__PURE__*/React.createElement("div", {
      style: {
        background: theme.hero,
        position: "relative",
        overflow: "hidden",
        minHeight: 190
      }
    }, cardImg ? /*#__PURE__*/React.createElement("img", {
      src: cardImg,
      alt: r.name,
      style: {
        width: "100%",
        height: "100%",
        minHeight: 190,
        objectFit: "cover",
        display: "block"
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 12,
        color: theme.dark
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 54,
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,.12))"
      }
    }, r.emoji || "🍽️"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        fontWeight: 700,
        marginTop: 7,
        opacity: .75,
        textTransform: "uppercase",
        letterSpacing: .8
      }
    }, "Dodaj zdjęcie lub wygeneruj AI")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 0,
        background: theme.soft,
        borderTop: "1px solid " + theme.line,
        borderBottom: "1px solid " + theme.line
      }
    }, [["💪", r2(proteinPerServing) + " g", "białka / porcję"], ["🍽️", String(servings), servings === 1 ? "porcja" : "porcje"], ["✦", sweet ? "SWEET" : "SAVORY", "styl karty"]].map(function (_refCardBenefit, index) {
      var _refCardBenefit2 = _slicedToArray(_refCardBenefit, 3),
        icon = _refCardBenefit2[0],
        value = _refCardBenefit2[1],
        label = _refCardBenefit2[2];
      return /*#__PURE__*/React.createElement("div", {
        key: label,
        style: {
          textAlign: "center",
          padding: "9px 4px",
          borderRight: index < 2 ? "1px solid " + theme.line : "none"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 14
        }
      }, icon), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          fontWeight: 900,
          color: theme.dark
        }
      }, value), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 7,
          color: theme.muted,
          textTransform: "uppercase"
        }
      }, label));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 14px 8px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 6
      }
    }, "Makro całego przepisu"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 6
      }
    }, [["Kcal", Math.round(m.kcal)], ["Białko", r2(m.protein) + "g"], ["Tłuszcz", r2(m.fat) + "g"], ["Węgle", r2(m.carbs) + "g"]].map(function (_refCardMacro) {
      var _refCardMacro2 = _slicedToArray(_refCardMacro, 2),
        label = _refCardMacro2[0],
        value = _refCardMacro2[1];
      return /*#__PURE__*/React.createElement("div", {
        key: label,
        style: {
          background: theme.panel,
          border: "1px solid " + theme.line,
          borderRadius: 9,
          padding: "8px 3px",
          textAlign: "center"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          color: theme.accent,
          fontWeight: 950,
          fontSize: 14
        }
      }, value), /*#__PURE__*/React.createElement("div", {
        style: {
          color: theme.muted,
          fontSize: 7,
          textTransform: "uppercase",
          marginTop: 2
        }
      }, label));
    })), showNutritionDetails && /*#__PURE__*/React.createElement(NutritionDetails, {
      sugars: m.sugars,
      fiber: m.fiber,
      saturatedFat: m.saturatedFat,
      salt: m.salt,
      T: {
        surf2: theme.panel,
        border: theme.line,
        text2: theme.muted,
        text: theme.dark
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 7,
        background: theme.dark,
        color: "#fff",
        borderRadius: 8,
        padding: "7px 9px",
        textAlign: "center",
        fontSize: 8
      }
    }, "1 porcja: ", /*#__PURE__*/React.createElement("strong", null, Math.round(m.kcal * perServingFactor), " kcal"), " · B ", r2(m.protein * perServingFactor), " g · W ", r2(m.carbs * perServingFactor), " g · T ", r2(m.fat * perServingFactor), " g", finishedWeight > 0 ? " · 100 g: " + Math.round(m.kcal * per100Factor) + " kcal" : "")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        padding: "8px 14px 14px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: theme.panel,
        border: "1px solid " + theme.line,
        borderRadius: 10,
        padding: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: theme.accent,
        fontSize: 11,
        fontWeight: 950,
        textTransform: "uppercase",
        letterSpacing: .7,
        borderBottom: "2px solid " + theme.accent,
        paddingBottom: 4,
        marginBottom: 6
      }
    }, "Składniki"), ingredients.map(function (item, i) {
      var product = products.find(function (p) {
        return p.id === item.productId;
      });
      if (!product) return null;
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: "flex",
          gap: 5,
          justifyContent: "space-between",
          padding: "4px 0",
          borderBottom: "1px solid " + theme.line,
          fontSize: 8,
          lineHeight: 1.3
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1
        }
      }, product.name), /*#__PURE__*/React.createElement("strong", {
        style: {
          color: theme.accent,
          whiteSpace: "nowrap"
        }
      }, r2(parseFloat(item.grams) || 0), " g"));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        background: theme.panel,
        border: "1px solid " + theme.line,
        borderRadius: 10,
        padding: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: theme.accent,
        fontSize: 11,
        fontWeight: 950,
        textTransform: "uppercase",
        letterSpacing: .7,
        borderBottom: "2px solid " + theme.accent,
        paddingBottom: 4,
        marginBottom: 6
      }
    }, "Wykonanie"), steps.length ? steps.map(function (step, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: "flex",
          gap: 6,
          padding: "4px 0",
          borderBottom: "1px solid " + theme.line,
          fontSize: 8,
          lineHeight: 1.35
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: theme.accent,
          color: "#fff",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 8,
          fontWeight: 900
        }
      }, i + 1), /*#__PURE__*/React.createElement("span", null, step));
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 8,
        color: theme.muted,
        lineHeight: 1.4
      }
    }, "Dodaj instrukcję przygotowania w edycji przepisu."))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: theme.dark,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 14px"
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 64 64",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("polygon", {
      points: "8,52 8,12 18,12 18,52",
      fill: "#fff"
    }), /*#__PURE__*/React.createElement("polygon", {
      points: "21,14 29,10 37,28 30,39",
      fill: "#fff"
    }), /*#__PURE__*/React.createElement("polygon", {
      points: "43,10 52,14 36,40 29,29",
      fill: "#fff"
    }), /*#__PURE__*/React.createElement("polygon", {
      points: "46,12 56,12 56,52 46,52",
      fill: "#fff"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 8,
        letterSpacing: .6,
        textTransform: "uppercase"
      }
    }, "MatFit Pro · Smacznie · Zdrowo · Z balansem"), /*#__PURE__*/React.createElement("div", {
      style: {
        color: theme.accent2,
        fontSize: 8,
        fontWeight: 800
      }
    }, sweet ? "SWEET" : "SAVORY"))), /*#__PURE__*/React.createElement("style", null, "@media print { body * { visibility:hidden!important; } #recipe-card, #recipe-card * { visibility:visible!important; } #recipe-card { position:absolute!important; left:0!important; top:0!important; width:100%!important; border:none!important; border-radius:0!important; box-shadow:none!important; } .card-controls { display:none!important; } @page { margin:0; size:auto; } }"))));
  }(), toast && /*#__PURE__*/React.createElement("div", {
    role: "status",
    "aria-live": "polite",
    "aria-atomic": "true",
    style: {
      position: "fixed",
      bottom: 76,
      left: "50%",
      transform: "translateX(-50%)",
      background: T.acc,
      color: safeTn === "royal" ? "#000" : "#fff",
      padding: "9px 18px",
      borderRadius: 100,
      fontWeight: 700,
      fontSize: 13,
      zIndex: 300,
      whiteSpace: "nowrap",
      pointerEvents: "none"
    }
  }, toast)
);
}


window.onerror = function(msg, src, line, col, err) {
  document.getElementById('root').innerHTML =
    '<pre style="padding:20px;color:red;background:#111;white-space:pre-wrap;font-size:13px;">' +
    msg + '\n' + line + ':' + col + '\n\n' +
    (err && err.stack ? err.stack : '') +
    '</pre>';
};

window.onunhandledrejection = function(e) {
  document.getElementById('root').innerHTML =
    '<pre style="padding:20px;color:red;background:#111;white-space:pre-wrap;font-size:13px;">PROMISE ERROR\n' +
    (e.reason && e.reason.stack ? e.reason.stack : e.reason) +
    '</pre>';
};

try {
  document.getElementById('root').innerHTML =
    '<div style="padding:30px;font-size:26px;color:blue;font-weight:900;">PRZED APP</div>';

  ReactDOM.createRoot(document.getElementById('root')).render(
    React.createElement(App)
  );
} catch (err) {
  document.getElementById('root').innerHTML =
    '<pre style="padding:20px;color:red;background:#111;white-space:pre-wrap;font-size:13px;">' +
    err.message + '\n\n' + err.stack +
    '</pre>';
}
})();

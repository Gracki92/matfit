import { mfShiftISO } from "./date.js";

export const ACTIVITY_MULTIPLIERS = Object.freeze({
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active4: 1.65,
  active: 1.725,
  very: 1.9,
});

export const DAY_TYPE_MULTIPLIERS = Object.freeze({ training: 1, rest: 0.85 });

export const NUTRITION_DETAIL_FIELDS = Object.freeze([
  { key: "sugars", label: "w tym cukry" },
  { key: "fiber", label: "błonnik" },
  { key: "saturatedFat", label: "tł. nasycone" },
  { key: "salt", label: "sól" },
]);

export function r2(value) {
  return Math.round(value * 10) / 10;
}

export function rGram(value) {
  return Math.round(value * 100) / 100;
}

export function fmtPortions(value) {
  return String(Math.round((parseFloat(value) || 0) * 100) / 100);
}

export function optionalNutritionNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function nutritionDetailCompleteness(source) {
  return NUTRITION_DETAIL_FIELDS.filter(
    (field) => optionalNutritionNumber(source && source[field.key]) !== null,
  ).length;
}

export function scaledNutritionDetails(source, factor) {
  return NUTRITION_DETAIL_FIELDS.reduce((details, field) => {
    const value = optionalNutritionNumber(source && source[field.key]);
    details[field.key] = value === null ? null : r2(value * factor);
    return details;
  }, {});
}

export function calcMacro(ingredients, products) {
  const total = {
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sugars: 0,
    fiber: 0,
    saturatedFat: 0,
    salt: 0,
  };
  const known = { sugars: true, fiber: true, saturatedFat: true, salt: true };
  let matched = 0;

  (ingredients || []).forEach((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    if (!product) {
      NUTRITION_DETAIL_FIELDS.forEach((field) => {
        known[field.key] = false;
      });
      return;
    }

    matched += 1;
    const factor = (parseFloat(item.grams) || 0) / 100;
    total.kcal += (parseFloat(product.kcal) || 0) * factor;
    total.protein += (parseFloat(product.protein) || 0) * factor;
    total.carbs += (parseFloat(product.carbs) || 0) * factor;
    total.fat += (parseFloat(product.fat) || 0) * factor;
    NUTRITION_DETAIL_FIELDS.forEach((field) => {
      const value = optionalNutritionNumber(product[field.key]);
      if (value === null) known[field.key] = false;
      else total[field.key] += value * factor;
    });
  });

  NUTRITION_DETAIL_FIELDS.forEach((field) => {
    if (!matched || !known[field.key]) total[field.key] = null;
  });
  return total;
}

export function completeMealNutrition(meal, products) {
  if (meal && Array.isArray(meal.items) && meal.items.length) {
    const allProductsAvailable = meal.items.every((item) =>
      products.some((product) => product.id === item.productId),
    );
    if (allProductsAvailable) return calcMacro(meal.items, products);
  }

  return {
    kcal: parseFloat(meal && meal.kcal) || 0,
    protein: parseFloat(meal && meal.protein) || 0,
    carbs: parseFloat(meal && meal.carbs) || 0,
    fat: parseFloat(meal && meal.fat) || 0,
    ...scaledNutritionDetails(meal, 1),
  };
}

export function sumMealNutrition(meals, products) {
  const rows = (meals || []).map((meal) => completeMealNutrition(meal, products));
  const total = rows.reduce(
    (sum, row) => {
      sum.kcal += row.kcal;
      sum.protein += row.protein;
      sum.carbs += row.carbs;
      sum.fat += row.fat;
      return sum;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );

  NUTRITION_DETAIL_FIELDS.forEach((field) => {
    total[field.key] =
      rows.length && rows.every((row) => optionalNutritionNumber(row[field.key]) !== null)
        ? rows.reduce((sum, row) => sum + row[field.key], 0)
        : null;
  });
  return total;
}

export function calcBMR(profile) {
  if (!profile.weight || !profile.height || !profile.age) return 0;
  return (
    10 * profile.weight +
    6.25 * profile.height -
    5 * profile.age +
    (profile.gender === "m" ? 5 : -161)
  );
}

export function calcFormulaTDEE(profile) {
  const multiplier = ACTIVITY_MULTIPLIERS[profile.activity] ?? ACTIVITY_MULTIPLIERS.moderate;
  return Math.round(calcBMR(profile) * multiplier);
}

export function calcTDEE(profile) {
  const calibrated = parseFloat(profile.tdeeManual);
  return calibrated >= 1200 && calibrated <= 6000
    ? Math.round(calibrated)
    : calcFormulaTDEE(profile);
}

export function calcTargets(profile, dayMultiplier = 1) {
  const tdee = calcTDEE(profile);
  if (!tdee) return { kcal: 2800, protein: 180, carbs: 280, fat: 70 };

  const adjustment = (profile.tdeeAdjust || 0) / 100;
  const kcal = Math.round(tdee * dayMultiplier * (1 + adjustment));
  let protein;
  let fat;
  let carbs;

  if (profile.macroMode === "manual" && profile.macroProt && profile.macroFat && profile.macroCarb) {
    const total =
      (parseFloat(profile.macroProt) || 0) +
      (parseFloat(profile.macroFat) || 0) +
      (parseFloat(profile.macroCarb) || 0);
    const proteinShare = total > 0 ? (parseFloat(profile.macroProt) || 0) / total : 0.3;
    const fatShare = total > 0 ? (parseFloat(profile.macroFat) || 0) / total : 0.25;
    const carbShare = total > 0 ? (parseFloat(profile.macroCarb) || 0) / total : 0.45;
    protein = Math.round((kcal * proteinShare) / 4);
    fat = Math.round((kcal * fatShare) / 9);
    carbs = Math.round((kcal * carbShare) / 4);
  } else {
    protein = Math.round((profile.weight || 80) * 2.2);
    fat = Math.round((kcal * 0.25) / 9);
    carbs = Math.round((kcal - protein * 4 - fat * 9) / 4);
  }

  return { kcal, protein, carbs: Math.max(carbs, 0), fat };
}

export function calcNavyBodyFat(profile, measures) {
  const height = parseFloat(profile.height);
  const neck = parseFloat(measures.neck);
  const waist = parseFloat(measures.belly || measures.waist);
  const hips = parseFloat(measures.hips);
  if (!height || !neck || !waist) return null;

  const inch = 1 / 2.54;
  let result;
  if (profile.gender === "f") {
    if (!hips) return null;
    result =
      163.205 * Math.log10((waist + hips - neck) * inch) -
      97.684 * Math.log10(height * inch) -
      78.387;
  } else {
    if (waist <= neck) return null;
    result =
      86.01 * Math.log10((waist - neck) * inch) -
      70.041 * Math.log10(height * inch) +
      36.76;
  }
  return result >= 1 && result <= 60 ? r2(result) : null;
}

export function nutritionPeriodSummary(planer, products, endISO, days, profile, dayTypes) {
  const dates = [];
  for (let index = days - 1; index >= 0; index -= 1) dates.push(mfShiftISO(endISO, -index));
  let loggedDays = 0;
  let totalKcal = 0;
  let totalProtein = 0;
  let totalProteinTarget = 0;
  let proteinTargetDays = 0;
  const totals = {};
  const knownKcal = {};
  NUTRITION_DETAIL_FIELDS.forEach((field) => {
    totals[field.key] = 0;
    knownKcal[field.key] = 0;
  });

  dates.forEach((date) => {
    const meals = Array.isArray(planer && planer[date]) ? planer[date] : [];
    if (!meals.length) return;
    loggedDays += 1;
    if (profile) {
      const dayType = (dayTypes && dayTypes[date]) || "training";
      const dayMultiplier = DAY_TYPE_MULTIPLIERS[dayType] ?? DAY_TYPE_MULTIPLIERS.training;
      totalProteinTarget += calcTargets(profile, dayMultiplier).protein;
      proteinTargetDays += 1;
    }
    meals.forEach((meal) => {
      const nutrition = completeMealNutrition(meal, products);
      const mealKcal = Math.max(0, parseFloat(nutrition.kcal) || 0);
      totalKcal += mealKcal;
      totalProtein += Math.max(0, parseFloat(nutrition.protein) || 0);
      NUTRITION_DETAIL_FIELDS.forEach((field) => {
        const value = optionalNutritionNumber(nutrition[field.key]);
        if (value === null) return;
        totals[field.key] += value;
        knownKcal[field.key] += mealKcal;
      });
    });
  });

  const details = {};
  NUTRITION_DETAIL_FIELDS.forEach((field) => {
    const coverage = totalKcal > 0 ? knownKcal[field.key] / totalKcal : 0;
    details[field.key] = {
      total: totals[field.key],
      average: loggedDays && coverage >= 0.7 ? totals[field.key] / loggedDays : null,
      coverage,
      coveragePct: Math.round(coverage * 100),
    };
  });

  return {
    from: dates[0],
    to: dates[dates.length - 1],
    days,
    loggedDays,
    totalKcal,
    avgKcal: loggedDays ? totalKcal / loggedDays : null,
    totalProtein,
    avgProtein: loggedDays ? totalProtein / loggedDays : null,
    avgProteinTarget: proteinTargetDays ? totalProteinTarget / proteinTargetDays : null,
    details,
  };
}

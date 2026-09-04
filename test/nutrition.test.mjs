import assert from "node:assert/strict";
import test from "node:test";
import {
  calcBMR,
  calcFormulaTDEE,
  calcMacro,
  calcNavyBodyFat,
  calcTDEE,
  calcTargets,
  completeMealNutrition,
  nutritionDetailCompleteness,
  nutritionPeriodSummary,
  optionalNutritionNumber,
  r2,
  rGram,
  scaledNutritionDetails,
  sumMealNutrition,
} from "../src/domain/nutrition.js";

const profile = {
  gender: "m",
  age: 34,
  height: 192,
  weight: 97,
  activity: "sedentary",
};

test("BMR i TDEE zachowują dotychczasowe wzory i limity ręcznej kalibracji", () => {
  assert.equal(calcBMR(profile), 2005);
  assert.equal(calcFormulaTDEE(profile), 2406);
  assert.equal(calcTDEE({ ...profile, tdeeManual: "2750.6" }), 2751);
  assert.equal(calcTDEE({ ...profile, tdeeManual: "1199" }), 2406);
  assert.equal(calcTDEE({ ...profile, tdeeManual: "6001" }), 2406);
});

test("cele automatyczne i ręczne poprawnie rozdzielają kalorie na makro", () => {
  assert.deepEqual(
    calcTargets({ ...profile, tdeeManual: 2000, macroMode: "manual", macroProt: 30, macroFat: 25, macroCarb: 45 }),
    { kcal: 2000, protein: 150, carbs: 225, fat: 56 },
  );
  const automatic = calcTargets({ ...profile, tdeeManual: 2400, tdeeAdjust: -10 }, 0.85);
  assert.deepEqual(automatic, { kcal: 1836, protein: 213, carbs: 131, fat: 51 });
  assert.deepEqual(calcTargets({}), { kcal: 2800, protein: 180, carbs: 280, fat: 70 });
});

test("Navy BF zwraca kontrolowany szacunek i odrzuca błędne wymiary", () => {
  assert.equal(calcNavyBodyFat(profile, { neck: 39, belly: 88 }), 15.7);
  assert.equal(calcNavyBodyFat(profile, { neck: 90, belly: 88 }), null);
  assert.equal(calcNavyBodyFat({ ...profile, gender: "f" }, { neck: 34, waist: 76 }), null);
});

test("makro składników skaluje gramaturę i oznacza niepełne szczegóły", () => {
  const products = [
    { id: "rice", kcal: 360, protein: 7, carbs: 80, fat: 1, sugars: 0.5, fiber: 1, saturatedFat: 0.2, salt: 0.01 },
    { id: "chicken", kcal: 165, protein: 31, carbs: 0, fat: 3.6, sugars: null, fiber: 0, saturatedFat: 1, salt: 0.2 },
  ];
  const total = calcMacro(
    [{ productId: "rice", grams: 100 }, { productId: "chicken", grams: 200 }],
    products,
  );
  assert.equal(total.kcal, 690);
  assert.equal(total.protein, 69);
  assert.equal(total.carbs, 80);
  assert.equal(r2(total.fat), 8.2);
  assert.equal(total.sugars, null);
  assert.equal(total.fiber, 1);
  assert.equal(rGram(total.salt), 0.41);
});

test("brak produktu używa zapisanych wartości posiłku zamiast zerować dzień", () => {
  const meal = {
    kcal: "450",
    protein: "30",
    carbs: "50",
    fat: "12",
    fiber: "8",
    salt: "1.2",
    items: [{ productId: "missing", grams: 100 }],
  };
  const result = completeMealNutrition(meal, []);
  assert.equal(result.kcal, 450);
  assert.equal(result.protein, 30);
  assert.equal(result.fiber, 8);
  assert.equal(result.sugars, null);
});

test("suma szczegółów jest podawana tylko przy kompletnych danych", () => {
  const total = sumMealNutrition(
    [
      { kcal: 300, protein: 20, carbs: 30, fat: 10, fiber: 5, salt: 1 },
      { kcal: 200, protein: 10, carbs: 20, fat: 5, fiber: null, salt: 0.5 },
    ],
    [],
  );
  assert.deepEqual(
    { kcal: total.kcal, protein: total.protein, carbs: total.carbs, fat: total.fat },
    { kcal: 500, protein: 30, carbs: 50, fat: 15 },
  );
  assert.equal(total.fiber, null);
  assert.equal(total.salt, 1.5);
});

test("raport okresu wymaga 70% pokrycia szczegółowych danych", () => {
  const summary = nutritionPeriodSummary(
    {
      "2026-09-03": [{ kcal: 500, protein: 40, fiber: 10, salt: 1 }],
      "2026-09-04": [{ kcal: 500, protein: 60, fiber: null, salt: 2 }],
    },
    [],
    "2026-09-04",
    2,
    { ...profile, tdeeManual: 2400 },
    { "2026-09-03": "training", "2026-09-04": "rest" },
  );
  assert.equal(summary.loggedDays, 2);
  assert.equal(summary.avgKcal, 500);
  assert.equal(summary.avgProtein, 50);
  assert.equal(summary.details.fiber.coveragePct, 50);
  assert.equal(summary.details.fiber.average, null);
  assert.equal(summary.details.salt.coveragePct, 100);
  assert.equal(summary.details.salt.average, 1.5);
});

test("walidacja szczegółów akceptuje zero, ale odrzuca braki i wartości ujemne", () => {
  assert.equal(optionalNutritionNumber(0), 0);
  assert.equal(optionalNutritionNumber(""), null);
  assert.equal(optionalNutritionNumber(-1), null);
  assert.equal(nutritionDetailCompleteness({ sugars: 0, fiber: 5, saturatedFat: "", salt: 1 }), 3);
  assert.deepEqual(scaledNutritionDetails({ sugars: 2, fiber: null, saturatedFat: 1, salt: 0.5 }, 1.5), {
    sugars: 3,
    fiber: null,
    saturatedFat: 1.5,
    salt: 0.8,
  });
});

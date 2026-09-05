import assert from "node:assert/strict";
import test from "node:test";
import {
  buildShoppingMap,
  mergeShoppingQuantities,
  missingRecipeShoppingItems,
  normalizeShoppingQuantities,
  removeManualShoppingProduct,
} from "../src/domain/shopping.js";

test("brakujące składniki przepisu zachowują aktualną gramaturę i scalają duplikaty", () => {
  const items = [
    { productId: "rice", grams: 160 },
    { productId: "chicken", grams: 300 },
    { productId: "rice", grams: 40 },
  ];
  assert.deepEqual(missingRecipeShoppingItems(items, [0, 2, 2, 99]), [
    { productId: "rice", grams: 200 },
  ]);
});

test("ręczne zakupy dodają ilość do istniejącej pozycji bez tworzenia drugiego wiersza", () => {
  assert.deepEqual(
    mergeShoppingQuantities({ rice: 100, broken: "x" }, [
      { productId: "rice", grams: 60 },
      { productId: "chicken", grams: 300 },
    ]),
    { rice: 160, chicken: 300 },
  );
});

test("lista łączy planer i ręczne zakupy, ale zachowuje ich pochodzenie", () => {
  const products = [
    { id: "rice", name: "Ryż", packageSize: 400 },
    { id: "chicken", name: "Kurczak", packageSize: null },
  ];
  const map = buildShoppingMap(
    [{ productId: "rice", grams: 100 }, { productId: "chicken", grams: 200 }],
    products,
    { rice: 150 },
  );
  assert.deepEqual(map.rice, {
    name: "Ryż",
    qty: 250,
    plannedQty: 100,
    manualQty: 150,
    packageSize: 400,
  });
  assert.equal(map.chicken.qty, 200);
  assert.equal(map.chicken.manualQty, 0);
});

test("normalizacja i usuwanie odrzucają błędne ilości bez modyfikowania wejścia", () => {
  const input = { rice: 120, zero: 0, negative: -5, text: "abc" };
  assert.deepEqual(normalizeShoppingQuantities(input), { rice: 120 });
  assert.deepEqual(removeManualShoppingProduct(input, "rice"), {});
  assert.equal(input.rice, 120);
});

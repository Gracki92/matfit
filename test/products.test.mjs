import assert from "node:assert/strict";
import test from "node:test";
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
} from "../src/domain/products.js";

test("bazowy katalog ma kompletne, unikalne i poprawne rekordy", () => {
  assert.equal(PRODUCTS_DEFAULT.length, 128);
  assert.equal(new Set(PRODUCTS_DEFAULT.map((product) => product.id)).size, PRODUCTS_DEFAULT.length);
  const categoryKeys = new Set(PRODUCT_CATEGORIES.map((category) => category.key));
  for (const product of PRODUCTS_DEFAULT) {
    assert.match(product.id, /^base_/);
    assert.equal(product.custom, false);
    assert.equal(product.brand, "MatFit");
    assert.ok(categoryKeys.has(product.category));
    for (const field of ["kcal", "protein", "carbs", "fat"]) {
      assert.ok(Number.isFinite(product[field]) && product[field] >= 0, `${product.id}: ${field}`);
    }
  }
  const chicken = PRODUCTS_DEFAULT.find((product) => product.id === "base_chicken_breast_raw");
  assert.deepEqual(
    { kcal: chicken.kcal, protein: chicken.protein, carbs: chicken.carbs, fat: chicken.fat, ref: chicken.nutritionRef },
    { kcal: 99, protein: 21.5, carbs: 0, fat: 1.3, ref: "FDC 171077" },
  );
});

test("EAN i GTIN są normalizowane oraz sprawdzane cyfrą kontrolną", () => {
  assert.equal(normalizeBarcode("590-1234 123457"), "5901234123457");
  assert.equal(isValidGtin("5901234123457"), true);
  assert.equal(isValidGtin("96385074"), true);
  assert.equal(isValidGtin("036000291452"), true);
  assert.equal(isValidGtin("10012345000017"), true);
  assert.equal(isValidGtin("5901234123456"), false);
  assert.equal(isValidGtin("123"), false);
});

test("scalanie zachowuje własne produkty i nie pozwala nadpisać bazy", () => {
  const defaults = [{ id: "base_rice", name: "Ryż bazowy", custom: false }];
  const own = { id: "u1", name: "Własny", custom: true };
  const result = mergeProductCatalog(
    [own, { id: "u1", name: "Duplikat" }, { id: "base_rice", name: "Fałszywa baza" }, null, {}],
    defaults,
  );
  assert.deepEqual(result, [own, defaults[0]]);
  assert.deepEqual(onlyUserProducts(result, defaults), [own]);
});

test("wyszukiwanie duplikatu preferuje EAN, a bez EAN używa nazwy i marki", () => {
  const products = [
    { id: "a", name: "Skyr", brand: "Marka A", ean: "5901234123457" },
    { id: "b", name: "Skyr", brand: "Marka B", ean: null },
  ];
  assert.equal(findProductByBarcode(products, "590-1234-123457").id, "a");
  assert.equal(findDuplicateProduct(products, { name: "Inna nazwa", ean: "5901234123457" }).id, "a");
  assert.equal(findDuplicateProduct(products, { name: "skyr", brand: " marka b " }).id, "b");
  assert.equal(findProductByBarcode(products, ""), undefined);
});

test("filtry katalogu obejmują kategorię, ulubione i tekst stanu", () => {
  const products = [
    { id: "a", name: "Pierś", brand: "MatFit", state: "surowa", category: "protein", custom: false },
    { id: "b", name: "Mój skyr", brand: "Domowy", state: "naturalny", category: "dairy", custom: true },
  ];
  const categories = [{ key: "protein", label: "Mięso i białko" }, { key: "dairy", label: "Nabiał" }];
  assert.deepEqual(filterProductCatalog(products, { category: "own" }).map((item) => item.id), ["b"]);
  assert.deepEqual(filterProductCatalog(products, { category: "favorite", favoriteIds: ["a"] }).map((item) => item.id), ["a"]);
  assert.deepEqual(filterProductCatalog(products, { category: "all", search: "surow", categories }).map((item) => item.id), ["a"]);
  assert.deepEqual(filterProductCatalog(products, { category: "all", search: "nabiał", categories }).map((item) => item.id), ["b"]);
  assert.deepEqual(countProductTypes(products), { user: 1, base: 1 });
});

test("ulubione i ostatnio używane produkty zachowują kolejność bez duplikatów", () => {
  assert.deepEqual(toggleProductId(["a", "b"], "a"), ["b"]);
  assert.deepEqual(toggleProductId(["a", "b"], "c"), ["c", "a", "b"]);
  assert.deepEqual(nextRecentProductIds(["a", "b", "c"], "b", 3), ["b", "a", "c"]);
  assert.deepEqual(nextRecentProductIds(["a", "b", "c"], "d", 3), ["d", "a", "b"]);
});

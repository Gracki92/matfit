import { access, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const requiredFiles = [
  "index.html",
  "assets/styles.css",
  "src/app.js",
  "src/domain/date.js",
  "src/domain/planner.js",
  "src/register-sw.js",
  "vendor/react.production.min.js",
  "vendor/react-dom.production.min.js",
  "vendor/prop-types.min.js",
  "vendor/recharts.min.js",
  "manifest.json",
  "sw.js",
  "icon-192.png",
  "icon-512.png",
];

await Promise.all(requiredFiles.map((file) => access(new URL(file, root))));

const [html, app, dates, planner, styles, serviceWorker, manifestText] = await Promise.all([
  readFile(new URL("index.html", root), "utf8"),
  readFile(new URL("src/app.js", root), "utf8"),
  readFile(new URL("src/domain/date.js", root), "utf8"),
  readFile(new URL("src/domain/planner.js", root), "utf8"),
  readFile(new URL("assets/styles.css", root), "utf8"),
  readFile(new URL("sw.js", root), "utf8"),
  readFile(new URL("manifest.json", root), "utf8"),
]);

const orderedScripts = [
  "./vendor/react.production.min.js",
  "./vendor/react-dom.production.min.js",
  "./vendor/prop-types.min.js",
  "./vendor/recharts.min.js",
  "./src/app.js",
  "./src/register-sw.js",
];
let lastPosition = -1;
for (const source of orderedScripts) {
  const position = html.indexOf(`src="${source}"`);
  if (position <= lastPosition) throw new Error(`Brak skryptu lub zła kolejność: ${source}`);
  lastPosition = position;
}

if (!html.includes('href="./assets/styles.css"')) throw new Error("Brak arkusza stylów w index.html");
if (!html.includes('href="./manifest.json"')) throw new Error("Brak manifestu PWA w index.html");
if (!html.includes('<script type="module" src="./src/app.js"></script>')) throw new Error("Aplikacja musi być ładowana jako moduł ES");
if (/<style[\s>]/i.test(html)) throw new Error("CSS ponownie trafił do index.html");
if (/<script>(?!\s*<\/script>)/i.test(html)) throw new Error("Kod JS ponownie trafił do index.html");
if (!styles.includes("max-width:430px")) throw new Error("Brak docelowej szerokości telefonu");
if (!app.includes('from "./domain/date.js"')) throw new Error("Aplikacja nie importuje domeny dat");
if (!app.includes('from "./domain/planner.js"')) throw new Error("Aplikacja nie importuje domeny planera");
for (const removedHelper of ["mfDate", "mfISODate", "mfShiftISO", "mfDaysBetween", "getWeek", "getWeekNumber"]) {
  if (app.includes(`function ${removedHelper}`)) throw new Error(`Logika dat wróciła do pliku aplikacji: ${removedHelper}`);
}
for (const exportedFunction of ["mfDate", "mfISODate", "mfShiftISO", "mfDaysBetween", "getWeek", "getWeekNumber"]) {
  if (!dates.includes(`export function ${exportedFunction}`)) throw new Error(`Brak eksportu domeny dat: ${exportedFunction}`);
}
if (app.includes("function plannedMealCopyKey") || app.includes("function clonePlannedMeal")) throw new Error("Logika planera wróciła do pliku aplikacji");
for (const exportedFunction of ["plannedMealCopyKey", "clonePlannedMeal"]) {
  if (!planner.includes(`export function ${exportedFunction}`)) throw new Error(`Brak eksportu domeny planera: ${exportedFunction}`);
}

for (const key of ["fb10_planer", "fb10_product_favorites", "fb10_recent_products", "fb10_product_grams"]) {
  if (!app.includes(key)) throw new Error(`Brak stabilnego klucza danych: ${key}`);
}

const manifest = JSON.parse(manifestText);
if (manifest.start_url !== "./" || manifest.scope !== "./") throw new Error("Manifest musi działać z podkatalogu DEV");
for (const asset of ["./index.html", "./assets/styles.css", "./src/app.js", "./src/domain/date.js", "./src/domain/planner.js"]) {
  if (!serviceWorker.includes(asset)) throw new Error(`Service worker nie obejmuje pliku: ${asset}`);
}

console.log("MatFit project check: OK");

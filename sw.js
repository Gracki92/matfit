const CACHE = "matfit-v40";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./assets/styles.css",
  "./vendor/react.production.min.js",
  "./vendor/react-dom.production.min.js",
  "./vendor/prop-types.min.js",
  "./vendor/recharts.min.js",
  "./src/app.js",
  "./src/domain/backup.js",
  "./src/domain/date.js",
  "./src/domain/nutrition.js",
  "./src/domain/pantry.js",
  "./src/domain/planner.js",
  "./src/domain/products.js",
  "./src/domain/recipes.js",
  "./src/domain/shopping.js",
  "./src/register-sw.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === "navigate") return caches.match("./index.html");
        return Response.error();
      }),
  );
});

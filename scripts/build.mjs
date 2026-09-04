import { cp, mkdir, rm } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
const files = [
  "index.html",
  "manifest.json",
  "sw.js",
  "icon-192.png",
  "icon-512.png",
  "assets",
  "src",
  "vendor",
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const file of files) {
  await cp(new URL(file, root), new URL(file, dist), { recursive: true });
}

console.log("Build MatFit gotowy w dist/");

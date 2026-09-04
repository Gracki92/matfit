import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import {
  getWeek,
  getWeekNumber,
  mfDate,
  mfDaysBetween,
  mfFormatDate,
  mfFormatShortDate,
  mfISODate,
  mfShiftISO,
} from "../src/domain/date.js";

test("lokalna data zachowuje klucz dnia YYYY-MM-DD", () => {
  assert.equal(mfISODate(new Date(2026, 8, 4, 0, 30)), "2026-09-04");
  assert.equal(mfISODate(mfDate("2026-09-04T23:59:59Z")), "2026-09-04");
});

test("przesuwanie i różnica dni działają przez zmianę czasu", () => {
  assert.equal(mfShiftISO("2026-03-28", 1), "2026-03-29");
  assert.equal(mfShiftISO("2026-03-29", -1), "2026-03-28");
  assert.equal(mfDaysBetween("2026-03-28", "2026-03-30"), 2);
});

test("tydzień biegnie od poniedziałku do niedzieli", () => {
  const week = getWeek(0, new Date(2026, 8, 4, 12));
  assert.deepEqual(week.map(mfISODate), [
    "2026-08-31",
    "2026-09-01",
    "2026-09-02",
    "2026-09-03",
    "2026-09-04",
    "2026-09-05",
    "2026-09-06",
  ]);
  assert.equal(mfISODate(getWeek(1, new Date(2026, 8, 4, 12))[0]), "2026-09-07");
});

test("numer tygodnia jest zgodny z ISO na granicy roku", () => {
  assert.equal(getWeekNumber(new Date(2020, 11, 31, 12)), 53);
  assert.equal(getWeekNumber(new Date(2021, 0, 4, 12)), 1);
});

test("formatowanie dat pozostaje polskie", () => {
  assert.match(mfFormatDate("2026-09-04"), /4.*wrz.*2026/i);
  assert.match(mfFormatShortDate("2026-09-04"), /4.*wrz/i);
});

test("klucz dnia nie cofa się w polskiej strefie czasowej", () => {
  const moduleUrl = pathToFileURL(fileURLToPath(new URL("../src/domain/date.js", import.meta.url))).href;
  const script = `import { mfISODate } from ${JSON.stringify(moduleUrl)}; process.stdout.write(mfISODate(new Date(2026, 8, 4, 0, 30)));`;
  const result = execFileSync(process.execPath, ["--input-type=module", "--eval", script], {
    encoding: "utf8",
    env: { ...process.env, TZ: "Europe/Warsaw" },
  });
  assert.equal(result, "2026-09-04");
});

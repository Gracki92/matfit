const DAY_MS = 86_400_000;

export function mfDate(value) {
  return new Date(`${String(value).slice(0, 10)}T12:00:00`);
}

export function mfISODate(value) {
  const date = value instanceof Date ? new Date(value) : mfDate(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function mfShiftISO(value, days) {
  const date = mfDate(value);
  date.setDate(date.getDate() + Math.round(days || 0));
  return mfISODate(date);
}

export function mfDaysBetween(from, to) {
  return Math.round((mfDate(to) - mfDate(from)) / DAY_MS);
}

export function mfFormatDate(value) {
  return mfDate(value).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function mfFormatShortDate(value) {
  return mfDate(value).toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
}

export function getWeek(offset = 0, baseDate = new Date()) {
  const date = new Date(baseDate);
  const mondayOffset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() + offset * 7);

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(date);
    day.setDate(date.getDate() - mondayOffset + index);
    return day;
  });
}

export function getWeekNumber(value) {
  const date = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date - yearStart) / DAY_MS + 1) / 7);
}

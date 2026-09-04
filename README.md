# MatFit Pro

Mobilna aplikacja żywieniowa rozwijana na gałęzi `matfit-dev`. Wersja DEV działa bez backendu i przechowuje dane użytkownika lokalnie w przeglądarce.

## Struktura

- `index.html` — mały dokument startowy i kolejność ładowania zasobów;
- `src/app.js` — aktualny kod aplikacji React, wydzielony bez zmiany zachowania;
- `assets/styles.css` — wspólny system wizualny i układ mobile-first;
- `vendor/` — przypięte, lokalne wydania React, ReactDOM, PropTypes i Recharts;
- `legacy/app.jsx` — historyczne, nieużywane źródło zachowane wyłącznie jako punkt odniesienia;
- `test/` — testy krytycznej logiki i zgodności danych;
- `scripts/` — kontrola integralności oraz powtarzalny build do `dist/`;
- `sw.js` i `manifest.json` — fundament instalowalnej aplikacji i trybu offline.

## Praca lokalna

Wymagany jest Node.js 20 lub nowszy. Projekt nie wymaga instalowania paczek.

```bash
npm run check
npm run build
```

`npm run check` sprawdza składnię aplikacji, kolejność zależności, stabilność kluczy localStorage, konfigurację PWA oraz testy logiki. `npm run build` tworzy gotowy statyczny pakiet w `dist/`.

## Zasady migracji

Pierwszy etap rozdziela działający monolit na pliki bez przepisywania interfejsu i bez zmiany kluczy localStorage. Kolejne moduły będą wydzielane z `src/app.js` małymi, testowanymi partiami. Dzięki temu aplikacja zachowuje obecną funkcjonalność podczas porządkowania kodu.

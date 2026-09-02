# MatFit Pro — roadmap

Stan bazowy: 1 września 2026. Rozwój odbywa się na gałęzi `matfit-dev`; `main` jest aktualizowany dopiero po akceptacji przetestowanego etapu.

## Aktualny etap — rdzeń aplikacji

- [x] Procent kalorii może przekraczać 100%, pasek zatrzymuje się na 100%.
- [x] Zwijanie i rozwijanie posiłków w planerze.
- [x] Kcal i B/W/T posiłku pozostają widoczne po zwinięciu.
- [x] Dodawanie nowego produktu bezpośrednio z planera.
- [x] Cel sylwetkowy PRO i przewidywany finisz (wersja DEV do testów).
- [x] Historia pomiarów i wykresy.
- [x] Woda v1: cel sugerowany lub własny, dolewki, cofanie i historia 7 dni.
- [ ] Powiadomienia o wodzie (etap aplikacji Android).
- [x] Startowa baza produktów: 82 pozycje, kategorie i bezpieczne scalanie z produktami użytkownika.
- [x] Przepisy v1: 10 przepisów startowych, wyszukiwanie i kategorie, własne przepisy, edycja/usuwanie, porcje i dodawanie do planera.
- [ ] Generator kart PNG/PDF.
- [ ] Backup i przywracanie danych.
- [ ] Przygotowanie wydania Android / Google Play.

## Elastyczne przepisy

Funkcja jest zaplanowana po ustabilizowaniu rdzenia i rozpoczęciu dodawania naszych przepisów.

- suwak liczby porcji;
- zmiana docelowej gramatury całego przepisu;
- niezależna edycja gramatury każdego składnika;
- ustawienie docelowej ilości białka;
- ustawienie docelowej liczby kalorii;
- proporcjonalne skalowanie składników;
- natychmiastowe przeliczenie kcal oraz B/W/T;
- aktualizacja karty przepisu po każdej zmianie;
- możliwość przywrócenia gramatur bazowych;
- zabezpieczenia przed nierealnymi wartościami i czytelne zaokrąglenia.

## Dalszy rozwój

- gotowe plany treningowe: dom bez sprzętu, gumy, hantle, siłownia, FBW, push–pull i inne;
- poziomy beginner, intermediate i advanced;
- pakiety funkcjonalne i mobilnościowe;
- profil treningowy oraz generator planów AI;
- aktywność ręczna, Health Connect i Garmin;
- automatyczna, kontrolowana korekta kalorii względem aktywności;
- streak, podsumowanie dnia i tygodnia, raporty oraz widget Android.

## Zasady produktu

- narzędzie przed funkcjami społecznościowymi;
- małe, testowalne etapy zamiast wielu równoległych zmian;
- wersja DEV przed przeniesieniem na produkcję;
- integracje treningowe i zdrowotne nie mogą udawać diagnozy medycznej;
- przed Google Play kod zostanie przeniesiony z pojedynczego HTML-a do utrzymywalnego projektu React z procesem budowania i warstwą Android.

# MatFit Pro — roadmap

Stan bazowy: 1 września 2026. Rozwój odbywa się na gałęzi `matfit-dev`; `main` jest aktualizowany dopiero po akceptacji przetestowanego etapu.

## Aktualny etap — rdzeń aplikacji

- [x] Procent kalorii może przekraczać 100%, pasek zatrzymuje się na 100%.
- [x] Zwijanie i rozwijanie posiłków w planerze.
- [x] Kcal i B/W/T posiłku pozostają widoczne po zwinięciu.
- [x] Dodawanie nowego produktu bezpośrednio z planera.
- [x] Cel sylwetkowy PRO v2: adaptacyjna prognoza, przedział finiszu i wykres ekstrapolacji (wersja DEV do testów).
- [x] Historia pomiarów, trendy, szacowana zmiana składu masy i korelacje z progami jakości danych.
- [x] Woda v1: cel sugerowany lub własny, dolewki, cofanie i historia 7 dni.
- [ ] Powiadomienia o wodzie (etap aplikacji Android).
- [x] Startowa baza produktów: 82 pozycje, kategorie i bezpieczne scalanie z produktami użytkownika.
- [x] Przepisy v1: 10 przepisów startowych, wyszukiwanie i kategorie, własne przepisy, edycja/usuwanie, porcje i dodawanie do planera.
- [x] Generator kart v1: style Sweet/Savory, segmentowe logo MatFit, zdjęcie, aktywny wariant przepisu, eksport PNG oraz PDF/druk.
- [ ] Zdjęcia AI do kart przez bezpieczny backend (bez klucza API w HTML).
- [ ] Osobny skrócony format karty do social mediów.
- [x] Backup/Restore PRO: pełna, wersjonowana kopia danych; podgląd zawartości; scalanie lub zastąpienie; automatyczna kopia ratunkowa; zgodność ze starszym formatem i walidacja pliku.
- [x] Skaner EAN v1: aparat lub kod ręczny, walidacja GTIN, lokalna baza i Open Food Facts, poprawianie danych, ręczne dodanie oraz ochrona przed duplikatami.
- [ ] Przygotowanie wydania Android / Google Play.

## Elastyczne przepisy

Wersja v1 działa w DEV i czeka na testy przed przeniesieniem na produkcję.

- [x] suwak liczby porcji, także ułamkowej od 0,10 ze skokiem 0,05 (np. 20%, 35% lub 90% porcji);
- [x] zmiana docelowej gramatury całego przepisu;
- [x] niezależna edycja gramatury każdego składnika;
- [x] ustawienie docelowej ilości białka;
- [x] ustawienie docelowej liczby kalorii;
- [x] proporcjonalne skalowanie składników;
- [x] natychmiastowe przeliczenie kcal oraz B/W/T;
- [x] przekazanie zmienionego wariantu do planera i podglądu karty;
- [x] możliwość przywrócenia gramatur bazowych;
- [x] zabezpieczenia przed nierealnymi wartościami i czytelne zaokrąglenia.

## Cel sylwetkowy PRO v2

Wersja v2 działa w DEV i wymaga testu na prawdziwej historii pomiarów przed przeniesieniem na produkcję.

- [x] prognoza teoretyczna z bilansu energii i orientacyjnego przelicznika 7700 kcal/kg;
- [x] automatyczne przejście na prognozę adaptacyjną po minimum 3 pomiarach z co najmniej 14 dni;
- [x] ważenie prognozy rzeczywistym trendem z ostatnich 42 dni oraz ograniczenie nierealnego tempa;
- [x] centralna data finiszu i bezpieczny przedział niepewności zamiast jednej „pewnej” daty;
- [x] wykres masy rzeczywistej, średniej 7-dniowej, prognozy, zakresu oraz wagi docelowej;
- [x] zapamiętany punkt startowy celu z możliwością świadomego resetu;
- [x] szacowana zmiana masy tłuszczowej i pozostałej masy z jawnym opisem ograniczeń;
- [x] korelacje: waga–pas, waga–BF, pas–BF oraz wpisany deficyt–tempo zmiany masy;
- [x] odblokowanie korelacji dopiero przy wystarczającej liczbie serii i rozpiętości minimum 42 dni;
- [x] walidacja pomiarów oraz synchronizacja najnowszej wagi z profilem;
- [x] zgodność nowych danych celu z istniejącym localStorage i Backup/Restore PRO.
- [x] oddzielna przestrzeń danych DEV z jednorazowym, bezpiecznym skopiowaniem dotychczasowych danych do testów.

## Dalszy rozwój

Kolejność po zatwierdzeniu obecnego DEV:

1. rozdzielenie „planu” od „faktycznie zjedzone” oraz szybkie odhaczanie posiłków — warunek wiarygodnej analityki;
2. cotygodniowy check-in i kontrolowana rekomendacja korekty kalorii na podstawie trendu wagi, pasa i zgodności z planem;
3. migracja pojedynczego HTML-a do utrzymywalnego projektu React z testami, wersjonowaniem danych i procesem budowania;
4. aplikacja Android: tryb offline, powiadomienia, widget, Health Connect; Garmin po ustabilizowaniu warstwy aktywności;
5. gotowe plany treningowe: dom bez sprzętu, gumy, hantle, siłownia, FBW, push–pull i inne;
6. poziomy beginner, intermediate i advanced oraz pakiety funkcjonalne i mobilnościowe;
7. profil treningowy, progresja obciążeń, historia rekordów i generator planów AI z ograniczeniami bezpieczeństwa;
8. podsumowanie dnia i tygodnia, streak oparty na zachowaniu, raporty oraz eksport dla trenera/dietetyka;
9. bezpieczny backend do zdjęć AI kart i skrócony format kart do social mediów;
10. onboarding, dostępność, telemetria błędów, polityka prywatności i przygotowanie publikacji Google Play.

## Zasady produktu

- narzędzie przed funkcjami społecznościowymi;
- małe, testowalne etapy zamiast wielu równoległych zmian;
- wersja DEV przed przeniesieniem na produkcję;
- integracje treningowe i zdrowotne nie mogą udawać diagnozy medycznej;
- przed Google Play kod zostanie przeniesiony z pojedynczego HTML-a do utrzymywalnego projektu React z procesem budowania i warstwą Android.

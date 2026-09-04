# MatFit Pro — roadmap

Ostatnia aktualizacja: 4 września 2026. Rozwój odbywa się na gałęzi `matfit-dev`; `main` jest aktualizowany dopiero po akceptacji przetestowanego etapu.

## Aktualny etap — rdzeń aplikacji

- [x] Procent kalorii może przekraczać 100%, pasek zatrzymuje się na 100%.
- [x] Zwijanie i rozwijanie posiłków w planerze.
- [x] Kcal i B/W/T posiłku pozostają widoczne po zwinięciu.
- [x] Dodawanie nowego produktu bezpośrednio z planera.
- [x] Cel sylwetkowy PRO v2: adaptacyjna prognoza, przedział finiszu i wykres ekstrapolacji (wersja DEV do testów).
- [x] Historia pomiarów, trendy, szacowana zmiana składu masy i korelacje z progami jakości danych.
- [x] Automatyczny raport ostatnich 7 dni: średnie kcal, realizacja celu, masa, pas, tempo i zmiana prognozy finiszu.
- [x] Ostrożna kalibracja TDEE po minimum 28 dniach i 70% dni z wpisanym jedzeniem; zmiana wyłącznie po akceptacji użytkownika.
- [x] Woda v1: cel sugerowany lub własny, dolewki, cofanie i historia 7 dni.
- [ ] Powiadomienia o wodzie (etap aplikacji Android).
- [x] Startowa baza produktów: 128 pozycji, kategorie i bezpieczne scalanie z produktami użytkownika.
- [x] Przepisy v1: 10 przepisów startowych, wyszukiwanie i kategorie, własne przepisy, edycja/usuwanie, porcje i dodawanie do planera.
- [x] Generator kart v1: style Sweet/Savory, segmentowe logo MatFit, zdjęcie, aktywny wariant przepisu, eksport PNG oraz PDF/druk.
- [ ] Zdjęcia AI do kart przez bezpieczny backend (bez klucza API w HTML).
- [ ] Osobny skrócony format karty do social mediów.
- [x] Backup/Restore PRO: pełna, wersjonowana kopia danych; podgląd zawartości; scalanie lub zastąpienie; automatyczna kopia ratunkowa; zgodność ze starszym formatem i walidacja pliku.
- [x] Skaner EAN v1: aparat lub kod ręczny, walidacja GTIN, lokalna baza i Open Food Facts, poprawianie danych, ręczne dodanie oraz ochrona przed duplikatami.
- [ ] Przygotowanie wydania Android / Google Play.

## Audyt stabilności DEV — 4 września 2026

- [x] Pełny smoke test siedmiu modułów: Profil, Pomiary, Woda, Planer, Przepisy, Produkty i Zakupy.
- [x] Daty i klucze dni korzystają z lokalnej strefy użytkownika zamiast UTC, więc wpisy nie przeskakują na sąsiedni dzień.
- [x] Elastyczne porcje zachowują dokładne wartości, w tym 0,35 porcji, bez narastającego błędu zaokrągleń.
- [x] Ręczna korekta zjedzonej gramatury aktualizuje również opis pozycji, kcal oraz B/W/T.
- [x] Lista zakupów liczy 1, 3 lub 7 dni od aktualnie wybranego dnia planera, a nie zawsze od poniedziałku.
- [x] Pierwszy pomiar nie pokazuje fałszywej zmiany 0,0, a wykres obwodów startuje od szyi zamiast masy ciała.
- [x] Eksport pełnej kopii zapasowej zawsze pobiera plik JSON i potwierdza zapis w interfejsie.
- [x] Dodawanie własnego produktu, zapis danych i licznik katalogu przeszły test końcowy bez błędów konsoli.
- [ ] W UI v2 nadać wszystkim klikalnym elementom semantykę przycisku, obsługę klawiatury, widoczny fokus i etykiety dla czytników ekranu.

## Migracja React — etap 1

- [x] Wydzielić działający kod aplikacji z ponadmegabajtowego `index.html` bez zmiany zachowania i kluczy localStorage.
- [x] Przenieść style, kod aplikacji oraz przypięte biblioteki do osobnych katalogów `assets`, `src` i `vendor`.
- [x] Dodać kontrolę integralności projektu i testy krytycznej logiki planera uruchamiane przez `npm run check`.
- [x] Dodać powtarzalny build statyczny do katalogu `dist` bez pobierania zależności z sieci.
- [x] Poprawić manifest i service worker tak, aby działały z adresem DEV umieszczonym w podkatalogu oraz aktualizowały cache.
- [x] Zachować poprzedni plik `app.jsx` wyłącznie w katalogu `legacy`, poza paczką produkcyjną.

## Migracja React — etap 2

- [x] Przełączyć plik startowy aplikacji na moduł ES bez zmiany zachowania interfejsu.
- [x] Wydzielić kopiowanie i wykrywanie duplikatów planera do `src/domain/planner.js` oraz testować je przez bezpośredni import.
- [ ] Wydzielać kolejne domeny z `src/app.js` do testowalnych modułów: daty, odżywianie, backup i katalog produktów.

## UI v2.1 — powłoka aplikacji

- [x] Wspólny system wizualny dla motywów Royal i Light: poprawiony kontrast, paleta makro, powierzchnie, obramowania i stany aktywne.
- [x] Docelowy układ mobile-first: kolumna do 430 px i dolny dock również w podglądzie na komputerze, bez przełączania aplikacji w szeroki tryb desktopowy.
- [x] Nowy nagłówek marki, karta dziennego celu, widoczny fokus i obsługa powiększania strony przez użytkownika.
- [x] Semantyczna nawigacja, wskaźnik realizacji kalorii, modal jako dialog oraz etykiety wyszukiwarki i filtrów.
- [x] Obsługa klawiatury dla rozwijania przepisów; czytelne przyciski edycji i usuwania pozycji planera.
- [x] Test siedmiu modułów i obu motywów na niezmiennym adresie commita bez błędów aplikacji.
- [x] Ujednolicić wewnętrzne karty, nagłówki, typografię i stany puste we wszystkich siedmiu modułach.
- [ ] Dokończyć pełny audyt WCAG: kolejność fokusu, wszystkie kontrolki ikonowe, komunikaty live region i test czytnikiem ekranu.

## UI v2.2 — wnętrze modułów

- [x] Jeden komponent nagłówka strony z tytułem, kontekstem i opisem dla Profilu, Pomiarów, Wody, Planera, Przepisów, Produktów i Zakupów.
- [x] Wspólny system kart sekcji i kart list: promienie, subtelne cienie, odstępy oraz zachowanie w motywach Royal i Light.
- [x] Czytelniejsze filtry jako przewijane chipy z większym polem dotyku i stanem `aria-pressed`.
- [x] Pełne stany puste dla przepisów, produktów, zakupów i pierwszego pomiaru, z wyjaśnieniem następnego kroku.
- [x] Spójniejsza hierarchia typografii i responsywny układ nagłówków na telefonie oraz komputerze.
- [ ] Dopracować komunikaty systemowe jako live region i wykonać test czytnikiem ekranu.

## UI v2.3 — dostępność klawiatury

- [x] Klikane dni planera, poziomy aktywności, pozycje listy zakupów, historia wody i wyniki wyszukiwania są semantycznymi przyciskami.
- [x] Stany wyboru przekazują `aria-pressed`, a kontrolki ikonowe otrzymały jednoznaczne etykiety.
- [x] Zmiana głównego modułu przenosi fokus do treści, dzięki czemu użytkownik klawiatury nie wraca za każdym razem przez całą nawigację.
- [x] Standardowe okna modalne przejmują i zamykają pętlę fokusu, obsługują Escape oraz oddają fokus po zamknięciu.
- [x] Skaner EAN i karta przepisu mają semantykę dialogu, obsługę Escape i opisane przyciski zamknięcia.
- [x] Komunikaty typu toast działają jako uprzejmy live region dla technologii asystujących.
- [ ] Wykonać końcowy test kolejności fokusu i czytnika ekranu na docelowym telefonie przed wydaniem produkcyjnym.

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
- [x] zgodność nowych danych celu z istniejącym localStorage i Backup/Restore PRO;
- [x] oddzielna przestrzeń danych DEV z jednorazowym, bezpiecznym skopiowaniem dotychczasowych danych do testów.

## Nutrition Data v2.0 — wartości rozszerzone

- [x] Model produktu obsługuje opcjonalnie: „w tym cukry”, błonnik, kwasy tłuszczowe nasycone i sól na 100 g.
- [x] Brak wartości pozostaje brakiem danych; aplikacja nigdy nie zamienia pustego pola na fałszywe zero.
- [x] Ręczne dodawanie produktu zawiera pola rozszerzone i waliduje relacje: cukry ≤ węglowodany oraz tłuszcze nasycone ≤ tłuszcze ogółem.
- [x] Skaner EAN pobiera dostępne wartości rozszerzone z Open Food Facts, pokazuje kompletność 0–4 i zachowuje źródło oraz datę pobrania.
- [x] Rozszerzone wartości przeliczają się wraz z gramaturą, porcją, wariantem przepisu i ręczną korektą posiłku.
- [x] Użytkownik może jednym przełącznikiem pokazać lub ukryć szczegóły w planerze, podsumowaniu dnia, przepisach i produktach.
- [x] Stare produkty, posiłki, kopie zapasowe i dane localStorage pozostają zgodne bez wymuszonej migracji.
- [x] Uzupełnić szczegółowe wartości referencyjne 119 ze 128 produktów bazowych na podstawie konkretnych rekordów USDA FoodData Central SR Legacy; 103 produkty mają komplet 4/4, a brak lub niespójny pomiar nadal pozostaje brakiem danych.
- [x] Zachować puste szczegóły dla 9 produktów silnie zależnych od marki lub procesu produkcji (m.in. skyr, WPC, pudding i makrela wędzona), zamiast przedstawiać średnią jako pewną wartość etykietową.

## Nutrition Data v2.1 — analiza 7/30 dni

- [x] Dodać 7-dniowe średnie błonnika, soli, tłuszczów nasyconych i cukrów ogółem z wpisanych dni.
- [x] Liczyć pokrycie osobno dla każdego składnika, ważone energią posiłków, aby brak danych nie udawał zera.
- [x] Pokazywać średnią dopiero od 70% pokrycia; przy niepełnych danych oznaczać ją jako wartość minimalną.
- [x] Oceniać cel lub limit dopiero od 90% pokrycia danych.
- [x] Przyjąć punkty odniesienia dla zdrowych dorosłych: błonnik co najmniej 25 g, sól poniżej 5 g i tłuszcze nasycone do 10% energii.
- [x] Nie nadawać limitu cukrom ogółem, ponieważ nie są tym samym co cukry wolne.
- [x] Dodać przełączany widok 7- i 30-dniowy po uzupełnieniu zweryfikowanych danych większej części katalogu.
- [x] Dodać średnie białko oraz procent realizacji średniego celu wyliczanego z profilu i typu każdego wpisanego dnia.

## Nutrition Data v2.2 — rozszerzona baza podstawowa

- [x] Rozszerzyć katalog z 82 do 128 produktów o kolejne ryby, nabiał, kasze, pieczywo, nasiona, warzywa, owoce i produkty spiżarniane.
- [x] Przypisać każdej nowej pozycji konkretny rekord USDA FoodData Central SR Legacy oraz datę weryfikacji.
- [x] Rozróżnić warianty suche i ugotowane tam, gdzie zmieniają się wartości na 100 g.
- [x] Odrzucić niejednoznaczne mapowanie amerykańskiego „potato flour” na polską skrobię ziemniaczaną.
- [ ] Uzupełniać katalog kolejnymi partiami według częstotliwości użycia w polskiej kuchni i zgłoszeń użytkowników.

## Quick Add v1 — szybkie dodawanie jedzenia

- [x] Dodać osobne ulubione produkty z filtrem w katalogu i szybkim wyborem w planerze.
- [x] Pokazywać osiem ostatnio używanych produktów bez dublowania pozycji już widocznych w ulubionych.
- [x] Zapamiętywać ostatnią gramaturę każdego produktu i udostępnić skróty 50, 100, 150 i 200 g.
- [x] Dodać kopiowanie pojedynczego posiłku do wybranego dnia i pory dnia.
- [x] Chronić kopiowanie posiłku i całego dnia przed przypadkowym dodaniem identycznych wpisów.
- [x] Uwzględnić ulubione produkty, historię ostatnich pozycji i zapamiętane gramatury w Backup/Restore PRO.
- [ ] Dodać nazwane szablony całych posiłków po przetestowaniu szybkiego kopiowania na prawdziwych danych.

## Strategia produktu — backlog zarządu

### 1. Domknięcie fundamentu

- [ ] Przetestować cały obecny DEV na prawdziwych danych: planer, elastyczne porcje, raport 7-dniowy, cel sylwetkowy, prognozę i kalibrację TDEE.
- [x] Wykonać pierwszy całościowy audyt braków, błędów, dostępności oraz wygody najważniejszych ścieżek użytkownika.
- [x] Wdrożyć pierwszą iterację nowego interfejsu dla motywów Royal i Light oraz wspólnej, responsywnej powłoki komponentów.
- [ ] Dokończyć rozpoczętą migrację do modułowego projektu React; etap 1 ma już testy, wersjonowanie danych i proces budowania.
- [ ] Dodać onboarding dopasowujący widok do celu, diety, poziomu zaawansowania i preferowanego zakresu danych.

### 2. Nutrition Data v2 i duża baza produktów

- [x] Wykonać pierwszą rozbudowę ręcznie zweryfikowanej bazy podstawowej z 82 do 128 produktów używanych w Polsce.
- [ ] Kontynuować rozbudowę bazy podstawowej kolejnymi zweryfikowanymi partiami.
- [ ] Zbudować duży katalog markowych produktów z polskich sklepów: wyszukiwanie po nazwie, marce, sklepie i kodzie EAN.
- [ ] Zastosować model hybrydowy: mała baza startowa offline + legalne źródła online + lokalna pamięć ostatnich i ulubionych produktów.
- [ ] Przed integracją każdego zewnętrznego źródła wykonać audyt licencji; nie kopiować ani nie scrapować bazy konkurencji.
- [ ] Zapisywać pochodzenie produktu, datę ostatniej weryfikacji, kompletność danych i poziom zaufania do wartości.
- [ ] Scalać duplikaty po EAN oraz umożliwić zgłoszenie i poprawienie błędnych danych bez nadpisywania pewnych danych niezweryfikowaną wersją.
- [x] Rozbudować model wartości odżywczych. Domyślnie: kcal oraz B/W/T; opcjonalnie: **w tym cukry, błonnik, kwasy tłuszczowe nasycone i sól**.
- [x] Traktować „w tym cukry” jako część węglowodanów, a nie czwarte makro „C”; rozróżniać cukry ogółem od cukrów dodanych tylko wtedy, gdy źródło faktycznie to podaje.
- [ ] Dodać opcjonalny widok mikroelementów: sód, potas, wapń, żelazo, magnez oraz wybrane witaminy. Brak danych ma oznaczać „brak danych”, nigdy zero.
- [ ] Pokazywać mikroelementy przede wszystkim jako średnią 7- lub 30-dniową, aby widok pomagał ocenić dietę, a nie zmuszał do codziennego polowania na każdy miligram.
- [ ] Rozszerzyć skaner o OCR etykiety żywieniowej, aby można było dodać produkt, którego nie ma jeszcze w katalogu.

### 3. Szybkie dodawanie jedzenia i asystent AI

- [ ] Dodać szacowanie posiłku ze zdjęcia: rozpoznane składniki, orientacyjne przedziały gramatur i kcal, poziom pewności oraz pytania doprecyzowujące.
- [ ] Przed zapisaniem posiłku użytkownik zatwierdza lub poprawia składniki i porcje; AI nie przedstawia wyniku jako dokładnego pomiaru.
- [ ] Umożliwić zdjęcie z góry i z boku albo użycie znanego rozmiaru talerza jako punktu odniesienia.
- [x] Dodać ostatnie produkty, ulubione, zapamiętaną gramaturę oraz kopiowanie pojedynczego posiłku i całego dnia.
- [ ] Dodać nazwane szablony posiłków po realnych testach Quick Add v1.
- [ ] Rozważyć dodawanie głosowe, np. „200 g skyru i banan”, zawsze z ekranem potwierdzenia.
- [ ] Obsługiwać AI wyłącznie przez bezpieczny backend; żaden klucz API nie może znaleźć się w aplikacji klienckiej.

### 4. Przepisy według produktów, które są w domu

- [ ] Dodać wyszukiwarkę „mam w domu”, w której jeden lub kilka składników można oznaczyć jako obowiązkową bazę przepisu.
- [ ] Dodać tryb „zużyj najpierw” z terminem ważności, spiżarnią i przypomnieniami o kończących się produktach.
- [ ] Wyświetlać procent dopasowania, liczbę brakujących składników oraz możliwe zamienniki.
- [ ] Dopuszczać przepisy z zamiennikiem, np. kefir zamiast jogurtu, ale jasno oznaczać zmianę i ponownie przeliczać makro.
- [ ] Połączyć przepisy ze zbiorczą listą zakupów oraz dodać import przepisu z linku do późniejszej weryfikacji.

### 5. Edukacja i profile żywieniowe — bez udawania lekarza

- [ ] Stworzyć krótkie, aktualizowane ścieżki edukacyjne z podaniem źródeł i daty przeglądu, zamiast automatycznych diagnoz i „diet leczniczych”.
- [ ] Rozdzielić alergię, celiakię, nietolerancję, preferencję i czasową strategię eliminacyjną — to nie są zamienne pojęcia.
- [ ] SIBO: wyjaśniać, że nie oznacza automatycznie diety bezglutenowej; ewentualne strategie, np. low-FODMAP, mają służyć kontroli objawów i wymagają rozsądnego prowadzenia.
- [ ] Insulinooporność: uwzględniać nie tylko indeks glikemiczny, lecz także ilość i jakość węglowodanów, błonnik, skład całego posiłku oraz regularność.
- [ ] Histamina: oznaczać ograniczoną i zmienną jakość dowodów oraz różnice między listami produktów; prowadzić użytkownika przez dziennik objawów, a nie przez stałą, szeroką eliminację.
- [ ] Dodać opcjonalne filtry i ostrzeżenia dla alergenów, glutenu, laktozy, low-FODMAP i innych profili tylko tam, gdzie dane produktu są wystarczające.
- [ ] Dodać dziennik objawów i ostrożne korelacje z posiłkami, snem, stresem i aktywnością; korelacja nigdy nie będzie opisywana jako przyczyna.
- [ ] Przy niepokojących objawach pokazywać jasne czerwone flagi i zalecenie kontaktu z lekarzem lub dietetykiem.

### 6. Treningi i Trener AI

- [ ] Dodać gotowe treningi na 20, 30, 40 i 60 minut według celu, intensywności, miejsca i dostępnego sprzętu.
- [ ] Obsłużyć dom bez sprzętu, gumy, hantle i siłownię oraz warianty FBW, góra/dół, push–pull, mobilność, rozciąganie i kondycję.
- [ ] Dodać poziomy beginner, intermediate i advanced, profil treningowy, historię wyników, progresję i planowane tygodnie lżejsze.
- [ ] Stworzyć zweryfikowaną bibliotekę ćwiczeń z techniką, najczęstszymi błędami, łatwiejszą i trudniejszą wersją.
- [ ] Trener AI ma układać plan z biblioteki i ograniczeń użytkownika, a nie wymyślać dowolne ćwiczenia bez kontroli.
- [ ] Dla bólu, strzelania, ograniczonego zakresu ruchu lub świeżego urazu najpierw uruchamiać wywiad bezpieczeństwa i czerwone flagi; AI nie diagnozuje biodra, kręgosłupa ani innego problemu.
- [ ] Pakiety typu „biodra i pośladki”, „lędźwie”, „mobilność” traktować jako ogólny trening funkcjonalny; ścieżki rehabilitacyjne wymagają przeglądu specjalisty.
- [ ] Dodać ocenę gotowości, reguły przerwania ćwiczenia i bezpieczną zmianę planu po zgłoszeniu bólu.
- [ ] Po ustabilizowaniu aplikacji połączyć aktywność z Health Connect, a następnie rozważyć Garmin.

### 7. Baza przepisów i pełne filtry — etap końcowy

- [ ] Rozszerzać bazę dopiero po ustabilizowaniu mechanizmu przepisów; ostateczny zestaw receptur zatwierdza zarząd MatFit po realnych testach gotowania.
- [ ] Zapewnić mocne przepisy wytrawne i słodkie, a nie dużą liczbę przypadkowych pozycji.
- [ ] Dodać czas całkowity: do 10, do 20, do 30 i powyżej 30 minut.
- [ ] Dodać filtry: słodkie/wytrawne, posiłek, kalorie, białko, trudność, sprzęt, wegetariańskie, bez glutenu, bez laktozy i alergeny.
- [ ] Tagów zdrowotnych nie opierać wyłącznie na deklaracji autora. Aplikacja powinna sprawdzać składniki i pokazywać ostrzeżenie, jeśli nie może potwierdzić oznaczenia lub ryzyka zanieczyszczenia krzyżowego.
- [ ] Pozwolić użytkownikom dodawać własne przepisy i tagi, ale oddzielić treści prywatne, społecznościowe i zweryfikowane przez MatFit.

### 8. Platforma i przewaga konkurencyjna

- [ ] Dodać konta i szyfrowaną synchronizację w chmurze dopiero po dopracowaniu lokalnego modelu danych; zachować pełny eksport i usuwanie konta.
- [ ] Przygotować raporty PDF/CSV dla trenera lub dietetyka bez automatycznego udostępniania danych.
- [ ] Dodać prywatność od początku: świadome zgody, minimalizację danych, politykę retencji oraz możliwość wyłączenia funkcji AI.
- [ ] Mierzyć wyłącznie użyteczne zdarzenia i błędy bez zbierania treści dziennika żywieniowego bez wyraźnej zgody.
- [ ] Zbudować prosty kanał zgłaszania błędnych produktów, przepisów i sugestii użytkowników.
- [ ] Funkcje społecznościowe i monetyzację projektować dopiero po potwierdzeniu, że planer, baza, przepisy i raporty dają samodzielną wartość.

## Kolejność wykonania

1. test i poprawki obecnego DEV;
2. audyt całej aplikacji oraz makiety UI v2;
3. migracja do projektu React i wdrożenie zaakceptowanego UI;
4. Nutrition Data v2: cukry, błonnik, tłuszcze nasycone, sól i opcjonalne mikroelementy;
5. większa baza produktów podstawowych, następnie legalny katalog markowych produktów z polskich sklepów;
6. szybsze logowanie: ostatnie, ulubione, szablony, OCR etykiety;
7. wyszukiwanie przepisów po składnikach, spiżarnia, zamienniki i lista zakupów;
8. zdjęcie posiłku i pozostałe funkcje AI po uruchomieniu bezpiecznego backendu;
9. edukacja i dziennik objawów z recenzją merytoryczną;
10. treningi podstawowe, następnie bezpieczny Trener AI;
11. Android, tryb offline, powiadomienia, Health Connect i później Garmin;
12. finalne rozszerzenie oraz ręczne zatwierdzenie bazy przepisów i jej filtrów.

## Zasady produktu

- narzędzie przed funkcjami społecznościowymi;
- posiłek dodany do planera oznacza posiłek zjedzony; gramaturę lub porcję można poprawić bez dodatkowego odhaczania;
- BMR pozostaje wartością ze wzoru; trend może kalibrować TDEE i wynikający z niego cel kcal, nigdy automatycznie;
- małe, testowalne etapy zamiast wielu równoległych zmian;
- wersja DEV przed przeniesieniem na produkcję;
- integracje treningowe i zdrowotne nie mogą udawać diagnozy medycznej;
- wartości szacowane przez AI muszą być wyraźnie oznaczone i możliwe do poprawienia przed zapisem;
- nieznana wartość odżywcza oznacza brak danych, a nie zero;
- zewnętrzne katalogi produktów wymagają legalnego źródła, atrybucji i kontroli jakości;
- przed Google Play kod zostanie przeniesiony z pojedynczego HTML-a do utrzymywalnego projektu React z procesem budowania i warstwą Android.

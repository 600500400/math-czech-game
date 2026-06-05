## End-to-end test report

Provedl jsem průchod aplikací (Domů → Matematika → spuštění hry → odpověď → Pravopis → Slovník → Statistiky → Profil) ve viewportu 390×800.

### Co funguje ✅
- Bento dashboard na `/` se vykresluje korektně.
- Tlačítka v headeru (po předchozí opravě) — srdce, theme, feedback, avatar — jsou čitelná.
- Matematika: dialog se otevře, vygeneruje `6 + 8`, vyhodnotí odpověď, posune na další příklad, statistika "Správně: 1, 100%" se aktualizuje.
- BottomTabBar funguje na `/`, `/statistiky`, `/profil` (Domů, Grafy, Profil jsou propojené).
- Žádné runtime errors v konzoli (jen preview-only `postMessage` šum a 401 na manifest.json mimo published prostředí).

### Bugy nalezené 🐞

1. **Nekonzistentní layout na podstránkách.** `/math`, `/spelling`, `/dictionary` používají starý šedý `bg-background` + `AppFooter` místo `MobileShell` se sunset paletou. Vypadá to jako úplně jiná aplikace.
2. **BottomTabBar chybí na podstránkách.** Z hry/pravopisu/slovníku se uživatel nedostane na statistiky/profil jinak než přes breadcrumb a logo.
3. **NumericKeyboard má bílá/barevně náhodná tlačítka** (`bg-red-50`, `bg-blue-50`, `bg-green-500`, `bg-gray-300`) — silně kontrastuje s warm-dark dialogem a tříští sunset estetiku.
4. **Duplikované sekční hlavičky.** `MathPractice` i `SpellingPractice` mají velký `<h1>` ikona + nadpis sekce navíc — redundantní vůči breadcrumb a nudné "Card → Ovládání hry → Začít novou hru" UI.
5. **Slovník popisek meta tagu** říká "anglických slovíček" — porušení paměťového pravidla, slovník je český (vyjmenovaná slova).
6. **PWA install prompt překrývá** spodní obsah, žádný offset pro `safe-area` / bottom tab bar.
7. **MathProblemDialog** používá výchozí shadcn dialog (středový bílý/neutral) — neladí s warm-dark warmem ostatních ploch.

## Plánované opravy

### 1) Sjednocení shellu pro všechny podstránky (MathPractice, SpellingPractice, Dictionary)
- Zaobalit do `MobileShell` (stejný warm-dark + decorative blobs jako `/`).
- Odstranit `bg-background` wrapper a `AppFooter` (footer drží `MobileShell`).
- Přidat `BottomTabBar` na konec — tab "Domů" zůstane aktivní jen na `/`, takže na `/math` nebude žádná z trojice highlightnutá (OK).
- `<main>` dostane `pb-28` aby obsah nebyl pod tab barem.

### 2) Redesign hero hlavičky každé sekce
Místo `Card → Ovládání hry` udělat jednu hero kartu v barvě sekce (gradient z bento dlaždice) s ikonou + jménem + tlačítky pod ní:
- Matematika: orange→amber gradient, dvě tlačítka glass-style ("Nastavení obtížnosti", "Začít novou hru").
- Pravopis: magenta hero, ("Vybrat skupiny slov", "Začít novou hru").
- Slovník: purple hero + záložky pod ní.

Breadcrumb zredukovat na malý `← Domů` link nad hero kartou.

### 3) Sjednocení NumericKeyboard
Nahradit barevný mix v `NumericKeyboard.tsx` sunset/glass tokeny:
- Číselné klávesy: `bg-white/5 border-white/10 text-white hover:bg-white/10`.
- Backspace: jemně červený glass (`bg-destructive/15 text-destructive`).
- Enter: orange gradient (`bg-gradient-to-r from-sunset-orange to-sunset-amber text-white`).
Disabled stav: `bg-white/5 opacity-40`.

### 4) MathProblemDialog / SpellingProblemDialog styling
Přebarvit `DialogContent` na `bg-sunset-card border-white/10 text-white`, příklad zobrazit v gradientové kartě (orange/amber pro matematiku, magenta pro pravopis). Progress bar v dolní části dlaždice ladící se sekcí.

### 5) Drobné opravy
- `Dictionary.tsx`: meta description přepsat na "Slovník Procvička – procvičování vyjmenovaných slov a české slovní zásoby."
- `PWAInstallPrompt`: přidat `mb-24 md:mb-4` (nebo respektovat `safe-area-inset-bottom`) aby neoverlapoval BottomTabBar.
- Breadcrumb link "Domů": `text-white/60 hover:text-white` místo `text-muted-foreground`.

### 6) Co zůstane beze změny
- Herní logika (math/spelling/dictionary hooks).
- Auth, gamifikace, statistiky data.
- BottomTabBar struktura — funguje, jen ji rozšířit na další routy.
- České texty.

## Co NEbudu řešit (ne-bug šum)
- 401 na `manifest.json` v preview iframe (Lovable platform, v publish OK).
- `postMessage` warnings z `cdn.gpteng.co` (preview-only).

## Plán testování po opravách
1. Procházka `/` → `/math` → spustit hru → 1 správně + 1 špatně → ukončit hru.
2. `/spelling` → vybrat skupinu → spustit → odpověď.
3. `/dictionary` (host hláška musí být čitelná v sunset stylu).
4. `/statistiky`, `/profil` — že tab bar zůstává konzistentní.
5. Screenshot každé stránky ve 390×800.

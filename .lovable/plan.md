# Postupná implementace všech vylepšení

Provedu změny v 5 krocích, každý samostatně otestovatelný. Pokud něco rozbije UI, vrátíme jen ten jeden krok.

## Krok 1 — Nové logo (custom SVG)

- Vytvořit `src/components/layout/Logo.tsx` — stylizovaná otevřená kniha s malou hvězdičkou/jiskrou v rozích, používá modro-zeleno-fialový gradient (`subject-math` → `subject-spelling` → `subject-dictionary`)
- Nahradit `<BookOpen>` ikonu v `ModernHeader.tsx` novou komponentou
- Aktualizovat `favicon.ico` (necháme stávající, jen logo v hlavičce změníme)

## Krok 2 — F1 Bezpečnost

- **RLS pro `dictionary_answers`**: migrace, která omezí čtení/zápis pouze na `auth.uid() = user_id` (dnes je tabulka veřejně čitelná — kritický dluh z memory)
- **`console.* → logger`**: nahradit 213 výskytů `console.log/debug/info` v `src/` za `logger.debug` (warn/error necháme). Skript-based replace, ne ruční.

## Krok 3 — F2 Bundle čištění

- Smazat nepoužívané auth hooky: `useSecureAuth.tsx`, `useAuthCleaner.tsx`, `useAuthHandlers.tsx` (po ověření přes `rg`)
- Sloučit 3 haptics hooky (`useAdvancedHaptics`, `useEnhancedHaptics`, `useHapticDebugger`) do jednoho `useHaptics`
- Odstranit i18n: `src/i18n/`, `useLanguage.tsx`, `useTranslation.tsx`, balíčky `i18next`, `react-i18next`, `i18next-browser-languagedetector` z `package.json`, import z `App.tsx`
- **Neodstraňovat** shadcn komponenty automaticky (riskantní, necháme na později)

## Krok 4 — F3 Performance

- `React.lazy()` + `<Suspense>` pro všechny routy v `App.tsx` kromě `Index`
- Sloučit dvojici `<Toaster />` + `<Sonner />` → jen Sonner (modernější, jednodušší)
- Preload Inter fontu v `index.html` (`<link rel="preload" as="style">`)

## Krok 5 — F4 Design polish

- `src/index.css`: opravit `.dark` varianty `--subject-*-light` (dnes skoro bílé v dark mode) — ztmavit na ~20% lightness
- `src/index.css`: snížit opacity dekorativních prvků v dark mode

## Workflow

Mezi každým krokem se zastavím a počkám, až ověříš v preview, že nic není rozbité. Pak pokračujeme dalším krokem. Pokud něco selže, revertujeme jen ten krok.

## Změněné/smazané soubory (orientačně)

- **nové**: `src/components/layout/Logo.tsx`, `src/hooks/useHaptics.tsx`, migrace pro RLS
- **edit**: `App.tsx`, `ModernHeader.tsx`, `index.html`, `index.css`, `package.json`, ~30 souborů s `console.*`
- **smazat**: `src/i18n/`, `useLanguage.tsx`, `useTranslation.tsx`, `useSecureAuth.tsx`, `useAuthCleaner.tsx`, `useAuthHandlers.tsx`, `useAdvancedHaptics.tsx`, `useEnhancedHaptics.tsx`, `useHapticDebugger.tsx`

## Test po každém kroku

1. Logo se zobrazuje v headeru (light + dark)
2. Slovník — uložení a načtení odpovědi funguje (po RLS)
3. Aplikace startuje bez i18n chyb
4. Routy se načítají, žádný blank screen
5. Sekční barvy čitelné v dark mode
# Návrhy dalších zlepšení

Aplikace už prošla základní optimalizací (logo, logger, lazy routes, dark mode). Tady jsou další oblasti seřazené podle dopadu vs. úsilí.

## 1. Odstranění i18n (vysoký dopad, střední úsilí)

Aplikace je výhradně v češtině (memory rule), ale balíčky `i18next` + `i18next-browser-languagedetector` + `react-i18next` zůstávají v bundlu (~80 kB) a 20 souborů importuje `useLanguage`/`useTranslation`.

- Nahradit `t('key')` přímo českými stringy (případně přes lehký `src/i18n/strings.ts` slovník).
- Smazat `src/i18n/`, `src/hooks/useLanguage.tsx`, `src/hooks/useTranslation.tsx`, import v `App.tsx`.
- `bun remove i18next i18next-browser-languagedetector react-i18next`.
- Smazat `src/i18n/locales/en.json`.

## 2. Konsolidace haptických hooků (střední dopad, nízké úsilí)

Tři překrývající se haptické hooky (`useAdvancedHaptics`, `useEnhancedHaptics`, `useHapticDebugger`) + dva mobile interaction hooky (`useMobileInteractions`, `useEnhancedMobileInteractions`).

- Sjednotit do jednoho `useHaptics` a jednoho `useMobileInteractions`.
- Smazat duplicity, aktualizovat 5 call-sites.

## 3. Refaktor velkých komponent (střední dopad, střední úsilí)

`src/components/dashboard/` má 90 kB s několika soubory >150 řádků (TimeFilters 240, WelcomeWizard 177, SummaryStatistics 130). Rozdělit na menší komponenty a vytáhnout business logiku do hooků (`useDashboardFilters`, atd.).

Podobně `DictionaryTabs` a `ParentDashboard` page.

## 4. Přístupnost (a11y) (vysoký dopad pro děti, nízké úsilí)

- Doplnit `aria-label` na ikonové buttony (UserMenu, ModernHeader, dialogy).
- Doplnit `role="status"` a `aria-live="polite"` na feedback po odpovědi (správně/špatně).
- Klávesnice: zajistit, že numerická klávesnice v matematice je ovladatelná i přes fyzickou klávesnici (už možná je — zkontrolovat).
- Kontrast textu v dark mode na `bg-subject-*-light` plochách.

## 5. Databáze a edge funkce (nízké úsilí)

- Spustit security--run_security_scan a opravit nálezy (search_path u SECURITY DEFINER funkcí, RLS na případných nepokrytých tabulkách).
- Edge funkce `ai-assistant`, `translate-text`: zkontrolovat rate limiting a CORS.

## 6. Performance drobnosti

- `queryClient` má `retry: false` — zvážit `retry: 1` pro síťové chyby.
- Preload kritických obrázků v `main.tsx` — zvážit `<link rel="preload">` v `index.html` místo JS triku.
- `framer-motion` (~60 kB) — zkontrolovat, jestli se používá; pokud jen na pár míst, nahradit CSS animacemi.

## 7. PWA

- `sw.js` zkontrolovat strategii cache pro `/images/` (cache-first) a API (network-first s fallbackem).
- Manifest: doplnit `screenshots` pro lepší PWA install prompt na Androidu.

## Doporučené pořadí

1. **i18n cleanup** — největší úspora bundlu, jasná shoda s memory rule.
2. **a11y opravy** — rychlé výhry pro UX dětí.
3. **Haptika konsolidace** — čistota kódu.
4. **Security scan** — bezpečnost.
5. **Refaktor dashboardu** — větší zásah, nechat na konec.

Řekni, které z toho mám zařadit do implementace (klidně víc najednou nebo jen jedno).

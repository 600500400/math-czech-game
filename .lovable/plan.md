

# Kompletní implementace všech designových vylepšení

Implementuji všechny 4 fáze z designové analýzy v jednom průběhu.

## Fáze A — Kritické opravy

1. **`src/pages/Home/HomePage.tsx`** — nahradit `theme.bgGradient` za `bg-background`, aby v dark mode byl text čitelný.
2. **Smazat duplicitní soubory**:
   - `src/components/SpellingPractice.tsx`
   - `src/components/MathPractice.tsx`
3. **Hardcoded barvy → theme tokeny**: Projít `WelcomeDashboard.tsx`, `GamificationStats.tsx`, `WordProblemDialog.tsx`, `ProblemDialog.tsx` a nahradit `text-gray-600`, `bg-green-100`, `bg-blue-50` apod. za `text-muted-foreground`, `bg-success/10`, `bg-primary/10`.
4. **`TabsTrigger` kontrast** v `HomePage.tsx` — odstranit inline `--active-bg` triky, použít shadcn defaults.

## Fáze B — Sjednocení design systému

5. **`tailwind.config.ts`**:
   - Odstranit `brand` orange tokeny a `gradient-primary` orange.
   - Sladit `primary` HSL s modro-fialovým logem.
   - Buď doimportovat Poppins do `index.css`, nebo odstranit z config (zvolím odstranit — Inter stačí).
6. **Sjednotit barvy dialogů se sekcemi**:
   - `ProblemDialog.tsx` (math): hlavička modrá (`from-blue-600 to-blue-500`), tlačítko Ukončit neutrální outline (bez orange).
   - `WordProblemDialog.tsx` (spelling): hlavička zelená (`from-green-600 to-emerald-500`), tlačítka I/Y zachovat funkční rozlišení (modrá I / oranžová Y) — odstraní konflikt s sekční zelenou.

## Fáze C — Snížení vizuálního šumu

7. **Odstranit nadbytečné efekty z dialogů**:
   - Žádný `animate-pulse` na písmenech a indikátorech během řešení.
   - Jeden gradient + případně shadow, ne kombinace gradient+blur+glow+pulse.
   - Animace pouze při správné odpovědi / milníku.
8. **`ModernHeader.tsx`**:
   - Odstranit pulsující sparkle ikonu a růžovou tečku z loga.
   - Na mobilu zobrazit text "Procvička" vedle ikony.
   - Level zobrazit od `md:`, Streak od `lg:` (místo dnešního `lg:` only pro oba).

## Fáze D — UX vylepšení

9. **`DifficultyDialog.tsx`**:
   - Zvýraznit aktivní preset (porovnáním s aktuálními min/max).
   - Pod tlačítky popisek rozsahu (např. "Lehké: 1-5").
10. **Breadcrumby**: Změnit "Přehled" na "Domů" v `SpellingPractice.tsx`, `MathPractice.tsx`, `Dictionary.tsx`.
11. **Dashboard grid se Slovníkem**: Změnit `md:grid-cols-2` na full-width kartu, nebo doplnit druhou kartu (Achievementy). Zvolím **full-width** — jednodušší a funguje napříč breakpointy.
12. **`ThemeToggle.tsx`**: Zachovat dropdown, ale jako trigger ikona Sun/Moon dle aktuálního efektivního theme (místo Monitor pro 'system').

## Bonus — runtime errors

Runtime hlásí `Cannot read properties of null (reading 'useState')`. Při procházení souborů zkontroluji, zda nejde o souběžný import React (např. duplicitní React v dependencies). Pokud najdu příčinu, opravím (typicky špatný import v nedávno editovaném souboru).

## Soubory k úpravě (souhrn)

- `src/pages/Home/HomePage.tsx`
- `src/components/dashboard/WelcomeDashboard.tsx`
- `src/components/gamification/GamificationStats.tsx`
- `src/components/spelling/WordProblemDialog.tsx`
- `src/components/math/ProblemDialog.tsx`
- `src/components/math/DifficultyDialog.tsx`
- `src/components/layout/ModernHeader.tsx`
- `src/components/ui/theme-toggle.tsx`
- `src/pages/SpellingPractice.tsx`
- `src/pages/MathPractice.tsx`
- `src/pages/Dictionary.tsx`
- `tailwind.config.ts`
- `src/index.css` (jen pokud bude třeba pro fonty)
- **smazat**: `src/components/SpellingPractice.tsx`, `src/components/MathPractice.tsx`

## Test po implementaci

1. Light mode + Dark mode na `/`, `/math`, `/spelling`, `/dictionary` — žádný nečitelný text.
2. Spuštění příkladu math i spelling — dialog má sekční barvu, žádné rušivé pulsy.
3. Mobil (375 px) — header zobrazuje "Procvička" text, theme toggle ukazuje správnou ikonu.
4. Difficulty dialog — aktivní preset je zvýrazněný.


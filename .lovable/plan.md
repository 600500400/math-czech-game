# Redesign Procvičky — Bento Sunset

## Cíl
Postavit zvolený direction "Bento + tab bar" — moderní mobile-first dashboard s bento gridem, gradientovými dlaždicemi v paletě Sunset Blaze (oranžová → magenta → fialová), tmavým pozadím a sticky bottom tab barem.

## ⚠️ Upozornění na konflikt s memory
Memory říká: Matematika=modrá, Pravopis=zelená, Slovník=fialová.
Tvůj výběr Sunset Blaze: Matematika=oranžová gradient, Pravopis=magenta, Slovník=fialová.

Postupuji podle tvého výběru (uživatel přebíjí memory) a po dokončení aktualizuji memory na nové barevné schéma. Pokud chceš zachovat původní barvy sekcí, řekni a paletu aplikuji jen na chrome/akcenty.

## Co se změní

### 1. Design tokens (`src/index.css` + `tailwind.config.ts`)
- Přidám HSL tokeny pro Sunset paletu: `--sunset-orange` (#ff6b35), `--sunset-amber` (#f7931e), `--sunset-magenta` (#e84393), `--sunset-purple` (#6c5ce7)
- Přepíšu sekční tokeny `--subject-math/spelling/dictionary` na nové barvy (light + dark mode)
- Nastavím tmavé pozadí (`--background` ~ #0d0c0b warm-black) jako výchozí pro home screen
- Přidám gradient utility a glow shadow tokens
- Načtu Space Grotesk + DM Sans z Google Fonts, nastavím body font na DM Sans, heading na Space Grotesk

### 2. Nová home obrazovka (`src/pages/Home/HomePage.tsx`)
Kompletně přepsat layout podle prototypu:
- Tmavé pozadí, max-width 390px na mobilu, responsivní na desktop
- Hero bento tile: **Matematika** (gradient orange→amber, velký, CTA "Procvičovat počítání")
- Square tile: **Statistiky** (sklo, celkový počet vyřešených úloh)
- Square tile: **Slovník** (gradient purple)
- Wide tile: **Pravopis** (magenta, progress bar + arrow button)
- Odstranit současné `<Tabs>` (Dashboard/Statistiky) — Statistiky přesunout na samostatnou route přes tab bar

### 3. Nový header (`src/components/layout/ModernHeader.tsx`)
- Logo + "Procvička" vlevo
- Vpravo: donate srdíčko (růžové), dark mode toggle, avatar uživatele
- Glassmorphism styl, ne sticky bar s borderem

### 4. Bottom tab bar (`src/components/layout/BottomTabBar.tsx` — nový)
- Sticky bottom, glass blur pozadí
- 3 záložky: Domů, Grafy (statistiky), Profil (user menu / volba uživatele)
- Aktivní záložka v `--sunset-amber`, neaktivní white/30
- Skryt na desktopu (md+), tam zůstane v headeru

### 5. Karty sekcí (nové komponenty v `src/components/dashboard/`)
- `MathHeroTile.tsx` — velká hero dlaždice
- `SpellingWideTile.tsx` — široká dlaždice s progress
- `DictionaryTile.tsx` — square gradient
- `StatsTile.tsx` — square glass
- Všechny propojené na existující `useStatistics` hook pro reálná data (procenta, počty)

### 6. Routing (`src/App.tsx`)
- Přidat route `/statistiky` pro samostatnou stránku statistik (přesun obsahu z Tabs)
- Bottom tab bar bude navigovat mezi `/`, `/statistiky`, `/profil`

## Co se NEMĚNÍ
- Logika sekcí (math/spelling/dictionary praktikování) — stejné stránky a hooky
- Auth flow, user selection, parent dashboard
- PWA mechanismus
- Český obsah

## Po dokončení
- Aktualizuji `mem://style/barevne-schema-sekci` a Core memory na novou paletu
- Otestuji na 390px viewportu (screenshot QA)

## Technické poznámky
- Všechny barvy přes design tokeny v `index.css`, žádné hardcoded hex v komponentách
- Použiju `bg-gradient-to-br from-[hsl(var(--sunset-orange))] to-[hsl(var(--sunset-amber))]` pattern
- Tap feedback: `active:scale-[0.98] transition-transform`
- Dark mode = výchozí stav nového designu (warm dark), light mode zachovám pro toggle ale s teplejší paletou



## Analýza aplikace - nalezené chyby a návrhy vylepšení

### 🔴 KRITICKÉ - Pravopisné chyby v datech (`src/data/spellingData.ts`)

**Skupina B:**
- `"bystrnost"` → správně **`"bystrost"`** (překlep, slovo neexistuje)

**Skupina S:**
- `"sysypání"` → správně **`"sypání"`** (zdvojené "sy")

**Skupina Z (závažné problémy):**
- `"zykat"` a `"zykavý"` → **neexistující slova** v češtině (možná zamýšleno "zvykat"/"zvykavý", ale ty patří do skupiny V)
- `"prazdroj"` → značka piva, **není vyjmenované slovo**
- `"zkouška"`, `"zkušební"` → **neobsahují y/i pro procvičování** vyjmenovaných po Z (nemají sporné y/i)

**Skupina L (matoucí klasifikace):**
- `"linka"`, `"list"`, `"lichý"` jsou označené jako "odvozené" - **nejsou ale příbuzná vyjmenovaným po L**, jen obsahují "i". Pro děti matoucí - mohou si myslet, že "list" souvisí s "lýko".

### 🟠 STŘEDNÍ - Bug v matematice (potvrzeno z předchozí konverzace)

**`src/hooks/math/useProblemGenerator.tsx` řádek 37:**
```typescript
num2 = Math.floor(Math.random() * (Math.min(num1, maxValue) - minValue + 1)) + minValue;
```
`Math.min(num1, maxValue)` je matematicky bezvýznamné (num1 je už ≤ maxValue). Druhé číslo v odčítání bude vždy ≤ num1, takže reálný rozsah je menší než nastavený - **uživatel zmínil že už funguje OK**, ale logika je nečitelná a měla by se zjednodušit pro lepší údržbu.

### 🟡 UX vylepšení - Matematika

1. **Chybí možnost nastavit rozsah násobení/dělení** - je natvrdo 1-10 (řádky 41-49). Pro pokročilejší děti by bylo vhodné mít rozsah až do násobilky 1-100 (např. 12·12).

2. **Preset "Lehké" rovná se default** - není jasný rozdíl mezi výchozím nastavením a presetem.

3. **Dělení vždy beze zbytku** - to je správné pro děti, ale chybí informace v UI.

4. **Žádný timeout na odpověď** - chybí volitelný režim "na čas" pro motivaci.

### 🟡 UX vylepšení - Pravopis

1. **Chybí typ slova v nápovědě** - aplikace ví že slovo je "vyjmenované"/"příbuzné"/"odvozené", ale uživatel to nevidí. Pro učení by pomohlo zobrazit:
   - "Toto je **vyjmenované slovo** po B" (po správné odpovědi)

2. **Chybí věta nebo kontext u slov** - např. u "bydlit" by pomohlo "bydlit = mít kde žít".

3. **Frázový režim je vzácný** - jen 30% pravděpodobnost (`Math.random() > 0.7` v `problemGeneration.ts`). Frázové procvičování je důležité pro porozumění kontextu.

4. **Chybí režim "pouze frázové"** - uživatel si nemůže zvolit jen procvičování ve větách.

### 🟢 Drobnosti

- **`useGamification`** se volá v `SpellingPractice` ale processGameCompletion má hardcoded `subject: 'spelling'` - duplicita s podobným kódem v matematice (DRY).
- **Console.log spamming** v utilech (`spelling/answerValidation.ts`, `problemGeneration.ts`) - v produkci zatěžuje konzoli stovkami logů.

---

## Navrhovaný plán oprav (priorita)

### Fáze 1 - Pravopisné chyby v datech (NUTNÉ)
Opravit/odstranit chybná slova v `src/data/spellingData.ts`:
- Skupina B: `bystrnost` → `bystrost`
- Skupina S: `sysypání` → `sypání`
- Skupina Z: odstranit `zykat`, `zykavý`, `prazdroj`, `zkouška`, `zkušební`, `zykavý`, `prazdrojový`, `ziskovost`, `hezkost`, `zkušební` - **doplnit správná příbuzná**: `nazývatel`, `výzva`, `vzývat` atd.
- Skupina L: přesunout `linka`, `list`, `lichý` do kategorie "kontrastní" (slova s "i", ne "y") nebo je odstranit

### Fáze 2 - UX zlepšení pravopisu
1. Po odpovědi zobrazit kategorii slova ("vyjmenované po B")
2. Zvýšit poměr frází (z 30% na ~40-50%) nebo přidat toggle
3. Volitelně přidat malou nápovědu/význam

### Fáze 3 - UX zlepšení matematiky
1. Vyčistit logiku v `useProblemGenerator` (přepsat čitelněji bez `Math.min`)
2. Přidat samostatné nastavení rozsahu pro násobení/dělení
3. Přidat info text o dělení beze zbytku

### Fáze 4 - Úklid kódu
1. Odstranit/podmíněně logovat console.log v produkci
2. Refaktor duplicitní logiky `processGameCompletion`

---

**Doporučení:** Začněme Fází 1 (pravopisné chyby) - jsou to skutečné chyby, které poškozují vzdělávací hodnotu aplikace. Pak postupně Fáze 2-4 podle vašich priorit.

Které fáze chcete implementovat?


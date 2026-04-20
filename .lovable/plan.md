

## Analýza problému

Uživatel má pravdu. V databázi `src/data/spellingData.ts` je masivní nerovnováha:

| Skupina | Slova s Y/Ý (vyjmenovaná + příbuzná) | Slova s měkkým I/Í (protiklady) |
|---------|--------------------------------------|---------------------------------|
| B       | 25                                   | 3 (`bidlo`, `nabídka`, `bit`)   |
| L       | 25                                   | **0**                           |
| M       | 23                                   | **0**                           |
| P       | 25                                   | **0**                           |
| S       | 25                                   | **0**                           |
| V       | 25                                   | **0**                           |
| Z       | 13                                   | **0**                           |

**Výsledek:** Z ~161 slov v databázi má pouze 3 slova měkké I (1.8 %). Logika výběru v `wordSelection.ts` filtruje všechna slova obsahující i/y/í/ý, ale prakticky všechna obsahují Y. Dítě tak skoro nikdy nemusí volit měkké I → neučí se rozlišovat, jen mechanicky tipuje Y.

**Pedagogická chyba:** Pravopis vyjmenovaných slov se učí PRÁVĚ porovnáním s protiklady (např. *byl* × *bil*, *mýt* × *mít*, *výt* × *vít*, *slyšet* × *lišit*).

## Plán řešení

### 1. Doplnit "kontrastní slova" (s měkkým I) do každé skupiny

Přidat do `spellingTypes.ts` typ slova `"kontrastní"` (= příbuzné jiného kořene s měkkým i).
Doplnit tato slova ke každé skupině (cca 8-12 slov na skupinu) pro rovnováhu zhruba 60% Y / 40% I:

- **B**: `bít` (bít se), `bít se`, `bicí`, `nabít`, `pobít`, `obilí`, `kobliha` (rozlišení od *kobyla*), `bizon`, `biskup`, `obilný`
- **L**: `lišit`, `liška`, `lichý`, `lipa`, `linka`, `list`, `liják`, `litovat`, `líbit se`, `lichotit`
- **M**: `mít` (vlastnit), `míč`, `milý`, `miska`, `minulost`, `mince`, `minout`, `milovat`, `mistr`, `místo`
- **P**: `pít`, `pivo`, `písmeno`, `psí` (pes), `pilný`, `pilíř`, `pisatel`, `pila`, `pilot`, `pichlavý`
- **S**: `sirka`, `silný`, `síla`, `sídlo`, `sice`, `sirota`, `síto`, `sin`, `silo`, `slibovat`
- **V**: `vít` (věnec), `víla`, `vidět`, `vinout`, `víno`, `vichr`, `viset`, `vinař`, `vidlička`, `viník`
- **Z**: `získat`, `zima`, `zimní`, `zívat`, `zítra`, `zinek`, `zip`, `zisk`

### 2. Vyvážit výběr v `wordSelection.ts`

Přidat (volitelně) logiku, která zaručí, že generovaná slova budou střídat Y-slova a I-slova v poměru zhruba 50/50, bez ohledu na to kolik slov je v databázi (např. nejdřív losování typu Y/I, pak slovo z dané podmnožiny). To zabrání tomu, aby dominovala početnější skupina.

### 3. Aktualizovat zpětnou vazbu v UI

V `WordProblemDialog.tsx` po správné odpovědi:
- pro `vyjmenované` / `příbuzné` → "Toto je vyjmenované slovo (po B) - píše se tvrdé Y"
- pro `odvozené` / `kontrastní` → "Toto NENÍ vyjmenované slovo - píše se měkké I"

Tím se z aplikace stane skutečný procvičovací nástroj na rozlišování i/y, ne jen mechanické doplňování Y.

### 4. Update memory `mem://features/pravopis-data`

Doplnit pravidlo: **Každá skupina musí obsahovat kontrastní slova s měkkým I pro vyvážený výběr ~50/50.**

## Soubory k úpravě

- `src/types/spellingTypes.ts` - přidat typ `"kontrastní"`
- `src/data/spellingData.ts` - doplnit kontrastní slova do všech 7 skupin
- `src/utils/spelling/wordSelection.ts` - vyvážený výběr Y vs I (volitelné, ale doporučené)
- `src/utils/spelling/problemGeneration.ts` - stejná úprava výběru
- `src/components/spelling/WordProblemDialog.tsx` - upravit zpětnou vazbu pro kontrastní slova
- `mem://features/pravopis-data` - aktualizace pravidla


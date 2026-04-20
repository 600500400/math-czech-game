

## Bug: Vícepísmenná slova (např. "nasytit") se zaseknou po prvním kliknutí

### Diagnóza

Z console logu z preview je jasná příčina:
```
⚠️ handleAnswer: Všechny pozice již vyplněny
```
`currentPosition` skočí na hodnotu vyšší než počet mezer, ačkoli uživatel zatím vyplnil jen jedno písmeno. Tlačítka I/Y pak okamžitě vyskočí z funkce a UI vypadá zaseknuté — uživatel může jen "Ukončit".

### Příčina (race condition)

V `useAnswerHandling.tsx` po kliknutí na I/Y běží sekvence se `setTimeout(800ms)` + vnořeným `setTimeout(100ms)`, která teprve na konci posune `currentPosition` (`moveToNextPosition`). Během těchto ~900 ms **nic neblokuje další kliknutí**:

1. Uživatel klikne 2× rychle za sebou (nebo 1× s "double-tap" na touchpadu/myši).
2. Spustí se dva paralelní řetězce timeoutů — oba v okamžiku spuštění vidí `currentPosition = 0`.
3. Oba 900 ms později zavolají `moveToNextPosition` → `currentPosition` skočí z 0 rovnou na 2.
4. Pro 2-mezerové slovo (`nasytit`) se nikdy nezavolá `generateNewWord`, takže UI dál ukazuje `nasyt_t`, ale interní stav říká, že už jsou všechny pozice vyplněné. Další klik → warning a žádná akce.

Druhotný kosmetický problém: ve stejném souboru (řádky 63–72) při tvorbě dočasně zobrazeného slova se **ostatní už vyplněné mezery přepisují zpátky na `_`** (chybný `else if (missingPositions.includes(i) && missingPositions.indexOf(i) !== currentPosition)`), takže během 800 ms u 2-mezerových slov problikává podtržítko v už zodpovězené pozici.

### Oprava

Soubor: `src/hooks/spelling/useAnswerHandling.tsx`

1. **Přidat zámek proti dvojklikům** pomocí `useRef<boolean>` (např. `isProcessingRef`):
   - Na začátku `handleAnswer`: pokud `isProcessingRef.current === true`, ihned `return`.
   - Nastavit `isProcessingRef.current = true` při začátku a uvolnit ho ve vnitřním 100 ms timeoutu (po `moveToNextPosition` / `generateNewWord`).
   - Bonus: uvolnit zámek také v `useEffect` při unmountu pro jistotu.

2. **Opravit dočasné zobrazení vybraného písmena** (řádky 63–72) — pro již zodpovězené pozice (`missingPositions.indexOf(i) < currentPosition`) vykreslit původní písmeno z `currentWord[i]`, místo přepsání na `_`. Tím odpadne problikání u vícepísmenných slov.

3. **Volitelně vizuálně blokovat tlačítka** — přidat `disabled={showAnimation}` na tlačítka I/Y v `WordProblemDialog.tsx`, aby uživatel viděl, že další klik není možný (zámek by ale stejně chránil logiku).

### Soubory k úpravě

- `src/hooks/spelling/useAnswerHandling.tsx` — zámek proti dvojklikům + oprava vykreslení.
- `src/components/spelling/WordProblemDialog.tsx` — `disabled={showAnimation}` na tlačítka I a Y (UX zlepšení).

### Test po opravě

1. Vybrat skupinu se 2-mezerovými slovy (např. "S" → "nasytit", "L" → "lyžovat").
2. Klikat rychle, pomalu, dvojklikem — vždy musí dialog plynule projít všemi pozicemi a pak generovat nové slovo.
3. Žádný `Všechny pozice již vyplněny` warning v konzoli.


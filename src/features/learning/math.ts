import type { MathSettings, MathTask, Operation } from './types';

export const operationLabel: Record<Operation, string> = { '+': '+', '-': '−', '*': '·', '/': ':' };
export const defaultMath: MathSettings = { operations: ['+'], min: 1, max: 10, factorMin: 1, factorMax: 10 };

export function validateMath(settings: MathSettings): void {
  const { min, max, factorMin, factorMax, operations } = settings;
  if (!operations.length || operations.some(op => !['+', '-', '*', '/'].includes(op))) {
    throw new Error('Vyber alespoň jednu početní operaci.');
  }
  if (![min, max, factorMin, factorMax].every(Number.isInteger) || min < 0 || max > 100 || min > max || factorMin < 0 || factorMax > 12 || factorMin > factorMax) {
    throw new Error('Čísla musí být celá. Rozsah je 0–100, násobilka 0–12 a minimum nesmí převýšit maximum.');
  }
  if (operations.includes('+') && min * 2 > max) {
    throw new Error(`Pro sčítání s nejmenším číslem ${min} musí být nejvyšší výsledek alespoň ${min * 2}.`);
  }
  if (operations.includes('/') && factorMax < 1) throw new Error('Dělitel musí být alespoň 1.');
}

export function mathPool(settings: MathSettings): Omit<MathTask, 'id'>[] {
  validateMath(settings);
  const pool: Omit<MathTask, 'id'>[] = [];
  for (const op of settings.operations) {
    const multiplication = op === '*' || op === '/';
    const lower = multiplication ? settings.factorMin : settings.min;
    const upper = multiplication ? settings.factorMax : settings.max;
    for (let a = lower; a <= upper; a++) {
      for (let b = lower; b <= upper; b++) {
        if (op === '+' && a + b > settings.max) continue;
        if (op === '-' && b > a) continue;
        if (op === '/' && b === 0) continue;
        const first = op === '/' ? a * b : a;
        const result = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a;
        const key = `math:${op}:${first}:${b}`;
        const skillId = multiplication ? `math:${op}:${lower}-${upper}` : `math:${op}:to-${upper}`;
        const prompt = `${first} ${operationLabel[op]} ${b}`;
        const explanation = `${prompt} = ${result}. ${op === '+' ? `K číslu ${first} přidáme ${b}.` : op === '-' ? `Od čísla ${first} odebereme ${b}.` : op === '*' ? `Počítáme ${b} skupin po ${first}.` : `Platí také ${result} · ${b} = ${first}.`}`;
        const hint = op === '+' ? `Představ si ${first} teček. Přidej ${b} další a spočítej je.` : op === '-' ? `Začni na ${first} a posuň se o ${b} míst zpátky.` : op === '*' ? `Sečti ${b} skupin po ${first}.` : `Jaké číslo vynásobené ${b} dá ${first}?`;
        pool.push({ subject: 'math', key, contentId: key, skillId, a: first, b, operation: op, result, prompt, expected: [String(result)], explanation, hint });
      }
    }
  }
  if (!pool.length) throw new Error('V tomto nastavení není žádný platný příklad. Uprav rozsah.');
  return pool;
}

export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(random() * (i + 1)));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function selectTasks<T extends { key: string }>(pool: readonly T[], count: number, priority: ReadonlySet<string> = new Set(), random = Math.random): T[] {
  if (!pool.length || !Number.isInteger(count) || count < 1 || count > 20) throw new Error('Vyber platnou sadu a nejvýše 20 úloh.');
  const ordered = [...shuffle(pool.filter(t => priority.has(t.key)), random), ...shuffle(pool.filter(t => !priority.has(t.key)), random)];
  const result: T[] = [];
  while (result.length < count) result.push(...shuffle(result.length ? pool : ordered, result.length ? random : () => 0.999999).slice(0, count - result.length));
  return result;
}

import { DEFAULT_DICTIONARY_WORDS } from '@/data/dictionaryData';
import { USER_PERSONAL_WORDS } from '@/data/personalDictionaryData';
import type { EnglishTask, LearningWord, Source } from './types';

export function translationVariants(value: string): string[] {
  return [...new Set(value.split(/[,;]|\s\/\s/).map(s => s.trim()).filter(Boolean))];
}
const extraVariants: Record<string, string[]> = {
  'u-2': ['dálkový', 'vzdálený'],
  'u-4': ['posoudit', 'vyhodnotit', 'zhodnotit'],
  'u-9': ['možnosti', 'schopnosti'],
  'u-40': ['vrátit peníze', 'vrácení peněz'],
};

export const personalWords: LearningWord[] = USER_PERSONAL_WORDS.map(word => ({
  id: word.id, english: word.english_word,
  czech: word.id === 'u-40' ? 'vrátit peníze / vrácení peněz' : word.czech_translation,
  accepted: extraVariants[word.id] || translationVariants(word.czech_translation),
  source: 'personal', category: 'Můj slovník',
}));
export const schoolWords: LearningWord[] = DEFAULT_DICTIONARY_WORDS.map(word => ({
  id: word.id, english: word.english_word, czech: word.czech_translation,
  accepted: translationVariants(word.czech_translation), source: 'school', category: word.category,
  exampleEn: word.example_en, exampleCz: word.example_cz,
}));

// Remote or edited entries supplement defaults by stable content ID, never
// replace the complete 120-word personal catalogue with a partial DB response.
export function dictionaryWords(overrides: Record<string, LearningWord>): LearningWord[] {
  const words = new Map([...personalWords, ...schoolWords].map(word => [word.id, word]));
  for (const word of Object.values(overrides)) words.set(word.id, word);
  return [...words.values()];
}
export function filterWords(words: readonly LearningWord[], source: Source, category = 'all'): LearningWord[] {
  return words.filter(word => (source === 'all' || word.source === source) && (category === 'all' || word.category === category));
}
export function englishTask(word: LearningWord, direction: EnglishTask['direction']): Omit<EnglishTask, 'id'> {
  const expected = direction === 'en_to_cz' ? word.accepted : [word.english];
  const answer = direction === 'en_to_cz' ? word.czech : word.english;
  return { subject: 'english', key: `english:${word.id}:${direction}`, contentId: word.id, skillId: `english:${word.source}:${word.category}:${direction}`, word, direction,
    prompt: direction === 'en_to_cz' ? word.english : word.czech, expected,
    explanation: `${word.english} znamená ${word.czech}.`,
    hint: `První písmeno překladu je „${answer.charAt(0)}“.`,
  };
}
const csvCell = (value: string) => `"${(/^[=+@\-\t\r]/.test(value) ? "'" : '') + value.replace(/"/g, '""')}"`;
export function dictionaryCsv(words: readonly LearningWord[]): string {
  return '\ufeff' + ['English,Czech,Source,Category', ...words.map(w => [w.english, w.czech, w.source, w.category].map(csvCell).join(','))].join('\r\n');
}
export function parseDictionaryCsv(text: string): Array<{ english: string; czech: string }> {
  const rows: string[][] = []; let row: string[] = []; let field = ''; let quoted = false;
  const value = text.replace(/^\ufeff/, '');
  for (let i = 0; i <= value.length; i++) {
    const char = value[i];
    if (char === '"') { if (quoted && value[i + 1] === '"') { field += '"'; i++; } else quoted = !quoted; }
    else if (!quoted && (char === ',' || char === '\n' || char === undefined)) {
      row.push(field.replace(/\r$/, '')); field = '';
      if (char !== ',') { if (row.some(Boolean)) rows.push(row); row = []; }
    } else if (char !== undefined) field += char;
  }
  if (quoted) throw new Error('CSV obsahuje neuzavřené uvozovky.');
  const start = /english|anglick/i.test(rows[0]?.[0] || '') ? 1 : 0;
  return rows.slice(start).map((r, i) => {
    if (!r[0]?.trim() || !r[1]?.trim()) throw new Error(`Řádek ${i + start + 1} musí obsahovat anglické slovo a český překlad.`);
    const unescape = (s: string) => s.startsWith("'") && /^[=+@\-\t\r]/.test(s.slice(1)) ? s.slice(1) : s;
    return { english: unescape(r[0]).trim(), czech: unescape(r[1]).trim() };
  });
}

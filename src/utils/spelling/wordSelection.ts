
import { spellingGroups } from "@/data/spellingData";
import { logger } from "@/utils/logger";
import type { SpellingWordType } from "@/types/spellingTypes";

// Helper: slovo obsahuje libovolné i/y písmeno
function containsTargetLetters(word: string): boolean {
  const targetLetters = ['i', 'y', 'í', 'ý'];
  return targetLetters.some(letter => word.toLowerCase().includes(letter));
}

// Helper: slovo obsahuje měkké i/í (= kandidát pro kontrastní výběr)
function containsSoftI(word: string): boolean {
  return /[ií]/i.test(word);
}

// Helper: slovo obsahuje tvrdé y/ý
function containsHardY(word: string): boolean {
  return /[yý]/i.test(word);
}

export type WordCandidate = {
  word: string;
  group: string;
  isPhrase?: boolean;
  type?: SpellingWordType;
};

// Načte všechna slova z vybraných skupin
export function getWordsFromGroups(selectedGroups: string[]): WordCandidate[] {
  const allWords: WordCandidate[] = [];

  spellingGroups.forEach(group => {
    if (selectedGroups.includes(group.name)) {
      group.words.forEach(wordObj => {
        if (containsTargetLetters(wordObj.word)) {
          allWords.push({
            word: wordObj.word,
            group: group.name,
            isPhrase: false,
            type: wordObj.type,
          });
        }
      });

      if (group.phrases) {
        group.phrases.forEach(phrase => {
          if (containsTargetLetters(phrase)) {
            allWords.push({
              word: phrase,
              group: group.name,
              isPhrase: true,
            });
          }
        });
      }
    }
  });

  if (allWords.length === 0) {
    logger.warn("⚠️ getWordsFromGroups: Žádná platná slova pro skupiny:", selectedGroups);
  }

  return allWords;
}

/**
 * Vyvážený výběr slova: ~50/50 mezi slovy s tvrdým Y (vyjmenovaná/příbuzná)
 * a slovy s měkkým I (kontrastní). Tím se zajistí, že dítě skutečně rozlišuje
 * i/y a netipuje pořád jen Y.
 *
 * Strategie:
 * 1. Hodíme mincí (50/50) — preferujeme Y nebo I
 * 2. Pokud podmnožina existuje, vybereme z ní; jinak fallback na druhou
 */
export function pickBalancedWord(words: WordCandidate[]): WordCandidate | null {
  if (words.length === 0) return null;

  const yWords = words.filter(w => w.type !== "kontrastní" && containsHardY(w.word));
  const iWords = words.filter(w => w.type === "kontrastní" || (!containsHardY(w.word) && containsSoftI(w.word)));

  const preferY = Math.random() < 0.5;
  const primary = preferY ? yWords : iWords;
  const fallback = preferY ? iWords : yWords;

  const pool = primary.length > 0 ? primary : fallback;
  if (pool.length === 0) {
    return words[Math.floor(Math.random() * words.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}


import { spellingGroups } from "@/data/spellingData";
import { logger } from "@/utils/logger";

// Helper function to check if a word contains i/y letters
function containsTargetLetters(word: string): boolean {
  const targetLetters = ['i', 'y', 'í', 'ý'];
  return targetLetters.some(letter => word.toLowerCase().includes(letter));
}

// Helper function to get words from selected groups
export function getWordsFromGroups(selectedGroups: string[]) {
  const allWords: Array<{ word: string; group: string; isPhrase?: boolean; type?: string }> = [];

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
    logger.warn("⚠️ getWordsFromGroups: Žádná platná slova nalezena pro vybrané skupiny:", selectedGroups);
  }

  return allWords;
}

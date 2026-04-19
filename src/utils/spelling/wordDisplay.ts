
import { removeDiacritics } from "@/lib/utils";
import { logger } from "@/utils/logger";

// Helper function to create displayed word with missing letters
export function createDisplayedWord(word: string) {
  logger.debug("🔤 createDisplayedWord: Zpracovávám slovo:", word);
  
  const positions: number[] = [];
  const letters: string[] = [];
  
  // Find all i/y positions
  for (let i = 0; i < word.length; i++) {
    const char = word[i].toLowerCase();
    if (char === 'i' || char === 'y' || char === 'í' || char === 'ý') {
      positions.push(i);
      // Store normalized letter (without diacritics) for comparison
      const normalizedChar = removeDiacritics(char);
      letters.push(normalizedChar);
    }
  }
  
  // Create display word with underscores
  let displayWord = '';
  for (let i = 0; i < word.length; i++) {
    if (positions.includes(i)) {
      displayWord += '_';
    } else {
      displayWord += word[i];
    }
  }
  
  logger.debug("🔤 createDisplayedWord: Zobrazené slovo:", displayWord);
  logger.debug("🔤 createDisplayedWord: Pozice:", positions);
  logger.debug("🔤 createDisplayedWord: Písmena (normalizovaná):", letters);
  
  return {
    displayWord,
    positions,
    letters
  };
}

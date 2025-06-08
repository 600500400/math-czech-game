
import { spellingGroups } from "@/data/spellingData";

// Helper function to get words from selected groups
export function getWordsFromGroups(selectedGroups: string[]) {
  console.log("📚 getWordsFromGroups: Získávám slova ze skupin:", selectedGroups);
  
  const allWords: Array<{word: string, group: string, isPhrase?: boolean}> = [];
  
  spellingGroups.forEach(group => {
    if (selectedGroups.includes(group.name)) {
      // Add regular words
      group.words.forEach(wordObj => {
        allWords.push({
          word: wordObj.word,
          group: group.name,
          isPhrase: false
        });
      });
      
      // Add phrases if available
      if (group.phrases) {
        group.phrases.forEach(phrase => {
          allWords.push({
            word: phrase,
            group: group.name,
            isPhrase: true
          });
        });
      }
    }
  });
  
  console.log("📚 getWordsFromGroups: Nalezeno slov:", allWords.length);
  return allWords;
}

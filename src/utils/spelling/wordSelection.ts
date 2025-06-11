
import { spellingGroups } from "@/data/spellingData";

// Helper function to check if a word contains i/y letters
function containsTargetLetters(word: string): boolean {
  const targetLetters = ['i', 'y', 'í', 'ý'];
  return targetLetters.some(letter => word.toLowerCase().includes(letter));
}

// Helper function to get words from selected groups
export function getWordsFromGroups(selectedGroups: string[]) {
  console.log("📚 getWordsFromGroups: Získávám slova ze skupin:", selectedGroups);
  
  const allWords: Array<{word: string, group: string, isPhrase?: boolean}> = [];
  
  spellingGroups.forEach(group => {
    if (selectedGroups.includes(group.name)) {
      // Add regular words - but only those containing i/y
      group.words.forEach(wordObj => {
        if (containsTargetLetters(wordObj.word)) {
          allWords.push({
            word: wordObj.word,
            group: group.name,
            isPhrase: false
          });
        } else {
          console.log(`⚠️ Skipping word "${wordObj.word}" - no i/y letters found`);
        }
      });
      
      // Add phrases if available - but only those containing i/y
      if (group.phrases) {
        group.phrases.forEach(phrase => {
          if (containsTargetLetters(phrase)) {
            allWords.push({
              word: phrase,
              group: group.name,
              isPhrase: true
            });
          } else {
            console.log(`⚠️ Skipping phrase "${phrase}" - no i/y letters found`);
          }
        });
      }
    }
  });
  
  console.log("📚 getWordsFromGroups: Nalezeno platných slov:", allWords.length);
  
  if (allWords.length === 0) {
    console.warn("⚠️ getWordsFromGroups: Žádná platná slova nalezena pro vybrané skupiny!");
  }
  
  return allWords;
}

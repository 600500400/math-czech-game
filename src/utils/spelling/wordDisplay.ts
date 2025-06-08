
// Helper function to create displayed word with missing letters
export function createDisplayedWord(word: string) {
  console.log("🔤 createDisplayedWord: Zpracovávám slovo:", word);
  
  const positions: number[] = [];
  const letters: string[] = [];
  
  // Find all i/y positions
  for (let i = 0; i < word.length; i++) {
    const char = word[i].toLowerCase();
    if (char === 'i' || char === 'y' || char === 'í' || char === 'ý') {
      positions.push(i);
      letters.push(char);
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
  
  console.log("🔤 createDisplayedWord: Zobrazené slovo:", displayWord);
  console.log("🔤 createDisplayedWord: Pozice:", positions);
  console.log("🔤 createDisplayedWord: Písmena:", letters);
  
  return {
    displayWord,
    positions,
    letters
  };
}


import { SpellingGroup } from "@/data/spellingData";
import { removeDiacritics } from "@/lib/utils";

// Funkce pro generování problému
export function generateSpellingProblem(selectedGroups: string[], spellingGroups: SpellingGroup[]) {
  // Filtrujeme skupiny podle výběru
  const availableGroups = spellingGroups.filter(group => 
    selectedGroups.includes(group.name)
  );
  
  if (availableGroups.length === 0) return null;
  
  // Náhodně vybereme skupinu
  const randomGroup = availableGroups[Math.floor(Math.random() * availableGroups.length)];
  
  // Náhodně rozhodneme, zda použijeme frázi nebo slovo
  const usePhrase = randomGroup.phrases && randomGroup.phrases.length > 0 && Math.random() > 0.7;
  
  if (usePhrase && randomGroup.phrases) {
    // Vybereme náhodnou frázi
    const randomPhrase = randomGroup.phrases[Math.floor(Math.random() * randomGroup.phrases.length)];
    
    // Najdeme všechny pozice i/y/í/ý v textu
    const positions: number[] = [];
    const letters: string[] = [];
    
    for (let i = 0; i < randomPhrase.length; i++) {
      const char = randomPhrase[i].toLowerCase();
      if (char === 'i' || char === 'y' || char === 'í' || char === 'ý') {
        positions.push(i);
        letters.push(char);
      }
    }
    
    // Pokud jsou nějaké i/y ve frázi
    if (positions.length > 0) {
      // Vytvoříme text s podtržítky místo i/y
      let displayedPhrase = randomPhrase;
      positions.forEach((pos) => {
        displayedPhrase = displayedPhrase.substring(0, pos) + '_' + displayedPhrase.substring(pos + 1);
      });
      
      return {
        word: randomPhrase,
        displayed: displayedPhrase,
        group: randomGroup.name,
        positions,
        letters,
        isPhrase: true
      };
    }
  }
  
  // Pokud nepoužijeme frázi nebo žádná není k dispozici, použijeme slovo
  const words = randomGroup.words;
  if (words.length === 0) return null;
  
  const randomWord = words[Math.floor(Math.random() * words.length)];
  
  // Najdeme všechny pozice i/y/í/ý ve slově
  const positions: number[] = [];
  const letters: string[] = [];
  
  for (let i = 0; i < randomWord.word.length; i++) {
    const char = randomWord.word[i].toLowerCase();
    if (char === 'i' || char === 'y' || char === 'í' || char === 'ý') {
      positions.push(i);
      letters.push(char);
    }
  }
  
  // Vytvoříme slovo s podtržítky místo i/y
  let displayedWord = randomWord.word;
  positions.forEach((pos) => {
    displayedWord = displayedWord.substring(0, pos) + '_' + displayedWord.substring(pos + 1);
  });
  
  return {
    word: randomWord.word,
    displayed: displayedWord,
    group: randomGroup.name,
    type: randomWord.type,
    positions,
    letters,
    isPhrase: false
  };
}

// Funkce pro kontrolu odpovědi
export function checkSpellingAnswer(correctLetter: string, userAnswer: string): boolean {
  const correctNormalized = removeDiacritics(correctLetter).toLowerCase();
  const userNormalized = removeDiacritics(userAnswer).toLowerCase();
  
  // Určení, zda je odpověď správná - kontrolujeme jen základ (i/y)
  return (
    (correctNormalized === 'i') && (userNormalized === 'i')
  ) || (
    (correctNormalized === 'y') && (userNormalized === 'y')
  );
}

// Funkce pro zobrazení slova s aktuální mezerou
export function renderWordWithCurrentGap(
  currentWord: string, 
  missingPositions: number[], 
  correctLetters: string[], 
  currentPosition: number
): string {
  if (!currentWord || missingPositions.length === 0) return currentWord;
  
  // Vytvoříme podtržítka pro všechny mezery, které nejsou aktuální
  let result = currentWord;
  for (let i = 0; i < missingPositions.length; i++) {
    const position = missingPositions[i];
    if (i === currentPosition) {
      // Pro aktuální pozici vložíme zvýrazněné podtržítko (ne písmeno)
      result = result.substring(0, position) + "_" + result.substring(position + 1);
    } else {
      // Pro ostatní pozice vložíme původní písmeno
      result = result.substring(0, position) + correctLetters[i] + result.substring(position + 1);
    }
  }
  return result;
}

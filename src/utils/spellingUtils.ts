
import { SpellingGroup } from "@/types/spellingTypes";
import { removeDiacritics } from "@/lib/utils";

// Funkce pro generování problému
export function generateSpellingProblem(selectedGroups: string[], spellingGroups: SpellingGroup[]) {
  console.log("Generování problému pro skupiny:", selectedGroups);
  
  // Filtrujeme skupiny podle výběru
  const availableGroups = spellingGroups.filter(group => 
    selectedGroups.includes(group.name)
  );
  
  if (availableGroups.length === 0) {
    console.log("Žádné dostupné skupiny");
    return null;
  }
  
  // Náhodně vybereme skupinu
  const randomGroup = availableGroups[Math.floor(Math.random() * availableGroups.length)];
  console.log("Vybraná skupina:", randomGroup.name);
  
  // Náhodně rozhodneme, zda použijeme frázi nebo slovo
  const usePhrase = randomGroup.phrases && randomGroup.phrases.length > 0 && Math.random() > 0.7;
  
  if (usePhrase && randomGroup.phrases) {
    console.log("Pokus o použití fráze");
    // Vybereme náhodnou frázi
    const randomPhrase = randomGroup.phrases[Math.floor(Math.random() * randomGroup.phrases.length)];
    console.log("Vybraná fráze:", randomPhrase);
    
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
    
    console.log("Pozice i/y ve frázi:", positions, "Písmena:", letters);
    
    // Pokud jsou nějaké i/y ve frázi
    if (positions.length > 0) {
      // Vytvoříme text s podtržítky místo i/y
      let displayedPhrase = '';
      for (let i = 0; i < randomPhrase.length; i++) {
        if (positions.includes(i)) {
          displayedPhrase += '_';
        } else {
          displayedPhrase += randomPhrase[i];
        }
      }
      
      console.log("Zobrazená fráze:", displayedPhrase);
      
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
  if (words.length === 0) {
    console.log("Žádná slova ve skupině");
    return null;
  }
  
  // Opakujeme výběr slova, dokud nenajdeme takové, které obsahuje i/y
  let attempts = 0;
  const maxAttempts = 50; // Zabránění nekonečné smyčky
  
  while (attempts < maxAttempts) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    console.log(`Pokus ${attempts + 1}: zkouším slovo "${randomWord.word}"`);
    
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
    
    console.log("Pozice i/y ve slově:", positions, "Písmena:", letters);
    
    // Pokud slovo obsahuje i/y, použijeme ho
    if (positions.length > 0) {
      // Vytvoříme slovo s podtržítky místo i/y
      let displayedWord = '';
      for (let i = 0; i < randomWord.word.length; i++) {
        if (positions.includes(i)) {
          displayedWord += '_';
        } else {
          displayedWord += randomWord.word[i];
        }
      }
      
      console.log("Originální slovo:", randomWord.word);
      console.log("Zobrazené slovo:", displayedWord);
      
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
    
    attempts++;
  }
  
  // Pokud nenajdeme žádné vhodné slovo, vrátíme null
  console.warn(`Nenalezeno žádné slovo s i/y ve skupině ${randomGroup.name} po ${maxAttempts} pokusech`);
  return null;
}

// Funkce pro kontrolu odpovědi
export function checkSpellingAnswer(correctLetter: string, userAnswer: string): boolean {
  const correctNormalized = removeDiacritics(correctLetter).toLowerCase();
  const userNormalized = removeDiacritics(userAnswer).toLowerCase();
  
  console.log("Kontrola odpovědi - správné:", correctNormalized, "uživatel:", userNormalized);
  
  // Určení, zda je odpověď správná - kontrolujeme jen základ (i/y)
  const isCorrect = (
    (correctNormalized === 'i') && (userNormalized === 'i')
  ) || (
    (correctNormalized === 'y') && (userNormalized === 'y')
  );
  
  console.log("Výsledek kontroly:", isCorrect);
  return isCorrect;
}

// Funkce pro zobrazení slova s aktuální mezerou
export function renderWordWithCurrentGap(
  currentWord: string, 
  missingPositions: number[], 
  correctLetters: string[], 
  currentPosition: number
): string {
  if (!currentWord || missingPositions.length === 0) return currentWord;
  
  console.log("Vykreslování slova:", {
    currentWord,
    missingPositions,
    correctLetters,
    currentPosition
  });
  
  // Vytvoříme výsledné slovo znak po znaku
  let result = '';
  for (let i = 0; i < currentWord.length; i++) {
    const positionIndex = missingPositions.indexOf(i);
    
    if (positionIndex !== -1) {
      // Tato pozice má být mezera
      if (positionIndex === currentPosition) {
        // Pro aktuální pozici vložíme podtržítko
        result += '_';
      } else {
        // Pro ostatní pozice vložíme původní písmeno
        result += correctLetters[positionIndex];
      }
    } else {
      // Normální písmeno
      result += currentWord[i];
    }
  }
  
  console.log("Vykreslené slovo:", result);
  return result;
}

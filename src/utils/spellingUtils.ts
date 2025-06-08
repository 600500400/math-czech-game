
import { SpellingGroup } from "@/types/spellingTypes";
import { removeDiacritics } from "@/lib/utils";
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

// Funkce pro generování problému
export function generateSpellingProblem(selectedGroups: string[], spellingGroups: SpellingGroup[]) {
  console.log("⚙️ generateSpellingProblem: Generování problému pro skupiny:", selectedGroups);
  
  // Filtrujeme skupiny podle výběru
  const availableGroups = spellingGroups.filter(group => 
    selectedGroups.includes(group.name)
  );
  
  if (availableGroups.length === 0) {
    console.log("⚙️ generateSpellingProblem: Žádné dostupné skupiny");
    return null;
  }
  
  // Náhodně vybereme skupinu
  const randomGroup = availableGroups[Math.floor(Math.random() * availableGroups.length)];
  console.log("⚙️ generateSpellingProblem: Vybraná skupina:", randomGroup.name);
  
  // Náhodně rozhodneme, zda použijeme frázi nebo slovo
  const usePhrase = randomGroup.phrases && randomGroup.phrases.length > 0 && Math.random() > 0.7;
  
  if (usePhrase && randomGroup.phrases) {
    console.log("⚙️ generateSpellingProblem: Pokus o použití fráze");
    // Vybereme náhodnou frázi
    const randomPhrase = randomGroup.phrases[Math.floor(Math.random() * randomGroup.phrases.length)];
    console.log("⚙️ generateSpellingProblem: Vybraná fráze:", randomPhrase);
    
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
    
    console.log("⚙️ generateSpellingProblem: Pozice i/y ve frázi:", positions, "Písmena:", letters);
    
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
      
      console.log("⚙️ generateSpellingProblem: Zobrazená fráze:", displayedPhrase);
      
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
    console.log("⚙️ generateSpellingProblem: Žádná slova ve skupině");
    return null;
  }
  
  // Opakujeme výběr slova, dokud nenajdeme takové, které obsahuje i/y
  let attempts = 0;
  const maxAttempts = 50; // Zabránění nekonečné smyčky
  
  while (attempts < maxAttempts) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    console.log(`⚙️ generateSpellingProblem: Pokus ${attempts + 1}: zkouším slovo "${randomWord.word}"`);
    
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
    
    console.log("⚙️ generateSpellingProblem: Pozice i/y ve slově:", positions, "Písmena:", letters);
    
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
      
      console.log("⚙️ generateSpellingProblem: Originální slovo:", randomWord.word);
      console.log("⚙️ generateSpellingProblem: Zobrazené slovo:", displayedWord);
      
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
  console.warn(`⚙️ generateSpellingProblem: Nenalezeno žádné slovo s i/y ve skupině ${randomGroup.name} po ${maxAttempts} pokusech`);
  return null;
}

// Funkce pro kontrolu odpovědi
export function checkSpellingAnswer(correctLetter: string, userAnswer: string): boolean {
  console.log("✅ checkSpellingAnswer: Kontroluji odpověď");
  console.log("✅ checkSpellingAnswer: Správné písmeno:", correctLetter);
  console.log("✅ checkSpellingAnswer: Uživatelova odpověď:", userAnswer);
  
  const correctNormalized = removeDiacritics(correctLetter).toLowerCase();
  const userNormalized = removeDiacritics(userAnswer).toLowerCase();
  
  console.log("✅ checkSpellingAnswer: Normalizované správné:", correctNormalized);
  console.log("✅ checkSpellingAnswer: Normalizované uživatel:", userNormalized);
  
  // Určení, zda je odpověď správná - kontrolujeme jen základ (i/y)
  const isCorrect = (
    (correctNormalized === 'i') && (userNormalized === 'i')
  ) || (
    (correctNormalized === 'y') && (userNormalized === 'y')
  );
  
  console.log("✅ checkSpellingAnswer: Výsledek kontroly:", isCorrect);
  return isCorrect;
}

// Funkce pro zobrazení slova s aktuální mezerou
export function renderWordWithCurrentGap(
  currentWord: string, 
  missingPositions: number[], 
  correctLetters: string[], 
  currentPosition: number
): string {
  console.log("🖼️ renderWordWithCurrentGap: ZAČÁTEK VYKRESLOVÁNÍ");
  console.log("🖼️ renderWordWithCurrentGap: currentWord:", currentWord);
  console.log("🖼️ renderWordWithCurrentGap: missingPositions:", missingPositions);
  console.log("🖼️ renderWordWithCurrentGap: correctLetters:", correctLetters);
  console.log("🖼️ renderWordWithCurrentGap: currentPosition:", currentPosition);
  
  if (!currentWord || missingPositions.length === 0) {
    console.log("🖼️ renderWordWithCurrentGap: Vracím původní slovo (žádné změny)");
    return currentWord;
  }
  
  // Vytvoříme výsledné slovo znak po znaku
  let result = '';
  for (let i = 0; i < currentWord.length; i++) {
    const positionIndex = missingPositions.indexOf(i);
    
    if (positionIndex !== -1) {
      // Tato pozice má být mezera nebo už vyplněné písmeno
      if (positionIndex === currentPosition) {
        // Pro aktuální pozici vložíme podtržítko
        result += '_';
        console.log(`🖼️ renderWordWithCurrentGap: Pozice ${i} (index ${positionIndex}): AKTUÁLNÍ -> '_'`);
      } else if (positionIndex < currentPosition) {
        // Pro už zodpovězené pozice vložíme původní písmeno
        result += currentWord[i];
        console.log(`🖼️ renderWordWithCurrentGap: Pozice ${i} (index ${positionIndex}): ZODPOVĚZENO -> '${currentWord[i]}'`);
      } else {
        // Pro budoucí pozice vložíme podtržítko
        result += '_';
        console.log(`🖼️ renderWordWithCurrentGap: Pozice ${i} (index ${positionIndex}): BUDOUCÍ -> '_'`);
      }
    } else {
      // Normální písmeno
      result += currentWord[i];
      console.log(`🖼️ renderWordWithCurrentGap: Pozice ${i}: NORMÁLNÍ -> '${currentWord[i]}'`);
    }
  }
  
  console.log("🖼️ renderWordWithCurrentGap: VÝSLEDEK:", result);
  console.log("🖼️ renderWordWithCurrentGap: KONEC VYKRESLOVÁNÍ");
  return result;
}

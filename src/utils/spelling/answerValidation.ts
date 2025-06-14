
import { removeDiacritics } from "@/lib/utils";

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

// Funkce pro zobrazení slova s aktuální mezerou a doplněnými písmeny
export function renderWordWithCurrentGap(
  currentWord: string, 
  missingPositions: number[], 
  correctLetters: string[], 
  currentPosition: number,
  filledAnswers: { [position: number]: string } = {}
): string {
  console.log("🖼️ renderWordWithCurrentGap: ZAČÁTEK VYKRESLOVÁNÍ");
  console.log("🖼️ renderWordWithCurrentGap: currentWord:", currentWord);
  console.log("🖼️ renderWordWithCurrentGap: missingPositions:", missingPositions);
  console.log("🖼️ renderWordWithCurrentGap: correctLetters:", correctLetters);
  console.log("🖼️ renderWordWithCurrentGap: currentPosition:", currentPosition);
  console.log("🖼️ renderWordWithCurrentGap: filledAnswers:", filledAnswers);
  
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
      if (positionIndex < currentPosition) {
        // Pro už zodpovězené pozice vložíme původní písmeno (doplněno)
        result += currentWord[i];
        console.log(`🖼️ renderWordWithCurrentGap: Pozice ${i} (index ${positionIndex}): ZODPOVĚZENO -> '${currentWord[i]}'`);
      } else if (positionIndex === currentPosition) {
        // Pro aktuální pozici vložíme podtržítko
        result += '_';
        console.log(`🖼️ renderWordWithCurrentGap: Pozice ${i} (index ${positionIndex}): AKTUÁLNÍ -> '_'`);
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

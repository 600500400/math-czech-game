
import { removeDiacritics } from "@/lib/utils";
import { logger } from "@/utils/logger";

// Funkce pro kontrolu odpovědi
export function checkSpellingAnswer(correctLetter: string, userAnswer: string): boolean {
  const correctNormalized = removeDiacritics(correctLetter).toLowerCase();
  const userNormalized = removeDiacritics(userAnswer).toLowerCase();

  logger.debug("✅ checkSpellingAnswer:", { correctLetter, userAnswer, correctNormalized, userNormalized });

  // Určení, zda je odpověď správná - kontrolujeme jen základ (i/y)
  const isCorrect = (
    (correctNormalized === 'i') && (userNormalized === 'i')
  ) || (
    (correctNormalized === 'y') && (userNormalized === 'y')
  );

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
  if (!currentWord || missingPositions.length === 0) {
    return currentWord;
  }

  // Vytvoříme výsledné slovo znak po znaku
  let result = '';
  for (let i = 0; i < currentWord.length; i++) {
    const positionIndex = missingPositions.indexOf(i);

    if (positionIndex !== -1) {
      if (positionIndex < currentPosition) {
        // Pro už zodpovězené pozice vložíme původní písmeno (doplněno)
        result += currentWord[i];
      } else {
        // Aktuální i budoucí pozice se zobrazí jako mezera
        result += '_';
      }
    } else {
      result += currentWord[i];
    }
  }

  return result;
}

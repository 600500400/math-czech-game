
import { SpellingGroup } from "@/types/spellingTypes";
import { logger } from "@/utils/logger";

export type PhraseMode = "mixed" | "phrases-only" | "words-only";

// Pravděpodobnost výběru fráze v režimu "mixed" (50%)
const MIXED_PHRASE_PROBABILITY = 0.5;

// Funkce pro generování problému
export function generateSpellingProblem(
  selectedGroups: string[],
  spellingGroups: SpellingGroup[],
  phraseMode: PhraseMode = "mixed"
) {
  logger.debug("⚙️ generateSpellingProblem: skupiny:", selectedGroups, "režim:", phraseMode);

  // Filtrujeme skupiny podle výběru
  const availableGroups = spellingGroups.filter(group =>
    selectedGroups.includes(group.name)
  );

  if (availableGroups.length === 0) {
    logger.warn("⚙️ generateSpellingProblem: Žádné dostupné skupiny");
    return null;
  }

  // Náhodně vybereme skupinu
  const randomGroup = availableGroups[Math.floor(Math.random() * availableGroups.length)];

  // Rozhodnutí o použití fráze podle režimu
  const hasPhrases = !!(randomGroup.phrases && randomGroup.phrases.length > 0);
  let usePhrase = false;
  if (phraseMode === "phrases-only") {
    usePhrase = hasPhrases;
  } else if (phraseMode === "words-only") {
    usePhrase = false;
  } else {
    usePhrase = hasPhrases && Math.random() < MIXED_PHRASE_PROBABILITY;
  }
  
  if (usePhrase && randomGroup.phrases) {
    const randomPhrase = randomGroup.phrases[Math.floor(Math.random() * randomGroup.phrases.length)];

    const positions: number[] = [];
    const letters: string[] = [];

    for (let i = 0; i < randomPhrase.length; i++) {
      const char = randomPhrase[i].toLowerCase();
      if (char === 'i' || char === 'y' || char === 'í' || char === 'ý') {
        positions.push(i);
        letters.push(char);
      }
    }

    if (positions.length > 0) {
      let displayedPhrase = '';
      for (let i = 0; i < randomPhrase.length; i++) {
        displayedPhrase += positions.includes(i) ? '_' : randomPhrase[i];
      }

      return {
        word: randomPhrase,
        displayed: displayedPhrase,
        group: randomGroup.name,
        positions,
        letters,
        isPhrase: true,
      };
    }
  }

  // Fallback: použijeme jednotlivé slovo
  const words = randomGroup.words;
  if (words.length === 0) {
    logger.warn("⚙️ generateSpellingProblem: Žádná slova ve skupině");
    return null;
  }

  let attempts = 0;
  const maxAttempts = 50;

  while (attempts < maxAttempts) {
    const randomWord = words[Math.floor(Math.random() * words.length)];

    const positions: number[] = [];
    const letters: string[] = [];

    for (let i = 0; i < randomWord.word.length; i++) {
      const char = randomWord.word[i].toLowerCase();
      if (char === 'i' || char === 'y' || char === 'í' || char === 'ý') {
        positions.push(i);
        letters.push(char);
      }
    }

    if (positions.length > 0) {
      let displayedWord = '';
      for (let i = 0; i < randomWord.word.length; i++) {
        displayedWord += positions.includes(i) ? '_' : randomWord.word[i];
      }

      return {
        word: randomWord.word,
        displayed: displayedWord,
        group: randomGroup.name,
        type: randomWord.type,
        positions,
        letters,
        isPhrase: false,
      };
    }

    attempts++;
  }

  logger.warn(`⚙️ generateSpellingProblem: Žádné vhodné slovo ve skupině ${randomGroup.name}`);
  return null;
}


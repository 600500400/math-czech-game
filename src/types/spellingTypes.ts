
export interface SpellingGameState {
  correctAnswers: number;
  wrongAnswers: number;
  problemCount: number;
  currentWord: string;
  displayedWord: string;
  userAnswer: string;
  showProblem: boolean;
  gameEnded: boolean;
  wordGroup: string;
  isPhrase: boolean;
  correctLetters: string[];
  missingPositions: number[];
  currentPosition: number;
  lastAnswerCorrect: boolean | null;
  showAnimation: boolean;
  gameStartTime?: number; // Added for tracking game duration
}

export interface SpellingWord {
  word: string;
  type: string;
  positions?: number[];
}

export interface SpellingGroup {
  name: string;
  words: SpellingWord[];
  phrases?: string[];
}

export interface SpellingDifficulty {
  selectedGroups: string[];
  wordCount: number;
}

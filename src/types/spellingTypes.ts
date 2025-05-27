
export interface SpellingAnswer {
  word: string;
  position: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timestamp: string;
  wordGroup: string;
}

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
  gameStartTime?: number;
  answers: SpellingAnswer[]; // New field for detailed answers
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

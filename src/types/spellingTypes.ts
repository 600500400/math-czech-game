
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
}

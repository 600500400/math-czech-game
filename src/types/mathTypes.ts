
export type Operation = "+" | "-" | "*" | "/";

export interface Problem {
  num1: number;
  num2: number;
  operation: Operation;
  result: number;
}

export interface MathAnswer {
  problem: Problem;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timestamp: string;
}

export interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

export interface MathGameState {
  correctAnswers: number;
  wrongAnswers: number;
  problemCount: number;
  currentProblem: Problem | null;
  userAnswer: string;
  showProblem: boolean;
  showDifficultyDialog: boolean;
  showStatsDialog: boolean;
  maxValue: number;
  difficultySet: boolean;
  gameEnded: boolean;
  lastAnswerCorrect: boolean | null;
  showAnimation: boolean;
  showConfetti: boolean;
  gameStartTime?: Date;
  gameDuration?: number;
  answers: MathAnswer[]; // New field for detailed answers
}

export interface DifficultyLevel {
  maxValue: number;
  maxMultiplyValue: number;
  maxDivideValue: number;
}

export interface DetailedMathStatistics {
  id: string;
  user_id: string;
  correct_answers: number;
  wrong_answers: number;
  operation: string;
  difficulty_level: DifficultyLevel;
  game_duration: number; // in seconds
  created_at: string;
  answers?: MathAnswer[]; // Optional detailed answers
}

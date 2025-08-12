export interface DictionaryWord {
  id: string;
  english_word: string;
  czech_translation: string;
  difficulty_level: 'basic' | 'intermediate' | 'advanced';
  user_id: string;
  is_user_created: boolean;
  created_at: string;
  updated_at: string;
}

export interface DictionaryAnswer {
  id: string;
  user_id: string;
  word_id: string;
  english_word: string;
  czech_translation: string;
  user_answer: string;
  is_correct: boolean;
  mode: 'simple' | 'advanced';
  direction: 'en_to_cz' | 'cz_to_en';
  created_at: string;
}

export interface DictionaryStatistics {
  id: string;
  user_id: string;
  correct_answers: number;
  wrong_answers: number;
  mode: 'simple' | 'advanced';
  direction: 'en_to_cz' | 'cz_to_en';
  game_duration: number;
  created_at: string;
}

export interface DictionaryGameState {
  currentWord: DictionaryWord | null;
  userAnswer: string;
  showAnswer: boolean;
  gameStarted: boolean;
  mode: 'simple' | 'advanced';
  direction: 'en_to_cz' | 'cz_to_en';
  correctAnswers: number;
  wrongAnswers: number;
  showStatsDialog: boolean;
  answers: DictionaryAnswer[];
  gameStartTime: number | null;

  // Deck-based flow
  shuffledWords: DictionaryWord[];
  currentIndex: number;
  totalWords: number;
  showSentences: boolean;
}

export interface DictionaryModeSettings {
  mode: 'simple' | 'advanced';
  direction: 'en_to_cz' | 'cz_to_en';
  difficultyFilter: 'all' | 'basic' | 'intermediate' | 'advanced';
}

export interface NewDictionaryWord {
  english_word: string;
  czech_translation: string;
  difficulty_level: 'basic' | 'intermediate' | 'advanced';
}
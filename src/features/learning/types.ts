export type Subject = 'math' | 'spelling' | 'english';
export type Source = 'personal' | 'school' | 'all';
export type Operation = '+' | '-' | '*' | '/';
export type Phase = 'answering' | 'feedback' | 'paused' | 'summary';

export interface MathSettings {
  operations: Operation[];
  min: number;
  max: number;
  factorMin: number;
  factorMax: number;
}

interface TaskBase {
  id: string;
  key: string;
  skillId: string;
  contentId: string;
  prompt: string;
  expected: string[];
  explanation: string;
  hint: string;
}
export interface MathTask extends TaskBase {
  subject: 'math';
  a: number;
  b: number;
  operation: Operation;
  result: number;
}
export interface SpellingTask extends TaskBase {
  subject: 'spelling';
  sentence: string;
  word: string;
  gapIndex: number;
  group: string;
  ruleId: string;
}
export interface EnglishTask extends TaskBase {
  subject: 'english';
  word: LearningWord;
  direction: 'en_to_cz' | 'cz_to_en';
}
export type Task = MathTask | SpellingTask | EnglishTask;

export interface LearningWord {
  id: string;
  english: string;
  czech: string;
  accepted: string[];
  source: 'personal' | 'school';
  category: string;
  exampleEn?: string;
  exampleCz?: string;
  updatedAt?: string;
}

export interface Attempt {
  id: string;
  taskId: string;
  answer: string;
  isCorrect: boolean;
  usedHint: boolean;
  number: number;
  answeredAt: string;
  assessment: 'verified' | 'self';
}

export interface LessonSession {
  id: string;
  learnerId: string;
  subject: Subject;
  contentVersion: string;
  title: string;
  mode: 'typing' | 'cards';
  tasks: Task[];
  attempts: Attempt[];
  index: number;
  phase: Phase;
  previousPhase?: 'answering' | 'feedback';
  revealed: boolean;
  usedHint: boolean;
  status: 'active' | 'completed' | 'interrupted';
  startedAt: string;
  completedAt?: string;
  activityDate?: string;
  xp: number;
  sync: 'local' | 'pending' | 'synced';
}

export interface Review {
  key: string;
  skillId: string;
  subject: Subject;
  successes: number;
  dueAt: string;
  lastCorrect: boolean;
}
export interface Preferences {
  count: 5 | 10 | 15 | 20;
  math: MathSettings;
  groups: string[];
  englishSource?: Source;
  englishMode: 'typing' | 'cards';
  englishDirection: 'en_to_cz' | 'cz_to_en';
  englishCategory: string;
  reducedMotion: boolean;
  timeZone: string;
}
export interface LearningData {
  version: 2;
  sessions: LessonSession[];
  words: Record<string, LearningWord>;
  reviews: Record<string, Review>;
  baseXp: number;
  preferences: Preferences;
  badges: Record<string, string>;
}

export type LessonAction =
  | { type: 'answer'; answer: string; id: string; at: string; selfCorrect?: boolean }
  | { type: 'hint' }
  | { type: 'reveal' }
  | { type: 'retry' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'next'; at: string }
  | { type: 'finish'; at: string };

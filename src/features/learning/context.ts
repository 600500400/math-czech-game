import { createContext, useContext } from 'react';
import type { LearningData, LearningWord, LessonAction, LessonSession, Preferences } from './types';

export interface LearningContextValue {
  data: LearningData;
  learnerId: string;
  cloud: boolean;
  storageError: string | null;
  syncError: string | null;
  syncing: boolean;
  start: (session: LessonSession) => void;
  dispatch: (id: string, action: LessonAction) => void;
  savePreferences: (preferences: Partial<Preferences>) => void;
  saveWords: (words: readonly LearningWord[]) => void;
  retrySync: () => Promise<void>;
  exportBackup: () => void;
  importBackup: (text: string) => void;
}
export const LearningContext = createContext<LearningContextValue | null>(null);
export function useLearning(): LearningContextValue {
  const value = useContext(LearningContext); if (!value) throw new Error('LearningProvider není dostupný.'); return value;
}

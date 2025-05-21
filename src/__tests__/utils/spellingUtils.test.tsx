
import { renderWordWithCurrentGap, checkSpellingAnswer } from '@/utils/spellingUtils';
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom';

describe('spellingUtils', () => {
  describe('renderWordWithCurrentGap', () => {
    test('should render word with gap at current position', () => {
      const word = 'bystrý';
      const missingPositions = [0];
      const correctLetters = ['b'];
      const currentPosition = 0;
      
      const result = renderWordWithCurrentGap(word, missingPositions, correctLetters, currentPosition);
      
      expect(result).toBe('_ystrý');
    });
    
    test('should render word with multiple gaps but highlight only current position', () => {
      const word = 'babyka';
      const missingPositions = [0, 2, 4];
      const correctLetters = ['b', 'b', 'k'];
      const currentPosition = 1;
      
      const result = renderWordWithCurrentGap(word, missingPositions, correctLetters, currentPosition);
      
      expect(result).toBe('ba_yka');
    });
    
    test('should return original word if no missing positions', () => {
      const word = 'babyka';
      const missingPositions: number[] = [];
      const correctLetters: string[] = [];
      const currentPosition = 0;
      
      const result = renderWordWithCurrentGap(word, missingPositions, correctLetters, currentPosition);
      
      expect(result).toBe('babyka');
    });
  });
  
  describe('checkSpellingAnswer', () => {
    test('should correctly check "i" answer', () => {
      expect(checkSpellingAnswer('i', 'i')).toBe(true);
      expect(checkSpellingAnswer('i', 'y')).toBe(false);
    });
    
    test('should correctly check "y" answer', () => {
      expect(checkSpellingAnswer('y', 'y')).toBe(true);
      expect(checkSpellingAnswer('y', 'i')).toBe(false);
    });
    
    test('should handle diacritics in correct answers', () => {
      expect(checkSpellingAnswer('í', 'i')).toBe(true);
      expect(checkSpellingAnswer('ý', 'y')).toBe(true);
    });
  });
});

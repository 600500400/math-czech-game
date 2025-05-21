
import { renderHook, act } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { useGameStatistics } from '@/hooks/spelling/useGameStatistics';

describe('useGameStatistics', () => {
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useGameStatistics());
    
    expect(result.current.correctAnswers).toBe(0);
    expect(result.current.wrongAnswers).toBe(0);
    expect(result.current.problemCount).toBe(0);
    expect(result.current.totalAnswers).toBe(0);
    expect(result.current.showStatsDialog).toBe(false);
    expect(result.current.hasStats).toBe(false);
  });

  test('should increment correct answers', () => {
    const { result } = renderHook(() => useGameStatistics());
    
    act(() => {
      result.current.incrementCorrect();
    });
    
    expect(result.current.correctAnswers).toBe(1);
    expect(result.current.totalAnswers).toBe(1);
    expect(result.current.hasStats).toBe(true);
  });

  test('should increment wrong answers', () => {
    const { result } = renderHook(() => useGameStatistics());
    
    act(() => {
      result.current.incrementWrong();
    });
    
    expect(result.current.wrongAnswers).toBe(1);
    expect(result.current.totalAnswers).toBe(1);
    expect(result.current.hasStats).toBe(true);
  });

  test('should increment problem count', () => {
    const { result } = renderHook(() => useGameStatistics());
    
    act(() => {
      result.current.incrementProblemCount();
    });
    
    expect(result.current.problemCount).toBe(1);
  });

  test('should toggle stats dialog visibility', () => {
    const { result } = renderHook(() => useGameStatistics());
    
    act(() => {
      result.current.setShowStatsDialog(true);
    });
    
    expect(result.current.showStatsDialog).toBe(true);
    
    act(() => {
      result.current.setShowStatsDialog(false);
    });
    
    expect(result.current.showStatsDialog).toBe(false);
  });

  test('should set correct answers', () => {
    const { result } = renderHook(() => useGameStatistics());
    
    act(() => {
      result.current.setCorrectAnswers(5);
    });
    
    expect(result.current.correctAnswers).toBe(5);
    expect(result.current.totalAnswers).toBe(5);
  });

  test('should set wrong answers', () => {
    const { result } = renderHook(() => useGameStatistics());
    
    act(() => {
      result.current.setWrongAnswers(3);
    });
    
    expect(result.current.wrongAnswers).toBe(3);
    expect(result.current.totalAnswers).toBe(3);
  });
});

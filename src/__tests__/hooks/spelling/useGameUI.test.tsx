
import { renderHook, act } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom';
import { useGameUI } from '@/hooks/spelling/useGameUI';

describe('useGameUI', () => {
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useGameUI());
    
    expect(result.current.showProblem).toBe(false);
    expect(result.current.problemCount).toBe(10);
  });

  test('should toggle showProblem state', () => {
    const { result } = renderHook(() => useGameUI());
    
    act(() => {
      result.current.setShowProblem(true);
    });
    
    expect(result.current.showProblem).toBe(true);
  });

  test('should update problemCount state', () => {
    const { result } = renderHook(() => useGameUI());
    
    act(() => {
      result.current.setProblemCount(5);
    });
    
    expect(result.current.problemCount).toBe(5);
  });

  test('resetGame should reset problemCount to 10', () => {
    const { result } = renderHook(() => useGameUI());
    
    // First set to different value
    act(() => {
      result.current.setProblemCount(5);
    });
    expect(result.current.problemCount).toBe(5);
    
    // Then reset
    act(() => {
      result.current.resetGame();
    });
    expect(result.current.problemCount).toBe(10);
  });
});

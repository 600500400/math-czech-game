
import { renderHook, act } from '@testing-library/react';
import { useAnimationState } from '@/hooks/spelling/useAnimationState';

describe('useAnimationState', () => {
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useAnimationState());
    
    expect(result.current.lastAnswerCorrect).toBe(null);
    expect(result.current.showAnimation).toBe(false);
  });

  test('should update lastAnswerCorrect state', () => {
    const { result } = renderHook(() => useAnimationState());
    
    act(() => {
      result.current.setLastAnswerCorrect(true);
    });
    
    expect(result.current.lastAnswerCorrect).toBe(true);
    
    act(() => {
      result.current.setLastAnswerCorrect(false);
    });
    
    expect(result.current.lastAnswerCorrect).toBe(false);
  });

  test('should toggle showAnimation state', () => {
    const { result } = renderHook(() => useAnimationState());
    
    act(() => {
      result.current.setShowAnimation(true);
    });
    
    expect(result.current.showAnimation).toBe(true);
    
    act(() => {
      result.current.setShowAnimation(false);
    });
    
    expect(result.current.showAnimation).toBe(false);
  });
});

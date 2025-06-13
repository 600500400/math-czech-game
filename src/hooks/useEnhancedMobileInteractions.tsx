
import { useCallback } from 'react';
import { useAudioSystem } from './useAudioSystem';
import { useAdvancedHaptics } from './useAdvancedHaptics';

export const useEnhancedMobileInteractions = () => {
  const {
    playCorrectSound,
    playIncorrectSound,
    playGameStartSound,
    playGameEndSound,
    playButtonClickSound,
    playCelebrationSound
  } = useAudioSystem();

  const {
    triggerSuccessHaptic,
    triggerErrorHaptic,
    triggerCelebrationHaptic,
    triggerGameStartHaptic,
    triggerGameEndHaptic,
    triggerTapHaptic
  } = useAdvancedHaptics();

  // Enhanced feedback for correct answers
  const triggerCorrectFeedback = useCallback(() => {
    playCorrectSound();
    triggerSuccessHaptic();
  }, [playCorrectSound, triggerSuccessHaptic]);

  // Enhanced feedback for incorrect answers
  const triggerIncorrectFeedback = useCallback(() => {
    playIncorrectSound();
    triggerErrorHaptic();
  }, [playIncorrectSound, triggerErrorHaptic]);

  // Enhanced feedback for game start
  const triggerGameStartFeedback = useCallback(() => {
    playGameStartSound();
    triggerGameStartHaptic();
  }, [playGameStartSound, triggerGameStartHaptic]);

  // Enhanced feedback for game end
  const triggerGameEndFeedback = useCallback(() => {
    playGameEndSound();
    triggerGameEndHaptic();
  }, [playGameEndSound, triggerGameEndHaptic]);

  // Enhanced feedback for celebration
  const triggerCelebrationFeedback = useCallback(() => {
    playCelebrationSound();
    triggerCelebrationHaptic();
  }, [playCelebrationSound, triggerCelebrationHaptic]);

  // Enhanced feedback for button interactions
  const triggerButtonFeedback = useCallback(() => {
    playButtonClickSound();
    triggerTapHaptic();
  }, [playButtonClickSound, triggerTapHaptic]);

  // Enhanced feedback sequences for different scenarios
  const triggerPerfectScoreFeedback = useCallback(() => {
    // Extended celebration for perfect scores
    triggerCelebrationFeedback();
    
    // Additional celebration after delay
    setTimeout(() => {
      triggerCelebrationFeedback();
    }, 1000);
  }, [triggerCelebrationFeedback]);

  const triggerImprovementFeedback = useCallback(() => {
    // Encouraging feedback for improvement
    playCorrectSound();
    setTimeout(() => triggerSuccessHaptic(), 100);
    setTimeout(() => triggerSuccessHaptic(), 300);
  }, [playCorrectSound, triggerSuccessHaptic]);

  return {
    // Basic feedback
    triggerCorrectFeedback,
    triggerIncorrectFeedback,
    triggerButtonFeedback,
    
    // Game state feedback
    triggerGameStartFeedback,
    triggerGameEndFeedback,
    triggerCelebrationFeedback,
    
    // Advanced feedback sequences
    triggerPerfectScoreFeedback,
    triggerImprovementFeedback,
  };
};

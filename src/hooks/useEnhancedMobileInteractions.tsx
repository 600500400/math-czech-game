import { useCallback } from 'react';
import { useAudioSystem } from './useAudioSystem';
import { useAdvancedHaptics } from './useAdvancedHaptics';

interface EnhancedMobileInteractionsConfig {
  hapticsEnabled?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

export const useEnhancedMobileInteractions = (config: EnhancedMobileInteractionsConfig = {}) => {
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
    if (config.hapticsEnabled !== false) {
      triggerSuccessHaptic();
    }
  }, [playCorrectSound, triggerSuccessHaptic, config.hapticsEnabled]);

  // Enhanced feedback for incorrect answers
  const triggerIncorrectFeedback = useCallback(() => {
    playIncorrectSound();
    if (config.hapticsEnabled !== false) {
      triggerErrorHaptic();
    }
  }, [playIncorrectSound, triggerErrorHaptic, config.hapticsEnabled]);

  // Enhanced feedback for game start
  const triggerGameStartFeedback = useCallback(() => {
    playGameStartSound();
    if (config.hapticsEnabled !== false) {
      triggerGameStartHaptic();
    }
  }, [playGameStartSound, triggerGameStartHaptic, config.hapticsEnabled]);

  // Enhanced feedback for game end
  const triggerGameEndFeedback = useCallback(() => {
    playGameEndSound();
    if (config.hapticsEnabled !== false) {
      triggerGameEndHaptic();
    }
  }, [playGameEndSound, triggerGameEndHaptic, config.hapticsEnabled]);

  // Enhanced feedback for celebration
  const triggerCelebrationFeedback = useCallback(() => {
    playCelebrationSound();
    if (config.hapticsEnabled !== false) {
      triggerCelebrationHaptic();
    }
  }, [playCelebrationSound, triggerCelebrationHaptic, config.hapticsEnabled]);

  // Enhanced feedback for milestone achievements
  const triggerMilestoneFeedback = useCallback(() => {
    playCelebrationSound();
    if (config.hapticsEnabled !== false) {
      triggerCelebrationHaptic();
      
      // Additional celebration after delay for milestone
      setTimeout(() => {
        triggerCelebrationHaptic();
      }, 500);
    }
  }, [playCelebrationSound, triggerCelebrationHaptic, config.hapticsEnabled]);

  // Enhanced feedback for button interactions
  const triggerButtonFeedback = useCallback(() => {
    playButtonClickSound();
    if (config.hapticsEnabled !== false) {
      triggerTapHaptic();
    }
  }, [playButtonClickSound, triggerTapHaptic, config.hapticsEnabled]);

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
    if (config.hapticsEnabled !== false) {
      setTimeout(() => triggerSuccessHaptic(), 100);
      setTimeout(() => triggerSuccessHaptic(), 300);
    }
  }, [playCorrectSound, triggerSuccessHaptic, config.hapticsEnabled]);

  return {
    // Basic feedback
    triggerCorrectFeedback,
    triggerIncorrectFeedback,
    triggerButtonFeedback,
    
    // Game state feedback
    triggerGameStartFeedback,
    triggerGameEndFeedback,
    triggerCelebrationFeedback,
    triggerMilestoneFeedback,
    
    // Advanced feedback sequences
    triggerPerfectScoreFeedback,
    triggerImprovementFeedback,
  };
};

import { useState, useCallback, useRef } from 'react';
import { useAudioSystem } from './useAudioSystem';

interface TextToSpeechOptions {
  language?: 'en-US' | 'cs-CZ';
  rate?: number;
  pitch?: number;
  volume?: number;
}

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported] = useState(() => 'speechSynthesis' in window);
  const { settings } = useAudioSystem();
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, options: TextToSpeechOptions = {}) => {
    if (!isSupported || !settings.enabled || !text.trim()) return;

    // Stop any current speech
    if (currentUtteranceRef.current) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtteranceRef.current = utterance;

    // Set options
    utterance.lang = options.language || 'en-US';
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1;
    utterance.volume = (options.volume || settings.volume) * 0.8; // Slightly lower than sound effects

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      currentUtteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.warn('Speech synthesis error:', event.error);
      setIsPlaying(false);
      currentUtteranceRef.current = null;
    };

    // Start speaking
    speechSynthesis.speak(utterance);
  }, [isSupported, settings.enabled, settings.volume]);

  const stop = useCallback(() => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      currentUtteranceRef.current = null;
    }
  }, []);

  const speakEnglish = useCallback((text: string) => {
    speak(text, { language: 'en-US' });
  }, [speak]);

  const speakCzech = useCallback((text: string) => {
    speak(text, { language: 'cs-CZ' });
  }, [speak]);

  return {
    speak,
    speakEnglish,
    speakCzech,
    stop,
    isPlaying,
    isSupported,
  };
};

import { useState, useCallback, useEffect } from "react";

import { logger } from "@/utils/logger";
export const useTextToSpeech = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      logger.log("🗣️ TTS: Available voices:", voices.map(v => `${v.name} (${v.lang})`));
    };

    // Load voices initially
    loadVoices();
    
    // Some browsers load voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Select the best voice for English pronunciation (with Czech fallback)
  const selectBestVoiceForEnglish = useCallback((): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) return null;

    // First try to find English voices
    const englishVoices = availableVoices.filter(voice => 
      voice.lang.toLowerCase().startsWith('en')
    );

    logger.log("🗣️ TTS: Available English voices:", englishVoices.map(v => `${v.name} (${v.lang})`));

    if (englishVoices.length > 0) {
      // Preferred English voices in order of priority
      const preferredVoices = [
        'Microsoft David',
        'Google US English', 
        'Alex',
        'Samantha',
        'Microsoft Zira',
        'Karen',
        'Daniel'
      ];

      // Try to find preferred voices first
      for (const preferredName of preferredVoices) {
        const preferredVoice = englishVoices.find(voice => 
          voice.name.toLowerCase().includes(preferredName.toLowerCase())
        );
        if (preferredVoice) {
          logger.log(`🗣️ TTS: Selected preferred English voice: ${preferredVoice.name} (${preferredVoice.lang})`);
          return preferredVoice;
        }
      }

      // Prefer US English if available
      const usEnglish = englishVoices.find(voice => 
        voice.lang.toLowerCase().includes('en-us')
      );
      if (usEnglish) {
        logger.log(`🗣️ TTS: Selected US English voice: ${usEnglish.name} (${usEnglish.lang})`);
        return usEnglish;
      }

      // Use first available English voice
      const selectedVoice = englishVoices[0];
      logger.log(`🗣️ TTS: Selected first available English voice: ${selectedVoice.name} (${selectedVoice.lang})`);
      return selectedVoice;
    }

    // FALLBACK: No English voices found, try to use Czech voice with English pronunciation
    logger.log("🗣️ TTS: No English voices found, using Czech voice fallback");
    
    // Look for Czech voices
    const czechVoices = availableVoices.filter(voice => 
      voice.lang.toLowerCase().startsWith('cs') || voice.lang.toLowerCase().includes('czech')
    );

    if (czechVoices.length > 0) {
      const czechVoice = czechVoices[0];
      logger.log(`🗣️ TTS: Selected Czech voice for English fallback: ${czechVoice.name} (${czechVoice.lang})`);
      return czechVoice;
    }

    // Ultimate fallback: use any available voice
    if (availableVoices.length > 0) {
      const fallbackVoice = availableVoices[0];
      logger.log(`🗣️ TTS: Using ultimate fallback voice: ${fallbackVoice.name} (${fallbackVoice.lang})`);
      return fallbackVoice;
    }

    logger.log("🗣️ TTS: No voices available at all");
    return null;
  }, [availableVoices]);

  const speak = useCallback((text: string, _lang?: string) => {
    // Always force English pronunciation (ignore lang parameter)
    const forcedLang = 'en-US';
    logger.log("🗣️ TTS: Attempting to speak:", text, "forced to English");
    
    if (!('speechSynthesis' in window)) {
      const errorMsg = "Speech synthesis not supported";
      console.error("🗣️ TTS Error:", errorMsg);
      setError(errorMsg);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = forcedLang;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Select best voice (with Czech fallback for English pronunciation)
      const selectedVoice = selectBestVoiceForEnglish();
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        logger.log(`🗣️ TTS: Using voice: ${selectedVoice.name} (${selectedVoice.lang}) for English pronunciation`);
      } else {
        logger.log(`🗣️ TTS: Using default voice, forced to English`);
      }
      
      utterance.onstart = () => {
        logger.log("🗣️ TTS: Speech started");
      };
      
      utterance.onend = () => {
        logger.log("🗣️ TTS: Speech ended");
        setIsLoading(false);
      };
      
      utterance.onerror = (event) => {
        const errorMsg = `Speech error: ${event.error}`;
        console.error("🗣️ TTS Error:", errorMsg);
        setError(errorMsg);
        setIsLoading(false);
      };
      
      speechSynthesis.speak(utterance);
      logger.log("🗣️ TTS: Speech synthesis started with forced English");
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown speech error";
      console.error("🗣️ TTS Error:", errorMsg);
      setError(errorMsg);
      setIsLoading(false);
    }
  }, [selectBestVoiceForEnglish]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsLoading(false);
  }, []);

  return {
    speak,
    stop,
    isLoading,
    error,
    isSupported: 'speechSynthesis' in window,
    availableVoices
  };
};

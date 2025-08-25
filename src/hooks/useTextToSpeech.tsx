
import { useState, useCallback, useEffect } from "react";

export const useTextToSpeech = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      console.log("🗣️ TTS: Available voices:", voices.map(v => `${v.name} (${v.lang})`));
    };

    // Load voices initially
    loadVoices();
    
    // Some browsers load voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Select the best voice for a given language
  const selectBestVoice = useCallback((lang: string): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) return null;

    // Convert language codes to more specific matching
    const langMap: Record<string, string[]> = {
      'en': ['en-US', 'en-GB', 'en-AU', 'en'],
      'en-US': ['en-US', 'en-GB', 'en-AU', 'en'],
      'cs': ['cs-CZ', 'cs'],
      'cz': ['cs-CZ', 'cs']
    };

    const targetLangs = langMap[lang] || [lang];
    
    // Try to find exact matches first
    for (const targetLang of targetLangs) {
      const exactMatch = availableVoices.find(voice => 
        voice.lang.toLowerCase() === targetLang.toLowerCase()
      );
      if (exactMatch) {
        console.log(`🗣️ TTS: Selected exact match voice: ${exactMatch.name} (${exactMatch.lang})`);
        return exactMatch;
      }
    }

    // Try partial matches
    for (const targetLang of targetLangs) {
      const partialMatch = availableVoices.find(voice => 
        voice.lang.toLowerCase().startsWith(targetLang.toLowerCase().split('-')[0])
      );
      if (partialMatch) {
        console.log(`🗣️ TTS: Selected partial match voice: ${partialMatch.name} (${partialMatch.lang})`);
        return partialMatch;
      }
    }

    console.log(`🗣️ TTS: No suitable voice found for ${lang}, using default`);
    return null;
  }, [availableVoices]);

  const speak = useCallback((text: string, lang: string = 'en-US') => {
    console.log("🗣️ TTS: Attempting to speak:", text, "in language:", lang);
    
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
      utterance.lang = lang;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Select the best available voice
      const selectedVoice = selectBestVoice(lang);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`🗣️ TTS: Using voice: ${selectedVoice.name} (${selectedVoice.lang})`);
      } else {
        console.log(`🗣️ TTS: Using default voice for language: ${lang}`);
      }
      
      utterance.onstart = () => {
        console.log("🗣️ TTS: Speech started");
      };
      
      utterance.onend = () => {
        console.log("🗣️ TTS: Speech ended");
        setIsLoading(false);
      };
      
      utterance.onerror = (event) => {
        const errorMsg = `Speech error: ${event.error}`;
        console.error("🗣️ TTS Error:", errorMsg);
        setError(errorMsg);
        setIsLoading(false);
      };
      
      speechSynthesis.speak(utterance);
      console.log("🗣️ TTS: Speech synthesis started");
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown speech error";
      console.error("🗣️ TTS Error:", errorMsg);
      setError(errorMsg);
      setIsLoading(false);
    }
  }, [selectBestVoice]);

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

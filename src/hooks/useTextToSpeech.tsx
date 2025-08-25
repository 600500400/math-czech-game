
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

  // Select the best English voice (hardcoded to English only)
  const selectBestEnglishVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) return null;

    // Filter only English voices
    const englishVoices = availableVoices.filter(voice => 
      voice.lang.toLowerCase().startsWith('en')
    );

    console.log("🗣️ TTS: Available English voices:", englishVoices.map(v => `${v.name} (${v.lang})`));

    if (englishVoices.length === 0) {
      console.log("🗣️ TTS: No English voices found, using default");
      return null;
    }

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
        console.log(`🗣️ TTS: Selected preferred English voice: ${preferredVoice.name} (${preferredVoice.lang})`);
        return preferredVoice;
      }
    }

    // Prefer US English if available
    const usEnglish = englishVoices.find(voice => 
      voice.lang.toLowerCase().includes('en-us')
    );
    if (usEnglish) {
      console.log(`🗣️ TTS: Selected US English voice: ${usEnglish.name} (${usEnglish.lang})`);
      return usEnglish;
    }

    // Use first available English voice
    const selectedVoice = englishVoices[0];
    console.log(`🗣️ TTS: Selected first available English voice: ${selectedVoice.name} (${selectedVoice.lang})`);
    return selectedVoice;
  }, [availableVoices]);

  const speak = useCallback((text: string, _lang?: string) => {
    // Always force English pronunciation (ignore lang parameter)
    const forcedLang = 'en-US';
    console.log("🗣️ TTS: Attempting to speak:", text, "forced to English");
    
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

      // Always select best English voice
      const selectedVoice = selectBestEnglishVoice();
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(`🗣️ TTS: Using English voice: ${selectedVoice.name} (${selectedVoice.lang})`);
      } else {
        console.log(`🗣️ TTS: Using default voice, forced to English`);
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
      console.log("🗣️ TTS: Speech synthesis started with forced English");
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown speech error";
      console.error("🗣️ TTS Error:", errorMsg);
      setError(errorMsg);
      setIsLoading(false);
    }
  }, [selectBestEnglishVoice]);

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

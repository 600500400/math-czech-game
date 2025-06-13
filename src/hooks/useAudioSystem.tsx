
import { useState, useEffect, useCallback, useRef } from 'react';

interface AudioSettings {
  enabled: boolean;
  volume: number;
  soundEffects: boolean;
  voiceFeedback: boolean;
}

interface SoundEffects {
  correct: HTMLAudioElement | null;
  incorrect: HTMLAudioElement | null;
  gameStart: HTMLAudioElement | null;
  gameEnd: HTMLAudioElement | null;
  buttonClick: HTMLAudioElement | null;
  celebration: HTMLAudioElement | null;
}

export const useAudioSystem = () => {
  const [settings, setSettings] = useState<AudioSettings>({
    enabled: false,
    volume: 0.7,
    soundEffects: true,
    voiceFeedback: false
  });
  
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundsRef = useRef<SoundEffects>({
    correct: null,
    incorrect: null,
    gameStart: null,
    gameEnd: null,
    buttonClick: null,
    celebration: null
  });

  // Check for Web Audio API support
  useEffect(() => {
    const checkSupport = () => {
      const hasAudioContext = !!(window.AudioContext || (window as any).webkitAudioContext);
      const hasAudioElement = !!window.HTMLAudioElement;
      setIsSupported(hasAudioContext && hasAudioElement);
    };
    
    checkSupport();
  }, []);

  // Load audio settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('audioSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to parse audio settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  const updateSettings = useCallback((newSettings: Partial<AudioSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('audioSettings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Initialize audio context
  const initializeAudioContext = useCallback(async () => {
    if (!isSupported || audioContextRef.current) return;
    
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      
      // Resume context if suspended (required by some browsers)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
    } catch (error) {
      console.warn('Failed to initialize audio context:', error);
    }
  }, [isSupported]);

  // Create sound effects using Web Audio API
  const createTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!audioContextRef.current || !settings.enabled || !settings.soundEffects) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(settings.volume * 0.3, audioContextRef.current.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.warn('Failed to create tone:', error);
    }
  }, [settings.enabled, settings.soundEffects, settings.volume]);

  // Play success sound sequence
  const playCorrectSound = useCallback(() => {
    if (!settings.enabled || !settings.soundEffects) return;
    
    // Happy ascending chord
    setTimeout(() => createTone(523.25, 0.2), 0);     // C5
    setTimeout(() => createTone(659.25, 0.2), 100);   // E5
    setTimeout(() => createTone(783.99, 0.3), 200);   // G5
  }, [createTone, settings.enabled, settings.soundEffects]);

  // Play error sound
  const playIncorrectSound = useCallback(() => {
    if (!settings.enabled || !settings.soundEffects) return;
    
    // Descending disappointed sound
    setTimeout(() => createTone(400, 0.15, 'square'), 0);
    setTimeout(() => createTone(300, 0.2, 'square'), 150);
  }, [createTone, settings.enabled, settings.soundEffects]);

  // Play game start sound
  const playGameStartSound = useCallback(() => {
    if (!settings.enabled || !settings.soundEffects) return;
    
    // Uplifting start sequence
    setTimeout(() => createTone(261.63, 0.1), 0);     // C4
    setTimeout(() => createTone(329.63, 0.1), 120);   // E4
    setTimeout(() => createTone(392.00, 0.1), 240);   // G4
    setTimeout(() => createTone(523.25, 0.2), 360);   // C5
  }, [createTone, settings.enabled, settings.soundEffects]);

  // Play game end sound
  const playGameEndSound = useCallback(() => {
    if (!settings.enabled || !settings.soundEffects) return;
    
    // Completion fanfare
    setTimeout(() => createTone(523.25, 0.2), 0);     // C5
    setTimeout(() => createTone(659.25, 0.2), 200);   // E5
    setTimeout(() => createTone(783.99, 0.2), 400);   // G5
    setTimeout(() => createTone(1046.50, 0.4), 600);  // C6
  }, [createTone, settings.enabled, settings.soundEffects]);

  // Play button click sound
  const playButtonClickSound = useCallback(() => {
    if (!settings.enabled || !settings.soundEffects) return;
    
    createTone(800, 0.05, 'square');
  }, [createTone, settings.enabled, settings.soundEffects]);

  // Play celebration sound
  const playCelebrationSound = useCallback(() => {
    if (!settings.enabled || !settings.soundEffects) return;
    
    // Extended celebration sequence
    const notes = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, index) => {
      setTimeout(() => createTone(freq, 0.3), index * 150);
    });
  }, [createTone, settings.enabled, settings.soundEffects]);

  // Initialize audio system
  const enableAudio = useCallback(async () => {
    if (!isSupported) return false;
    
    setIsLoading(true);
    try {
      await initializeAudioContext();
      updateSettings({ enabled: true });
      playButtonClickSound(); // Test sound
      return true;
    } catch (error) {
      console.warn('Failed to enable audio:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, initializeAudioContext, updateSettings, playButtonClickSound]);

  // Disable audio system
  const disableAudio = useCallback(() => {
    updateSettings({ enabled: false });
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, [updateSettings]);

  return {
    // Settings
    settings,
    updateSettings,
    isSupported,
    isLoading,
    
    // Control
    enableAudio,
    disableAudio,
    
    // Sound effects
    playCorrectSound,
    playIncorrectSound,
    playGameStartSound,
    playGameEndSound,
    playButtonClickSound,
    playCelebrationSound,
  };
};

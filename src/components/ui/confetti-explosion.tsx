
import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  trigger?: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
}

export const ConfettiExplosion: React.FC<ConfettiProps> = ({
  trigger = false,
  duration = 3000,
  particleCount = 50,
  colors = ['#FFC700', '#FF0000', '#2E3191', '#41D3BD', '#FB5607']
}) => {
  const [particles, setParticles] = useState<JSX.Element[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!trigger) {
      setShowConfetti(false);
      setParticles([]);
      return;
    }

    // Only generate particles if not already showing
    if (!showConfetti) {
      setShowConfetti(true);
      const newParticles = [];
      
      for (let i = 0; i < particleCount; i++) {
        const style = {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          animationDuration: `${0.5 + Math.random() * 1}s`,
          animationDelay: `${Math.random() * 0.5}s`,
        };
        
        newParticles.push(
          <div
            key={`confetti-${i}-${Date.now()}`}
            className="absolute rounded-full w-2 h-2 opacity-0 animate-confetti"
            style={style}
          />
        );
      }
      
      setParticles(newParticles);
    }
    
    // Cleanup timer
    const timer = setTimeout(() => {
      setShowConfetti(false);
      setParticles([]);
    }, duration);
    
    return () => {
      clearTimeout(timer);
      setParticles([]);
    };
  }, [trigger, duration, particleCount, colors, showConfetti]);
  
  if (!showConfetti || particles.length === 0) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden" aria-hidden="true">
      {particles}
    </div>
  );
};

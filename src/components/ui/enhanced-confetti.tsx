
import React, { useEffect, useState } from 'react';

interface ParticleProps {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'triangle' | 'star';
  velocity: { x: number; y: number };
  rotation: number;
  rotationSpeed: number;
}

interface EnhancedConfettiProps {
  trigger?: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  intensity?: 'low' | 'medium' | 'high';
  shapes?: Array<'circle' | 'square' | 'triangle' | 'star'>;
  onComplete?: () => void;
}

export const EnhancedConfetti: React.FC<EnhancedConfettiProps> = ({
  trigger = false,
  duration = 3000,
  particleCount = 50,
  colors = ['#FFC700', '#FF0000', '#2E3191', '#41D3BD', '#FB5607', '#FF6B6B', '#4ECDC4', '#45B7D1'],
  intensity = 'medium',
  shapes = ['circle', 'square', 'triangle', 'star'],
  onComplete
}) => {
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const [isActive, setIsActive] = useState(false);

  const intensitySettings = {
    low: { count: particleCount * 0.5, speed: 0.5 },
    medium: { count: particleCount, speed: 1 },
    high: { count: particleCount * 1.5, speed: 1.5 }
  };

  const createParticle = (id: number): ParticleProps => {
    const setting = intensitySettings[intensity];
    return {
      id,
      x: Math.random() * window.innerWidth,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      velocity: {
        x: (Math.random() - 0.5) * 6 * setting.speed,
        y: Math.random() * 3 + 2 * setting.speed
      },
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10
    };
  };

  useEffect(() => {
    if (!trigger || isActive) return;

    setIsActive(true);
    const setting = intensitySettings[intensity];
    const newParticles = Array.from({ length: setting.count }, (_, i) => createParticle(i));
    setParticles(newParticles);

    const animationFrame = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          x: particle.x + particle.velocity.x,
          y: particle.y + particle.velocity.y,
          rotation: particle.rotation + particle.rotationSpeed,
          velocity: {
            ...particle.velocity,
            y: particle.velocity.y + 0.1 // gravity
          }
        })).filter(particle => particle.y < window.innerHeight + 20)
      );
    };

    const interval = setInterval(animationFrame, 16);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setParticles([]);
      setIsActive(false);
      onComplete?.();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [trigger, isActive, duration, intensity, onComplete]);

  const renderShape = (particle: ParticleProps) => {
    const style = {
      left: `${particle.x}px`,
      top: `${particle.y}px`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      backgroundColor: particle.color,
      transform: `rotate(${particle.rotation}deg)`,
      position: 'absolute' as const,
      pointerEvents: 'none' as const,
    };

    switch (particle.shape) {
      case 'circle':
        return (
          <div
            key={particle.id}
            style={{ ...style, borderRadius: '50%' }}
          />
        );
      case 'square':
        return (
          <div
            key={particle.id}
            style={style}
          />
        );
      case 'triangle':
        return (
          <div
            key={particle.id}
            style={{
              ...style,
              backgroundColor: 'transparent',
              borderLeft: `${particle.size/2}px solid transparent`,
              borderRight: `${particle.size/2}px solid transparent`,
              borderBottom: `${particle.size}px solid ${particle.color}`,
              width: 0,
              height: 0,
            }}
          />
        );
      case 'star':
        return (
          <div
            key={particle.id}
            style={{ ...style, backgroundColor: 'transparent' }}
            className="text-lg"
          >
            ⭐
          </div>
        );
      default:
        return null;
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map(renderShape)}
    </div>
  );
};

// Success Celebration Component
export const SuccessCelebration: React.FC<{
  show: boolean;
  onComplete?: () => void;
}> = ({ show, onComplete }) => {
  return (
    <>
      <EnhancedConfetti
        trigger={show}
        intensity="high"
        particleCount={100}
        duration={4000}
        colors={['#22c55e', '#16a34a', '#15803d', '#FFD700', '#FFA500']}
        onComplete={onComplete}
      />
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-[9998] pointer-events-none">
          <div className="bg-white/90 rounded-full p-8 shadow-xl animate-bounce">
            <div className="text-6xl">🎉</div>
          </div>
        </div>
      )}
    </>
  );
};

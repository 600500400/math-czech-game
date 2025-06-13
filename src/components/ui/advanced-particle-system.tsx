
import React, { useEffect, useState, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'diamond';
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface AdvancedParticleSystemProps {
  trigger?: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  shapes?: Array<'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'diamond'>;
  intensity?: 'low' | 'medium' | 'high' | 'extreme';
  pattern?: 'explosion' | 'fountain' | 'rain' | 'spiral' | 'burst';
  onComplete?: () => void;
  autoTrigger?: boolean;
}

export const AdvancedParticleSystem: React.FC<AdvancedParticleSystemProps> = ({
  trigger = false,
  duration = 4000,
  particleCount = 60,
  colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFC700', '#FF0000', '#2E3191', '#41D3BD', '#FB5607'],
  shapes = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'],
  intensity = 'medium',
  pattern = 'explosion',
  onComplete,
  autoTrigger = false
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  const intensitySettings = {
    low: { count: Math.floor(particleCount * 0.5), speed: 0.6, spread: 0.8 },
    medium: { count: particleCount, speed: 1, spread: 1 },
    high: { count: Math.floor(particleCount * 1.5), speed: 1.4, spread: 1.2 },
    extreme: { count: Math.floor(particleCount * 2), speed: 1.8, spread: 1.5 }
  };

  const createParticle = useCallback((id: number, centerX?: number, centerY?: number): Particle => {
    const setting = intensitySettings[intensity];
    const startX = centerX || window.innerWidth / 2;
    const startY = centerY || window.innerHeight / 2;
    
    let vx, vy;
    
    switch (pattern) {
      case 'fountain':
        vx = (Math.random() - 0.5) * 4 * setting.speed;
        vy = -(Math.random() * 6 + 3) * setting.speed;
        break;
      case 'rain':
        vx = (Math.random() - 0.5) * 2 * setting.speed;
        vy = Math.random() * 2 + 1 * setting.speed;
        break;
      case 'spiral':
        const angle = (id / setting.count) * Math.PI * 4;
        vx = Math.cos(angle) * 5 * setting.speed;
        vy = Math.sin(angle) * 5 * setting.speed;
        break;
      case 'burst':
        const burstAngle = Math.random() * Math.PI * 2;
        const burstSpeed = Math.random() * 8 + 4;
        vx = Math.cos(burstAngle) * burstSpeed * setting.speed;
        vy = Math.sin(burstAngle) * burstSpeed * setting.speed;
        break;
      default: // explosion
        vx = (Math.random() - 0.5) * 12 * setting.speed * setting.spread;
        vy = (Math.random() - 0.5) * 12 * setting.speed * setting.spread;
    }

    return {
      id,
      x: pattern === 'rain' ? Math.random() * window.innerWidth : startX,
      y: pattern === 'rain' ? -20 : startY,
      vx,
      vy,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      opacity: 1,
      life: duration,
      maxLife: duration
    };
  }, [intensity, pattern, colors, shapes, duration]);

  const renderParticleShape = useCallback((particle: Particle) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${particle.x}px`,
      top: `${particle.y}px`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      transform: `rotate(${particle.rotation}deg)`,
      opacity: particle.opacity,
      pointerEvents: 'none' as const,
      zIndex: 9999,
    };

    switch (particle.shape) {
      case 'circle':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              backgroundColor: particle.color,
              borderRadius: '50%',
              boxShadow: `0 0 ${particle.size}px ${particle.color}40`,
            }}
          />
        );
      
      case 'square':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              backgroundColor: particle.color,
              borderRadius: '2px',
              boxShadow: `0 0 ${particle.size/2}px ${particle.color}60`,
            }}
          />
        );
      
      case 'triangle':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              borderLeft: `${particle.size/2}px solid transparent`,
              borderRight: `${particle.size/2}px solid transparent`,
              borderBottom: `${particle.size}px solid ${particle.color}`,
              filter: `drop-shadow(0 0 ${particle.size/3}px ${particle.color})`,
            }}
          />
        );
      
      case 'star':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              fontSize: `${particle.size}px`,
              color: particle.color,
              textShadow: `0 0 ${particle.size/2}px ${particle.color}`,
            }}
          >
            ⭐
          </div>
        );
      
      case 'heart':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              fontSize: `${particle.size}px`,
              color: particle.color,
              textShadow: `0 0 ${particle.size/2}px ${particle.color}`,
            }}
          >
            ❤️
          </div>
        );
      
      case 'diamond':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              fontSize: `${particle.size}px`,
              color: particle.color,
              textShadow: `0 0 ${particle.size/2}px ${particle.color}`,
            }}
          >
            💎
          </div>
        );
      
      default:
        return null;
    }
  }, []);

  useEffect(() => {
    if ((!trigger && !autoTrigger) || isActive) return;

    setIsActive(true);
    const setting = intensitySettings[intensity];
    const newParticles = Array.from({ length: setting.count }, (_, i) => createParticle(i));
    setParticles(newParticles);

    const animationFrame = () => {
      setParticles(prevParticles => {
        return prevParticles.map(particle => {
          const newLife = particle.life - 16; // ~60fps
          const lifeRatio = newLife / particle.maxLife;
          
          return {
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + (pattern === 'fountain' || pattern === 'explosion' ? 0.15 : 0.05), // gravity
            rotation: particle.rotation + particle.rotationSpeed,
            opacity: Math.max(0, lifeRatio),
            life: newLife
          };
        }).filter(particle => particle.life > 0 && particle.y < window.innerHeight + 50);
      });
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
  }, [trigger, autoTrigger, isActive, duration, intensity, pattern, createParticle, onComplete]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 9999 }}>
      {particles.map(renderParticleShape)}
    </div>
  );
};

// Preset configurations for common use cases
export const SuccessParticles: React.FC<{ trigger: boolean; onComplete?: () => void }> = ({ trigger, onComplete }) => (
  <AdvancedParticleSystem
    trigger={trigger}
    pattern="burst"
    intensity="high"
    colors={['#22c55e', '#16a34a', '#15803d', '#FFD700', '#FFA500']}
    shapes={['star', 'heart', 'circle']}
    particleCount={80}
    duration={3000}
    onComplete={onComplete}
  />
);

export const ErrorParticles: React.FC<{ trigger: boolean; onComplete?: () => void }> = ({ trigger, onComplete }) => (
  <AdvancedParticleSystem
    trigger={trigger}
    pattern="fountain"
    intensity="medium"
    colors={['#ef4444', '#dc2626', '#b91c1c', '#FF6B6B']}
    shapes={['triangle', 'square']}
    particleCount={40}
    duration={2000}
    onComplete={onComplete}
  />
);

export const CelebrationParticles: React.FC<{ trigger: boolean; onComplete?: () => void }> = ({ trigger, onComplete }) => (
  <AdvancedParticleSystem
    trigger={trigger}
    pattern="explosion"
    intensity="extreme"
    colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFC700', '#FF0000', '#2E3191', '#41D3BD', '#FB5607']}
    shapes={['star', 'heart', 'diamond', 'circle']}
    particleCount={120}
    duration={5000}
    onComplete={onComplete}
  />
);

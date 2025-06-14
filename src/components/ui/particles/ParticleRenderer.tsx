
import React from 'react';
import { Particle } from './ParticleTypes';

export const renderParticleShape = (particle: Particle) => {
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
};

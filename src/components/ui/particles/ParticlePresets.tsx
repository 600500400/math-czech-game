
import React from 'react';
import { AdvancedParticleSystem } from './ParticleCore';

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

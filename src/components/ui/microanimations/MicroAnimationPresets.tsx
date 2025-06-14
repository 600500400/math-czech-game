
import React from 'react';
import { cn } from '@/lib/utils';
import { MicroAnimation } from './MicroAnimationCore';
import { 
  FloatingIconProps, 
  PulsingBadgeProps, 
  BouncingButtonProps, 
  GlowingElementProps 
} from './MicroAnimationTypes';

export const FloatingIcon: React.FC<FloatingIconProps> = ({ children, className }) => (
  <MicroAnimation animation="float" duration="slow" className={className}>
    {children}
  </MicroAnimation>
);

export const PulsingBadge: React.FC<PulsingBadgeProps> = ({ children, className }) => (
  <MicroAnimation animation="pulse" duration="normal" className={className}>
    {children}
  </MicroAnimation>
);

export const BouncingButton: React.FC<BouncingButtonProps> = ({ 
  children, 
  className, 
  onClick 
}) => (
  <button
    onClick={onClick}
    className={cn(
      'transition-all duration-200 hover:animate-bounce active:scale-95',
      className
    )}
  >
    {children}
  </button>
);

export const GlowingElement: React.FC<GlowingElementProps> = ({ 
  children, 
  className, 
  color = 'blue' 
}) => {
  const glowColors = {
    blue: 'shadow-blue-500/50',
    green: 'shadow-green-500/50',
    red: 'shadow-red-500/50',
    yellow: 'shadow-yellow-500/50',
    purple: 'shadow-purple-500/50'
  };

  return (
    <div
      className={cn(
        'animate-glow',
        glowColors[color],
        className
      )}
    >
      {children}
    </div>
  );
};

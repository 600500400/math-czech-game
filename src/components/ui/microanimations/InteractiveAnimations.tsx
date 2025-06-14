
import React from 'react';
import { cn } from '@/lib/utils';
import { HoverScaleProps, HoverGlowProps } from './MicroAnimationTypes';

export const HoverScale: React.FC<HoverScaleProps> = ({ 
  children, 
  className, 
  scale = 'md' 
}) => {
  const scales = {
    sm: 'hover:scale-[1.02]',
    md: 'hover:scale-105',
    lg: 'hover:scale-110'
  };

  return (
    <div
      className={cn(
        'transition-transform duration-300 ease-out cursor-pointer',
        scales[scale],
        className
      )}
    >
      {children}
    </div>
  );
};

export const HoverGlow: React.FC<HoverGlowProps> = ({ 
  children, 
  className, 
  color = '#3B82F6' 
}) => (
  <div
    className={cn(
      'transition-all duration-300 ease-out',
      'hover:drop-shadow-lg hover:brightness-110',
      className
    )}
    style={{
      filter: `drop-shadow(0 0 10px ${color}40)`
    }}
  >
    {children}
  </div>
);

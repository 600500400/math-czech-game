
import React from 'react';
import { cn } from '@/lib/utils';
import { MicroAnimationProps } from './MicroAnimationTypes';

export const MicroAnimation: React.FC<MicroAnimationProps> = ({
  children,
  className,
  animation = 'float',
  trigger = true,
  duration = 'normal',
  delay = 'none'
}) => {
  const animations = {
    float: 'animate-float',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    wiggle: 'animate-wiggle',
    glow: 'animate-glow',
    shake: 'animate-shake',
    heartbeat: 'animate-heartbeat'
  };

  const durations = {
    fast: 'animation-duration-[1s]',
    normal: 'animation-duration-[2s]',
    slow: 'animation-duration-[3s]'
  };

  const delays = {
    none: '',
    short: 'animation-delay-[0.2s]',
    medium: 'animation-delay-[0.5s]',
    long: 'animation-delay-[1s]'
  };

  return (
    <div
      className={cn(
        trigger && animations[animation],
        durations[duration],
        delays[delay],
        className
      )}
    >
      {children}
    </div>
  );
};

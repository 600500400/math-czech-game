
import React from 'react';
import { cn } from '@/lib/utils';

interface MicroAnimationProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'float' | 'pulse' | 'bounce' | 'wiggle' | 'glow' | 'shake' | 'heartbeat';
  trigger?: boolean;
  duration?: 'fast' | 'normal' | 'slow';
  delay?: 'none' | 'short' | 'medium' | 'long';
}

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

// Preset animated components
export const FloatingIcon: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <MicroAnimation animation="float" duration="slow" className={className}>
    {children}
  </MicroAnimation>
);

export const PulsingBadge: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <MicroAnimation animation="pulse" duration="normal" className={className}>
    {children}
  </MicroAnimation>
);

export const BouncingButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className, onClick }) => (
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

export const GlowingElement: React.FC<{
  children: React.ReactNode;
  className?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}> = ({ children, className, color = 'blue' }) => {
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

// Interactive hover animations
export const HoverScale: React.FC<{
  children: React.ReactNode;
  className?: string;
  scale?: 'sm' | 'md' | 'lg';
}> = ({ children, className, scale = 'md' }) => {
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

export const HoverGlow: React.FC<{
  children: React.ReactNode;
  className?: string;
  color?: string;
}> = ({ children, className, color = '#3B82F6' }) => (
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

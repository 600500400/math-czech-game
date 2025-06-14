
export interface MicroAnimationProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'float' | 'pulse' | 'bounce' | 'wiggle' | 'glow' | 'shake' | 'heartbeat';
  trigger?: boolean;
  duration?: 'fast' | 'normal' | 'slow';
  delay?: 'none' | 'short' | 'medium' | 'long';
}

export interface FloatingIconProps {
  children: React.ReactNode;
  className?: string;
}

export interface PulsingBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export interface BouncingButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface GlowingElementProps {
  children: React.ReactNode;
  className?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

export interface HoverScaleProps {
  children: React.ReactNode;
  className?: string;
  scale?: 'sm' | 'md' | 'lg';
}

export interface HoverGlowProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

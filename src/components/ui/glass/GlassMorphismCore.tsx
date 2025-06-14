
import React from 'react';
import { cn } from '@/lib/utils';
import { GlassMorphismProps } from './GlassTypes';

export const GlassMorphism: React.FC<GlassMorphismProps> = ({
  children,
  className,
  variant = 'light',
  blur = 'md',
  opacity = 0.1,
  border = true,
  shadow = true,
  rounded = 'lg'
}) => {
  const variantStyles = {
    light: 'bg-white/10 backdrop-blur-md',
    medium: 'bg-white/20 backdrop-blur-lg',
    dark: 'bg-black/20 backdrop-blur-md',
    colored: 'bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-lg'
  };

  const blurStyles = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md', 
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  const roundedStyles = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  return (
    <div
      className={cn(
        // Base glass morphism
        variantStyles[variant],
        blurStyles[blur],
        roundedStyles[rounded],
        // Border
        border && 'border border-white/20',
        // Shadow
        shadow && 'shadow-xl shadow-black/10',
        // Backdrop saturate for better glass effect
        'backdrop-saturate-150',
        className
      )}
      style={{ 
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
      }}
    >
      {children}
    </div>
  );
};

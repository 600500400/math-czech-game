
import React from 'react';
import { cn } from '@/lib/utils';
import { GlassMorphism } from './GlassMorphismCore';
import { GlassCardProps, GlassDialogProps, GlassButtonProps } from './GlassTypes';

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  hover = true 
}) => (
  <GlassMorphism
    variant="light"
    blur="lg"
    opacity={0.1}
    className={cn(
      'p-6 transition-all duration-300',
      hover && 'hover:bg-white/20 hover:scale-[1.02] hover:shadow-2xl',
      className
    )}
  >
    {children}
  </GlassMorphism>
);

export const GlassDialog: React.FC<GlassDialogProps> = ({ 
  children, 
  className 
}) => (
  <GlassMorphism
    variant="medium"
    blur="xl"
    opacity={0.15}
    border={true}
    shadow={true}
    rounded="xl"
    className={cn('border-2 border-white/30', className)}
  >
    {children}
  </GlassMorphism>
);

export const GlassButton: React.FC<GlassButtonProps> = ({ 
  children, 
  className, 
  onClick, 
  variant = 'primary' 
}) => {
  const variantColors = {
    primary: 'hover:bg-blue-500/20 border-blue-400/30',
    secondary: 'hover:bg-gray-500/20 border-gray-400/30',
    success: 'hover:bg-green-500/20 border-green-400/30',
    danger: 'hover:bg-red-500/20 border-red-400/30'
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative px-6 py-3 rounded-lg',
        'bg-white/10 backdrop-blur-md border border-white/20',
        'transition-all duration-300 ease-out',
        'hover:scale-105 hover:shadow-lg active:scale-95',
        'font-medium text-white',
        variantColors[variant],
        className
      )}
    >
      {children}
    </button>
  );
};

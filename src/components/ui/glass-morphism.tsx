
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassMorphismProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'medium' | 'dark' | 'colored';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  border?: boolean;
  shadow?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

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

// Preset glass components
export const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className, hover = true }) => (
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

export const GlassDialog: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
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

export const GlassButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
}> = ({ children, className, onClick, variant = 'primary' }) => {
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


import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface InteractiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "success" | "error" | "warning" | "magic";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  ripple?: boolean;
}

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  variant = "default",
  size = "md",
  icon: Icon,
  loading = false,
  children,
  className,
  ripple = true,
  onClick,
  ...props
}) => {
  const [isPressed, setIsPressed] = React.useState(false);
  const [rippleEffect, setRippleEffect] = React.useState<Array<{id: number, x: number, y: number}>>([]);

  const variants = {
    default: "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25",
    success: "bg-green-500 hover:bg-green-600 text-white hover:shadow-lg hover:shadow-green-500/25",
    error: "bg-red-500 hover:bg-red-600 text-white hover:shadow-lg hover:shadow-red-500/25",
    warning: "bg-orange-500 hover:bg-orange-600 text-white hover:shadow-lg hover:shadow-orange-500/25",
    magic: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      
      setRippleEffect(prev => [...prev, { id, x, y }]);
      
      setTimeout(() => {
        setRippleEffect(prev => prev.filter(ripple => ripple.id !== id));
      }, 600);
    }

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    if (onClick) onClick(e);
  };

  return (
    <button
      className={cn(
        "relative overflow-hidden rounded-lg font-medium transition-all duration-200 transform",
        "hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        variants[variant],
        sizes[size],
        isPressed && "scale-95",
        className
      )}
      onClick={handleClick}
      disabled={loading}
      {...props}
    >
      {/* Ripple Effects */}
      {rippleEffect.map(({ id, x, y }) => (
        <span
          key={id}
          className="absolute bg-white/30 rounded-full pointer-events-none animate-ping"
          style={{
            left: x - 10,
            top: y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}

      {/* Content */}
      <span className="relative flex items-center justify-center space-x-2">
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        )}
        {Icon && !loading && <Icon size={16} />}
        <span>{children}</span>
      </span>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
    </button>
  );
};


import { useState, useEffect, useRef } from "react";
import { Trophy, Heart } from "lucide-react";

interface FunGraphicsProps {
  isCorrect: boolean | null;
  showAnimation: boolean;
  animationId?: number;
  onForceCleanup?: (cleanupFn: () => void) => void;
}

export const FunGraphics = ({ 
  isCorrect, 
  showAnimation, 
  animationId = 0,
  onForceCleanup 
}: FunGraphicsProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear any existing timeout
  const clearExistingTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  
  // Force cleanup function
  const forceCleanup = () => {
    console.log("🎨 FunGraphics: Force cleanup called");
    clearExistingTimeout();
    setIsVisible(false);
  };
  
  // Register cleanup function with parent
  useEffect(() => {
    if (onForceCleanup) {
      onForceCleanup(forceCleanup);
    }
  }, [onForceCleanup]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearExistingTimeout();
    };
  }, []);
  
  // Main animation effect
  useEffect(() => {
    console.log("🎨 FunGraphics: Animation effect - showAnimation:", showAnimation, "isCorrect:", isCorrect);
    
    // Clear any existing timeout first
    clearExistingTimeout();
    
    // Hide immediately if animation should not show
    if (!showAnimation || isCorrect === null) {
      console.log("🎨 FunGraphics: Hiding animation immediately");
      setIsVisible(false);
      return;
    }
    
    // Show animation
    console.log("🎨 FunGraphics: Showing animation");
    setIsVisible(true);
    
    // Schedule hide after 600ms
    timeoutRef.current = setTimeout(() => {
      console.log("🎨 FunGraphics: Auto-hiding animation");
      setIsVisible(false);
      timeoutRef.current = null;
    }, 600);
    
  }, [isCorrect, showAnimation, animationId]);
  
  // Don't render anything if not visible or conditions not met
  if (!showAnimation || !isVisible || isCorrect === null) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[8000] flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className={`bg-white/95 rounded-xl shadow-lg p-6 border-2 ${isCorrect ? 'border-green-300 animate-bounce' : 'border-orange-300 animate-pulse'}`}>
          <div className="flex flex-col items-center gap-3">
            {isCorrect ? (
              <Trophy size={48} className="text-yellow-500" />
            ) : (
              <Heart size={48} className="text-red-400" />
            )}
            <p className={`text-2xl font-bold text-center ${isCorrect ? 'text-green-600' : 'text-orange-600'}`}>
              {isCorrect ? 'Výborně!' : 'Zkus to znovu!'}
            </p>
          </div>
        </div>
        
        {isCorrect && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-8 left-1/4 text-2xl animate-bounce">🎉</div>
            <div className="absolute top-16 right-1/4 text-2xl animate-bounce delay-150">⭐</div>
          </div>
        )}
      </div>
    </div>
  );
};

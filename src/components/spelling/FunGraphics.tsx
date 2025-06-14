
import { useState, useEffect, useRef } from "react";
import { Star, Trophy, Heart, Frown } from "lucide-react";

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
  const [currentAnimationId, setCurrentAnimationId] = useState(0);
  const mountedRef = useRef(true);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Force cleanup function
  const forceCleanup = () => {
    console.log("🎨 FunGraphics: Force cleanup called");
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }
    setIsVisible(false);
  };
  
  // Register cleanup function with parent
  useEffect(() => {
    if (onForceCleanup) {
      onForceCleanup(forceCleanup);
    }
  }, [onForceCleanup]);
  
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      forceCleanup();
    };
  }, []);
  
  useEffect(() => {
    console.log("🎨 FunGraphics: Animation change - showAnimation:", showAnimation, "isCorrect:", isCorrect, "animationId:", animationId);
    
    // Clear any existing cleanup timeout
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }
    
    // If animation should not show, hide immediately
    if (!showAnimation || !mountedRef.current || isCorrect === null) {
      console.log("🎨 FunGraphics: Hiding animation immediately");
      setIsVisible(false);
      return;
    }
    
    // Show animation
    setCurrentAnimationId(animationId);
    setIsVisible(true);
    
    // Schedule automatic cleanup - reduced timeout
    cleanupTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        console.log("🎨 FunGraphics: Auto-cleanup for animation ID:", animationId);
        setIsVisible(false);
      }
    }, 800); // Reduced from 1000 to 800ms for faster cleanup
    
  }, [isCorrect, showAnimation, animationId]);
  
  // Don't render if not visible or should not show
  if (!showAnimation || !isVisible || isCorrect === null) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[8500] flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        
        {/* Simple feedback with icon and text */}
        <div className={`${isCorrect ? 'animate-bounce' : 'animate-pulse'} bg-white/95 rounded-xl shadow-lg p-6 border-2 ${isCorrect ? 'border-green-300' : 'border-orange-300'}`}>
          <div className="flex flex-col items-center gap-3">
            {/* Icon */}
            <div className="flex justify-center">
              {isCorrect ? (
                <Trophy size={48} className="text-yellow-500 animate-pulse" />
              ) : (
                <Heart size={48} className="text-red-400 animate-pulse" />
              )}
            </div>
            
            {/* Text */}
            <p className={`text-2xl font-bold text-center ${isCorrect ? 'text-green-600' : 'text-orange-600'}`}>
              {isCorrect ? 'Výborně!' : 'Zkus to znovu!'}
            </p>
          </div>
        </div>
        
        {/* Simple celebration for correct answers - reduced number of elements */}
        {isCorrect && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-8 left-1/4 text-2xl animate-bounce">🎉</div>
            <div className="absolute top-16 right-1/4 text-2xl animate-bounce delay-150">⭐</div>
            <div className="absolute bottom-20 left-1/3 text-2xl animate-bounce delay-300">🏆</div>
          </div>
        )}
      </div>
    </div>
  );
};

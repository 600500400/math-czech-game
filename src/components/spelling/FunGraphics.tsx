
import { useState, useEffect, useRef } from "react";
import { Star, Trophy, Award, Gift, Smile, HeartIcon as Heart } from "lucide-react";

interface FunGraphicsProps {
  isCorrect: boolean | null;
  showAnimation: boolean;
}

export const FunGraphics = ({ isCorrect, showAnimation }: FunGraphicsProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showIcon, setShowIcon] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const mountedRef = useRef(true);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    console.log("🎨 FunGraphics: Animation state changed - showAnimation:", showAnimation, "isCorrect:", isCorrect);
    
    // Clear any existing cleanup timeout
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }
    
    // Reset state immediately if animation should not show
    if (!showAnimation) {
      console.log("🎨 FunGraphics: Hiding animation and resetting state");
      setIsVisible(false);
      setImageSrc(null);
      setShowIcon(false);
      return;
    }
    
    // Only proceed if component is still mounted and we should show animation
    if (!mountedRef.current) return;
    
    console.log("🎨 FunGraphics: Starting animation setup");
    setIsVisible(true);
    
    // Show icon with 50% probability
    const shouldShowIcon = Math.random() > 0.5;
    setShowIcon(shouldShowIcon);
    
    // Choose a random image based on the result
    if (isCorrect === true) {
      const correctImages = [
        "/images/happy-kid.png",
        "/images/stars.png",
        "/images/correct-answer.png", 
        "/images/thumbs-up.png",
        "/images/celebration.png"
      ];
      setImageSrc(correctImages[Math.floor(Math.random() * correctImages.length)]);
    } else if (isCorrect === false) {
      const wrongImages = [
        "/images/try-again.png",
        "/images/incorrect-answer.png",
        "/images/thinking-face.png"
      ];
      setImageSrc(wrongImages[Math.floor(Math.random() * wrongImages.length)]);
    }
    
    // Schedule cleanup after a reasonable time
    cleanupTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        console.log("🎨 FunGraphics: Auto-cleanup triggered");
        setIsVisible(false);
        setImageSrc(null);
        setShowIcon(false);
      }
    }, 3000); // Slightly longer than the expected animation duration
    
  }, [isCorrect, showAnimation]);
  
  // Don't render anything if not visible or animation should not show
  if (!showAnimation || !isVisible) {
    return null;
  }

  // Icon selection based on correct/wrong answer
  const renderIcon = () => {
    if (!showIcon) return null;
    
    const iconSize = 40;
    const iconClass = "transition-all duration-500";
    
    if (isCorrect) {
      const icons = [
        <Trophy key="trophy" size={iconSize} className={`${iconClass} text-yellow-500 animate-pulse`} />,
        <Star key="star" size={iconSize} className={`${iconClass} text-yellow-400 animate-bounce`} />,
        <Award key="award" size={iconSize} className={`${iconClass} text-blue-500 animate-pulse`} />,
        <Gift key="gift" size={iconSize} className={`${iconClass} text-pink-500 animate-bounce`} />,
        <Smile key="smile" size={iconSize} className={`${iconClass} text-green-500 animate-pulse`} />
      ];
      return icons[Math.floor(Math.random() * icons.length)];
    } else {
      return <Heart size={iconSize} className={`${iconClass} text-red-400 animate-pulse`} />;
    }
  };
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        {/* Image or text feedback */}
        {imageSrc && (
          <div className={`${isCorrect ? 'animate-bounce' : 'animate-pulse'} bg-white/90 rounded-lg shadow-md p-3`}>
            <img 
              src={imageSrc} 
              alt={isCorrect ? "Super!" : "Zkus to znovu"} 
              className="h-32 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                console.log(`🎨 FunGraphics: Image failed to load: ${target.src}`);
                target.style.display = "none";
                
                // Create text element instead
                const parent = target.parentElement;
                if (parent && mountedRef.current) {
                  const textEl = document.createElement("div");
                  textEl.className = "text-3xl font-bold text-center";
                  textEl.textContent = isCorrect ? "Super!" : "Zkus to znovu";
                  parent.appendChild(textEl);
                }
              }}
            />
          </div>
        )}
        
        {/* Icon display */}
        <div className={`flex justify-center mt-4 transition-all duration-300 ${showIcon ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
          {renderIcon()}
        </div>
        
        {/* Text feedback when no image is shown */}
        {isCorrect !== null && !imageSrc && (
          <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg">
            <p className={`text-2xl font-bold text-center animate-fade-in ${isCorrect ? 'text-green-600' : 'text-orange-600'}`}>
              {isCorrect ? 'Výborně!' : 'Ještě to zkus!'}
            </p>
          </div>
        )}
      </div>
      
      {/* Flying emojis */}
      {isCorrect && isVisible && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <span className="absolute animate-[fade-in_1s] top-0 left-1/4 text-4xl">🎉</span>
          <span className="absolute animate-[fade-in_1s] delay-75 bottom-0 left-1/3 text-4xl">⭐</span>
          <span className="absolute animate-[fade-in_1s] delay-100 top-8 right-1/4 text-4xl">🌟</span>
          <span className="absolute animate-[fade-in_1s] delay-150 bottom-1 right-1/3 text-4xl">🏆</span>
        </div>
      )}
    </div>
  );
};

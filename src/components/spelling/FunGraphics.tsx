
import { useState, useEffect } from "react";
import { Star, Trophy, Award, Gift, Smile, HeartIcon as Heart } from "lucide-react";

interface FunGraphicsProps {
  isCorrect: boolean | null;
  showAnimation: boolean;
}

export const FunGraphics = ({ isCorrect, showAnimation }: FunGraphicsProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showIcon, setShowIcon] = useState(false);
  
  useEffect(() => {
    // Reset image if animation is not active
    if (!showAnimation) {
      setImageSrc(null);
      setShowIcon(false);
      return;
    }
    
    // Show icon with 50% probability
    const shouldShowIcon = Math.random() > 0.5;
    setShowIcon(shouldShowIcon);
    
    // Choose a random image based on the result
    if (isCorrect === true) {
      // Updated correct images with direct local paths ensuring they work
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
  }, [isCorrect, showAnimation]);
  
  if (!showAnimation) return null;

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
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-100 space-y-4">
        {imageSrc && (
          <div className={`${isCorrect ? 'animate-bounce' : 'animate-pulse'} bg-white/90 rounded-lg shadow-md p-3`}>
            <img 
              src={imageSrc} 
              alt={isCorrect ? "Super!" : "Zkus to znovu"} 
              className="h-32 object-contain"
              onError={(e) => {
                // Fallback image if the original doesn't load
                const target = e.target as HTMLImageElement;
                console.log(`Image failed to load: ${target.src}`);
                target.src = isCorrect ? "/images/stars.png" : "/images/try-again.png";
                // If fallback also fails, show text
                target.onerror = () => {
                  const parent = target.parentElement;
                  if (parent) {
                    target.style.display = "none";
                    const textEl = document.createElement("div");
                    textEl.className = "text-3xl font-bold text-center";
                    textEl.textContent = isCorrect ? "Super!" : "Zkus to znovu";
                    parent.appendChild(textEl);
                  }
                };
              }}
            />
          </div>
        )}
        
        {/* Icon display */}
        <div className={`flex justify-center transition-all duration-300 ${showIcon ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
          {renderIcon()}
        </div>
        
        {/* Text feedback - now in a fixed position */}
        {isCorrect !== null && !imageSrc && (
          <p className={`text-2xl font-bold text-center animate-fade-in bg-white/90 px-4 py-2 rounded-full shadow-lg ${isCorrect ? 'text-green-600' : 'text-orange-600'}`}>
            {isCorrect ? 'Výborně!' : 'Ještě to zkus!'}
          </p>
        )}
        
        {/* Flying emojis now contained within the centered div */}
        {isCorrect && showAnimation && (
          <div className="absolute w-full h-full overflow-hidden">
            <span className="absolute animate-[fade-in_1s] top-0 left-1/4 text-4xl">🎉</span>
            <span className="absolute animate-[fade-in_1s] delay-75 bottom-0 left-1/3 text-4xl">⭐</span>
            <span className="absolute animate-[fade-in_1s] delay-100 top-8 right-1/4 text-4xl">🌟</span>
            <span className="absolute animate-[fade-in_1s] delay-150 bottom-1 right-1/3 text-4xl">🏆</span>
          </div>
        )}
      </div>
    </div>
  );
};


import { useState, useEffect } from "react";

interface FunGraphicsProps {
  isCorrect: boolean | null;
  showAnimation: boolean;
}

export const FunGraphics = ({ isCorrect, showAnimation }: FunGraphicsProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  useEffect(() => {
    // Reset image if animation is not active
    if (!showAnimation) {
      setImageSrc(null);
      return;
    }
    
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
  }, [isCorrect, showAnimation]);
  
  if (!imageSrc || !showAnimation) return null;
  
  return (
    <div className={`flex justify-center my-4 transition-opacity duration-500 ${showAnimation ? 'opacity-100' : 'opacity-0'}`}>
      <img 
        src={imageSrc} 
        alt={isCorrect ? "Super!" : "Zkus to znovu"} 
        className={`h-32 object-contain ${isCorrect ? 'animate-bounce' : 'animate-pulse'}`}
      />
    </div>
  );
};

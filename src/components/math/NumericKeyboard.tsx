
import { Button } from "@/components/ui/button";
import { Keyboard, Plus, Minus, Divide, X as Multiply } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NumericKeyboardProps {
  onKeyPress: (key: string) => void;
  onClear: () => void;
  onSubmit: () => void;
}

const NumericKeyboard = ({ onKeyPress, onClear, onSubmit }: NumericKeyboardProps) => {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(isMobile); // Na mobilu zobrazit defaultně

  const toggleKeyboard = () => {
    setIsVisible(prev => !prev);
  };

  return (
    <div className="w-full">
      {!isMobile && (
        <div className="flex justify-center mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleKeyboard}
            className="flex items-center gap-1"
          >
            <Keyboard size={16} />
            {isVisible ? "Skrýt klávesnici" : "Zobrazit klávesnici"}
          </Button>
        </div>
      )}

      {isVisible && (
        <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-md">
          <div className="grid grid-cols-3 gap-2 mb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <Button
                key={num}
                variant="outline"
                onClick={() => onKeyPress(num.toString())}
                className="h-12 text-lg font-medium hover:bg-gray-100 active:bg-gray-200 touch-manipulation"
              >
                {num}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => onKeyPress("0")}
              className="h-12 text-lg font-medium hover:bg-gray-100 active:bg-gray-200 touch-manipulation"
            >
              0
            </Button>
            <Button
              variant="outline"
              onClick={() => onKeyPress(".")}
              className="h-12 text-lg font-medium hover:bg-gray-100 active:bg-gray-200 touch-manipulation"
            >
              .
            </Button>
            <Button
              variant="outline"
              onClick={onClear}
              className="h-12 text-lg font-medium hover:bg-gray-100 active:bg-gray-200 text-red-500 touch-manipulation"
            >
              C
            </Button>
          </div>
          <Button
            onClick={onSubmit}
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 h-12 text-lg touch-manipulation"
          >
            Odpovědět
          </Button>
        </div>
      )}
    </div>
  );
};

export default NumericKeyboard;


import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMobileInteractions } from "@/hooks/useMobileInteractions";

interface NumericKeyboardProps {
  onKeyPress: (key: string) => void;
  onClear: () => void;
  onSubmit: () => void;
}

const NumericKeyboard = ({ onKeyPress, onClear, onSubmit }: NumericKeyboardProps) => {
  const isMobile = useIsMobile();
  const { triggerTapHaptic } = useMobileInteractions();

  const handleKeyPress = (key: string) => {
    triggerTapHaptic();
    onKeyPress(key);
  };

  const handleClear = () => {
    triggerTapHaptic();
    onClear();
  };

  const handleSubmit = () => {
    triggerTapHaptic();
    onSubmit();
  };

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'], 
    ['7', '8', '9'],
    ['Clear', '0', 'Enter']
  ];

  return (
    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
      {keys.flat().map((key) => {
        if (key === 'Clear') {
          return (
            <Button
              key={key}
              onClick={handleClear}
              variant="outline"
              className={`bg-red-50 hover:bg-red-100 active:bg-red-200 border-red-200 text-red-700 font-medium touch-manipulation transform active:scale-95 transition-all duration-150 ${isMobile ? 'h-14 text-lg' : 'h-12'}`}
            >
              ⌫
            </Button>
          );
        }
        
        if (key === 'Enter') {
          return (
            <Button
              key={key}
              onClick={handleSubmit}
              className={`bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-medium touch-manipulation transform active:scale-95 transition-all duration-150 ${isMobile ? 'h-14 text-lg' : 'h-12'}`}
            >
              ✓
            </Button>
          );
        }
        
        return (
          <Button
            key={key}
            onClick={() => handleKeyPress(key)}
            variant="outline"
            className={`bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border-blue-200 text-blue-800 font-semibold touch-manipulation transform active:scale-95 transition-all duration-150 ${isMobile ? 'h-14 text-xl' : 'h-12 text-lg'}`}
          >
            {key}
          </Button>
        );
      })}
    </div>
  );
};

export default NumericKeyboard;

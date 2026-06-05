import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMobileInteractions } from "@/hooks/useMobileInteractions";
import { Delete, CornerDownLeft } from "lucide-react";

interface NumericKeyboardProps {
  onKeyPress: (key: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const NumericKeyboard = ({ onKeyPress, onClear, onSubmit, disabled = false }: NumericKeyboardProps) => {
  const isMobile = useIsMobile();
  const { triggerTapHaptic } = useMobileInteractions({ hapticsEnabled: true, preventZoom: true });

  const handleKeyPress = (key: string) => {
    triggerTapHaptic();
    onKeyPress(key);
  };

  const handleClear = () => {
    triggerTapHaptic();
    onClear();
  };

  const handleSubmit = () => {
    if (!disabled) {
      triggerTapHaptic();
      onSubmit();
    }
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Clear", "0", "Enter"];
  const sizeClass = isMobile ? "h-14 text-xl" : "h-12 text-lg";

  return (
    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
      {keys.map((key) => {
        if (key === "Clear") {
          return (
            <Button
              key={key}
              onClick={handleClear}
              variant="ghost"
              className={`bg-white/5 border border-white/10 text-white/80 hover:bg-destructive/15 hover:text-destructive font-medium touch-manipulation transform active:scale-95 transition-all duration-150 ${sizeClass}`}
              aria-label="Smazat"
            >
              <Delete className="h-5 w-5" />
            </Button>
          );
        }

        if (key === "Enter") {
          return (
            <Button
              key={key}
              onClick={handleSubmit}
              disabled={disabled}
              className={`${
                disabled
                  ? "bg-white/5 text-white/30 cursor-not-allowed"
                  : "bg-gradient-to-br from-sunset-orange to-sunset-amber text-white shadow-lg shadow-sunset-orange/30 hover:brightness-110"
              } font-semibold touch-manipulation transform active:scale-95 transition-all duration-150 ${sizeClass}`}
              aria-label="Odeslat"
            >
              <CornerDownLeft className="h-5 w-5" />
            </Button>
          );
        }

        return (
          <Button
            key={key}
            onClick={() => handleKeyPress(key)}
            variant="ghost"
            className={`bg-white/5 border border-white/10 text-white hover:bg-white/10 font-semibold touch-manipulation transform active:scale-95 transition-all duration-150 ${sizeClass}`}
          >
            {key}
          </Button>
        );
      })}
    </div>
  );
};

export default NumericKeyboard;


import { AlertTriangle } from "lucide-react";

const EmptyStatisticsState = () => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <p className="text-center text-gray-500">Zatím nemáte žádné statistiky. Zahrajte si hru!</p>
      
      <div className="flex flex-col items-center gap-2">
        <p className="text-amber-600 text-xs text-center mt-1 max-w-sm">
          <AlertTriangle className="h-3 w-3 inline mr-1" />
          Všechny statistiky jsou ukládány lokálně v zařízení.
        </p>
      </div>
    </div>
  );
};

export default EmptyStatisticsState;

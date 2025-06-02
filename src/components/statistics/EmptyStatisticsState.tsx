
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const EmptyStatisticsState = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col gap-4 items-center">
      <p className="text-center text-gray-500">{t('statistics.noData')}</p>
      
      <div className="flex flex-col items-center gap-2">
        <p className="text-amber-600 text-xs text-center mt-1 max-w-sm">
          <AlertTriangle className="h-3 w-3 inline mr-1" />
          {t('statistics.warning')}
        </p>
      </div>
    </div>
  );
};

export default EmptyStatisticsState;

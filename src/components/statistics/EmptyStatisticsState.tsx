
import { AlertTriangle, User } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";

const EmptyStatisticsState = () => {
  const { t } = useLanguage();
  const { authState } = useAuth();
  
  // Check if user is a guest (local user)
  const isGuest = authState.profile?.username === t('user.guest') || 
                 localStorage.getItem('localUser') !== null;
  
  return (
    <div className="flex flex-col gap-6 items-center py-8">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
        <User className="h-10 w-10 text-gray-400" />
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {t('statistics.noData')}
        </h3>
        <p className="text-gray-500">
          Začněte hrát a vaše výsledky se zde zobrazí!
        </p>
      </div>
      
      <div className="flex flex-col items-center gap-2 max-w-sm">
        <div className="flex items-center gap-2 text-amber-600 text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>
            {isGuest ? t('statistics.cloudWarning') : t('statistics.warning')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmptyStatisticsState;

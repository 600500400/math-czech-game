
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

interface GuestModeSectionProps {
  onGuestMode: () => void;
  authLoading: boolean;
}

const GuestModeSection = ({ onGuestMode, authLoading }: GuestModeSectionProps) => {
  const { t } = useLanguage();

  return (
    <div className="pt-4 border-t">
      <div className="text-center space-y-2">
        <p className="text-xs text-gray-500">{t('auth.guestModeDescription')}</p>
        <Button
          variant="outline"
          onClick={onGuestMode}
          className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
          disabled={authLoading}
        >
          {t('auth.continueAsGuest')}
        </Button>
      </div>
    </div>
  );
};

export default GuestModeSection;


import { FloatingIcon } from "@/components/ui/microanimations";
import { useLanguage } from "@/hooks/useLanguage";

interface SpellingPracticeHeaderProps {
  theme: {
    avatar: string;
  };
  getGradientClasses: {
    primary: string;
  };
}

export const SpellingPracticeHeader = ({ 
  theme, 
  getGradientClasses 
}: SpellingPracticeHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center">
      <h1 
        className={`text-3xl font-bold bg-gradient-to-r ${getGradientClasses.primary} bg-clip-text text-transparent`}
      >
        {t('spelling.practiceTitle')} {theme.avatar}
      </h1>
    </div>
  );
};


import React from "react";
import { useLanguage } from "@/hooks/useLanguage";

interface MathPracticeHeaderProps {
  theme: any;
  getGradientClasses: any;
}

export const MathPracticeHeader: React.FC<MathPracticeHeaderProps> = ({
  theme,
  getGradientClasses
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {t('math.practiceTitle')} {theme.avatar}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        {t('math.practiceDescription')}
      </p>
    </div>
  );
};

import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { t } = useTranslation();

  return {
    t,
    currentLanguage: 'cs' as const,
    isCzech: true,
    isEnglish: false
  };
};
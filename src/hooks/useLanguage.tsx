
import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (language: 'cs' | 'en') => {
    i18n.changeLanguage(language);
  };

  const currentLanguage = i18n.language as 'cs' | 'en';

  return {
    t,
    currentLanguage,
    changeLanguage,
    isCzech: currentLanguage === 'cs',
    isEnglish: currentLanguage === 'en'
  };
};

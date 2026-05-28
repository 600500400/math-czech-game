
import { APP_VERSION } from "@/utils/version";

import { logger } from "@/utils/logger";
const AppFooter = () => {
  const handleVersionClick = () => {
    logger.log('📋 Debug informace:');
    logger.log(`Verze: ${APP_VERSION.getFullVersionWithBuild()}`);
    logger.log(`Build datum: ${APP_VERSION.getBuildDate()}`);
    logger.log(`Poslední aktualizace: ${localStorage.getItem('app_last_update') || 'neznámá'}`);
  };

  return (
    <footer className="w-full max-w-md mx-auto mt-8 mb-4 text-center">
      <div className="flex justify-center items-center text-xs text-gray-500 space-x-2">
        <span 
          onClick={handleVersionClick}
          className="cursor-pointer hover:text-blue-500 transition-colors"
          title="Klikněte pro debug informace"
        >
          v{APP_VERSION.getFullVersion()}
        </span>
        <span>•</span>
        <span className="text-gray-400">
          Build {new Date(APP_VERSION.build).toLocaleDateString('cs-CZ')}
        </span>
      </div>
    </footer>
  );
};

export default AppFooter;


// Automatické verzování aplikace s dynamickým build timestampem
export const APP_VERSION = {
  major: 1,
  minor: 2,
  patch: 4,
  build: import.meta.env.VITE_BUILD_TIME || Date.now(),
  getBuildDate: () => new Date(APP_VERSION.build).toISOString(),
  getFullVersion: () => `${APP_VERSION.major}.${APP_VERSION.minor}.${APP_VERSION.patch}`,
  getFullVersionWithBuild: () => `${APP_VERSION.getFullVersion()}-${APP_VERSION.build}`,
  logVersion: () => {
    console.log(`🚀 Aplikace verze: ${APP_VERSION.getFullVersion()}`);
    console.log(`📅 Build: ${APP_VERSION.getBuildDate()}`);
  },
  // Inicializace verzování - zavolá se pouze když je potřeba
  initializeVersioning: () => {
    try {
      const previousVersion = localStorage.getItem('app_version');
      const currentVersion = APP_VERSION.getFullVersion();
      
      if (previousVersion !== currentVersion) {
        console.log(`🔄 Aktualizace z verze ${previousVersion || 'neznámá'} na ${currentVersion}`);
        localStorage.setItem('app_version', currentVersion);
        localStorage.setItem('app_last_update', new Date().toISOString());
      }
      
      APP_VERSION.logVersion();
    } catch (error) {
      console.warn('Nelze uložit verzi do localStorage:', error);
    }
  }
};

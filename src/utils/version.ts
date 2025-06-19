
// Automatické verzování aplikace
export const APP_VERSION = {
  major: 1,
  minor: 2,
  patch: 3,
  build: Date.now(),
  getBuildDate: () => new Date().toISOString(),
  getFullVersion: () => `${APP_VERSION.major}.${APP_VERSION.minor}.${APP_VERSION.patch}`,
  getFullVersionWithBuild: () => `${APP_VERSION.getFullVersion()}-${APP_VERSION.build}`,
  logVersion: () => {
    console.log(`🚀 Aplikace verze: ${APP_VERSION.getFullVersion()}`);
    console.log(`📅 Build: ${APP_VERSION.getBuildDate()}`);
  }
};

// Při načtení aplikace
APP_VERSION.logVersion();

// Uložení verze do localStorage pro tracking
try {
  const previousVersion = localStorage.getItem('app_version');
  const currentVersion = APP_VERSION.getFullVersion();
  
  if (previousVersion !== currentVersion) {
    console.log(`🔄 Aktualizace z verze ${previousVersion || 'neznámá'} na ${currentVersion}`);
    localStorage.setItem('app_version', currentVersion);
    localStorage.setItem('app_last_update', new Date().toISOString());
  }
} catch (error) {
  console.warn('Nelze uložit verzi do localStorage:', error);
}

import { logger } from "@/utils/logger";
interface OfflineAction {
  id: string;
  type: 'game_result' | 'user_setting' | 'achievement';
  data: any;
  timestamp: number;
  retryCount: number;
}

class OfflineManager {
  private offlineQueue: OfflineAction[] = [];
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;
  private readonly STORAGE_KEY = 'procvicka_offline_queue';
  private readonly MAX_RETRIES = 3;

  constructor() {
    this.loadQueueFromStorage();
    this.setupEventListeners();
    this.registerBackgroundSync();
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      logger.log('🌐 Připojení obnoveno - spouštím synchronizaci');
      this.isOnline = true;
      this.processOfflineQueue();
    });

    window.addEventListener('offline', () => {
      logger.log('📴 Připojení ztraceno - přepínám do offline režimu');
      this.isOnline = false;
    });

    // Periodic sync attempt when online
    setInterval(() => {
      if (this.isOnline && this.offlineQueue.length > 0 && !this.syncInProgress) {
        this.processOfflineQueue();
      }
    }, 30000); // Every 30 seconds
  }

  private registerBackgroundSync() {
    if ('serviceWorker' in navigator && 'ServiceWorkerRegistration' in window) {
      navigator.serviceWorker.ready.then(registration => {
        // Check if sync is supported
        if ('sync' in registration) {
          return (registration as any).sync.register('sync-game-data');
        }
      }).catch(error => {
        console.warn('Background sync registration failed:', error);
      });
    }
  }

  private loadQueueFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.offlineQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
      this.offlineQueue = [];
    }
  }

  private saveQueueToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.offlineQueue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  public addToQueue(type: OfflineAction['type'], data: any): string {
    const action: OfflineAction = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };

    this.offlineQueue.push(action);
    this.saveQueueToStorage();

    logger.log(`📝 Přidána offline akce: ${type}`, data);

    // Try to sync immediately if online
    if (this.isOnline) {
      this.processOfflineQueue();
    }

    return action.id;
  }

  private async processOfflineQueue() {
    if (this.syncInProgress || this.offlineQueue.length === 0) {
      return;
    }

    this.syncInProgress = true;
    logger.log(`🔄 Synchronizuji ${this.offlineQueue.length} offline akcí...`);

    const actionsToProcess = [...this.offlineQueue];
    const failedActions: OfflineAction[] = [];

    for (const action of actionsToProcess) {
      try {
        await this.syncAction(action);
        logger.log(`✅ Synchronizována akce: ${action.type}`);
        
        // Remove successful action from queue
        this.offlineQueue = this.offlineQueue.filter(a => a.id !== action.id);
      } catch (error) {
        console.error(`❌ Selhala synchronizace akce ${action.type}:`, error);
        
        action.retryCount++;
        if (action.retryCount < this.MAX_RETRIES) {
          failedActions.push(action);
        } else {
          console.warn(`🗑️ Odstraňuję akci po ${this.MAX_RETRIES} neúspěšných pokusech:`, action);
        }
      }
    }

    // Keep only failed actions that haven't exceeded retry limit
    this.offlineQueue = failedActions;
    this.saveQueueToStorage();
    this.syncInProgress = false;

    if (this.offlineQueue.length === 0) {
      logger.log('✅ Všechny offline akce synchronizovány');
    } else {
      logger.log(`⏳ Zbývá synchronizovat ${this.offlineQueue.length} akcí`);
    }
  }

  private async syncAction(action: OfflineAction): Promise<void> {
    switch (action.type) {
      case 'game_result':
        return this.syncGameResult(action.data);
      case 'user_setting':
        return this.syncUserSetting(action.data);
      case 'achievement':
        return this.syncAchievement(action.data);
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private async syncGameResult(data: any): Promise<void> {
    // This would integrate with your actual API
    logger.log('Syncing game result:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  private async syncUserSetting(data: any): Promise<void> {
    logger.log('Syncing user setting:', data);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  private async syncAchievement(data: any): Promise<void> {
    logger.log('Syncing achievement:', data);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  public getQueueStatus() {
    return {
      pendingActions: this.offlineQueue.length,
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress,
      actions: this.offlineQueue.map(action => ({
        id: action.id,
        type: action.type,
        timestamp: action.timestamp,
        retryCount: action.retryCount
      }))
    };
  }

  public clearQueue() {
    this.offlineQueue = [];
    this.saveQueueToStorage();
    logger.log('🗑️ Offline fronta vyčištěna');
  }

  public forceSync() {
    if (this.isOnline) {
      logger.log('🔄 Vynucená synchronizace...');
      this.processOfflineQueue();
    } else {
      console.warn('⚠️ Nelze synchronizovat - není připojení');
    }
  }
}

// Export singleton instance
export const offlineManager = new OfflineManager();

// Export utility functions
export const addOfflineAction = (type: OfflineAction['type'], data: any) => 
  offlineManager.addToQueue(type, data);

export const getOfflineStatus = () => 
  offlineManager.getQueueStatus();

export const forceSyncOfflineData = () => 
  offlineManager.forceSync();

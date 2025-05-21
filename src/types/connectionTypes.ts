
export type ConnectionStatus = "checking" | "connected" | "disconnected" | "error";

export type ConnectionHistoryEntry = {
  time: number;
  success: boolean;
};

export interface ConnectionState {
  status: ConnectionStatus;
  isLocalMode: boolean;
  isRefreshing: boolean;
  retryCount: number;
  lastCheckTime: number;
  connectionHistory: ConnectionHistoryEntry[];
}

export interface ConnectionHookResult {
  dbConnectionStatus: ConnectionStatus;
  isLocalStorageMode: boolean;
  isRefreshing: boolean;
  handleRefreshData: () => Promise<void>;
  checkConnection: (forceCheck?: boolean) => Promise<any>;
  retryCount: number;
  connectionStatus: string;
}

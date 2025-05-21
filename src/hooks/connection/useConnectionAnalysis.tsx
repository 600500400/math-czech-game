
import { ConnectionHistoryEntry } from "@/types/connectionTypes";

export const useConnectionAnalysis = (connectionHistory: ConnectionHistoryEntry[]) => {
  const analyzeConnection = (): string => {
    if (connectionHistory.length === 0) {
      return "Zatím neproběhly žádné kontroly připojení";
    }
    
    const successCount = connectionHistory.filter(h => h.success).length;
    const successRate = (successCount / connectionHistory.length) * 100;
    
    if (successRate === 0) {
      return "Všechny pokusy o připojení selhaly";
    } else if (successRate < 30) {
      return "Velmi nestabilní připojení";
    } else if (successRate < 70) {
      return "Nestabilní připojení";
    } else if (successRate < 100) {
      return "Občasné výpadky připojení";
    } else {
      return "Stabilní připojení";
    }
  };

  return { analyzeConnection };
};


import { AlertCircle, Database, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiagnosticsPanelProps {
  isLocalStorageMode: boolean;
  connectionStatus: string;
  userId: string | null;
  statsCount: number;
  onTestConnection: () => void;
  onRefreshData: () => void;
  onExportStatistics: () => void;
  isRefreshing: boolean;
}

const DiagnosticsPanel = ({
  isLocalStorageMode,
  connectionStatus,
  userId,
  statsCount,
  onTestConnection,
  onRefreshData,
  onExportStatistics,
  isRefreshing
}: DiagnosticsPanelProps) => {
  return (
    <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-200">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-amber-800">Diagnostické informace</h4>
          <p className="text-xs text-amber-600 mt-1">
            {isLocalStorageMode 
              ? "Aplikace běží v offline režimu. Vaše statistiky jsou ukládány lokálně."
              : "Aplikace je připojena k databázi Supabase."}
          </p>
          
          <div className="mt-2 text-xs text-amber-600">
            <p>Status připojení: {connectionStatus}</p>
            <p>Režim: {isLocalStorageMode ? 'Lokální úložiště' : 'Online databáze'}</p>
            <p>Uživatelské ID: {userId || 'Neuvedeno'}</p>
            <p>Počet uložených statistik: {statsCount}</p>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefreshData}
              disabled={isRefreshing}
            >
              <Database className="h-4 w-4 mr-1" />
              Zkontrolovat připojení
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onTestConnection}
            >
              <Database className="h-4 w-4 mr-1" />
              Test Supabase
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onExportStatistics}
            >
              <Download className="h-4 w-4 mr-1" />
              Exportovat statistiky
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsPanel;

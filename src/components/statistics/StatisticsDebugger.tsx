
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStatisticsCore } from '@/hooks/statistics/useStatisticsCore';
import { toast } from 'sonner';
import { Trash2, Download, RefreshCw, Database } from 'lucide-react';

const StatisticsDebugger = ({ userId }: { userId: string | null }) => {
  const { listAllLocalStatistics, resetUserStatistics } = useStatisticsCore(userId);
  const [localStats, setLocalStats] = useState<Record<string, any>>({});
  
  useEffect(() => {
    refreshLocalStats();
  }, [userId]);
  
  const refreshLocalStats = () => {
    const stats = listAllLocalStatistics();
    setLocalStats(stats);
    toast.info("Statistiky obnoveny");
  };
  
  const handleResetUserStats = () => {
    if (!userId) return;
    
    if (window.confirm(`Opravdu chcete resetovat všechny statistiky pro uživatele ${userId}?`)) {
      const result = resetUserStatistics(userId);
      if (result) {
        toast.success(`Statistiky pro uživatele ${userId} byly resetovány`);
        refreshLocalStats();
      } else {
        toast.error("Resetování statistik se nezdařilo");
      }
    }
  };
  
  const exportAllStats = () => {
    try {
      const dataStr = JSON.stringify(localStats, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `procvicka-stats-vsechny-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success("Všechny statistiky exportovány do JSON souboru");
    } catch (e) {
      toast.error("Export statistik selhal: " + String(e));
    }
  };
  
  return (
    <Card className="mt-6 bg-slate-50">
      <CardHeader>
        <CardTitle className="text-lg text-slate-700">Diagnostický nástroj statistik</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshLocalStats}
            >
              <RefreshCw className="h-4 w-4 mr-2" /> 
              Obnovit statistiky
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={exportAllStats}
            >
              <Download className="h-4 w-4 mr-2" /> 
              Exportovat vše
            </Button>
            
            {userId && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleResetUserStats}
              >
                <Trash2 className="h-4 w-4 mr-2" /> 
                Resetovat statistiky ({userId})
              </Button>
            )}
          </div>
          
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Uložené klíče statistik ({Object.keys(localStats).length}):</h4>
            <ul className="text-sm space-y-1">
              {Object.keys(localStats).map(key => (
                <li key={key} className="flex items-center gap-2">
                  <Database className="h-3 w-3 text-slate-500" />
                  <span className="font-mono text-xs">{key}</span>
                  <span className="text-slate-500">
                    ({Array.isArray(localStats[key]) ? localStats[key].length : '?'} záznamů)
                  </span>
                </li>
              ))}
              {Object.keys(localStats).length === 0 && (
                <li className="text-slate-500">Žádné statistiky nenalezeny</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsDebugger;

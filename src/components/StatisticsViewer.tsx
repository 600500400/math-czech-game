
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/utils/dateUtils";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

const StatisticsViewer = () => {
  const { authState } = useAuth();
  const userId = authState.user?.id || null;
  const { mathStats, spellingStats, mathStatsLoading, spellingStatsLoading } = useStatistics(userId);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    // Debugging information
    console.log("StatisticsViewer - Auth State:", authState);
    console.log("StatisticsViewer - User ID:", userId);
    console.log("StatisticsViewer - Math Stats:", mathStats);
    console.log("StatisticsViewer - Spelling Stats:", spellingStats);
  }, [authState, userId, mathStats, spellingStats]);

  // Funkce pro ruční obnovení dat
  const handleRefreshData = () => {
    if (!userId) return;
    
    setIsRefreshing(true);
    toast.info("Obnovuji statistiky...");
    
    // Obnovení dat pomocí queryClient
    // Použijeme setTimeout pro simulaci načítání
    setTimeout(() => {
      window.location.reload(); // Jednoduché řešení pro obnovení dat
      setIsRefreshing(false);
    }, 1000);
  };

  if (!authState.isAuthenticated) {
    return (
      <Card>
        <CardContent className="pt-4">
          <p className="text-center text-gray-500">Pro zobrazení statistik se přihlaste.</p>
        </CardContent>
      </Card>
    );
  }

  if (mathStatsLoading || spellingStatsLoading) {
    return (
      <Card>
        <CardContent className="pt-4 flex flex-col items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-orange-500 mb-2" />
          <p className="text-center text-gray-500">Načítání statistik...</p>
        </CardContent>
      </Card>
    );
  }

  if (mathStats.length === 0 && spellingStats.length === 0) {
    return (
      <Card>
        <CardContent className="pt-4">
          <p className="text-center text-gray-500">Zatím nemáte žádné statistiky. Zahrajte si hru!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-center">Moje statistiky</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefreshData}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
          Obnovit
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="spelling">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="spelling">Vyjmenovaná slova</TabsTrigger>
            <TabsTrigger value="math">Matematika</TabsTrigger>
          </TabsList>
          
          <TabsContent value="spelling" className="mt-4">
            {spellingStats.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Skupina slov</TableHead>
                    <TableHead>Správně</TableHead>
                    <TableHead>Špatně</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spellingStats.map((stat) => (
                    <TableRow key={stat.id}>
                      <TableCell>{formatDate(stat.created_at)}</TableCell>
                      <TableCell>{stat.word_group}</TableCell>
                      <TableCell className="text-green-600">{stat.correct_answers}</TableCell>
                      <TableCell className="text-red-600">{stat.wrong_answers}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-gray-500">Zatím nemáte žádné statistiky pravopisu.</p>
            )}
          </TabsContent>
          
          <TabsContent value="math" className="mt-4">
            {mathStats.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Operace</TableHead>
                    <TableHead>Správně</TableHead>
                    <TableHead>Špatně</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mathStats.map((stat) => (
                    <TableRow key={stat.id}>
                      <TableCell>{formatDate(stat.created_at)}</TableCell>
                      <TableCell>{stat.operation}</TableCell>
                      <TableCell className="text-green-600">{stat.correct_answers}</TableCell>
                      <TableCell className="text-red-600">{stat.wrong_answers}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-gray-500">Zatím nemáte žádné statistiky matematiky.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatisticsViewer;


import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/utils/dateUtils";
import { useEffect } from "react";

const StatisticsViewer = () => {
  const { authState } = useAuth();
  const userId = authState.user?.id || null;
  const { mathStats, spellingStats, mathStatsLoading, spellingStatsLoading } = useStatistics(userId);
  
  useEffect(() => {
    // Debugging information
    console.log("StatisticsViewer - Auth State:", authState);
    console.log("StatisticsViewer - User ID:", userId);
    console.log("StatisticsViewer - Math Stats:", mathStats);
    console.log("StatisticsViewer - Spelling Stats:", spellingStats);
  }, [authState, userId, mathStats, spellingStats]);

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
        <CardContent className="pt-4">
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
      <CardHeader>
        <CardTitle className="text-center">Moje statistiky</CardTitle>
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

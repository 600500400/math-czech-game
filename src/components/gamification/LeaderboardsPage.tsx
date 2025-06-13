
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { useLeaderboards } from "@/hooks/gamification/useLeaderboards";

export const LeaderboardsPage = () => {
  const { 
    globalLeaderboard, 
    weeklyLeaderboard, 
    userRank, 
    isLoading 
  } = useLeaderboards();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return "default";
      case 2:
        return "secondary";
      case 3:
        return "outline";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Načítám žebříček...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🏆 Žebříček</h1>
        <p className="text-muted-foreground">
          Soutěž s ostatními a ukaž své dovednosti!
        </p>
        {userRank && (
          <Badge variant="outline" className="mt-2">
            <TrendingUp className="w-3 h-3 mr-1" />
            Tvoje pozice: #{userRank}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global">Celkový žebříček</TabsTrigger>
          <TabsTrigger value="weekly">Týdenní žebříček</TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Nejlepší hráči (celkem XP)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {globalLeaderboard.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Žádní hráči zatím nejsou v žebříčku
                  </p>
                ) : (
                  globalLeaderboard.map((entry) => (
                    <div
                      key={entry.user_id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'bg-card'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {getRankIcon(entry.rank)}
                        <div>
                          <p className="font-semibold">{entry.username}</p>
                          <p className="text-sm text-muted-foreground">
                            Level {entry.current_level} • Serie: {entry.current_streak} dní
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={getRankBadgeVariant(entry.rank)}>
                          {entry.total_xp} XP
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Týdenní aktivita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyLeaderboard.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Žádná aktivita tento týden
                  </p>
                ) : (
                  weeklyLeaderboard.map((entry) => (
                    <div
                      key={entry.user_id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        entry.rank <= 3 ? 'bg-gradient-to-r from-blue-50 to-purple-50' : 'bg-card'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {getRankIcon(entry.rank)}
                        <div>
                          <p className="font-semibold">{entry.username}</p>
                          <p className="text-sm text-muted-foreground">
                            Tento týden
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={getRankBadgeVariant(entry.rank)}>
                          {entry.total_xp} bodů
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

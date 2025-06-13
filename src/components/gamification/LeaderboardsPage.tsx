
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, TrendingUp, Users, Calendar } from "lucide-react";
import { useLeaderboards, LeaderboardEntry } from "@/hooks/gamification/useLeaderboards";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

const LeaderboardsPage = () => {
  const { authState } = useAuth();
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
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500";
    if (rank === 2) return "bg-gray-400";
    if (rank === 3) return "bg-amber-600";
    return "bg-blue-500";
  };

  const LeaderboardList = ({ entries, title, icon }: { entries: LeaderboardEntry[], title: string, icon: React.ReactNode }) => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-3 rounded-lg border">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {entries.map((entry) => {
          const isCurrentUser = entry.user_id === authState.user?.id;
          
          return (
            <div
              key={entry.user_id}
              className={`flex items-center space-x-4 p-3 rounded-lg border transition-colors ${
                isCurrentUser ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                {getRankIcon(entry.rank)}
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {entry.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${isCurrentUser ? 'text-blue-700' : ''}`}>
                    {entry.username}
                  </span>
                  {isCurrentUser && (
                    <Badge variant="secondary" className="text-xs">
                      Ty
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Level {entry.current_level} • {entry.current_streak} dní série
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-lg">{entry.total_xp.toLocaleString()}</div>
                <div className="text-sm text-gray-500">XP</div>
              </div>
            </div>
          );
        })}
        
        {entries.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Zatím nejsou žádní hráči v žebříčku.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">🏆 Žebříček</h1>
        <p className="text-gray-600">Porovnej své výsledky s ostatními hráči</p>
        
        {userRank && (
          <Card className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-4">
                <Badge className={`${getRankBadgeColor(userRank)} text-white`}>
                  #{userRank}
                </Badge>
                <span className="text-blue-700 font-medium">
                  Tvoje pozice v globálním žebříčku
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global" className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>Globální</span>
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Týdenní</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>Globální žebříček</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardList
                entries={globalLeaderboard}
                title="Globální žebříček"
                icon={<Trophy className="w-5 h-5" />}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>Týdenní žebříček</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardList
                entries={weeklyLeaderboard}
                title="Týdenní žebříček"
                icon={<TrendingUp className="w-5 h-5" />}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaderboardsPage;

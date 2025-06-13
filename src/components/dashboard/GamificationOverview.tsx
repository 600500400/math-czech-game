
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Flame, Award, TrendingUp } from "lucide-react";
import { useGamification } from "@/hooks/gamification/useGamification";
import { useLeaderboards } from "@/hooks/gamification/useLeaderboards";

interface GamificationOverviewProps {
  childId: string;
  childName: string;
}

export const GamificationOverview: React.FC<GamificationOverviewProps> = ({ 
  childId, 
  childName 
}) => {
  const { leveling, streaks, achievements } = useGamification();
  const { getUserRank } = useLeaderboards();
  const [userRank, setUserRank] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (childId) {
      getUserRank(childId).then(setUserRank);
    }
  }, [childId, getUserRank]);

  // Get completed achievements count
  const completedAchievements = achievements.userAchievements?.filter(ua => ua.completed).length || 0;
  const totalAchievements = achievements.achievements?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Gamifikace - {childName}</h3>
        <Badge variant="outline" className="flex items-center gap-1">
          <Trophy className="w-3 h-3" />
          Úroveň {leveling.userLevel?.current_level || 1}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              Úroveň & XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Level {leveling.userLevel?.current_level || 1}</span>
                <span>{leveling.userLevel?.total_xp || 0} XP</span>
              </div>
              <Progress value={leveling.getLevelProgress()} className="h-2" />
              <p className="text-xs text-gray-600">
                {leveling.userLevel?.xp_to_next_level || 100} XP do dalšího levelu
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              Série
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-600">
                {streaks.userStreak?.current_streak || 0}
              </div>
              <p className="text-xs text-gray-600">
                Aktuální série dní
              </p>
              <div className="text-sm text-gray-500">
                Nejdelší: {streaks.userStreak?.longest_streak || 0} dní
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-500" />
              Úspěchy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-600">
                {completedAchievements}
              </div>
              <p className="text-xs text-gray-600">
                z {totalAchievements} úspěchů
              </p>
              <Progress 
                value={totalAchievements > 0 ? (completedAchievements / totalAchievements) * 100 : 0} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Rank */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Pozice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">
                #{userRank || '?'}
              </div>
              <p className="text-xs text-gray-600">
                v globálním žebříčku
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Nedávné úspěchy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.userAchievements
              ?.filter(ua => ua.completed)
              ?.slice(0, 3)
              ?.map(userAchievement => (
                <div key={userAchievement.id} className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                  <div className="text-2xl">{userAchievement.achievement?.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{userAchievement.achievement?.name}</div>
                    <div className="text-xs text-gray-600">{userAchievement.achievement?.description}</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    +{userAchievement.achievement?.xp_reward} XP
                  </Badge>
                </div>
              ))}
            
            {completedAchievements === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Zatím žádné odemčené úspěchy
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

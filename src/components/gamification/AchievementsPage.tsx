
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Lock, Star } from "lucide-react";
import { useGamification } from "@/hooks/gamification/useGamification";
import { Achievement, UserAchievement } from "@/types/gamificationTypes";

export const AchievementsPage = () => {
  const { achievements } = useGamification();

  const getAchievementProgress = (achievement: Achievement, userAchievement?: UserAchievement) => {
    if (!userAchievement) return 0;
    
    const required = achievement.condition_data?.required || 
                    achievement.condition_data?.correct || 
                    achievement.condition_data?.days || 1;
    
    return Math.min((userAchievement.progress / required) * 100, 100);
  };

  const isAchievementUnlocked = (achievement: Achievement) => {
    return achievements.userAchievements.find(
      ua => ua.achievement_id === achievement.id && ua.completed
    );
  };

  const getUserAchievement = (achievement: Achievement) => {
    return achievements.userAchievements.find(
      ua => ua.achievement_id === achievement.id
    );
  };

  if (achievements.isLoading) {
    return <div className="text-center py-8">Načítám úspěchy...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🏆 Úspěchy</h1>
        <p className="text-muted-foreground">
          Odemčeno {achievements.userAchievements.filter(ua => ua.completed).length} z {achievements.achievements.length} úspěchů
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.achievements.map((achievement) => {
          const userAchievement = getUserAchievement(achievement);
          const isUnlocked = isAchievementUnlocked(achievement);
          const progress = getAchievementProgress(achievement, userAchievement);

          return (
            <Card 
              key={achievement.id} 
              className={`p-4 transition-all ${
                isUnlocked 
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                  : 'opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`text-3xl ${!isUnlocked && 'grayscale'}`}>
                  {isUnlocked ? achievement.icon : <Lock className="w-8 h-8 text-gray-400" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{achievement.name}</h3>
                    {isUnlocked && <Trophy className="w-4 h-4 text-yellow-500" />}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {achievement.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant={isUnlocked ? "default" : "secondary"} className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      +{achievement.xp_reward} XP
                    </Badge>
                    
                    {userAchievement && !isUnlocked && progress > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {Math.round(progress)}%
                      </span>
                    )}
                  </div>
                  
                  {userAchievement && !isUnlocked && progress > 0 && (
                    <Progress value={progress} className="h-1 mt-2" />
                  )}
                  
                  {isUnlocked && userAchievement && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Odemčeno {new Date(userAchievement.unlocked_at).toLocaleDateString('cs-CZ')}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

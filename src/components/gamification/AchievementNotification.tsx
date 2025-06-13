
import { Achievement } from "@/types/gamificationTypes";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star } from "lucide-react";

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementNotification = ({ achievement, onClose }: AchievementNotificationProps) => {
  return (
    <Card className="fixed top-4 right-4 z-50 p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg animate-in slide-in-from-right duration-500">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <Trophy className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{achievement.icon}</span>
            <Badge variant="secondary" className="bg-white/20">
              +{achievement.xp_reward} XP
            </Badge>
          </div>
          <h3 className="font-bold text-lg">{achievement.name}</h3>
          <p className="text-sm opacity-90">{achievement.description}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white/70 hover:text-white"
        >
          ✕
        </button>
      </div>
    </Card>
  );
};

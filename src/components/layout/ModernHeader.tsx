
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Sparkles, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import UserMenu from "@/components/UserMenu";
import FeedbackButton from "@/components/FeedbackButton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useGamification } from "@/hooks/gamification/useGamification";
import { LevelDisplay } from "@/components/gamification/LevelDisplay";
import { StreakDisplay } from "@/components/gamification/StreakDisplay";
import DonateButton from "@/components/donation/DonateButton";

const ModernHeader = () => {
  const { authState } = useAuth();
  const { leveling, streaks } = useGamification();

  return (
    <header className="w-full bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="group flex items-center space-x-3 sm:space-x-4 hover:scale-105 transition-all duration-300">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent tracking-tight">
                Procvička
              </h1>
              <p className="text-sm font-medium text-muted-foreground -mt-0.5 tracking-wide">
                Aplikace pro procvičování
              </p>
            </div>
          </Link>

          {/* Center - Gamification displays for authenticated users */}
          {authState.user && (
            <div className="hidden lg:flex items-center gap-4">
              <LevelDisplay 
                userLevel={leveling.userLevel} 
                progress={leveling.getLevelProgress()} 
                compact 
              />
              <StreakDisplay 
                userStreak={streaks.userStreak} 
                isAtRisk={streaks.isStreakAtRisk()} 
                compact 
              />
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-1">
            <DonateButton />
            <ThemeToggle />
            <FeedbackButton />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;

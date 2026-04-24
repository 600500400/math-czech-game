import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen } from "lucide-react";
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
          <Link
            to="/"
            className="group flex items-center space-x-2 sm:space-x-3 hover:opacity-90 transition-opacity duration-200"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-500 via-green-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-foreground tracking-tight">
                Procvička
              </h1>
              <p className="hidden sm:block text-sm text-muted-foreground -mt-0.5">
                Matematika • Pravopis • Slovník
              </p>
            </div>
          </Link>

          {/* Center - Gamification displays for authenticated users */}
          {authState.user && (
            <div className="hidden md:flex items-center gap-4">
              <LevelDisplay
                userLevel={leveling.userLevel}
                progress={leveling.getLevelProgress()}
                compact
              />
              <div className="hidden lg:block">
                <StreakDisplay
                  userStreak={streaks.userStreak}
                  isAtRisk={streaks.isStreakAtRisk()}
                  compact
                />
              </div>
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

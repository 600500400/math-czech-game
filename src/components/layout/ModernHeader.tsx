
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Sparkles, MessageSquare } from "lucide-react";
import UserMenu from "@/components/UserMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import FeedbackButton from "@/components/FeedbackButton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLanguage } from "@/hooks/useLanguage";
import { useGamification } from "@/hooks/gamification/useGamification";
import { LevelDisplay } from "@/components/gamification/LevelDisplay";
import { StreakDisplay } from "@/components/gamification/StreakDisplay";
import DonateButton from "@/components/donation/DonateButton";

const ModernHeader = () => {
  const { authState } = useAuth();
  const { t } = useLanguage();
  const { leveling, streaks } = useGamification();

  return (
    <header className="w-full bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-brand-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-heading font-bold text-foreground">
                Procvička
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                {t('auth.title')}
              </p>
            </div>
          </div>

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
            <LanguageSwitcher />
            <FeedbackButton />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;

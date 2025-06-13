
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Sparkles } from "lucide-react";
import UserMenu from "@/components/UserMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useLanguage } from "@/hooks/useLanguage";

const ModernHeader = () => {
  const { authState } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="w-full bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <Sparkles className="w-4 h-4 text-brand-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold gradient-text">
                Procvička
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                {t('auth.title')}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;

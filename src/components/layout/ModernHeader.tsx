
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Sparkles } from "lucide-react";
import UserMenu from "@/components/UserMenu";

const ModernHeader = () => {
  const { authState } = useAuth();

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
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
              <p className="text-xs text-gray-500 -mt-1">Moderní vzdělávání</p>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {authState.isAuthenticated && (
              <>
                <Button variant="ghost" className="text-gray-600 hover:text-brand-600">
                  Procvičování
                </Button>
                <Button variant="ghost" className="text-gray-600 hover:text-brand-600">
                  Statistiky
                </Button>
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;

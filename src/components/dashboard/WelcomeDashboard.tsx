
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { useLanguage } from "@/hooks/useLanguage";
import { useUserTheme } from "@/hooks/useUserTheme";
import { Calculator, PenTool, Target, TrendingUp, Star, Trophy } from "lucide-react";

interface WelcomeDashboardProps {
  onNavigateToTab?: (tab: "practice" | "statistics") => void;
  onNavigateToPractice?: (defaultTab: "spelling" | "math") => void;
}

const WelcomeDashboard = ({ onNavigateToTab, onNavigateToPractice }: WelcomeDashboardProps) => {
  const { authState } = useAuth();
  const { mathStats, spellingStats } = useStatistics(authState.user?.id || null);
  const { t } = useLanguage();
  const { theme, getCSSVariables } = useUserTheme(authState.user?.id);

  const userName = authState.profile?.username || t('user.user');
  
  // Výpočet základních statistik
  const totalGames = mathStats.length + spellingStats.length;
  const totalCorrect = mathStats.reduce((sum, game) => sum + game.correct_answers, 0) +
                      spellingStats.reduce((sum, game) => sum + game.correct_answers, 0);
  const totalAnswers = mathStats.reduce((sum, game) => sum + game.correct_answers + game.wrong_answers, 0) +
                      spellingStats.reduce((sum, game) => sum + game.correct_answers + game.wrong_answers, 0);
  
  const successRate = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  // Výpočet úrovně na základě celkového počtu správných odpovědí
  const level = Math.floor(totalCorrect / 50) + 1;
  const progressToNextLevel = (totalCorrect % 50) / 50 * 100;

  const handleMathPractice = () => {
    if (onNavigateToPractice) {
      onNavigateToPractice("math"); // Správně předám "math" záložku
    } else {
      onNavigateToTab?.("practice");
    }
  };

  const handleSpellingPractice = () => {
    if (onNavigateToPractice) {
      onNavigateToPractice("spelling");
    } else {
      onNavigateToTab?.("practice");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in" style={getCSSVariables}>
      {/* Welcome Section s personalizovaným designem */}
      <div className="text-center space-y-4 py-8">
        <div className="relative inline-block">
          <h1 className="text-4xl md:text-5xl font-heading font-bold gradient-text">
            {t('dashboard.welcomeBack')}, {userName}! {theme.avatar}
          </h1>
          <div className="absolute -top-2 -right-2">
            <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Quick Stats s personalizovanými barvami */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2" style={{ color: theme.primaryColor }} />
            <div className="text-2xl font-bold text-gray-900">{totalGames}</div>
            <div className="text-sm text-gray-600">{t('dashboard.totalGames')}</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-2" style={{ color: theme.accentColor }} />
            <div className="text-2xl font-bold text-gray-900">{successRate}%</div>
            <div className="text-sm text-gray-600">{t('dashboard.successRate')}</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: theme.primaryColor }} />
            <div className="text-2xl font-bold text-gray-900">{totalCorrect}</div>
            <div className="text-sm text-gray-600">{t('dashboard.correctAnswers')}</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">Level {level}</div>
            <div className="text-sm text-gray-600">{t('dashboard.yourLevel')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress s personalizovanými barvami */}
      <Card className="glass border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            {t('dashboard.progressToNextLevel')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level {level}</span>
              <span>Level {level + 1}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${progressToNextLevel}%`,
                  background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.accentColor})`
                }}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              {50 - (totalCorrect % 50)} {t('dashboard.correctAnswersToNextLevel')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions s personalizovanými barvami */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              onClick={handleMathPractice}>
          <CardContent className="p-8 text-center space-y-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300"
              style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})` }}
            >
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-heading font-semibold">{t('dashboard.mathTitle')}</h3>
            <p className="text-gray-600">{t('dashboard.mathDescription')}</p>
            <Button 
              className="hover:scale-105 transition-all duration-300 shadow-lg text-white"
              style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})` }}
            >
              {t('dashboard.startPracticing')}
            </Button>
          </CardContent>
        </Card>

        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              onClick={handleSpellingPractice}>
          <CardContent className="p-8 text-center space-y-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300"
              style={{ background: `linear-gradient(135deg, ${theme.secondaryColor}, ${theme.primaryColor})` }}
            >
              <PenTool className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-heading font-semibold">{t('dashboard.spellingTitle')}</h3>
            <p className="text-gray-600">{t('dashboard.spellingDescription')}</p>
            <Button 
              className="hover:scale-105 transition-all duration-300 shadow-lg text-white"
              style={{ background: `linear-gradient(135deg, ${theme.secondaryColor}, ${theme.primaryColor})` }}
            >
              {t('dashboard.startPracticing')}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Quote s personalizovaným pozadím */}
      <Card 
        className="glass border-0 shadow-lg"
        style={{ background: `linear-gradient(135deg, ${theme.secondaryColor}33, ${theme.primaryColor}22)` }}
      >
        <CardContent className="p-6 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-lg italic text-gray-700 mb-2">
              "{t('dashboard.motivationalQuote')}"
            </p>
            <p className="text-sm text-gray-500">{t('dashboard.keepLearning')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeDashboard;

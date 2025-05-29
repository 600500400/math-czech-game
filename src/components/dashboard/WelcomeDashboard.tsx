
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { Calculator, PenTool, Target, TrendingUp, Star, Trophy } from "lucide-react";
import { useState } from "react";

const WelcomeDashboard = () => {
  const { authState } = useAuth();
  const { mathStats, spellingStats } = useStatistics(authState.user?.id || null);
  const [activeTab, setActiveTab] = useState<"practice" | "statistics">("practice");

  const userName = authState.profile?.username || "Uživatel";
  
  // Výpočet základních statistik
  const totalGames = mathStats.length + spellingStats.length;
  const totalCorrect = mathStats.reduce((sum, game) => sum + game.correct_answers, 0) +
                      spellingStats.reduce((sum, game) => sum + game.correct_answers, 0);
  const totalAnswers = mathStats.reduce((sum, game) => sum + game.totalAnswers, 0) +
                      spellingStats.reduce((sum, game) => sum + game.totalAnswers, 0);
  
  const successRate = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  // Výpočet úrovně na základě celkového počtu správných odpovědí
  const level = Math.floor(totalCorrect / 50) + 1;
  const progressToNextLevel = (totalCorrect % 50) / 50 * 100;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="text-center space-y-4 py-8">
        <div className="relative inline-block">
          <h1 className="text-4xl md:text-5xl font-heading font-bold gradient-text">
            Vítej zpět, {userName}! 👋
          </h1>
          <div className="absolute -top-2 -right-2">
            <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Připrav se na další výzvu! Procvičuj matematiku a pravopis zábavnou formou.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-brand-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{totalGames}</div>
            <div className="text-sm text-gray-600">Celkem her</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-success-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{successRate}%</div>
            <div className="text-sm text-gray-600">Úspěšnost</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-brand-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{totalCorrect}</div>
            <div className="text-sm text-gray-600">Správné odpovědi</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">Level {level}</div>
            <div className="text-sm text-gray-600">Tvoje úroveň</div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="glass border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Pokrok k dalšímu levelu
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
                className="h-3 rounded-full bg-gradient-primary transition-all duration-500"
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              {50 - (totalCorrect % 50)} správných odpovědí do dalšího levelu
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              onClick={() => setActiveTab("practice")}>
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-heading font-semibold">Matematika</h3>
            <p className="text-gray-600">Procvičuj sčítání, odčítání, násobení a dělení</p>
            <Button className="bg-gradient-primary hover:scale-105 transition-all duration-300 shadow-lg">
              Začít procvičovat
            </Button>
          </CardContent>
        </Card>

        <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              onClick={() => setActiveTab("practice")}>
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-success rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <PenTool className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-heading font-semibold">Pravopis</h3>
            <p className="text-gray-600">Zlepšuj svůj pravopis s interaktivními cvičeními</p>
            <Button className="bg-gradient-success hover:scale-105 transition-all duration-300 shadow-lg">
              Začít procvičovat
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Quote */}
      <Card className="glass border-0 shadow-lg bg-gradient-to-r from-brand-50 to-brand-100">
        <CardContent className="p-6 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-lg italic text-gray-700 mb-2">
              "Každá správná odpověď tě posouvá blíže k tvému cíli!"
            </p>
            <p className="text-sm text-gray-500">Pokračuj v učení a uvidíš pokrok! 🚀</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeDashboard;

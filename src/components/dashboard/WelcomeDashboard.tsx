import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { BookOpen, Calculator, BarChart3, Target, Languages } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

interface WelcomeDashboardProps {
  onNavigateToTab: (tab: "statistics") => void;
}

const WelcomeDashboard: React.FC<WelcomeDashboardProps> = ({
  onNavigateToTab,
}) => {
  const { authState } = useAuth();
  const { mathStats, spellingStats } = useStatistics(authState.user?.id || null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const userName = authState.profile?.full_name || "Studente";
  const firstName = userName.split(" ")[0] || "Studente";

  // Calculate totals from individual statistics records
  const mathTotals = (mathStats || []).reduce((acc, stat) => {
    acc.correct += stat.correct_answers;
    acc.wrong += stat.wrong_answers;
    acc.total += stat.correct_answers + stat.wrong_answers;
    return acc;
  }, { correct: 0, wrong: 0, total: 0 });

  const spellingTotals = (spellingStats || []).reduce((acc, stat) => {
    acc.correct += stat.correct_answers;
    acc.wrong += stat.wrong_answers;
    acc.total += stat.correct_answers + stat.wrong_answers;
    return acc;
  }, { correct: 0, wrong: 0, total: 0 });

  // Calculate recent performance
  const mathAccuracy = mathTotals.total > 0 
    ? Math.round((mathTotals.correct / mathTotals.total) * 100)
    : 0;
  
  const spellingAccuracy = spellingTotals.total > 0
    ? Math.round((spellingTotals.correct / spellingTotals.total) * 100)
    : 0;

  // Get performance badges
  const getMathBadge = () => {
    if (mathAccuracy >= 90) return { text: t('welcomeDashboard.badges.expert'), color: "bg-yellow-500" };
    if (mathAccuracy >= 75) return { text: t('welcomeDashboard.badges.advanced'), color: "bg-green-500" };
    if (mathAccuracy >= 50) return { text: t('welcomeDashboard.badges.learning'), color: "bg-blue-500" };
    return { text: t('welcomeDashboard.badges.beginner'), color: "bg-gray-500" };
  };

  const getSpellingBadge = () => {
    if (spellingAccuracy >= 90) return { text: t('welcomeDashboard.badges.spellingMaster'), color: "bg-purple-500" };
    if (spellingAccuracy >= 75) return { text: t('welcomeDashboard.badges.advanced'), color: "bg-green-500" };
    if (spellingAccuracy >= 50) return { text: t('welcomeDashboard.badges.learning'), color: "bg-blue-500" };
    return { text: t('welcomeDashboard.badges.beginner'), color: "bg-gray-500" };
  };

  const mathBadge = getMathBadge();
  const spellingBadge = getSpellingBadge();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {t('welcomeDashboard.welcomeBack', { firstName })}
        </h1>
        <p className="text-muted-foreground">
          {t('welcomeDashboard.welcomeMessage')}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('welcomeDashboard.mathSection')}</CardTitle>
            <Calculator className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{mathAccuracy}%</span>
                <Badge className={`${mathBadge.color} text-white`}>
                  {mathBadge.text}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('welcomeDashboard.problemsSolved', { total: mathTotals.total })}
              </p>
              <Button 
                onClick={() => navigate('/math')}
                className="w-full mt-2"
                size="sm"
              >
                {t('welcomeDashboard.practiceButtons.math')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('welcomeDashboard.spellingSection')}</CardTitle>
            <BookOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{spellingAccuracy}%</span>
                <Badge className={`${spellingBadge.color} text-white`}>
                  {spellingBadge.text}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('welcomeDashboard.wordsWritten', { total: spellingTotals.total })}
              </p>
              <Button 
                onClick={() => navigate('/spelling')}
                className="w-full mt-2"
                size="sm"
              >
                {t('welcomeDashboard.practiceButtons.spelling')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


        <Card className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/dictionary')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('welcomeDashboard.dictionarySection')}</CardTitle>
            <Languages className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">{t('welcomeDashboard.practiceVocabulary')}</p>
              <Button
                onClick={(e) => { e.stopPropagation(); navigate('/dictionary'); }}
                className="w-full mt-2"
                size="sm"
              >
                {t('welcomeDashboard.practiceButtons.dictionary')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeDashboard;

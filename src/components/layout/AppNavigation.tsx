
import { Button } from "@/components/ui/button";
import { BarChart2, Gamepad2, Home } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface AppNavigationProps {
  activeTab: "dashboard" | "practice" | "statistics";
  setActiveTab: (tab: "dashboard" | "practice" | "statistics") => void;
}

const AppNavigation = ({ activeTab, setActiveTab }: AppNavigationProps) => {
  const { t } = useLanguage();

  return (
    <div className="w-full mb-8">
      <nav className="flex gap-2 p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-lg">
        <Button 
          variant={activeTab === "dashboard" ? "default" : "ghost"}
          className={`flex-1 rounded-xl transition-all duration-300 text-xs sm:text-sm py-3 sm:py-2 ${
            activeTab === "dashboard" 
              ? "bg-gradient-primary text-white shadow-lg hover:shadow-xl" 
              : "text-gray-600 hover:text-brand-600 hover:bg-brand-50"
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          <Home className="mr-1 sm:mr-2 h-4 w-4" /> 
          <span className="hidden xs:inline">{t('navigation.dashboard')}</span>
          <span className="xs:hidden">{t('navigation.home')}</span>
        </Button>
        
        <Button 
          variant={activeTab === "practice" ? "default" : "ghost"}
          className={`flex-1 rounded-xl transition-all duration-300 text-xs sm:text-sm py-3 sm:py-2 ${
            activeTab === "practice" 
              ? "bg-gradient-primary text-white shadow-lg hover:shadow-xl" 
              : "text-gray-600 hover:text-brand-600 hover:bg-brand-50"
          }`}
          onClick={() => setActiveTab("practice")}
        >
          <Gamepad2 className="mr-1 sm:mr-2 h-4 w-4" /> 
          <span className="hidden xs:inline">{t('navigation.practice')}</span>
          <span className="xs:hidden">{t('navigation.game')}</span>
        </Button>
        
        <Button 
          variant={activeTab === "statistics" ? "default" : "ghost"}
          className={`flex-1 rounded-xl transition-all duration-300 text-xs sm:text-sm py-3 sm:py-2 font-medium ${
            activeTab === "statistics" 
              ? "bg-gradient-primary text-white shadow-lg hover:shadow-xl" 
              : "text-gray-600 hover:text-brand-600 hover:bg-brand-50"
          }`}
          onClick={() => setActiveTab("statistics")}
        >
          <BarChart2 className="mr-1 sm:mr-2 h-4 w-4" /> 
          <span className="hidden xs:inline">{t('navigation.statistics')}</span>
          <span className="xs:hidden">{t('navigation.stats')}</span>
        </Button>
      </nav>
    </div>
  );
};

export default AppNavigation;

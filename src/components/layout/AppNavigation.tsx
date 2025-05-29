
import { Button } from "@/components/ui/button";
import { BarChart2, Gamepad2, Home } from "lucide-react";

interface AppNavigationProps {
  activeTab: "dashboard" | "practice" | "statistics";
  setActiveTab: (tab: "dashboard" | "practice" | "statistics") => void;
}

const AppNavigation = ({ activeTab, setActiveTab }: AppNavigationProps) => {
  return (
    <div className="w-full mb-8">
      <nav className="flex gap-2 p-1 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-lg">
        <Button 
          variant={activeTab === "dashboard" ? "default" : "ghost"}
          className={`flex-1 rounded-xl transition-all duration-300 ${
            activeTab === "dashboard" 
              ? "bg-gradient-primary text-white shadow-lg hover:shadow-xl" 
              : "text-gray-600 hover:text-brand-600 hover:bg-brand-50"
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          <Home className="mr-2 h-4 w-4" /> 
          Dashboard
        </Button>
        
        <Button 
          variant={activeTab === "practice" ? "default" : "ghost"}
          className={`flex-1 rounded-xl transition-all duration-300 ${
            activeTab === "practice" 
              ? "bg-gradient-primary text-white shadow-lg hover:shadow-xl" 
              : "text-gray-600 hover:text-brand-600 hover:bg-brand-50"
          }`}
          onClick={() => setActiveTab("practice")}
        >
          <Gamepad2 className="mr-2 h-4 w-4" /> 
          Procvičování
        </Button>
        
        <Button 
          variant={activeTab === "statistics" ? "default" : "ghost"}
          className={`flex-1 rounded-xl transition-all duration-300 ${
            activeTab === "statistics" 
              ? "bg-gradient-primary text-white shadow-lg hover:shadow-xl" 
              : "text-gray-600 hover:text-brand-600 hover:bg-brand-50"
          }`}
          onClick={() => setActiveTab("statistics")}
        >
          <BarChart2 className="mr-2 h-4 w-4" /> 
          Statistiky
        </Button>
      </nav>
    </div>
  );
};

export default AppNavigation;

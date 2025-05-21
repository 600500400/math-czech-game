
import { Button } from "@/components/ui/button";
import { BarChart2, Gamepad2 } from "lucide-react";

interface AppNavigationProps {
  activeTab: "practice" | "statistics";
  setActiveTab: (tab: "practice" | "statistics") => void;
}

const AppNavigation = ({ activeTab, setActiveTab }: AppNavigationProps) => {
  return (
    <div className="w-full max-w-md mx-auto mb-4 flex gap-2">
      <Button 
        variant={activeTab === "practice" ? "default" : "outline"}
        className={activeTab === "practice" ? "bg-orange-500 hover:bg-orange-600 flex-1" : "flex-1"}
        onClick={() => setActiveTab("practice")}
      >
        <Gamepad2 className="mr-2 h-4 w-4" /> Procvičování
      </Button>
      <Button 
        variant={activeTab === "statistics" ? "default" : "outline"}
        className={activeTab === "statistics" ? "bg-orange-500 hover:bg-orange-600 flex-1" : "flex-1"}
        onClick={() => setActiveTab("statistics")}
      >
        <BarChart2 className="mr-2 h-4 w-4" /> Statistiky
      </Button>
    </div>
  );
};

export default AppNavigation;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ModernHeader from "@/components/layout/ModernHeader";
import AppNavigation from "@/components/layout/AppNavigation";
import AppFooter from "@/components/layout/AppFooter";
import PracticeSection from "@/components/practice/PracticeSection";
import StatisticsViewer from "@/components/StatisticsViewer";
import WelcomeDashboard from "@/components/dashboard/WelcomeDashboard";
import WelcomeCard from "@/components/auth/WelcomeCard";

const HomePage = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"dashboard" | "practice" | "statistics">("dashboard");
  
  // Redirect to auth page if user is not authenticated
  if (!authState.isAuthenticated && !authState.isLoading) {
    navigate("/auth");
    return null;
  }

  const handleNavigateToTab = (tab: "practice" | "statistics") => {
    setActiveTab(tab);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-bg">
      <ModernHeader />
      
      {authState.isAuthenticated ? (
        <div className="flex-1 flex flex-col">
          <div className="w-full max-w-6xl mx-auto px-4 py-6">
            <AppNavigation 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
            
            <main className="flex-1">
              {activeTab === "dashboard" && <WelcomeDashboard onNavigateToTab={handleNavigateToTab} />}
              {activeTab === "practice" && <PracticeSection />}
              {activeTab === "statistics" && <StatisticsViewer />}
            </main>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <WelcomeCard />
        </div>
      )}
      
      <AppFooter />
    </div>
  );
};

export default HomePage;

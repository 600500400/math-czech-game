
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAppConnection } from "@/hooks/useAppConnection";
import AppHeader from "@/components/layout/AppHeader";
import AppNavigation from "@/components/layout/AppNavigation";
import PracticeSection from "@/components/practice/PracticeSection";
import StatisticsViewer from "@/components/StatisticsViewer";
import DatabaseStatusNotice from "@/components/connection/DatabaseStatusNotice";
import WelcomeCard from "@/components/auth/WelcomeCard";

const HomePage = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { databaseStatus, handleCheckConnection } = useAppConnection();
  const [activeTab, setActiveTab] = useState<"practice" | "statistics">("practice");
  
  // Redirect to auth page if user is not authenticated
  if (!authState.isAuthenticated && !authState.isLoading) {
    navigate("/auth");
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-4">
      <AppHeader 
        databaseStatus={databaseStatus} 
        onCheckConnection={handleCheckConnection} 
      />
      
      {authState.isAuthenticated ? (
        <>
          <AppNavigation 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
          {activeTab === "practice" ? (
            <PracticeSection />
          ) : (
            <StatisticsViewer />
          )}
          
          <DatabaseStatusNotice 
            status={databaseStatus} 
            onCheck={handleCheckConnection} 
          />
        </>
      ) : (
        <WelcomeCard />
      )}
    </div>
  );
};

export default HomePage;

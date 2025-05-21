
import { useState } from "react";
import MathPractice from "../components/MathPractice";
import SpellingPractice from "../components/SpellingPractice";
import StatisticsViewer from "../components/StatisticsViewer";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { BarChart2, Gamepad2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"practice" | "statistics">("practice");
  
  // Pokud uživatel není přihlášen, přesměrujeme ho na stránku s výběrem uživatele
  if (!authState.isAuthenticated && !authState.isLoading) {
    navigate("/auth");
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-4">
      <header className="w-full max-w-md mx-auto flex justify-between mb-4">
        <h1 className="text-xl font-bold text-orange-500">Procvička App</h1>
        <UserMenu />
      </header>
      
      {authState.isAuthenticated ? (
        <>
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
          
          {activeTab === "practice" ? (
            <Card className="w-full max-w-md mx-auto p-6 shadow-lg">
              <Tabs defaultValue="spelling" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="spelling">Vyjmenovaná slova</TabsTrigger>
                  <TabsTrigger value="math">Matematika</TabsTrigger>
                </TabsList>
                <TabsContent value="spelling">
                  <SpellingPractice />
                </TabsContent>
                <TabsContent value="math">
                  <MathPractice />
                </TabsContent>
              </Tabs>
            </Card>
          ) : (
            <StatisticsViewer />
          )}
        </>
      ) : (
        <Card className="w-full max-w-md mx-auto p-6 shadow-lg">
          <div className="text-center py-4 space-y-4">
            <h2 className="text-2xl font-bold">Vítejte v aplikaci Procvička</h2>
            <p className="text-gray-600">
              Pro využití všech funkcí se prosím přihlaste nebo zaregistrujte.
            </p>
            <Button onClick={() => navigate("/auth")} className="bg-orange-500 hover:bg-orange-600">
              Vybrat uživatele
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Index;

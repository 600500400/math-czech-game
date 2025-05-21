
import { useState, useEffect } from "react";
import MathPractice from "../components/MathPractice";
import SpellingPractice from "../components/SpellingPractice";
import StatisticsViewer from "../components/StatisticsViewer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { BarChart2, Database, Gamepad2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { checkSupabaseConnection } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"practice" | "statistics">("practice");
  const [databaseStatus, setDatabaseStatus] = useState<"checking" | "connected" | "disconnected" | "error">("checking");
  
  // Kontrola připojení k databázi při načtení
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setDatabaseStatus("checking");
        const result = await checkSupabaseConnection();
        if (result.success) {
          setDatabaseStatus("connected");
          console.log("Databáze je připojena:", result);
          toast.success("Připojení k databázi úspěšné");
        } else {
          setDatabaseStatus("disconnected");
          console.error("Problém s připojením k databázi:", result.error);
          toast.warning("Problém s připojením k databázi - statistiky budou uloženy lokálně");
        }
      } catch (error) {
        setDatabaseStatus("error");
        console.error("Chyba při kontrole databáze:", error);
        toast.error("Chyba při kontrole databáze");
      }
    };
    
    checkConnection();
    
    // Nastavíme interval pro pravidelnou kontrolu, ale pouze když je stránka aktivní
    const visibilityHandler = () => {
      if (document.visibilityState === 'visible') {
        checkConnection();
      }
    };
    
    document.addEventListener('visibilitychange', visibilityHandler);
    
    return () => {
      document.removeEventListener('visibilitychange', visibilityHandler);
    };
  }, []);
  
  // Funkce pro manuální kontrolu/obnovení připojení
  const handleCheckConnection = async () => {
    try {
      setDatabaseStatus("checking");
      toast.info("Kontroluji připojení k databázi...");
      
      const result = await checkSupabaseConnection();
      
      if (result.success) {
        setDatabaseStatus("connected");
        toast.success(`Připojení k databázi úspěšné! (${result.elapsed}ms)`);
      } else {
        setDatabaseStatus("disconnected");
        toast.error("Problém s připojením k databázi");
      }
    } catch (error) {
      setDatabaseStatus("error");
      toast.error("Chyba při kontrole připojení k databázi");
    }
  };
  
  // Pokud uživatel není přihlášen, přesměrujeme ho na stránku s výběrem uživatele
  if (!authState.isAuthenticated && !authState.isLoading) {
    navigate("/auth");
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-4">
      <header className="w-full max-w-md mx-auto flex justify-between mb-4">
        <h1 className="text-xl font-bold text-orange-500">Procvička App</h1>
        <div className="flex items-center gap-2">
          {/* Indikátor stavu databáze a tlačítko pro kontrolu */}
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleCheckConnection}
            title="Zkontrolovat připojení k databázi"
          >
            <Database className="h-4 w-4" />
            <div className={`h-2 w-2 rounded-full ${
              databaseStatus === "connected" ? "bg-green-500" : 
              databaseStatus === "disconnected" ? "bg-red-500" :
              databaseStatus === "checking" ? "bg-amber-500 animate-pulse" :
              "bg-gray-500"
            }`} />
          </Button>
          <UserMenu />
        </div>
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
          
          {/* Status databáze - detailnější oznámení při problému */}
          {databaseStatus !== "connected" && (
            <Card className="w-full max-w-md mx-auto mt-4">
              <CardContent className="pt-4">
                <div className="flex flex-col gap-2">
                  <p className="text-center text-amber-600 flex items-center justify-center gap-2 font-medium">
                    {databaseStatus === "checking" ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> 
                        Kontroluji připojení k databázi...
                      </>
                    ) : databaseStatus === "disconnected" ? (
                      <>
                        <Database className="h-4 w-4" />
                        Problém s připojením k databázi. Statistiky budou uloženy lokálně.
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4" />
                        Chyba při komunikaci s databází. Statistiky budou uloženy lokálně.
                      </>
                    )}
                  </p>
                  
                  <div className="flex justify-center mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCheckConnection}
                      className="text-xs"
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${databaseStatus === "checking" ? "animate-spin" : ""}`} />
                      Zkusit znovu
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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

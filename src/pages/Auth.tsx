import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import AppFooter from "@/components/layout/AppFooter";

// Předem definovaní uživatelé s UUID formátem ID
const DEFAULT_USERS = [
  { id: "f7f45db0-49e4-4218-a420-4812442fc0e1", email: "", username: "Gábi", role: "child" },
  { id: "58d94646-332a-40f1-86fb-0861c1c48a66", email: "", username: "Míša", role: "child" },
  { id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", email: "", username: "Áďa", role: "child" },
  { id: "2f7c5c1d-f69d-4aee-a373-bc7f416b08f2", email: "", username: "Host", role: "child" },
];

const Auth = () => {
  const { authState, setLocalUser } = useAuth();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  
  // Inicializace stabilních ID pro uživatele při prvním načtení
  useEffect(() => {
    console.log("Inicializuji uložiště pro všechny uživatele...");
    
    // Zkontrolujeme a připravíme úložiště pro všechny uživatele
    DEFAULT_USERS.forEach(user => {
      // Inicializace prázdných polí pro statistiky, pokud neexistují
      const mathKey = `mathStats_${user.id}`;
      const spellingKey = `spellingStats_${user.id}`;
      
      if (!localStorage.getItem(mathKey)) {
        console.log(`Inicializace prázdného pole pro matematické statistiky uživatele ${user.username}`);
        localStorage.setItem(mathKey, JSON.stringify([]));
      } else {
        const stats = JSON.parse(localStorage.getItem(mathKey) || "[]");
        console.log(`Uživatel ${user.username} má ${stats.length} matematických záznamů`);
      }
      
      if (!localStorage.getItem(spellingKey)) {
        console.log(`Inicializace prázdného pole pro statistiky pravopisu uživatele ${user.username}`);
        localStorage.setItem(spellingKey, JSON.stringify([]));
      } else {
        const stats = JSON.parse(localStorage.getItem(spellingKey) || "[]");
        console.log(`Uživatel ${user.username} má ${stats.length} záznamů pravopisu`);
      }
    });
    
    setInitializing(false);
  }, []);
  
  // Pokud je uživatel již přihlášen, přesměrujeme ho na hlavní stránku
  if (authState.isAuthenticated && !authState.isLoading) {
    navigate("/");
    return null;
  }
  
  const handleLogin = async () => {
    if (!selectedUser) return;
    
    const user = DEFAULT_USERS.find(u => u.username === selectedUser);
    if (user) {
      // Nastavíme uživatele přímo v auth stavu bez přihlášení přes Supabase
      console.log(`Přihlašování uživatele ${user.username} s ID ${user.id}`);
      
      // Zkontrolujeme statistiky před přihlášením
      const mathKey = `mathStats_${user.id}`;
      const spellingKey = `spellingStats_${user.id}`;
      
      const mathStats = localStorage.getItem(mathKey);
      const spellingStats = localStorage.getItem(spellingKey);
      
      console.log(`Statistiky uživatele ${user.username} před přihlášením:`, {
        mathStats: mathStats ? JSON.parse(mathStats).length : 0,
        spellingStats: spellingStats ? JSON.parse(spellingStats).length : 0
      });
      
      // Uistíme se, že statistiky existují
      if (!mathStats) {
        localStorage.setItem(mathKey, JSON.stringify([]));
      }
      
      if (!spellingStats) {
        localStorage.setItem(spellingKey, JSON.stringify([]));
      }
      
      setLocalUser(user);
      toast.success(`Přihlášen jako ${user.username}`);
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Procvička App</CardTitle>
          <CardDescription className="text-center">
            Vyberte si, kdo jste
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <RadioGroup 
              value={selectedUser || ""} 
              onValueChange={setSelectedUser}
              className="flex flex-col space-y-3"
            >
              {DEFAULT_USERS.map((user) => (
                <div key={user.username} className="flex items-center space-x-2">
                  <RadioGroupItem value={user.username} id={user.username} />
                  <Label htmlFor={user.username} className="text-lg">{user.username}</Label>
                </div>
              ))}
            </RadioGroup>
            
            <Button 
              onClick={handleLogin} 
              className="w-full bg-orange-500 hover:bg-orange-600" 
              disabled={authState.isLoading || !selectedUser || initializing}
            >
              {authState.isLoading ? "Přihlašování..." : "Pokračovat"}
            </Button>
          </div>
        </CardContent>
        
        <CardFooter>
          <p className="text-xs text-center w-full text-gray-500">
            Vyberte si uživatele pro ukládání vašich statistik.
          </p>
        </CardFooter>
      </Card>
      <AppFooter />
    </div>
  );
};

export default Auth;

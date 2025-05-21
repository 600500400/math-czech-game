
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

// Předem definovaní uživatelé s UUID formátem ID
const DEFAULT_USERS = [
  { id: uuidv4(), email: "", username: "Míša", role: "child" },
  { id: uuidv4(), email: "", username: "Gábi", role: "child" },
  { id: uuidv4(), email: "", username: "Host", role: "child" },
];

const Auth = () => {
  const { authState, setLocalUser } = useAuth();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  
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
      setLocalUser(user);
      toast.success(`Přihlášen jako ${user.username}`);
      navigate("/");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
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
              disabled={authState.isLoading || !selectedUser}
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
    </div>
  );
};

export default Auth;

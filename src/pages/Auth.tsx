
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const { authState, setLocalUser, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  
  // Real auth form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  
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
  
  const handleLocalLogin = async () => {
    if (!selectedUser) return;
    
    const user = DEFAULT_USERS.find(u => u.username === selectedUser);
    if (user) {
      await setLocalUser(user);
      navigate("/");
    }
  };

  const handleRealSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setAuthLoading(true);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRealSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !username) return;
    
    setAuthLoading(true);
    try {
      await signUp(email, password, username);
      toast.success("Registrace úspěšná! Nyní se můžete přihlásit.");
    } catch (error) {
      console.error("Sign up failed:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Procvička App</CardTitle>
          <CardDescription className="text-center">
            Přihlaste se nebo si vyberte demo uživatele
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="demo" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="demo">Demo uživatelé</TabsTrigger>
              <TabsTrigger value="real">Skutečné přihlášení</TabsTrigger>
            </TabsList>
            
            <TabsContent value="demo" className="space-y-4">
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
                onClick={handleLocalLogin} 
                className="w-full bg-orange-500 hover:bg-orange-600" 
                disabled={authState.isLoading || !selectedUser || initializing}
              >
                {authState.isLoading ? "Přihlašování..." : "Pokračovat jako demo"}
              </Button>
            </TabsContent>
            
            <TabsContent value="real" className="space-y-4">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Přihlásit se</TabsTrigger>
                  <TabsTrigger value="signup">Registrovat se</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleRealSignIn} className="space-y-4">
                    <div>
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signin-password">Heslo</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-500 hover:bg-blue-600"
                      disabled={authLoading}
                    >
                      {authLoading ? "Přihlašování..." : "Přihlásit se"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleRealSignUp} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-username">Uživatelské jméno</Label>
                      <Input
                        id="signup-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-password">Heslo</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-green-500 hover:bg-green-600"
                      disabled={authLoading}
                    >
                      {authLoading ? "Registruji..." : "Registrovat se"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter>
          <p className="text-xs text-center w-full text-gray-500">
            Vyberte si demo uživatele nebo se zaregistrujte pro ukládání statistik do cloudu.
          </p>
        </CardFooter>
      </Card>
      <AppFooter />
    </div>
  );
};

export default Auth;

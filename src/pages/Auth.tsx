
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types/authTypes";

const DEFAULT_USERS = [
  { email: "rodic@example.com", password: "procvickaapp", username: "Rodič", role: "parent" as UserRole },
  { email: "dite1@example.com", password: "procvickaapp", username: "Petr", role: "child" as UserRole },
  { email: "dite2@example.com", password: "procvickaapp", username: "Jana", role: "child" as UserRole },
];

const Auth = () => {
  const { signIn, signUp, authState } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>("login");
  
  // Stav pro login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Stav pro registraci
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<UserRole>("child");

  // Pokud je uživatel již přihlášen, přesměrujeme ho na hlavní stránku
  if (authState.isAuthenticated && !authState.isLoading) {
    navigate("/");
    return null;
  }
  
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };
  
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    await signUp(registerEmail, registerPassword, username, role);
    setTab("login");
  };

  const handleQuickLogin = async (user: typeof DEFAULT_USERS[0]) => {
    await signIn(user.email, user.password);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Procvička App</CardTitle>
          <CardDescription className="text-center">
            Přihlaste se nebo zaregistrujte nový účet
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Přihlášení</TabsTrigger>
              <TabsTrigger value="register">Registrace</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="vas@email.cz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Heslo</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={authState.isLoading}>
                  {authState.isLoading ? "Přihlašování..." : "Přihlásit se"}
                </Button>
              </form>
              
              <div className="space-y-4 mt-6">
                <p className="text-center text-sm text-gray-500">Nebo použijte předem připravené účty</p>
                <div className="grid gap-2">
                  {DEFAULT_USERS.map((user) => (
                    <Button
                      key={user.email}
                      variant="outline"
                      onClick={() => handleQuickLogin(user)}
                      className="w-full"
                      disabled={authState.isLoading}
                    >
                      {user.username} ({user.role === "parent" ? "rodič" : "dítě"})
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="vas@email.cz"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Uživatelské jméno</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Vaše jméno"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Heslo</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Vyberte roli" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="child">Dítě</SelectItem>
                      <SelectItem value="parent">Rodič</SelectItem>
                      <SelectItem value="teacher">Učitel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={authState.isLoading}>
                  {authState.isLoading ? "Registrace..." : "Zaregistrovat se"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter>
          <p className="text-xs text-center w-full text-gray-500">
            Přihlášením nebo registrací souhlasíte s našimi podmínkami používání aplikace.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;

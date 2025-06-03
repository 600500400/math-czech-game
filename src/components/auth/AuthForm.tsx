
import { useState } from "react";
import { useAuthHandlers } from "@/hooks/useAuthHandlers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Mail, Lock, User, UserCheck } from "lucide-react";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"parent" | "child" | "teacher">("child");
  const [showPassword, setShowPassword] = useState(false);
  
  const { handleSignIn, handleSignUp, authLoading } = useAuthHandlers();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      await handleSignIn(email, password);
    } else {
      // Pass role in metadata for signup
      await handleSignUp(email, password, username, role);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setUsername("");
    setRole("child");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {isLogin ? "Přihlášení" : "Registrace"}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? "Přihlaste se do svého účtu" 
              : "Vytvořte si nový účet"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Celé jméno
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Zadejte své celé jméno"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={!isLogin}
                    className="pl-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role" className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Role
                  </Label>
                  <Select value={role} onValueChange={(value: "parent" | "child" | "teacher") => setRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte roli" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="child">Dítě</SelectItem>
                      <SelectItem value="parent">Rodič</SelectItem>
                      <SelectItem value="teacher">Učitel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="zadejte@email.cz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Heslo
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Zadejte heslo"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={authLoading}
            >
              {authLoading 
                ? "Zpracovávám..." 
                : isLogin 
                  ? "Přihlásit se" 
                  : "Registrovat se"
              }
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {isLogin 
                ? "Nemáte účet? Registrujte se" 
                : "Už máte účet? Přihlaste se"
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;

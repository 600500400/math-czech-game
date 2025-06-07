
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, User, Users, Heart, Home } from "lucide-react";
import { toast } from "sonner";

// Přednastavené identity
const USER_IDENTITIES = [
  {
    id: 'gabi',
    name: 'Gabi',
    role: 'child' as const,
    avatar: '👧',
    color: 'bg-pink-100 hover:bg-pink-200 border-pink-300',
    icon: Heart
  },
  {
    id: 'misa',
    name: 'Míša',
    role: 'child' as const,
    avatar: '👦',
    color: 'bg-blue-100 hover:bg-blue-200 border-blue-300',
    icon: User
  },
  {
    id: 'ada',
    name: 'Áďa',
    role: 'child' as const,
    avatar: '🧒',
    color: 'bg-green-100 hover:bg-green-200 border-green-300',
    icon: Users
  },
  {
    id: 'host',
    name: 'Host',
    role: 'child' as const,
    avatar: '👤',
    color: 'bg-orange-100 hover:bg-orange-200 border-orange-300',
    icon: User
  },
  {
    id: 'rodic',
    name: 'Rodič',
    role: 'parent' as const,
    avatar: '👨‍👩‍👧‍👦',
    color: 'bg-purple-100 hover:bg-purple-200 border-purple-300',
    icon: Crown
  }
];

const UserSelection = () => {
  const { setLocalUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleUserSelect = async (identity: typeof USER_IDENTITIES[0]) => {
    setIsLoading(true);
    
    try {
      await setLocalUser({
        id: identity.id,
        username: identity.name,
        role: identity.role
      });
      
      toast.success(`Vítej, ${identity.name}!`);
      
      // Přesměrování podle role
      if (identity.role === 'parent') {
        navigate('/parent-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Chyba při výběru identity:', error);
      toast.error('Chyba při výběru identity');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Procvička
          </h1>
          <p className="text-xl text-gray-600">
            Kdo jsi? Vyber si svou identitu
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {USER_IDENTITIES.map((identity) => {
            const IconComponent = identity.icon;
            
            return (
              <Card 
                key={identity.id} 
                className={`${identity.color} border-2 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105`}
                onClick={() => handleUserSelect(identity)}
              >
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">
                    {identity.avatar}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {identity.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-600 capitalize">
                      {identity.role === 'parent' ? 'Rodič' : 'Dítě'}
                    </span>
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Načítám...' : 'Vybrat'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Procvičuj matematiku a pravopis zábavnou formou!
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSelection;

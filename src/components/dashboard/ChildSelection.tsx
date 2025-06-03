
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UserProfile } from "@/types/authTypes";
import { CreateChildDialog } from "./CreateChildDialog";
import { useAuth } from "@/hooks/useAuth";
import { UserPlus, Users, ArrowRight } from "lucide-react";

interface ChildSelectionProps {
  children: UserProfile[];
  selectedChild: string | null;
  setSelectedChild: (id: string) => void;
  onChildCreated?: () => void;
  loading?: boolean;
}

export const ChildSelection: React.FC<ChildSelectionProps> = ({ 
  children, 
  selectedChild, 
  setSelectedChild,
  onChildCreated,
  loading = false
}) => {
  const { authState } = useAuth();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-muted-foreground">Načítám děti...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={children.length === 0 ? "border-2 border-dashed border-blue-200 bg-blue-50/30" : ""}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Výběr dítěte
            </CardTitle>
            <CardDescription>
              {children.length > 0 
                ? "Vyberte dítě, jehož výsledky chcete zobrazit"
                : "Přidejte děti pro sledování jejich pokroku"
              }
            </CardDescription>
          </div>
          {authState.user?.id && onChildCreated && (
            <CreateChildDialog 
              parentId={authState.user.id}
              onChildCreated={onChildCreated}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children.length > 0 ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {children.map(child => (
                <Button 
                  key={child.id}
                  onClick={() => setSelectedChild(child.id)}
                  variant={selectedChild === child.id ? "default" : "outline"}
                  className="min-w-[120px] h-12 text-sm font-medium"
                  size="lg"
                >
                  <span className="mr-2">👤</span>
                  {child.username}
                </Button>
              ))}
            </div>
            
            {selectedChild && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Zobrazuji data pro: <strong>{children.find(c => c.id === selectedChild)?.username}</strong>
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Zatím nemáte přidané žádné děti
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Pro zobrazení statistik a pokroku ve vašem dashboardu potřebujete vytvořit profily vašich dětí.
            </p>
            
            <div className="space-y-4">
              {authState.user?.id && onChildCreated && (
                <div className="flex justify-center">
                  <CreateChildDialog 
                    parentId={authState.user.id}
                    onChildCreated={onChildCreated}
                  />
                </div>
              )}
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">!</div>
                  <div className="text-sm">
                    <p className="font-medium text-amber-800 mb-1">Jak začít:</p>
                    <ul className="text-amber-700 space-y-1 text-xs">
                      <li>1. Klikněte na "Přidat dítě" výše</li>
                      <li>2. Vytvořte profil vašeho dítěte</li>
                      <li>3. Dítě může začít procvičovat</li>
                      <li>4. Výsledky se zobrazí zde automaticky</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

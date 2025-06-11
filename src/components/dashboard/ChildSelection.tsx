
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UserProfile } from "@/types/authTypes";
import { UserTheme, useUserTheme } from "@/hooks/useUserTheme";
import { Users, ArrowRight } from "lucide-react";

interface ChildSelectionProps {
  children: UserProfile[];
  selectedChild: string | null;
  setSelectedChild: (id: string) => void;
  loading?: boolean;
  selectedTheme?: UserTheme;
}

export const ChildSelection: React.FC<ChildSelectionProps> = ({ 
  children, 
  selectedChild, 
  setSelectedChild,
  loading = false,
  selectedTheme
}) => {
  const { userThemes } = useUserTheme(null);

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

  const cardTheme = selectedTheme || userThemes.default;

  return (
    <Card 
      className="border-2 transition-all duration-300"
      style={{
        borderColor: cardTheme.primaryColor,
        background: `linear-gradient(135deg, ${cardTheme.secondaryColor}20, ${cardTheme.primaryColor}10)`
      }}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Users className="h-5 w-5" style={{ color: cardTheme.primaryColor }} />
          Výběr dítěte
        </CardTitle>
        <CardDescription>
          Vyberte dítě, jehož výsledky chcete zobrazit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {children.map(child => {
              const childTheme = userThemes[child.id] || userThemes.default;
              const isSelected = selectedChild === child.id;
              
              return (
                <Button 
                  key={child.id}
                  onClick={() => setSelectedChild(child.id)}
                  variant={isSelected ? "default" : "outline"}
                  className={`h-20 text-sm font-medium transition-all duration-300 ${
                    isSelected 
                      ? "shadow-lg transform scale-105" 
                      : "hover:scale-102 hover:shadow-md"
                  }`}
                  style={isSelected ? {
                    background: `linear-gradient(135deg, ${childTheme.primaryColor}, ${childTheme.accentColor})`,
                    color: 'white',
                    border: 'none'
                  } : {
                    borderColor: childTheme.primaryColor,
                    color: childTheme.primaryColor
                  }}
                  size="lg"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{childTheme.avatar}</span>
                    <span className="text-xs font-semibold">{child.username}</span>
                  </div>
                </Button>
              );
            })}
          </div>
          
          {selectedChild && (
            <div 
              className="border rounded-lg p-3 transition-all duration-300"
              style={{
                backgroundColor: `${cardTheme.secondaryColor}40`,
                borderColor: cardTheme.primaryColor
              }}
            >
              <p className="text-sm flex items-center gap-2" style={{ color: cardTheme.accentColor }}>
                <ArrowRight className="h-4 w-4" />
                Zobrazuji data pro: <strong>{children.find(c => c.id === selectedChild)?.username}</strong>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

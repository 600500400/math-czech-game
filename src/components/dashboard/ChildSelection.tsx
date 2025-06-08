
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UserProfile } from "@/types/authTypes";
import { Users, ArrowRight } from "lucide-react";

interface ChildSelectionProps {
  children: UserProfile[];
  selectedChild: string | null;
  setSelectedChild: (id: string) => void;
  loading?: boolean;
}

export const ChildSelection: React.FC<ChildSelectionProps> = ({ 
  children, 
  selectedChild, 
  setSelectedChild,
  loading = false
}) => {
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
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Users className="h-5 w-5 text-blue-500" />
          Výběr dítěte
        </CardTitle>
        <CardDescription>
          Vyberte dítě, jehož výsledky chcete zobrazit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {children.map(child => (
              <Button 
                key={child.id}
                onClick={() => setSelectedChild(child.id)}
                variant={selectedChild === child.id ? "default" : "outline"}
                className={`h-16 text-sm font-medium transition-all duration-200 ${
                  selectedChild === child.id 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg" 
                    : "hover:bg-blue-50 hover:border-blue-300"
                }`}
                size="lg"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">👤</span>
                  <span className="text-xs">{child.username}</span>
                </div>
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
      </CardContent>
    </Card>
  );
};

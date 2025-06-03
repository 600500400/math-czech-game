
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EmptyDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-6">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-center">
            <Users className="h-6 w-6" />
            Vítejte v rodičovském dashboardu
          </CardTitle>
          <CardDescription>
            Zatím nemáte přidané žádné děti k sledování jejich pokroku
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Přidejte děti
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Vytvořte účty pro vaše děti nebo je připojte k vašemu účtu
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/auth')}
              >
                Přidat dítě
              </Button>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Procvičování
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Vaše děti mohou začít procvičovat matematiku a pravopis
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
              >
                Začít procvičovat
              </Button>
            </Card>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Jak začít:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Vytvořte účty pro vaše děti s rolí "Dítě"</li>
              <li>Propojte jejich účty s vaším rodičovským účtem</li>
              <li>Děti mohou začít procvičovat a vy budete vidět jejich pokrok</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

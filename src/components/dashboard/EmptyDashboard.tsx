
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, BookOpen, ArrowRight, Lightbulb, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreateChildDialog } from "./CreateChildDialog";
import { useAuth } from "@/hooks/useAuth";

interface EmptyDashboardProps {
  onChildCreated?: () => void;
}

export const EmptyDashboard: React.FC<EmptyDashboardProps> = ({ onChildCreated }) => {
  const navigate = useNavigate();
  const { authState } = useAuth();

  return (
    <div className="space-y-8">
      {/* Main Welcome Card */}
      <Card className="mx-auto max-w-4xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl">Vítejte v rodičovském dashboardu! 👋</CardTitle>
          <CardDescription className="text-lg">
            Začněte sledovat pokrok vašich dětí v matematice a pravopisu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Call to Action */}
          <div className="bg-white rounded-lg p-6 border-2 border-blue-200 text-center">
            <UserPlus className="h-12 w-12 text-blue-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-2">Přidejte své první dítě</h3>
            <p className="text-gray-600 mb-4">
              Pro zobrazení statistik a pokroku potřebujete vytvořit profil alespoň jednoho dítěte.
            </p>
            {authState.user?.id && onChildCreated && (
              <CreateChildDialog 
                parentId={authState.user.id}
                onChildCreated={onChildCreated}
              />
            )}
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="text-center p-4 bg-white/70">
              <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold mb-2">Sledujte pokrok</h4>
              <p className="text-sm text-gray-600">
                Detailní statistiky výkonu v matematice a pravopisu
              </p>
            </Card>
            
            <Card className="text-center p-4 bg-white/70">
              <BookOpen className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold mb-2">Analyzujte výsledky</h4>
              <p className="text-sm text-gray-600">
                Grafy, trendy a porovnání mezi dětmi
              </p>
            </Card>
            
            <Card className="text-center p-4 bg-white/70">
              <Lightbulb className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h4 className="font-semibold mb-2">Získejte přehled</h4>
              <p className="text-sm text-gray-600">
                Exporty dat a pokročilé analýzy
              </p>
            </Card>
          </div>

          {/* How it Works */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-blue-500" />
              Jak to funguje
            </h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <p className="font-medium">Vytvořte profil dítěte</p>
                  <p className="text-gray-600">Použijte tlačítko "Přidat dítě" výše</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <p className="font-medium">Dítě začne procvičovat</p>
                  <p className="text-gray-600">Na hlavní stránce aplikace</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <p className="font-medium">Sledujte výsledky</p>
                  <p className="text-gray-600">Automaticky se zobrazí zde</p>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Přejít na procvičování
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Spravovat účty
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Tipy pro začátek
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Můžete přidat více dětí najednou a porovnávat jejich výkony</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Dashboard se aktualizuje automaticky při každé hře vašich dětí</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>V záložce "Export" si můžete stáhnout data pro podrobnou analýzu</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

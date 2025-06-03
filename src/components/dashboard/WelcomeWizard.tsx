
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, ArrowRight, CheckCircle, Users, BookOpen } from "lucide-react";
import { CreateChildDialog } from "./CreateChildDialog";

interface WelcomeWizardProps {
  parentId: string;
  onChildCreated: () => void;
  onDismiss: () => void;
}

export const WelcomeWizard: React.FC<WelcomeWizardProps> = ({
  parentId,
  onChildCreated,
  onDismiss
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Vítejte v rodičovském dashboardu! 👋",
      description: "Zde můžete sledovat pokrok vašich dětí v matematice a pravopisu.",
      icon: <Users className="h-8 w-8 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Váš dashboard vám umožní:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Sledovat výsledky a pokrok vašich dětí
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Zobrazovat detailní statistiky a grafy
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Porovnávat výkony mezi dětmi
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Exportovat data pro další analýzu
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "Přidejte své první dítě",
      description: "Pro začátek potřebujete vytvořit profil alespoň jednoho dítěte.",
      icon: <UserPlus className="h-8 w-8 text-green-500" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Jak to funguje:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Vytvoříte profil dítěte pomocí tlačítka níže</li>
              <li>Dítě může začít procvičovat matematiku a pravopis</li>
              <li>Výsledky se automaticky zobrazí ve vašem dashboardu</li>
            </ol>
          </div>
          <div className="flex justify-center">
            <CreateChildDialog 
              parentId={parentId}
              onChildCreated={() => {
                onChildCreated();
                setCurrentStep(2);
              }}
            />
          </div>
        </div>
      )
    },
    {
      title: "Hotovo! 🎉",
      description: "Nyní můžete začít používat rodičovský dashboard.",
      icon: <BookOpen className="h-8 w-8 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Skvěle! Váš dashboard je nyní připraven k použití.
            </p>
            <Badge variant="secondary" className="mb-4">
              Můžete přidat další děti kdykoli pomocí tlačítka "Přidat dítě"
            </Badge>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Další kroky:</h4>
            <ul className="text-sm space-y-1">
              <li>• Prozkoumejte jednotlivé záložky dashboardu</li>
              <li>• Nechte děti začít procvičovat</li>
              <li>• Sledujte jejich pokrok v reálném čase</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {steps[currentStep].icon}
              <div>
                <CardTitle className="text-xl">{steps[currentStep].title}</CardTitle>
                <p className="text-gray-600 text-sm mt-1">{steps[currentStep].description}</p>
              </div>
            </div>
            <Badge variant="outline">
              {currentStep + 1} / {steps.length}
            </Badge>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {steps[currentStep].content}
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Zpět
            </Button>
            
            <div className="flex gap-2">
              {currentStep === steps.length - 1 ? (
                <Button onClick={onDismiss}>
                  Začít používat dashboard
                </Button>
              ) : (
                <Button onClick={nextStep} disabled={currentStep === 1}>
                  Další <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
              
              <Button variant="ghost" onClick={onDismiss} className="text-gray-500">
                Přeskočit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

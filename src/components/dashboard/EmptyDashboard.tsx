
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const EmptyDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="py-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Zatím nemáte přiřazené žádné děti</h3>
          <p className="text-gray-500 mb-4">
            Pro zobrazení statistik je potřeba nejprve propojit váš účet s účty vašich dětí
          </p>
          <Button onClick={() => navigate("/")}>
            Zpět na hlavní stránku
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

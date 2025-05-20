
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UserProfile } from "@/types/authTypes";

interface ChildSelectionProps {
  children: UserProfile[];
  selectedChild: string | null;
  setSelectedChild: (id: string) => void;
}

export const ChildSelection: React.FC<ChildSelectionProps> = ({ 
  children, 
  selectedChild, 
  setSelectedChild 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Výběr dítěte</CardTitle>
        <CardDescription>
          Vyberte dítě, jehož výsledky chcete zobrazit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {children.map(child => (
            <Button 
              key={child.id}
              onClick={() => setSelectedChild(child.id)}
              variant={selectedChild === child.id ? "default" : "outline"}
              className="min-w-[100px]"
            >
              {child.username}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

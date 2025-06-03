
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UserProfile } from "@/types/authTypes";
import { CreateChildDialog } from "./CreateChildDialog";
import { useAuth } from "@/hooks/useAuth";

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
          <p className="text-center text-muted-foreground">Načítám děti...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Výběr dítěte</CardTitle>
            <CardDescription>
              Vyberte dítě, jehož výsledky chcete zobrazit
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
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Zatím nemáte přidané žádné děti
            </p>
            {authState.user?.id && onChildCreated && (
              <CreateChildDialog 
                parentId={authState.user.id}
                onChildCreated={onChildCreated}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

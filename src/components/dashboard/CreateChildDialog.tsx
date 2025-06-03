
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateChildDialogProps {
  parentId: string;
  onChildCreated: () => void;
}

export const CreateChildDialog: React.FC<CreateChildDialogProps> = ({
  parentId,
  onChildCreated
}) => {
  const [open, setOpen] = useState(false);
  const [childName, setChildName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreateChild = async () => {
    if (!childName.trim()) {
      toast.error("Zadejte jméno dítěte");
      return;
    }

    setCreating(true);
    try {
      // Create child profile
      const childId = crypto.randomUUID();
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: childId,
          full_name: childName.trim(),
          role: 'child'
        });

      if (profileError) {
        console.error("Chyba při vytváření profilu dítěte:", profileError);
        toast.error("Nepodařilo se vytvořit profil dítěte");
        return;
      }

      // Create parent-child relationship
      const { error: relationshipError } = await supabase
        .from('parent_child')
        .insert({
          parent_id: parentId,
          child_id: childId
        });

      if (relationshipError) {
        console.error("Chyba při vytváření vztahu:", relationshipError);
        toast.error("Nepodařilo se propojit dítě s rodičem");
        return;
      }

      toast.success(`Dítě "${childName}" bylo úspěšně přidáno`);
      setChildName("");
      setOpen(false);
      onChildCreated();
      
    } catch (error) {
      console.error("Neočekávaná chyba:", error);
      toast.error("Došlo k neočekávané chybě");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Přidat dítě
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Přidat nové dítě</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="childName">Jméno dítěte</Label>
            <Input
              id="childName"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Zadejte jméno dítěte"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateChild()}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Zrušit
            </Button>
            <Button onClick={handleCreateChild} disabled={creating}>
              {creating ? "Vytváří se..." : "Vytvořit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

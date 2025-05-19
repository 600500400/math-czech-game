
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SpellingGroup } from "@/data/spellingData";

interface GroupSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spellingGroups: SpellingGroup[];
  selectedGroups: string[];
  toggleGroup: (groupName: string) => void;
  setGroups: () => void;
}

export const GroupSelectionDialog = ({
  open,
  onOpenChange,
  spellingGroups,
  selectedGroups,
  toggleGroup,
  setGroups
}: GroupSelectionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Výběr skupin vyjmenovaných slov</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-2">Vyberte skupiny vyjmenovaných slov:</p>
          <div className="space-y-2">
            {spellingGroups.map(group => (
              <div key={group.name} className="flex items-center space-x-2">
                <Checkbox 
                  id={`group-${group.name}`} 
                  checked={selectedGroups.includes(group.name)}
                  onCheckedChange={() => toggleGroup(group.name)}
                />
                <Label htmlFor={`group-${group.name}`}>Vyjmenovaná slova po {group.name}</Label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={setGroups}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Potvrdit výběr
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

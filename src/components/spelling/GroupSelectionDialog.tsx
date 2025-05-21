
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SpellingGroup } from "@/types/spellingTypes";
import { Toggle } from "@/components/ui/toggle";

interface GroupSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spellingGroups: SpellingGroup[];
  selectedGroups: string[];
  toggleGroup: (groupName: string) => void;
  setGroups: () => void;
  toggleAllGroups: () => void;
  allSelected: boolean;
}

export const GroupSelectionDialog = ({
  open,
  onOpenChange,
  spellingGroups,
  selectedGroups,
  toggleGroup,
  setGroups,
  toggleAllGroups,
  allSelected
}: GroupSelectionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-orange-500">Výběr skupin vyjmenovaných slov</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex justify-center mb-4">
            <Toggle
              pressed={allSelected}
              onPressedChange={toggleAllGroups}
              variant="outline"
              className="border-orange-300 hover:bg-orange-50 data-[state=on]:bg-orange-100"
            >
              {allSelected ? "Zrušit výběr" : "Vybrat vše"}
            </Toggle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {spellingGroups.map(group => (
              <div 
                key={group.name} 
                className={`flex items-center space-x-2 p-3 border-2 rounded-lg transition-all duration-200 ${
                  selectedGroups.includes(group.name) 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
                onClick={() => toggleGroup(group.name)}
              >
                <Checkbox 
                  id={`group-${group.name}`} 
                  checked={selectedGroups.includes(group.name)}
                  onCheckedChange={() => toggleGroup(group.name)}
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
                <Label 
                  htmlFor={`group-${group.name}`}
                  className="cursor-pointer font-medium text-lg flex-1"
                >
                  Vyjmenovaná slova po {group.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={setGroups}
            className="bg-orange-500 hover:bg-orange-600 w-full text-lg py-6"
          >
            Potvrdit výběr
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

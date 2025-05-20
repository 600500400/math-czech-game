
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { spellingGroups } from "@/data/spellingData";

export function useGroupSelection() {
  const { toast } = useToast();
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [showGroupDialog, setShowGroupDialog] = useState(false);

  const toggleGroup = (groupName: string) => {
    setSelectedGroups((current) => 
      current.includes(groupName)
        ? current.filter(name => name !== groupName)
        : [...current, groupName]
    );
  };

  const selectAll = () => {
    const allGroups = spellingGroups.map(group => group.name);
    setSelectedGroups(allGroups);
  };

  const deselectAll = () => {
    setSelectedGroups([]);
  };

  const setGroups = () => {
    if (selectedGroups.length > 0) {
      setShowGroupDialog(false);
      toast({
        title: "Skupiny nastaveny",
        description: `Vybrané skupiny: ${selectedGroups.join(", ")}`,
      });
    } else {
      toast({
        title: "Chyba",
        description: "Vyberte alespoň jednu skupinu vyjmenovaných slov.",
        variant: "destructive",
      });
    }
  };

  return {
    selectedGroups,
    showGroupDialog,
    setShowGroupDialog,
    toggleGroup,
    setGroups,
    selectAll,
    deselectAll
  };
}

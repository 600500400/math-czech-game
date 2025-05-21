
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { spellingGroups } from "@/data/spellingData";

export function useGroupSelection() {
  const { toast } = useToast();
  // Initialize with all groups selected by default
  const allGroupNames = spellingGroups.map(group => group.name);
  const [selectedGroups, setSelectedGroups] = useState<string[]>(allGroupNames);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [allSelected, setAllSelected] = useState(true); // Track selection state

  const toggleGroup = (groupName: string) => {
    setSelectedGroups((current) => 
      current.includes(groupName)
        ? current.filter(name => name !== groupName)
        : [...current, groupName]
    );
    
    // Update allSelected state based on selection
    const updatedGroups = selectedGroups.includes(groupName)
      ? selectedGroups.filter(name => name !== groupName)
      : [...selectedGroups, groupName];
      
    setAllSelected(updatedGroups.length === spellingGroups.length);
  };

  // Toggle between all and none
  const toggleAllGroups = () => {
    if (allSelected) {
      setSelectedGroups([]);
      setAllSelected(false);
    } else {
      selectAll();
    }
  };

  const selectAll = () => {
    const allGroups = spellingGroups.map(group => group.name);
    setSelectedGroups(allGroups);
    setAllSelected(true);
  };

  const deselectAll = () => {
    setSelectedGroups([]);
    setAllSelected(false);
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
    deselectAll,
    toggleAllGroups,
    allSelected
  };
}


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { DonateDialog } from "./DonateDialog";

const DonateButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setDialogOpen(true)}
        className="w-9 p-0 sm:w-auto sm:px-3"
      >
        <Heart className="h-4 w-4 text-red-500 sm:mr-2" />
        <span className="hidden sm:inline">Podpořit</span>
      </Button>
      <DonateDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default DonateButton;

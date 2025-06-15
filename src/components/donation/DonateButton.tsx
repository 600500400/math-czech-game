
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { DonateDialog } from "./DonateDialog";

const DonateButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
        <Heart className="mr-2 h-4 w-4 text-red-500" />
        Podpořit
      </Button>
      <DonateDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default DonateButton;

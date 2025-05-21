
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const UnauthenticatedState = () => {
  return (
    <div className="flex flex-col items-center gap-2 py-4 text-center">
      <p className="text-center text-gray-500">Pro zobrazení statistik se přihlaste.</p>
      
      <Link to="/auth">
        <Button variant="outline" size="sm" className="mt-2">
          <LogIn className="h-4 w-4 mr-1" />
          Přihlásit se
        </Button>
      </Link>
    </div>
  );
};

export default UnauthenticatedState;

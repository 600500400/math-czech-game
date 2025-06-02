
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

const UnauthenticatedState = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
        <LogIn className="h-8 w-8 text-blue-600" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          Pro zobrazení statistik se přihlaste
        </h3>
        <p className="text-gray-500 max-w-md">
          Přihlašte se nebo se zaregistrujte pro uložení pokroku do cloudu a přístup k pokročilým funkcím.
        </p>
      </div>
      
      <Link to="/auth">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
          <LogIn className="h-4 w-4 mr-2" />
          Přihlásit se
        </Button>
      </Link>
    </div>
  );
};

export default UnauthenticatedState;

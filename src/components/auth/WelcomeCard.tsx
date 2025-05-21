
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const WelcomeCard = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="w-full max-w-md mx-auto p-6 shadow-lg">
      <div className="text-center py-4 space-y-4">
        <h2 className="text-2xl font-bold">Vítejte v aplikaci Procvička</h2>
        <p className="text-gray-600">
          Pro využití všech funkcí se prosím přihlaste nebo zaregistrujte.
        </p>
        <Button onClick={() => navigate("/auth")} className="bg-orange-500 hover:bg-orange-600">
          Vybrat uživatele
        </Button>
      </div>
    </Card>
  );
};

export default WelcomeCard;

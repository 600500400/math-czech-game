
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, Star } from "lucide-react";

const WelcomeCard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full max-w-lg mx-auto space-y-6 animate-fade-in">
      {/* Main Welcome Card */}
      <Card className="glass border-0 shadow-2xl overflow-hidden">
        <div className="relative p-8 text-center">
          {/* Decorative Elements */}
          <div className="absolute top-4 left-4">
            <Sparkles className="w-6 h-6 text-brand-500 animate-pulse" />
          </div>
          <div className="absolute top-4 right-4">
            <Star className="w-6 h-6 text-yellow-400 animate-bounce" />
          </div>
          <div className="absolute bottom-4 left-4">
            <Star className="w-4 h-4 text-brand-300 animate-pulse" />
          </div>
          <div className="absolute bottom-4 right-4">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-bounce" />
          </div>

          {/* Logo */}
          <div className="relative mx-auto mb-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-2xl mx-auto animate-float">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-glow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-heading font-bold gradient-text">
              Vítejte v aplikaci Procvička
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Moderní způsob, jak se učit matematiku a pravopis. 
              Zábavné procvičování s okamžitou zpětnou vazbou!
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4 py-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto">
                  <span className="text-2xl">🧮</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Matematika</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center mx-auto">
                  <span className="text-2xl">✏️</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Pravopis</p>
              </div>
            </div>

            <Button 
              onClick={() => navigate("/auth")} 
              className="bg-gradient-primary hover:scale-105 transition-all duration-300 text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl"
            >
              Začít se učit 🚀
            </Button>
          </div>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="glass border-0 shadow-lg">
        <div className="p-6 text-center">
          <p className="text-sm text-gray-600">
            Pro využití všech funkcí se prosím přihlaste nebo zaregistrujte.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default WelcomeCard;

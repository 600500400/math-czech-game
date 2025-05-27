
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

const AppFooter = () => {
  const handleFeedback = () => {
    toast.info("Feedback funkcionalita bude brzy dostupná!");
  };

  return (
    <footer className="w-full max-w-md mx-auto mt-8 mb-4 text-center">
      <div className="flex justify-center items-center gap-4 text-xs text-gray-500">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFeedback}
          className="h-auto p-1 text-xs text-gray-500 hover:text-gray-700"
        >
          <MessageSquare className="h-3 w-3 mr-1" />
          Feedback
        </Button>
        <span>© 2025 Procvička App</span>
      </div>
    </footer>
  );
};

export default AppFooter;

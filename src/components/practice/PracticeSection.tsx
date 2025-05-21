
import { Card } from "@/components/ui/card";
import PracticeTabs from "./PracticeTabs";

const PracticeSection = () => {
  return (
    <Card className="w-full max-w-md mx-auto p-6 shadow-lg">
      <PracticeTabs />
    </Card>
  );
};

export default PracticeSection;

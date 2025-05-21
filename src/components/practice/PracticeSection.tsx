
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MathPractice from "../MathPractice";
import SpellingPractice from "../SpellingPractice";

const PracticeSection = () => {
  return (
    <Card className="w-full max-w-md mx-auto p-6 shadow-lg">
      <Tabs defaultValue="spelling" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="spelling">Vyjmenovaná slova</TabsTrigger>
          <TabsTrigger value="math">Matematika</TabsTrigger>
        </TabsList>
        <TabsContent value="spelling">
          <SpellingPractice />
        </TabsContent>
        <TabsContent value="math">
          <MathPractice />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default PracticeSection;

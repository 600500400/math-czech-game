
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MathPractice from "../MathPractice";
import SpellingPractice from "../SpellingPractice";

interface PracticeTabsProps {
  defaultTab?: "spelling" | "math";
}

const PracticeTabs = ({ defaultTab = "spelling" }: PracticeTabsProps) => {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
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
  );
};

export default PracticeTabs;

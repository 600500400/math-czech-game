
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatisticsTable from "./StatisticsTable";
import { MathStatistics, SpellingStatistics } from "@/types/authTypes";

interface StatisticsTabsProps {
  mathStats: MathStatistics[];
  spellingStats: SpellingStatistics[];
}

const StatisticsTabs = ({ mathStats, spellingStats }: StatisticsTabsProps) => {
  return (
    <Tabs defaultValue="spelling">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="spelling">Vyjmenovaná slova</TabsTrigger>
        <TabsTrigger value="math">Matematika</TabsTrigger>
      </TabsList>
      
      <TabsContent value="spelling" className="mt-4">
        <StatisticsTable 
          type="spelling" 
          data={spellingStats} 
        />
      </TabsContent>
      
      <TabsContent value="math" className="mt-4">
        <StatisticsTable 
          type="math" 
          data={mathStats} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default StatisticsTabs;

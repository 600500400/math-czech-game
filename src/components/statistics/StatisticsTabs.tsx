
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatisticsTable from "./StatisticsTable";
import { MathStatistics, SpellingStatistics } from "@/types/authTypes";
import { FileText, Calculator } from "lucide-react";

interface StatisticsTabsProps {
  mathStats: MathStatistics[];
  spellingStats: SpellingStatistics[];
}

const StatisticsTabs = ({ mathStats, spellingStats }: StatisticsTabsProps) => {
  return (
    <Tabs defaultValue="spelling">
      <TabsList className="grid w-full grid-cols-2 p-2">
        <TabsTrigger 
          value="spelling" 
          className="text-base py-3 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800 data-[state=active]:shadow-sm"
        >
          <FileText className="mr-2 h-5 w-5" /> Vyjmenovaná slova
        </TabsTrigger>
        <TabsTrigger 
          value="math" 
          className="text-base py-3 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 data-[state=active]:shadow-sm"
        >
          <Calculator className="mr-2 h-5 w-5" /> Matematika
        </TabsTrigger>
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

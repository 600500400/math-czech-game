
import { useState } from "react";
import MathPractice from "../components/MathPractice";
import SpellingPractice from "../components/SpellingPractice";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
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
    </div>
  );
};

export default Index;

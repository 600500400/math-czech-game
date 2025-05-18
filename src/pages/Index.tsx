
import { useState } from "react";
import MathPractice from "../components/MathPractice";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <MathPractice />
      </Card>
    </div>
  );
};

export default Index;

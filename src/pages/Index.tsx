
import { useState } from "react";
import MathPractice from "../components/MathPractice";
import SpellingPractice from "../components/SpellingPractice";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { authState } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-4">
      <header className="w-full max-w-md mx-auto flex justify-between mb-4">
        <h1 className="text-xl font-bold text-orange-500">Procvička App</h1>
        <UserMenu />
      </header>
      
      {authState.isAuthenticated ? (
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
      ) : (
        <Card className="w-full max-w-md mx-auto p-6 shadow-lg">
          <div className="text-center py-4 space-y-4">
            <h2 className="text-2xl font-bold">Vítejte v aplikaci Procvička</h2>
            <p className="text-gray-600">
              Pro využití všech funkcí se prosím přihlaste nebo zaregistrujte.
            </p>
            <UserMenu />
          </div>
        </Card>
      )}
    </div>
  );
};

export default Index;

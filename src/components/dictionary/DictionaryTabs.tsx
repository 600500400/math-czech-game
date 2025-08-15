
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DictionaryPractice from "./DictionaryPractice";
import DictionaryAdd from "./DictionaryAdd";
import DictionaryList from "./DictionaryList";
import { useAuth } from "@/hooks/useAuth";

export default function DictionaryTabs() {
  const [activeTab, setActiveTab] = useState("practice");
  const { authState } = useAuth();

  if (!authState.user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Přihlášení potřebné</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Pro používání slovníčku se musíte přihlásit.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="practice">Procvičování</TabsTrigger>
          <TabsTrigger value="add">Přidat</TabsTrigger>
          <TabsTrigger value="list">Seznam</TabsTrigger>
        </TabsList>

        <TabsContent value="practice">
          <DictionaryPractice />
        </TabsContent>

        <TabsContent value="add">
          <DictionaryAdd />
        </TabsContent>

        <TabsContent value="list">
          <DictionaryList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

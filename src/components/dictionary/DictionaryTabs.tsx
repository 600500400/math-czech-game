
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DictionaryPractice from "./DictionaryPractice";
import DictionaryAdd from "./DictionaryAdd";
import DictionaryList from "./DictionaryList";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

export default function DictionaryTabs() {
  const [activeTab, setActiveTab] = useState("practice");
  const { authState } = useAuth();
  const { t } = useLanguage();

  if (!authState.user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('dictionary.loginRequired')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t('dictionary.loginRequiredDescription')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="practice">{t('dictionary.practice')}</TabsTrigger>
          <TabsTrigger value="add">{t('dictionary.add')}</TabsTrigger>
          <TabsTrigger value="list">{t('dictionary.list')}</TabsTrigger>
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

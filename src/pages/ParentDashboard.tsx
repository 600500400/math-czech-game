
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, MathStatistics, SpellingStatistics } from "@/types/authTypes";
import { Calendar } from "lucide-react";

const ParentDashboard = () => {
  const { authState, signOut } = useAuth();
  const navigate = useNavigate();
  const { userId } = { userId: authState.user?.id };
  const { mathStats, spellingStats } = useStatistics(userId);
  
  const [children, setChildren] = useState<UserProfile[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [childMathStats, setChildMathStats] = useState<MathStatistics[]>([]);
  const [childSpellingStats, setChildSpellingStats] = useState<SpellingStatistics[]>([]);
  
  // Kontrola, zda je přihlášený uživatel rodič
  useEffect(() => {
    if (authState.profile && authState.profile.role !== "parent") {
      navigate("/");
    }
  }, [authState.profile, navigate]);
  
  // Načtení dětí přihlášeného rodiče
  useEffect(() => {
    const fetchChildren = async () => {
      if (!userId) return;
      
      try {
        // Nejprve získáme ID dětí z parent_child tabulky
        const { data: childRelations, error: relationsError } = await supabase
          .from("parent_child")
          .select("child_id")
          .eq("parent_id", userId);
          
        if (relationsError) throw relationsError;
        
        if (childRelations && childRelations.length > 0) {
          const childIds = childRelations.map(relation => relation.child_id);
          
          // Poté získáme profily dětí
          const { data: childProfiles, error: profilesError } = await supabase
            .from("profiles")
            .select("*")
            .in("id", childIds);
            
          if (profilesError) throw profilesError;
          
          setChildren(childProfiles as UserProfile[]);
          if (childProfiles && childProfiles.length > 0) {
            setSelectedChild(childProfiles[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    };
    
    fetchChildren();
  }, [userId]);
  
  // Načtení statistik vybraného dítěte
  useEffect(() => {
    const fetchChildStats = async () => {
      if (!selectedChild) return;
      
      try {
        // Načtení matematických statistik
        const { data: mathData, error: mathError } = await supabase
          .from("math_statistics")
          .select("*")
          .eq("user_id", selectedChild)
          .order("created_at", { ascending: false });
          
        if (mathError) throw mathError;
        
        // Načtení statistik pravopisu
        const { data: spellingData, error: spellingError } = await supabase
          .from("spelling_statistics")
          .select("*")
          .eq("user_id", selectedChild)
          .order("created_at", { ascending: false });
          
        if (spellingError) throw spellingError;
        
        setChildMathStats(mathData as MathStatistics[]);
        setChildSpellingStats(spellingData as SpellingStatistics[]);
      } catch (error) {
        console.error("Error fetching child statistics:", error);
      }
    };
    
    fetchChildStats();
  }, [selectedChild]);
  
  // Výpočet souhrnných statistik pro vybrané dítě
  const childMathTotal = childMathStats.reduce(
    (acc, stat) => {
      acc.correct += stat.correct_answers;
      acc.wrong += stat.wrong_answers;
      acc.total += stat.correct_answers + stat.wrong_answers;
      return acc;
    },
    { correct: 0, wrong: 0, total: 0 }
  );
  
  const childSpellingTotal = childSpellingStats.reduce(
    (acc, stat) => {
      acc.correct += stat.correct_answers;
      acc.wrong += stat.wrong_answers;
      acc.total += stat.correct_answers + stat.wrong_answers;
      return acc;
    },
    { correct: 0, wrong: 0, total: 0 }
  );
  
  const mathAccuracy = childMathTotal.total > 0 
    ? Math.round((childMathTotal.correct / childMathTotal.total) * 100) 
    : 0;
    
  const spellingAccuracy = childSpellingTotal.total > 0 
    ? Math.round((childSpellingTotal.correct / childSpellingTotal.total) * 100) 
    : 0;
    
  // Data pro grafy
  const prepareChartData = (stats: { correct: number; wrong: number }) => [
    { name: "Správně", value: stats.correct, color: "#4ade80" },
    { name: "Špatně", value: stats.wrong, color: "#f87171" }
  ];
  
  const mathChartData = prepareChartData(childMathTotal);
  const spellingChartData = prepareChartData(childSpellingTotal);
  
  // Formát data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('cs-CZ', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Rodičovský dashboard</h1>
          <p className="text-gray-600">
            Přehled výsledků vašich dětí v aplikaci Procvička
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/")} variant="outline">
            Zpět na aplikaci
          </Button>
          <Button onClick={() => signOut()} variant="destructive">
            Odhlásit se
          </Button>
        </div>
      </div>
      
      {children.length > 0 ? (
        <div className="space-y-8">
          {/* Výběr dítěte */}
          <Card>
            <CardHeader>
              <CardTitle>Výběr dítěte</CardTitle>
              <CardDescription>
                Vyberte dítě, jehož výsledky chcete zobrazit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {children.map(child => (
                  <Button 
                    key={child.id}
                    onClick={() => setSelectedChild(child.id)}
                    variant={selectedChild === child.id ? "default" : "outline"}
                    className="min-w-[100px]"
                  >
                    {child.username}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {selectedChild && (
            <>
              {/* Souhrn výsledků */}
              <Card>
                <CardHeader>
                  <CardTitle>Souhrnné statistiky</CardTitle>
                  <CardDescription>
                    Celkové výsledky vybraného dítěte v matematice a pravopisu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Matematika */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Matematika</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Úspěšnost</span>
                          <span className="font-medium">{mathAccuracy}%</span>
                        </div>
                        <Progress value={mathAccuracy} className="h-3" />
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xl font-bold text-green-500">{childMathTotal.correct}</p>
                          <p className="text-sm text-gray-500">Správně</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-red-500">{childMathTotal.wrong}</p>
                          <p className="text-sm text-gray-500">Špatně</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold">{childMathTotal.total}</p>
                          <p className="text-sm text-gray-500">Celkem</p>
                        </div>
                      </div>
                      {childMathTotal.total > 0 && (
                        <div className="h-48">
                          <ChartContainer>
                            <BarChart data={mathChartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Bar dataKey="value" name="Počet">
                                {mathChartData.map((entry, index) => (
                                  <CartesianGrid key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Legend />
                            </BarChart>
                          </ChartContainer>
                        </div>
                      )}
                    </div>
                    
                    {/* Pravopis */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Pravopis</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Úspěšnost</span>
                          <span className="font-medium">{spellingAccuracy}%</span>
                        </div>
                        <Progress value={spellingAccuracy} className="h-3" />
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xl font-bold text-green-500">{childSpellingTotal.correct}</p>
                          <p className="text-sm text-gray-500">Správně</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-red-500">{childSpellingTotal.wrong}</p>
                          <p className="text-sm text-gray-500">Špatně</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold">{childSpellingTotal.total}</p>
                          <p className="text-sm text-gray-500">Celkem</p>
                        </div>
                      </div>
                      {childSpellingTotal.total > 0 && (
                        <div className="h-48">
                          <ChartContainer>
                            <BarChart data={spellingChartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Bar dataKey="value" name="Počet">
                                {spellingChartData.map((entry, index) => (
                                  <CartesianGrid key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Legend />
                            </BarChart>
                          </ChartContainer>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Historie cvičení */}
              <Card>
                <CardHeader>
                  <CardTitle>Historie cvičení</CardTitle>
                  <CardDescription>
                    Podrobný přehled všech cvičení
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="math">
                    <TabsList className="mb-4">
                      <TabsTrigger value="math">Matematika</TabsTrigger>
                      <TabsTrigger value="spelling">Pravopis</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="math">
                      {childMathStats.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Datum</TableHead>
                                <TableHead>Operace</TableHead>
                                <TableHead>Obtížnost</TableHead>
                                <TableHead>Správně</TableHead>
                                <TableHead>Špatně</TableHead>
                                <TableHead>Úspěšnost</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {childMathStats.map((stat) => {
                                const total = stat.correct_answers + stat.wrong_answers;
                                const accuracy = total > 0 
                                  ? Math.round((stat.correct_answers / total) * 100) 
                                  : 0;
                                  
                                return (
                                  <TableRow key={stat.id}>
                                    <TableCell className="whitespace-nowrap">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(stat.created_at)}
                                      </div>
                                    </TableCell>
                                    <TableCell>{stat.operation}</TableCell>
                                    <TableCell>
                                      Max: {stat.difficulty_level.maxValue}, 
                                      Násobení: {stat.difficulty_level.maxMultiplyValue}, 
                                      Dělení: {stat.difficulty_level.maxDivideValue}
                                    </TableCell>
                                    <TableCell className="font-medium text-green-500">
                                      {stat.correct_answers}
                                    </TableCell>
                                    <TableCell className="font-medium text-red-500">
                                      {stat.wrong_answers}
                                    </TableCell>
                                    <TableCell>{accuracy}%</TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <p className="text-center py-4 text-gray-500">
                          Zatím nejsou k dispozici žádné statistiky pro matematiku
                        </p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="spelling">
                      {childSpellingStats.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Datum</TableHead>
                                <TableHead>Skupina slov</TableHead>
                                <TableHead>Správně</TableHead>
                                <TableHead>Špatně</TableHead>
                                <TableHead>Úspěšnost</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {childSpellingStats.map((stat) => {
                                const total = stat.correct_answers + stat.wrong_answers;
                                const accuracy = total > 0 
                                  ? Math.round((stat.correct_answers / total) * 100) 
                                  : 0;
                                  
                                return (
                                  <TableRow key={stat.id}>
                                    <TableCell className="whitespace-nowrap">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(stat.created_at)}
                                      </div>
                                    </TableCell>
                                    <TableCell>{stat.word_group}</TableCell>
                                    <TableCell className="font-medium text-green-500">
                                      {stat.correct_answers}
                                    </TableCell>
                                    <TableCell className="font-medium text-red-500">
                                      {stat.wrong_answers}
                                    </TableCell>
                                    <TableCell>{accuracy}%</TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <p className="text-center py-4 text-gray-500">
                          Zatím nejsou k dispozici žádné statistiky pro pravopis
                        </p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Zatím nemáte přiřazené žádné děti</h3>
              <p className="text-gray-500 mb-4">
                Pro zobrazení statistik je potřeba nejprve propojit váš účet s účty vašich dětí
              </p>
              <Button onClick={() => navigate("/")}>
                Zpět na hlavní stránku
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ParentDashboard;

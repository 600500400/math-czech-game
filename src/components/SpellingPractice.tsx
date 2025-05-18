
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type SpellingGroup = {
  name: string;
  words: string[];
};

const spellingGroups: SpellingGroup[] = [
  {
    name: "B",
    words: [
      "být", "bydlit", "obyvatel", "byt", "příbytek", "nábytek", "dobytek", 
      "obyčej", "bystrý", "bylina", "kobyla", "býk", "Přibyslav"
    ]
  },
  {
    name: "L",
    words: [
      "slyšet", "mlýn", "blýskat se", "polykat", "plynout", "plýtvat", "vzlykat", 
      "lysý", "lýtko", "lýko", "pelyněk", "plyš", "plynový", "vzlykat"
    ]
  },
  {
    name: "M",
    words: [
      "my", "mýt", "myslit", "mýlit se", "hmyz", "myš", "hlemýžď", "mýtit", 
      "zamykat", "smýkat", "dmýchat", "chmýří", "nachomýtnout se", "Litomyšl"
    ]
  },
  {
    name: "P",
    words: [
      "pýcha", "pytel", "pysk", "netopýr", "slepýš", "pyl", "kopyto", "klopýtat", 
      "třpytit se", "zpytovat", "pykat", "pýr", "pýřit se", "čepýřit se"
    ]
  },
  {
    name: "S",
    words: [
      "syn", "sytý", "sýr", "syrový", "sychravý", "usychat", "sýkora", "sýček", 
      "sysel", "syčet", "sypat", "vysypat", "násyp", "zásyp"
    ]
  },
  {
    name: "V",
    words: [
      "vy", "vysoký", "výt", "výskat", "zvykat", "žvýkat", "vydra", "výr", 
      "vyžle", "povyk", "výheň", "cavyky", "vyza", "Vyšehrad"
    ]
  },
  {
    name: "Z",
    words: [
      "jazyk", "nazývat", "ozývat se", "vyzývat", "zbytek", "zvedat", "způsob", 
      "zykat", "zisk", "hezký", "prazdroj", "zkouška"
    ]
  }
];

const SpellingPractice = () => {
  const { toast } = useToast();
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [problemCount, setProblemCount] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [displayedWord, setDisplayedWord] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [showProblem, setShowProblem] = useState(false);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [wordGroup, setWordGroup] = useState("");

  const toggleGroup = (groupName: string) => {
    setSelectedGroups((current) => 
      current.includes(groupName)
        ? current.filter(name => name !== groupName)
        : [...current, groupName]
    );
  };

  const setGroups = () => {
    if (selectedGroups.length > 0) {
      setShowGroupDialog(false);
      toast({
        title: "Skupiny nastaveny",
        description: `Vybrané skupiny: ${selectedGroups.join(", ")}`,
      });
    } else {
      toast({
        title: "Chyba",
        description: "Vyberte alespoň jednu skupinu vyjmenovaných slov.",
        variant: "destructive",
      });
    }
  };

  const generateProblem = (): { word: string, displayed: string, group: string } => {
    // Filter words based on selected groups
    const availableGroups = spellingGroups.filter(group => 
      selectedGroups.includes(group.name)
    );
    
    // Select random group and random word from that group
    const randomGroup = availableGroups[Math.floor(Math.random() * availableGroups.length)];
    const randomWord = randomGroup.words[Math.floor(Math.random() * randomGroup.words.length)];
    
    // Determine if we'll hide 'y' or 'i' in the word
    const wordWithMissingLetter = randomWord.replace(/[yiYI]/g, '_');
    
    return { 
      word: randomWord, 
      displayed: wordWithMissingLetter,
      group: randomGroup.name
    };
  };

  const startNewGame = () => {
    if (selectedGroups.length === 0) {
      toast({
        title: "Chyba",
        description: "Nejdříve vyberte skupiny vyjmenovaných slov.",
        variant: "destructive",
      });
      return;
    }

    setProblemCount((prev) => prev + 1);
    const problem = generateProblem();
    setCurrentWord(problem.word);
    setDisplayedWord(problem.displayed);
    setWordGroup(problem.group);
    setShowProblem(true);
    setUserAnswer("");
    setGameEnded(false);
  };

  const checkAnswer = () => {
    if (!currentWord) return;

    // Convert both strings to lowercase for comparison
    if (userAnswer.toLowerCase() === currentWord.toLowerCase()) {
      toast({
        title: "Správně!",
        variant: "default",
      });
      setCorrectAnswers((prev) => prev + 1);
    } else {
      toast({
        title: "Špatně!",
        description: `Správná odpověď byla: ${currentWord}`,
        variant: "destructive",
      });
    }
    
    startNewGame();
  };

  const endGame = () => {
    setShowProblem(false);
    setGameEnded(true);
    toast({
      title: "Hra ukončena",
      description: `Počet správných odpovědí: ${correctAnswers}`,
    });
    // Reset game state
    setProblemCount(0);
    setCorrectAnswers(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-center text-orange-500">Procvičování vyjmenovaných slov</h1>
      
      <div className="flex justify-between items-center">
        <p className="text-blue-500 font-medium">
          Počet slov: <Badge variant="outline">{problemCount}</Badge>
        </p>
        {gameEnded && (
          <p className="text-green-500 font-medium">
            Správné odpovědi: <Badge variant="outline">{correctAnswers}</Badge>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Button 
          onClick={() => setShowGroupDialog(true)} 
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          Vybrat skupiny slov
        </Button>
        
        <Button 
          onClick={startNewGame} 
          className="w-full bg-orange-500 hover:bg-orange-600" 
          disabled={selectedGroups.length === 0}
        >
          Spustit hru
        </Button>
      </div>

      {/* Group Selection Dialog */}
      <Dialog open={showGroupDialog} onOpenChange={setShowGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Výběr skupin vyjmenovaných slov</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-2">Vyberte skupiny vyjmenovaných slov:</p>
            <div className="space-y-2">
              {spellingGroups.map(group => (
                <div key={group.name} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`group-${group.name}`} 
                    checked={selectedGroups.includes(group.name)}
                    onCheckedChange={() => toggleGroup(group.name)}
                  />
                  <Label htmlFor={`group-${group.name}`}>Vyjmenovaná slova po {group.name}</Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={setGroups}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Potvrdit výběr
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Word Problem Dialog */}
      <Dialog open={showProblem} onOpenChange={(open) => !open && endGame()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Doplňte správné i/y</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {displayedWord && (
              <div className="space-y-4">
                <p className="text-center font-medium">Vyjmenované slovo po {wordGroup}</p>
                <p className="text-2xl font-bold text-center mb-4">
                  {displayedWord}
                </p>
              </div>
            )}
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Napište celé slovo správně"
              className="text-lg"
              autoFocus
            />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={checkAnswer}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
            >
              Odpovědět
            </Button>
            <Button 
              onClick={endGame}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
            >
              Ukončit hru
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpellingPractice;

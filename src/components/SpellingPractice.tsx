import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { removeDiacritics } from "@/lib/utils";

type WordType = "vyjmenované" | "příbuzné" | "odvozené";

type SpellingWord = {
  word: string;
  type: WordType;
  positions?: number[]; // Pozice, kde se má doplnit i/y (pro složitější případy)
};

type SpellingGroup = {
  name: string;
  words: SpellingWord[];
  phrases?: string[]; // Slovní spojení a věty
};

const spellingGroups: SpellingGroup[] = [
  {
    name: "B",
    words: [
      { word: "být", type: "vyjmenované" },
      { word: "bydlit", type: "vyjmenované" },
      { word: "obyvatel", type: "vyjmenované" },
      { word: "byt", type: "vyjmenované" },
      { word: "příbytek", type: "vyjmenované" },
      { word: "nábytek", type: "vyjmenované" },
      { word: "dobytek", type: "vyjmenované" },
      { word: "obyčej", type: "vyjmenované" },
      { word: "bystrý", type: "vyjmenované" },
      { word: "bylina", type: "vyjmenované" },
      { word: "kobyla", type: "vyjmenované" },
      { word: "býk", type: "vyjmenované" },
      { word: "Přibyslav", type: "vyjmenované" },
      // Příbuzná a odvozená slova
      { word: "neobyčejný", type: "příbuzné" },
      { word: "bytost", type: "příbuzné" },
      { word: "bylinný", type: "příbuzné" },
      { word: "zabydlet", type: "příbuzné" },
      { word: "býčí", type: "příbuzné" },
      { word: "bidlo", type: "odvozené" },
      { word: "nabídka", type: "odvozené" },
      { word: "bit", type: "odvozené" }
    ],
    phrases: [
      "Býk se pase na býlí",
      "V bytě je nový nábytek",
      "Obyvatelé bydlí v malých bytech",
      "Kobyla běhá po louce"
    ]
  },
  {
    name: "L",
    words: [
      { word: "slyšet", type: "vyjmenované" },
      { word: "mlýn", type: "vyjmenované" },
      { word: "blýskat se", type: "vyjmenované" },
      { word: "polykat", type: "vyjmenované" },
      { word: "plynout", type: "vyjmenované" },
      { word: "plýtvat", type: "vyjmenované" },
      { word: "vzlykat", type: "vyjmenované" },
      { word: "lysý", type: "vyjmenované" },
      { word: "lýtko", type: "vyjmenované" },
      { word: "lýko", type: "vyjmenované" },
      { word: "pelyněk", type: "vyjmenované" },
      { word: "plyš", type: "vyjmenované" },
      { word: "plynový", type: "vyjmenované" },
      { word: "vzlykat", type: "vyjmenované" },
      // Příbuzná a odvozená slova
      { word: "blýskavý", type: "příbuzné" },
      { word: "zalykat", type: "příbuzné" },
      { word: "lýkožrout", type: "příbuzné" },
      { word: "linka", type: "odvozené" },
      { word: "list", type: "odvozené" },
      { word: "lichý", type: "odvozené" }
    ],
    phrases: [
      "Na nebi se blýská",
      "Mlýn mele mouku",
      "Slyšel jsem v noci vzlykat"
    ]
  },
  {
    name: "M",
    words: [
      { word: "my", type: "vyjmenované" },
      { word: "mýt", type: "vyjmenované" },
      { word: "myslit", type: "vyjmenované" },
      { word: "mýlit se", type: "vyjmenované" },
      { word: "hmyz", type: "vyjmenované" },
      { word: "myš", type: "vyjmenované" },
      { word: "hlemýžď", type: "vyjmenované" },
      { word: "mýtit", type: "vyjmenované" },
      { word: "zamykat", type: "vyjmenované" },
      { word: "smýkat", type: "vyjmenované" },
      { word: "dmýchat", type: "vyjmenované" },
      { word: "chmýří", type: "vyjmenované" },
      { word: "nachomýtnout se", type: "vyjmenované" },
      { word: "Litomyšl", type: "vyjmenované" }
    ]
  },
  {
    name: "P",
    words: [
      { word: "pýcha", type: "vyjmenované" },
      { word: "pytel", type: "vyjmenované" },
      { word: "pysk", type: "vyjmenované" },
      { word: "netopýr", type: "vyjmenované" },
      { word: "slepýš", type: "vyjmenované" },
      { word: "pyl", type: "vyjmenované" },
      { word: "kopyto", type: "vyjmenované" },
      { word: "klopýtat", type: "vyjmenované" },
      { word: "třpytit se", type: "vyjmenované" },
      { word: "zpytovat", type: "vyjmenované" },
      { word: "pykat", type: "vyjmenované" },
      { word: "pýr", type: "vyjmenované" },
      { word: "pýřit se", type: "vyjmenované" },
      { word: "čepýřit se", type: "vyjmenované" }
    ]
  },
  {
    name: "S",
    words: [
      { word: "syn", type: "vyjmenované" },
      { word: "sytý", type: "vyjmenované" },
      { word: "sýr", type: "vyjmenované" },
      { word: "syrový", type: "vyjmenované" },
      { word: "sychravý", type: "vyjmenované" },
      { word: "usychat", type: "vyjmenované" },
      { word: "sýkora", type: "vyjmenované" },
      { word: "sýček", type: "vyjmenované" },
      { word: "sysel", type: "vyjmenované" },
      { word: "syčet", type: "vyjmenované" },
      { word: "sypat", type: "vyjmenované" },
      { word: "vysypat", type: "vyjmenované" },
      { word: "násyp", type: "vyjmenované" },
      { word: "zásyp", type: "vyjmenované" }
    ]
  },
  {
    name: "V",
    words: [
      { word: "vy", type: "vyjmenované" },
      { word: "vysoký", type: "vyjmenované" },
      { word: "výt", type: "vyjmenované" },
      { word: "výskat", type: "vyjmenované" },
      { word: "zvykat", type: "vyjmenované" },
      { word: "žvýkat", type: "vyjmenované" },
      { word: "vydra", type: "vyjmenované" },
      { word: "výr", type: "vyjmenované" },
      { word: "vyžle", type: "vyjmenované" },
      { word: "povyk", type: "vyjmenované" },
      { word: "výheň", type: "vyjmenované" },
      { word: "cavyky", type: "vyjmenované" },
      { word: "vyza", type: "vyjmenované" },
      { word: "Vyšehrad", type: "vyjmenované" }
    ]
  },
  {
    name: "Z",
    words: [
      { word: "jazyk", type: "vyjmenované" },
      { word: "nazývat", type: "vyjmenované" },
      { word: "ozývat se", type: "vyjmenované" },
      { word: "vyzývat", type: "vyjmenované" },
      { word: "zbytek", type: "vyjmenované" },
      { word: "zvedat", type: "vyjmenované" },
      { word: "způsob", type: "vyjmenované" },
      { word: "zykat", type: "vyjmenované" },
      { word: "zisk", type: "vyjmenované" },
      { word: "hezký", type: "vyjmenované" },
      { word: "prazdroj", type: "vyjmenované" },
      { word: "zkouška", type: "vyjmenované" }
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
  const [isPhrase, setIsPhrase] = useState(false);
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [missingPositions, setMissingPositions] = useState<number[]>([]);
  const [currentPosition, setCurrentPosition] = useState(0);

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

  const generateProblem = () => {
    // Filtrujeme skupiny podle výběru
    const availableGroups = spellingGroups.filter(group => 
      selectedGroups.includes(group.name)
    );
    
    if (availableGroups.length === 0) return null;
    
    // Náhodně vybereme skupinu
    const randomGroup = availableGroups[Math.floor(Math.random() * availableGroups.length)];
    
    // Náhodně rozhodneme, zda použijeme frázi nebo slovo
    const usePhrase = randomGroup.phrases && randomGroup.phrases.length > 0 && Math.random() > 0.7;
    
    if (usePhrase && randomGroup.phrases) {
      // Vybereme náhodnou frázi
      const randomPhrase = randomGroup.phrases[Math.floor(Math.random() * randomGroup.phrases.length)];
      
      // Najdeme všechny pozice i/y/í/ý v textu
      const positions: number[] = [];
      const letters: string[] = [];
      
      for (let i = 0; i < randomPhrase.length; i++) {
        const char = randomPhrase[i].toLowerCase();
        if (char === 'i' || char === 'y' || char === 'í' || char === 'ý') {
          positions.push(i);
          letters.push(char);
        }
      }
      
      // Pokud jsou nějaké i/y ve frázi
      if (positions.length > 0) {
        // Vytvoříme text s podtržítky místo i/y
        let displayedPhrase = randomPhrase;
        positions.forEach((pos) => {
          displayedPhrase = displayedPhrase.substring(0, pos) + '_' + displayedPhrase.substring(pos + 1);
        });
        
        return {
          word: randomPhrase,
          displayed: displayedPhrase,
          group: randomGroup.name,
          positions,
          letters,
          isPhrase: true
        };
      }
    }
    
    // Pokud nepoužijeme frázi nebo žádná není k dispozici, použijeme slovo
    const words = randomGroup.words;
    if (words.length === 0) return null;
    
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    // Najdeme všechny pozice i/y/í/ý ve slově
    const positions: number[] = [];
    const letters: string[] = [];
    
    for (let i = 0; i < randomWord.word.length; i++) {
      const char = randomWord.word[i].toLowerCase();
      if (char === 'i' || char === 'y' || char === 'í' || char === 'ý') {
        positions.push(i);
        letters.push(char);
      }
    }
    
    // Vytvoříme slovo s podtržítky místo i/y
    let displayedWord = randomWord.word;
    positions.forEach((pos) => {
      displayedWord = displayedWord.substring(0, pos) + '_' + displayedWord.substring(pos + 1);
    });
    
    return {
      word: randomWord.word,
      displayed: displayedWord,
      group: randomGroup.name,
      type: randomWord.type,
      positions,
      letters,
      isPhrase: false
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
    
    if (!problem) {
      toast({
        title: "Chyba",
        description: "Nepodařilo se vygenerovat příklad.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentWord(problem.word);
    setDisplayedWord(problem.displayed);
    setWordGroup(problem.group);
    setIsPhrase(problem.isPhrase || false);
    setMissingPositions(problem.positions || []);
    setCorrectLetters(problem.letters || []);
    setCurrentPosition(0);
    setShowProblem(true);
    setUserAnswer("");
    setGameEnded(false);
  };

  const checkAnswer = () => {
    if (!currentWord || missingPositions.length === 0) return;

    const correctLetter = correctLetters[currentPosition];
    const normalizedCorrectLetter = removeDiacritics(correctLetter).toLowerCase();
    const normalizedUserAnswer = removeDiacritics(userAnswer).toLowerCase();
    
    // Kontrolujeme, zda uživatel zadal správné i/y (bez ohledu na diakritiku)
    const isCorrect = 
      (normalizedCorrectLetter === 'i' && (normalizedUserAnswer === 'i')) ||
      (normalizedCorrectLetter === 'y' && (normalizedUserAnswer === 'y'));
    
    if (isCorrect) {
      toast({
        title: "Správně!",
        variant: "default",
      });
      
      // Přejdeme na další pozici, pokud existuje
      if (currentPosition < missingPositions.length - 1) {
        setCurrentPosition(currentPosition + 1);
        setUserAnswer("");
      } else {
        setCorrectAnswers((prev) => prev + 1);
        startNewGame(); // Začneme novou hru
      }
    } else {
      toast({
        title: "Špatně!",
        description: `Správná odpověď byla: ${correctLetter}`,
        variant: "destructive",
      });
      
      // Přejdeme na další pozici i po špatné odpovědi
      if (currentPosition < missingPositions.length - 1) {
        setCurrentPosition(currentPosition + 1);
        setUserAnswer("");
      } else {
        startNewGame(); // Začneme novou hru
      }
    }
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

  // Pomocná funkce pro zobrazení slova s aktuální mezerou
  const renderWordWithCurrentGap = () => {
    if (!displayedWord || missingPositions.length === 0) return displayedWord;
    
    // Vytvoříme podtržítka pro všechny mezery, které nejsou aktuální
    let result = currentWord;
    for (let i = 0; i < missingPositions.length; i++) {
      const position = missingPositions[i];
      const replacement = i === currentPosition ? "___" : correctLetters[i];
      result = result.substring(0, position) + replacement + result.substring(position + 1);
    }
    return result;
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
                <p className="text-center font-medium">
                  {isPhrase ? "Věta/spojení" : `Vyjmenované slovo po ${wordGroup}`}
                </p>
                <p className="text-2xl font-bold text-center mb-4 whitespace-pre-wrap">
                  {renderWordWithCurrentGap()}
                </p>
                <p className="text-center text-gray-600">
                  Doplňte pouze písmeno i/y na zvýrazněné místo
                </p>
              </div>
            )}
            <div className="flex justify-center items-center gap-4">
              <Button 
                onClick={() => { setUserAnswer("i"); setTimeout(checkAnswer, 100); }}
                className="text-2xl px-6 py-4 bg-blue-500 hover:bg-blue-600"
                size="lg"
              >
                i
              </Button>
              <Button 
                onClick={() => { setUserAnswer("y"); setTimeout(checkAnswer, 100); }}
                className="text-2xl px-6 py-4 bg-green-500 hover:bg-green-600"
                size="lg"
              >
                y
              </Button>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
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

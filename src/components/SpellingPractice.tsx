
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { generateSpellingProblem, checkSpellingAnswer } from "@/utils/spellingUtils";
import { GroupSelectionDialog } from "./spelling/GroupSelectionDialog";
import { WordProblemDialog } from "./spelling/WordProblemDialog";
import { spellingGroups } from "@/data/spellingData";

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
    const problem = generateSpellingProblem(selectedGroups, spellingGroups);
    
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

  const handleAnswer = (answer: string) => {
    if (!currentWord || missingPositions.length === 0) return;

    const correctLetter = correctLetters[currentPosition];
    setUserAnswer(answer);
    
    // Kontrola odpovědi pomocí utility funkce
    const isCorrect = checkSpellingAnswer(correctLetter, answer);
    
    // Pro debug do konzole
    console.log(`Správná odpověď: ${correctLetter}, Uživatelova odpověď: ${answer}, Vyhodnoceno jako: ${isCorrect ? 'Správně' : 'Špatně'}`);
    
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
  
  const handleAnswerI = () => {
    handleAnswer("i");
  };
  
  const handleAnswerY = () => {
    handleAnswer("y");
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
      <GroupSelectionDialog
        open={showGroupDialog}
        onOpenChange={setShowGroupDialog}
        spellingGroups={spellingGroups}
        selectedGroups={selectedGroups}
        toggleGroup={toggleGroup}
        setGroups={setGroups}
      />

      {/* Word Problem Dialog */}
      <WordProblemDialog
        open={showProblem}
        onOpenChange={(open) => setShowProblem(open)}
        displayedWord={displayedWord}
        currentWord={currentWord}
        isPhrase={isPhrase}
        wordGroup={wordGroup}
        missingPositions={missingPositions}
        correctLetters={correctLetters}
        currentPosition={currentPosition}
        onAnswerI={handleAnswerI}
        onAnswerY={handleAnswerY}
        onEndGame={endGame}
      />
    </div>
  );
};

export default SpellingPractice;

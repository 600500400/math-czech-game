import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DictionaryWord } from "@/types/dictionaryTypes";

interface DictionaryCardProps {
  word: DictionaryWord;
  direction: 'en_to_cz' | 'cz_to_en';
  showAnswer: boolean;
  children?: React.ReactNode;
}

const getDifficultyColor = (level: string) => {
  switch (level) {
    case 'basic':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    case 'advanced':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  }
};

const getDifficultyLabel = (level: string) => {
  switch (level) {
    case 'basic':
      return 'Základní';
    case 'intermediate':
      return 'Střední';
    case 'advanced':
      return 'Pokročilý';
    default:
      return level;
  }
};

export default function DictionaryCard({ word, direction, showAnswer, children }: DictionaryCardProps) {
  const questionWord = direction === 'en_to_cz' ? word.english_word : word.czech_translation;
  const answerWord = direction === 'en_to_cz' ? word.czech_translation : word.english_word;
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Badge className={getDifficultyColor(word.difficulty_level)}>
              {getDifficultyLabel(word.difficulty_level)}
            </Badge>
          </div>
          
          <div className="text-2xl font-bold text-center min-h-[3rem] flex items-center justify-center">
            {questionWord}
          </div>
          
          {showAnswer && (
            <div className="text-lg text-muted-foreground border-t pt-4">
              <div className="font-medium">Překlad:</div>
              <div className="text-xl text-foreground mt-1">{answerWord}</div>
            </div>
          )}
          
          {children && (
            <div className="mt-6">
              {children}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
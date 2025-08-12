import { Card, CardContent } from "@/components/ui/card";
import { DictionaryWord } from "@/types/dictionaryTypes";

interface DictionaryCardProps {
  word: DictionaryWord;
  direction: 'en_to_cz' | 'cz_to_en';
  showAnswer: boolean;
  children?: React.ReactNode;
}

// Generate example sentences with the word
const generateExampleSentences = (word: string, direction: 'en_to_cz' | 'cz_to_en') => {
  const targetWord = direction === 'en_to_cz' ? word : word;
  
  // Simple example sentences in Czech
  const sentences = [
    `Dnes jsem se naučil slovo "${targetWord}".`,
    `Slovo "${targetWord}" používám v každodenní konverzaci.`,
    `Význam slova "${targetWord}" je velmi důležitý.`,
    `V této větě najdete slovo "${targetWord}".`,
    `Procvičuji si slovo "${targetWord}" každý den.`
  ];
  
  return sentences.slice(0, 2); // Return 2 example sentences
};

export default function DictionaryCard({ word, direction, showAnswer, children }: DictionaryCardProps) {
  const questionWord = direction === 'en_to_cz' ? word.english_word : word.czech_translation;
  const answerWord = direction === 'en_to_cz' ? word.czech_translation : word.english_word;
  const exampleSentences = generateExampleSentences(questionWord, direction);
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-center min-h-[3rem] flex items-center justify-center">
            {questionWord}
          </div>
          
          {showAnswer && (
            <div className="text-lg text-muted-foreground border-t pt-4 space-y-3">
              <div>
                <div className="font-medium">Překlad:</div>
                <div className="text-xl text-foreground mt-1">{answerWord}</div>
              </div>
              
              <div className="border-t pt-3">
                <div className="font-medium text-sm mb-2">Příklady použití:</div>
                <div className="space-y-1">
                  {exampleSentences.map((sentence, index) => (
                    <div key={index} className="text-sm text-muted-foreground italic">
                      "{sentence}"
                    </div>
                  ))}
                </div>
              </div>
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
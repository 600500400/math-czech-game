
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";

interface GameHeaderProps {
  problemCount: number;
  correctAnswers: number;
  wrongAnswers: number;
}

export const GameHeader = ({ 
  problemCount, 
  correctAnswers, 
  wrongAnswers 
}: GameHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <>
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {t('practice.practiceSpelling')}
      </h1>
      
      <div className="flex justify-between items-center">
        <p className="text-blue-500 font-medium">
          {t('practice.total')}: <Badge variant="outline">{problemCount}</Badge>
        </p>
        <div className="flex gap-2 items-center">
          <p className="text-green-500 font-medium">
            {t('practice.correct')}: <Badge variant="outline">{correctAnswers}</Badge>
          </p>
          {wrongAnswers > 0 && (
            <p className="text-red-500 font-medium">
              {t('practice.wrong')}: <Badge variant="outline">{wrongAnswers}</Badge>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

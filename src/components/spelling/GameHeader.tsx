
import { Badge } from "@/components/ui/badge";

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
  return (
    <>
      <h1 className="text-3xl font-bold text-center text-orange-500">Procvičování vyjmenovaných slov</h1>
      
      <div className="flex justify-between items-center">
        <p className="text-blue-500 font-medium">
          Počet slov: <Badge variant="outline">{problemCount}</Badge>
        </p>
        <div className="flex gap-2 items-center">
          <p className="text-green-500 font-medium">
            Správně: <Badge variant="outline">{correctAnswers}</Badge>
          </p>
          {wrongAnswers > 0 && (
            <p className="text-red-500 font-medium">
              Špatně: <Badge variant="outline">{wrongAnswers}</Badge>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

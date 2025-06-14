
import { FloatingIcon } from "@/components/ui/microanimations";

interface SpellingPracticeHeaderProps {
  theme: {
    avatar: string;
  };
  getGradientClasses: {
    primary: string;
  };
}

export const SpellingPracticeHeader = ({ 
  theme, 
  getGradientClasses 
}: SpellingPracticeHeaderProps) => {
  return (
    <FloatingIcon className="text-center">
      <h1 
        className={`text-3xl font-bold bg-gradient-to-r ${getGradientClasses.primary} bg-clip-text text-transparent`}
      >
        Procvičování vyjmenovaných slov {theme.avatar}
      </h1>
    </FloatingIcon>
  );
};


import { GameControls } from "./GameControls";
import { HoverScale } from "@/components/ui/microanimations";
import { GlassCard } from "@/components/ui/glass-morphism";

interface SpellingPracticeControlsProps {
  selectedGroups: string[];
  onShowGroupDialog: () => void;
  onStartNewGame: () => void;
}

export const SpellingPracticeControls = ({
  selectedGroups,
  onShowGroupDialog,
  onStartNewGame
}: SpellingPracticeControlsProps) => {
  return (
    <HoverScale>
      <GlassCard className="hover:bg-white/25 dark:hover:bg-white/10 transition-all duration-500">
        <GameControls 
          selectedGroupsCount={selectedGroups.length}
          onShowGroupDialog={onShowGroupDialog}
          onStartGame={onStartNewGame}
        />
      </GlassCard>
    </HoverScale>
  );
};

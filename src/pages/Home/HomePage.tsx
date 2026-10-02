import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { useGamification } from "@/hooks/gamification/useGamification";
import MobileShell from "@/components/layout/MobileShell";
import MathHeroTile from "@/components/dashboard/MathHeroTile";
import SpellingWideTile from "@/components/dashboard/SpellingWideTile";
import DictionaryTile from "@/components/dashboard/DictionaryTile";
import StatsTile from "@/components/dashboard/StatsTile";

const HomePage = () => {
  const { authState } = useAuth();
  const { mathStats, spellingStats } = useStatistics(authState.user?.id || null);
  const { leveling, streaks } = useGamification();

  const userName = authState.profile?.full_name || authState.profile?.username || authState.user?.username || "Školáku";
  const firstName = userName.split(" ")[0] || "Školáku";

  const levelProgress = leveling.getLevelProgress();
  const currentStreak = streaks.userStreak?.current_streak || 0;

  const sumTotals = (stats: Array<{ correct_answers: number; wrong_answers: number }> | null) =>
    (stats || []).reduce(
      (acc, s) => {
        acc.correct += s.correct_answers;
        acc.wrong += s.wrong_answers;
        acc.total += s.correct_answers + s.wrong_answers;
        return acc;
      },
      { correct: 0, wrong: 0, total: 0 }
    );

  const math = sumTotals(mathStats);
  const spelling = sumTotals(spellingStats);

  const mathAccuracy = math.total > 0 ? Math.round((math.correct / math.total) * 100) : 0;
  const spellingAccuracy =
    spelling.total > 0 ? Math.round((spelling.correct / spelling.total) * 100) : 0;

  const getBadge = (acc: number) => {
    if (acc >= 90) return "Expert";
    if (acc >= 75) return "Pokročilý";
    if (acc >= 50) return "Učím se";
    return "Začátečník";
  };

  return (
    <MobileShell>
      {/* Greeting */}
      <section className="pb-4 pt-3">
        <h1 className="font-heading text-3xl font-bold leading-tight text-white">
          Vítej zpět,{" "}
          <span className="bg-gradient-to-r from-sunset-orange to-sunset-amber bg-clip-text text-transparent">
            {firstName}!
          </span>
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Dnes máš skvělou šanci překonat svůj rekord.
        </p>

        {/* Gamification Bar */}
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sunset-orange to-sunset-amber text-sm font-bold text-white shadow-md">
              L{leveling.userLevel?.current_level || 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">Úroveň {leveling.userLevel?.current_level || 1}</span>
                <span className="text-[11px] text-white/50">{leveling.userLevel?.total_xp || 0} XP</span>
              </div>
              <div className="mt-1 h-1.5 w-28 sm:w-36 overflow-hidden rounded-full bg-white/10">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-sunset-orange to-sunset-amber transition-all duration-500" 
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Streak Flame */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/25 px-3 py-1.5">
            <span className="text-base">🔥</span>
            <div className="text-right">
              <span className="text-xs font-bold text-sunset-amber">{currentStreak}</span>
              <span className="text-[10px] text-white/50 ml-1">
                {currentStreak === 1 ? "den" : (currentStreak >= 2 && currentStreak <= 4 ? "dny" : "dní")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bento grid */}
      <div className="grid grid-cols-2 gap-4">
        <MathHeroTile
          accuracy={mathAccuracy}
          total={math.total}
          badge={getBadge(mathAccuracy)}
        />
        <StatsTile total={math.total + spelling.total} />
        <DictionaryTile />
        <SpellingWideTile accuracy={spellingAccuracy} total={spelling.total} />
      </div>
    </MobileShell>
  );
};

export default HomePage;

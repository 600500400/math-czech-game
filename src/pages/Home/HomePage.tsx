import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import MobileShell from "@/components/layout/MobileShell";
import MathHeroTile from "@/components/dashboard/MathHeroTile";
import SpellingWideTile from "@/components/dashboard/SpellingWideTile";
import DictionaryTile from "@/components/dashboard/DictionaryTile";
import StatsTile from "@/components/dashboard/StatsTile";

const HomePage = () => {
  const { authState } = useAuth();
  const { mathStats, spellingStats } = useStatistics(authState.user?.id || null);

  const userName = authState.profile?.full_name || "Studente";
  const firstName = userName.split(" ")[0] || "Studente";

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
      <section className="pb-6 pt-4">
        <h1 className="font-heading text-3xl font-bold leading-tight text-white">
          Vítej zpět,{" "}
          <span className="bg-gradient-to-r from-sunset-orange to-sunset-amber bg-clip-text text-transparent">
            {firstName}!
          </span>
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Dnes máš skvělou šanci překonat svůj rekord.
        </p>
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

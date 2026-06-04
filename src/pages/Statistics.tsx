import { useAuth } from "@/hooks/useAuth";
import { useStatistics } from "@/hooks/useStatistics";
import { useDetailedAnswers } from "@/hooks/statistics/useDetailedAnswers";
import MobileShell from "@/components/layout/MobileShell";
import StatisticsTabs from "@/components/statistics/StatisticsTabs";

const Statistics = () => {
  const { authState } = useAuth();
  const { mathStats, spellingStats, dictionaryStats } = useStatistics(
    authState.user?.id || null
  );
  const { mathAnswers, spellingAnswers, dictionaryAnswers } = useDetailedAnswers(
    authState.user?.id || null
  );

  return (
    <MobileShell>
      <section className="pb-6 pt-4">
        <h1 className="font-heading text-3xl font-bold leading-tight text-white">
          Tvoje{" "}
          <span className="bg-gradient-to-r from-sunset-magenta to-sunset-purple bg-clip-text text-transparent">
            statistiky
          </span>
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Sleduj svůj pokrok napříč všemi sekcemi.
        </p>
      </section>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        <StatisticsTabs
          mathStats={mathStats}
          spellingStats={spellingStats}
          dictionaryStats={dictionaryStats}
          mathAnswers={mathAnswers}
          spellingAnswers={spellingAnswers}
          dictionaryAnswers={dictionaryAnswers}
        />
      </div>
    </MobileShell>
  );
};

export default Statistics;

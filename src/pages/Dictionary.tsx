import { useEffect } from "react";
import { Languages } from "lucide-react";
import MobileShell from "@/components/layout/MobileShell";
import SectionHero from "@/components/layout/SectionHero";
import DictionaryTabs from "@/components/dictionary/DictionaryTabs";

const Dictionary = () => {
  useEffect(() => {
    document.title = "Slovník | Procvička";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Slovník Procvička – procvičování české slovní zásoby a vyjmenovaných slov.",
      );
    }
  }, []);

  return (
    <MobileShell>
      <div className="space-y-6">
        <SectionHero
          title="Slovník"
          subtitle="Tvoje slovní zásoba na jednom místě"
          icon={Languages}
          gradient="from-sunset-purple to-sunset-magenta"
        />

        <section
          aria-labelledby="dictionary-heading"
          className="rounded-3xl border border-white/10 bg-white/5 p-4"
        >
          <h2 id="dictionary-heading" className="sr-only">
            Slovník – procvičování
          </h2>
          <DictionaryTabs />
        </section>
      </div>
    </MobileShell>
  );
};

export default Dictionary;

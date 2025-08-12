import { useEffect } from "react";
import ModernHeader from "@/components/layout/ModernHeader";
import AppFooter from "@/components/layout/AppFooter";
import DictionaryTabs from "@/components/dictionary/DictionaryTabs";

const Dictionary = () => {
  useEffect(() => {
    document.title = "Slovník | Procvička";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Slovník Procvička – procvičování anglických slovíček s příklady a testy."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <section aria-labelledby="dictionary-heading">
          <h1 id="dictionary-heading" className="sr-only">Slovník – procvičování</h1>
          <DictionaryTabs />
        </section>
      </main>
      <AppFooter />
    </div>
  );
};

export default Dictionary;

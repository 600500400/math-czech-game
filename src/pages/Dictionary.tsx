import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ModernHeader from "@/components/layout/ModernHeader";
import AppFooter from "@/components/layout/AppFooter";
import { Button } from "@/components/ui/button";
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
        <nav aria-label="Zpět" className="mb-4">
          <Button asChild variant="outline" size="sm" aria-label="Zpět na přehled">
            <Link to="/parent-dashboard" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Zpět na přehled
            </Link>
          </Button>
        </nav>
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

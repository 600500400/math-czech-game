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
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground transition-colors">
                Domů
              </Link>
            </li>
            <li className="flex items-center">
              <ArrowLeft className="h-3 w-3 mx-2 rotate-180" />
              <span className="text-foreground font-medium">Slovník</span>
            </li>
          </ol>
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

import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, LucideIcon } from "lucide-react";

interface SectionHeroProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  /** Tailwind gradient classes, e.g. "from-sunset-orange to-sunset-amber" */
  gradient: string;
  children?: ReactNode;
}

/**
 * Hero karta pro vrchol podstránek (Matematika, Pravopis, Slovník).
 * Drží zpětný odkaz, gradient pozadí, ikonu a tlačítka.
 */
const SectionHero = ({ title, subtitle, icon: Icon, gradient, children }: SectionHeroProps) => {
  return (
    <div className="space-y-4">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Domů
      </Link>

      <div
        className={`relative overflow-hidden rounded-3xl p-6 shadow-2xl bg-gradient-to-br ${gradient}`}
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-black/20 blur-2xl" />

        <div className="relative flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur-md">
              <Icon className="h-6 w-6 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-white leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-white/80">{subtitle}</p>
              )}
            </div>
          </div>

          {children && <div className="flex flex-wrap gap-3 pt-1">{children}</div>}
        </div>
      </div>
    </div>
  );
};

export default SectionHero;

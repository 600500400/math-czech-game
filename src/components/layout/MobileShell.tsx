import { ReactNode } from "react";
import ModernHeader from "@/components/layout/ModernHeader";
import BottomTabBar from "@/components/layout/BottomTabBar";

interface MobileShellProps {
  children: ReactNode;
}

/**
 * Warm-dark shell pro nové bento obrazovky (Domů, Statistiky, Profil).
 * Mobile-first: tmavé pozadí, sticky header, spodní tab bar.
 */
const MobileShell = ({ children }: MobileShellProps) => {
  return (
    <div className="min-h-screen bg-sunset-bg text-white">
      {/* Decorativní gradient blob v pozadí */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[60vh] overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[60vh] w-[120%] -translate-x-1/2 rounded-full bg-gradient-to-br from-sunset-orange/20 via-sunset-magenta/10 to-transparent blur-3xl" />
      </div>

      <ModernHeader />

      <main className="mx-auto w-full max-w-[420px] px-5 pb-32 pt-2 md:max-w-3xl">
        {children}
      </main>

      <BottomTabBar />
    </div>
  );
};

export default MobileShell;

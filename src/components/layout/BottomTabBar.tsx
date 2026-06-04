import { NavLink } from "react-router-dom";
import { Home, BarChart3, User } from "lucide-react";

const tabs = [
  { to: "/", label: "Domů", icon: Home, end: true },
  { to: "/statistiky", label: "Grafy", icon: BarChart3 },
  { to: "/profil", label: "Profil", icon: User },
];

const BottomTabBar = () => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto max-w-[420px] px-4 pb-3">
        <div className="flex items-center justify-around rounded-3xl border border-white/10 bg-black/60 px-4 py-3 backdrop-blur-xl shadow-2xl">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
                  isActive
                    ? "text-sunset-amber"
                    : "text-white/40 hover:text-white/70"
                }`
              }
            >
              <tab.icon className="h-6 w-6" strokeWidth={2.2} />
              <span className="text-[10px] font-bold uppercase tracking-tight">
                {tab.label}
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomTabBar;

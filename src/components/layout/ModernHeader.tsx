import { Link, NavLink } from "react-router-dom";
import { Logo } from "@/components/layout/Logo";
import UserMenu from "@/components/UserMenu";
import FeedbackButton from "@/components/FeedbackButton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import DonateButton from "@/components/donation/DonateButton";

const navLinks = [
  { to: "/", label: "Domů", end: true },
  { to: "/math", label: "Matematika" },
  { to: "/spelling", label: "Čeština" },
  { to: "/dictionary", label: "Slovíčka" },
  { to: "/statistiky", label: "Statistiky" },
  { to: "/profil", label: "Profil" },
];

const ModernHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-sunset-bg/80 backdrop-blur-xl border-b border-white/5">
      <div className="mx-auto flex w-full max-w-[420px] items-center justify-between px-4 py-3 md:max-w-4xl lg:max-w-5xl">
        <Link
          to="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <Logo size={36} />
          <span className="font-heading text-xl font-bold tracking-tight text-white">
            Procvička
          </span>
        </Link>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white/15 text-white font-semibold shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <DonateButton />
          <ThemeToggle />
          <FeedbackButton />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;

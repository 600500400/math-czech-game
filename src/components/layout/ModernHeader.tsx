import { Link } from "react-router-dom";
import { Logo } from "@/components/layout/Logo";
import UserMenu from "@/components/UserMenu";
import FeedbackButton from "@/components/FeedbackButton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import DonateButton from "@/components/donation/DonateButton";

const ModernHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-sunset-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[420px] items-center justify-between px-5 py-4 md:max-w-3xl">
        <Link
          to="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <Logo size={36} />
          <span className="font-heading text-xl font-bold tracking-tight text-white">
            Procvička
          </span>
        </Link>

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

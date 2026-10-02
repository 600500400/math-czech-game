import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import MobileShell from "@/components/layout/MobileShell";
import { ChevronRight, Users, Trophy, Award, Heart, LogOut } from "lucide-react";
import { DonateDialog } from "@/components/donation/DonateDialog";

const Profile = () => {
  const navigate = useNavigate();
  const { authState, signOut } = useAuth();
  const [showDonate, setShowDonate] = useState(false);
  const userName = authState.profile?.full_name || authState.profile?.username || authState.user?.username || "Školák";

  const items = [
    { icon: Users, label: "Přepnout uživatele", onClick: () => navigate("/select-user"), color: "text-sunset-orange" },
    { icon: Trophy, label: "Žebříčky", onClick: () => navigate("/leaderboards"), color: "text-sunset-amber" },
    { icon: Award, label: "Úspěchy", onClick: () => navigate("/achievements"), color: "text-sunset-magenta" },
    { icon: Heart, label: "Podpořit projekt", onClick: () => setShowDonate(true), color: "text-sunset-purple" },
  ];

  return (
    <MobileShell>
      <section className="pb-6 pt-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sunset-orange to-sunset-magenta text-2xl font-bold text-white shadow-lg shadow-sunset-orange/20">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-white">{userName}</h1>
            <p className="text-sm text-white/50">
              {authState.user ? "Přihlášen" : "Lokální profil"}
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-3">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-sm transition-colors active:bg-white/10 hover:bg-white/10"
          >
            <div className="flex items-center gap-3">
              <item.icon className={`h-5 w-5 ${item.color}`} strokeWidth={2.2} />
              <span className="font-medium text-white">{item.label}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-white/30" />
          </button>
        ))}

        {authState.user && (
          <button
            onClick={() => signOut()}
            className="flex w-full items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-left backdrop-blur-sm transition-colors active:bg-red-500/20 hover:bg-red-500/15"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-red-400" strokeWidth={2.2} />
              <span className="font-medium text-red-300">Odhlásit se</span>
            </div>
          </button>
        )}
      </div>

      <DonateDialog open={showDonate} onOpenChange={setShowDonate} />
    </MobileShell>
  );
};

export default Profile;

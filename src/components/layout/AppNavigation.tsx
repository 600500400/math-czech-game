
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Award, BarChart3, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AppNavigation = () => {
  const location = useLocation();
  const { authState } = useAuth();

  if (!authState.isAuthenticated) return null;

  const navItems = [
    {
      to: "/",
      icon: Home,
      label: "Domů",
      active: location.pathname === "/"
    },
    {
      to: "/leaderboards",
      icon: Trophy,
      label: "Žebříček",
      active: location.pathname === "/leaderboards"
    },
    {
      to: "/achievements",
      icon: Award,
      label: "Úspěchy",
      active: location.pathname === "/achievements"
    }
  ];

  // Add parent dashboard for parents
  if (authState.profile?.role === 'parent') {
    navItems.push({
      to: "/parent-dashboard",
      icon: BarChart3,
      label: "Dashboard",
      active: location.pathname === "/parent-dashboard"
    });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40 md:relative md:bottom-auto md:border-t-0 md:border-b md:py-4">
      <div className="max-w-md mx-auto flex justify-around md:justify-center md:space-x-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors md:flex-row md:space-y-0 md:space-x-2 ${
                item.active 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs md:text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default AppNavigation;

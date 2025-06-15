
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import UserSelection from "./pages/UserSelection";
import ParentDashboard from "./pages/ParentDashboard";
import { LeaderboardsPage } from "./components/gamification/LeaderboardsPage";
import { AchievementsPage } from "./components/gamification/AchievementsPage";
import NotFound from "./pages/NotFound";
import PWAInstallPrompt from "./components/pwa/PWAInstallPrompt";
import OfflineIndicator from "./components/pwa/OfflineIndicator";
import "@/i18n";
import DonationSuccess from "./pages/DonationSuccess";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/select-user" element={<UserSelection />} />
              <Route path="/parent-dashboard" element={<ParentDashboard />} />
              <Route path="/leaderboards" element={<LeaderboardsPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/donation-success" element={<DonationSuccess />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <PWAInstallPrompt />
            <OfflineIndicator />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

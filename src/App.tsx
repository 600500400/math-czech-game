import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import PWAInstallPrompt from "./components/pwa/PWAInstallPrompt";
import OfflineIndicator from "./components/pwa/OfflineIndicator";
import { UpdateNotification } from "./components/pwa/UpdateNotification";


const UserSelection = lazy(() => import("./pages/UserSelection"));
const ParentDashboard = lazy(() => import("./pages/ParentDashboard"));
const MathPractice = lazy(() => import("./pages/MathPractice"));
const SpellingPractice = lazy(() => import("./pages/SpellingPractice"));
const LeaderboardsPage = lazy(() =>
  import("./components/gamification/LeaderboardsPage").then((m) => ({ default: m.LeaderboardsPage }))
);
const AchievementsPage = lazy(() =>
  import("./components/gamification/AchievementsPage").then((m) => ({ default: m.AchievementsPage }))
);
const NotFound = lazy(() => import("./pages/NotFound"));
const DonationSuccess = lazy(() => import("./pages/DonationSuccess"));
const Dictionary = lazy(() => import("./pages/Dictionary"));
const Statistics = lazy(() => import("./pages/Statistics"));
const Profile = lazy(() => import("./pages/Profile"));


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/select-user" element={<UserSelection />} />
                  <Route path="/parent-dashboard" element={<ParentDashboard />} />
                  <Route path="/math" element={<MathPractice />} />
                  <Route path="/spelling" element={<SpellingPractice />} />
                  <Route path="/leaderboards" element={<LeaderboardsPage />} />
                  <Route path="/achievements" element={<AchievementsPage />} />
                  <Route path="/donation-success" element={<DonationSuccess />} />
                  <Route path="/dictionary" element={<Dictionary />} />
                  <Route path="/statistiky" element={<Statistics />} />
                  <Route path="/profil" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />

                </Routes>
              </Suspense>
              <PWAInstallPrompt />
              <OfflineIndicator />
              <UpdateNotification />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

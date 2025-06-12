
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import Index from "./pages/Index";
import UserSelection from "./pages/UserSelection";
import ParentDashboard from "./pages/ParentDashboard";
import NotFound from "./pages/NotFound";
import FeedbackButton from "./components/FeedbackButton";
import PWAInstallPrompt from "./components/pwa/PWAInstallPrompt";
import OfflineIndicator from "./components/pwa/OfflineIndicator";
import "@/i18n";

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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/select-user" element={<UserSelection />} />
            <Route path="/parent-dashboard" element={<ParentDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FeedbackButton />
          <PWAInstallPrompt />
          <OfflineIndicator />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

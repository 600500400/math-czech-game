
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import UserSelection from "@/pages/UserSelection";
import ParentDashboard from "@/pages/ParentDashboard";
import NotFound from "@/pages/NotFound";
import DonationSuccess from "@/pages/DonationSuccess";

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background text-foreground">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/select-user" element={<UserSelection />} />
                <Route path="/parent-dashboard" element={<ParentDashboard />} />
                <Route path="/donation-success" element={<DonationSuccess />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;

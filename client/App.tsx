import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Homepage } from "./pages/Homepage";
import { SignUp } from "./pages/SignUp";
import { CreateWallet } from "./pages/CreateWallet";
import { Dashboard } from "./pages/Dashboard";
import { WalletPage } from "./pages/Wallet";
import { Module } from "./pages/Module";
import { ModulesList } from "./pages/ModulesList";
import { RecommendationsPage } from "./pages/Recommendations";
import { Microloans } from "./pages/Microloans";
import { Profile } from "./pages/Profile";
import { NotFound } from "./pages/NotFound";
import { BusinessDashboard } from "./pages/BusinessDashboard";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const showNav = location.pathname !== "/" && location.pathname !== "/signup";

  return (
    <>
      {showNav && <Navigation />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/modules" element={<ModulesList />} />
        <Route path="/module/:moduleId" element={<Module />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/microloans" element={<Microloans />} />
        <Route path="/profile" element={<Profile />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

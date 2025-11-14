import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuestProvider } from "./contexts/QuestContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
import Home from "./pages/Home";
import Quests from "./pages/Quests";
import Events from "./pages/Events";
import Shop from "./pages/Shop";
import LeaderboardPage from "./pages/LeaderboardPage";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <QuestProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ThemeToggle />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Quests />} />
              <Route path="/events" element={<Events />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/home" element={<Home />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QuestProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

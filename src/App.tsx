import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuestProvider, useQuests } from "./contexts/QuestContext";
import { NaevvProvider } from "./contexts/NaevvContext";
import { InitialSurvey } from "./components/InitialSurvey";
import { PersonalizationLoader } from "./components/PersonalizationLoader";
import Home from "./pages/Home";
import Quests from "./pages/Quests";
import Events from "./pages/Events";
import Shop from "./pages/Shop";
import AIAssistantPage from "./pages/AIAssistantPage";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminSurveyResults from "./pages/AdminSurveyResults";

const queryClient = new QueryClient();

const AppContent = () => {
  const { hasCompletedSurvey, setHasCompletedSurvey, setUserPreferences } =
    useQuests();
  const [showLoader, setShowLoader] = useState(false);

  const handleSurveyComplete = (responses: Record<string, string>) => {
    setUserPreferences(responses);
    setShowLoader(true);
  };

  const handleLoaderComplete = () => {
    setShowLoader(false);
    setHasCompletedSurvey(true);
  };

  return (
    <>
      {!hasCompletedSurvey && !showLoader && (
        <InitialSurvey onComplete={handleSurveyComplete} />
      )}
      {showLoader && (
        <PersonalizationLoader onComplete={handleLoaderComplete} />
      )}
      {hasCompletedSurvey && (
        <BrowserRouter>
          <NaevvProvider>
            <Routes>
              <Route path="/" element={<Quests />} />
              <Route path="/events" element={<Events />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/naevv" element={<AIAssistantPage />} />
              <Route path="/home" element={<Home />} />
              <Route path="/admin/survey-results" element={<AdminSurveyResults />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NaevvProvider>
          {/* <Routes>
            <Route path="/" element={<Quests />} />
            <Route path="/events" element={<Events />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes> */}
        </BrowserRouter>
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <QuestProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QuestProvider>
  </QueryClientProvider>
);

export default App;

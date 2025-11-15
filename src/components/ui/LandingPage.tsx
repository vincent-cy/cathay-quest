import React from "react";
import { Button } from "@/components/ui/button";
import cathayQuestLogo from "@/assets/cathay-quest-logo.jpg";

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        backgroundColor: "#005D63",
      }}
    >
      <div className="flex flex-col items-center justify-center space-y-8 max-w-md w-full">
        {/* Logo */}
        <div className="w-full max-w-sm flex items-center justify-center">
          <img
            src={cathayQuestLogo}
            alt="Cathay Quest Logo"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Get Started Button */}
        <Button
          onClick={onGetStarted}
          size="lg"
          className="bg-white text-primary hover:bg-secondary hover:text-primary px-10 py-7 text-lg font-bold rounded-2xl transition-all duration-300 border-2 border-secondary/20 hover:border-secondary/40"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};


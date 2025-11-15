import { useEffect, useState } from "react";
import { Plane, Sparkles, Zap, Target } from "lucide-react";

interface PersonalizationLoaderProps {
  onComplete: () => void;
}

const loadingMessages = [
  "Personalising Cathay Quest for you!",
  "Analysing your travel preferences...",
  "Setting up your quest dashboard...",
  "Loading your rewards...",
  "Getting everything ready...",
];

export const PersonalizationLoader = ({ onComplete }: PersonalizationLoaderProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through messages every 1 second
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1000);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    // Stuttering progress bar that reaches 95% by 4.5 seconds, then 100% at 5 seconds
    const intervals: NodeJS.Timeout[] = [];

    // Stutter pattern: quick jump, pause, quick jump, pause, etc.
    const stutterPattern = [
      { delay: 200, amount: 15 },   // 15%
      { delay: 600, amount: 8 },    // 23%
      { delay: 1100, amount: 20 },  // 43%
      { delay: 1700, amount: 12 },  // 55%
      { delay: 2300, amount: 18 },  // 73%
      { delay: 2900, amount: 10 },  // 83%
      { delay: 3500, amount: 7 },   // 90%
      { delay: 4100, amount: 5 },   // 95%
      { delay: 5000, amount: 5 },   // 100%
    ];

    stutterPattern.forEach(({ delay, amount }) => {
      const interval = setTimeout(() => {
        setProgress((prev) => Math.min(prev + amount, 100));
      }, delay);
      intervals.push(interval);
    });

    return () => {
      intervals.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    // Complete after exactly 5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary via-primary-glow to-primary z-50 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 animate-float opacity-20">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <div className="absolute bottom-32 right-10 animate-float opacity-20" style={{ animationDelay: "1s" }}>
          <Plane className="w-16 h-16 text-white" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float opacity-20" style={{ animationDelay: "2s" }}>
          <Zap className="w-10 h-10 text-white" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float opacity-20" style={{ animationDelay: "1.5s" }}>
          <Target className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 max-w-md w-full">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 flex items-center justify-center animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Messages - Fixed height to prevent layout shift */}
        <div className="space-y-3 h-24 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg leading-tight">
            {loadingMessages[messageIndex]}
          </h2>
          <p className="text-white/80 text-base">
            Just a moment...
          </p>
        </div>

        {/* Progress Bar - Fixed container */}
        <div className="space-y-3 w-full">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm w-full">
            <div
              className="h-full bg-gradient-to-r from-white via-accent to-white rounded-full shadow-glow transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/70 text-sm font-semibold h-6 flex items-center justify-center">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Decorative dots */}
        <div className="flex justify-center gap-2 pt-4 h-4 flex items-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-white/40 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

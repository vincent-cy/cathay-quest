import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { SwipeableQuest } from "@/components/SwipeableQuest";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, MapPin, RefreshCw } from "lucide-react";
import heroFlight from "@/assets/hero-flight.jpg";

const allQuests = [
  {
    id: "1",
    title: "Airport Check-in",
    description: "Complete paperless check-in at the airport kiosk",
    reward: 50,
    type: "Weekly",
    timeLeft: "2d left",
    location: "Hong Kong Airport",
    image: heroFlight,
  },
  {
    id: "2",
    title: "Recycle Challenge",
    description: "Drop recyclables at designated bins and snap a photo",
    reward: 20,
    type: "Weekly",
    timeLeft: "6h left",
    location: "Any location",
    image: heroFlight,
  },
  {
    id: "3",
    title: "Eco-Friendly Transport",
    description: "Use public transport to reach the airport",
    reward: 30,
    type: "One-Time",
    timeLeft: "No limit",
    location: "Any location",
    image: heroFlight,
  },
  {
    id: "4",
    title: "Flight Quiz",
    description: "Answer trivia about your destination",
    reward: 30,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "5",
    title: "In-Flight Entertainment",
    description: "Watch a sustainability documentary",
    reward: 25,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "6",
    title: "Wellness Challenge",
    description: "Complete in-seat stretching exercises",
    reward: 15,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
];

const Quests = () => {
  const [isInFlight, setIsInFlight] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipesLeft, setSwipesLeft] = useState(3);
  const [daysUntilRefresh] = useState(4); // This would be calculated based on actual date

  // Filter quests based on flight mode
  const availableQuests = allQuests.filter(quest => {
    if (isInFlight) {
      return quest.type === "In-Flight";
    } else {
      return quest.type === "Weekly" || quest.type === "One-Time";
    }
  });

  // Get 3 random quests
  const displayedQuests = availableQuests.slice(0, 3);
  const currentQuest = displayedQuests[currentIndex % displayedQuests.length];

  const handleAccept = () => {
    setCurrentIndex((prev) => (prev + 1) % displayedQuests.length);
  };

  const handleReject = () => {
    if (swipesLeft > 0) {
      setSwipesLeft(prev => prev - 1);
      setCurrentIndex((prev) => (prev + 1) % displayedQuests.length);
    }
  };

  return (
    <div className={`min-h-screen pb-20 transition-all duration-700 ${
      isInFlight ? 'bg-primary' : 'bg-background'
    }`}>
      <header className={`p-6 border-b space-y-4 transition-all duration-700 ${
        isInFlight 
          ? 'bg-gradient-to-br from-primary via-primary-glow to-primary border-primary-glow/30 shadow-glow' 
          : 'border-border shadow-card'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold transition-all duration-500 ${
              isInFlight ? 'text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]' : 'text-foreground'
            }`}>Your Quests</h1>
            <p className={`text-base transition-all duration-500 ${
              isInFlight ? 'text-white/90' : 'text-muted-foreground'
            }`}>Swipe to discover missions</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${isInFlight ? 'text-white/90' : 'text-muted-foreground'}`} />
              <p className={`text-base transition-all duration-500 ${
                isInFlight ? 'text-white/90' : 'text-muted-foreground'
              }`}>Swipes</p>
            </div>
            <p className={`text-3xl font-bold transition-all duration-500 ${
              isInFlight ? 'text-secondary drop-shadow-[0_2px_10px_rgba(227,9,38,0.5)]' : 'text-accent'
            }`}>{swipesLeft}/3</p>
          </div>
        </div>

        {/* Weekly Refresh Countdown */}
        <Badge variant="outline" className={`transition-all duration-500 ${
          isInFlight ? 'bg-white/10 border-white/30 text-white' : 'bg-accent/10 text-accent-foreground border-accent/20'
        }`}>
          Refreshes in {daysUntilRefresh} days
        </Badge>
        
        {/* Flight Mode Indicator */}
        <Card 
          className={`p-5 cursor-pointer transition-all duration-700 backdrop-blur-sm ${
            isInFlight 
              ? "bg-white/10 border-2 border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]" 
              : "bg-muted/50 border-border shadow-card hover:shadow-elevated"
          }`}
          style={{
            transform: isInFlight ? 'scale(1.02) translateY(-2px)' : 'scale(1)',
          }}
          onClick={() => setIsInFlight(!isInFlight)}
        >
          <div className="flex items-center gap-4">
            <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-all duration-700 ${
              isInFlight 
                ? 'bg-white/20 backdrop-blur-md border border-white/30' 
                : 'bg-muted'
            }`}>
              {isInFlight ? (
                <Plane className="w-10 h-10 text-white animate-pulse drop-shadow-lg" />
              ) : (
                <MapPin className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <p className={`font-bold text-base transition-all duration-500 ${
                isInFlight ? 'text-white text-lg drop-shadow-md' : 'text-foreground'
              }`}>
                {isInFlight ? 'In-Flight Mode Active' : 'On-Ground Mode'}
              </p>
              <p className={`text-sm transition-all duration-500 ${
                isInFlight ? 'text-white/90 drop-shadow-sm' : 'text-muted-foreground'
              }`}>
                {isInFlight ? 'Flight CX888 • HKG → SIN' : 'No active flight detected'}
              </p>
            </div>
            <div className={`px-5 py-2.5 rounded-full shadow-sm transition-all duration-700 ${
              isInFlight 
                ? 'bg-secondary shadow-[0_4px_12px_rgba(227,9,38,0.4)] border border-secondary/20' 
                : 'bg-muted'
            }`}>
              <span className={`text-sm font-bold transition-all duration-500 ${
                isInFlight ? 'text-white' : 'text-muted-foreground font-semibold'
              }`}>
                {isInFlight ? 'Active' : 'Offline'}
              </span>
            </div>
          </div>
        </Card>
      </header>

      <div className={`relative transition-all duration-500 ${isInFlight ? "pt-8 px-2" : "pt-6"}`}>
        {/* Quest Card Stack - Tinder Style */}
        <div className="relative" style={{ perspective: "1000px" }}>
          {/* Next Quest Card - Background */}
          {displayedQuests[(currentIndex + 1) % displayedQuests.length] && (
            <div 
              className="absolute inset-0 transition-all duration-300"
              style={{
                transform: "scale(0.95) translateY(10px)",
                opacity: 0.5,
                zIndex: 0,
              }}
            >
              <SwipeableQuest
                quest={displayedQuests[(currentIndex + 1) % displayedQuests.length]}
                onAccept={() => {}}
                onReject={() => {}}
                isInFlight={isInFlight}
                isBackground={true}
              />
            </div>
          )}
          
          {/* Current Quest Card - Foreground */}
          <div className="relative z-10">
            <SwipeableQuest
              quest={currentQuest}
              onAccept={handleAccept}
              onReject={handleReject}
              isInFlight={isInFlight}
              isBackground={false}
            />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Quests;

import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { CompactQuestCard } from "@/components/CompactQuestCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, MapPin, RefreshCw } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
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
    id: "7",
    title: "Digital Boarding Pass",
    description: "Use mobile boarding pass instead of printed version",
    reward: 35,
    type: "Weekly",
    timeLeft: "3d left",
    location: "Any Airport",
    image: heroFlight,
  },
  {
    id: "8",
    title: "Reusable Water Bottle",
    description: "Refill your water bottle at airport fountains",
    reward: 25,
    type: "Weekly",
    timeLeft: "5d left",
    location: "Any Airport",
    image: heroFlight,
  },
  {
    id: "9",
    title: "Carbon Offset Donation",
    description: "Contribute to carbon offset program",
    reward: 40,
    type: "Weekly",
    timeLeft: "1d left",
    location: "Online",
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
    id: "10",
    title: "Paperless Travel",
    description: "Complete entire journey without printing documents",
    reward: 45,
    type: "One-Time",
    timeLeft: "No limit",
    location: "Any location",
    image: heroFlight,
  },
  {
    id: "11",
    title: "Sustainable Shopping",
    description: "Purchase duty-free items with eco-friendly packaging",
    reward: 35,
    type: "One-Time",
    timeLeft: "No limit",
    location: "Airport Duty-Free",
    image: heroFlight,
  },
  {
    id: "12",
    title: "Green Lounge Visit",
    description: "Visit eco-certified airport lounge",
    reward: 50,
    type: "One-Time",
    timeLeft: "No limit",
    location: "Premium Lounges",
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
  {
    id: "13",
    title: "Meal Preference Survey",
    description: "Share feedback on sustainable meal options",
    reward: 20,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "14",
    title: "Digital Magazine Reader",
    description: "Read digital magazines instead of print",
    reward: 15,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
];

const Quests = () => {
  const [isInFlight, setIsInFlight] = useState(false);
  const [swipesLeft, setSwipesLeft] = useState(3);
  const [daysUntilRefresh] = useState(4);
  const [removedQuests, setRemovedQuests] = useState<string[]>([]);

  // Filter quests based on flight mode
  const weeklyQuests = allQuests.filter(quest => quest.type === "Weekly" && !removedQuests.includes(quest.id));
  const oneTimeQuests = allQuests.filter(quest => quest.type === "One-Time" && !removedQuests.includes(quest.id));
  const inFlightQuests = allQuests.filter(quest => quest.type === "In-Flight" && !removedQuests.includes(quest.id));

  const handleSwipeLeft = (questId: string) => {
    if (swipesLeft > 0) {
      setSwipesLeft(prev => prev - 1);
      setRemovedQuests(prev => [...prev, questId]);
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

      <div className="px-4 py-6 space-y-8">
        {/* In-Flight Mode - Show In-Flight Quests */}
        {isInFlight && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-white px-2">In-Flight Quests</h2>
            {inFlightQuests.length > 0 ? (
              <div className="space-y-6">
                {inFlightQuests.map((quest, index) => (
                  <div key={quest.id} className="relative" style={{ perspective: "1000px" }}>
                    {/* Next card background preview */}
                    {inFlightQuests[index + 1] && (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          transform: "translateY(8px) scale(0.97)",
                          zIndex: 0,
                          opacity: 0.4,
                        }}
                      >
                        <div className={`rounded-lg border h-[140px] ${
                          isInFlight ? "bg-white/10 border-white/30" : "bg-card border-border"
                        }`} />
                      </div>
                    )}
                    <div className="relative z-10">
                      <CompactQuestCard
                        quest={quest}
                        isInFlight={isInFlight}
                        onSwipeLeft={() => handleSwipeLeft(quest.id)}
                        swipesLeft={swipesLeft}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/70 text-center py-8">No in-flight quests available</p>
            )}
          </div>
        )}

        {/* On-Ground Mode - Show Weekly and One-Time Quests */}
        {!isInFlight && (
          <>
            {/* Weekly Quests */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground px-2">Weekly Quests</h2>
              {weeklyQuests.length > 0 ? (
                <div className="space-y-6">
                  {weeklyQuests.map((quest, index) => (
                    <div key={quest.id} className="relative" style={{ perspective: "1000px" }}>
                      {/* Next card background preview */}
                      {weeklyQuests[index + 1] && (
                        <div 
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            transform: "translateY(8px) scale(0.97)",
                            zIndex: 0,
                            opacity: 0.4,
                          }}
                        >
                          <div className={`rounded-lg border h-[140px] ${
                            isInFlight ? "bg-white/10 border-white/30" : "bg-card border-border"
                          }`} />
                        </div>
                      )}
                      <div className="relative z-10">
                        <CompactQuestCard
                          quest={quest}
                          isInFlight={isInFlight}
                          onSwipeLeft={() => handleSwipeLeft(quest.id)}
                          swipesLeft={swipesLeft}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No weekly quests available</p>
              )}
            </div>

            {/* One-Time Quests */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground px-2">One-Time Quests</h2>
              {oneTimeQuests.length > 0 ? (
                <div className="space-y-6">
                  {oneTimeQuests.map((quest, index) => (
                    <div key={quest.id} className="relative" style={{ perspective: "1000px" }}>
                      {/* Next card background preview */}
                      {oneTimeQuests[index + 1] && (
                        <div 
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            transform: "translateY(8px) scale(0.97)",
                            zIndex: 0,
                            opacity: 0.4,
                          }}
                        >
                          <div className={`rounded-lg border h-[140px] ${
                            isInFlight ? "bg-white/10 border-white/30" : "bg-card border-border"
                          }`} />
                        </div>
                      )}
                      <div className="relative z-10">
                        <CompactQuestCard
                          quest={quest}
                          isInFlight={isInFlight}
                          onSwipeLeft={() => handleSwipeLeft(quest.id)}
                          swipesLeft={swipesLeft}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No one-time quests available</p>
              )}
            </div>
          </>
        )}
      </div>

      <Toaster />
      <BottomNav />
    </div>
  );
};

export default Quests;

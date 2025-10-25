import { useState } from "react";
import { SwipeableQuest } from "@/components/SwipeableQuest";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Plane, MapPin } from "lucide-react";
import heroFlight from "@/assets/hero-flight.jpg";

const sampleQuests = [
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
    type: "Daily",
    timeLeft: "6h left",
    location: "Any location",
    image: heroFlight,
  },
  {
    id: "3",
    title: "Flight Quiz",
    description: "Answer trivia about your destination",
    reward: 30,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [acceptedQuests, setAcceptedQuests] = useState<string[]>([]);
  const [isInFlight, setIsInFlight] = useState(false); // Toggle for demo purposes

  const handleAccept = () => {
    setAcceptedQuests([...acceptedQuests, sampleQuests[currentIndex].id]);
    setCurrentIndex((prev) => (prev + 1) % sampleQuests.length);
  };

  const handleReject = () => {
    setCurrentIndex((prev) => (prev + 1) % sampleQuests.length);
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
            }`}>Discover Quests</h1>
            <p className={`text-base transition-all duration-500 ${
              isInFlight ? 'text-white/90' : 'text-muted-foreground'
            }`}>Swipe to explore missions</p>
          </div>
          <div className="text-right">
            <p className={`text-base transition-all duration-500 ${
              isInFlight ? 'text-white/90' : 'text-muted-foreground'
            }`}>Accepted</p>
            <p className={`text-3xl font-bold transition-all duration-500 ${
              isInFlight ? 'text-secondary drop-shadow-[0_2px_10px_rgba(227,9,38,0.5)]' : 'text-accent'
            }`}>{acceptedQuests.length}</p>
          </div>
        </div>
        
        {/* Flight Mode Indicator - Enhanced */}
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
            {isInFlight ? (
              <>
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.2)] border border-white/30">
                  <Plane className="w-10 h-10 text-white animate-pulse drop-shadow-lg" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-lg drop-shadow-md">In-Flight Mode Active</p>
                  <p className="text-sm text-white/90 drop-shadow-sm">Flight CX888 • HKG → SIN</p>
                </div>
                <div className="px-5 py-2.5 rounded-full bg-secondary shadow-[0_4px_12px_rgba(227,9,38,0.4)] border border-secondary/20">
                  <span className="text-sm font-bold text-white">Active</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center shadow-md">
                  <MapPin className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground text-base">On-Ground Mode</p>
                  <p className="text-sm text-muted-foreground">No active flight detected</p>
                </div>
                <div className="px-4 py-2 rounded-full bg-muted shadow-sm">
                  <span className="text-sm font-semibold text-muted-foreground">Offline</span>
                </div>
              </>
            )}
          </div>
        </Card>
      </header>

      <div className={`transition-all duration-500 ${isInFlight ? "pt-8 px-2" : "pt-6"}`}>
        <SwipeableQuest
          quest={sampleQuests[currentIndex]}
          onAccept={handleAccept}
          onReject={handleReject}
          isInFlight={isInFlight}
        />
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;

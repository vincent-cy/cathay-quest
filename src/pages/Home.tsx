import { useState } from "react";
import { SwipeableQuest } from "@/components/SwipeableQuest";
import { QuestDescription } from "@/components/QuestDescription";
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
    <div className="min-h-screen bg-background pb-20">
      <header className="p-6 border-b border-border space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground drop-shadow-md">Discover Quests</h1>
            <p className="text-base text-muted-foreground">Swipe to explore missions</p>
          </div>
          <div className="text-right">
            <p className="text-base text-muted-foreground">Accepted</p>
            <p className="text-3xl font-bold text-accent drop-shadow-md">{acceptedQuests.length}</p>
          </div>
        </div>
        
        {/* Flight Mode Indicator - 3D enhanced */}
        <Card 
          className={`p-4 cursor-pointer transition-all shadow-card hover:shadow-elevated ${
            isInFlight 
              ? "bg-primary/10 border-primary/30" 
              : "bg-muted/50 border-border"
          }`}
          style={{
            transform: isInFlight ? 'scale(1.02)' : 'scale(1)',
          }}
          onClick={() => setIsInFlight(!isInFlight)}
        >
          <div className="flex items-center gap-4">
            {isInFlight ? (
              <>
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shadow-lg">
                  <Plane className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground text-base">In-Flight Mode Active</p>
                  <p className="text-sm text-muted-foreground">Flight CX888 • HKG → SIN</p>
                </div>
                <div className="px-4 py-2 rounded-full bg-primary/20 shadow-md">
                  <span className="text-sm font-bold text-primary">Active</span>
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

      <div className="pt-6 space-y-4">
        <SwipeableQuest
          quest={sampleQuests[currentIndex]}
          onAccept={handleAccept}
          onReject={handleReject}
        />
        
        <QuestDescription questType={sampleQuests[currentIndex].type} />
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;

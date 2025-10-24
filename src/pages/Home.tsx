import { useState } from "react";
import { SwipeableQuest } from "@/components/SwipeableQuest";
import { BottomNav } from "@/components/BottomNav";
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

  const handleAccept = () => {
    setAcceptedQuests([...acceptedQuests, sampleQuests[currentIndex].id]);
    setCurrentIndex((prev) => (prev + 1) % sampleQuests.length);
  };

  const handleReject = () => {
    setCurrentIndex((prev) => (prev + 1) % sampleQuests.length);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Discover Quests</h1>
            <p className="text-sm text-muted-foreground">Swipe to explore missions</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Accepted</p>
            <p className="text-xl font-bold text-accent">{acceptedQuests.length}</p>
          </div>
        </div>
      </header>

      <div className="pt-8">
        <SwipeableQuest
          quest={sampleQuests[currentIndex]}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;

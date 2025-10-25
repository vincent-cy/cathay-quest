import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { CompactQuestCard } from "@/components/CompactQuestCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, MapPin, RefreshCw, Clock } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import heroFlight from "@/assets/hero-flight.jpg";

const allQuests = [
  {
    id: "1",
    title: "Airport Check-in",
    description: "Complete paperless check-in at the airport kiosk",
    reward: 10,
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
    reward: 15,
    type: "Weekly",
    timeLeft: "3d left",
    location: "Any Airport",
    image: heroFlight,
  },
  {
    id: "8",
    title: "Reusable Water Bottle",
    description: "Refill your water bottle at airport fountains",
    reward: 15,
    type: "Weekly",
    timeLeft: "5d left",
    location: "Any Airport",
    image: heroFlight,
  },
  {
    id: "9",
    title: "Carbon Offset Donation",
    description: "Contribute to carbon offset program",
    reward: 30,
    type: "Weekly",
    timeLeft: "1d left",
    location: "Online",
    image: heroFlight,
  },
  {
    id: "3",
    title: "Complete 50 Quests",
    description: "Complete 50 quests to earn this achievement",
    reward: 100,
    type: "One-Time",
    timeLeft: "No limit",
    location: "Any location",
    image: heroFlight,
  },
  {
    id: "10",
    title: "Book 15 Flights",
    description: "Book 15 flights through the Cathay Pacific app",
    reward: 75,
    type: "One-Time",
    timeLeft: "No limit",
    location: "Any location",
    image: heroFlight,
  },
  {
    id: "11",
    title: "Eco Warrior",
    description: "Complete 25 eco-friendly quests",
    reward: 75,
    type: "One-Time",
    timeLeft: "No limit",
    location: "Any location",
    image: heroFlight,
  },
  {
    id: "12",
    title: "Frequent Flyer",
    description: "Accumulate 100,000 miles in your account",
    reward: 100,
    type: "One-Time",
    timeLeft: "No limit",
    location: "Any location",
    image: heroFlight,
  },
  {
    id: "4",
    title: "Flight Quiz",
    description: "Answer trivia about your destination",
    reward: 10,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "5",
    title: "Movie Marathon",
    description: "Watch a full-length film on the entertainment system",
    reward: 30,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "6",
    title: "Wellness Challenge",
    description: "Complete in-seat stretching exercises",
    reward: 10,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "13",
    title: "Meal Preference Survey",
    description: "Share feedback on sustainable meal options",
    reward: 10,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "14",
    title: "Premium Meal Order",
    description: "Order a premium in-flight meal",
    reward: 35,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "15",
    title: "Specialty Drink",
    description: "Order a specialty in-flight beverage",
    reward: 25,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "16",
    title: "Destination Explorer",
    description: "Browse the interactive destination guide",
    reward: 15,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "17",
    title: "Duty-Free Shopping",
    description: "Browse duty-free catalog and save favorites",
    reward: 20,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "18",
    title: "Language Learning",
    description: "Complete a 10-minute language lesson module",
    reward: 25,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "19",
    title: "Sleep Tracker",
    description: "Use sleep mode for at least 2 hours",
    reward: 20,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "20",
    title: "Culinary Adventure",
    description: "Try a menu item you've never ordered before",
    reward: 30,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "21",
    title: "Meditation Master",
    description: "Complete a guided meditation session",
    reward: 15,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "22",
    title: "Sky Photography",
    description: "Capture and share a window view photo",
    reward: 10,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "23",
    title: "Travel Planner",
    description: "Create a destination itinerary using onboard tools",
    reward: 25,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "24",
    title: "Podcast Listener",
    description: "Listen to a complete travel podcast episode",
    reward: 20,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "25",
    title: "Sustainability Documentary",
    description: "Watch a documentary about environmental conservation",
    reward: 15,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "26",
    title: "Inflight Magazine",
    description: "Read the digital inflight magazine",
    reward: 10,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "27",
    title: "Snack Order",
    description: "Order a healthy snack from the menu",
    reward: 15,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "28",
    title: "Coffee Connoisseur",
    description: "Order a premium coffee or tea",
    reward: 20,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "29",
    title: "Cultural Discovery",
    description: "Complete a destination culture quiz",
    reward: 15,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "30",
    title: "Music Therapy",
    description: "Listen to a relaxing music playlist for 30 minutes",
    reward: 10,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "31",
    title: "Wi-Fi Explorer",
    description: "Connect to inflight Wi-Fi and browse travel tips",
    reward: 15,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "32",
    title: "Flight Experience Rating",
    description: "Rate your flight experience and provide feedback",
    reward: 20,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "33",
    title: "Hydration Hero",
    description: "Drink at least 3 glasses of water during the flight",
    reward: 10,
    type: "In-Flight",
    timeLeft: "During flight",
    image: heroFlight,
  },
  {
    id: "34",
    title: "Business Reading",
    description: "Read business or travel articles on the entertainment system",
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
  const [flightTimeLeft, setFlightTimeLeft] = useState({ hours: 2, minutes: 15 });

  // Get all quests by type
  const allWeeklyQuests = allQuests.filter((quest) => quest.type === "Weekly");
  const allOneTimeQuests = allQuests.filter((quest) => quest.type === "One-Time");
  const allInFlightQuests = allQuests.filter((quest) => quest.type === "In-Flight");

  // Track current visible quest indices for each slot (0, 1, 2)
  const [weeklySlots, setWeeklySlots] = useState([0, 1, 2]);
  const [oneTimeSlots, setOneTimeSlots] = useState([0, 1, 2]);
  const [inFlightSlots, setInFlightSlots] = useState([0, 1, 2]);

  // Track next available quest index
  const [weeklyNextIndex, setWeeklyNextIndex] = useState(3);
  const [oneTimeNextIndex, setOneTimeNextIndex] = useState(3);
  const [inFlightNextIndex, setInFlightNextIndex] = useState(3);

  const handleSwipeLeft = (questId: string, type: string, slotIndex: number) => {
    if (swipesLeft > 0) {
      setSwipesLeft((prev) => {
        const next = Math.max(prev - 1, 0);
        if (next === 0) {
          toast({
            title: "No Swipes Left!",
            description: "You've used all 3 swipes. Come back tomorrow for more!",
            variant: "destructive",
          });
        }
        return next;
      });

      // After animation, replace the swiped card at its position
      setTimeout(() => {
        if (type === "Weekly") {
          const newSlots = [...weeklySlots];
          newSlots[slotIndex] = weeklyNextIndex % allWeeklyQuests.length;
          setWeeklySlots(newSlots);
          setWeeklyNextIndex((prev) => prev + 1);
        } else if (type === "One-Time") {
          const newSlots = [...oneTimeSlots];
          newSlots[slotIndex] = oneTimeNextIndex % allOneTimeQuests.length;
          setOneTimeSlots(newSlots);
          setOneTimeNextIndex((prev) => prev + 1);
        } else if (type === "In-Flight") {
          const newSlots = [...inFlightSlots];
          newSlots[slotIndex] = inFlightNextIndex % allInFlightQuests.length;
          setInFlightSlots(newSlots);
          setInFlightNextIndex((prev) => prev + 1);
        }
      }, 300);
    }
  };

  return (
    <div className={`min-h-screen pb-20 transition-all duration-700 ${isInFlight ? "bg-primary" : "bg-background"}`}>
      <header
        className={`p-6 border-b space-y-4 transition-all duration-700 ${
          isInFlight
            ? "bg-gradient-to-br from-primary via-primary-glow to-primary border-primary-glow/30 shadow-glow"
            : "border-border shadow-card"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1
              className={`text-3xl font-bold transition-all duration-500 ${
                isInFlight ? "text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]" : "text-foreground"
              }`}
            >
              Your Quests
            </h1>
            <p
              className={`text-base transition-all duration-500 ${
                isInFlight ? "text-white/90" : "text-muted-foreground"
              }`}
            >
              Swipe to discover missions
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${isInFlight ? "text-white/90" : "text-muted-foreground"}`} />
              <p
                className={`text-base transition-all duration-500 ${
                  isInFlight ? "text-white/90" : "text-muted-foreground"
                }`}
              >
                Swipes
              </p>
            </div>
            <p
              className={`text-3xl font-bold transition-all duration-500 ${
                isInFlight ? "text-secondary drop-shadow-[0_2px_10px_rgba(227,9,38,0.5)]" : "text-accent"
              }`}
            >
              {swipesLeft}/3
            </p>
          </div>
        </div>

        {/* Weekly Refresh Countdown & Flight Timer */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge
            variant="outline"
            className={`transition-all duration-500 ${
              isInFlight
                ? "bg-white/10 border-white/30 text-white"
                : "bg-accent/10 text-accent-foreground border-accent/20"
            }`}
          >
            Refreshes in {daysUntilRefresh} days
          </Badge>
          
          {isInFlight && (
            <Badge
              variant="outline"
              className="bg-secondary/20 border-secondary/40 text-white"
            >
              <Clock className="w-3 h-3 mr-1" />
              {flightTimeLeft.hours}h {flightTimeLeft.minutes}m left
            </Badge>
          )}
        </div>

        {/* Flight Mode Indicator */}
        <Card
          className={`p-5 cursor-pointer transition-all duration-700 backdrop-blur-sm ${
            isInFlight
              ? "bg-white/10 border-2 border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              : "bg-muted/50 border-border shadow-card hover:shadow-elevated"
          }`}
          style={{
            transform: isInFlight ? "scale(1.02) translateY(-2px)" : "scale(1)",
          }}
          onClick={() => setIsInFlight(!isInFlight)}
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-all duration-700 ${
                isInFlight ? "bg-white/20 backdrop-blur-md border border-white/30" : "bg-muted"
              }`}
            >
              {isInFlight ? (
                <Plane className="w-10 h-10 text-white animate-pulse drop-shadow-lg" />
              ) : (
                <MapPin className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <p
                className={`font-bold text-base transition-all duration-500 ${
                  isInFlight ? "text-white text-lg drop-shadow-md" : "text-foreground"
                }`}
              >
                {isInFlight ? "In-Flight Mode" : "On-Ground Mode"}
              </p>
              <p
                className={`text-sm transition-all duration-500 ${
                  isInFlight ? "text-white/90 drop-shadow-sm" : "text-muted-foreground"
                }`}
              >
                {isInFlight ? "Flight CX888 • HKG → SIN" : "No active flight detected"}
              </p>
            </div>
            <div
              className={`px-5 py-2.5 rounded-full shadow-sm transition-all duration-700 ${
                isInFlight
                  ? "bg-secondary shadow-[0_4px_12px_rgba(227,9,38,0.4)] border border-secondary/20"
                  : "bg-muted"
              }`}
            >
              <span
                className={`text-sm font-bold transition-all duration-500 ${
                  isInFlight ? "text-white" : "text-muted-foreground font-semibold"
                }`}
              >
                {isInFlight ? "Active" : "Offline"}
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
            {allInFlightQuests.length > 0 ? (
              <div className="space-y-3">
                  {inFlightSlots.map((questIndex, slotIndex) => {
                    const quest = allInFlightQuests[questIndex % allInFlightQuests.length];
                    const nextQuestIndex = inFlightNextIndex % allInFlightQuests.length;
                    const nextQuest = allInFlightQuests[nextQuestIndex];
                    return (
                    <CompactQuestCard
                      key={`inflight-slot-${slotIndex}`}
                      quest={quest}
                      nextQuest={nextQuest}
                      isInFlight={isInFlight}
                      onSwipeLeft={() => handleSwipeLeft(quest.id, "In-Flight", slotIndex)}
                      swipesLeft={swipesLeft}
                    />
                  );
                })}
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
              {allWeeklyQuests.length > 0 ? (
                <div className="space-y-3">
                  {weeklySlots.map((questIndex, slotIndex) => {
                    const quest = allWeeklyQuests[questIndex % allWeeklyQuests.length];
                    const nextQuestIndex = weeklyNextIndex % allWeeklyQuests.length;
                    const nextQuest = allWeeklyQuests[nextQuestIndex];
                    return (
                      <CompactQuestCard
                        key={`weekly-slot-${slotIndex}`}
                        quest={quest}
                        nextQuest={nextQuest}
                        isInFlight={isInFlight}
                        onSwipeLeft={() => handleSwipeLeft(quest.id, "Weekly", slotIndex)}
                        swipesLeft={swipesLeft}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No weekly quests available</p>
              )}
            </div>

            {/* One-Time Quests */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground px-2">One-Time Quests</h2>
              {allOneTimeQuests.length > 0 ? (
                <div className="space-y-3">
                  {oneTimeSlots.map((questIndex, slotIndex) => {
                    const quest = allOneTimeQuests[questIndex % allOneTimeQuests.length];
                    const nextQuestIndex = oneTimeNextIndex % allOneTimeQuests.length;
                    const nextQuest = allOneTimeQuests[nextQuestIndex];
                    return (
                      <CompactQuestCard
                        key={`onetime-slot-${slotIndex}`}
                        quest={quest}
                        nextQuest={nextQuest}
                        isInFlight={isInFlight}
                        onSwipeLeft={() => handleSwipeLeft(quest.id, "One-Time", slotIndex)}
                        swipesLeft={swipesLeft}
                        disableSwipe={true}
                      />
                    );
                  })}
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

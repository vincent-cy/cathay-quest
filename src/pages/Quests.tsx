import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { CompactQuestCard } from "@/components/CompactQuestCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, MapPin, RefreshCw, Clock, RotateCcw } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { useQuests } from "@/contexts/QuestContext";
import allQuests from "@/data/quests.json";

// Helper function to get random indices without duplicates
const getRandomIndices = (count: number, max: number): number[] => {
  const indices = new Set<number>();
  while (indices.size < Math.min(count, max)) {
    indices.add(Math.floor(Math.random() * max));
  }
  return Array.from(indices);
};

const Quests = () => {
  const {
    setCathayPoints,
    ownedVouchers,
    removeVoucher,
    cathayPoints,
    addCathayPoints,
    incrementResetCount,
  } = useQuests();
  const [isInFlight, setIsInFlight] = useState(false);
  const [daysUntilRefresh] = useState(4);
  const [flightTimeLeft, setFlightTimeLeft] = useState({
    hours: 2,
    minutes: 15,
  });

  // Track swiped quest IDs to prevent them from reappearing
  const [swipedQuestIds, setSwipedQuestIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("swipedQuestIds");
    return saved ? JSON.parse(saved) : [];
  });

  // Get all quests by type
  const allWeeklyQuests = allQuests.filter((quest) => quest.type === "Weekly");
  const allOneTimeQuests = allQuests.filter(
    (quest) => quest.type === "One-Time"
  );
  const allInFlightQuests = allQuests.filter(
    (quest) => quest.type === "In-Flight"
  );

  // Initialize state from localStorage or defaults
  const [swipesLeft, setSwipesLeft] = useState(() => {
    const saved = localStorage.getItem("questSwipesLeft");
    return saved ? JSON.parse(saved) : 3;
  });

  const [weeklySlots, setWeeklySlots] = useState<number[]>(() => {
    const saved = localStorage.getItem("weeklySlots");
    return saved
      ? JSON.parse(saved)
      : getRandomIndices(3, allWeeklyQuests.length);
  });

  const [oneTimeSlots, setOneTimeSlots] = useState<number[]>(() => {
    const saved = localStorage.getItem("oneTimeSlots");
    return saved
      ? JSON.parse(saved)
      : getRandomIndices(3, allOneTimeQuests.length);
  });

  const [inFlightSlots, setInFlightSlots] = useState<number[]>(() => {
    const saved = localStorage.getItem("inFlightSlots");
    return saved
      ? JSON.parse(saved)
      : getRandomIndices(3, allInFlightQuests.length);
  });

  // Store the next quest indices for preview
  const [nextWeeklySlots, setNextWeeklySlots] = useState<number[]>(() => {
    const saved = localStorage.getItem("nextWeeklySlots");
    if (saved) return JSON.parse(saved);
    const savedSwipedIds = localStorage.getItem("swipedQuestIds");
    const swipedIds = savedSwipedIds ? JSON.parse(savedSwipedIds) : [];
    return weeklySlots.map(() => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * allWeeklyQuests.length);
      } while (
        weeklySlots.includes(randomIndex) ||
        swipedIds.includes(allWeeklyQuests[randomIndex].id)
      );
      return randomIndex;
    });
  });

  const [nextOneTimeSlots, setNextOneTimeSlots] = useState<number[]>(() => {
    const saved = localStorage.getItem("nextOneTimeSlots");
    if (saved) return JSON.parse(saved);
    const savedSwipedIds = localStorage.getItem("swipedQuestIds");
    const swipedIds = savedSwipedIds ? JSON.parse(savedSwipedIds) : [];
    return oneTimeSlots.map(() => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * allOneTimeQuests.length);
      } while (
        oneTimeSlots.includes(randomIndex) ||
        swipedIds.includes(allOneTimeQuests[randomIndex].id)
      );
      return randomIndex;
    });
  });

  const [nextInFlightSlots, setNextInFlightSlots] = useState<number[]>(() => {
    const saved = localStorage.getItem("nextInFlightSlots");
    if (saved) return JSON.parse(saved);
    const savedSwipedIds = localStorage.getItem("swipedQuestIds");
    const swipedIds = savedSwipedIds ? JSON.parse(savedSwipedIds) : [];
    return inFlightSlots.map(() => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * allInFlightQuests.length);
      } while (
        inFlightSlots.includes(randomIndex) ||
        swipedIds.includes(allInFlightQuests[randomIndex].id)
      );
      return randomIndex;
    });
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("questSwipesLeft", JSON.stringify(swipesLeft));
  }, [swipesLeft]);

  useEffect(() => {
    localStorage.setItem("weeklySlots", JSON.stringify(weeklySlots));
  }, [weeklySlots]);

  useEffect(() => {
    localStorage.setItem("oneTimeSlots", JSON.stringify(oneTimeSlots));
  }, [oneTimeSlots]);

  useEffect(() => {
    localStorage.setItem("inFlightSlots", JSON.stringify(inFlightSlots));
  }, [inFlightSlots]);

  useEffect(() => {
    localStorage.setItem("nextWeeklySlots", JSON.stringify(nextWeeklySlots));
  }, [nextWeeklySlots]);

  useEffect(() => {
    localStorage.setItem("nextOneTimeSlots", JSON.stringify(nextOneTimeSlots));
  }, [nextOneTimeSlots]);

  useEffect(() => {
    localStorage.setItem(
      "nextInFlightSlots",
      JSON.stringify(nextInFlightSlots)
    );
  }, [nextInFlightSlots]);

  useEffect(() => {
    localStorage.setItem("swipedQuestIds", JSON.stringify(swipedQuestIds));
  }, [swipedQuestIds]);

  const handleResetSwipes = () => {
    // Reset quest-related localStorage
    localStorage.removeItem("questSwipesLeft");
    localStorage.removeItem("weeklySlots");
    localStorage.removeItem("oneTimeSlots");
    localStorage.removeItem("inFlightSlots");
    localStorage.removeItem("nextWeeklySlots");
    localStorage.removeItem("nextOneTimeSlots");
    localStorage.removeItem("nextInFlightSlots");
    localStorage.removeItem("swipedQuestIds");

    // Reset daily rewards localStorage
    localStorage.removeItem("dailyRewardsCheckedDays");
    localStorage.removeItem("hasClaimedDailyReward");
    localStorage.removeItem("lastClaimDate");

    // Reset quest state
    const newWeeklySlots = getRandomIndices(3, allWeeklyQuests.length);
    const newOneTimeSlots = getRandomIndices(3, allOneTimeQuests.length);
    const newInFlightSlots = getRandomIndices(3, allInFlightQuests.length);

    setSwipesLeft(3);
    setWeeklySlots(newWeeklySlots);
    setOneTimeSlots(newOneTimeSlots);
    setInFlightSlots(newInFlightSlots);
    setSwipedQuestIds([]);

    // Generate new next slots ensuring no duplicates
    const allCurrentSlots = [
      ...newWeeklySlots,
      ...newOneTimeSlots,
      ...newInFlightSlots,
    ];

    setNextWeeklySlots(
      newWeeklySlots.map(() => {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * allWeeklyQuests.length);
        } while (newWeeklySlots.includes(randomIndex));
        return randomIndex;
      })
    );

    setNextOneTimeSlots(
      newOneTimeSlots.map(() => {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * allOneTimeQuests.length);
        } while (newOneTimeSlots.includes(randomIndex));
        return randomIndex;
      })
    );

    setNextInFlightSlots(
      newInFlightSlots.map(() => {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * allInFlightQuests.length);
        } while (newInFlightSlots.includes(randomIndex));
        return randomIndex;
      })
    );

    // Reset Cathay Points
    setCathayPoints(2750);

    // Remove all vouchers
    ownedVouchers.forEach((voucher) => {
      removeVoucher(voucher.id);
    });

    // Increment reset count (will trigger survey after 5 presses)
    incrementResetCount();

    toast({
      title: "Variables Reset",
      description: "All variables have been reset to their original state",
    });
  };

  // Track completed state per slot so we can show completed UI and require a Next button
  const [weeklyCompleted, setWeeklyCompleted] = useState<boolean[]>(() =>
    weeklySlots.map(() => false)
  );
  const [oneTimeCompleted, setOneTimeCompleted] = useState<boolean[]>(() =>
    oneTimeSlots.map(() => false)
  );
  const [inFlightCompleted, setInFlightCompleted] = useState<boolean[]>(() =>
    inFlightSlots.map(() => false)
  );

  // When slots arrays change (new randomization), ensure completed arrays match length
  useEffect(() => {
    setWeeklyCompleted((prev) => weeklySlots.map((_, i) => prev[i] ?? false));
  }, [weeklySlots]);
  useEffect(() => {
    setOneTimeCompleted((prev) => oneTimeSlots.map((_, i) => prev[i] ?? false));
  }, [oneTimeSlots]);
  useEffect(() => {
    setInFlightCompleted((prev) =>
      inFlightSlots.map((_, i) => prev[i] ?? false)
    );
  }, [inFlightSlots]);

  const handleSwipeLeft = (
    questId: string,
    type: string,
    slotIndex: number
  ) => {
    if (swipesLeft > 0) {
      // Add the swiped quest to the blacklist
      setSwipedQuestIds((prev) => [...prev, questId]);

      setSwipesLeft((prev) => {
        const next = Math.max(prev - 1, 0);
        if (next === 0) {
          toast({
            title: "No Swipes Left!",
            description:
              "You've used all 3 swipes. Come back tomorrow for more!",
            variant: "destructive",
          });
        }
        return next;
      });

      // After animation, replace the swiped card with the pre-calculated next quest
      setTimeout(() => {
        if (type === "Weekly") {
          const newSlots = [...weeklySlots];
          // Use the pre-calculated next quest
          newSlots[slotIndex] = nextWeeklySlots[slotIndex];
          setWeeklySlots(newSlots);

          // Generate a new next quest for this slot
          const newNextSlots = [...nextWeeklySlots];
          const updatedSwipedIds = [...swipedQuestIds, questId];
          let randomIndex;
          let attempts = 0;
          do {
            randomIndex = Math.floor(Math.random() * allWeeklyQuests.length);
            attempts++;
            // Prevent infinite loop if all quests are used
            if (attempts > 100) break;
          } while (
            newSlots.includes(randomIndex) ||
            newNextSlots.includes(randomIndex) ||
            updatedSwipedIds.includes(allWeeklyQuests[randomIndex].id)
          );
          newNextSlots[slotIndex] = randomIndex;
          setNextWeeklySlots(newNextSlots);
        } else if (type === "One-Time") {
          const newSlots = [...oneTimeSlots];
          newSlots[slotIndex] = nextOneTimeSlots[slotIndex];
          setOneTimeSlots(newSlots);

          const newNextSlots = [...nextOneTimeSlots];
          const updatedSwipedIds = [...swipedQuestIds, questId];
          let randomIndex;
          let attempts = 0;
          do {
            randomIndex = Math.floor(Math.random() * allOneTimeQuests.length);
            attempts++;
            if (attempts > 100) break;
          } while (
            newSlots.includes(randomIndex) ||
            newNextSlots.includes(randomIndex) ||
            updatedSwipedIds.includes(allOneTimeQuests[randomIndex].id)
          );
          newNextSlots[slotIndex] = randomIndex;
          setNextOneTimeSlots(newNextSlots);
        } else if (type === "In-Flight") {
          const newSlots = [...inFlightSlots];
          newSlots[slotIndex] = nextInFlightSlots[slotIndex];
          setInFlightSlots(newSlots);

          const newNextSlots = [...nextInFlightSlots];
          const updatedSwipedIds = [...swipedQuestIds, questId];
          let randomIndex;
          let attempts = 0;
          do {
            randomIndex = Math.floor(Math.random() * allInFlightQuests.length);
            attempts++;
            if (attempts > 100) break;
          } while (
            newSlots.includes(randomIndex) ||
            newNextSlots.includes(randomIndex) ||
            updatedSwipedIds.includes(allInFlightQuests[randomIndex].id)
          );
          newNextSlots[slotIndex] = randomIndex;
          setNextInFlightSlots(newNextSlots);
        }
      }, 300);
    }
  };

  // Mark quest as completed (award points, set completed flag, but DO NOT change swipe count)
  const handleComplete = (
    questId: string,
    type: string,
    slotIndex: number,
    reward: number
  ) => {
    // Prevent duplicates
    setSwipedQuestIds((prev) => {
      if (prev.includes(questId)) return prev;
      return [...prev, questId];
    });

    // Award points
    addCathayPoints(reward);

    // Set completed flag for this slot
    if (type === "Weekly") {
      setWeeklyCompleted((prev) => {
        const next = [...prev];
        next[slotIndex] = true;
        return next;
      });
    } else if (type === "One-Time") {
      setOneTimeCompleted((prev) => {
        const next = [...prev];
        next[slotIndex] = true;
        return next;
      });
    } else if (type === "In-Flight") {
      setInFlightCompleted((prev) => {
        const next = [...prev];
        next[slotIndex] = true;
        return next;
      });
    }

    toast({
      title: "Quest verified",
      description: `+${reward} points added to your balance`,
    });
  };

  // Replace the completed card with the pre-calculated next quest (does NOT change swipe count)
  const handleNext = (type: string, slotIndex: number) => {
    if (type === "Weekly") {
      const newSlots = [...weeklySlots];
      newSlots[slotIndex] = nextWeeklySlots[slotIndex];
      setWeeklySlots(newSlots);

      // generate new next slot for this position
      const newNextSlots = [...nextWeeklySlots];
      const updatedSwipedIds = [...swipedQuestIds];
      let randomIndex;
      let attempts = 0;
      do {
        randomIndex = Math.floor(Math.random() * allWeeklyQuests.length);
        attempts++;
        if (attempts > 100) break;
      } while (
        newSlots.includes(randomIndex) ||
        newNextSlots.includes(randomIndex) ||
        updatedSwipedIds.includes(allWeeklyQuests[randomIndex].id)
      );
      newNextSlots[slotIndex] = randomIndex;
      setNextWeeklySlots(newNextSlots);

      setWeeklyCompleted((prev) => {
        const next = [...prev];
        next[slotIndex] = false;
        return next;
      });
    } else if (type === "One-Time") {
      const newSlots = [...oneTimeSlots];
      newSlots[slotIndex] = nextOneTimeSlots[slotIndex];
      setOneTimeSlots(newSlots);

      const newNextSlots = [...nextOneTimeSlots];
      const updatedSwipedIds = [...swipedQuestIds];
      let randomIndex;
      let attempts = 0;
      do {
        randomIndex = Math.floor(Math.random() * allOneTimeQuests.length);
        attempts++;
        if (attempts > 100) break;
      } while (
        newSlots.includes(randomIndex) ||
        newNextSlots.includes(randomIndex) ||
        updatedSwipedIds.includes(allOneTimeQuests[randomIndex].id)
      );
      newNextSlots[slotIndex] = randomIndex;
      setNextOneTimeSlots(newNextSlots);

      setOneTimeCompleted((prev) => {
        const next = [...prev];
        next[slotIndex] = false;
        return next;
      });
    } else if (type === "In-Flight") {
      const newSlots = [...inFlightSlots];
      newSlots[slotIndex] = nextInFlightSlots[slotIndex];
      setInFlightSlots(newSlots);

      const newNextSlots = [...nextInFlightSlots];
      const updatedSwipedIds = [...swipedQuestIds];
      let randomIndex;
      let attempts = 0;
      do {
        randomIndex = Math.floor(Math.random() * allInFlightQuests.length);
        attempts++;
        if (attempts > 100) break;
      } while (
        newSlots.includes(randomIndex) ||
        newNextSlots.includes(randomIndex) ||
        updatedSwipedIds.includes(allInFlightQuests[randomIndex].id)
      );
      newNextSlots[slotIndex] = randomIndex;
      setNextInFlightSlots(newNextSlots);

      setInFlightCompleted((prev) => {
        const next = [...prev];
        next[slotIndex] = false;
        return next;
      });
    }
  };

  return (
    <div
      className={`min-h-screen pb-20 transition-all duration-700 ${
        isInFlight ? "" : "bg-background"
      }`}
      style={
        isInFlight
          ? {
              backgroundColor: "hsl(174, 100%, 20%)",
            }
          : undefined
      }
    >
      <header
        className={`p-6 border-b space-y-4 transition-all duration-700 ${
          isInFlight
            ? "bg-gradient-to-br from-primary via-primary-glow to-primary border-primary-glow/30 shadow-glow"
            : "border-border shadow-card"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1
                className={`text-3xl font-bold transition-all duration-500 ${
                  isInFlight
                    ? "text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
                    : "text-foreground"
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetSwipes}
              className={`transition-all duration-500 ${
                isInFlight
                  ? "text-white/70 hover:text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Reset swipes and quests (for testing)"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <RefreshCw
                className={`w-4 h-4 ${
                  isInFlight ? "text-white/90" : "text-muted-foreground"
                }`}
              />
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
                isInFlight
                  ? "text-secondary drop-shadow-[0_2px_10px_rgba(227,9,38,0.5)]"
                  : "text-accent"
              }`}
            >
              {swipesLeft}/3
            </p>
            <div className="text-sm mt-1 transition-all duration-500">
              <p
                className={`text-xs leading-none ${
                  isInFlight ? "text-white/70" : "text-muted-foreground"
                }`}
              >
                <br /> Cathay Points
              </p>
              <p
                className={`text-3xl font-bold ${
                  isInFlight ? "text-white" : "text-foreground"
                }`}
              >
                {cathayPoints.toLocaleString()}
              </p>
            </div>
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
              Flight: {flightTimeLeft.hours}h {flightTimeLeft.minutes}m left
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsInFlight((prev) => !prev);
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-all duration-700 ${
                isInFlight
                  ? "bg-white/20 backdrop-blur-md border border-white/30"
                  : "bg-muted"
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
                  isInFlight
                    ? "text-white text-lg drop-shadow-md"
                    : "text-foreground"
                }`}
              >
                {isInFlight ? "In-Flight Mode" : "On-Ground Mode"}
              </p>
              <p
                className={`text-sm transition-all duration-500 ${
                  isInFlight
                    ? "text-white/90 drop-shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {isInFlight
                  ? "Flight CX888 • HKG → SIN"
                  : "No active flight detected"}
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
                  isInFlight
                    ? "text-white"
                    : "text-muted-foreground font-semibold"
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
            <h2 className="text-xl font-bold text-white px-2">
              In-Flight Quests
            </h2>
            {allInFlightQuests.length > 0 ? (
              <div className="space-y-3">
                {inFlightSlots.map((questIndex, slotIndex) => {
                  const quest = allInFlightQuests[questIndex];
                  const nextQuest =
                    allInFlightQuests[nextInFlightSlots[slotIndex]];
                  return (
                    <CompactQuestCard
                      key={`inflight-slot-${slotIndex}`}
                      quest={quest}
                      nextQuest={nextQuest}
                      isInFlight={isInFlight}
                      onSwipeLeft={() =>
                        handleSwipeLeft(quest.id, "In-Flight", slotIndex)
                      }
                      onComplete={() =>
                        handleComplete(
                          quest.id,
                          quest.type,
                          slotIndex,
                          quest.reward
                        )
                      }
                      onNext={() => handleNext(quest.type, slotIndex)}
                      completed={inFlightCompleted[slotIndex]}
                      swipesLeft={swipesLeft}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-white/70 text-center py-8">
                No in-flight quests available
              </p>
            )}
          </div>
        )}

        {/* On-Ground Mode - Show Weekly and One-Time Quests */}
        {!isInFlight && (
          <>
            {/* Weekly Quests */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground px-2">
                Weekly Quests
              </h2>
              {allWeeklyQuests.length > 0 ? (
                <div className="space-y-3">
                  {weeklySlots.map((questIndex, slotIndex) => {
                    const quest = allWeeklyQuests[questIndex];
                    const nextQuest =
                      allWeeklyQuests[nextWeeklySlots[slotIndex]];
                    return (
                      <CompactQuestCard
                        key={`weekly-slot-${slotIndex}`}
                        quest={quest}
                        nextQuest={nextQuest}
                        isInFlight={isInFlight}
                        onSwipeLeft={() =>
                          handleSwipeLeft(quest.id, "Weekly", slotIndex)
                        }
                        onComplete={() =>
                          handleComplete(
                            quest.id,
                            quest.type,
                            slotIndex,
                            quest.reward
                          )
                        }
                        onNext={() => handleNext(quest.type, slotIndex)}
                        completed={weeklyCompleted[slotIndex]}
                        swipesLeft={swipesLeft}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No weekly quests available
                </p>
              )}
            </div>

            {/* One-Time Quests */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground px-2">
                Milestones
              </h2>
              {allOneTimeQuests.length > 0 ? (
                <div className="space-y-3">
                  {oneTimeSlots.map((questIndex, slotIndex) => {
                    const quest = allOneTimeQuests[questIndex];
                    const nextQuest =
                      allOneTimeQuests[nextOneTimeSlots[slotIndex]];
                    return (
                      <CompactQuestCard
                        key={`onetime-slot-${slotIndex}`}
                        quest={quest}
                        nextQuest={nextQuest}
                        isInFlight={isInFlight}
                        onSwipeLeft={() =>
                          handleSwipeLeft(quest.id, "One-Time", slotIndex)
                        }
                        onComplete={() =>
                          handleComplete(
                            quest.id,
                            quest.type,
                            slotIndex,
                            quest.reward
                          )
                        }
                        onNext={() => handleNext(quest.type, slotIndex)}
                        completed={oneTimeCompleted[slotIndex]}
                        swipesLeft={swipesLeft}
                        disableSwipe={true}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No one-time quests available
                </p>
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

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Plane, Recycle, Bus, Brain, Film, Activity, ChevronDown, ChevronUp, Target, Award, Trophy, Coffee, Music, Book, Camera, Utensils, Moon, Languages, Wifi, Star, Droplet, Briefcase, ShoppingBag, Headphones, Newspaper } from "lucide-react";

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: string;
  timeLeft: string;
  location?: string;
  image: string;
}

interface CompactQuestCardProps {
  quest: Quest;
  nextQuest?: Quest; // used to render blurred preview behind during swipe
  isInFlight: boolean;
  onSwipeLeft?: () => void;
  swipesLeft: number;
  disableSwipe?: boolean;
}

const getQuestIcon = (title: string) => {
  if (title.includes("Check-in")) return Plane;
  if (title.includes("Recycle")) return Recycle;
  if (title.includes("Transport")) return Bus;
  if (title.includes("Quiz") || title.includes("Cultural")) return Brain;
  if (title.includes("Movie") || title.includes("Film") || title.includes("Documentary")) return Film;
  if (title.includes("Wellness") || title.includes("Stretching")) return Activity;
  if (title.includes("Complete") && title.includes("Quests")) return Target;
  if (title.includes("Book") && title.includes("Flights")) return Plane;
  if (title.includes("Eco Warrior")) return Award;
  if (title.includes("Frequent Flyer") || title.includes("miles")) return Trophy;
  if (title.includes("Coffee") || title.includes("Drink") || title.includes("Beverage")) return Coffee;
  if (title.includes("Music")) return Music;
  if (title.includes("Magazine") || title.includes("Reading")) return Book;
  if (title.includes("Photo") || title.includes("Sky")) return Camera;
  if (title.includes("Meal") || title.includes("Culinary") || title.includes("Snack")) return Utensils;
  if (title.includes("Sleep")) return Moon;
  if (title.includes("Language")) return Languages;
  if (title.includes("Wi-Fi") || title.includes("Wifi")) return Wifi;
  if (title.includes("Rating") || title.includes("Feedback") || title.includes("Survey")) return Star;
  if (title.includes("Hydration") || title.includes("Water")) return Droplet;
  if (title.includes("Business") || title.includes("Planner")) return Briefcase;
  if (title.includes("Shopping") || title.includes("Duty-Free")) return ShoppingBag;
  if (title.includes("Podcast")) return Headphones;
  if (title.includes("Destination") || title.includes("Explorer")) return MapPin;
  if (title.includes("Meditation")) return Activity;
  return Plane;
};

const getQuestDetails = (title: string) => {
  if (title.includes("Check-in")) {
    return {
      requirements: ["Valid boarding pass", "Airport kiosk access"],
      verification: "QR code scan at kiosk",
    };
  }
  if (title.includes("Recycle")) {
    return {
      requirements: ["Recyclable items", "Designated recycling bin"],
      verification: "Photo of recycling receipt",
    };
  }
  if (title.includes("Transport")) {
    return {
      requirements: ["Public transport ticket or pass"],
      verification: "Upload transport ticket photo",
    };
  }
  if (title.includes("Quiz") || title.includes("Cultural")) {
    return {
      requirements: ["Complete in-flight entertainment system access"],
      verification: "Automatic upon quiz completion",
    };
  }
  if (title.includes("Movie") || title.includes("Documentary")) {
    return {
      requirements: ["Access to in-flight entertainment"],
      verification: "Watch time tracked automatically",
    };
  }
  if (title.includes("Wellness") || title.includes("Stretching")) {
    return {
      requirements: ["Follow the exercise guide on screen"],
      verification: "Self-reported completion",
    };
  }
  if (title.includes("Complete") && title.includes("Quests")) {
    return {
      requirements: ["Complete any 50 quests from weekly or in-flight categories"],
      verification: "Automatically tracked through your quest history",
    };
  }
  if (title.includes("Book") && title.includes("Flights")) {
    return {
      requirements: ["Book 15 flights through the Cathay Pacific mobile app"],
      verification: "Automatically verified through booking system",
    };
  }
  if (title.includes("Eco Warrior")) {
    return {
      requirements: ["Complete 25 eco-friendly or sustainability quests"],
      verification: "Tracked automatically via quest completion data",
    };
  }
  if (title.includes("Frequent Flyer")) {
    return {
      requirements: ["Accumulate 100,000 total miles in your account"],
      verification: "Verified through your mileage balance",
    };
  }
  if (title.includes("Meal") || title.includes("Culinary")) {
    return {
      requirements: ["Browse menu and place order through entertainment system"],
      verification: "Order confirmation tracked automatically",
    };
  }
  if (title.includes("Drink") || title.includes("Coffee") || title.includes("Beverage")) {
    return {
      requirements: ["Order through entertainment system or cabin crew"],
      verification: "Order recorded in flight system",
    };
  }
  if (title.includes("Destination") || title.includes("Explorer")) {
    return {
      requirements: ["Access destination guide on entertainment system"],
      verification: "Time spent browsing tracked automatically",
    };
  }
  if (title.includes("Shopping") || title.includes("Duty-Free")) {
    return {
      requirements: ["Browse catalog and save at least 3 items"],
      verification: "Saved items tracked in your profile",
    };
  }
  if (title.includes("Language")) {
    return {
      requirements: ["Complete language lesson module on entertainment system"],
      verification: "Progress tracked automatically",
    };
  }
  if (title.includes("Sleep")) {
    return {
      requirements: ["Enable sleep mode and rest for at least 2 hours"],
      verification: "Sleep mode duration tracked",
    };
  }
  if (title.includes("Meditation")) {
    return {
      requirements: ["Follow guided meditation audio on entertainment system"],
      verification: "Session completion tracked",
    };
  }
  if (title.includes("Photo") || title.includes("Sky")) {
    return {
      requirements: ["Take a window view photo and share via app"],
      verification: "Photo upload confirmation",
    };
  }
  if (title.includes("Planner")) {
    return {
      requirements: ["Use onboard planning tools to create itinerary"],
      verification: "Saved itinerary in your account",
    };
  }
  if (title.includes("Podcast")) {
    return {
      requirements: ["Listen to complete episode on entertainment system"],
      verification: "Listening time tracked automatically",
    };
  }
  if (title.includes("Magazine") || title.includes("Reading")) {
    return {
      requirements: ["Read digital magazine content"],
      verification: "Reading time tracked automatically",
    };
  }
  if (title.includes("Snack")) {
    return {
      requirements: ["Order healthy snack option from menu"],
      verification: "Order confirmation in system",
    };
  }
  if (title.includes("Music")) {
    return {
      requirements: ["Listen to playlist for at least 30 minutes"],
      verification: "Listening duration tracked",
    };
  }
  if (title.includes("Wi-Fi") || title.includes("Wifi")) {
    return {
      requirements: ["Connect to inflight Wi-Fi service"],
      verification: "Connection logged automatically",
    };
  }
  if (title.includes("Rating") || title.includes("Feedback") || title.includes("Survey")) {
    return {
      requirements: ["Complete feedback form on entertainment system"],
      verification: "Survey submission confirmed",
    };
  }
  if (title.includes("Hydration") || title.includes("Water")) {
    return {
      requirements: ["Request and drink at least 3 glasses of water"],
      verification: "Self-reported with crew confirmation",
    };
  }
  return {
    requirements: ["Complete the quest requirements"],
    verification: "Automatic verification",
  };
};

export const CompactQuestCard = ({ quest, nextQuest, isInFlight, onSwipeLeft, swipesLeft, disableSwipe = false }: CompactQuestCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);

  // NEW: controls the unblur/fade-in of the next card
  const [promoteNext, setPromoteNext] = useState(false);

  const SWIPE_THRESHOLD = 120;

  const QuestIcon = getQuestIcon(quest.title);
  const NextQuestIcon = nextQuest ? getQuestIcon(nextQuest.title) : null;
  const questDetails = getQuestDetails(quest.title);

  // Reset transient state whenever the top card changes
  useEffect(() => {
    setDragX(0);
    setIsExpanded(false);
    setIsDragging(false);
    setIsRemoving(false);
    setPromoteNext(false);
  }, [quest?.id]);

  const handleHeaderClick = (e: React.MouseEvent) => {
    if (!hasMoved) {
      setIsExpanded(!isExpanded);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (disableSwipe) return;
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || disableSwipe) return;
    const newDragX = e.clientX - startX;
    if (Math.abs(newDragX) > 2) setHasMoved(true);
    const clamped = Math.min(0, newDragX);
    setDragX(clamped);
    // Don't promote during drag - keep blurred
  };

  const onPointerUp = () => {
    const swiped = dragX <= -SWIPE_THRESHOLD;
    setIsDragging(false);

    if (swiped) {
      if (swipesLeft > 0 && !disableSwipe) {
        setIsRemoving(true);
        setPromoteNext(true);
        setDragX(-400);

        // Trigger parent immediately; parent handles a 300ms delay before swapping
        onSwipeLeft?.();

        // Reset local visuals shortly after the parent swap
        setTimeout(() => {
          setIsRemoving(false);
          setPromoteNext(false);
        }, 340);
      } else {
        setIsWiggling(true);
        setDragX(0);
        setTimeout(() => setIsWiggling(false), 100);
      }
    } else {
      setDragX(0);
      setPromoteNext(false);
    }

    setTimeout(() => setHasMoved(false), 50);
  };

  return (
    <div className="relative">
      {nextQuest && ((isDragging && dragX < -20) || isRemoving) && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <Card
            className={`${
              isInFlight ? "bg-white/10 border-white/30" : "bg-card border-border"
            } overflow-hidden`}
            style={{
              // Heavily blur until swipe is committed
              filter: `blur(${promoteNext ? 0 : 5}px) brightness(0.9)`,
              opacity: promoteNext ? 1 : 1,
              transform: "scale(0.98)",
              transition: "filter 250ms ease, opacity 250ms ease, transform 200ms ease",
            }}
          >
            {/* duplicated next card content (unchanged) */}
            <div className="flex gap-4 p-4">
              <div
                className={`${
                  isInFlight ? "bg-white/20 border border-white/30" : "bg-muted"
                } w-16 h-16 flex-shrink-0 rounded-lg flex items-center justify-center`}
              >
                {NextQuestIcon ? (
                  <NextQuestIcon className={`w-8 h-8 ${isInFlight ? "text-white/80" : "text-muted-foreground"}`} />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`font-bold text-base ${isInFlight ? "text-white/80" : "text-foreground"}`}>
                    {nextQuest?.title}
                  </h3>
                  <Badge
                    className={`${
                      isInFlight ? "bg-secondary/80 text-white border-secondary/20" : "bg-accent text-accent-foreground"
                    } flex-shrink-0`}
                  >
                    +{nextQuest?.reward}
                  </Badge>
                </div>
                <p className={`text-sm line-clamp-2 ${isInFlight ? "text-white/70" : "text-muted-foreground"}`}>
                  {nextQuest?.description}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* FOREGROUND (current) CARD — unchanged except for transform/opacity */}
      <Card
        className={`overflow-hidden select-none touch-pan-y ${
          isRemoving
            ? "transition-all duration-300 ease-out"
            : isWiggling
              ? "transition-all duration-100"
              : "transition-transform duration-200"
        } ${
          isInFlight
            ? "bg-white/10 border-white/30 backdrop-blur-sm hover:bg-white/15"
            : "bg-card border-border hover:shadow-md"
        }`}
        style={{
          transform: `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`,
          opacity: dragX < -SWIPE_THRESHOLD && swipesLeft > 0 && !disableSwipe ? 0.7 : 1,
          userSelect: "none",
          willChange: "transform, opacity",
          position: "relative",
          zIndex: 1,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Collapsed View */}
        <div className="flex gap-4 p-4" onClick={handleHeaderClick}>
          {/* Quest Icon */}
          <div
            className={`${
              isInFlight ? "bg-white/20 border border-white/30" : "bg-muted"
            } w-16 h-16 flex-shrink-0 rounded-lg flex items-center justify-center`}
          >
            <QuestIcon className={`w-8 h-8 ${isInFlight ? "text-white" : "text-muted-foreground"}`} />
          </div>

          {/* Quest Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className={`font-bold text-base ${isInFlight ? "text-white" : "text-foreground"}`}>{quest.title}</h3>
              <Badge
                className={`${
                  isInFlight ? "bg-secondary text-white border-secondary/20" : "bg-accent text-accent-foreground"
                } flex-shrink-0`}
              >
                +{quest.reward}
              </Badge>
            </div>

            <p
              className={`text-sm ${isExpanded ? "" : "line-clamp-2"} mb-3 min-h-[2.5rem] ${
                isInFlight ? "text-white/80" : "text-muted-foreground"
              }`}
            >
              {quest.description}
            </p>

            {!isExpanded && quest.description.length > 80 && (
              <button
                type="button"
                className={`${isInFlight ? "text-white/80 hover:text-white" : "text-accent hover:text-accent"} text-xs font-medium underline`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
                }}
              >
                Show more
              </button>
            )}
            {!isExpanded && (
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Clock className={`w-3 h-3 ${isInFlight ? "text-white/70" : "text-muted-foreground"}`} />
                  <span className={isInFlight ? "text-white/70" : "text-muted-foreground"}>{quest.timeLeft}</span>
                </div>
                {quest.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className={`w-3 h-3 ${isInFlight ? "text-white/70" : "text-muted-foreground"}`} />
                    <span className={`line-clamp-1 ${isInFlight ? "text-white/70" : "text-muted-foreground"}`}>
                      {quest.location}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Expand Icon */}
          <div className="flex items-center">
            {isExpanded ? (
              <ChevronUp className={`w-5 h-5 ${isInFlight ? "text-white/70" : "text-muted-foreground"}`} />
            ) : (
              <ChevronDown className={`w-5 h-5 ${isInFlight ? "text-white/70" : "text-muted-foreground"}`} />
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className={`px-4 pb-4 space-y-4 border-t ${isInFlight ? "border-white/20" : "border-border"}`}>
            {/* Time and Location */}
            <div className="flex items-center gap-4 text-sm pt-4">
              <div className="flex items-center gap-1">
                <Clock className={`w-4 h-4 ${isInFlight ? "text-white/70" : "text-muted-foreground"}`} />
                <span className={isInFlight ? "text-white/80" : "text-muted-foreground"}>{quest.timeLeft}</span>
              </div>
              {quest.location && (
                <div className="flex items-center gap-1">
                  <MapPin className={`w-4 h-4 ${isInFlight ? "text-white/70" : "text-muted-foreground"}`} />
                  <span className={isInFlight ? "text-white/80" : "text-muted-foreground"}>{quest.location}</span>
                </div>
              )}
            </div>

            {/* Requirements */}
            <div>
              <h4 className={`font-semibold text-sm mb-2 ${isInFlight ? "text-white" : "text-foreground"}`}>
                Requirements
              </h4>
              <ul className={`text-sm space-y-1 ${isInFlight ? "text-white/80" : "text-muted-foreground"}`}>
                {questDetails.requirements.map((req, idx) => (
                  <li key={idx}>• {req}</li>
                ))}
              </ul>
            </div>

            {/* Verification */}
            <div>
              <h4 className={`font-semibold text-sm mb-2 ${isInFlight ? "text-white" : "text-foreground"}`}>
                Verification Method
              </h4>
              <p className={`text-sm ${isInFlight ? "text-white/80" : "text-muted-foreground"}`}>
                {questDetails.verification}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Plane, Recycle, Bus, Brain, Film, Activity, ChevronDown, ChevronUp } from "lucide-react";

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
  if (title.includes("Quiz")) return Brain;
  if (title.includes("Entertainment")) return Film;
  if (title.includes("Wellness")) return Activity;
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
  if (title.includes("Quiz")) {
    return {
      requirements: ["Complete in-flight entertainment system access"],
      verification: "Automatic upon quiz completion",
    };
  }
  if (title.includes("Entertainment")) {
    return {
      requirements: ["Access to in-flight entertainment"],
      verification: "Watch time tracked automatically",
    };
  }
  if (title.includes("Wellness")) {
    return {
      requirements: ["Follow the exercise guide"],
      verification: "Self-reported completion",
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

  const SWIPE_THRESHOLD = 8;

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
    if (Math.abs(newDragX) > 3) setHasMoved(true);
    setDragX(Math.min(0, newDragX * 1.25));
  };

  const onPointerUp = () => {
    const swiped = dragX <= -SWIPE_THRESHOLD;
    setIsDragging(false);

    if (swiped) {
      if (swipesLeft > 0) {
        setIsRemoving(true);

        // Make the preview become the "real" visible card while the current slides out
        setPromoteNext(true);

        setDragX(-400);
        setTimeout(() => {
          onSwipeLeft?.(); // parent replaces quest with nextQuest
          setIsRemoving(false); // overlay will hide via condition
          setPromoteNext(false); // safety reset
        }, 360);
      } else {
        setIsWiggling(true);
        setDragX(0);
        setTimeout(() => setIsWiggling(false), 100);
      }
    } else {
      setDragX(0);
    }

    setTimeout(() => setHasMoved(false), 50);
  };

  return (
    <div className="relative">
      {nextQuest && ((isDragging && dragX < 0) || isRemoving) && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <Card
            className={`${
              // Use the SAME styling as a real card (not a washed-out ghost)
              isInFlight ? "bg-white/10 border-white/30 backdrop-blur-sm" : "bg-card border-border"
            } overflow-hidden`}
            style={{
              // Smoothly unblur & brighten as we promote the next card
              filter: `blur(${promoteNext ? 0 : 6}px)`,
              opacity: promoteNext ? 1 : 0.7,
              transform: "translateX(10px) scale(0.98)",
              transition: "filter 220ms ease, opacity 220ms ease, transform 200ms ease",
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

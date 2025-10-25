import { useState } from "react";
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
  isInFlight: boolean;
  onSwipeLeft?: () => void;
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

export const CompactQuestCard = ({ quest, isInFlight, onSwipeLeft }: CompactQuestCardProps) => {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [startX, setStartX] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const QuestIcon = getQuestIcon(quest.title);
  const questDetails = getQuestDetails(quest.title);

  const handleStart = (clientX: number) => {
    setStartX(clientX);
    setIsDragging(true);
    setHasMoved(false);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    if (Math.abs(diff) > 10) {
      setHasMoved(true);
    }
    if (diff < 0) { // Only allow left swipe
      setDragX(diff);
    }
  };

  const handleEnd = () => {
    const wasSwiped = dragX < -60; // lowered threshold for easier swipe
    setIsDragging(false);
    
    if (wasSwiped && onSwipeLeft) {
      onSwipeLeft();
    }
    
    setDragX(0);
    
    // Reset hasMoved after a short delay to allow click detection
    setTimeout(() => setHasMoved(false), 100);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!hasMoved && !isDragging) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 cursor-pointer ${
        isInFlight
          ? "bg-white/10 border-white/30 backdrop-blur-sm hover:bg-white/15"
          : "bg-card border-border hover:shadow-md"
      }`}
      style={{
        transform: `translateX(${dragX}px)`,
        opacity: dragX < -50 ? 0.5 : 1,
        touchAction: "pan-y",
      }}
      onMouseDown={(e) => {
        handleStart(e.clientX);
        const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
        const handleMouseUp = () => {
          handleEnd();
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }}
      onTouchStart={(e) => {
        handleStart(e.touches[0].clientX);
        const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
        const handleTouchEnd = () => {
          handleEnd();
          document.removeEventListener("touchmove", handleTouchMove);
          document.removeEventListener("touchend", handleTouchEnd);
        };
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);
      }}
      onClick={handleClick}
    >
      {/* Collapsed View */}
      <div className="flex gap-4 p-4">
        {/* Quest Icon */}
        <div className={`w-16 h-16 flex-shrink-0 rounded-lg flex items-center justify-center ${
          isInFlight
            ? "bg-white/20 border border-white/30"
            : "bg-muted"
        }`}>
          <QuestIcon className={`w-8 h-8 ${
            isInFlight ? "text-white" : "text-muted-foreground"
          }`} />
        </div>

        {/* Quest Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`font-bold text-base ${
              isInFlight ? "text-white" : "text-foreground"
            }`}>
              {quest.title}
            </h3>
            <Badge className={`flex-shrink-0 ${
              isInFlight
                ? "bg-secondary text-white border-secondary/20"
                : "bg-accent text-accent-foreground"
            }`}>
              +{quest.reward}
            </Badge>
          </div>

          <p className={`text-sm ${isExpanded ? "" : "line-clamp-2"} mb-3 ${
            isInFlight ? "text-white/80" : "text-muted-foreground"
          }`}>
            {quest.description}
          </p>

          {!isExpanded && (
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Clock className={`w-3 h-3 ${isInFlight ? "text-white/70" : "text-muted-foreground"}`} />
                <span className={isInFlight ? "text-white/70" : "text-muted-foreground"}>
                  {quest.timeLeft}
                </span>
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
        <div className={`px-4 pb-4 space-y-4 border-t ${
          isInFlight ? "border-white/20" : "border-border"
        }`}>
          {/* Time and Location */}
          <div className="flex items-center gap-4 text-sm pt-4">
            <div className="flex items-center gap-1">
              <Clock className={`w-4 h-4 ${isInFlight ? "text-white/70" : "text-muted-foreground"}`} />
              <span className={isInFlight ? "text-white/80" : "text-muted-foreground"}>
                {quest.timeLeft}
              </span>
            </div>
            {quest.location && (
              <div className="flex items-center gap-1">
                <MapPin className={`w-4 h-4 ${isInFlight ? "text-white/70" : "text-muted-foreground"}`} />
                <span className={isInFlight ? "text-white/80" : "text-muted-foreground"}>
                  {quest.location}
                </span>
              </div>
            )}
          </div>

          {/* Requirements */}
          <div>
            <h4 className={`font-semibold text-sm mb-2 ${
              isInFlight ? "text-white" : "text-foreground"
            }`}>
              Requirements
            </h4>
            <ul className={`text-sm space-y-1 ${
              isInFlight ? "text-white/80" : "text-muted-foreground"
            }`}>
              {questDetails.requirements.map((req, idx) => (
                <li key={idx}>• {req}</li>
              ))}
            </ul>
          </div>

          {/* Verification */}
          <div>
            <h4 className={`font-semibold text-sm mb-2 ${
              isInFlight ? "text-white" : "text-foreground"
            }`}>
              Verification Method
            </h4>
            <p className={`text-sm ${
              isInFlight ? "text-white/80" : "text-muted-foreground"
            }`}>
              {questDetails.verification}
            </p>
          </div>

        </div>
      )}
    </Card>
  );
};

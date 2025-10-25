import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";

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

export const CompactQuestCard = ({ quest, isInFlight, onSwipeLeft }: CompactQuestCardProps) => {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
  };

  const handleMove = (clientX: number, startX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    if (diff < 0) { // Only allow left swipe
      setDragX(diff);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    if (dragX < -100 && onSwipeLeft) {
      onSwipeLeft();
    }
    setDragX(0);
  };

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${
        isInFlight
          ? "bg-white/10 border-white/30 backdrop-blur-sm"
          : "bg-card border-border"
      }`}
      style={{
        transform: `translateX(${dragX}px)`,
        opacity: dragX < -50 ? 0.5 : 1,
      }}
      onMouseDown={(e) => {
        const startX = e.clientX;
        handleStart(startX);
        const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, startX);
        const handleMouseUp = () => {
          handleEnd();
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }}
      onTouchStart={(e) => {
        const startX = e.touches[0].clientX;
        handleStart(startX);
        const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, startX);
        const handleTouchEnd = () => {
          handleEnd();
          document.removeEventListener("touchmove", handleTouchMove);
          document.removeEventListener("touchend", handleTouchEnd);
        };
        document.addEventListener("touchmove", handleTouchMove);
        document.addEventListener("touchend", handleTouchEnd);
      }}
    >
      <div className="flex gap-4 p-4">
        {/* Quest Image */}
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={quest.image}
            alt={quest.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Quest Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`font-bold text-base line-clamp-1 ${
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

          <p className={`text-sm line-clamp-2 mb-3 ${
            isInFlight ? "text-white/80" : "text-muted-foreground"
          }`}>
            {quest.description}
          </p>

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
        </div>

        {/* Accept Button */}
        <div className="flex items-center">
          <Button
            size="sm"
            className={isInFlight ? "bg-secondary hover:bg-secondary/90 text-white" : ""}
          >
            Accept
          </Button>
        </div>
      </div>
    </Card>
  );
};

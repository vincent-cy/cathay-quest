import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Trophy, X, Heart } from "lucide-react";

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

interface SwipeableQuestProps {
  quest: Quest;
  onAccept: () => void;
  onReject: () => void;
}

export const SwipeableQuest = ({ quest, onAccept, onReject }: SwipeableQuestProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState(0);
  const [startX, setStartX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    setOffset(currentX - startX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (offset > 100) {
      onAccept();
    } else if (offset < -100) {
      onReject();
    }
    setOffset(0);
  };

  const rotation = offset / 10;
  const opacity = 1 - Math.abs(offset) / 300;

  return (
    <div
      className="touch-none select-none"
      style={{
        transform: `translateX(${offset}px) rotate(${rotation}deg)`,
        opacity,
        transition: isDragging ? "none" : "all 0.3s ease-out",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Card className="relative overflow-hidden shadow-elevated mx-4">
        <div className="h-[60vh] relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/95 z-10" />
          <img
            src={quest.image}
            alt={quest.title}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute top-4 left-4 right-4 z-20 flex gap-2">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              {quest.type}
            </Badge>
            <Badge className="bg-accent/80 backdrop-blur-sm ml-auto">
              <Trophy className="w-3 h-3 mr-1" />
              {quest.reward} miles
            </Badge>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 space-y-3">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">{quest.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{quest.description}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {quest.timeLeft}
              </div>
              {quest.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {quest.location}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-14 rounded-full"
                onClick={onReject}
              >
                <X className="w-6 h-6" />
              </Button>
              <Button
                variant="default"
                size="lg"
                className="flex-1 h-14 rounded-full bg-accent hover:bg-accent/90"
                onClick={onAccept}
              >
                <Heart className="w-6 h-6 mr-2" />
                Accept Quest
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {offset > 50 && (
        <div className="absolute top-1/4 right-8 text-accent text-6xl font-bold opacity-70 rotate-12">
          ✓
        </div>
      )}
      {offset < -50 && (
        <div className="absolute top-1/4 left-8 text-destructive text-6xl font-bold opacity-70 -rotate-12">
          ✗
        </div>
      )}
    </div>
  );
};

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
  const [isExiting, setIsExiting] = useState(false);

  const handleStart = (clientX: number) => {
    if (isExiting) return;
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || isExiting) return;
    setOffset(clientX - startX);
  };

  const handleEnd = () => {
    setIsDragging(false);
    const threshold = 80; // Lower threshold for easier swiping
    
    if (offset > threshold) {
      // Swipe right - Accept
      setIsExiting(true);
      setOffset(400);
      setTimeout(() => {
        onAccept();
        setIsExiting(false);
        setOffset(0);
      }, 300);
    } else if (offset < -threshold) {
      // Swipe left - Reject
      setIsExiting(true);
      setOffset(-400);
      setTimeout(() => {
        onReject();
        setIsExiting(false);
        setOffset(0);
      }, 300);
    } else {
      setOffset(0);
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Mouse handlers for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  const rotation = offset / 15;
  const scale = isDragging ? 0.95 : 1;
  const acceptOpacity = Math.min(offset / 100, 1);
  const rejectOpacity = Math.min(Math.abs(offset) / 100, 1);

  return (
    <div
      className="touch-none select-none cursor-grab active:cursor-grabbing relative"
      style={{
        transform: `translateX(${offset}px) rotate(${rotation}deg) scale(${scale})`,
        transition: isDragging ? "none" : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="relative overflow-hidden shadow-elevated mx-4">
        <div className="h-[60vh] relative">
          {/* Color overlays for swipe direction */}
          <div 
            className="absolute inset-0 bg-primary z-[5] transition-opacity pointer-events-none"
            style={{ opacity: offset > 0 ? acceptOpacity * 0.3 : 0 }}
          />
          <div 
            className="absolute inset-0 bg-destructive z-[5] transition-opacity pointer-events-none"
            style={{ opacity: offset < 0 ? rejectOpacity * 0.3 : 0 }}
          />
          
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

      {/* Accept indicator */}
      {offset > 30 && (
        <div 
          className="absolute top-1/3 right-6 transform -translate-y-1/2"
          style={{ opacity: acceptOpacity }}
        >
          <div className="bg-primary rounded-full p-4 shadow-glow">
            <Heart className="w-12 h-12 text-white fill-white" />
          </div>
          <p className="text-center mt-2 text-primary font-bold text-xl">ACCEPT</p>
        </div>
      )}
      
      {/* Reject indicator */}
      {offset < -30 && (
        <div 
          className="absolute top-1/3 left-6 transform -translate-y-1/2"
          style={{ opacity: rejectOpacity }}
        >
          <div className="bg-destructive rounded-full p-4 shadow-elevated">
            <X className="w-12 h-12 text-white" />
          </div>
          <p className="text-center mt-2 text-destructive font-bold text-xl">SKIP</p>
        </div>
      )}
      
      {/* Swipe instruction hint */}
      {offset === 0 && !isDragging && !isExiting && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-30 animate-pulse">
          <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-2xl">←</span>
            <span className="text-xs font-medium text-muted-foreground">Swipe to choose</span>
            <span className="text-2xl">→</span>
          </div>
        </div>
      )}
    </div>
  );
};

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Trophy, X, Heart, AlertCircle, CheckCircle2, Shield } from "lucide-react";

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
  isInFlight?: boolean;
  isBackground?: boolean;
}

const getQuestDetails = (questType: string) => {
  switch (questType.toLowerCase()) {
    case "weekly":
      return {
        title: "Weekly Mission",
        description: "Complete this quest within the week to earn bonus miles. These missions refresh every Monday and offer higher rewards for consistent participation.",
        requirements: [
          "Complete the task within 7 days",
          "Verification required through app",
          "Limited to one completion per week"
        ],
        verificationMethod: "Partner API + Device Attestation"
      };
    case "daily":
      return {
        title: "Daily Challenge",
        description: "Quick missions that help you build a daily streak. The longer your streak, the higher your multiplier bonus on all quest rewards.",
        requirements: [
          "Complete within 24 hours",
          "Maintains your login streak",
          "Can be completed multiple times"
        ],
        verificationMethod: "Geofence + Timestamp"
      };
    case "in-flight":
      return {
        title: "In-Flight Quest",
        description: "Special missions available only during your flight. Complete destination quizzes, wellness challenges, or entertainment activities to earn miles while traveling.",
        requirements: [
          "Flight mode must be active",
          "Complete during flight duration",
          "No internet connection required"
        ],
        verificationMethod: "Flight Booking Reference"
      };
    default:
      return {
        title: "Quest Mission",
        description: "Earn Asia Miles by completing verified micro-actions. Each quest is designed to be quick, rewarding, and contribute to sustainable travel habits.",
        requirements: [
          "Follow quest instructions",
          "Complete verification steps",
          "Submit within time limit"
        ],
        verificationMethod: "Multi-Factor Verification"
      };
  }
};

export const SwipeableQuest = ({ quest, onAccept, onReject, isInFlight = false, isBackground = false }: SwipeableQuestProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  
  const details = getQuestDetails(quest.type);

  const handleStart = (clientX: number) => {
    if (isExiting || isBackground) return;
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || isExiting) return;
    setOffset(clientX - startX);
  };

  const handleEnd = () => {
    setIsDragging(false);
    const threshold = 80;
    
    if (offset > threshold) {
      // Swipe right - Accept
      setIsExiting(true);
      setExitDirection('right');
      setOffset(window.innerWidth);
      setTimeout(() => {
        onAccept();
        setIsExiting(false);
        setExitDirection(null);
        setOffset(0);
      }, 400);
    } else if (offset < -threshold) {
      // Swipe left - Reject
      setIsExiting(true);
      setExitDirection('left');
      setOffset(-window.innerWidth);
      setTimeout(() => {
        onReject();
        setIsExiting(false);
        setExitDirection(null);
        setOffset(0);
      }, 400);
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

  const rotation = isExiting ? offset / 20 : offset / 15;
  const scale = isDragging ? 0.95 : 1;
  const acceptOpacity = Math.min(Math.max(offset / 100, 0), 1);
  const rejectOpacity = Math.min(Math.max(Math.abs(offset) / 100, 0), 1);
  
  // Glow intensity based on swipe distance
  const glowIntensity = Math.min(Math.abs(offset) / 150, 1);

  // 3D perspective effect based on drag
  const perspective = 1000;
  const rotateY = offset / 10;
  const rotateX = isDragging ? -5 : 0;

  return (
    <div
      className={`${isBackground ? 'pointer-events-none' : 'touch-none select-none cursor-grab active:cursor-grabbing'} relative`}
      style={{
        perspective: `${perspective}px`,
      }}
    >
      <div
        style={{
          transform: isBackground 
            ? "translateX(0px) rotateY(0deg) rotateX(0deg) scale(1)" 
            : `translateX(${offset}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`,
          transformStyle: "preserve-3d",
          transition: isBackground 
            ? "none" 
            : isDragging ? "none" : isExiting ? "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: isBackground ? 1 : isExiting ? 0 : 1,
        }}
        onTouchStart={isBackground ? undefined : handleTouchStart}
        onTouchMove={isBackground ? undefined : handleTouchMove}
        onTouchEnd={isBackground ? undefined : handleTouchEnd}
        onMouseDown={isBackground ? undefined : handleMouseDown}
        onMouseMove={isBackground ? undefined : handleMouseMove}
        onMouseUp={isBackground ? undefined : handleMouseUp}
        onMouseLeave={isBackground ? undefined : handleMouseLeave}
      >
        <Card className="relative overflow-hidden mx-4" style={{
          boxShadow: `
            0 ${20 + Math.abs(offset) / 10}px ${40 + Math.abs(offset) / 5}px -10px rgba(0, 0, 0, 0.3),
            0 ${10 + Math.abs(offset) / 20}px ${20 + Math.abs(offset) / 10}px -5px rgba(0, 0, 0, 0.2)
          `,
        }}>
          {/* Quest Image Section */}
          <div className="h-[50vh] relative">
            {/* Left side gold glow when swiping left - 3D enhanced */}
            <div 
              className="absolute top-0 bottom-0 left-0 w-4 pointer-events-none z-[15] transition-all"
              style={{
                opacity: offset < 0 ? glowIntensity : 0,
                boxShadow: offset < 0 ? `
                  0 0 ${50 * glowIntensity}px ${25 * glowIntensity}px hsl(45 33% 71%),
                  inset 0 0 ${30 * glowIntensity}px ${10 * glowIntensity}px hsl(45 33% 71%)
                ` : 'none',
                background: offset < 0 ? `linear-gradient(to right, hsl(45 33% 71%), transparent)` : 'transparent',
                transform: `translateZ(${50 * glowIntensity}px)`,
              }}
            />
            
            {/* Right side green glow when swiping right - 3D enhanced */}
            <div 
              className="absolute top-0 bottom-0 right-0 w-4 pointer-events-none z-[15] transition-all"
              style={{
                opacity: offset > 0 ? glowIntensity : 0,
                boxShadow: offset > 0 ? `
                  0 0 ${50 * glowIntensity}px ${25 * glowIntensity}px hsl(142 76% 45%),
                  inset 0 0 ${30 * glowIntensity}px ${10 * glowIntensity}px hsl(142 76% 45%)
                ` : 'none',
                background: offset > 0 ? `linear-gradient(to left, hsl(142 76% 45%), transparent)` : 'transparent',
                transform: `translateZ(${50 * glowIntensity}px)`,
              }}
            />
            
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-background/95" />
            <img
              src={quest.image}
              alt={quest.title}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute top-6 left-6 right-6 z-20 flex gap-3">
              <Badge variant="outline" className="backdrop-blur-md text-base px-4 py-2 shadow-lg border-2 bg-background/90" style={{
                transform: 'translateZ(30px)',
              }}>
                {quest.type}
              </Badge>
              <Badge className="backdrop-blur-md ml-auto text-base px-4 py-2 shadow-lg bg-accent/90" style={{
                transform: 'translateZ(30px)',
              }}>
                <Trophy className="w-5 h-5 mr-2" />
                {quest.reward} pts
              </Badge>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 space-y-4" style={{
              transform: 'translateZ(40px)',
            }}>
              <div className="space-y-3">
                <h2 className="text-4xl font-bold drop-shadow-lg text-foreground">{quest.title}</h2>
                <p className="text-base leading-relaxed drop-shadow-md text-muted-foreground">{quest.description}</p>
              </div>

              <div className="flex items-center gap-6 text-base text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">{quest.timeLeft}</span>
                </div>
                {quest.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">{quest.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quest Details Section */}
          <div className="p-6 space-y-4 bg-background">
            {/* Quest Type Description */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card shadow-card">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary/10">
                <AlertCircle className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold mb-1 text-foreground">{details.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {details.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            <div className="p-4 rounded-lg bg-card shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <h4 className="font-semibold text-sm text-foreground">Requirements</h4>
              </div>
              <ul className="space-y-2">
                {details.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-accent">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verification Method */}
            <div className="p-4 rounded-lg bg-card shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-sm text-foreground">Verification Method</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                {details.verificationMethod}
              </p>
              <Badge variant="outline" className="mt-3 text-xs bg-primary/5 text-primary border-primary/20">
                Fraud-Protected
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-16 rounded-full text-lg shadow-elevated"
                onClick={onReject}
              >
                <X className="w-7 h-7" />
              </Button>
              <Button
                variant="default"
                size="lg"
                className={`flex-1 h-16 rounded-full text-lg font-bold shadow-elevated ${
                  isInFlight 
                    ? 'bg-secondary hover:bg-secondary/90 text-white' 
                    : 'bg-accent hover:bg-accent/90'
                }`}
                onClick={onAccept}
              >
                <Heart className="w-7 h-7 mr-2" />
                Accept Quest
              </Button>
            </div>
          </div>
        </Card>

        {/* Accept indicator - 3D enhanced */}
        {offset > 30 && (
          <div 
            className="absolute top-1/3 right-8 transform -translate-y-1/2 z-30"
            style={{ 
              opacity: acceptOpacity,
              transform: `translateY(-50%) translateZ(${60 * acceptOpacity}px) scale(${1 + acceptOpacity * 0.2})`,
            }}
          >
            <div className="bg-primary rounded-full p-6 shadow-glow animate-pulse">
              <Heart className="w-16 h-16 text-white fill-white drop-shadow-2xl" />
            </div>
            <p className="text-center mt-3 text-primary font-bold text-2xl drop-shadow-lg">ACCEPT</p>
          </div>
        )}
        
        {/* Reject indicator - 3D enhanced */}
        {offset < -30 && (
          <div 
            className="absolute top-1/3 left-8 transform -translate-y-1/2 z-30"
            style={{ 
              opacity: rejectOpacity,
              transform: `translateY(-50%) translateZ(${60 * rejectOpacity}px) scale(${1 + rejectOpacity * 0.2})`,
            }}
          >
            <div className="bg-destructive rounded-full p-6 shadow-elevated animate-pulse">
              <X className="w-16 h-16 text-white drop-shadow-2xl" />
            </div>
            <p className="text-center mt-3 text-destructive font-bold text-2xl drop-shadow-lg">SKIP</p>
          </div>
        )}
      </div>
    </div>
  );
};

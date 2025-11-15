import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  MapPin,
  Plane,
  Recycle,
  Bus,
  Brain,
  Film,
  Activity,
  ChevronDown,
  ChevronUp,
  Target,
  Award,
  Trophy,
  Coffee,
  Music,
  Book,
  Camera,
  Utensils,
  Moon,
  Languages,
  Wifi,
  Star,
  Droplet,
  Briefcase,
  ShoppingBag,
  Headphones,
  Newspaper,
  QrCode,
  Check,
  X,
  Upload,
  RotateCcw,
  Hourglass,
} from "lucide-react";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: string;
  timeLeft: string;
  location?: string;
  image?: string;
  qrEnabled: boolean;
  snapPhoto?: boolean;
  uploadPhoto?: boolean;
  gpsLocation?: boolean;
  freeQuest?: boolean;
  requirements: string[];
  verification: string;
  progress?: number;
}

interface CompactQuestCardProps {
  quest: Quest;
  nextQuest?: Quest; // used to render blurred preview behind during swipe
  isInFlight: boolean;
  onSwipeLeft?: () => void;
  swipesLeft: number;
  disableSwipe?: boolean;
  onComplete?: () => void;
  onNext?: () => void;
  completed?: boolean;
}

const getQuestIcon = (title: string) => {
  if (title.includes("Check-in")) return Plane;
  if (title.includes("Recycle")) return Recycle;
  if (title.includes("Transport")) return Bus;
  if (title.includes("Quiz") || title.includes("Cultural")) return Brain;
  if (
    title.includes("Movie") ||
    title.includes("Film") ||
    title.includes("Documentary")
  )
    return Film;
  if (title.includes("Wellness") || title.includes("Stretching"))
    return Activity;
  if (title.includes("Complete") && title.includes("Quests")) return Target;
  if (title.includes("Book") && title.includes("Flights")) return Plane;
  if (title.includes("Eco Warrior")) return Award;
  if (title.includes("Frequent Flyer") || title.includes("miles"))
    return Trophy;
  if (
    title.includes("Coffee") ||
    title.includes("Drink") ||
    title.includes("Beverage")
  )
    return Coffee;
  if (title.includes("Music")) return Music;
  if (title.includes("Magazine") || title.includes("Reading")) return Book;
  if (title.includes("Photo") || title.includes("Sky")) return Camera;
  if (
    title.includes("Meal") ||
    title.includes("Culinary") ||
    title.includes("Snack")
  )
    return Utensils;
  if (title.includes("Sleep")) return Moon;
  if (title.includes("Language")) return Languages;
  if (title.includes("Wi-Fi") || title.includes("Wifi")) return Wifi;
  if (
    title.includes("Rating") ||
    title.includes("Feedback") ||
    title.includes("Survey")
  )
    return Star;
  if (title.includes("Hydration") || title.includes("Water")) return Droplet;
  if (title.includes("Business") || title.includes("Planner")) return Briefcase;
  if (title.includes("Shopping") || title.includes("Duty-Free"))
    return ShoppingBag;
  if (title.includes("Podcast")) return Headphones;
  if (title.includes("Destination") || title.includes("Explorer"))
    return MapPin;
  if (title.includes("Meditation")) return Activity;
  return Plane;
};

export const CompactQuestCard = ({
  quest,
  nextQuest,
  isInFlight,
  onSwipeLeft,
  swipesLeft,
  disableSwipe = false,
  onComplete,
  onNext,
  completed = false,
}: CompactQuestCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [showVerified, setShowVerified] = useState(false);
  
  // Photo capture state
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const [isVerifyingPhoto, setIsVerifyingPhoto] = useState(false);
  
  // Photo upload state
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [isVerifyingUpload, setIsVerifyingUpload] = useState(false);
  
  // GPS location state
  const [gpsTracking, setGpsTracking] = useState(false);
  const [trackingStartTime, setTrackingStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // NEW: controls the unblur/fade-in of the next card
  const [promoteNext, setPromoteNext] = useState(false);

  const SWIPE_THRESHOLD = 120;

  const QuestIcon = getQuestIcon(quest.title);
  const NextQuestIcon = nextQuest ? getQuestIcon(nextQuest.title) : null;

  // Reset transient state whenever the top card changes
  useEffect(() => {
    setDragX(0);
    setIsExpanded(false);
    setIsDragging(false);
    setIsRemoving(false);
    setPromoteNext(false);
    // Reset verification states when quest changes
    setCapturedPhoto(null);
    setIsPendingVerification(false);
    setUploadedPhoto(null);
    setIsVerifyingUpload(false);
    setIsVerifyingPhoto(false);
    setGpsTracking(false);
    setTrackingStartTime(null);
    setElapsedTime(0);
  }, [quest?.id]);

  // GPS tracking timer
  useEffect(() => {
    if (gpsTracking && trackingStartTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - trackingStartTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gpsTracking, trackingStartTime]);

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
              isInFlight
                ? "bg-white/10 border-white/30"
                : "bg-card border-border"
            } overflow-hidden`}
            style={{
              // Heavily blur until swipe is committed
              filter: `blur(${promoteNext ? 0 : 5}px) brightness(0.9)`,
              opacity: promoteNext ? 1 : 1,
              transform: "scale(0.98)",
              transition:
                "filter 250ms ease, opacity 250ms ease, transform 200ms ease",
            }}
          >
            {/* duplicated next card content (simplified) */}
            <div className="flex gap-4 p-4">
              <div
                className={`${
                  isInFlight ? "bg-white/20 border border-white/30" : "bg-muted"
                } w-16 h-16 flex-shrink-0 rounded-lg flex items-center justify-center`}
              >
                {NextQuestIcon && (
                  <NextQuestIcon
                    className={`w-8 h-8 ${
                      isInFlight ? "text-white/80" : "text-muted-foreground"
                    }`}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3
                    className={`font-bold text-base ${
                      isInFlight ? "text-white/80" : "text-foreground"
                    }`}
                  >
                    {nextQuest?.title}
                  </h3>
                  <Badge
                    className={`${
                      isInFlight
                        ? "bg-secondary/80 text-white border-secondary/20"
                        : "bg-accent text-accent-foreground"
                    } flex-shrink-0`}
                  >
                    +{nextQuest?.reward}
                  </Badge>
                </div>
                <p
                  className={`text-sm line-clamp-2 ${
                    isInFlight ? "text-white/70" : "text-muted-foreground"
                  }`}
                >
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
          // change appearance if quest is completed
          completed
            ? "bg-emerald-600/8 border-emerald-500/30"
            : isInFlight
            ? "bg-white/10 border-white/30 backdrop-blur-sm hover:bg-white/15"
            : "bg-card border-border hover:shadow-md"
        }`}
        style={{
          transform: `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`,
          opacity:
            dragX < -SWIPE_THRESHOLD && swipesLeft > 0 && !disableSwipe
              ? 0.7
              : 1,
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
            <QuestIcon
              className={`w-8 h-8 ${
                isInFlight ? "text-white" : "text-muted-foreground"
              }`}
            />
          </div>

          {/* Quest Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3
                className={`font-bold text-base ${
                  isInFlight ? "text-white" : "text-foreground"
                }`}
              >
                {quest.title}
              </h3>
              <Badge
                className={`${
                  isInFlight
                    ? "bg-secondary text-white border-secondary/20"
                    : "bg-accent text-accent-foreground"
                } flex-shrink-0`}
              >
                +{quest.reward}
              </Badge>
            </div>

            <p
              className={`text-sm ${
                isExpanded ? "" : "line-clamp-2"
              } mb-3 min-h-[2.5rem] ${
                isInFlight ? "text-white/80" : "text-muted-foreground"
              }`}
            >
              {quest.description}
            </p>
            {!isExpanded &&
              (() => {
                const hasProgress = typeof quest.progress === "number";

                if (hasProgress) {
                  return (
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex-1">
                        <div
                          className={`text-xs mb-1 ${
                            isInFlight
                              ? "text-white/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          Progress
                        </div>
                        <div
                          className={`w-full h-2 rounded-full ${
                            isInFlight ? "bg-white/10" : "bg-muted"
                          }`}
                        >
                          <div
                            className={`${
                              isInFlight ? "bg-secondary" : "bg-emerald-700"
                            } h-2 rounded-full`}
                            style={{ width: `${quest.progress}%` }}
                          />
                        </div>
                      </div>
                      <div
                        className={`w-12 text-right ${
                          isInFlight
                            ? "text-white/80 font-medium"
                            : "text-foreground font-medium"
                        }`}
                      >
                        {quest.progress}%
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock
                        className={`w-3 h-3 ${
                          isInFlight ? "text-white/70" : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={
                          isInFlight ? "text-white/70" : "text-muted-foreground"
                        }
                      >
                        {quest.timeLeft}
                      </span>
                    </div>
                    {quest.location && (
                      <div className="flex items-center gap-1">
                        <MapPin
                          className={`w-3 h-3 ${
                            isInFlight
                              ? "text-white/70"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span
                          className={`line-clamp-1 ${
                            isInFlight
                              ? "text-white/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {quest.location}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}
          </div>

          {/* Expand Icon */}
          <div className="flex items-center">
            {isExpanded ? (
              <ChevronUp
                className={`w-5 h-5 ${
                  isInFlight ? "text-white/70" : "text-muted-foreground"
                }`}
              />
            ) : (
              <ChevronDown
                className={`w-5 h-5 ${
                  isInFlight ? "text-white/70" : "text-muted-foreground"
                }`}
              />
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div
            className={`px-4 pb-4 space-y-4 border-t ${
              isInFlight ? "border-white/20" : "border-border"
            }`}
          >
            {/* Progress bar (only for milestone quests) or Time & Location */}
            {(() => {
              const isMilestone =
                quest.type === "Milestone" ||
                (quest.title.includes("Complete") &&
                  quest.title.includes("Quests"));

              if (typeof quest.progress === "number") {
                return (
                  <div className="pt-4">
                    <div
                      className={`text-sm mb-2 ${
                        isInFlight ? "text-white/70" : "text-muted-foreground"
                      }`}
                    >
                      Progress
                    </div>
                    <div
                      className={`w-full h-3 rounded-full ${
                        isInFlight ? "bg-white/10" : "bg-muted"
                      }`}
                    >
                      <div
                        className={`h-3 rounded-full`}
                        style={{
                          width: `${quest.progress}%`,
                          backgroundColor: "hsl(var(--foreground))",
                        }}
                      />
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        isInFlight ? "text-white/80" : "text-muted-foreground"
                      }`}
                    >
                      {quest.progress}% complete
                    </div>
                  </div>
                );
              }

              return (
                <div className="flex items-center gap-4 text-sm pt-4">
                  <div className="flex items-center gap-1">
                    <Clock
                      className={`w-4 h-4 ${
                        isInFlight ? "text-white/70" : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={
                        isInFlight ? "text-white/80" : "text-muted-foreground"
                      }
                    >
                      {quest.timeLeft}
                    </span>
                  </div>
                  {quest.location && (
                    <div className="flex items-center gap-1">
                      <MapPin
                        className={`w-4 h-4 ${
                          isInFlight ? "text-white/70" : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={
                          isInFlight ? "text-white/80" : "text-muted-foreground"
                        }
                      >
                        {quest.location}
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Requirements */}
            <div>
              <h4
                className={`font-semibold text-sm mb-2 ${
                  isInFlight ? "text-white" : "text-foreground"
                }`}
              >
                Requirements
              </h4>
              <ul
                className={`text-sm space-y-1 ${
                  isInFlight ? "text-white/80" : "text-muted-foreground"
                }`}
              >
                {quest.requirements.map((req, idx) => (
                  <li key={idx}>• {req}</li>
                ))}
              </ul>
            </div>

            {/* Verification */}
            <div>
              <h4
                className={`font-semibold text-sm mb-2 ${
                  isInFlight ? "text-white" : "text-foreground"
                }`}
              >
                Verification Method
              </h4>
              <p
                className={`text-sm ${
                  isInFlight ? "text-white/80" : "text-muted-foreground"
                }`}
              >
                {quest.verification}
              </p>
            </div>

            {/* Verification Buttons */}
            {!completed && (
              <div className={`pt-4 border-t space-y-2 ${
                isInFlight ? "border-white/20" : "border-border"
              }`}>
                {/* QR Code Scanner */}
                {quest.qrEnabled && (
                  <button
                    onClick={() => setShowQRScanner(true)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      isInFlight
                        ? "bg-secondary/80 text-white hover:bg-secondary border border-secondary/20"
                        : "bg-accent text-accent-foreground hover:bg-accent/90"
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    Scan QR Code to Complete
                  </button>
                )}

                {/* Snap Photo */}
                {quest.snapPhoto && !isPendingVerification && (
                  <button
                    onClick={() => setShowPhotoCapture(true)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      isInFlight
                        ? "bg-secondary/80 text-white hover:bg-secondary"
                        : "bg-accent text-accent-foreground hover:bg-accent/90"
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    Snap Photo to Verify
                  </button>
                )}

                {/* Pending Verification Status */}
                {quest.snapPhoto && isPendingVerification && (
                  <div className={`w-full p-4 rounded-lg border ${
                    isInFlight
                      ? "bg-yellow-500/20 border-yellow-500/40"
                      : "bg-yellow-50 border-yellow-200"
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Hourglass className={`w-4 h-4 ${
                        isInFlight ? "text-yellow-300" : "text-yellow-600"
                      }`} />
                      <span className={`font-semibold text-sm ${
                        isInFlight ? "text-yellow-200" : "text-yellow-800"
                      }`}>
                        Pending Verification
                      </span>
                    </div>
                    <p className={`text-xs mb-3 ${
                      isInFlight ? "text-yellow-200/80" : "text-yellow-700"
                    }`}>
                      Your photo is being reviewed. You can retake the photo if needed.
                    </p>
                    {capturedPhoto && (
                      <div className="mb-3">
                        <img 
                          src={capturedPhoto} 
                          alt="Captured photo" 
                          className="w-full rounded-lg border border-border"
                        />
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setIsPendingVerification(false);
                        setCapturedPhoto(null);
                        setShowPhotoCapture(true);
                      }}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        isInFlight
                          ? "bg-yellow-500/30 text-yellow-200 hover:bg-yellow-500/40 border border-yellow-500/40"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300"
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" />
                      Retake Photo
                    </button>
                  </div>
                )}

                {/* Upload Photo */}
                {quest.uploadPhoto && (
                  <button
                    onClick={() => setShowPhotoUpload(true)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      isInFlight
                        ? "bg-secondary/80 text-white hover:bg-secondary border border-secondary/20"
                        : "bg-accent text-accent-foreground hover:bg-accent/90"
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    Upload Photo to Verify
                  </button>
                )}

                {/* Free Quest - Self Verify */}
                {quest.freeQuest && !completed && (
                  <button
                    onClick={() => {
                      onComplete?.();
                    }}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      isInFlight
                        ? "bg-secondary/80 text-white hover:bg-secondary border border-secondary/20"
                        : "bg-accent text-accent-foreground hover:bg-accent/90"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    Self-Verify
                  </button>
                )}

                {/* Self-Reported Completion */}
                {quest.verification === "Self-reported completion" && !quest.freeQuest && (
                  <button
                    onClick={() => {
                      onComplete?.();
                    }}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      isInFlight
                        ? "bg-secondary/80 text-white hover:bg-secondary border border-secondary/20"
                        : "bg-accent text-accent-foreground hover:bg-accent/90"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    Mark as Completed
                  </button>
                )}

                {/* Automatically Tracked - Open Quiz */}
                {(quest.verification.toLowerCase().includes("automatic") || quest.verification.toLowerCase().includes("tracked")) 
                && quest.verification.toLowerCase().includes("quiz") && (
                  <button
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                      isInFlight
                        ? "bg-secondary/80 text-white hover:bg-secondary border border-secondary/20"
                        : "bg-accent text-accent-foreground hover:bg-accent/90"
                    }`}
                  >
                    <Brain className="w-4 h-4" />
                    Open Quiz
                  </button>
                )}

                {/* GPS Location Tracking */}
                {quest.gpsLocation && (
                  <div className="space-y-2">
                    {!gpsTracking ? (
                      <button
                        onClick={() => {
                          setGpsTracking(true);
                          setTrackingStartTime(Date.now());
                        }}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                          isInFlight
                            ? "bg-secondary/80 text-white hover:bg-secondary border border-secondary/20"
                            : "bg-accent text-accent-foreground hover:bg-accent/90"
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                        Start Location Tracking
                      </button>
                    ) : (
                      <div className={`p-4 rounded-lg border ${
                        isInFlight
                          ? "bg-emerald-500/20 border-emerald-500/40"
                          : "bg-emerald-50 border-emerald-200"
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className={`w-4 h-4 ${
                              isInFlight ? "text-emerald-300" : "text-emerald-600"
                            }`} />
                            <span className={`font-semibold text-sm ${
                              isInFlight ? "text-emerald-200" : "text-emerald-800"
                            }`}>
                              Tracking Active
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setGpsTracking(false);
                              setTrackingStartTime(null);
                              setElapsedTime(0);
                            }}
                            className={`text-xs px-2 py-1 rounded ${
                              isInFlight
                                ? "bg-emerald-500/30 text-emerald-200 hover:bg-emerald-500/40"
                                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            }`}
                          >
                            Stop
                          </button>
                        </div>
                        <div className={`text-xs ${
                          isInFlight ? "text-emerald-200/80" : "text-emerald-700"
                        }`}>
                          Time elapsed: {Math.floor(elapsedTime / 60)}:{String(Math.floor(elapsedTime % 60)).padStart(2, '0')}
                        </div>
                        {elapsedTime >= 3600 && (
                          <button
                            onClick={() => {
                              onComplete?.();
                              setGpsTracking(false);
                              setTrackingStartTime(null);
                              setElapsedTime(0);
                            }}
                            className={`w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                              isInFlight
                                ? "bg-emerald-600/80 text-white hover:bg-emerald-600 border border-emerald-500/20"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                            }`}
                          >
                            <Check className="w-4 h-4" />
                            Complete Quest
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {completed && (
              <div className={`pt-4 border-t flex flex-col gap-2 ${
                isInFlight ? "border-white/20" : "border-border"
              }`}>
                <div className={`text-sm font-medium ${
                  isInFlight ? "text-emerald-300" : "text-emerald-600"
                }`}>
                  Quest completed
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNext?.();
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all z-10 relative ${
                      isInFlight
                        ? "bg-emerald-600/80 text-white hover:bg-emerald-600 border border-emerald-500/20"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    Next Quest
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* QR Code Scanner Dialog */}
      <Dialog open={showQRScanner} onOpenChange={setShowQRScanner}>
        <DialogContent
          className={`${
            isInFlight ? "bg-primary border-white/30" : "bg-background"
          }`}
        >
          <DialogHeader>
            <DialogTitle
              className={isInFlight ? "text-white" : "text-foreground"}
            >
              Scan QR Code
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!qrResult && !showVerified ? (
              <div className="w-full rounded-lg overflow-hidden relative qr-scanner-container">
                {/* hide possible SVG/canvas/viewfinder from the scanner lib and provide our own thin green viewfinder */}
                <style>{`
                  /* remove typical overlay elements the scanner may inject */
                  .qr-scanner-container svg,
                  .qr-scanner-container canvas,
                  .qr-scanner-container [role="presentation"],
                  .qr-scanner-container::before,
                  .qr-scanner-container::after,
                  .qr-scanner-container *::before,
                  .qr-scanner-container *::after {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                  }

                  /* Force any borders/lines to be transparent */
                  .qr-scanner-container *,
                  .qr-scanner-container svg path,
                  .qr-scanner-container svg rect,
                  .qr-scanner-container svg line,
                  .qr-scanner-container svg circle {
                    stroke: transparent !important;
                    fill: transparent !important;
                    border-color: transparent !important;
                    box-shadow: none !important;
                    outline: none !important;
                    background: transparent !important;
                  }

                  /* Make the camera video fill the square container */
                  .qr-scanner-container video {
                    object-fit: cover !important;
                    width: 100% !important;
                    height: 100% !important;
                    display: block !important;
                  }

                  /* Ensure our custom viewfinder remains visible */
                  .qr-scanner-container .qr-viewfinder {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    pointer-events: none !important;
                    border-color: rgba(16,185,129,0.95) !important;
                    box-shadow: 0 0 0 2px rgba(16,185,129,0.06) inset, 0 0 0 1px rgba(16,185,129,0.22) !important;
                    background: transparent !important;
                  }
                `}</style>
                <div className="w-full aspect-square bg-black rounded-lg overflow-hidden">
                  <Scanner
                    onScan={(detectedCodes) => {
                      if (detectedCodes && detectedCodes.length > 0) {
                        const value = detectedCodes[0].rawValue;
                        setQrResult(value);
                        // immediately show verified feedback
                        setShowVerified(true);
                        // call parent to mark complete
                        onComplete?.();
                        console.log("QR detected:", value);
                        // auto-close and reset shortly after showing success
                        setTimeout(() => {
                          setShowVerified(false);
                          setShowQRScanner(false);
                          setQrResult(null);
                        }, 2500);
                      }
                    }}
                    onError={(error) => {
                      console.error("QR Scanner Error:", error);
                    }}
                  />
                </div>

                {/* green centered square viewfinder */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div
                    className="qr-viewfinder w-48 h-48 border-2"
                    style={{ borderColor: "hsl(var(--foreground) / 0.9)" }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg ${
                    isInFlight
                      ? "bg-white/10 border border-white/20"
                      : "bg-muted border border-border"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold mb-2 ${
                      isInFlight ? "text-white/70" : "text-muted-foreground"
                    }`}
                  >
                    Scanned Code:
                  </p>
                  <p
                    className={`break-all text-sm ${
                      isInFlight ? "text-white" : "text-foreground"
                    }`}
                  >
                    {qrResult}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setQrResult(null);
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                      isInFlight
                        ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                        : "bg-muted text-foreground hover:bg-muted/80 border border-border"
                    }`}
                  >
                    Scan Again
                  </button>
                  <button
                    onClick={() => {
                      setShowQRScanner(false);
                      setQrResult(null);
                      // Here you can add logic to complete the quest
                      console.log("Quest completed with QR:", qrResult);
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                      isInFlight
                        ? "bg-secondary/80 text-white hover:bg-secondary border border-secondary/20"
                        : "bg-accent text-accent-foreground hover:bg-accent/90"
                    }`}
                  >
                    Confirm & Complete
                  </button>
                </div>
              </div>
            )}
            {/* Verified overlay shown briefly when a QR is detected */}
            {showVerified && (
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="flex items-center gap-3 p-4 rounded-md bg-emerald-600/95 text-white shadow-lg">
                  <Check className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">Verified successfully</div>
                    <div className="text-xs opacity-90">
                      Preparing confirmation…
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Capture Dialog */}
      <Dialog open={showPhotoCapture} onOpenChange={(open) => {
        setShowPhotoCapture(open);
        if (!open) {
          setCapturedPhoto(null);
          setIsVerifyingPhoto(false);
        }
      }}>
        <DialogContent
          className={`${
            isInFlight ? "bg-primary border-white/30" : "bg-background"
          }`}
        >
          <DialogHeader>
            <DialogTitle
              className={isInFlight ? "text-white" : "text-foreground"}
            >
              Snap Photo
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 relative">
            {!capturedPhoto && !isVerifyingPhoto ? (
              <div className="space-y-4">
                <div className="w-full rounded-lg overflow-hidden relative qr-scanner-container">
                  <style>{`
                    /* remove typical overlay elements the scanner may inject */
                    .qr-scanner-container svg,
                    .qr-scanner-container canvas,
                    .qr-scanner-container [role="presentation"],
                    .qr-scanner-container::before,
                    .qr-scanner-container::after,
                    .qr-scanner-container *::before,
                    .qr-scanner-container *::after {
                      display: none !important;
                      visibility: hidden !important;
                      opacity: 0 !important;
                      pointer-events: none !important;
                    }

                    /* Force any borders/lines to be transparent */
                    .qr-scanner-container *,
                    .qr-scanner-container svg path,
                    .qr-scanner-container svg rect,
                    .qr-scanner-container svg line,
                    .qr-scanner-container svg circle {
                      stroke: transparent !important;
                      fill: transparent !important;
                      border-color: transparent !important;
                      box-shadow: none !important;
                      outline: none !important;
                      background: transparent !important;
                    }

                    /* Make the camera video fill the square container */
                    .qr-scanner-container video {
                      object-fit: cover !important;
                      width: 100% !important;
                      height: 100% !important;
                      display: block !important;
                    }
                  `}</style>
                  <div className="w-full aspect-square bg-black rounded-lg overflow-hidden">
                    <Scanner
                      onScan={(detectedCodes) => {
                        // Disable QR code detection - do nothing
                        // We only want to use the camera view
                      }}
                      onError={(error) => {
                        console.error("Camera Error:", error);
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    // Access the video element from the scanner - wait a bit for it to be ready
                    setTimeout(() => {
                      const videoElement = document.querySelector('[data-qr-scanner] video') as HTMLVideoElement || 
                                         document.querySelector('.w-full.aspect-square video') as HTMLVideoElement;
                      if (videoElement && videoElement.readyState >= 2) {
                        const canvas = document.createElement('canvas');
                        canvas.width = videoElement.videoWidth;
                        canvas.height = videoElement.videoHeight;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          ctx.drawImage(videoElement, 0, 0);
                          const dataUrl = canvas.toDataURL('image/jpeg');
                          setCapturedPhoto(dataUrl);
                          // Start verification
                          setIsVerifyingPhoto(true);
                          setTimeout(() => {
                            setIsVerifyingPhoto(false);
                            setIsPendingVerification(true);
                            setShowPhotoCapture(false);
                            onComplete?.();
                          }, 3000);
                        }
                      }
                    }, 100);
                  }}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    isInFlight
                      ? "bg-secondary/80 text-white hover:bg-secondary border border-secondary/20"
                      : "bg-accent text-accent-foreground hover:bg-accent/90"
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  Snap Photo
                </button>
              </div>
            ) : isVerifyingPhoto ? (
              <div className="w-full aspect-square bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/50 rounded-lg">
                  <div className="flex items-center gap-3 p-4 rounded-md bg-emerald-600/95 text-white shadow-lg">
                    <Hourglass className="w-6 h-6 animate-spin" />
                    <div>
                      <div className="font-semibold">Verifying photo...</div>
                      <div className="text-xs opacity-90">
                        Please wait while we verify your submission
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-full rounded-lg overflow-hidden">
                  <img
                    src={capturedPhoto}
                    alt="Captured photo"
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCapturedPhoto(null);
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                      isInFlight
                        ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                        : "bg-muted text-foreground hover:bg-muted/80 border border-border"
                    }`}
                  >
                    Retake
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Upload Dialog */}
      <Dialog open={showPhotoUpload} onOpenChange={(open) => {
        setShowPhotoUpload(open);
        if (!open) {
          setIsVerifyingUpload(false);
          setUploadedPhoto(null);
        }
      }}>
        <DialogContent
          className={`${
            isInFlight ? "bg-primary border-white/30" : "bg-background"
          }`}
        >
          <DialogHeader>
            <DialogTitle
              className={isInFlight ? "text-white" : "text-foreground"}
            >
              Upload Photo
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 relative">
            {!uploadedPhoto ? (
              <div className="space-y-4">
                <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center border-2 border-dashed border-border">
                  <div className="text-center space-y-2">
                    <Upload className={`w-12 h-12 mx-auto ${isInFlight ? "text-white/50" : "text-muted-foreground"}`} />
                    <p className={`text-sm ${isInFlight ? "text-white/70" : "text-muted-foreground"}`}>
                      Upload a screenshot or photo
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  id="photo-upload-input"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setUploadedPhoto(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    document.getElementById('photo-upload-input')?.click();
                  }}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    isInFlight
                      ? "bg-secondary/80 text-white hover:bg-secondary border border-secondary/20"
                      : "bg-accent text-accent-foreground hover:bg-accent/90"
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  Choose Photo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-full rounded-lg overflow-hidden">
                  <img
                    src={uploadedPhoto}
                    alt="Uploaded photo"
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setUploadedPhoto(null);
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                      isInFlight
                        ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                        : "bg-muted text-foreground hover:bg-muted/80 border border-border"
                    }`}
                  >
                    Change Photo
                  </button>
                  <button
                    onClick={() => {
                      setIsVerifyingUpload(true);
                      // 3 second verification delay
                      setTimeout(() => {
                        setIsVerifyingUpload(false);
                        onComplete?.();
                        setShowPhotoUpload(false);
                        setUploadedPhoto(null);
                      }, 3000);
                    }}
                    disabled={isVerifyingUpload}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                      isVerifyingUpload
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    } ${
                      isInFlight
                        ? "bg-secondary/80 text-white hover:bg-secondary border border-secondary/20"
                        : "bg-accent text-accent-foreground hover:bg-accent/90"
                    }`}
                  >
                    {isVerifyingUpload ? "Verifying..." : "Submit"}
                  </button>
                </div>
              </div>
            )}
            {/* Verification overlay for photo upload */}
            {isVerifyingUpload && (
              <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/50 rounded-lg">
                <div className="flex items-center gap-3 p-4 rounded-md bg-emerald-600/95 text-white shadow-lg">
                  <Hourglass className="w-6 h-6 animate-spin" />
                  <div>
                    <div className="font-semibold">Verifying photo...</div>
                    <div className="text-xs opacity-90">
                      Please wait while we verify your submission
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

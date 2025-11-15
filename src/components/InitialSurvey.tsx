import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Plane,
  Utensils,
  Camera,
  Leaf,
  Dumbbell,
  Music,
  BookOpen,
  MapPin,
  Heart,
  Calendar,
  Clock,
  AlertCircle,
  Sun,
  Moon,
  Compass,
  Accessibility,
  TrendingUp,
  Shield,
  Trophy,
  Globe,
  Wifi,
  Users as UsersIcon,
  Palette,
  Eye,
  Briefcase,
} from "lucide-react";
import { saveSurveyToDynamoDB } from "@/utils/dynamoDBService";

interface SurveyOption {
  id: string;
  label: string;
  icon: any;
  description: string;
}

const surveyQuestions = [
  {
    id: "travel",
    question: "What aspects of travel excite you most?",
    multiSelect: true,
    maxSelections: 3,
    minSelections: 1,
    options: [
      {
        id: "adventure",
        label: "Adventure & Exploration",
        icon: MapPin,
        description: "New experiences and off-the-beaten-path",
      },
      {
        id: "culture",
        label: "Culture & History",
        icon: BookOpen,
        description: "Learning about local traditions",
      },
      {
        id: "relaxation",
        label: "Relaxation & Wellness",
        icon: Dumbbell,
        description: "Rest and rejuvenation",
      },
      {
        id: "food",
        label: "Food & Cuisine",
        icon: Utensils,
        description: "Trying local dishes and restaurants",
      },
      {
        id: "nature",
        label: "Nature & Outdoors",
        icon: Compass,
        description: "Hiking, beaches, and natural landscapes",
      },
      {
        id: "nightlife",
        label: "Nightlife & Entertainment",
        icon: Moon,
        description: "Clubs, bars, and entertainment venues",
      },
      {
        id: "art",
        label: "Art & Design",
        icon: Palette,
        description: "Museums, galleries, and architecture",
      },
      {
        id: "social",
        label: "Social & People",
        icon: UsersIcon,
        description: "Meeting locals and making connections",
      },
    ],
  },
  {
    id: "sustainability",
    question: "How important is sustainability to you?",
    multiSelect: false,
    options: [
      {
        id: "very",
        label: "Very Important",
        icon: Leaf,
        description: "I actively seek eco-friendly options",
      },
      {
        id: "somewhat",
        label: "Somewhat Important",
        icon: Leaf,
        description: "I try to be mindful when possible",
      },
      {
        id: "neutral",
        label: "Neutral",
        icon: MapPin,
        description: "I don't prioritize it specifically",
      },
      {
        id: "not",
        label: "Not Important",
        icon: Heart,
        description: "Convenience comes first",
      },
    ],
  },
  {
    id: "activities",
    question: "Which activities interest you most?",
    multiSelect: true,
    maxSelections: 3,
    minSelections: 1,
    options: [
      {
        id: "photography",
        label: "Photography",
        icon: Camera,
        description: "Capturing moments and scenery",
      },
      {
        id: "fitness",
        label: "Fitness & Sports",
        icon: Dumbbell,
        description: "Staying active while traveling",
      },
      {
        id: "entertainment",
        label: "Entertainment & Media",
        icon: Music,
        description: "Movies, music, and shows",
      },
      {
        id: "shopping",
        label: "Shopping & Markets",
        icon: Utensils,
        description: "Local goods and souvenirs",
      },
      {
        id: "water",
        label: "Water Sports",
        icon: Wifi,
        description: "Swimming, diving, surfing",
      },
      {
        id: "reading",
        label: "Reading & Learning",
        icon: BookOpen,
        description: "Books, podcasts, educational content",
      },
      {
        id: "business",
        label: "Business & Networking",
        icon: Briefcase,
        description: "Conferences and professional meetings",
      },
      {
        id: "gaming",
        label: "Gaming & Tech",
        icon: Shield,
        description: "Video games and tech experiences",
      },
      {
        id: "wellness",
        label: "Wellness & Spa",
        icon: Sun,
        description: "Spa, meditation, yoga",
      },
      {
        id: "adventureSports",
        label: "Adventure Sports",
        icon: Compass,
        description: "Climbing, paragliding, etc.",
      },
    ],
  },
  {
    id: "frequency",
    question: "How often do you typically fly?",
    multiSelect: false,
    options: [
      {
        id: "frequent",
        label: "Monthly or More",
        icon: Plane,
        description: "Frequent traveler",
      },
      {
        id: "regular",
        label: "Several Times a Year",
        icon: Calendar,
        description: "Regular traveler",
      },
      {
        id: "occasional",
        label: "A Few Times a Year",
        icon: Clock,
        description: "Occasional traveler",
      },
      {
        id: "rare",
        label: "Once a Year or Less",
        icon: AlertCircle,
        description: "Rare traveler",
      },
    ],
  },
  {
    id: "tripDuration",
    question: "What is your typical trip duration?",
    multiSelect: false,
    options: [
      {
        id: "weekend",
        label: "Weekend Getaway",
        icon: Sun,
        description: "2-3 days",
      },
      {
        id: "shortWeek",
        label: "Short Week",
        icon: Calendar,
        description: "4-7 days",
      },
      {
        id: "longWeek",
        label: "Long Duration",
        icon: Clock,
        description: "1-3 weeks",
      },
      {
        id: "extended",
        label: "Extended Travel",
        icon: Compass,
        description: "More than a month",
      },
    ],
  },
  {
    id: "accessibility",
    question: "What accessibility features are important to you?",
    multiSelect: true,
    maxSelections: 3,
    minSelections: 1,
    options: [
      {
        id: "mobility",
        label: "Mobility Access",
        icon: Accessibility,
        description: "Wheelchair & accessibility features",
      },
      {
        id: "dietary",
        label: "Dietary Requirements",
        icon: Utensils,
        description: "Special meal options available",
      },
      {
        id: "quiet",
        label: "Quiet Spaces",
        icon: Moon,
        description: "Peaceful areas to relax",
      },
      {
        id: "family",
        label: "Family-Friendly",
        icon: UsersIcon,
        description: "Activities for families with children",
      },
      {
        id: "petFriendly",
        label: "Pet-Friendly",
        icon: Heart,
        description: "Pet accommodations",
      },
      {
        id: "language",
        label: "Language Support",
        icon: BookOpen,
        description: "Multiple language assistance",
      },
      {
        id: "visual",
        label: "Visual Assistance",
        icon: Eye,
        description: "Support for visually impaired",
      },
      {
        id: "elderly",
        label: "Elderly Support",
        icon: Heart,
        description: "Facilities for elderly travelers",
      },
      {
        id: "none",
        label: "None",
        icon: Shield,
        description: "No accessibility features needed",
      },
    ],
  },
  {
    id: "rewards",
    question: "What type of rewards motivate you most?",
    multiSelect: true,
    maxSelections: 3,
    minSelections: 1,
    options: [
      {
        id: "miles",
        label: "Frequent Flyer Miles",
        icon: Plane,
        description: "Asia Miles accumulation",
      },
      {
        id: "discounts",
        label: "Travel Discounts",
        icon: TrendingUp,
        description: "Reduced flight & hotel costs",
      },
      {
        id: "upgrades",
        label: "Flight Upgrades",
        icon: Shield,
        description: "Seat and cabin upgrades",
      },
      {
        id: "experiences",
        label: "Exclusive Experiences",
        icon: Trophy,
        description: "VIP events and lounges",
      },
      {
        id: "wifi",
        label: "Free Wi-Fi",
        icon: Wifi,
        description: "Complimentary internet access",
      },
      {
        id: "global",
        label: "Global Lounge Access",
        icon: Globe,
        description: "Access to airport lounges worldwide",
      },
      {
        id: "cashback",
        label: "Cashback/Vouchers",
        icon: Heart,
        description: "Direct payment or gift cards",
      },
      {
        id: "status",
        label: "Elite Status",
        icon: Trophy,
        description: "Unlock elite status and perks",
      },
    ],
  },
  {
    id: "groupTravel",
    question: "Do you usually travel alone or with others?",
    multiSelect: false,
    options: [
      {
        id: "solo",
        label: "Solo",
        icon: UsersIcon,
        description: "I prefer traveling alone",
      },
      {
        id: "partner",
        label: "With a partner",
        icon: UsersIcon,
        description: "I travel with one other person",
      },
      {
        id: "family",
        label: "With family",
        icon: UsersIcon,
        description: "I travel with family",
      },
      {
        id: "friends",
        label: "With friends",
        icon: UsersIcon,
        description: "I travel with a group of friends",
      },
      {
        id: "colleagues",
        label: "With colleagues",
        icon: Briefcase,
        description: "I travel for work with colleagues",
      },
    ],
  },
];

interface InitialSurveyProps {
  onComplete: (responses: Record<string, string | string[]>) => void;
}

export const InitialSurvey = ({ onComplete }: InitialSurveyProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string | string[]>>(
    {}
  );
  const [selectedAnswers, setSelectedAnswers] = useState<Set<string>>(
    new Set()
  );

  const currentQuestion = surveyQuestions[currentStep];
  const progress = ((currentStep + 1) / surveyQuestions.length) * 100;

  const handleSelectOption = (optionId: string) => {
    if (currentQuestion.multiSelect) {
      const currentSelections = Array.isArray(responses[currentQuestion.id])
        ? responses[currentQuestion.id]
        : [];
      let newSelections: string[];

      if (currentSelections.includes(optionId)) {
        newSelections = currentSelections.filter((id) => id !== optionId);
      } else {
        if (currentSelections.length < (currentQuestion.maxSelections || 3)) {
          newSelections = [...currentSelections, optionId];
        } else {
          return;
        }
      }

      setResponses({
        ...responses,
        [currentQuestion.id]: newSelections,
      });
      setSelectedAnswers(new Set(newSelections));
    } else {
      setResponses({
        ...responses,
        [currentQuestion.id]: optionId,
      });
      setSelectedAnswers(new Set([optionId]));
    }
  };

  const handleNext = () => {
    if (currentStep < surveyQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      const nextResp = responses[surveyQuestions[currentStep + 1].id];
      if (Array.isArray(nextResp)) {
        setSelectedAnswers(new Set(nextResp));
      } else if (nextResp) {
        setSelectedAnswers(new Set([nextResp]));
      } else {
        setSelectedAnswers(new Set());
      }
    } else {
      // Store survey results
      const surveyResult = {
        userId: `USER_${Date.now()}`,
        userName: "Guest User",
        email: "user@example.com",
        timestamp: new Date().toISOString(),
        responses: responses,
        completedAt: new Date().toLocaleString(),
      };

      // Save to localStorage as fallback (always do this first for offline support)
      const existingResults = JSON.parse(
        localStorage.getItem("surveyResults") || "[]"
      );
      existingResults.push(surveyResult);
      localStorage.setItem("surveyResults", JSON.stringify(existingResults));

      // Save directly to DynamoDB via API (real-time sync)
      saveSurveyToDynamoDB(surveyResult)
        .then((result) => {
          if (result.success) {
            console.log("Survey saved to DynamoDB:", result.message);
          } else {
            console.warn(
              "Failed to save to DynamoDB (saved to localStorage):",
              result.message
            );
            // Data is still in localStorage, can be synced later
          }
        })
        .catch((error) => {
          console.error("Error saving to DynamoDB:", error);
          // Data is still in localStorage, can be synced later
        });

      onComplete(responses);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      const prevResp = responses[surveyQuestions[currentStep - 1].id];
      if (Array.isArray(prevResp)) {
        setSelectedAnswers(new Set(prevResp));
      } else if (prevResp) {
        setSelectedAnswers(new Set([prevResp]));
      } else {
        setSelectedAnswers(new Set());
      }
    }
  };

  const isAnswered = currentQuestion.multiSelect
    ? Array.isArray(responses[currentQuestion.id]) &&
      responses[currentQuestion.id].length >=
        (currentQuestion.minSelections ?? 1)
    : responses[currentQuestion.id] !== undefined;

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-elevated max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-4">
            {" "}
            {/* Increased space-y from 2 to 4 for better visual separation */}
            <div className="flex items-center gap-4">
              {" "}
              {/* Use gap-4 for explicit spacing */}
              <h1 className="text-3xl font-bold text-foreground">
                Welcome to Cathay Quest!
              </h1>
              {/* Added 'px-4 py-1' for slightly more padding inside the badge for better presentation */}
              <Badge
                variant="outline"
                className="text-sm px-4 py-1 whitespace-nowrap"
              >
                Step {currentStep + 1} of {surveyQuestions.length}
              </Badge>
            </div>
            {/* Progress bar below the header section */}
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              {currentQuestion.question}
            </h2>
            <p className="text-muted-foreground">
              Help us personalize your quest experience
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
            {currentQuestion.options.map((option) => {
              const Icon = option.icon;
              const isSelected = currentQuestion.multiSelect
                ? Array.isArray(responses[currentQuestion.id]) &&
                  responses[currentQuestion.id].includes(option.id)
                : responses[currentQuestion.id] === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${
                        isSelected ? "bg-primary/20" : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isSelected ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`font-semibold ${
                          isSelected ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {option.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {/* Selection count for multi-select */}
          {currentQuestion.multiSelect && (
            <div className="text-sm text-muted-foreground text-center">
              {Array.isArray(responses[currentQuestion.id])
                ? responses[currentQuestion.id].length
                : 0}{" "}
              of {currentQuestion.maxSelections} selected
              {currentQuestion.minSelections === 0 && " (0 allowed)"}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {currentStep === surveyQuestions.length - 1 ? "Complete" : "Next"}
            </Button>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center gap-1">
            {surveyQuestions.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

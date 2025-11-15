import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plane, Utensils, Camera, Leaf, Dumbbell, Music, BookOpen, MapPin, Heart, Calendar, Clock, AlertCircle } from "lucide-react";

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
    options: [
      { id: "adventure", label: "Adventure & Exploration", icon: MapPin, description: "New experiences and off-the-beaten-path" },
      { id: "culture", label: "Culture & History", icon: BookOpen, description: "Learning about local traditions" },
      { id: "relaxation", label: "Relaxation & Wellness", icon: Dumbbell, description: "Rest and rejuvenation" },
      { id: "food", label: "Food & Cuisine", icon: Utensils, description: "Trying local dishes and restaurants" },
    ]
  },
  {
    id: "sustainability",
    question: "How important is sustainability to you?",
    options: [
      { id: "very", label: "Very Important", icon: Leaf, description: "I actively seek eco-friendly options" },
      { id: "somewhat", label: "Somewhat Important", icon: Leaf, description: "I try to be mindful when possible" },
      { id: "neutral", label: "Neutral", icon: MapPin, description: "I don't prioritize it specifically" },
      { id: "not", label: "Not Important", icon: Heart, description: "Convenience comes first" },
    ]
  },
  {
    id: "activities",
    question: "Which activities interest you most?",
    options: [
      { id: "photography", label: "Photography", icon: Camera, description: "Capturing moments and scenery" },
      { id: "fitness", label: "Fitness & Sports", icon: Dumbbell, description: "Staying active while traveling" },
      { id: "entertainment", label: "Entertainment & Media", icon: Music, description: "Movies, music, and shows" },
      { id: "shopping", label: "Shopping & Markets", icon: Utensils, description: "Local goods and souvenirs" },
    ]
  },
  {
    id: "frequency",
    question: "How often do you typically fly?",
    options: [
      { id: "frequent", label: "Monthly or More", icon: Plane, description: "Frequent traveler" },
      { id: "regular", label: "Several Times a Year", icon: Calendar, description: "Regular traveler" },
      { id: "occasional", label: "A Few Times a Year", icon: Clock, description: "Occasional traveler" },
      { id: "rare", label: "Once a Year or Less", icon: AlertCircle, description: "Rare traveler" },
    ]
  }
];

interface InitialSurveyProps {
  onComplete: (responses: Record<string, string>) => void;
}

export const InitialSurvey = ({ onComplete }: InitialSurveyProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Set<string>>(new Set());

  const currentQuestion = surveyQuestions[currentStep];
  const progress = ((currentStep + 1) / surveyQuestions.length) * 100;

  const handleSelectOption = (optionId: string) => {
    setResponses({
      ...responses,
      [currentQuestion.id]: optionId
    });
    setSelectedAnswers(new Set([optionId]));
  };

  const handleNext = () => {
    if (currentStep < surveyQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswers(new Set([responses[surveyQuestions[currentStep + 1].id] || ""]));
    } else {
      onComplete(responses);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedAnswers(new Set([responses[surveyQuestions[currentStep - 1].id] || ""]));
    }
  };

  const isAnswered = responses[currentQuestion.id] !== undefined;

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-elevated">
        <div className="p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-foreground">
                Welcome to Cathay Quest!
              </h1>
              <Badge variant="outline" className="text-sm">
                Step {currentStep + 1} of {surveyQuestions.length}
              </Badge>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuestion.options.map((option) => {
              const Icon = option.icon;
              const isSelected = responses[currentQuestion.id] === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      isSelected ? "bg-primary/20" : "bg-muted"
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        isSelected ? "text-primary" : "text-muted-foreground"
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
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
                  index <= currentStep
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

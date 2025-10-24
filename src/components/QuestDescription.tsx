import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Shield } from "lucide-react";

interface QuestDescriptionProps {
  questType: string;
}

export const QuestDescription = ({ questType }: QuestDescriptionProps) => {
  const getQuestDetails = () => {
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

  const details = getQuestDetails();

  return (
    <div className="px-4 pb-6 space-y-4">
      <Card className="p-4 bg-card shadow-card">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground mb-1">{details.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {details.description}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-accent" />
          <h4 className="font-semibold text-sm text-foreground">Requirements</h4>
        </div>
        <ul className="space-y-2">
          {details.requirements.map((req, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-accent mt-0.5">•</span>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-4 bg-card shadow-card">
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
      </Card>
    </div>
  );
};

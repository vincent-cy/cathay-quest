import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, CheckCircle2, Trophy } from "lucide-react";

interface QuestCardProps {
  title: string;
  description: string;
  reward: number;
  type: "daily" | "weekly" | "seasonal" | "one-time";
  timeLeft?: string;
  location?: string;
  completed?: boolean;
  featured?: boolean;
}

const typeColors = {
  daily: "bg-primary/10 text-primary border-primary/20",
  weekly: "bg-secondary/10 text-secondary border-secondary/20",
  seasonal: "bg-accent/10 text-accent-foreground border-accent/20",
  "one-time": "bg-muted text-muted-foreground border-border",
};

export const QuestCard = ({
  title,
  description,
  reward,
  type,
  timeLeft,
  location,
  completed = false,
  featured = false,
}: QuestCardProps) => {
  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-elevated group ${
        featured ? "shadow-glow animate-pulse-glow" : "shadow-card"
      } ${completed ? "opacity-75" : ""}`}
    >
      <div className="absolute inset-0 bg-gradient-card opacity-50" />
      <div className="relative p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={typeColors[type]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
              {completed && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
              {featured && (
                <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
                  <Trophy className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {timeLeft && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{timeLeft}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-accent">+{reward}</span>
            <span className="text-sm text-muted-foreground">Asia Miles</span>
          </div>
          <Button size="sm" variant={featured ? "hero" : "default"} disabled={completed}>
            {completed ? "Completed" : "Start Quest"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

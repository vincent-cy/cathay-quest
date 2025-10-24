import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar } from "lucide-react";

const events = [
  {
    title: "Earth Day Challenge",
    description: "Complete eco-friendly missions this month",
    reward: 500,
    participants: 12450,
    endsIn: "15 days",
  },
  {
    title: "Cathay Anniversary",
    description: "Celebrate with special bonus quests",
    reward: 1000,
    participants: 8920,
    endsIn: "7 days",
  },
];

const Events = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Seasonal Events</h1>
        <p className="text-sm text-muted-foreground">Limited-time challenges</p>
      </header>

      <div className="p-4 space-y-4">
        {events.map((event, index) => (
          <Card key={index} className="p-4 shadow-card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-1">{event.title}</h3>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
              <Badge className="bg-accent">
                <Trophy className="w-3 h-3 mr-1" />
                {event.reward}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {event.endsIn}
              </span>
              <span>{event.participants.toLocaleString()} joined</span>
            </div>
          </Card>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Events;

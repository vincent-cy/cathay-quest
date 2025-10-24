import { BottomNav } from "@/components/BottomNav";
import { QuestCard } from "@/components/QuestCard";

const myQuests = [
  {
    title: "Airport Check-in",
    description: "Complete paperless check-in",
    reward: 50,
    type: "weekly" as const,
    timeLeft: "2d left",
    location: "Hong Kong Airport",
    completed: false,
  },
  {
    title: "Daily Login Streak",
    description: "Keep your 15-day streak going",
    reward: 10,
    type: "daily" as const,
    timeLeft: "18h left",
    completed: false,
  },
];

const Quests = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">My Quests</h1>
        <p className="text-sm text-muted-foreground">Track your active missions</p>
      </header>

      <div className="p-4 space-y-4">
        {myQuests.map((quest, index) => (
          <QuestCard key={index} {...quest} />
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Quests;

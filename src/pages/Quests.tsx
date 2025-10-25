import { BottomNav } from "@/components/BottomNav";
import { QuestCard } from "@/components/QuestCard";
import { useQuests } from "@/contexts/QuestContext";

const Quests = () => {
  const { acceptedQuests } = useQuests();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">My Quests</h1>
        <p className="text-sm text-muted-foreground">
          {acceptedQuests.length === 0 
            ? "No active quests yet. Accept quests from home to get started!" 
            : `Track your ${acceptedQuests.length} active mission${acceptedQuests.length > 1 ? 's' : ''}`}
        </p>
      </header>

      <div className="p-4 space-y-4">
        {acceptedQuests.map((quest) => (
          <QuestCard 
            key={quest.id} 
            title={quest.title}
            description={quest.description}
            reward={quest.reward}
            type={quest.type.toLowerCase() as "daily" | "weekly" | "seasonal" | "one-time"}
            timeLeft={quest.timeLeft}
            location={quest.location}
            completed={false}
          />
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Quests;

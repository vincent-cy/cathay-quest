import { Hero } from "@/components/Hero";
import { QuestTypes } from "@/components/QuestTypes";
import { FeaturedQuests } from "@/components/FeaturedQuests";
import { Verification } from "@/components/Verification";
import { Leaderboard } from "@/components/Leaderboard";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <QuestTypes />
      <FeaturedQuests />
      <Verification />
      <Leaderboard />
    </div>
  );
};

export default Index;

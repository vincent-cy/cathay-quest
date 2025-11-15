import { Hero } from "@/components/Hero";
import { QuestTypes } from "@/components/QuestTypes";
import { FeaturedQuests } from "@/components/FeaturedQuests";
import { Verification } from "@/components/Verification";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <QuestTypes />
      <FeaturedQuests />
      <Verification />
    </div>
  );
};

export default Index;

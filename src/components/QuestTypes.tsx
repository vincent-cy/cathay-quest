import { Calendar, CheckSquare, Trophy, Users, Plane, MapPin } from "lucide-react";

const questTypes = [
  {
    icon: CheckSquare,
    title: "Daily Login",
    description: "Maintain your streak and earn small miles rewards just for showing up.",
    color: "primary",
  },
  {
    icon: Calendar,
    title: "Weekly Missions",
    description: "Complete check-ins, feedback surveys, and capture tourist-spot photos.",
    color: "secondary",
  },
  {
    icon: Trophy,
    title: "Seasonal Events",
    description: "Join limited-time challenges with leaderboards and special rewards.",
    color: "accent",
  },
  {
    icon: Users,
    title: "Community Quests",
    description: "Cross-region goals with pooled progress and proportional rewards.",
    color: "primary",
  },
  {
    icon: Plane,
    title: "In-Flight Challenges",
    description: "Flight-mode quests like destination quizzes and wellness routines.",
    color: "secondary",
  },
  {
    icon: MapPin,
    title: "Location-Based",
    description: "Partner-triggered missions at specific locations and venues.",
    color: "accent",
  },
];

export const QuestTypes = () => {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Multiple Ways to <span className="text-primary">Earn</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From daily habits to seasonal challenges, there's always a quest waiting for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questTypes.map((quest, index) => {
            const Icon = quest.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-lg bg-card shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex p-3 rounded-lg bg-${quest.color}/10 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 text-${quest.color}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {quest.title}
                </h3>
                <p className="text-muted-foreground">{quest.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

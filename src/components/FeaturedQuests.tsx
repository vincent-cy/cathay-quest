import { QuestCard } from "./QuestCard";

const sampleQuests = [
  {
    title: "Airport Recycling Champion",
    description: "Recycle at designated bins with photo verification. Help make travel greener!",
    reward: 20,
    type: "daily" as const,
    timeLeft: "12h left",
    location: "Hong Kong Int'l",
    featured: true,
  },
  {
    title: "Paperless Check-In Streak",
    description: "Complete 5 paperless check-ins this month and earn bonus miles.",
    reward: 250,
    type: "weekly" as const,
    timeLeft: "5 days left",
  },
  {
    title: "Earth Day Challenge",
    description: "Join our global sustainability initiative. Complete eco-friendly tasks.",
    reward: 500,
    type: "seasonal" as const,
    timeLeft: "30 days left",
    featured: true,
  },
  {
    title: "Welcome to Asia Miles Quest",
    description: "Complete your profile and take the getting started tour.",
    reward: 100,
    type: "one-time" as const,
  },
  {
    title: "Destination Quiz Master",
    description: "Answer 10 questions about your destination during your flight.",
    reward: 50,
    type: "daily" as const,
    timeLeft: "In-flight only",
    location: "Any Cathay Flight",
  },
  {
    title: "Lounge Experience Survey",
    description: "Share your feedback about our lounge facilities.",
    reward: 30,
    type: "weekly" as const,
    location: "Airport Lounges",
  },
];

export const FeaturedQuests = () => {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center space-y-3 md:space-y-4 mb-12 md:mb-16 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Active <span className="text-primary">Quests</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Start earning miles right away with these available missions.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sampleQuests.map((quest, index) => (
            <div
              key={index}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <QuestCard {...quest} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

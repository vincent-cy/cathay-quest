import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Award, Crown } from "lucide-react";
import achievementBadge from "@/assets/achievement-badge.png";

const topUsers = [
  { rank: 1, name: "Sarah Chen", miles: 2450, streak: 47, region: "Hong Kong" },
  { rank: 2, name: "James Wong", miles: 2380, streak: 42, region: "Singapore" },
  { rank: 3, name: "Emily Park", miles: 2210, streak: 39, region: "Seoul" },
  { rank: 4, name: "Michael Liu", miles: 2050, streak: 35, region: "Tokyo" },
  { rank: 5, name: "Lisa Tan", miles: 1990, streak: 33, region: "Bangkok" },
];

export const Leaderboard = () => {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center space-y-4 mb-16">
          <div className="flex justify-center mb-4">
            <img src={achievementBadge} alt="Achievement Badge" className="w-20 h-20 animate-pulse-glow" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Global <span className="text-accent">Leaderboard</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compete with travelers worldwide. Top performers earn exclusive rewards!
          </p>
          <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
            <TrendingUp className="w-3 h-3 mr-1" />
            Seasonal Reset: 15 days remaining
          </Badge>
        </div>

        <Card className="shadow-elevated">
          <div className="p-6 space-y-4">
            {topUsers.map((user, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 hover:shadow-card hover:-translate-y-0.5 ${
                  index < 3 ? "bg-gradient-card" : "bg-muted/50"
                } animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Rank */}
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  {user.rank === 1 ? (
                    <div className="relative">
                      <Crown className="w-8 h-8 text-accent animate-float" />
                      <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full" />
                    </div>
                  ) : user.rank === 2 ? (
                    <Trophy className="w-7 h-7 text-muted-foreground" />
                  ) : user.rank === 3 ? (
                    <Award className="w-6 h-6 text-muted-foreground" />
                  ) : (
                    <span className="text-2xl font-bold text-muted-foreground">#{user.rank}</span>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-foreground truncate">{user.name}</h4>
                    <Badge variant="outline" className="text-xs bg-background/50">
                      {user.region}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {user.streak} day streak
                    </span>
                  </div>
                </div>

                {/* Miles */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-accent">{user.miles.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">miles earned</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};

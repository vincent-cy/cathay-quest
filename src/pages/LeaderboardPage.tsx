import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown, Award } from "lucide-react";

const topUsers = [
  { rank: 1, name: "Sarah Chen", miles: 2450, streak: 47, region: "Hong Kong" },
  { rank: 2, name: "James Wong", miles: 2380, streak: 42, region: "Singapore" },
  { rank: 3, name: "Emily Park", miles: 2210, streak: 39, region: "Seoul" },
  { rank: 4, name: "Michael Liu", miles: 2050, streak: 35, region: "Tokyo" },
  { rank: 5, name: "Lisa Tan", miles: 1990, streak: 33, region: "Bangkok" },
  { rank: 6, name: "David Kim", miles: 1850, streak: 30, region: "Seoul" },
  { rank: 7, name: "Anna Lee", miles: 1720, streak: 28, region: "Hong Kong" },
];

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">Top performers this season</p>
        <Badge variant="outline" className="mt-2 bg-accent/10 text-accent-foreground border-accent/20 text-xs">
          Season ends in 15 days
        </Badge>
      </header>

      <div className="p-4 space-y-3">
        {topUsers.map((user, index) => (
          <Card
            key={index}
            className={`p-4 shadow-card ${
              index < 3 ? "bg-gradient-card" : "bg-muted/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                {user.rank === 1 ? (
                  <Crown className="w-7 h-7 text-accent" />
                ) : user.rank === 2 ? (
                  <Trophy className="w-6 h-6 text-muted-foreground" />
                ) : user.rank === 3 ? (
                  <Award className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <span className="text-xl font-bold text-muted-foreground">#{user.rank}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-sm text-foreground truncate">{user.name}</h4>
                  <Badge variant="outline" className="text-xs bg-background/50">
                    {user.region}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {user.streak} day streak
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div 
                  className="text-xl font-bold"
                  style={{
                    color: user.rank === 1 
                      ? 'hsl(45 90% 50%)' // Gold
                      : user.rank === 2 
                      ? 'hsl(0 0% 75%)' // Silver
                      : user.rank === 3 
                      ? 'hsl(25 75% 47%)' // Bronze
                      : 'hsl(var(--accent))'
                  }}
                >
                  {user.miles.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Cathay points</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default LeaderboardPage;

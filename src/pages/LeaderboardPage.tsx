import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Crown, Award, Star, Flame, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const [selectedUser, setSelectedUser] = useState<typeof topUsers[0] | null>(null);

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
            className="p-4 shadow-card cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedUser(user)}
            style={{
              background: user.rank === 1 
                ? 'linear-gradient(135deg, hsl(45 90% 88%), hsl(45 90% 95%))' // Gold
                : user.rank === 2 
                ? 'linear-gradient(135deg, hsl(0 0% 88%), hsl(0 0% 95%))' // Silver
                : user.rank === 3 
                ? 'linear-gradient(135deg, hsl(25 75% 85%), hsl(25 75% 92%))' // Bronze
                : 'hsl(var(--muted) / 0.5)'
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                {user.rank === 1 ? (
                  <Crown className="w-7 h-7" style={{ color: 'hsl(45 90% 50%)' }} />
                ) : user.rank === 2 ? (
                  <Trophy className="w-6 h-6" style={{ color: 'hsl(0 0% 75%)' }} />
                ) : user.rank === 3 ? (
                  <Award className="w-5 h-5" style={{ color: 'hsl(25 75% 47%)' }} />
                ) : (
                  <span className="text-xl font-bold text-muted-foreground">#{user.rank}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-sm text-foreground truncate">{user.name}</h4>
                  <Badge variant="outline" className="text-xs bg-background/50 whitespace-nowrap">
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
                <div className="text-xs text-muted-foreground">Cathay Points</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* User Statistics Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedUser.rank === 1 ? (
                    <Crown className="w-6 h-6" style={{ color: 'hsl(45 90% 50%)' }} />
                  ) : selectedUser.rank === 2 ? (
                    <Trophy className="w-5 h-5" style={{ color: 'hsl(0 0% 75%)' }} />
                  ) : selectedUser.rank === 3 ? (
                    <Award className="w-5 h-5" style={{ color: 'hsl(25 75% 47%)' }} />
                  ) : null}
                  <span>{selectedUser.name}</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedUser.region}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 text-center">
                    <Trophy className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{selectedUser.miles.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Cathay Points</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <Flame className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{selectedUser.streak}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <Star className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{Math.floor(selectedUser.miles / 50)}</p>
                    <p className="text-xs text-muted-foreground">Quests Completed</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <Award className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{Math.floor(selectedUser.streak / 5)}</p>
                    <p className="text-xs text-muted-foreground">Badges Earned</p>
                  </Card>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-foreground mb-2 text-sm">Recent Achievements</h4>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="bg-muted/50">🌱 Eco Warrior</Badge>
                    <Badge variant="outline" className="bg-muted/50">🔥 {selectedUser.streak} Day Streak</Badge>
                    <Badge variant="outline" className="bg-muted/50">✈️ Frequent Flyer</Badge>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default LeaderboardPage;

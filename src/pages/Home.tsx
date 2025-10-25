import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Flame, Star, Award, X, Gift } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Home = () => {
  const [showCalendar, setShowCalendar] = useState(true);
  const [checkedDays, setCheckedDays] = useState<number[]>([1, 2, 3, 4]);
  const currentDay = 5; // This would be calculated based on actual date

  const dailyRewards = [
    { day: 1, reward: 10 }, { day: 2, reward: 10 }, { day: 3, reward: 15 }, { day: 4, reward: 15 },
    { day: 5, reward: 20 }, { day: 6, reward: 20 }, { day: 7, reward: 25 }, { day: 8, reward: 25 },
    { day: 9, reward: 30 }, { day: 10, reward: 30 }, { day: 11, reward: 35 }, { day: 12, reward: 35 },
    { day: 13, reward: 40 }, { day: 14, reward: 40 }, { day: 15, reward: 45 }, { day: 16, reward: 45 },
    { day: 17, reward: 50 }, { day: 18, reward: 50 }, { day: 19, reward: 55 }, { day: 20, reward: 55 },
    { day: 21, reward: 60 }, { day: 22, reward: 60 }, { day: 23, reward: 65 }, { day: 24, reward: 65 },
    { day: 25, reward: 70 }, { day: 26, reward: 70 }, { day: 27, reward: 75 }, { day: 28, reward: 75 },
    { day: 29, reward: 80 }, { day: 30, reward: 80 }, { day: 31, reward: 500 }
  ];

  const handleClaimReward = () => {
    if (!checkedDays.includes(currentDay)) {
      setCheckedDays([...checkedDays, currentDay]);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Daily Check-in Dialog */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Daily Check-in Rewards
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-7 gap-2 p-4">
            {dailyRewards.map((item) => (
              <div
                key={item.day}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-semibold transition-all ${
                  checkedDays.includes(item.day)
                    ? 'bg-accent text-white shadow-lg scale-105'
                    : item.day === currentDay
                    ? 'bg-primary text-white animate-pulse ring-2 ring-primary'
                    : item.day === 31
                    ? 'bg-gradient-achievement text-white col-span-7'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <div className="text-xs opacity-70">Day {item.day}</div>
                <div className="flex items-center gap-1 mt-1">
                  <Trophy className="w-3 h-3" />
                  <span>{item.reward}</span>
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={handleClaimReward}
            disabled={checkedDays.includes(currentDay)}
            className="w-full"
            size="lg"
          >
            <Gift className="w-5 h-5 mr-2" />
            {checkedDays.includes(currentDay) ? 'Already Claimed Today' : 'Claim Today\'s Reward'}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="p-6 border-b border-border bg-gradient-hero">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
          Welcome Back!
        </h1>
        <p className="text-white/90 text-lg">
          Your journey continues
        </p>
      </header>

      {/* Profile Content */}
      <div className="p-4 space-y-4">
        <Card className="p-6 shadow-card text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarFallback className="bg-primary text-white text-2xl">JD</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold text-foreground mb-1">John Doe</h2>
          <p className="text-sm text-muted-foreground mb-4">Hong Kong</p>
          <Badge className="bg-accent">Asia Miles Member</Badge>
        </Card>

        <Card className="p-4 shadow-card">
          <h3 className="font-bold text-foreground mb-4">Your Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Trophy className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">1,850</p>
              <p className="text-xs text-muted-foreground">Cathay Points</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Flame className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">15</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Star className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">23</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Award className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">8</p>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 shadow-card">
          <h3 className="font-bold text-foreground mb-3">Recent Badges</h3>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="bg-muted/50">🌱 Eco Warrior</Badge>
            <Badge variant="outline" className="bg-muted/50">🔥 15 Day Streak</Badge>
            <Badge variant="outline" className="bg-muted/50">✈️ Check-in Pro</Badge>
            <Badge variant="outline" className="bg-muted/50">🏆 Quest Master</Badge>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;

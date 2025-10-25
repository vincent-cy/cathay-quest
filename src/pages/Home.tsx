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
  const [cathayPoints, setCathayPoints] = useState(1850);
  
  // Calculate next slot to claim (additive system)
  const nextSlotToClaim = checkedDays.length + 1;

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
    if (nextSlotToClaim <= 31) {
      const rewardAmount = dailyRewards[nextSlotToClaim - 1].reward;
      setCheckedDays([...checkedDays, nextSlotToClaim]);
      setCathayPoints(cathayPoints + rewardAmount);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Daily Check-in Dialog */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-md flex flex-col max-h-[85vh]">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-2xl font-bold text-center">
              Daily Check-in Rewards
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-4">
            <div className="grid grid-cols-7 gap-3 py-4">
              {dailyRewards.map((item) => (
                <div
                  key={item.day}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 text-xs font-semibold transition-all ${
                    checkedDays.includes(item.day)
                      ? 'bg-accent text-white shadow-lg scale-105'
                      : item.day === nextSlotToClaim
                      ? 'bg-primary text-white animate-pulse ring-2 ring-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="text-sm font-bold mb-0.5">{item.day}</div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">{item.reward}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 p-4 pt-0">
            <Button
              onClick={handleClaimReward}
              disabled={nextSlotToClaim > 31}
              className="w-full"
              size="lg"
            >
              <Gift className="w-5 h-5 mr-2" />
              {nextSlotToClaim > 31 ? 'All Rewards Claimed!' : `Claim Reward ${nextSlotToClaim}`}
            </Button>
          </div>
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
              <p className="text-2xl font-bold text-foreground">{cathayPoints.toLocaleString()}</p>
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

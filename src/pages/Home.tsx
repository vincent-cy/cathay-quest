import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Flame, Star, Award, Gift, Coffee, Wifi, Luggage, Plane, Zap, Ticket } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useQuests } from "@/contexts/QuestContext";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [checkedDays, setCheckedDays] = useState<number[]>([1, 2, 3, 4]);
  const [hasClaimedToday, setHasClaimedToday] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const { cathayPoints, addCathayPoints, ownedVouchers, removeVoucher } = useQuests();
  const { toast } = useToast();
  
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
    { day: 29, reward: 80 }, { day: 30, reward: 80 }, { day: 31, reward: 200 }
  ];

  const handleClaimReward = () => {
    if (nextSlotToClaim <= 31 && !hasClaimedToday) {
      const rewardAmount = dailyRewards[nextSlotToClaim - 1].reward;
      setCheckedDays([...checkedDays, nextSlotToClaim]);
      addCathayPoints(rewardAmount);
      setHasClaimedToday(true);
    }
  };

  const handleUseVoucher = (voucher: any) => {
    removeVoucher(voucher.id);
    toast({
      title: "Voucher Used!",
      description: `${voucher.name} has been used and removed from your inventory.`,
    });
    setSelectedVoucher(null);
  };

  const getVoucherIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Coffee, Wifi, Luggage, Plane, Star, Award, Zap
    };
    return icons[iconName] || Ticket;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Daily Check-in Dialog */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-2xl flex flex-col max-h-[85vh]">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-2xl font-bold text-center">
              Daily Check-in Rewards
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-4">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2 sm:gap-3 py-4">
              {dailyRewards.map((item) => (
                <div
                  key={item.day}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center p-2 text-xs font-semibold transition-all ${
                    item.day === 31
                      ? checkedDays.includes(item.day)
                        ? 'bg-accent text-white shadow-lg scale-105 ring-4 ring-yellow-500/80 border-2 border-yellow-400'
                        : item.day === nextSlotToClaim
                        ? 'bg-primary text-white animate-pulse ring-4 ring-yellow-500/80 border-2 border-yellow-400'
                        : 'bg-muted text-muted-foreground ring-4 ring-yellow-500/80 border-2 border-yellow-400'
                      : checkedDays.includes(item.day)
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
              disabled={nextSlotToClaim > 31 || hasClaimedToday}
              className="w-full"
              size="lg"
            >
              <Gift className="w-5 h-5 mr-2" />
              {nextSlotToClaim > 31 ? 'All Rewards Claimed!' : hasClaimedToday ? 'Already Claimed Today' : `Claim Reward ${nextSlotToClaim}`}
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
        {/* Daily Check-in Button */}
        <Button 
          onClick={() => setShowCalendar(true)}
          className="w-full"
          size="lg"
          variant="default"
        >
          <Gift className="w-5 h-5 mr-2" />
          Daily Check-in Rewards
        </Button>

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

        {/* Owned Vouchers Section */}
        <Card className="p-4 shadow-card">
          <h3 className="font-bold text-foreground mb-3">My Vouchers</h3>
          {ownedVouchers.length === 0 ? (
            <div className="text-center py-8">
              <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No vouchers yet</p>
              <p className="text-xs text-muted-foreground mt-1">Visit the Shop to redeem rewards</p>
            </div>
          ) : (
            <div className="space-y-2">
              {ownedVouchers.map((voucher) => {
                const Icon = getVoucherIcon(voucher.icon);
                return (
                  <Card
                    key={voucher.id}
                    className="p-3 cursor-pointer transition-all hover:shadow-card bg-gradient-to-br from-primary/5 to-accent/5"
                    onClick={() => setSelectedVoucher(voucher)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-foreground truncate">{voucher.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{voucher.availability}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        Use
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Voucher Use Dialog */}
      <Dialog open={!!selectedVoucher} onOpenChange={() => setSelectedVoucher(null)}>
        <DialogContent className="max-w-md">
          {selectedVoucher && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedVoucher.name}</DialogTitle>
                <DialogDescription>{selectedVoucher.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Availability:</strong> {selectedVoucher.availability}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Redeemed:</strong> {new Date(selectedVoucher.redeemedAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Once you use this voucher, it will be removed from your inventory. Make sure you're ready to use it now.
                </p>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setSelectedVoucher(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleUseVoucher(selectedVoucher)}
                  className="bg-gradient-achievement"
                >
                  Use Voucher
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Home;

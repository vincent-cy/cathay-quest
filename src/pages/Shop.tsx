import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Coffee, Wifi, Luggage, Plane, Star, Award, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuests } from "@/contexts/QuestContext";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  points: number;
  category: "inflight" | "travel" | "upgrades";
  icon: any;
  availability: string;
}

const shopItems: ShopItem[] = [
  // In-Flight Perks
  {
    id: "snack-voucher",
    name: "Premium Snack Box",
    description: "Upgrade your snack to a premium selection on any flight.",
    points: 200,
    category: "inflight",
    icon: Coffee,
    availability: "Any flight"
  },
  {
    id: "wifi-pass",
    name: "Wi-Fi Pass",
    description: "One hour of complimentary Wi-Fi on your next flight.",
    points: 100,
    category: "inflight",
    icon: Wifi,
    availability: "Long-haul flights"
  },
  {
    id: "wifi-full",
    name: "Full Flight Wi-Fi",
    description: "Unlimited Wi-Fi for one complete flight journey.",
    points: 300,
    category: "inflight",
    icon: Wifi,
    availability: "Long-haul flights"
  },
  {
    id: "meal-voucher",
    name: "Meal Voucher",
    description: "One complimentary meal on your next flight. Valid for 3 months.",
    points: 600,
    category: "inflight",
    icon: Coffee,
    availability: "Any flight"
  },
  
  // Travel Perks
  {
    id: "priority-checkin",
    name: "Priority Check-in",
    description: "Skip the regular queue with priority check-in access for one trip.",
    points: 250,
    category: "travel",
    icon: Zap,
    availability: "One-time use"
  },
  {
    id: "baggage-voucher",
    name: "Extra Baggage Voucher",
    description: "Add one checked bag (up to 23kg) for free on your next flight.",
    points: 600,
    category: "travel",
    icon: Luggage,
    availability: "One flight"
  },
  {
    id: "asia-miles-500",
    name: "500 Asia Miles",
    description: "Add 500 miles directly to your Asia Miles account.",
    points: 1500,
    category: "travel",
    icon: Plane,
    availability: "Instant credit"
  },
  {
    id: "asia-miles-1000",
    name: "1,000 Asia Miles",
    description: "Add 1,000 miles directly to your Asia Miles account.",
    points: 2500,
    category: "travel",
    icon: Plane,
    availability: "Instant credit"
  },
  
  // Upgrades
  {
    id: "seat-selection",
    name: "Preferred Seat Selection",
    description: "Choose your preferred seat (extra legroom or window) for free.",
    points: 300,
    category: "upgrades",
    icon: Star,
    availability: "One flight"
  },
  {
    id: "lounge-pass",
    name: "Lounge Day Pass",
    description: "Access to Cathay Pacific lounges for one visit (3-hour limit).",
    points: 500,
    category: "upgrades",
    icon: Award,
    availability: "Valid 6 months"
  },
  {
    id: "upgrade-voucher",
    name: "Upgrade Voucher",
    description: "Subject to availability: Economy to Premium Economy upgrade.",
    points: 2500,
    category: "upgrades",
    icon: Star,
    availability: "Regional flights only"
  }
];

const Shop = () => {
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const { cathayPoints, deductCathayPoints, addVoucher } = useQuests();
  const { toast } = useToast();

  const handleRedeem = (item: ShopItem) => {
    const success = deductCathayPoints(item.points);
    
    if (success) {
      // Add voucher to inventory
      addVoucher({
        id: `${item.id}-${Date.now()}`,
        name: item.name,
        description: item.description,
        availability: item.availability,
        icon: item.icon.name,
        redeemedAt: new Date()
      });
      
      toast({
        title: "Reward Redeemed!",
        description: `You've successfully redeemed ${item.name} for ${item.points} points.`,
      });
      setSelectedItem(null);
    } else {
      toast({
        title: "Insufficient Points",
        description: `You need ${item.points - cathayPoints} more points to redeem this reward.`,
        variant: "destructive",
      });
    }
  };

  const getCategoryItems = (category: ShopItem["category"]) => 
    shopItems.filter(item => item.category === category);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with Points Balance */}
      <header className="p-4 border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-foreground">Rewards Shop</h1>
          <Badge className="bg-gradient-achievement text-white px-4 py-2 text-base">
            {cathayPoints.toLocaleString()} Points
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Redeem your Cathay Points for exclusive rewards</p>
      </header>

      <Tabs defaultValue="inflight" className="p-4">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="inflight">In-Flight</TabsTrigger>
          <TabsTrigger value="travel">Travel</TabsTrigger>
          <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
        </TabsList>

        {/* In-Flight Tab */}
        <TabsContent value="inflight" className="space-y-3">
          {getCategoryItems("inflight").map((item) => {
            const Icon = item.icon;
            const canAfford = cathayPoints >= item.points;
            
            return (
              <Card
                key={item.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-card ${
                  !canAfford ? "opacity-60" : ""
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    canAfford ? "bg-primary/10" : "bg-muted"
                  }`}>
                    <Icon className={`w-6 h-6 ${canAfford ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-foreground">{item.name}</h3>
                      <Badge variant={canAfford ? "default" : "outline"} className="shrink-0">
                        {item.points} pts
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <p className="text-xs text-muted-foreground">📍 {item.availability}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        {/* Travel Tab */}
        <TabsContent value="travel" className="space-y-3">
          {getCategoryItems("travel").map((item) => {
            const Icon = item.icon;
            const canAfford = cathayPoints >= item.points;
            
            return (
              <Card
                key={item.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-card ${
                  !canAfford ? "opacity-60" : ""
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    canAfford ? "bg-primary/10" : "bg-muted"
                  }`}>
                    <Icon className={`w-6 h-6 ${canAfford ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-foreground">{item.name}</h3>
                      <Badge variant={canAfford ? "default" : "outline"} className="shrink-0">
                        {item.points} pts
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <p className="text-xs text-muted-foreground">📍 {item.availability}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        {/* Upgrades Tab */}
        <TabsContent value="upgrades" className="space-y-3">
          {getCategoryItems("upgrades").map((item) => {
            const Icon = item.icon;
            const canAfford = cathayPoints >= item.points;
            
            return (
              <Card
                key={item.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-card ${
                  !canAfford ? "opacity-60" : ""
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    canAfford ? "bg-primary/10" : "bg-muted"
                  }`}>
                    <Icon className={`w-6 h-6 ${canAfford ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-foreground">{item.name}</h3>
                      <Badge variant={canAfford ? "default" : "outline"} className="shrink-0">
                        {item.points} pts
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <p className="text-xs text-muted-foreground">📍 {item.availability}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* Redemption Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-md">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedItem.name}</DialogTitle>
                <DialogDescription>{selectedItem.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Cost</span>
                  <span className="font-bold text-lg">{selectedItem.points} Points</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Your Balance</span>
                  <span className="font-bold text-lg">{cathayPoints} Points</span>
                </div>
                {cathayPoints >= selectedItem.points && (
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <span className="text-sm text-primary font-medium">After Redemption</span>
                    <span className="font-bold text-lg text-primary">
                      {cathayPoints - selectedItem.points} Points
                    </span>
                  </div>
                )}
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground">
                    <strong>Availability:</strong> {selectedItem.availability}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Reward will be sent to your registered email within 24 hours.
                  </p>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setSelectedItem(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleRedeem(selectedItem)}
                  disabled={cathayPoints < selectedItem.points}
                  className="bg-gradient-achievement"
                >
                  Redeem Now
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

export default Shop;

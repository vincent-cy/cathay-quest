import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Flame, Star, Award } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Your achievements & stats</p>
      </header>

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
              <p className="text-xs text-muted-foreground">Total Miles</p>
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

export default Profile;

import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Target, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import heroFlight from "@/assets/hero-flight.jpg";

const seasonalEvents = [
  {
    id: "halloween",
    title: "Halloween Spook Fest",
    description: "Join the spooky celebrations this October",
    reward: 500,
    participants: 12450,
    endsIn: "15 days",
    theme: {
      primary: "hsl(25 95% 53%)", // Orange
      secondary: "hsl(0 0% 0%)", // Black
      gradient: "linear-gradient(135deg, hsl(25 95% 53%), hsl(0 0% 20%))"
    },
    quests: [
      { title: "Trick or Treat Travel", description: "Book a flight to a spooky destination", reward: 100 },
      { title: "Costume Check-in", description: "Check-in wearing Halloween attire", reward: 75 },
      { title: "Ghost Story Quiz", description: "Answer Halloween trivia questions", reward: 50 },
      { title: "Pumpkin Patch Photo", description: "Share your Halloween spirit", reward: 75 }
    ]
  }
];

const communityGoals = [
  {
    goal: "$35,000",
    title: "Funding Goal",
    description: "Unlock basic rewards",
    status: "FUNDED",
    funded: true
  },
  {
    goal: "$39,000",
    title: "The White Palace",
    description: "Exclusive destination unlock",
    status: "FUNDED",
    funded: true
  },
  {
    goal: "$44,000",
    title: "4 Additional Quests",
    description: "More missions for everyone",
    status: "FUNDED",
    funded: true
  },
  {
    goal: "$50,000",
    title: "Wii U",
    description: "Gaming rewards unlock",
    status: "FUNDED",
    funded: true
  },
  {
    goal: "$56,000",
    title: "2nd Playable Character",
    description: "New character unlock",
    status: "FUNDED",
    funded: true
  },
  {
    goal: "$62,000",
    title: "Colosseum of Fools",
    description: "Challenge arena + new bosses",
    status: "IN PROGRESS",
    funded: false,
    currentAmount: "$58,000"
  },
  {
    goal: "$68,000",
    title: "3rd Playable Character",
    description: "Another hero joins",
    status: "LOCKED",
    funded: false
  },
  {
    goal: "$85,000",
    title: "The Abyss",
    description: "Massive new expansion",
    status: "LOCKED",
    funded: false
  }
];

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<typeof seasonalEvents[0] | null>(null);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Events & Challenges</h1>
        <p className="text-sm text-muted-foreground">Limited-time opportunities</p>
      </header>

      <Tabs defaultValue="seasonal" className="p-4">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="seasonal">Seasonal Badges</TabsTrigger>
          <TabsTrigger value="community">Community Challenges</TabsTrigger>
        </TabsList>

        {/* Seasonal Badges Tab */}
        <TabsContent value="seasonal" className="space-y-4">
          {seasonalEvents.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden cursor-pointer hover:shadow-elevated transition-all"
              onClick={() => setSelectedEvent(event)}
              style={{
                background: event.theme.gradient
              }}
            >
              <div className="relative h-48">
                <img src={heroFlight} alt={event.title} className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
                    {event.title}
                  </h2>
                  <p className="text-white/90 text-sm">{event.description}</p>
                </div>
              </div>
              <div className="p-4 bg-background/95">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {event.endsIn}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {event.participants.toLocaleString()} joined
                    </span>
                  </div>
                  <Badge className="bg-accent">
                    <Trophy className="w-3 h-3 mr-1" />
                    {event.reward}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Community Challenges Tab */}
        <TabsContent value="community" className="space-y-4">
          <Card className="p-6 shadow-card bg-gradient-to-br from-background to-muted/30">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                STRETCH GOALS
              </h2>
              <p className="text-muted-foreground">
                Community milestones unlock rewards for everyone
              </p>
            </div>

            {/* Progress Bar */}
            <div className="relative h-4 bg-muted rounded-full mb-6 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-achievement transition-all duration-500"
                style={{ width: "75%" }}
              />
            </div>

            {/* Goals Grid */}
            <div className="space-y-3">
              {communityGoals.map((goal, index) => (
                <Card
                  key={index}
                  className={`p-4 transition-all ${
                    goal.funded
                      ? "bg-gradient-achievement text-white border-accent"
                      : goal.status === "IN PROGRESS"
                      ? "bg-primary/10 border-primary"
                      : "bg-muted/50 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            goal.funded ? "bg-white/20 text-white border-white/30" : ""
                          }`}
                        >
                          {goal.status}
                        </Badge>
                        {goal.currentAmount && (
                          <span className="text-xs font-bold text-primary">
                            {goal.currentAmount} / {goal.goal}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{goal.title}</h3>
                      <p className="text-sm opacity-90">{goal.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {goal.funded ? (
                        <Target className="w-6 h-6" />
                      ) : (
                        <span className="text-2xl font-bold">{goal.goal}</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedEvent.title}</DialogTitle>
                <DialogDescription>{selectedEvent.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <h3 className="font-bold text-lg">Event Quests</h3>
                {selectedEvent.quests.map((quest, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground mb-1">{quest.title}</h4>
                        <p className="text-sm text-muted-foreground">{quest.description}</p>
                      </div>
                      <Badge className="bg-accent ml-2">
                        <Trophy className="w-3 h-3 mr-1" />
                        {quest.reward}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Events;

import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Target, Users, Lock, CheckCircle2 } from "lucide-react";
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

const communityMilestones = [
  {
    goal: "$85,000",
    goalNum: 85000,
    title: "The Abyss",
    description: "Massive new expansion",
    reward: "1000 Points + Exclusive Badge",
    status: "LOCKED",
    funded: false,
    position: "right"
  },
  {
    goal: "$68,000",
    goalNum: 68000,
    title: "3rd Playable Character",
    description: "Another hero joins",
    reward: "500 Points",
    status: "LOCKED",
    funded: false,
    position: "left"
  },
  {
    goal: "$62,000",
    goalNum: 62000,
    title: "Colosseum of Fools",
    description: "Challenge arena + new bosses",
    reward: "400 Points",
    status: "IN PROGRESS",
    funded: false,
    currentAmount: 58000,
    position: "right"
  },
  {
    goal: "$56,000",
    goalNum: 56000,
    title: "2nd Playable Character",
    description: "New character unlock",
    reward: "350 Points",
    status: "FUNDED",
    funded: true,
    position: "left"
  },
  {
    goal: "$50,000",
    goalNum: 50000,
    title: "Wii U",
    description: "Gaming rewards unlock",
    reward: "300 Points",
    status: "FUNDED",
    funded: true,
    position: "right"
  },
  {
    goal: "$44,000",
    goalNum: 44000,
    title: "4 Additional Quests",
    description: "More missions for everyone",
    reward: "250 Points",
    status: "FUNDED",
    funded: true,
    position: "left"
  },
  {
    goal: "$39,000",
    goalNum: 39000,
    title: "The White Palace",
    description: "Exclusive destination unlock",
    reward: "200 Points",
    status: "FUNDED",
    funded: true,
    position: "right"
  },
  {
    goal: "$35,000",
    goalNum: 35000,
    title: "Funding Goal",
    description: "Unlock basic rewards",
    reward: "100 Points",
    status: "FUNDED",
    funded: true,
    position: "left"
  }
];

const totalGoal = 85000;
const currentProgress = 58000;

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
          <Card className="p-6 shadow-card bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
            {/* Header with Final Reward */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2 tracking-wider">
                COLLECTION LEVEL
              </h2>
              <div className="inline-flex items-center gap-3 bg-gradient-achievement px-6 py-3 rounded-full shadow-glow">
                <Trophy className="w-6 h-6 text-white" />
                <span className="text-white font-bold text-lg">
                  {communityMilestones[0].reward}
                </span>
              </div>
              <p className="text-muted-foreground mt-4 text-sm">
                Community Progress: ${(currentProgress / 1000).toFixed(1)}K / ${(totalGoal / 1000).toFixed(0)}K
              </p>
            </div>

            {/* Vertical Milestone Path */}
            <div className="relative max-w-2xl mx-auto py-6">
              {/* Central Vertical Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-primary to-muted/30 transform -translate-x-1/2" />

              {/* Milestones */}
              <div className="space-y-8">
                {communityMilestones.map((milestone, index) => (
                  <div key={index} className="relative">
                    {/* Milestone Circle */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 z-10">
                      <div
                        className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-sm shadow-lg transition-all ${
                          milestone.funded
                            ? "bg-gradient-achievement border-accent text-white"
                            : milestone.status === "IN PROGRESS"
                            ? "bg-primary border-primary-glow text-white animate-pulse"
                            : "bg-muted border-border text-muted-foreground"
                        }`}
                      >
                        {milestone.funded ? (
                          <CheckCircle2 className="w-8 h-8" />
                        ) : (
                          <span>{(milestone.goalNum / 1000).toFixed(0)}</span>
                        )}
                      </div>
                    </div>

                    {/* Milestone Card - Alternating Sides */}
                    <div
                      className={`flex ${
                        milestone.position === "left" ? "justify-start pr-[55%]" : "justify-end pl-[55%]"
                      }`}
                    >
                      <Card
                        className={`relative p-4 w-full transition-all ${
                          milestone.funded
                            ? "bg-gradient-achievement text-white border-accent shadow-elevated"
                            : milestone.status === "IN PROGRESS"
                            ? "bg-primary/10 border-primary shadow-card"
                            : "bg-muted/50 border-border opacity-70"
                        }`}
                      >
                        {/* Lock Icon for Locked Items */}
                        {!milestone.funded && milestone.status === "LOCKED" && (
                          <div className="absolute -top-2 -right-2 bg-background rounded-full p-2 border-2 border-border">
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}

                        {/* Arrow pointing to center */}
                        <div
                          className={`absolute top-1/2 transform -translate-y-1/2 ${
                            milestone.position === "left" ? "right-0 translate-x-full" : "left-0 -translate-x-full"
                          }`}
                        >
                          <div
                            className={`w-0 h-0 border-t-8 border-b-8 border-transparent ${
                              milestone.position === "left" ? "border-l-8" : "border-r-8"
                            } ${
                              milestone.funded
                                ? "border-l-accent border-r-accent"
                                : milestone.status === "IN PROGRESS"
                                ? "border-l-primary border-r-primary"
                                : "border-l-border border-r-border"
                            }`}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-bold text-base">{milestone.title}</h3>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                milestone.funded
                                  ? "bg-white/20 text-white border-white/30"
                                  : milestone.status === "IN PROGRESS"
                                  ? "bg-primary/20 border-primary"
                                  : ""
                              }`}
                            >
                              {milestone.goal}
                            </Badge>
                          </div>
                          <p
                            className={`text-sm ${
                              milestone.funded ? "text-white/90" : "text-muted-foreground"
                            }`}
                          >
                            {milestone.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs font-semibold">
                            <Trophy
                              className={`w-3 h-3 ${
                                milestone.funded ? "text-white" : "text-accent"
                              }`}
                            />
                            <span>{milestone.reward}</span>
                          </div>
                          {milestone.status === "IN PROGRESS" && milestone.currentAmount && (
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-primary font-bold">
                                  ${(milestone.currentAmount / 1000).toFixed(1)}K
                                </span>
                                <span className="text-muted-foreground">{milestone.goal}</span>
                              </div>
                              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all"
                                  style={{
                                    width: `${(milestone.currentAmount / milestone.goalNum) * 100}%`
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
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

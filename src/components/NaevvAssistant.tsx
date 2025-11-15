import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Settings, Bot } from "lucide-react";
import { NaevvConfigDialog } from "@/components/NaevvConfig";
import { useNaevv } from "@/contexts/NaevvContext";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  sender: "user" | "naevv";
  timestamp: Date;
}

export const NaevvAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm Naevv, your AI Quest Assistant. I'm here to help you discover personalized quests, provide recommendations, and guide you through your journey with Cathay Quest. How can I assist you today?",
      sender: "naevv",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const { isConfigured, config } = useNaevv();

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    if (!isConfigured) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: inputValue,
          sender: "user",
          timestamp: new Date(),
        },
        {
          id: (Date.now() + 1).toString(),
          text: "Please configure my API Key and LLM Boundary first by clicking the Settings button. This will enable me to provide you with intelligent responses!",
          sender: "naevv",
          timestamp: new Date(),
        },
      ]);
      setInputValue("");
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate Naevv response (placeholder)
    setTimeout(() => {
      const naevvResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I've received your message! In a full implementation, I would use my configured API and LLM boundary to provide an intelligent response. For now, this is a placeholder response.",
        sender: "naevv",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, naevvResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 pb-20">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Bot className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Naevv</h1>
                <p className="text-xs text-muted-foreground">
                  {isConfigured ? "Ready to assist" : "Awaiting configuration"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsConfigDialogOpen(true)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isConfigured && (
          <div className="px-4 py-2 bg-accent/10 border-b border-accent/20">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                ✓ Configured
              </Badge>
              <span className="text-xs text-muted-foreground">
                Model ready for interaction
              </span>
            </div>
          </div>
        )}
      </header>

      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-accent text-accent-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background to-background/80">
        <Card className="p-3">
          <div className="flex gap-2">
            <Input
              placeholder={
                isConfigured
                  ? "Ask Naevv anything..."
                  : "Configure Naevv first..."
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={!isConfigured}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || !isConfigured}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      <NaevvConfigDialog
        open={isConfigDialogOpen}
        onOpenChange={setIsConfigDialogOpen}
      />
    </div>
  );
};

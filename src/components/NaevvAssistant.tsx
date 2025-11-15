import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  id: string;
  text: string;
  sender: "user" | "naevv";
  timestamp: Date;
}

// Google Gemini API Configuration
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
// Available models: gemini-2.5-flash-lite (fastest), gemini-2.5-flash, gemini-2.5-pro, gemini-1.5-flash, gemini-1.5-pro
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash-lite";
const CUSTOM_API_ENDPOINT = import.meta.env.VITE_NAEVV_API_URL;

// Debug: Check if environment variables are loaded (remove in production)
if (typeof window !== 'undefined') {
  console.log('API_KEY loaded:', API_KEY ? 'YES (hidden)' : 'NO');
  console.log('GEMINI_MODEL:', GEMINI_MODEL);
  console.log('CUSTOM_API_ENDPOINT:', CUSTOM_API_ENDPOINT || 'Not set');
}

// Only construct Gemini endpoint if API key is available
const GEMINI_API_ENDPOINT = API_KEY 
  ? `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`
  : null;
const API_ENDPOINT = CUSTOM_API_ENDPOINT || GEMINI_API_ENDPOINT;

// Debug: Check final API endpoint
if (typeof window !== 'undefined') {
  console.log('API_ENDPOINT:', API_ENDPOINT ? 'Configured' : 'NOT CONFIGURED');
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages, isLoading]);

  const callNaevvAPI = async (userMessage: string): Promise<string> => {
    // Check if API endpoint is configured
    if (!API_ENDPOINT) {
      // No API configured - provide helpful fallback response
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes("quest") || lowerMessage.includes("recommend")) {
        return "I'd love to help you with quest recommendations! Based on your preferences, I suggest checking out the Weekly Quests section. You can find eco-friendly quests, in-flight activities, and achievement milestones. What type of quest interests you most?";
      } else if (lowerMessage.includes("point") || lowerMessage.includes("reward")) {
        return "Great question! You earn Cathay Points by completing quests. Each quest has different point rewards - Weekly quests typically give 10-30 points, while One-Time achievements can give up to 100 points. You can redeem your points in the Shop for vouchers and upgrades!";
      } else if (lowerMessage.includes("help") || lowerMessage.includes("how")) {
        return "I'm here to help! I can assist you with quest recommendations, explain how the points system works, guide you through the app features, and answer questions about Cathay Quest. What would you like to know?";
      } else {
        return "Thanks for your message! The AI assistant is currently not configured. Please set up the VITE_GOOGLE_API_KEY or VITE_NAEVV_API_URL environment variable to enable full functionality. For now, feel free to explore the Quests, Shop, and Events sections of the app!";
      }
    }

    try {
      // Build conversation context for Gemini API
      const conversationHistory = messages.slice(1).map((msg) => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      const requestBody = {
        contents: [
          ...conversationHistory,
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
        systemInstruction: {
          parts: [{ 
            text: `You are Cathay Pacific's AI Travel Concierge, an expert in helping customers plan and optimize their travel experiences while staying within their specified budget constraints.

PRIMARY ROLE
DO NOT GO OUT OF CATHAY PACIFIC OR OUR ASSISTANT'S AUTHORITY.
Your primary function is to assist users in creating comprehensive travel plans that maximize value while respecting their financial limitations. You specialize in finding the best flight options, accommodations, and travel experiences that align with Cathay Pacific's services and partner offerings.

CORE CAPABILITIES

- Budget Analysis: Carefully analyze the user's stated budget and provide realistic travel options within those constraints
- Flight Planning: Suggest optimal Cathay Pacific flight routes, timing, and fare classes that offer the best value
- Multi-destination Itineraries: Create efficient multi-city itineraries using Cathay Pacific's extensive route network
- Value Optimization: Identify cost-saving opportunities through strategic timing, package deals, and partner offers
- Experience Planning: Recommend activities, dining, and accommodations that match both budget and travel preferences

BUDGET PLANNING FRAMEWORK

When users provide a budget, you will:

1. Budget Breakdown Analysis:
   - Allocate percentages to flights, accommodation, activities, and contingencies
   - Suggest optimal spending distribution based on travel duration and destination
   - Identify areas where splurging vs. saving makes the most impact

2. Smart Cost Optimization:
   - Recommend best booking windows for flights
   - Suggest alternative airports or routes for cost savings
   - Identify Cathay Pacific partner hotels and services for bundled savings
   - Highlight seasonal promotions and Marco Polo member benefits

3. Tiered Budget Scenarios:
   - Provide multiple options at different price points within their budget
   - Show trade-offs between cost and experience quality
   - Suggest budget-stretching strategies for longer trips

STRICT FORMATTING RULES:
- USE markdown formatting (**bold**, *italic*, # headers, - bullets, etc.)
- Use asterisks, underscores, or special symbols for formatting
- Keep responses concise, friendly, and conversational` 
          }],
        },
      };

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.error?.message || errorData?.message || response.statusText;
        
        // Handle specific error cases
        if (errorMessage.includes("location is not supported") || errorMessage.includes("FAILED_PRECONDITION")) {
          throw new Error("GEO_RESTRICTION: Your API key has geographic restrictions. Please check your Google Cloud API key settings or use a VPN.");
        }
        
        throw new Error(`API error: ${response.status} - ${errorMessage}`);
      }

      const data = await response.json();
      
      // Extract response from Gemini API format
      let responseText = "";
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        responseText = data.candidates[0].content.parts[0].text;
      } else {
        responseText = data.response || data.message || "I apologize, but I couldn't process your request at this time.";
      }
      
      // Clean markdown formatting from response
      responseText = responseText
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
        .replace(/\*(.*?)\*/g, '$1') // Remove *italic*
        .replace(/#{1,6}\s+/g, '') // Remove headers
        .replace(/`(.*?)`/g, '$1') // Remove code backticks
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove markdown links
        .replace(/^\s*[-*+]\s+/gm, '') // Remove bullet points
        .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered lists
        .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
        .trim();
      
      return responseText;
    } catch (err) {
      // Handle geographic restriction errors
      if (err instanceof Error && err.message.includes("GEO_RESTRICTION")) {
        // Provide helpful fallback response for geo-restricted API
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes("quest") || lowerMessage.includes("recommend")) {
          return "I'd love to help you with quest recommendations! Based on your preferences, I suggest checking out the Weekly Quests section. You can find eco-friendly quests, in-flight activities, and achievement milestones. What type of quest interests you most?";
        } else if (lowerMessage.includes("point") || lowerMessage.includes("reward")) {
          return "Great question! You earn Cathay Points by completing quests. Each quest has different point rewards - Weekly quests typically give 10-30 points, while One-Time achievements can give up to 100 points. You can redeem your points in the Shop for vouchers and upgrades!";
        } else if (lowerMessage.includes("help") || lowerMessage.includes("how")) {
          return "I'm here to help! I can assist you with quest recommendations, explain how the points system works, guide you through the app features, and answer questions about Cathay Quest. What would you like to know?";
        } else {
          return "Thanks for your message! I'm here to help with quest recommendations, points information, and guide you through Cathay Quest. What would you like to know?";
        }
      }
      
      // If API is not available, provide a helpful fallback response
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        // API server is not running - provide a helpful response
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes("quest") || lowerMessage.includes("recommend")) {
          return "I'd love to help you with quest recommendations! Based on your preferences, I suggest checking out the Weekly Quests section. You can find eco-friendly quests, in-flight activities, and achievement milestones. What type of quest interests you most?";
        } else if (lowerMessage.includes("point") || lowerMessage.includes("reward")) {
          return "Great question! You earn Cathay Points by completing quests. Each quest has different point rewards - Weekly quests typically give 10-30 points, while One-Time achievements can give up to 100 points. You can redeem your points in the Shop for vouchers and upgrades!";
        } else if (lowerMessage.includes("help") || lowerMessage.includes("how")) {
          return "I'm here to help! I can assist you with quest recommendations, explain how the points system works, guide you through the app features, and answer questions about Cathay Quest. What would you like to know?";
        } else {
          return "Thanks for your message! I'm currently in development mode. Once the API is connected, I'll be able to provide more personalized assistance. For now, feel free to explore the Quests, Shop, and Events sections of the app!";
        }
      }
      throw err;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessageText = inputValue.trim();
    setInputValue("");
    setError(null);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the API
      const responseText = await callNaevvAPI(userMessageText);

      // Add Naevv response
      const naevvResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "naevv",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, naevvResponse]);
    } catch (err) {
      // Handle errors - fallback responses are already handled in callNaevvAPI
      // Only show error alert for unexpected errors (not geo-restriction or network errors)
      if (
        err instanceof Error && 
        !err.message.includes("GEO_RESTRICTION") &&
        !(err instanceof TypeError && err.message.includes("Failed to fetch"))
      ) {
        const errorMessage = err.message || "Failed to get response from Naevv";
        setError(errorMessage);

        // Add error message to chat for unexpected errors
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm sorry, I encountered an error. Please try again in a moment.",
          sender: "naevv",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorResponse]);
      }
      // For geo-restriction and network errors, the fallback response is already returned from callNaevvAPI
    } finally {
      setIsLoading(false);
    }
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
                  Ready to assist
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="px-4 pt-2">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

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
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-muted text-foreground rounded-bl-none">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Naevv is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background to-background/80">
        <Card className="p-3">
          <div className="flex gap-2">
            <Input
              placeholder="Ask Naevv anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </Card>
      </div>

    </div>
  );
};

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, Loader2, ShoppingBag, Calendar, Target } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuests } from "@/contexts/QuestContext";
import { shopItems, ShopItem } from "@/pages/Shop";

interface Message {
  id: string;
  text: string;
  sender: "user" | "naevv";
  timestamp: Date;
}

// OpenRouter API Configuration
// Vite only exposes variables prefixed with VITE_ to client-side code
// These must be set in .env file
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || "qwen/qwen2.5-vl-32b-instruct:free";
const OPENROUTER_API_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

if (!OPENROUTER_API_KEY) {
  console.error("VITE_OPENROUTER_API_KEY is not set in environment variables. Please create a .env file with your API key.");
}

// Configurable Intent Detection System
interface IntentPattern {
  id: string;
  keywords: string[];
  requiredMatches?: number;
  excludeKeywords?: string[];
  confidenceThreshold?: number;
  actionButton?: {
    icon: React.ComponentType<any>;
    label: string;
    navigateTo: string;
  };
}

interface DetectedIntent {
  type: 'shop' | 'quest' | 'event' | 'none';
  confidence: number;
  specificProduct?: ShopItem | null;
  metadata?: any;
}

// Easily configurable patterns - modify these without touching code logic
const INTENT_PATTERNS: Record<string, IntentPattern> = {
  shop: {
    id: 'shop',
    keywords: [
      'shop', 'buy', 'purchase', 'redeem', 'voucher', 'reward', 
      'points', 'item', 'product', 'cost', 'price', 'afford',
      'available in shop', 'what can i get', 'rewards shop',
      'exchange points', 'use my points', 'purchase with points'
    ],
    requiredMatches: 2,
    excludeKeywords: ['quest', 'event', 'activity'],
    confidenceThreshold: 0.5,
    actionButton: {
      icon: ShoppingBag,
      label: 'View Shop',
      navigateTo: '/shop'
    }
  },
  quest: {
    id: 'quest',
    keywords: [
      'quest', 'mission', 'task', 'challenge', 'achievement',
      'complete', 'accept', 'active quest', 'weekly quest',
      'progress', 'milestone', 'objective', 'goal',
      'recommend quest', 'find quest', 'available quest'
    ],
    requiredMatches: 2,
    excludeKeywords: ['shop', 'buy', 'event'],
    confidenceThreshold: 0.5,
    actionButton: {
      icon: Target,
      label: 'View Quests',
      navigateTo: '/'
    }
  },
  event: {
    id: 'event',
    keywords: [
      'event', 'activity', 'happening', 'schedule', 'calendar',
      'upcoming', 'join', 'participate', 'special event',
      'limited time', 'exclusive', 'current event',
      'what events', 'find events', 'event recommendation'
    ],
    requiredMatches: 2,
    excludeKeywords: ['shop', 'quest'],
    confidenceThreshold: 0.5,
    actionButton: {
      icon: Calendar,
      label: 'View Events',
      navigateTo: '/events'
    }
  }
};

// Enhanced product detection with fuzzy matching
const PRODUCT_SYNONYMS: Record<string, string[]> = {
  'snack-voucher': ['snack box', 'premium snack', 'snack voucher', 'snacks', 'food box', 'snack pack'],
  'wifi-pass': ['wifi pass', 'wifi', 'wi-fi pass', 'one hour wifi', 'internet', 'wifi access'],
  'wifi-full': ['full flight wifi', 'unlimited wifi', 'complete wifi', 'entire flight wifi'],
  'meal-voucher': ['meal voucher', 'complimentary meal', 'free meal', 'food voucher', 'dining voucher'],
  'priority-checkin': ['priority check', 'priority check-in', 'check-in', 'fast check-in'],
  'baggage-voucher': ['baggage', 'extra baggage', 'checked bag', 'luggage', 'baggage allowance'],
  'asia-miles-500': ['500 miles', '500 asia miles', 'five hundred miles'],
  'asia-miles-1000': ['1000 miles', '1,000 miles', '1000 asia miles', 'thousand miles'],
  'seat-selection': ['seat selection', 'preferred seat', 'choose seat', 'seat choice', 'select seat'],
  'lounge-pass': ['lounge pass', 'lounge day pass', 'lounge access', 'airport lounge'],
  'upgrade-voucher': ['upgrade voucher', 'upgrade', 'premium economy', 'economy upgrade', 'class upgrade']
};

export const NaevvAssistant = () => {
  const navigate = useNavigate();
  
  const { 
    cathayPoints, 
    acceptedQuests, 
    ownedVouchers, 
    userPreferences 
  } = useQuests();

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

  // Flexible intent detection using configurable patterns
  const detectIntent = (
    naevvResponse: string, 
    userQuestion?: string
  ): DetectedIntent => {
    const combinedText = `${userQuestion || ''} ${naevvResponse}`.toLowerCase();
    
    let bestIntent: DetectedIntent = { type: 'none', confidence: 0 };
    const words = combinedText.split(/\s+/);

    // Check each intent pattern
    Object.entries(INTENT_PATTERNS).forEach(([intentType, pattern]) => {
      let matches = 0;
      
      // Count keyword matches
      pattern.keywords.forEach(keyword => {
        if (combinedText.includes(keyword)) {
          matches++;
        }
      });
      
      // Check for exclusion (negative matches)
      let exclusions = 0;
      pattern.excludeKeywords?.forEach(excludeWord => {
        if (combinedText.includes(excludeWord)) {
          exclusions++;
        }
      });
      
      // Calculate confidence score
      let confidence = matches / Math.max(pattern.keywords.length, 1);
      
      // Penalize for exclusion matches
      if (exclusions > 0) {
        confidence *= 0.3;
      }
      
      // Boost confidence if we meet required matches
      if (matches >= (pattern.requiredMatches || 1)) {
        confidence *= 1.5;
      }
      
      // Normalize confidence
      confidence = Math.min(confidence, 1);
      
      // Update best intent if this one is better
      if (confidence > bestIntent.confidence && confidence >= (pattern.confidenceThreshold || 0.3)) {
        bestIntent = {
          type: intentType as 'shop' | 'quest' | 'event',
          confidence,
          specificProduct: intentType === 'shop' ? findMentionedProduct(combinedText) : null
        };
      }
    });

    return bestIntent;
  };

  // Enhanced product detection with fuzzy matching
  const findMentionedProduct = (text: string): ShopItem | null => {
    const lowerText = text.toLowerCase();
    
    // First, try exact product name matches
    for (const item of shopItems) {
      const itemNameLower = item.name.toLowerCase();
      if (lowerText.includes(itemNameLower)) {
        return item;
      }
    }
    
    // Then try synonym matching
    for (const item of shopItems) {
      const synonyms = PRODUCT_SYNONYMS[item.id] || [];
      const foundSynonym = synonyms.some(synonym => lowerText.includes(synonym.toLowerCase()));
      
      if (foundSynonym) {
        return item;
      }
    }
    
    // Finally, try partial word matching for longer product names
    for (const item of shopItems) {
      const nameWords = item.name.toLowerCase().split(' ').filter(word => word.length > 3);
      const wordMatches = nameWords.filter(word => lowerText.includes(word));
      
      // If majority of important words match, consider it a match
      if (wordMatches.length >= Math.max(1, nameWords.length / 2)) {
        return item;
      }
    }
    
    return null;
  };

  // Function to build user context information for the LLM
  const getUserContext = (): string => {
    const contextParts: string[] = [];

    // User Stats
    contextParts.push(`USER STATISTICS:`);
    contextParts.push(`- Current Cathay Points Balance: ${cathayPoints.toLocaleString()} points`);
    contextParts.push(`- Active Quests: ${acceptedQuests.length} quest(s) in progress`);
    contextParts.push(`- Owned Vouchers: ${ownedVouchers.length} voucher(s) redeemed`);

    // Active Quests Details
    if (acceptedQuests.length > 0) {
      contextParts.push(`\nACTIVE QUESTS:`);
      acceptedQuests.forEach((quest, index) => {
        contextParts.push(`${index + 1}. ${quest.title} - ${quest.description} (Reward: ${quest.reward} points, Type: ${quest.type})`);
      });
    }

    // Owned Vouchers Details
    if (ownedVouchers.length > 0) {
      contextParts.push(`\nOWNED VOUCHERS:`);
      ownedVouchers.forEach((voucher, index) => {
        const redeemedDate = new Date(voucher.redeemedAt).toLocaleDateString();
        contextParts.push(`${index + 1}. ${voucher.name} - ${voucher.description} (Redeemed: ${redeemedDate}, Availability: ${voucher.availability})`);
      });
    }

    // User Preferences
    if (Object.keys(userPreferences).length > 0) {
      contextParts.push(`\nUSER PREFERENCES:`);
      if (userPreferences.travel) contextParts.push(`- Travel Style: ${userPreferences.travel}`);
      if (userPreferences.sustainability) contextParts.push(`- Sustainability Interest: ${userPreferences.sustainability}`);
      if (userPreferences.activities) contextParts.push(`- Preferred Activities: ${userPreferences.activities}`);
      if (userPreferences.frequency) contextParts.push(`- Travel Frequency: ${userPreferences.frequency}`);
    }

    // Available Shop Items
    contextParts.push(`\nAVAILABLE SHOP ITEMS (Rewards Shop):`);
    const affordableItems = shopItems.filter(item => cathayPoints >= item.points);
    const unaffordableItems = shopItems.filter(item => cathayPoints < item.points);
    
    if (affordableItems.length > 0) {
      contextParts.push(`\nAFFORDABLE ITEMS (User can redeem with current points):`);
      affordableItems.forEach((item, index) => {
        contextParts.push(`${index + 1}. ${item.name} - ${item.description} (Cost: ${item.points} points, Category: ${item.category}, Availability: ${item.availability})`);
      });
    }

    if (unaffordableItems.length > 0) {
      contextParts.push(`\nITEMS REQUIRING MORE POINTS:`);
      unaffordableItems.forEach((item, index) => {
        const pointsNeeded = item.points - cathayPoints;
        contextParts.push(`${index + 1}. ${item.name} - ${item.description} (Cost: ${item.points} points, Need ${pointsNeeded} more points, Category: ${item.category})`);
      });
    }

    return contextParts.join('\n');
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages, isLoading]);

  const callNaevvAPI = async (userMessage: string): Promise<string> => {
    if (!OPENROUTER_API_KEY) {
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes("quest") || lowerMessage.includes("recommend")) {
        return "I'd love to help you with quest recommendations! Based on your preferences, I suggest checking out the Weekly Quests section. You can find eco-friendly quests, in-flight activities, and achievement milestones. What type of quest interests you most?";
      } else if (lowerMessage.includes("point") || lowerMessage.includes("reward")) {
        return "Great question! You earn Cathay Points by completing quests. Each quest has different point rewards - Weekly quests typically give 10-30 points, while One-Time achievements can give up to 100 points. You can redeem your points in the Shop for vouchers and upgrades!";
      } else if (lowerMessage.includes("help") || lowerMessage.includes("how")) {
        return "I'm here to help! I can assist you with quest recommendations, explain how the points system works, guide you through the app features, and answer questions about Cathay Quest. What would you like to know?";
      } else {
        return "Thanks for your message! The AI assistant is currently not configured. Please set up the OpenRouter API key to enable full functionality. For now, feel free to explore the Quests, Shop, and Events sections of the app!";
      }
    }

    try {
      // Build conversation history in OpenRouter format
      const conversationHistory = messages.slice(1).map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      const requestBody = {
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content: `You are Cathay Pacific's AI Travel Concierge, an expert in helping customers plan and optimize their travel experiences while staying within their specified budget constraints.

PRIMARY ROLE
DO NOT GO OUT OF CATHAY PACIFIC OR OUR ASSISTANT'S AUTHORITY.
Your primary function is to assist users in creating comprehensive travel plans that maximize value while respecting their financial limitations. You specialize in finding the best flight options, accommodations, and travel experiences that align with Cathay Pacific's services and partner offerings.

CRITICAL DATA ACCESS INSTRUCTIONS:
You have REAL-TIME access to the user's current statistics, active quests, owned vouchers, user preferences, and available shop items. This data is provided above in the USER STATISTICS, ACTIVE QUESTS, OWNED VOUCHERS, USER PREFERENCES, and AVAILABLE SHOP ITEMS sections.

MANDATORY DATA USAGE RULES:
1. ALWAYS search and reference the exact information from the context above when answering ANY user question
2. When users ask about their points balance: You MUST reference the exact current balance from USER STATISTICS (e.g., "You currently have X points")
3. When users ask about their quests: You MUST reference the specific active quests listed in ACTIVE QUESTS section, including quest titles, descriptions, rewards, and types
4. When users ask about their vouchers: You MUST reference the specific vouchers listed in OWNED VOUCHERS section, including names, descriptions, and redemption dates
5. When users ask about shop items or rewards: You MUST reference the specific items from AVAILABLE SHOP ITEMS, clearly stating which items they can afford with their current points and which require more points
6. When providing recommendations: You MUST use their user preferences, active quests, and available points to provide personalized suggestions
7. When users ask "what can I buy" or "what rewards are available": You MUST list items from AVAILABLE SHOP ITEMS, categorizing them by affordable vs. unaffordable based on their current points balance

NEVER make up, guess, or estimate user data. ALWAYS use the exact information provided in the context above. If the context shows "0 active quests", say "0 active quests", not "you have some quests". If the context shows specific point amounts, use those exact amounts.

CORE CAPABILITIES
- Budget Analysis: Carefully analyze the user's stated budget and provide realistic travel options within those constraints
- Flight Planning: Suggest optimal Cathay Pacific flight routes, timing, and fare classes that offer the best value
- Multi-destination Itineraries: Create efficient multi-city itineraries using Cathay Pacific's extensive route network
- Value Optimization: Identify cost-saving opportunities through strategic timing, package deals, and partner offers
- Experience Planning: Recommend activities, dining, and accommodations that match both budget and travel preferences

RESPONSE FORMAT:
- Keep responses concise, friendly, and conversational
- Use natural line breaks and paragraphs for readability
- Feel free to use emojis to make the response more engaging and friendly
- Provide clear, actionable advice

USER CONTEXT:
${getUserContext()}

Please provide a helpful, accurate, and friendly response to the user's latest message based on the above context.`
          },
          ...conversationHistory,
          {
            role: "user",
            content: userMessage,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      };

      const response = await fetch(OPENROUTER_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Cathay Quest",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.error?.message || errorData?.message || response.statusText;
        throw new Error(`OpenRouter API error: ${response.status} - ${errorMessage}`);
      }

      const data = await response.json();
      
      let responseText = "";
      if (data.choices && data.choices[0] && data.choices[0].message) {
        responseText = data.choices[0].message.content;
      } else {
        responseText = "I apologize, but I couldn't process your request at this time.";
      }
      
      // Clean up response while preserving line breaks
      responseText = responseText
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/\n{4,}/g, '\n\n\n')
        .trim();
      
      return responseText;
    } catch (err) {
      // Fallback responses for API errors
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes("quest") || lowerMessage.includes("recommend")) {
        return "I'd love to help you with quest recommendations! Based on your preferences, I suggest checking out the Weekly Quests section. You can find eco-friendly quests, in-flight activities, and achievement milestones. What type of quest interests you most?";
      } else if (lowerMessage.includes("point") || lowerMessage.includes("reward")) {
        return "Great question! You earn Cathay Points by completing quests. Each quest has different point rewards - Weekly quests typically give 10-30 points, while One-Time achievements can give up to 100 points. You can redeem your points in the Shop for vouchers and upgrades!";
      } else if (lowerMessage.includes("help") || lowerMessage.includes("how")) {
        return "I'm here to help! I can assist you with quest recommendations, explain how the points system works, guide you through the app features, and answer questions about Cathay Quest. What would you like to know?";
      } else {
        return "Thanks for your message! I'm currently experiencing some technical difficulties. Please try again in a moment, or feel free to explore the Quests, Shop, and Events sections of the app!";
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessageText = inputValue.trim();
    setInputValue("");
    setError(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const responseText = await callNaevvAPI(userMessageText);

      const naevvResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "naevv",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, naevvResponse]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get response from Naevv";
      setError(errorMessage);

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error. Please try again in a moment.",
        sender: "naevv",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
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
          {messages.map((message, index) => {
            const userQuestion = message.sender === "naevv" && index > 0
              ? messages[index - 1]?.sender === "user" ? messages[index - 1].text : undefined
              : undefined;
            
            // Use the flexible intent detection
            const detectedIntent = message.sender === "naevv" 
              ? detectIntent(message.text, userQuestion)
              : { type: 'none' as const, confidence: 0 };
            
            return (
              <div key={message.id}>
                <div
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
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                {message.sender === "naevv" && detectedIntent.type !== 'none' && (
                  <div className="flex justify-start mt-2 mb-2 gap-2 flex-wrap">
                    {/* Specific product button */}
                    {detectedIntent.specificProduct && (
                      <Button
                        onClick={() => navigate(`/shop?highlight=${detectedIntent.specificProduct!.id}`)}
                        variant="default"
                        size="sm"
                        className="gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        View {detectedIntent.specificProduct.name}
                      </Button>
                    )}
                    
                    {/* General intent button */}
                    {!detectedIntent.specificProduct && INTENT_PATTERNS[detectedIntent.type]?.actionButton && (
                      <Button
                        onClick={() => navigate(INTENT_PATTERNS[detectedIntent.type].actionButton!.navigateTo)}
                        variant="default"
                        size="sm"
                        className="gap-2"
                      >
                        {(() => {
                          const IconComponent = INTENT_PATTERNS[detectedIntent.type].actionButton!.icon;
                          return <IconComponent className="w-4 h-4" />;
                        })()}
                        {INTENT_PATTERNS[detectedIntent.type].actionButton!.label}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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
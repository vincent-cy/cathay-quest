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

// Google Gemini API Configuration
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
// Available models: gemini-2.5-flash-lite (fastest), gemini-2.5-flash, gemini-2.5-pro, gemini-1.5-flash, gemini-1.5-pro
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash-lite";
const CUSTOM_API_ENDPOINT = import.meta.env.VITE_NAEVV_API_URL;

// Only construct Gemini endpoint if API key is available
const GEMINI_API_ENDPOINT = API_KEY 
  ? `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`
  : null;
const API_ENDPOINT = CUSTOM_API_ENDPOINT || GEMINI_API_ENDPOINT;

export const NaevvAssistant = () => {
  const navigate = useNavigate();
  
  // Get user data from QuestContext
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

  // Function to find a specific product mentioned in the conversation
  const findMentionedProduct = (text: string): ShopItem | null => {
    const lowerText = text.toLowerCase();
    
    // Match product names (case-insensitive, partial matches)
    for (const item of shopItems) {
      const itemNameLower = item.name.toLowerCase();
      // Check for exact product name matches or key words from product name
      if (lowerText.includes(itemNameLower)) {
        return item;
      }
      
      // Also check for common aliases/variations
      const nameWords = itemNameLower.split(' ');
      if (nameWords.length > 1) {
        // Check if multiple words from product name appear
        const wordMatches = nameWords.filter(word => 
          word.length > 3 && lowerText.includes(word)
        );
        if (wordMatches.length >= 2) {
          return item;
        }
      }
      
      // Check for specific keywords that match products
      const keywords: { [key: string]: string[] } = {
        'snack-voucher': ['snack box', 'premium snack', 'snack voucher'],
        'wifi-pass': ['wifi pass', 'wifi', 'wi-fi pass', 'one hour wifi'],
        'wifi-full': ['full flight wifi', 'unlimited wifi', 'complete wifi'],
        'meal-voucher': ['meal voucher', 'complimentary meal', 'free meal'],
        'priority-checkin': ['priority check', 'priority check-in', 'check-in'],
        'baggage-voucher': ['baggage', 'extra baggage', 'checked bag', 'luggage'],
        'asia-miles-500': ['500 miles', '500 asia miles'],
        'asia-miles-1000': ['1000 miles', '1,000 miles', '1000 asia miles'],
        'seat-selection': ['seat selection', 'preferred seat', 'choose seat', 'seat choice'],
        'lounge-pass': ['lounge pass', 'lounge day pass', 'lounge access'],
        'upgrade-voucher': ['upgrade voucher', 'upgrade', 'premium economy', 'economy upgrade']
      };
      
      if (keywords[item.id]) {
        const foundKeyword = keywords[item.id].some(keyword => lowerText.includes(keyword));
        if (foundKeyword) {
          return item;
        }
      }
    }
    
    return null;
  };

  // Function to detect if the conversation is about shop products
  const isShopRelated = (naevvResponse: string, userQuestion?: string): ShopItem | null => {
    const lowerResponse = naevvResponse.toLowerCase();
    const lowerQuestion = userQuestion?.toLowerCase() || '';
    const combinedText = `${lowerQuestion} ${lowerResponse}`;
    
    // First check if a specific product is mentioned
    const mentionedProduct = findMentionedProduct(combinedText);
    if (mentionedProduct) {
      return mentionedProduct;
    }
    
    // Strong shop intent indicators - these phrases suggest clear shop interest
    const strongShopPatterns = [
      'reward shop', 'rewards shop', 'visit the shop', 'go to the shop',
      'what can i buy', 'what can you buy', 'what items', 'what products',
      'redeem points', 'redeem your points', 'use your points',
      'shop items', 'available shop', 'affordable items', 'can redeem',
      'available in the shop', 'check out the shop', 'browse the shop',
      'shop for', 'buy with points', 'purchase with points'
    ];
    
    // Check for strong shop intent in either user question or response
    const hasStrongIntent = strongShopPatterns.some(pattern => 
      lowerQuestion.includes(pattern) || lowerResponse.includes(pattern)
    );
    
    if (hasStrongIntent) {
      return null; // Shop related but no specific product
    }
    
    // Multiple keywords suggesting shop context (need at least 2)
    const shopKeywords = ['shop', 'product', 'item', 'buy', 'purchase', 'redeem', 'voucher'];
    const keywordCount = shopKeywords.filter(keyword => 
      lowerResponse.includes(keyword) || lowerQuestion.includes(keyword)
    ).length;
    
    // Only show if multiple keywords AND the response actually mentions shop/redeem/buy context
    const mentionsShopAction = lowerResponse.includes('shop') || 
                               lowerResponse.includes('redeem') ||
                               lowerResponse.includes('buy') ||
                               lowerResponse.includes('purchase');
    
    if (keywordCount >= 2 && mentionsShopAction) {
      return null; // Shop related but no specific product
    }
    
    return null; // Not shop related
  };

  // Function to detect if the conversation is about quests
  const isQuestRelated = (naevvResponse: string, userQuestion?: string): boolean => {
    const lowerResponse = naevvResponse.toLowerCase();
    const lowerQuestion = userQuestion?.toLowerCase() || '';
    
    // Strong quest intent indicators
    const strongQuestPatterns = [
      'quest', 'quests', 'available quest', 'active quest', 'weekly quest',
      'recommend quest', 'quest recommendation', 'what quest', 'new quest',
      'complete quest', 'accept quest', 'find quest', 'discover quest',
      'quest section', 'quest page', 'go to quest', 'check quest',
      'achievement', 'milestone', 'challenge'
    ];
    
    // Check for strong quest intent in either user question or response
    const hasStrongIntent = strongQuestPatterns.some(pattern => 
      lowerQuestion.includes(pattern) || lowerResponse.includes(pattern)
    );
    
    if (hasStrongIntent) return true;
    
    // Multiple keywords suggesting quest context (need at least 2)
    const questKeywords = ['quest', 'challenge', 'task', 'mission', 'achievement', 'milestone', 'complete'];
    const keywordCount = questKeywords.filter(keyword => 
      lowerResponse.includes(keyword) || lowerQuestion.includes(keyword)
    ).length;
    
    // Only show if multiple keywords AND the response actually mentions quest context
    const mentionsQuestAction = lowerResponse.includes('quest') || 
                               lowerResponse.includes('challenge') ||
                               lowerResponse.includes('achievement') ||
                               lowerResponse.includes('complete');
    
    return keywordCount >= 2 && mentionsQuestAction;
  };

  // Function to detect if the conversation is about events
  const isEventRelated = (naevvResponse: string, userQuestion?: string): boolean => {
    const lowerResponse = naevvResponse.toLowerCase();
    const lowerQuestion = userQuestion?.toLowerCase() || '';
    
    // Strong event intent indicators
    const strongEventPatterns = [
      'event', 'events', 'upcoming event', 'available event', 'current event',
      'what event', 'new event', 'join event', 'participate event',
      'event section', 'event page', 'go to event', 'check event',
      'special event', 'exclusive event', 'limited event', 'find event',
      'discover event', 'event calendar', 'event schedule'
    ];
    
    // Check for strong event intent in either user question or response
    const hasStrongIntent = strongEventPatterns.some(pattern => 
      lowerQuestion.includes(pattern) || lowerResponse.includes(pattern)
    );
    
    if (hasStrongIntent) return true;
    
    // Multiple keywords suggesting event context (need at least 2)
    const eventKeywords = ['event', 'events', 'activity', 'activities', 'happening', 'schedule', 'calendar'];
    const keywordCount = eventKeywords.filter(keyword => 
      lowerResponse.includes(keyword) || lowerQuestion.includes(keyword)
    ).length;
    
    // Only show if multiple keywords AND the response actually mentions event context
    const mentionsEventAction = lowerResponse.includes('event') || 
                               lowerResponse.includes('activity') ||
                               lowerResponse.includes('happening') ||
                               lowerResponse.includes('schedule');
    
    return keywordCount >= 2 && mentionsEventAction;
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
- Keep responses concise, friendly, and conversational
- If you want to give a bullet point list, use the following format:
  - Bullet point 1
  - Bullet point 2
  - Bullet point 3
  - ...
- Don't be shy to add emojis to make the response more engaging and friendly.

This is the user input:
${getUserContext()}

Please provide a helpful, accurate, and friendly response to the user's latest message based on the above context.
`
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
          {messages.map((message, index) => {
            // Find the corresponding user question for this Naevv response
            const userQuestion = message.sender === "naevv" && index > 0
              ? messages[index - 1]?.sender === "user" ? messages[index - 1].text : undefined
              : undefined;
            
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
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                {message.sender === "naevv" && (
                  <div className="flex justify-start mt-2 mb-2 gap-2 flex-wrap">
                    {(() => {
                      const shopProduct = isShopRelated(message.text, userQuestion);
                      if (shopProduct) {
                        return (
                          <Button
                            onClick={() => navigate(`/shop?highlight=${shopProduct.id}`)}
                            variant="default"
                            size="sm"
                            className="gap-2"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            View {shopProduct.name}
                          </Button>
                        );
                      }
                      return null;
                    })()}
                    {isQuestRelated(message.text, userQuestion) && (
                      <Button
                        onClick={() => navigate("/")}
                        variant="default"
                        size="sm"
                        className="gap-2"
                      >
                        <Target className="w-4 h-4" />
                        View Quests
                      </Button>
                    )}
                    {isEventRelated(message.text, userQuestion) && (
                      <Button
                        onClick={() => navigate("/events")}
                        variant="default"
                        size="sm"
                        className="gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        View Events
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

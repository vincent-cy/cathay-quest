import { Home, Calendar, Trophy, Users, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useFlightMode } from "@/contexts/FlightModeContext";

const navItems = [
  { icon: Home, label: "Home", path: "/", flightModeEnabled: true },
  { icon: Calendar, label: "Quests", path: "/quests", flightModeEnabled: true },
  { icon: User, label: "Profile", path: "/profile", isCenter: true, flightModeEnabled: true },
  { icon: Trophy, label: "Events", path: "/events", flightModeEnabled: false },
  { icon: Users, label: "Leaderboard", path: "/leaderboard", flightModeEnabled: false },
];

export const BottomNav = () => {
  const location = useLocation();
  const { isInFlight } = useFlightMode();
  
  const visibleItems = isInFlight 
    ? navItems.filter(item => item.flightModeEnabled)
    : navItems;

  return (
    <nav className={`fixed bottom-0 left-0 right-0 border-t z-50 safe-area-inset-bottom transition-all ${
      isInFlight 
        ? "bg-primary/10 border-primary/30 backdrop-blur-md" 
        : "bg-card border-border"
    }`}>
      <div className="flex items-center justify-around h-16 px-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                item.isCenter ? "relative -mt-8" : ""
              }`}
            >
              {item.isCenter ? (
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-elevated ${
                  isActive 
                    ? (isInFlight ? "bg-primary animate-pulse" : "bg-primary")
                    : (isInFlight ? "bg-primary/60" : "bg-accent")
                }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              ) : (
                <>
                  <Icon className={`w-5 h-5 mb-1 ${
                    isActive 
                      ? (isInFlight ? "text-primary" : "text-primary")
                      : (isInFlight ? "text-primary/60" : "text-muted-foreground")
                  }`} />
                  <span className={`text-xs ${
                    isActive 
                      ? (isInFlight ? "text-primary font-bold" : "text-primary font-medium")
                      : (isInFlight ? "text-primary/60" : "text-muted-foreground")
                  }`}>
                    {item.label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

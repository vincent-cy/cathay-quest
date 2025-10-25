import { Home, Calendar, Trophy, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Calendar, label: "Quests", path: "/" },
  { icon: Trophy, label: "Events", path: "/events" },
  { icon: Home, label: "Home", path: "/home", isCenter: true },
  { icon: Users, label: "Leaderboard", path: "/leaderboard" },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
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
                  isActive ? "bg-primary" : "bg-accent"
                }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              ) : (
                <>
                  <Icon className={`w-5 h-5 mb-1 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-xs ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}>
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

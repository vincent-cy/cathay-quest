import { Home, Target, Trophy, Users, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: Target, label: "Quests", path: "/", isCenter: true },
  { icon: Trophy, label: "Events", path: "/events" },
  { icon: Home, label: "Home", path: "/home" },
  { icon: ShoppingBag, label: "Shop", path: "/shop" },
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
                  isActive ? "bg-primary scale-110 animate-in zoom-in-105 duration-300" : "bg-accent"
                }`}>
                  <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
              ) : (
                <>
                  <Icon className={`mb-1 ${
                    isActive ? "w-7 h-7 text-primary scale-110 animate-in zoom-in-105 duration-300" : "w-6 h-6 text-muted-foreground"
                  }`} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-xs ${
                    isActive ? "text-primary font-bold animate-in fade-in duration-300" : "text-muted-foreground"
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

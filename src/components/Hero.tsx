import { Button } from "@/components/ui/button";
import { Plane, Target, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-flight.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Airplane in flight"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      </div>

      {/* Animated Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 animate-float">
          <Sparkles className="w-8 h-8 text-accent opacity-30" />
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: "1s" }}>
          <Target className="w-6 h-6 text-accent opacity-30" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: "2s" }}>
          <Plane className="w-10 h-10 text-primary-foreground opacity-20" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center space-y-8 animate-slide-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-primary-foreground">
            Powered by Cathay Pacific Asia Miles
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground tracking-tight">
          Earn Asia Miles
          <br />
          <span className="text-accent">by doing, not just buying</span>
        </h1>

        <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
          Turn everyday actions into verified miles. Complete quests on-ground and in-flight
          with instant, auditable rewards.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button size="lg" variant="hero" className="text-lg px-8 py-6 shadow-glow">
            Start Your First Quest
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
            Learn More
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12">
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-accent">2M+</div>
            <div className="text-sm text-primary-foreground/80">Quests Completed</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-accent">500K+</div>
            <div className="text-sm text-primary-foreground/80">Active Users</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl md:text-4xl font-bold text-accent">50M+</div>
            <div className="text-sm text-primary-foreground/80">Miles Earned</div>
          </div>
        </div>
      </div>
    </section>
  );
};

import { Card } from "@/components/ui/card";
import { ShieldCheck, Camera, Smartphone, MapPin as MapPinIcon } from "lucide-react";
import ecoIcon from "@/assets/eco-icon.png";

const verificationMethods = [
  {
    icon: Smartphone,
    title: "Paperless Check-In",
    description: "Automatic verification via partner API and device attestation",
    reward: "+50 miles",
    cooldown: "24h cooldown",
  },
  {
    icon: Camera,
    title: "Photo Verification",
    description: "Selfie liveness check with geofence for on-ground activities",
    reward: "+20 miles",
    cooldown: "Daily cap: 200 miles",
  },
  {
    icon: ShieldCheck,
    title: "Quiz Verification",
    description: "Proof-of-work with pass thresholds and anti-replay protection",
    reward: "Variable",
    cooldown: "Per mission",
  },
  {
    icon: MapPinIcon,
    title: "Location Verification",
    description: "Geofence radius matching for partner locations and venues",
    reward: "+15 miles",
    cooldown: "Per location",
  },
];

export const Verification = () => {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center space-y-3 md:space-y-4 mb-12 md:mb-16 px-4">
          <div className="flex justify-center mb-3 md:mb-4">
            <div className="relative">
              <img src={ecoIcon} alt="Eco Icon" className="w-12 h-12 md:w-16 md:h-16" />
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Verified <span className="text-primary">& Secure</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Every quest is verified through multiple security layers to ensure fair play and prevent fraud.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {verificationMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <Card
                key={index}
                className="p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-bold text-foreground">{method.title}</h3>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-semibold text-accent">{method.reward}</span>
                      <span className="text-xs text-muted-foreground">{method.cooldown}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 md:mt-12 p-4 md:p-6 rounded-lg bg-card shadow-card max-w-2xl mx-auto">
          <div className="flex items-start gap-3 md:gap-4">
            <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-primary flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="text-base md:text-lg font-bold text-foreground">Fraud Prevention</h3>
              <p className="text-sm text-muted-foreground">
                Our system employs device attestation, replay protection, anomaly scoring, and liveness
                checks to maintain a fair environment. Suspicious activity is flagged for review, and
                fraudulent miles can be revoked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

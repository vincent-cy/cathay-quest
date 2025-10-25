import { BottomNav } from "@/components/BottomNav";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">Your profile settings</p>
      </header>

      <div className="p-4">
        <p className="text-center text-muted-foreground mt-8">
          Profile settings coming soon...
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;

import { BottomNav } from "@/components/BottomNav";
import { NaevvAssistant } from "@/components/NaevvAssistant";
import { NaevvProvider } from "@/contexts/NaevvContext";

const NaevvPage = () => {
  return (
    <NaevvProvider>
      <div className="min-h-screen bg-background pb-20">
        <NaevvAssistant />
        <BottomNav />
      </div>
    </NaevvProvider>
  );
};

export default NaevvPage;

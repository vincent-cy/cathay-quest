import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: string;
  timeLeft: string;
  location?: string;
  image: string;
}

interface QuestContextType {
  acceptedQuests: Quest[];
  addAcceptedQuest: (quest: Quest) => void;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export const QuestProvider = ({ children }: { children: ReactNode }) => {
  const [acceptedQuests, setAcceptedQuests] = useState<Quest[]>(() => {
    const stored = localStorage.getItem("acceptedQuests");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("acceptedQuests", JSON.stringify(acceptedQuests));
  }, [acceptedQuests]);

  const addAcceptedQuest = (quest: Quest) => {
    setAcceptedQuests((prev) => {
      // Check if quest already exists
      if (prev.some((q) => q.id === quest.id)) {
        return prev;
      }
      return [...prev, quest];
    });
  };

  return (
    <QuestContext.Provider value={{ acceptedQuests, addAcceptedQuest }}>
      {children}
    </QuestContext.Provider>
  );
};

export const useQuests = () => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error("useQuests must be used within QuestProvider");
  }
  return context;
};

import { createContext, useContext, useState, ReactNode } from "react";

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

interface Voucher {
  id: string;
  name: string;
  description: string;
  availability: string;
  icon: string;
  redeemedAt: Date;
}

interface QuestContextType {
  acceptedQuests: Quest[];
  addAcceptedQuest: (quest: Quest) => void;
  cathayPoints: number;
  setCathayPoints: (points: number) => void;
  addCathayPoints: (points: number) => void;
  deductCathayPoints: (points: number) => boolean;
  ownedVouchers: Voucher[];
  addVoucher: (voucher: Voucher) => void;
  removeVoucher: (voucherId: string) => void;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export const QuestProvider = ({ children }: { children: ReactNode }) => {
  const [acceptedQuests, setAcceptedQuests] = useState<Quest[]>([]);
  const [cathayPoints, setCathayPoints] = useState(2750);
  const [ownedVouchers, setOwnedVouchers] = useState<Voucher[]>([]);

  const addAcceptedQuest = (quest: Quest) => {
    setAcceptedQuests((prev) => {
      // Check if quest already exists
      if (prev.some((q) => q.id === quest.id)) {
        return prev;
      }
      return [...prev, quest];
    });
  };

  const addCathayPoints = (points: number) => {
    setCathayPoints((prev) => prev + points);
  };

  const deductCathayPoints = (points: number): boolean => {
    if (cathayPoints >= points) {
      setCathayPoints((prev) => prev - points);
      return true;
    }
    return false;
  };

  const addVoucher = (voucher: Voucher) => {
    setOwnedVouchers((prev) => [...prev, voucher]);
  };

  const removeVoucher = (voucherId: string) => {
    setOwnedVouchers((prev) => prev.filter((v) => v.id !== voucherId));
  };

  return (
    <QuestContext.Provider 
      value={{ 
        acceptedQuests, 
        addAcceptedQuest,
        cathayPoints,
        setCathayPoints,
        addCathayPoints,
        deductCathayPoints,
        ownedVouchers,
        addVoucher,
        removeVoucher
      }}
    >
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

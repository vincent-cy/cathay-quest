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

interface UserPreferences {
  travel?: string;
  sustainability?: string;
  activities?: string;
  frequency?: string;
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
  userPreferences: UserPreferences;
  setUserPreferences: (preferences: UserPreferences) => void;
  hasCompletedSurvey: boolean;
  setHasCompletedSurvey: (completed: boolean) => void;
  resetCount: number;
  incrementResetCount: () => void;
  resetResetCount: () => void;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export const QuestProvider = ({ children }: { children: ReactNode }) => {
  const [acceptedQuests, setAcceptedQuests] = useState<Quest[]>([]);
  const [cathayPoints, setCathayPoints] = useState(2750);
  const [ownedVouchers, setOwnedVouchers] = useState<Voucher[]>([]);
  
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : {};
  });

  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(() => {
    const saved = localStorage.getItem('hasCompletedSurvey');
    return saved ? JSON.parse(saved) : false;
  });

  const [resetCount, setResetCount] = useState(() => {
    const saved = localStorage.getItem('resetCount');
    return saved ? JSON.parse(saved) : 0;
  });

  const addAcceptedQuest = (quest: Quest) => {
    setAcceptedQuests((prev) => {
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

  const handleSetUserPreferences = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  };

  const handleSetHasCompletedSurvey = (completed: boolean) => {
    setHasCompletedSurvey(completed);
    localStorage.setItem('hasCompletedSurvey', JSON.stringify(completed));
  };

  const incrementResetCount = () => {
    const newCount = resetCount + 1;
    setResetCount(newCount);
    localStorage.setItem('resetCount', JSON.stringify(newCount));
    
    // After 5 resets, show survey again
    if (newCount >= 5) {
      setHasCompletedSurvey(false);
      localStorage.setItem('hasCompletedSurvey', JSON.stringify(false));
      resetResetCount();
    }
  };

  const resetResetCount = () => {
    setResetCount(0);
    localStorage.setItem('resetCount', JSON.stringify(0));
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
        removeVoucher,
        userPreferences,
        setUserPreferences: handleSetUserPreferences,
        hasCompletedSurvey,
        setHasCompletedSurvey: handleSetHasCompletedSurvey,
        resetCount,
        incrementResetCount,
        resetResetCount,
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

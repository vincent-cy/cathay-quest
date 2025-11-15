import { createContext, useContext } from "react";

interface NaevvContextType {
  // Context kept for future extensibility
}

const NaevvContext = createContext<NaevvContextType | undefined>(undefined);

export const NaevvProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NaevvContext.Provider value={{}}>
      {children}
    </NaevvContext.Provider>
  );
};

export const useNaevv = () => {
  const context = useContext(NaevvContext);
  if (!context) {
    throw new Error("useNaevv must be used within NaevvProvider");
  }
  return context;
};

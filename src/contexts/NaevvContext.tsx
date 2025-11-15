import { createContext, useContext, useState, useCallback } from "react";
import {
  isNaevvConfigured,
  getNaevvConfig,
  type NaevvConfig,
} from "@/config/naevv.config";

interface NaevvContextType {
  isConfigured: boolean;
  config: NaevvConfig;
  refreshConfig: () => void;
}

const NaevvContext = createContext<NaevvContextType | undefined>(undefined);

export const NaevvProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConfigured, setIsConfigured] = useState(isNaevvConfigured());
  const [config, setConfig] = useState(getNaevvConfig());

  const refreshConfig = useCallback(() => {
    setConfig(getNaevvConfig());
    setIsConfigured(isNaevvConfigured());
  }, []);

  return (
    <NaevvContext.Provider
      value={{
        isConfigured,
        config,
        refreshConfig,
      }}
    >
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

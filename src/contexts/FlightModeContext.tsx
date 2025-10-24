import { createContext, useContext, useState, ReactNode } from "react";

interface FlightModeContextType {
  isInFlight: boolean;
  setIsInFlight: (value: boolean) => void;
}

const FlightModeContext = createContext<FlightModeContextType | undefined>(undefined);

export const FlightModeProvider = ({ children }: { children: ReactNode }) => {
  const [isInFlight, setIsInFlight] = useState(false);

  return (
    <FlightModeContext.Provider value={{ isInFlight, setIsInFlight }}>
      <div className={isInFlight ? "flight-mode-active" : ""}>
        {children}
      </div>
    </FlightModeContext.Provider>
  );
};

export const useFlightMode = () => {
  const context = useContext(FlightModeContext);
  if (context === undefined) {
    throw new Error("useFlightMode must be used within a FlightModeProvider");
  }
  return context;
};

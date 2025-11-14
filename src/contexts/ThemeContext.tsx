import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'gold-green' | 'liquid-glass';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('app-theme');
    return (saved === 'liquid-glass' ? 'liquid-glass' : 'gold-green') as Theme;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('gold-green', 'liquid-glass');
    root.classList.add(theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'gold-green' ? 'liquid-glass' : 'gold-green');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

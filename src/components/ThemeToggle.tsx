import { Sparkles, Droplets } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="sm"
      className="fixed top-4 right-4 z-50 gap-2 backdrop-blur-sm"
    >
      {theme === 'gold-green' ? (
        <>
          <Droplets className="h-4 w-4" />
          <span className="hidden sm:inline">Liquid Glass</span>
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Gold & Green</span>
        </>
      )}
    </Button>
  );
};

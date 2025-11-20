'use client';

import { useTheme } from 'next-themes';
import { RiMoonFill, RiSunFill } from 'react-icons/ri';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={handleToggle}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
    >
      <RiSunFill size={24} className="text-primary block dark:hidden" />
      <RiMoonFill size={24} className="text-primary hidden dark:block" />
    </button>
  );
}

import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, useResolvedTheme } from '@/store/theme';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  transparent?: boolean;
}

export default function ThemeToggle({ className, transparent }: ThemeToggleProps) {
  const toggleTheme = useTheme((s) => s.toggleTheme);
  const resolved = useResolvedTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-full transition-colors',
        transparent
          ? 'text-white/60 hover:text-white'
          : 'text-muted hover:text-primary',
        className
      )}
      aria-label={resolved === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {resolved === 'light' ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <Moon size={18} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <Sun size={18} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

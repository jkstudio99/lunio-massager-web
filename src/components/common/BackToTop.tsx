import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-[88px] right-7 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-primary shadow-xl border border-default hover:bg-white hover:scale-110 transition-all active:scale-95"
          aria-label="Back to top"
        >
          <ChevronUp size={24} className="text-crocus" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

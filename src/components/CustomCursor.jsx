import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '../lib/utils';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 15, stiffness: 1000 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 1);
      cursorY.set(e.clientY - 1);
      if (!isVisible) setIsVisible(true);

      // Check if hovering over a clickable element
      const target = e.target;
      const isClickable = 
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button';
        
      setIsPointer(isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <motion.div
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-[9999] hidden transition-all duration-150 md:flex",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={cn(
          "transition-all duration-200 drop-shadow-md origin-top-left",
          isPointer ? "fill-primary stroke-primary scale-125" : "fill-white stroke-[#1A1A2E]"
        )}
      >
        <path
          d="M1 1l7 17 2.5-7.5L18 8 1 1z"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}

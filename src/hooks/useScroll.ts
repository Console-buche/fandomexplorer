import { useEffect, useState, useRef } from 'react';

type UseScrollHookReturnType = -1 | 0 | 1;

const useScrollDirection = (): UseScrollHookReturnType => {
  const [scrollDirection, setScrollDirection] =
    useState<UseScrollHookReturnType>(0);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      const { deltaX, deltaY } = event;
      const direction =
        Math.abs(deltaY) > Math.abs(deltaX)
          ? -Math.sign(deltaY)
          : -Math.sign(deltaX);
      setScrollDirection(direction);

      // Clear the previous scroll timer
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }

      // Set a new scroll timer to reset the scroll direction after 300ms
      scrollTimerRef.current = setTimeout(() => {
        setScrollDirection(0);
        scrollTimerRef.current = null;
      }, 300);
    };

    // Add event listener to window
    window.addEventListener('wheel', handleScroll, { passive: false });

    // Clean up the event listener on component unmount
    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  return scrollDirection;
};

export default useScrollDirection;

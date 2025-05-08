import { useStoreFandoms } from '@/stores/storeFandoms';
import { useEffect, useState, useRef } from 'react';

function isScrollDirection<T extends number>(
  dir: T | ScrollDirection
): dir is ScrollDirection {
  return dir === -1 || dir === 0 || dir === 1;
}

export type ScrollDirection = -1 | 0 | 1;

const useScrollDirection = () => {
  const hasScrolled = useRef(false);
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(0);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTime = useRef<number>(0);
  const scrollMomentum = useRef<number>(0);

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      if (useStoreFandoms.getState().rickAndMorty.hasStarted) {
        hasScrolled.current = true;
      }

      // Prevent default to avoid browser scroll behavior interfering
      event.preventDefault();

      const { deltaX, deltaY } = event;
      const direction =
        Math.abs(deltaY) > Math.abs(deltaX)
          ? -Math.sign(deltaY)
          : -Math.sign(deltaX);

      // Update momentum based on scroll intensity with a more controlled acceleration
      const scrollIntensity = Math.max(Math.abs(deltaY), Math.abs(deltaX));
      // Cap the maximum momentum to prevent excessive speed
      const MAX_MOMENTUM = 2.5;
      // Use a smaller multiplier for more gradual acceleration
      scrollMomentum.current = Math.min(
        scrollMomentum.current + scrollIntensity * 0.005,
        MAX_MOMENTUM
      );

      if (isScrollDirection(direction)) {
        setScrollDirection(direction);
      }

      // Reset the timer that will eventually reset direction to 0
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }

      lastScrollTime.current = Date.now();

      // Set a new timer to reset direction to 0 after a short delay
      scrollTimerRef.current = setTimeout(() => {
        setScrollDirection(0);
        scrollMomentum.current = 0;
      }, 150);
    };

    // Add event listener to window
    window.addEventListener('wheel', handleScroll, { passive: false });

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('wheel', handleScroll);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  return {
    scrollDirection,
    hasScrolled,
    scrollMomentum: scrollMomentum.current,
  };
};

export default useScrollDirection;

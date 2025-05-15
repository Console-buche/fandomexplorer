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

  const accumulatedDelta = useRef<number>(0);

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      if (useStoreFandoms.getState().rickAndMorty.hasStarted) {
        hasScrolled.current = true;
      }

      event.preventDefault();

      const { deltaX, deltaY } = event;

      const isPrimaryVertical = Math.abs(deltaY) > Math.abs(deltaX);
      const primaryDelta = isPrimaryVertical ? deltaY : deltaX;

      const normalizedDelta =
        Math.sign(primaryDelta) * Math.min(Math.abs(primaryDelta), 100);

      accumulatedDelta.current += normalizedDelta;

      const DELTA_THRESHOLD = 5;
      if (Math.abs(accumulatedDelta.current) >= DELTA_THRESHOLD) {
        const direction = -Math.sign(
          accumulatedDelta.current
        ) as ScrollDirection;

        if (isScrollDirection(direction)) {
          setScrollDirection(direction);
        }

        const scrollIntensity = Math.abs(accumulatedDelta.current);
        const MAX_MOMENTUM = 2.5;
        scrollMomentum.current = Math.min(
          scrollMomentum.current + scrollIntensity * 0.01,
          MAX_MOMENTUM
        );

        accumulatedDelta.current = 0;
      }

      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }

      lastScrollTime.current = Date.now();

      scrollTimerRef.current = setTimeout(() => {
        setScrollDirection(0);
        scrollMomentum.current = 0;
        accumulatedDelta.current = 0;
      }, 200);
    };

    window.addEventListener('wheel', handleScroll, { passive: false });

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

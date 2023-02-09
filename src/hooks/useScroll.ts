import { useEffect, useState } from 'react';

type UseScrollHookReturnType = number;

const useScrollDirection = (): UseScrollHookReturnType => {
  const [scrollDirection, setScrollDirection] =
    useState<UseScrollHookReturnType>(0);

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      //   event.preventDefault(); // Prevent default scroll behavior

      const { deltaX, deltaY } = event;
      const direction =
        Math.abs(deltaY) > Math.abs(deltaX)
          ? -Math.sign(deltaY)
          : -Math.sign(deltaX);
      setScrollDirection(direction);
    };

    // Add event listener to window
    window.addEventListener('wheel', handleScroll, { passive: false });

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  return scrollDirection;
};

export default useScrollDirection;

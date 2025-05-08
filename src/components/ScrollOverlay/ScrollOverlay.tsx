import { useEffect, useState } from 'react';
import useScrollDirection from '../../hooks/useScroll';
import styles from './ScrollOverlay.module.css';

export const ScrollOverlay = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { hasScrolled } = useScrollDirection();

  useEffect(() => {
    const handleAnyScroll = () => {
      setIsVisible(false);
    };

    window.addEventListener('scroll', handleAnyScroll, { passive: true });
    window.addEventListener('wheel', handleAnyScroll, { passive: true });
    window.addEventListener('touchmove', handleAnyScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleAnyScroll);
      window.removeEventListener('wheel', handleAnyScroll);
      window.removeEventListener('touchmove', handleAnyScroll);
    };
  }, []);

  useEffect(() => {
    const checkScrolled = () => {
      if (hasScrolled.current) {
        setIsVisible(false);
      }
    };

    checkScrolled();

    const interval = setInterval(checkScrolled, 100);

    return () => clearInterval(interval);
  }, [hasScrolled]);

  if (!isVisible) return null;

  return (
    <div className={styles.scrollOverlay}>
      <div className={styles.leftChevron}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
        </svg>
      </div>
      <div className={styles.message}>SCROLL TO MOVE</div>
      <div className={styles.rightChevron}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </div>
    </div>
  );
};

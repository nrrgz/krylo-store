import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DURATION_MS = 420;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      window.scrollTo(0, 0);
      return;
    }

    const startY = window.scrollY;
    if (startY <= 0) return;

    const startTime = performance.now();
    let frameId = 0;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      const eased = easeOutCubic(progress);
      const y = Math.round(startY * (1 - eased));
      window.scrollTo(0, y);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [pathname]);

  return null;
}

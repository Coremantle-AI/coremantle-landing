'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Logo row that slides in from the sides toward the centre as it enters the
 * viewport, and slides back out on scroll-up - unlike the site-wide
 * `[data-reveal]` system (lib/motion/reveal.js), which is one-shot and never
 * reverses, so it gets its own small bidirectional observer here.
 */
export default function TrustedByRow({ className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(([entry]) => el.classList.toggle('is-in-view', entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn('trusted-by__row', className)}>
      {children}
    </div>
  );
}

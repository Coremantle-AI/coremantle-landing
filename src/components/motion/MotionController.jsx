'use client';

import { useEffect } from 'react';
import { initReveal } from '@/lib/motion/reveal';
import { startScrubEngine } from '@/lib/scrub/scrub-engine';

/**
 * Starts the page's motion systems - scroll reveals and the scroll-scrub
 * engine - and tears them down when the route changes. Renders nothing.
 */
export default function MotionController({ scrub = true }) {
  useEffect(() => initReveal(), []);
  useEffect(() => (scrub ? startScrubEngine() : undefined), [scrub]);
  return null;
}

'use client';

import { useEffect, useRef } from 'react';
import { registerFold } from '@/lib/scrub/scrub-engine';
import { cn } from '@/lib/utils/cn';

/**
 * Host for an animated scene from public/folds. The scene iframe is created
 * by the scrub engine when the host nears the viewport, and scroll drives
 * its timeline from then on (see lib/scrub/scrub-engine).
 *
 * @param {string}  scene    file name in public/folds, e.g. "Coremantle Scale.dc.html"
 * @param {string}  label    accessible title for the scene
 * @param {string}  aspect   authored aspect ratio, e.g. "1520/860"
 * @param {boolean} wide     full-bleed pinned variant (`.fold--wide`)
 * @param {boolean} deck     timeline owned by a pinned problem deck
 * @param {number}  seamIn   seconds to skip at the start of the timeline
 * @param {number}  seamOut  seconds to stop short of the end
 */
export default function Fold({ scene, label, aspect, wide = false, deck = false, seamIn, seamOut, className }) {
  const hostRef = useRef(null);

  useEffect(() => registerFold(hostRef.current), []);

  return (
    <div
      ref={hostRef}
      className={cn('fold', wide && 'fold--wide', className)}
      style={aspect ? { aspectRatio: aspect } : undefined}
      data-fold={scene}
      data-seam-in={seamIn}
      data-seam-out={seamOut}
      data-deck={deck ? 'true' : undefined}
    >
      <span className="fold-tag">{label}</span>
    </div>
  );
}

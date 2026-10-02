'use client';

import { useEffect, useRef } from 'react';
import { mountHorizon } from '@/lib/horizon/horizon-scene';

/**
 * "What comes next" scene: a pinned card whose dot field morphs from speech
 * waveform to words, landscape and robot as the reader scrolls the track.
 * The canvas and HUD are built imperatively by lib/horizon/horizon-scene; the
 * card is left empty here so React never reconciles that subtree.
 */
export default function HorizonTrack() {
  const cardRef = useRef(null);

  useEffect(() => mountHorizon(cardRef.current), []);

  return (
    <div className="hz-track">
      <div className="hz-sticky">
        <div className="hz-card" data-horizon="" ref={cardRef} />
      </div>
    </div>
  );
}

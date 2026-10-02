'use client';

import { useEffect, useRef } from 'react';
import { hideSceneChrome, scheduleScrub } from '@/lib/scrub/scrub-engine';

const SCENE = '/folds/Enterprise%20Architecture%20Hero.dc.html';

/**
 * The annotation-workflow scene pinned under the Enterprise hero. Scroll
 * through the track scrubs the pipeline (scrub-engine: heroSeek). In light
 * mode a backdrop-filter overlay on the stage inverts the scene, matching the
 * other folds (see the enterprise page styles).
 */
export default function ArchitectureScrub() {
  const frameRef = useRef(null);

  useEffect(() => {
    const iframe = frameRef.current;
    const onLoad = () => {
      hideSceneChrome(iframe.contentDocument);
      scheduleScrub();
    };
    iframe.addEventListener('load', onLoad);
    // the frame may have finished loading before hydration
    if (iframe.contentDocument?.readyState === 'complete' && iframe.contentDocument.URL !== 'about:blank') onLoad();
    return () => iframe.removeEventListener('load', onLoad);
  }, []);

  return (
    <section className="scroll-scrub-track" aria-label="Coremantle annotation workflow">
      <div className="scroll-scrub-stage">
        <iframe ref={frameRef} src={SCENE} title="Coremantle annotation workflow" className="block w-full h-full border-0" />
      </div>
    </section>
  );
}

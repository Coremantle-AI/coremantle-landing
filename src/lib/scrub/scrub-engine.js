// Scroll-scrub engine: scroll position drives every animated scene on a page.
//
// Ported from the static site's landing.js. All scrub maths (progress
// windows, seams, easing, prism flight) is unchanged; what changed is
// lifecycle: folds register themselves (components/folds/Fold) instead of
// being discovered once, and `startScrubEngine()` returns a cleanup so the
// engine can follow client-side route changes.
//
// Scenes are `.dc.html` documents in iframes (public/folds). Each exposes a
// timeline element that accepts `data-om-seek-to-time-frame` and
// `data-cm-set-playing` events; scroll owns the playhead, nothing free-runs.
//
// Drivers, run together once per animation frame:
//   heroSeek     enterprise architecture scene pinned under the hero
//   qualitySeek  `[data-quality-track]` two-chapter scrub + prism flight
//   foldSeek     every registered fold (stacked cards, pinned tracks, inline)
//   problemSeek  pinned numbered decks (components/problem/ProblemSection)

const TIMELINE = '[data-om-exportable-video-with-duration-secs]';
const SEEK_EVENT = 'data-om-seek-to-time-frame';
const PLAYING_EVENT = 'data-cm-set-playing';

// quality section: the prism leaves the apex and lands in the platform slot
// over this slice of the scrub; it is also the chapter 01 -> 02 handoff, so a
// stage whose chapter 01 runs longer overrides it with data-prism-travel
const PRISM_TRAVEL = [0.56, 0.76];

// how long the hero scene may take to mount before the scrub collapses
const HERO_FALLBACK_MS = 10000;

const foldHosts = new Set();
let reducedMotion = null;
let frame = 0;
let heroReducedFrameSet = false;
let loader = null;
let playback = null;

const clamp01 = value => Math.min(1, Math.max(0, value));
const prefersReducedMotion = () => (reducedMotion ??= window.matchMedia('(prefers-reduced-motion: reduce)'));

const durationOf = timeline => Number(timeline.dataset.omExportableVideoWithDurationSecs) || 0;

const seekTo = (timeline, time, sync) => {
  timeline.dispatchEvent(new CustomEvent(SEEK_EVENT, { detail: { time, sync } }));
};

const frameTimeline = iframe => iframe?.contentDocument?.querySelector(TIMELINE) ?? null;

const foldTimeline = host => frameTimeline(host.querySelector('iframe'));

// scenes fade in/out over their first/last ~0.35s (authored for looping);
// the scrub stays inside that window. A fold can push its start point
// further in with data-seam-in (e.g. past a staggered headline entrance)
// so progress 0 holds a fully composed frame.
const seamOf = host => ({
  seamIn: host.dataset.seamIn != null ? parseFloat(host.dataset.seamIn) : 0.4,
  seamOut: host.dataset.seamOut != null ? parseFloat(host.dataset.seamOut) : 0.45,
});

/* ------------------------------------------------------------------ *
 * enterprise hero                                                     *
 * ------------------------------------------------------------------ */

const heroSeek = () => {
  const track = document.querySelector('.scroll-scrub-track');
  if (!track) return;
  const timeline = frameTimeline(track.querySelector('.scroll-scrub-stage iframe'));

  // a late-mounting scene reclaims the scrub from the fallback state
  if (timeline && track.classList.contains('scene-fallback')) track.classList.remove('scene-fallback');
  if (!timeline) return;
  const duration = durationOf(timeline);

  if (prefersReducedMotion().matches) {
    if (!heroReducedFrameSet) {
      seekTo(timeline, duration * 0.32, true);
      heroReducedFrameSet = true;
    }
    return;
  }

  heroReducedFrameSet = false;
  const distance = Math.max(1, track.offsetHeight - innerHeight);
  const progress = clamp01((scrollY - track.offsetTop) / distance);
  // per-frame scrubs seek async (the runtime's documented scrub path);
  // sync is reserved for one-shot parks that must not flash a stale frame
  seekTo(timeline, progress * duration, false);
};

/* ------------------------------------------------------------------ *
 * quality scrub                                                       *
 * ------------------------------------------------------------------ */

// scroll scrubs chapter 01 (pyramid / flywheel / pipeline), then the prism
// flies from the apex into the platform of chapter 02
const qualitySeek = () => {
  const track = document.querySelector('[data-quality-track]');
  const stage = track?.querySelector('.q-stage');
  if (!stage) return;
  const prism = stage.querySelector('[data-prism]');

  if (prefersReducedMotion().matches) {
    stage.style.setProperty('--qp', '1');
    stage.classList.add('is-landed');
    stage.classList.add('qs2-live');
    return;
  }

  // all layout reads happen before the first write: a --qp write dirties
  // the whole stage subtree, so a rect read after it forces a full
  // re-layout every frame
  const distance = Math.max(1, track.offsetHeight - innerHeight);
  const progress = clamp01(-track.getBoundingClientRect().top / distance);
  const [start, end] = stage.dataset.prismTravel ? stage.dataset.prismTravel.split(',').map(Number) : PRISM_TRAVEL;
  const apex = stage.querySelector('[data-prism-apex]');
  const slot = stage.querySelector('[data-prism-slot]');
  let flight = null;
  if (prism && apex && slot && progress >= start && progress < end) {
    const stageRect = stage.getBoundingClientRect();
    const a = apex.getBoundingClientRect();
    const b = slot.getBoundingClientRect();
    flight = {
      ax: a.left + a.width / 2 - stageRect.left,
      ay: a.top + a.height / 2 - stageRect.top,
      bx: b.left + b.width / 2 - stageRect.left,
      by: b.top + b.height / 2 - stageRect.top,
    };
  }
  stage.style.setProperty('--qp', progress.toFixed(4));
  stage.classList.toggle('is-landed', progress >= end);
  // chapter 02 holds live links: keep the invisible layer out of the
  // pointer and tab order until it starts fading in
  stage.classList.toggle('qs2-live', progress >= start);
  if (!prism) return;
  if (!flight) {
    prism.style.opacity = '0';
    return;
  }
  const raw = (progress - start) / (end - start);
  const u = raw < 0.5 ? 4 * raw ** 3 : 1 - (-2 * raw + 2) ** 3 / 2;
  const x = flight.ax + (flight.bx - flight.ax) * u;
  const y = flight.ay + (flight.by - flight.ay) * u - Math.sin(Math.PI * u) * 70;
  prism.style.opacity = '1';
  prism.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${u * 360}deg) scale(${1 - u * 0.35})`;
};

/* ------------------------------------------------------------------ *
 * pinned problem decks                                                *
 * ------------------------------------------------------------------ */

// the index stays on screen while scroll steps through the folds; each
// fold's timeline scrubs within its slice
const seekDeckTrack = track => {
  const panels = [...track.querySelectorAll('.problem-deck .problem-panel')];
  const n = panels.length;
  if (!n) return;
  const dist = Math.max(1, track.offsetHeight - innerHeight);
  const p = Math.min(0.9999, Math.max(0, -track.getBoundingClientRect().top / dist));
  const active = Math.floor(p * n);
  const lp = p * n - active;
  panels.forEach((panel, i) => {
    const pos = i === active ? 'active' : i < active ? 'past' : 'future';
    panel.classList.toggle('is-active', pos === 'active');
    panel.classList.toggle('is-past', pos === 'past');
    const timeline = frameTimeline(panel.querySelector('iframe'));
    if (!timeline) {
      delete panel.dataset.pos;
      return;
    }
    if (pos !== 'active' && panel.dataset.pos === pos) return;
    panel.dataset.pos = pos;
    const duration = durationOf(timeline);
    if (!duration) return;
    const { seamIn, seamOut } = seamOf(panel.querySelector('[data-fold]') || panel);
    // finish the timeline by 85% of the slice so the end frame gets a beat
    const k = pos === 'past' ? 1 : pos === 'future' ? 0 : Math.min(1, lp / 0.85);
    seekTo(timeline, seamIn + k * Math.max(0.1, duration - seamIn - seamOut), false);
  });
  track.querySelectorAll('.problem-nav button').forEach((button, i) => {
    button.classList.toggle('active', i === active);
    button.setAttribute('aria-current', i === active ? 'true' : 'false');
  });
};

const problemSeek = () => {
  if (prefersReducedMotion().matches) return;
  document.querySelectorAll('.problem-track').forEach(seekDeckTrack);
};

/* ------------------------------------------------------------------ *
 * folds                                                               *
 * ------------------------------------------------------------------ */

// getComputedStyle forces a style recalc, so the stuck-top / dwell values
// (which only change with the viewport) are measured once per layout and
// reused every scroll frame; the resize handler drops the cache
let stackMetrics = new WeakMap();
const measureStack = (stackCard, next) => {
  let m = stackMetrics.get(stackCard);
  if (!m) {
    const spacer = next.classList.contains('stack-spacer');
    m = {
      spacer,
      stickTop: parseFloat(getComputedStyle(stackCard).top) || 84,
      dwell: Math.max(1, spacer ? next.offsetHeight : parseFloat(getComputedStyle(next).marginTop) || 0),
    };
    stackMetrics.set(stackCard, m);
  }
  return m;
};

// scrub each fold's timeline with scroll: the animation runs forward as the
// fold travels from the lower viewport to the upper third, and rolls back
// when the reader scrolls up
const foldSeek = () => {
  if (prefersReducedMotion().matches) return;
  foldHosts.forEach(host => {
    if (host.dataset.deck === 'true') return; // the problem deck owns these
    const timeline = foldTimeline(host);
    if (!timeline) return;
    const rect = host.getBoundingClientRect();
    if (rect.bottom < -300 || rect.top > innerHeight + 300) return;
    const duration = durationOf(timeline);
    if (!duration) return;
    let progress;
    const stackCard = host.closest('.stack-card');
    const pinTrack = host.closest('[data-fold-track]');
    if (stackCard) {
      // stacked card: the card slides up holding the scene's first frame;
      // once it pins below the nav, the dwell gap before the next card
      // arrives is the scrub range, so the animation only plays after the
      // card is in position (and rolls back the same way). Measure from the
      // next card (or the list's end spacer), which is still in normal
      // flow - a stuck card's own offsets freeze.
      const next = stackCard.nextElementSibling;
      if (!next) return;
      const { stickTop, dwell, spacer } = measureStack(stackCard, next);
      const gap = spacer ? 0 : dwell;
      const travelled = stickTop + stackCard.offsetHeight + gap - next.getBoundingClientRect().top;
      progress = clamp01(travelled / dwell);
    } else if (pinTrack) {
      // pinned fold: the host sticks inside a tall track and the track's
      // travel drives the timeline, so the reader controls the pace
      const dist = Math.max(1, pinTrack.offsetHeight - innerHeight);
      progress = clamp01(-pinTrack.getBoundingClientRect().top / dist);
    } else {
      // tall folds (portrait mobile scenes) fill most of the viewport, so a
      // fixed window would play almost everything while the fold is still
      // entering; instead hold the first frame until ~80% of the fold is on
      // screen, then scrub through the fully-visible zone
      const tall = innerWidth <= 820;
      const end = tall ? Math.max(40, innerHeight * 0.06) : innerHeight * 0.28;
      const start = Math.max(end + 120, Math.min(innerHeight * 0.92, innerHeight - rect.height * 0.8));
      progress = clamp01((start - rect.top) / (start - end));
    }
    const { seamIn, seamOut } = seamOf(host);
    const time = seamIn + progress * Math.max(0.1, duration - seamIn - seamOut);
    seekTo(timeline, time, false);
  });
};

/** Hands a mounted fold's timeline to scroll. @returns {boolean} mounted */
export const controlFold = host => {
  const iframe = host.querySelector('iframe');
  const timeline = frameTimeline(iframe);
  if (!timeline) return false;

  // scroll owns every fold timeline - no free-running playback
  timeline.dispatchEvent(new CustomEvent(PLAYING_EVENT, { detail: { playing: false } }));

  if (prefersReducedMotion().matches) {
    if (host.dataset.posterSet !== 'true') {
      seekTo(timeline, durationOf(timeline) * 0.55, true);
      host.dataset.posterSet = 'true';
    }
    iframe.classList.add('is-ready');
  } else {
    delete host.dataset.posterSet;
    // the runtime restores its last-persisted playhead on mount, which can
    // be any frame from a previous visit or another fold - park the scene on
    // its start frame once; the scroll seek takes over from there
    if (host.dataset.primed !== 'true') {
      host.dataset.primed = 'true';
      seekTo(timeline, Math.min(seamOf(host).seamIn, durationOf(timeline)), true);
    }
    // the prime seek above is sync, so the fade-in reveals the composed
    // seam-in frame - never the runtime's restored playhead
    iframe.classList.add('is-ready');
    scheduleScrub();
  }
  return true;
};

/** Styles that hide the runtime's editor chrome inside an embedded scene. */
export const hideSceneChrome = frameDocument => {
  if (!frameDocument || frameDocument.querySelector('#coremantle-embed-style')) return;
  const style = frameDocument.createElement('style');
  style.id = 'coremantle-embed-style';
  style.textContent = '[data-omelette-chrome]{display:none!important}html,body{overflow:hidden!important}';
  frameDocument.head?.appendChild(style);
};

const configureFrame = host => {
  const frameDocument = host.querySelector('iframe')?.contentDocument;
  if (!frameDocument) return;
  hideSceneChrome(frameDocument);
  if (controlFold(host)) return;
  // the scene compiles after load: wait for its timeline to appear
  const frameObserver = new MutationObserver(() => {
    if (!controlFold(host)) return;
    frameObserver.disconnect();
  });
  frameObserver.observe(frameDocument.documentElement, { childList: true, subtree: true });
};

const mountFrame = host => {
  if (host.querySelector('iframe')) return;
  const iframe = document.createElement('iframe');
  iframe.title = host.querySelector('.fold-tag')?.textContent || 'Coremantle animation';
  iframe.loading = 'eager';
  iframe.addEventListener('load', () => configureFrame(host));
  iframe.src = `/folds/${encodeURIComponent(host.dataset.fold)}`;
  iframe.setAttribute('allow', 'autoplay');
  host.appendChild(iframe);
};

const observers = () => {
  // Start composing scenes well before they reach the viewport.
  loader ??= new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) mountFrame(entry.target);
      });
    },
    { rootMargin: '2000px 0px' },
  );
  playback ??= new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        entry.target.dataset.inViewport = String(entry.isIntersecting);
        controlFold(entry.target);
      });
    },
    { threshold: 0.1 },
  );
  return { loader, playback };
};

/**
 * Registers a fold host (`[data-fold]`) with the engine: its scene loads when
 * it nears the viewport and scroll drives its timeline from then on.
 * @returns {() => void} unregister
 */
export function registerFold(host) {
  const { loader: load, playback: play } = observers();
  foldHosts.add(host);
  host.dataset.inViewport = 'false';
  load.observe(host);
  play.observe(host);
  return () => {
    foldHosts.delete(host);
    load.unobserve(host);
    play.unobserve(host);
  };
}

/* ------------------------------------------------------------------ *
 * scheduler                                                           *
 * ------------------------------------------------------------------ */

const tick = () => {
  frame = 0;
  heroSeek();
  qualitySeek();
  foldSeek();
  problemSeek();
};

/** Coalesces scrub work into the next animation frame. */
export function scheduleScrub() {
  if (!frame) frame = requestAnimationFrame(tick);
}

/**
 * Binds the engine to the window for the current page.
 * @returns {() => void} cleanup
 */
export function startScrubEngine() {
  const motion = prefersReducedMotion();
  const onResize = () => {
    stackMetrics = new WeakMap();
    scheduleScrub();
  };
  const onVisibility = () => foldHosts.forEach(controlFold);
  const onMotionChange = () => {
    heroReducedFrameSet = false;
    foldHosts.forEach(controlFold);
    scheduleScrub();
  };
  const domObserver = new MutationObserver(scheduleScrub);

  // if the hero scene hasn't mounted shortly after the page is live (slow
  // device, blocked CDN), collapse its scrub so no dead screen remains
  const fallback = window.setTimeout(() => {
    const track = document.querySelector('.scroll-scrub-track');
    if (track && !frameTimeline(track.querySelector('.scroll-scrub-stage iframe'))) {
      track.classList.add('scene-fallback');
      scheduleScrub();
    }
  }, HERO_FALLBACK_MS);

  domObserver.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('scroll', scheduleScrub, { passive: true });
  window.addEventListener('resize', onResize);
  window.addEventListener('pageshow', scheduleScrub);
  document.addEventListener('visibilitychange', onVisibility);
  motion.addEventListener('change', onMotionChange);
  scheduleScrub();

  return () => {
    window.clearTimeout(fallback);
    domObserver.disconnect();
    window.removeEventListener('scroll', scheduleScrub);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pageshow', scheduleScrub);
    document.removeEventListener('visibilitychange', onVisibility);
    motion.removeEventListener('change', onMotionChange);
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    heroReducedFrameSet = false;
  };
}

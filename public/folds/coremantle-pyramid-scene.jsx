// coremantle-pyramid-scene.jsx — "predictability, quality & trust by design": a four-
// layer pyramid builds from the ground up, each layer unlocking its callout, capped
// by a glowing apex.
(function () {
  const E = window.Easing, clamp = window.clamp;
  const BG = '#0e0d0b', CREAM = '#f6f4ef', GLASS = 'rgba(246,244,239,0.05)', EDGE = 'rgba(246,244,239,0.16)';
  const GREEN = '#9dbf95';
  const MONO = '"IBM Plex Mono", monospace';
  const SANS = '"Space Grotesk", sans-serif';

  const MOTION = {
    enter: (T, start, dur = 0.5, dy = 16) => {
      const k = clamp((T - start) / dur, 0, 1), e = E.easeOutCubic(k);
      return { opacity: e, transform: `translateY(${(1 - e) * dy}px)` };
    },
    pop: (T, start, dur = 0.45) => {
      const k = clamp((T - start) / dur, 0, 1), e = E.easeOutBack(k);
      return { opacity: clamp(k * 3, 0, 1), transform: `scale(${0.7 + 0.3 * e})` };
    },
    draw: (T, start, dur = 0.5) => E.easeInOutSine(clamp((T - start) / dur, 0, 1)),
  };

  const CX = 560, BASE_Y = 950, LH = 112, LGAP = 14, DIP = 24; // DIP = corner-on 3D drop at the center ridge
  const LFACE = 'linear-gradient(200deg, rgba(157,191,149,0.13), rgba(157,191,149,0.02))';
  const RFACE = 'linear-gradient(160deg, rgba(157,191,149,0.28), rgba(157,191,149,0.07))';
  // bottom-up; wb = bottom width, wt = top width
  const LAYERS = [
    { wb: 800, wt: 650, num: '01', name: 'raw data sourcing', title: '1. Raw Data Sourcing', bullets: ['Clear sourcing strategy', 'Filtration before ingestion', 'DPDP-compliant consent'] },
    { wb: 640, wt: 490, num: '02', name: 'tech-first platform', title: '2. Tech-First Platform', bullets: ['The platform guarantees quality', 'Automation and checks in every step', 'Built to remove human error'] },
    { wb: 480, wt: 330, num: '03', name: 'curated community', title: '3. Curated Community', bullets: ['Native speakers vetted for language, dialect and domain', 'Language experts, not crowd workers'] },
    { wb: 320, wt: 170, num: '04', name: 'model-ready output', title: '4. Model-Ready Output', bullets: ['Every dataset verified and certified', '95% quality score \u00b7 <5% WER', 'Multimodal, vertical-specific'] },
  ];

  function Piece({ tw }) {
    const { T, CUES, time, authoredTotal } = window.useComposition();
    const ACCENT = tw.accent;
    const seam = Math.min(MOTION.draw(T, 0, 0.35), 1 - MOTION.draw(T, authoredTotal - 0.35, 0.35));
    const apexPop = MOTION.pop(T, CUES.Apex + 0.15, 0.6);
    const apexGlow = 0.5 + 0.5 * Math.sin(T * 2.2);
    const apexY = BASE_Y - 4 * (LH + LGAP) - 104;

    return (
      <div data-screen-label={`t=${Math.floor(time)}s`}
        style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>
        {/* top bar */}
        <div style={{ position: 'absolute', left: 90, right: 90, top: 52, display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...MOTION.enter(T, 0.1) }}>
          <div style={{ font: `600 32px ${SANS}`, letterSpacing: '-0.01em' }}>coremantle<span style={{ color: ACCENT }}>.</span></div>
          <div style={{ font: `400 19px ${MONO}`, opacity: 0.5 }}>solution &middot; differentiation</div>
        </div>

        {/* header */}
        <div style={{ position: 'absolute', left: 130, top: 128 }}>
          <div style={{ font: `600 22px ${MONO}`, letterSpacing: '0.18em', color: ACCENT, ...MOTION.enter(T, 0.25, 0.5, 14) }}>SOLUTION &amp; DIFFERENTIATION</div>
          <div style={{ font: `600 66px ${SANS}`, letterSpacing: '-0.02em', marginTop: 14, lineHeight: 1.12, ...MOTION.enter(T, 0.4, 0.6, 24) }}>
            Predictability, Quality &amp;<br />Trust <span style={{ color: ACCENT }}>by Design</span>
          </div>
          <div style={{ width: 130, height: 5, background: ACCENT, marginTop: 24, borderRadius: 3, ...MOTION.enter(T, 0.7, 0.5, 8) }} />
        </div>

        {/* pyramid layers, bottom-up */}
        {LAYERS.map((l, i) => {
          const at = CUES.Build + i * 1.0;
          const k = MOTION.draw(T, at, 0.6);
          const y = BASE_Y - (i + 1) * LH - i * LGAP;
          const W = l.wb, ins = (l.wb - l.wt) / 2;
          const ptsL = `polygon(${ins}px 0, ${W / 2}px ${DIP}px, ${W / 2}px ${LH + DIP}px, 0 ${LH}px)`;
          const ptsR = `polygon(${W / 2}px ${DIP}px, ${W - ins}px 0, ${W}px ${LH}px, ${W / 2}px ${LH + DIP}px)`;
          const rim = `polygon(${ins}px 0, ${W / 2}px ${DIP}px, ${W - ins}px 0, ${W - ins}px 2.5px, ${W / 2}px ${DIP + 2.5}px, ${ins}px 2.5px)`;
          const rimB = `polygon(0 ${LH}px, ${W / 2}px ${LH + DIP}px, ${W}px ${LH}px, ${W}px ${LH + 2.5}px, ${W / 2}px ${LH + DIP + 2.5}px, 0 ${LH + 2.5}px)`;
          const cy = y + LH / 2;
          const fs = Math.min(22, Math.floor(((l.wb + l.wt) / 2 - 56) / (l.name.length + 3) / 0.62));
          const lineK = MOTION.draw(T, at + 0.4, 0.4);
          const calloutIn = MOTION.enter(T, at + 0.6, 0.5, 14);
          const calloutY = 850 - i * 158;
          return (
            <div key={i}>
              <div style={{
                position: 'absolute', left: CX - l.wb / 2, top: y, width: l.wb, height: LH + DIP + 3,
                opacity: k, transform: `translateY(${(1 - k) * 40}px)`,
                filter: `drop-shadow(0 0 ${16 * k}px rgba(157,191,149,0.3))`,
              }}>
                <div style={{ position: 'absolute', inset: 0, clipPath: ptsL, background: LFACE }} />
                <div style={{ position: 'absolute', inset: 0, clipPath: ptsR, background: RFACE }} />
                <div style={{ position: 'absolute', inset: 0, clipPath: rim, background: GREEN, opacity: 0.9 }} />
                <div style={{ position: 'absolute', inset: 0, clipPath: rimB, background: GREEN, opacity: 0.5 }} />
                <div style={{ position: 'absolute', left: W / 2, top: DIP, width: 1.5, height: LH, background: 'rgba(157,191,149,0.35)' }} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: DIP, height: LH, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <span style={{ font: `500 ${Math.max(13, fs - 3)}px ${MONO}`, color: GREEN, opacity: 0.9 }}>{l.num}</span>
                  <span style={{ font: `500 ${fs}px ${MONO}`, opacity: 0.9, whiteSpace: 'nowrap' }}>{l.name}</span>
                </div>
              </div>
              {/* connector + callout */}
              <div style={{ position: 'absolute', left: CX + l.wb / 2 - 20, top: cy, width: (1120 - CX - l.wb / 2 + 20) * lineK, borderTop: `2px dashed rgba(157,191,149,0.3)`, transformOrigin: '0 0', transform: `rotate(${Math.atan2(calloutY + 20 - cy, 1120 - CX - l.wb / 2 + 20) * 180 / Math.PI}deg)` }} />
              <div style={{ position: 'absolute', left: 1150, top: calloutY - 26, width: 640, ...calloutIn }}>
                <div style={{ font: `600 30px ${SANS}`, color: ACCENT }}>{l.title}</div>
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {l.bullets.map((b, j) => (
                    <div key={j} style={{ display: 'flex', gap: 12, font: `400 19px ${MONO}`, opacity: 0.65, lineHeight: 1.4 }}>
                      <span style={{ color: GREEN, flex: 'none' }}>&bull;</span><span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* apex — 3D diamond in the same glass/green language as the tiers */}
        <div style={{ position: 'absolute', left: CX - 80, top: apexY, width: 160, height: 100, opacity: apexPop.opacity, transform: apexPop.transform, transformOrigin: '50% 100%', filter: 'drop-shadow(0 0 16px rgba(157,191,149,0.35))' }}>
          <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(50% 0, 50% 100%, 0 72%)', background: LFACE }} />
          <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(50% 0, 100% 72%, 50% 100%)', background: RFACE }} />
          <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(50% 0, 100% 72%, 50% 100%, 0 72%)', border: `0px` }} />
          <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 72%, 50% 0, 50% 3px, 2.5px 72%)', background: GREEN, opacity: 0.9 }} />
          <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(50% 0, 100% 72%, calc(100% - 2.5px) 72%, 50% 3px)', background: GREEN, opacity: 0.9 }} />
          <div style={{ position: 'absolute', left: '50%', top: 0, width: 1.5, height: '100%', background: 'rgba(157,191,149,0.35)' }} />
        </div>
        <div style={{
          position: 'absolute', left: CX - 80, top: apexY, width: 160, height: 100,
          clipPath: 'polygon(50% 0, 100% 72%, 50% 100%, 0 72%)', background: GREEN,
          opacity: apexPop.opacity * (0.18 + 0.16 * apexGlow), filter: 'blur(20px)',
        }} />
      </div>
    );
  }

  function CoremantlePyramid() {
    const [tw, setTweak] = window.useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, accent: '#5E6AD2' });
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <window.CompositionStage width={1920} height={1080} bg={BG}
          scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
          <Piece tw={tw} />
        </window.CompositionStage>
        <window.TweaksPanel>
          <window.TweakSection label="Playback" />
          <window.TweakToggle label="Motion editor" value={tw.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
          <window.TweakSection label="Style" />
          <window.TweakColor label="Accent" value={tw.accent} options={['#D97757', '#3E7C7B', '#5E6AD2']} onChange={(v) => setTweak('accent', v)} />
        </window.TweaksPanel>
      </div>
    );
  }
  window.CoremantlePyramid = CoremantlePyramid;
})();

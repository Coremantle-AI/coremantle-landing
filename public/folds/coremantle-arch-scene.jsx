// coremantle-arch-scene.jsx — architecture animation: enterprise + API vendors feed an
// agentic AI layer; live call data drops into the data intelligence platform, whose
// pipeline lights up and ultimately replaces the failing API vendors.
(function () {
  const E = window.Easing, clamp = window.clamp;
  const BG = '#0e0d0b', CREAM = '#f6f4ef', GLASS = 'rgba(246,244,239,0.045)', EDGE = 'rgba(246,244,239,0.16)';
  const AMBER = '#d9b25e', GREEN = '#9dbf95';
  const MONO = '"IBM Plex Mono", monospace';
  const SANS = '"Space Grotesk", sans-serif';
  const fract = (x) => x - Math.floor(x);

  const MOTION = {
    enter: (T, start, dur = 0.5, dy = 16) => {
      const k = clamp((T - start) / dur, 0, 1), e = E.easeOutCubic(k);
      return { opacity: e, transform: `translateY(${(1 - e) * dy}px)` };
    },
    pop: (T, start, dur = 0.4) => {
      const k = clamp((T - start) / dur, 0, 1), e = E.easeOutBack(k);
      return { opacity: clamp(k * 3, 0, 1), transform: `scale(${0.7 + 0.3 * e})` };
    },
    draw: (T, start, dur = 0.5) => E.easeInOutSine(clamp((T - start) / dur, 0, 1)),
  };

  const STAGES = [
    { n: '01', label: 'YOUR CALL DATA' },
    { n: '02', label: 'ANNOTATE & VERIFY' },
    { n: '03', label: 'TRAIN CUSTOM MODEL' },
    { n: '04', label: 'CUSTOM ASR / SLM / TTS' },
  ];

  function HArrow({ x0, x1, y, k, color }) {
    // draws left→right when x1 > x0, right→left otherwise
    const w = Math.abs(x1 - x0) * k, ltr = x1 > x0;
    if (k <= 0) return null;
    return (
      <div style={{ position: 'absolute', left: ltr ? x0 : x1 + (Math.abs(x1 - x0) - w), top: y - 1, width: w, height: 2, background: color, opacity: 0.8 }}>
        <div style={{
          position: 'absolute', top: -5, [ltr ? 'right' : 'left']: -2, width: 0, height: 0,
          borderTop: '6px solid transparent', borderBottom: '6px solid transparent',
          [ltr ? 'borderLeft' : 'borderRight']: `9px solid ${color}`, opacity: k > 0.95 ? 1 : 0,
        }} />
      </div>
    );
  }

  function TopCard({ x, w, at, T, dim, tint, children }) {
    return (
      <div style={{
        position: 'absolute', left: x, top: 130, width: w, height: 200, boxSizing: 'border-box',
        borderRadius: 18, border: `1px solid ${tint || EDGE}`, background: GLASS, padding: '26px 28px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
        textAlign: 'center', transition: 'border-color 0.4s',
        ...MOTION.enter(T, at, 0.55, 22), opacity: Math.min(MOTION.enter(T, at, 0.55).opacity, dim),
      }}>{children}</div>
    );
  }

  function Piece({ tw }) {
    const { T, CUES, time, authoredTotal } = window.useComposition();
    const ACCENT = tw.accent;
    const seam = Math.min(MOTION.draw(T, 0, 0.35), 1 - MOTION.draw(T, authoredTotal - 0.35, 0.35));
    const arrow1 = MOTION.draw(T, 1.05, 0.45);
    const arrow2 = MOTION.draw(T, 1.25, 0.45);
    const warnPop = MOTION.pop(T, CUES.Problem + 0.2, 0.45);
    const warnK = MOTION.draw(T, CUES.Problem + 0.2, 0.45);
    const liveIn = MOTION.enter(T, CUES.Platform + 0.05, 0.4, 10);
    const dropK = MOTION.draw(T, CUES.Platform + 0.15, 0.5);
    const slabK = MOTION.draw(T, CUES.Platform + 0.45, 0.9);
    const titleIn = MOTION.enter(T, CUES.Platform + 1.0, 0.5, 14);
    const replaceK = MOTION.draw(T, CUES.Replace + 0.1, 0.8);
    const apiDim = 1 - 0.62 * MOTION.draw(T, CUES.Replace + 0.5, 0.6);
    const glowK = MOTION.draw(T, CUES.Replace + 0.7, 0.6);
    const footIn = MOTION.enter(T, CUES.Close + 0.25, 0.6, 20);
    const pulseOn = T > CUES.Pipeline + 2.4;
    const pulseP = fract((T - CUES.Pipeline - 2.4) * 0.32);
    const ROW_X0 = 269, CARD_W = 320, GAP = 34;

    return (
      <div data-screen-label={`t=${Math.floor(time)}s`}
        style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>
        {/* top bar */}
        <div style={{ position: 'absolute', left: 90, right: 90, top: 52, display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...MOTION.enter(T, 0.1) }}>
          <div style={{ font: `600 32px ${SANS}`, letterSpacing: '-0.01em' }}>coremantle<span style={{ color: ACCENT }}>.</span></div>
          <div style={{ font: `400 19px ${MONO}`, opacity: 0.5 }}>architecture&ensp;&middot;&ensp;voice stack</div>
        </div>

        {/* top row */}
        <TopCard x={150} w={430} at={0.25} T={T} dim={1}>
          <div style={{ font: `600 27px ${SANS}`, letterSpacing: '0.04em' }}>ENTERPRISE</div>
          <div style={{ font: `400 20px ${MONO}`, opacity: 0.62, lineHeight: 1.5 }}>BFSI &middot; HealthTech &middot; Logistics<br />eComm &middot; Legal &middot; AgriTech</div>
        </TopCard>
        <TopCard x={745} w={430} at={0.5} T={T} dim={1} tint={`rgba(246,244,239,0.28)`}>
          <div style={{ font: `600 27px ${SANS}`, letterSpacing: '0.04em' }}>AGENTIC AI LAYER</div>
          <div style={{ font: `400 20px ${MONO}`, opacity: 0.62 }}>routes &middot; decides &middot; responds</div>
        </TopCard>
        <TopCard x={1340} w={430} at={0.75} T={T} dim={apiDim} tint={warnK > 0.5 ? 'rgba(217,178,94,0.45)' : EDGE}>
          <div style={{ font: `600 27px ${SANS}`, letterSpacing: '0.04em' }}>API VENDORS</div>
          <div style={{ font: `400 20px ${MONO}`, opacity: 0.62 }}>ASR &middot; LLM &middot; TTS</div>
          <div style={{ font: `400 18px ${MONO}`, opacity: 0.45 }}>Deepgram &middot; Gemini &middot; ElevenLabs</div>
        </TopCard>
        <HArrow x0={592} x1={733} y={230} k={arrow1} color={'rgba(246,244,239,0.55)'} />
        <HArrow x0={1328} x1={1187} y={230} k={arrow2} color={'rgba(246,244,239,0.55)'} />

        {/* warning chip */}
        <div style={{
          position: 'absolute', left: 1555, top: 348, transform: 'translateX(-50%)',
          opacity: warnPop.opacity * apiDim,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px', whiteSpace: 'nowrap',
            border: `1px solid ${AMBER}`, borderRadius: 10, background: 'rgba(217,178,94,0.08)',
            font: `500 19px ${MONO}`, color: AMBER, transform: warnPop.transform, transformOrigin: '50% 0%',
          }}>&#9888;&ensp;fails for Indian context</div>
        </div>

        {/* live call data drop */}
        <div style={{ position: 'absolute', left: 985, top: 372, font: `500 italic 21px ${MONO}`, color: GREEN, opacity: liveIn.opacity }}>live call data</div>
        <div style={{ position: 'absolute', left: 959, top: 352, width: 2, height: 118 * dropK, background: GREEN, opacity: 0.8 }}>
          <div style={{
            position: 'absolute', bottom: -8, left: -5, width: 0, height: 0,
            borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
            borderTop: `9px solid ${GREEN}`, opacity: dropK > 0.95 ? 1 : 0,
          }} />
        </div>

        {/* platform slab (tilted) */}
        <div style={{ position: 'absolute', inset: 0, perspective: 1900, perspectiveOrigin: '50% 30%' }}>
          <div style={{
            position: 'absolute', left: 200, top: 488, width: 1520, height: 372,
            transform: `rotateX(${14 * slabK}deg) translateY(${(1 - slabK) * 70}px)`, transformOrigin: '50% 100%',
            opacity: slabK, borderRadius: 26, border: `1px solid ${EDGE}`, background: GLASS,
            boxShadow: `0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(246,244,239,0.08)`,
          }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 26, opacity: 0.5,
              backgroundImage: 'repeating-linear-gradient(90deg, rgba(246,244,239,0.04) 0 1px, transparent 1px 76px), repeating-linear-gradient(0deg, rgba(246,244,239,0.04) 0 1px, transparent 1px 76px)',
            }} />
            {/* title */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 34, textAlign: 'center', ...titleIn }}>
              <span style={{ font: `600 31px ${SANS}`, letterSpacing: '0.08em' }}>COREMANTLE DATA INTELLIGENCE LAYER</span>
            </div>
            {/* stage cards */}
            {STAGES.map((s, i) => {
              const at = CUES.Pipeline + i * 0.55;
              const pop = MOTION.pop(T, at, 0.5);
              const last = i === 3;
              return (
                <div key={i} style={{
                  position: 'absolute', left: ROW_X0 + i * (CARD_W + GAP), top: 118, width: CARD_W, height: 168,
                  boxSizing: 'border-box', borderRadius: 16, padding: '24px 24px',
                  border: `1px solid ${last && glowK > 0 ? ACCENT : EDGE}`,
                  background: 'rgba(14,13,11,0.55)',
                  boxShadow: last && glowK > 0 ? `0 0 ${34 * glowK}px rgba(94,106,210,0.35)` : 'none',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  opacity: pop.opacity, transform: pop.transform, transition: 'border-color 0.4s',
                }}>
                  <div style={{ font: `400 17px ${MONO}`, opacity: 0.45 }}>{s.n}</div>
                  <div style={{ font: `600 22px ${SANS}`, letterSpacing: '0.03em', lineHeight: 1.3 }}>{s.label}</div>
                </div>
              );
            })}
            {/* connectors + pulse */}
            {[0, 1, 2].map((i) => {
              const x0 = ROW_X0 + CARD_W + i * (CARD_W + GAP);
              const k = MOTION.draw(T, CUES.Pipeline + i * 0.55 + 0.45, 0.35);
              return <div key={i} style={{ position: 'absolute', left: x0, top: 201, width: GAP * k, height: 2, background: 'rgba(246,244,239,0.4)' }} />;
            })}
            {pulseOn ? <div style={{
              position: 'absolute', left: ROW_X0 + pulseP * (3 * (CARD_W + GAP) + CARD_W) - 5, top: 197,
              width: 10, height: 10, borderRadius: 5, background: ACCENT, boxShadow: `0 0 14px ${ACCENT}`,
            }} /> : null}
          </div>
        </div>

        {/* replaces path — right side, dashed */}
        {replaceK > 0 ? <div style={{ opacity: Math.min(replaceK * 2, 1) * 0.9 }}>
          <div style={{ position: 'absolute', left: 1810, top: 620 - 330 * replaceK, width: 0, height: 330 * replaceK, borderLeft: `2px dashed ${GREEN}` }} />
          <div style={{ position: 'absolute', left: 1740, top: 618, width: 70, borderTop: `2px dashed ${GREEN}`, opacity: replaceK > 0.1 ? 1 : 0 }} />
          <div style={{ position: 'absolute', left: 1774, top: 288, width: 36 * MOTION.draw(T, CUES.Replace + 0.8, 0.3), borderTop: `2px dashed ${GREEN}` }} />
          <div style={{
            position: 'absolute', left: 1808, top: 420, transform: 'translateX(-100%)',
            padding: '6px 14px', font: `500 19px ${MONO}`, color: GREEN, whiteSpace: 'nowrap',
            border: `1px solid rgba(157,191,149,0.4)`, borderRadius: 8, background: BG,
            ...MOTION.pop(T, CUES.Replace + 0.55, 0.4),
          }}>&#8645; replaces</div>
        </div> : null}

        {/* footer — model-ready output */}
        <div style={{
          position: 'absolute', left: 200, right: 200, bottom: 58, height: 66, boxSizing: 'border-box',
          borderRadius: 999, border: `1px solid ${EDGE}`, background: GLASS,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30, whiteSpace: 'nowrap',
          ...footIn,
        }}>
          <span style={{ font: `600 22px ${SANS}`, letterSpacing: '0.03em', color: GREEN }}>MODEL-READY OUTPUT</span>
          <span style={{ opacity: 0.25 }}>|</span>
          <span style={{ font: `400 18px ${MONO}`, opacity: 0.65 }}>every dataset verified &amp; certified</span>
          <span style={{ opacity: 0.25 }}>|</span>
          <span style={{ font: `400 18px ${MONO}`, opacity: 0.65 }}>95% quality score &middot; &lt;5% WER</span>
          <span style={{ opacity: 0.25 }}>|</span>
          <span style={{ font: `400 18px ${MONO}`, opacity: 0.65 }}>multimodal &middot; vertical-specific</span>
        </div>
      </div>
    );
  }

  function CoremantleArch() {
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
  window.CoremantleArch = CoremantleArch;
})();

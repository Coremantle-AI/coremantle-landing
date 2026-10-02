// bidtech-voice-scene.jsx — Core Voice AI fold: audio streams through a glass panel,
// then the view pulls apart into depth-stacked 3D layers (wireframe grid / raw audio / annotation boxes).
// Card-sized reuse of the original coremantle hero scene; the close card lands the
// "data benchmarks miss" line instead of the wordmark.
// Portrait hosts (phones) get their own 900x1150 canvas + layout — the desktop
// 1920x1080 canvas letterboxes into a tiny strip inside a portrait fold box.
(function () {
  const E = window.Easing, clamp = window.clamp;
  const BG = '#0e0d0b', CREAM = '#f6f4ef', GLASS = 'rgba(246,244,239,0.045)', EDGE = 'rgba(246,244,239,0.16)';
  const RAW = 'rgba(246,244,239,0.28)', S1 = '#8fb0d4', S2 = '#c3c8f6', NOISE = '#d9b25e';
  const MONO = '"IBM Plex Mono", monospace';
  const SANS = '"Space Grotesk", sans-serif';
  const DEVANAGARI = '"Noto Sans Devanagari", "Space Grotesk", sans-serif';

  const MOTION = {
    enter: (T, start, dur = 0.5, dy = 16) => {
      const k = clamp((T - start) / dur, 0, 1), e = E.easeOutCubic(k);
      return { opacity: e, transform: `translateY(${(1 - e) * dy}px)` };
    },
    pop: (T, start, dur = 0.4) => {
      const k = clamp((T - start) / dur, 0, 1), e = E.easeOutBack(k);
      return { opacity: clamp(k * 3, 0, 1), transform: `scale(${0.94 + 0.06 * e})` };
    },
    draw: (T, start, dur = 0.5) => E.easeInOutSine(clamp((T - start) / dur, 0, 1)),
  };

  // per-orientation layout: canvas size, panel geometry, type scale. The scroll
  // page gives the hero fold a 900/1150 box on phones, so the portrait canvas
  // fills it edge to edge instead of letterboxing the landscape one.
  const LAYOUTS = {
    desktop: {
      W: 1920, H: 1080, CX: 960, CY: 560,
      panelW: 1160, panelH: 540, fade: 130,
      hlY0: 400, hlY1: 128, hlFont: 78, hlWrap: 'nowrap', hlMaxW: 'none', hlGap: 22, hlLine: 1.2,
      back: { dx: 150, dy: -90, z: -320 }, front: { dx: -160, dy: 100, z: 320 },
      rotX: 7, rotY: -15, cam: 0.05, chipLift: 120,
      mono: 20, chipFont: 24, transFont: 24, readout: 20,
      endFont: 82, endSub: 27, endPad: '0 60px',
    },
    mobile: {
      W: 600, H: 1150, CX: 300, CY: 660,
      panelW: 560, panelH: 470, fade: 50,
      hlY0: 330, hlY1: 104, hlFont: 54, hlWrap: 'wrap', hlMaxW: 470, hlGap: '4px 14px', hlLine: 1.08,
      back: { dx: 40, dy: -70, z: -260 }, front: { dx: -40, dy: 78, z: 260 },
      rotX: 5, rotY: -8, cam: 0.02, chipLift: 72,
      mono: 20, chipFont: 24, transFont: 26, readout: 20,
      endFont: 52, endSub: 24, endPad: '0 30px',
    },
  };

  // ── audio clock: 6.6 authored seconds flow through Stream + PullApart ──
  const STREAM_DUR = 6.6, V = 240, DT = 0.05;
  const fract = (x) => x - Math.floor(x);
  const rnd = (i, s) => fract(Math.sin(i * 127.1 + s * 311.7) * 43758.5453);
  const SEGS = [
    { t0: 0.0, t1: 1.5, c: S1, sp: 'S1', label: 'speaker: S1' },
    { t0: 1.5, t1: 2.9, c: S2, sp: 'S2', label: 'speaker: S2' },
    { t0: 2.9, t1: 4.0, c: NOISE, noise: true, label: 'noise · crosstalk' },
    { t0: 4.0, t1: 5.4, c: S1, sp: 'S1', label: 'PII · redacted' },
    { t0: 5.4, t1: STREAM_DUR, c: S2, sp: 'S2', label: '⚑ invalid word' },
  ];
  const MARKERS = [
    { t0: 0.0, label: 'Speech accurately transcribed', c: S1 },
    { t0: 1.2, label: 'Audio segmented + timestamped', c: S2 },
    { t0: 2.4, label: 'Code-switching detected', c: NOISE },
    { t0: 3.6, label: 'Dialect, accent + context tagged', c: S1 },
    { t0: 4.7, label: 'PII · redacted', c: CREAM },
    { t0: 5.4, label: '⚑ invalid word', c: S2 },
  ];
  const PII = [4.4, 4.9], INVALID = [5.8, 6.1];
  const segOf = (t) => SEGS.find((s) => t >= s.t0 && t < s.t1) || SEGS[SEGS.length - 1];
  const markerOf = (t) => {
    for (let i = MARKERS.length - 1; i >= 0; i -= 1) {
      if (t >= MARKERS[i].t0) return MARKERS[i];
    }
    return MARKERS[0];
  };
  const BARS = [];
  for (let i = 0; i < 264; i++) {
    const tau = -3.2 + i * DT;
    let amp = 0.3 + 0.62 * Math.abs(Math.sin(i * 0.53) * 0.6 + Math.sin(i * 0.17) * 0.4);
    amp *= 0.55 + 0.45 * rnd(i, 1);
    if (tau >= 2.9 && tau < 4.0) amp = 0.55 + 0.45 * rnd(i, 2);
    for (const b of [0, 1.5, 2.9, 4.0, 5.4, STREAM_DUR]) amp *= clamp(Math.abs(tau - b) * 5.5, 0.16, 1);
    BARS.push({ tau, amp: clamp(amp, 0.06, 1) });
  }
  const TICKS = [];
  for (let t = 0; t <= 26; t += 0.5) TICKS.push(t - 6);

  // words settle by T=1.0 so the page's scrub can start on the composed
  // headline (data-seam-in on the fold host) instead of a half-faded stagger
  const HEADLINE = ['Raw', 'audio', 'in.', 'Ground', 'truth', 'out.'];
  const HL_IN = (i) => 0.15 + i * 0.07;
  const TRANSCRIPT = [
    { at: 0.35, text: 'नमस्ते' },
    { at: 1.35, text: 'acme' },
    { at: 2.15, text: 'technologies' },
    { at: 3.45, text: 'में' },
    { at: 4.05, text: 'आपका' },
    { at: 4.85, text: 'स्वागत' },
    { at: 5.75, text: 'है' },
  ];
  // annotation boxes on the front layer: [t0, t1, label, colorKey]
  const BOXES = SEGS.map((s) => ({ t0: s.t0, t1: s.t1, label: s.sp || 'noise', c: s.c }));

  function Panel({ L, z, dx, dy, pullK, vis, border, children }) {
    return (
      <div style={{
        position: 'absolute', left: L.CX - L.panelW / 2, top: L.CY - L.panelH / 2,
        width: L.panelW, height: L.panelH, transform: `translate3d(${dx * pullK}px, ${dy * pullK}px, ${z * pullK}px)`,
        borderRadius: 20, border: border ? `1px solid ${EDGE}` : 'none',
        background: border ? GLASS : 'transparent', opacity: vis, overflow: 'hidden',
      }}>
        {children}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: L.fade, background: `linear-gradient(90deg, ${BG}, rgba(14,13,11,0))`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: L.fade, background: `linear-gradient(270deg, ${BG}, rgba(14,13,11,0))`, pointerEvents: 'none' }} />
      </div>
    );
  }

  function Piece({ tw, mobile }) {
    const { T, CUES, time, authoredTotal } = window.useComposition();
    const ACCENT = tw.accent;
    const L = mobile ? LAYOUTS.mobile : LAYOUTS.desktop;
    const tPlay = clamp(T - CUES.Stream, 0, STREAM_DUR);
    const marker = markerOf(Math.min(tPlay, STREAM_DUR - 0.01));
    const chipAt = CUES.Stream + marker.t0;
    const chipPop = MOTION.pop(T, chipAt, 0.4);
    const chipDot = marker.label.startsWith('⚑') ? ACCENT : marker.c;
    const redactK = MOTION.draw(tPlay, PII[1] - 0.1, 0.4);
    const invalidK = MOTION.draw(tPlay, INVALID[1] + 0.05, 0.4);
    const pullK = MOTION.draw(T, CUES.PullApart - 0.2, 1.3);
    const exitK = MOTION.draw(T, CUES.Close, 0.65);
    const seam = Math.min(MOTION.draw(T, 0, 0.35), 1 - MOTION.draw(T, authoredTotal - 0.35, 0.35));
    const hlY = L.hlY0 + (L.hlY1 - L.hlY0) * MOTION.draw(T, CUES.Stream - 0.5, 0.9);
    const hlFade = 1 - MOTION.draw(T, CUES.PullApart - 0.1, 0.6);
    const hlS = 1 - 0.4 * MOTION.draw(T, CUES.Stream - 0.5, 0.9);
    const streamIn = MOTION.enter(T, CUES.Stream - 0.15, 0.6, 26);
    const readout = `00:${String(Math.floor(tPlay)).padStart(2, '0')}.${String(Math.floor((tPlay % 1) * 10))}`;
    const sx = (tau) => L.panelW / 2 + (tau - tPlay) * V;
    const camS = 1 + L.cam * pullK;
    // panel corner tags: near-illegible at phone scale, and the small mobile
    // pull offsets stack all three on top of each other mid-pull — desktop only
    const tags = !mobile;

    return (
      <div data-screen-label={`t=${Math.floor(time)}s`}
        style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>
        {/* invisible layers unmount entirely: keeping opacity-0 text mounted
            leaves stale raster tiles behind on fast scroll scrubs */}
        {exitK < 1 ? <div style={{ position: 'absolute', inset: 0, opacity: 1 - exitK, transform: `translateY(${-36 * E.easeInCubic(exitK)}px) scale(${1 - 0.05 * exitK})` }}>
          {/* top bar */}
          {!mobile ? <div style={{ position: 'absolute', left: 90, right: 90, top: 60, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', ...MOTION.enter(T, 0.15) }}>
            <div style={{ font: `400 19px ${MONO}`, opacity: 0.5 }}>session_0142.wav&ensp;&middot;&ensp;live&ensp;&middot;&ensp;48 kHz</div>
          </div> : null}

          {/* headline */}
          {hlFade > 0 ? <div style={{ position: 'absolute', left: 0, right: 0, top: hlY, textAlign: 'center', transform: `scale(${hlS})`, opacity: hlFade }}>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: L.hlWrap, maxWidth: L.hlMaxW, margin: '0 auto', gap: L.hlGap, font: `500 ${L.hlFont}px ${SANS}`, lineHeight: L.hlLine, letterSpacing: '-0.015em' }}>
              {HEADLINE.map((w, i) => (
                <span key={i} style={{ display: 'inline-block', ...MOTION.enter(T, HL_IN(i), 0.5, 30) }}>{w}</span>
              ))}
            </div>
          </div> : null}

          {/* 3D stage */}
          <div style={{ position: 'absolute', inset: 0, perspective: 2200, perspectiveOrigin: '50% 42%', ...streamIn }}>
            <div style={{
              position: 'absolute', inset: 0, transformStyle: 'preserve-3d',
              transform: `scale(${camS}) rotateX(${L.rotX * pullK}deg) rotateY(${L.rotY * pullK}deg)`,
            }}>
              {/* back layer — wireframe time grid */}
              <Panel L={L} z={L.back.z} dx={L.back.dx} dy={L.back.dy} pullK={pullK} vis={clamp(pullK * 1.5 - 0.2, 0, 1)} border={true}>
                {TICKS.map((t, i) => {
                  const x = sx(t);
                  if (x < -20 || x > L.panelW + 20) return null;
                  const major = Math.abs(t - Math.round(t)) < 0.01;
                  return <div key={i}>
                    <div style={{ position: 'absolute', left: x, top: 0, bottom: 0, width: 1, borderLeft: `1px dashed rgba(246,244,239,${major ? 0.16 : 0.07})` }} />
                    {major && t >= 0 ? <div style={{ position: 'absolute', left: x + 8, bottom: 14, font: `400 ${L.mono}px ${MONO}`, opacity: 0.45 }}>00:{String(Math.round(t)).padStart(2, '0')}</div> : null}
                  </div>;
                })}
                <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', borderTop: '1px dashed rgba(246,244,239,0.12)' }} />
                {tags ? <div style={{ position: 'absolute', left: 16, top: 12, font: `400 ${L.mono}px ${MONO}`, opacity: 0.45, letterSpacing: '0.12em' }}>TIMEBASE</div> : null}
              </Panel>

              {/* middle layer — the raw stream */}
              <Panel L={L} z={0} dx={0} dy={0} pullK={pullK} vis={1} border={true}>
                {BARS.map((b, i) => {
                  const x = sx(b.tau);
                  if (x < -20 || x > L.panelW + 20) return null;
                  const passed = b.tau < tPlay;
                  return <div key={i} style={{
                    position: 'absolute', left: x - 3, top: '50%', width: 6, borderRadius: 3,
                    height: Math.max(6, b.amp * 250), transform: 'translateY(-50%)',
                    background: passed ? segOf(b.tau).c : RAW,
                  }} />;
                })}
                {/* PII redaction block rides with the stream */}
                {redactK > 0 ? <div style={{
                  position: 'absolute', left: sx(PII[0]), top: '50%', transform: 'translateY(-50%)',
                  width: (PII[1] - PII[0]) * V, height: 90, background: CREAM, borderRadius: 8,
                  clipPath: `inset(0 ${(1 - redactK) * 100}% 0 0 round 8px)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ font: `600 16px ${MONO}`, color: BG, letterSpacing: '0.2em' }}>&#9608;&#9608;&#9608;&#9608;</span>
                </div> : null}
                {/* scan line lives on the stream plane */}
                <div style={{ position: 'absolute', left: L.panelW / 2 - 1, top: 20, bottom: 20, width: 2, background: ACCENT, borderRadius: 2, boxShadow: `0 0 18px ${ACCENT}` }} />
                {tags ? <div style={{ position: 'absolute', left: 16, top: 12, font: `400 ${L.mono}px ${MONO}`, opacity: 0.45 * clamp(pullK * 2, 0, 1), letterSpacing: '0.12em' }}>RAW AUDIO</div> : null}
                {/* time readout pinned inside the stream plane (top on mobile:
                    the bottom edge is where the transcript plane lands) */}
                <div style={{
                  position: 'absolute', left: L.panelW / 2, ...(mobile ? { top: 14 } : { bottom: 14 }), transform: 'translateX(-50%)',
                  background: CREAM, color: BG, font: `500 ${L.readout}px ${MONO}`, padding: '4px 12px', borderRadius: 6, whiteSpace: 'nowrap',
                }}>{readout}</div>
              </Panel>

              {/* front layer — annotation bounding boxes */}
              <Panel L={L} z={L.front.z} dx={L.front.dx} dy={L.front.dy} pullK={pullK} vis={clamp(pullK * 1.5, 0, 1)} border={true}>
                {BOXES.map((b, i) => {
                  const x0 = sx(b.t0) + 6, w = (b.t1 - b.t0) * V - 12;
                  if (x0 + w < -20 || x0 > L.panelW + 20) return null;
                  const passed = b.t0 < tPlay;
                  return <div key={i} style={{
                    position: 'absolute', left: x0, top: '50%', transform: 'translateY(-50%)', width: w, height: 170,
                    border: `1.5px solid ${b.c}`, borderRadius: 8, opacity: passed ? 0.95 : 0.3,
                  }}>
                    <div style={{
                      position: 'absolute', left: -1.5, top: -26, padding: '2px 10px', background: b.c, color: BG,
                      font: `600 20px ${MONO}`, borderRadius: '5px 5px 5px 0',
                    }}>{b.label}</div>
                  </div>;
                })}
                {/* PII + invalid markers on the annotation plane */}
                {redactK > 0 ? <div style={{
                  position: 'absolute', left: sx(PII[0]), top: '50%', marginTop: 50, width: (PII[1] - PII[0]) * V,
                  borderBottom: `3px solid ${CREAM}`, opacity: redactK * 0.9,
                }}>
                  <div style={{ position: 'absolute', left: 0, top: 4, font: `500 18px ${MONO}`, color: CREAM, opacity: 0.8 }}>PII</div>
                </div> : null}
                {invalidK > 0 ? <div style={{
                  position: 'absolute', left: sx(INVALID[0]), top: '50%', marginTop: 50, width: (INVALID[1] - INVALID[0]) * V,
                  borderBottom: `3px dotted ${ACCENT}`, opacity: invalidK,
                }}>
                  <div style={{ position: 'absolute', left: 0, top: 4, font: `500 18px ${MONO}`, color: ACCENT }}>&#9873; invalid</div>
                </div> : null}
                {tags ? <div style={{ position: 'absolute', left: 16, top: 12, font: `400 ${L.mono}px ${MONO}`, opacity: 0.45, letterSpacing: '0.12em' }}>ANNOTATIONS</div> : null}
              </Panel>

              {/* transparent transcript plane, slightly in front of the annotation panel */}
              {T >= CUES.Stream - 0.15 && T < CUES.Close ? <div style={{
                position: 'absolute', zIndex: 4,
                left: L.CX - L.panelW / 2,
                top: L.CY - L.panelH / 2,
                width: L.panelW, height: L.panelH,
                transform: `translate3d(${L.front.dx * pullK}px, ${L.front.dy * pullK}px, ${(L.front.z + 2) * pullK}px)`,
                pointerEvents: 'none', opacity: MOTION.draw(T, CUES.Stream - 0.15, 0.45),
              }}>
                <div style={{
                  position: 'absolute', left: 28, right: 28, bottom: 46, height: 66,
                  overflow: 'hidden', borderTop: '1px solid rgba(246,244,239,0.22)',
                }}>
                  <div style={{ position: 'absolute', left: 0, top: 8, color: 'rgba(246,244,239,0.42)', font: `500 16px/1 ${MONO}`, letterSpacing: '0.14em' }}>TRANSCRIPT</div>
                  {TRANSCRIPT.map((token, i) => {
                    const nextAt = TRANSCRIPT[i + 1] ? TRANSCRIPT[i + 1].at : STREAM_DUR;
                    const active = tPlay >= token.at && tPlay < nextAt;
                    const passed = tPlay >= nextAt;
                    return <span key={token.at} style={{
                      position: 'absolute', left: sx(token.at) - 20, top: 28,
                      padding: '4px 10px 5px', borderRadius: 6, whiteSpace: 'nowrap',
                      background: active ? ACCENT : 'transparent',
                      color: active ? BG : CREAM,
                      opacity: active ? 1 : passed ? 0.68 : 0.4,
                      font: `500 ${L.transFont}px/1.2 ${DEVANAGARI}`,
                    }}>{token.text}</span>;
                  })}
                </div>
              </div> : null}
            </div>
          </div>

          {/* the updating annotation marker */}
          {T >= CUES.Stream - 0.15 ? <div style={{ position: 'absolute', left: L.CX, top: L.CY - L.panelH / 2 - 26, transform: `translate(-50%, ${-L.chipLift * pullK}px)` }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px',
              background: '#1a1915', border: `1px solid rgba(246,244,239,0.3)`, borderRadius: 999,
              font: `500 ${L.chipFont}px ${MONO}`, color: CREAM, whiteSpace: 'nowrap',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)', transformOrigin: '50% 100%',
              opacity: chipPop.opacity, transform: chipPop.transform,
            }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: chipDot, flex: 'none' }} />
              {marker.label}
            </div>
          </div> : null}
        </div> : null}

        {/* end card */}
        {T >= CUES.Close + 0.3 ? <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, pointerEvents: 'none', textAlign: 'center', padding: L.endPad }}>
          <div style={{ font: `500 ${L.endFont}px ${SANS}`, letterSpacing: '-0.02em', ...MOTION.enter(T, CUES.Close + 0.35, 0.6, 22) }}>
            coremantle<span style={{ color: ACCENT }}>.</span>
          </div>
          <div style={{ font: `400 ${L.endSub}px ${MONO}`, opacity: 0.65, ...MOTION.enter(T, CUES.Close + 0.6, 0.6, 16) }}>
            Training-ready data intelligence
          </div>
        </div> : null}
      </div>
    );
  }

  function CoremantleVideo() {
    const [tw, setTweak] = window.useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, accent: '#5E6AD2' });
    // portrait host box → phone layout + portrait canvas (the page gives folds
    // a 900/1150 aspect on mobile, so the canvas fills it instead of letterboxing)
    const [mobile, setMobile] = React.useState(() => window.innerHeight > window.innerWidth);
    React.useEffect(() => {
      const update = () => setMobile(window.innerHeight > window.innerWidth);
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }, []);
    const L = mobile ? LAYOUTS.mobile : LAYOUTS.desktop;
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <window.CompositionStage width={L.W} height={L.H} bg={BG} autoplay={false} fit="contain"
          scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
          <Piece tw={tw} mobile={mobile} />
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
  window.BidtechVoice = CoremantleVideo;
})();

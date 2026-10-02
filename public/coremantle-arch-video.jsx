// coremantle-arch-video.jsx — the CoreMantle architecture as a living pipeline.
// Beat 1: enterprise audio streams straight to generic API vendors and fails
// for the Indian context (23%). Beat 2-3: the CoreMantle path opens — annotate /
// verify / certify gates, noisy clips caught before they burn compute. Beat 4:
// certified data trains YOUR custom model; accuracy climbs 23% -> 91%.
(function () {
  const E = window.Easing, clamp = window.clamp;
  const BG = '#0e0d0b', CREAM = '#f6f4ef', GLASS = 'rgba(246,244,239,0.045)', EDGE = 'rgba(246,244,239,0.16)';
  const LAV = '#8b93e8', AMBER = '#d9b25e', RED = '#cf6b4f', BLUE = '#8fb0d4';
  const MONO = '"IBM Plex Mono", monospace';
  const SANS = '"Space Grotesk", sans-serif';
  const fract = (x) => x - Math.floor(x);
  const rnd = (i, s) => fract(Math.sin(i * 127.1 + s * 311.7) * 43758.5453);
  const lerp = (a, b, k) => a + (b - a) * k;
  const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };

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

  // ── geometry (1920×1080 stage) — a headline tops the frame; the pipeline owns the rest ──
  const TITLE = ['How Coremantle’s data intelligence ensures ', 'highest training efficiency'];
  const PIPE_Y = 570;
  const SRC_X = 90, SRC_W = 300;
  const PANEL = { x: 460, y: 320, w: 830, h: 500 };
  const GATES = [
    { x: 600, label: 'ANNOTATE', c: BLUE },
    { x: 875, label: 'VERIFY', c: AMBER },
    { x: 1150, label: 'CERTIFY', c: LAV },
  ];
  const LANES = [380, 570, 760];
  const VENDOR = { x: 1420, y: 420, w: 430, h: 170 };
  const BYP_Y = VENDOR.y + VENDOR.h / 2;             // the bypass lane rides straight across
  const MODEL = { x: 1420, y: 400, w: 430, h: 290 }; // takes the vendors' spot once they fade

  const SOURCES = [
    { title: 'Contact centre', sub: 'calls · BFSI · support' },
    { title: 'Field audio', sub: 'logistics · agri · retail' },
    { title: 'Archives', sub: 'IVR · docs · recordings' },
  ];
  const TAGS = ['hi-IN', 'S1', 'intent', 'ta-IN', 'entity', 'S2', 'bn-IN', 'PII✓'];
  const FRAGS = ['▂▅▃▇', 'wav_04', '▅▂▆▁', '0x3f2', '····', '▃▇▄▂', 'wav_11', '▆▁▅▃'];

  // main-path particles: each owns a vertical channel inside the panel
  // portrait geometry (900×1600 stage): sources row -> vendors -> panel -> model,
  // with the pipeline flowing top to bottom instead of left to right
  const MLANES = [192, 450, 708];
  const MSRC = { y: 120, h: 120, w: 240, xs: [72, 330, 588] };
  const MVEND = { x: 170, y: 350, w: 560, h: 120 };
  const MPANEL = { x: 50, y: 600, w: 800, h: 430 };
  const MGY = [705, 825, 945];
  const MMODEL = { x: 180, y: 1180, w: 540, h: 260 };

  const N = 16;
  const PARTS = [];
  for (let i = 0; i < N; i++) {
    PARTS.push({
      ph: rnd(i, 1), spd: 0.06 + rnd(i, 2) * 0.09,
      lane: LANES[i % 3] + (rnd(i, 3) - 0.5) * 40,
      mlane: MLANES[i % 3] + (rnd(i, 3) - 0.5) * 40,
      chan: (((i * 5) % 9) - 4) * 36,
      noisy: rnd(i, 4) < 0.3,
      frag: FRAGS[i % FRAGS.length], tag: TAGS[i % TAGS.length],
    });
  }
  // bypass particles: straight over the top to the generic vendors
  const BYP = [];
  for (let i = 0; i < 7; i++) {
    BYP.push({
      ph: rnd(i, 7), spd: 0.11 + rnd(i, 8) * 0.06,
      lane: LANES[i % 3] + (rnd(i, 9) - 0.5) * 30,
      mlane: MLANES[i % 3] + (rnd(i, 9) - 0.5) * 36,
      frag: FRAGS[(i * 3 + 1) % FRAGS.length],
    });
  }

  function Card({ x, y, w, h, children, T, at, dim = 0, fade = 0 }) {
    const pop = MOTION.pop(T, at, 0.5);
    return (
      <div style={{
        position: 'absolute', left: x, top: y, width: w, height: h, boxSizing: 'border-box',
        borderRadius: 16, border: `1px solid ${EDGE}`, background: GLASS,
        padding: '22px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8,
        opacity: pop.opacity * (1 - dim * 0.6) * (1 - fade), transform: pop.transform,
      }}>{children}</div>
    );
  }

  function Piece({ tw, mobile }) {
    const { T, CUES, time } = window.useComposition();
    const ACCENT = tw.accent;
    const seam = MOTION.draw(T, 0, 0.35);

    const statusOn = MOTION.draw(T, CUES.Status + 0.15, 0.5);        // vendors beat
    const bypT = Math.max(0, T - CUES.Status);
    const warnK = MOTION.pop(T, CUES.Status + 1.1, 0.5);
    const bypDim = MOTION.draw(T, CUES.Refine, 0.8);                 // old path fades once ours opens
    const vendGone = MOTION.draw(T, CUES.Train - 0.6, 0.6);          // vendors clear out; the model takes their spot

    const flowT = Math.max(0, T - CUES.Intake);
    const flowOn = MOTION.draw(T, CUES.Intake + 0.15, 0.6);
    const panelPop = MOTION.draw(T, CUES.Refine - 0.3, 0.5);
    const gateK = GATES.map((g, i) => MOTION.draw(T, CUES.Refine + i * 0.55, 0.5));
    const statK = MOTION.draw(T, CUES.Refine + 1.7, 0.8);
    const rejN = Math.round(lerp(0, 12406, MOTION.draw(T, CUES.Refine + 1.0, 4.5)));

    const trainK = MOTION.draw(T, CUES.Train, 0.5);
    const accK = MOTION.draw(T, CUES.Train + 0.4, 1.9);
    const acc = Math.round(lerp(23, 91, accK));
    const epoch = Math.max(1, Math.ceil(accK * 12));
    const loss = (1.84 - 1.53 * accK).toFixed(2);

    // main path: source lane -> own channel inside the panel -> the model card
    const px = (p, prog) => {
      const x = lerp(SRC_X + SRC_W, MODEL.x + 30, prog);
      const conv = smooth(0.04, 0.22, prog) * (1 - smooth(0.72, 0.92, prog));
      const chanY = PIPE_Y + p.chan + Math.sin(prog * 14 + p.ph * 9) * 6;
      const y = lerp(lerp(p.lane, MODEL.y + MODEL.h / 2, smooth(0.72, 0.92, prog)), chanY, conv);
      return { x, y };
    };

    if (mobile) {
      // portrait: same beats, pipeline flows top to bottom
      const pxm = (p, prog) => {
        const y = lerp(MSRC.y + MSRC.h, MMODEL.y + 26, prog);
        const conv = smooth(0.05, 0.24, prog) * (1 - smooth(0.72, 0.92, prog));
        const chanX = 450 + p.chan * 1.7 + Math.sin(prog * 14 + p.ph * 9) * 6;
        const x = lerp(lerp(p.mlane, 450, smooth(0.72, 0.92, prog)), chanX, conv);
        return { x, y };
      };
      return (
        <div data-screen-label={`t=${Math.floor(time)}s`}
          style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0 }}>

            {/* sources row */}
            <div style={{ position: 'absolute', left: MSRC.xs[0], top: MSRC.y - 42, font: `400 16px ${MONO}`, letterSpacing: '0.14em', opacity: 0.45 * statusOn }}>YOUR RAW DATA</div>
            {SOURCES.map((s, i) => (
              <Card key={i} x={MSRC.xs[i]} y={MSRC.y} w={MSRC.w} h={MSRC.h} T={T} at={CUES.Status + i * 0.14}>
                <div style={{ font: `600 22px ${SANS}` }}>{s.title}</div>
                <div style={{ font: `400 13px ${MONO}`, opacity: 0.55 }}>{s.sub}</div>
              </Card>
            ))}

            {/* the status quo: generic API vendors */}
            <div style={{ position: 'absolute', left: MVEND.x, top: MVEND.y - 36, font: `400 16px ${MONO}`, letterSpacing: '0.14em', opacity: 0.45 * statusOn * (1 - bypDim * 0.6) }}>TODAY</div>
            <Card x={MVEND.x} y={MVEND.y} w={MVEND.w} h={MVEND.h} T={T} at={CUES.Status + 0.3} dim={bypDim}>
              <div style={{ font: `600 23px ${SANS}` }}>Generic APIs <span style={{ font: `400 15px ${MONO}`, opacity: 0.55, marginLeft: 8 }}>ASR · LLM · TTS</span></div>
              <div style={{ font: `400 14px ${MONO}`, opacity: 0.4 }}>Deepgram · Gemini · ElevenLabs</div>
            </Card>
            <div style={{
              position: 'absolute', left: MVEND.x, top: MVEND.y + MVEND.h + 12, width: MVEND.w, boxSizing: 'border-box',
              padding: '9px 14px', borderRadius: 10, border: `1px solid ${RED}66`, background: 'rgba(207,107,79,0.07)',
              font: `500 16px/1.5 ${MONO}`, color: RED, textAlign: 'center',
              opacity: warnK.opacity * (1 - bypDim * 0.45), transform: warnK.transform,
            }}>⚠ fails for Indian context · 23% accuracy</div>

            {/* bypass particles: straight down to the vendors */}
            {T >= CUES.Status ? BYP.map((p, i) => {
              const prog = fract(p.ph + bypT * p.spd);
              const y = lerp(MSRC.y + MSRC.h, MVEND.y + 30, prog);
              const x = lerp(p.mlane, 450, smooth(0.15, 0.7, prog));
              const failing = prog > 0.88;
              const vis = statusOn * (1 - bypDim * 0.8) * Math.min(clamp(prog * 8, 0, 1), clamp((1 - prog) * 7, 0, 1));
              return (
                <div key={'b' + i} style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', opacity: vis, whiteSpace: 'nowrap' }}>
                  <span style={{ font: `500 16px ${MONO}`, color: failing ? RED : 'rgba(246,244,239,0.5)' }}>
                    {failing ? '✗ ' + p.frag : p.frag}
                  </span>
                </div>
              );
            }) : null}

            {/* central CoreMantle panel */}
            <div style={{
              position: 'absolute', left: MPANEL.x, top: MPANEL.y, width: MPANEL.w, height: MPANEL.h, boxSizing: 'border-box',
              borderRadius: 22, border: `1px solid ${EDGE}`, background: GLASS, ...MOTION.pop(T, CUES.Refine - 0.3, 0.5),
            }}>
              <div style={{ position: 'absolute', left: 24, top: 18, font: `600 22px ${SANS}` }}>
                coremantle<span style={{ color: ACCENT }}>.</span>
                <span style={{ font: `400 13px ${MONO}`, opacity: 0.5, marginLeft: 10, letterSpacing: '0.1em' }}>DATA INTELLIGENCE LAYER</span>
              </div>
              <div style={{ position: 'absolute', right: 24, top: 52, textAlign: 'right', font: `500 15px ${MONO}`, color: LAV, opacity: statK }}>
                <span>dataset quality &gt;{Math.round(lerp(80, 95, statK))}%</span>
                <span style={{ opacity: 0.75, marginLeft: 14 }}>WER &lt;{Math.round(lerp(24, 10, statK))}%</span>
              </div>
            </div>

            {/* gates: horizontal bars the data falls through */}
            {GATES.map((g, i) => (
              <div key={i}>
                <div style={{
                  position: 'absolute', left: MPANEL.x + 24, top: MGY[i] - 1, width: (MPANEL.w - 48) * gateK[i], height: 2,
                  background: g.c, borderRadius: 2, boxShadow: `0 0 18px ${g.c}`, opacity: 0.9,
                }} />
                <div style={{
                  position: 'absolute', left: MPANEL.x + 28, top: MGY[i] - 26, font: `500 14px ${MONO}`, letterSpacing: '0.16em', color: g.c, opacity: gateK[i],
                }}>{g.label}</div>
              </div>
            ))}

            {/* rejected before the training bill */}
            <div style={{
              position: 'absolute', left: 130, top: MPANEL.y + MPANEL.h + 24, width: 640, boxSizing: 'border-box',
              border: `1px dashed ${RED}55`, borderRadius: 12, padding: '11px 16px', textAlign: 'center',
              opacity: MOTION.draw(T, CUES.Refine + 1.0, 0.5),
            }}>
              <div style={{ font: `500 17px ${MONO}`, color: RED }}>✗ noisy clips caught before training · {rejN.toLocaleString('en-US')}</div>
              <div style={{ font: `400 14px ${MONO}`, color: RED, opacity: 0.65, marginTop: 4 }}>rejected here, not after the GPU bill</div>
            </div>

            {/* main-path particles */}
            {T >= CUES.Intake ? PARTS.map((p, i) => {
              const prog = fract(p.ph + flowT * p.spd);
              const { x, y } = pxm(p, prog);
              const inPanel = y > MPANEL.y + 30 && y < MPANEL.y + MPANEL.h - 30;
              const annotated = gateK[0] > 0.5 && y > MGY[0];
              const certified = gateK[2] > 0.5 && y > MGY[2];
              const atVerify = gateK[1] > 0.5 && y > MGY[1];
              const fallK = p.noisy && atVerify ? clamp((y - MGY[1]) / 120, 0, 1) : 0;
              const xx = x + fallK * fallK * 300;
              const dead = fallK >= 1;
              const segVis = y > MPANEL.y + MPANEL.h - 50 ? trainK : y > MPANEL.y - 50 ? panelPop : 1;
              const vis = flowOn * segVis * Math.min(clamp(prog * 8, 0, 1), clamp((1 - prog) * 7, 0, 1)) * (dead ? 0 : 1);
              const c = certified ? LAV : p.noisy && atVerify ? RED : p.noisy && inPanel ? AMBER : annotated ? BLUE : 'rgba(246,244,239,0.55)';
              return (
                <div key={i} style={{ position: 'absolute', left: xx, top: y, transform: 'translate(-50%,-50%)', opacity: vis, whiteSpace: 'nowrap' }}>
                  <span style={{
                    padding: annotated ? '5px 12px' : '2px 6px',
                    border: annotated ? `1px solid ${c}` : '1px solid transparent',
                    borderRadius: 8, font: `500 16px ${MONO}`, color: c,
                    background: certified ? 'rgba(139,147,232,0.12)' : 'transparent',
                    boxShadow: certified ? `0 0 14px rgba(139,147,232,0.35)` : 'none',
                  }}>{certified ? '✓ ' + p.tag : annotated ? p.tag : p.frag}</span>
                </div>
              );
            }) : null}

            {/* the payoff: train YOUR custom model */}
            <div style={{ position: 'absolute', left: MMODEL.x, top: MMODEL.y - 32, font: `400 16px ${MONO}`, letterSpacing: '0.14em', opacity: 0.45 * trainK }}>TRAIN YOUR CUSTOM MODEL</div>
            <div style={{
              position: 'absolute', left: MMODEL.x, top: MMODEL.y, width: MMODEL.w, height: MMODEL.h, boxSizing: 'border-box',
              borderRadius: 18, border: `1px solid ${trainK > 0.5 ? LAV + '77' : EDGE}`, background: GLASS,
              padding: '24px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10,
              boxShadow: `0 0 ${40 * accK}px rgba(139,147,232,0.18)`, ...MOTION.pop(T, CUES.Train, 0.5),
            }}>
              <div style={{ font: `600 27px ${SANS}` }}>Your custom model</div>
              <div style={{ font: `400 15px ${MONO}`, opacity: 0.55 }}>trained on certified data</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', font: `500 16px ${MONO}`, color: LAV, marginTop: 6 }}>
                <span>epoch {String(epoch).padStart(2, '0')}/12</span>
                <span style={{ opacity: 0.8 }}>loss {loss}</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: 'rgba(246,244,239,0.1)', overflow: 'hidden' }}>
                <div style={{ width: `${accK * 100}%`, height: '100%', borderRadius: 4, background: LAV }} />
              </div>
              <div style={{ font: `400 14px ${MONO}`, opacity: 0.5, marginTop: 3 }}>ASR · TTS · LLM · agents</div>
            </div>

            {/* accuracy: theirs vs yours */}
            <div style={{ position: 'absolute', left: MMODEL.x, top: MMODEL.y + MMODEL.h + 24, width: MMODEL.w, opacity: MOTION.draw(T, CUES.Train + 0.3, 0.5) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', font: `400 16px ${MONO}`, opacity: 0.75 }}>
                <span>benchmark accuracy</span>
                <span style={{ font: `600 34px ${MONO}`, color: acc > 60 ? LAV : AMBER }}>{acc}%</span>
              </div>
              <div style={{ marginTop: 8, height: 8, borderRadius: 4, background: 'rgba(246,244,239,0.1)', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '23%', top: -2, bottom: -2, width: 2, background: RED, opacity: 0.7 }} />
                <div style={{ width: `${acc}%`, height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${AMBER}, ${LAV})` }} />
              </div>
              <div style={{ marginTop: 6, font: `400 14px ${MONO}`, opacity: 0.5 }}>generic APIs 23% → yours 91% · 500 hrs of call data</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div data-screen-label={`t=${Math.floor(time)}s`}
        style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>

          {/* scene headline */}
          {(() => {
            const h = MOTION.enter(T, 0, 0.6, 14);
            return (
              <div style={{
                position: 'absolute', left: SRC_X, top: 66, whiteSpace: 'nowrap',
                font: `500 44px/1.08 ${SANS}`, letterSpacing: '-0.03em', color: CREAM,
                opacity: h.opacity, transform: h.transform,
              }}>{TITLE[0]}<span style={{ color: LAV }}>{TITLE[1]}</span></div>
            );
          })()}

          {/* sources */}
          {SOURCES.map((s, i) => (
            <Card key={i} x={SRC_X} y={LANES[i] - 75} w={SRC_W} h={150} T={T} at={CUES.Status + i * 0.14}>
              <div style={{ font: `600 30px ${SANS}` }}>{s.title}</div>
              <div style={{ font: `400 18px ${MONO}`, opacity: 0.55 }}>{s.sub}</div>
            </Card>
          ))}
          <div style={{ position: 'absolute', left: SRC_X, top: LANES[0] - 121, font: `400 18px ${MONO}`, letterSpacing: '0.14em', opacity: 0.45 * statusOn }}>YOUR RAW DATA</div>

          {/* the status quo: generic API vendors, mid-right — the model replaces them */}
          <Card x={VENDOR.x} y={VENDOR.y} w={VENDOR.w} h={VENDOR.h} T={T} at={CUES.Status + 0.3} dim={bypDim} fade={vendGone}>
            <div style={{ font: `600 30px ${SANS}` }}>Generic APIs</div>
            <div style={{ font: `400 18px ${MONO}`, opacity: 0.55 }}>ASR · LLM · TTS</div>
            <div style={{ font: `400 16px ${MONO}`, opacity: 0.4 }}>Deepgram · Gemini · ElevenLabs</div>
          </Card>
          <div style={{ position: 'absolute', left: VENDOR.x, top: VENDOR.y - 36, font: `400 18px ${MONO}`, letterSpacing: '0.14em', opacity: 0.45 * statusOn * (1 - bypDim * 0.6) * (1 - vendGone) }}>TODAY</div>
          <div style={{
            position: 'absolute', left: VENDOR.x, top: VENDOR.y + VENDOR.h + 16, width: VENDOR.w, boxSizing: 'border-box',
            padding: '10px 16px', borderRadius: 10, border: `1px solid ${RED}66`, background: 'rgba(207,107,79,0.07)',
            font: `500 18px/1.5 ${MONO}`, color: RED, textAlign: 'center',
            opacity: warnK.opacity * (1 - bypDim * 0.45) * (1 - vendGone), transform: warnK.transform,
          }}>⚠ fails for Indian context<br />23% accuracy</div>

          {/* bypass particles: straight to the vendors, no refinement */}
          {T >= CUES.Status ? BYP.map((p, i) => {
            const prog = fract(p.ph + bypT * p.spd);
            const x = lerp(SRC_X + SRC_W, VENDOR.x + 20, prog);
            const rise = smooth(0.1, 0.45, prog);
            const y = lerp(p.lane, BYP_Y, rise);
            const failing = prog > 0.88;
            const vis = statusOn * (1 - bypDim * 0.8) * (1 - vendGone) * Math.min(clamp(prog * 8, 0, 1), clamp((1 - prog) * 7, 0, 1));
            return (
              <div key={'b' + i} style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', opacity: vis, whiteSpace: 'nowrap' }}>
                <span style={{ font: `500 17px ${MONO}`, color: failing ? RED : 'rgba(246,244,239,0.5)' }}>
                  {failing ? '✗ ' + p.frag : p.frag}
                </span>
              </div>
            );
          }) : null}

          {/* central CoreMantle panel */}
          <div style={{
            position: 'absolute', left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h, boxSizing: 'border-box',
            borderRadius: 22, border: `1px solid ${EDGE}`, background: GLASS, ...MOTION.pop(T, CUES.Refine - 0.3, 0.5),
          }}>
            <div style={{ position: 'absolute', left: 28, top: 22, font: `600 27px ${SANS}` }}>
              coremantle<span style={{ color: ACCENT }}>.</span>
              <span style={{ font: `400 17px ${MONO}`, opacity: 0.5, marginLeft: 16, letterSpacing: '0.12em' }}>DATA INTELLIGENCE LAYER</span>
            </div>
            <div style={{ position: 'absolute', right: 28, top: 24, textAlign: 'right', font: `500 19px ${MONO}`, color: LAV, opacity: statK }}>
              <div>dataset quality &gt;{Math.round(lerp(80, 95, statK))}%</div>
              <div style={{ opacity: 0.75, marginTop: 5 }}>WER &lt;{Math.round(lerp(24, 10, statK))}%</div>
            </div>
          </div>

          {/* gates */}
          {GATES.map((g, i) => (
            <div key={i}>
              <div style={{
                position: 'absolute', left: g.x - 1, top: PANEL.y + 84, height: (PANEL.h - 120) * gateK[i], width: 2,
                background: g.c, borderRadius: 2, boxShadow: `0 0 18px ${g.c}`, opacity: 0.9,
              }} />
              <div style={{
                position: 'absolute', left: g.x, top: PANEL.y + PANEL.h - 28, transform: 'translateX(-50%)',
                font: `500 17px ${MONO}`, letterSpacing: '0.16em', color: g.c, opacity: gateK[i],
              }}>{g.label}</div>
            </div>
          ))}

          {/* what "rejected" means: caught before the training bill */}
          <div style={{
            position: 'absolute', left: GATES[1].x - 230, top: PANEL.y + PANEL.h + 42, width: 460, boxSizing: 'border-box',
            border: `1px dashed ${RED}55`, borderRadius: 12, padding: '14px 20px', textAlign: 'center',
            opacity: MOTION.draw(T, CUES.Refine + 1.0, 0.5),
          }}>
            <div style={{ font: `500 19px ${MONO}`, color: RED }}>✗ noisy clips caught before training · {rejN.toLocaleString('en-US')}</div>
            <div style={{ font: `400 16px ${MONO}`, color: RED, opacity: 0.65, marginTop: 6 }}>rejected here, not after the GPU bill</div>
          </div>

          {/* main-path particles */}
          {T >= CUES.Intake ? PARTS.map((p, i) => {
            const prog = fract(p.ph + flowT * p.spd);
            const { x, y } = px(p, prog);
            const inPanel = x > PANEL.x + 30 && x < PANEL.x + PANEL.w - 30;
            const annotated = gateK[0] > 0.5 && x > GATES[0].x;
            const certified = gateK[2] > 0.5 && x > GATES[2].x;
            const atVerify = gateK[1] > 0.5 && x > GATES[1].x;
            const fallK = p.noisy && atVerify ? clamp((x - GATES[1].x) / 120, 0, 1) : 0;
            const yy = y + fallK * fallK * 230;
            const dead = fallK >= 1;
            const segVis = x > PANEL.x + PANEL.w - 50 ? trainK : x > PANEL.x - 50 ? panelPop : 1;
            const vis = flowOn * segVis * Math.min(clamp(prog * 8, 0, 1), clamp((1 - prog) * 7, 0, 1)) * (dead ? 0 : 1);
            const c = certified ? LAV : p.noisy && atVerify ? RED : p.noisy && inPanel ? AMBER : annotated ? BLUE : 'rgba(246,244,239,0.55)';
            return (
              <div key={i} style={{ position: 'absolute', left: x, top: yy, transform: 'translate(-50%,-50%)', opacity: vis, whiteSpace: 'nowrap' }}>
                <span style={{
                  padding: annotated ? '6px 14px' : '2px 6px',
                  border: annotated ? `1px solid ${c}` : '1px solid transparent',
                  borderRadius: 8, font: `500 17px ${MONO}`, color: c,
                  background: certified ? 'rgba(139,147,232,0.12)' : 'transparent',
                  boxShadow: certified ? `0 0 14px rgba(139,147,232,0.35)` : 'none',
                }}>{certified ? '✓ ' + p.tag : annotated ? p.tag : p.frag}</span>
              </div>
            );
          }) : null}

          {/* the payoff: train YOUR custom model */}
          <div style={{ position: 'absolute', left: MODEL.x, top: MODEL.y - 36, font: `400 18px ${MONO}`, letterSpacing: '0.14em', opacity: 0.45 * trainK }}>TRAIN YOUR CUSTOM MODEL</div>
          <div style={{
            position: 'absolute', left: MODEL.x, top: MODEL.y, width: MODEL.w, height: MODEL.h, boxSizing: 'border-box',
            borderRadius: 18, border: `1px solid ${trainK > 0.5 ? LAV + '77' : EDGE}`, background: GLASS,
            padding: '28px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12,
            boxShadow: `0 0 ${40 * accK}px rgba(139,147,232,0.18)`, ...MOTION.pop(T, CUES.Train, 0.5),
          }}>
            <div style={{ font: `600 32px ${SANS}` }}>Your custom model</div>
            <div style={{ font: `400 17px ${MONO}`, opacity: 0.55 }}>trained on certified data</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', font: `500 18px ${MONO}`, color: LAV, marginTop: 8 }}>
              <span>epoch {String(epoch).padStart(2, '0')}/12</span>
              <span style={{ opacity: 0.8 }}>loss {loss}</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(246,244,239,0.1)', overflow: 'hidden' }}>
              <div style={{ width: `${accK * 100}%`, height: '100%', borderRadius: 4, background: LAV }} />
            </div>
            <div style={{ font: `400 16px ${MONO}`, opacity: 0.5, marginTop: 4 }}>ASR · TTS · LLM · agents</div>
          </div>

          {/* accuracy: theirs vs yours */}
          <div style={{ position: 'absolute', left: MODEL.x, top: MODEL.y + MODEL.h + 30, width: MODEL.w, opacity: MOTION.draw(T, CUES.Train + 0.3, 0.5) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', font: `400 17px ${MONO}`, opacity: 0.75 }}>
              <span>benchmark accuracy</span>
              <span style={{ font: `600 38px ${MONO}`, color: acc > 60 ? LAV : AMBER }}>{acc}%</span>
            </div>
            <div style={{ marginTop: 8, height: 9, borderRadius: 4, background: 'rgba(246,244,239,0.1)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '23%', top: -2, bottom: -2, width: 2, background: RED, opacity: 0.7 }} />
              <div style={{ width: `${acc}%`, height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${AMBER}, ${LAV})` }} />
            </div>
            <div style={{ marginTop: 8, font: `400 15px ${MONO}`, opacity: 0.5 }}>generic APIs 23% → yours 91% · 500 hrs of call data</div>
          </div>
        </div>
      </div>
    );
  }

  function CoremantleArchVideo() {
    const [tw, setTweak] = window.useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, accent: '#5E6AD2' });
    const [mobile, setMobile] = React.useState(() => window.matchMedia('(max-width: 700px)').matches);
    React.useEffect(() => {
      const query = window.matchMedia('(max-width: 700px)');
      const update = () => setMobile(query.matches);
      query.addEventListener('change', update);
      return () => query.removeEventListener('change', update);
    }, []);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <window.CompositionStage width={mobile ? 900 : 1920} height={mobile ? 1600 : 1080} bg={BG} autoplay={window.OM_AUTOPLAY === true} fit={mobile ? 'cover' : 'contain'}
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
  window.CoremantleArchVideo = CoremantleArchVideo;
})();

// coremantle-burn-scene.jsx — "wasted GPU compute": noisy data streams into a GPU
// cluster, the cluster overheats while the cost counter climbs, and the bad outcomes
// only show up on the far side — after the run.
// Portrait layout (900x1300 stage, top-to-bottom flow) when the host box is portrait.
(function () {
  const E = window.Easing, clamp = window.clamp;
  const BG = '#0e0d0b', CREAM = '#f6f4ef', GLASS = 'rgba(246,244,239,0.045)', EDGE = 'rgba(246,244,239,0.16)';
  const LAVENDER = '#8b93e8', AMBER = '#d9b25e', RED = '#cf6b4f';
  const MONO = '"IBM Plex Mono", monospace';
  const SANS = '"Space Grotesk", sans-serif';
  const fract = (x) => x - Math.floor(x);
  const rnd = (i, s) => fract(Math.sin(i * 127.1 + s * 311.7) * 43758.5453);
  const lerp = (a, b, k) => a + (b - a) * k;

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

  function useVertical() {
    const get = () => window.innerHeight > window.innerWidth;
    const [v, setV] = React.useState(get);
    React.useEffect(() => {
      const fn = () => setV(get());
      window.addEventListener('resize', fn);
      return () => window.removeEventListener('resize', fn);
    }, []);
    return v;
  }

  const CL_X = 620, CL_Y = 230, CARD_W = 156, CARD_H = 120, GAP = 18; // cluster: 2 cols x 3 rows
  const CL_CX = CL_X + CARD_W + GAP / 2, CL_CY = CL_Y + 1.5 * CARD_H + GAP;
  // portrait cluster geometry
  const MCL_X = 135, MCL_Y = 350;
  const MCL_CX = MCL_X + CARD_W + GAP / 2, MCL_CY = MCL_Y + 1.5 * CARD_H + GAP;
  const N_P = 30;
  const PARTS = [];
  for (let i = 0; i < N_P; i++) {
    PARTS.push({
      lane: 150 + rnd(i, 1) * 520, spd: 0.14 + rnd(i, 2) * 0.1, ph: rnd(i, 3),
      noisy: rnd(i, 4) < 0.34, frag: ['▂▅▃▇', 'wav_0' + i % 8, '0x3f' + (i % 10), '····', '▅▂▆▁'][i % 5],
    });
  }
  const OUTS = [
    { t0: 0.3, l1: 'eval: FAILED', l2: 'WER 38%' },
    { t0: 0.7, l1: 'hallucinated entities', l2: 'names · amounts · dates' },
    { t0: 1.1, l1: 'retrain required', l2: '+6 weeks · full budget' },
  ];

  function Piece({ tw, m }) {
    const { T, CUES, time, authoredTotal } = window.useComposition();
    const ACCENT = tw.accent;
    const seam = Math.min(MOTION.draw(T, 0, 0.35), 1 - MOTION.draw(T, authoredTotal - 0.35, 0.35));
    const flowOn = clamp((T - CUES.Ingest) / 0.6, 0, 1);
    const heatK = MOTION.draw(T, CUES.Burn, 2.0);
    const costK = MOTION.draw(T, CUES.Burn + 0.2, 3.6);
    const cost = Math.round(48200 * costK).toLocaleString('en-US');
    const temp = Math.round(lerp(62, 96, heatK));
    const capIn = MOTION.enter(T, CUES.Aftermath + 1.5, 0.6, 18);
    // heat colors blend continuously from heatK — a scrubbed timeline can't use
    // time-based CSS transitions to soften threshold snaps (they trail the playhead)
    const mixA = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
    const rgba = (c) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${+c[3].toFixed(3)})`;
    const ramp = (x, a, b) => clamp((x - a) / (b - a), 0, 1);
    const LAV_C = [139, 147, 232, 1], AMBER_C = [217, 178, 94, 1], RED_C = [207, 107, 79, 1];
    const EDGE_C = [246, 244, 239, 0.16], CREAM_C = [246, 244, 239, 1];
    const heatA = heatK < 0.7 ? mixA(LAV_C, AMBER_C, ramp(heatK, 0.45, 0.65)) : mixA(AMBER_C, RED_C, ramp(heatK, 0.8, 0.95));
    const heatC = rgba(heatA);
    const gpuBorderC = rgba(mixA(EDGE_C, heatA, ramp(heatK, 0.3, 0.45)));
    const tempC = rgba(mixA(CREAM_C, heatA, ramp(heatK, 0.3, 0.45)));
    const glowC = rgba(mixA([217, 178, 94, 0.3], [207, 107, 79, 0.4], ramp(heatK, 0.8, 0.95)));

    const clX = m ? MCL_X : CL_X, clY = m ? MCL_Y : CL_Y;
    const clCX = m ? MCL_CX : CL_CX, clCY = m ? MCL_CY : CL_CY;

    return (
      <div data-screen-label={`t=${Math.floor(time)}s`}
        style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>


        {/* noisy data stream */}
        <div style={{ position: 'absolute', left: m ? 44 : 100, top: m ? 56 : 120, font: `400 ${m ? 22 : 20}px ${MONO}`, letterSpacing: '0.14em', opacity: 0.45 * flowOn }}>RAW &middot; UNVERIFIED DATA</div>
        {PARTS.map((p, i) => {
          const prog = fract(p.ph + (T - CUES.Ingest) * p.spd);
          if (T < CUES.Ingest) return null;
          const vis = flowOn * Math.min(clamp(prog * 6, 0, 1), clamp((1 - prog) * 4, 0, 1));
          let x, y;
          if (m) {
            // falls from the top edge into the cluster
            const laneX = 40 + rnd(i, 5) * 520;
            x = lerp(laneX, clCX, E.easeInCubic(prog) * 0.7);
            y = 90 + prog * (clCY - 130);
          } else {
            x = 110 + prog * (CL_X - 130);
            y = lerp(p.lane, CL_CY, E.easeInCubic(prog) * 0.75);
          }
          return <div key={i} style={{
            position: 'absolute', left: x, top: y, font: `500 18px ${MONO}`,
            color: p.noisy ? AMBER : 'rgba(139,147,232,0.85)', opacity: vis * (p.noisy ? 0.95 : 0.55), whiteSpace: 'nowrap',
          }}>{p.frag}</div>;
        })}

        {/* GPU cluster */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const col = i % 2, row = (i / 2) | 0;
          const pop = MOTION.pop(T, CUES.Ingest - 0.4 + i * 0.08, 0.5);
          const jitter = heatK > 0.6 ? Math.sin(T * 21 + i * 5) * heatK * 1.6 : 0;
          const util = clamp(0.25 + heatK * 0.75 + 0.06 * Math.sin(T * 3 + i * 2.1), 0, 1);
          return (
            <div key={i} style={{
              position: 'absolute', left: clX + col * (CARD_W + GAP) + jitter, top: clY + row * (CARD_H + GAP),
              width: CARD_W, height: CARD_H, boxSizing: 'border-box', borderRadius: 14, padding: '14px 16px',
              border: `1px solid ${gpuBorderC}`, background: GLASS,
              boxShadow: `0 0 ${26 * heatK}px ${glowC}`,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              opacity: pop.opacity, transform: pop.transform,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', font: `400 22px ${MONO}`, opacity: 0.6 }}>
                <span>GPU-{i}</span><span style={{ color: tempC }}>{temp}&deg;C</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: 'rgba(246,244,239,0.08)', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: 4, background: heatC, transform: `scaleX(${util})`, transformOrigin: '0 50%' }} />
              </div>
            </div>
          );
        })}
        {/* cost counter, centered above the cluster (the pop transform must not
            clobber the translateX(-50%) that centers it) */}
        {(() => {
          const pop = MOTION.pop(T, CUES.Burn, 0.5);
          return <div style={{
            position: 'absolute', left: clCX, top: clY - (m ? 52 : 64), whiteSpace: 'nowrap',
            font: `500 ${m ? 24 : 24}px ${MONO}`, color: heatK > 0.5 ? AMBER : CREAM,
            opacity: pop.opacity, transform: `translateX(-50%) ${pop.transform}`,
          }}>compute burned&ensp;$ {cost}</div>;
        })()}

        {/* outcomes, discovered after */}
        {m ? (
          <div>
            <div style={{ position: 'absolute', left: clCX, top: clY + 3 * CARD_H + 2 * GAP + 10, height: 34, borderLeft: `2px dashed rgba(217,178,94,0.35)`, clipPath: `inset(0 0 ${(1 - MOTION.draw(T, CUES.Aftermath, 0.4)) * 100}% 0)` }} />
            <div style={{ position: 'absolute', left: 44, top: 800, font: `400 22px ${MONO}`, letterSpacing: '0.14em', opacity: 0.45 * MOTION.draw(T, CUES.Aftermath, 0.4) }}>DISCOVERED AFTER THE RUN</div>
            {OUTS.map((o, i) => {
              const at = CUES.Aftermath + o.t0;
              const pop = MOTION.pop(T, at, 0.5);
              return (
                <div key={i} style={{
                  position: 'absolute', left: 44, right: 44, top: 840 + i * 112, boxSizing: 'border-box', borderRadius: 14,
                  border: `1px dashed ${AMBER}`, background: 'rgba(217,178,94,0.05)', padding: '16px 20px',
                  opacity: pop.opacity, transform: pop.transform,
                }}>
                  <div style={{ font: `600 22px ${MONO}`, color: AMBER }}>{o.l1}</div>
                  <div style={{ font: `400 22px ${MONO}`, opacity: 0.6, marginTop: 5 }}>{o.l2}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <div style={{ position: 'absolute', left: 1040, top: 130, font: `400 20px ${MONO}`, letterSpacing: '0.14em', opacity: 0.45 * MOTION.draw(T, CUES.Aftermath, 0.4) }}>DISCOVERED AFTER THE RUN</div>
            {OUTS.map((o, i) => {
              const at = CUES.Aftermath + o.t0;
              const pop = MOTION.pop(T, at, 0.5);
              const y = 190 + i * 160;
              const lineK = MOTION.draw(T, at - 0.15, 0.35);
              return (
                <div key={i}>
                  <div style={{ position: 'absolute', left: CL_X + 2 * CARD_W + GAP + 10, top: CL_CY, width: 1020 - CL_X - 2 * CARD_W - GAP - 10, borderTop: `2px dashed rgba(217,178,94,0.35)`, clipPath: `inset(0 ${(1 - lineK) * 100}% 0 0)`, transformOrigin: '0 0', transform: `rotate(${Math.atan2(y + 45 - CL_CY, 1020 - CL_X - 2 * CARD_W - GAP - 10) * 180 / Math.PI}deg)` }} />
                  <div style={{
                    position: 'absolute', left: 1040, top: y, width: 400, boxSizing: 'border-box', borderRadius: 14,
                    border: `1px dashed ${AMBER}`, background: 'rgba(217,178,94,0.05)', padding: '18px 22px',
                    opacity: pop.opacity, transform: pop.transform,
                  }}>
                    <div style={{ font: `600 22px ${MONO}`, color: AMBER }}>{o.l1}</div>
                    <div style={{ font: `400 20px ${MONO}`, opacity: 0.6, marginTop: 6 }}>{o.l2}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* closing caption */}
        <div style={{ position: 'absolute', left: m ? 40 : 0, right: m ? 40 : 0, bottom: m ? 44 : 72, textAlign: 'center', ...capIn }}>
          <span style={{ font: `600 ${m ? 28 : 32}px ${SANS}` }}>Teams discover bad outcomes </span>
          <span style={{ font: `600 ${m ? 28 : 32}px ${SANS}`, color: ACCENT }}>after training runs — not before.</span>
        </div>
      </div>
    );
  }

  function CoremantleBurn() {
    const [tw, setTweak] = window.useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, accent: '#5E6AD2' });
    const m = useVertical();
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <window.CompositionStage width={m ? 600 : 1520} height={m ? 1300 : 860} bg={BG}
          scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
          <Piece tw={tw} m={m} />
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
  window.CoremantleBurn = CoremantleBurn;
})();

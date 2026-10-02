// bidtech-frontier-scene.jsx — "Frontier Labs": every new model release creates a new
// data requirement. Model V1 ships, a new dataset lands, V2 trains from it, another
// dataset lands, V3 trains — the chain draws strictly left to right and loops.
// Authored at 1200x750 so type stays legible in a card-sized fold.
(function () {
  const E = window.Easing, clamp = window.clamp;
  const BG = '#0e0d0b', CREAM = '#f6f4ef', GLASS = 'rgba(246,244,239,0.045)', EDGE = 'rgba(246,244,239,0.16)';
  const GREEN = '#8b93e8';
  const MONO = '"IBM Plex Mono", monospace';
  const SANS = '"Space Grotesk", sans-serif';

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

  // chain layout: model - dataset - model - dataset - model
  const W = 1200, H = 750;
  const CY = 372;
  const MODELS = [
    { x: 150, v: 'V1', dim: 0.55 },
    { x: 600, v: 'V2', dim: 0.8 },
    { x: 1050, v: 'V3', dim: 1 },
  ];
  const SETS = [{ x: 375 }, { x: 825 }];
  const SET_ROWS = ['training', 'eval', 'alignment'];

  function Chip({ size, glow, dim }) {
    // model as a rounded "chip" with a lattice dot core
    const pad = size * 0.16;
    const dots = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) dots.push([pad + (c * (size - pad * 2)) / 2, pad + (r * (size - pad * 2)) / 2]);
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', overflow: 'visible' }}>
        <rect x="3" y="3" width={size - 6} height={size - 6} rx={size * 0.18} fill="rgba(246,244,239,0.035)"
          stroke={GREEN} strokeWidth="2.5" opacity={0.35 + 0.65 * dim}
          style={glow > 0 ? { filter: `drop-shadow(0 0 ${14 * glow}px ${GREEN})` } : null} />
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 4 ? size * 0.055 : size * 0.038} fill={GREEN} opacity={(i === 4 ? 0.95 : 0.55) * (0.4 + 0.6 * dim)} />
        ))}
        {dots.map(([x, y], i) => (i !== 4 ? <line key={`l${i}`} x1={x} y1={y} x2={size / 2} y2={size / 2} stroke={GREEN} strokeWidth="1" opacity={0.3 * (0.4 + 0.6 * dim)} /> : null))}
      </svg>
    );
  }

  function Piece({ tw, m }) {
    const { T, CUES, time, authoredTotal } = window.useComposition();
    const ACCENT = tw.accent;
    const seam = Math.min(MOTION.draw(T, 0, 0.35), 1 - MOTION.draw(T, authoredTotal - 0.35, 0.35));
    const capIn = MOTION.enter(T, 0.1, 0.6, 12);
    const footIn = MOTION.enter(T, CUES.Close + 0.2, 0.6, 16);

    // strict left-to-right cue order: V1, arrow, dataset 1, arrow, V2, ...
    const beat = (i) => CUES.Chain + i * 0.72;
    // items in x order: model0(0) arrow(1) set0(2) arrow(3) model1(4) arrow(5) set1(6) arrow(7) model2(8)
    const chipS = m ? 150 : 168;
    const setW = m ? 168 : 190, setH = 172;

    const sx = (x) => m ? (x / W) * 600 : x; // portrait squeezes the same chain into 900w rows? keep single-row scaled
    const stageW = m ? 600 : W, stageH = m ? 1150 : H;

    // portrait: the same chain runs top-to-bottom on a center axis — chips and
    // dataset cards center via flex wrappers so the pop transform stays clean
    if (m) {
      const AXIS = 300;
      const MODEL_H = 170, SET_H = 114, CONN = 32;
      const py = (i) => {
        let y = 118;
        for (let j = 0; j < i; j++) y += (j % 2 === 0 ? MODEL_H : SET_H) + CONN;
        return y;
      };
      return (
        <div data-screen-label={`t=${Math.floor(time)}s`}
          style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 44, top: 50, font: `400 22px ${MONO}`, letterSpacing: '0.14em', opacity: 0.45, ...capIn }}>
            AI DATA INFRASTRUCTURE · FRONTIER LABS
          </div>
          {[0, 1, 2, 3, 4].map((i) => {
            const isModel = i % 2 === 0;
            const idx = Math.floor(i / 2);
            const at = beat(i * 2);
            const y = py(i);
            return (
              <div key={i}>
                {i > 0 ? <div style={{ position: 'absolute', left: AXIS - 1.5, top: y - CONN + 4, width: 3, height: (CONN - 10) * MOTION.draw(T, beat(i * 2 - 1), 0.5), background: GREEN, opacity: 0.6 }} /> : null}
                {isModel ? (
                  <div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                    <div style={{ ...MOTION.pop(T, at, 0.5) }}>
                      <Chip size={124} glow={idx === 2 ? MOTION.draw(T, at + 0.2, 0.8) : 0} dim={MODELS[idx].dim} />
                    </div>
                    <div style={{ font: `600 28px ${SANS}`, ...MOTION.enter(T, at + 0.1, 0.5, 10) }}>Model {MODELS[idx].v}</div>
                  </div>
                ) : (
                  <div style={{ position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: 430, boxSizing: 'border-box', borderRadius: 16, border: `1px solid ${GREEN}`, background: 'rgba(139,147,232,0.06)', padding: '16px 24px', ...MOTION.pop(T, at, 0.5) }}>
                      <div style={{ font: `500 18px ${MONO}`, letterSpacing: '0.13em', color: GREEN, marginBottom: 10 }}>NEW DATASET</div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        {SET_ROWS.map((r, j) => (
                          <div key={r} style={{ font: `500 18px ${MONO}`, padding: '6px 12px', borderRadius: 8, border: `1px solid ${EDGE}`, opacity: T >= at + 0.25 + j * 0.18 ? 0.9 : 0.25 }}>{r}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: 44, right: 44, bottom: 50, borderTop: `1px solid ${EDGE}`, paddingTop: 24, textAlign: 'center', ...footIn }}>
            <span style={{ font: `600 26px ${SANS}` }}>Every release creates </span>
            <span style={{ font: `600 26px ${SANS}`, color: ACCENT }}>the next data requirement.</span>
          </div>
        </div>
      );
    }

    return (
      <div data-screen-label={`t=${Math.floor(time)}s`}
        style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>

        <div style={{ position: 'absolute', left: 70, top: 62, font: `400 19px ${MONO}`, letterSpacing: '0.14em', opacity: 0.45, ...capIn }}>
          AI DATA INFRASTRUCTURE · FRONTIER LABS
        </div>

        {/* models */}
        {MODELS.map((mo, i) => {
          const at = beat(i * 4);
          return (
            <div key={i} style={{ position: 'absolute', left: mo.x - chipS / 2, top: CY - chipS / 2, ...MOTION.pop(T, at, 0.5) }}>
              <Chip size={chipS} glow={i === 2 ? MOTION.draw(T, at + 0.25, 0.9) : 0} dim={mo.dim} />
              <div style={{ position: 'absolute', left: '50%', top: '100%', transform: 'translateX(-50%)', marginTop: 16, font: `600 26px ${SANS}`, whiteSpace: 'nowrap' }}>Model {mo.v}</div>
              <div style={{ position: 'absolute', left: '50%', bottom: '100%', transform: 'translateX(-50%)', marginBottom: 12, font: `500 15px ${MONO}`, letterSpacing: '0.13em', color: GREEN, opacity: 0.7, whiteSpace: 'nowrap' }}>
                {i === 0 ? 'SHIPPED' : i === 1 ? 'TRAINED' : 'NEXT'}
              </div>
            </div>
          );
        })}

        {/* datasets */}
        {SETS.map((s, i) => {
          const at = beat(i * 4 + 2);
          return (
            <div key={i} style={{ position: 'absolute', left: s.x - setW / 2, top: CY - setH / 2, width: setW, height: setH, boxSizing: 'border-box', borderRadius: 18, border: `1px solid ${GREEN}`, background: 'rgba(139,147,232,0.06)', padding: '18px 20px', ...MOTION.pop(T, at, 0.5) }}>
              <div style={{ font: `500 14px ${MONO}`, letterSpacing: '0.13em', color: GREEN, marginBottom: 12 }}>NEW DATASET</div>
              {SET_ROWS.map((r, j) => (
                <div key={r} style={{ font: `500 16px ${MONO}`, padding: '7px 0', borderTop: j ? `1px solid rgba(246,244,239,0.1)` : 'none', opacity: T >= at + 0.25 + j * 0.2 ? 0.9 : 0.25, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 2, background: GREEN, opacity: 0.8 }} />{r}
                </div>
              ))}
            </div>
          );
        })}

        {/* connecting arrows, drawn left to right between the beats */}
        {[0, 1, 2, 3].map((i) => {
          const x0 = i % 2 === 0 ? MODELS[Math.floor(i / 2)].x + chipS / 2 + 8 : SETS[Math.floor(i / 2)].x + setW / 2 + 8;
          const x1 = i % 2 === 0 ? SETS[Math.floor(i / 2)].x - setW / 2 - 8 : MODELS[Math.floor(i / 2) + 1].x - chipS / 2 - 8;
          const k = MOTION.draw(T, beat(i * 2 + 1), 0.55);
          const w = (x1 - x0) * k;
          if (k <= 0) return null;
          return (
            <div key={i} style={{ position: 'absolute', left: x0, top: CY - 1, width: w, height: 2, background: `linear-gradient(90deg, rgba(139,147,232,0.25), ${GREEN})`, opacity: 0.85 }}>
              <div style={{ position: 'absolute', right: -2, top: -5, width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: `9px solid ${GREEN}`, opacity: k > 0.95 ? 1 : 0 }} />
            </div>
          );
        })}

        {/* footer */}
        <div style={{ position: 'absolute', left: 70, right: 70, bottom: 56, borderTop: `1px solid ${EDGE}`, paddingTop: 26, display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', ...footIn }}>
          <span style={{ font: `600 28px ${SANS}` }}>Every release creates</span>
          <span style={{ font: `600 28px ${SANS}`, color: ACCENT }}>the next data requirement.</span>
        </div>
      </div>
    );
  }

  function BidtechFrontier() {
    const [tw, setTweak] = window.useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, accent: '#5E6AD2' });
    const get = () => window.innerHeight > window.innerWidth;
    const [m, setM] = React.useState(get);
    React.useEffect(() => {
      const fn = () => setM(get());
      window.addEventListener('resize', fn);
      return () => window.removeEventListener('resize', fn);
    }, []);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <window.CompositionStage width={m ? 600 : 1200} height={m ? 1150 : 750} bg={BG}
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
  window.BidtechFrontier = BidtechFrontier;
})();

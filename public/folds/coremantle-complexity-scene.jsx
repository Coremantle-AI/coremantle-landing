// coremantle-complexity-scene.jsx — "the complexity is exponential": four factor cards
// multiply out, chips fan below each, and the product is infinite combinations while
// real phrases drift along the bottom.
// Portrait layout (900x1250 stage, 2x2 card grid, result below) when the host box is portrait.
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

  const CARD_W = 250, CARD_H = 250, CARD_Y = 150;
  const CARDS = [
    { x: 70, big: '22', label: 'Languages', count: 22, chips: ['Hindi', 'Tamil', 'Bengali'] },
    { x: 370, big: '100+', label: 'Dialects', count: 100, plus: true, chips: ['Awadhi', 'Bhojpuri', 'Maithili'] },
    { x: 670, big: 'Code-', big2: 'Switching', chips: ['Hinglish', 'Tanglish', 'mixed speech'] },
    { x: 970, big: 'Domain', big2: 'Vocabulary', chips: ['Medical', 'Retail', 'Legal'] },
  ];
  const PHRASES = [
    { t: 'नमस्ते', x: 120, y: 755 },
    { t: 'Vanakkam', x: 300, y: 690 },
    { t: 'কি খবৰ?', x: 500, y: 768 },
    { t: 'Kem cho?', x: 720, y: 705 },
    { t: 'Aap kaise hain?', x: 950, y: 750 },
    { t: 'كيف حالك؟', x: 1230, y: 700 },
  ];
  // portrait: 2x2 card grid, x between pairs, chips under each card, phrases at the bottom
  const MC = { W: 224, H: 190, XS: [44, 332], YS: [80, 380] };
  const PHRASES_M = [
    { x: 56, y: 980 }, { x: 224, y: 1015 }, { x: 400, y: 975 },
    { x: 90, y: 1090 }, { x: 262, y: 1125 }, { x: 448, y: 1085 },
  ];

  function Piece({ tw, m }) {
    const { T, CUES, time, authoredTotal } = window.useComposition();
    const ACCENT = tw.accent;
    const seam = Math.min(MOTION.draw(T, 0, 0.35), 1 - MOTION.draw(T, authoredTotal - 0.35, 0.35));
    const eqPop = MOTION.pop(T, CUES.Result + 0.1, 0.45);
    const infPop = MOTION.pop(T, CUES.Result + 0.35, 0.6);
    const infGlow = 0.5 + 0.5 * Math.sin(T * 2.2);

    return (
      <div data-screen-label={`t=${Math.floor(time)}s`}
        style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>


        {/* factor cards + operators */}
        {CARDS.map((c, i) => {
          const at = CUES.Factors + i * 0.5;
          const pop = MOTION.pop(T, at, 0.5);
          const countK = MOTION.draw(T, at + 0.15, 0.8);
          const big = c.count ? Math.round(c.count * countK) + (c.plus && countK > 0.99 ? '+' : '') : c.big;
          const lineK = MOTION.draw(T, at + 0.45, 0.4);
          const cx = m ? MC.XS[i % 2] : c.x;
          const cy = m ? MC.YS[(i / 2) | 0] : CARD_Y;
          const cw = m ? MC.W : CARD_W;
          const ch = m ? MC.H : CARD_H;
          return (
            <div key={i}>
              <div style={{
                position: 'absolute', left: cx, top: cy, width: cw, height: ch, boxSizing: 'border-box',
                borderRadius: 22, border: `1px solid ${EDGE}`, background: GLASS, padding: m ? 16 : 24,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                textAlign: 'center', opacity: pop.opacity, transform: pop.transform,
              }}>
                <div style={{ font: `600 ${c.count ? (m ? 52 : 62) : (m ? 30 : 38)}px ${SANS}`, color: c.count ? GREEN : CREAM, letterSpacing: '-0.01em', lineHeight: 1.15 }}>
                  {big}{c.big2 ? <br /> : null}{c.big2 || ''}
                </div>
                {c.label ? <div style={{ font: `500 ${m ? 24 : 28}px ${SANS}` }}>{c.label}</div> : null}
              </div>
              {(m ? i % 2 === 0 : i < 3) ? <div style={{
                position: 'absolute', left: cx + cw + (m ? 4 : 8), top: cy + ch / 2 - 24, width: 40, textAlign: 'center',
                font: `500 ${m ? 38 : 44}px ${SANS}`, color: GREEN, ...MOTION.pop(T, at + 0.35, 0.4),
              }}>&times;</div> : null}
              {/* dotted drop + chips */}
              <div style={{ position: 'absolute', left: cx + cw / 2, top: cy + ch, height: (m ? 22 : 34) * lineK, borderLeft: '2px dotted rgba(139,147,232,0.4)' }} />
              <div style={{ position: 'absolute', left: cx + cw / 2, top: cy + ch + (m ? 30 : 46), transform: 'translateX(-50%)', display: 'flex', gap: m ? 6 : 8, whiteSpace: 'nowrap', width: cw + (m ? 20 : 40), flexWrap: 'wrap', justifyContent: 'center' }}>
                {c.chips.map((ch2, j) => (
                  <span key={j} style={{
                    padding: m ? '5px 9px' : '6px 12px', border: `1px solid rgba(246,244,239,0.22)`, borderRadius: 999,
                    font: `400 ${m ? 20 : 15}px ${MONO}`, opacity: 0.8, background: 'rgba(246,244,239,0.03)', display: 'inline-block',
                    ...MOTION.pop(T, at + 0.55 + j * 0.12, 0.4),
                  }}>{ch2}</span>
                ))}
              </div>
            </div>
          );
        })}

        {/* equals + infinity result */}
        {m ? (
          <div>
            <div style={{ position: 'absolute', left: 300, top: 690, transform: `translateX(-50%) ${eqPop.transform || ''}`, font: `500 46px ${SANS}`, color: GREEN, opacity: eqPop.opacity }}>=</div>
            <div style={{ position: 'absolute', left: 300, top: 830, transform: 'translate(-50%,-50%)', textAlign: 'center', opacity: infPop.opacity }}>
              <div style={{
                font: `600 118px ${SANS}`, lineHeight: 1, color: GREEN, transform: infPop.transform,
                textShadow: `0 0 ${30 + 30 * infGlow}px rgba(139,147,232,0.55), 0 0 90px rgba(139,147,232,0.25)`,
              }}>&infin;</div>
              <div style={{ font: `600 30px ${SANS}`, marginTop: 8, ...MOTION.enter(T, CUES.Result + 0.7, 0.5, 14) }}>Combinations</div>
              <div style={{ font: `400 22px ${MONO}`, color: GREEN, marginTop: 4, ...MOTION.enter(T, CUES.Result + 0.85, 0.5, 12) }}>infinite combinations</div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ position: 'absolute', left: 1252, top: CARD_Y + CARD_H / 2 - 30, font: `500 52px ${SANS}`, color: GREEN, opacity: eqPop.opacity, transform: eqPop.transform }}>=</div>
            <div style={{ position: 'absolute', left: 1385, top: CARD_Y + CARD_H / 2, transform: 'translate(-50%,-50%)', textAlign: 'center', opacity: infPop.opacity }}>
              <div style={{
                font: `600 150px ${SANS}`, lineHeight: 1, color: GREEN, transform: infPop.transform,
                textShadow: `0 0 ${30 + 30 * infGlow}px rgba(139,147,232,0.55), 0 0 90px rgba(139,147,232,0.25)`,
              }}>&infin;</div>
              <div style={{ font: `600 36px ${SANS}`, marginTop: 10, ...MOTION.enter(T, CUES.Result + 0.7, 0.5, 14) }}>Combinations</div>
              <div style={{ font: `400 19px ${MONO}`, color: GREEN, marginTop: 6, ...MOTION.enter(T, CUES.Result + 0.85, 0.5, 12) }}>infinite combinations</div>
            </div>
          </div>
        )}

        {/* drifting phrases */}
        {PHRASES.map((p, i) => {
          const at = CUES.Voices + i * 0.25;
          const inK = MOTION.enter(T, at, 0.6, 14);
          const bob = Math.sin(T * 1.4 + i * 1.7) * 6;
          const px = m ? PHRASES_M[i].x : p.x;
          const py = m ? PHRASES_M[i].y : p.y;
          return (
            <div key={i} style={{
              position: 'absolute', left: px, top: py, transform: `translateY(${bob}px)`,
              padding: m ? '7px 14px' : '8px 20px', border: `1px solid rgba(139,147,232,0.3)`, borderRadius: 12,
              font: `400 20px ${MONO}, "Noto Sans Devanagari", sans-serif`, color: CREAM, background: 'rgba(139,147,232,0.05)',
              opacity: inK.opacity * 0.85, whiteSpace: 'nowrap',
            }}>{p.t}</div>
          );
        })}
      </div>
    );
  }

  function CoremantleComplexity() {
    const [tw, setTweak] = window.useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, accent: '#5E6AD2' });
    const m = useVertical();
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <window.CompositionStage width={m ? 600 : 1520} height={m ? 1250 : 860} bg={BG}
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
  window.CoremantleComplexity = CoremantleComplexity;
})();

// bidtech-quality-scene.jsx — "Quality Breaks the Model": clean labeled segments flow
// into the model core and it trains green; then noisy / mislabeled rows slip in, the
// core contaminates, and the outputs on the right go wrong. The error enters long
// before the model does.
// Portrait layout (900x1250) when the host box is taller than it is wide.
(function () {
  const E = window.Easing, clamp = window.clamp;
  const BG = '#0e0d0b', CREAM = '#f6f4ef', GLASS = 'rgba(246,244,239,0.045)', EDGE = 'rgba(246,244,239,0.16)';
  const GREEN = '#8b93e8', RED = '#d47a6a', AMBER = '#d9b25e';
  const MONO = '"IBM Plex Mono", monospace';
  const SANS = '"Space Grotesk", sans-serif';
  const fract = (x) => x - Math.floor(x);
  const rnd = (i, s) => fract(Math.sin(i * 127.1 + s * 311.7) * 43758.5453);

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

  // input rows: clean rows arrive during Clean, bad rows during Contaminate
  const INPUTS = [
    { label: 'clean · labeled', bad: false },
    { label: 'clean · labeled', bad: false },
    { label: 'noise · crosstalk', bad: true, tint: AMBER },
    { label: 'mislabeled', bad: true, tint: RED },
    { label: 'inconsistent tags', bad: true, tint: RED },
  ];
  const OUTPUTS = [
    { good: 'intent: refund ✓', wrong: 'intent: greeting ✗' },
    { good: 'entity: acme corp ✓', wrong: 'entity: <hallucinated> ✗' },
    { good: 'WER 9.4% ✓', wrong: 'WER 34% ▲' },
  ];

  function Wave({ w, h, seed, tint, k }) {
    const n = Math.max(8, Math.floor(w / 7));
    const bars = [];
    for (let i = 0; i < n; i++) {
      const amp = 0.25 + 0.75 * Math.abs(Math.sin(i * 0.53 + seed * 4) * 0.6 + Math.sin(i * 0.19 + seed) * 0.4);
      const vis = clamp(k * n - i, 0, 1);
      bars.push(<div key={i} style={{
        position: 'absolute', left: (i / n) * w, top: '50%', width: Math.max(2, w / n - 3),
        height: Math.max(2, amp * h * vis), transform: 'translateY(-50%)',
        borderRadius: 2, background: tint, opacity: 0.5 + 0.5 * vis,
      }} />);
    }
    return <div style={{ position: 'relative', width: w, height: h, flex: 'none' }}>{bars}</div>;
  }

  function Core({ size, contamK, pulseT }) {
    // hexagonal model core; lattice inside; tint blends green -> red with contamK
    const mix = (a, b, k) => {
      const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
      const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
      return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * k)).join(',')})`;
    };
    const c = mix(GREEN, RED, contamK);
    const R = size / 2;
    const hex = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      hex.push(`${R + R * 0.92 * Math.cos(a)},${R + R * 0.92 * Math.sin(a)}`);
    }
    const nodes = [];
    for (let i = 0; i < 7; i++) {
      const a = (Math.PI * 2 * i) / 7 + 0.5;
      const rr = i === 0 ? 0 : R * (0.34 + 0.22 * rnd(i, 2));
      nodes.push([R + rr * Math.cos(a * 2.3), R + rr * Math.sin(a * 2.3)]);
    }
    const pulse = 0.55 + 0.45 * Math.sin(pulseT * 2.4);
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', overflow: 'visible' }}>
        <polygon points={hex.join(' ')} fill="rgba(246,244,239,0.03)" stroke={c} strokeWidth="2.5"
          style={{ filter: `drop-shadow(0 0 ${18 + 26 * contamK * pulse}px ${c})` }} />
        {nodes.map(([x, y], i) => nodes.slice(i + 1).map(([x2, y2], j) => (
          <line key={`${i}-${j}`} x1={x} y1={y} x2={x2} y2={y2} stroke={c} strokeWidth="1" opacity={0.28} />
        )))}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 0 ? 7 : 4.5} fill={c} opacity={i === 0 ? 0.95 : 0.7} />
        ))}
      </svg>
    );
  }

  function FlowLine({ x0, y0, x1, y1, k, tint, t }) {
    if (k <= 0) return null;
    const mx = (x0 + x1) / 2;
    const dash = 12;
    return (
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }} width="1" height="1">
        <path d={`M ${x0} ${y0} C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`} fill="none"
          stroke={tint} strokeWidth="2" opacity={0.75 * k}
          strokeDasharray={`${dash} ${dash}`} strokeDashoffset={-t * 90}
          style={{ filter: `drop-shadow(0 0 6px ${tint})` }} />
      </svg>
    );
  }

  function Piece({ tw, m }) {
    const { T, CUES, time, authoredTotal } = window.useComposition();
    const ACCENT = tw.accent;
    const seam = Math.min(MOTION.draw(T, 0, 0.35), 1 - MOTION.draw(T, authoredTotal - 0.35, 0.35));
    const W = m ? 600 : 1520, H = m ? 1250 : 860;

    // contamination begins as the first bad row docks
    const badAt = (i) => CUES.Contaminate + (i - 2) * 0.75;
    const contamK = MOTION.draw(T, badAt(2) + 0.35, 2.2);
    const capIn = MOTION.enter(T, CUES.Opening + 0.1, 0.6, 14);
    const footIn = MOTION.enter(T, CUES.Close + 0.25, 0.6, 18);

    const coreSize = m ? 300 : 330;
    const coreX = m ? W / 2 : W / 2 - 12;
    const coreY = m ? 560 : H / 2 + 12;

    const rowW = m ? 512 : 420, rowH = m ? 84 : 92;
    const rowX = m ? (W - rowW) / 2 : 100;
    const rowY = (i) => m ? 118 + i * 62 : 170 + i * (rowH + 22);
    const outX = m ? (W - rowW) / 2 : W - 100 - 380;
    const outY = (i) => m ? 800 + i * 96 : 250 + i * 150;

    return (
      <div data-screen-label={`t=${Math.floor(time)}s`}
        style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>

        {/* caption */}
        <div style={{ position: 'absolute', left: m ? 44 : 100, top: m ? 44 : 64, font: `400 ${m ? 22 : 18}px ${MONO}`, letterSpacing: '0.14em', opacity: 0.45, ...capIn }}>
          DATA QUALITY · WHAT THE MODEL LEARNS
        </div>

        {/* input rows (desktop: left column; portrait: stacked compact rows on top) */}
        {INPUTS.map((r, i) => {
          const at = r.bad ? badAt(i) : CUES.Clean + i * 0.55;
          const rowIn = MOTION.enter(T, at, 0.5, 18);
          const waveK = MOTION.draw(T, at + 0.15, 0.7);
          const tint = r.bad ? r.tint : GREEN;
          const y = rowY(i);
          if (m && i > 4) return null;
          return (
            <div key={i}>
              <div style={{
                position: 'absolute', left: rowX, top: y, width: rowW, height: m ? 52 : rowH,
                boxSizing: 'border-box', borderRadius: 14, border: `1px solid ${r.bad ? tint : EDGE}`,
                background: GLASS, display: 'flex', alignItems: 'center', gap: m ? 14 : 20,
                padding: m ? '0 16px' : '0 24px', ...rowIn,
              }}>
                <Wave w={m ? 190 : 150} h={m ? 30 : 44} seed={i} tint={tint} k={waveK} />
                <div style={{ font: `500 ${m ? 20 : 18}px ${MONO}`, color: r.bad ? tint : 'rgba(246,244,239,0.8)', whiteSpace: 'nowrap' }}>{r.label}</div>
                {r.bad ? <div style={{ marginLeft: 'auto', font: `500 ${m ? 20 : 18}px ${MONO}`, color: tint }}>⚠</div> : null}
              </div>
              {!m ? <FlowLine x0={rowX + rowW} y0={y + rowH / 2} x1={coreX - coreSize / 2 + 18} y1={coreY}
                k={MOTION.draw(T, at + 0.3, 0.6)} tint={tint} t={T} /> : null}
            </div>
          );
        })}

        {/* model core */}
        <div style={{ position: 'absolute', left: coreX - coreSize / 2, top: coreY - coreSize / 2, ...MOTION.pop(T, CUES.Clean - 0.2, 0.6) }}>
          <Core size={coreSize} contamK={contamK} pulseT={T} />
          <div style={{ position: 'absolute', left: '50%', top: '100%', transform: 'translateX(-50%)', marginTop: 14, font: `500 ${m ? 20 : 17}px ${MONO}`, letterSpacing: '0.13em', whiteSpace: 'nowrap', opacity: 0.6 }}>
            MODEL{contamK > 0.55 ? ' · CONTAMINATED' : ''}
          </div>
        </div>

        {/* outputs */}
        {OUTPUTS.map((o, i) => {
          const goodAt = CUES.Clean + 1.4 + i * 0.5;
          const flipAt = badAt(2) + 1.0 + i * 0.55;
          const flipped = T >= flipAt;
          const cardIn = MOTION.enter(T, goodAt, 0.5, 18);
          const flipPop = MOTION.pop(T, flipAt, 0.45);
          const tint = flipped ? RED : GREEN;
          // border/background blend on the scrubbed clock — a time-based CSS
          // transition would trail the playhead when the timeline is scrubbed
          const flipK = E.easeOutCubic(clamp((T - flipAt) / 0.4, 0, 1));
          const mix = (a, b) => {
            const c = a.map((v, ci) => v + (b[ci] - v) * flipK);
            return `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${+c[3].toFixed(3)})`;
          };
          const y = outY(i);
          return (
            <div key={i}>
              <div style={{
                position: 'absolute', left: outX, top: y, width: m ? rowW : 380, height: m ? 64 : 84,
                boxSizing: 'border-box', borderRadius: 14,
                border: `1px solid ${mix([246, 244, 239, 0.16], [212, 122, 106, 1])}`,
                background: mix([246, 244, 239, 0.045], [212, 122, 106, 0.07]),
                display: 'flex', alignItems: 'center', padding: '0 24px',
                font: `500 ${m ? 20 : 21}px ${MONO}`, color: tint, ...cardIn,
              }}>
                <span style={{ ...(flipped ? flipPop : null), display: 'inline-block' }}>{flipped ? o.wrong : o.good}</span>
              </div>
              {!m ? <FlowLine x0={coreX + coreSize / 2 - 18} y0={coreY} x1={outX} y1={y + 42}
                k={MOTION.draw(T, goodAt - 0.15, 0.6)} tint={tint} t={T} /> : null}
            </div>
          );
        })}

        {/* footer */}
        <div style={{ position: 'absolute', left: m ? 44 : 100, right: m ? 44 : 100, bottom: m ? 48 : 64, borderTop: `1px solid ${EDGE}`, paddingTop: m ? 22 : 28, display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: m ? 8 : 14, ...footIn }}>
          <span style={{ font: `600 ${m ? 26 : 32}px ${SANS}` }}>The error enters</span>
          <span style={{ font: `600 ${m ? 26 : 32}px ${SANS}`, color: ACCENT }}>long before the model does.</span>
        </div>
      </div>
    );
  }

  function BidtechQuality() {
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
  window.BidtechQuality = BidtechQuality;
})();

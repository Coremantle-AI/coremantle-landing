/* Coremantle data-cleaning funnel - continuous composition on animations-v3 */
const { CompositionStage, useComposition, Easing, animate, clamp } = window;
const { useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakToggle } = window;

const BG = '#0e0d0b', SURF = '#171612', CREAM = '#f6f4ef', ACC = '#8b93e8', WARM = '#d9ad55';
const MUTED = 'rgba(246,244,239,.62)', LINE = 'rgba(246,244,239,.13)';
const GROT = '"Space Grotesk",sans-serif', MONO = '"IBM Plex Mono",monospace';

/* --- the only three motion helpers --- */
const MOTION = {
  enter(T, start, dur = 0.8, dy = 24) {
    const p = animate({ from: 0, to: 1, start, end: start + dur, ease: Easing.easeOutCubic })(T);
    return { opacity: p, transform: `translateY(${(1 - p) * dy}px)` };
  },
  draw(T, start, dur = 1) {
    return animate({ from: 0, to: 1, start, end: start + dur, ease: Easing.easeInOutCubic })(T);
  },
  pop(T, start, dur = 0.65) {
    const p = animate({ from: 0, to: 1, start, end: start + dur, ease: Easing.easeOutBack })(T);
    return clamp(p, 0, 1.12);
  },
};
/* in-then-out envelope built from draw */
const glow = (T, a, b) => Math.min(MOTION.draw(T, a, 0.6), 1 - MOTION.draw(T, b - 0.5, 0.5));

function useStageLayout() {
  const get = () => {
    const vertical = window.innerHeight > window.innerWidth;
    const mobileHeight = vertical
      ? Math.round(clamp((window.innerHeight / Math.max(1, window.innerWidth)) * 600, 620, 900))
      : 620;
    return { vertical, mobileHeight };
  };
  const [layout, setLayout] = React.useState(get);
  React.useEffect(() => {
    const update = () => setLayout(get());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return layout;
}

const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const lerp = (a, b, u) => a + (b - a) * u;

/* --- funnel geometry (world coords 1920x1080, axis y=520) --- */
const FX0 = 430, FX1 = 1310, R0 = 330, R1 = 140, CY = 520;
const rad = (x) => R0 + (R1 - R0) * clamp((x - FX0) / (FX1 - FX0), 0, 1);
const STAGES = [0, 1, 2, 3].map((i) => {
  const xIn = FX0 + i * 220, xOut = xIn + 206;
  return { i, xIn, xOut, rIn: rad(xIn), rOut: rad(xOut) };
});
const KILLX = [652, 872, 1092, 1312];
const STAGE_META = [
  { lines: ['NOISE', 'REMOVED'] },
  { lines: ['PII', 'REMOVED'] },
  { lines: ['CROSS-TALK', 'REMOVED'] },
  { lines: ['INVALID SPEECH', 'REMOVED'] },
];

/* --- camera --- */
function camKeys(C, total) {
  return [
    { t: 0, x: 265, y: 430, s: 1.18 },
    { t: C['Funnel'] - 0.2, x: 300, y: 455, s: 1.28 },
    { t: C['Funnel'] + 1.7, x: 905, y: 530, s: 1.02 },
    { t: C['Noise'] - 0.1, x: 905, y: 530, s: 1.05 },
    { t: C['Noise'] + 1.0, x: 548, y: 495, s: 1.55 },
    { t: C['PII'] - 0.15, x: 566, y: 500, s: 1.62 },
    { t: C['PII'] + 0.9, x: 775, y: 490, s: 1.66 },
    { t: C['Cross-Talk'] - 0.15, x: 790, y: 495, s: 1.72 },
    { t: C['Cross-Talk'] + 0.9, x: 990, y: 485, s: 1.76 },
    { t: C['Code-Switching'] - 0.15, x: 1002, y: 490, s: 1.8 },
    { t: C['Code-Switching'] + 0.9, x: 1207, y: 480, s: 1.82 },
    { t: C['Model-Ready'] - 0.15, x: 1218, y: 485, s: 1.88 },
    { t: C['Model-Ready'] + 1.15, x: 1580, y: 460, s: 1.3 },
    { t: C['Wide'] - 0.25, x: 1560, y: 472, s: 1.38 },
    { t: C['Wide'] + 1.5, x: 960, y: 540, s: 1.0 },
    { t: total, x: 960, y: 540, s: 1.0 },
  ];
}
function camAt(T, keys) {
  let a = keys[0], b = keys[keys.length - 1];
  for (let k = 0; k < keys.length - 1; k++) if (T >= keys[k].t && T <= keys[k + 1].t) { a = keys[k]; b = keys[k + 1]; break; }
  if (T <= keys[0].t) return keys[0];
  if (T >= b.t) return b;
  const u = Easing.easeInOutCubic(clamp((T - a.t) / Math.max(0.001, b.t - a.t), 0, 1));
  return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), s: lerp(a.s, b.s, u) };
}

/* --- left side: raw artifacts --- */
function Bubble({ T, at, x, y, text, w }) {
  const e = MOTION.enter(T, at, 0.7, 18);
  return (
    <div style={{ position: 'absolute', left: x, top: y, maxWidth: w || 210, padding: '10px 16px', background: SURF, border: `1px solid ${LINE}`, borderRadius: 16, color: CREAM, font: `400 15px/1.4 ${GROT}`, opacity: e.opacity, transform: `${e.transform} translateY(${Math.sin(T * 1.3 + x) * 5}px)` }}>
      {text}
    </div>
  );
}
function WaveRow({ T, at, x, y, n, seed }) {
  const e = MOTION.enter(T, at, 0.7, 12);
  const bars = [];
  for (let i = 0; i < n; i++) {
    const h = (4 + rnd(seed + i) * 16) * (0.62 + 0.38 * Math.sin(T * 3 + i * 0.9 + seed));
    bars.push(<div key={i} style={{ width: 3, height: Math.max(2, h), borderRadius: 2, background: i % 7 === 3 ? WARM : ACC, opacity: 0.5 + rnd(seed + i * 3) * 0.5 }} />);
  }
  return <div style={{ position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 3, height: 26, opacity: e.opacity, transform: e.transform }}>{bars}</div>;
}
function RawSide({ T, C }) {
  const t0 = C['Raw Data'];
  const title = MOTION.enter(T, t0 + 0.35, 0.9);
  const redact = MOTION.draw(T, C['PII'] + 0.9, 0.7); // PII card self-redacts during PII beat
  const pii = MOTION.enter(T, t0 + 1.0, 0.7, 18);
  const json = MOTION.enter(T, t0 + 1.7, 0.7, 18);
  const Row = ({ label, val, k }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
      <span style={{ color: WARM, fontSize: 12 }}>&#9679;</span>
      <span style={{ font: `400 14px ${GROT}`, color: CREAM, whiteSpace: 'nowrap' }}>{label} {val}</span>
      <div style={{ position: 'absolute', left: 20, top: 1, height: 15, width: `${redact * 82}%`, background: ACC, borderRadius: 3, opacity: 0.92 }} />
    </div>
  );
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 62, top: 76, font: `500 46px ${GROT}`, letterSpacing: '.1em', color: WARM, ...title }}>RAW DATA</div>
      <div style={{ position: 'absolute', left: 64, top: 136, font: `500 11px ${MONO}`, letterSpacing: '.16em', color: MUTED, textTransform: 'uppercase', opacity: title.opacity }}>UNSTRUCTURED &middot; MULTILINGUAL &middot; NOISY</div>
      <WaveRow T={T} at={t0 + 0.6} x={48} y={186} n={34} seed={11} />
      <Bubble T={T} at={t0 + 0.8} x={86} y={236} text="uhh… you know, like.. I mean…" />
      <div style={{ position: 'absolute', left: 52, top: 356, width: 244, padding: '14px 18px', background: SURF, border: `1px solid rgba(217,173,85,.28)`, borderRadius: 16, display: 'grid', gap: 8, opacity: pii.opacity, transform: `${pii.transform} translateY(${Math.sin(T * 1.1 + 2) * 5}px)` }}>
        <Row label="Name:" val="John D." k={0} />
        <Row label="Phone:" val="415-555-0123" k={1} />
        <Row label="Email:" val="john.d@email.com" k={2} />
      </div>
      <Bubble T={T} at={t0 + 1.2} x={44} y={494} text="I think…" />
      <Bubble T={T} at={t0 + 1.35} x={146} y={508} text="ya, I think so…" />
      <Bubble T={T} at={t0 + 1.5} x={66} y={556} text="yo creo que…" />
      <Bubble T={T} at={t0 + 1.62} x={200} y={568} text="kind of" />
      <Bubble T={T} at={t0 + 1.74} x={58} y={618} text="我认为…" />
      <WaveRow T={T} at={t0 + 1.5} x={48} y={686} n={28} seed={41} />
      <div style={{ position: 'absolute', left: 52, top: 724, width: 250, padding: '12px 16px', background: SURF, border: `1px solid ${LINE}`, borderRadius: 14, font: `400 12px/1.6 ${MONO}`, color: MUTED, opacity: json.opacity, transform: json.transform }}>
        {'{'}<span style={{ color: ACC }}>"id"</span>: "abcE", <span style={{ color: ACC }}>"text"</span>: "I<br />think…", <span style={{ color: WARM }}>"lang"</span>: <span style={{ color: WARM }}>null</span>, "…"{'}'}
      </div>
    </div>
  );
}

/* --- stage icons (line icons, drawn with pathLength) --- */
function Icon({ i, p, T, C }) {
  const s = { fill: 'none', stroke: CREAM, strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round', pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p };
  if (i === 0) {
    const hs = [5, 10, 16, 22, 16, 10, 5, 13, 7];
    return <g>{hs.map((h, k) => <line key={k} x1={6 + k * 6} x2={6 + k * 6} y1={30 - h} y2={30 + h} {...s} strokeDashoffset={1 - clamp(p * 9 - k, 0, 1)} />)}</g>;
  }
  if (i === 1) {
    const bar = MOTION.draw(T, C['PII'] + 1.0, 0.55);
    return (
      <g>
        <circle cx="30" cy="17" r="10" {...s} />
        <path d="M11 50 c0-13 9-17 19-17 s19 4 19 17" {...s} />
        <rect x={30 - 14 * bar} y="13" width={28 * bar} height="8" rx="4" fill={ACC} stroke="none" />
      </g>
    );
  }
  if (i === 2) {
    return (
      <g>
        <path d="M8 12 h26 a6 6 0 0 1 6 6 v10 a6 6 0 0 1 -6 6 h-14 l-8 7 v-7 h-4 a6 6 0 0 1 -6 -6 v-10 a6 6 0 0 1 6 -6 z" {...s} stroke={WARM} />
        <path d="M26 24 h26 a6 6 0 0 1 6 6 v9 a6 6 0 0 1 -6 6 h-4 v7 l-8 -7 h-14 a6 6 0 0 1 -6 -6 v-9 a6 6 0 0 1 6 -6 z" {...s} stroke={ACC} />
      </g>
    );
  }
  const badge = MOTION.pop(T, C['Code-Switching'] + 1.0, 0.55);
  return (
    <g>
      <rect x="6" y="12" width="46" height="32" rx="9" {...s} />
      <path d="M21 21 l-7 7 7 7" {...s} stroke={ACC} />
      <path d="M37 21 l7 7 -7 7" {...s} stroke={ACC} />
      <g transform={`translate(52,44) scale(${badge})`}>
        <circle r="10" fill={ACC} />
        <path d="M-4 -4 L4 4 M4 -4 L-4 4" stroke="#111" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      </g>
    </g>
  );
}

function FunnelBody({ T, C }) {
  const focusStarts = [C['Noise'], C['PII'], C['Cross-Talk'], C['Code-Switching']];
  const focusEnds = [C['PII'], C['Cross-Talk'], C['Code-Switching'], C['Model-Ready']];
  const beam = 0.25 + 0.15 * Math.sin(T * 1.6);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <linearGradient id="fbody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1c1b22" />
            <stop offset="0.5" stopColor="#141319" />
            <stop offset="1" stopColor="#0f0e12" />
          </linearGradient>
          <radialGradient id="fmouth" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="rgba(139,147,232,.35)" />
            <stop offset="1" stopColor="rgba(139,147,232,0)" />
          </radialGradient>
        </defs>
        <ellipse cx={FX0} cy={CY} rx={140} ry={R0 + 30} fill="url(#fmouth)" opacity={0.5 + 0.2 * Math.sin(T * 1.2)} />
        {STAGES.map((st) => {
          const ap = MOTION.pop(T, C['Funnel'] + 0.25 + st.i * 0.45, 0.7);
          const g = glow(T, focusStarts[st.i] + 0.35, focusEnds[st.i]);
          const rxIn = st.rIn * 0.16, rxOut = st.rOut * 0.16;
          const body = `M ${st.xIn} ${CY - st.rIn} L ${st.xOut} ${CY - st.rOut} A ${rxOut} ${st.rOut} 0 0 1 ${st.xOut} ${CY + st.rOut} L ${st.xIn} ${CY + st.rIn} A ${rxIn} ${st.rIn} 0 0 1 ${st.xIn} ${CY - st.rIn} Z`;
          const burst = MOTION.draw(T, focusStarts[st.i] + 0.9, 1.1);
          return (
            <g key={st.i} opacity={clamp(ap, 0, 1)} transform={`translate(${st.xIn},${CY}) scale(${Math.max(ap, 0.001)}) translate(${-st.xIn},${-CY})`}>
              <path d={body} fill="url(#fbody)" stroke={LINE} strokeWidth="1" />
              <ellipse cx={st.xOut} cy={CY} rx={rxOut} ry={st.rOut} fill="#0b0a0e" stroke="rgba(139,147,232,.3)" strokeWidth="1.5" />
              <ellipse cx={st.xIn} cy={CY} rx={rxIn} ry={st.rIn} fill="none" stroke={ACC} strokeWidth={st.i === 0 ? 5 : 3} opacity={0.45 + g * 0.55} style={{ filter: g > 0.05 ? `drop-shadow(0 0 ${14 * g}px rgba(139,147,232,.9))` : 'none' }} />
              {burst > 0 && burst < 1 && (
                <ellipse cx={st.xIn} cy={CY} rx={rxIn + burst * 26} ry={st.rIn + burst * 50} fill="none" stroke={ACC} strokeWidth="2" opacity={(1 - burst) * 0.6} />
              )}
            </g>
          );
        })}
        <line x1={FX0} y1={CY} x2={1560} y2={CY} stroke={ACC} strokeWidth="2" strokeDasharray="2 10" opacity={beam} />
      </svg>
      {STAGES.map((st) => {
        const mx = (st.xIn + st.xOut) / 2 + 14;
        const ap = MOTION.pop(T, C['Funnel'] + 0.55 + st.i * 0.45, 0.7);
        const g = glow(T, focusStarts[st.i] + 0.35, focusEnds[st.i]);
        const iconP = Math.max(0.25, MOTION.draw(T, focusStarts[st.i] + 0.45, 0.9));
        const meta = STAGE_META[st.i];
        const iconScale = 1 + 0.14 * Math.sin(Math.PI * clamp(MOTION.draw(T, focusStarts[st.i] + 0.45, 0.9), 0, 1));
        return (
          <div key={st.i} style={{ position: 'absolute', left: mx - 88, top: CY - 168, width: 176, textAlign: 'center', opacity: clamp(ap, 0, 1), transform: `scale(${clamp(ap, 0, 1.1)})` }}>
            <svg width="56" height="52" viewBox="0 0 60 56" style={{ opacity: 0.55 + g * 0.45, transform: `scale(${iconScale})` }}>
              <Icon i={st.i} p={iconP} T={T} C={C} />
            </svg>
            <div style={{ marginTop: 130, font: `600 ${st.i === 3 ? 14 : 17}px/1.4 ${GROT}`, letterSpacing: '.09em', color: CREAM, opacity: 0.6 + g * 0.4, textShadow: g > 0.05 ? `0 0 ${18 * g}px rgba(139,147,232,.7)` : 'none' }}>
              {meta.lines.map((l, k) => <div key={k}>{l}</div>)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --- particles --- */
function ParticleField({ T, C, density }) {
  const N = Math.round(96 * density);
  const out = [];
  for (let i = 0; i < N; i++) {
    const sp = rnd(i * 3 + 1), off = rnd(i * 3 + 2) * 2 - 1, hue = rnd(i * 3 + 3);
    const period = 8.5 + sp * 4.5, phase = rnd(i * 5 + 4);
    const prog = ((T / period) + phase) % 1;
    const x = -80 + prog * 2080;
    const kr = rnd(i * 7 + 5);
    const killStage = kr < 0.17 ? 0 : kr < 0.34 ? 1 : kr < 0.5 ? 2 : kr < 0.64 ? 3 : 4;
    let opacity = 0.35 + rnd(i * 9 + 2) * 0.6;
    let y;
    let yr;
    if (x < FX0 - 260) yr = 430;
    else if (x < FX0) yr = lerp(430, R0 - 42, (x - (FX0 - 260)) / 260);
    else if (x <= FX1) yr = rad(x) - 42;
    else yr = lerp(R1 - 42, 26, clamp((x - FX1) / 240, 0, 1));
    const wob = x < FX0 ? 7 : x < FX1 ? 3 : 0;
    y = CY + off * yr + Math.sin(T * 2 + i * 1.7) * wob;
    const cleanBlend = clamp((x - 1470) / 140, 0, 1);
    if (cleanBlend > 0) {
      const lane = Math.round(off * 2) / 2;
      y = lerp(y, CY + lane * 52, cleanBlend);
    }
    if (killStage < 4) {
      const dx = x - KILLX[killStage];
      if (dx > 0) {
        opacity *= clamp(1 - dx / 90, 0, 1);
        y += dx * 1.25 * (off >= 0 ? 1 : -1);
        if (opacity <= 0.01) continue;
      }
    }
    const size = 3 + rnd(i * 11 + 6) * 4.5;
    const base = hue < 0.52 ? ACC : hue < 0.8 ? WARM : 'rgba(246,244,239,.75)';
    const color = cleanBlend > 0.5 ? ACC : base;
    const square = rnd(i * 13 + 8) < 0.32;
    out.push(<div key={i} style={{ position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: square ? 1 : '50%', background: color, opacity }} />);
  }
  return <div style={{ position: 'absolute', inset: 0 }}>{out}</div>;
}

/* --- output: crystal + titles + clean stream --- */
function Output({ T, C, total }) {
  const cx = 1600, cy = 500;
  const ap = MOTION.pop(T, C['Model-Ready'] + 0.3, 0.8);
  const title = MOTION.enter(T, C['Model-Ready'] + 0.8, 0.9);
  const sub = MOTION.enter(T, C['Model-Ready'] + 1.25, 0.9, 14);
  const pulse = 1 + 0.03 * Math.sin(T * 1.8);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 1408, top: 96, ...title }}>
        <div style={{ font: `500 42px ${GROT}`, letterSpacing: '.06em', color: CREAM }}>MODEL-READY DATA</div>
        <div style={{ marginTop: 12, font: `500 15px ${MONO}`, letterSpacing: '.18em', color: ACC, ...sub }}>CLEAN. PRECISE. STRUCTURED.</div>
      </div>
      <div style={{ position: 'absolute', left: cx - 180, top: cy - 180, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,147,232,.28), rgba(139,147,232,0) 65%)', opacity: clamp(ap, 0, 1) * (0.6 + 0.3 * Math.sin(T * 1.8)) }} />
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: 'absolute', left: 0, top: 0, opacity: clamp(ap, 0, 1) }}>
        <g style={{ filter: 'var(--funnel-prism-theme-filter)' }}>
          <g transform={`translate(${cx},${cy}) scale(${Math.max(ap, 0.001) * pulse}) translate(${-cx},${-cy})`} style={{ filter: 'drop-shadow(0 0 20px var(--funnel-prism-glow))' }}>
            <polygon data-fix-prism points={`${cx},${cy - 150} ${cx + 108},${cy} ${cx},${cy + 150} ${cx - 108},${cy}`} fill="var(--funnel-prism-fill)" stroke="var(--funnel-prism-stroke)" strokeWidth="2.5" strokeLinejoin="round" />
            <line data-fix-prism-line x1={cx} y1={cy - 150} x2={cx} y2={cy + 150} stroke="var(--funnel-prism-line)" strokeWidth="1.6" />
            <line x1={cx - 108} y1={cy} x2={cx + 108} y2={cy} stroke="var(--funnel-prism-line)" strokeWidth="1.6" />
          </g>
        </g>
      </svg>
      {[0, 1, 2].map((k) => {
        const yy = cy - 40 + k * 40;
        const drift = (T * 90 + k * 37) % 60;
        return (
          <div key={k} style={{ position: 'absolute', left: 1720, top: yy, width: 170, height: 2, opacity: clamp(ap, 0, 1) * 0.8, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: -60 + drift, top: 0, width: 260, height: 2, backgroundImage: `repeating-linear-gradient(90deg, ${ACC} 0 14px, transparent 14px 30px)` }} />
          </div>
        );
      })}
    </div>
  );
}

/* --- compact mobile composition --- */
const MOBILE_STAGE_W = [520, 454, 388, 322, 256];

function mobileGeometry(height) {
  const funnelTop = 170;
  const funnelBottom = height - 178;
  const step = (funnelBottom - funnelTop) / 4;
  return {
    stageY: Array.from({ length: 5 }, (_, i) => funnelTop + step * i),
    funnelTop,
    funnelBottom,
    outputY: height - 120,
  };
}

function MobileRawHeader({ T, C }) {
  const title = MOTION.enter(T, C['Raw Data'] + 0.2, 0.7, 16);
  const waveform = MOTION.enter(T, C['Raw Data'] + 0.55, 0.7, 12);
  const speech = MOTION.enter(T, C['Raw Data'] + 0.85, 0.7, 12);
  const pii = MOTION.enter(T, C['Raw Data'] + 1.1, 0.7, 12);
  const redact = MOTION.draw(T, C['PII'] + 0.9, 0.7);
  const bars = Array.from({ length: 17 }, (_, i) => {
    const height = 7 + rnd(90 + i) * 25;
    return <span key={i} style={{ width: 3, height, borderRadius: 2, background: i % 6 === 3 ? WARM : ACC, opacity: 0.55 + rnd(140 + i) * 0.4 }} />;
  });

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 38, top: 28, color: WARM, font: `600 30px ${GROT}`, letterSpacing: '.08em', ...title }}>RAW DATA</div>
      <div style={{ position: 'absolute', left: 40, top: 69, color: MUTED, font: `500 11px ${MONO}`, letterSpacing: '.14em', opacity: title.opacity }}>NOISY &middot; PRIVATE &middot; OVERLAPPING &middot; INVALID</div>
      <div style={{ position: 'absolute', left: 40, top: 108, width: 142, height: 38, display: 'flex', alignItems: 'center', gap: 4, ...waveform }}>{bars}</div>
      <div style={{ position: 'absolute', left: 210, top: 105, padding: '10px 14px', border: `1px solid ${LINE}`, borderRadius: 12, background: SURF, color: CREAM, font: `500 14px ${GROT}`, ...speech }}>uhh... I mean...</div>
      <div style={{ position: 'absolute', right: 38, top: 103, width: 146, padding: '9px 12px', border: `1px solid rgba(217,173,85,.28)`, borderRadius: 12, background: SURF, color: MUTED, font: `500 10px/1.55 ${MONO}`, ...pii }}>
        <div style={{ position: 'relative' }}>NAME &middot; PHONE<div style={{ position: 'absolute', left: 0, top: 1, width: '92%', height: 12, borderRadius: 3, background: ACC, transform: `scaleX(${redact})`, transformOrigin: '0 50%' }} /></div>
        <div style={{ position: 'relative' }}>EMAIL &middot; LOCATION<div style={{ position: 'absolute', left: 0, top: 1, width: '100%', height: 12, borderRadius: 3, background: ACC, transform: `scaleX(${redact})`, transformOrigin: '0 50%' }} /></div>
      </div>
    </div>
  );
}

function MobileParticleField({ T, density, stageY }) {
  const count = Math.round(42 * density);
  const particles = [];
  for (let i = 0; i < count; i++) {
    const phase = rnd(i * 5 + 2);
    const speed = 8 + rnd(i * 7 + 3) * 3;
    const progress = ((T / speed) + phase) % 1;
    const y = 142 + progress * (stageY[4] - 92);
    const width = lerp(500, 170, clamp((y - 158) / Math.max(1, stageY[4] - 112), 0, 1));
    const offset = rnd(i * 9 + 4) * 2 - 1;
    const kill = rnd(i * 13 + 1);
    const killStage = kill < 0.17 ? 0 : kill < 0.34 ? 1 : kill < 0.5 ? 2 : kill < 0.64 ? 3 : 4;
    const killY = stageY[Math.min(killStage + 1, 4)];
    const pastKill = killStage < 4 ? Math.max(0, y - killY) : 0;
    const opacity = (0.35 + rnd(i * 11 + 5) * 0.55) * clamp(1 - pastKill / 36, 0, 1);
    if (opacity < 0.02) continue;
    const side = offset >= 0 ? 1 : -1;
    const x = 300 + offset * width * 0.44 + pastKill * side * 1.7;
    const size = 4 + rnd(i * 17 + 6) * 5;
    const color = y > stageY[4] ? ACC : rnd(i * 19 + 8) < 0.58 ? ACC : WARM;
    particles.push(<span key={i} style={{ position: 'absolute', left: 0, top: 0, width: size, height: size, borderRadius: rnd(i * 23 + 9) < 0.32 ? 1 : '50%', background: color, opacity, transform: `translate(${x}px,${y}px) translate(-50%,-50%)` }} />);
  }
  return <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>{particles}</div>;
}

function MobileFunnel({ T, C, height, stageY }) {
  const focusStarts = [C['Noise'], C['PII'], C['Cross-Talk'], C['Code-Switching']];
  const focusEnds = [C['PII'], C['Cross-Talk'], C['Code-Switching'], C['Model-Ready']];

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <svg width="600" height={height} viewBox={`0 0 600 ${height}`} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="mobile-funnel-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1d1c24" />
            <stop offset="1" stopColor="#111016" />
          </linearGradient>
          <radialGradient id="mobile-funnel-mouth" cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="rgba(139,147,232,.28)" />
            <stop offset="1" stopColor="rgba(139,147,232,0)" />
          </radialGradient>
        </defs>
        <ellipse cx="300" cy={stageY[0]} rx="270" ry="34" fill="url(#mobile-funnel-mouth)" opacity={0.55 + 0.15 * Math.sin(T * 1.2)} />
        {STAGE_META.map((meta, i) => {
          const y0 = stageY[i], y1 = stageY[i + 1];
          const w0 = MOBILE_STAGE_W[i], w1 = MOBILE_STAGE_W[i + 1];
          const x0 = (600 - w0) / 2, x1 = (600 - w1) / 2;
          const path = `M ${x0} ${y0} L ${x0 + w0} ${y0} L ${x1 + w1} ${y1} L ${x1} ${y1} Z`;
          const appear = MOTION.pop(T, C['Funnel'] + 0.2 + i * 0.42, 0.65);
          const active = glow(T, focusStarts[i] + 0.3, focusEnds[i]);
          const pulse = MOTION.draw(T, focusStarts[i] + 0.85, 1);
          const scale = 0.96 + clamp(appear, 0, 1) * 0.04;
          return (
            <g key={i} opacity={clamp(appear, 0, 1)} transform={`translate(300 ${(y0 + y1) / 2}) scale(${scale}) translate(-300 ${-(y0 + y1) / 2})`}>
              <path d={path} fill="url(#mobile-funnel-fill)" stroke="rgba(246,244,239,.15)" strokeWidth="1.5" />
              <path d={path} fill="rgba(139,147,232,.12)" stroke={ACC} strokeWidth="3.5" opacity={active} />
              {pulse > 0 && pulse < 1 ? <path d={path} fill="none" stroke={ACC} strokeWidth="2" opacity={(1 - pulse) * 0.65} transform={`translate(300 ${(y0 + y1) / 2}) scale(${1 + pulse * 0.04}) translate(-300 ${-(y0 + y1) / 2})`} /> : null}
            </g>
          );
        })}
        <ellipse cx="300" cy={stageY[0]} rx="260" ry="28" fill="#0b0a0e" stroke={ACC} strokeWidth="3" opacity={clamp(MOTION.pop(T, C['Funnel'] + 0.15, 0.65), 0, 1)} />
        <ellipse cx="300" cy={stageY[4]} rx="128" ry="18" fill="#0b0a0e" stroke="rgba(139,147,232,.6)" strokeWidth="2" opacity={clamp(MOTION.pop(T, C['Funnel'] + 1.55, 0.65), 0, 1)} />
        <line x1="300" y1={stageY[4]} x2="300" y2={height - 136} stroke={ACC} strokeWidth="2" strokeDasharray="3 8" opacity=".55" />
      </svg>

      {STAGE_META.map((meta, i) => {
        const y0 = stageY[i], y1 = stageY[i + 1];
        const appear = MOTION.pop(T, C['Funnel'] + 0.42 + i * 0.42, 0.65);
        const active = glow(T, focusStarts[i] + 0.3, focusEnds[i]);
        const iconProgress = Math.max(0.3, MOTION.draw(T, focusStarts[i] + 0.35, 0.8));
        return (
          <div key={i} style={{ position: 'absolute', left: 194, top: y0 + 7, zIndex: 1, width: 212, height: y1 - y0 - 10, display: 'flex', alignItems: 'center', gap: 22, opacity: clamp(appear, 0, 1), transform: `scale(${0.96 + clamp(appear, 0, 1) * 0.04})`, transformOrigin: '50% 50%' }}>
            <svg width="44" height="42" viewBox="0 0 60 56" style={{ flex: 'none', opacity: 0.65 + active * 0.35 }}>
              <Icon i={i} p={iconProgress} T={T} C={C} />
            </svg>
            <div style={{ minWidth: 0 }}>
              <div style={{ marginBottom: 2, color: ACC, font: `600 10px ${MONO}`, letterSpacing: '.13em' }}>0{i + 1}</div>
              <div style={{ color: CREAM, font: `600 ${i === 3 ? 17 : 20}px/1.12 ${GROT}`, letterSpacing: '.02em' }}>{meta.lines.join(' ')}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MobileOutput({ T, C, height, outputY }) {
  const appear = MOTION.pop(T, C['Model-Ready'] + 0.25, 0.75);
  const title = MOTION.enter(T, C['Model-Ready'] + 0.65, 0.75, 12);
  const pulse = 1 + Math.sin(T * 1.8) * 0.025;
  const points = `300,${outputY - 34} 326,${outputY} 300,${outputY + 36} 274,${outputY}`;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 258, top: outputY - 42, width: 84, height: 84, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,147,232,.34), rgba(139,147,232,0) 68%)', opacity: clamp(appear, 0, 1) * (0.72 + 0.2 * Math.sin(T * 1.8)) }} />
      <svg width="600" height={height} viewBox={`0 0 600 ${height}`} style={{ position: 'absolute', inset: 0, opacity: clamp(appear, 0, 1) }}>
        <g data-model-prism="mobile" transform={`translate(300 ${outputY}) scale(${Math.max(appear, 0.001) * pulse}) translate(-300 ${-outputY})`} style={{ filter: 'drop-shadow(0 0 14px var(--funnel-prism-glow))' }}>
          <polygon data-prism-geometry={points} points={points} fill="var(--funnel-prism-fill)" stroke="var(--funnel-prism-stroke)" strokeWidth="2" strokeLinejoin="round" />
          <line x1="300" y1={outputY - 34} x2="300" y2={outputY + 36} stroke="var(--funnel-prism-line)" strokeWidth="1.4" />
          <line x1="274" y1={outputY} x2="326" y2={outputY} stroke="var(--funnel-prism-line)" strokeWidth="1.4" />
        </g>
      </svg>
      <div style={{ position: 'absolute', left: 32, right: 32, top: height - 72, textAlign: 'center', ...title }}>
        <div style={{ color: CREAM, font: `600 25px ${GROT}`, letterSpacing: '.06em' }}>MODEL-READY DATA</div>
        <div style={{ marginTop: 8, color: ACC, font: `600 10px ${MONO}`, letterSpacing: '.17em' }}>CLEAN &middot; PRECISE &middot; STRUCTURED</div>
      </div>
    </div>
  );
}

function MobilePiece({ density, height }) {
  const { T, CUES: C, authoredTotal, time } = useComposition();
  const fade = T < 0.45 ? 1 - T / 0.45 : T > authoredTotal - 0.4 ? (T - (authoredTotal - 0.4)) / 0.4 : 0;
  const geometry = mobileGeometry(height);
  return (
    <div data-screen-label={`t=${Math.floor(time)}s`} style={{ position: 'absolute', inset: 0, background: BG, color: CREAM, overflow: 'hidden', fontFamily: GROT }}>
      <MobileRawHeader T={T} C={C} />
      <MobileFunnel T={T} C={C} height={height} stageY={geometry.stageY} />
      <MobileParticleField T={T} density={density} stageY={geometry.stageY} />
      <MobileOutput T={T} C={C} height={height} outputY={geometry.outputY} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 115% 95% at 50% 48%, transparent 62%, rgba(0,0,0,.45) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: BG, opacity: clamp(fade, 0, 1) }} />
    </div>
  );
}

/* --- piece --- */
function Piece({ density }) {
  const { T, CUES: C, authoredTotal, time } = useComposition();
  const total = authoredTotal;
  const cam = camAt(T, camKeys(C, total));
  const s = cam.s * (1 + 0.006 * Math.sin(T * 0.7));
  const camX = cam.x + 3 * Math.sin(T * 0.5);
  const fade = T < 0.5 ? 1 - T * 2 : T > total - 0.45 ? (T - (total - 0.45)) / 0.45 : 0;
  return (
    <div data-screen-label={`t=${Math.floor(time)}s`} style={{ position: 'absolute', inset: 0, background: BG, overflow: 'hidden', fontFamily: GROT }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${960 - camX * s}px, ${540 - cam.y * s}px) scale(${s})` }}>
        <RawSide T={T} C={C} />
        <ParticleField T={T} C={C} density={density} />
        <FunnelBody T={T} C={C} />
        <Output T={T} C={C} total={total} />
      </div>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,.5) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: BG, opacity: clamp(fade, 0, 1) }} />
    </div>
  );
}

window.FunnelPiece = function FunnelPieceRoot() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  const { vertical, mobileHeight } = useStageLayout();
  return (
    <div style={{ width: '100%', height: '100%', background: BG }}>
      <CompositionStage width={vertical ? 600 : 1920} height={vertical ? mobileHeight : 1080} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={BG}>
        {vertical ? <MobilePiece density={t.particleDensity} height={mobileHeight} /> : <Piece density={t.particleDensity} />}
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Motion" />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
        <TweakSlider label="Particle density" value={t.particleDensity} min={0.3} max={2} step={0.1} onChange={(v) => setTweak('particleDensity', v)} />
      </TweaksPanel>
    </div>
  );
};

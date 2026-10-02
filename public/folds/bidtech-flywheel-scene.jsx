// bidtech-flywheel-scene.jsx — "so your model never stops improving": the continuous
// data flywheel. Five nodes around a circle — 1 NEW MODEL → 2 FAILURE MODES →
// 3 EVAL DATA → 4 TRAINING DATA → 5 BETTER MODEL — with the sweep drawing the arcs
// clockwise; the last arc feeds BETTER MODEL back into NEW MODEL and the cycle line
// lands. Portrait layout (900x1100) when the host box is taller than it is wide.
(function () {
  const E = window.Easing, clamp = window.clamp;
  const BG = '#0e0d0b', CREAM = '#f6f4ef', GLASS = 'rgba(246,244,239,0.045)', EDGE = 'rgba(246,244,239,0.16)';
  const GREEN = '#9dbf95';
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

  const NODES = [
    { n: 1, t: 'NEW MODEL', icon: 'chip' },
    { n: 2, t: 'FAILURE MODES', icon: 'alert' },
    { n: 3, t: 'EVAL DATA', icon: 'list' },
    { n: 4, t: 'TRAINING DATA', icon: 'db' },
    { n: 5, t: 'BETTER MODEL', icon: 'shield' },
  ];

  function Icon({ kind, size }) {
    const s = size, c = s / 2, col = GREEN;
    const common = { fill: 'none', stroke: col, strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' };
    let body = null;
    if (kind === 'chip') body = (<g {...common}><rect x="8" y="8" width={s - 16} height={s - 16} rx="4" />{[0.32, 0.5, 0.68].map((k) => <React.Fragment key={k}><line x1={s * k} y1="2" x2={s * k} y2="8" /><line x1={s * k} y1={s - 8} x2={s * k} y2={s - 2} /><line x1="2" y1={s * k} x2="8" y2={s * k} /><line x1={s - 8} y1={s * k} x2={s - 2} y2={s * k} /></React.Fragment>)}<circle cx={c} cy={c} r={s * 0.13} /></g>);
    if (kind === 'alert') body = (<g {...common}><path d={`M ${c} 6 L ${s - 5} ${s - 7} L 5 ${s - 7} Z`} /><line x1={c} y1={s * 0.42} x2={c} y2={s * 0.62} /><circle cx={c} cy={s * 0.74} r="1.3" fill={col} stroke="none" /></g>);
    if (kind === 'list') body = (<g {...common}><rect x="7" y="5" width={s - 14} height={s - 10} rx="3" />{[0.35, 0.5, 0.65].map((k) => <line key={k} x1={s * 0.34} y1={s * k} x2={s * 0.66} y2={s * k} />)}<polyline points={`${s * 0.28},${s * 0.35} ${s * 0.3},${s * 0.37} ${s * 0.33},${s * 0.33}`} /></g>);
    if (kind === 'db') body = (<g {...common}><ellipse cx={c} cy={s * 0.28} rx={s * 0.32} ry={s * 0.12} /><path d={`M ${c - s * 0.32} ${s * 0.28} v ${s * 0.42} c 0 ${s * 0.07} ${s * 0.14} ${s * 0.12} ${s * 0.32} ${s * 0.12} s ${s * 0.32} -${s * 0.05} ${s * 0.32} -${s * 0.12} v -${s * 0.42}`} /><path d={`M ${c - s * 0.32} ${s * 0.49} c 0 ${s * 0.07} ${s * 0.14} ${s * 0.12} ${s * 0.32} ${s * 0.12} s ${s * 0.32} -${s * 0.05} ${s * 0.32} -${s * 0.12}`} /></g>);
    if (kind === 'shield') body = (<g {...common}><path d={`M ${c} 5 L ${s - 7} ${s * 0.26} V ${s * 0.55} C ${s - 7} ${s * 0.78} ${c} ${s - 5} ${c} ${s - 5} C ${c} ${s - 5} 7 ${s * 0.78} 7 ${s * 0.55} V ${s * 0.26} Z`} /><polyline points={`${s * 0.36},${s * 0.48} ${s * 0.46},${s * 0.58} ${s * 0.66},${s * 0.36}`} /></g>);
    return <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ display: 'block' }}>{body}</svg>;
  }

  function Piece({ tw, m }) {
    const { T, CUES, time, authoredTotal } = window.useComposition();
    const ACCENT = tw.accent;
    const seam = Math.min(MOTION.draw(T, 0, 0.35), 1 - MOTION.draw(T, authoredTotal - 0.35, 0.35));
    const capIn = MOTION.enter(T, 0.12, 0.6, 12);
    const footIn = MOTION.enter(T, CUES.Close + 0.2, 0.6, 16);

    const W = m ? 900 : 1920, H = m ? 1100 : 1000;
    const CX = W / 2, CYc = m ? 520 : 500;
    const R = m ? 300 : 330;
    const nodeR = m ? 74 : 82;

    // node i sits at angle: start top (-90deg), clockwise every 72deg
    const ang = (i) => (-90 + i * 72) * (Math.PI / 180);
    const pos = (i) => [CX + R * Math.cos(ang(i)), CYc + R * Math.sin(ang(i))];

    const nodeAt = (i) => CUES.Cycle + i * 0.7;
    const arcAt = (i) => nodeAt(i) + 0.34;

    // svg arc between node i and i+1 (clockwise), trimmed by the node radius
    const arc = (i, k) => {
      if (k <= 0) return null;
      const pad = (nodeR + 14) / R;
      const a0 = ang(i) + pad, a1 = ang(i) + (72 * Math.PI) / 180 - pad;
      const a = a0 + (a1 - a0) * k;
      const large = 0;
      const x0 = CX + R * Math.cos(a0), y0 = CYc + R * Math.sin(a0);
      const x1 = CX + R * Math.cos(a), y1 = CYc + R * Math.sin(a);
      // arrow head direction: tangent at a
      const tx = -Math.sin(a), ty = Math.cos(a);
      return (
        <g key={i}>
          <path d={`M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1}`} fill="none" stroke={GREEN} strokeWidth="3.5"
            opacity="0.85" style={{ filter: `drop-shadow(0 0 8px rgba(157,191,149,0.7))` }} />
          {k > 0.15 ? <polygon points={`${x1 + tx * 14},${y1 + ty * 14} ${x1 - ty * 7 - tx * 2},${y1 + tx * 7 - ty * 2} ${x1 + ty * 7 - tx * 2},${y1 - tx * 7 - ty * 2}`} fill={GREEN} /> : null}
        </g>
      );
    };

    return (
      <div data-screen-label={`t=${Math.floor(time)}s`}
        style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>

        <div style={{ position: 'absolute', left: m ? 56 : 110, top: m ? 50 : 62, ...capIn }}>
          <div style={{ font: `400 ${m ? 16 : 19}px ${MONO}`, letterSpacing: '0.14em', color: GREEN }}>CONTINUOUS DATA FLYWHEEL</div>
          <div style={{ width: 46, height: 2, background: GREEN, marginTop: 10, opacity: 0.7 }} />
        </div>

        {/* faint full ring + rotating hub */}
        <svg style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <circle cx={CX} cy={CYc} r={R} fill="none" stroke={EDGE} strokeWidth="1.5" strokeDasharray="3 9" />
          <g opacity="0.5" transform={`rotate(${T * 14} ${CX} ${CYc})`}>
            <circle cx={CX} cy={CYc} r={R * 0.42} fill="none" stroke="rgba(157,191,149,0.25)" strokeWidth="1.5" strokeDasharray="2 10" />
            <circle cx={CX} cy={CYc} r={R * 0.26} fill="none" stroke="rgba(157,191,149,0.35)" strokeWidth="1.5" strokeDasharray="14 22" />
          </g>
          {[0, 1, 2, 3, 4].map((i) => arc(i, MOTION.draw(T, arcAt(i), 0.5)))}
        </svg>

        {/* nodes */}
        {NODES.map((nd, i) => {
          const [x, y] = pos(i);
          const active = T >= nodeAt(i);
          const glow = i === 4 ? MOTION.draw(T, CUES.Close, 0.8) : 0;
          return (
            <div key={i} style={{ position: 'absolute', left: x - nodeR, top: y - nodeR, width: nodeR * 2, height: nodeR * 2, ...MOTION.pop(T, nodeAt(i), 0.5) }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${active ? GREEN : EDGE}`, background: 'rgba(14,13,11,0.85)', boxShadow: `0 0 ${26 + 30 * glow}px -6px rgba(157,191,149,${0.35 + 0.45 * glow})`, display: 'grid', placeItems: 'center' }}>
                <Icon kind={nd.icon} size={m ? 46 : 52} />
              </div>
              <div style={{ position: 'absolute', left: '50%', top: -30, transform: 'translateX(-50%)', width: 26, height: 26, borderRadius: '50%', background: GREEN, color: BG, display: 'grid', placeItems: 'center', font: `600 14px ${MONO}` }}>{nd.n}</div>
              <div style={{ position: 'absolute', left: '50%', top: '100%', transform: 'translateX(-50%)', marginTop: 12, font: `600 ${m ? 16 : 18}px ${MONO}`, letterSpacing: '0.1em', whiteSpace: 'nowrap', color: active ? CREAM : 'rgba(246,244,239,0.5)' }}>{nd.t}</div>
            </div>
          );
        })}

        {/* footer */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: m ? 40 : 48, display: 'flex', justifyContent: 'center' }}>
          <div style={{ padding: '13px 26px', border: `1px solid rgba(157,191,149,0.5)`, borderRadius: 12, font: `500 ${m ? 16 : 19}px ${MONO}`, letterSpacing: '0.06em', color: GREEN, whiteSpace: 'nowrap', ...footIn }}>
            [ Every cycle fuels the next ]
          </div>
        </div>
      </div>
    );
  }

  function BidtechFlywheel() {
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
        <window.CompositionStage width={m ? 900 : 1920} height={m ? 1100 : 1000} bg={BG}
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
  window.BidtechFlywheel = BidtechFlywheel;
})();

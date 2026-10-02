// bidtech-evolve-scene.jsx — "continuously evolving models": the six numbered stages
// (1 SOURCE → 2 TRAIN → 3 ALIGN → 4 EVALUATE → 5 IMPROVE → 6 REFRESH) build strictly
// left to right, each lighting its corpus chip in the Coremantle data layer beneath;
// the refresh loop then draws back to the start and the trust badges land.
// Portrait layout (900x1300) when the host box is taller than it is wide.
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

  const STAGES = [
    { n: 1, t: 'SOURCE', d: 'Real world. Real languages.', icon: 'globe' },
    { n: 2, t: 'TRAIN', d: 'High-quality data for stronger models.', icon: 'stack' },
    { n: 3, t: 'ALIGN', d: 'Human feedback and safety at scale.', icon: 'star' },
    { n: 4, t: 'EVALUATE', d: 'Measure what matters. Find what’s missing.', icon: 'scope' },
    { n: 5, t: 'IMPROVE', d: 'Close gaps. Reduce errors. Improve performance.', icon: 'rise' },
    { n: 6, t: 'REFRESH', d: 'Continuously expand. Always up to date.', icon: 'cycle' },
  ];
  const CHIPS = [
    ['SPEECH &', 'MULTIMODAL CORPORA'], ['ASR / TTS', 'DATASETS'], ['DOMAIN & DIALECT', 'CORPORA'],
    ['RLHF DATA', '(HUMAN FEEDBACK)'], ['SAFETY DATA', '(LABELS & RED-TEAMING)'], ['INDEPENDENT', 'EVALUATIONS'],
  ];
  const BADGES = [
    ['CONSENT-FIRST', '100% DPDP compliant'],
    ['NATIVE EXPERTS', 'Vetted linguistic community'],
    ['MULTI-TIER QUALITY', 'Automated + expert QA'],
    ['MODEL-READY OUTPUT', 'Certified & audit-tracked'],
    ['BUILT TO SCALE', 'Continuous. Reliable. Global.'],
  ];

  function Icon({ kind, size, lit }) {
    const s = size, c = s / 2, col = GREEN, op = lit ? 1 : 0.45, sw = 2;
    const common = { fill: 'none', stroke: col, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
    let body = null;
    if (kind === 'globe') body = (<g {...common}><circle cx={c} cy={c} r={c - 4} /><ellipse cx={c} cy={c} rx={(c - 4) * 0.45} ry={c - 4} /><line x1="4" y1={c} x2={s - 4} y2={c} /></g>);
    if (kind === 'stack') body = (<g {...common}>{[0, 1, 2].map((i) => <rect key={i} x="5" y={5 + i * ((s - 10) / 3 + 1)} width={s - 10} height={(s - 14) / 3} rx="3" />)}<circle cx="10" cy={5 + (s - 14) / 6} r="1.4" fill={col} stroke="none" /><circle cx="10" cy={5 + (s - 10) / 3 + 1 + (s - 14) / 6} r="1.4" fill={col} stroke="none" /></g>);
    if (kind === 'star') body = (<g {...common}><path d={`M ${c} 5 L ${c + 5} ${c - 3} L ${s - 5} ${c - 2} L ${c + 7} ${c + 6} L ${c + 10} ${s - 5} L ${c} ${s - 10} L ${c - 10} ${s - 5} L ${c - 7} ${c + 6} L 5 ${c - 2} L ${c - 5} ${c - 3} Z`} /></g>);
    if (kind === 'scope') body = (<g {...common}><circle cx={c - 3} cy={c - 3} r={c - 8} /><line x1={c + 4} y1={c + 4} x2={s - 4} y2={s - 4} /><line x1={c - 8} y1={c - 3} x2={c - 8 + 4} y2={c - 3 - 5} /><line x1={c - 3} y1={c - 3} x2={c - 3} y2={c - 9} /><line x1={c + 2} y1={c - 3} x2={c + 2} y2={c - 6} /></g>);
    if (kind === 'rise') body = (<g {...common}><polyline points={`5,${s - 6} ${c - 3},${c + 2} ${c + 4},${c + 7} ${s - 6},7`} /><polyline points={`${s - 13},7 ${s - 6},7 ${s - 6},14`} /></g>);
    if (kind === 'cycle') body = (<g {...common}><path d={`M ${s - 6} ${c} A ${c - 6} ${c - 6} 0 1 1 ${c} 6`} /><polyline points={`${c - 6},4 ${c},6 ${c - 2},12`} /><ellipse cx={c} cy={c + 3} rx="6" ry="2.6" /><path d={`M ${c - 6} ${c + 3} v 5 c 0 1.6 2.7 2.6 6 2.6 s 6 -1 6 -2.6 v -5`} /></g>);
    return <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ display: 'block', opacity: op }}>{body}</svg>;
  }

  function Piece({ tw, m }) {
    const { T, CUES, time, authoredTotal } = window.useComposition();
    const ACCENT = tw.accent;
    const seam = Math.min(MOTION.draw(T, 0, 0.35), 1 - MOTION.draw(T, authoredTotal - 0.35, 0.35));
    const capIn = MOTION.enter(T, 0.12, 0.6, 12);
    const at = (i) => CUES.Stages + i * 0.68;
    const lit = (i) => T >= at(i) + 0.2;
    const loopK = MOTION.draw(T, CUES.Loop + 0.1, 1.1);
    const badgeIn = (i) => MOTION.enter(T, CUES.Loop + 0.5 + i * 0.14, 0.5, 14);

    if (m) {
      // portrait: numbered stages stack downward; chips + badges wrap beneath
      const rowY = (i) => 128 + i * 112;
      return (
        <div data-screen-label={`t=${Math.floor(time)}s`}
          style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 52, top: 50, font: `400 16px ${MONO}`, letterSpacing: '0.14em', opacity: 0.45, ...capIn }}>
            CONTINUOUS DATA FLYWHEEL
          </div>
          {STAGES.map((st, i) => (
            <div key={i} style={{ position: 'absolute', left: 52, right: 52, top: rowY(i), height: 96, boxSizing: 'border-box', borderRadius: 16, border: `1px solid ${lit(i) ? GREEN : EDGE}`, background: lit(i) ? 'rgba(157,191,149,0.06)' : GLASS, display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', transition: 'border-color .3s, background .3s', ...MOTION.enter(T, at(i), 0.5, 18) }}>
              <div style={{ font: `500 15px ${MONO}`, color: GREEN, width: 22 }}>{st.n}</div>
              <Icon kind={st.icon} size={40} lit={lit(i)} />
              <div>
                <div style={{ font: `600 21px ${SANS}`, letterSpacing: '0.04em' }}>{st.t}</div>
                <div style={{ font: `400 14.5px ${MONO}`, opacity: 0.55, marginTop: 4 }}>{st.d}</div>
              </div>
              {i < 5 ? <div style={{ position: 'absolute', left: 92, top: '100%', width: 2, height: 16 * MOTION.draw(T, at(i) + 0.4, 0.4), background: GREEN, opacity: 0.6 }} /> : null}
            </div>
          ))}
          <div style={{ position: 'absolute', left: 52, right: 52, top: rowY(6) + 8, ...MOTION.enter(T, CUES.Loop, 0.5, 14) }}>
            <div style={{ font: `500 15px ${MONO}`, letterSpacing: '0.14em', color: GREEN, textAlign: 'center' }}>◇ COREMANTLE DATA LAYER</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 14 }}>
              {CHIPS.map((chip, i) => (
                <div key={i} style={{ font: `500 11.5px ${MONO}`, letterSpacing: '0.05em', padding: '9px 11px', borderRadius: 10, border: `1px solid ${lit(i) ? 'rgba(157,191,149,0.6)' : EDGE}`, color: lit(i) ? GREEN : 'rgba(246,244,239,0.5)', transition: 'color .3s, border-color .3s' }}>{chip[0]} {chip[1]}</div>
              ))}
            </div>
          </div>
          <div style={{ position: 'absolute', left: 52, right: 52, bottom: 46, borderTop: `1px solid ${EDGE}`, paddingTop: 18, display: 'flex', flexWrap: 'wrap', gap: '10px 18px', justifyContent: 'center' }}>
            {BADGES.map((b, i) => (
              <div key={i} style={{ textAlign: 'center', ...badgeIn(i) }}>
                <div style={{ font: `500 12px ${MONO}`, letterSpacing: '0.08em', color: GREEN }}>{b[0]}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // desktop 1920x900
    const CARD_W = 262, GAP = 26, X0 = (1920 - 6 * CARD_W - 5 * GAP) / 2, CARD_Y = 168, CARD_H = 250;
    const cx = (i) => X0 + i * (CARD_W + GAP);
    const bandY = 490, bandH = 148;
    return (
      <div data-screen-label={`t=${Math.floor(time)}s`}
        style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>

        <div style={{ position: 'absolute', left: X0, top: 62, font: `400 19px ${MONO}`, letterSpacing: '0.14em', opacity: 0.45, ...capIn }}>
          CONTINUOUS DATA FLYWHEEL
        </div>

        {/* return loop: refresh back to source, drawn over the top */}
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }} width="1" height="1">
          <path d={`M ${cx(5) + CARD_W / 2} ${CARD_Y - 26} C ${cx(5) + CARD_W / 2} ${CARD_Y - 92}, ${cx(0) + CARD_W / 2} ${CARD_Y - 92}, ${cx(0) + CARD_W / 2} ${CARD_Y - 26}`}
            fill="none" stroke={GREEN} strokeWidth="2" strokeDasharray="10 10" opacity={0.7 * loopK}
            strokeDashoffset={-T * 26} style={{ filter: `drop-shadow(0 0 6px rgba(157,191,149,0.6))` }} />
          {loopK > 0.9 ? <polygon points={`${cx(0) + CARD_W / 2 - 6},${CARD_Y - 34} ${cx(0) + CARD_W / 2 + 6},${CARD_Y - 34} ${cx(0) + CARD_W / 2},${CARD_Y - 22}`} fill={GREEN} /> : null}
        </svg>

        {/* stage cards, strictly left to right */}
        {STAGES.map((st, i) => (
          <div key={i}>
            <div style={{ position: 'absolute', left: cx(i), top: CARD_Y, width: CARD_W, height: CARD_H, boxSizing: 'border-box', borderRadius: 20, border: `1px solid ${lit(i) ? GREEN : EDGE}`, background: lit(i) ? 'rgba(157,191,149,0.05)' : GLASS, padding: '24px 24px 20px', transition: 'border-color .3s, background .3s', boxShadow: lit(i) ? '0 0 40px -18px rgba(157,191,149,0.55)' : 'none', ...MOTION.pop(T, at(i), 0.5) }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', border: `1.5px solid ${GREEN}`, display: 'grid', placeItems: 'center', font: `500 16px ${MONO}`, color: GREEN }}>{st.n}</div>
                <Icon kind={st.icon} size={44} lit={lit(i)} />
              </div>
              <div style={{ font: `600 25px ${SANS}`, letterSpacing: '0.05em', marginTop: 34 }}>{st.t}</div>
              <div style={{ font: `400 15.5px ${MONO}`, lineHeight: 1.5, opacity: 0.55, marginTop: 12 }}>{st.d}</div>
            </div>
            {i < 5 ? (() => {
              const k = MOTION.draw(T, at(i) + 0.42, 0.4);
              const w = (GAP - 4) * k;
              return k > 0 ? <div style={{ position: 'absolute', left: cx(i) + CARD_W + 2, top: CARD_Y + CARD_H / 2 - 1, width: w, height: 2, background: GREEN, opacity: 0.85 }}>
                <div style={{ position: 'absolute', right: -1, top: -4, width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `7px solid ${GREEN}`, opacity: k > 0.95 ? 1 : 0 }} />
              </div> : null;
            })() : null}
            {/* drop line into the data layer */}
            <div style={{ position: 'absolute', left: cx(i) + CARD_W / 2 - 1, top: CARD_Y + CARD_H, width: 2, height: (bandY - CARD_Y - CARD_H - 8) * MOTION.draw(T, at(i) + 0.3, 0.5), background: `linear-gradient(180deg, ${GREEN}, rgba(157,191,149,0.15))`, opacity: 0.5 }} />
          </div>
        ))}

        {/* data layer band */}
        <div style={{ position: 'absolute', left: X0, right: X0, top: bandY, height: bandH, boxSizing: 'border-box', borderRadius: 22, border: `1px solid rgba(157,191,149,0.4)`, background: 'linear-gradient(180deg, rgba(157,191,149,0.07), rgba(157,191,149,0.02))', padding: '20px 26px', ...MOTION.enter(T, CUES.Opening + 0.2, 0.6, 20) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, font: `600 16px ${MONO}`, letterSpacing: '0.16em', color: '#c9dcc3' }}>
            <svg width="18" height="21" viewBox="0 0 76 86"><polygon points="38,4 72,40 38,82 4,40" fill="rgba(157,191,149,0.55)" stroke="#c9dcc3" strokeWidth="4" /></svg>
            COREMANTLE DATA LAYER
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginTop: 18 }}>
            {CHIPS.map((chip, i) => (
              <div key={i} style={{ boxSizing: 'border-box', borderRadius: 12, border: `1px solid ${lit(i) ? 'rgba(157,191,149,0.65)' : EDGE}`, background: 'rgba(14,13,11,0.5)', padding: '11px 8px', textAlign: 'center', font: `500 12.5px ${MONO}`, letterSpacing: '0.04em', lineHeight: 1.45, color: lit(i) ? GREEN : 'rgba(246,244,239,0.45)', boxShadow: lit(i) ? '0 0 22px -8px rgba(157,191,149,0.6)' : 'none', transition: 'color .3s, border-color .3s, box-shadow .3s' }}>
                {chip[0]}<br />{chip[1]}
              </div>
            ))}
          </div>
        </div>

        {/* trust badges */}
        <div style={{ position: 'absolute', left: X0, right: X0, bottom: 64, borderTop: `1px solid ${EDGE}`, paddingTop: 26, display: 'flex', justifyContent: 'space-between' }}>
          {BADGES.map((b, i) => (
            <div key={i} style={{ ...badgeIn(i) }}>
              <div style={{ font: `500 14px ${MONO}`, letterSpacing: '0.08em', color: GREEN }}>{b[0]}</div>
              <div style={{ font: `400 13px ${MONO}`, opacity: 0.5, marginTop: 5 }}>{b[1]}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function BidtechEvolve() {
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
        <window.CompositionStage width={m ? 900 : 1920} height={m ? 1100 : 900} bg={BG}
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
  window.BidtechEvolve = BidtechEvolve;
})();

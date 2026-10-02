// coremantle-scale-scene.jsx — "the scale of the problem": population bubbles appear,
// then each fills with its available training data — English fills completely,
// Indian languages barely register.
// Portrait layout (600x1200 stage, bubbles restacked) when the host box is portrait.
(function () {
  const E = window.Easing, clamp = window.clamp;
  const BG = '#0e0d0b', CREAM = '#f6f4ef', EDGE = 'rgba(246,244,239,0.16)';
  const GREEN = '#8b93e8', AMBER = '#d9b25e';
  const POP = 'rgba(246,244,239,0.13)', POPEDGE = 'rgba(246,244,239,0.28)';
  const MONO = '"IBM Plex Mono", monospace';
  const SANS = '"Space Grotesk", sans-serif';

  const MOTION = {
    enter: (T, start, dur = 0.5, dy = 16) => {
      const k = clamp((T - start) / dur, 0, 1), e = E.easeOutCubic(k);
      return { opacity: e, transform: `translateY(${(1 - e) * dy}px)` };
    },
    pop: (T, start, dur = 0.5) => {
      const k = clamp((T - start) / dur, 0, 1), e = E.easeOutBack(k);
      return { opacity: clamp(k * 3, 0, 1), scale: 0.7 + 0.3 * e };
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

  // R ~ sqrt(speakers); r ~ sqrt(hrs), English inner == outer (fills out)
  const LANGS = [
    { name: 'English', spk: '1.5B speakers', hrs: 360000, hrsLabel: '360,000 hrs', x: 350, y: 395, R: 205, r: 205, hero: true, at: 0 },
    { name: 'Hindi', spk: '600M speakers', hrsLabel: '6,700 hrs', x: 800, y: 245, R: 130, r: 28, at: 0.35 },
    { name: 'Bengali', spk: '230M speakers', hrsLabel: '4,800 hrs', x: 1090, y: 175, R: 80, r: 24, at: 0.55 },
    { name: 'Tamil', spk: '78M speakers', hrsLabel: '2,500 hrs', x: 870, y: 555, R: 47, r: 17, at: 0.75 },
    { name: 'Marathi', spk: '95M speakers', hrsLabel: '2,100 hrs', x: 1120, y: 475, R: 52, r: 16, at: 0.9 },
    { name: 'Telugu', spk: '96M speakers', hrsLabel: '2,000 hrs', x: 1370, y: 325, R: 52, r: 15, at: 1.05 },
  ];
  // portrait (600x1200): English up top, then a 2-bubble band and a 3-bubble band.
  // Columns keep >=30px between nowrap label blocks (22px mono ~= 13.2px/char);
  // bands keep ~90px of label room before the next band's bubbles start.
  const LANGS_M = [
    { x: 300, y: 280, R: 140, r: 140 },
    { x: 170, y: 550, R: 80, r: 22 },
    { x: 430, y: 574, R: 56, r: 19 },
    { x: 110, y: 800, R: 36, r: 15 },
    { x: 300, y: 804, R: 40, r: 14 },
    { x: 490, y: 804, R: 40, r: 13 },
  ];

  function Piece({ tw, m }) {
    const { T, CUES, time, authoredTotal } = window.useComposition();
    const ACCENT = tw.accent;
    const seam = Math.min(MOTION.draw(T, 0, 0.35), 1 - MOTION.draw(T, authoredTotal - 0.35, 0.35));
    const legendIn = MOTION.enter(T, CUES.Close + 0.15, 0.5, 14);
    const srcIn = MOTION.enter(T, CUES.Close + 0.35, 0.5, 12);

    return (
      <div data-screen-label={`t=${Math.floor(time)}s`}
        style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>


        {/* bubbles */}
        {LANGS.map((l, i) => {
          const G = m ? { ...l, ...LANGS_M[i] } : l;
          const popIn = MOTION.pop(T, CUES.Bubbles + l.at, 0.6);
          const fillK = MOTION.draw(T, CUES.Bubbles + 1.3 + l.at * 0.6, l.hero ? 1.6 : 0.8);
          const r = G.r * fillK;
          const labelIn = MOTION.enter(T, CUES.Bubbles + 1.6 + l.at * 0.6, 0.5, 12);
          return (
            <div key={i}>
              {/* population circle */}
              <div style={{
                position: 'absolute', left: G.x - G.R, top: G.y - G.R, width: G.R * 2, height: G.R * 2,
                borderRadius: '50%', background: POP, border: `1px solid ${POPEDGE}`,
                opacity: popIn.opacity, transform: `scale(${popIn.scale})`,
              }} />
              {/* training-data fill grows from center */}
              {r > 0.5 ? <div style={{
                position: 'absolute', left: G.x - r, top: G.y - r, width: r * 2, height: r * 2,
                borderRadius: '50%', background: GREEN,
                boxShadow: l.hero ? `0 0 60px rgba(139,147,232,0.3)` : `0 0 14px rgba(139,147,232,0.35)`,
              }} /> : null}
              {/* labels */}
              {l.hero ? <div style={{
                position: 'absolute', left: G.x, top: G.y, transform: 'translate(-50%,-50%)',
                textAlign: 'center', opacity: Math.min(labelIn.opacity, fillK > 0.65 ? 1 : 0.001), color: BG,
              }}>
                <div style={{ font: `600 ${m ? 40 : 44}px ${SANS}` }}>English</div>
                <div style={{ font: `400 ${m ? 22 : 23}px ${MONO}`, marginTop: 8 }}>{l.spk}</div>
                <div style={{ font: `600 ${m ? 22 : 24}px ${MONO}`, marginTop: 6 }}>{l.hrsLabel}</div>
              </div> : <div style={{
                // compose the entrance translate with the centering one — spreading
                // labelIn last would overwrite transform and left-anchor the label
                position: 'absolute', left: G.x, top: G.y + G.R + 16,
                textAlign: 'center', whiteSpace: 'nowrap',
                opacity: labelIn.opacity, transform: `translateX(-50%) ${labelIn.transform}`,
              }}>
                <div style={{ font: `600 ${m ? 24 : 25}px ${SANS}` }}>{l.name}</div>
                <div style={{ font: `400 ${m ? 22 : 22}px ${MONO}`, opacity: 0.6, marginTop: 4 }}>{l.spk}</div>
                <div style={{ font: `500 ${m ? 22 : 22}px ${MONO}`, color: GREEN, marginTop: 2 }}>{l.hrsLabel}</div>
              </div>}
            </div>
          );
        })}

        {/* legend + source: on portrait the legend sits clear of the band-2 labels
            and the source line gets its own room below (it wraps to two lines) */}
        <div style={{ position: 'absolute', left: m ? 44 : 100, bottom: m ? 170 : 118, display: 'flex', flexDirection: 'column', gap: 12, ...legendIn }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, font: `400 ${m ? 22 : 22}px ${MONO}`, opacity: 0.75 }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: GREEN, flex: 'none' }} />= training data available
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, font: `400 ${m ? 22 : 22}px ${MONO}`, opacity: 0.75 }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: POP, border: `1px solid ${POPEDGE}`, flex: 'none', boxSizing: 'border-box' }} />= speaker population
          </div>
        </div>
        <div style={{ position: 'absolute', left: m ? 44 : 100, right: m ? 44 : 'auto', bottom: m ? 92 : 66, font: `italic 400 ${m ? 20 : 21}px ${MONO}`, opacity: 0.45, ...srcIn }}>
          Source: HuggingFace Open ASR Leaderboard &middot; Ethnologue 2024
        </div>
      </div>
    );
  }

  function CoremantleScale() {
    const [tw, setTweak] = window.useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, accent: '#5E6AD2' });
    const m = useVertical();
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <window.CompositionStage width={m ? 600 : 1520} height={m ? 1200 : 860} bg={BG}
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
  window.CoremantleScale = CoremantleScale;
})();

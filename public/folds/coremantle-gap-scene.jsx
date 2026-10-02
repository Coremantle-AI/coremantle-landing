// coremantle-gap-scene.jsx — "the data gap": header, then four bars animate from 0 to
// their share of English training data; footer line lands the point.
// Renders a portrait layout (900x1050 stage, stacked rows) when the host box is taller
// than it is wide — the page gives folds a portrait aspect on mobile.
(function () {
  const E = window.Easing, clamp = window.clamp;
  const BG = '#0e0d0b', CREAM = '#f6f4ef', GLASS = 'rgba(246,244,239,0.045)', EDGE = 'rgba(246,244,239,0.16)';
  const LAVENDER = '#8b93e8';
  const MONO = '"IBM Plex Mono", monospace';
  const SANS = '"Space Grotesk", sans-serif';

  const MOTION = {
    enter: (T, start, dur = 0.5, dy = 16) => {
      const k = clamp((T - start) / dur, 0, 1), e = E.easeOutCubic(k);
      return { opacity: e, transform: `translateY(${(1 - e) * dy}px)` };
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

  const ROWS = [
    { label: 'English', sub: null, hrs: 360, pct: 100, hero: true },
    { label: 'South Asia', sub: '9 languages', hrs: 27.6, pct: 7.7 },
    { label: 'SE Asia / MENA', sub: '5 languages', hrs: 26.3, pct: 7.3 },
    { label: 'Africa', sub: '6 languages', hrs: 5.9, pct: 1.6 },
  ];
  const TRACK_X = 630, TRACK_W = 660, ROW_Y0 = 170, ROW_H = 140;

  function Piece({ tw, m }) {
    const { T, CUES, time, authoredTotal } = window.useComposition();
    const ACCENT = tw.accent;
    const seam = Math.min(MOTION.draw(T, 0, 0.35), 1 - MOTION.draw(T, authoredTotal - 0.35, 0.35));
    const footIn = MOTION.enter(T, CUES.Close + 0.2, 0.6, 18);

    if (m) {
      // portrait: label on top, full-width bar, stats underneath
      return (
        <div data-screen-label={`t=${Math.floor(time)}s`}
          style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 44, right: 44, top: 62, font: `400 22px ${MONO}`, letterSpacing: '0.12em', opacity: 0.45, ...MOTION.enter(T, CUES.Bars - 0.2, 0.5, 12) }}>
            TRAINING DATA AVAILABLE, COMPARED WITH ENGLISH
          </div>
          {ROWS.map((r, i) => {
            const at = CUES.Bars + i * 0.55;
            const rowIn = MOTION.enter(T, at, 0.5, 16);
            const barK = MOTION.draw(T, at + 0.25, r.hero ? 1.3 : 0.9);
            const w = Math.max(6, 512 * (r.pct / 100) * barK);
            const y = 150 + i * 152;
            const shownPct = (r.pct * barK).toFixed(1);
            const shownHrs = r.hero ? Math.round(r.hrs * barK) + 'k' : (r.hrs * barK).toFixed(1) + 'k';
            const c = r.hero ? LAVENDER : 'rgba(139,147,232,0.75)';
            return (
              <div key={i} style={{ position: 'absolute', left: 44, right: 44, top: y, height: 132, ...rowIn }}>
                <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <div style={{ font: `600 30px ${SANS}` }}>{r.label}</div>
                  {r.sub ? <div style={{ font: `400 22px ${MONO}`, opacity: 0.5 }}>{r.sub}</div> : null}
                </div>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 60, borderTop: `2px dashed rgba(246,244,239,0.12)` }} />
                <div style={{
                  position: 'absolute', left: 0, top: 60, transform: 'translateY(-50%)',
                  width: w, height: r.hero ? 30 : 26, borderRadius: 8,
                  background: r.hero ? `linear-gradient(90deg, rgba(139,147,232,0.55), ${LAVENDER})` : 'rgba(139,147,232,0.5)',
                  border: `1px solid ${r.hero ? LAVENDER : 'rgba(139,147,232,0.5)'}`,
                  boxShadow: r.hero ? `0 0 24px rgba(139,147,232,0.25)` : 'none',
                }} />
                <div style={{ position: 'absolute', left: 0, top: 92, font: `500 22px ${MONO}`, color: c }}>{shownHrs} hrs</div>
                <div style={{ position: 'absolute', right: 0, top: 92, font: `500 23px ${MONO}`, opacity: 0.85 }}>{shownPct}%</div>
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: 44, right: 44, bottom: 58, borderTop: `1px solid ${EDGE}`, paddingTop: 26, display: 'flex', flexDirection: 'column', gap: 6, ...footIn }}>
            <span style={{ font: `600 31px ${SANS}` }}>Billions of speakers.</span>
            <span style={{ font: `600 31px ${SANS}`, color: ACCENT }}>A fraction of the training data.</span>
          </div>
        </div>
      );
    }

    return (
      <div data-screen-label={`t=${Math.floor(time)}s`}
        style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>


        {/* chart caption */}
        <div style={{ position: 'absolute', left: 100, top: 90, font: `400 22px ${MONO}`, letterSpacing: '0.14em', opacity: 0.45, ...MOTION.enter(T, CUES.Bars - 0.2, 0.5, 12) }}>
          TRAINING DATA AVAILABLE, COMPARED WITH ENGLISH
        </div>

        {/* rows */}
        {ROWS.map((r, i) => {
          const at = CUES.Bars + i * 0.55;
          const rowIn = MOTION.enter(T, at, 0.5, 16);
          const barK = MOTION.draw(T, at + 0.25, r.hero ? 1.3 : 0.9);
          const w = Math.max(6, TRACK_W * (r.pct / 100) * barK);
          const y = ROW_Y0 + i * ROW_H;
          const shownPct = (r.pct * barK).toFixed(1);
          const shownHrs = r.hero ? Math.round(r.hrs * barK) + 'k' : (r.hrs * barK).toFixed(1) + 'k';
          const c = r.hero ? LAVENDER : 'rgba(139,147,232,0.75)';
          return (
            <div key={i} style={{ position: 'absolute', left: 100, top: y, right: 100, height: 84, ...rowIn }}>
              <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}>
                <div style={{ font: `600 30px ${SANS}` }}>{r.label}</div>
                {r.sub ? <div style={{ font: `400 22px ${MONO}`, opacity: 0.5, marginTop: 4 }}>{r.sub}</div> : null}
              </div>
              <div style={{ position: 'absolute', left: 330, top: 0, bottom: 0, borderLeft: `1px solid ${EDGE}` }} />
              <div style={{ position: 'absolute', left: 370, top: '50%', transform: 'translateY(-50%)', font: `500 26px ${MONO}`, color: c, width: 150 }}>{shownHrs} hrs</div>
              {/* track */}
              <div style={{ position: 'absolute', left: TRACK_X - 100, right: 110, top: '50%', borderTop: `2px dashed rgba(246,244,239,0.12)` }} />
              {/* bar */}
              <div style={{
                position: 'absolute', left: TRACK_X - 100, top: '50%', transform: 'translateY(-50%)',
                width: w, height: r.hero ? 34 : 30, borderRadius: 8,
                background: r.hero ? `linear-gradient(90deg, rgba(139,147,232,0.55), ${LAVENDER})` : 'rgba(139,147,232,0.5)',
                border: `1px solid ${r.hero ? LAVENDER : 'rgba(139,147,232,0.5)'}`,
                boxShadow: r.hero ? `0 0 24px rgba(139,147,232,0.25)` : 'none',
              }} />
              <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', font: `500 27px ${MONO}`, opacity: 0.85 }}>{shownPct}%</div>
            </div>
          );
        })}

        {/* footer */}
        <div style={{ position: 'absolute', left: 100, right: 100, bottom: 70, borderTop: `1px solid ${EDGE}`, paddingTop: 34, display: 'flex', alignItems: 'baseline', gap: 14, ...footIn }}>
          <span style={{ font: `600 34px ${SANS}` }}>Billions of speakers.</span>
          <span style={{ font: `600 34px ${SANS}`, color: ACCENT }}>A fraction of the training data.</span>
        </div>
      </div>
    );
  }

  function CoremantleGap() {
    const [tw, setTweak] = window.useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, accent: '#5E6AD2' });
    const m = useVertical();
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <window.CompositionStage width={m ? 600 : 1520} height={m ? 1050 : 860} bg={BG}
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
  window.CoremantleGap = CoremantleGap;
})();

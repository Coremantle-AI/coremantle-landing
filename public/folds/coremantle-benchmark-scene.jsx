// coremantle-benchmark-scene.jsx — "benchmark comparison": accuracy bars grow from
// zero — ours in lavender on top, commercial engines dim, off-the-shelf Whisper as
// the solid-cream baseline at the bottom (inverts to the black bar in light theme).
// Copy is per-page: the fold HTML sets window.CM_BENCH_COPY (headline / sub / foot).
// Portrait layout (900x1250 stage, label above each full-width bar) when the host
// box is portrait.
(function () {
  const E = window.Easing, clamp = window.clamp;
  const BG = '#0e0d0b', CREAM = '#f6f4ef', GLASS = 'rgba(246,244,239,0.045)', EDGE = 'rgba(246,244,239,0.16)';
  const LAVENDER = '#8b93e8';
  const MONO = '"IBM Plex Mono", monospace';
  const SANS = '"Space Grotesk", sans-serif';

  const COPY = Object.assign({
    headA: 'Better Data. ',
    headB: 'Better Model Accuracy.',
    sub: 'Natural conversational data from Automobile Hindi-English call-centres',
    footA: 'Our data makes the model reach 90.6% accuracy, ',
    footB: 'cutting word error rate in half versus the next-best commercial engine.',
  }, window.CM_BENCH_COPY || {});

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

  // top-to-bottom: ours first as the headline result, the field in the middle,
  // off-the-shelf Whisper last as the floor
  const ROWS = [
    { label: 'Whisper + CoreMantle · 500h', pct: 90.6, kind: 'ours' },
    { label: 'Whisper + CoreMantle · 250h', pct: 85.6, kind: 'ours' },
    { label: 'Global STT Provider', pct: 80.9 },
    { label: 'Indian Foundation Lab 1', pct: 72.7 },
    { label: 'Indian Foundation Lab 2', pct: 65.6 },
    { label: 'Legacy STT Provider', pct: 65.0 },
    { label: 'Whisper · off-the-shelf', pct: 23.1, kind: 'base' },
  ];
  const MAX = 90.6, BAR_X = 620, BAR_W = 900, ROW_Y0 = 396, ROW_H = 72;

  function Piece({ tw, m }) {
    const { T, CUES, time, authoredTotal } = window.useComposition();
    const ACCENT = tw.accent;
    const seam = Math.min(MOTION.draw(T, 0, 0.35), 1 - MOTION.draw(T, authoredTotal - 0.35, 0.35));
    const footIn = MOTION.enter(T, CUES.Close + 0.2, 0.6, 18);

    if (m) {
      return (
        <div data-screen-label={`t=${Math.floor(time)}s`}
          style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>
          {/* top bar */}
          <div style={{ position: 'absolute', left: 44, right: 44, top: 48, ...MOTION.enter(T, 0.1) }}>
            <div style={{ font: `400 22px ${MONO}`, opacity: 0.5 }}>accuracy &middot; higher is better</div>
          </div>

          {/* header */}
          <div style={{ position: 'absolute', left: 44, right: 44, top: 140 }}>
            <div style={{ font: `600 22px ${MONO}`, letterSpacing: '0.16em', color: ACCENT, ...MOTION.enter(T, 0.25, 0.5, 14) }}>BENCHMARK COMPARISON</div>
            <div style={{ font: `600 34px ${SANS}`, letterSpacing: '-0.02em', marginTop: 10, lineHeight: 1.12, ...MOTION.enter(T, 0.4, 0.6, 24) }}>
              {COPY.headA}<span style={{ color: ACCENT }}>{COPY.headB}</span>
            </div>
            <div style={{ font: `400 22px ${MONO}`, opacity: 0.6, marginTop: 12, lineHeight: 1.5, ...MOTION.enter(T, 0.65, 0.6, 16) }}>
              {COPY.sub}
            </div>
          </div>

          {/* rows: label above full-width bar */}
          {ROWS.map((r, i) => {
            const at = CUES.Bars + i * 0.38;
            const rowIn = MOTION.enter(T, at, 0.45, 14);
            const barK = MOTION.draw(T, at + 0.15, 0.8);
            const w = Math.max(4, 512 * (r.pct / MAX) * barK);
            const y = 420 + i * 86;
            const c = r.kind === 'ours' ? LAVENDER : r.kind === 'base' ? CREAM : 'rgba(246,244,239,0.22)';
            return (
              <div key={i} style={{ position: 'absolute', left: 44, right: 44, top: y, height: 74, ...rowIn }}>
                <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ font: `${r.kind ? 600 : 500} 24px ${SANS}`, color: r.kind === 'ours' ? LAVENDER : CREAM, opacity: r.kind ? 1 : 0.75, whiteSpace: 'nowrap' }}>{r.label}</span>
                  {r.kind === 'ours' ? <span style={{ font: `500 18px ${MONO}`, letterSpacing: '0.12em', color: LAVENDER, opacity: 0.7 * MOTION.draw(T, at + 0.8, 0.4) }}>OURS</span> : null}
                </div>
                <div style={{ position: 'absolute', right: 0, top: 0, font: `500 22px ${MONO}`, color: r.kind === 'ours' ? LAVENDER : CREAM, opacity: 0.9 }}>{(r.pct * barK).toFixed(1)}%</div>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 38, borderTop: `1px solid rgba(246,244,239,0.08)` }} />
                <div style={{
                  position: 'absolute', left: 0, top: 38, transform: 'translateY(-50%)',
                  width: w, height: 24, borderRadius: 5, background: c,
                  boxShadow: r.kind === 'ours' ? '0 0 20px rgba(139,147,232,0.3)' : 'none',
                }} />
              </div>
            );
          })}

          {/* footer takeaway */}
          <div style={{
            position: 'absolute', left: 44, right: 44, bottom: 48, borderTop: `2px solid ${ACCENT}`,
            paddingTop: 20, lineHeight: 1.35, ...footIn,
          }}>
            <span style={{ font: `500 24px ${SANS}` }}>{COPY.footA}</span>
            <span style={{ font: `600 24px ${SANS}`, color: ACCENT }}>{COPY.footB}</span>
          </div>
        </div>
      );
    }

    return (
      <div data-screen-label={`t=${Math.floor(time)}s`}
        style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>
        {/* top bar */}
        <div style={{ position: 'absolute', left: 90, right: 90, top: 52, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', ...MOTION.enter(T, 0.1) }}>
          <div style={{ font: `400 19px ${MONO}`, opacity: 0.5 }}>accuracy &middot; higher is better</div>
        </div>

        {/* header */}
        <div style={{ position: 'absolute', left: 130, top: 138 }}>
          <div style={{ font: `600 22px ${MONO}`, letterSpacing: '0.18em', color: ACCENT, ...MOTION.enter(T, 0.25, 0.5, 14) }}>BENCHMARK COMPARISON</div>
          <div style={{ font: `600 52px ${SANS}`, letterSpacing: '-0.02em', marginTop: 14, ...MOTION.enter(T, 0.4, 0.6, 24) }}>
            {COPY.headA}<span style={{ color: ACCENT }}>{COPY.headB}</span>
          </div>
          <div style={{ font: `400 23px ${MONO}`, opacity: 0.6, marginTop: 16, ...MOTION.enter(T, 0.65, 0.6, 16) }}>
            {COPY.sub}
          </div>
        </div>

        {/* rows */}
        {ROWS.map((r, i) => {
          const at = CUES.Bars + i * 0.38;
          const rowIn = MOTION.enter(T, at, 0.45, 14);
          const barK = MOTION.draw(T, at + 0.15, 0.8);
          const w = Math.max(4, BAR_W * (r.pct / MAX) * barK);
          const y = ROW_Y0 + i * ROW_H;
          const c = r.kind === 'ours' ? LAVENDER : r.kind === 'base' ? CREAM : 'rgba(246,244,239,0.22)';
          return (
            <div key={i} style={{ position: 'absolute', left: 130, right: 110, top: y, height: 52, ...rowIn }}>
              <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', font: `${r.kind ? 600 : 500} 24px ${SANS}`, color: r.kind === 'ours' ? LAVENDER : CREAM, opacity: r.kind ? 1 : 0.75, whiteSpace: 'nowrap' }}>{r.label}</div>
              <div style={{ position: 'absolute', left: BAR_X - 130, top: 0, bottom: 0, borderLeft: `1px solid ${EDGE}` }} />
              <div style={{
                position: 'absolute', left: BAR_X - 130, top: '50%', transform: 'translateY(-50%)',
                width: w, height: 36, borderRadius: 6, background: c,
                boxShadow: r.kind === 'ours' ? '0 0 20px rgba(139,147,232,0.3)' : 'none',
              }} />
              <div style={{ position: 'absolute', left: BAR_X - 130 + w + 18, top: '50%', transform: 'translateY(-50%)', font: `500 25px ${MONO}`, color: r.kind === 'ours' ? LAVENDER : CREAM, opacity: 0.9, whiteSpace: 'nowrap' }}>{(r.pct * barK).toFixed(1)}%</div>
              {r.kind === 'ours' ? <div style={{
                position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
                font: `500 16px ${MONO}`, letterSpacing: '0.14em', color: LAVENDER,
                opacity: 0.7 * MOTION.draw(T, at + 0.8, 0.4),
              }}>OURS</div> : null}
            </div>
          );
        })}

        {/* footer takeaway */}
        <div style={{
          position: 'absolute', left: 130, right: 130, bottom: 56, borderTop: `2px solid ${ACCENT}`,
          paddingTop: 26, lineHeight: 1.35, ...footIn,
        }}>
          <span style={{ font: `500 28px ${SANS}` }}>{COPY.footA}</span>
          <span style={{ font: `600 28px ${SANS}`, color: ACCENT }}>{COPY.footB}</span>
        </div>
      </div>
    );
  }

  function CoremantleBenchmark() {
    const [tw, setTweak] = window.useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, accent: '#5E6AD2' });
    const m = useVertical();
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <window.CompositionStage width={m ? 600 : 1920} height={m ? 1250 : 1080} bg={BG}
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
  window.CoremantleBenchmark = CoremantleBenchmark;
})();

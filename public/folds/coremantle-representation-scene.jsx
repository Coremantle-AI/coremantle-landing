// 82% of the world is represented by only 10% of AI training data.
// Landscape compares the figures side by side; portrait stacks the same
// evidence without reducing the type to chart labels.
(function () {
  const E = window.Easing, clamp = window.clamp;
  const BG = '#0e0d0b', CREAM = '#f6f4ef';
  const LAVENDER = '#a68cf0', AMBER = '#d9b25e';
  const EDGE = 'rgba(246,244,239,0.16)', TRACK = 'rgba(246,244,239,0.10)';
  const MONO = '"IBM Plex Mono", monospace';
  const SANS = '"Space Grotesk", sans-serif';

  const MOTION = {
    enter: (T, start, dur = 0.5, dy = 16) => {
      const k = clamp((T - start) / dur, 0, 1), e = E.easeOutCubic(k);
      return { opacity: e, transform: `translateY(${(1 - e) * dy}px)` };
    },
    grow: (T, start, dur = 0.9) => E.easeOutCubic(clamp((T - start) / dur, 0, 1)),
    draw: (T, start, dur = 0.5) => E.easeInOutSine(clamp((T - start) / dur, 0, 1)),
    pop: (T, start, dur = 0.5) => {
      const k = clamp((T - start) / dur, 0, 1), e = E.easeOutBack(k);
      return { opacity: clamp(k * 3, 0, 1), transform: `scale(${0.82 + 0.18 * e})` };
    },
  };

  function useVertical() {
    const get = () => window.innerHeight > window.innerWidth;
    const [vertical, setVertical] = React.useState(get);
    React.useEffect(() => {
      const update = () => setVertical(get());
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }, []);
    return vertical;
  }

  function Landscape({ T, CUES, accent }) {
    const trainingK = MOTION.grow(T, CUES.Compare + 0.15, 1.25);
    const populationK = MOTION.grow(T, CUES.Compare + 0.72, 1.1);
    const trainingIn = MOTION.enter(T, CUES.Compare, 0.5, 14);
    const populationIn = MOTION.enter(T, CUES.Compare + 0.55, 0.5, 14);
    const close = MOTION.enter(T, CUES.Close + 0.1, 0.65, 18);

    const Row = ({ y, label, pct, k, color, glow, entrance }) => (
      <div style={{ position: 'absolute', left: 100, right: 100, top: y, height: 150, ...entrance }}>
        <div style={{ position: 'absolute', left: 0, top: 14, width: 300, font: `600 25px/1.34 ${MONO}`, letterSpacing: '0.07em', color, whiteSpace: 'pre-line' }}>{label}</div>
        <div style={{ position: 'absolute', left: 340, top: 0, width: 780, height: 116, borderRadius: 20, background: TRACK, border: `1px solid ${EDGE}`, overflow: 'hidden' }}>
          <div style={{ width: `${pct * k}%`, height: '100%', borderRadius: 17, background: color, boxShadow: glow }} />
        </div>
        <div style={{ position: 'absolute', left: 1150, top: 6, width: 170, textAlign: 'right', font: `600 82px ${SANS}`, letterSpacing: '-0.045em', color }}>
          {Math.round(pct * k)}<span style={{ fontSize: 42 }}>%</span>
        </div>
      </div>
    );

    return (
      <div>
        <div style={{ position: 'absolute', left: 100, top: 110, font: `500 22px ${MONO}`, letterSpacing: '0.14em', opacity: 0.48, ...MOTION.enter(T, CUES.Opening, 0.5, 12) }}>
          GLOBAL REPRESENTATION IN AI
        </div>
        <Row y={250} label={'AI TRAINING DATA\nSERVING THE MAJORITY'} pct={10} k={trainingK} color={LAVENDER} glow="0 0 28px rgba(166,140,240,0.48)" entrance={trainingIn} />
        <Row y={460} label={'WORLD POPULATION\nUNDERREPRESENTED'} pct={82} k={populationK} color={AMBER} glow="0 0 24px rgba(217,178,94,0.34)" entrance={populationIn} />
        <div style={{ position: 'absolute', left: 100, right: 100, bottom: 118, paddingTop: 40, borderTop: `1px solid ${EDGE}`, font: `600 46px/1.2 ${SANS}`, letterSpacing: '-0.025em', ...close }}>
          <span style={{ color: accent }}>82% of the world</span> is served by only 10% of AI training data.
        </div>
      </div>
    );
  }

  function Portrait({ T, CUES, accent }) {
    const trainingK = MOTION.grow(T, CUES.Compare + 0.15, 1.25);
    const populationK = MOTION.grow(T, CUES.Compare + 0.72, 1.1);
    const close = MOTION.enter(T, CUES.Close + 0.1, 0.65, 18);

    const Row = ({ y, label, pct, k, color, entrance }) => (
      <div style={{ position: 'absolute', left: 44, right: 44, top: y, height: 260, ...entrance }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 380, font: `600 24px/1.35 ${MONO}`, letterSpacing: '0.06em', color, whiteSpace: 'pre-line' }}>{label}</div>
        <div style={{ position: 'absolute', right: 0, top: -10, font: `600 72px ${SANS}`, letterSpacing: '-0.045em', color }}>{Math.round(pct * k)}<span style={{ fontSize: 36 }}>%</span></div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 108, height: 96, borderRadius: 16, background: TRACK, border: `1px solid ${EDGE}`, overflow: 'hidden' }}>
          <div style={{ width: `${pct * k}%`, height: '100%', borderRadius: 11, background: color, boxShadow: `0 0 24px ${color}66` }} />
        </div>
      </div>
    );

    return (
      <div>
        <div style={{ position: 'absolute', left: 44, top: 62, font: `500 20px ${MONO}`, letterSpacing: '0.12em', opacity: 0.48, ...MOTION.enter(T, CUES.Opening, 0.5, 12) }}>GLOBAL REPRESENTATION IN AI</div>
        <Row y={230} label={'AI TRAINING DATA\nSERVING THE MAJORITY'} pct={10} k={trainingK} color={LAVENDER} entrance={MOTION.enter(T, CUES.Compare, 0.5, 14)} />
        <Row y={580} label={'WORLD POPULATION\nUNDERREPRESENTED'} pct={82} k={populationK} color={AMBER} entrance={MOTION.enter(T, CUES.Compare + 0.55, 0.5, 14)} />
        <div style={{ position: 'absolute', left: 44, right: 44, bottom: 130, paddingTop: 32, borderTop: `1px solid ${EDGE}`, font: `600 34px/1.28 ${SANS}`, letterSpacing: '-0.02em', ...close }}>
          <span style={{ color: accent }}>82% of the world</span> is served by only 10% of AI training data.
        </div>
      </div>
    );
  }

  function Piece({ tw, vertical }) {
    const { T, CUES, time, authoredTotal } = window.useComposition();
    const seam = Math.min(MOTION.draw(T, 0, 0.35), 1 - MOTION.draw(T, authoredTotal - 0.35, 0.35));
    return (
      <div data-screen-label={`t=${Math.floor(time)}s`} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: BG, color: CREAM, fontFamily: SANS, opacity: seam }}>
        {vertical ? <Portrait T={T} CUES={CUES} accent={tw.accent} /> : <Landscape T={T} CUES={CUES} accent={tw.accent} />}
      </div>
    );
  }

  function CoremantleRepresentation() {
    const [tw, setTweak] = window.useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, accent: '#8B93E8' });
    const vertical = useVertical();
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <window.CompositionStage width={vertical ? 600 : 1520} height={vertical ? 1200 : 860} bg={BG} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
          <Piece tw={tw} vertical={vertical} />
        </window.CompositionStage>
        <window.TweaksPanel>
          <window.TweakSection label="Playback" />
          <window.TweakToggle label="Motion editor" value={tw.motionEditor} onChange={(value) => setTweak('motionEditor', value)} />
          <window.TweakSection label="Style" />
          <window.TweakColor label="Accent" value={tw.accent} options={['#8B93E8', '#D97757', '#3E7C7B']} onChange={(value) => setTweak('accent', value)} />
        </window.TweaksPanel>
      </div>
    );
  }

  window.CoremantleRepresentation = CoremantleRepresentation;
})();

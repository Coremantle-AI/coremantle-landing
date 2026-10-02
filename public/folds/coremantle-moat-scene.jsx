// coremantle-moat-scene.jsx — "the regulatory moat": legacy datasets hit the DPDP
// checkpoint and get blocked; CoreMantle's consent-first pipeline passes straight
// through to a compliant dataset.
// Portrait layout (900x1350 stage: legacy panel, DPDP band, CoreMantle panel stacked)
// when the host box is portrait.
(function () {
  const E = window.Easing, clamp = window.clamp;
  const BG = '#0e0d0b', CREAM = '#f6f4ef', GLASS = 'rgba(246,244,239,0.045)';
  const LAVENDER = '#8b93e8', RED = '#cf6b4f';
  const MONO = '"IBM Plex Mono", monospace';
  const SANS = '"Space Grotesk", sans-serif';
  const fract = (x) => x - Math.floor(x);

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

  // landscape geometry (1620x860 stage): panels flank the DPDP pillar, diagram fills the frame
  const PANEL_Y = 90, PANEL_H = 680, PILLAR_X = 735, PILLAR_W = 150;
  const L = { x: 36, w: 651, cards: ['archived data', 'broken consent', 'no audit trail'], chips: ['pre-DPDP', 'retrofitted', 'unclear consent'], verdict: 'Not built for DPDP. High risk. Low-value use cases only.' };
  const R = { x: 933, w: 651, cards: ['consent capture', 'audit trail', 'compliant dataset'], chips: ['built on consent', 'audit trail', 'from day one'], verdict: 'Built for DPDP. Low risk. Enterprise-ready. Future-proof.' };
  // portrait geometry: both panels full width, stacked; DPDP is a horizontal band between
  const M_PANEL = { x: 32, w: 536, h: 510 };
  const M_LY = 50, M_BAND_Y = 600, M_BAND_H = 150, M_RY = 810;
  // card/chip/verdict metrics — the two orientations have very different vertical budgets
  const SZ_L = { cardW: 182, cardH: 165, cardsTop: 160, chipsTop: 395, verdictTop: 515, mark: 25, label: 22, chip: 19, verdict: 20 };
  const SZ_M = { cardW: 144, cardH: 150, cardsTop: 110, chipsTop: 290, verdictTop: 400, mark: 25, label: 20, chip: 19, verdict: 20 };

  function PanelCards({ P, at, T, c, tick, py, sw, s }) {
    return (
      <div>
        <div style={{ position: 'absolute', left: P.x + 30, top: py + s.cardsTop, right: sw - P.x - P.w + 30, display: 'flex', gap: 22, justifyContent: 'center' }}>
          {P.cards.map((t, i) => (
            <div key={i} style={{
              width: s.cardW, height: s.cardH, boxSizing: 'border-box', borderRadius: 16, padding: '20px 18px',
              border: `1px solid ${c}44`, background: 'rgba(14,13,11,0.5)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              ...MOTION.pop(T, at + 0.2 + i * 0.18, 0.45),
            }}>
              <div style={{ font: `500 ${s.mark}px ${MONO}`, color: c }}>{tick ? '✓' : '✗'}</div>
              <div style={{ font: `500 ${s.label}px ${MONO}`, color: CREAM, opacity: 0.85 }}>{t}</div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: P.x + 40, top: py + s.chipsTop, right: sw - P.x - P.w + 40, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
          {P.chips.map((t, i) => (
            <span key={i} style={{
              padding: '11px 20px', borderRadius: 999, border: `1px solid ${c}55`, background: `${c}11`,
              font: `400 ${s.chip}px ${MONO}`, color: c, whiteSpace: 'nowrap', display: 'inline-block',
              ...MOTION.pop(T, at + 0.75 + i * 0.14, 0.4),
            }}>{t}</span>
          ))}
        </div>
        <div style={{
          position: 'absolute', left: P.x + 40, top: py + s.verdictTop, width: P.w - 80, boxSizing: 'border-box',
          border: `1px dashed ${c}44`, borderRadius: 12, padding: '16px 22px', textAlign: 'center',
          font: `400 ${s.verdict}px ${MONO}`, color: c, ...MOTION.enter(T, at + 1.2, 0.5, 12),
        }}>{P.verdict}</div>
      </div>
    );
  }

  function Piece({ tw, m }) {
    const { T, CUES, time, authoredTotal } = window.useComposition();
    const ACCENT = tw.accent;
    const seam = Math.min(MOTION.draw(T, 0, 0.35), 1 - MOTION.draw(T, authoredTotal - 0.35, 0.35));
    const pillarIn = MOTION.draw(T, CUES.Checkpoint, 0.8);
    const lPanel = MOTION.enter(T, CUES.Legacy, 0.6, 20);
    const rPanel = MOTION.enter(T, CUES.CoreMantle, 0.6, 20);
    const blockK = MOTION.draw(T, CUES.Legacy + 1.5, 0.5);
    const xPop = MOTION.pop(T, CUES.Legacy + 1.9, 0.5);
    const passK = MOTION.draw(T, CUES.CoreMantle + 1.5, 0.7);
    const pulse = 0.5 + 0.5 * Math.sin(T * 2.4);

    if (m) {
      const LP = { ...L, ...M_PANEL }, RP = { ...R, ...M_PANEL };
      return (
        <div data-screen-label={`t=${Math.floor(time)}s`}
          style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>

          {/* legacy panel */}
          <div style={{ position: 'absolute', left: M_PANEL.x, top: M_LY, width: M_PANEL.w, height: M_PANEL.h, borderRadius: 24, border: `1px solid ${RED}44`, background: GLASS, boxSizing: 'border-box', ...lPanel }}>
            <div style={{ position: 'absolute', left: 36, top: 28, display: 'flex', alignItems: 'center', gap: 14, font: `600 31px ${SANS}`, color: RED }}>
              <span style={{ font: `500 26px ${MONO}` }}>&#9888;</span> Legacy datasets
            </div>
          </div>
          {T > CUES.Legacy ? <PanelCards P={LP} at={CUES.Legacy} T={T} c={RED} tick={false} py={M_LY} sw={600} s={SZ_M} /> : null}

          {/* legacy flow — blocked at the checkpoint */}
          <div style={{ position: 'absolute', left: 299, top: M_LY + M_PANEL.h + 4, height: 48, borderLeft: `2px dashed ${RED}88`, clipPath: `inset(0 0 ${(1 - blockK) * 100}% 0)` }} />
          <div style={{
            position: 'absolute', left: 300, top: M_LY + M_PANEL.h + 36, transform: `translate(-50%,-50%) ${xPop.transform}`,
            font: `600 40px ${MONO}`, color: RED, opacity: xPop.opacity, textShadow: `0 0 20px ${RED}88`,
          }}>&#10007;</div>

          {/* DPDP band */}
          <div style={{
            position: 'absolute', left: M_PANEL.x, top: M_BAND_Y + (1 - pillarIn) * 40, width: M_PANEL.w, height: M_BAND_H, boxSizing: 'border-box',
            borderRadius: 20, border: `1px solid ${LAVENDER}`, background: 'rgba(139,147,232,0.07)', opacity: pillarIn,
            boxShadow: `0 0 ${34 + 20 * pulse}px rgba(139,147,232,0.28)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, textAlign: 'center',
          }}>
            <div style={{ font: `500 34px ${MONO}`, color: LAVENDER }}>&#9878;</div>
            <div style={{ font: `600 42px ${SANS}`, letterSpacing: '0.04em' }}>DPDP</div>
            <div style={{ font: `400 19px ${MONO}`, opacity: 0.55, lineHeight: 1.5, textAlign: 'left' }}>LEGAL COMPLIANCE<br />CHECKPOINT</div>
          </div>

          {/* coremantle flow — passes through */}
          <div style={{ position: 'absolute', left: 299, top: M_BAND_Y + M_BAND_H + 4, height: 52, borderLeft: `2px solid ${LAVENDER}`, transform: `scaleY(${passK})`, transformOrigin: '50% 0' }}>
            {passK > 0.95 ? <div style={{
              position: 'absolute', left: -5, bottom: -6, width: 0, height: 0,
              borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `8px solid ${LAVENDER}`,
            }} /> : null}
          </div>
          {passK > 0.3 ? <div style={{
            position: 'absolute', left: 295, top: M_BAND_Y + M_BAND_H + 4, transform: `translateY(${fract(T * 0.7) * 46}px)`, width: 8, height: 8,
            borderRadius: 4, background: LAVENDER, boxShadow: `0 0 12px ${LAVENDER}`, opacity: passK,
          }} /> : null}

          {/* coremantle panel */}
          <div style={{ position: 'absolute', left: M_PANEL.x, top: M_RY, width: M_PANEL.w, height: M_PANEL.h, borderRadius: 24, border: `1px solid ${LAVENDER}55`, background: GLASS, boxSizing: 'border-box', boxShadow: `0 0 40px rgba(139,147,232,0.08)`, ...rPanel }}>
            <div style={{ position: 'absolute', left: 36, top: 28, display: 'flex', alignItems: 'center', gap: 14, font: `600 31px ${SANS}`, color: LAVENDER }}>
              <span style={{ font: `500 26px ${MONO}` }}>&#10003;</span> CoreMantle
            </div>
          </div>
          {T > CUES.CoreMantle ? <PanelCards P={RP} at={CUES.CoreMantle} T={T} c={LAVENDER} tick={true} py={M_RY} sw={600} s={SZ_M} /> : null}
        </div>
      );
    }

    return (
      <div data-screen-label={`t=${Math.floor(time)}s`}
        style={{ position: 'absolute', inset: 0, background: BG, opacity: seam, fontFamily: SANS, color: CREAM, overflow: 'hidden' }}>


        {/* panels */}
        <div style={{ position: 'absolute', left: L.x, top: PANEL_Y, width: L.w, height: PANEL_H, borderRadius: 24, border: `1px solid ${RED}44`, background: GLASS, boxSizing: 'border-box', ...lPanel }}>
          <div style={{ position: 'absolute', left: 40, top: 34, display: 'flex', alignItems: 'center', gap: 14, font: `600 34px ${SANS}`, color: RED }}>
            <span style={{ font: `500 29px ${MONO}` }}>&#9888;</span> Legacy datasets
          </div>
        </div>
        <div style={{ position: 'absolute', left: R.x, top: PANEL_Y, width: R.w, height: PANEL_H, borderRadius: 24, border: `1px solid ${LAVENDER}55`, background: GLASS, boxSizing: 'border-box', boxShadow: `0 0 40px rgba(139,147,232,0.08)`, ...rPanel }}>
          <div style={{ position: 'absolute', left: 40, top: 34, display: 'flex', alignItems: 'center', gap: 14, font: `600 34px ${SANS}`, color: LAVENDER }}>
            <span style={{ font: `500 29px ${MONO}` }}>&#10003;</span> CoreMantle
          </div>
        </div>
        {T > CUES.Legacy ? <PanelCards P={L} at={CUES.Legacy} T={T} c={RED} tick={false} py={PANEL_Y + 8} sw={1620} s={SZ_L} /> : null}
        {T > CUES.CoreMantle ? <PanelCards P={R} at={CUES.CoreMantle} T={T} c={LAVENDER} tick={true} py={PANEL_Y + 8} sw={1620} s={SZ_L} /> : null}

        {/* DPDP pillar */}
        <div style={{
          position: 'absolute', left: PILLAR_X, top: PANEL_Y - 40 + (1 - pillarIn) * 50, width: PILLAR_W, height: PANEL_H + 80, boxSizing: 'border-box',
          borderRadius: 20, border: `1px solid ${LAVENDER}`, background: 'rgba(139,147,232,0.07)', opacity: pillarIn,
          boxShadow: `0 0 ${34 + 20 * pulse}px rgba(139,147,232,0.28)`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, textAlign: 'center',
        }}>
          <div style={{ font: `500 34px ${MONO}`, color: LAVENDER }}>&#9878;</div>
          <div style={{ font: `600 46px ${SANS}`, letterSpacing: '0.04em' }}>DPDP</div>
          <div style={{ font: `400 19px ${MONO}`, opacity: 0.55, lineHeight: 1.6 }}>LEGAL<br />COMPLIANCE<br />CHECKPOINT</div>
        </div>

        {/* legacy flow — blocked */}
        <div style={{ position: 'absolute', left: L.x + L.w + 2, top: PANEL_Y + PANEL_H / 2 - 1, width: 44, borderTop: `2px dashed ${RED}88`, clipPath: `inset(0 ${(1 - blockK) * 100}% 0 0)` }} />
        <div style={{
          position: 'absolute', left: L.x + L.w + 24, top: PANEL_Y + PANEL_H / 2, transform: `translate(-50%,-50%) ${xPop.transform}`,
          font: `600 46px ${MONO}`, color: RED, opacity: xPop.opacity, textShadow: `0 0 20px ${RED}88`,
        }}>&#10007;</div>

        {/* coremantle flow — passes */}
        <div style={{ position: 'absolute', left: PILLAR_X + PILLAR_W + 2, top: PANEL_Y + PANEL_H / 2 - 1, width: 44, borderTop: `2px solid ${LAVENDER}`, transform: `scaleX(${passK})`, transformOrigin: '0 50%' }}>
          {passK > 0.95 ? <div style={{
            position: 'absolute', right: -4, top: -6, width: 0, height: 0,
            borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `8px solid ${LAVENDER}`,
          }} /> : null}
        </div>
        {passK > 0.3 ? <div style={{
          position: 'absolute', left: PILLAR_X + PILLAR_W + 2, top: PANEL_Y + PANEL_H / 2 - 4, transform: `translateX(${fract(T * 0.7) * 40}px)`, width: 8, height: 8,
          borderRadius: 4, background: LAVENDER, boxShadow: `0 0 12px ${LAVENDER}`, opacity: passK,
        }} /> : null}
      </div>
    );
  }

  function CoremantleMoat() {
    const [tw, setTweak] = window.useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, accent: '#5E6AD2' });
    const m = useVertical();
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <window.CompositionStage width={m ? 600 : 1620} height={m ? 1350 : 860} bg={BG}
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
  window.CoremantleMoat = CoremantleMoat;
})();

// Chapter 01 artwork for the Process scrub: one figure per pipeline stage.
// All drawn in a 400x560 (or 260x560) box; the beams line up across cells.

const LABEL_ROWS = [436, 466, 496, 526];

/**
 * A stack of four pill labels under a stage (rejections or enrichments).
 * @param {Array<[number, number, string]>} items  [x, width, text] per row
 */
function LabelStack({ items, cx, className, rectClass, textClass, grouped = true }) {
  const rows = items.flatMap(([x, width, text], i) => [
    <rect className={rectClass} x={x} y={LABEL_ROWS[i]} width={width} height="24" rx="6" key={`r${i}`} />,
    <text className={textClass} x={cx} y={LABEL_ROWS[i] + 16} textAnchor="middle" key={`t${i}`}>
      {text}
    </text>,
  ]);
  return grouped ? <g className={className}>{rows}</g> : rows;
}

const Beam = ({ d }) => <path className="pl-beam" d={d} />;

/** Beam out of a stage, with its arrowhead. */
const OutBeam = ({ from, arrowX }) => (
  <>
    <Beam d={`M ${from} 234 H 620`} />
    <Beam d={`M ${arrowX} 225 L ${arrowX + 18} 234 L ${arrowX} 243`} />
  </>
);

export function RawStreamFigure() {
  return (
    <svg viewBox="0 0 260 560" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <text className="pl-raw" x="24" y="84">
        100 HOURS
      </text>
      <text className="pl-raw" x="24" y="104">
        RAW DATA
      </text>
      <rect className="pl-bar" x="24" y="120" width="14" height="9" rx="2" />
      <rect className="pl-bar" x="42" y="117" width="14" height="12" rx="2" />
      <rect className="pl-bar" x="60" y="122" width="14" height="7" rx="2" />
      <rect className="pl-out" x="84" y="114" width="70" height="20" rx="5" />
      <rect className="pl-bar" x="162" y="121" width="54" height="7" rx="3" />
      <rect className="pl-out" x="24" y="150" width="54" height="20" rx="5" />
      <text className="pl-x" x="88" y="166">
        ✕
      </text>
      <rect className="pl-bar" x="104" y="157" width="88" height="7" rx="3" opacity=".8" />
      <rect className="pl-bar" x="24" y="193" width="96" height="7" rx="3" />
      <rect className="pl-out" x="130" y="186" width="62" height="20" rx="5" />
      <rect className="pl-bar" x="24" y="222" width="14" height="11" rx="2" />
      <rect className="pl-bar" x="42" y="225" width="14" height="8" rx="2" />
      <rect className="pl-bar" x="60" y="220" width="14" height="13" rx="2" />
      <rect className="pl-bar" x="80" y="225" width="72" height="7" rx="3" opacity=".85" />
      <text className="pl-x" x="162" y="234">
        ✕
      </text>
      <rect className="pl-out" x="24" y="258" width="70" height="20" rx="5" />
      <rect className="pl-bar" x="102" y="265" width="92" height="7" rx="3" />
      <rect className="pl-bar" x="24" y="300" width="112" height="7" rx="3" opacity=".75" />
      <text className="pl-x" x="146" y="310">
        ✕
      </text>
      <rect className="pl-bar" x="162" y="300" width="42" height="7" rx="3" opacity=".6" />
      <rect className="pl-bar" x="24" y="330" width="14" height="10" rx="2" />
      <rect className="pl-bar" x="42" y="333" width="14" height="7" rx="2" />
      <rect className="pl-bar" x="60" y="328" width="14" height="12" rx="2" />
      <rect className="pl-out" x="84" y="325" width="58" height="20" rx="5" />
      <rect className="pl-out" x="24" y="360" width="46" height="20" rx="5" />
      <rect className="pl-bar" x="78" y="367" width="80" height="7" rx="3" opacity=".7" />
      <rect className="pl-bar" x="24" y="400" width="120" height="7" rx="3" opacity=".8" />
      <path className="pl-funnel" d="M 208 140 L 262 226" />
      <path className="pl-funnel" d="M 208 420 L 262 242" />
    </svg>
  );
}

const SOURCING_DOTS = [
  [42, 196, 2.6], [66, 252, 2], [84, 212, 3], [102, 284, 1.9], [112, 182, 2.3], [128, 240, 2.6],
  [58, 308, 2], [140, 204, 1.8], [96, 330, 2.3], [124, 158, 1.9], [150, 286, 2.2], [70, 168, 1.7],
];

export function SourcingFigure() {
  return (
    <svg viewBox="0 0 400 560" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <Beam d="M -180 234 H 176" />
      <Beam d="M 52 225 L 70 234 L 52 243" />
      {SOURCING_DOTS.map(([cx, cy, r]) => (
        <circle className="pl-dot" cx={cx} cy={cy} r={r} key={`${cx}-${cy}`} />
      ))}
      <polygon className="pf-l" points="236,60 254,70 254,398 236,388" />
      <polygon className="pf-t" points="180,80 236,60 236,388 180,408" />
      <OutBeam from={254} arrowX={322} />
      <line className="pl-drip" x1="208" y1="410" x2="208" y2="430" />
      <LabelStack
        className="pl-rej"
        cx={200}
        items={[
          [142, 116, '✕ NO CONSENT'],
          [144, 112, '✕ IRRELEVANT'],
          [126, 148, '✕ WRONG LANGUAGE'],
          [140, 120, '✕ LOW QUALITY'],
        ]}
      />
    </svg>
  );
}

const QC_CHECKS = [
  ['Consent', 112],
  ['Language', 144],
  ['Format', 176],
  ['Quality', 208],
  ['Policy', 240],
];

export function QualityControlFigure() {
  return (
    <svg viewBox="0 0 400 560" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <Beam d="M -220 234 H 98" />
      <rect className="pl-panel" x="100" y="60" width="200" height="350" rx="16" />
      {QC_CHECKS.flatMap(([label, y]) => [
        <text className="pl-chk" x="124" y={y} key={label}>
          {label}
        </text>,
        <text className="pl-tick" x="276" y={y} textAnchor="end" key={`${label}-tick`}>
          ✓
        </text>,
      ])}
      <polyline className="pl-spark" points="124,352 158,324 192,336 232,298 276,312" />
      <OutBeam from={300} arrowX={342} />
      <line className="pl-drip" x1="200" y1="412" x2="200" y2="430" />
      <LabelStack
        className="pl-rej"
        cx={200}
        items={[
          [166, 68, '✕ PII'],
          [127, 146, '✕ BAD FORMATTING'],
          [141, 118, '✕ WRONG TAGS'],
          [139, 122, '✕ DUPLICATES'],
        ]}
      />
    </svg>
  );
}

const COMMUNITY_LINKS = [
  [170, 125, 245, 160],
  [170, 125, 140, 215],
  [140, 215, 225, 250],
  [245, 160, 225, 250],
  [225, 250, 170, 315],
  [140, 215, 170, 315],
  [225, 250, 255, 320],
  [245, 160, 255, 320],
];

const COMMUNITY_NODES = [
  [170, 125, 10],
  [245, 160, 9],
  [140, 215, 9],
  [225, 250, 10],
  [170, 315, 9],
  [255, 320, 8],
];

export function CommunityFigure() {
  return (
    <svg viewBox="0 0 400 560" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <Beam d="M -220 234 H 98" />
      <rect className="pl-panel" x="100" y="60" width="200" height="350" rx="16" />
      {COMMUNITY_LINKS.map(([x1, y1, x2, y2]) => (
        <line className="pl-link" x1={x1} y1={y1} x2={x2} y2={y2} key={`${x1}${y1}${x2}${y2}`} />
      ))}
      {COMMUNITY_NODES.map(([cx, cy, r]) => (
        <circle className="pl-node" cx={cx} cy={cy} r={r} key={`${cx}${cy}`} />
      ))}
      <OutBeam from={300} arrowX={342} />
      <line className="pl-drip" x1="200" y1="412" x2="200" y2="430" />
      <LabelStack
        className="pl-rej"
        cx={200}
        items={[
          [125, 150, '✕ UNCLEAR CONTEXT'],
          [127, 146, '✕ LOW CONFIDENCE'],
          [145, 110, '✕ OUTLIERS'],
          [125, 150, '✕ CONTRADICTIONS'],
        ]}
      />
    </svg>
  );
}

export function ModelReadyFigure() {
  return (
    <svg viewBox="-10 0 460 560" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <Beam d="M -230 234 H 130" />
      <ellipse className="gem-glow" cx="220" cy="361" rx="60" ry="10" />
      <polygon className="gem-body" points="220,129 310,234 220,339 130,234" />
      <line x1="130" y1="234" x2="310" y2="234" />
      <line x1="220" y1="129" x2="220" y2="339" />
      <line className="pl-drip pl-drip--acc" x1="220" y1="347" x2="112" y2="428" />
      <line className="pl-drip pl-drip--acc" x1="220" y1="347" x2="328" y2="428" />
      <LabelStack
        className="pl-enr"
        cx={110}
        items={[
          [58, 104, 'DIALECT ✓'],
          [54, 112, 'CODE-MIX ✓'],
          [56, 108, 'CONTEXT ✓'],
          [32, 156, 'SPEAKER NUANCE ✓'],
        ]}
      />
      <LabelStack
        grouped={false}
        rectClass="pl-out"
        textClass="pl-out-t"
        cx={330}
        items={[
          [274, 112, 'STRUCTURED'],
          [282, 96, 'VERIFIED'],
          [276, 108, 'TRAINABLE'],
          [276, 108, 'HIGH-YIELD'],
        ]}
      />
    </svg>
  );
}

// stage heading icons
export function SourcingIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle className="pl-icon" cx="12" cy="12" r="6" />
      <path className="pl-icon" d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <circle className="pl-icon-dot" cx="12" cy="12" r="1.6" />
    </svg>
  );
}

export function QualityControlIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path className="pl-icon" d="M12 3l7 3v6c0 4.5-3 7.5-7 9c-4-1.5-7-4.5-7-9V6z" />
      <path className="pl-icon" d="M8.5 12l2.5 3 4.5-6" />
    </svg>
  );
}

export function CommunityIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle className="pl-icon" cx="8" cy="8" r="2.6" />
      <circle className="pl-icon" cx="16" cy="8" r="2.6" />
      <circle className="pl-icon" cx="12" cy="15" r="2.6" />
      <path className="pl-icon" d="M4.5 14a3.5 3 0 0 1 7 0M12.5 14a3.5 3 0 0 1 7 0M8.5 21a3.5 3 0 0 1 7 0" />
    </svg>
  );
}

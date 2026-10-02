import QualityScrub, { PrismApex, PrismSlot, segProps } from '@/components/scrub/QualityScrub';

// "Built for continuous improvement": chapter 01 builds the six-stage data
// flywheel; its gem becomes the prism that lands in the continuous data layer
// of chapter 02, which restates the flywheel as the loop inside the reader's
// training cycle.

const STAGES = [
  { s: '-.08', n: '01', label: 'SOURCE', title: 'Source', body: 'Real world. Real languages.', cx: 260, cy: 80 },
  { s: '.115', n: '02', label: 'TRAIN', title: 'Train', body: 'High-quality data for stronger models.', cx: 416, cy: 170 },
  { s: '.18', n: '03', label: 'ALIGN', title: 'Align', body: 'Human feedback and safety at scale.', cx: 416, cy: 350 },
  { s: '.245', n: '04', label: 'EVALUATE', title: 'Evaluate', body: 'Measure what matters. Find what’s missing.', cx: 260, cy: 440 },
  { s: '.31', n: '05', label: 'IMPROVE', title: 'Improve', body: 'Close gaps. Reduce errors. Improve performance.', cx: 104, cy: 350 },
  { s: '.375', n: '06', label: 'REFRESH', title: 'Refresh', body: 'Continuously expand. Always up to date.', cx: 104, cy: 170 },
];

// arcs between consecutive stages; the last one closes the loop
const ARCS = [
  { s: '.09', d: 'M 312.6 87.9 A 180 180 0 0 1 382.8 128.4', head: '391.6,136.6 386.6,124.4 379.0,132.4' },
  { s: '.155', d: 'M 435.4 219.5 A 180 180 0 0 1 435.4 300.5', head: '432.7,312.2 440.8,301.7 430.0,299.3' },
  { s: '.22', d: 'M 382.8 391.6 A 180 180 0 0 1 312.6 432.1', head: '301.1,435.6 314.2,437.4 311.0,426.8' },
  { s: '.285', d: 'M 207.4 432.1 A 180 180 0 0 1 137.2 391.6', head: '128.4,383.4 133.4,395.6 141.0,387.6' },
  { s: '.35', d: 'M 84.6 300.5 A 180 180 0 0 1 84.6 219.5', head: '87.3,207.8 79.2,218.3 90.0,220.7' },
  { s: '.415', d: 'M 137.2 128.4 A 180 180 0 0 1 207.4 87.9', head: '218.9,84.4 205.8,82.6 209.0,93.2', loop: true },
];

const NEEDS = [
  { icon: 'globe', label: 'New dialects' },
  { icon: 'db', label: 'New domains' },
  { icon: 'warn', label: 'Failure modes' },
  { icon: 'shield', label: 'Safety gaps' },
];

const STEPS = [
  { s: '.70', icon: 'search', title: 'Identify gaps', body: 'Detect what’s missing as requirements change.' },
  { s: '.73', icon: 'globe', title: 'Source', body: 'Find real-world data across languages, domains, and contexts.' },
  { s: '.76', icon: 'check', title: 'Build & verify', body: 'Curate, label, and validate data for quality, safety, and signal.' },
  { s: '.79', icon: 'refresh', title: 'Refresh data', body: 'Continuously expand coverage as the model evolves.' },
];

const OUTPUTS = [
  { s: '.84', icon: 'db', label: 'Training data' },
  { s: '.86', icon: 'people', label: 'Alignment data' },
  { s: '.88', icon: 'chart', label: 'Evaluation data' },
  { s: '.90', icon: 'refresh', label: 'Refresh data' },
];

const Icon = ({ name }) => (
  <svg>
    <use href={`#ic-${name}`} />
  </svg>
);

function Flywheel() {
  return (
    <>
      <figure className="qs1-fig">
        <svg viewBox="0 0 520 520" aria-hidden="true">
          <circle className="fw-ring" cx="260" cy="260" r="180" />
          <circle className="fw-ring" cx="260" cy="260" r="92" opacity=".5" />
          {ARCS.map(arc => (
            <g className={arc.loop ? 'fw-arc fw-arc--loop' : 'fw-arc'} style={{ '--s': arc.s, '--v': '12.5' }} key={arc.s}>
              <path pathLength="1" d={arc.d} />
              <polygon points={arc.head} />
            </g>
          ))}
          {STAGES.map(stage => (
            <g className="fw-node" style={{ '--s': stage.s, '--v': '12.5' }} key={stage.n}>
              <circle cx={stage.cx} cy={stage.cy} r="44" />
              <text className="fw-n" x={stage.cx} y={stage.cy - 6} textAnchor="middle">
                {stage.n}
              </text>
              <text className="fw-t" x={stage.cx} y={stage.cy + 14} textAnchor="middle">
                {stage.label}
              </text>
            </g>
          ))}
          <g className="fw-gem" style={{ '--s': '.45', '--v': '12.5' }}>
            <ellipse className="gem-glow" cx="260" cy="308" rx="46" ry="8" />
            <polygon className="gem-body" points="260,212 298,252 260,298 222,252" />
            <line x1="222" y1="252" x2="298" y2="252" />
            <line x1="260" y1="212" x2="260" y2="298" />
          </g>
        </svg>
        <PrismApex />
      </figure>
      <ol className="qs1-labels">
        {STAGES.map(stage => (
          <li key={stage.n} {...segProps(stage.s, '12.5')}>
            <b>{stage.n}</b>
            <h3>{stage.title}</h3>
            <p>{stage.body}</p>
          </li>
        ))}
      </ol>
    </>
  );
}

function ContinuousLoop() {
  return (
    <>
      <IconSprite />
      <div className="qs2-cycle">
        <span className="qs2-loop" {...segProps('.88', '16')} aria-hidden="true" />
        <div className="qs2-top">
          <div className="qs2-card" {...segProps('.60', '12.5')}>
            <span>Your model</span>
            <b>New release ships</b>
            <p className="qs2-ver">Model v2.1 &rarr; v2.2</p>
          </div>
          <div className="qs2-arrow" {...segProps('.615', '12.5')} aria-hidden="true">
            &rarr;
          </div>
          <div className="qs2-card qs2-card--needs" {...segProps('.63', '12.5')}>
            <span>New data needs</span>
            <b>Requirements change</b>
            <div className="qs2-needs">
              {NEEDS.map(need => (
                <span className="qs2-need" key={need.label}>
                  <Icon name={need.icon} />
                  {need.label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="qs2-down" {...segProps('.665', '14')} aria-hidden="true">
          &darr;
        </div>
        <div className="qs2-platform" {...segProps('.62', '12.5')}>
          <div className="qs2-plat-head">
            <PrismSlot />
            Coremantle continuous data layer
          </div>
          <div className="qs2-steps">
            {STEPS.map(step => (
              <div className="qs2-step" key={step.title} {...segProps(step.s, '18')}>
                <span className="qs2-ico">
                  <Icon name={step.icon} />
                </span>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
          <div className="qs2-feedback" {...segProps('.82', '16')}>
            <span>Updated data flows back into the model</span>
          </div>
          <div className="qs2-chips">
            {OUTPUTS.map(output => (
              <div className="qs2-chip" key={output.label} {...segProps(output.s, '20')}>
                <span className="qs2-ico">
                  <Icon name={output.icon} />
                </span>
                {output.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="qs2-final" {...segProps('.90', '18')}>
        Your model <em>evolves</em>. Your data infrastructure <em>evolves</em> with it.
      </p>
    </>
  );
}

/** Stroke icons referenced by `<use href="#ic-*">` in chapter 02. */
function IconSprite() {
  return (
    <svg className="qs2-sprite" aria-hidden="true" width="0" height="0">
      <symbol id="ic-search" viewBox="0 0 24 24">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <line x1="15.5" y1="15.5" x2="20.5" y2="20.5" />
      </symbol>
      <symbol id="ic-globe" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8.5" />
        <line x1="3.5" y1="12" x2="20.5" y2="12" />
        <ellipse cx="12" cy="12" rx="4" ry="8.5" />
      </symbol>
      <symbol id="ic-check" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8.5" />
        <polyline points="8,12.5 11,15.5 16,9" />
      </symbol>
      <symbol id="ic-refresh" viewBox="0 0 24 24">
        <path d="M4.5 9a7.5 7.5 0 0 1 12.9-2.6" />
        <polyline points="18,3 18,7 14,7" />
        <path d="M19.5 15a7.5 7.5 0 0 1-12.9 2.6" />
        <polyline points="6,21 6,17 10,17" />
      </symbol>
      <symbol id="ic-db" viewBox="0 0 24 24">
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
        <path d="M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3" />
      </symbol>
      <symbol id="ic-people" viewBox="0 0 24 24">
        <circle cx="9" cy="8.5" r="3.2" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
        <path d="M15.5 5.6a3.2 3.2 0 0 1 0 5.8" />
        <path d="M16 13.6a5.5 5.5 0 0 1 4.5 5.4" />
      </symbol>
      <symbol id="ic-chart" viewBox="0 0 24 24">
        <line x1="4" y1="20" x2="20" y2="20" />
        <line x1="7.5" y1="20" x2="7.5" y2="13" />
        <line x1="12" y1="20" x2="12" y2="9" />
        <line x1="16.5" y1="20" x2="16.5" y2="5" />
      </symbol>
      <symbol id="ic-warn" viewBox="0 0 24 24">
        <path d="M12 4 2.5 20h19L12 4z" />
        <line x1="12" y1="10" x2="12" y2="14" />
        <line x1="12" y1="16.7" x2="12" y2="16.9" />
      </symbol>
      <symbol id="ic-shield" viewBox="0 0 24 24">
        <path d="M12 3.5 19 6v5c0 4.4-3 7.4-7 8.8-4-1.4-7-4.4-7-8.8V6l7-2.5z" />
        <polyline points="9,11.5 11.2,13.7 15,9.5" />
      </symbol>
    </svg>
  );
}

export default function FlywheelScrub() {
  return (
    <QualityScrub
      label="The continuous data flywheel builds, then feeds the Coremantle data layer inside your training loop"
      chapterOne={<Flywheel />}
      chapterTwoSeg={['.58', '16']}
      chapterTwo={<ContinuousLoop />}
    />
  );
}

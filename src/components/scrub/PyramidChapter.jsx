import { PrismApex, segProps } from './QualityScrub';

// Chapter 01 of the Home / Enterprise quality scrub: the four-tier quality
// pyramid assembles bottom-up, crowned by the gem that becomes the prism.

const TIERS = [
  {
    s: '-.08',
    faces: {
      l: '20,336 260,413 260,453 20,376',
      r: '500,336 260,413 260,453 500,376',
      t: '20,336 260,259 500,336 260,413',
    },
  },
  {
    s: '.12',
    faces: {
      l: '80,280 260,338 260,378 80,320',
      r: '440,280 260,338 260,378 440,320',
      t: '80,280 260,222 440,280 260,338',
    },
  },
  {
    s: '.20',
    faces: {
      l: '138,224 260,263 260,303 138,264',
      r: '382,224 260,263 260,303 382,264',
      t: '138,224 260,185 382,224 260,263',
    },
  },
  {
    s: '.28',
    faces: {
      l: '192,168 260,190 260,230 192,208',
      r: '328,168 260,190 260,230 328,208',
      t: '192,168 260,146 328,168 260,190',
    },
  },
];

/**
 * @param {Array<{s: string, n: string, title: string, body: node}>} labels
 *        listed top tier first; `s` is the tier's reveal point
 */
export default function PyramidChapter({ labels }) {
  return (
    <>
      <figure className="qs1-fig">
        <svg viewBox="0 0 520 480" aria-hidden="true">
          <ellipse className="pyr-ground" cx="260" cy="462" rx="248" ry="13" />
          {TIERS.map(tier => (
            <g className="pyr-t" style={{ '--s': tier.s, '--v': '12.5' }} key={tier.s}>
              <polygon className="pf-l" points={tier.faces.l} />
              <polygon className="pf-r" points={tier.faces.r} />
              <polygon className="pf-t" points={tier.faces.t} />
            </g>
          ))}
          <g className="pyr-gem" style={{ '--s': '.38', '--v': '12.5' }}>
            <ellipse className="gem-glow" cx="260" cy="152" rx="46" ry="8" />
            <polygon className="gem-body" points="260,54 298,94 260,140 222,94" />
            <line x1="222" y1="94" x2="298" y2="94" />
            <line x1="260" y1="54" x2="260" y2="140" />
          </g>
        </svg>
        <PrismApex />
      </figure>
      <ol className="qs1-labels">
        {labels.map(label => (
          <li key={label.n} {...segProps(label.s, '12.5')}>
            <b>{label.n}</b>
            <h3>{label.title}</h3>
            <p>{label.body}</p>
          </li>
        ))}
      </ol>
    </>
  );
}

/** Tier copy, top tier first. `dash` is the page's punctuation style. */
export const pyramidLabels = (dash = '-') => [
  { s: '.28', n: '04', title: 'Model-ready output', body: 'Every dataset verified, certified, and benchmarked before delivery.' },
  {
    s: '.20',
    n: '03',
    title: 'Curated community',
    body: `Native experts vetted for language, dialect, and domain ${dash} not crowd workers.`,
  },
  {
    s: '.12',
    n: '02',
    title: 'Tech-first platform',
    body: '75% of the pipeline is already automated versus ~30% industry standard, including quality enforcement built directly into every stage.',
  },
  {
    s: '-.08',
    n: '01',
    title: 'Raw data sourcing',
    body: `100% of raw data sources are guaranteed to increase model performance ${dash} clear sourcing, filtration before ingestion, DPDP-compliant consent.`,
  },
];

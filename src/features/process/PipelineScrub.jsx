import QualityScrub, { PrismApex, PrismSlot, segProps } from '@/components/scrub/QualityScrub';
import ActionRow from '@/components/ui/ActionRow';
import Button from '@/components/ui/Button';
import Eyebrow from '@/components/ui/Eyebrow';
import { CONTACT_EMAIL, mailto } from '@/config/site';
import {
  CommunityFigure,
  CommunityIcon,
  ModelReadyFigure,
  QualityControlFigure,
  QualityControlIcon,
  RawStreamFigure,
  SourcingFigure,
  SourcingIcon,
} from './PipelineFigures';

// "How we ensure quality": chapter 01 walks raw data through the four stages
// (each stage window is `--s` .. `--e` of the scrub), chapter 02 shows the
// model-ready output activating the data intelligence layer.

/** A stage window: fades in at `s` and (optionally) back out at `e`. */
const win = (s, e) => (e == null ? { '--s': s } : { '--s': s, '--e': e });

const STAGES = [
  { s: '-.05', e: '.14', head: '100 HRS RAW DATA', figure: <RawStreamFigure />, className: 'pl-cell--stream' },
  { s: '-.05', e: '.14', icon: <SourcingIcon />, head: '01 · PRECISION SOURCING', figure: <SourcingFigure /> },
  { s: '.14', e: '.26', icon: <QualityControlIcon />, head: '02 · TECH-ENFORCED QC', figure: <QualityControlFigure /> },
  { s: '.26', e: '.38', icon: <CommunityIcon />, head: '03 · EXPERT COMMUNITY', figure: <CommunityFigure /> },
  { s: '.38', e: '.49', head: '04 · MODEL-READY DATA', figure: <ModelReadyFigure />, className: 'pl-cell--gem', apex: true },
];

const COPY = [
  {
    s: '-.05',
    e: '.14',
    eyebrow: '01 · Precision sourcing',
    title: 'The hardest data to find. The right data to train on.',
    points: [
      ['Filter before ingestion', ' so junk never enters the pipeline.'],
      ['Source the hardest data', ' across dialects, accents, code-mix and real-world speech.'],
      ['Built to the model need', ' by language, geography, domain and use case.'],
      ['More trainable yield', ' with less rejection, rework and waste.'],
    ],
  },
  {
    s: '.14',
    e: '.26',
    eyebrow: '02 · Tech-enforced QC',
    title: 'The tech layer that makes quality non-negotiable.',
    points: [
      ['Guidelines enforced in-platform', ' so quality does not depend on individual judgement alone.'],
      ['Automated QC at every step', ' catches formatting, tagging, duplication and other preventable errors early.'],
      ['Native tooling', ' handles code-mix, language-specific input and real-world speech complexity.'],
      ['2x throughput per annotator', ' by removing repetitive human error before expert review.'],
    ],
  },
  {
    s: '.26',
    e: '.38',
    eyebrow: '03 · Our community',
    title: 'Our community of qualified linguistic workforce.',
    points: [
      ['Entry is earned', ' through training, assessment and qualification.'],
      ['Native linguistic depth', ' captures dialects, accents, code-mix and cultural context.'],
      ['Top performers become QC', ' so proven experts protect output quality.'],
      ['Performance compounds quality', ' through individual measurement, feedback and tiered progression.'],
    ],
  },
  {
    s: '.38',
    e: '.49',
    eyebrow: '04 · Model ready data',
    title: 'Ready for training. Built for production.',
    points: [
      ['Plug straight into training', ' with verified, structured data.'],
      ['9.4% WER', ' on our 500-hour benchmark.'],
      [
        '>95% quality.',
        <>
          {' '}
          Verified data flows straight into your training stack and the Coremantle Data Intelligence Layer with{' '}
          <strong>2× throughput compared to industry.</strong>
        </>,
      ],
    ],
  },
];

const CHIPS = [
  { s: '.81', tag: 'B1', label: 'Model-ready data' },
  { s: '.835', tag: 'B2', label: 'Annotate & verify' },
  { s: '.86', tag: 'B3', label: 'Train custom model' },
  { s: '.885', tag: 'B4', label: 'Custom ASR · SLM · TTS' },
];

const STATS = [
  { value: '9.4%', label: 'WER · 500h benchmark' },
  { value: '>95%', label: 'Dataset quality' },
  { value: '2×', label: 'Throughput' },
];

function PipelineChapter() {
  return (
    <>
      <div className="pl-rail">
        {STAGES.map((stage, index) => (
          <StageCell stage={stage} joined={index > 0} key={stage.head} />
        ))}
      </div>
      <div className="pl-mid pl-win" style={win('.58', '1.4')}>
        <p className="pl-capline">
          LESS WASTE. <em>MORE TRAINABLE DATA.</em>
        </p>
        <p className="pl-legend">
          {' '}
          <span>
            <svg viewBox="0 0 26 8" aria-hidden="true">
              <circle className="pl-dot" cx="4" cy="4" r="2" />
              <circle className="pl-dot" cx="13" cy="4" r="2" />
              <circle className="pl-dot" cx="22" cy="4" r="2" />
            </svg>
            RAW &amp; NOISY
          </span>{' '}
          <span>
            <svg viewBox="0 0 30 8" aria-hidden="true">
              <line className="pl-leg-line" x1="0" y1="4" x2="30" y2="4" />
            </svg>
            FILTERING &amp; VALIDATION
          </span>{' '}
          <span>
            <svg viewBox="0 0 30 8" aria-hidden="true">
              <line className="pl-leg-line pl-leg-line--strong" x1="0" y1="4" x2="30" y2="4" />
            </svg>
            CLEAN &amp; ENRICHED
          </span>{' '}
        </p>
      </div>
      <div className="pl-copy">
        {COPY.map(panel => (
          <div className="pl-copy-panel pl-win" style={win(panel.s, panel.e)} key={panel.eyebrow}>
            <div>
              <Eyebrow>{panel.eyebrow}</Eyebrow>
              <h3>{panel.title}</h3>
            </div>
            <ul className="pl-bullets">
              {panel.points.map(([lead, rest]) => (
                <li key={lead}>
                  <strong>{lead}</strong>
                  {rest}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

/** One pipeline stage; every stage after the first is preceded by a → join. */
function StageCell({ stage, joined }) {
  return (
    <>
      {joined && (
        <div className="pl-join pl-win" style={win(stage.s)} aria-hidden="true">
          →
        </div>
      )}
      <div className={['pl-cell', stage.className, 'pl-win'].filter(Boolean).join(' ')} style={win(stage.s, stage.e)}>
        <div className="pl-head">
          {stage.icon}
          {stage.head}
        </div>
        <div className="pl-fig">
          {stage.figure}
          {stage.apex && <PrismApex />}
        </div>
      </div>
    </>
  );
}

function ActivationChapter() {
  return (
    <>
      <p className="qs2-kicker" {...segProps('.69')}>
        Chapter 02 — <em>Activate · Train · Deploy</em>
      </p>
      <div className="qs2-row">
        <div className="qs2-card" {...segProps('.705')}>
          <span>Enterprise</span>
          <b>Your business</b>
          <p>BFSI · HealthTech · Logistics · eComm · Legal · AgriTech</p>
        </div>
        <div className="qs2-arrow" {...segProps('.72')}>
          →
        </div>
        <div className="qs2-card qs2-card--agent" {...segProps('.735')}>
          <span>Agentic AI layer</span>
          <b>Routes · Decides · Responds</b>
          <p>Only as good as the models underneath it</p>
        </div>
      </div>
      <div className="qs2-mid">
        <span className="qs2-drop" {...segProps('.77')}>
          model-ready data ↓
        </span>
      </div>
      <div className="qs2-platform" {...segProps('.69')}>
        <div className="qs2-plat-head">
          <PrismSlot />
          Coremantle data intelligence layer
          <span className="qs2-from">← from chapter 01 · model-ready data</span>
        </div>
        <div className="qs2-chips">
          {CHIPS.map(chip => (
            <div className="qs2-chip" key={chip.tag} {...segProps(chip.s, '25')}>
              <i>{chip.tag}</i>
              {chip.label}
            </div>
          ))}
        </div>
      </div>
      <p className="qs2-final" {...segProps('.895', '16')}>
        Verified data flows straight into your training stack — <em>from model-ready data to production AI.</em>
      </p>
      <div className="qs2-stats" {...segProps('.915', '16')}>
        {STATS.map(stat => (
          <div key={stat.label}>
            <b>{stat.value}</b>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
      <ActionRow {...segProps('.935', '18')}>
        <Button href={mailto('Coremantle data samples')} variant="primary" contactForm>
          Request data samples
        </Button>
        <Button href={`mailto:${CONTACT_EMAIL}`} contactForm>
          Talk to us
        </Button>
      </ActionRow>
    </>
  );
}

export default function PipelineScrub() {
  return (
    <QualityScrub
      label="Raw data flows through precision sourcing, tech-enforced QC and the expert community into model-ready data, which activates the Coremantle data intelligence layer"
      prismTravel=".66,.80"
      chapterOne={<PipelineChapter />}
      chapterTwoSeg={['.675', '16']}
      chapterTwo={<ActivationChapter />}
    />
  );
}

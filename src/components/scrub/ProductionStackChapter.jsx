import ActionRow from '@/components/ui/ActionRow';
import Button from '@/components/ui/Button';
import { PrismSlot, segProps } from './QualityScrub';

const CHIPS = [
  { s: '.78', label: 'Your call data' },
  { s: '.82', label: 'Annotate & verify' },
  { s: '.86', label: 'Train custom model' },
  { s: '.90', label: 'Custom ASR · SLM · TTS' },
];

/**
 * Chapter 02 of the Home / Enterprise quality scrub: the enterprise stack,
 * with Coremantle's data intelligence layer replacing the generic APIs.
 *
 * @param {node} final    closing line
 * @param {Array<{label, href, variant?, contactForm?}>} actions
 */
export default function ProductionStackChapter({ final, actions }) {
  return (
    <>
      <div className="qs2-row">
        <div className="qs2-card" {...segProps('.62', '12.5')}>
          <span>Enterprise</span>
          <b>Your business</b>
          <p>BFSI · HealthTech · Logistics · eComm · Legal · AgriTech</p>
        </div>
        <div className="qs2-arrow" {...segProps('.64', '12.5')}>
          →
        </div>
        <div className="qs2-card qs2-card--agent" {...segProps('.66', '12.5')}>
          <span>Agentic AI layer</span>
          <b>Routes · Decides · Responds</b>
          <p>Only as good as the models underneath it</p>
        </div>
        <div className="qs2-arrow" {...segProps('.68', '12.5')}>
          ←
        </div>
        <div className="qs2-card" {...segProps('.70', '12.5')}>
          <span>API vendors</span>
          <b>Generic ASR · LLM · TTS</b>
          <p className="qs2-fail" {...segProps('.78', '12.5')}>
            ⚠ Fails for Indian context
          </p>
        </div>
      </div>
      <div className="qs2-mid">
        <span className="qs2-drop" {...segProps('.72', '12.5')}>
          live call data ↓
        </span>
        <span className="qs2-replaces" {...segProps('.86', '12.5')}>
          ⇅ replaces generic APIs
        </span>
      </div>
      <div className="qs2-platform" {...segProps('.60', '12.5')}>
        <div className="qs2-plat-head">
          <PrismSlot />
          Coremantle data intelligence layer
        </div>
        <div className="qs2-chips">
          {CHIPS.map(chip => (
            <div className="qs2-chip" key={chip.label} {...segProps(chip.s, '25')}>
              {chip.label}
            </div>
          ))}
        </div>
      </div>
      <p className="qs2-final" {...segProps('.92', '14')}>
        {final}
      </p>
      <ActionRow {...segProps('.94', '14')}>
        {actions.map(({ label, ...button }) => (
          <Button key={label} {...button}>
            {label}
          </Button>
        ))}
      </ActionRow>
    </>
  );
}

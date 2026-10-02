import { PrismIcon } from '@/components/ui/icons';

/**
 * Inline style for a scrubbed element: it fades in once the stage progress
 * (--qp) passes `s`, at speed `v` (see the `--t` clamp in the page styles).
 */
export const seg = (s, v) => (v == null ? { '--s': s } : { '--s': s, '--v': v });

/** `data-seg` props for an element that reads its own slice of --qp. */
export const segProps = (s, v) => ({ 'data-seg': '', style: seg(s, v) });

/**
 * Two-chapter pinned scrub. Chapter 01 builds a figure as the reader
 * scrolls; the prism then flies from its apex (`[data-prism-apex]`) into the
 * platform slot of chapter 02 (`<PrismSlot />`). Driven by the scrub engine
 * through `--qp` on the stage.
 *
 * @param {string} label        accessible description of the whole stage
 * @param {string} prismTravel  "start,end" override for the prism flight
 * @param {node}   chapterOne   `.qs1` content
 * @param {node}   chapterTwo   `.qs2` content
 * @param {[string, number]} chapterTwoSeg  `--s` / `--v` of the `.qs2` layer
 */
export default function QualityScrub({ label, prismTravel, chapterOne, chapterTwo, chapterTwoSeg }) {
  const [s, v] = chapterTwoSeg;
  return (
    <div className="q-scrub" data-quality-track="">
      <div className="q-stage" data-prism-travel={prismTravel} aria-label={label}>
        <div className="qs1">{chapterOne}</div>
        <div className="qs2" {...segProps(s, v)}>
          {chapterTwo}
        </div>
        <div className="q-prism" data-prism="" aria-hidden="true">
          <PrismIcon />
        </div>
      </div>
    </div>
  );
}

/** The dashed socket the prism lands in. */
export function PrismSlot() {
  return (
    <span className="qs2-slot" data-prism-slot="">
      <PrismIcon aria-hidden="true" />
    </span>
  );
}

/** Invisible launch point for the prism flight. */
export function PrismApex() {
  return <span className="q-apex" data-prism-apex="" aria-hidden="true" />;
}

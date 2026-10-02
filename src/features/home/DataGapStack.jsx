import Fold from '@/components/folds/Fold';
import Wrap from '@/components/ui/Wrap';
import { cn } from '@/lib/utils/cn';

const CARDS = [
  {
    tone: 'lav',
    chip: '01 · Representation',
    title: (
      <>
        82% of the world is <em>underrepresented</em> in AI&rsquo;s training data
      </>
    ),
    body: 'Roughly 90% of the training data behind current generative AI systems is English, while only 18% of the world’s population speaks it. This leaves the majority of the world largely under-served.',
    fold: { scene: 'Coremantle Representation.dc.html', label: '8.2× underrepresented' },
  },
  {
    tone: 'amber',
    modifier: 'trainability',
    chip: '02 · Trainability',
    title: (
      <>
        Scarce data is only the first problem. <em>Training-ready data is the real need.</em>
      </>
    ),
    body: 'What little data exists still needs heavy processing before a model can learn from it. Noise, PII, cross-talk and invalid speech must be removed, while code-switching, transcription, timestamps, dialect and context are accurately captured. Until then, it is raw data, not training-ready data.',
    fold: { scene: 'Coremantle Trainable.dc.html', label: 'Raw ≠ training-ready' },
  },
  {
    tone: 'neutral',
    modifier: 'complexity',
    chip: '03 · Complexity',
    title: 'AI needs to understand language as people use it.',
    body: 'Across languages, dialects, accents, code-switching, and domain-specific vocabulary, every combination creates a new data problem. The complexity multiplies fast.',
    fold: { scene: 'Coremantle Complexity Flow.dc.html', label: 'Language complexity', seamIn: '0.7' },
  },
];

/**
 * Stacked sticky cards: each card pins below the nav and the next one slides
 * up to cover it; the pinned card's scene scrubs over the dwell gap before
 * the next card arrives (lib/scrub/scrub-engine: foldSeek).
 */
export default function DataGapStack() {
  return (
    <Wrap className="stack-wrap">
      <div className="stack-list">
        {CARDS.map(card => (
          <article
            className={cn('stack-card', `stack-card--${card.tone}`, card.modifier && `stack-card--${card.modifier}`)}
            key={card.chip}
          >
            <div className="stack-copy">
              <span className="stack-chip">{card.chip}</span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
            <Fold aspect="1520/860" {...card.fold} />
          </article>
        ))}
        {/* the spacer is the last card's dwell: real content, because a sticky
            card can only stay pinned within the list's content box */}
        <div className="stack-spacer" aria-hidden="true" />
      </div>
      <p className="sources">
        Sources: AI4Bharat ASR · Google Research, Language ID in the Wild · Ethnologue · Census of India 2011. The ~2,000-hour
        model-ready stage is illustrative.
      </p>
    </Wrap>
  );
}

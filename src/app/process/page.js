import PageShell from '@/components/layout/PageShell';
import CtaSection from '@/components/sections/CtaSection';
import Hero from '@/components/sections/Hero';
import SectionIntro from '@/components/sections/SectionIntro';
import ActionRow from '@/components/ui/ActionRow';
import Button from '@/components/ui/Button';
import Section from '@/components/ui/Section';
import Wrap from '@/components/ui/Wrap';
import { pageMetadata } from '@/config/metadata';
import { CONTACT_EMAIL, ROUTES, mailto } from '@/config/site';
import PipelineScrub from '@/features/process/PipelineScrub';

export const metadata = pageMetadata({
  title: 'How It Works: Gold-Standard AI Training Data | Coremantle',
  description:
    'Precision sourcing, tech-enforced QC, an expert linguist community and model-ready delivery: one quality-controlled system for AI training data.',
  path: ROUTES.process,
});

const DATA_SAMPLES = mailto('Coremantle data samples');

const ADVANTAGES = [
  { value: 'Lower', label: 'Compute & GPU spend', body: 'No cycles wasted training on data that never should have been in the set.' },
  { value: 'Fewer', label: 'Model hallucinations', body: 'Clean source data means fewer errors baked into the model from day one.' },
  { value: 'Faster', label: 'Path to production', body: 'Every batch is model-ready, not a starting point for more cleanup.' },
];

const GRADES = [
  {
    tag: 'Frontier grade',
    title: 'Ready for production AI',
    body: 'For big tech, sovereign AI and voice AI builders. Code-mixing, diarization, timestamps, sentiment and precise labels, all included.',
    chips: ['Code-mixing', 'Diarization', 'Timestamps', 'Sentiment'],
  },
  {
    tag: 'Specialist grade',
    accent: true,
    title: 'Tuned to your vertical',
    body: 'Everything in Frontier grade, reviewed by a subject-matter expert in your domain — healthcare, legal, finance or beyond.',
    chips: ['SME-reviewed', 'Domain-specific', 'Semantic enrichment'],
  },
];

export default function ProcessPage() {
  return (
    <PageShell page="process" footer={{ tagline: 'Gold standard data intelligence.', homeHref: '#top' }}>
      {/* Fold 1 */}
      <Hero id="top" pinned>
        <SectionIntro
          as="h1"
          eyebrow="How Coremantle works"
          title={
            <>
              Gold standard data intelligence, with <em>market-leading accuracy.</em>
            </>
          }
          lede={
            <>
              Coremantle puts technology at the centre of data operations, turning sourcing, annotation and human expertise into one
              quality-controlled system. We delivered 9.4% WER, <strong>50% more accurate than the nearest benchmarked competitor.</strong>
            </>
          }
        />
        <ActionRow reveal>
          <Button href={DATA_SAMPLES} variant="primary" contactForm>
            Request data samples
          </Button>
          <Button href="#quality">See how we ensure quality</Button>
        </ActionRow>
      </Hero>

      {/* Fold 2: pinned scrub - the pipeline builds stage by stage, then the
          prism carries model-ready data into the intelligence layer */}
      <Section id="quality">
        <Wrap>
          <SectionIntro
            eyebrow="How we ensure quality"
            title={
              <>
                Higher-quality data. More efficient training. <em>Better-performing models.</em>
              </>
            }
          />
        </Wrap>
        <PipelineScrub />
      </Section>

      {/* Fold 3 */}
      <Section id="advantage" surface>
        <Wrap>
          <SectionIntro
            eyebrow="Why it pays off"
            title={
              <>
                The downstream advantage of <em>model-ready data.</em>
              </>
            }
          />
          <div className="adv-grid">
            {ADVANTAGES.map(item => (
              <article className="adv" data-reveal="" key={item.value}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </Wrap>
      </Section>

      {/* Fold 4 */}
      <Section id="grades">
        <Wrap>
          <SectionIntro
            eyebrow="Data, graded"
            title={
              <>
                Two grades. Both trainable on <em>day one.</em>
              </>
            }
          />
          <div className="choice-grid">
            {GRADES.map(grade => (
              <article className={grade.accent ? 'choice choice--accent' : 'choice'} data-reveal="" key={grade.tag}>
                <span className="grade-tag">{grade.tag}</span>
                <h3>{grade.title}</h3>
                <p>{grade.body}</p>
                <div className="grade-chips">
                  {grade.chips.map(chip => (
                    <span key={chip}>{chip}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Wrap>
      </Section>

      <CtaSection
        id="contact"
        surface
        eyebrow="Get started"
        title={
          <>
            See the quality before you <em>train on it.</em>
          </>
        }
        lede="Save compute, reduce wasted runs, and train better models with cleaner data."
        actions={[
          { label: 'Request data samples', href: DATA_SAMPLES, variant: 'primary', contactForm: true },
          { label: 'Talk to us', href: `mailto:${CONTACT_EMAIL}`, contactForm: true },
        ]}
      />
    </PageShell>
  );
}

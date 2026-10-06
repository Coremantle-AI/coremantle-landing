import FoldTrack from '@/components/folds/FoldTrack';
import HorizonTrack from '@/components/horizon/HorizonTrack';
import PageShell from '@/components/layout/PageShell';
import ProductionStackChapter from '@/components/scrub/ProductionStackChapter';
import PyramidChapter, { pyramidLabels } from '@/components/scrub/PyramidChapter';
import QualityScrub from '@/components/scrub/QualityScrub';
import CtaSection from '@/components/sections/CtaSection';
import Hero from '@/components/sections/Hero';
import { MetricBand, Pillars } from '@/components/sections/QualityProof';
import SectionIntro from '@/components/sections/SectionIntro';
import TeamSection from '@/components/team/TeamSection';
import ActionRow from '@/components/ui/ActionRow';
import Button from '@/components/ui/Button';
import Lede from '@/components/ui/Lede';
import Section from '@/components/ui/Section';
import Wrap from '@/components/ui/Wrap';
import { pageMetadata } from '@/config/metadata';
import { CONTACT_EMAIL, ROUTES, mailto } from '@/config/site';
import DataGapStack from '@/features/home/DataGapStack';
import DownstreamEffects from '@/features/home/DownstreamEffects';
import PathChoices from '@/features/home/PathChoices';

export const metadata = pageMetadata({
  title: 'AI Training Data for Underserved Languages | Coremantle',
  description:
    'High-quality, consented, model-ready speech and language data for AI, capturing the dialects, accents, code-switching and context other pipelines miss.',
  path: ROUTES.home,
});

const SAMPLE_DATA = mailto('Coremantle sample data');
const TALK_TO_US = `mailto:${CONTACT_EMAIL}`;

export default function HomePage() {
  return (
    <PageShell
      page="home"
      team
      footer={{ tagline: 'Filling the data intelligence void for AI.', homeHref: '#top', privacyLink: true }}
    >
      {/* Fold 1: hero copy + the audio pull-apart scrub */}
      <Hero id="top">
        <SectionIntro
          as="h1"
          eyebrow="Data intelligence"
          title={
            <>
              Filling the data intelligence <em>void</em> for AI.
            </>
          }
          lede="Coremantle builds the high-quality, consented, and model-ready data infrastructure AI needs to understand underserved languages. It captures the complexity of dialects, accents, code-switching, and real-world context that conventional data pipelines miss."
        />
        <ActionRow reveal>
          <Button href={SAMPLE_DATA} variant="primary" contactForm>
            Request sample data
          </Button>
          <Button href="#team">Meet the team</Button>
        </ActionRow>
      </Hero>
      <section aria-label="Raw audio in, ground truth out">
        <FoldTrack scene="Bidtech Voice.dc.html" label="Raw audio in, ground truth out" seamIn="1.02" />
      </section>

      {/* Fold 2: the team */}
      <TeamSection surface />

      {/* Fold 3: the data gap - stacked sticky cards */}
      <Section id="problem">
        <Wrap>
          <SectionIntro
            eyebrow="The data infrastructure gap"
            title={
              <>
                The AI data gap is bigger than it <em>looks.</em>
              </>
            }
            lede="Most of the world is underrepresented, usable data is scarce, and linguistic complexity compounds the gap."
          />
        </Wrap>
        <DataGapStack />
      </Section>

      {/* Fold 4: bad data burns compute */}
      <Section id="burn" surface>
        <Wrap>
          <SectionIntro
            eyebrow="The cost of bad data"
            title={
              <>
                And this bad data doesn&rsquo;t fail quietly. It burns <em>compute.</em>
              </>
            }
            lede={
              <>
                Models discover the damage <strong>after the training run</strong>, when GPU cycles are already spent, and retraining
                becomes the cost.
              </>
            }
          />
        </Wrap>
        <FoldTrack short scene="Coremantle GPU Burn.dc.html" label="GPU burn" />
      </Section>

      {/* Fold 5: the fix, engineered layer by layer */}
      <Section id="process">
        <Wrap>
          <SectionIntro
            eyebrow="The fix"
            title={
              <>
                So we fixed the problem before it reaches the <em>model.</em>
              </>
            }
            lede={
              <>
                Coremantle turns raw data into <strong>verified, model-ready intelligence</strong>, with quality engineered into every
                step from sourcing to production.
              </>
            }
          />
        </Wrap>
        <QualityScrub
          label="The quality pyramid delivers model-ready data into your production stack"
          chapterOne={<PyramidChapter labels={pyramidLabels('-')} />}
          chapterTwoSeg={['.58', '16']}
          chapterTwo={
            <ProductionStackChapter
              final={
                <>
                  See how Coremantle turns raw data into <em>model-ready intelligence.</em>
                </>
              }
              actions={[
                { label: 'See process', href: ROUTES.process, variant: 'primary' },
                { label: 'Talk to us', href: TALK_TO_US, contactForm: true },
              ]}
            />
          }
        />
      </Section>

      {/* Fold 6: the benchmark results */}
      <Section id="results" surface>
        <Wrap>
          <SectionIntro
            eyebrow="Proven against the field"
            title={
              <>
                And the results proved the <em>point.</em>
              </>
            }
            lede={
              <>
                With Coremantle data, <strong>WER dropped from 76.9% to 9.4%</strong>, outperforming every benchmarked engine on the
                same test.
              </>
            }
          />
        </Wrap>
        <FoldTrack scene="Coremantle Benchmark.dc.html" label="Model benchmark" />
      </Section>

      {/* Fold 7: measurable quality + downstream effects */}
      <Section id="quality">
        <Wrap>
          <SectionIntro
            eyebrow="Quality by design"
            title={
              <>
                Quality is no longer a promise. It&rsquo;s <em>measurable</em> before training even begins.
              </>
            }
          />
          <Pillars />
          <MetricBand />
          <DownstreamEffects />
        </Wrap>
      </Section>

      {/* Fold 8: two paths */}
      <Section id="paths" surface>
        <Wrap>
          <SectionIntro
            eyebrow="Get started"
            title={
              <>
                Choose the path that fits what you&rsquo;re <em>building.</em>
              </>
            }
          />
          <PathChoices />
        </Wrap>
      </Section>

      {/* Fold: what comes next */}
      <Section id="horizon">
        <Wrap>
          <SectionIntro
            eyebrow="What comes next"
            title={
              <>
                Speech is only the <em>beginning.</em>
              </>
            }
          />
        </Wrap>
        <HorizonTrack />
        <Wrap>
          <Lede reveal>
            Coremantle is building the data layer for every way AI learns to read, see, hear and act. Starting with speech. Expanding
            into text, visual, physical and robotic AI.
          </Lede>
        </Wrap>
      </Section>

      {/* Fold 9: closing CTA */}
      <CtaSection
        id="contact"
        eyebrow="Get started"
        title={
          <>
            Building AI that understands the <em>world?</em>
          </>
        }
        lede="Start with data your model can actually train on."
        actions={[
          { label: 'Request sample', href: SAMPLE_DATA, variant: 'primary', contactForm: true },
          { label: 'Talk to us', href: TALK_TO_US, contactForm: true },
        ]}
      />
    </PageShell>
  );
}

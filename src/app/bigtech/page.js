import FoldTrack from '@/components/folds/FoldTrack';
import PageShell from '@/components/layout/PageShell';
import ProblemSection from '@/components/problem/ProblemSection';
import CtaSection from '@/components/sections/CtaSection';
import Hero from '@/components/sections/Hero';
import { MetricBand, Pillars } from '@/components/sections/QualityProof';
import SectionIntro from '@/components/sections/SectionIntro';
import ActionRow from '@/components/ui/ActionRow';
import Button from '@/components/ui/Button';
import Display from '@/components/ui/Display';
import Eyebrow from '@/components/ui/Eyebrow';
import Section from '@/components/ui/Section';
import Wrap from '@/components/ui/Wrap';
import { pageMetadata } from '@/config/metadata';
import { CONTACT_EMAIL, ROUTES, mailto } from '@/config/site';
import FlywheelScrub from '@/features/bigtech/FlywheelScrub';
import { AMBITIONS, BIGTECH_PROBLEMS, PIPELINE_STATS } from '@/features/bigtech/content';

export const metadata = pageMetadata({
  title: 'Speech & Language Data for Frontier AI Labs | Coremantle',
  description:
    'Consented, quality-certified speech and language data for frontier labs, sovereign AI and voice AI, built for training, evaluation and alignment.',
  path: ROUTES.bigtech,
});

const DATA_PROGRAM = mailto('Build our data program');

export default function BigTechPage() {
  return (
    <PageShell page="bigtech" footer={{ tagline: 'The data layer for the next billion AI users.', homeHref: '#top' }}>
      <Hero id="top">
        <SectionIntro
          as="h1"
          eyebrow="AI data infrastructure"
          title={
            <>
              More data scales compute. Better data scales <em>intelligence.</em>
            </>
          }
          lede={[
            'Most data providers optimise for volume, but poor-quality data wastes compute and weakens model performance.',
            'Coremantle combines contextual data, technology-enforced quality, and expert intelligence to help models learn more from every cycle.',
          ]}
        />
        <ActionRow reveal>
          <Button href={DATA_PROGRAM} variant="primary" contactForm>
            Build your data program
          </Button>
          <Button href="#problem">See why now</Button>
        </ActionRow>
      </Hero>

      <ProblemSection
        id="problem"
        index={0}
        heading={
          <SectionIntro
            eyebrow="The edge of available data"
            title={
              <>
                The future of AI isn&apos;t more <em>data.</em>
              </>
            }
            lede="It's more intelligence per training cycle."
          />
        }
        items={BIGTECH_PROBLEMS}
      />

      <Section id="platform" surface>
        <Wrap>
          <SectionIntro
            eyebrow="The missing data layer"
            title={
              <>
                So we built the data layer models can trust <em>before training.</em>
              </>
            }
            lede="Consent-first. Quality-engineered from source to model-ready output. Built to understand linguistic complexity before your GPUs ever see the data."
          />
          <Pillars />
          <MetricBand />
        </Wrap>
      </Section>

      <Section id="benchmark">
        <Wrap>
          <SectionIntro
            eyebrow="Proven against the field"
            title={
              <>
                And we beat every major speech-to-text engine <em>while at it.</em>
              </>
            }
          />
        </Wrap>
        <FoldTrack scene="Coremantle Benchmark.dc.html" label="Model benchmark" />
      </Section>

      <ProblemSection
        id="ambitions"
        surface
        index={1}
        heading={
          <SectionIntro
            eyebrow="Who we build for"
            title={
              <>
                One infrastructure layer for different AI <em>ambitions.</em>
              </>
            }
          />
        }
        items={AMBITIONS}
      />

      <Section id="evolving">
        <Wrap>
          <SectionIntro
            eyebrow="Continuous data infrastructure"
            title={
              <>
                Built for continuous <em>improvement.</em>
              </>
            }
            lede="CoreMantle supplies the training, alignment, evaluation, and refresh data your models need at every stage. Not a one-time dataset. A continuously evolving data infrastructure for continuously evolving models."
          />
        </Wrap>
        <FlywheelScrub />
      </Section>

      <Section id="pipeline" surface>
        <Wrap>
          <div className="flow-grid">
            <div>
              <Eyebrow reveal>The engine behind it</Eyebrow>
              <Display reveal>
                A data pipeline built to keep <em>producing.</em>
              </Display>
            </div>
            <div className="flow-list" data-reveal="">
              {PIPELINE_STATS.map(stat => (
                <div key={stat.value}>
                  <b>
                    {stat.value}
                    {stat.detail && <span>{stat.detail}</span>}
                  </b>
                </div>
              ))}
            </div>
          </div>
        </Wrap>
      </Section>

      <CtaSection
        id="contact"
        surface
        eyebrow="Where to start"
        eyebrowProps={{ style: { justifyContent: 'center' } }}
        title={
          <>
            Tell us where your model <em>breaks.</em>
          </>
        }
        lede="We’ll build the language, domain, training or evaluation data needed to close the gap, then keep expanding it as your models evolve."
        actions={[
          { label: 'Build your data program', href: DATA_PROGRAM, variant: 'primary', contactForm: true },
          { label: 'Talk to us', href: `mailto:${CONTACT_EMAIL}`, contactForm: true },
        ]}
      />
    </PageShell>
  );
}

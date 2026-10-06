import FoldTrack from '@/components/folds/FoldTrack';
import PageShell from '@/components/layout/PageShell';
import ProblemSection from '@/components/problem/ProblemSection';
import ProductionStackChapter from '@/components/scrub/ProductionStackChapter';
import PyramidChapter, { pyramidLabels } from '@/components/scrub/PyramidChapter';
import QualityScrub from '@/components/scrub/QualityScrub';
import CtaSection from '@/components/sections/CtaSection';
import Hero from '@/components/sections/Hero';
import SectionIntro from '@/components/sections/SectionIntro';
import ActionRow from '@/components/ui/ActionRow';
import Button from '@/components/ui/Button';
import Section from '@/components/ui/Section';
import Wrap from '@/components/ui/Wrap';
import { pageMetadata } from '@/config/metadata';
import { CONTACT_EMAIL, ROUTES, mailto } from '@/config/site';
import ArchitectureScrub from '@/features/enterprise/ArchitectureScrub';
import { ENTERPRISE_PROBLEMS, INDUSTRIES } from '@/features/enterprise/content';

export const metadata = pageMetadata({
  title: 'Coremantle - data intelligence for enterprise',
  description:
    'Coremantle provides training-ready data built for higher accuracy, fewer wasted cycles, and production-grade AI for your enterprise.',
  path: ROUTES.enterprise,
});

export default function EnterprisePage() {
  return (
    <PageShell
      page="enterprise"
      className="scroll-scrub-page"
      footer={{ tagline: 'The data vacuum ends here.', homeHref: '#top' }}
    >
      <Hero id="top">
        <SectionIntro
          as="h1"
          eyebrow="Training-ready data intelligence for enterprise"
          title={
            <>
              Your AI is only as ready as its <em>training data.</em>
            </>
          }
          lede={
            <>
              Coremantle delivers <strong>production-grade training data</strong> designed to improve model performance, reduce errors,
              and accelerate the path from experimentation to deployment.
            </>
          }
        />
        <ActionRow reveal>
          <Button href={mailto('Coremantle sample data')} variant="primary" contactForm>
            Request sample data
          </Button>
          <Button href="#platform">See the platform</Button>
        </ActionRow>
      </Hero>
      <ArchitectureScrub />

      <div className="landing">
        <ProblemSection
          id="problem"
          heading={
            <SectionIntro
              eyebrow="The data infrastructure gap"
              title={
                <>
                  The world’s AI ambition is outrunning its <em>data.</em>
                </>
              }
              lede="Billions of people use languages that today’s models barely hear. The problem grows from scarcity into complexity, wasted compute, and compliance risk."
            />
          }
          items={ENTERPRISE_PROBLEMS}
        />

        <Section id="platform">
          <Wrap>
            <SectionIntro
              eyebrow="The missing infrastructure"
              title={
                <>
                  So, we built the data infrastructure AI has been <em>missing.</em>
                </>
              }
              lede={
                <>
                  Using real natural conversational data, we turn weak model performance into production-ready accuracy.
                  <br />
                  In our benchmark, accuracy improved from <strong>23% to 91%</strong> with just <strong>500 hours</strong> of customer
                  call data.
                </>
              }
            />
          </Wrap>
          <FoldTrack scene="Coremantle Benchmark Enterprise.dc.html" label="Model benchmark" />
        </Section>

        <Section id="quality" surface>
          <Wrap>
            <SectionIntro
              eyebrow="Quality by design"
              title={
                <>
                  We engineered quality into <em>every layer.</em>
                </>
              }
              lede="From compliant sourcing to a tech-first platform and a curated community of native experts, every layer is designed to eliminate error before it reaches the model."
            />
          </Wrap>
          <QualityScrub
            label="The quality pyramid delivers model-ready data into your production stack"
            chapterOne={<PyramidChapter labels={pyramidLabels('—')} />}
            chapterTwoSeg={['.58', '16']}
            chapterTwo={
              <ProductionStackChapter
                final={
                  <>
                    The result is verified, <em>model-ready data</em> built for production AI.
                  </>
                }
                actions={[
                  {
                    label: 'See what better data unlocks',
                    href: mailto('What better data unlocks'),
                    variant: 'primary',
                    contactForm: true,
                  },
                  { label: 'Talk to us', href: `mailto:${CONTACT_EMAIL}`, contactForm: true },
                ]}
              />
            }
          />
        </Section>

        <Section id="industries">
          <Wrap>
            <SectionIntro
              eyebrow="Where language complexity matters"
              title={
                <>
                  Built for the industries where context is <em>critical.</em>
                </>
              }
            />
            <div className="industries">
              {INDUSTRIES.map(industry => (
                <article className="industry" data-reveal="" key={industry.tag}>
                  <span>{industry.tag}</span>
                  <h3>{industry.title}</h3>
                  <p>{industry.body}</p>
                </article>
              ))}
            </div>
          </Wrap>
        </Section>

        <CtaSection
          surface
          eyebrow="Get started"
          title={
            <>
              Choose how you want to <em>build.</em>
            </>
          }
          lede="Get training-ready data and let us build the agentic solution, or take the data and build it your way."
          actions={[
            { label: 'Choose your build path', href: mailto('Choose our build path'), variant: 'primary', contactForm: true },
          ]}
        />
      </div>
    </PageShell>
  );
}

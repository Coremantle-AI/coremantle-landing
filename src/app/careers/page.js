import PageShell from '@/components/layout/PageShell';
import CtaBand from '@/components/sections/CtaBand';
import Hero from '@/components/sections/Hero';
import SectionIntro from '@/components/sections/SectionIntro';
import Button from '@/components/ui/Button';
import Section from '@/components/ui/Section';
import Wrap from '@/components/ui/Wrap';
import { pageMetadata } from '@/config/metadata';
import { ROUTES } from '@/config/site';

export const metadata = pageMetadata({
  title: 'Careers at Coremantle | Build the Data AI Is Missing',
  description:
    "Help build the data AI is missing. We keep it simple: no long job descriptions - tell us what you'd build and send your resume to careers@coremantle.ai.",
  path: ROUTES.careers,
});

const PITCH = {
  label: 'Send us your pitch',
  href: `mailto:careers@coremantle.ai?subject=${encodeURIComponent('Careers - pitch + resume')}`,
  // careers mail goes straight to the inbox, not the contact dialog
  contactForm: false,
};

const ROLES = [
  {
    area: 'Engineering',
    title: 'Data & ML infrastructure',
    body: 'Pipelines, annotation tooling, and platform work that turns raw speech and text into model-ready datasets.',
  },
  {
    area: 'Linguistics',
    title: 'Language & quality',
    body: 'Native experts across languages, dialects, and domains - defining what "correct" means and enforcing it.',
  },
  {
    area: 'Community',
    title: 'Contributor network',
    body: 'Building and running the curated community of vetted native speakers our data depends on.',
  },
  {
    area: 'Something else',
    title: "The role we haven't written",
    body: "Operations, partnerships, design - if you can move this mission forward, tell us what you'd own.",
  },
];

export default function CareersPage() {
  return (
    <PageShell
      page="careers"
      headerCta={PITCH}
      contactForm={false}
      footer={{ tagline: 'The data vacuum ends here.', homeHref: ROUTES.home }}
      afterMain={
        <CtaBand
          eyebrow="Get in touch"
          title={
            <>
              Want to contribute? <em>Send us your pitch.</em>
            </>
          }
          body="Tell us what you'd build, fix, or bring to Coremantle - engineering, linguistics, community, or something we haven't thought of - and attach your resume."
        >
          <Button href={PITCH.href} variant="large">
            {PITCH.label}
          </Button>
        </CtaBand>
      }
    >
      <Hero band>
        <SectionIntro
          as="h1"
          eyebrow="Careers"
          title={
            <>
              Help build the data <em>AI is missing.</em>
            </>
          }
          lede="We're a small team building the training data behind the world's under-served languages - and we're always looking for people who care about this problem as much as we do. We don't do long job descriptions; we look at what you'd bring."
        />
      </Hero>

      <Section>
        <Wrap>
          <SectionIntro
            eyebrow="Where you fit"
            title={
              <>
                A few of the places we <em>build.</em>
              </>
            }
            titleProps={{ style: { fontSize: 'clamp(34px,4.4vw,60px)' } }}
          />
          <div className="roles">
            {ROLES.map(role => (
              <article className="role" data-reveal="" key={role.area}>
                <span>{role.area}</span>
                <h3>{role.title}</h3>
                <p>{role.body}</p>
              </article>
            ))}
          </div>
        </Wrap>
      </Section>
    </PageShell>
  );
}

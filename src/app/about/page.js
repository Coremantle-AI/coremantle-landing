import HorizonTrack from '@/components/horizon/HorizonTrack';
import PageShell from '@/components/layout/PageShell';
import CtaBand from '@/components/sections/CtaBand';
import Hero from '@/components/sections/Hero';
import SectionIntro from '@/components/sections/SectionIntro';
import TeamSection from '@/components/team/TeamSection';
import ActionRow from '@/components/ui/ActionRow';
import Button from '@/components/ui/Button';
import Wrap from '@/components/ui/Wrap';
import { ROUTES, mailto } from '@/config/site';

export const metadata = {
  title: 'Coremantle - About us',
  description:
    "Building the data layer for a world AI still doesn't understand. Coremantle closes the representation gap with high-quality, representative data infrastructure across languages, cultures and contexts.",
};

export default function AboutPage() {
  return (
    <PageShell
      page="about"
      team
      footer={{ tagline: 'Building the data layer for a world AI still doesn’t understand.', homeHref: ROUTES.home }}
      afterMain={
        // Fold 5: closing CTA
        <CtaBand
          id="contact"
          eyebrow="Join the mission"
          title={
            <>
              Help us build the data layer for the next billion <em>AI users.</em>
            </>
          }
          body="The next generation of AI will only be as inclusive, capable and intelligent as the data beneath it. Help us build that foundation."
        >
          <ActionRow reveal>
            <Button href={ROUTES.careers} variant="large">
              Work with us
            </Button>
            <Button href={mailto('Partner with Coremantle')} variant="large" contactForm>
              Partner with Coremantle
            </Button>
          </ActionRow>
        </CtaBand>
      }
    >
      {/* Fold 1: our mission */}
      <Hero band>
        <SectionIntro
          as="h1"
          eyebrow="Our mission"
          title={
            <>
              Building the data layer for a world AI still doesn&rsquo;t <em>understand.</em>
            </>
          }
          lede={
            <>
              AI has advanced rapidly, but billions of people remain underrepresented in the data it learns from.{' '}
              <strong>Coremantle exists to close that gap</strong> by building high-quality, representative data infrastructure across
              languages, cultures and contexts.
            </>
          }
        />
      </Hero>

      {/* Fold 3: our team */}
      <TeamSection />

      {/* Fold 4: our vision */}
      <section id="vision" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="fold-head">
          <Wrap>
            <SectionIntro
              eyebrow="Our vision"
              title={
                <>
                  From speech to the full spectrum of <em>AI.</em>
                </>
              }
              lede="We’re starting with speech, then expanding into text, visual, multimodal, and physical AI — wherever better data can make intelligence work better in the real world."
            />
          </Wrap>
        </div>
        <HorizonTrack />
      </section>
    </PageShell>
  );
}

import PageShell from '@/components/layout/PageShell';
import Hero from '@/components/sections/Hero';
import SectionIntro from '@/components/sections/SectionIntro';
import ActionRow from '@/components/ui/ActionRow';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/config/site';

// Next.js adds `noindex` to 404 responses itself.
export const metadata = {
  title: 'Page not found | Coremantle',
};

// Borrows the Careers page frame: a single banded hero with CTAs.
export default function NotFound() {
  return (
    <PageShell page="careers" footer={{ tagline: 'Filling the data intelligence void for AI.', homeHref: ROUTES.home }}>
      <Hero band>
        <SectionIntro
          as="h1"
          eyebrow="404"
          title={
            <>
              This page <em>doesn&rsquo;t exist.</em>
            </>
          }
          lede="The link may be old or mistyped. Here's where most people are headed."
        />
        <ActionRow>
          <Button href={ROUTES.home} variant="primary">
            Home
          </Button>
          <Button href={ROUTES.enterprise}>For enterprise</Button>
          <Button href={ROUTES.bigtech}>For AI labs</Button>
          <Button href={ROUTES.contact}>Contact us</Button>
        </ActionRow>
      </Hero>
    </PageShell>
  );
}

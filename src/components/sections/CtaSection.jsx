import ActionRow from '@/components/ui/ActionRow';
import Button from '@/components/ui/Button';
import Section from '@/components/ui/Section';
import Wrap from '@/components/ui/Wrap';
import { cn } from '@/lib/utils/cn';
import SectionIntro from './SectionIntro';

/**
 * Centred closing call to action.
 *
 * @param {Array<{label, href, variant?, contactForm?}>} actions
 */
export default function CtaSection({ id, surface = false, eyebrow, eyebrowProps, title, lede, actions, className }) {
  return (
    <Section id={id} surface={surface} className={cn('cta-final', className)}>
      <Wrap>
        <SectionIntro eyebrow={eyebrow} eyebrowProps={eyebrowProps} title={title} lede={lede} />
        <ActionRow reveal>
          {actions.map(({ label, ...button }) => (
            <Button key={label} {...button}>
              {label}
            </Button>
          ))}
        </ActionRow>
      </Wrap>
    </Section>
  );
}

import HeroGlow from '@/components/ui/HeroGlow';
import Section from '@/components/ui/Section';
import Wrap from '@/components/ui/Wrap';
import { cn } from '@/lib/utils/cn';

/**
 * Full-viewport page hero with the bottom glow.
 *
 * @param {boolean} band    render as a `.section` band (about, careers) rather
 *                          than a bare landing hero
 * @param {boolean} pinned  wrap the content in `.hero-pin` (process)
 */
export default function Hero({ id, band = false, pinned = false, className, children }) {
  const content = (
    <>
      <HeroGlow />
      <Wrap>{children}</Wrap>
    </>
  );
  const body = pinned ? <div className="hero-pin">{content}</div> : content;

  if (band) {
    return (
      <Section id={id} className={cn('hero', className)}>
        {body}
      </Section>
    );
  }
  return (
    <section className={cn('hero', className)} id={id}>
      {body}
    </section>
  );
}

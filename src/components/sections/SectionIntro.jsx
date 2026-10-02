import Display from '@/components/ui/Display';
import Eyebrow from '@/components/ui/Eyebrow';
import Lede from '@/components/ui/Lede';

/**
 * The standard section opener: eyebrow, display headline and optional
 * lede paragraph(s), each revealed on scroll.
 *
 * @param {'h1'|'h2'} as     headline level (h1 for page heroes)
 * @param {node|node[]} lede one paragraph, or an array for several
 */
export default function SectionIntro({ eyebrow, title, lede, as = 'h2', eyebrowProps, titleProps }) {
  const ledes = lede == null ? [] : Array.isArray(lede) ? lede : [lede];
  return (
    <>
      {eyebrow && (
        <Eyebrow reveal {...eyebrowProps}>
          {eyebrow}
        </Eyebrow>
      )}
      <Display as={as} reveal {...titleProps}>
        {title}
      </Display>
      {ledes.map((paragraph, index) => (
        <Lede reveal key={index}>
          {paragraph}
        </Lede>
      ))}
    </>
  );
}

import Eyebrow from '@/components/ui/Eyebrow';
import Wrap from '@/components/ui/Wrap';

/**
 * Split closing band (About, Careers): copy on the left, call(s) to action
 * on the right. Sits between </main> and the footer.
 */
export default function CtaBand({ id, eyebrow, title, body, children }) {
  return (
    <section className="cta" id={id}>
      <Wrap className="cta-in">
        <div>
          <Eyebrow reveal>{eyebrow}</Eyebrow>
          <h2 data-reveal="">{title}</h2>
          <p data-reveal="">{body}</p>
        </div>
        {children}
      </Wrap>
    </section>
  );
}

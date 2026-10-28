import GatesFoundationLogo from '@/components/ui/GatesFoundationLogo';
import NvidiaInceptionBadge from '@/components/ui/NvidiaInceptionBadge';
import Wrap from '@/components/ui/Wrap';
import TrustedByRow from './TrustedByRow';

/**
 * Trust bar: centered eyebrow label over a bordered logo strip, mirroring a
 * "trusted by" band. Logos render the same muted grey in both themes via the
 * `.trusted-logo` class (see styles/pages/home.css), and slide in from the
 * sides toward the centre on scroll via `TrustedByRow`.
 */
export default function TrustedBySection() {
  return (
    <section className="trusted-by" aria-label="Our affiliations">
      <Wrap>
        <p className="trusted-by__eyebrow">Our affiliations</p>
      </Wrap>
      <div className="trusted-by__strip">
        <TrustedByRow>
          <GatesFoundationLogo className="trusted-logo trusted-by__logo" />
          <NvidiaInceptionBadge className="trusted-by__logo trusted-by__logo--nvidia" />
        </TrustedByRow>
      </div>
    </section>
  );
}

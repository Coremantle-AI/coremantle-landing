import PageShell from '@/components/layout/PageShell';
import { pageMetadata } from '@/config/metadata';
import { ROUTES } from '@/config/site';
import PrivacyNotice from '@/features/privacy/PrivacyNotice';

export const metadata = pageMetadata({
  title: 'Privacy Notice - Coremantle AI',
  description:
    'How Coremantle AI Private Limited collects, uses, stores, discloses, and protects personal data, under the DPDPA 2023 and the GDPR where relevant.',
  path: ROUTES.privacy,
});

export default function PrivacyPage() {
  return (
    <PageShell
      page="privacy"
      mainClassName="legal"
      footer={{
        tagline: 'Filling the data intelligence void for AI.',
        homeHref: `${ROUTES.home}#top`,
        privacyLink: true,
        contained: false,
      }}
    >
      <p className="legal-eyebrow">Legal</p>
      <h1>Privacy Notice</h1>
      <p className="legal-org">Coremantle AI Private Limited</p>
      <p className="legal-meta">
        Version 1.0 &nbsp;·&nbsp; Effective Date: August 2026 &nbsp;·&nbsp; Last Reviewed: August 2026
      </p>
      <PrivacyNotice />
    </PageShell>
  );
}

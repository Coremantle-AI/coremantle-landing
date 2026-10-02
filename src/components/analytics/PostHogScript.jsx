import Script from 'next/script';
import { posthogEnabled, posthogSnippet } from '@/lib/analytics/posthog';

/** Loads PostHog once per visit, after the page is interactive. */
export default function PostHogScript() {
  if (!posthogEnabled) return null;
  return (
    <Script id="posthog" strategy="afterInteractive">
      {posthogSnippet}
    </Script>
  );
}

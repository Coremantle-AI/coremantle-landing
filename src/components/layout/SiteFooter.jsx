import { CONTACT_EMAIL, ROUTES } from '@/config/site';
import SmartLink from '@/components/ui/SmartLink';
import Wordmark from '@/components/ui/Wordmark';
import { cn } from '@/lib/utils/cn';

/**
 * Site footer: wordmark + page tagline on the left, contact and compliance
 * meta on the right (stacked on phones).
 *
 * @param {string}  tagline      line under the wordmark
 * @param {string}  homeHref     wordmark target (`#top` on long pages)
 * @param {boolean} privacyLink  show the "Privacy Notice" link
 * @param {boolean} contained    wrap the row in the 1240px column (the
 *                               document-style pages size it themselves)
 */
export default function SiteFooter({ tagline, homeHref = '#top', privacyLink = false, contained = true }) {
  return (
    <footer className="site-footer">
      <div className={cn(contained && 'wrap w-full max-w-(--wrap) m-auto', 'footer-in')}>
        <div>
          <Wordmark href={homeHref} />
          <p className="m-0 mt-[12px] text-muted text-[14px]">{tagline}</p>
        </div>
        <div className="footer-meta text-muted font-mono font-medium text-[11px] leading-[1.7] text-right mobile:text-left">
          {CONTACT_EMAIL}
          <br />
          DPDP-ready · Data processed in India
          <br />
          {privacyLink && (
            <>
              <SmartLink href={ROUTES.privacy}>Privacy Notice</SmartLink>
              {' · '}
            </>
          )}
          © 2026 Coremantle AI
        </div>
      </div>
    </footer>
  );
}

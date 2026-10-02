import ContactDialog from '@/components/dialogs/ContactDialog';
import TeamDialog from '@/components/dialogs/TeamDialog';
import MotionController from '@/components/motion/MotionController';
import { cn } from '@/lib/utils/cn';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';

/**
 * Page frame: header, page content, footer and the shared modals.
 *
 * The wrapper's `page-<name>` class scopes that route's stylesheet
 * (styles/pages/<name>.css). The dialogs render inside it so they pick up
 * the same page styles they had when appended to <body> on the static site.
 *
 * @param {string}  page       route key, e.g. "home"
 * @param {object}  footer     SiteFooter props
 * @param {object}  headerCta  override for the header CTA
 * @param {node}    afterMain  content rendered between </main> and the footer
 * @param {boolean} contactForm render the contact dialog (default true)
 * @param {boolean} team       render the team profile dialog
 */
export default function PageShell({
  page,
  className,
  mainClassName,
  footer,
  headerCta,
  afterMain,
  contactForm = true,
  team = false,
  children,
}) {
  return (
    <div className={cn(`page-${page}`, className)}>
      <SiteHeader cta={headerCta} />
      <main className={mainClassName}>{children}</main>
      {afterMain}
      <SiteFooter {...footer} />
      {contactForm && <ContactDialog />}
      {team && <TeamDialog />}
      <MotionController />
    </div>
  );
}

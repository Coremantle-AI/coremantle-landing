import { cn } from '@/lib/utils/cn';
import SmartLink from './SmartLink';

const VARIANTS = {
  default: '',
  primary: 'button--primary',
  large: 'button--lg',
};

/**
 * Pill CTA with the trailing ↗ glyph. Visual styling lives in the page
 * stylesheets (`.button`), which differ slightly per page by design.
 *
 * `contactForm` marks the link as a contact-dialog trigger: it keeps its
 * mailto: href as the no-JS fallback while ContactDialog intercepts clicks.
 */
export default function Button({ href, variant = 'default', contactForm = false, className, children, ...rest }) {
  return (
    <SmartLink
      href={href}
      className={cn('button', VARIANTS[variant], className)}
      data-contact-form={contactForm ? '' : undefined}
      {...rest}
    >
      {children}
    </SmartLink>
  );
}

import { cn } from '@/lib/utils/cn';

const BASE = 'px-[24px] py-[clamp(90px,11vw,170px)] border-t border-t-line mobile:px-[20px] mobile:py-[82px]';

/**
 * Full-bleed page band with the site's fluid vertical rhythm and a hairline
 * divider on top. `surface` raises it onto the alternate background.
 * The `section` / `section--surface` class names stay as hooks for page
 * styles (theme easing, contextual overrides).
 */
export default function Section({ as: Tag = 'section', surface = false, className, children, ...rest }) {
  return (
    <Tag className={cn('section', surface && 'section--surface', BASE, surface && 'bg-surface', className)} {...rest}>
      {children}
    </Tag>
  );
}

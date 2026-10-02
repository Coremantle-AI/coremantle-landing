import { cn } from '@/lib/utils/cn';

const BASE = 'max-w-[720px] m-0 mt-[32px] text-muted text-[length:clamp(18px,2vw,24px)] leading-[1.55]';

/** Muted intro paragraph under a display headline. */
export default function Lede({ reveal = false, className, children, ...rest }) {
  return (
    <p className={cn('lede', BASE, className)} data-reveal={reveal ? '' : undefined} {...rest}>
      {children}
    </p>
  );
}

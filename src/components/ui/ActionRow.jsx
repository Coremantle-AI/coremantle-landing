import { cn } from '@/lib/utils/cn';

/** Wrapping row of CTA buttons. */
export default function ActionRow({ reveal = false, className, children, ...rest }) {
  return (
    <div className={cn('action-row flex flex-wrap gap-[12px] mt-[30px]', className)} data-reveal={reveal ? '' : undefined} {...rest}>
      {children}
    </div>
  );
}

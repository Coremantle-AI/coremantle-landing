import { cn } from '@/lib/utils/cn';

const BASE = cn(
  'flex items-center gap-[10px] m-0 mb-[28px] text-muted',
  'font-mono font-medium text-[11px] leading-none tracking-[.13em] uppercase',
  "before:content-[''] before:w-[8px] before:h-[8px] before:rounded-[2px] before:bg-accent",
);

/** Mono uppercase section kicker with the accent square. */
export default function Eyebrow({ as: Tag = 'p', reveal = false, className, children, ...rest }) {
  return (
    <Tag className={cn('eyebrow', BASE, className)} data-reveal={reveal ? '' : undefined} {...rest}>
      {children}
    </Tag>
  );
}

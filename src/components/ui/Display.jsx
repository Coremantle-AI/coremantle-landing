import { cn } from '@/lib/utils/cn';

const BASE = 'max-w-[1050px] mb-0 font-medium leading-[.95] tracking-[-.052em] [&_em]:text-accent [&_em]:not-italic';

// h1 runs a step smaller than section headlines (the hero carries a lede and
// CTAs beneath it); both scale down on phones.
const SIZE = {
  h1: 'text-[length:clamp(38px,5.8vw,80px)] mobile:text-[length:clamp(34px,10vw,54px)]',
  h2: 'text-[length:clamp(46px,7.4vw,104px)] mobile:text-[length:clamp(44px,13vw,68px)]',
};

/** Display headline. `<em>` inside is set in the accent colour, upright. */
export default function Display({ as: Tag = 'h2', reveal = false, className, children, ...rest }) {
  return (
    <Tag
      className={cn('display', BASE, Tag === 'h1' ? SIZE.h1 : SIZE.h2, className)}
      data-reveal={reveal ? '' : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

import { cn } from '@/lib/utils/cn';

/** Centred content column capped at the --wrap width (1240px). */
export default function Wrap({ as: Tag = 'div', className, children, ...rest }) {
  return (
    <Tag className={cn('wrap w-full max-w-(--wrap) m-auto', className)} {...rest}>
      {children}
    </Tag>
  );
}

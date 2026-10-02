import { cn } from '@/lib/utils/cn';
import SmartLink from './SmartLink';

/** "coremantle." logotype; the dot is the accent. */
export default function Wordmark({ href, className, ...rest }) {
  return (
    <SmartLink
      href={href}
      className={cn('wordmark text-[20px] font-semibold tracking-[-.03em] mobile:text-[17px]', className)}
      {...rest}
    >
      coremantle<i className="text-accent not-italic">.</i>
    </SmartLink>
  );
}

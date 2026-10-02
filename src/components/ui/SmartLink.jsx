import Link from 'next/link';

/**
 * Anchor that routes internal paths through next/link (client navigation +
 * prefetch) and leaves hashes, mailto: and external URLs as plain <a>.
 */
export default function SmartLink({ href, children, ...rest }) {
  if (typeof href === 'string' && href.startsWith('/')) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

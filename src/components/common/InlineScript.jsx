/**
 * Renders a blocking inline <script> during server rendering.
 *
 * On the client the tag is emitted as `text/plain`, which keeps React from
 * warning about rendering scripts and guarantees it never re-executes on a
 * client-side navigation. `suppressHydrationWarning` covers the type swap.
 */
export default function InlineScript({ html }) {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

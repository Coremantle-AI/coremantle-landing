import { cn } from '@/lib/utils/cn';

/**
 * NVIDIA Inception Program mark. The logomark stays constant; "Inception
 * Program" + the divider are pre-baked grey (light) / white (dark) and
 * swapped via the `.theme-swap` pair so each theme loads a single asset.
 */
export default function NvidiaInceptionBadge({ className, imgClassName, ...rest }) {
  return (
    <span className={cn('theme-swap', className)} {...rest}>
      <img
        className={cn('theme-swap__dark', imgClassName)}
        src="/logos/nvidia-inception-badge-dark-v2.png"
        alt="NVIDIA Inception Program"
        width={433}
        height={149}
      />
      <img
        className={cn('theme-swap__light', imgClassName)}
        src="/logos/nvidia-inception-badge-light-v2.png"
        alt="NVIDIA Inception Program"
        width={433}
        height={149}
      />
    </span>
  );
}

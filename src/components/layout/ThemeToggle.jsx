import { cn } from '@/lib/utils/cn';
import { MoonIcon, SunIcon } from '@/components/ui/icons';

/**
 * Light/dark switch. Clicks are handled by the delegated listener in the
 * theme bootstrap script (lib/theme/theme-script.js), so this stays a plain
 * server-rendered button. `bar` is the copy shown in the mobile header bar.
 */
export default function ThemeToggle({ bar = false }) {
  return (
    <button className={cn('theme-toggle', bar && 'theme-toggle--bar')} type="button" aria-label="Toggle light and dark theme">
      <SunIcon className="i-sun" />
      <MoonIcon className="i-moon" />
    </button>
  );
}

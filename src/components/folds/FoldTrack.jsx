import { cn } from '@/lib/utils/cn';
import Fold from './Fold';

/**
 * Pinned full-bleed scene: the stage sticks for the track's travel and that
 * travel is mapped onto the scene's timeline, so scroll sets the pace.
 * `short` trims the travel for scenes with less to tell.
 */
export default function FoldTrack({ short = false, ...foldProps }) {
  return (
    <div className={cn('fold-track', short && 'fold-track--short')} data-fold-track="">
      <div className="fold-stage">
        <Fold wide {...foldProps} />
      </div>
    </div>
  );
}

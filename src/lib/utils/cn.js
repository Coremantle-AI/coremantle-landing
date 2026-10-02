/** Joins truthy class names: `cn('a', cond && 'b')` -> `'a b'`. */
export function cn(...classes) {
  return classes.flat().filter(Boolean).join(' ');
}

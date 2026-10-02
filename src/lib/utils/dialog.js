/**
 * Native <dialog> helpers shared by the site's modals.
 *
 * A click on the ::backdrop is reported with the dialog itself as the target,
 * so a target === dialog click outside its box means "close".
 */
export function isBackdropClick(dialog, event) {
  if (event.target !== dialog) return false;
  const bounds = dialog.getBoundingClientRect();
  const inside =
    event.clientX >= bounds.left &&
    event.clientX <= bounds.right &&
    event.clientY >= bounds.top &&
    event.clientY <= bounds.bottom;
  return !inside;
}

/**
 * Listens for clicks on any element matching `selector` anywhere in the
 * document (the triggers are server-rendered links/buttons).
 * @returns {() => void} unsubscribe
 */
export function onDelegatedClick(selector, handler) {
  const listener = event => {
    const trigger = event.target.closest?.(selector);
    if (!trigger) return;
    event.preventDefault();
    handler(trigger, event);
  };
  document.addEventListener('click', listener);
  return () => document.removeEventListener('click', listener);
}

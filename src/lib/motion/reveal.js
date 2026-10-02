// Scroll reveals for `[data-reveal]` elements (styles: page stylesheets).
//
// Elements fade/slide in once, the first time 12% of them is visible.
// Siblings crossing the threshold together cascade at 45ms steps instead of
// arriving as one block; the delay is cleared once the reveal lands so it
// never bleeds into the element's own hover/press transitions.

const SELECTOR = '[data-reveal]';
const STAGGER_MS = 45;
const MAX_STAGGER_STEPS = 8;

/**
 * Starts observing every current and future `[data-reveal]` element under
 * `root`. Elements rendered later (e.g. a section that re-lays itself out
 * after hydration) are picked up by a MutationObserver.
 * @returns {() => void} cleanup
 */
export function initReveal(root = document.body) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const observer = new IntersectionObserver(
    entries => {
      let order = 0;
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        if (!reducedMotion.matches) {
          element.style.transitionDelay = Math.min(order++, MAX_STAGGER_STEPS) * STAGGER_MS + 'ms';
          // transitioncancel covers reveals interrupted mid-flight (e.g.
          // scrolled past fast) that never reach transitionend
          const clear = () => {
            element.style.transitionDelay = '';
          };
          element.addEventListener('transitionend', clear, { once: true });
          element.addEventListener('transitioncancel', clear, { once: true });
        }
        element.classList.add('is-visible');
        observer.unobserve(element);
      });
    },
    { threshold: 0.12 },
  );

  const observeWithin = node => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches(SELECTOR) && !node.classList.contains('is-visible')) observer.observe(node);
    node.querySelectorAll(SELECTOR).forEach(element => {
      if (!element.classList.contains('is-visible')) observer.observe(element);
    });
  };

  observeWithin(root);
  const mutations = new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(observeWithin));
  });
  mutations.observe(root, { childList: true, subtree: true });

  return () => {
    mutations.disconnect();
    observer.disconnect();
  };
}

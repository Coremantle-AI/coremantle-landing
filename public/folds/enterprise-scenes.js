(() => {
  const root = document.documentElement;
  const timeline = document.querySelector('main');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 600px) and (min-height: 600px)');
  const reveals = [...document.querySelectorAll('[data-at]')];
  const phrases = [...document.querySelectorAll('[data-highlight]')];
  const connections = [...document.querySelectorAll('[data-connector-at]')];
  const bars = [...document.querySelectorAll('[data-bar]')];
  // Separate, non-overlapping pops on the scroll timeline. Paused WAAPI
  // animations preserve easing while making reversal and seeking exact.
  const cardPops = new Map(reveals.filter(el => el.matches('.annotation, .mess .tile')).map(el => {
    const animation = el.animate([
      { opacity: 0, transform: 'translateY(8px) scale(0.94)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' },
    ], { duration: 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'both' });
    animation.pause();
    animation.currentTime = 0;
    return [el, animation];
  }));
  let progress = 0;
  const clamp = value => Math.min(1, Math.max(0, value));
  bars.forEach(bar => bar.style.setProperty('--value', bar.style.height));
  function render() {
    // Keep the desktop diagram proportions inside the deck; phones reflow.
    if (mobile.matches) {
      timeline.style.cssText = '';
    } else {
      const scale = Math.min(innerWidth / 1047, innerHeight / 592);
      timeline.style.cssText = `position:absolute;width:1047px;height:592px;transform-origin:top left;transform:scale(${scale});left:${(innerWidth - 1047 * scale) / 2}px;top:${(innerHeight - 592 * scale) / 2}px`;
    }
    const p = reduced.matches ? 1 : progress;
    reveals.forEach(el => {
      const pop = cardPops.get(el);
      if (pop) {
        // Each pop occupies 2% of the timeline; starts are at least 6% apart.
        pop.currentTime = clamp((p - Number(el.dataset.at)) / .02) * 200;
        return;
      }
      const value = clamp((p - Number(el.dataset.at)) / .07);
      el.style.opacity = value;
      el.style.transform = `translateY(${(1 - value) * 12}px)`;
    });
    connections.forEach(el => {
      const span = el.closest('.conversation-connections') ? .02 : .07;
      el.style.opacity = clamp((p - Number(el.dataset.connectorAt)) / span);
    });
    phrases.forEach(el => el.classList.toggle('is-highlighted', p >= Number(el.dataset.highlight)));
    bars.forEach(bar => {
      const value = clamp((p - Number(bar.dataset.bar)) / .13);
      // Reveal from the baseline without distorting the percentage labels.
      bar.style.clipPath = mobile.matches
        ? `inset(-35px ${-(35 * value) + (1 - value) * bar.offsetWidth}px -35px 0)`
        : `inset(${(1 - value) * (bar.offsetHeight + 35) - 35}px -5px 0 -5px)`;
      bar.style.opacity = value > 0 ? 1 : 0;
    });
  }
  timeline.addEventListener('data-om-seek-to-time-frame', event => {
    progress = clamp(event.detail.time / 10);
    render();
  });
  reduced.addEventListener('change', render);
  mobile.addEventListener('change', render);
  addEventListener('resize', render);
  if (parent !== window) {
    const parentRoot = parent.document.documentElement;
    const syncTheme = () => root.setAttribute('data-theme', parentRoot.getAttribute('data-theme') || 'dark');
    new MutationObserver(syncTheme).observe(parentRoot, { attributes: true, attributeFilter: ['data-theme'] });
    syncTheme();
  } else progress = 1;
  render();
  timeline.dataset.sceneReady = 'true';
})();

'use client';

import { useEffect, useRef, useState } from 'react';
import Fold from '@/components/folds/Fold';
import Section from '@/components/ui/Section';
import Wrap from '@/components/ui/Wrap';
import { textContent } from '@/lib/utils/text-content';

const DECK_QUERY = '(min-width: 821px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

const number = index => `0${index + 1}`;

/**
 * Numbered problem section (Enterprise, Big Tech).
 *
 * Renders in one of three layouts:
 *  - `static` (server render / first paint): a plain list of rows.
 *  - `deck`   (desktop with motion): heading scrolls away; a sticky stage pins
 *             the numbered rail beside a deck of panels, and scroll steps
 *             through them (driven by lib/scrub/scrub-engine).
 *  - `list`   (phones, reduced motion): the rows stay in flow beside a sticky
 *             rail that follows the row in view.
 *
 * @param {number} index    position among the page's problem sections (ids)
 * @param {node}   heading  eyebrow / display / lede, rendered in the wrap
 * @param {Array<{title: string, body: node, fold: object}>} items
 */
export default function ProblemSection({ id, surface = false, index: sectionIndex = 0, heading, items }) {
  const [mode, setMode] = useState('static');
  const trackRef = useRef(null);

  useEffect(() => {
    const deckMedia = window.matchMedia(DECK_QUERY);
    const reduced = window.matchMedia(REDUCED_QUERY);
    const update = () => setMode(deckMedia.matches && !reduced.matches ? 'deck' : 'list');
    update();
    deckMedia.addEventListener('change', update);
    return () => deckMedia.removeEventListener('change', update);
  }, []);

  const rowId = index => `deck-${sectionIndex}-panel-${index + 1}`;

  const copy = (item, index, reveal) => (
    <div className="problem-copy" data-reveal={reveal ? '' : undefined}>
      <span className="n">{number(index)}</span>
      <h3>{item.title}</h3>
      <p>{item.body}</p>
    </div>
  );

  const rows = withIds => (
    <div className="problem-list">
      {items.map((item, index) => (
        <article className="problem-row" id={withIds ? rowId(index) : undefined} key={item.title}>
          {copy(item, index, true)}
          <Fold {...item.fold} />
        </article>
      ))}
    </div>
  );

  if (mode === 'deck') {
    const scrollToPanel = index => {
      const track = trackRef.current;
      const dist = Math.max(1, track.offsetHeight - innerHeight);
      const top = track.getBoundingClientRect().top + scrollY + ((index + 0.5) / items.length) * dist;
      scrollTo({ top, behavior: window.matchMedia(REDUCED_QUERY).matches ? 'auto' : 'smooth' });
    };
    return (
      <Section id={id} surface={surface}>
        <Wrap>{heading}</Wrap>
        <div className="problem-track" ref={trackRef} style={{ height: `${items.length * 100}svh` }}>
          <div className="problem-stage">
            <Wrap>
              <div className="problem-layout">
                <ProblemNav items={items} rowId={rowId} onSelect={scrollToPanel} />
                <div className="problem-deck">
                  {items.map((item, index) => (
                    <div className="problem-panel" key={item.title}>
                      {copy(item, index, false)}
                      <Fold {...item.fold} deck />
                    </div>
                  ))}
                </div>
              </div>
            </Wrap>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section id={id} surface={surface}>
      <Wrap>
        {heading}
        {mode === 'list' ? <ListLayout items={items} rowId={rowId} rows={rows(true)} /> : rows(false)}
      </Wrap>
    </Section>
  );
}

/** Numbered rail: number + title per row; the active row shows its copy. */
function ProblemNav({ items, rowId, onSelect, active = 0, tracked = false }) {
  return (
    <ol className="problem-nav">
      {items.map((item, index) => (
        <li key={item.title}>
          <button
            type="button"
            className={index === active ? 'active' : undefined}
            data-target={rowId(index)}
            aria-label={`View ${item.title}`}
            aria-current={tracked ? (index === active ? 'true' : 'false') : undefined}
            onClick={() => onSelect(index)}
          >
            <span className="n">{number(index)}</span>
            {item.title}
          </button>
          <div className="problem-nav-detail">
            <p>{textContent(item.body)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** In-flow rows with a rail that follows whichever row is nearest the top. */
function ListLayout({ items, rowId, rows }) {
  const layoutRef = useRef(null);
  const [active, setActive] = useState(0);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    const rowsInView = [...layoutRef.current.querySelectorAll('.problem-row')];
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top - 200) - Math.abs(b.boundingClientRect.top - 200));
        if (!visible[0]) return;
        setActive(rowsInView.indexOf(visible[0].target));
        setTracked(true);
      },
      { rootMargin: '-140px 0px -40% 0px', threshold: [0, 0.25, 0.5] },
    );
    rowsInView.forEach(row => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  const scrollToRow = index => {
    // an options-object 'smooth' overrides the CSS scroll-behavior guard, so
    // branch on the preference explicitly
    document.getElementById(rowId(index))?.scrollIntoView({
      behavior: window.matchMedia(REDUCED_QUERY).matches ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="problem-layout" ref={layoutRef}>
      <ProblemNav items={items} rowId={rowId} onSelect={scrollToRow} active={active} tracked={tracked} />
      {rows}
    </div>
  );
}

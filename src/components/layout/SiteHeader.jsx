'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NAV_CTA, PRIMARY_NAV } from '@/config/navigation';
import { ROUTES } from '@/config/site';
import Button from '@/components/ui/Button';
import SmartLink from '@/components/ui/SmartLink';
import Wordmark from '@/components/ui/Wordmark';
import { CaretIcon, MenuIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils/cn';
import ThemeToggle from './ThemeToggle';

const MOBILE_QUERY = '(max-width: 820px)';

/**
 * Fixed site header.
 *  - Desktop: dropdowns open on hover (CSS) or click (`is-open`).
 *  - Mobile (<=820px): the hamburger opens the panel (`nav-open`) and the
 *    dropdowns expand inline.
 * Any link click or outside click closes what is open; Escape closes and
 * returns focus to the control that opened it.
 */
export default function SiteHeader({ cta = NAV_CTA }) {
  const navRef = useRef(null);
  const toggleRef = useRef(null);
  const triggerRefs = useRef([]);
  const [navOpen, setNavOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState(null);
  // mirrors for the document-level listeners, which are bound once
  const state = useRef({ navOpen, openDrop });
  useEffect(() => {
    state.current = { navOpen, openDrop };
  }, [navOpen, openDrop]);

  const closeAll = useCallback(() => {
    setOpenDrop(null);
    setNavOpen(false);
  }, []);

  useEffect(() => {
    const onDocumentClick = event => {
      const target = event.target;
      if (!target.closest?.('.nav-drop')) setOpenDrop(null);
      if (!navRef.current?.contains(target)) setNavOpen(false);
    };
    const onKeyDown = event => {
      if (event.key !== 'Escape') return;
      const { navOpen: wasOpen, openDrop: drop } = state.current;
      // with the mobile panel open, focus returns to the menu toggle (the
      // dropdown trigger is about to be hidden); otherwise to the trigger
      if (wasOpen) toggleRef.current?.focus();
      else if (drop !== null) triggerRefs.current[drop]?.focus();
      closeAll();
    };
    const mobile = window.matchMedia(MOBILE_QUERY);
    const onBreakpoint = () => setOpenDrop(null);

    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onKeyDown);
    mobile.addEventListener('change', onBreakpoint);
    return () => {
      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('keydown', onKeyDown);
      mobile.removeEventListener('change', onBreakpoint);
    };
  }, [closeAll]);

  const onLinksClick = event => {
    if (event.target.closest('a')) closeAll();
  };

  return (
    <header className={cn('site-nav', navOpen && 'nav-open')} ref={navRef}>
      <Wordmark href={ROUTES.home} aria-label="Coremantle home" />
      <ThemeToggle bar />
      <button
        ref={toggleRef}
        className="nav-toggle"
        type="button"
        aria-label="Menu"
        aria-expanded={navOpen ? 'true' : 'false'}
        onClick={() => setNavOpen(open => !open)}
      >
        <MenuIcon />
      </button>
      <nav className="nav-links" aria-label="Primary" onClick={onLinksClick}>
        {PRIMARY_NAV.map((entry, index) =>
          entry.items ? (
            <div className={cn('nav-drop', openDrop === index && 'is-open')} key={entry.label}>
              <button
                ref={node => {
                  triggerRefs.current[index] = node;
                }}
                className="nav-drop-trigger"
                type="button"
                aria-haspopup="true"
                aria-expanded={openDrop === index ? 'true' : 'false'}
                onClick={() => setOpenDrop(current => (current === index ? null : index))}
              >
                {entry.label}
                <CaretIcon className="nav-drop-caret" />
              </button>
              <div className="nav-drop-menu">
                {entry.items.map(item => (
                  <SmartLink href={item.href} key={item.href}>
                    {item.label}
                  </SmartLink>
                ))}
              </div>
            </div>
          ) : (
            <SmartLink href={entry.href} key={entry.label}>
              {entry.label}
            </SmartLink>
          ),
        )}
        <ThemeToggle />
        <Button href={cta.href} contactForm={cta.contactForm ?? true}>
          {cta.label}
        </Button>
      </nav>
    </header>
  );
}

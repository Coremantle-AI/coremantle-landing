// Runs synchronously in <head> before first paint (see app/layout.js), so the
// stored theme is applied with no flash of the wrong palette.
//
// - Applies the stored choice (localStorage `cm-theme`), else the OS
//   preference, and follows OS changes until the visitor picks one.
// - Keeps <meta name="theme-color"> in step with the palette.
// - Handles every `.theme-toggle` click through one delegated listener on
//   `document`, which survives client-side route changes. The one-shot
//   `theme-easing` class cross-fades the large surfaces while the palette swaps.
export const THEME_STORAGE_KEY = 'cm-theme';

export const THEME_COLORS = { dark: '#0e0d0b', light: '#faf8f3' };

export const themeBootstrapScript = `(function(){var d=document.documentElement;function apply(l){if(l)d.setAttribute('data-theme','light');else d.removeAttribute('data-theme');var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',l?'${THEME_COLORS.light}':'${THEME_COLORS.dark}')}
function stored(){try{return localStorage.getItem('${THEME_STORAGE_KEY}')}catch(e){return null}}
var mq=null;try{mq=window.matchMedia('(prefers-color-scheme: light)')}catch(e){}
var s=stored();apply(s?s==='light':!!(mq&&mq.matches));
if(mq&&mq.addEventListener)mq.addEventListener('change',function(e){if(!stored())apply(e.matches)});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.theme-toggle');if(!b)return;var l=d.getAttribute('data-theme')!=='light';d.classList.add('theme-easing');clearTimeout(window.__cmThemeT);window.__cmThemeT=setTimeout(function(){d.classList.remove('theme-easing')},400);apply(l);try{localStorage.setItem('${THEME_STORAGE_KEY}',l?'light':'dark')}catch(e){}});})();`;

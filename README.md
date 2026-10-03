# Coremantle website (Next.js)

Next.js (App Router, JavaScript) + Tailwind CSS v4 port of the static
Coremantle marketing site (`../coremantle-page`). The UI, motion and
responsive behaviour are intended to match the original exactly. The page
stylesheets were ported 1:1, and the scroll engines keep their original maths.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # all routes prerender as static pages
npm start
npm run lint
```

## Routes

| Route         | Was               |
|---------------|-------------------|
| `/`           | `index.html`      |
| `/about`      | `about.html`      |
| `/bigtech`    | `bigtech.html`    |
| `/careers`    | `careers.html`    |
| `/contact`    | `contact.html`    |
| `/enterprise` | `enterprise.html` |
| `/privacy`    | `privacy.html`    |
| `/process`    | `process.html`    |

The old `*.html` URLs permanently redirect to the new routes (`next.config.mjs`).

## Structure

```
src/
  app/                 routes: one page.js per page + root layout (metadata, fonts, theme bootstrap)
  components/
    ui/                primitives styled with Tailwind: Section, Wrap, Eyebrow, Display,
                       Lede, ActionRow, Button, Wordmark, HeroGlow, SmartLink, icons
    layout/            PageShell, SiteHeader (nav state), SiteFooter, ThemeToggle
    sections/          shared blocks: Hero, SectionIntro, CtaSection, CtaBand, QualityProof
    folds/             Fold (animated scene host), FoldTrack (pinned scene)
    scrub/             QualityScrub stage + the pyramid / production-stack chapters
    problem/           ProblemSection: numbered deck (desktop) / list (mobile)
    team/              TeamSection (Home + About)
    horizon/           HorizonTrack ("What comes next" canvas scene)
    dialogs/           ContactDialog, TeamDialog
    motion/            MotionController (starts reveal + scrub engines per page)
  features/<page>/     page-only sections and copy (stacked cards, flywheel, pipeline, ...)
  lib/
    scrub/             scroll-scrub engine (ported from landing.js)
    horizon/           horizon dot-field scene (ported from horizon.js)
    motion/            scroll reveals
    contact/           contact-form validation + submission
    theme/             pre-paint theme bootstrap script
    utils/
  config/              site constants, navigation
  data/                team roster
  styles/              see "Styling"
public/
  folds/               animated scenes (.dc.html + .jsx), served verbatim
  support.js, *.jsx    scene runtime used by the folds
  team/, assets/       images
```

## Styling

`src/styles/globals.css` is the only CSS entry point. Cascade order:

1. **Tailwind theme + `base` layer**: design tokens (`base/tokens.css`, mapped to
   Tailwind colours/fonts in `@theme`) and document defaults (`base/reset.css`).
   Tailwind's Preflight is deliberately **not** used, because the design relies on
   browser default margins.
2. **Tailwind utilities**: style the UI primitives in `components/ui`.
   Breakpoints are the custom variants `mobile:` (≤820px) and `desktop:`
   (≥821px), which match the original queries inclusively.
3. **Unlayered page and component sheets** (`styles/pages/*.css`,
   `styles/components/*.css`): ported 1:1 from the static site. Each page sheet
   is scoped with `:where(.page-<name>)`, the class `PageShell` puts on the page
   wrapper. That scope adds zero specificity, and it keeps rules from leaking
   between routes on client-side navigation. These sheets hold the contextual
   overrides (e.g. `.choice .eyebrow`), which win over the primitives exactly
   as their higher specificity did originally.

Notes:
- Write vendor-prefixed declarations *before* the standard one
  (`-webkit-backdrop-filter` then `backdrop-filter`). Lightning CSS keeps only
  the last of the pair.
- Fonts load from Google Fonts by family name (not `next/font`), because the
  canvas scenes and the fold iframes reference the families by name.
- Portraits use plain `<img>` so the image bytes stay identical.

## Motion

- **Folds** (`components/folds/Fold`): each scene host registers with the scrub
  engine, which lazy-loads `/folds/<name>` in an iframe near the viewport and
  drives its timeline from scroll. Folds inside `.stack-card`, pinned tracks
  (`FoldTrack`) and problem decks each have their own progress mapping.
- **Quality scrubs** (`components/scrub`): the engine writes `--qp` on
  `.q-stage`; elements read their slice through `--s`/`--v` (see the page CSS)
  and the prism flies between `[data-prism-apex]` and `[data-prism-slot]`.
- **Enterprise hero**: the architecture scene runs in
  `public/folds/Enterprise Architecture Hero.dc.html`. On the static site it
  was mounted inline; it is now framed like the other scenes.
- Every engine honours `prefers-reduced-motion` and cleans up on route change.

## Adding a scene

Drop `<name>-scene.jsx` and `<Name>.dc.html` into `public/folds/`, then render
`<Fold scene="<Name>.dc.html" label="…" aspect="1520/860" />` (or `FoldTrack`).
Add any per-scene aspect overrides to that page's stylesheet.

## Environment variables

Copy `.env.example` to `.env.local` for local development (`.env.local` is not
committed).

| Variable                   | Purpose                                                    |
|----------------------------|------------------------------------------------------------|
| `NEXT_PUBLIC_POSTHOG_KEY`  | PostHog project key (`phc_…`). Empty = analytics off.      |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://us.i.posthog.com` (EU: `https://eu.i.posthog.com`) |

`NEXT_PUBLIC_*` values are baked in at build time: after changing one, rebuild.

## Deploy

Any Next.js host. On Netlify, `netlify.toml` pins the Next.js runtime
(`@netlify/plugin-nextjs`); keep it, or every route returns 404. Set the environment variables above in the host's settings.
`next.config.mjs` serves `.jsx` as `text/javascript` (required, or every scene
silently fails to load) and sets the security headers.

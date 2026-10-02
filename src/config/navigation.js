import { ROUTES, mailto } from './site';

/** Primary navigation. `items` renders a hover/click dropdown. */
export const PRIMARY_NAV = [
  {
    label: 'Solution',
    items: [
      { label: 'Enterprise', href: ROUTES.enterprise },
      { label: 'Big Tech', href: ROUTES.bigtech },
    ],
  },
  { label: 'Process', href: ROUTES.process },
  {
    label: 'Company',
    items: [
      { label: 'About us', href: ROUTES.about },
      { label: 'Careers', href: ROUTES.careers },
      { label: 'Contact us', href: ROUTES.contact },
      { label: 'Legal', href: ROUTES.privacy },
    ],
  },
];

export const NAV_CTA = { label: 'Request sample data', href: mailto('Coremantle sample data') };

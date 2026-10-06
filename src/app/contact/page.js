import { Fragment } from 'react';
import PageShell from '@/components/layout/PageShell';
import { pageMetadata } from '@/config/metadata';
import { CONTACT_EMAIL, ROUTES } from '@/config/site';

export const metadata = pageMetadata({
  title: 'Contact us - Coremantle AI',
  description: 'Get in touch with Coremantle AI - offices in Bengaluru, India and New York, US. Email contact@coremantle.ai.',
  path: ROUTES.contact,
});

const OFFICES = [
  {
    label: 'India Office',
    city: 'Bengaluru',
    address: ['Second Floor, No. 78/9, Outer Ring Road,', 'Bellandur Village, Varthur Hobli,', 'Bengaluru East, Bengaluru,', 'Karnataka 560103'],
    maps: 'https://maps.google.com/?q=Coremantle+78/9+Outer+Ring+Road+Bellandur+Bengaluru+560103',
  },
  {
    label: 'US Office',
    city: 'New York',
    address: ['18 W 18th St,', 'New York, NY 10011,', 'United States'],
    maps: 'https://maps.google.com/?q=18+W+18th+St+New+York+NY+10011',
  },
];

export default function ContactPage() {
  const mailtoContact = `mailto:${CONTACT_EMAIL}`;
  return (
    <PageShell
      page="contact"
      mainClassName="contact"
      footer={{
        tagline: 'Filling the data intelligence void for AI.',
        homeHref: `${ROUTES.home}#top`,
        privacyLink: true,
        contained: false,
      }}
    >
      <p className="contact-eyebrow">Get in touch</p>
      <h1>Contact us</h1>
      <p className="contact-lede">
        Building for AI, or exploring what a dataset would take? Reach out at <a href={mailtoContact}>{CONTACT_EMAIL}</a> - we usually
        reply within a business day.
      </p>

      <div className="contact-grid">
        <section className="contact-card contact-card--email">
          <span className="contact-k">Email</span>
          <a className="contact-email" href={mailtoContact}>
            {CONTACT_EMAIL}
          </a>
        </section>

        {OFFICES.map(office => (
          <section className="contact-card" key={office.label}>
            <span className="contact-k">{office.label}</span>
            <h2>{office.city}</h2>
            <address>
              {office.address.map((line, index) => (
                <Fragment key={line}>
                  {index > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </address>
            <a className="maplink" href={office.maps} target="_blank" rel="noopener">
              Open in Maps
            </a>
          </section>
        ))}
      </div>
    </PageShell>
  );
}

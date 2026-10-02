import ActionRow from '@/components/ui/ActionRow';
import Button from '@/components/ui/Button';
import Eyebrow from '@/components/ui/Eyebrow';
import { ROUTES } from '@/config/site';

const PATHS = [
  {
    eyebrow: 'Big Tech',
    title: 'Frontier & sovereign AI labs',
    body: 'For frontier and sovereign AI labs building the next generation of models.',
    cta: { label: 'Explore Big Tech', href: ROUTES.bigtech },
  },
  {
    eyebrow: 'Enterprise',
    title: 'AI for your business',
    body: 'For companies building, fine-tuning or owning AI for their business.',
    cta: { label: 'Explore Enterprise', href: ROUTES.enterprise },
  },
];

/** Two audience cards; the first is the accent-filled one. */
export default function PathChoices() {
  return (
    <div className="choice-grid">
      {PATHS.map(path => (
        <article className="choice" data-reveal="" key={path.eyebrow}>
          <Eyebrow>{path.eyebrow}</Eyebrow>
          <h3>{path.title}</h3>
          <p>{path.body}</p>
          <ActionRow>
            <Button href={path.cta.href}>{path.cta.label}</Button>
          </ActionRow>
        </article>
      ))}
    </div>
  );
}

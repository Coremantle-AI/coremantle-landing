// "Quality by design" proof points shared by Home and Big Tech: the three
// pillars and the four-up metric band.

export const QUALITY_PILLARS = [
  'Consent-first and compliant sourcing',
  'Quality engineered upstream',
  'Certified model-ready output',
];

export const QUALITY_METRICS = [
  { value: '>95%', label: 'Dataset quality' },
  { value: '<5%', label: 'Word error rate' },
  { value: '>65%', label: 'Automated QC' },
  { value: 'Certified', label: 'Model-readiness certification' },
];

export function Pillars({ items = QUALITY_PILLARS }) {
  return (
    <div className="pillars" data-reveal="">
      {items.map(item => (
        <span className="pillar" key={item}>
          {item}
        </span>
      ))}
    </div>
  );
}

export function MetricBand({ items = QUALITY_METRICS }) {
  return (
    <div className="metric" data-reveal="">
      {items.map(item => (
        <div key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

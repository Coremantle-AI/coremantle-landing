const EFFECTS = [
  { kicker: 'Compute & GPU spend', title: 'Lower', body: 'No cycles wasted training on data that never should have been in the set.' },
  { kicker: 'Model hallucinations', title: 'Fewer', body: 'Clean source data means fewer errors baked into the model from day one.' },
  { kicker: 'Path to production', title: 'Faster', body: 'Every batch is model ready, not a starting point for more cleanup.' },
];

/** "The downstream effects of trainable data": three hover-lift cards. */
export default function DownstreamEffects() {
  return (
    <>
      <div className="bench-head" data-reveal="">
        <h3>The downstream effects of trainable data are undeniable.</h3>
      </div>
      <div className="effects">
        {EFFECTS.map(effect => (
          <article className="effect" data-reveal="" key={effect.title}>
            <span>{effect.kicker}</span>
            <h3>{effect.title}</h3>
            <p>{effect.body}</p>
          </article>
        ))}
      </div>
    </>
  );
}

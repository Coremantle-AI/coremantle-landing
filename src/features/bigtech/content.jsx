// Big Tech page copy that drives repeated layouts.

export const BIGTECH_PROBLEMS = [
  {
    title: 'Valuable AI data is rare, complex, and hard to source.',
    body: (
      <>
        The valuable data isn&apos;t just more tokens or hours. It&apos;s{' '}
        <strong>
          rare, domain-specific, contextual, multilingual, conversational, and representative of how people actually use AI.
        </strong>{' '}
        Finding and sourcing that data at scale is difficult.
      </>
    ),
    fold: { scene: 'Bigtech Iceberg.html', label: 'The data iceberg', className: 'bigtech-fold', aspect: '3/2' },
  },
  {
    title: "Raw data isn't training data.",
    body: (
      <>
        Audio, conversations, documents, and other raw corpora still need{' '}
        <strong>deduplication, transcription, segmentation, annotation, contextualisation, and quality validation</strong> before
        they can reliably improve a model.
      </>
    ),
    fold: { scene: 'Coremantle Trainable.dc.html', label: 'Raw data to model-ready data', aspect: '1520/860' },
  },
  {
    title: 'Context gets lost at scale.',
    body: (
      <>
        Accents, dialects, code-switching, domain terminology, intent, cultural nuance, and edge cases are easy to flatten or
        mislabel in large-scale annotation. <strong>The model gets the words, but misses what they mean.</strong>
      </>
    ),
    fold: {
      scene: 'Enterprise Conversation.html',
      label: 'One conversation, many layers',
      className: 'enterprise-fold',
      aspect: '1047/592',
    },
  },
  {
    title: 'Bad training data compounds. And so does the cost of getting it wrong.',
    body: (
      <>
        A bad label or noisy example doesn&apos;t stay isolated. It can affect{' '}
        <strong>training, fine-tuning, evaluation, and deployment,</strong> leading to weaker accuracy, unreliable behaviour, and
        more hallucinations. When training runs are expensive, discovering the problem after training means paying to learn the
        same lesson again. <strong>Every training cycle needs to count.</strong>
      </>
    ),
    fold: { scene: 'Bigtech Snowball.html', label: 'The compounding cost of bad data', className: 'bigtech-fold', aspect: '3/2' },
  },
];

export const AMBITIONS = [
  {
    title: 'Frontier AI Labs',
    body: (
      <>
        Every new model release creates a new data requirement. CoreMantle keeps the training, evaluation, and alignment data moving
        with it.<span className="who">OpenAI · Anthropic · Google · Meta · Microsoft</span>
      </>
    ),
    fold: { scene: 'Bidtech Frontier.dc.html', label: 'Frontier labs', aspect: '1200/750' },
  },
  {
    title: 'Sovereign AI',
    body: (
      <>
        A sovereign model needs a sovereign data foundation. Locally sourced, consented, traceable data across India&rsquo;s
        languages and dialects.<span className="who">Sarvam · BharatGen · IndiaAI ecosystem</span>
      </>
    ),
    fold: { scene: 'Bidtech Sovereign.dc.html', label: 'Sovereign AI', aspect: '1200/750' },
  },
  {
    title: 'Core Voice AI Infrastructure',
    body: (
      <>
        Real conversations are where speech models break. We capture the accents, dialects, code-mixing, noise, and domain language
        benchmarks miss.<span className="who">Deepgram · ElevenLabs · Indic speech platforms</span>
      </>
    ),
    fold: { scene: 'Bidtech Voice.dc.html', label: 'Voice AI', aspect: '1920/1080', seamIn: '1.02' },
  },
];

export const PIPELINE_STATS = [
  { value: '6,000+ hours procured' },
  { value: '700+ vetted annotators' },
  { value: '12 language clusters', detail: 'Hundreds of dialects' },
  { value: '5,000 hrs / year / language', detail: 'Sustained sourcing capacity' },
  { value: 'Language-agnostic platform', detail: 'One workflow. Always improving.' },
];

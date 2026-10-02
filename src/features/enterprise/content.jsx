// Enterprise page copy that drives repeated layouts.

export const ENTERPRISE_PROBLEMS = [
  {
    title: 'Your data exists. It just isn’t AI-ready.',
    body: 'Enterprise data is scattered across calls, chats, documents, and systems, often noisy, unstructured, and missing the context AI needs.',
    fold: {
      scene: 'Enterprise Data Readiness.html',
      label: 'From enterprise data to the readiness gap',
      className: 'enterprise-fold',
      aspect: '1520/860',
      seamIn: '0',
      seamOut: '0',
    },
  },
  {
    title: 'AI learns from the wrong signals.',
    body: 'Poor transcription, irrelevant information, duplicates, and inaccurate labels can teach models the wrong patterns.',
    fold: { scene: 'Coremantle GPU Burn.dc.html', label: 'Wrong signals, wasted compute', aspect: '1520/860' },
  },
  {
    title: 'Domain complexity gets lost.',
    body: 'Accents, code-switching, industry terminology, customer intent, and edge cases are what make enterprise data difficult to prepare well.',
    fold: {
      scene: 'Enterprise Conversation.html',
      label: 'One conversation. Many layers.',
      className: 'enterprise-fold',
      aspect: '1520/860',
      seamIn: '0',
      seamOut: '0',
    },
  },
  {
    title: 'Bad data limits what your AI can automate.',
    body: 'When models struggle to understand intent or execute real workflows, enterprises keep humans in the loop, driving up costs and limiting agent automation.',
    fold: {
      scene: 'Enterprise Automation.html',
      label: 'The automation ceiling',
      className: 'enterprise-fold',
      aspect: '1520/860',
      seamIn: '0',
      seamOut: '0',
    },
  },
];

export const INDUSTRIES = [
  { tag: '01 / BFSI', title: 'Banking and financial services', body: 'Train AI on real financial conversations, terminology, accents, and customer intent.' },
  { tag: '02 / HEALTH', title: 'Healthcare', body: 'Build language models that understand clinical context, patient speech, and regional variation.' },
  { tag: '03 / LEGAL', title: 'Legal', body: 'Prepare AI for complex legal language, domain vocabulary, and multilingual documentation.' },
  { tag: '04 / COMMERCE', title: 'eCommerce', body: 'Improve search, support, and conversational AI across the languages customers actually use.' },
  { tag: '05 / LOGISTICS', title: 'Logistics', body: 'Train voice and agentic systems for high-volume, multilingual operations in the real world.' },
  { tag: '06 / AGRI', title: 'AgriTech', body: 'Make AI understand farmers across regional languages, dialects, and agriculture-specific vocabulary.' },
];

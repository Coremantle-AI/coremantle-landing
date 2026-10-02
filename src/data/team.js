// Team roster: drives the portrait grid (components/team/TeamGrid) and the
// profile dialog (components/dialogs/TeamDialog).

export const TEAM = [
  {
    id: 'arvind',
    name: 'Arvind Pani',
    group: 'founders',
    role: 'Founder & CEO',
    linkedin: 'https://www.linkedin.com/in/arvind-pani-0a62532/',
    bio: [
      'Arvind Pani is the Founder & CEO of Coremantle. He previously co-founded Reverie Language Technologies, which was acquired by Jio in 2019. For over 16 years, he worked on making digital experiences more inclusive across Indian languages.',
      'At Coremantle, he is continuing that mission by building the data infrastructure needed for AI to work across underrepresented languages.',
    ],
  },
  {
    id: 'vivek',
    name: 'Vivekananda Pani',
    group: 'founders',
    role: 'Co-founder & CTO',
    linkedin: 'https://www.linkedin.com/in/vivekanand-pani/',
    bio: [
      'Vivekananda Pani is the Co-founder and CTO of Coremantle and a veteran of Indian language technology. He began his career at C-DAC, where he worked on Indian language technologies before co-founding Reverie Language Technologies, acquired by Jio in 2019.',
      'He spent 16 years at Reverie building technology that brought Indian languages to digital devices and platforms. At Coremantle, he is now focused on building the data infrastructure AI needs to understand India.',
    ],
  },
  {
    id: 'sai',
    name: 'Sai Nanduri',
    group: 'founding',
    objectPosition: 'top',
    role: 'Founding team',
    linkedin: 'https://www.linkedin.com/in/sai-nanduri-71004298/',
    bio: [
      'Sai is a founding member of Coremantle and has spent over a decade working across AI, language technology, and enterprise adoption. At Reverie Language Technologies, he helped build and take multilingual AI solutions to enterprises and public-sector organizations across India.',
      'At Coremantle, Sai is focused on building the data infrastructure layer that enables Frontier Labs and Big Tech firms to build and scale AI models, starting with speech and underrepresented languages and expanding across geographies and modalities.',
    ],
  },
  {
    id: 'thomas',
    name: 'Thomas Hyland',
    group: 'founding',
    role: 'Founding team',
    linkedin: 'https://in.linkedin.com/in/trhyland',
    bio: [
      'Thomas Hyland has spent more than two decades investing across India and emerging markets. He co-founded Aspada, an early-stage venture platform that backed companies including Reverie Language Technologies, Capital Float, Dunzo, and NeoGrowth. He later led Aspada’s acquisition by LGT Group, where it became part of Lightrock.',
      'His connection to India began with years of travel across the country, followed by an MBA from the ISB. A decade ago, he backed the Reverie team. Today, he is building alongside them at Coremantle.',
    ],
  },
  {
    id: 'chintan',
    name: 'Chintan Parikh',
    group: 'founding',
    role: 'Founding team',
    linkedin: 'https://www.linkedin.com/in/chintanparikh/',
    bio: [
      'Chintan Parikh brings over 14 years of experience across software engineering and technical leadership, with a focus on speech AI and enterprise solutions. He is Founding Anchor - Enterprise Solutions at Coremantle, helping enterprises turn proprietary data into practical AI capabilities.',
      'Previously, he held technical leadership roles at Reverie Language Technologies, including Technical Manager in Speech R&D and Voice AI. His work connects high-quality conversational data, domain-specific speech recognition, and enterprise voice applications to address real-world business needs.',
    ],
  },
  {
    id: 'prantik',
    name: 'Prantik Nayak',
    group: 'founding',
    role: 'Founding team',
    linkedin: 'https://www.linkedin.com/in/prantik-nayak-5318911a',
    bio: [
      'AI and Speech Technology professional with 15+ years of experience across Speech Recognition, Voice AI and AI Data.',
      'Prantik specializes in translating business needs into scalable AI solutions. Bridging technology, product, and customer requirements, he now leads delivery and quality at Coremantle.',
    ],
  },
  {
    id: 'pranjal',
    name: 'Pranjal Nayak',
    group: 'founding',
    role: 'Founding team',
    linkedin: 'https://www.linkedin.com/in/pranjalnayak/',
    bio: [
      'Pranjal Nayak is a language technology and AI leader with 16+ years of experience in Indian-language technology, speech, and NLP.',
      'Formerly an engineering and R&D leader at Reverie Language Technologies, he now leads data acquisition and strategy at Coremantle, building high-quality conversational datasets for AI.',
    ],
  },
  {
    id: 'bhupen',
    name: 'Bhupen Chauhan',
    group: 'founding',
    role: 'Founding team',
    linkedin: 'https://www.linkedin.com/in/bhupen-chauhan-999b246a/',
    bio: [
      'Bhupen Chauhan is a software engineer and AI product builder with over a decade of experience across Indian-language technology, NLP, conversational AI, and voice AI. His work spans multilingual NLP and language infrastructure, developer platforms, conversational systems, and real-time voice AI, taking AI systems from research and experimentation to reliable, scalable products.',
      'At Coremantle, Bhupen focuses on building the engineering and AI infrastructure that enables building high-quality data to power AI systems across the world.',
    ],
  },
  {
    id: 'anurag',
    name: 'Anurag Behera',
    group: 'founding',
    role: 'Founding team',
    linkedin: 'https://www.linkedin.com/in/anurag-zubin-behera/',
    bio: [
      'Anurag is an engineer turned community builder, with a deep-rooted passion for languages and technology.',
      'His journey took him from automotive engineering to founding Srujani, a multilingual knowledge-sharing platform for Indian languages. Along the way, he saw firsthand how much of India’s knowledge and culture remained invisible in the digital world.',
      'Today at Coremantle, he is building the human community that can teach AI the languages, nuances and contexts of the people it serves.',
    ],
  },
];

export const TEAM_GROUPS = [
  { id: 'founders', label: 'Founders' },
  { id: 'founding', label: 'Founding team' },
];

export const teamPhoto = id => `/team/${id}.jpg`;

export const findMember = id => TEAM.find(member => member.id === id);

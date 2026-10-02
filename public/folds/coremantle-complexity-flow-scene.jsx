// One intent branches into language, context, and real-world variations.
// The landing page owns the CompositionStage playhead through scroll seeking.
(function () {
  const SANS = '"Space Grotesk", "Noto Sans Devanagari", sans-serif';
  const LANGUAGES = [
    { label: 'English', flag: '🇺🇸', dialects: ['US', 'UK', 'AU'], slang: 'Regional slang', mix: 'English + Hindi' },
    { label: 'Hindi', flag: '🇮🇳', dialects: ['Awadhi', 'Bhojpuri'], slang: 'Hinglish', mix: 'Arabic + English' },
    { label: 'Arabic', flag: '🇦🇪', dialects: ['MSA', 'Levantine'], slang: 'Gulf', mix: 'Bahasa + English' },
    { label: 'Bahasa', flag: '🇮🇩', dialects: ['Betawi', 'Javanese'], slang: 'Sundanese', mix: 'Spanish + English' },
    { label: 'Spanish', flag: '🇪🇸', dialects: ['LatAm', 'Castilian'], slang: 'Spanglish', mix: 'Swahili + English' },
    { label: 'Swahili', flag: '🇹🇿', dialects: ['Urban', 'Coastal'], slang: 'Sheng' },
  ];
  const DOMAINS = ['Banking', 'Healthcare', 'Retail', 'Education', 'Legal', 'Customer Support'];
  const PHRASES = [
    ['Mujhe payment', 'mein help chahiye'], ['I need help', 'with my payment'],
    ['أحتاج مساعدة', 'في الدفع'], ['Saya perlu bantuan', 'dengan pembayaran'],
    ['Necesito ayuda', 'con mi pago'], ['Nahitaji msaada', 'na malipo yangu'],
    ['Payment issue', 'ho raha hai'], ['¿Me pueden ayudar', 'con el pago?'],
  ];
  const LABELS = [
    ['Intent', 'One user intent'], ['Languages', 'Many languages'],
    ['Dialects & accents', 'Multiple ways to say it'], ['Code-switching', 'Real-world conversation'],
    ['Domains & context', 'Different use cases'], ['Endless variations', 'Thousands of possibilities'],
  ];
  const LIGHT = { bg: '#faf8f3', card: '#ffffff', ink: '#1c1a14', muted: 'rgba(28,26,20,.62)', edge: 'rgba(28,26,20,.10)', accent: '#4f58c4', colors: ['#7362d2', '#4d87dc', '#6aaa59', '#c466b0', '#d79a45', '#47a7b1'] };
  const DARK = { bg: '#0e0d0b', card: '#1c1b19', ink: '#f6f4ef', muted: 'rgba(246,244,239,.62)', edge: 'rgba(246,244,239,.14)', accent: '#8b93e8', colors: ['#a292ef', '#82a8ef', '#94c886', '#d58ac4', '#d9ad55', '#7fc4c9'] };

  function useEnvironment() {
    const read = () => ({ compact: innerWidth < 1000 || innerHeight / Math.max(1, innerWidth) < .5, portrait: window.parent === window ? innerWidth < 480 : window.parent.innerWidth <= 600, ratio: innerHeight / Math.max(1, innerWidth), reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
      light: (window.parent.document.documentElement.dataset.theme || document.documentElement.dataset.theme) === 'light' });
    const [env, setEnv] = React.useState(read);
    React.useEffect(() => {
      const update = () => setEnv(read());
      const media = matchMedia('(prefers-reduced-motion: reduce)');
      const observer = new MutationObserver(update);
      observer.observe(window.parent.document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      window.addEventListener('resize', update);
      media.addEventListener('change', update);
      return () => { observer.disconnect(); window.removeEventListener('resize', update); media.removeEventListener('change', update); };
    }, []);
    return env;
  }

  // Solve the site's --ease-out curve (.23, 1, .32, 1) for a seekable timeline.
  function easeOut(progress) {
    const p = Math.max(0, Math.min(1, progress));
    let low = 0, high = 1;
    for (let i = 0; i < 12; i++) {
      const t = (low + high) / 2;
      const x = 3 * (1 - t) * (1 - t) * t * .23 + 3 * (1 - t) * t * t * .32 + t * t * t;
      if (x < p) low = t; else high = t;
    }
    return p === 0 || p === 1 ? p : 1 - Math.pow(1 - (low + high) / 2, 3);
  }

  function Icon({ kind, color }) {
    const paths = [
      'M2 8 12 3 22 8Z M3 21h18 M5 10v8 M9 10v8 M15 10v8 M19 10v8',
      'M5 3v6a5 5 0 0 0 10 0V3 M3 3h4 M13 3h4 M10 14v2a5 5 0 0 0 10 0v-3 M20 9v4',
      'M2 3h3l3 12h11l3-9H6 M9 20h.01 M18 20h.01',
      'M2 8 12 3 22 8 12 13Z M6 11v6l6 3 6-3v-6 M22 8v9',
      'M6 2h9l4 4v16H6Z M14 2v5h5 M9 11h7 M9 15h7 M9 18h5',
      'M3 13v-2a9 9 0 0 1 18 0v6h-4v-7h4 M3 10h4v7H3Z M18 18v3h-6',
    ];
    return <svg x="-12" y="-12" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={paths[kind]} /></svg>;
  }

  function Diagram({ env, palette }) {
    const { T, CUES } = window.useComposition();
    const m = env.compact, P = palette, W = m ? 600 : 1440, H = m ? 790 : 820;
    const xs = m ? [112, 300, 488] : [335, 485, 635, 805, 975, 1140];
    const ys = m ? [62, 172, 286, 410, 514, 642] : [72, 202, 318, 458, 562, 692];
    const langs = m ? LANGUAGES.slice(0, 3) : LANGUAGES;
    const rowNames = ['Intent', 'Languages', 'Dialects', 'Mixing', 'Domains', 'Variations'];
    const progress = (row, delay = 0) => env.reduced ? 1 : easeOut((T - CUES[rowNames[row]] - delay) / .65);
    const reveal = (row, delay = 0) => { const p = progress(row, delay); return { opacity: p, transform: `translateY(${env.reduced ? 0 : (1 - p) * 10}px)` }; };
    const nodes = [], edges = [];
    function pill(key, x, y, width, text, row, options = {}) {
      const { small = false, color, flag, icon, more = false, lines } = options;
      const height = lines ? 48 : small ? 32 : 44;
      const fontSize = m ? (small ? 17 : 19) : (small ? 13 : 15);
      const contentOffset = flag || icon !== undefined ? 18 : 0;
      nodes.push(<g key={key} data-complexity-node={key} style={reveal(row, options.delay || 0)}>
        <rect x={x - width / 2} y={y - height / 2} width={width} height={height} rx={small ? 15 : 20} fill={more ? P.bg : P.card} stroke={color || (more ? P.accent : P.edge)} strokeOpacity={color || more ? .35 : 1} />
        {flag && <text x={x - width / 2 + 17} y={y + 7} fontSize={22} fill={P.accent}>{flag}</text>}
        {icon !== undefined && <g transform={`translate(${x - width / 2 + 25} ${y})`}><Icon kind={icon} color={color || P.accent} /></g>}
        <text x={x + contentOffset} y={lines ? y - 5 : y + fontSize * .35} textAnchor="middle" fill={color || (more ? P.muted : P.ink)} fontSize={lines ? (m ? 15.5 : 12) : fontSize} fontWeight="500">
          {lines ? lines.map((line, i) => <tspan key={i} x={x} dy={i ? 19 : 0}>{line}</tspan>) : text}
        </text>
      </g>);
    }
    function link(key, x1, y1, x2, y2, row, colorIndex, delay = 0) {
      const middle = (y1 + y2) / 2;
      edges.push(<path key={key} d={`M${x1},${y1} C${x1},${middle} ${x2},${middle} ${x2},${y2}`} fill="none" stroke={P.colors[colorIndex % P.colors.length]} strokeWidth={m ? 1.8 : 1.5} opacity={progress(row, delay) * .53} />);
    }
    const intentX = m ? 300 : 725;
    pill('intent', intentX, ys[0], m ? 410 : 365, 'I need help with my payment.', 0, { flag: '✦' });
    langs.forEach((lang, i) => {
      const x = xs[i];
      link(`intent-${i}`, intentX, ys[0] + 22, x, ys[1] - 22, 1, i);
      pill(`language-${i}`, x, ys[1], m ? 150 : i === 3 ? 172 : 116, lang.label, 1, { flag: lang.flag, delay: i * .05 });
      const dialects = m ? lang.dialects.slice(0, 2) : lang.dialects;
      dialects.forEach((dialect, j) => {
        const dx = x + (j - (dialects.length - 1) / 2) * (m ? 86 : dialects.length === 3 ? 48 : 68);
        link(`dialect-${i}-${j}`, x, ys[1] + 22, dx, ys[2] - 28, 2, i);
        pill(`dialect-${i}-${j}`, dx, ys[2] - 12, m ? 83 : dialects.length === 3 ? 43 : 66, dialect, 2, { small: true, delay: j * .05 });
      });
      link(`slang-${i}`, x, ys[1] + 22, x, ys[2] + 13, 2, i);
      pill(`slang-${i}`, x, ys[2] + 29, m ? 156 : 114, lang.slang, 2, { small: true, delay: .1 });
    });
    const mixes = m ? ['English + Hindi', 'Arabic + English', 'Hindi + Arabic'] : LANGUAGES.slice(0, 5).map(l => l.mix);
    const mixXs = m ? xs : [410, 565, 730, 895, 1060];
    const languagePairs = m ? [[0, 1], [2, 0], [1, 2]] : [[0, 1], [2, 0], [3, 0], [4, 0], [5, 0]];
    mixes.forEach((mix, i) => {
      languagePairs[i].forEach((source, j) => link(`mix-${i}-${j}`, xs[source], ys[2] + 45, mixXs[i], ys[3] - 22, 3, source));
      pill(`mix-${i}`, mixXs[i], ys[3], m ? 179 : 145, mix, 3, { delay: i * .05 });
    });
    const domainIndices = m ? [0, 1, 2] : [0, 1, 2, 3, 4, 5];
    domainIndices.forEach((domain, i) => {
      const from = Math.min(i, mixes.length - 1);
      link(`domain-${i}`, mixXs[from], ys[3] + 22, xs[i], ys[4] - 22, 4, i);
      if (i > 0) link(`domain-cross-${i}`, mixXs[from - 1], ys[3] + 22, xs[i], ys[4] - 22, 4, i + 1);
      pill(`domain-${i}`, xs[i], ys[4], m ? 172 : i === 5 ? 186 : 134, DOMAINS[domain], 4, { icon: domain, delay: i * .05 });
    });
    const phraseIndices = m ? [0, 1, 2, 4, 5, 6] : PHRASES.map((_, i) => i);
    phraseIndices.forEach((phrase, i) => {
      const x = m ? xs[i % 3] : 300 + i * 123;
      const y = ys[5] + (m ? Math.floor(i / 3) * 58 : 0);
      domainIndices.forEach((domain, j) => link(`phrase-${i}-${j}`, xs[j], ys[4] + 22, x, y - 24, 5, i + j, i * .025));
      pill(`phrase-${i}`, x, y, m ? 174 : 117, '', 5, { lines: PHRASES[phrase], color: P.colors[i % 6], delay: i * .04 });
    });
    if (!m) {
      [['+ many more', 1], ['+ more dialects', 2], ['+ more combinations', 3], ['+ more domains', 4], ['+ thousands more', 5]].forEach(([text, row]) => pill(`more-${row}`, 1330, ys[row], row === 3 ? 182 : 150, text, row, { more: true }));
    }
    return <svg data-complexity-flow={m ? 'compact' : 'wide'} viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="img" aria-labelledby="complexity-title complexity-desc" style={{ position: 'absolute', inset: 0, fontFamily: SANS }}>
      <title id="complexity-title">One intent. Endless variations.</title>
      <desc id="complexity-desc">A request for payment help branches into languages, dialects and accents, code-switching, domains and context, and thousands of distinct ways to say it.</desc>
      <rect width={W} height={H} fill={P.bg} />
      <g aria-hidden="true">{edges}</g>
      {LABELS.map(([title, subtitle], row) => <g key={title} style={reveal(row)}>
        {m ? <g><rect x="18" y={row === 0 ? 5 : ys[row] - (row === 2 ? 63 : row === 5 ? 73 : 53)} width={row === 5 ? 420 : row === 1 ? 300 : 210} height="23" fill={P.bg} /><text x="24" y={row === 0 ? 22 : ys[row] - (row === 2 ? 46 : row === 5 ? 56 : 36)} fill={P.muted} fontSize="17" fontWeight="500">{`${row + 1}. ${title}`}{row === 1 ? ' · + many more' : row === 5 ? ' · thousands of possibilities' : ''}</text></g> : <g>
          <text x="35" y={ys[row] + 2} fill={P.ink} fontSize="17" fontWeight="600">{`${row + 1}. ${title}`}</text>
          <text x="56" y={ys[row] + 25} fill={P.muted} fontSize="14">{subtitle}</text>
          <path d={`M${row === 0 ? 122 : row === 1 ? 165 : 216},${ys[row]} H252`} stroke={P.edge} strokeDasharray="2 4" />
        </g>}
      </g>)}
      {nodes}
      <g style={reveal(5, .4)}>
        <rect x={intentX - 100} y={m ? 739 : 743} width="200" height="45" rx="22" fill={P.card} stroke={P.accent} strokeOpacity=".25" />
        <text x={intentX - 58} y={m ? 773 : 777} fill={P.accent} fontSize="48" textAnchor="middle">∞</text>
        <text x={intentX + 20} y={m ? 768 : 772} fill={P.ink} fontSize="22" fontWeight="600" textAnchor="middle">Variations</text>
        {!m && <text x={intentX} y="811" fill={P.muted} fontSize="10" letterSpacing="3" textAnchor="middle">REAL LANGUAGE. INFINITE COMBINATIONS.</text>}
      </g>
    </svg>;
  }

  // Smaller embeds show representative examples at readable sizes. Every layer
  // stays visible, with fewer branches instead of shrinking the full diagram.
  function CompactDiagram({ env, palette: P, width: W, height: H }) {
    const { T, CUES } = window.useComposition();
    const phone = env.portrait;
    const xs = phone ? [104, 296] : [375, 580, 785];
    const graphCenter = phone ? 200 : 580;
    const rowY = row => 48 + row * (H - 96) / 5;
    const names = ['Intent', 'Languages', 'Dialects', 'Mixing', 'Domains', 'Variations'];
    const opacity = (row, delay = 0) => env.reduced ? 1 : easeOut((T - CUES[names[row]] - delay) / .65);
    const nodes = [], paths = [];
    function node(key, x, row, text, options = {}) {
      const w = options.width || (phone ? 180 : 184), h = options.lines ? 43 : 34;
      const y = rowY(row), p = opacity(row, options.delay || 0);
      nodes.push(<g key={key} data-complexity-node={key} style={{ opacity: p, transform: `translateY(${env.reduced ? 0 : (1 - p) * 8}px)` }}>
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="14" fill={P.card} stroke={options.color || P.edge} strokeOpacity={options.color ? .5 : 1} />
        <text x={x} y={options.lines ? y - 5 : y + 6} textAnchor="middle" fill={options.color || P.ink} fontSize={phone ? (options.lines || options.small ? 15 : 16) : (options.lines || options.small ? 16 : 18)} fontWeight="500">
          {options.lines ? options.lines.map((line, i) => <tspan key={i} x={x} dy={i ? 19 : 0}>{line}</tspan>) : text}
        </text>
      </g>);
    }
    function connect(key, fromX, toX, row, color) {
      const y1 = rowY(row - 1) + 17, y2 = rowY(row) - (row === 5 ? 22 : 17), mid = (y1 + y2) / 2;
      paths.push(<path key={key} d={`M${fromX},${y1} C${fromX},${mid} ${toX},${mid} ${toX},${y2}`} fill="none" stroke={P.colors[color % 6]} strokeWidth="1.5" opacity={opacity(row) * .5} />);
    }
    node('intent', graphCenter, 0, '✦  I need help with my payment.', { width: phone ? 366 : 380 });
    const languages = phone ? ['English', 'Hindi'] : ['English', 'Hindi', 'Arabic'];
    const dialects = ['US · UK · AU', 'Awadhi · Bhojpuri', 'MSA · Levantine'];
    languages.forEach((text, i) => {
      connect(`language-${i}`, graphCenter, xs[i], 1, i);
      node(`language-${i}`, xs[i], 1, text, { delay: i * .05 });
      connect(`dialect-${i}`, xs[i], xs[i], 2, i);
      node(`dialect-${i}`, xs[i], 2, dialects[i], { small: true, delay: i * .05 });
    });
    const mixXs = phone ? [200] : [475, 695];
    const mixNames = ['English + Hindi', 'Arabic + English'];
    mixXs.forEach((x, i) => {
      [0, i === 0 ? 1 : 2].forEach(source => connect(`mix-${i}-${source}`, xs[source], x, 3, source));
      node(`mix-${i}`, x, 3, mixNames[i], { width: phone ? 216 : 205 });
    });
    xs.forEach((x, i) => {
      mixXs.forEach((mx, j) => connect(`domain-${i}-${j}`, mx, x, 4, i));
      node(`domain-${i}`, x, 4, DOMAINS[i], { delay: i * .05 });
    });
    const phrases = [['Mujhe payment mein', 'help chahiye'], ['I need help with', 'my payment'], ['أحتاج مساعدة', 'في الدفع']];
    xs.forEach((x, i) => {
      xs.forEach((dx, j) => connect(`variation-${i}-${j}`, dx, x, 5, i + j));
      node(`phrase-${i}`, x, 5, '', { lines: phrases[i], color: P.colors[i], delay: i * .05 });
    });
    return <svg data-complexity-flow={phone ? 'phone' : 'compact'} viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="img" aria-labelledby="complexity-title complexity-desc" style={{ position: 'absolute', inset: 0, fontFamily: SANS }}>
      <title id="complexity-title">One intent. Endless variations.</title>
      <desc id="complexity-desc">A payment request branches into languages, dialects and accents, mixed-language speech, domains and thousands of variations. Representative examples are shown for readability.</desc>
      <rect width={W} height={H} fill={P.bg} />
      <g aria-hidden="true">{paths}</g>
      {LABELS.map(([title, subtitle], row) => <g key={title} opacity={opacity(row)}>
        {phone ? <g>
          <rect x="10" y={rowY(row) - 43} width={row === 1 ? 270 : 230} height="20" fill={P.bg} />
          <text x="14" y={rowY(row) - 28} fill={P.muted} fontSize="14" fontWeight="500">{row + 1}. {title}{row === 1 ? ' · + many more' : ''}</text>
        </g> : <g>
          <text x="24" y={rowY(row) - 2} fill={P.ink} fontSize="21" fontWeight="500">{row + 1}. {title}</text>
          <text x="46" y={rowY(row) + 20} fill={P.muted} fontSize="16">{subtitle}</text>
        </g>}
      </g>)}
      {nodes}
    </svg>;
  }

  function CoremantleComplexityFlow() {
    const env = useEnvironment(), palette = env.light ? LIGHT : DARK;
    React.useEffect(() => { document.documentElement.style.background = palette.bg; document.body.style.background = palette.bg; document.documentElement.style.setProperty('--complexity-bg', palette.bg); }, [palette.bg]);
    const width = env.compact ? (env.portrait ? 400 : 900) : 1440;
    const height = env.compact ? width * env.ratio : 820;
    return <window.CompositionStage width={width} height={height} bg={palette.bg} autoplay={false} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
      <style>{'[data-om-starter="animations-v3"]{background:var(--complexity-bg)!important}[data-om-exportable-video-with-duration-secs]{box-shadow:none!important}'}</style>
      {env.compact ? <CompactDiagram env={env} palette={palette} width={width} height={height} /> : <Diagram env={env} palette={palette} />}
    </window.CompositionStage>;
  }
  window.CoremantleComplexityFlow = CoremantleComplexityFlow;
})();

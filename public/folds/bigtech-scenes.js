(() => {
  const scene = document.querySelector('main');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const phone = matchMedia('(max-width: 600px)');
  const clamp = n => Math.min(1, Math.max(0, n));
  const world = scene.querySelector('.iceberg-world');
  const prompt = scene.querySelector('.iceberg-prompt');
  const depths = [...scene.querySelectorAll('[data-depth]')];
  const canvas = scene.querySelector('.scene-canvas');
  const ctx = canvas && canvas.getContext('2d');
  const stories = [...scene.querySelectorAll('[data-stage]')];
  const markers = [...scene.querySelectorAll('[data-stage-marker]')];
  const TAU = Math.PI*2;
  const GOLDEN = Math.PI*(3-Math.sqrt(5));
  // Where the slope runs, how large the error grows, and how much it sweeps up.
  const SLOPE = {
    wide:   {p0:[46,244], c:[500,338], p1:[880,520], r0:8, r1:74, chips:170, debris:96, contours:[26,56,92,136,188], grain:260, lead:90, tail:170},
    narrow: {p0:[32,372], c:[276,482], p1:[452,620], r0:7, r1:58, chips:140, debris:74, contours:[22,48,80,124], grain:200, lead:70, tail:130},
  };
  // One silhouette for the whole berg, clockwise from the peak. The waterline
  // crosses it rather than dividing it, so the tip and the mass cannot drift
  // apart when the scene is reframed.
  const BERG = {
    // Clockwise from the peak. Indices seaA and seaB are the two waterline
    // vertices, so the tip and the mass are slices of one silhouette.
    hull: [[730,66],[744,94],[756,80],[768,112],[782,100],[794,134],[806,150],[818,172],[826,190],
           [880,214],[896,268],[876,352],[842,438],[800,516],[752,584],[710,638],[688,672],
           [664,640],[626,586],[588,514],[552,432],[526,346],[514,264],[536,212],[572,190],
           [588,168],[600,150],[612,158],[628,130],[640,140],[652,112],[664,124],[678,96],[690,108],[704,72],[718,90]],
    seaA:8, seaB:24, spine:702,
    cx0:698, water0:190, tip0:124, mass0:482, bubbles:190, grit:78,
    wide:   {cx:652, sx:1,  water:214, tip:170, mass:440},
    narrow: {cx:322, sx:.8, water:268, tip:196, mass:486},
  };
  // The scene is scrubbed forwards and backwards, so nothing may drift between
  // visits: every chip's position, size and tint comes from this hash, making a
  // frame a pure function of progress.
  const noise = (i,salt) => { const v = Math.sin(i*127.1+salt*311.7)*43758.5453; return v-Math.floor(v); };
  const bez = (a,b,c,u) => (1-u)*(1-u)*a + 2*(1-u)*u*b + u*u*c;
  const bezD = (a,b,c,u) => 2*(1-u)*(b-a) + 2*u*(c-b);
  const mixTone = (a,b,t) => [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
  const paint = (c,a) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;
  let sceneScale = 1;

  function pointAt(L,u) {
    const x = bez(L.p0[0],L.c[0],L.p1[0],u), y = bez(L.p0[1],L.c[1],L.p1[1],u);
    const dx = bezD(L.p0[0],L.c[0],L.p1[0],u), dy = bezD(L.p0[1],L.c[1],L.p1[1],u);
    const len = Math.hypot(dx,dy) || 1;
    // The normal points uphill, so the ball rides on top of the slope.
    return {x, y, tx:dx/len, ty:dy/len, nx:dy/len, ny:-dx/len};
  }
  function tracePath(L,u0,u1,drop,offFrame) {
    if (u1 <= u0) return false;
    const off = (m,d) => [m.x - m.nx*(drop||0) + m.tx*d, m.y - m.ny*(drop||0) + m.ty*d];
    ctx.beginPath();
    if (offFrame) ctx.moveTo(...off(pointAt(L,0),-L.lead));
    for (let i = 0; i <= 48; i++) {
      const m = pointAt(L,u0+(u1-u0)*i/48);
      const [x,y] = off(m,0);
      i || offFrame ? ctx.lineTo(x,y) : ctx.moveTo(x,y);
    }
    if (offFrame) ctx.lineTo(...off(pointAt(L,1),L.tail));
    return true;
  }
  function travelled(L,u1) {
    let len = 0, px = L.p0[0], py = L.p0[1];
    for (let i = 1; i <= 24; i++) {
      const u = u1*i/24;
      const x = bez(L.p0[0],L.c[0],L.p1[0],u), y = bez(L.p0[1],L.c[1],L.p1[1],u);
      len += Math.hypot(x-px,y-py); px = x; py = y;
    }
    return len;
  }
  const chipAt = (x,y,s) => { ctx.beginPath(); ctx.roundRect(x-s/2,y-s/2,s,s,s*.28); ctx.fill(); };

  // --- fracture ----------------------------------------------------------
  // Ice does not break into a hundred tidy planes; it breaks, and the pieces
  // break, down to the grain. Splitting recursively is what gets the cut count
  // up to the real thing instead of a low-poly impression of it.
  const polyArea = p => {
    let a = 0;
    for (let i = 0; i < p.length; i++) { const q = p[(i+1)%p.length]; a += p[i][0]*q[1] - q[0]*p[i][1]; }
    return Math.abs(a)/2;
  };
  const polyMid = p => {
    let x = 0, y = 0;
    p.forEach(q => { x += q[0]; y += q[1]; });
    return [x/p.length, y/p.length];
  };
  // Half-plane clip. Records where the cut crossed the outline so the seam can
  // be drawn as a crack afterwards.
  function clipHalf(poly,nx,ny,d,seam) {
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i+1)%poly.length];
      const da = nx*a[0]+ny*a[1]-d, db = nx*b[0]+ny*b[1]-d;
      if (da <= 0) out.push(a);
      if ((da < 0 && db > 0) || (da > 0 && db < 0)) {
        const t = da/(da-db);
        const p = [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t];
        out.push(p);
        if (seam) seam.push(p);
      }
    }
    return out;
  }
  // Smooth 2D noise off the same hash. Shading cells by where they sit rather
  // than by which wedge they came from is what removes the spokes.
  function fieldAt(x,y,f,salt) {
    const xi = Math.floor(x*f), yi = Math.floor(y*f);
    const u = (t => t*t*(3-2*t))(x*f-xi), v = (t => t*t*(3-2*t))(y*f-yi);
    const h = (a,b) => noise(a*57.3+b*131.7,salt);
    return (h(xi,yi)*(1-u)+h(xi+1,yi)*u)*(1-v) + (h(xi,yi+1)*(1-u)+h(xi+1,yi+1)*u)*v;
  }
  function shatter(poly,seed,cells,seams,grit) {
    const area = polyArea(poly);
    // Stopping early some of the time leaves broad planes next to fine rubble,
    // which is what keeps it from looking like a uniform mosaic.
    if (area < grit || (area < grit*5 && noise(seed,101) < .4) || cells.length > 2800) {
      cells.push(poly); return;
    }
    const mid = polyMid(poly);
    // Cut across whatever the piece is longest along. Cutting at a free angle
    // turns slivers into finer slivers; this breaks them back towards blocks,
    // which is how ice actually fractures.
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    poly.forEach(([x,y]) => { x0 = Math.min(x0,x); x1 = Math.max(x1,x); y0 = Math.min(y0,y); y1 = Math.max(y1,y); });
    const ang = (x1-x0 > y1-y0 ? 0 : Math.PI/2) + (noise(seed,102)-.5)*.95;
    const nx = Math.cos(ang), ny = Math.sin(ang);
    const d = nx*mid[0]+ny*mid[1] + (noise(seed,103)-.5)*Math.sqrt(area)*.5;
    const seam = [];
    const a = clipHalf(poly,nx,ny,d,seam), b = clipHalf(poly,-nx,-ny,-d,null);
    if (a.length < 3 || b.length < 3) { cells.push(poly); return; }
    if (seam.length === 2) seams.push([seam[0],seam[1],area]);
    shatter(a,seed*2+1,cells,seams,grit);
    shatter(b,seed*2+2,cells,seams,grit);
  }

  // Where an element sits in the scene's own coordinates. offsetTop ignores
  // transforms, so a label that is mid-reveal still reports where it belongs.
  // Measured once per layout: reading it every frame would thrash layout.
  let markCache = { key:'', marks:[] };
  function depthMarks(key) {
    if (markCache.key === key) return markCache.marks;
    const marks = depths.map(el => {
      let y = el.offsetHeight/2;
      for (let node = el; node && node !== scene; node = node.offsetParent) y += node.offsetTop;
      return y;
    });
    markCache = { key, marks };
    return marks;
  }

  function drawSnowball(q,mobile,W,H) {
    if (!ctx) return;
    const L = mobile ? SLOPE.narrow : SLOPE.wide;
    // Back the canvas at the size it is actually presented at: the whole scene
    // is transform-scaled to the frame, so device pixels alone are not enough.
    const px = Math.min(3,(devicePixelRatio||1)*Math.max(1,sceneScale));
    if (canvas.width !== Math.round(W*px) || canvas.height !== Math.round(H*px)) {
      canvas.width = Math.round(W*px); canvas.height = Math.round(H*px);
    }
    ctx.setTransform(px,0,0,px,0,0);
    ctx.clearRect(0,0,W,H);

    const style = getComputedStyle(document.documentElement);
    const tone = name => style.getPropertyValue(name).split(',').map(Number);
    const ink = tone('--ink-rgb');
    const lit = ink[0] > 128;
    const shade = lit ? tone('--bg-rgb') : ink;
    // Lavender to amber to coral: a benign signal turning into a liability.
    const hue = q < .5
      ? mixTone(tone('--accent-rgb'),tone('--warm-rgb'),clamp((q-.14)/.22))
      : mixTone(tone('--warm-rgb'),tone('--red-rgb'),clamp((q-.5)/.22));

    const t = Math.pow(q,1.2);
    const r = L.r0 + (L.r1-L.r0)*Math.pow(q,1.7);
    const head = pointAt(L,t);
    const cx = head.x + head.nx*r, cy = head.y + head.ny*r;

    // A low sun behind the ridge. It sets the lighting the ball is shaded by and
    // gives the sky above the slope something to be.
    const sun = ctx.createRadialGradient(W*.72,H*.1,0,W*.72,H*.1,W*.6);
    sun.addColorStop(0,paint(tone('--warm-rgb'),lit ? .085 : .05));
    sun.addColorStop(1,paint(tone('--warm-rgb'),0));
    ctx.fillStyle = sun; ctx.fillRect(0,0,W,H);

    // The hillside itself: a lit plane under the ridge, so the slope has mass
    // instead of being a line in a void.
    tracePath(L,0,1,0,true);
    ctx.lineTo(W+L.tail,H); ctx.lineTo(-L.lead,H); ctx.closePath();
    const ground = ctx.createLinearGradient(0,L.p0[1],0,H);
    ground.addColorStop(0,paint(ink,lit ? .115 : .075)); ground.addColorStop(1,paint(ink,lit ? .022 : .014));
    ctx.fillStyle = ground; ctx.fill();

    const glow = ctx.createRadialGradient(cx,cy,0,cx,cy,r*3.6);
    glow.addColorStop(0,paint(hue,.15)); glow.addColorStop(1,paint(hue,0));
    ctx.fillStyle = glow; ctx.fillRect(0,0,W,H);

    // Grain on the face of the slope: the clean records the error rolls through,
    // laid along the terrain so the plane has substance instead of flat fill.
    for (let i = 0; i < L.grain; i++) {
      const m = pointAt(L,-.06+noise(i,40)*1.12);
      const drop = Math.pow(noise(i,41),1.45)*L.contours[L.contours.length-1]*2.4;
      ctx.save();
      ctx.translate(m.x-m.nx*drop+m.tx*(noise(i,42)-.5)*30, m.y-m.ny*drop+m.ty*(noise(i,42)-.5)*30);
      ctx.rotate(noise(i,43)*TAU);
      ctx.fillStyle = paint(ink,.035+noise(i,44)*.05);
      chipAt(0,0,2.2+noise(i,45)*2.6);
      ctx.restore();
    }

    ctx.lineCap = 'round';
    // Contours falling away downhill. The ones nearest the ridge take the stain
    // where the error has already passed, so the damage spreads down the slope.
    L.contours.forEach((drop,i) => {
      const fade = 1-i/L.contours.length;
      ctx.lineWidth = 1;
      ctx.strokeStyle = paint(ink,.13*fade);
      if (tracePath(L,0,1,drop,true)) ctx.stroke();
      const reach = clamp((t-drop/(L.contours[L.contours.length-1]*1.9))/.3);
      if (reach > 0 && i < 3) {
        ctx.strokeStyle = paint(hue,.22*fade*reach);
        if (tracePath(L,0,t,drop)) ctx.stroke();
      }
    });
    // Ahead of the error the pipeline is an untouched hairline; behind it the
    // slope is gouged open and stained.
    ctx.setLineDash([3,5]); ctx.lineWidth = 1; ctx.strokeStyle = paint(ink,.28);
    if (tracePath(L,t,1,0,t < 1)) ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 1.5+9*t; ctx.strokeStyle = paint(hue,.18);
    if (tracePath(L,0,t)) ctx.stroke();
    ctx.lineWidth = 1.4; ctx.strokeStyle = paint(hue,.55);
    if (tracePath(L,0,t)) ctx.stroke();

    // Ticks sit where the lifecycle rail hands over, so the two read as one.
    [Math.pow(.33,1.2),Math.pow(.68,1.2)].forEach(u => {
      const m = pointAt(L,u);
      const live = t >= u;
      ctx.lineWidth = 1;
      ctx.strokeStyle = live ? paint(hue,.45) : paint(ink,.2);
      ctx.beginPath();
      ctx.moveTo(m.x-m.nx*11,m.y-m.ny*11);
      ctx.lineTo(m.x+m.nx*11,m.y+m.ny*11);
      ctx.stroke();
      ctx.fillStyle = live ? paint(hue,.9) : paint(ink,.34);
      ctx.beginPath(); ctx.arc(m.x,m.y,2.4,0,TAU); ctx.fill();
    });

    // Debris the error knocks loose: anchored to fixed points on the slope so
    // it settles in place rather than sliding as the scrub advances.
    for (let i = 0; i < L.debris; i++) {
      const u = (i+.6)/L.debris*.995;
      if (u > t || noise(i,7) > .22+.78*Math.pow(u,1.25)) continue;
      const m = pointAt(L,u);
      const spread = 5+52*Math.pow(u,1.5);
      const off = (noise(i,8)-.3)*spread, along = (noise(i,9)-.5)*14;
      const age = clamp((t-u)/.05);
      const s = 2.6+noise(i,10)*4.4;
      ctx.save();
      ctx.translate(m.x+m.nx*off+m.tx*along, m.y+m.ny*off+m.ty*along);
      ctx.rotate(noise(i,12)*TAU);
      ctx.fillStyle = noise(i,11) < .5
        ? paint(hue,(.18+noise(i,13)*.4)*age)
        : paint(ink,(.09+noise(i,13)*.13)*age);
      chipAt(0,0,s);
      ctx.restore();
    }

    // Cast shadow, so the mass sits on the slope rather than floating over it.
    // On a dark field that means taking the lit ground away; on a light one, ink.
    ctx.save();
    ctx.translate(head.x+head.tx*r*.3, head.y+head.ty*r*.3);
    ctx.rotate(Math.atan2(head.ty,head.tx));
    ctx.scale(1,.3);
    const cast = ctx.createRadialGradient(0,0,0,0,0,r*1.6);
    cast.addColorStop(0,paint(shade,lit ? .42 : .15)); cast.addColorStop(1,paint(shade,0));
    ctx.fillStyle = cast;
    ctx.beginPath(); ctx.arc(0,0,r*1.6,0,TAU); ctx.fill();
    ctx.restore();

    // Spray thrown off the contact point; it widens with speed and mass.
    for (let i = 0; i < 16; i++) {
      const lift = noise(i,22);
      const back = -(6+noise(i,21)*r*1.5), up = lift*r*1.15;
      const len = (6+noise(i,23)*r*.7)*q;
      const x = head.x+head.tx*back+head.nx*up, y = head.y+head.ty*back+head.ny*up;
      ctx.strokeStyle = paint(ink,.14*(1-lift)*Math.min(1,q*2.5));
      ctx.lineWidth = .8+noise(i,24)*1.4;
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x-head.tx*len,y-head.ty*len); ctx.stroke();
    }

    const body = clamp((q-.02)/.12);
    if (body > 0) {
      ctx.beginPath(); ctx.arc(cx,cy,r,0,TAU);
      ctx.fillStyle = paint(hue,.10*body); ctx.fill();
      ctx.lineWidth = 1.2; ctx.strokeStyle = paint(hue,.34*body); ctx.stroke();
    }

    // The mass itself: every swept-up record is one chip, and the first bad
    // label stays pinned at the core however large the ball gets.
    const count = 1+Math.round(L.chips*Math.pow(q,1.85));
    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(travelled(L,t)/((L.r0+r)/2)*.55);
    for (let i = 0; i < count; i++) {
      const rad = i ? r*Math.sqrt((i+.5)/count)*.92 : 0;
      const ang = i*GOLDEN;
      const s = 5.4+noise(i,3)*2.6;
      ctx.save();
      ctx.translate(Math.cos(ang)*rad+(noise(i,1)-.5)*r*.11, Math.sin(ang)*rad+(noise(i,2)-.5)*r*.11);
      ctx.rotate(noise(i,4)*TAU);
      if (!i) { ctx.fillStyle = paint(hue,.95); chipAt(0,0,Math.max(6.6,s)); }
      else if (noise(i,5) < .6) { ctx.fillStyle = paint(hue,.3+noise(i,6)*.5); chipAt(0,0,s); }
      else { ctx.fillStyle = paint(ink,.11+noise(i,6)*.14); chipAt(0,0,s); }
      ctx.restore();
    }
    ctx.restore();

    // One light source, so the mass reads as a solid rather than a flat patch.
    ctx.save();
    ctx.beginPath(); ctx.arc(cx,cy,r,0,TAU); ctx.clip();
    const form = ctx.createRadialGradient(cx-r*.4,cy-r*.48,r*.5,cx,cy,r*1.35);
    form.addColorStop(0,paint(shade,0)); form.addColorStop(1,paint(shade,lit ? .3 : .18));
    ctx.fillStyle = form; ctx.fillRect(cx-r,cy-r,r*2,r*2);
    ctx.restore();

    // A single ring marks the one example everything else grows from.
    const pulse = 1-clamp(q/.2);
    if (pulse > 0) {
      ctx.lineWidth = 1; ctx.strokeStyle = paint(hue,.45*pulse);
      ctx.beginPath(); ctx.arc(cx,cy,r+13+26*(1-pulse),0,TAU); ctx.stroke();
    }
  }

  // The sea and the ice never change with scroll: only the water level does. So
  // the whole still life is painted once per layout and blitted, which is what
  // makes a few thousand fracture faces affordable on every frame.
  let bergArt = { key:'', canvas:null };

  function paintBerg(W,H,px,L,tone) {
    const off = document.createElement('canvas');
    off.width = Math.round(W*px); off.height = Math.round(H*px);
    const g = off.getContext('2d');
    g.setTransform(px,0,0,px,0,0);

    const ink = tone('--ink-rgb');
    const dark = ink[0] > 128;
    const accent = tone('--accent-rgb');
    const lift = t => mixTone(accent,[255,255,255],t);
    const sink = t => mixTone(accent,[0,0,0],t);
    const iceLit  = lift(dark ? .92 : .95);
    const iceMid  = lift(dark ? .58 : .62);
    const iceDark = lift(dark ? .14 : .34);
    // The sea is a real blue in both themes. The ice has to stay clear of its
    // lightest point or neither reads as what it is.
    const seaLit  = dark ? sink(.62) : sink(.02);
    const seaDeep = dark ? sink(.88) : sink(.36);
    const LIGHT = [-.66,-.75];

    const sea = L.water, floor = L.water + L.mass;
    const frame = ([x,y]) => [
      L.cx + (x-BERG.cx0)*L.sx,
      y < BERG.water0 ? L.water - (BERG.water0-y)/BERG.tip0*L.tip
                      : L.water + (y-BERG.water0)/BERG.mass0*L.mass,
    ];
    const hull = BERG.hull.map(frame);
    const left = Math.min(...hull.map(h => h[0])), right = Math.max(...hull.map(h => h[0]));
    const depthOf = y => clamp((y-sea)/(floor-sea));
    const poly = pts => {
      g.beginPath();
      pts.forEach(([x,y],i) => i ? g.lineTo(x,y) : g.moveTo(x,y));
      g.closePath();
    };
    const slice = (a,b) => {
      const out = [];
      for (let i = a; ; i = (i+1) % hull.length) { out.push(hull[i]); if (i === b) break; }
      return out;
    };
    const tipPts = slice(BERG.seaB,BERG.seaA), massPts = slice(BERG.seaA,BERG.seaB);

    function ice(outline,haze,boost) {
      // Split the long waterline chord so the faces near the surface come out
      // the same scale as the rest.
      const a = outline[outline.length-1], b = outline[0], pts = outline.slice();
      for (let k = 1; k < 5; k++) pts.push([a[0]+(b[0]-a[0])*k/5, a[1]+(b[1]-a[1])*k/5]);
      const mid = polyMid(pts);
      const cells = [], seams = [];
      // Split the whole outline rather than fanning it into wedges first: wedges
      // leave every cell boundary pointing at one centre, which reads as spokes.
      // The crown is concave, but both sections are clipped to their outline, so
      // anything the half-plane clip carries across a notch is trimmed anyway.
      shatter(pts,1,cells,seams,BERG.grit);
      const span = Math.max(40,right-left);
      cells.forEach((cell,i) => {
        const c = polyMid(cell);
        // Broad planes from low-frequency noise, structure from the next octave,
        // grain per cell, over a wash lit from the upper left.
        let shade = .56 - ((c[0]-mid[0])/span)*.62 - ((c[1]-mid[1])/span)*.46;
        shade += (fieldAt(c[0],c[1],.0055,110)-.5)*1.05;
        shade += (fieldAt(c[0],c[1],.022,111)-.5)*.5;
        shade += (noise(i,104)-.5)*.26;
        shade = clamp(shade);
        let tint = mixTone(iceDark,iceLit,shade);
        if (boost) tint = mixTone(tint,iceLit,boost);
        if (haze) tint = mixTone(tint,seaDeep,(dark ? .05 : .03)+(dark ? .42 : .3)*depthOf(c[1]));
        g.fillStyle = paint(tint,1);
        poly(cell); g.fill();
      });
      // Every seam once, weighted by how early the break was: the first splits
      // read as fissures, the last as grain.
      seams.forEach(([p,q,area],i) => {
        const heft = clamp(area/(BERG.grit*260));
        const glint = noise(i,105) < .5;
        g.lineWidth = .45+heft*.8;
        g.strokeStyle = paint(glint ? iceLit : mixTone(iceDark,seaDeep,.45),.09+heft*.2);
        const t0 = noise(i,106)*.3*heft, t1 = 1-noise(i,107)*.34*heft;
        g.beginPath();
        g.moveTo(p[0]+(q[0]-p[0])*t0, p[1]+(q[1]-p[1])*t0);
        g.lineTo(p[0]+(q[0]-p[0])*t1, p[1]+(q[1]-p[1])*t1);
        g.stroke();
      });
      // Catch the light along the outline edges that face it.
      g.lineWidth = 1.3; g.strokeStyle = paint(iceLit,.85);
      for (let i = 0; i < outline.length-1; i++) {
        const u = outline[i], v = outline[i+1];
        const ex = v[0]-u[0], ey = v[1]-u[1], e = Math.hypot(ex,ey) || 1;
        const side = (u[0]+v[0])/2 < mid[0] ? -1 : 1;
        if ((ey/e*side)*LIGHT[0] + (-ex/e*side)*LIGHT[1] < .4) continue;
        g.beginPath(); g.moveTo(u[0],u[1]); g.lineTo(v[0],v[1]); g.stroke();
      }
    }

    // ---- open water -------------------------------------------------------
    const water = g.createLinearGradient(0,sea,0,H);
    water.addColorStop(0,paint(seaLit,1));
    water.addColorStop(1,paint(seaDeep,1));
    g.fillStyle = water; g.fillRect(0,sea,W,H-sea);
    const pool = g.createRadialGradient(L.cx,sea+L.mass*.3,0,L.cx,sea+L.mass*.3,L.mass*1.15);
    pool.addColorStop(0,paint(lift(.3),dark ? .17 : .1)); pool.addColorStop(1,paint(lift(.3),0));
    g.fillStyle = pool; g.fillRect(0,sea,W,H-sea);

    // Shafts of surface light. Nothing else says "this is water" as quickly.
    for (let i = 0; i < 9; i++) {
      const x0 = (noise(i,80)*1.15-.08)*W, wide = 14+noise(i,81)*54, skew = 60+noise(i,82)*130;
      const shaft = g.createLinearGradient(0,sea,0,H);
      shaft.addColorStop(0,paint(iceLit,(dark ? .075 : .055)*(.45+noise(i,83)*.55)));
      shaft.addColorStop(1,paint(iceLit,0));
      g.fillStyle = shaft;
      poly([[x0,sea],[x0+wide,sea],[x0+skew+wide*2.4,H],[x0+skew,H]]); g.fill();
    }

    // ---- the submerged mass ----------------------------------------------
    g.save();
    g.beginPath(); g.rect(0,sea,W,H-sea); g.clip();
    poly(massPts); g.clip();
    ice(massPts,true,0);
    // Air trapped in the ice, thinning with depth.
    for (let i = 0; i < BERG.bubbles; i++) {
      const y = sea + noise(i,71)*(floor-sea);
      if (noise(i,72) > .82-.5*depthOf(y)) continue;
      g.fillStyle = paint(iceLit,(.12+noise(i,74)*.22)*(1-.55*depthOf(y)));
      g.beginPath();
      g.ellipse(left+noise(i,70)*(right-left), y, 1+noise(i,75)*2.2, 1+noise(i,75)*1.7, 0, 0, TAU);
      g.fill();
    }
    g.restore();

    g.save();
    g.beginPath(); g.rect(0,sea,W,H-sea); g.clip();
    g.lineWidth = 1.1; g.strokeStyle = paint(iceLit,.42);
    poly(hull); g.stroke();
    g.restore();

    // ---- surface and the small easy part above it -------------------------
    const sky = g.createLinearGradient(0,0,0,sea);
    sky.addColorStop(0,paint(ink,0)); sky.addColorStop(1,paint(ink,.05));
    g.fillStyle = sky; g.fillRect(0,0,W,sea);
    const skin = g.createLinearGradient(0,sea-3,0,sea+16);
    skin.addColorStop(0,paint(iceLit,.16)); skin.addColorStop(1,paint(iceLit,0));
    g.fillStyle = skin; g.fillRect(0,sea-3,W,19);
    g.lineWidth = 1; g.strokeStyle = paint(iceLit,.34);
    g.beginPath(); g.moveTo(0,sea); g.lineTo(W,sea); g.stroke();

    g.save();
    g.beginPath(); g.rect(0,0,W,sea); g.clip();
    poly(tipPts); g.clip();
    ice(tipPts,false,.26);
    g.restore();
    g.save();
    g.beginPath(); g.rect(0,0,W,sea); g.clip();
    g.lineWidth = 1.1; g.strokeStyle = paint(iceLit,.6);
    poly(tipPts); g.stroke();
    g.restore();

    return { canvas:off, sea, left, seaDeep, iceLit, dark };
  }

  function drawBerg(q,mobile,W,H) {
    const L = mobile ? BERG.narrow : BERG.wide;
    const px = Math.min(3,(devicePixelRatio||1)*Math.max(1,sceneScale));
    if (canvas.width !== Math.round(W*px) || canvas.height !== Math.round(H*px)) {
      canvas.width = Math.round(W*px); canvas.height = Math.round(H*px);
    }
    const style = getComputedStyle(document.documentElement);
    const tone = name => style.getPropertyValue(name).split(',').map(Number);
    const key = W+'x'+H+'x'+Math.round(px*100)+'x'+tone('--ink-rgb').join('');
    if (bergArt.key !== key) bergArt = { key, art: paintBerg(W,H,px,L,tone) };
    const art = bergArt.art;

    ctx.setTransform(px,0,0,px,0,0);
    ctx.clearRect(0,0,W,H);
    ctx.drawImage(art.canvas,0,0,W,H);

    const sea = art.sea;
    const seen = sea + (H-sea)*clamp((q-.12)/.72);
    const marks = depthMarks(W+'x'+H);

    // Fracture bands at the depths the labels call out, and a rule running out
    // from each label to the ice.
    ctx.setLineDash([2,5]); ctx.lineWidth = 1;
    marks.forEach(y => {
      ctx.strokeStyle = paint(art.seaDeep,.42);
      ctx.beginPath(); ctx.moveTo(art.left,y); ctx.lineTo(W-art.left,y); ctx.stroke();
      ctx.strokeStyle = paint(art.iceLit,.2);
      ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(art.left,y); ctx.stroke();
    });
    ctx.setLineDash([]);

    // Cut the lot back to the water level, softly, so the descent has no seam.
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    const cut = ctx.createLinearGradient(0,seen-38,0,seen);
    cut.addColorStop(0,'rgba(0,0,0,0)'); cut.addColorStop(1,'rgba(0,0,0,1)');
    ctx.fillStyle = cut; ctx.fillRect(0,seen-38,W,H-seen+38);
    // Slip the undescended deep in underneath, so the void still reads as sea.
    ctx.globalCompositeOperation = 'destination-over';
    const unlit = ctx.createLinearGradient(0,sea,0,H);
    unlit.addColorStop(0,paint(art.seaDeep,art.dark ? .55 : .8));
    unlit.addColorStop(1,paint(art.seaDeep,art.dark ? .8 : .95));
    ctx.fillStyle = unlit; ctx.fillRect(0,sea,W,H-sea);
    ctx.restore();

    return { seen, marks };
  }

  let progress = parent === window ? 1 : 0;

  function render() {
    const mobile = phone.matches;
    const width = mobile ? 600 : 1047;
    const height = mobile ? 850 : 698;
    const scale = sceneScale = Math.min(innerWidth / width, innerHeight / height);
    scene.style.cssText = `position:absolute;width:${width}px;height:${height}px;transform-origin:top left;transform:scale(${scale});left:${(innerWidth-width*scale)/2}px;top:${(innerHeight-height*scale)/2}px`;
    const p = reduced.matches ? 1 : progress;
    if (world) {
      const { seen, marks } = drawBerg(p,mobile,width,height);
      prompt.style.opacity = 1-clamp(p/.25);
      scene.querySelector('.depth-labels').style.opacity = clamp((p-.18)/.08);
      depths.forEach((el,i) => {
        // A label surfaces as the water level passes the stratum it names.
        const value = clamp((seen-marks[i])/34);
        el.style.opacity = value;
        el.style.transform = `translateY(${(1-value)*14}px)`;
      });
    } else {
      const roll = clamp((p-.1)/.76);
      drawSnowball(roll,mobile,width,height);
      const stage = roll < .33 ? 0 : roll < .68 ? 1 : 2;
      stories.forEach((el,i) => {
        const value = mobile ? Number(i===stage) : i===0 ? 1 : clamp((roll-(i===1?.26:.61))/.07);
        el.style.opacity = value;
        el.style.transform = `translateY(${(1-value)*10}px)`;
      });
      markers.forEach((el,i) => el.classList.toggle('is-current',i===stage));
    }
    scene.dataset.progress = p.toFixed(3);
  }
  scene.addEventListener('data-om-seek-to-time-frame', event => {
    progress = clamp(event.detail.time/10);
    render();
  });
  reduced.addEventListener('change', render);
  phone.addEventListener('change', render);
  addEventListener('resize', render);
  if (parent !== window) {
    const root = document.documentElement;
    const parentRoot = parent.document.documentElement;
    const syncTheme = () => { root.setAttribute('data-theme', parentRoot.getAttribute('data-theme') || 'dark'); render(); };
    new MutationObserver(syncTheme).observe(parentRoot, { attributes: true, attributeFilter: ['data-theme'] });
    syncTheme();
  }
  render();
  scene.dataset.sceneReady = 'true';
})();

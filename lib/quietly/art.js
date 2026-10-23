// Quietly illustration kit: the creature (Nori) and the floating-island world.
// Pure functions that return SVG markup so the same art can be reused in the
// design system page, the screen mocks and the Remotion film.
// Copied from the Quietly project (quietly/design-system/art.js), which stays the source;
// the only change here is the JSDoc on world() so TypeScript knows its options.

export const WORLD = {
  thriving: {
    label: 'Thriving', time: 'Afternoon',
    sky: ['#BFD8CE', '#EEF0D6'], light: '#F7E4A4', haze: '#FFFFFF',
    far: '#A7C2AF', groundTop: '#7FA27B', rim: '#A9C79A', under: ['#56705C', '#2E3F36'],
    leaf: '#4F7A5C', leafLight: '#7DAA7A', trunk: '#6B5847', cap: '#E9C9A0', glow: '#F7E4A4',
    creatureGlow: 0.55, droop: 0, rain: 0, clouds: 0.25, stars: 0, fireflies: 0, sun: 'high',
  },
  gathering: {
    label: 'Gathering', time: 'Late afternoon',
    sky: ['#8E9CA2', '#CACCBF'], light: '#D8D3B8', haze: '#E9E7DD',
    far: '#8C9A94', groundTop: '#6C8269', rim: '#8EA486', under: ['#4B5C51', '#28342E'],
    leaf: '#46624F', leafLight: '#6A8A69', trunk: '#5E4F42', cap: '#CDB89A', glow: '#D8D3B8',
    creatureGlow: 0.3, droop: 0.4, rain: 0.15, clouds: 0.85, stars: 0, fireflies: 0, sun: 'veiled',
  },
  storm: {
    label: 'Rain', time: '6:10 pm',
    sky: ['#121729', '#2A2B47'], light: '#6FD3C6', haze: '#3A3D5E',
    far: '#1F2438', groundTop: '#253733', rim: '#30463F', under: ['#1A2526', '#0D1314'],
    leaf: '#22392F', leafLight: '#2F4A3E', trunk: '#2C2622', cap: '#4F8F88', glow: '#6FD3C6',
    creatureGlow: 0.35, droop: 1, rain: 1, clouds: 1, stars: 0, fireflies: 0, sun: 'none',
  },
  recovery: {
    label: 'Recovery', time: 'First light',
    sky: ['#E9A98F', '#F8DFB0'], light: '#FFD58A', haze: '#FFF1D6',
    far: '#C79C8B', groundTop: '#7E9A6C', rim: '#A9C08A', under: ['#5F6E52', '#33392C'],
    leaf: '#557A55', leafLight: '#8FB47A', trunk: '#6E5442', cap: '#F2B98F', glow: '#FFD58A',
    creatureGlow: 0.6, droop: 0.15, rain: 0, clouds: 0.35, stars: 0, fireflies: 0, sun: 'dawn',
  },
  mist: {
    label: 'Waking', time: 'Morning',
    sky: ['#C9D6D2', '#EEF1EA'], light: '#F3EBD2', haze: '#F7F8F4',
    far: '#B9C9C1', groundTop: '#86A486', rim: '#AFC8A6', under: ['#5C7563', '#33433A'],
    leaf: '#55806A', leafLight: '#86AE8A', trunk: '#6E5C4B', cap: '#E6D2B2', glow: '#F3EBD2',
    creatureGlow: 0.4, droop: 0.05, rain: 0, clouds: 0.6, stars: 0, fireflies: 0, sun: 'veiled',
  },
  milestone: {
    label: 'Milestone', time: 'Seventh quiet evening',
    sky: ['#0C1F1D', '#1E3D35'], light: '#8EF0D6', haze: '#2C5A4C',
    far: '#16302A', groundTop: '#24493B', rim: '#2F5E4B', under: ['#183128', '#0A1512'],
    leaf: '#22513F', leafLight: '#2F6E55', trunk: '#2E2A24', cap: '#8EF0D6', glow: '#8EF0D6',
    creatureGlow: 1, droop: 0, rain: 0, clouds: 0, stars: 1, fireflies: 1, sun: 'moon',
  },
};

let uid = 0;
const id = (p) => `${p}${++uid}`;

const leafPath = 'M0 0 C7 -9 24 -11 33 -4 C24 3 9 5 0 0 Z';

// ---------- Nori, the creature ----------
// moods: idle, playful, concerned, hiding, celebrating, sleeping
export function nori({ mood = 'idle', glow = '#F7E4A4', glowAmt = 0.6, night = false } = {}) {
  const g = id('m');
  const fr = {
    idle: [-34, -4, 26], playful: [-52, -18, 16], concerned: [8, 32, 56],
    hiding: [-20, 6, 30], celebrating: [-70, -40, -12], sleeping: [14, 34, 54],
  }[mood];
  const ear = { idle: 0, playful: -6, concerned: 14, hiding: 6, celebrating: -8, sleeping: 18 }[mood];
  const tilt = { idle: 0, playful: -7, concerned: 3, hiding: 0, celebrating: 0, sleeping: 4 }[mood];
  const lift = { idle: 0, playful: -4, concerned: 4, hiding: 30, celebrating: -14, sleeping: 8 }[mood];
  const bodyTop = night ? '#C9D6C6' : '#E6EDDC';
  const bodyBot = night ? '#8FA88F' : '#B4CBAE';

  const fronds = (side) => fr.map((r, i) => `
      <path d="${leafPath}" fill="url(#${g}f)" transform="translate(${side < 0 ? 54 : 146} ${100 + i * 9}) rotate(${side < 0 ? 180 - r : r}) scale(1.05)"/>`).join('');

  let eyes;
  if (mood === 'celebrating') {
    eyes = `<path d="M75 113 Q82 103 89 113" fill="none" stroke="#1B2622" stroke-width="4" stroke-linecap="round"/>
            <path d="M111 113 Q118 103 125 113" fill="none" stroke="#1B2622" stroke-width="4" stroke-linecap="round"/>`;
  } else if (mood === 'sleeping') {
    eyes = `<path d="M75 111 Q82 117 89 111" fill="none" stroke="#1B2622" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M111 111 Q118 117 125 111" fill="none" stroke="#1B2622" stroke-width="3.5" stroke-linecap="round"/>`;
  } else {
    const look = mood === 'concerned' ? -3 : mood === 'hiding' ? 2 : 0;
    const big = mood === 'playful' ? 1.12 : 1;
    eyes = [82, 118].map((x) => `
      <g transform="translate(${x + look} 111) scale(${big})">
        <ellipse rx="7.5" ry="9.5" fill="#1B2622"/>
        <circle cx="-2.4" cy="-3.6" r="2.7" fill="#FFFFFF"/>
        <circle cx="2.6" cy="3" r="1.1" fill="#FFFFFF" opacity=".7"/>
      </g>`).join('');
    if (mood === 'concerned') {
      eyes += `<path d="M72 99 L86 94" stroke="#55705C" stroke-width="3" stroke-linecap="round"/>
               <path d="M128 99 L114 94" stroke="#55705C" stroke-width="3" stroke-linecap="round"/>`;
    }
  }
  const mouth = {
    idle: 'M95 125 Q100 129 105 125', playful: 'M94 124 Q100 132 106 124',
    concerned: 'M95 128 Q100 125 105 128', hiding: 'M96 126 Q100 128 104 126',
    celebrating: 'M93 123 Q100 134 107 123', sleeping: 'M97 126 Q100 127 103 126',
  }[mood];

  const sparkles = mood === 'celebrating' ? [[34, 54, 1], [168, 44, 1.3], [178, 98, 0.8], [24, 112, 0.7]]
    .map(([x, y, s]) => `<path d="M0 -9 C1 -2 2 -1 9 0 C2 1 1 2 0 9 C-1 2 -2 1 -9 0 C-2 -1 -1 -2 0 -9Z" fill="${glow}" transform="translate(${x} ${y}) scale(${s})"/>`).join('') : '';

  const body = `
    <g class="n-body" transform="rotate(${tilt} 100 170) translate(0 ${lift})">
      <g class="n-tail"><path d="M134 152 C166 160 186 132 172 104 C166 122 152 134 132 136 Z" fill="url(#${g}b)"/>
      <path d="M172 104 C178 116 176 128 168 136 C166 124 166 114 172 104 Z" fill="#EEF3E6" opacity=".85"/></g>
      <g transform="rotate(${-ear} 70 84)">
        <path d="M62 92 C56 72 56 56 60 42 C72 50 84 62 90 76 Z" fill="url(#${g}b)"/>
        <path d="M64 78 C62 66 62 58 63 50 C70 56 76 62 80 70 Z" fill="#6F907A"/>
      </g>
      <g transform="rotate(${ear} 130 84)">
        <path d="M138 92 C144 72 144 56 140 42 C128 50 116 62 110 76 Z" fill="url(#${g}b)"/>
        <path d="M136 78 C138 66 138 58 137 50 C130 56 124 62 120 70 Z" fill="#6F907A"/>
      </g>
      <g class="n-fronds-l">${fronds(-1)}</g><g class="n-fronds-r">${fronds(1)}</g>
      <ellipse cx="100" cy="122" rx="52" ry="49" fill="url(#${g}b)"/>
      <ellipse cx="100" cy="146" rx="31" ry="23" fill="#F4F6EC" opacity=".55"/>
      <circle class="n-glow" cx="100" cy="146" r="26" fill="url(#${g}h)" opacity="${glowAmt}"/>
      <circle cx="100" cy="146" r="6.5" fill="${glow}" opacity="${0.35 + glowAmt * 0.65}"/>
      <ellipse cx="68" cy="127" rx="7.5" ry="4.2" fill="#E7A68C" opacity=".38"/>
      <ellipse cx="132" cy="127" rx="7.5" ry="4.2" fill="#E7A68C" opacity=".38"/>
      <g class="n-eyes">${eyes}</g>
      <path d="${mouth}" fill="none" stroke="#1B2622" stroke-width="2.6" stroke-linecap="round"/>
      <ellipse cx="84" cy="168" rx="11" ry="5.5" fill="${bodyBot}"/>
      <ellipse cx="116" cy="168" rx="11" ry="5.5" fill="${bodyBot}"/>
    </g>`;

  const cover = mood === 'hiding' ? `
    <circle cx="100" cy="160" r="50" fill="url(#${g}h)" opacity=".9"/>
    <path d="M6 166 C40 140 160 136 198 162 C178 188 122 200 98 200 C60 200 24 190 6 166 Z" fill="#3E6650"/>
    <path d="M10 166 C60 154 140 150 196 163" fill="none" stroke="#5E8A6B" stroke-width="3" stroke-linecap="round"/>
    <path d="M100 156 L102 198" stroke="#2F523F" stroke-width="2.5" stroke-linecap="round"/>` : '';

  return `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Nori, ${mood}">
    <defs>
      <linearGradient id="${g}b" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${bodyTop}"/><stop offset="1" stop-color="${bodyBot}"/>
      </linearGradient>
      <linearGradient id="${g}f" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#6F907A"/><stop offset="1" stop-color="#8FDCCB"/>
      </linearGradient>
      <radialGradient id="${g}h">
        <stop offset="0" stop-color="${glow}" stop-opacity=".9"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="100" cy="176" rx="46" ry="6" fill="#0E1714" opacity="${mood === 'hiding' ? 0 : 0.18}"/>
    ${body}${cover}${sparkles}
  </svg>`;
}

// ---------- The world ----------
// A floating island diorama. w x h is a phone viewport (390 x 844 by default).
// Seeded random so every render of a state is identical, but nothing sits on a visible grid.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const mix = (a, b, k) => {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0')).join('')}`;
};

// A floating island over a misty valley. Lit by one source, with haze for depth and a fine grain.
// sunAt: [x, y] as fractions of the frame, or false to hide the sun or moon.
/**
 * @param {keyof typeof WORLD} [state]
 * @param {{ mood?: string, w?: number, h?: number, creature?: boolean, islandY?: number, islandX?: number,
 *   size?: number, sky?: boolean, sunAt?: [number, number] | false, overrides?: Record<string, unknown> }} [opts]
 */
export function world(state = 'thriving', { mood, w = 390, h = 844, creature = true, islandY, islandX, size = 1, sky = true, sunAt, overrides } = {}) {
  const p = overrides ? { ...WORLD[state], ...overrides } : WORLD[state];
  const g = id('w');
  const r = rng(state.length * 7919 + w * 31 + h);
  const wx = islandX ?? w / 2;
  const wy = islandY ?? h * 0.6;
  const cx = 0;
  const iy = 0;
  const rx = 164;
  const droop = p.droop;
  const skyMid = mix(p.sky[0], p.sky[1], 0.55);
  const haze = mix(p.sky[1], p.haze, 0.35);

  // Sun or moon: small, crisp, with a restrained halo
  const sunDefault = { high: [0.8, 0.3], veiled: [0.76, 0.31], dawn: [0.26, 0.47], moon: [0.82, 0.28], none: null }[p.sun];
  const at = sunAt === false ? null : (sunAt ?? sunDefault);
  const sunR = { high: 26, veiled: 22, dawn: 40, moon: 13, none: 0 }[p.sun];
  const sun = at ? `
    <circle cx="${w * at[0]}" cy="${h * at[1]}" r="${sunR * 5}" fill="url(#${g}sun)" opacity="${p.sun === 'veiled' ? 0.45 : 0.7}"/>
    <circle cx="${w * at[0]}" cy="${h * at[1]}" r="${sunR}" fill="${p.sun === 'moon' ? '#E6F2EA' : p.light}" opacity="${p.sun === 'veiled' ? 0.75 : 1}"/>` : '';

  // Stars: mostly faint, a few bright, thinning toward the horizon
  const stars = p.stars ? Array.from({ length: 70 }, () => {
    const y = Math.pow(r(), 1.6) * h * 0.5;
    const big = r() > 0.93;
    return `<circle cx="${(r() * w).toFixed(1)}" cy="${y.toFixed(1)}" r="${big ? 1.3 : 0.4 + r() * 0.5}" fill="#EAF4EE" opacity="${(big ? 0.85 : 0.2 + r() * 0.4).toFixed(2)}"/>`;
  }).join('') : '';

  // Clouds: long flat bands, softened, layered like stratus rather than cartoon puffs
  const band = (y, len, thick, o, dx = 0) => {
    const x0 = dx + r() * w * 0.2 - w * 0.25;
    const pts = Array.from({ length: 7 }, (_, i) => [x0 + (len / 6) * i, y - thick * (0.3 + r() * 0.7) * Math.sin((i / 6) * Math.PI)]);
    const top = pts.map(([x, yy], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${yy.toFixed(1)}`).join(' ');
    return `<path d="${top} L${(x0 + len).toFixed(1)} ${y + thick * 0.25} L${x0.toFixed(1)} ${y + thick * 0.25} Z" fill="${p.haze}" opacity="${o.toFixed(2)}" filter="url(#${g}blur3)"/>`;
  };
  const clouds = p.clouds ? [
    band(h * 0.09, w * 0.9, 34, 0.5 * p.clouds, w * 0.1),
    band(h * 0.17, w * 0.7, 22, 0.35 * p.clouds, w * 0.45),
    band(h * 0.27, w * 0.8, 26, 0.3 * p.clouds, -w * 0.1),
    p.clouds > 0.8 ? band(h * 0.04, w * 1.4, 70, 0.75 * p.clouds, 0) : '',
  ].join('') : '';

  // Distant valley: two ridgelines of treetops dissolving into haze
  const ridge = (y0, amp, step, fill, o) => {
    let d = `M0 ${h}`; let x = 0;
    while (x <= w + step) {
      const y = y0 - amp * (0.4 + 0.6 * r()) - (r() > 0.7 ? amp * 0.6 : 0);
      d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
      x += step * (0.6 + r() * 0.8);
    }
    return `<path d="${d} L${w} ${h} Z" fill="${fill}" opacity="${o}"/>`;
  };
  const valley = `
    <rect x="0" y="${h * 0.66}" width="${w}" height="${h * 0.34}" fill="url(#${g}mist)"/>
    ${ridge(h * 0.86, 18, 9, mix(p.far, p.sky[1], 0.45), 0.7)}
    ${ridge(h * 0.93, 22, 8, mix(p.far, p.under[1], 0.35), 0.85)}
    <rect x="0" y="${h * 0.8}" width="${w}" height="${h * 0.2}" fill="url(#${g}low)"/>`;

  // Far islets: small, flat-topped, slightly out of focus
  const islet = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${mix(p.far, p.sky[1], 0.25)}" filter="url(#${g}blur1)">
      <path d="M-26 0 C-18 -5 18 -5 26 0 C18 10 8 26 0 30 C-8 24 -18 10 -26 0 Z"/><path d="M-8 -3 l3 -9 l3 7 l3 -6 l2 8 Z"/></g>`;
  const islets = islet(w * 0.12, h * 0.45, 0.8) + islet(w * 0.88, h * 0.37, 0.55);

  const plant = (x, y, s, flip = 1) => `
    <g transform="translate(${x} ${y}) scale(${s * flip} ${s}) rotate(${droop * 18})">
      <path d="M0 0 C-4 -30 -2 -52 6 -70" stroke="${p.leaf}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="${leafPath}" fill="${p.leafLight}" transform="translate(4 -66) rotate(${-70 + droop * 50}) scale(1.4)"/>
      <path d="${leafPath}" fill="${p.leaf}" transform="translate(1 -40) rotate(${-150 + droop * 30}) scale(1.6)"/>
      <path d="${leafPath}" fill="${p.leafLight}" transform="translate(-1 -22) rotate(${-20 + droop * 40}) scale(1.3)"/>
    </g>`;

  const tree = (x, y, s) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M-5 0 C-4 -30 -6 -50 -2 -70 L4 -70 C6 -48 5 -28 6 0 Z" fill="${p.trunk}"/>
      <g transform="rotate(${droop * 4})">
        <circle cx="0" cy="-98" r="40" fill="${p.leaf}"/>
        <circle cx="-30" cy="-76" r="28" fill="${p.leaf}"/>
        <circle cx="30" cy="-80" r="30" fill="${p.leaf}"/>
        <circle cx="-8" cy="-112" r="26" fill="${p.leafLight}" opacity=".5"/>
        <circle cx="24" cy="-98" r="15" fill="${p.leafLight}" opacity=".35"/>
        <path d="M-40 -70 C-20 -60 20 -60 40 -74" fill="none" stroke="${p.under[1]}" stroke-width="10" opacity=".18" stroke-linecap="round"/>
      </g>
    </g>`;

  const mushroom = (x, y, s) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      ${state === 'storm' || state === 'milestone' ? `<circle cx="0" cy="-15" r="16" fill="url(#${g}glow)"/>` : ''}
      <path d="M-3 0 L-2 -14 L2 -14 L3 0 Z" fill="#E9E2D0"/>
      <path d="M-14 -13 C-12 -26 12 -26 14 -13 Z" fill="${p.cap}"/>
    </g>`;

  const tufts = Array.from({ length: 11 }, (_, i) => {
    const x = cx - rx * 0.88 + i * (rx * 1.76 / 10) + (r() - 0.5) * 8;
    const y = iy - 4 + Math.sin(i * 1.7) * 5;
    const s = 0.7 + r() * 0.6;
    return `<path d="M${x} ${y} l${-4 * s} ${-12 * s} l${4 * s} ${6 * s} l${3 * s} ${-14 * s} l${2 * s} ${14 * s} l${5 * s} ${-9 * s} l${-3 * s} ${15 * s}Z" fill="${p.rim}" opacity="${(0.7 + r() * 0.3).toFixed(2)}"/>`;
  }).join('');

  // Underside: three strata with ragged edges, and a couple of hanging moss strands
  const strata = (y0, depth, inset, fill, o) => {
    const n = 9; let d = '';
    for (let i = 0; i <= n; i++) {
      const t = i / n; const x = -rx * (1 - inset) + t * rx * 2 * (1 - inset);
      const yy = y0 + depth * Math.sin(t * Math.PI) * (0.75 + r() * 0.5);
      d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${yy.toFixed(1)} `;
    }
    return `<path d="M${-rx * (1 - inset)} ${y0 - 6} ${d.slice(1)} L${rx * (1 - inset)} ${y0 - 6} Z" fill="${fill}" opacity="${o}"/>`;
  };
  const moss = [-0.55, 0.3].map((k) => {
    const x = rx * k; const len = 40 + r() * 50;
    return `<path d="M${x} 24 C${x + 4} ${24 + len * 0.4} ${x - 4} ${24 + len * 0.7} ${x + 1} ${24 + len}" stroke="${p.leaf}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".55"/>`;
  }).join('');

  const fireflies = p.fireflies ? Array.from({ length: 11 }, () => {
    const x = wx + (r() - 0.5) * rx * size * 2.3;
    const y = wy - (12 + Math.pow(r(), 1.4) * 170) * size;
    const s = 0.8 + r() * 1.4;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(s * 8).toFixed(1)}" fill="url(#${g}ff)" opacity="${(0.4 + r() * 0.6).toFixed(2)}"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${s.toFixed(2)}" fill="#F6D88C"/>`;
  }).join('') : '';

  const rain = p.rain ? Array.from({ length: Math.round(80 * p.rain) + 10 }, () => {
    const x = r() * (w + 80) - 40; const y = r() * h; const len = 10 + r() * 22;
    return `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x - len * 0.26).toFixed(1)}" y2="${(y + len).toFixed(1)}" stroke="#C3CEEA" stroke-width="${(0.8 + r() * 0.7).toFixed(2)}" opacity="${(0.12 + r() * 0.22).toFixed(2)}" stroke-linecap="round"/>`;
  }).join('') : '';

  const m = mood ?? { thriving: 'playful', gathering: 'concerned', storm: 'hiding', recovery: 'celebrating', milestone: 'idle', mist: 'idle' }[state];
  const cs = 0.82;
  const critter = creature ? `
    <g transform="translate(${cx + 16 - 100 * cs} ${iy + 4 - 172 * cs}) scale(${cs})">
      ${nori({ mood: m, glow: p.glow, glowAmt: p.creatureGlow, night: ['storm', 'milestone'].includes(state) }).replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}
    </g>` : '';

  // Light direction: the lit side of the island faces the sun or moon
  const lit = at ? (at[0] > 0.5 ? 1 : 0) : 0.5;

  return `
  <svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label="The grove, ${p.label.toLowerCase()}">
    <defs>
      <linearGradient id="${g}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[0]}"/><stop offset=".55" stop-color="${skyMid}"/><stop offset="1" stop-color="${p.sky[1]}"/></linearGradient>
      <radialGradient id="${g}sun"><stop offset="0" stop-color="${p.light}" stop-opacity=".55"/><stop offset=".35" stop-color="${p.light}" stop-opacity=".16"/><stop offset="1" stop-color="${p.light}" stop-opacity="0"/></radialGradient>
      <radialGradient id="${g}glow"><stop offset="0" stop-color="${p.glow}" stop-opacity=".5"/><stop offset="1" stop-color="${p.glow}" stop-opacity="0"/></radialGradient>
      <radialGradient id="${g}ff"><stop offset="0" stop-color="#F6D88C" stop-opacity=".45"/><stop offset="1" stop-color="#F6D88C" stop-opacity="0"/></radialGradient>
      <linearGradient id="${g}under" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.under[0]}"/><stop offset="1" stop-color="${p.under[1]}"/></linearGradient>
      <linearGradient id="${g}top" x1="${lit}" y1="0" x2="${1 - lit}" y2="1"><stop offset="0" stop-color="${mix(p.groundTop, p.light, 0.22)}"/><stop offset="1" stop-color="${mix(p.groundTop, p.under[1], 0.2)}"/></linearGradient>
      <linearGradient id="${g}mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${haze}" stop-opacity="0"/><stop offset=".6" stop-color="${haze}" stop-opacity=".35"/><stop offset="1" stop-color="${haze}" stop-opacity=".1"/></linearGradient>
      <linearGradient id="${g}low" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[1]}" stop-opacity="0"/><stop offset="1" stop-color="${mix(p.under[1], p.sky[1], 0.3)}" stop-opacity=".65"/></linearGradient>
      <filter id="${g}blur1" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.2"/></filter>
      <filter id="${g}blur3" x="-10%" y="-60%" width="120%" height="220%"><feGaussianBlur stdDeviation="3.5"/></filter>
      <filter id="${g}grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${state.length}" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".5"/></feComponentTransfer></filter>
    </defs>
    ${sky ? `<rect width="${w}" height="${h}" fill="url(#${g}sky)"/>` : ''}
    ${stars}${sun}${clouds}${sky ? valley : ''}${islets}
    <ellipse cx="${wx}" cy="${wy + 260 * size}" rx="${rx * 0.9 * size}" ry="${14 * size}" fill="${p.under[1]}" opacity=".18" filter="url(#${g}blur3)"/>
    <g transform="translate(${wx} ${wy}) scale(${size})">
      <path d="M${-rx} 0 C${-rx * 0.92} 70 ${-rx * 0.62} 120 ${-rx * 0.42} 168 L${-rx * 0.3} 158 C${-rx * 0.2} 200 ${-rx * 0.08} 224 ${rx * 0.04} 246 L${rx * 0.14} 214 C${rx * 0.3} 196 ${rx * 0.5} 150 ${rx * 0.62} 132 L${rx * 0.7} 140 C${rx * 0.84} 96 ${rx * 0.96} 50 ${rx} 0 Z" fill="url(#${g}under)"/>
      ${strata(26, 40, 0.02, p.under[0], 0.9)}
      ${strata(70, 60, 0.18, mix(p.under[0], p.under[1], 0.45), 0.55)}
      ${strata(130, 70, 0.4, p.under[1], 0.45)}
      <path d="M${-rx * 0.98} 14 C${-rx * 0.6} 40 ${rx * 0.6} 40 ${rx * 0.98} 14" fill="none" stroke="${mix(p.under[0], p.light, 0.15)}" stroke-width="2" opacity=".5"/>
      ${moss}
      <ellipse cx="0" cy="0" rx="${rx}" ry="${rx * 0.22}" fill="url(#${g}top)"/>
      <path d="M${-rx} 0 C${-rx * 0.6} ${rx * 0.26} ${rx * 0.6} ${rx * 0.26} ${rx} 0" fill="none" stroke="${p.rim}" stroke-width="3" opacity=".75"/>
      <path d="M${-rx * 0.95} -6 C${-rx * 0.5} ${-rx * 0.21} ${rx * 0.5} ${-rx * 0.21} ${rx * 0.95} -6" fill="none" stroke="${mix(p.groundTop, p.light, 0.4)}" stroke-width="1.5" opacity=".35"/>
      ${tree(-rx * 0.5, -4, 1.05)}
      ${plant(rx * 0.62, 4, 1.1, -1)}
      ${plant(-rx * 0.12, 10, 0.7)}
      ${mushroom(rx * 0.36, 8, 1.2)}
      ${mushroom(rx * 0.46, 14, 0.8)}
      ${tufts}
      ${critter}
    </g>
    ${fireflies}${rain}
    <rect width="${w}" height="${h}" filter="url(#${g}grain)" opacity=".07" style="mix-blend-mode:overlay"/>
  </svg>`;
}

// ---------- Seed (onboarding, before Nori hatches) ----------
export function seed({ glow = '#8EF0D6', crack = 0 } = {}) {
  const g = id('s');
  const split = crack ? `<path d="M100 70 L95 92 L104 104 L97 124" fill="none" stroke="${glow}" stroke-width="${2 + crack * 2}" stroke-linecap="round" stroke-linejoin="round" opacity="${0.5 + crack * 0.5}"/>` : '';
  return `
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A glowing seed">
    <defs>
      <radialGradient id="${g}h"><stop offset="0" stop-color="${glow}" stop-opacity=".7"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient>
      <linearGradient id="${g}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DCE6D3"/><stop offset="1" stop-color="#8FA88F"/></linearGradient>
    </defs>
    <circle cx="100" cy="118" r="70" fill="url(#${g}h)" opacity=".55"/>
    <path d="M100 48 C134 52 150 96 146 128 C142 156 122 170 100 170 C78 170 58 156 54 128 C50 96 66 52 100 48 Z" fill="url(#${g}b)"/>
    <path d="M100 48 C110 36 124 30 136 32 C128 42 116 48 100 48 Z" fill="#6F907A"/>
    <path d="M70 92 C76 78 86 68 98 64" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity=".45"/>
    ${split}
    <ellipse cx="100" cy="176" rx="40" ry="5" fill="#0E1714" opacity=".22"/>
  </svg>`;
}

// ---------- App icon (1024 x 1024, iOS applies the corner mask) ----------
export function appIcon() {
  const g = id('i');
  const face = nori({ mood: 'idle', glow: '#8EF0D6', glowAmt: 0.95, night: true })
    .replace(/^\s*<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  return `
  <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Quietly app icon">
    <defs>
      <linearGradient id="${g}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16332C"/><stop offset="1" stop-color="#0A1714"/></linearGradient>
      <radialGradient id="${g}gl" cx=".5" cy=".62"><stop offset="0" stop-color="#8EF0D6" stop-opacity=".42"/><stop offset="1" stop-color="#8EF0D6" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="1024" height="1024" fill="url(#${g}bg)"/>
    <circle cx="512" cy="600" r="420" fill="url(#${g}gl)"/>
    ${[[180, 210, 3], [300, 140, 2], [770, 190, 3], [860, 320, 2], [640, 120, 2]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r * 3}" fill="#F2C46B" opacity=".85"/>`).join('')}
    <ellipse cx="512" cy="820" rx="360" ry="70" fill="#24493B"/>
    <g transform="translate(212 254) scale(3)">${face}</g>
  </svg>`;
}

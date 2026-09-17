/* =========================================================
   TW Medical — Static catalogue data
   Product imagery is generated as inline SVG illustrations so
   the demo never has broken images and works fully offline.
   ========================================================= */

/* ---------- SVG illustration generator ---------- */
const MedArt = (() => {
  const BGS = [
    ['#EAF3FF', '#F7FBFF'],
    ['#E8F8F4', '#F6FDFB'],
    ['#F1F0FF', '#FAFAFF'],
    ['#FFF4E8', '#FFFBF6'],
    ['#EEF4F7', '#FAFCFD'],
    ['#FDEFF2', '#FFF9FA']
  ];

  // Each drawer returns SVG markup centred on (200,200) within a 400x400 canvas.
  const draw = {
    bandage: (c) => `
      <ellipse cx="200" cy="292" rx="120" ry="16" fill="#0F1B2D" opacity=".08"/>
      <rect x="95" y="120" width="210" height="160" rx="14" fill="${c}"/>
      <ellipse cx="95" cy="200" rx="34" ry="80" fill="${shade(c, -18)}"/>
      <ellipse cx="95" cy="200" rx="14" ry="34" fill="#fff" opacity=".9"/>
      ${[140, 170, 200, 230, 260].map(y => `<path d="M112 ${y} H300" stroke="#fff" stroke-opacity=".35" stroke-width="3"/>`).join('')}
      <path d="M300 130 L345 150 L345 270 L300 280 Z" fill="${shade(c, 10)}"/>
      <rect x="170" y="182" width="80" height="36" rx="6" fill="#fff" opacity=".85"/>
      <rect x="182" y="196" width="56" height="8" rx="4" fill="${shade(c, -25)}"/>`,
    adhesive: (c) => `
      <ellipse cx="200" cy="300" rx="130" ry="14" fill="#0F1B2D" opacity=".07"/>
      <g transform="rotate(-18 200 200)">
        <rect x="60" y="160" width="280" height="84" rx="42" fill="${c}"/>
        <rect x="160" y="170" width="80" height="64" rx="12" fill="#fff" opacity=".9"/>
        <rect x="170" y="180" width="60" height="44" rx="8" fill="${shade(c, 25)}" opacity=".6"/>
        ${[85, 105, 125, 275, 295, 315].map(x => `<circle cx="${x}" cy="190" r="3.5" fill="#fff" opacity=".6"/><circle cx="${x}" cy="214" r="3.5" fill="#fff" opacity=".6"/>`).join('')}
      </g>`,
    tape: (c) => `
      <ellipse cx="200" cy="305" rx="120" ry="14" fill="#0F1B2D" opacity=".08"/>
      <path d="M280 250 L350 300 L335 318 L268 270 Z" fill="${c}" opacity=".85"/>
      <circle cx="195" cy="195" r="105" fill="${c}"/>
      <circle cx="195" cy="195" r="92" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3"/>
      <circle cx="195" cy="195" r="78" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>
      <circle cx="195" cy="195" r="52" fill="#D9E3EC"/>
      <circle cx="195" cy="195" r="44" fill="#fff"/>`,
    gauze: (c) => `
      <ellipse cx="200" cy="300" rx="125" ry="14" fill="#0F1B2D" opacity=".07"/>
      ${[0, 1, 2].map(i => `
      <g transform="translate(${-i * 14} ${-i * 22})">
        <rect x="110" y="170" width="190" height="120" rx="10" fill="#fff" stroke="${shade(c, -10)}" stroke-width="2"/>
        ${[130, 150, 170, 190, 210, 230, 250, 270].map(x => `<path d="M${x} 176 V284" stroke="${c}" stroke-opacity=".35"/>`).join('')}
        ${[190, 210, 230, 250, 270].map(y => `<path d="M116 ${y} H294" stroke="${c}" stroke-opacity=".35"/>`).join('')}
      </g>`).join('')}`,
    syringe: (c) => `
      <ellipse cx="200" cy="300" rx="140" ry="12" fill="#0F1B2D" opacity=".07"/>
      <g transform="rotate(-30 200 200)">
        <rect x="40" y="186" width="30" height="28" rx="4" fill="${shade(c, -20)}"/>
        <rect x="68" y="196" width="60" height="8" fill="#B8C4D0"/>
        <rect x="120" y="172" width="16" height="56" rx="3" fill="#8FA1B3"/>
        <rect x="134" y="176" width="150" height="48" rx="6" fill="#fff" stroke="#AFC0D0" stroke-width="3"/>
        <rect x="190" y="180" width="92" height="40" rx="4" fill="${c}" opacity=".55"/>
        ${[160, 180, 200, 220, 240, 260].map(x => `<path d="M${x} 176 V192" stroke="#7B8DA0" stroke-width="2"/>`).join('')}
        <path d="M284 190 L304 194 V206 L284 210 Z" fill="#AFC0D0"/>
        <rect x="304" y="198" width="72" height="4" rx="2" fill="#9AA8B6"/>
      </g>`,
    insulin: (c) => `
      <ellipse cx="200" cy="300" rx="140" ry="12" fill="#0F1B2D" opacity=".07"/>
      <g transform="rotate(-25 200 200)">
        <rect x="60" y="178" width="230" height="44" rx="22" fill="${c}"/>
        <rect x="150" y="186" width="70" height="28" rx="6" fill="#fff" opacity=".85"/>
        <rect x="160" y="195" width="30" height="10" rx="2" fill="${shade(c, -20)}"/>
        <rect x="40" y="186" width="30" height="28" rx="8" fill="${shade(c, -25)}"/>
        <path d="M290 186 L318 192 V208 L290 214 Z" fill="#C7D3DE"/>
        <rect x="318" y="198" width="44" height="4" rx="2" fill="#9AA8B6"/>
      </g>`,
    glucometer: (c) => `
      <ellipse cx="200" cy="320" rx="100" ry="12" fill="#0F1B2D" opacity=".08"/>
      <rect x="120" y="80" width="160" height="230" rx="40" fill="${c}"/>
      <rect x="140" y="105" width="120" height="90" rx="12" fill="#DDF4EC"/>
      <text x="200" y="158" text-anchor="middle" font-family="Arial" font-weight="700" font-size="38" fill="#0F1B2D">112</text>
      <text x="200" y="181" text-anchor="middle" font-family="Arial" font-size="13" fill="#40505F">mg/dL</text>
      <circle cx="200" cy="240" r="26" fill="#fff" opacity=".9"/>
      <circle cx="200" cy="240" r="15" fill="${shade(c, -18)}"/>
      <rect x="185" y="300" width="30" height="46" rx="3" fill="#F4F7FA" stroke="#C9D4DE"/>
      <rect x="192" y="330" width="16" height="8" fill="#E9A23B"/>`,
    strips: (c) => `
      <ellipse cx="200" cy="320" rx="90" ry="12" fill="#0F1B2D" opacity=".08"/>
      <rect x="140" y="70" width="120" height="40" rx="10" fill="${shade(c, -20)}"/>
      <rect x="150" y="104" width="100" height="215" rx="16" fill="${c}"/>
      <rect x="160" y="160" width="80" height="100" rx="8" fill="#fff"/>
      <rect x="170" y="175" width="60" height="10" rx="3" fill="${c}"/>
      <rect x="170" y="195" width="45" height="6" rx="3" fill="#B7C3CE"/>
      <rect x="170" y="208" width="52" height="6" rx="3" fill="#B7C3CE"/>
      <text x="200" y="245" text-anchor="middle" font-family="Arial" font-weight="700" font-size="18" fill="#0F1B2D">50</text>
      <rect x="275" y="150" width="22" height="120" rx="3" fill="#fff" stroke="#C9D4DE" transform="rotate(12 286 210)"/>
      <rect x="279" y="240" width="14" height="14" fill="#E9A23B" transform="rotate(12 286 210)"/>`,
    lancet: (c) => `
      <ellipse cx="200" cy="300" rx="120" ry="12" fill="#0F1B2D" opacity=".07"/>
      <g transform="rotate(-35 200 200)">
        <rect x="70" y="176" width="200" height="48" rx="24" fill="${c}"/>
        <rect x="100" y="188" width="60" height="24" rx="12" fill="#fff" opacity=".8"/>
        <path d="M270 184 L320 192 V208 L270 216 Z" fill="${shade(c, -18)}"/>
        <rect x="46" y="190" width="30" height="20" rx="6" fill="${shade(c, -25)}"/>
      </g>
      ${[0, 1, 2].map(i => `<g transform="translate(${250 + i * 30} 250)"><rect width="18" height="46" rx="6" fill="${i % 2 ? '#F2C94C' : '#6FCF97'}"/><rect x="7" y="-12" width="4" height="12" fill="#9AA8B6"/></g>`).join('')}`,
    bpmonitor: (c) => `
      <ellipse cx="200" cy="315" rx="140" ry="14" fill="#0F1B2D" opacity=".08"/>
      <path d="M270 190 C340 190 350 110 300 90" stroke="#5B6B7B" stroke-width="7" fill="none" stroke-linecap="round"/>
      <rect x="250" y="60" width="110" height="60" rx="14" fill="${shade(c, -10)}" transform="rotate(-12 305 90)"/>
      <rect x="70" y="140" width="220" height="170" rx="28" fill="#F7F9FB" stroke="#D5DEE7" stroke-width="3"/>
      <rect x="92" y="160" width="130" height="115" rx="10" fill="#DDEBF7"/>
      <text x="200" y="205" text-anchor="end" font-family="Arial" font-weight="700" font-size="36" fill="#0F1B2D">120</text>
      <text x="200" y="250" text-anchor="end" font-family="Arial" font-weight="700" font-size="30" fill="#0F1B2D">80</text>
      <text x="108" y="268" font-family="Arial" font-size="11" fill="#40505F">♥ 72</text>
      <circle cx="255" cy="200" r="18" fill="${c}"/>
      <rect x="240" y="240" width="30" height="12" rx="6" fill="#C5D0DA"/>`,
    thermometer: (c) => `
      <ellipse cx="200" cy="310" rx="120" ry="12" fill="#0F1B2D" opacity=".07"/>
      <g transform="rotate(-40 200 200)">
        <path d="M60 176 H250 Q300 176 330 196 L346 200 L330 204 Q300 224 250 224 H60 Q40 224 40 200 Q40 176 60 176 Z" fill="#fff" stroke="#CFD9E3" stroke-width="3"/>
        <rect x="40" y="176" width="90" height="48" rx="24" fill="${c}"/>
        <rect x="140" y="186" width="80" height="28" rx="6" fill="#DDF4EC"/>
        <text x="180" y="207" text-anchor="middle" font-family="Arial" font-weight="700" font-size="18" fill="#0F1B2D">98.6°</text>
        <circle cx="85" cy="200" r="10" fill="#fff" opacity=".85"/>
        <rect x="330" y="196" width="26" height="8" rx="4" fill="#9AA8B6"/>
      </g>`,
    infrared: (c) => `
      <ellipse cx="200" cy="320" rx="100" ry="12" fill="#0F1B2D" opacity=".08"/>
      <path d="M110 110 H280 Q310 110 310 140 V170 Q310 190 290 190 H230 L220 310 H160 L170 190 H110 Q90 190 90 170 V130 Q90 110 110 110 Z" fill="${c}"/>
      <rect x="120" y="126" width="110" height="46" rx="8" fill="#DDF4EC"/>
      <text x="175" y="158" text-anchor="middle" font-family="Arial" font-weight="700" font-size="24" fill="#0F1B2D">36.8°</text>
      <circle cx="270" cy="150" r="14" fill="#fff" opacity=".85"/>
      <rect x="182" y="210" width="20" height="36" rx="6" fill="#fff" opacity=".85"/>`,
    oximeter: (c) => `
      <ellipse cx="200" cy="310" rx="120" ry="14" fill="#0F1B2D" opacity=".08"/>
      <path d="M90 170 Q90 120 150 120 H270 Q320 120 320 170 V200 H90 Z" fill="${c}"/>
      <path d="M90 210 H320 V250 Q320 290 270 290 H150 Q90 290 90 250 Z" fill="${shade(c, -18)}"/>
      <rect x="130" y="135" width="150" height="54" rx="8" fill="#0F1B2D"/>
      <text x="165" y="170" text-anchor="middle" font-family="Arial" font-weight="700" font-size="24" fill="#6FE3B5">98</text>
      <text x="238" y="170" text-anchor="middle" font-family="Arial" font-weight="700" font-size="24" fill="#F2C94C">76</text>
      <text x="165" y="183" text-anchor="middle" font-family="Arial" font-size="8" fill="#9FB3C8">SpO2%</text>
      <text x="238" y="183" text-anchor="middle" font-family="Arial" font-size="8" fill="#9FB3C8">PR bpm</text>
      <rect x="84" y="198" width="242" height="14" rx="7" fill="#E5ECF2"/>
      <circle cx="300" cy="250" r="9" fill="#fff" opacity=".7"/>`,
    gloves: (c) => `
      <ellipse cx="200" cy="330" rx="110" ry="12" fill="#0F1B2D" opacity=".07"/>
      <path d="M150 330 V230 L110 180 Q98 164 112 156 Q124 150 136 164 L160 190 V90 Q160 74 174 74 Q188 74 188 90 V170 V70 Q188 54 202 54 Q216 54 216 70 V170 V80 Q216 64 230 64 Q244 64 244 80 V175 V104 Q244 90 257 90 Q270 90 270 104 V240 Q270 280 250 300 V330 Z" fill="${c}"/>
      <rect x="146" y="312" width="128" height="24" rx="6" fill="${shade(c, -15)}"/>
      <path d="M188 170 V120 M216 170 V110 M244 175 V130" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>`,
    firstaid: (c) => `
      <ellipse cx="200" cy="320" rx="140" ry="14" fill="#0F1B2D" opacity=".08"/>
      <path d="M160 110 V90 Q160 76 174 76 H226 Q240 76 240 90 V110" stroke="${shade(c, -25)}" stroke-width="12" fill="none"/>
      <rect x="70" y="110" width="260" height="200" rx="26" fill="${c}"/>
      <rect x="70" y="180" width="260" height="10" fill="${shade(c, -15)}"/>
      <circle cx="200" cy="215" r="58" fill="#fff"/>
      <rect x="186" y="178" width="28" height="74" rx="4" fill="${c}"/>
      <rect x="163" y="201" width="74" height="28" rx="4" fill="${c}"/>`,
    antiseptic: (c) => `
      <ellipse cx="200" cy="330" rx="90" ry="12" fill="#0F1B2D" opacity=".08"/>
      <rect x="170" y="56" width="60" height="36" rx="8" fill="${shade(c, -30)}"/>
      <path d="M160 92 H240 L250 130 Q280 140 280 170 V310 Q280 330 260 330 H140 Q120 330 120 310 V170 Q120 140 150 130 Z" fill="${c}"/>
      <rect x="138" y="180" width="124" height="110" rx="10" fill="#fff"/>
      <rect x="152" y="196" width="96" height="14" rx="4" fill="${c}"/>
      <rect x="152" y="220" width="70" height="7" rx="3" fill="#B7C3CE"/>
      <rect x="152" y="234" width="84" height="7" rx="3" fill="#B7C3CE"/>
      <path d="M200 252 v24 M188 264 h24" stroke="#E5484D" stroke-width="6" stroke-linecap="round"/>`,
    cotton: (c) => `
      <ellipse cx="200" cy="320" rx="130" ry="14" fill="#0F1B2D" opacity=".07"/>
      <rect x="90" y="130" width="220" height="180" rx="20" fill="${c}"/>
      <rect x="110" y="190" width="180" height="70" rx="10" fill="#fff" opacity=".9"/>
      <rect x="126" y="206" width="110" height="12" rx="4" fill="${c}"/>
      <rect x="126" y="228" width="80" height="8" rx="4" fill="#B7C3CE"/>
      ${[[130, 128, 30], [170, 112, 36], [215, 115, 34], [258, 126, 30], [150, 100, 24], [238, 98, 26]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#E3E9EF" stroke-width="2"/>`).join('')}`,
    nebulizer: (c) => `
      <ellipse cx="200" cy="320" rx="140" ry="14" fill="#0F1B2D" opacity=".08"/>
      <rect x="60" y="170" width="200" height="140" rx="26" fill="#F7F9FB" stroke="#D5DEE7" stroke-width="3"/>
      <rect x="80" y="190" width="160" height="30" rx="8" fill="${c}"/>
      ${[100, 120, 140, 160, 180, 200, 220].map(x => `<rect x="${x - 3}" y="240" width="6" height="46" rx="3" fill="#D5DEE7"/>`).join('')}
      <path d="M240 200 C300 200 300 130 300 110" stroke="#9AB3C8" stroke-width="7" fill="none"/>
      <path d="M270 60 Q300 40 330 60 L340 110 Q300 130 260 110 Z" fill="${c}" opacity=".45" stroke="${c}" stroke-width="3"/>`,
    stethoscope: (c) => `
      <ellipse cx="200" cy="330" rx="120" ry="12" fill="#0F1B2D" opacity=".07"/>
      <path d="M130 60 V150 Q130 220 200 220 Q270 220 270 150 V60" stroke="${c}" stroke-width="12" fill="none" stroke-linecap="round"/>
      <circle cx="130" cy="58" r="10" fill="#5B6B7B"/><circle cx="270" cy="58" r="10" fill="#5B6B7B"/>
      <path d="M200 220 V270 Q200 320 250 320 Q300 320 300 280" stroke="${c}" stroke-width="12" fill="none" stroke-linecap="round"/>
      <circle cx="300" cy="260" r="36" fill="#C5D0DA"/>
      <circle cx="300" cy="260" r="24" fill="#EEF2F6"/>`,
    mask: (c) => `
      <ellipse cx="200" cy="310" rx="130" ry="12" fill="#0F1B2D" opacity=".07"/>
      <path d="M70 150 Q40 160 50 200 Q58 240 100 240" stroke="#B7C3CE" stroke-width="5" fill="none"/>
      <path d="M330 150 Q360 160 350 200 Q342 240 300 240" stroke="#B7C3CE" stroke-width="5" fill="none"/>
      <path d="M100 130 Q200 80 300 130 V230 Q200 300 100 230 Z" fill="${c}"/>
      <path d="M100 165 Q200 130 300 165 M100 200 Q200 170 300 200" stroke="#fff" stroke-opacity=".5" stroke-width="3" fill="none"/>
      <circle cx="245" cy="215" r="16" fill="${shade(c, -18)}"/>`,
    tablets: (c) => `
      <ellipse cx="200" cy="320" rx="140" ry="14" fill="#0F1B2D" opacity=".08"/>
      <rect x="80" y="90" width="110" height="36" rx="8" fill="${shade(c, -25)}"/>
      <rect x="72" y="122" width="126" height="190" rx="18" fill="${c}"/>
      <rect x="86" y="170" width="98" height="90" rx="8" fill="#fff"/>
      <rect x="98" y="186" width="74" height="12" rx="4" fill="${c}"/>
      <rect x="98" y="208" width="52" height="7" rx="3" fill="#B7C3CE"/>
      <rect x="98" y="222" width="64" height="7" rx="3" fill="#B7C3CE"/>
      <g transform="rotate(12 285 230)">
        <rect x="220" y="140" width="120" height="170" rx="14" fill="#E7EDF3" stroke="#C9D4DE" stroke-width="2"/>
        ${[0, 1, 2].map(r => [0, 1].map(k => `<ellipse cx="${253 + k * 54}" cy="${178 + r * 50}" rx="18" ry="14" fill="#fff" stroke="#C9D4DE"/><ellipse cx="${253 + k * 54}" cy="${178 + r * 50}" rx="10" ry="7" fill="${shade(c, 30)}"/>`).join('')).join('')}
      </g>`,
    doctor: (c) => `
      <ellipse cx="200" cy="335" rx="100" ry="12" fill="#0F1B2D" opacity=".08"/>
      <rect x="120" y="50" width="160" height="285" rx="28" fill="#0F1B2D"/>
      <rect x="130" y="66" width="140" height="252" rx="18" fill="${shade(c, 45)}"/>
      <circle cx="200" cy="150" r="36" fill="#F2C7A5"/>
      <path d="M164 140 Q168 104 200 104 Q234 104 236 140 Q222 124 200 126 Q178 124 164 140 Z" fill="#2E3A48"/>
      <path d="M140 280 Q140 200 200 200 Q260 200 260 280 V318 H140 Z" fill="#fff"/>
      <path d="M186 200 L200 228 L214 200" fill="${c}"/>
      <path d="M176 214 V250 Q176 264 190 264" stroke="#5B6B7B" stroke-width="4" fill="none"/>
      <rect x="160" y="286" width="80" height="20" rx="10" fill="#E5484D"/>
      <rect x="236" y="80" width="26" height="36" rx="6" fill="#fff" opacity=".85"/>`,
    sanitizer: (c) => `
      <ellipse cx="200" cy="330" rx="90" ry="12" fill="#0F1B2D" opacity=".08"/>
      <path d="M180 60 H250 V76 H200 V100 H180 Z" fill="${shade(c, -30)}"/>
      <rect x="172" y="100" width="56" height="30" rx="4" fill="${shade(c, -20)}"/>
      <rect x="130" y="130" width="140" height="200" rx="30" fill="${c}" opacity=".85"/>
      <rect x="148" y="180" width="104" height="100" rx="10" fill="#fff"/>
      <circle cx="200" cy="215" r="18" fill="${c}" opacity=".5"/>
      <rect x="164" y="248" width="72" height="8" rx="4" fill="#B7C3CE"/>`
  };

  function shade(hex, pct) {
    const n = parseInt(hex.slice(1), 16);
    const amt = Math.round(2.55 * pct);
    const r = Math.min(255, Math.max(0, (n >> 16) + amt));
    const g = Math.min(255, Math.max(0, ((n >> 8) & 255) + amt));
    const b = Math.min(255, Math.max(0, (n & 255) + amt));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function wrap(inner, bg, label) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient></defs>
      <rect width="400" height="400" fill="url(#g)"/>
      <circle cx="340" cy="60" r="90" fill="#fff" opacity=".45"/>
      <circle cx="40" cy="370" r="70" fill="#fff" opacity=".35"/>
      ${inner}
      ${label ? `<text x="20" y="384" font-family="Arial" font-size="12" font-weight="700" fill="#8494A5" letter-spacing="1">${label}</text>` : ''}
    </svg>`;
  }

  function uri(svg) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace(/\s{2,}/g, ' '));
  }

  function packaging(type, c, brand) {
    const obj = draw[type](c);
    return `
      <ellipse cx="200" cy="335" rx="130" ry="14" fill="#0F1B2D" opacity=".08"/>
      <path d="M90 110 L130 80 H330 L290 110 Z" fill="${shade(c, 15)}"/>
      <path d="M290 110 L330 80 V300 L290 330 Z" fill="${shade(c, -22)}"/>
      <rect x="70" y="110" width="220" height="220" rx="6" fill="#fff" stroke="#D5DEE7" stroke-width="2"/>
      <rect x="70" y="110" width="220" height="46" rx="6" fill="${c}"/>
      <text x="84" y="141" font-family="Arial" font-weight="700" font-size="20" fill="#fff">${esc(brand)}</text>
      <g transform="translate(92 150) scale(.44)">${obj}</g>
      <rect x="86" y="306" width="120" height="8" rx="4" fill="#C5D0DA"/>
      <path d="M252 300 h24 M264 288 v24" stroke="#E5484D" stroke-width="5"/>`;
  }

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /** Build n image variants for a product illustration. */
  function images(type, color, brand, n = 5) {
    const out = [];
    const views = [
      (o) => o,
      (o) => `<g transform="rotate(-10 200 200) translate(20 10) scale(.9)">${o}</g>`,
      () => packaging(type, color, brand),
      (o) => `<g transform="translate(-90 -80) scale(1.45)">${o}</g>`,
      (o) => `<g transform="translate(-10 40) scale(.62)">${o}</g><g transform="translate(160 20) scale(.62)">${o}</g>`,
      (o) => `<g transform="translate(400 0) scale(-1 1)">${o}</g>`
    ];
    const labels = ['', '', '', 'CLOSE-UP', 'VALUE PACK', ''];
    const obj = draw[type](color);
    for (let i = 0; i < n; i++) {
      out.push(uri(wrap(views[i % views.length](obj), BGS[i % BGS.length], labels[i % labels.length])));
    }
    return out;
  }

  function single(type, color, bgIndex = 0) {
    return uri(wrap(draw[type](color), BGS[bgIndex % BGS.length]));
  }

  return { images, single };
})();

/* ---------- Helpers ---------- */
function twAddDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}
const TW_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// Formats as "19 Sep" / "19 Sep 2026" (manual, since some locales render "Sept").
function twFormatDate(d, withYear = false) {
  return `${d.getDate()} ${TW_MONTHS[d.getMonth()]}${withYear ? ' ' + d.getFullYear() : ''}`;
}

/* ---------- Taxonomy ---------- */
const CATEGORIES = [
  { slug: 'medicines', name: 'Medicines', icon: 'fa-pills', color: '#2F6FED', subs: ['Tablets', 'Thyroid Care', 'Allergy Care', 'Liver Care'] },
  { slug: 'diabetes-care', name: 'Diabetes Care', icon: 'fa-droplet', color: '#E5484D', subs: ['Glucose Meters', 'Test Strips', 'Insulin Syringes', 'Lancets'] },
  { slug: 'blood-pressure', name: 'Blood Pressure', icon: 'fa-heart-pulse', color: '#D6336C', subs: ['BP Monitors', 'Digital BP Machines', 'BP Accessories'] },
  { slug: 'surgical-supplies', name: 'Surgical Supplies', icon: 'fa-kit-medical', color: '#0FA3A3', subs: ['Bandages', 'Gauze', 'Surgical Tapes', 'Gloves'] },
  { slug: 'bandages-tapes', name: 'Bandages & Tapes', icon: 'fa-band-aid', color: '#E8871E', subs: ['Crepe Bandages', 'Adhesive Bandages', 'Surgical Tapes'] },
  { slug: 'syringes-needles', name: 'Syringes & Needles', icon: 'fa-syringe', color: '#7048E8', subs: ['Syringes', 'Insulin Syringes', 'Needles'] },
  { slug: 'medical-devices', name: 'Medical Devices', icon: 'fa-stethoscope', color: '#1C7ED6', subs: ['BP Monitors', 'Thermometers', 'Pulse Oximeters', 'Nebulizers'] },
  { slug: 'diagnostic-equipment', name: 'Diagnostic Equipment', icon: 'fa-microscope', color: '#0B7285', subs: ['Stethoscopes', 'Glucose Meters', 'Thermometers'] },
  { slug: 'personal-care', name: 'Personal Care', icon: 'fa-hand-sparkles', color: '#2B8A3E', subs: ['Masks', 'Sanitizers', 'Hygiene'] },
  { slug: 'first-aid', name: 'First Aid', icon: 'fa-suitcase-medical', color: '#C92A2A', subs: ['Antiseptic', 'Cotton', 'Bandages', 'First-aid Kits'] },
  { slug: 'doctor-consultation', name: 'Doctor Consultation', icon: 'fa-user-doctor', color: '#1098AD', subs: ['Consult a Doctor', 'Book an Appointment', 'Medicine Consultation'] }
];

// Mega-menu groups: each link filters the listing by category + sub-category.
const MEGA_MENU = [
  { title: 'Diabetes Care', slug: 'diabetes-care', links: ['Glucose Meters', 'Test Strips', 'Insulin Syringes', 'Lancets'] },
  { title: 'Surgical Supplies', slug: 'surgical-supplies', links: ['Bandages', 'Gauze', 'Surgical Tapes', 'Gloves'] },
  { title: 'Medical Devices', slug: 'medical-devices', links: ['BP Monitors', 'Thermometers', 'Pulse Oximeters', 'Nebulizers'] },
  { title: 'Blood Pressure', slug: 'blood-pressure', links: ['BP Monitors', 'Digital BP Machines', 'BP Accessories'] },
  { title: 'First Aid', slug: 'first-aid', links: ['Antiseptic', 'Cotton', 'Bandages', 'First-aid Kits'] },
  { title: 'Medicines', slug: 'medicines', links: ['Tablets', 'Thyroid Care', 'Allergy Care', 'Liver Care'] },
  { title: 'Personal Care', slug: 'personal-care', links: ['Masks', 'Sanitizers'] },
  { title: 'Doctor Services', slug: 'doctor-consultation', links: ['Consult a Doctor', 'Book an Appointment', 'Medicine Consultation'] }
];

const BRANDS = [
  { name: '3M', tag: 'Surgical & Safety', color: '#E03131' },
  { name: 'Omron', tag: 'BP & Nebulizers', color: '#1864AB' },
  { name: 'Accu-Chek', tag: 'Diabetes Care', color: '#0B7285' },
  { name: 'Dr. Morepen', tag: 'Home Diagnostics', color: '#2B8A3E' },
  { name: 'BD', tag: 'Syringes & Needles', color: '#E8590C' },
  { name: 'Johnson & Johnson', tag: 'Wound Care', color: '#C2255C' },
  { name: 'Cipla', tag: 'Pharmaceuticals', color: '#1971C2' },
  { name: 'Abbott', tag: 'Healthcare', color: '#1C7ED6' },
  { name: 'Himalaya', tag: 'Wellness', color: '#2F9E44' },
  { name: 'Apollo', tag: 'Pharmacy Essentials', color: '#0C8599' },
  { name: 'Medtronic', tag: 'Medical Technology', color: '#364FC7' }
];

const SELLERS = ['TW Healthcare', 'MedSupply India', 'HealthCare Plus', 'MedicalKart', 'SafeMed Supplies'];

/* ---------- Product factory ---------- */
let _twCode = 0;
function twProduct(p) {
  _twCode++;
  const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);
  const deliveryDays = p.deliveryDays || 3;
  const brandCode = p.brand.replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase();
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    cats: p.cats,
    subCategory: p.subCategory,
    type: p.type,
    description: p.description,
    about: p.about || [],
    images: MedArt.images(p.art, p.color, p.brand, p.imageCount || 5),
    rating: p.rating,
    reviews: p.reviews,
    mrp: p.mrp,
    price: p.price,
    discount,
    seller: p.seller,
    deliveryDays,
    deliveryDate: twFormatDate(twAddDays(deliveryDays)),
    variantLabel: p.variantLabel || '',
    variants: p.variants || [],
    packSize: p.packSize || 1,
    badge: p.badge || '',
    highlights: {
      productCode: `TW-${brandCode}-${String(_twCode).padStart(3, '0')}`,
      genericName: p.h[0],
      colour: p.h[1],
      material: p.h[2],
      netQuantity: p.h[3],
      countryOfOrigin: p.h[4] || 'India'
    }
  };
}

/* ---------- Catalogue ---------- */
const PRODUCTS = [
  { id: 101, name: '3M Micropore Surgical Tape', brand: '3M', category: 'Surgical Supplies', cats: ['surgical-supplies', 'bandages-tapes', 'first-aid'], subCategory: 'Surgical Tapes', type: 'Surgical tape', art: 'tape', color: '#E9EEF3',
    description: 'Gentle, breathable paper tape ideal for securing dressings on sensitive skin.', rating: 4.7, reviews: 234, mrp: 399, price: 299, seller: 'TW Healthcare', deliveryDays: 2, badge: 'Bestseller',
    variantLabel: 'Select Size', variants: ['0.5 inch', '1 inch', '2 inch', '3 inch'],
    about: ['Hypoallergenic, latex-free adhesive', 'Breathable non-woven fabric reduces skin maceration', 'Tears easily by hand in both directions', 'Leaves minimal residue on removal'],
    h: ['Surgical Adhesive Tape', 'White', 'Non-Woven Fabric', '1 Roll'] },
  { id: 102, name: 'Elastic Crepe Bandage', brand: '3M', category: 'Surgical Supplies', cats: ['surgical-supplies', 'bandages-tapes', 'first-aid'], subCategory: 'Bandages', type: 'Crepe bandage', art: 'bandage', color: '#E7B98A',
    description: 'High-stretch crepe bandage for sprains, strains and joint support.', rating: 4.7, reviews: 1234, mrp: 299, price: 219, seller: 'MedSupply India', deliveryDays: 3,
    variantLabel: 'Select Width', variants: ['6 cm', '8 cm', '10 cm', '15 cm'],
    about: ['Excellent elasticity and recovery', 'Provides firm, even compression', 'Washable and reusable', 'Comes with 2 fastening clips'],
    h: ['Elastic Crepe Bandage', 'Skin', 'Cotton & Elastane', '1 Bandage (4 m stretched)'] },
  { id: 103, name: 'Cotton Surgical Roller Bandage', brand: 'Apollo', category: 'Surgical Supplies', cats: ['surgical-supplies', 'bandages-tapes', 'first-aid'], subCategory: 'Bandages', type: 'Cotton bandage', art: 'bandage', color: '#DCE6EF',
    description: 'Soft, absorbent cotton roller bandage for everyday wound dressing.', rating: 4.4, reviews: 512, mrp: 199, price: 149, seller: 'HealthCare Plus', deliveryDays: 3,
    variantLabel: 'Select Size', variants: ['5 cm x 3 m', '7.5 cm x 3 m', '10 cm x 3 m'],
    about: ['100% pure cotton', 'Highly absorbent and breathable', 'Frayed-edge free finish', 'Pack of 10 rolls'],
    h: ['Roller Bandage', 'White', 'Cotton', '10 Rolls'] },
  { id: 104, name: 'Band-Aid Adhesive Bandage Strips', brand: 'Johnson & Johnson', category: 'First Aid', cats: ['first-aid', 'bandages-tapes'], subCategory: 'Bandages', type: 'Adhesive bandage', art: 'adhesive', color: '#E8B48C',
    description: 'Flexible fabric strips with non-stick pad for minor cuts and scrapes.', rating: 4.8, reviews: 3890, mrp: 299, price: 249, seller: 'TW Healthcare', deliveryDays: 2, badge: 'Top Rated',
    variantLabel: 'Select Pack', variants: ['20 Strips', '50 Strips', '100 Strips'],
    about: ['Flexible fabric moves with you', 'Non-stick pad won\'t stick to wounds', 'Sterile individually wrapped strips'],
    h: ['Adhesive Wound Strip', 'Skin', 'Fabric', '100 Strips'] },
  { id: 105, name: 'Waterproof Bandage Strips', brand: 'Dr. Morepen', category: 'First Aid', cats: ['first-aid', 'bandages-tapes'], subCategory: 'Bandages', type: 'Waterproof bandage', art: 'adhesive', color: '#9AD3E8',
    description: 'Transparent waterproof strips that stay on through handwashes and showers.', rating: 4.3, reviews: 418, mrp: 180, price: 129, seller: 'SafeMed Supplies', deliveryDays: 4,
    variantLabel: 'Select Pack', variants: ['40 Strips', '80 Strips'],
    about: ['100% waterproof seal', 'Transparent and discreet', 'Breathable micro-perforations'],
    h: ['Waterproof Wound Strip', 'Transparent', 'Polyurethane Film', '40 Strips'] },
  { id: 106, name: 'Tubular Compression Bandage', brand: 'Apollo', category: 'Surgical Supplies', cats: ['surgical-supplies', 'bandages-tapes'], subCategory: 'Bandages', type: 'Compression bandage', art: 'bandage', color: '#8FB8DE',
    description: 'Graduated compression support for swelling, oedema and post-injury care.', rating: 4.5, reviews: 276, mrp: 450, price: 339, seller: 'MedicalKart', deliveryDays: 4,
    variantLabel: 'Select Size', variants: ['Small', 'Medium', 'Large', 'XL'],
    about: ['Even circumferential compression', 'Latex-free elastic yarn', 'Cut to desired length'],
    h: ['Compression Bandage', 'Blue', 'Cotton & Elastane', '1 Roll (1 m)'] },
  { id: 107, name: 'Sterile Gauze Swabs 10x10 cm', brand: 'Johnson & Johnson', category: 'Surgical Supplies', cats: ['surgical-supplies', 'first-aid'], subCategory: 'Gauze', type: 'Gauze swab', art: 'gauze', color: '#6FA8DC',
    description: '12-ply sterile gauze swabs for cleaning and dressing wounds.', rating: 4.6, reviews: 687, mrp: 240, price: 189, seller: 'TW Healthcare', deliveryDays: 3,
    variantLabel: 'Select Pack', variants: ['Pack of 10', 'Pack of 25', 'Pack of 100'],
    about: ['12-ply construction for high absorbency', 'Individually sterile packed', 'Lint-free folded edges'],
    h: ['Gauze Swab', 'White', 'Cotton Gauze', '10 Swabs'] },
  { id: 108, name: 'Paraffin Gauze Dressing', brand: 'Cipla', category: 'Surgical Supplies', cats: ['surgical-supplies', 'first-aid'], subCategory: 'Gauze', type: 'Paraffin dressing', art: 'gauze', color: '#E0B64E',
    description: 'Non-adherent paraffin-impregnated dressing for burns and skin grafts.', rating: 4.4, reviews: 158, mrp: 320, price: 262, seller: 'HealthCare Plus', deliveryDays: 4,
    about: ['Soft paraffin prevents sticking', 'Promotes moist wound healing', 'Sterile single-use'],
    h: ['Tulle Dressing', 'Yellow', 'Leno Gauze + Paraffin', '10 Dressings'] },
  { id: 109, name: 'BD Emerald Disposable Syringe', brand: 'BD', category: 'Syringes & Needles', cats: ['syringes-needles', 'surgical-supplies'], subCategory: 'Syringes', type: 'Disposable syringe', art: 'syringe', color: '#4CB782',
    description: 'Sterile single-use syringes with smooth plunger action and clear scale.', rating: 4.7, reviews: 902, mrp: 699, price: 549, seller: 'MedSupply India', deliveryDays: 3, badge: 'Bestseller',
    variantLabel: 'Select Capacity', variants: ['2 ml', '5 ml', '10 ml', '20 ml'],
    about: ['Bold, easy-to-read graduations', 'Smooth, consistent plunger glide', 'Pack of 100 sterile syringes'],
    h: ['Hypodermic Syringe', 'Transparent', 'Medical-grade Polypropylene', '100 Syringes'] },
  { id: 110, name: 'BD Ultra-Fine Insulin Syringe', brand: 'BD', category: 'Diabetes Care', cats: ['diabetes-care', 'syringes-needles'], subCategory: 'Insulin Syringes', type: 'Insulin syringe', art: 'syringe', color: '#F08C2E',
    description: 'Ultra-fine 31G needle for comfortable, near-painless insulin injections.', rating: 4.8, reviews: 1540, mrp: 450, price: 369, seller: 'TW Healthcare', deliveryDays: 2,
    variantLabel: 'Select Units', variants: ['30 Units', '50 Units', '100 Units'],
    about: ['31G x 6 mm ultra-fine needle', 'Lubricated for smooth insertion', 'Pack of 10 syringes'],
    h: ['Insulin Syringe', 'Orange', 'Polypropylene & Steel', '10 Syringes', 'Singapore'] },
  { id: 111, name: 'BD Microlance Hypodermic Needles', brand: 'BD', category: 'Syringes & Needles', cats: ['syringes-needles'], subCategory: 'Needles', type: 'Hypodermic needle', art: 'syringe', color: '#7AA6D8',
    description: 'Tri-bevelled precision needles with colour-coded hubs.', rating: 4.6, reviews: 341, mrp: 380, price: 299, seller: 'SafeMed Supplies', deliveryDays: 4,
    variantLabel: 'Select Gauge', variants: ['21G', '23G', '24G', '26G'],
    about: ['Tri-bevel sharp tip', 'Colour-coded hubs for easy identification', 'Pack of 100 needles'],
    h: ['Hypodermic Needle', 'Colour-coded', 'Stainless Steel', '100 Needles', 'Ireland'] },
  { id: 112, name: 'Accu-Chek Active Glucometer Kit', brand: 'Accu-Chek', category: 'Diabetes Care', cats: ['diabetes-care', 'medical-devices', 'diagnostic-equipment'], subCategory: 'Glucose Meters', type: 'Glucometer', art: 'glucometer', color: '#1C7ED6',
    description: 'Fast 5-second results with 500-test memory and 10 free strips.', rating: 4.6, reviews: 5210, mrp: 1799, price: 1199, seller: 'TW Healthcare', deliveryDays: 2, badge: 'Top Rated',
    about: ['Results in approximately 5 seconds', 'Stores 500 readings with date & time', '7, 14, 30 & 90-day averages', 'Includes 10 strips + Softclix lancing device'],
    h: ['Blood Glucose Monitoring System', 'Blue', 'ABS Plastic', '1 Meter + 10 Strips', 'Germany'] },
  { id: 113, name: 'Accu-Chek Instant Test Strips', brand: 'Accu-Chek', category: 'Diabetes Care', cats: ['diabetes-care'], subCategory: 'Test Strips', type: 'Glucose test strips', art: 'strips', color: '#1C7ED6',
    description: 'Accurate glucose test strips compatible with Accu-Chek Instant meters.', rating: 4.7, reviews: 3120, mrp: 1350, price: 1049, seller: 'MedicalKart', deliveryDays: 3,
    variantLabel: 'Select Pack', variants: ['25 Strips', '50 Strips', '100 Strips'],
    about: ['Meets ISO 15197:2013 accuracy', 'Wide dosing area — easy blood application', 'Store between 4°C and 30°C'],
    h: ['Glucose Test Strip', 'Blue', 'Plastic & Enzyme', '50 Strips', 'Germany'] },
  { id: 114, name: 'Accu-Chek Softclix Lancets', brand: 'Accu-Chek', category: 'Diabetes Care', cats: ['diabetes-care'], subCategory: 'Lancets', type: 'Lancets', art: 'lancet', color: '#3B8ED8',
    description: 'Sterile lancets for nearly painless finger-pricking with Softclix device.', rating: 4.5, reviews: 980, mrp: 299, price: 239, seller: 'HealthCare Plus', deliveryDays: 3,
    variantLabel: 'Select Pack', variants: ['25 Lancets', '100 Lancets', '200 Lancets'],
    about: ['Precision ground needle tip', 'Sterile and single use', 'Compatible with Softclix lancing device'],
    h: ['Blood Lancet', 'Assorted', 'Steel & Plastic', '25 Lancets', 'Germany'] },
  { id: 115, name: 'Dr. Morepen BG-03 Glucometer', brand: 'Dr. Morepen', category: 'Diabetes Care', cats: ['diabetes-care', 'medical-devices', 'diagnostic-equipment'], subCategory: 'Glucose Meters', type: 'Glucometer', art: 'glucometer', color: '#2F9E44',
    description: 'Easy-to-use glucometer with large display and 25 free strips.', rating: 4.3, reviews: 2210, mrp: 1500, price: 699, seller: 'MedSupply India', deliveryDays: 3, badge: '53% OFF',
    about: ['Large LCD display', '300 memory with date & time', 'Includes 25 strips'],
    h: ['Blood Glucose Monitor', 'Green', 'ABS Plastic', '1 Meter + 25 Strips'] },
  { id: 116, name: 'Abbott FreeStyle Optium Neo Glucometer', brand: 'Abbott', category: 'Diabetes Care', cats: ['diabetes-care', 'medical-devices', 'diagnostic-equipment'], subCategory: 'Glucose Meters', type: 'Glucometer & ketone meter', art: 'glucometer', color: '#495057',
    description: 'Tests blood glucose and ketones with insulin dose-tracking support.', rating: 4.5, reviews: 640, mrp: 2250, price: 1790, seller: 'TW Healthcare', deliveryDays: 3,
    about: ['Tests glucose and ß-ketones', 'Backlit display for night use', 'Hypo & hyper trend indicators'],
    h: ['Blood Glucose & Ketone Meter', 'Grey', 'ABS Plastic', '1 Meter', 'United Kingdom'] },
  { id: 117, name: 'Omron HEM-7120 Blood Pressure Monitor', brand: 'Omron', category: 'Blood Pressure', cats: ['blood-pressure', 'medical-devices'], subCategory: 'BP Monitors', type: 'BP monitor', art: 'bpmonitor', color: '#1864AB',
    description: 'Clinically validated upper-arm BP monitor with IntelliSense technology.', rating: 4.6, reviews: 8420, mrp: 3499, price: 2499, seller: 'TW Healthcare', deliveryDays: 2, badge: 'Bestseller',
    about: ['IntelliSense technology for comfortable inflation', 'Irregular heartbeat detection', 'Cuff wrapping guide', '5-year warranty'],
    h: ['Digital Blood Pressure Monitor', 'White', 'ABS Plastic', '1 Monitor + Cuff', 'Japan'] },
  { id: 118, name: 'Omron HEM-7156T Bluetooth BP Monitor', brand: 'Omron', category: 'Blood Pressure', cats: ['blood-pressure', 'medical-devices'], subCategory: 'Digital BP Machines', type: 'Smart BP monitor', art: 'bpmonitor', color: '#0B7285',
    description: 'Smart BP monitor syncs readings with the Omron Connect app.', rating: 4.7, reviews: 1360, mrp: 5299, price: 3999, seller: 'HealthCare Plus', deliveryDays: 3,
    about: ['Bluetooth sync with Omron Connect', 'Intelli Wrap cuff for any position', 'Morning hypertension indicator'],
    h: ['Digital BP Monitor', 'White', 'ABS Plastic', '1 Monitor + Cuff', 'Japan'] },
  { id: 119, name: 'Dr. Morepen BP-02 Automatic BP Monitor', brand: 'Dr. Morepen', category: 'Blood Pressure', cats: ['blood-pressure', 'medical-devices'], subCategory: 'Digital BP Machines', type: 'BP monitor', art: 'bpmonitor', color: '#2F9E44',
    description: 'Fully automatic BP monitor with large backlit display and dual-user memory.', rating: 4.2, reviews: 3070, mrp: 2800, price: 1349, seller: 'MedicalKart', deliveryDays: 4,
    about: ['Dual user, 120 memory each', 'Large backlit display', 'WHO BP classification indicator'],
    h: ['Blood Pressure Monitor', 'White', 'ABS Plastic', '1 Monitor + Cuff'] },
  { id: 120, name: 'Omron Upper-Arm BP Cuff', brand: 'Omron', category: 'Blood Pressure', cats: ['blood-pressure'], subCategory: 'BP Accessories', type: 'BP cuff', art: 'bpmonitor', color: '#5C7CFA',
    description: 'Replacement soft cuff compatible with most Omron upper-arm monitors.', rating: 4.4, reviews: 412, mrp: 1199, price: 949, seller: 'SafeMed Supplies', deliveryDays: 4,
    variantLabel: 'Select Size', variants: ['Small', 'Medium', 'Large', 'XL'],
    about: ['Pre-formed soft cuff', 'Fits 22–42 cm arm circumference', 'Washable cover'],
    h: ['Blood Pressure Cuff', 'Navy Blue', 'Nylon & PVC', '1 Cuff', 'Vietnam'] },
  { id: 121, name: 'Omron MC-246 Digital Thermometer', brand: 'Omron', category: 'Medical Devices', cats: ['medical-devices', 'diagnostic-equipment'], subCategory: 'Thermometers', type: 'Digital thermometer', art: 'thermometer', color: '#1864AB',
    description: 'Accurate oral/underarm readings in about 60 seconds with fever alarm.', rating: 4.5, reviews: 2890, mrp: 299, price: 219, seller: 'TW Healthcare', deliveryDays: 2,
    about: ['Readings in ~60 seconds', 'Fever alarm & last-reading memory', 'Water-resistant probe'],
    h: ['Digital Clinical Thermometer', 'White & Blue', 'ABS Plastic', '1 Thermometer', 'China'] },
  { id: 122, name: 'Dr. Morepen Infrared Thermometer', brand: 'Dr. Morepen', category: 'Medical Devices', cats: ['medical-devices', 'diagnostic-equipment'], subCategory: 'Thermometers', type: 'Infrared thermometer', art: 'infrared', color: '#2F9E44',
    description: 'Non-contact forehead thermometer with 1-second readings.', rating: 4.3, reviews: 1650, mrp: 3500, price: 1499, seller: 'MedSupply India', deliveryDays: 3,
    about: ['1-second non-contact reading', 'Colour-coded fever alert', '32 memory readings'],
    h: ['Infrared Thermometer', 'Green & White', 'ABS Plastic', '1 Thermometer'] },
  { id: 123, name: 'Dr. Morepen PO-04 Pulse Oximeter', brand: 'Dr. Morepen', category: 'Medical Devices', cats: ['medical-devices', 'diagnostic-equipment'], subCategory: 'Pulse Oximeters', type: 'Pulse oximeter', art: 'oximeter', color: '#2F9E44',
    description: 'Fingertip oximeter measuring SpO2 and pulse rate with OLED display.', rating: 4.4, reviews: 4120, mrp: 2999, price: 1099, seller: 'TW Healthcare', deliveryDays: 2,
    about: ['Dual-colour OLED display', 'Measures SpO2, pulse rate & PI', 'Auto power-off'],
    h: ['Fingertip Pulse Oximeter', 'Green', 'ABS & Silicone', '1 Device'] },
  { id: 124, name: 'Apollo Fingertip Pulse Oximeter', brand: 'Apollo', category: 'Medical Devices', cats: ['medical-devices', 'diagnostic-equipment'], subCategory: 'Pulse Oximeters', type: 'Pulse oximeter', art: 'oximeter', color: '#0C8599',
    description: 'Compact, lightweight oximeter for quick home SpO2 checks.', rating: 4.2, reviews: 980, mrp: 1999, price: 899, seller: 'HealthCare Plus', deliveryDays: 3,
    about: ['Rotating 4-direction display', 'Low battery indicator', 'Includes lanyard and batteries'],
    h: ['Pulse Oximeter', 'Teal', 'ABS & Silicone', '1 Device'] },
  { id: 125, name: 'Apollo Nitrile Examination Gloves', brand: 'Apollo', category: 'Surgical Supplies', cats: ['surgical-supplies', 'personal-care'], subCategory: 'Gloves', type: 'Examination gloves', art: 'gloves', color: '#6C8EEF',
    description: 'Powder-free, latex-free nitrile gloves with textured fingertips.', rating: 4.6, reviews: 1870, mrp: 899, price: 649, seller: 'MedSupply India', deliveryDays: 3,
    variantLabel: 'Select Size', variants: ['Small', 'Medium', 'Large', 'XL'],
    about: ['Powder-free & latex-free', 'Textured fingertips for grip', 'Box of 100 gloves (50 pairs)'],
    h: ['Nitrile Examination Glove', 'Blue', 'Nitrile Rubber', '100 Gloves', 'Malaysia'] },
  { id: 126, name: 'Medtronic Sterile Surgical Gloves', brand: 'Medtronic', category: 'Surgical Supplies', cats: ['surgical-supplies'], subCategory: 'Gloves', type: 'Surgical gloves', art: 'gloves', color: '#E9D8B8',
    description: 'Sterile, powder-free latex surgical gloves with anatomical fit.', rating: 4.5, reviews: 356, mrp: 1250, price: 999, seller: 'SafeMed Supplies', deliveryDays: 4,
    variantLabel: 'Select Size', variants: ['6.5', '7', '7.5', '8'],
    about: ['Anatomically shaped for reduced fatigue', 'Beaded cuff prevents roll-down', '25 sterile pairs'],
    h: ['Surgical Glove', 'Natural', 'Natural Rubber Latex', '25 Pairs', 'Malaysia'] },
  { id: 127, name: 'Omron NE-C101 Compressor Nebulizer', brand: 'Omron', category: 'Medical Devices', cats: ['medical-devices'], subCategory: 'Nebulizers', type: 'Nebulizer', art: 'nebulizer', color: '#1864AB',
    description: 'Quiet, compact compressor nebulizer for adults and children.', rating: 4.5, reviews: 2140, mrp: 2590, price: 1899, seller: 'TW Healthcare', deliveryDays: 3,
    about: ['Includes adult & child masks', 'Low residual volume', 'Compact and easy to clean'],
    h: ['Compressor Nebulizer', 'White & Blue', 'ABS Plastic', '1 Nebulizer Kit', 'China'] },
  { id: 128, name: 'Apollo Home First Aid Kit', brand: 'Apollo', category: 'First Aid', cats: ['first-aid'], subCategory: 'First-aid Kits', type: 'First-aid kit', art: 'firstaid', color: '#E03131',
    description: 'Complete 45-piece kit with bandages, antiseptics and essentials.', rating: 4.7, reviews: 1320, mrp: 999, price: 699, seller: 'HealthCare Plus', deliveryDays: 2, badge: 'Bestseller',
    variantLabel: 'Select Kit', variants: ['Home', 'Travel', 'Office', 'Car'],
    about: ['45 essential first-aid items', 'Compact, organised compartments', 'Includes first-aid guide booklet'],
    h: ['First Aid Kit', 'Red', 'PP Box', '1 Kit (45 items)'] },
  { id: 129, name: 'Cipla Povidone-Iodine Antiseptic Solution', brand: 'Cipla', category: 'First Aid', cats: ['first-aid'], subCategory: 'Antiseptic', type: 'Antiseptic solution', art: 'antiseptic', color: '#A0522D',
    description: '5% w/v povidone-iodine solution for wound cleansing and disinfection.', rating: 4.5, reviews: 764, mrp: 185, price: 149, seller: 'MedicalKart', deliveryDays: 3,
    variantLabel: 'Select Volume', variants: ['100 ml', '500 ml'],
    about: ['Broad-spectrum antiseptic', 'Suitable for minor cuts & burns', 'For external use only'],
    h: ['Povidone-Iodine Solution 5%', 'Brown', 'Liquid', '100 ml'] },
  { id: 130, name: 'Absorbent Cotton Wool Roll', brand: 'Johnson & Johnson', category: 'First Aid', cats: ['first-aid', 'surgical-supplies'], subCategory: 'Cotton', type: 'Absorbent cotton', art: 'cotton', color: '#4DABF7',
    description: 'Soft, pure absorbent cotton for wound care and hygiene.', rating: 4.6, reviews: 1105, mrp: 220, price: 175, seller: 'TW Healthcare', deliveryDays: 2,
    variantLabel: 'Select Weight', variants: ['100 g', '200 g', '400 g'],
    about: ['100% pure cotton', 'Highly absorbent', 'Conforms to IP standards'],
    h: ['Absorbent Cotton Wool IP', 'White', 'Cotton', '200 g'] },
  { id: 131, name: 'Abbott Thyronorm Tablets', brand: 'Abbott', category: 'Medicines', cats: ['medicines'], subCategory: 'Thyroid Care', type: 'Prescription medicine', art: 'tablets', color: '#1C7ED6',
    description: 'Levothyroxine tablets for hypothyroidism. Prescription required.', rating: 4.8, reviews: 6210, mrp: 220, price: 187, seller: 'TW Healthcare', deliveryDays: 2, badge: 'Rx',
    variantLabel: 'Select Strength', variants: ['25 MCG', '50 MCG', '75 MCG', '100 MCG'],
    about: ['Contains Levothyroxine sodium', 'Take on an empty stomach', 'Prescription required at delivery'],
    h: ['Levothyroxine Sodium', 'White', 'Tablet', '100 Tablets'] },
  { id: 132, name: 'Cipla Okacet 10 mg Tablets', brand: 'Cipla', category: 'Medicines', cats: ['medicines'], subCategory: 'Allergy Care', type: 'Antihistamine', art: 'tablets', color: '#F08C2E',
    description: 'Cetirizine tablets for relief from allergy symptoms and sneezing.', rating: 4.5, reviews: 2380, mrp: 25, price: 21, seller: 'MedicalKart', deliveryDays: 3,
    variantLabel: 'Select Strength', variants: ['5 MG', '10 MG'],
    about: ['Relieves sneezing, runny nose & itching', 'Once-daily dosing', 'Strip of 10 tablets'],
    h: ['Cetirizine', 'White', 'Tablet', '10 Tablets'] },
  { id: 133, name: 'Himalaya Liv.52 Tablets', brand: 'Himalaya', category: 'Medicines', cats: ['medicines'], subCategory: 'Liver Care', type: 'Herbal supplement', art: 'tablets', color: '#2F9E44',
    description: 'Clinically proven herbal formulation that supports healthy liver function.', rating: 4.7, reviews: 9870, mrp: 185, price: 166, seller: 'HealthCare Plus', deliveryDays: 3,
    variantLabel: 'Select Pack', variants: ['60 Tablets', '100 Tablets'],
    about: ['Ayurvedic liver care formula', 'Supports appetite and digestion', 'Suitable for long-term use'],
    h: ['Herbal Liver Tonic', 'Brown', 'Tablet', '100 Tablets'] },
  { id: 134, name: '3M Littmann Classic III Stethoscope', brand: '3M', category: 'Diagnostic Equipment', cats: ['diagnostic-equipment', 'medical-devices'], subCategory: 'Stethoscopes', type: 'Stethoscope', art: 'stethoscope', color: '#1F2A44',
    description: 'Dual-sided tunable diaphragm for high acoustic performance.', rating: 4.9, reviews: 1740, mrp: 11200, price: 8999, seller: 'TW Healthcare', deliveryDays: 3, badge: 'Premium',
    variantLabel: 'Select Colour', variants: ['Black', 'Navy', 'Burgundy', 'Ceil Blue'],
    about: ['Tunable diaphragms on both sides', 'Next-generation tubing, latex-free', '5-year warranty'],
    h: ['Acoustic Stethoscope', 'Black', 'Stainless Steel & PVC', '1 Stethoscope', 'USA'] },
  { id: 135, name: '3M 8210 N95 Respirator Mask', brand: '3M', category: 'Personal Care', cats: ['personal-care'], subCategory: 'Masks', type: 'Respirator mask', art: 'mask', color: '#F1F3F5',
    description: 'NIOSH-approved N95 respirator with 95% filtration efficiency.', rating: 4.6, reviews: 2950, mrp: 850, price: 649, seller: 'SafeMed Supplies', deliveryDays: 3,
    variantLabel: 'Select Pack', variants: ['Pack of 5', 'Pack of 10', 'Pack of 20'],
    about: ['≥95% filtration efficiency', 'Adjustable nose clip', 'Braided comfort headbands'],
    h: ['N95 Respirator', 'White', 'Polypropylene', '10 Masks', 'USA'] },
  { id: 136, name: 'Himalaya PureHands Hand Sanitizer', brand: 'Himalaya', category: 'Personal Care', cats: ['personal-care'], subCategory: 'Sanitizers', type: 'Hand sanitizer', art: 'sanitizer', color: '#69DB7C',
    description: 'Alcohol-based sanitizer with neem and aloe vera — kills 99.9% germs.', rating: 4.4, reviews: 1320, mrp: 250, price: 199, seller: 'MedicalKart', deliveryDays: 2,
    variantLabel: 'Select Volume', variants: ['100 ml', '250 ml', '500 ml'],
    about: ['70% alcohol formula', 'Enriched with neem & aloe', 'Non-sticky, quick-drying'],
    h: ['Hand Sanitizer', 'Green', 'Gel', '500 ml'] },
  { id: 137, name: 'Online Doctor Consultation', brand: 'Apollo', category: 'Doctor Consultation', cats: ['doctor-consultation'], subCategory: 'Consult a Doctor', type: 'Teleconsultation service', art: 'doctor', color: '#1098AD',
    description: 'Video consult with a verified doctor within 15 minutes, 24x7.', rating: 4.8, reviews: 12450, mrp: 699, price: 349, seller: 'TW Healthcare', deliveryDays: 0, badge: 'Service', imageCount: 4,
    variantLabel: 'Select Specialist', variants: ['General Physician', 'Diabetologist', 'Cardiologist', 'Dermatologist'],
    about: ['Consult within 15 minutes', 'Free follow-up for 7 days', 'Digital prescription on WhatsApp'],
    h: ['Online Medical Consultation', 'N/A', 'Digital Service', '1 Consultation'] },
  { id: 138, name: 'Specialist Appointment Booking', brand: 'Medtronic', category: 'Doctor Consultation', cats: ['doctor-consultation'], subCategory: 'Book an Appointment', type: 'In-clinic appointment', art: 'doctor', color: '#364FC7',
    description: 'Book an in-clinic appointment with top specialists near you.', rating: 4.6, reviews: 3120, mrp: 999, price: 599, seller: 'HealthCare Plus', deliveryDays: 1, imageCount: 4,
    variantLabel: 'Select Slot', variants: ['Morning', 'Afternoon', 'Evening'],
    about: ['Priority slot confirmation', 'Reschedule up to 2 hours before', 'Reminder via SMS'],
    h: ['Clinic Appointment', 'N/A', 'Service', '1 Appointment'] },
  { id: 139, name: 'Medicine Consultation with Pharmacist', brand: 'Cipla', category: 'Doctor Consultation', cats: ['doctor-consultation', 'medicines'], subCategory: 'Medicine Consultation', type: 'Pharmacist consultation', art: 'doctor', color: '#2F9E44',
    description: 'Get dosage, interactions and substitutes explained by a pharmacist.', rating: 4.5, reviews: 860, mrp: 299, price: 149, seller: 'MedicalKart', deliveryDays: 0, imageCount: 4,
    about: ['Certified pharmacists', 'Chat or voice call', 'Medicine reminder plan included'],
    h: ['Medicine Consultation', 'N/A', 'Service', '1 Session'] }
].map(twProduct);

function twGetProduct(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}
function twCategory(slug) {
  return CATEGORIES.find(c => c.slug === slug);
}

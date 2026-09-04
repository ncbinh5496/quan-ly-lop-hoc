/**
 * High-fidelity Vector Chibi Avatar Illustration Generator
 * Designed specifically for Primary School Students (Học sinh tiểu học)
 * Directly inspired by the provided reference images:
 *  - Reference 1: Chibi girl with wavy violet hair, ahoge curl, pink cat hairclip, pink cardigan, sailor collar, red ribbon, orange backpack.
 *  - Reference 2: Chibi boy scholar with glossy black layered hair, big round glasses, sparkling hazel eyes, white uniform blazer, black bowtie, holding green clover book.
 */

export interface ChibiStyleOptions {
  gender?: 'Nam' | 'Nữ';
  theme?: 'scholar-boy' | 'cardigan-girl' | 'classic-cap-boy' | 'pigtail-girl' | 'blazer-girl' | 'hoodie-boy';
  hairColor?: string;
  hairStyle?: 'boy-layered' | 'boy-short' | 'boy-cap' | 'girl-wavy-cat' | 'girl-pigtails' | 'girl-cap' | 'girl-bob';
  hasCap?: boolean;
  capColor?: string;
  backpackColor?: string;
  accessory?: 'none' | 'glasses' | 'cat-clip' | 'book' | 'star' | 'medal' | 'flower' | 'crown';
  bgGradient?: [string, string];
  expression?: 'happy' | 'smile' | 'surprised' | 'wink' | 'proud';
  eyeColor?: string;
}

/**
 * Generates the Signature Chibi Girl (Inspired by Reference Image 1)
 */
export function generateChibiGirlCardiganSvg(options?: {
  bgGradient?: [string, string];
  jacketColor?: string;
  hairColor?: string;
  hasCatClip?: boolean;
  expression?: 'happy' | 'smile' | 'wink';
  backpackColor?: string;
}): string {
  const bg1 = options?.bgGradient?.[0] || '#ffd1dc';
  const bg2 = options?.bgGradient?.[1] || '#ff9a9e';
  const jacketColor = options?.jacketColor || '#fca5a5';
  const hairColor = options?.hairColor || '#4338ca'; // Deep violet/indigo hair like reference
  const backpackColor = options?.backpackColor || '#fb923c'; // Vibrant orange backpack

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <defs>
    <linearGradient id="bgG1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
    <linearGradient id="hairGradG1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#312e81"/>
    </linearGradient>
    <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fda4af"/>
      <stop offset="100%" stop-color="#f43f5e"/>
    </linearGradient>
    <filter id="chibiShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- Circular Badge Background -->
  <circle cx="80" cy="80" r="76" fill="url(#bgG1)" stroke="#ffffff" stroke-width="4"/>
  <circle cx="80" cy="80" r="71" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.7"/>

  <!-- Background Sparkles -->
  <path d="M 26 34 Q 30 34 30 30 Q 30 34 34 34 Q 30 34 30 38 Q 30 34 26 34" fill="#ffffff" opacity="0.9"/>
  <path d="M 132 40 Q 135 40 135 37 Q 135 40 138 40 Q 135 40 135 43 Q 135 40 132 40" fill="#ffffff" opacity="0.9"/>
  <circle cx="134" cy="80" r="2.5" fill="#ffffff" opacity="0.7"/>
  <circle cx="24" cy="84" r="2.5" fill="#ffffff" opacity="0.7"/>

  <!-- Orange Backpack (Back side) -->
  <g id="orangeBackpack">
    <ellipse cx="120" cy="118" rx="22" ry="26" fill="${backpackColor}" stroke="#c2410c" stroke-width="2" filter="url(#chibiShadow)"/>
    <path d="M 112 100 C 125 100 134 110 134 125" stroke="#fed7aa" stroke-width="3" fill="none" stroke-linecap="round"/>
    <rect x="118" y="112" width="16" height="12" rx="3" fill="#ea580c"/>
  </g>

  <!-- Wavy Violet Hair (Back Layer) -->
  <g id="hairBack">
    <path d="M 32 60 C 14 80 16 115 36 128 C 42 132 48 120 44 105 C 40 90 40 75 42 62 Z" fill="url(#hairGradG1)"/>
    <path d="M 128 60 C 146 80 144 115 124 128 C 118 132 112 120 116 105 C 120 90 120 75 118 62 Z" fill="url(#hairGradG1)"/>
  </g>

  <!-- Shoulders & Pink Cardigan Uniform -->
  <g id="bodySection">
    <!-- Pink Cardigan / Jacket -->
    <path d="M 44 126 C 46 114 62 110 80 110 C 98 110 114 114 116 126 C 118 142 120 158 120 160 L 40 160 C 40 158 42 142 44 126 Z" fill="url(#jacketGrad)" filter="url(#chibiShadow)"/>
    
    <!-- White Sailor Collar -->
    <path d="M 80 116 L 62 112 L 66 128 L 80 122 L 94 128 L 98 112 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2"/>
    <path d="M 66 116 L 94 116" stroke="#f43f5e" stroke-width="1.5" fill="none"/>

    <!-- Red Ribbon Bow -->
    <g transform="translate(80, 124)">
      <circle cx="0" cy="0" r="3.5" fill="#be123c"/>
      <path d="M 0 0 C -6 -6 -12 2 -4 5 Z" fill="#e11d48"/>
      <path d="M 0 0 C 6 -6 12 2 4 5 Z" fill="#e11d48"/>
      <path d="M -2 2 L -6 12 L -2 10 L 0 4" fill="#be123c"/>
      <path d="M 2 2 L 6 12 L 2 10 L 0 4" fill="#be123c"/>
    </g>

    <!-- Orange Backpack Strap (Left Front) -->
    <path d="M 52 114 L 46 160" stroke="${backpackColor}" stroke-width="7" stroke-linecap="round"/>
    <path d="M 52 114 L 46 160" stroke="#ffedd5" stroke-width="1.5" stroke-linecap="round"/>
  </g>

  <!-- Chibi Head Base -->
  <g id="head">
    <!-- Ears -->
    <circle cx="36" cy="74" r="9" fill="#ffeedb"/>
    <circle cx="36" cy="74" r="5" fill="#fecdd3" opacity="0.6"/>
    <circle cx="124" cy="74" r="9" fill="#ffeedb"/>
    <circle cx="124" cy="74" r="5" fill="#fecdd3" opacity="0.6"/>

    <!-- Chubby Face -->
    <path d="M 38 68 C 38 42 58 36 80 36 C 102 36 122 42 122 68 C 122 95 108 108 80 108 C 52 108 38 95 38 68 Z" fill="#ffeedb"/>

    <!-- Rosy Blushing Cheeks -->
    <ellipse cx="48" cy="84" rx="9" ry="6" fill="#ff6584" opacity="0.45"/>
    <ellipse cx="112" cy="84" rx="9" ry="6" fill="#ff6584" opacity="0.45"/>

    <!-- Sweet Chibi Mouth -->
    <path d="M 74 88 Q 80 94 86 88" stroke="#d94668" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M 76 89 Q 80 93 84 89 Z" fill="#f43f5e" opacity="0.7"/>

    <!-- Sparkling Anime Dotted Eyes -->
    <!-- Left Eye -->
    <ellipse cx="56" cy="73" rx="7" ry="10" fill="#1e1b4b"/>
    <circle cx="53" cy="69" r="3.2" fill="#ffffff"/>
    <circle cx="58" cy="77" r="1.5" fill="#ffffff"/>
    <path d="M 50 63 Q 57 60 64 64" stroke="#1e1b4b" stroke-width="2.2" stroke-linecap="round" fill="none"/>

    <!-- Right Eye -->
    <ellipse cx="104" cy="73" rx="7" ry="10" fill="#1e1b4b"/>
    <circle cx="101" cy="69" r="3.2" fill="#ffffff"/>
    <circle cx="106" cy="77" r="1.5" fill="#ffffff"/>
    <path d="M 96 64 Q 103 60 110 63" stroke="#1e1b4b" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  </g>

  <!-- Hair Front & Ahoge Curl -->
  <g id="hairFront">
    <!-- Top Hair Volume -->
    <path d="M 38 48 C 38 20 60 16 80 16 C 100 16 122 20 122 48 C 114 36 96 42 80 36 C 64 42 46 36 38 48 Z" fill="url(#hairGradG1)"/>
    
    <!-- Signature Ahoge (Top Curl) -->
    <path d="M 80 18 C 76 6 88 2 92 8 C 96 14 86 16 80 18 Z" fill="#4338ca"/>

    <!-- Wavy Bangs -->
    <path d="M 40 60 C 44 40 56 36 78 36 C 82 46 88 56 94 48 C 102 38 114 42 120 60 C 112 50 100 52 90 48 C 78 55 60 52 40 60 Z" fill="url(#hairGradG1)"/>
    <path d="M 52 44 C 56 54 62 58 66 56 C 62 50 60 44 52 44 Z" fill="#312e81"/>

    <!-- Signature Pink Kitten/Cat Hairclip (Left Side) -->
    <g transform="translate(106, 36) rotate(15)">
      <!-- Cat Head Base -->
      <path d="M 0 0 C -6 0 -10 -4 -10 -9 C -10 -14 -6 -18 0 -18 C 6 -18 10 -14 10 -9 C 10 -4 6 0 0 0 Z" fill="#fda4af" stroke="#f43f5e" stroke-width="1.2"/>
      <!-- Cat Ears -->
      <polygon points="-8,-14 -12,-22 -4,-18" fill="#fda4af" stroke="#f43f5e" stroke-width="1.2"/>
      <polygon points="8,-14 12,-22 4,-18" fill="#fda4af" stroke="#f43f5e" stroke-width="1.2"/>
      <polygon points="-8,-15 -10,-19 -5,-17" fill="#f43f5e"/>
      <polygon points="8,-15 10,-19 5,-17" fill="#f43f5e"/>
      <!-- Cat Face -->
      <circle cx="-3" cy="-10" r="1" fill="#475569"/>
      <circle cx="3" cy="-10" r="1" fill="#475569"/>
      <circle cx="0" cy="-8" r="0.8" fill="#f43f5e"/>
      <path d="M -2 -7 Q 0 -5 2 -7" stroke="#475569" stroke-width="0.8" fill="none"/>
    </g>
  </g>
</svg>`;
}

/**
 * Generates the Signature Chibi Scholar Boy (Inspired by Reference Image 2)
 */
export function generateChibiBoyScholarSvg(options?: {
  bgGradient?: [string, string];
  glassesColor?: string;
  hairColor?: string;
  blazerColor?: string;
  expression?: 'happy' | 'smile' | 'proud' | 'surprised';
  holdingBook?: boolean;
}): string {
  const bg1 = options?.bgGradient?.[0] || '#fef08a';
  const bg2 = options?.bgGradient?.[1] || '#ca8a04';
  const glassesColor = options?.glassesColor || '#0f172a';
  const hairColor = options?.hairColor || '#1e1b4b';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <defs>
    <linearGradient id="bgBoyG2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
    <linearGradient id="hairGradBoy" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="blazerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#15803d"/>
      <stop offset="100%" stop-color="#14532d"/>
    </linearGradient>
    <filter id="scholarShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- Circular Badge Background -->
  <circle cx="80" cy="80" r="76" fill="url(#bgBoyG2)" stroke="#ffffff" stroke-width="4"/>
  <circle cx="80" cy="80" r="71" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.6"/>

  <!-- Academic Background Motifs -->
  <g opacity="0.85">
    <!-- Star Sparkles -->
    <path d="M 28 32 Q 32 32 32 28 Q 32 32 36 32 Q 32 32 32 36 Q 32 32 28 32" fill="#ffffff"/>
    <path d="M 130 36 Q 133 36 133 33 Q 133 36 136 36 Q 133 36 133 39 Q 133 36 130 36" fill="#ffffff"/>
    <!-- Little Four-Leaf Clover in corner -->
    <g transform="translate(132, 68) scale(0.6)">
      <circle cx="-5" cy="0" r="4" fill="#ffffff" opacity="0.9"/>
      <circle cx="5" cy="0" r="4" fill="#ffffff" opacity="0.9"/>
      <circle cx="0" cy="-5" r="4" fill="#ffffff" opacity="0.9"/>
      <circle cx="0" cy="5" r="4" fill="#ffffff" opacity="0.9"/>
    </g>
  </g>

  <!-- Body Section: Classy School Blazer & Black Bowtie -->
  <g id="scholarBody">
    <!-- White Uniform Blazer -->
    <path d="M 44 126 C 46 114 62 110 80 110 C 98 110 114 114 116 126 C 118 142 120 158 120 160 L 40 160 C 40 158 42 142 44 126 Z" fill="url(#blazerGrad)" filter="url(#scholarShadow)"/>
    
    <!-- Dark Lapel / V-Neck Trims -->
    <path d="M 64 112 L 80 134 L 96 112" stroke="#0f172a" stroke-width="2.5" fill="none"/>
    <path d="M 80 134 L 80 160" stroke="#0f172a" stroke-width="1.8"/>

    <!-- Black Bowtie -->
    <g transform="translate(80, 118)">
      <circle cx="0" cy="0" r="3.5" fill="#0f172a"/>
      <polygon points="0,0 -10,-5 -8,5" fill="#1e293b"/>
      <polygon points="0,0 10,-5 8,5" fill="#1e293b"/>
    </g>

    <!-- Buttons -->
    <circle cx="80" cy="142" r="2" fill="#0f172a"/>
    <circle cx="80" cy="152" r="2" fill="#0f172a"/>

    <!-- Holding Green Hardcover Clover Book (Left hand) -->
    <g transform="translate(30, 115) rotate(-8)">
      <!-- Book Body -->
      <rect x="0" y="0" width="30" height="40" rx="3" fill="url(#bookGrad)" stroke="#0f172a" stroke-width="1.5" filter="url(#scholarShadow)"/>
      <rect x="2" y="2" width="4" height="36" rx="1" fill="#166534"/>
      <!-- Golden Clover Emblem on Book -->
      <g transform="translate(16, 20) scale(0.9)">
        <circle cx="-4" cy="0" r="3.2" fill="#facc15"/>
        <circle cx="4" cy="0" r="3.2" fill="#facc15"/>
        <circle cx="0" cy="-4" r="3.2" fill="#facc15"/>
        <circle cx="0" cy="4" r="3.2" fill="#facc15"/>
        <circle cx="0" cy="0" r="2" fill="#eab308"/>
      </g>
      <!-- Chibi Hand Holding Book -->
      <circle cx="30" cy="24" r="5" fill="#ffeedb"/>
    </g>
  </g>

  <!-- Chibi Head Base -->
  <g id="scholarHead">
    <!-- Big Cute Ears -->
    <circle cx="34" cy="74" r="10" fill="#ffeedb"/>
    <circle cx="34" cy="74" r="6" fill="#fecdd3" opacity="0.6"/>
    <circle cx="126" cy="74" r="10" fill="#ffeedb"/>
    <circle cx="126" cy="74" r="6" fill="#fecdd3" opacity="0.6"/>

    <!-- Chubby Face -->
    <path d="M 38 68 C 38 42 58 36 80 36 C 102 36 122 42 122 68 C 122 96 108 108 80 108 C 52 108 38 96 38 68 Z" fill="#ffeedb"/>

    <!-- Soft Rosy Cheeks -->
    <ellipse cx="48" cy="84" rx="8.5" ry="5.5" fill="#ff6584" opacity="0.4"/>
    <ellipse cx="112" cy="84" rx="8.5" ry="5.5" fill="#ff6584" opacity="0.4"/>

    <!-- Cute 'O' / Happy Scholar Mouth -->
    <ellipse cx="80" cy="88" rx="3.5" ry="4.5" fill="#be123c"/>
    <ellipse cx="80" cy="89" rx="2.5" ry="3" fill="#fb7185"/>

    <!-- Tiny Cute Nose -->
    <circle cx="80" cy="80" r="1.5" fill="#f43f5e" opacity="0.5"/>

    <!-- Hazel / Warm Brown Anime Sparkling Eyes -->
    <!-- Left Eye -->
    <ellipse cx="56" cy="72" rx="9" ry="11.5" fill="#451a03"/>
    <ellipse cx="56" cy="76" rx="8" ry="7" fill="#78350f"/>
    <ellipse cx="56" cy="79" rx="6" ry="4" fill="#b45309"/>
    <!-- Large Highlights -->
    <circle cx="53" cy="67" r="4" fill="#ffffff"/>
    <circle cx="60" cy="78" r="2" fill="#ffffff"/>

    <!-- Right Eye -->
    <ellipse cx="104" cy="72" rx="9" ry="11.5" fill="#451a03"/>
    <ellipse cx="104" cy="76" rx="8" ry="7" fill="#78350f"/>
    <ellipse cx="104" cy="79" rx="6" ry="4" fill="#b45309"/>
    <!-- Large Highlights -->
    <circle cx="101" cy="67" r="4" fill="#ffffff"/>
    <circle cx="108" cy="78" r="2" fill="#ffffff"/>

    <!-- Big Round Classy Glasses (Reference 2) -->
    <circle cx="56" cy="72" r="16" fill="none" stroke="${glassesColor}" stroke-width="3"/>
    <circle cx="104" cy="72" r="16" fill="none" stroke="${glassesColor}" stroke-width="3"/>
    <!-- Glasses Bridge -->
    <path d="M 72 72 Q 80 68 88 72" stroke="${glassesColor}" stroke-width="3" fill="none"/>
    <!-- Glasses Temples -->
    <path d="M 40 72 L 32 70" stroke="${glassesColor}" stroke-width="2.5"/>
    <path d="M 120 72 L 128 70" stroke="${glassesColor}" stroke-width="2.5"/>
  </g>

  <!-- Hair: Layered Glossy Black Hair with Highlights & Ahoge Spikes -->
  <g id="scholarHair">
    <!-- Top Hair Volume -->
    <path d="M 36 50 C 36 20 58 14 80 14 C 102 14 124 20 124 50 C 114 36 98 42 80 34 C 62 42 46 36 36 50 Z" fill="url(#hairGradBoy)"/>
    
    <!-- Top Hair Ahoge Tuft -->
    <path d="M 80 16 C 74 4 84 0 88 6 C 92 12 84 14 80 16 Z" fill="#0f172a"/>

    <!-- Layered Fringe Bangs (Framing glasses) -->
    <path d="M 38 60 C 42 40 54 36 78 34 C 84 46 92 54 96 46 C 104 38 116 42 122 60 C 114 48 102 52 92 46 C 80 54 62 50 38 60 Z" fill="url(#hairGradBoy)"/>
    <!-- Center Bang Taper -->
    <path d="M 72 34 C 76 46 80 58 84 56 C 84 48 82 40 72 34 Z" fill="#0f172a"/>
    <path d="M 52 38 C 56 48 60 54 64 52 C 60 44 58 40 52 38 Z" fill="#0f172a"/>
    <path d="M 106 38 C 102 48 98 54 94 52 C 98 44 100 40 106 38 Z" fill="#0f172a"/>

    <!-- Glossy Hair Highlight Sparkles & Streaks -->
    <path d="M 50 28 C 60 22 70 22 76 26" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>
    <path d="M 86 26 C 94 22 104 22 110 28" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>
    <circle cx="56" cy="24" r="1.5" fill="#ffffff" opacity="0.9"/>
    <circle cx="104" cy="24" r="1.5" fill="#ffffff" opacity="0.9"/>
  </g>
</svg>`;
}

/**
 * Standard Universal Chibi Student SVG Generator
 */
export function generateChibiStudentSvg(options: ChibiStyleOptions): string {
  if (options.theme === 'cardigan-girl' || options.hairStyle === 'girl-wavy-cat') {
    return generateChibiGirlCardiganSvg({
      bgGradient: options.bgGradient,
      backpackColor: options.backpackColor,
      hairColor: options.hairColor,
    });
  }

  if (options.theme === 'scholar-boy' || (options.gender === 'Nam' && options.accessory === 'glasses')) {
    return generateChibiBoyScholarSvg({
      bgGradient: options.bgGradient,
      glassesColor: '#0f172a',
      hairColor: options.hairColor,
    });
  }

  const isGirl = options.gender === 'Nữ';
  const hairStyle = options.hairStyle || (isGirl ? 'girl-pigtails' : 'boy-cap');
  const bg1 = options.bgGradient ? options.bgGradient[0] : (isGirl ? '#ff9a9e' : '#38bdf8');
  const bg2 = options.bgGradient ? options.bgGradient[1] : (isGirl ? '#fecfef' : '#0284c7');
  const capColor = options.capColor || '#e11d48'; // Red school cap
  const backpackColor = options.backpackColor || (isGirl ? '#f472b6' : '#38bdf8');
  const skinTone = '#ffeedb';
  const blushTone = '#ff6584';
  const hairColor = options.hairColor || '#2c1e1a';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGradGen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
    <linearGradient id="capGradGen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${capColor}"/>
      <stop offset="100%" stop-color="#9f1239"/>
    </linearGradient>
    <linearGradient id="shirtGradGen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="tieGradGen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#9f1239"/>
    </linearGradient>
    <filter id="shadowGen" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- Circular Badge Background -->
  <circle cx="80" cy="80" r="76" fill="url(#bgGradGen)" stroke="#ffffff" stroke-width="4"/>
  <circle cx="80" cy="80" r="72" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.6"/>

  <!-- Background Sparkles -->
  <path d="M 28 35 Q 32 35 32 31 Q 32 35 36 35 Q 32 35 32 39 Q 32 35 28 35" fill="#ffffff" opacity="0.8"/>
  <path d="M 128 42 Q 131 42 131 39 Q 131 42 134 42 Q 131 42 131 45 Q 131 42 128 42" fill="#ffffff" opacity="0.8"/>
  <circle cx="132" cy="75" r="2.5" fill="#ffffff" opacity="0.6"/>
  <circle cx="26" cy="72" r="2" fill="#ffffff" opacity="0.6"/>

  <!-- Backpack Straps (Behind Body) -->
  <path d="M 44 115 C 40 135 44 150 48 158" stroke="${backpackColor}" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M 116 115 C 120 135 116 150 112 158" stroke="${backpackColor}" stroke-width="10" stroke-linecap="round" fill="none"/>

  <!-- Girl Pigtails (Back Layer) -->
  ${(hairStyle === 'girl-pigtails' || hairStyle === 'girl-cap') ? `
    <!-- Left Pigtail -->
    <path d="M 38 68 C 18 70 12 95 24 112 C 32 120 38 105 38 90 Z" fill="${hairColor}"/>
    <!-- Right Pigtail -->
    <path d="M 122 68 C 142 70 148 95 136 112 C 128 120 122 105 122 90 Z" fill="${hairColor}"/>
    <!-- Pink Ribbon Bows -->
    <g transform="translate(32, 70)">
      <circle cx="0" cy="0" r="4" fill="#fb7185"/>
      <path d="M -2 0 C -8 -6 -10 2 -3 4 Z" fill="#f43f5e"/>
      <path d="M -2 0 C -8 6 -10 -2 -3 -4 Z" fill="#f43f5e"/>
    </g>
    <g transform="translate(128, 70)">
      <circle cx="0" cy="0" r="4" fill="#fb7185"/>
      <path d="M 2 0 C 8 -6 10 2 3 4 Z" fill="#f43f5e"/>
      <path d="M 2 0 C 8 6 10 -2 3 -4 Z" fill="#f43f5e"/>
    </g>
  ` : ''}

  <!-- Shoulders & Primary School Uniform -->
  <g id="bodyGen">
    <!-- Uniform Shirt -->
    <path d="M 46 128 C 48 116 62 112 80 112 C 98 112 112 116 114 128 C 116 142 118 158 118 160 L 42 160 C 42 158 44 142 46 128 Z" fill="url(#shirtGradGen)" filter="url(#shadowGen)"/>
    
    <!-- Backpack Straps (Front Layer) -->
    <path d="M 52 116 L 48 160" stroke="${backpackColor}" stroke-width="7" stroke-linecap="round"/>
    <path d="M 108 116 L 112 160" stroke="${backpackColor}" stroke-width="7" stroke-linecap="round"/>

    <!-- Shirt Collar (Left & Right) -->
    <path d="M 80 118 L 60 114 L 66 130 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2"/>
    <path d="M 80 118 L 100 114 L 94 130 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2"/>
    
    <!-- Red School Necktie / Scarf -->
    <path d="M 76 118 L 84 118 L 86 138 L 80 148 L 74 138 Z" fill="url(#tieGradGen)" filter="url(#shadowGen)"/>
    <circle cx="80" cy="119" r="4" fill="#be123c"/>
  </g>

  <!-- Chibi Head Base -->
  <g id="headGen">
    <!-- Ears -->
    <circle cx="36" cy="76" r="10" fill="${skinTone}"/>
    <circle cx="36" cy="76" r="6" fill="#fecdd3" opacity="0.6"/>
    <circle cx="124" cy="76" r="10" fill="${skinTone}"/>
    <circle cx="124" cy="76" r="6" fill="#fecdd3" opacity="0.6"/>

    <!-- Face Shape (Chubby Chibi Cheeks) -->
    <path d="M 40 70 C 40 45 60 38 80 38 C 100 38 120 45 120 70 C 120 95 106 108 80 108 C 54 108 40 95 40 70 Z" fill="${skinTone}"/>

    <!-- Rosy Blushing Cheeks -->
    <ellipse cx="50" cy="84" rx="9" ry="5.5" fill="${blushTone}" opacity="0.45"/>
    <ellipse cx="110" cy="84" rx="9" ry="5.5" fill="${blushTone}" opacity="0.45"/>

    <!-- Sweet Chibi Mouth -->
    <path d="M 74 88 Q 80 94 86 88" stroke="#d94668" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M 76 89 Q 80 93 84 89 Z" fill="#f43f5e" opacity="0.7"/>

    <!-- Tiny Cute Nose -->
    <circle cx="80" cy="81" r="1.5" fill="#f43f5e" opacity="0.5"/>

    <!-- Big Sparkling Anime Eyes -->
    <!-- Left Eye -->
    <g id="leftEyeGen">
      <ellipse cx="58" cy="74" rx="8" ry="11" fill="#1e1b4b"/>
      <ellipse cx="58" cy="78" rx="7" ry="6" fill="#4338ca"/>
      <!-- Highlights -->
      <circle cx="55" cy="70" r="3.5" fill="#ffffff"/>
      <circle cx="61" cy="79" r="1.8" fill="#ffffff"/>
      <path d="M 52 64 Q 60 62 67 65" stroke="#1e1b4b" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    </g>

    <!-- Right Eye -->
    <g id="rightEyeGen">
      <ellipse cx="102" cy="74" rx="8" ry="11" fill="#1e1b4b"/>
      <ellipse cx="102" cy="78" rx="7" ry="6" fill="#4338ca"/>
      <!-- Highlights -->
      <circle cx="99" cy="70" r="3.5" fill="#ffffff"/>
      <circle cx="105" cy="79" r="1.8" fill="#ffffff"/>
      <path d="M 93 65 Q 100 62 108 64" stroke="#1e1b4b" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    </g>
  </g>

  <!-- Hair & Cap Layers -->
  <g id="hairAndCapGen">
    <!-- Bangs -->
    <path d="M 42 62 C 45 42 60 38 80 38 C 100 38 115 42 118 62 C 110 52 95 56 80 50 C 65 56 50 52 42 62 Z" fill="${hairColor}"/>
    <path d="M 64 48 C 68 58 72 62 76 60 C 72 54 70 48 64 48 Z" fill="${hairColor}"/>
    <path d="M 96 48 C 92 58 88 62 84 60 C 88 54 90 48 96 48 Z" fill="${hairColor}"/>

    ${(options.hasCap || hairStyle === 'boy-cap' || hairStyle === 'girl-cap') ? `
      <!-- Red & White School Cap (Inspired by reference image) -->
      <path d="M 38 48 C 40 20 60 14 80 14 C 100 14 120 20 122 48 Z" fill="url(#capGradGen)"/>
      <path d="M 52 45 C 54 26 66 22 80 22 C 94 22 106 26 108 45 Z" fill="#ffffff"/>
      <path d="M 80 14 L 80 44" stroke="${capColor}" stroke-width="2.5"/>
      <path d="M 36 48 C 42 42 70 38 80 38 C 90 38 118 42 124 48 C 114 55 95 56 80 56 C 65 56 46 55 36 48 Z" fill="${capColor}" filter="url(#shadowGen)"/>
      <path d="M 40 48 C 55 53 70 54 80 54 C 90 54 105 53 120 48" stroke="#ffffff" stroke-width="1.2" fill="none" opacity="0.6"/>
      <circle cx="80" cy="14" r="3.5" fill="#be123c"/>
    ` : `
      <!-- Standard Hair Top -->
      <path d="M 40 50 C 40 24 60 20 80 20 C 100 20 120 24 120 50 Z" fill="${hairColor}"/>
      <!-- Ahoge curl for lively style -->
      <path d="M 80 20 C 76 8 86 4 90 10 C 94 16 86 18 80 20 Z" fill="${hairColor}"/>
    `}

    <!-- Accessories (Optional) -->
    ${options.accessory === 'glasses' ? `
      <!-- Smart Round Glasses -->
      <circle cx="58" cy="74" r="15" fill="none" stroke="#0f172a" stroke-width="2.8"/>
      <circle cx="102" cy="74" r="15" fill="none" stroke="#0f172a" stroke-width="2.8"/>
      <path d="M 73 74 L 87 74" stroke="#0f172a" stroke-width="2.8"/>
    ` : options.accessory === 'star' ? `
      <!-- Star Hairclip -->
      <g transform="translate(108, 48) scale(0.8)">
        <polygon points="10,1 4,19 19,7 1,7 16,19" fill="#facc15" stroke="#eab308" stroke-width="1.5"/>
      </g>
    ` : options.accessory === 'flower' ? `
      <!-- Cute Flower Hairclip -->
      <g transform="translate(48, 44)">
        <circle cx="-4" cy="0" r="4" fill="#f472b6"/>
        <circle cx="4" cy="0" r="4" fill="#f472b6"/>
        <circle cx="0" cy="-4" r="4" fill="#f472b6"/>
        <circle cx="0" cy="4" r="4" fill="#f472b6"/>
        <circle cx="0" cy="0" r="3" fill="#fde047"/>
      </g>
    ` : options.accessory === 'crown' ? `
      <!-- Mini Golden Crown -->
      <path d="M 70 20 L 73 30 L 80 24 L 87 30 L 90 20 L 80 32 Z" fill="#fbbf24" stroke="#f59e0b" stroke-width="1.5" filter="url(#shadowGen)"/>
    ` : ''}
  </g>
</svg>`;
}

export function chibiSvgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

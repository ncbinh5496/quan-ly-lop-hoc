// Chibi & Cute Student Themed Assets, SVG Vectors, and Gradients

export interface ChibiCoverPreset {
  id: string;
  name: string;
  url: string;
  tag: string;
  category: 'chibi-student' | 'classroom' | 'galaxy-nature' | 'art-pastel';
  description?: string;
}

// Generate rich, responsive, beautiful inline SVG banners featuring Chibi Students
export const createChibiStudentSvg = (theme: 'stars' | 'rainbow' | 'space' | 'trophy' | 'library' | 'team'): string => {
  if (theme === 'stars') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="100%" height="100%">
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="40%" stop-color="#818cf8"/>
          <stop offset="80%" stop-color="#f472b6"/>
          <stop offset="100%" stop-color="#fbbf24"/>
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fef08a" stop-opacity="1"/>
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
        </radialGradient>
        <filter id="dropGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      <rect width="1200" height="400" fill="url(#skyGrad)"/>
      
      <!-- Fluffy Cloud Layer -->
      <path d="M-50 350 Q 100 280 250 340 T 550 330 T 850 350 T 1150 330 T 1300 360 L 1300 450 L -50 450 Z" fill="#ffffff" fill-opacity="0.35"/>
      <path d="M0 370 Q 150 310 300 360 T 650 340 T 950 370 T 1250 350 L 1250 450 L 0 450 Z" fill="#ffffff" fill-opacity="0.6"/>

      <!-- Floating Cute Rainbow -->
      <path d="M 700 380 A 250 250 0 0 1 1150 380" fill="none" stroke="#f43f5e" stroke-width="12" stroke-linecap="round" opacity="0.85"/>
      <path d="M 710 380 A 240 240 0 0 1 1140 380" fill="none" stroke="#fb923c" stroke-width="12" stroke-linecap="round" opacity="0.85"/>
      <path d="M 720 380 A 230 230 0 0 1 1130 380" fill="none" stroke="#facc15" stroke-width="12" stroke-linecap="round" opacity="0.85"/>
      <path d="M 730 380 A 220 220 0 0 1 1120 380" fill="none" stroke="#4ade80" stroke-width="12" stroke-linecap="round" opacity="0.85"/>
      <path d="M 740 380 A 210 210 0 0 1 1110 380" fill="none" stroke="#38bdf8" stroke-width="12" stroke-linecap="round" opacity="0.85"/>

      <!-- Shiny Gold Stars & Sparkles -->
      <g filter="url(#dropGlow)">
        <polygon points="150,80 156,98 175,98 160,110 165,128 150,116 135,128 140,110 125,98 144,98" fill="#fde047"/>
        <polygon points="320,60 324,72 338,72 327,81 331,94 320,85 309,94 313,81 302,72 316,72" fill="#fef08a"/>
        <polygon points="980,70 985,85 1002,85 988,96 993,111 980,101 967,111 972,96 958,85 975,85" fill="#fde047"/>
        <polygon points="650,90 654,102 668,102 657,111 661,124 650,115 639,124 643,111 632,102 646,102" fill="#fde047"/>
        <circle cx="240" cy="110" r="4" fill="#ffffff"/>
        <circle cx="850" cy="90" r="5" fill="#ffffff"/>
        <circle cx="520" cy="75" r="3" fill="#ffffff"/>
      </g>

      <!-- CHIBI BOY STUDENT (Left Center) -->
      <g transform="translate(760, 150)">
        <!-- Shadow -->
        <ellipse cx="60" cy="190" rx="45" ry="12" fill="#000000" opacity="0.25"/>
        <!-- Backpack -->
        <rect x="15" y="90" width="30" height="50" rx="10" fill="#3b82f6"/>
        <!-- Body / Uniform -->
        <rect x="35" y="95" width="50" height="60" rx="14" fill="#ffffff"/>
        <path d="M 35 110 L 85 110 L 75 155 L 45 155 Z" fill="#2563eb"/>
        <!-- Red Tie -->
        <polygon points="60,95 65,115 60,130 55,115" fill="#ef4444"/>
        <!-- Legs & Shoes -->
        <rect x="42" y="150" width="14" height="25" fill="#1e3a8a"/>
        <rect x="64" y="150" width="14" height="25" fill="#1e3a8a"/>
        <ellipse cx="49" cy="178" rx="11" ry="7" fill="#0f172a"/>
        <ellipse cx="71" cy="178" rx="11" ry="7" fill="#0f172a"/>
        <!-- Head / Cute Chibi Face -->
        <circle cx="60" cy="65" r="38" fill="#fed7aa"/>
        <!-- Hair (Cute Spiky Boy Hair) -->
        <path d="M 22 55 Q 30 20 60 18 Q 95 20 98 55 Q 90 35 70 38 Q 45 35 22 55 Z" fill="#451a03"/>
        <path d="M 30 35 L 40 50 L 50 35 L 60 50 L 70 35 L 85 45" stroke="#451a03" stroke-width="6" stroke-linecap="round"/>
        <!-- Eyes (Big Sparkling Anime Chibi Eyes) -->
        <ellipse cx="48" cy="65" rx="6" ry="8" fill="#1e1b4b"/>
        <ellipse cx="72" cy="65" rx="6" ry="8" fill="#1e1b4b"/>
        <circle cx="46" cy="62" r="2.5" fill="#ffffff"/>
        <circle cx="70" cy="62" r="2.5" fill="#ffffff"/>
        <!-- Cheeks Blush -->
        <ellipse cx="40" cy="74" rx="6" ry="3.5" fill="#f43f5e" opacity="0.6"/>
        <ellipse cx="80" cy="74" rx="6" ry="3.5" fill="#f43f5e" opacity="0.6"/>
        <!-- Happy Smile -->
        <path d="M 54 75 Q 60 83 66 75" fill="none" stroke="#be123c" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Hand holding Big Star -->
        <circle cx="20" cy="100" r="10" fill="#fed7aa"/>
        <polygon points="15,60 19,72 32,72 22,80 26,92 15,84 4,92 8,80 -2,72 11,72" fill="#facc15" stroke="#eab308" stroke-width="2"/>
      </g>

      <!-- CHIBI GIRL STUDENT (Right Center) -->
      <g transform="translate(930, 140)">
        <!-- Shadow -->
        <ellipse cx="60" cy="200" rx="45" ry="12" fill="#000000" opacity="0.25"/>
        <!-- Twin Tails Pink Bows -->
        <circle cx="15" cy="45" r="18" fill="#78350f"/>
        <circle cx="105" cy="45" r="18" fill="#78350f"/>
        <polygon points="18,45 8,35 8,55" fill="#ec4899"/>
        <polygon points="102,45 112,35 112,55" fill="#ec4899"/>
        <!-- Body / Uniform with Cute Red Scarf -->
        <rect x="35" y="100" width="50" height="55" rx="12" fill="#ffffff"/>
        <path d="M 30 130 L 90 130 L 96 165 L 24 165 Z" fill="#e11d48"/>
        <!-- Legs & White Socks with Red Shoes -->
        <rect x="42" y="160" width="13" height="25" fill="#ffffff"/>
        <rect x="65" y="160" width="13" height="25" fill="#ffffff"/>
        <ellipse cx="48" cy="188" rx="10" ry="7" fill="#e11d48"/>
        <ellipse cx="71" cy="188" rx="10" ry="7" fill="#e11d48"/>
        <!-- Head -->
        <circle cx="60" cy="65" r="38" fill="#fed7aa"/>
        <!-- Bangs Hair -->
        <path d="M 22 55 Q 35 18 60 18 Q 88 18 98 55 Q 85 36 60 40 Q 35 36 22 55 Z" fill="#78350f"/>
        <path d="M 40 40 Q 50 50 60 40 Q 70 50 80 40" fill="#78350f"/>
        <!-- Sparkle Big Eyes -->
        <ellipse cx="48" cy="65" rx="6" ry="8" fill="#4c0519"/>
        <ellipse cx="72" cy="65" rx="6" ry="8" fill="#4c0519"/>
        <circle cx="46" cy="62" r="2.5" fill="#ffffff"/>
        <circle cx="70" cy="62" r="2.5" fill="#ffffff"/>
        <!-- Cheeks Blush -->
        <ellipse cx="38" cy="74" rx="7" ry="4" fill="#fb7185" opacity="0.7"/>
        <ellipse cx="82" cy="74" rx="7" ry="4" fill="#fb7185" opacity="0.7"/>
        <!-- Happy Open Smile -->
        <path d="M 53 74 Q 60 84 67 74 Z" fill="#e11d48"/>
        <!-- Hand V-sign -->
        <circle cx="100" cy="95" r="10" fill="#fed7aa"/>
        <path d="M 100 88 L 103 76 M 104 88 L 110 78" stroke="#fed7aa" stroke-width="4" stroke-linecap="round"/>
      </g>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  if (theme === 'space') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="100%" height="100%">
      <defs>
        <linearGradient id="spaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="35%" stop-color="#312e81"/>
          <stop offset="75%" stop-color="#6b21a8"/>
          <stop offset="100%" stop-color="#c026d3"/>
        </linearGradient>
        <linearGradient id="planetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="400" fill="url(#spaceGrad)"/>
      
      <!-- Planet with Ring -->
      <g transform="translate(1000, 100)">
        <circle cx="0" cy="0" r="55" fill="url(#planetGrad)"/>
        <ellipse cx="0" cy="0" rx="90" ry="20" fill="none" stroke="#e0e7ff" stroke-width="7" opacity="0.7" transform="rotate(-20)"/>
      </g>
      
      <!-- Sparkling Stars & Constellations -->
      <g fill="#ffffff">
        <circle cx="120" cy="60" r="3"/>
        <circle cx="280" cy="110" r="2"/>
        <circle cx="450" cy="40" r="4"/>
        <circle cx="680" cy="85" r="3"/>
        <circle cx="850" cy="45" r="2.5"/>
        <circle cx="920" cy="160" r="3"/>
        <circle cx="750" cy="190" r="4"/>
      </g>
      <polygon points="200,50 205,62 218,62 208,70 212,82 200,74 188,82 192,70 182,62 195,62" fill="#facc15"/>
      <polygon points="580,70 584,80 595,80 586,87 590,97 580,90 570,97 574,87 565,80 576,80" fill="#fde047"/>

      <!-- PENCIL ROCKET with CHIBI ASTRONAUT KID -->
      <g transform="translate(740, 90) rotate(-15)">
        <!-- Rocket Flame -->
        <polygon points="-40,40 -90,30 -50,55 -100,55 -50,65 -90,80 -40,70" fill="#f97316"/>
        <polygon points="-35,45 -70,55 -35,65" fill="#fde047"/>
        <!-- Pencil Body as Rocket -->
        <polygon points="-40,30 -40,80 -20,80 -20,30" fill="#94a3b8"/>
        <rect x="-20" y="30" width="130" height="50" rx="5" fill="#facc15"/>
        <rect x="-20" y="42" width="130" height="8" fill="#eab308"/>
        <rect x="-20" y="60" width="130" height="8" fill="#ca8a04"/>
        <!-- Rocket Tip -->
        <polygon points="110,30 110,80 160,55" fill="#fed7aa"/>
        <polygon points="145,47 160,55 145,63" fill="#1e293b"/>

        <!-- CHIBI ASTRONAUT RIDER -->
        <g transform="translate(30, -35)">
          <!-- Cute Space Helmet -->
          <circle cx="35" cy="30" r="32" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="4"/>
          <ellipse cx="38" cy="30" rx="22" ry="18" fill="#38bdf8" opacity="0.85"/>
          <ellipse cx="44" cy="24" rx="7" ry="4" fill="#ffffff" opacity="0.75"/>
          <!-- Chibi Face inside Visor -->
          <ellipse cx="32" cy="30" rx="3.5" ry="5" fill="#0f172a"/>
          <ellipse cx="46" cy="30" rx="3.5" ry="5" fill="#0f172a"/>
          <path d="M 35 37 Q 39 42 43 37" fill="none" stroke="#e11d48" stroke-width="2"/>
          <!-- Cute Backpack & Flag -->
          <rect x="-10" y="30" width="18" height="25" rx="5" fill="#e2e8f0"/>
          <line x1="-5" y1="30" x2="-5" y2="5" stroke="#ffffff" stroke-width="3"/>
          <polygon points="-5,5 20,12 -5,20" fill="#ef4444"/>
        </g>
      </g>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  if (theme === 'trophy') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="100%" height="100%">
      <defs>
        <linearGradient id="trophyBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f59e0b"/>
          <stop offset="35%" stop-color="#ec4899"/>
          <stop offset="70%" stop-color="#8b5cf6"/>
          <stop offset="100%" stop-color="#3b82f6"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="400" fill="url(#trophyBg)"/>
      
      <!-- Stage & Podium -->
      <path d="M 0 350 L 1200 350 L 1200 400 L 0 400 Z" fill="#ffffff" opacity="0.3"/>
      
      <!-- GIANT GOLD TROPHY with STARS -->
      <g transform="translate(860, 110)">
        <!-- Cup base -->
        <rect x="30" y="190" width="80" height="25" rx="8" fill="#ca8a04"/>
        <rect x="50" y="150" width="40" height="45" fill="#eab308"/>
        <!-- Cup Body -->
        <path d="M 20 50 Q 20 150 70 150 Q 120 150 120 50 Z" fill="#facc15" stroke="#eab308" stroke-width="6"/>
        <!-- Handles -->
        <path d="M 20 65 C -20 65 -20 120 25 120" fill="none" stroke="#facc15" stroke-width="8" stroke-linecap="round"/>
        <path d="M 120 65 C 160 65 160 120 115 120" fill="none" stroke="#facc15" stroke-width="8" stroke-linecap="round"/>
        <!-- Star on Trophy -->
        <polygon points="70,75 74,87 87,87 77,95 81,107 70,99 59,107 63,95 53,87 66,87" fill="#ffffff"/>
      </g>

      <!-- TWO CHEERING CHIBI STUDENTS WITH 10 SCORE -->
      <g transform="translate(680, 150)">
        <!-- Chibi holding Score 10 -->
        <circle cx="50" cy="50" r="32" fill="#fed7aa"/>
        <!-- Hair -->
        <path d="M 20 40 Q 50 15 80 40 Q 70 25 50 28 Q 30 25 20 40 Z" fill="#1e293b"/>
        <!-- Face -->
        <ellipse cx="40" cy="50" rx="5" ry="7" fill="#0f172a"/>
        <ellipse cx="60" cy="50" rx="5" ry="7" fill="#0f172a"/>
        <circle cx="38" cy="48" r="2" fill="#ffffff"/>
        <circle cx="58" cy="48" r="2" fill="#ffffff"/>
        <ellipse cx="32" cy="58" rx="5" ry="3" fill="#f43f5e" opacity="0.6"/>
        <ellipse cx="68" cy="58" rx="5" ry="3" fill="#f43f5e" opacity="0.6"/>
        <path d="M 45 58 Q 50 66 55 58" fill="none" stroke="#e11d48" stroke-width="2.5"/>
        <!-- Body -->
        <rect x="30" y="80" width="40" height="45" rx="10" fill="#3b82f6"/>
        <!-- Score 10 Board -->
        <rect x="-10" y="60" width="35" height="45" rx="6" fill="#ffffff" stroke="#ef4444" stroke-width="3"/>
        <text x="7" y="93" font-family="sans-serif" font-weight="900" font-size="22" fill="#ef4444" text-anchor="middle">10</text>
      </g>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // Default colorful chibi student classroom
  const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="100%" height="100%">
    <defs>
      <linearGradient id="chibiBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#06b6d4"/>
        <stop offset="40%" stop-color="#3b82f6"/>
        <stop offset="80%" stop-color="#8b5cf6"/>
        <stop offset="100%" stop-color="#ec4899"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="400" fill="url(#chibiBg)"/>
    <circle cx="200" cy="100" r="70" fill="#ffffff" opacity="0.15"/>
    <circle cx="600" cy="180" r="120" fill="#ffffff" opacity="0.1"/>
    <circle cx="1050" cy="120" r="90" fill="#ffffff" opacity="0.2"/>
    <path d="M 0 320 Q 300 280 600 320 T 1200 300 L 1200 400 L 0 400 Z" fill="#ffffff" opacity="0.3"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(defaultSvg)}`;
};

// Rich curated list of Chibi Student & Bright Classroom Covers
export const CHIBI_STUDENT_COVERS: ChibiCoverPreset[] = [
  {
    id: 'chibi-bup-mang-non',
    name: 'Búp Măng Non Chibi',
    url: createChibiStudentSvg('stars'),
    tag: 'Chibi Học Sinh',
    category: 'chibi-student',
    description: 'Học sinh chibi dễ thương rạng rỡ cùng cầu vồng và sao vàng'
  },
  {
    id: 'chibi-phi-hanh-gia',
    name: 'Phi Hành Gia Nhí Chibi',
    url: createChibiStudentSvg('space'),
    tag: 'Chibi Vũ Trụ',
    category: 'chibi-student',
    description: 'Bé phi hành gia chibi cưỡi tên lửa bút chì chinh phục tri thức'
  },
  {
    id: 'chibi-diem-10-vinh-quang',
    name: 'Hoa Điểm 10 Chibi',
    url: createChibiStudentSvg('trophy'),
    tag: 'Chibi Điểm 10',
    category: 'chibi-student',
    description: 'Học sinh chibi hoan hô cúp vàng và bảng điểm 10 rực rỡ'
  },
  {
    id: 'chibi-cute-classroom-3d',
    name: 'Lớp Học Hạnh Phúc 3D',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1920&q=80',
    tag: 'Học Sinh Đáng Yêu',
    category: 'chibi-student',
    description: 'Những nụ cười trẻ thơ vui vẻ trong giờ học tập'
  },
  {
    id: 'chibi-colorful-study',
    name: 'Sắc Màu Bé Ngoan',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1920&q=80',
    tag: 'Thiếu Nhi Tươi Sáng',
    category: 'chibi-student',
    description: 'Học sinh hào hứng cùng thế giới sắc màu và tri thức'
  },
  {
    id: 'chibi-rainbow-kids',
    name: 'Đôi Bạn Cùng Tiến Chibi',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1920&q=80',
    tag: 'Bạn Bè Thân Thiết',
    category: 'chibi-student',
    description: 'Tình bạn tuổi thơ trong sáng và tinh thần cùng tiến bộ'
  },
  {
    id: 'chibi-pastel-art',
    name: 'Xứ Sở Bút Màu Chibi',
    url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1920&q=80',
    tag: 'Bút Màu Sáng Tạo',
    category: 'art-pastel',
    description: 'Thế giới hội họa và đồ dùng học tập lung linh sắc màu'
  },
  {
    id: 'classroom-wide',
    name: 'Lớp Học Thân Yêu',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1920&q=80',
    tag: 'Trường Học',
    category: 'classroom'
  },
  {
    id: 'school-chalkboard',
    name: 'Bảng Đen Tri Thức',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1920&q=80',
    tag: 'Bảng Phấn',
    category: 'classroom'
  },
  {
    id: 'galaxy-stars',
    name: 'Ngân Hà Sao Sáng',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
    tag: 'Vũ Trụ',
    category: 'galaxy-nature'
  },
  {
    id: 'nature-morning',
    name: 'Nắng Ban Mai Tươi Mát',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1920&q=80',
    tag: 'Thiên Nhiên',
    category: 'galaxy-nature'
  },
  {
    id: 'graduation-success',
    name: 'Chinh Phục Ước Mơ',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80',
    tag: 'Vinh Quang',
    category: 'classroom'
  }
];

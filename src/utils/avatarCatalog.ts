import { 
  generateChibiStudentSvg, 
  generateChibiGirlCardiganSvg, 
  generateChibiBoyScholarSvg, 
  chibiSvgToDataUrl, 
  ChibiStyleOptions 
} from './chibiAvatars';

export interface AvatarPreset {
  id: string;
  name: string;
  category: 'boys' | 'girls' | 'sao-do' | 'animals' | 'nature';
  emoji: string;
  bg: string;
  customSvg?: string;
  gradient?: string;
  isFeatured?: boolean;
}

export const AVATAR_CATEGORIES = [
  { id: 'all', label: '✨ Tất cả Chibi' },
  { id: 'boys', label: '👦 Học sinh Nam' },
  { id: 'girls', label: '👧 Học sinh Nữ' },
  { id: 'sao-do', label: '🎖️ Đội viên & Sao Đỏ' },
  { id: 'animals', label: '🐾 Linh vật Chibi' },
  { id: 'nature', label: '🌟 Biểu tượng Vinh Quang' },
];

export const PRESET_AVATARS: AvatarPreset[] = [
  // ===================== HỌC SINH NỮ (CHIBI GIRLS) =====================
  { 
    id: 'girl-cardigan-cat', 
    name: 'Bé gái Áo khoác hồng Kẹp Mèo', 
    category: 'girls', 
    emoji: '🐱', 
    bg: '#fda4af',
    isFeatured: true,
    customSvg: generateChibiGirlCardiganSvg({
      bgGradient: ['#fbcfe8', '#fda4af'],
      jacketColor: '#f43f5e',
      backpackColor: '#fb923c',
      hasCatClip: true
    })
  },
  { 
    id: 'girl-cardigan-orange', 
    name: 'Bé gái Tóc tím Balo Cam rạng rỡ', 
    category: 'girls', 
    emoji: '🎒', 
    bg: '#fed7aa',
    isFeatured: true,
    customSvg: generateChibiGirlCardiganSvg({
      bgGradient: ['#fed7aa', '#ea580c'],
      jacketColor: '#fb7185',
      backpackColor: '#ea580c',
      hasCatClip: true
    })
  },
  { 
    id: 'girl-scholar-blazer', 
    name: 'Bé gái Kính tròn Đồng phục Vest', 
    category: 'girls', 
    emoji: '📖', 
    bg: '#fef08a',
    isFeatured: true,
    customSvg: generateChibiStudentSvg({ 
      gender: 'Nữ', 
      hairStyle: 'girl-pigtails', 
      accessory: 'glasses', 
      bgGradient: ['#fef08a', '#eab308'] 
    })
  },
  { 
    id: 'girl-1', 
    name: 'Cô bé Cột tóc 2 bên Nơ hồng', 
    category: 'girls', 
    emoji: '👧', 
    bg: '#ec4899',
    customSvg: generateChibiStudentSvg({ gender: 'Nữ', hairStyle: 'girl-pigtails', backpackColor: '#f472b6', bgGradient: ['#f472b6', '#ec4899'] })
  },
  { 
    id: 'girl-2', 
    name: 'Cô bé Đội mũ đỏ Nơ xinh', 
    category: 'girls', 
    emoji: '🎀', 
    bg: '#f43f5e',
    customSvg: generateChibiStudentSvg({ gender: 'Nữ', hairStyle: 'girl-cap', hasCap: true, backpackColor: '#fb7185', bgGradient: ['#fb7185', '#e11d48'] })
  },
  { 
    id: 'girl-3', 
    name: 'Cô bé Cài hoa Dễ thương', 
    category: 'girls', 
    emoji: '🌸', 
    bg: '#a855f7',
    customSvg: generateChibiStudentSvg({ gender: 'Nữ', hairStyle: 'girl-pigtails', accessory: 'flower', backpackColor: '#c084fc', bgGradient: ['#c084fc', '#9333ea'] })
  },
  { 
    id: 'girl-4', 
    name: 'Cô bé Đeo kính Chăm ngoan', 
    category: 'girls', 
    emoji: '👩‍🏫', 
    bg: '#8b5cf6',
    customSvg: generateChibiStudentSvg({ gender: 'Nữ', hairStyle: 'girl-pigtails', accessory: 'glasses', backpackColor: '#a78bfa', bgGradient: ['#a78bfa', '#7c3aed'] })
  },
  { 
    id: 'girl-5', 
    name: 'Cô bé Ngôi sao Lấp lánh', 
    category: 'girls', 
    emoji: '⭐', 
    bg: '#fbbf24',
    customSvg: generateChibiStudentSvg({ gender: 'Nữ', hairStyle: 'girl-pigtails', accessory: 'star', backpackColor: '#f59e0b', bgGradient: ['#fde047', '#d97706'] })
  },
  { 
    id: 'girl-6', 
    name: 'Cô bé Công chúa Nhí', 
    category: 'girls', 
    emoji: '👸', 
    bg: '#f472b6',
    customSvg: generateChibiStudentSvg({ gender: 'Nữ', hairStyle: 'girl-pigtails', accessory: 'crown', backpackColor: '#db2777', bgGradient: ['#fbcfe8', '#db2777'] })
  },
  { 
    id: 'girl-7', 
    name: 'Cô bé Nụ cười Tươi tắn', 
    category: 'girls', 
    emoji: '🥰', 
    bg: '#10b981',
    customSvg: generateChibiStudentSvg({ gender: 'Nữ', hairStyle: 'girl-pigtails', backpackColor: '#34d399', bgGradient: ['#6ee7b7', '#059669'] })
  },
  { 
    id: 'girl-8', 
    name: 'Cô bé Họa sĩ Nhí', 
    category: 'girls', 
    emoji: '🎨', 
    bg: '#06b6d4',
    customSvg: generateChibiStudentSvg({ gender: 'Nữ', hairStyle: 'girl-cap', capColor: '#ec4899', backpackColor: '#22d3ee', bgGradient: ['#67e8f9', '#0891b2'] })
  },

  // ===================== HỌC SINH NAM (CHIBI BOYS) =====================
  { 
    id: 'boy-scholar-book', 
    name: 'Cậu bé Kính tròn Cầm sách Tri thức', 
    category: 'boys', 
    emoji: '📚', 
    bg: '#fef08a',
    isFeatured: true,
    customSvg: generateChibiBoyScholarSvg({
      bgGradient: ['#fef08a', '#eab308'],
      glassesColor: '#0f172a',
      expression: 'happy',
      holdingBook: true
    })
  },
  { 
    id: 'boy-scholar-clover', 
    name: 'Cậu bé Học giả Cỏ 4 lá May mắn', 
    category: 'boys', 
    emoji: '🍀', 
    bg: '#86efac',
    isFeatured: true,
    customSvg: generateChibiBoyScholarSvg({
      bgGradient: ['#bbf7d0', '#16a34a'],
      glassesColor: '#0f172a',
      expression: 'smile',
      holdingBook: true
    })
  },
  { 
    id: 'boy-cardigan-jog', 
    name: 'Cậu bé Năng động Balo Cam', 
    category: 'boys', 
    emoji: '🏃‍♂️', 
    bg: '#fdba74',
    isFeatured: true,
    customSvg: generateChibiStudentSvg({ 
      gender: 'Nam', 
      hairStyle: 'boy-short', 
      backpackColor: '#ea580c', 
      bgGradient: ['#fed7aa', '#f97316'] 
    })
  },
  { 
    id: 'boy-1', 
    name: 'Cậu bé Đội mũ đỏ Balo xanh', 
    category: 'boys', 
    emoji: '👦', 
    bg: '#38bdf8',
    customSvg: generateChibiStudentSvg({ gender: 'Nam', hairStyle: 'boy-cap', hasCap: true, backpackColor: '#0284c7', bgGradient: ['#38bdf8', '#0284c7'] })
  },
  { 
    id: 'boy-2', 
    name: 'Cậu bé Đeo kính Tri thức', 
    category: 'boys', 
    emoji: '🤓', 
    bg: '#6366f1',
    customSvg: generateChibiStudentSvg({ gender: 'Nam', hairStyle: 'boy-short', accessory: 'glasses', backpackColor: '#4f46e5', bgGradient: ['#818cf8', '#4f46e5'] })
  },
  { 
    id: 'boy-3', 
    name: 'Cậu bé Vui tươi Tinh nghịch', 
    category: 'boys', 
    emoji: '😄', 
    bg: '#10b981',
    customSvg: generateChibiStudentSvg({ gender: 'Nam', hairStyle: 'boy-short', backpackColor: '#059669', bgGradient: ['#34d399', '#059669'] })
  },
  { 
    id: 'boy-4', 
    name: 'Cậu bé Thể thao Năng động', 
    category: 'boys', 
    emoji: '🏃‍♂️', 
    bg: '#f59e0b',
    customSvg: generateChibiStudentSvg({ gender: 'Nam', hairStyle: 'boy-cap', capColor: '#ea580c', backpackColor: '#d97706', bgGradient: ['#fbbf24', '#d97706'] })
  },
  { 
    id: 'boy-5', 
    name: 'Cậu bé Bác học Nhí', 
    category: 'boys', 
    emoji: '🧑‍🏫', 
    bg: '#8b5cf6',
    customSvg: generateChibiStudentSvg({ gender: 'Nam', hairStyle: 'boy-short', accessory: 'star', backpackColor: '#7c3aed', bgGradient: ['#a78bfa', '#7c3aed'] })
  },
  { 
    id: 'boy-6', 
    name: 'Cậu bé Ngôi sao Sáng tạo', 
    category: 'boys', 
    emoji: '🌟', 
    bg: '#ec4899',
    customSvg: generateChibiStudentSvg({ gender: 'Nam', hairStyle: 'boy-cap', backpackColor: '#db2777', bgGradient: ['#f472b6', '#db2777'] })
  },
  { 
    id: 'boy-7', 
    name: 'Cậu bé Tự tin Vươn cao', 
    category: 'boys', 
    emoji: '😎', 
    bg: '#06b6d4',
    customSvg: generateChibiStudentSvg({ gender: 'Nam', hairStyle: 'boy-short', backpackColor: '#0891b2', bgGradient: ['#22d3ee', '#0891b2'] })
  },
  { 
    id: 'boy-8', 
    name: 'Cậu bé Quán quân Nhí', 
    category: 'boys', 
    emoji: '🏆', 
    bg: '#eab308',
    customSvg: generateChibiStudentSvg({ gender: 'Nam', hairStyle: 'boy-short', accessory: 'crown', backpackColor: '#ca8a04', bgGradient: ['#fde047', '#ca8a04'] })
  },

  // ===================== ĐỘI VIÊN & SAO ĐỎ =====================
  { 
    id: 'sao-do-1', 
    name: 'Đội viên Gương mẫu', 
    category: 'sao-do', 
    emoji: '🎖️', 
    bg: '#e11d48',
    customSvg: generateChibiStudentSvg({ gender: 'Nam', hairStyle: 'boy-cap', capColor: '#e11d48', accessory: 'star', bgGradient: ['#f43f5e', '#be123c'] })
  },
  { 
    id: 'sao-do-2', 
    name: 'Sao Đỏ Chăm chỉ', 
    category: 'sao-do', 
    emoji: '⭐', 
    bg: '#dc2626',
    customSvg: generateChibiStudentSvg({ gender: 'Nữ', hairStyle: 'girl-cap', capColor: '#dc2626', accessory: 'star', bgGradient: ['#ef4444', '#b91c1c'] })
  },
  { 
    id: 'sao-do-3', 
    name: 'Lớp trưởng Trách nhiệm', 
    category: 'sao-do', 
    emoji: '👑', 
    bg: '#d97706',
    customSvg: generateChibiBoyScholarSvg({ bgGradient: ['#f59e0b', '#b45309'] })
  },
  { 
    id: 'sao-do-4', 
    name: 'Lớp phó Học tập', 
    category: 'sao-do', 
    emoji: '📖', 
    bg: '#7c3aed',
    customSvg: generateChibiGirlCardiganSvg({ bgGradient: ['#c084fc', '#7e22ce'] })
  },

  // ===================== LINH VẬT CHIBI =====================
  { id: 'animal-panda', name: 'Gấu Trúc thông minh', category: 'animals', emoji: '🐼', bg: '#64748b' },
  { id: 'animal-cat', name: 'Mèo con tinh nghịch', category: 'animals', emoji: '🐱', bg: '#fb923c' },
  { id: 'animal-dog', name: 'Cún con trung thành', category: 'animals', emoji: '🐶', bg: '#facc15' },
  { id: 'animal-rabbit', name: 'Thỏ trắng nhanh nhẹn', category: 'animals', emoji: '🐰', bg: '#f472b6' },
  { id: 'animal-dino', name: 'Khủng long thân thiện', category: 'animals', emoji: '🦖', bg: '#16a34a' },
  { id: 'animal-penguin', name: 'Cánh cụt chăm chỉ', category: 'animals', emoji: '🐧', bg: '#0284c7' },
  { id: 'animal-bear', name: 'Gấu Nâu ấm áp', category: 'animals', emoji: '🐻', bg: '#92400e' },
  { id: 'animal-unicorn', name: 'Kỳ lân phép thuật', category: 'animals', emoji: '🦄', bg: '#c084fc' },

  // ===================== THIÊN NHIÊN & BIỂU TƯỢNG =====================
  { id: 'nature-sun', name: 'Mặt trời Tỏa sáng', category: 'nature', emoji: '☀️', bg: '#f59e0b' },
  { id: 'nature-star', name: 'Ngôi sao Vinh quang', category: 'nature', emoji: '⭐', bg: '#eab308' },
  { id: 'nature-rainbow', name: 'Cầu vồng Ước mơ', category: 'nature', emoji: '🌈', bg: '#8b5cf6' },
  { id: 'nature-trophy', name: 'Cúp Vàng Vô địch', category: 'nature', emoji: '🏆', bg: '#ca8a04' },
];

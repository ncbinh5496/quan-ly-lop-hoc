export interface PresetGradient {
  id: string;
  name: string;
  style: string;
  preview: string;
  description: string;
}

export interface PresetWallpaper {
  id: string;
  name: string;
  url: string;
  description: string;
}

export const PRESET_GRADIENTS: PresetGradient[] = [
  {
    id: 'chibi-sunshine',
    name: '🌟 Nắng Vàng Chibi',
    style: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #38bdf8 100%)',
    preview: 'linear-gradient(135deg, #f59e0b, #ec4899, #38bdf8)',
    description: 'Vàng cam tươi vui - Hồng phấn - Xanh baby'
  },
  {
    id: 'chibi-mint',
    name: '🍬 Kẹo Bạc Hà Chibi',
    style: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
    preview: 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)',
    description: 'Xanh ngọc tươi - Xanh biển - Tím phấn'
  },
  {
    id: 'chibi-cotton-candy',
    name: '🍭 Kẹo Bông Gòn Pastel',
    style: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 45%, #a855f7 100%)',
    preview: 'linear-gradient(135deg, #f43f5e, #ec4899, #a855f7)',
    description: 'Hồng kẹo ngọt - Tím mộng mơ'
  },
  {
    id: 'chibi-rainbow',
    name: '🌈 Cầu Vồng Tuổi Thơ',
    style: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 25%, #10b981 50%, #3b82f6 75%, #8b5cf6 100%)',
    preview: 'linear-gradient(135deg, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6)',
    description: 'Đa sắc rực rỡ, năng động và vui tươi'
  },
  {
    id: 'sunset',
    name: 'Hoàng Hôn Rực Rỡ',
    style: 'linear-gradient(135deg, #7c3aed 0%, #db2777 40%, #ea580c 100%)',
    preview: 'linear-gradient(135deg, #7c3aed, #db2777, #ea580c)',
    description: 'Tím - Hồng - Cam'
  },
  {
    id: 'ocean',
    name: 'Đại Dương Xanh Thẳm',
    style: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 50%, #0d9488 100%)',
    preview: 'linear-gradient(135deg, #1e3a8a, #0284c7, #0d9488)',
    description: 'Xanh dương - Da trời - Ngọc bích'
  },
  {
    id: 'forest',
    name: 'Rừng Xanh Tươi Mát',
    style: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #84cc16 100%)',
    preview: 'linear-gradient(135deg, #064e3b, #059669, #84cc16)',
    description: 'Xanh lá cây - Xanh ngọc - Chanh'
  },
  {
    id: 'cosmic',
    name: 'Vũ Trụ Huyền Bí',
    style: 'linear-gradient(135deg, #090d16 0%, #312e81 50%, #6b21a8 100%)',
    preview: 'linear-gradient(135deg, #090d16, #312e81, #6b21a8)',
    description: 'Xanh đen - Tím đậm - Tím neon'
  },
  {
    id: 'candy',
    name: 'Hồng Pastel Dễ Thương',
    style: 'linear-gradient(135deg, #be185d 0%, #ec4899 45%, #a855f7 100%)',
    preview: 'linear-gradient(135deg, #be185d, #ec4899, #a855f7)',
    description: 'Hồng kẹo ngọt - Tím phấn'
  },
  {
    id: 'sunshine',
    name: 'Ánh Dương Tỏa Sáng',
    style: 'linear-gradient(135deg, #9a3412 0%, #ea580c 45%, #eab308 100%)',
    preview: 'linear-gradient(135deg, #9a3412, #ea580c, #eab308)',
    description: 'Cam nhiệt đới - Vàng rực rỡ'
  },
  {
    id: 'classroom',
    name: 'Trường Học Năng Động',
    style: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 50%, #7e22ce 100%)',
    preview: 'linear-gradient(135deg, #1d4ed8, #4338ca, #7e22ce)',
    description: 'Xanh dương học đường - Tím sáng'
  },
  {
    id: 'vintage',
    name: 'Trầm Ấm Cổ Điển',
    style: 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #b45309 100%)',
    preview: 'linear-gradient(135deg, #451a03, #78350f, #b45309)',
    description: 'Nâu ấm - Gỗ mộc - Cát vàng'
  },
  {
    id: 'dark',
    name: 'Xám Đen Hiện Đại',
    style: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    preview: 'linear-gradient(135deg, #0f172a, #1e293b, #334155)',
    description: 'Xám đen cao cấp, tương phản dịu mắt'
  }
];

export const PRESET_WALLPAPERS: PresetWallpaper[] = [
  {
    id: 'chibi-kids-bright',
    name: '🧸 Học Sinh Vui Nhộn',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1920&q=80',
    description: 'Nụ cười học sinh rạng rỡ và tươi vui'
  },
  {
    id: 'chibi-colorful-study',
    name: '🎨 Sắc Màu Tuổi Thơ',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1920&q=80',
    description: 'Thế giới sắc màu học trò tươi sáng'
  },
  {
    id: 'classroom',
    name: 'Phòng Học Thân Thiện',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1920&q=80',
    description: 'Không gian học tập ấm cúng'
  },
  {
    id: 'blackboard',
    name: 'Bảng Phấn Trường Học',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1920&q=80',
    description: 'Bảng phấn và bàn ghế học sinh'
  },
  {
    id: 'stars',
    name: 'Ngân Hà Đầy Sao',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
    description: 'Bầu trời đêm và những vì sao lấp lánh'
  },
  {
    id: 'stationery',
    name: 'Dụng Cụ Học Tập',
    url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1920&q=80',
    description: 'Bút màu, thước kẻ sáng tạo'
  },
  {
    id: 'nature',
    name: 'Nắng Xanh Thiên Nhiên',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1920&q=80',
    description: 'Ánh nắng xuyên qua tán lá'
  },
];

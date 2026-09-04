export interface RewardPresetIcon {
  id: string;
  name: string;
  category: 'gifts' | 'stationery' | 'food' | 'honor' | 'toys' | 'privilege';
  icon: string; // Emoji, SVG Data URI, or Image URL
  badgeBg?: string;
}

export const REWARD_ICON_CATEGORIES = [
  { id: 'all', name: 'Tất cả icon' },
  { id: 'gifts', name: '🎁 Quà & Đồ chơi' },
  { id: 'stationery', name: '📚 Đồ dùng học tập' },
  { id: 'food', name: '🍬 Bánh kẹo & Nước' },
  { id: 'honor', name: '👑 Vinh danh & Cúp' },
  { id: 'privilege', name: '🎟️ Quyền lợi & Vé' },
];

export const PRESET_REWARD_ICONS: RewardPresetIcon[] = [
  // Quà tặng & Đồ chơi
  { id: 'rw-gift-box', name: 'Hộp quà bí mật 3D', category: 'gifts', icon: '🎁' },
  { id: 'rw-teddy-bear', name: 'Gấu bông dễ thương', category: 'gifts', icon: '🧸' },
  { id: 'rw-game-pad', name: 'Máy chơi game mini', category: 'gifts', icon: '🎮' },
  { id: 'rw-magic-wand', name: 'Cây đũa phép thuật', category: 'gifts', icon: '🪄' },
  { id: 'rw-lego-puzzle', name: 'Bộ xếp hình Lego', category: 'gifts', icon: '🧩' },
  { id: 'rw-balloon-party', name: 'Chùm bóng bay rực rỡ', category: 'gifts', icon: '🎈' },
  { id: 'rw-robot-toy', name: 'Robot thông minh', category: 'gifts', icon: '🤖' },
  { id: 'rw-yo-yo', name: 'Đồ chơi Yoyo sắc màu', category: 'gifts', icon: '🪀' },
  { id: 'rw-kite', name: 'Cánh diều ước mơ', category: 'gifts', icon: '🪁' },
  { id: 'rw-pinwheel', name: 'Chong chóng quay tít', category: 'gifts', icon: '🪅' },
  { id: 'rw-rubik-cube', name: 'Khối Rubik 3x3', category: 'gifts', icon: '🎲' },
  { id: 'rw-car-toy', name: 'Xe đua tốc độ', category: 'gifts', icon: '🏎️' },

  // Đồ dùng học tập
  { id: 'rw-pencil', name: 'Bút chì thần kỳ', category: 'stationery', icon: '✏️' },
  { id: 'rw-pen-multi', name: 'Bút bi nhiều màu', category: 'stationery', icon: '🖊️' },
  { id: 'rw-notebook', name: 'Sổ tay bìa đẹp', category: 'stationery', icon: '📒' },
  { id: 'rw-palette-art', name: 'Hộp màu nước vẽ tranh', category: 'stationery', icon: '🎨' },
  { id: 'rw-crayon-set', name: 'Bộ bút sáp màu', category: 'stationery', icon: '🖍️' },
  { id: 'rw-ruler', name: 'Thước kẻ đa năng', category: 'stationery', icon: '📏' },
  { id: 'rw-backpack', name: 'Balo đi học xinh xắn', category: 'stationery', icon: '🎒' },
  { id: 'rw-bookmark', name: 'Kẹp sách phát sáng', category: 'stationery', icon: '🔖' },
  { id: 'rw-stickers', name: 'Tập nhãn dán sticker', category: 'stationery', icon: '🏷️' },
  { id: 'rw-scissors', name: 'Kéo cắt thủ công an toàn', category: 'stationery', icon: '✂️' },
  { id: 'rw-globe', name: 'Quả địa cầu mini', category: 'stationery', icon: '🌐' },
  { id: 'rw-magnifier', name: 'Kính lúp thám tử', category: 'stationery', icon: '🔍' },

  // Bánh kẹo & Nước giải khát
  { id: 'rw-lollipop', name: 'Kẹo mút Chupa Chups', category: 'food', icon: '🍭' },
  { id: 'rw-candy-sweet', name: 'Kẹo dẻo trái cây', category: 'food', icon: '🍬' },
  { id: 'rw-chocolate', name: 'Thanh Chocolate ngọt ngào', category: 'food', icon: '🍫' },
  { id: 'rw-ice-cream', name: 'Kem ốc quế mát lạnh', category: 'food', icon: '🍦' },
  { id: 'rw-cupcake', name: 'Bánh Cupcake dâu tây', category: 'food', icon: '🧁' },
  { id: 'rw-donut', name: 'Bánh Donut phủ đường', category: 'food', icon: '🍩' },
  { id: 'rw-cookie', name: 'Bánh quy socola chip', category: 'food', icon: '🍪' },
  { id: 'rw-popcorn', name: 'Bắp rang bơ thơm lừng', category: 'food', icon: '🍿' },
  { id: 'rw-juice-box', name: 'Hộp nước ép cam tươi', category: 'food', icon: '🧃' },
  { id: 'rw-boba-tea', name: 'Trà sữa trân châu', category: 'food', icon: '🧋' },
  { id: 'rw-apple-red', name: 'Táo đỏ giòn ngọt', category: 'food', icon: '🍎' },
  { id: 'rw-strawberry', name: 'Dâu tây chín mọng', category: 'food', icon: '🍓' },

  // Vinh danh & Quyền lợi
  { id: 'rw-golden-cup', name: 'Cúp vàng danh dự', category: 'honor', icon: '🏆' },
  { id: 'rw-gold-medal', name: 'Huy chương vàng xuất sắc', category: 'honor', icon: '🥇' },
  { id: 'rw-crown-king', name: 'Vương miện lớp trưởng', category: 'honor', icon: '👑' },
  { id: 'rw-laurel-wreath', name: 'Vòng nguyệt quế vinh quang', category: 'honor', icon: '🌿' },
  { id: 'rw-star-shine', name: 'Ngôi sao sáng tuần', category: 'honor', icon: '⭐' },
  { id: 'rw-diamond-gem', name: 'Viên kim cương điểm 10', category: 'honor', icon: '💎' },
  { id: 'rw-megaphone', name: 'Tuyên dương trước toàn trường', category: 'honor', icon: '📣' },
  { id: 'rw-certificate', name: 'Thư khen gửi phụ huynh', category: 'honor', icon: '📜' },
  { id: 'rw-ribbon-badge', name: 'Băng rôn vinh danh', category: 'honor', icon: '🎖️' },
  { id: 'rw-sparkles-fire', name: 'Ngọn lửa nhiệt huyết', category: 'honor', icon: '🔥' },

  // Quyền lợi đặc biệt & Vé
  { id: 'rw-seat-ticket', name: 'Vé chọn chỗ ngồi yêu thích', category: 'privilege', icon: '🎟️' },
  { id: 'rw-board-leader', name: 'Quyền làm Quản trò 1 buổi', category: 'privilege', icon: '🎭' },
  { id: 'rw-music-dj', name: 'Quyền chọn bài hát giờ ra chơi', category: 'privilege', icon: '🎵' },
  { id: 'rw-wheel-spin', name: 'Lượt quay vòng may mắn', category: 'privilege', icon: '🎡' },
  { id: 'rw-free-homework', name: 'Phiếu miễn 1 bài tập về nhà', category: 'privilege', icon: '🎫' },
  { id: 'rw-lead-line', name: 'Quyền dẫn đầu hàng xếp lớp', category: 'privilege', icon: '🚩' },
  { id: 'rw-cinema-time', name: 'Vé xem phim hoạt hình cuối tuần', category: 'privilege', icon: '🎬' },
  { id: 'rw-story-teller', name: 'Quyền kể chuyện trước lớp', category: 'privilege', icon: '📖' },
];

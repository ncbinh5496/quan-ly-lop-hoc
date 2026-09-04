import { Badge, Level, PointCriteria, Reward, Student } from '../types';

export const DEFAULT_BADGES: Badge[] = [
  { id: 'b1', icon: '📚', name: 'Chăm học', description: 'Học tập chăm chỉ mỗi ngày' },
  { id: 'b2', icon: '⏰', name: 'Chuyên cần', description: 'Đi học đầy đủ, đúng giờ' },
  { id: 'b3', icon: '✍️', name: 'Viết đẹp', description: 'Viết chữ đẹp và sạch sẽ' },
  { id: 'b4', icon: '🔢', name: 'Toán giỏi', description: 'Hoàn thành tốt bài toán' },
  { id: 'b5', icon: '📖', name: 'Đọc sách', description: 'Tích cực đọc sách' },
  { id: 'b6', icon: '🤝', name: 'Giúp bạn', description: 'Biết giúp đỡ bạn bè' },
  { id: 'b7', icon: '💡', name: 'Sáng tạo', description: 'Có ý tưởng mới mẻ' },
  { id: 'b8', icon: '🧩', name: 'Hợp tác tốt', description: 'Làm việc nhóm hiệu quả' },
  { id: 'b9', icon: '📈', name: 'Tiến bộ vượt bậc', description: 'Có sự cố gắng rõ rệt' },
  { id: 'b10', icon: '⭐', name: 'Ngôi sao tỏa sáng', description: 'Xuất sắc trong tuần' },
  { id: 'b11', icon: '🌟', name: 'Chạm tới vòng nguyệt quế', description: 'Đạt mốc điểm cao' },
  { id: 'b12', icon: '🏆', name: 'Nhà vô địch tuần', description: 'Dẫn đầu bảng thi đua' },
];

export const DEFAULT_REWARDS: Reward[] = [
  { id: 'r1', icon: '🎁', name: 'Hộp quà bí mật', cost: 50, isActive: true },
  { id: 'r2', icon: '⭐', name: 'Sticker ngôi sao', cost: 20, isActive: true },
  { id: 'r3', icon: '🏅', name: 'Huy hiệu đặc biệt', cost: 80, isActive: true },
  { id: 'r4', icon: '🎲', name: 'Quyền chọn trò chơi', cost: 70, isActive: true },
  { id: 'r5', icon: '👑', name: 'Tổ trưởng một ngày', cost: 100, isActive: true },
  { id: 'r6', icon: '🎟️', name: 'Vé đổi quà', cost: 60, isActive: true },
  { id: 'r7', icon: '📣', name: 'Lời khen trước lớp', cost: 30, isActive: true },
  { id: 'r8', icon: '✏️', name: 'Bút chì may mắn', cost: 25, isActive: true },
  { id: 'r9', icon: '🌿', name: 'Vòng nguyệt quế nhỏ', cost: 120, isActive: true },
  { id: 'r10', icon: '🎡', name: 'Lượt quay may mắn', cost: 40, isActive: true },
];

export const DEFAULT_LEVELS: Level[] = [
  { id: 'l1', name: '🌱 Mầm non cố gắng', minPoints: 0, maxPoints: 19, icon: '🌱', color: 'bg-green-100 text-green-700' },
  { id: 'l2', name: '⭐ Mầm non tri thức', minPoints: 20, maxPoints: 39, icon: '⭐', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'l3', name: '🌟 Ngôi sao nhỏ', minPoints: 40, maxPoints: 59, icon: '🌟', color: 'bg-blue-100 text-blue-700' },
  { id: 'l4', name: '🏆 Chiến binh học tập', minPoints: 60, maxPoints: 79, icon: '🏆', color: 'bg-orange-100 text-orange-700' },
  { id: 'l5', name: '👑 Nhà vô địch', minPoints: 80, maxPoints: 99, icon: '👑', color: 'bg-red-100 text-red-700' },
  { id: 'l6', name: '💎 Siêu sao lớp học', minPoints: 100, maxPoints: 9999, icon: '💎', color: 'bg-purple-100 text-purple-700' },
];

export const DEFAULT_POINT_CRITERIA: PointCriteria[] = [
  { id: 'p1', reason: 'Trả lời đúng', amount: 1, type: 'positive', icon: '🎯' },
  { id: 'p2', reason: 'Phát biểu tích cực', amount: 1, type: 'positive', icon: '🙋' },
  { id: 'p3', reason: 'Làm bài tốt', amount: 2, type: 'positive', icon: '📝' },
  { id: 'p4', reason: 'Hoàn thành bài tập', amount: 2, type: 'positive', icon: '✅' },
  { id: 'p5', reason: 'Giúp đỡ bạn', amount: 2, type: 'positive', icon: '🤝' },
  { id: 'p6', reason: 'Có tiến bộ rõ rệt', amount: 3, type: 'positive', icon: '🚀' },
  { id: 'p7', reason: 'Đạt điểm tốt', amount: 5, type: 'positive', icon: '⭐' },
  
  { id: 'n1', reason: 'Quên đồ dùng học tập', amount: -1, type: 'negative', icon: '✏️' },
  { id: 'n2', reason: 'Nói chuyện riêng', amount: -1, type: 'negative', icon: '💬' },
  { id: 'n3', reason: 'Chưa hoàn thành bài', amount: -2, type: 'negative', icon: '⌛' },
  { id: 'n4', reason: 'Đi học muộn', amount: -1, type: 'negative', icon: '⏰' },
  { id: 'n5', reason: 'Mất trật tự', amount: -1, type: 'negative', icon: '📢' },
  { id: 'n6', reason: 'Không hợp tác nhóm', amount: -2, type: 'negative', icon: '🙅' },
];

export const DEMO_STUDENTS: Partial<Student>[] = [
  { name: 'Dương Ngọc Diễm', gender: 'Nữ', points: 20 },
  { name: 'Hoàng Minh Anh', gender: 'Nữ', points: 18 },
  { name: 'Nguyễn Ngọc Linh', gender: 'Nữ', points: 16 },
  { name: 'Dương An Bảo Quân', gender: 'Nam', points: 15 },
  { name: 'Hà Thị Khánh Huyền', gender: 'Nữ', points: 14 },
  { name: 'Dương Hải Đăng', gender: 'Nam', points: 12 },
  { name: 'Giáp Hà My', gender: 'Nữ', points: 11 },
  { name: 'Lê Gia Bảo', gender: 'Nam', points: 10 },
  { name: 'Hà Đình Ngọc Sơn', gender: 'Nam', points: 9 },
  { name: 'Đàm Thị Phấn', gender: 'Nữ', points: 8 },
  { name: 'Phạm Đức Huy', gender: 'Nam', points: 7 },
  { name: 'Đào Duy Đạt', gender: 'Nam', points: 6 },
];

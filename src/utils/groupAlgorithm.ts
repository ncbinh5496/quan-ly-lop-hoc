import { Student } from '../types';

export interface GeneratedGroup {
  id: string;
  name: string;
  icon: string;
  color: string;
  leaderId?: string;
  studentIds: string[];
}

export interface GroupTheme {
  id: string;
  name: string;
  items: Array<{
    name: string;
    icon: string;
    color: string;
  }>;
}

export const GROUP_THEMES: GroupTheme[] = [
  {
    id: 'cute_animals',
    name: '🐾 Vườn Thú Dễ Thương',
    items: [
      { name: 'Tổ Thỏ Trắng', icon: '🐰', color: 'from-pink-500 to-rose-400' },
      { name: 'Tổ Mèo Con', icon: '🐱', color: 'from-amber-400 to-orange-400' },
      { name: 'Tổ Gấu Trúc', icon: '🐼', color: 'from-emerald-400 to-teal-500' },
      { name: 'Tổ Sư Tử Nhỏ', icon: '🦁', color: 'from-yellow-400 to-amber-500' },
      { name: 'Tổ Cá Heo', icon: '🐬', color: 'from-cyan-400 to-blue-500' },
      { name: 'Tổ Khủng Long', icon: '🦖', color: 'from-lime-400 to-green-500' },
      { name: 'Tổ Cánh Cụt', icon: '🐧', color: 'from-sky-400 to-indigo-500' },
      { name: 'Tổ Sóc Nâu', icon: '🐿️', color: 'from-orange-400 to-amber-600' },
      { name: 'Tổ Kỳ Lân', icon: '🦄', color: 'from-purple-400 to-pink-500' },
      { name: 'Tổ Ong Chăm Chỉ', icon: '🐝', color: 'from-amber-300 to-yellow-500' },
    ]
  },
  {
    id: 'superheroes',
    name: '🚀 Vũ Trụ & Siêu Anh Hùng',
    items: [
      { name: 'Tổ Siêu Nhân', icon: '⚡', color: 'from-red-500 to-orange-500' },
      { name: 'Tổ Phi Thuyền', icon: '🚀', color: 'from-indigo-500 to-purple-500' },
      { name: 'Tổ Ngôi Sao', icon: '🌟', color: 'from-amber-400 to-yellow-500' },
      { name: 'Tổ Cầu Vồng', icon: '🌈', color: 'from-pink-400 to-violet-500' },
      { name: 'Tổ Kim Cương', icon: '💎', color: 'from-cyan-400 to-blue-600' },
      { name: 'Tổ Rồng Lửa', icon: '🔥', color: 'from-orange-500 to-red-600' },
      { name: 'Tổ Tia Chớp', icon: '⚡', color: 'from-yellow-300 to-amber-500' },
      { name: 'Tổ Thiên Hà', icon: '🌌', color: 'from-purple-600 to-indigo-600' },
    ]
  },
  {
    id: 'virtues',
    name: '🎯 Phẩm Chất Tỏa Sáng',
    items: [
      { name: 'Tổ Chăm Ngoan', icon: '🎯', color: 'from-emerald-500 to-teal-600' },
      { name: 'Tổ Trí Tuệ', icon: '📖', color: 'from-blue-500 to-indigo-600' },
      { name: 'Tổ Đoàn Kết', icon: '🤝', color: 'from-violet-500 to-purple-600' },
      { name: 'Tổ Sáng Tạo', icon: '🎨', color: 'from-pink-500 to-rose-500' },
      { name: 'Tổ Dũng Cảm', icon: '🛡️', color: 'from-amber-500 to-orange-600' },
      { name: 'Tổ Tự Tin', icon: '👑', color: 'from-yellow-400 to-amber-600' },
      { name: 'Tổ Năng Động', icon: '🏃', color: 'from-cyan-500 to-blue-500' },
      { name: 'Tổ Chiến Thắng', icon: '🏆', color: 'from-amber-400 to-yellow-600' },
    ]
  },
  {
    id: 'numeric',
    name: '🏷️ Số Thứ Tự Truyền Thống',
    items: [
      { name: 'Tổ 1', icon: '1️⃣', color: 'from-indigo-500 to-blue-600' },
      { name: 'Tổ 2', icon: '2️⃣', color: 'from-emerald-500 to-teal-600' },
      { name: 'Tổ 3', icon: '3️⃣', color: 'from-amber-500 to-orange-600' },
      { name: 'Tổ 4', icon: '4️⃣', color: 'from-rose-500 to-pink-600' },
      { name: 'Tổ 5', icon: '5️⃣', color: 'from-purple-500 to-violet-600' },
      { name: 'Tổ 6', icon: '6️⃣', color: 'from-cyan-500 to-blue-500' },
      { name: 'Tổ 7', icon: '7️⃣', color: 'from-teal-500 to-emerald-600' },
      { name: 'Tổ 8', icon: '8️⃣', color: 'from-orange-500 to-red-500' },
    ]
  }
];

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export interface GroupDivisionOptions {
  activeStudents: Student[];
  numGroups: number;
  selectedThemeId: string;
  balanceGender: boolean;
  balancePoints: boolean;
}

export function divideStudentsIntoGroups(options: GroupDivisionOptions): GeneratedGroup[] {
  const { activeStudents, numGroups, selectedThemeId, balanceGender, balancePoints } = options;
  if (activeStudents.length === 0 || numGroups <= 0) return [];

  const theme = GROUP_THEMES.find(t => t.id === selectedThemeId) || GROUP_THEMES[0];

  // Prepare groups structure
  const newGroups: GeneratedGroup[] = Array.from({ length: numGroups }, (_, index) => {
    const themeItem = theme.items[index % theme.items.length];
    return {
      id: `gen_group_${index + 1}_${Date.now()}`,
      name: themeItem.name,
      icon: themeItem.icon,
      color: themeItem.color,
      studentIds: [],
    };
  });

  if (balanceGender) {
    // Separate boys and girls
    const boys = shuffleArray(activeStudents.filter(s => s.gender === 'Nam'));
    const girls = shuffleArray(activeStudents.filter(s => s.gender === 'Nữ'));

    if (balancePoints) {
      boys.sort((a, b) => b.points - a.points);
      girls.sort((a, b) => b.points - a.points);
    }

    // Snake distribution to balance
    let gIdx = 0;
    let forward = true;
    
    boys.forEach(b => {
      newGroups[gIdx].studentIds.push(b.id);
      if (forward) {
        gIdx++;
        if (gIdx >= numGroups) {
          gIdx = numGroups - 1;
          forward = false;
        }
      } else {
        gIdx--;
        if (gIdx < 0) {
          gIdx = 0;
          forward = true;
        }
      }
    });

    // Continue snake for girls
    girls.forEach(g => {
      newGroups[gIdx].studentIds.push(g.id);
      if (forward) {
        gIdx++;
        if (gIdx >= numGroups) {
          gIdx = numGroups - 1;
          forward = false;
        }
      } else {
        gIdx--;
        if (gIdx < 0) {
          gIdx = 0;
          forward = true;
        }
      }
    });
  } else {
    // General shuffle without gender constraint
    const pool = shuffleArray(activeStudents);
    if (balancePoints) {
      // Sort then snake distribute
      pool.sort((a, b) => b.points - a.points);
      let gIdx = 0;
      let forward = true;
      pool.forEach(st => {
        newGroups[gIdx].studentIds.push(st.id);
        if (forward) {
          gIdx++;
          if (gIdx >= numGroups) {
            gIdx = numGroups - 1;
            forward = false;
          }
        } else {
          gIdx--;
          if (gIdx < 0) {
            gIdx = 0;
            forward = true;
          }
        }
      });
    } else {
      // Pure random distribution
      pool.forEach((st, idx) => {
        newGroups[idx % numGroups].studentIds.push(st.id);
      });
    }
  }

  // Auto assign 1 random leader per group
  newGroups.forEach(grp => {
    if (grp.studentIds.length > 0) {
      const randLeader = grp.studentIds[Math.floor(Math.random() * grp.studentIds.length)];
      grp.leaderId = randLeader;
    }
  });

  return newGroups;
}

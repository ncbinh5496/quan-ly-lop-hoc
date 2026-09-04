import confetti from 'canvas-confetti';
import { Badge } from '../types';

export interface BadgeCelebrationTheme {
  id: string;
  badgeNameMatch: string[];
  title: string;
  subtitle: string;
  praiseQuote: string;
  bannerGradient: string;
  badgeGlowColor: string;
  cardBorderColor: string;
  textColor: string;
  auraAnimation: 'spin-sunburst' | 'pulse-heart' | 'magic-sparks' | 'rocket-surge' | 'laurel-crown' | 'star-shower' | 'matrix-math' | 'feather-writing';
  floatingParticles: string[];
  soundType: 'fanfare-champion' | 'magical-chime' | 'energetic-tada' | 'warm-applause' | 'triumph-march' | 'star-burst';
  confettiColors: string[];
}

export const BADGE_CELEBRATION_THEMES: BadgeCelebrationTheme[] = [
  {
    id: 'scholar',
    badgeNameMatch: ['chăm học', 'chăm chỉ', 'siêng năng', 'học giỏi', 'tri thức'],
    title: 'NGÔI SAO CHĂM HỌC',
    subtitle: 'Học tập hăng say • Tương lai rạng ngời',
    praiseQuote: 'Kiến thức hôm nay là đôi cánh cho ngày mai bay cao. Chúc mừng em luôn nỗ lực không ngừng nghỉ!',
    bannerGradient: 'from-amber-500 via-orange-500 to-yellow-400',
    badgeGlowColor: 'rgba(245, 158, 11, 0.6)',
    cardBorderColor: 'border-amber-400',
    textColor: 'text-amber-600',
    auraAnimation: 'spin-sunburst',
    floatingParticles: ['📚', '📖', '✨', '🎓', '⭐', '💡'],
    soundType: 'magical-chime',
    confettiColors: ['#f59e0b', '#fbbf24', '#fde68a', '#3b82f6', '#ffffff'],
  },
  {
    id: 'attendance',
    badgeNameMatch: ['chuyên cần', 'đúng giờ', 'gương mẫu', 'chăm đi học'],
    title: 'GƯƠNG SÁNG CHUYÊN CẦN',
    subtitle: 'Kỷ luật vàng • Điểm 10 chuyên cần',
    praiseQuote: 'Mỗi ngày đến trường đúng giờ là một bước tiến vững chắc. Tinh thần kỷ luật của em thật đáng tự hào!',
    bannerGradient: 'from-blue-600 via-cyan-500 to-sky-400',
    badgeGlowColor: 'rgba(59, 130, 246, 0.6)',
    cardBorderColor: 'border-blue-400',
    textColor: 'text-blue-600',
    auraAnimation: 'pulse-heart',
    floatingParticles: ['⏰', '☀️', '🎒', '🏫', '✨', '🌟'],
    soundType: 'triumph-march',
    confettiColors: ['#3b82f6', '#06b6d4', '#60a5fa', '#93c5fd', '#ffffff'],
  },
  {
    id: 'calligraphy',
    badgeNameMatch: ['viết đẹp', 'chữ đẹp', 'vở sạch', 'rèn chữ', 'hoa tay'],
    title: 'NÉT CHỮ NẾT NGƯỜI',
    subtitle: 'Vở sạch chữ đẹp • Tỉ mỉ khéo léo',
    praiseQuote: 'Từng nét bút ngay ngắn, sạch đẹp như những bông hoa tỏa sáng trang vở. Rất xuất sắc!',
    bannerGradient: 'from-rose-500 via-pink-500 to-fuchsia-400',
    badgeGlowColor: 'rgba(236, 72, 153, 0.6)',
    cardBorderColor: 'border-pink-400',
    textColor: 'text-pink-600',
    auraAnimation: 'feather-writing',
    floatingParticles: ['✍️', '🌸', '✨', '📝', '💖', '💮'],
    soundType: 'magical-chime',
    confettiColors: ['#ec4899', '#f43f5e', '#fb7185', '#f472b6', '#ffffff'],
  },
  {
    id: 'math',
    badgeNameMatch: ['toán', 'tính toán', 'toán giỏi', 'thần đồng toán', 'logic'],
    title: 'THẦN TỐC TOÁN HỌC',
    subtitle: 'Tư duy nhạy bén • Giải toán siêu phàm',
    praiseQuote: 'Bộ não siêu phàm đã giải mã xuất sắc những phép tính hóc búa nhất! Tự tin tiến bước nhà toán học nhí!',
    bannerGradient: 'from-indigo-600 via-violet-600 to-blue-500',
    badgeGlowColor: 'rgba(99, 102, 241, 0.6)',
    cardBorderColor: 'border-indigo-400',
    textColor: 'text-indigo-600',
    auraAnimation: 'matrix-math',
    floatingParticles: ['🔢', '📐', '➕', '➖', '✖️', '➗', '✨', '⚡'],
    soundType: 'star-burst',
    confettiColors: ['#6366f1', '#8b5cf6', '#a855f7', '#38bdf8', '#fbbf24'],
  },
  {
    id: 'reader',
    badgeNameMatch: ['đọc sách', 'mọt sách', 'kể chuyện', 'yêu sách', 'thư viện'],
    title: 'MỌT SÁCH THÔNG THÁI',
    subtitle: 'Yêu sách mỗi ngày • Mở rộng chân trời',
    praiseQuote: 'Trang sách mở ra những thế giới kỳ diệu. Tình yêu đọc sách của em là kho báu vô giá!',
    bannerGradient: 'from-teal-600 via-emerald-500 to-green-400',
    badgeGlowColor: 'rgba(20, 184, 166, 0.6)',
    cardBorderColor: 'border-teal-400',
    textColor: 'text-teal-600',
    auraAnimation: 'magic-sparks',
    floatingParticles: ['📖', '🌿', '🌱', '🦉', '✨', '🌟'],
    soundType: 'magical-chime',
    confettiColors: ['#14b8a6', '#10b981', '#34d399', '#6ee7b7', '#fef08a'],
  },
  {
    id: 'kindness',
    badgeNameMatch: ['giúp bạn', 'nhân ái', 'tốt bụng', 'chia sẻ', 'yêu thương', 'bạn tốt'],
    title: 'TRÁI TIM NHÂN ÁI',
    subtitle: 'Sẻ chia yêu thương • Gắn kết tình bạn',
    praiseQuote: 'Bàn tay biết giúp đỡ và nụ cười ấm áp của em đã làm cả lớp ngập tràn niềm vui và sự tử tế!',
    bannerGradient: 'from-rose-500 via-red-500 to-amber-400',
    badgeGlowColor: 'rgba(239, 68, 68, 0.6)',
    cardBorderColor: 'border-rose-400',
    textColor: 'text-rose-600',
    auraAnimation: 'pulse-heart',
    floatingParticles: ['🤝', '💖', '❤️', '🌈', '🌸', '✨'],
    soundType: 'warm-applause',
    confettiColors: ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#ffffff'],
  },
  {
    id: 'creativity',
    badgeNameMatch: ['sáng tạo', 'ý tưởng', 'khám phá', 'nghệ thuật', 'mỹ thuật'],
    title: 'PHÙ THỦY SÁNG TẠO',
    subtitle: 'Tư duy đột phá • Ý tưởng độc đáo',
    praiseQuote: 'Trí tưởng tượng phong phú và những ý tưởng rực rỡ sắc màu đã mang lại sự bất ngờ tuyệt vời!',
    bannerGradient: 'from-yellow-500 via-amber-500 to-fuchsia-500',
    badgeGlowColor: 'rgba(234, 179, 8, 0.6)',
    cardBorderColor: 'border-yellow-400',
    textColor: 'text-amber-600',
    auraAnimation: 'spin-sunburst',
    floatingParticles: ['💡', '🎨', '🚀', '✨', '⚡', '🌈'],
    soundType: 'star-burst',
    confettiColors: ['#eab308', '#ec4899', '#8b5cf6', '#06b6d4', '#ffffff'],
  },
  {
    id: 'teamwork',
    badgeNameMatch: ['hợp tác', 'làm việc nhóm', 'đồng đội', 'đoàn kết'],
    title: 'ĐỒNG ĐỘI ĂN Ý',
    subtitle: 'Đoàn kết là sức mạnh • Chung sức thành công',
    praiseQuote: 'Biết lắng nghe, chia sẻ và cùng bạn vượt qua mọi thử thách. Tinh thần đồng đội của em rất tuyệt vời!',
    bannerGradient: 'from-cyan-600 via-blue-600 to-indigo-500',
    badgeGlowColor: 'rgba(6, 182, 212, 0.6)',
    cardBorderColor: 'border-cyan-400',
    textColor: 'text-cyan-600',
    auraAnimation: 'pulse-heart',
    floatingParticles: ['🧩', '🤝', '🔥', '🛡️', '✨', '⭐'],
    soundType: 'triumph-march',
    confettiColors: ['#06b6d4', '#3b82f6', '#6366f1', '#a5f3fc', '#ffffff'],
  },
  {
    id: 'progress',
    badgeNameMatch: ['tiến bộ', 'bứt phá', 'vượt bậc', 'cố gắng', 'nỗ lực'],
    title: 'BỨT PHÁ VƯƠN CAO',
    subtitle: 'Nỗ lực không ngừng • Tiến bộ vượt bậc',
    praiseQuote: 'Sự kiên trì đã đơm hoa kết trái! Thành quả ngày hôm nay là minh chứng cho tinh thần không bỏ cuộc!',
    bannerGradient: 'from-emerald-500 via-teal-600 to-cyan-500',
    badgeGlowColor: 'rgba(16, 185, 129, 0.6)',
    cardBorderColor: 'border-emerald-400',
    textColor: 'text-emerald-600',
    auraAnimation: 'rocket-surge',
    floatingParticles: ['📈', '🚀', '🔥', '💪', '✨', '🎯'],
    soundType: 'energetic-tada',
    confettiColors: ['#10b981', '#059669', '#34d399', '#fbbf24', '#ffffff'],
  },
  {
    id: 'superstar',
    badgeNameMatch: ['ngôi sao', 'tỏa sáng', 'xuất sắc', 'siêu sao', 'nổi bật'],
    title: 'NGÔI SAO SÁNG NHẤT',
    subtitle: 'Tỏa sáng rực rỡ • Niềm tự hào lớp học',
    praiseQuote: 'Em như một ngôi sao lấp lánh soi sáng cả bầu trời lớp học. Hãy luôn giữ vững phong độ xuất sắc này!',
    bannerGradient: 'from-amber-400 via-yellow-400 to-orange-500',
    badgeGlowColor: 'rgba(251, 191, 36, 0.7)',
    cardBorderColor: 'border-amber-400 ring-4 ring-amber-200',
    textColor: 'text-amber-600',
    auraAnimation: 'star-shower',
    floatingParticles: ['⭐', '🌟', '✨', '💫', '👑', '🎉'],
    soundType: 'fanfare-champion',
    confettiColors: ['#fbbf24', '#f59e0b', '#fde047', '#ffffff', '#ec4899'],
  },
  {
    id: 'laurel',
    badgeNameMatch: ['vòng nguyệt quế', 'nguyệt quế', 'đỉnh cao', 'vinh quang'],
    title: 'VÒNG NGUYỆT QUẾ VINH QUANG',
    subtitle: 'Chinh phục ước mơ • Chạm tới đỉnh vinh quang',
    praiseQuote: 'Chúc mừng em đã xuất sắc chạm tay vào Vòng Nguyệt Quế vinh quang! Phần thưởng xứng đáng cho người kiên trì!',
    bannerGradient: 'from-emerald-600 via-amber-500 to-yellow-400',
    badgeGlowColor: 'rgba(245, 158, 11, 0.7)',
    cardBorderColor: 'border-amber-400 ring-4 ring-amber-300',
    textColor: 'text-amber-700',
    auraAnimation: 'laurel-crown',
    floatingParticles: ['🌿', '👑', '🏆', '⭐', '✨', '🥇'],
    soundType: 'fanfare-champion',
    confettiColors: ['#10b981', '#fbbf24', '#f59e0b', '#ec4899', '#ffffff'],
  },
  {
    id: 'champion',
    badgeNameMatch: ['vô địch', 'quán quân', 'dẫn đầu', 'top 1', 'chiến thắng', 'cúp'],
    title: 'NHÀ VÔ ĐỊCH XUẤT CHÚNG',
    subtitle: 'Bản lĩnh tiên phong • Vô địch thi đua',
    praiseQuote: 'Đứng đầu bảng vinh quang với phong độ tuyệt đỉnh! Cả lớp và thầy cô vô cùng khâm phục thành tích của em!',
    bannerGradient: 'from-yellow-400 via-amber-500 to-red-500',
    badgeGlowColor: 'rgba(234, 179, 8, 0.8)',
    cardBorderColor: 'border-yellow-400 ring-4 ring-yellow-300',
    textColor: 'text-yellow-700',
    auraAnimation: 'spin-sunburst',
    floatingParticles: ['🏆', '🥇', '👑', '🎉', '🔥', '⭐', '✨'],
    soundType: 'fanfare-champion',
    confettiColors: ['#fbbf24', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'],
  }
];

export function getBadgeCelebrationTheme(badge: Badge): BadgeCelebrationTheme {
  const lowerName = badge.name.toLowerCase();
  const lowerDesc = badge.description.toLowerCase();
  
  const matched = BADGE_CELEBRATION_THEMES.find(t => 
    t.badgeNameMatch.some(m => lowerName.includes(m) || lowerDesc.includes(m))
  );

  if (matched) return matched;

  // Fallback theme for custom badges
  return {
    id: 'custom-honor',
    badgeNameMatch: [],
    title: `TUYÊN DƯƠNG: ${badge.name.toUpperCase()}`,
    subtitle: 'Thành tích xuất sắc • Tuyên dương trước lớp',
    praiseQuote: `${badge.description || 'Chúc mừng em đã xuất sắc đạt được huy hiệu danh giá này! Hãy tiếp tục phát huy nhé!'}`,
    bannerGradient: 'from-indigo-600 via-purple-600 to-pink-500',
    badgeGlowColor: 'rgba(168, 85, 247, 0.6)',
    cardBorderColor: 'border-purple-400',
    textColor: 'text-purple-600',
    auraAnimation: 'spin-sunburst',
    floatingParticles: [badge.icon, '⭐', '✨', '🎉', '🌟'],
    soundType: 'fanfare-champion',
    confettiColors: ['#8b5cf6', '#ec4899', '#3b82f6', '#fbbf24', '#ffffff'],
  };
}

let celebrationAudioCtx: AudioContext | null = null;

function getCelebrationAudioContext(): AudioContext | null {
  try {
    if (!celebrationAudioCtx || celebrationAudioCtx.state === 'closed') {
      celebrationAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (celebrationAudioCtx.state === 'suspended') {
      celebrationAudioCtx.resume();
    }
    return celebrationAudioCtx;
  } catch (e) {
    console.warn('Audio context error:', e);
    return null;
  }
}

export function playCelebrationSynthesizer(type: BadgeCelebrationTheme['soundType']) {
  try {
    const audioCtx = getCelebrationAudioContext();
    if (!audioCtx) return;
    const t = audioCtx.currentTime;

    const playNote = (freq: number, start: number, dur: number, wave: OscillatorType = 'triangle', vol: number = 0.25) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, t + start);
      
      gain.gain.setValueAtTime(0.0001, t + start);
      gain.gain.linearRampToValueAtTime(vol, t + start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + start + dur);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t + start);
      osc.stop(t + start + dur + 0.05);
    };

    if (type === 'fanfare-champion') {
      // Grand Victory Fanfare: C4 -> E4 -> G4 -> C5 -> G4 -> C5 (sustained chord)
      playNote(523.25, 0.0, 0.18, 'sawtooth', 0.2); // C5
      playNote(523.25, 0.18, 0.18, 'sawtooth', 0.2); // C5
      playNote(523.25, 0.36, 0.18, 'sawtooth', 0.2); // C5
      playNote(659.25, 0.54, 0.35, 'sawtooth', 0.25); // E5
      playNote(783.99, 0.85, 0.25, 'sawtooth', 0.25); // G5
      playNote(1046.50, 1.1, 0.9, 'sawtooth', 0.3); // High C6

      // Chords backing
      playNote(261.63, 1.1, 0.9, 'sine', 0.3); // C4 bass
      playNote(329.63, 1.1, 0.9, 'triangle', 0.2); // E4
      playNote(392.00, 1.1, 0.9, 'triangle', 0.2); // G4
    } else if (type === 'magical-chime') {
      // Starlight Chimes arpeggio: C6, E6, G6, B6, C7, E7
      const chimeNotes = [1046.50, 1318.51, 1567.98, 1975.53, 2093.00, 2637.02];
      chimeNotes.forEach((freq, idx) => {
        playNote(freq, idx * 0.08, 0.6, 'sine', 0.18);
      });
      // Soft lingering warmth
      playNote(523.25, 0.5, 1.2, 'triangle', 0.15);
      playNote(659.25, 0.6, 1.2, 'sine', 0.12);
    } else if (type === 'triumph-march') {
      // Upbeat brass march
      playNote(392.00, 0.0, 0.15, 'sawtooth', 0.2); // G4
      playNote(523.25, 0.15, 0.2, 'sawtooth', 0.25); // C5
      playNote(659.25, 0.35, 0.2, 'sawtooth', 0.25); // E5
      playNote(783.99, 0.55, 0.5, 'sawtooth', 0.3); // G5
      playNote(1046.50, 0.75, 0.7, 'triangle', 0.25); // C6
    } else if (type === 'star-burst') {
      // Cosmic synth sweep & sparkle
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.exponentialRampToValueAtTime(1600, t + 0.4);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.45);

      // Followed by high bright chime
      playNote(1318.51, 0.4, 0.5, 'sine', 0.25);
      playNote(1567.98, 0.5, 0.6, 'sine', 0.25);
      playNote(2093.00, 0.6, 0.8, 'sine', 0.3);
    } else {
      // Default energetic tada
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((f, i) => {
        playNote(f, i * 0.1, 0.4, 'triangle', 0.25);
      });
      playNote(1046.50, 0.4, 0.8, 'sawtooth', 0.25);
    }
  } catch (e) {
    console.warn('Audio context error:', e);
  }
}

export function fireBadgeConfetti(theme: BadgeCelebrationTheme) {
  // Fire multiple bursts of themed confetti
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: theme.confettiColors,
    zIndex: 99999,
  };

  function fire(particleRatio: number, opts: any) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.4 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

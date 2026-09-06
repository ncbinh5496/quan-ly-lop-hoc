import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import confetti from "canvas-confetti";
import { PRESET_AVATARS } from "./avatarCatalog";
import { DEFAULT_LEVELS } from './defaults';
import { CustomAvatar, Level } from "../types";
import { generateChibiStudentSvg, chibiSvgToDataUrl } from "./chibiAvatars";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let globalAudioCtx: AudioContext | null = null;

function getSharedAudioContext(): AudioContext | null {
  try {
    if (!globalAudioCtx || globalAudioCtx.state === 'closed') {
      globalAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (globalAudioCtx.state === 'suspended') {
      globalAudioCtx.resume();
    }
    return globalAudioCtx;
  } catch (e) {
    console.warn("AudioContext not supported", e);
    return null;
  }
}

export const playSound = (type: 'success' | 'error' | 'bell' | 'tada' | 'shuffle' | 'pop') => {
  try {
    const audioCtx = getSharedAudioContext();
    if (!audioCtx) return;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'success') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.1); // C6
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.2);
    } else if (type === 'error') {
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.2);
    } else if (type === 'bell') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 1);
    } else if (type === 'shuffle') {
      // Rapid series of soft clicks/pops
      const time = audioCtx.currentTime;
      for (let i = 0; i < 4; i++) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300 + Math.random() * 400, time + i * 0.05);
        gain.gain.setValueAtTime(0.2, time + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.05 + 0.04);
        osc.start(time + i * 0.05);
        osc.stop(time + i * 0.05 + 0.04);
      }
    } else if (type === 'pop') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);
      gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.08);
    } else if (type === 'tada') {
      // Simple arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
      const time = audioCtx.currentTime;
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, time + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.3, time + i * 0.1 + 0.05);
        gain.gain.linearRampToValueAtTime(0, time + i * 0.1 + 0.2);
        
        osc.start(time + i * 0.1);
        osc.stop(time + i * 0.1 + 0.2);
      });
    }
  } catch (e) {
    console.warn("Audio not supported or blocked", e);
  }
};

export const triggerConfetti = () => {
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults, particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults, particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
};

export const getLevelForPoints = (points: number, levels: Level[]): Level => {
  const ordered = [...(levels.length ? levels : DEFAULT_LEVELS)].sort((a,b) => a.minPoints-b.minPoints);
  const score = Number.isFinite(points) ? points : 0;
  return [...ordered].reverse().find(l => score >= l.minPoints) || ordered[0];
};

export const getAvatarUrl = (avatarId?: string, customAvatars?: CustomAvatar[]): string => {
  if (!avatarId) {
    return chibiSvgToDataUrl(generateChibiStudentSvg({ gender: 'Nam', hairStyle: 'boy-cap', hasCap: true }));
  }

  // 1. If avatarId is a direct data URI, blob URL, or external URL
  if (avatarId.startsWith('data:image') || avatarId.startsWith('http://') || avatarId.startsWith('https://') || avatarId.startsWith('blob:')) {
    return avatarId;
  }

  // 2. Check in class custom avatars
  if (customAvatars && customAvatars.length > 0) {
    const custom = customAvatars.find(c => c.id === avatarId);
    if (custom?.url) return custom.url;
  }

  // 3. Check in preset catalog
  const preset = PRESET_AVATARS.find(p => p.id === avatarId);
  if (preset) {
    if (preset.customSvg) {
      return chibiSvgToDataUrl(preset.customSvg);
    }
    return createChibiBadgeSvg(preset.emoji, preset.bg);
  }

  // 4. Primary School Chibi generation for boy-* / girl-* IDs
  if (avatarId.startsWith('boy')) {
    const num = parseInt(avatarId.split('-')[1] || '1') || 1;
    const styles: Array<Parameters<typeof generateChibiStudentSvg>[0]> = [
      { gender: 'Nam', hairStyle: 'boy-cap', hasCap: true, backpackColor: '#0284c7', bgGradient: ['#38bdf8', '#0284c7'] },
      { gender: 'Nam', hairStyle: 'boy-short', accessory: 'glasses', backpackColor: '#4f46e5', bgGradient: ['#818cf8', '#4f46e5'] },
      { gender: 'Nam', hairStyle: 'boy-short', backpackColor: '#059669', bgGradient: ['#34d399', '#059669'] },
      { gender: 'Nam', hairStyle: 'boy-cap', capColor: '#ea580c', backpackColor: '#d97706', bgGradient: ['#fbbf24', '#d97706'] },
      { gender: 'Nam', hairStyle: 'boy-short', accessory: 'star', backpackColor: '#7c3aed', bgGradient: ['#a78bfa', '#7c3aed'] },
      { gender: 'Nam', hairStyle: 'boy-cap', backpackColor: '#db2777', bgGradient: ['#f472b6', '#db2777'] },
      { gender: 'Nam', hairStyle: 'boy-short', backpackColor: '#0891b2', bgGradient: ['#22d3ee', '#0891b2'] },
      { gender: 'Nam', hairStyle: 'boy-short', accessory: 'crown', backpackColor: '#ca8a04', bgGradient: ['#fde047', '#ca8a04'] },
    ];
    const chosen = styles[(num - 1) % styles.length];
    return chibiSvgToDataUrl(generateChibiStudentSvg(chosen));
  }

  if (avatarId.startsWith('girl')) {
    const num = parseInt(avatarId.split('-')[1] || '1') || 1;
    const styles: Array<Parameters<typeof generateChibiStudentSvg>[0]> = [
      { gender: 'Nữ', hairStyle: 'girl-pigtails', backpackColor: '#f472b6', bgGradient: ['#f472b6', '#ec4899'] },
      { gender: 'Nữ', hairStyle: 'girl-cap', hasCap: true, backpackColor: '#fb7185', bgGradient: ['#fb7185', '#e11d48'] },
      { gender: 'Nữ', hairStyle: 'girl-pigtails', accessory: 'flower', backpackColor: '#c084fc', bgGradient: ['#c084fc', '#9333ea'] },
      { gender: 'Nữ', hairStyle: 'girl-pigtails', accessory: 'glasses', backpackColor: '#a78bfa', bgGradient: ['#a78bfa', '#7c3aed'] },
      { gender: 'Nữ', hairStyle: 'girl-pigtails', accessory: 'star', backpackColor: '#f59e0b', bgGradient: ['#fde047', '#d97706'] },
      { gender: 'Nữ', hairStyle: 'girl-pigtails', accessory: 'crown', backpackColor: '#db2777', bgGradient: ['#fbcfe8', '#db2777'] },
      { gender: 'Nữ', hairStyle: 'girl-pigtails', backpackColor: '#34d399', bgGradient: ['#6ee7b7', '#059669'] },
      { gender: 'Nữ', hairStyle: 'girl-cap', capColor: '#ec4899', backpackColor: '#22d3ee', bgGradient: ['#67e8f9', '#0891b2'] },
    ];
    const chosen = styles[(num - 1) % styles.length];
    return chibiSvgToDataUrl(generateChibiStudentSvg(chosen));
  }

  return createChibiBadgeSvg('⭐', '#8b5cf6');
};

export const createChibiBadgeSvg = (emoji: string, bg: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg}"/>
        <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0.3"/>
      </linearGradient>
    </defs>
    <circle cx="60" cy="60" r="56" fill="${bg}" stroke="#ffffff" stroke-width="4"/>
    <circle cx="60" cy="60" r="50" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.6"/>
    <!-- Sparkles -->
    <path d="M 24 30 Q 28 30 28 26 Q 28 30 32 30 Q 28 30 28 34 Q 28 30 24 30" fill="#ffffff" opacity="0.9"/>
    <path d="M 94 36 Q 97 36 97 33 Q 97 36 100 36 Q 97 36 97 39 Q 97 36 94 36" fill="#ffffff" opacity="0.9"/>
    <text x="60" y="76" font-size="56" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const compressImageToBase64 = (
  file: File, 
  maxWidth = 250, 
  maxHeight = 250, 
  quality = 0.85
): Promise<string> => {
  // If SVG, preserve raw vector data URL
  if (file.type.includes('svg') || file.name.toLowerCase().endsWith('.svg')) {
    return fileToBase64(file);
  }

  const isPng = file.type.includes('png') || file.name.toLowerCase().endsWith('.png');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Preserve PNG transparency
        const format = isPng ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(format, isPng ? undefined : quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        // Fallback to original data URL if canvas rendering fails
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Image decode failed'));
        }
      };
    };
    reader.onerror = (err) => reject(err);
  });
};

export const compressDataUrl = (
  dataUrl: string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.75
): Promise<string> => {
  if (!dataUrl || !dataUrl.startsWith('data:image/') || dataUrl.startsWith('data:image/svg+xml')) {
    return Promise.resolve(dataUrl);
  }
  
  // For small thumbnails (maxWidth <= 300), only skip if < 12KB
  const skipThreshold = maxWidth <= 300 ? 12 * 1024 : 60 * 1024;
  if (dataUrl.length < skipThreshold) {
    return Promise.resolve(dataUrl);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(width, 1);
      canvas.height = Math.max(height, 1);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };
    img.onerror = () => resolve(dataUrl);
  });
};

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};



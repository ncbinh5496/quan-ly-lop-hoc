import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Badge } from '../../types';
import { BadgeCelebrationTheme } from '../../utils/badgeCelebration';

interface Badge3DStageProps {
  badge: Badge;
  theme: BadgeCelebrationTheme;
  studentName: string;
}

export function Badge3DStage({ badge, theme, studentName }: Badge3DStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate tilt angles (-18 to +18 degrees)
    const rotX = -((y - centerY) / centerY) * 16;
    const rotY = ((x - centerX) / centerX) * 16;
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const render3DThemeScene = () => {
    switch (theme.id) {
      case 'scholar':
        return (
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
            {/* 3D Magic Book Opening */}
            <motion.div 
              initial={{ rotateX: 60, rotateZ: -20, scale: 0 }}
              animate={{ rotateX: 30, rotateZ: [-10, 10, -10], scale: 1 }}
              transition={{ 
                scale: { type: 'spring', damping: 12, stiffness: 180 },
                rotateZ: { duration: 6, repeat: Infinity, ease: 'easeInOut' }
              }}
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}
              className="relative w-48 h-32"
            >
              {/* Book Base / Cover */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-xl shadow-2xl border-2 border-amber-400/80 flex items-center justify-center">
                <div className="w-1.5 h-full bg-amber-400/60 absolute left-1/2 -translate-x-1/2" />
              </div>

              {/* Glowing Left Page */}
              <motion.div 
                animate={{ rotateY: [-5, -25, -5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-2 top-2 bottom-2 w-[44%] bg-amber-50 rounded-l-lg p-2 shadow-inner border border-amber-200 text-[8px] font-bold text-amber-900 overflow-hidden"
                style={{ transformOrigin: 'right center', transformStyle: 'preserve-3d' }}
              >
                <div className="h-1 bg-amber-300 rounded mb-1 w-3/4" />
                <div className="h-1 bg-amber-200 rounded mb-1 w-full" />
                <div className="h-1 bg-amber-200 rounded mb-1 w-5/6" />
                <div className="text-center font-black text-xs text-amber-600 mt-2">A B C</div>
              </motion.div>

              {/* Glowing Right Page */}
              <motion.div 
                animate={{ rotateY: [5, 25, 5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-2 top-2 bottom-2 w-[44%] bg-amber-50 rounded-r-lg p-2 shadow-inner border border-amber-200 text-[8px] font-bold text-amber-900 overflow-hidden"
                style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
              >
                <div className="h-1 bg-amber-300 rounded mb-1 w-3/4 ml-auto" />
                <div className="h-1 bg-amber-200 rounded mb-1 w-full" />
                <div className="h-1 bg-amber-200 rounded mb-1 w-5/6 ml-auto" />
                <div className="text-center font-black text-xs text-amber-600 mt-2">1 2 3</div>
              </motion.div>
            </motion.div>

            {/* Floating 3D Graduation Cap with dangling golden tassel */}
            <motion.div
              animate={{ y: [-8, 8, -8], rotateY: [0, 360] }}
              transition={{ 
                y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                rotateY: { duration: 10, repeat: Infinity, ease: 'linear' }
              }}
              style={{ transform: 'translateZ(90px)' }}
              className="absolute -top-6 text-5xl filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
            >
              🎓
            </motion.div>

            {/* Orbiting Crystal Knowledge Runes */}
            {['✨', '⭐', '📖', '💡', '🌟'].map((glyph, idx) => (
              <motion.div
                key={idx}
                animate={{ 
                  rotate: [idx * 72, idx * 72 + 360],
                  scale: [0.9, 1.2, 0.9]
                }}
                transition={{ 
                  rotate: { duration: 8 + idx * 2, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.4 }
                }}
                className="absolute w-44 h-44 rounded-full pointer-events-none flex items-start justify-center"
                style={{ transformStyle: 'preserve-3d', transform: `translateZ(${40 + idx * 10}px)` }}
              >
                <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">{glyph}</span>
              </motion.div>
            ))}
          </div>
        );

      case 'math':
        return (
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
            {/* 3D Spinning Hologram Polyhedron Core */}
            <motion.div
              animate={{ rotateX: [0, 360], rotateY: [0, 360], rotateZ: [0, 180] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(40px)' }}
              className="relative w-28 h-28 border-2 border-indigo-400/80 rounded-2xl bg-indigo-500/10 backdrop-blur-xs flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.5)]"
            >
              {/* Inner Cube Layer */}
              <div 
                style={{ transform: 'translateZ(25px)' }} 
                className="absolute inset-2 border-2 border-dashed border-cyan-400 rounded-xl flex items-center justify-center bg-cyan-400/10"
              >
                <span className="text-4xl font-black text-cyan-300 drop-shadow-[0_0_10px_#38bdf8]">∑</span>
              </div>
              <div 
                style={{ transform: 'translateZ(-25px) rotateY(180deg)' }} 
                className="absolute inset-2 border-2 border-dashed border-pink-400 rounded-xl flex items-center justify-center bg-pink-400/10"
              >
                <span className="text-4xl font-black text-pink-300 drop-shadow-[0_0_10px_#f43f5e]">π</span>
              </div>
            </motion.div>

            {/* Orbiting Mathematical Particle Rings */}
            {['➕', '➖', '✖️', '➗', '√x', '📐', '∞', '%'].map((sym, idx) => (
              <motion.div
                key={idx}
                animate={{ 
                  rotateZ: [idx * 45, idx * 45 + 360],
                  rotateX: [60, 60],
                }}
                transition={{ 
                  rotateZ: { duration: 7, repeat: Infinity, ease: 'linear' }
                }}
                className="absolute w-52 h-52 rounded-full border border-indigo-400/30 flex items-start justify-center"
                style={{ transformStyle: 'preserve-3d', transform: `translateZ(${50 + (idx % 3) * 15}px)` }}
              >
                <motion.span 
                  animate={{ rotateZ: [-idx * 45, -(idx * 45 + 360)], scale: [1, 1.3, 1] }}
                  transition={{ 
                    rotateZ: { duration: 7, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.2 }
                  }}
                  className="text-xl font-black text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.9)] bg-indigo-950/80 px-2 py-0.5 rounded-lg border border-amber-300/60"
                >
                  {sym}
                </motion.span>
              </motion.div>
            ))}
          </div>
        );

      case 'calligraphy':
        return (
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
            {/* 3D Glowing Calligraphy Quill / Fountain Pen */}
            <motion.div
              animate={{ 
                x: [-20, 20, -10, 20, -20],
                y: [-15, 10, -5, 15, -15],
                rotateZ: [-25, -15, -30, -20, -25],
                rotateY: [10, -10, 10]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(60px)' }}
              className="relative text-7xl select-none filter drop-shadow-[0_15px_25px_rgba(236,72,153,0.6)]"
            >
              ✒️
            </motion.div>

            {/* Glowing Golden Script Ribbon Trail */}
            <motion.div
              animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transform: 'translateZ(20px)' }}
              className="absolute w-44 h-24 border-b-4 border-r-4 border-pink-400 rounded-[50px] rotate-[-15deg] blur-xs"
            />
            
            {/* Blooming 3D Flower Petals */}
            {['🌸', '💮', '🌺', '✨', '💖', '💮'].map((petal, idx) => (
              <motion.div
                key={idx}
                animate={{ 
                  y: [-20, 20, -20],
                  x: [idx * 20 - 50, idx * 20 - 30, idx * 20 - 50],
                  rotateZ: [0, 360],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{ 
                  duration: 4 + idx * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: idx * 0.3
                }}
                style={{ transform: `translateZ(${35 + idx * 10}px)` }}
                className="absolute text-2xl filter drop-shadow-md"
              >
                {petal}
              </motion.div>
            ))}
          </div>
        );

      case 'attendance':
        return (
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
            {/* 3D Golden Antique Pocket Watch / Sun Clock */}
            <motion.div
              animate={{ rotateY: [-20, 20, -20], rotateX: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(50px)' }}
              className="relative w-36 h-36 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 p-2 shadow-[0_20px_50px_rgba(245,158,11,0.5)] border-4 border-amber-200"
            >
              {/* Watch Face */}
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative shadow-inner border-2 border-amber-300 overflow-hidden">
                {/* Clock numbers marks */}
                {[12, 3, 6, 9].map((num, i) => (
                  <span 
                    key={num} 
                    className="absolute text-[10px] font-black text-amber-900"
                    style={{
                      top: i === 0 ? '4px' : i === 2 ? 'auto' : '50%',
                      bottom: i === 2 ? '4px' : 'auto',
                      left: i === 3 ? '6px' : i === 1 ? 'auto' : '50%',
                      right: i === 1 ? '6px' : 'auto',
                      transform: (i === 0 || i === 2) ? 'translateX(-50%)' : 'translateY(-50%)'
                    }}
                  >
                    {num}
                  </span>
                ))}

                {/* Spinning Hour Hand */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-1 h-8 bg-slate-800 rounded-full origin-bottom bottom-1/2 left-[calc(50%-2px)] shadow-xs"
                />

                {/* Spinning Minute Hand */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-0.5 h-12 bg-red-600 rounded-full origin-bottom bottom-1/2 left-[calc(50%-1px)]"
                />

                {/* Center Golden Pin */}
                <div className="w-3 h-3 rounded-full bg-amber-500 border border-white z-10 shadow-sm" />
              </div>
            </motion.div>

            {/* Radiating Sunshine Beams */}
            {['☀️', '⏰', '✨', '🌟', '🎒'].map((item, idx) => (
              <motion.div
                key={idx}
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotateZ: [idx * 72, idx * 72 + 360]
                }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity, delay: idx * 0.3 },
                  rotateZ: { duration: 10, repeat: Infinity, ease: 'linear' }
                }}
                className="absolute w-52 h-52 rounded-full pointer-events-none flex items-start justify-center"
                style={{ transform: `translateZ(${70 + idx * 8}px)` }}
              >
                <span className="text-2xl drop-shadow-lg">{item}</span>
              </motion.div>
            ))}
          </div>
        );

      case 'creativity':
        return (
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
            {/* 3D Glowing Edison Lightbulb with Rainbow Pulsing Filament */}
            <motion.div
              animate={{ 
                rotateY: [-25, 25, -25],
                y: [-10, 10, -10],
                scale: [1, 1.08, 1]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(60px)' }}
              className="relative text-8xl select-none filter drop-shadow-[0_0_35px_rgba(250,204,21,0.9)]"
            >
              💡
            </motion.div>

            {/* Pulsing Idea Shockwaves */}
            <motion.div
              animate={{ scale: [0.6, 1.6, 2], opacity: [0.8, 0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              style={{ transform: 'translateZ(20px)' }}
              className="absolute w-36 h-36 rounded-full border-4 border-yellow-400/80 bg-yellow-300/10 blur-xs"
            />
            
            {/* Floating Innovation & Art Particles */}
            {['🎨', '🚀', '✨', '⚡', '🌈', '🔮'].map((item, idx) => (
              <motion.div
                key={idx}
                animate={{ 
                  y: [-30, 30, -30],
                  x: [(idx - 2.5) * 30, (idx - 2.5) * 35, (idx - 2.5) * 30],
                  scale: [0.8, 1.3, 0.8],
                  rotateZ: [0, 360]
                }}
                transition={{ 
                  duration: 3 + idx * 0.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: idx * 0.25
                }}
                style={{ transform: `translateZ(${45 + idx * 10}px)` }}
                className="absolute text-3xl filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        );

      case 'kindness':
        return (
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
            {/* 3D Giant Pulsing Diamond Heart */}
            <motion.div
              animate={{ 
                scale: [1, 1.22, 1.05, 1.28, 1],
                rotateY: [-15, 15, -15],
                rotateZ: [-5, 5, -5]
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(65px)' }}
              className="relative text-8xl select-none filter drop-shadow-[0_0_40px_rgba(244,63,94,0.85)]"
            >
              💖
            </motion.div>

            {/* Orbiting Kindness Ribbon Rings */}
            <motion.div
              animate={{ rotateZ: 360, rotateX: [70, 70] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(30px)' }}
              className="absolute w-52 h-52 rounded-full border-4 border-dashed border-rose-300/70"
            />

            {/* Empathy Sparks */}
            {['🤝', '❤️', '🌸', '🌈', '✨', '💐'].map((item, idx) => (
              <motion.div
                key={idx}
                animate={{ 
                  y: [-25, 25, -25],
                  scale: [0.9, 1.25, 0.9],
                  rotateZ: [-20, 20, -20]
                }}
                transition={{ 
                  duration: 2.8 + idx * 0.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: idx * 0.3
                }}
                style={{ transform: `translateZ(${50 + idx * 8}px)` }}
                className="absolute text-3xl filter drop-shadow-md"
              >
                {item}
              </motion.div>
            ))}
          </div>
        );

      case 'progress':
        return (
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
            {/* 3D Cosmic Space Rocket blasting off */}
            <motion.div
              animate={{ 
                y: [15, -25, 15],
                x: [-10, 10, -10],
                rotateZ: [-10, 10, -10],
                scale: [1, 1.15, 1]
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(75px)' }}
              className="relative text-8xl select-none filter drop-shadow-[0_20px_35px_rgba(16,185,129,0.7)]"
            >
              🚀
            </motion.div>

            {/* Fiery Exhaust Boosters */}
            <motion.div
              animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transform: 'translateZ(40px)' }}
              className="absolute bottom-4 text-4xl select-none filter drop-shadow-[0_0_20px_#f97316]"
            >
              🔥
            </motion.div>

            {/* Rising Trajectory Clouds & Energy Arrows */}
            {['📈', '⭐', '✨', '⚡', '🎯', '💪'].map((item, idx) => (
              <motion.div
                key={idx}
                animate={{ 
                  y: [30, -40],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.3, 0.8]
                }}
                transition={{ 
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: idx * 0.4
                }}
                style={{ transform: `translateZ(${30 + idx * 12}px)` }}
                className="absolute text-2xl filter drop-shadow-md"
              >
                {item}
              </motion.div>
            ))}
          </div>
        );

      case 'champion':
      case 'laurel':
      case 'superstar':
      default:
        return (
          <div className="relative w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
            {/* 3D Tiered Championship Pedestal / Golden Sunburst Halo */}
            <motion.div
              animate={{ rotateZ: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              style={{ transform: 'translateZ(15px)' }}
              className="absolute w-56 h-56 rounded-full bg-[conic-gradient(from_0deg,#fbbf24,#f59e0b,#ec4899,#8b5cf6,#3b82f6,#fbbf24)] opacity-30 blur-md"
            />

            {/* 3D Giant Golden Trophy / Laurel Crown */}
            <motion.div
              animate={{ 
                rotateY: [-30, 30, -30],
                rotateX: [10, -10, 10],
                y: [-8, 8, -8],
                scale: [1, 1.12, 1]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(75px)' }}
              className="relative text-8xl select-none filter drop-shadow-[0_20px_45px_rgba(245,158,11,0.85)]"
            >
              {theme.id === 'champion' ? '🏆' : theme.id === 'laurel' ? '👑' : '⭐'}
            </motion.div>

            {/* Orbiting Victory Fireworks & Golden Laurel Leaves */}
            {theme.floatingParticles.map((item, idx) => (
              <motion.div
                key={idx}
                animate={{ 
                  rotateZ: [idx * (360 / theme.floatingParticles.length), idx * (360 / theme.floatingParticles.length) + 360],
                  scale: [0.9, 1.3, 0.9]
                }}
                transition={{ 
                  rotateZ: { duration: 8 + idx, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.2 }
                }}
                className="absolute w-48 h-48 rounded-full pointer-events-none flex items-start justify-center"
                style={{ transform: `translateZ(${60 + idx * 8}px)` }}
              >
                <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]">{item}</span>
              </motion.div>
            ))}
          </div>
        );
    }
  };

  return (
    <div 
      className="relative w-full flex flex-col items-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* 3D Holographic Parallax Card */}
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: rotateX,
          rotateY: rotateY,
        }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        style={{
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full max-w-sm h-72 sm:h-80 rounded-[2.5rem] bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-900/90 p-4 border-3 border-amber-400/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col items-center justify-between overflow-hidden cursor-grab active:cursor-grabbing backdrop-blur-xl"
      >
        {/* Dynamic Glowing Stage Backdrop */}
        <div 
          className="absolute inset-0 bg-radial from-amber-500/20 via-indigo-600/10 to-transparent pointer-events-none"
          style={{ transform: 'translateZ(-20px)' }}
        />

        {/* Top Floating Badge Badge Title Ribbon */}
        <div 
          style={{ transform: 'translateZ(45px)' }}
          className="w-full flex items-center justify-between px-3 pt-1 z-20"
        >
          <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[11px] font-black tracking-wider uppercase backdrop-blur-md flex items-center gap-1.5 shadow-sm">
            <span>✨ 3D Vinh Danh</span>
          </span>
          <span className="text-xs font-black text-white/90 bg-white/10 px-2.5 py-1 rounded-xl border border-white/20">
            {badge.name}
          </span>
        </div>

        {/* Central 3D Theme Model Scene */}
        <div className="relative w-full flex-1 flex items-center justify-center my-2">
          {render3DThemeScene()}
        </div>

        {/* Bottom Interactive Recipient Name Plaque */}
        <motion.div 
          style={{ transform: 'translateZ(55px)' }}
          className="w-full bg-gradient-to-r from-amber-500/30 via-yellow-400/20 to-amber-500/30 border border-amber-300/50 rounded-2xl py-2 px-4 text-center backdrop-blur-md shadow-lg z-20"
        >
          <div className="text-[10px] font-black uppercase tracking-widest text-amber-300">
            Trao tặng cho học sinh
          </div>
          <div className="text-base sm:text-lg font-black text-white truncate drop-shadow-md">
            🌟 {studentName} 🌟
          </div>
        </motion.div>

        {/* 3D Glass Light Reflection Glare effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 pointer-events-none rounded-[2.5rem]"
          style={{ transform: 'translateZ(70px)' }}
        />
      </motion.div>

      <p className="text-[11px] font-bold text-amber-300/80 mt-2 flex items-center gap-1.5 animate-pulse">
        <span>🔄 Di chuột hoặc xoay thẻ để ngắm hiệu ứng 3D đa chiều</span>
      </p>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useStore, useActiveClass } from '../store';
import { Target, Timer as TimerIcon, Play, RotateCcw, Pause, Shuffle, Sparkles, Star, Dices } from 'lucide-react';
import { cn, getAvatarUrl, playSound, triggerConfetti } from '../utils/helpers';
import { Student } from '../types';
import RandomGroupModal from '../components/modals/RandomGroupModal';

export default function Tools() {
  const soundEnabled = useStore(state => state.soundEnabled);
  const activeClass = useActiveClass();

  // Timer State
  const [timerDuration, setTimerDuration] = useState(5 * 60);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [timerActive, setTimerActive] = useState(false);

  // Lucky Star State
  const [luckyStudent, setLuckyStudent] = useState<Student | null>(null);
  const [isSpinningStar, setIsSpinningStar] = useState(false);

  // Wheel State
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const [isSpinningWheel, setIsSpinningWheel] = useState(false);
  const wheelOptions = ['+1 ⭐', '+2 ⭐', '+3 ⭐', '+5 ⭐', 'Chúc may mắn', 'Quay lại', 'Quà bí mật 🎁', '+10 ⭐'];

  // Random Group Modal State
  const [isRandomGroupOpen, setIsRandomGroupOpen] = useState(false);

  // Timeout Refs for leak prevention
  const starTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (starTimeoutRef.current) clearTimeout(starTimeoutRef.current);
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    };
  }, []);

  // Timer Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      if (soundEnabled) playSound('bell');
      triggerConfetti();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft, soundEnabled]);

  const handleSetTimer = (minutes: number) => {
    setTimerDuration(minutes * 60);
    setTimeLeft(minutes * 60);
    setTimerActive(false);
  };

  const handleToggleTimer = () => setTimerActive(!timerActive);
  const handleResetTimer = () => {
    setTimerActive(false);
    setTimeLeft(timerDuration);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Lucky Star Logic
  const handleLuckyStar = () => {
    if (!activeClass || activeClass.students.length === 0) return;
    if (starTimeoutRef.current) clearTimeout(starTimeoutRef.current);
    
    setIsSpinningStar(true);
    setLuckyStudent(null);
    
    starTimeoutRef.current = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * activeClass.students.length);
      setLuckyStudent(activeClass.students[randomIndex]);
      setIsSpinningStar(false);
      if (soundEnabled) playSound('success');
      triggerConfetti();
    }, 1800);
  };

  // Wheel Logic
  const handleSpinWheel = () => {
    if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    
    setIsSpinningWheel(true);
    setWheelResult(null);
    
    wheelTimeoutRef.current = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * wheelOptions.length);
      setWheelResult(wheelOptions[randomIndex]);
      setIsSpinningWheel(false);
      if (soundEnabled) playSound('tada');
    }, 1800);
  };

  if (!activeClass) {
    return (
      <div className="bg-white/90 rounded-3xl p-12 text-center text-slate-500 border border-purple-100 max-w-lg mx-auto mt-12">
        <h3 className="text-xl font-black text-slate-800 mb-2">Chưa chọn lớp học</h3>
        <p className="text-sm text-slate-500">Vui lòng tạo hoặc chọn một lớp học để sử dụng các công cụ.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/95 p-5 sm:p-6 rounded-[28px] border border-purple-100/80 shadow-[0_8px_30px_rgba(124,58,237,0.05)]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-sm shadow-teal-500/20">
            <Target size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Thử thách & Tiện ích Lớp học</h2>
            <p className="text-slate-500 text-xs font-semibold">
              Các công cụ hỗ trợ hoạt náo, bấm giờ và chia tổ học tập thú vị
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Random Group Generator Featured Tool Banner */}
        <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 rounded-[32px] p-6 md:p-8 shadow-[0_16px_36px_rgba(124,58,237,0.2)] text-white flex flex-col justify-between relative overflow-hidden lg:col-span-2 group">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black text-yellow-300 uppercase tracking-wider border border-white/20">
                <Sparkles size={14} /> Tiện ích thông minh
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                <Shuffle className="text-yellow-300" /> Hệ thống chia tổ ngẫu nhiên thông minh
              </h3>
              <p className="text-sm text-purple-100 font-medium leading-relaxed">
                Tự động chia học sinh theo số lượng tổ hoặc số bạn/tổ, tự động cân bằng giới tính (Nam/Nữ) và điểm số học lực, đặt tên tổ theo các chủ đề Vườn thú cute, Siêu anh hùng và xuất danh sách tức thì.
              </p>
            </div>

            <button
              onClick={() => setIsRandomGroupOpen(true)}
              className="px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 rounded-2xl font-black text-sm shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Shuffle size={18} /> MỞ BỘ CHIA TỔ
            </button>
          </div>
        </div>

        {/* Timer Box */}
        <div className="bg-white/95 rounded-[32px] p-6 md:p-8 shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80 flex flex-col items-center">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <TimerIcon className="text-purple-600" /> Đồng hồ bấm giờ học tập
          </h3>
          
          <div className="text-6xl md:text-7xl font-black font-mono text-purple-950 mb-6 tracking-tighter tabular-nums drop-shadow-sm">
            {formatTime(timeLeft)}
          </div>

          <div className="flex gap-4 mb-6">
            <button 
              onClick={handleToggleTimer} 
              className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              {timerActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
            <button 
              onClick={handleResetTimer} 
              className="w-14 h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <RotateCcw size={24} />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {[1, 3, 5, 10, 15].map(m => (
              <button 
                key={m} 
                onClick={() => handleSetTimer(m)}
                className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-black text-xs rounded-xl border border-purple-200 transition-colors cursor-pointer"
              >
                {m} phút
              </button>
            ))}
          </div>
        </div>

        {/* Lucky Star Box */}
        <div className="bg-white/95 rounded-[32px] p-6 md:p-8 shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80 flex flex-col items-center text-center">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <Star className="text-amber-500 fill-amber-400" /> Ngôi sao may mắn
          </h3>

          <div className="flex-1 flex flex-col items-center justify-center w-full relative min-h-[180px]">
            {isSpinningStar ? (
              <div className="flex flex-col items-center justify-center">
                <div className="w-24 h-24 border-6 border-purple-100 border-t-amber-400 rounded-full animate-spin mb-3"></div>
                <div className="font-black text-slate-400 text-xs animate-pulse">Đang quay ngẫu nhiên...</div>
              </div>
            ) : luckyStudent ? (
              <div className="animate-bounce-in flex flex-col items-center">
                <img 
                  src={getAvatarUrl(luckyStudent.avatarId, activeClass.customAvatars)} 
                  alt="" 
                  className="w-24 h-24 rounded-full border-4 border-amber-300 shadow-xl mb-3 bg-slate-50 object-cover" 
                />
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                  {luckyStudent.name}
                </div>
                <div className="text-slate-500 text-xs font-bold mt-1">Là bạn may mắn được gọi hôm nay! 🎉</div>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-dashed border-purple-200 flex items-center justify-center text-slate-300">
                <Star size={40} />
              </div>
            )}
          </div>

          <button 
            onClick={handleLuckyStar}
            disabled={isSpinningStar || activeClass.students.length === 0}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-sm shadow-md shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-xs cursor-pointer"
          >
            {luckyStudent ? "Chọn bạn khác" : "Gọi ngẫu nhiên"}
          </button>
        </div>

        {/* Lucky Wheel Box */}
        <div className="bg-white/95 rounded-[32px] p-6 md:p-8 shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80 flex flex-col items-center text-center lg:col-span-2">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <Dices className="text-pink-500" /> Vòng quay quà tặng bất ngờ
          </h3>

          <div className="flex-1 flex flex-col items-center justify-center w-full relative min-h-[160px] mb-6">
            {isSpinningWheel ? (
               <div className="flex flex-col items-center justify-center">
                 <div className="w-24 h-24 border-6 border-purple-100 border-t-pink-500 rounded-full animate-spin mb-3"></div>
                 <div className="font-black text-slate-400 text-xs animate-pulse">Vòng quay đang dừng lại...</div>
               </div>
            ) : wheelResult ? (
              <div className="animate-bounce-in bg-pink-50 border border-pink-200 text-pink-700 px-8 py-5 rounded-2xl w-full max-w-sm">
                <div className="text-xs font-black uppercase tracking-widest mb-1 text-pink-500">Phần thưởng trúng</div>
                <div className="text-3xl font-black">{wheelResult}</div>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {wheelOptions.map((opt, i) => (
                  <span key={i} className="bg-purple-50/60 border border-purple-100 px-3.5 py-1.5 rounded-xl text-slate-700 font-bold text-xs">
                    {opt}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={handleSpinWheel}
            disabled={isSpinningWheel}
            className="px-8 py-3.5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white rounded-2xl font-black text-sm shadow-md shadow-pink-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-xs cursor-pointer"
          >
            QUAY THƯỞNG NGAY
          </button>
        </div>
      </div>

      {/* Random Group Modal */}
      <RandomGroupModal 
        isOpen={isRandomGroupOpen} 
        onClose={() => setIsRandomGroupOpen(false)} 
      />
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, KeyRound, Shield, AlertCircle, X, Check, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../../store';
import { cn, playSound } from '../../utils/helpers';

export function PinAuthModal() {
  const pinAuthModal = useStore(state => state.pinAuthModal);
  const setPinAuthModal = useStore(state => state.setPinAuthModal);
  const teacherPin = useStore(state => state.teacherPin) || '1234';
  const unlockTeacher = useStore(state => state.unlockTeacher);
  const showToast = useStore(state => state.showToast);
  const soundEnabled = useStore(state => state.soundEnabled);

  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pinAuthModal?.isOpen) {
      setPinInput('');
      setErrorMsg('');
      setIsShaking(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [pinAuthModal?.isOpen]);

  if (!pinAuthModal?.isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pinInput.trim()) {
      setErrorMsg('Vui lòng nhập mã PIN');
      return;
    }

    if (unlockTeacher(pinInput.trim())) {
      if (soundEnabled) playSound('success');
      showToast('Đã xác thực Giáo viên chủ nhiệm thành công!', 'success');
      const callback = pinAuthModal.onSuccess;
      setPinAuthModal(null);
      if (callback) callback();
    } else {
      if (soundEnabled) playSound('error');
      setErrorMsg('Mã PIN không chính xác. Mã mặc định: 1234');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPinInput('');
    }
  };

  const handleKeypadPress = (digit: string) => {
    if (pinInput.length < 8) {
      setPinInput(prev => prev + digit);
      setErrorMsg('');
    }
  };

  const handleBackspace = () => {
    setPinInput(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className={cn(
          "w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden transition-all duration-300",
          isShaking && "animate-shake"
        )}
      >
        {/* Header */}
        <div className="relative p-6 pb-4 text-center bg-gradient-to-br from-purple-700 via-indigo-700 to-pink-600 text-white">
          <button
            onClick={() => setPinAuthModal(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
          
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 shadow-lg ring-4 ring-white/10">
            <Shield size={28} className="text-amber-300" />
          </div>

          <h3 className="text-xl font-black tracking-tight">
            {pinAuthModal.title || 'Xác thực Giáo viên Chủ nhiệm'}
          </h3>
          <p className="text-xs text-purple-100 mt-1 font-medium">
            Nhập mã PIN để mở khóa quyền chỉnh sửa và quản trị lớp học
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? "text" : "password"}
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Nhập mã PIN (Mặc định: 1234)"
                className="w-full text-center tracking-widest text-2xl font-black py-3 px-10 bg-slate-50 border-2 border-purple-200 rounded-2xl focus:border-purple-600 focus:bg-white focus:outline-none transition-all text-slate-800 placeholder:text-sm placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100 animate-fade-in">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    if (k === 'C') setPinInput('');
                    else if (k === '⌫') handleBackspace();
                    else handleKeypadPress(k);
                  }}
                  className={cn(
                    "h-11 rounded-xl font-black text-base transition-all active:scale-95 cursor-pointer shadow-2xs",
                    k === 'C' || k === '⌫' 
                      ? "bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm" 
                      : "bg-purple-50/70 hover:bg-purple-100 text-purple-900 border border-purple-100/80 hover:border-purple-300"
                  )}
                >
                  {k}
                </button>
              ))}
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPinAuthModal(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-md shadow-purple-500/20 hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Unlock size={14} /> Mở khóa
              </button>
            </div>
          </form>

          <div className="text-center pt-1 border-t border-slate-100">
            <p className="text-[11px] text-slate-400">
              💡 Mã PIN mặc định là <span className="font-bold text-purple-700">1234</span>. Thầy/Cô có thể đổi mã trong mục Cài đặt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

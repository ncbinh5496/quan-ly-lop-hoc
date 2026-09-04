import React, { useState } from 'react';
import { useStore } from '../../store';
import { Sparkles, Type, Quote, RotateCcw, Save, Eye } from 'lucide-react';

export default function BrandingSettings() {
  const appTitle = useStore(state => state.appTitle);
  const appSlogan = useStore(state => state.appSlogan);
  const setAppBranding = useStore(state => state.setAppBranding);
  const showToast = useStore(state => state.showToast);

  const [titleInput, setTitleInput] = useState(appTitle || 'HÀNH TRÌNH CHINH PHỤC VINH QUANG');
  const [sloganInput, setSloganInput] = useState(
    appSlogan !== undefined ? appSlogan : 'Mỗi ngày một cố gắng – Mỗi việc tốt một ngôi sao'
  );

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) {
      showToast('Vui lòng nhập tên ứng dụng', 'error');
      return;
    }

    setAppBranding({
      appTitle: titleInput.trim(),
      appSlogan: sloganInput.trim(),
    });

    showToast('Đã lưu tên ứng dụng & khẩu hiệu thành công!');
  };

  const handleResetBranding = () => {
    const defaultTitle = 'HÀNH TRÌNH CHINH PHỤC VINH QUANG';
    const defaultSlogan = 'Mỗi ngày một cố gắng – Mỗi việc tốt một ngôi sao';
    setTitleInput(defaultTitle);
    setSloganInput(defaultSlogan);
    setAppBranding({
      appTitle: defaultTitle,
      appSlogan: defaultSlogan,
    });
    showToast('Đã khôi phục tên ứng dụng & khẩu hiệu về mặc định!');
  };

  const titleSuggestions = [
    'HÀNH TRÌNH CHINH PHỤC VINH QUANG',
    'LỚP HỌC HẠNH PHÚC',
    'ĐƯỜNG LÊN ĐỈNH VINH QUANG',
    'VƯỜN HOA ĐIỂM 10',
    'ĐUA TOP SAO SÁNG',
  ];

  const sloganSuggestions = [
    'Mỗi ngày một cố gắng – Mỗi việc tốt một ngôi sao',
    'Chăm ngoan học giỏi – Tích lũy sao vàng',
    'Đoàn kết – Tự tin – Sáng tạo – Vươn xa',
    'Học hết sức – Chơi hết mình – Rinh quà xịn',
    'Kỷ luật là sức mạnh – Yêu thương là gắn kết',
  ];

  return (
    <div className="bg-white/95 rounded-[28px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100/80 flex items-center justify-center text-purple-600 text-xl border border-purple-200">
            ✨
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-800">Tên Ứng Dụng & Khẩu Hiệu Lớp Học</h3>
            <p className="text-xs text-slate-500">Tùy biến tiêu đề chính và câu châm ngôn xuất hiện trên thanh điều hướng & giao diện</p>
          </div>
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-2 right-3 flex items-center gap-1 text-[11px] font-bold text-yellow-300 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
          <Eye size={12} /> Xem trước thực tế
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-xl shadow-lg shrink-0">
            🏆
          </div>
          <div className="min-w-0">
            <h4 className="text-sm sm:text-base font-black tracking-wider uppercase truncate text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-white">
              {titleInput || 'TÊN ỨNG DỤNG CỦA BẠN'}
            </h4>
            <p className="text-[11px] text-pink-200/90 font-medium italic truncate mt-0.5">
              "{sloganInput || 'Khẩu hiệu châm ngôn của lớp học...'}"
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveBranding} className="space-y-4">
        {/* Tên ứng dụng */}
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Type size={15} className="text-purple-600" /> Tên ứng dụng / Tiêu đề chính <span className="text-rose-500">*</span>
          </label>
          <input 
            type="text" 
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-black text-slate-800 uppercase tracking-wide text-sm"
            placeholder="VD: HÀNH TRÌNH CHINH PHỤC VINH QUANG"
            required
          />
          {/* Quick title suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[11px] font-semibold text-slate-400">Gợi ý nhanh:</span>
            {titleSuggestions.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTitleInput(sug)}
                className="text-[11px] font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/80 px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Câu khẩu hiệu */}
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Quote size={15} className="text-purple-600" /> Câu khẩu hiệu / Châm ngôn lớp học
          </label>
          <input 
            type="text" 
            value={sloganInput}
            onChange={(e) => setSloganInput(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs font-semibold text-slate-800"
            placeholder="VD: Mỗi ngày một cố gắng – Mỗi việc tốt một ngôi sao"
          />
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[11px] font-semibold text-slate-400">Gợi ý nhanh:</span>
            {sloganSuggestions.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSloganInput(sug)}
                className="text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
          <button 
            type="button"
            onClick={handleResetBranding}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw size={14} /> Khôi phục mặc định
          </button>

          <button 
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-2xl font-black text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Save size={16} /> Lưu tên & khẩu hiệu
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import { Smartphone, QrCode, CloudCheck, ExternalLink, Sparkles, Copy, Check } from 'lucide-react';
import { useStore } from '../../store';

export default function CloudSyncSettingsSection() {
  const showToast = useStore(state => state.showToast);
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}&margin=6`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      showToast('Đã sao chép liên kết vào bộ nhớ tạm!');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      showToast('Vui lòng sao chép thủ công liên kết', 'info');
    }
  };

  return (
    <div className="bg-white/95 p-6 rounded-[28px] border border-purple-100/80 shadow-[0_8px_30px_rgba(124,58,237,0.05)] space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-purple-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-xs">
            <Smartphone size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <span>Đồng Bộ Đám Mây & Dùng Trên Điện Thoại</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                ĐANG HOẠT ĐỘNG
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Chỉnh sửa trên máy tính hoặc điện thoại đều được đồng bộ thời gian thực tự động
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-5 p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-teal-50/50 to-purple-50/50 border border-emerald-100">
        <div className="w-36 h-36 bg-white p-2 rounded-2xl shadow-sm border border-emerald-200 shrink-0 flex items-center justify-center">
          <img 
            src={qrCodeUrl} 
            alt="Mã QR mở trên điện thoại" 
            className="w-full h-full object-contain rounded-lg"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-3 flex-1 text-center md:text-left">
          <div>
            <h4 className="font-black text-sm text-slate-800 flex items-center justify-center md:justify-start gap-1.5">
              <QrCode size={16} className="text-emerald-600" />
              <span>Quét mã QR để mở trực tiếp trên điện thoại</span>
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Mở Camera điện thoại hoặc tính năng Quét mã trên Zalo để quét mã và sử dụng đầy đủ mọi tính năng chấm điểm, quản lý nhóm, xem vinh danh.
            </p>
          </div>

          <div className="flex items-center gap-2 max-w-lg">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs font-mono text-slate-700 select-all"
            />
            <button
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Đã chép' : 'Sao chép link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Smartphone, 
  Check, 
  Copy, 
  QrCode, 
  X, 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  Globe, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../store';

interface MobileSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSyncModal({ isOpen, onClose }: MobileSyncModalProps) {
  const showToast = useStore(state => state.showToast);
  const activeWorkspaceId = useStore(state => state.activeWorkspaceId);
  const [copied, setCopied] = useState(false);
  const [useSharedPreUrl, setUseSharedPreUrl] = useState(true);
  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const [isEditingCustomUrl, setIsEditingCustomUrl] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const publicSharedOrigin = currentOrigin.replace('ais-dev-', 'ais-pre-');
  const isAisDev = currentOrigin.includes('ais-dev-');

  let chosenOrigin = currentOrigin;
  if (customBaseUrl.trim()) {
    chosenOrigin = customBaseUrl.trim().replace(/\/$/, '');
  } else if (isAisDev && useSharedPreUrl) {
    chosenOrigin = publicSharedOrigin;
  }

  const workspaceParam = activeWorkspaceId ? `?workspace=${activeWorkspaceId}` : '';
  const mobileUrl = `${chosenOrigin}${pathname}${workspaceParam}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(mobileUrl)}&margin=8`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mobileUrl);
      setCopied(true);
      showToast('Đã sao chép liên kết vào bộ nhớ tạm!');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      showToast('Vui lòng sao chép thủ công liên kết', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[32px] max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-purple-100 relative space-y-5 animate-scale-up max-h-[94vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 border-b border-purple-50 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-2xl shadow-md shadow-purple-500/20 shrink-0">
            <Smartphone size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg text-slate-800">Dùng Trên Điện Thoại & Máy Tính</h3>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded-full uppercase tracking-wider">
                Đám Mây
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Dữ liệu, điểm số, học sinh tự động đồng bộ ngay lập tức giữa 2 thiết bị
            </p>
          </div>
        </div>

        {/* Troubleshooting Callout */}
        {isAisDev && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle size={15} className="text-amber-600 shrink-0" />
                Nếu điện thoại báo lỗi hoặc không mở được:
              </span>
              <button
                onClick={() => setShowTroubleshoot(!showTroubleshoot)}
                className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <HelpCircle size={13} />
                <span>{showTroubleshoot ? 'Thu gọn' : 'Xem lý do'}</span>
              </button>
            </div>
            <p className="text-amber-900 text-[11px] leading-relaxed">
              Mã QR bên dưới đã được chuyển sang dạng <strong>Link Công khai (Shared URL)</strong> để mọi điện thoại quét đều vào được trực tiếp!
            </p>

            {showTroubleshoot && (
              <div className="p-2.5 bg-white/90 rounded-xl border border-amber-200 text-[11px] text-slate-700 space-y-1">
                <p className="font-bold text-purple-900">Cách mở quyền nếu điện thoại vẫn báo 403 / Access Denied:</p>
                <ol className="list-decimal pl-4 space-y-0.5 text-[11px]">
                  <li>Bấm nút <strong>"Share" (Chia sẻ)</strong> ở góc trên cùng bên phải giao diện AI Studio.</li>
                  <li>Copy link công khai và dán vào mục tùy chỉnh bên dưới.</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* QR Code Section */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-50/80 to-pink-50/60 border border-purple-100">
          <div className="w-44 h-44 bg-white p-2.5 rounded-2xl shadow-md border border-purple-100 flex items-center justify-center shrink-0">
            <img 
              src={qrCodeUrl} 
              alt="Mã QR mở trên điện thoại" 
              className="w-full h-full object-contain rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-3 text-center sm:text-left flex-1">
            <div className="space-y-1">
              <h4 className="font-black text-sm text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
                <QrCode size={16} className="text-purple-600" /> Quét mã bằng Camera / Zalo
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Mở ứng dụng <strong>Camera</strong> hoặc <strong>Zalo</strong> trên điện thoại và quét mã QR để mở ứng dụng ngay lập tức.
              </p>
            </div>

            <div className="pt-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                <Sparkles size={13} className="text-emerald-600" />
                <span>Chấm điểm trên điện thoại sẽ tự lưu lên máy tính!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Link Section */}
        <div className="space-y-2">
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
            Đường link truy cập trên điện thoại:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={mobileUrl}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-xs ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>
          </div>
        </div>

        {/* Custom Base URL Toggle */}
        <div className="text-right">
          {!isEditingCustomUrl ? (
            <button
              onClick={() => setIsEditingCustomUrl(true)}
              className="text-[11px] font-bold text-slate-500 hover:text-purple-700 transition-colors cursor-pointer"
            >
              ⚙️ Hoặc dán link Chia sẻ tùy chỉnh...
            </button>
          ) : (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Dán link Public Shared URL:</span>
                <button
                  onClick={() => {
                    setCustomBaseUrl('');
                    setIsEditingCustomUrl(false);
                  }}
                  className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Hủy
                </button>
              </div>
              <input
                type="url"
                value={customBaseUrl}
                onChange={(e) => setCustomBaseUrl(e.target.value)}
                placeholder="https://ais-pre-...run.app"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
              />
            </div>
          )}
        </div>

        {/* Benefits list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[11px] font-semibold text-slate-600">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-base">⚡</span>
            <span>Cộng/trừ điểm cập nhật ngay lập tức</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-base">📱</span>
            <span>Giao diện điện thoại mượt mà, đầy đủ tính năng</span>
          </div>
        </div>
      </div>
    </div>
  );
}

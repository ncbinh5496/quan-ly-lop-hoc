import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  Share2, 
  Users, 
  ShieldCheck, 
  Smartphone, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  Globe,
  Settings,
  HelpCircle,
  Link
} from 'lucide-react';
import { useStore } from '../../store';

interface ShareParentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareParentModal({ isOpen, onClose }: ShareParentModalProps) {
  const { teacher, classes, activeClassId, activeWorkspaceId, showToast, teacherPin } = useStore();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedZalo, setCopiedZalo] = useState(false);
  const [useSharedPreUrl, setUseSharedPreUrl] = useState(true);
  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const [isEditingCustomUrl, setIsEditingCustomUrl] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  const activeClass = classes.find(c => c.id === activeClassId);

  if (!isOpen) return null;

  // Build the Base Origin & Parent Portal URL
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  
  // Convert ais-dev to ais-pre if in development preview
  const publicSharedOrigin = currentOrigin.replace('ais-dev-', 'ais-pre-');
  const isAisDev = currentOrigin.includes('ais-dev-');

  let chosenOrigin = currentOrigin;
  if (customBaseUrl.trim()) {
    chosenOrigin = customBaseUrl.trim().replace(/\/$/, '');
  } else if (isAisDev && useSharedPreUrl) {
    chosenOrigin = publicSharedOrigin;
  }

  const workspaceParam = activeWorkspaceId ? `&workspace=${activeWorkspaceId}` : '';
  const classParam = activeClassId ? `&classId=${activeClassId}` : '';
  const parentUrl = `${chosenOrigin}${pathname}?role=parent${workspaceParam}${classParam}`;

  // High-reliability QR Code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(parentUrl)}&margin=10`;

  const zaloMessageTemplate = `Kính gửi Quý Phụ huynh lớp ${activeClass?.name || ''},\n\nCô gửi đường link để Quý phụ huynh tiện theo dõi kết quả học tập, điểm thưởng thi đua và nề nếp hàng ngày của con:\n🔗 ${parentUrl}\n\n*Lưu ý: Phụ huynh chỉ cần bấm vào link hoặc quét mã QR để xem trực tiếp (chế độ chỉ xem), không cần cài đặt ứng dụng phức tạp.\n\nTrân trọng,\n${teacher?.name || 'Giáo viên chủ nhiệm'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(parentUrl);
    setCopiedLink(true);
    showToast('Đã sao chép liên kết dành cho Phụ huynh!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyZalo = () => {
    navigator.clipboard.writeText(zaloMessageTemplate);
    setCopiedZalo(true);
    showToast('Đã sao chép tin nhắn gửi nhóm Zalo Phụ huynh!', 'success');
    setTimeout(() => setCopiedZalo(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white rounded-[28px] shadow-2xl border border-purple-100 overflow-hidden my-auto flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-600 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-md shrink-0">
              <Share2 size={24} />
            </div>
            <div className="min-w-0 pr-8">
              <h3 className="text-lg sm:text-xl font-black tracking-tight">
                Chia sẻ cho Phụ Huynh Học Sinh
              </h3>
              <p className="text-xs text-purple-100 mt-0.5 truncate">
                Xem sổ nề nếp, điểm thi đua và khen thưởng lớp <strong>{activeClass?.name}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 bg-slate-50/50">
          {/* Troubleshooting Callout for Mobile Scan */}
          <div className="p-3.5 bg-amber-50 border border-amber-200/90 rounded-2xl text-xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-extrabold text-amber-950 flex items-center gap-1.5">
                <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                Lưu ý khi mở link trên điện thoại hoặc gửi phụ huynh:
              </span>
              <button
                onClick={() => setShowTroubleshoot(!showTroubleshoot)}
                className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer flex items-center gap-0.5 shrink-0"
              >
                <HelpCircle size={13} />
                <span>{showTroubleshoot ? 'Thu gọn' : 'Xem hướng dẫn'}</span>
              </button>
            </div>

            <p className="text-amber-900 leading-relaxed text-[11px]">
              {isAisDev ? (
                <>
                  Link <strong>ais-pre-</strong> (công khai) giúp điện thoại quét mã QR hoặc bấm vào link mở được ngay 100% mà không bị yêu cầu đăng nhập tài khoản lập trình viên.
                </>
              ) : (
                <>
                  Phụ huynh có thể mở link trên mọi trình duyệt (Safari, Chrome, Zalo) trên điện thoại và máy tính.
                </>
              )}
            </p>

            {showTroubleshoot && (
              <div className="p-3 bg-white/90 rounded-xl border border-amber-200 text-[11px] text-slate-700 space-y-2">
                <p className="font-bold text-purple-900">
                  📱 Nếu điện thoại báo "403 / Access Denied" hoặc bắt đăng nhập:
                </p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Ở góc trên cùng bên phải giao diện Google AI Studio, bấm nút <strong>"Share"</strong> (Chia sẻ).</li>
                  <li>Bật chia sẻ công khai và sao chép đường link đã tạo.</li>
                  <li>Bấm vào <strong>"Dán link tùy chỉnh"</strong> bên dưới để cập nhật mã QR cho link đó.</li>
                </ol>
              </div>
            )}
          </div>

          {/* Link Type Selector */}
          {isAisDev && (
            <div className="flex items-center justify-between gap-2 bg-purple-50/70 p-2 rounded-2xl border border-purple-100 flex-wrap">
              <span className="text-[11px] font-extrabold text-purple-950 px-2 flex items-center gap-1.5">
                <Globe size={14} className="text-purple-600" />
                Chế độ liên kết:
              </span>
              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  onClick={() => {
                    setUseSharedPreUrl(true);
                    setCustomBaseUrl('');
                    setIsEditingCustomUrl(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    useSharedPreUrl && !customBaseUrl
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white text-purple-800 hover:bg-purple-100'
                  }`}
                >
                  🌐 Link Công khai (Phụ huynh & Điện thoại)
                </button>
                <button
                  onClick={() => {
                    setUseSharedPreUrl(false);
                    setCustomBaseUrl('');
                    setIsEditingCustomUrl(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    !useSharedPreUrl && !customBaseUrl
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white text-purple-800 hover:bg-purple-100'
                  }`}
                >
                  💻 Link Xem thử Dev
                </button>
              </div>
            </div>
          )}

          {/* Custom URL Input Toggle */}
          <div className="text-right">
            {!isEditingCustomUrl ? (
              <button
                onClick={() => setIsEditingCustomUrl(true)}
                className="text-[11px] font-bold text-slate-500 hover:text-purple-700 transition-colors cursor-pointer"
              >
                ⚙️ Hoặc dán đường link Share / Deploy riêng...
              </button>
            ) : (
              <div className="p-3 bg-white rounded-2xl border border-purple-200 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Dán link Shared / Deploy từ AI Studio:</span>
                  <button
                    onClick={() => {
                      setCustomBaseUrl('');
                      setIsEditingCustomUrl(false);
                    }}
                    className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Hủy tùy chỉnh
                  </button>
                </div>
                <input
                  type="url"
                  value={customBaseUrl}
                  onChange={(e) => setCustomBaseUrl(e.target.value)}
                  placeholder="https://ais-pre-...run.app"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
                />
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
            <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-relaxed">
              <strong className="block text-emerald-950 font-bold">Chế độ xem an toàn (Chỉ đọc):</strong>
              Phụ huynh chỉ có thể <strong>xem điểm, huy hiệu, nhật ký rèn luyện và bảng xếp hạng</strong>. Thao tác cộng/trừ điểm và cài đặt đều được khóa an toàn bằng Mã PIN Giáo viên.
            </div>
          </div>

          {/* QR Code & Direct Link */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-purple-100 shadow-2xs flex flex-col sm:flex-row items-center gap-5">
            {/* QR Image */}
            <div className="p-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm shrink-0 flex flex-col items-center">
              <img
                src={qrCodeUrl}
                alt="QR Code Phụ Huynh"
                className="w-36 h-36 rounded-xl object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] font-black text-purple-700 mt-1 uppercase tracking-wider">
                Quét mã để xem
              </span>
            </div>

            {/* URL input and Copy */}
            <div className="flex-1 w-full space-y-2.5 text-left">
              <label className="text-xs font-black text-slate-700 block">
                Đường dẫn tra cứu dành cho Phụ huynh:
              </label>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-purple-800 break-all select-all max-h-20 overflow-y-auto">
                {parentUrl}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedLink ? 'Đã chép link!' : 'Sao chép link'}</span>
                </button>
                <a
                  href={parentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center"
                  title="Mở thử nghiệm chế độ phụ huynh trong tab mới"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Zalo Message Template */}
          <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <MessageSquare size={15} className="text-blue-500" />
                Mẫu tin nhắn gửi nhóm Zalo lớp:
              </span>
              <button
                onClick={handleCopyZalo}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
              >
                {copiedZalo ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copiedZalo ? 'Đã sao chép!' : 'Chép mẫu tin'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={4}
              value={zaloMessageTemplate}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed font-sans resize-none focus:outline-none"
            />
          </div>

          {/* Teacher PIN reminder */}
          <div className="text-xs text-slate-500 flex items-center justify-between p-3 bg-purple-50/50 rounded-xl border border-purple-100">
            <span>
              🔑 Mã PIN quản trị Giáo viên hiện tại: <strong className="text-purple-800 font-mono text-sm">{teacherPin}</strong>
            </span>
            <span className="text-[11px] text-purple-600 font-medium">Có thể đổi trong Cài đặt</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

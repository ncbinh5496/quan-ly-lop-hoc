import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  QrCode, 
  Share2, 
  Eye, 
  Lock, 
  Unlock, 
  Check, 
  Copy, 
  Smartphone,
  Info,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../store';
import { ShareParentModal } from '../modals/ShareParentModal';

export default function ParentShareSecuritySettings() {
  const { 
    teacherPin, 
    setTeacherPin, 
    showToast, 
    userRole, 
    setUserRole,
    classes,
    activeClassId
  } = useStore();

  const [pinInput, setPinInput] = useState(teacherPin || '1234');
  const [isEditingPin, setIsEditingPin] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeClass = classes.find(c => c.id === activeClassId);

  const handleSavePin = () => {
    if (!pinInput || pinInput.trim().length < 4) {
      showToast('⚠️ Mã PIN phải có ít nhất 4 chữ số!');
      return;
    }
    setTeacherPin(pinInput.trim());
    setIsEditingPin(false);
    showToast('✅ Đã cập nhật Mã PIN Giáo viên chủ nhiệm thành công!');
  };

  const getParentShareUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin.replace('ais-dev-', 'ais-pre-') : '';
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    const url = new URL(origin + path);
    url.searchParams.set('role', 'parent');
    if (activeClassId) {
      url.searchParams.set('classId', activeClassId);
    }
    return url.toString();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getParentShareUrl());
    setCopied(true);
    showToast('📋 Đã sao chép liên kết dành cho Phụ huynh!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <div className="bg-white/95 p-6 rounded-[28px] border border-purple-100/80 shadow-[0_8px_30px_rgba(124,58,237,0.05)] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-purple-50 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 tracking-tight">
                Phân quyền Phụ huynh & Mã PIN Giáo viên
              </h3>
              <p className="text-slate-500 text-xs font-semibold">
                Bảo vệ quyền chỉnh sửa điểm, tạo link xem chỉ đọc cho Phụ huynh học sinh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md shadow-purple-500/20 transition-all cursor-pointer active:scale-95"
            >
              <Share2 size={14} className="text-amber-300" />
              <span>Gửi link & Mã QR</span>
            </button>
          </div>
        </div>

        {/* Informational Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border border-purple-100/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-white text-purple-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
            <Info size={16} />
          </div>
          <div className="text-xs text-slate-700 space-y-1">
            <p className="font-extrabold text-purple-950">
              Cơ chế hoạt động phân quyền:
            </p>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
              <li>
                <strong>Phụ huynh:</strong> Xem bảng thi đua, điểm nề nếp, lịch sử sao, huy hiệu, quà tặng và hồ sơ chi tiết của con (Chỉ đọc, không được sửa điểm).
              </li>
              <li>
                <strong>Giáo viên chủ nhiệm:</strong> Toàn quyền cộng/trừ điểm, đổi avatar, chỉnh sửa tên học sinh, cài đặt hệ thống. Được bảo vệ bởi <strong>Mã PIN bảo mật</strong>.
              </li>
            </ul>
          </div>
        </div>

        {/* Grid 2 Columns: PIN Config & Fast Share */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PIN Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <KeyRound size={15} className="text-purple-600" /> Mã PIN Giáo viên chủ nhiệm
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
                Bảo mật
              </span>
            </div>

            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Mã PIN dùng để xác thực quyền Giáo viên khi chuyển từ chế độ Phụ huynh sang chế độ Quản lý.
            </p>

            {isEditingPin ? (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  maxLength={8}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Nhập 4-6 số PIN..."
                  className="flex-1 px-3 py-2 bg-white border border-purple-300 rounded-xl text-center text-sm font-black tracking-widest text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  onClick={handleSavePin}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer"
                >
                  Lưu PIN
                </button>
                <button
                  onClick={() => {
                    setPinInput(teacherPin || '1234');
                    setIsEditingPin(false);
                  }}
                  className="px-2.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-purple-100">
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-purple-600" />
                  <span className="text-sm font-black tracking-widest text-slate-800">
                    {teacherPin ? '••••' : '1234'} ({teacherPin || '1234'})
                  </span>
                </div>
                <button
                  onClick={() => setIsEditingPin(true)}
                  className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-extrabold transition-all cursor-pointer"
                >
                  Đổi mã PIN
                </button>
              </div>
            )}
          </div>

          {/* Quick Share Link Box */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                <QrCode size={15} className="text-purple-600" /> Link Phụ Huynh ({activeClass?.name})
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                Chỉ đọc
              </span>
            </div>

            <p className="text-[11px] text-purple-900/80 font-medium truncate">
              {getParentShareUrl()}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2 px-3 bg-white hover:bg-purple-100/80 text-purple-900 border border-purple-200 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copied ? 'Đã chép link' : 'Sao chép link'}</span>
              </button>

              <button
                onClick={() => setUserRole('parent')}
                className="py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Xem thử giao diện mà Phụ huynh sẽ thấy"
              >
                <Eye size={14} />
                <span>Xem thử</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ShareParentModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </>
  );
}

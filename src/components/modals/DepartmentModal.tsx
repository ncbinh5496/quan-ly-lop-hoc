import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Users, 
  School, 
  Sparkles, 
  QrCode, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  TrendingUp, 
  Star, 
  KeyRound, 
  Download, 
  Share2, 
  GraduationCap,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../store';
import { TeacherWorkspace } from '../../types';

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepartmentModal({ isOpen, onClose }: DepartmentModalProps) {
  const workspaces = useStore(state => state.workspaces);
  const activeWorkspaceId = useStore(state => state.activeWorkspaceId);
  const switchWorkspace = useStore(state => state.switchWorkspace);
  const departmentInfo = useStore(state => state.departmentInfo);
  const setDepartmentInfo = useStore(state => state.setDepartmentInfo);
  const syncStandardToAllWorkspaces = useStore(state => state.syncStandardToAllWorkspaces);
  const initializeDepartment10Classes = useStore(state => state.initializeDepartment10Classes);
  const showToast = useStore(state => state.showToast);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'sync' | 'parent_links' | 'settings'>('dashboard');
  const [selectedQrWorkspace, setSelectedQrWorkspace] = useState<TeacherWorkspace | null>(null);
  const [isConfirmingReset10, setIsConfirmingReset10] = useState(false);

  // Editable department settings
  const [deptName, setDeptName] = useState(departmentInfo?.name || 'Tổ Chuyên Môn Khối 2');
  const [schoolName, setSchoolName] = useState(departmentInfo?.schoolName || 'Trường Tiểu học Hùng Vương');
  const [leaderName, setLeaderName] = useState(departmentInfo?.leaderName || 'Cô Phương Anh (Lớp 2A6)');
  const [academicYear, setAcademicYear] = useState(departmentInfo?.academicYear || '2026-2027');

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';

  // Aggregate stats across all 10 classes
  const totalClasses = workspaces.length;
  const totalStudents = workspaces.reduce((acc, ws) => {
    return acc + (ws.classes || []).reduce((cAcc, c) => cAcc + (c.students?.length || 0), 0);
  }, 0);
  const totalPoints = workspaces.reduce((acc, ws) => {
    return acc + (ws.classes || []).reduce((cAcc, c) => {
      return cAcc + (c.students || []).reduce((sAcc, s) => sAcc + (s.points || 0), 0);
    }, 0);
  }, 0);
  const totalBadges = workspaces.reduce((acc, ws) => {
    return acc + (ws.classes || []).reduce((cAcc, c) => {
      return cAcc + (c.students || []).reduce((sAcc, s) => sAcc + (s.badgeIds?.length || 0), 0);
    }, 0);
  }, 0);

  // Compute sorted class leaderboard
  const classLeaderboard = workspaces.map(ws => {
    const students = (ws.classes || []).flatMap(c => c.students || []);
    const studentCount = students.length;
    const classTotalPts = students.reduce((sum, s) => sum + (s.points || 0), 0);
    const avgPts = studentCount > 0 ? (classTotalPts / studentCount).toFixed(1) : '0';
    const totalBadgesAwarded = students.reduce((sum, s) => sum + (s.badgeIds?.length || 0), 0);
    
    return {
      workspace: ws,
      studentCount,
      totalPoints: classTotalPts,
      avgPoints: parseFloat(avgPts),
      totalBadges: totalBadgesAwarded,
    };
  }).sort((a, b) => b.avgPoints - a.avgPoints);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Đã sao chép ${label}!`, 'success');
    } catch {
      showToast('Không thể sao chép tự động', 'error');
    }
  };

  const handleCopyAllParentLinks = async () => {
    let summaryText = `📋 DANH SÁCH LIÊN KẾT THEO DÕI THI ĐUA - ${departmentInfo?.name || 'TỔ KHỐI 2'}\n`;
    summaryText += `🏫 ${departmentInfo?.schoolName || 'Trường Tiểu học Hùng Vương'} • Năm học: ${departmentInfo?.academicYear || '2026-2027'}\n\n`;
    
    workspaces.forEach((ws, idx) => {
      const parentUrl = `${currentOrigin}?workspace=${ws.id}&role=parent`;
      summaryText += `${idx + 1}. Lớp ${ws.homeroomClass} (GVCN: ${ws.name}):\n   👉 ${parentUrl}\n\n`;
    });

    summaryText += `📌 Quý Phụ huynh chỉ cần ấn vào link trên để xem điểm số, hoa điểm tốt và huy hiệu của con mỗi ngày!`;

    await handleCopy(summaryText, 'trọn bộ 10 liên kết Zalo Phụ huynh');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setDepartmentInfo({
      name: deptName.trim(),
      schoolName: schoolName.trim(),
      leaderName: leaderName.trim(),
      academicYear: academicYear.trim(),
    });
    showToast('Đã lưu thông tin Tổ Chuyên Môn thành công!', 'success');
    setActiveTab('dashboard');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 overflow-y-auto p-2 sm:p-4 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-6 max-w-4xl w-full shadow-2xl animate-bounce-in relative my-auto max-h-[92vh] flex flex-col border border-indigo-100 shrink-0">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors cursor-pointer z-10"
        >
          <X size={18} />
        </button>

        {/* HEADER */}
        <div className="flex items-start sm:items-center gap-3 mb-4 shrink-0 pr-10">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg shadow-indigo-500/20 shrink-0">
            🏫
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">
                {departmentInfo?.name || 'Tổ Chuyên Môn Khối 2'}
              </h3>
              <span className="text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                <ShieldCheck size={12} className="text-indigo-600" />
                Cấp Tổ 10 Lớp
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
              {departmentInfo?.schoolName || 'Trường Tiểu học Hùng Vương'} • Tổ trưởng: <span className="font-bold text-indigo-700">{departmentInfo?.leaderName || 'Cô Phương Anh'}</span>
            </p>
          </div>
        </div>

        {/* UPGRADE PROMPT IF LESS THAN 10 CLASSES */}
        {workspaces.length < 10 && (
          <div className="mb-3 p-3 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
            <div className="text-xs text-amber-900 font-bold flex items-center gap-2">
              <span>⚠️ Bạn đang có {workspaces.length} lớp (phiên bản cũ). Hãy nạp đủ 10 lớp Tổ Khối 2 (2A1 → 2A10) với 300 HS!</span>
            </div>
            <button
              onClick={() => {
                initializeDepartment10Classes();
                showToast('Đã khởi tạo đủ 10 lớp cho Tổ Khối 2!', 'success');
              }}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl shadow-xs cursor-pointer shrink-0"
            >
              Nạp đủ 10 lớp ngay
            </button>
          </div>
        )}

        {/* TABS */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-slate-100/90 rounded-2xl mb-3.5 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'dashboard' 
                ? 'bg-white text-indigo-700 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp size={16} />
            <span>Thi Đua Tổ ({workspaces.length} Lớp)</span>
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'sync' 
                ? 'bg-white text-indigo-700 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles size={16} />
            <span>Đồng Bộ Quy Chuẩn</span>
          </button>

          <button
            onClick={() => setActiveTab('parent_links')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'parent_links' 
                ? 'bg-white text-indigo-700 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 size={16} />
            <span>10 Link Phụ Huynh & QR</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'settings' 
                ? 'bg-white text-indigo-700 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <School size={16} />
            <span className="hidden sm:inline">Cài Đặt Tổ</span>
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[58vh]">
          
          {/* 1. DASHBOARD & LEADERBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              {/* Summary Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <div className="p-3.5 bg-gradient-to-br from-indigo-50 to-blue-50/60 rounded-2xl border border-indigo-100">
                  <p className="text-[11px] font-black text-indigo-600 uppercase tracking-wider">Tổng Quy Mô Lớp</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-800 mt-1">{totalClasses} Lớp</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">10 Giáo viên CN</p>
                </div>

                <div className="p-3.5 bg-gradient-to-br from-purple-50 to-pink-50/60 rounded-2xl border border-purple-100">
                  <p className="text-[11px] font-black text-purple-600 uppercase tracking-wider">Tổng Học Sinh</p>
                  <p className="text-xl sm:text-2xl font-black text-purple-900 mt-1">{totalStudents} Em</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">30 học sinh / lớp</p>
                </div>

                <div className="p-3.5 bg-gradient-to-br from-amber-50 to-yellow-50/60 rounded-2xl border border-amber-100">
                  <p className="text-[11px] font-black text-amber-600 uppercase tracking-wider">Tổng Sao Thi Đua</p>
                  <p className="text-xl sm:text-2xl font-black text-amber-700 mt-1">⭐ {totalPoints.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Tích lũy toàn khối</p>
                </div>

                <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50/60 rounded-2xl border border-emerald-100">
                  <p className="text-[11px] font-black text-emerald-600 uppercase tracking-wider">Huy Hiệu Trao Tặng</p>
                  <p className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">🏅 {totalBadges}</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Đã đạt thành tích</p>
                </div>
              </div>

              {/* Leaderboard Table of 10 Classes */}
              <div className="bg-slate-50/80 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                    <Star size={16} className="text-amber-500 fill-amber-500" />
                    Bảng Xếp Hạng Thi Đua Khối ({workspaces.length} Lớp Chủ Nhiệm)
                  </h4>
                  <span className="text-[10px] font-bold text-slate-500">
                    Sắp xếp theo Điểm TB / Học sinh
                  </span>
                </div>

                <div className="space-y-2">
                  {classLeaderboard.map((item, idx) => {
                    const isCurrent = item.workspace.id === activeWorkspaceId;
                    const rank = idx + 1;
                    const rankBadge = rank === 1 ? '🥇 Hạng 1' : rank === 2 ? '🥈 Hạng 2' : rank === 3 ? '🥉 Hạng 3' : `Hạng ${rank}`;
                    const rankBg = rank === 1 ? 'bg-amber-100 text-amber-900 border-amber-300' : rank === 2 ? 'bg-slate-200 text-slate-800 border-slate-300' : rank === 3 ? 'bg-orange-100 text-orange-900 border-orange-200' : 'bg-slate-100 text-slate-600 border-slate-200';

                    return (
                      <div 
                        key={`${item.workspace.id}_${item.workspace.homeroomClass}_${idx}`}
                        className={`p-3 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 border ${
                          isCurrent 
                            ? 'bg-indigo-50/90 border-indigo-300 shadow-xs' 
                            : 'bg-white border-slate-200 hover:border-indigo-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0 ${rankBg}`}>
                            {rankBadge}
                          </span>

                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-2xs">
                            {item.workspace.homeroomClass}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs sm:text-sm font-black text-slate-800 truncate">
                                Lớp {item.workspace.homeroomClass} — {item.workspace.name}
                              </p>
                              {item.workspace.isDepartmentLeader && (
                                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                                  Tổ trưởng
                                </span>
                              )}
                              {isCurrent && (
                                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                  Đang xem
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500">
                              Sĩ số: {item.studentCount} HS • Mã PIN: <span className="font-mono font-bold text-slate-700">{item.workspace.pin || '1234'}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <div className="text-left sm:text-right">
                            <p className="text-xs font-black text-indigo-700">
                              ⭐ {item.totalPoints} sao <span className="text-slate-400 font-normal">({item.avgPoints} đ/HS)</span>
                            </p>
                            <p className="text-[10px] text-slate-500">
                              🏅 {item.totalBadges} huy hiệu
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              switchWorkspace(item.workspace.id);
                              onClose();
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 active:scale-95 ${
                              isCurrent 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700'
                            }`}
                          >
                            <span>{isCurrent ? 'Đang mở' : 'Vào lớp'}</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. STANDARDIZATION & SYNC */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border border-indigo-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-xs shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-800">
                      Quy Chuẩn Hóa Tiêu Chí Chấm Điểm & Phần Thưởng Toàn Tổ
                    </h4>
                    <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                      Để 10 lớp trong khối đánh giá công bằng và đồng bộ, Tổ trưởng có thể thiết lập bộ Tiêu chí điểm thưởng/phạt, Huy hiệu và Danh mục Đổi quà chuẩn, sau đó áp dụng tự động cho toàn bộ 10 lớp trong Tổ chỉ với 1 click.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-indigo-200/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="text-xs text-indigo-900 font-bold">
                    📌 Áp dụng từ không gian lớp hiện tại ({workspaces.find(w => w.id === activeWorkspaceId)?.name} - {workspaces.find(w => w.id === activeWorkspaceId)?.homeroomClass})
                  </div>
                  <button
                    onClick={() => syncStandardToAllWorkspaces()}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer transition-all active:scale-95"
                  >
                    <RefreshCw size={16} />
                    <span>Đồng Bộ Sang 10 Lớp Trong Tổ</span>
                  </button>
                </div>
              </div>

              {/* Reset to fresh 10 classes tool */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                  <Layers size={16} className="text-purple-600" />
                  Khởi Tạo Chuẩn Hóa 10 Lớp Tổ Khối 2 (300 Học Sinh)
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Tạo mới hoặc khôi phục danh sách đầy đủ 10 lớp (2A1 đến 2A10) với 30 em học sinh/lớp, chia sẵn 4 tổ, kèm mã PIN bảo mật riêng cho từng GVCN.
                </p>

                <div className="mt-3">
                  {isConfirmingReset10 ? (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-bold text-amber-900">
                        ⚠️ Xác nhận khởi tạo lại dữ liệu mẫu 10 lớp cho toàn tổ?
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            initializeDepartment10Classes();
                            setIsConfirmingReset10(false);
                          }}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-black cursor-pointer"
                        >
                          Đồng ý khởi tạo
                        </button>
                        <button
                          onClick={() => setIsConfirmingReset10(false)}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsConfirmingReset10(true)}
                      className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RefreshCw size={14} />
                      <span>Khởi tạo bộ 10 Lớp (2A1 - 2A10) chuẩn</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. PARENT LINKS & QR EXPORT */}
          {activeTab === 'parent_links' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-emerald-900 flex items-center gap-1.5">
                    <Share2 size={16} className="text-emerald-600" />
                    Cổng Chia Sẻ Phụ Huynh 10 Lớp Trong Tổ
                  </h4>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">
                    Mỗi lớp có liên kết và mã QR riêng biệt. Phụ huynh chỉ xem được dữ liệu lớp con mình.
                  </p>
                </div>

                <button
                  onClick={handleCopyAllParentLinks}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  <Copy size={15} />
                  <span>Sao chép toàn bộ 10 Link Zalo</span>
                </button>
              </div>

              {/* List of 10 Class Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {workspaces.map((ws, idx) => {
                  const parentUrl = `${currentOrigin}?workspace=${ws.id}&role=parent`;
                  const teacherUrl = `${currentOrigin}?workspace=${ws.id}&role=teacher`;
                  const studentCount = (ws.classes || []).reduce((acc, c) => acc + (c.students?.length || 0), 0);

                  return (
                    <div 
                      key={`${ws.id}_${ws.homeroomClass}_${idx}`}
                      className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between gap-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-xs shrink-0">
                            {ws.homeroomClass}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">
                              Lớp {ws.homeroomClass} • {ws.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {studentCount} HS • PIN GV: <span className="font-mono font-bold text-slate-700">{ws.pin || '1234'}</span>
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedQrWorkspace(ws)}
                          className="p-1.5 bg-white hover:bg-indigo-50 text-indigo-700 rounded-lg border border-slate-200 hover:border-indigo-200 transition-colors cursor-pointer"
                          title="Xem mã QR Lớp"
                        >
                          <QrCode size={16} />
                        </button>
                      </div>

                      <div className="space-y-1.5 pt-1.5 border-t border-slate-200/60">
                        {/* Parent Link Copy */}
                        <div className="flex items-center gap-1.5">
                          <input 
                            type="text" 
                            readOnly 
                            value={parentUrl} 
                            className="flex-1 bg-white text-[10px] font-mono text-slate-600 px-2 py-1 rounded-lg border border-slate-200 truncate select-all" 
                          />
                          <button
                            onClick={() => handleCopy(parentUrl, `Link Phụ huynh Lớp ${ws.homeroomClass}`)}
                            className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold shrink-0 transition-colors cursor-pointer"
                          >
                            Copy Link
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5">
                <h4 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-2">
                  <School size={16} className="text-indigo-600" />
                  Thông Tin Tổ Chuyên Môn
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tên Tổ Chuyên Môn / Khối
                    </label>
                    <input
                      type="text"
                      value={deptName}
                      onChange={e => setDeptName(e.target.value)}
                      placeholder="VD: Tổ Chuyên Môn Khối 2"
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Trường Tiểu Học
                    </label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={e => setSchoolName(e.target.value)}
                      placeholder="VD: Trường Tiểu học Hùng Vương"
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tổ Trưởng Chuyên Môn
                    </label>
                    <input
                      type="text"
                      value={leaderName}
                      onChange={e => setLeaderName(e.target.value)}
                      placeholder="VD: Cô Phương Anh (Lớp 2A6)"
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Năm Học
                    </label>
                    <input
                      type="text"
                      value={academicYear}
                      onChange={e => setAcademicYear(e.target.value)}
                      placeholder="VD: 2026-2027"
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-black shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  Lưu Thông Tin Tổ
                </button>
              </div>
            </form>
          )}

        </div>

        {/* POPUP QR VIEW */}
        {selectedQrWorkspace && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-indigo-100 text-center space-y-4 animate-bounce-in">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-800">
                  Mã QR Lớp {selectedQrWorkspace.homeroomClass} ({selectedQrWorkspace.name})
                </h4>
                <button 
                  onClick={() => setSelectedQrWorkspace(null)} 
                  className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl inline-block border border-slate-200">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(`${currentOrigin}?workspace=${selectedQrWorkspace.id}&role=parent`)}&margin=6`} 
                  alt={`QR Lớp ${selectedQrWorkspace.homeroomClass}`}
                  className="w-56 h-56 object-contain rounded-xl mx-auto"
                />
              </div>

              <p className="text-xs text-slate-500 font-medium">
                Phụ huynh quét mã này trên Zalo/Camera để vào bảng theo dõi thi đua Lớp {selectedQrWorkspace.homeroomClass}
              </p>

              <button
                onClick={() => {
                  const url = `${currentOrigin}?workspace=${selectedQrWorkspace.id}&role=parent`;
                  handleCopy(url, `Link Lớp ${selectedQrWorkspace.homeroomClass}`);
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl cursor-pointer"
              >
                Sao Chép Link Phụ Huynh
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

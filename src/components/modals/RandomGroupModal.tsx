import { useShallow } from 'zustand/react/shallow';
import { useState, useEffect, useRef } from 'react';
import { useStore, useActiveClass } from '../../store';
import { 
  X, Shuffle, Users, Check, Sparkles, Trophy, Download, Printer, 
  ArrowRightLeft, Crown, Settings2, Sliders, ChevronDown, 
  Maximize2, Minimize2
} from 'lucide-react';
import { cn, getAvatarUrl, playSound, triggerConfetti } from '../../utils/helpers';
import { Student, Group } from '../../types';
import { exportToExcel } from '../../utils/excelExporter';
import { GROUP_THEMES, GeneratedGroup, divideStudentsIntoGroups } from '../../utils/groupAlgorithm';

interface RandomGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RandomGroupModal({ isOpen, onClose }: RandomGroupModalProps) {
  const { classes, activeClassId, batchApplyGroups, soundEnabled, showToast } = useStore(useShallow(state => ({ classes: state.classes, activeClassId: state.activeClassId, batchApplyGroups: state.batchApplyGroups, soundEnabled: state.soundEnabled, showToast: state.showToast })));
  const activeClass = classes.find(c => c.id === activeClassId);

  const shuffleInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const shuffleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (shuffleInterval.current) clearInterval(shuffleInterval.current);
    if (shuffleTimeout.current) clearTimeout(shuffleTimeout.current);
  }, [isOpen]);

  // Configuration States
  const [divisionMode, setDivisionMode] = useState<'byGroupCount' | 'byMemberCount'>('byGroupCount');
  const [groupCount, setGroupCount] = useState<number>(4);
  const [membersPerGroup, setMembersPerGroup] = useState<number>(5);
  const [balanceGender, setBalanceGender] = useState<boolean>(true);
  const [balancePoints, setBalancePoints] = useState<boolean>(false);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('cute_animals');
  
  // Student inclusion filter
  const [includedStudentIds, setIncludedStudentIds] = useState<string[]>([]);
  const [showStudentPicker, setShowStudentPicker] = useState<boolean>(false);

  // Result States
  const [generatedGroups, setGeneratedGroups] = useState<GeneratedGroup[]>([]);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [shuffleTick, setShuffleTick] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);

  // Moving student state
  const [movingStudentId, setMovingStudentId] = useState<string | null>(null);

  // Initialize students when modal opens
  useEffect(() => {
    if (isOpen && activeClass) {
      const allIds = activeClass.students.map(s => s.id);
      setIncludedStudentIds(allIds);
      // Auto set groupCount based on existing groups count or 4
      if (activeClass.groups.length >= 2) {
        setGroupCount(Math.min(activeClass.groups.length, 8));
      } else {
        setGroupCount(4);
      }
      setHasGenerated(false);
      setGeneratedGroups([]);
    }
  }, [isOpen, activeClassId]);

  if (!isOpen || !activeClass) return null;

  const totalStudents = activeClass.students.length;
  const activeStudents = activeClass.students.filter(s => includedStudentIds.includes(s.id));
  const boyCount = activeStudents.filter(s => s.gender === 'Nam').length;
  const girlCount = activeStudents.filter(s => s.gender === 'Nữ').length;

  // Compute effective number of groups
  const calculateNumGroups = () => {
    if (activeStudents.length === 0) return 1;
    if (divisionMode === 'byGroupCount') {
      return Math.max(1, Math.min(groupCount, activeStudents.length));
    } else {
      return Math.max(1, Math.ceil(activeStudents.length / Math.max(1, membersPerGroup)));
    }
  };

  const handleToggleSelectAll = () => {
    if (includedStudentIds.length === totalStudents) {
      setIncludedStudentIds([]);
    } else {
      setIncludedStudentIds(activeClass.students.map(s => s.id));
    }
  };

  const handleToggleStudent = (id: string) => {
    setIncludedStudentIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Main Algorithm: Smart Random Division
  const executeRandomDivision = () => {
    if (isShuffling) return;
    if (activeStudents.length === 0) {
      showToast('Vui lòng chọn ít nhất 1 học sinh tham gia chia tổ', 'error');
      return;
    }

    setIsShuffling(true);
    if (soundEnabled) playSound('shuffle');

    // Shuffle animation cycle
    let tickCount = 0;
    const interval = shuffleInterval.current = setInterval(() => {
      tickCount++;
      setShuffleTick(tickCount);
    }, 100);

    shuffleTimeout.current = setTimeout(() => {
      clearInterval(interval);

      const numGroups = calculateNumGroups();
      const newGroups = divideStudentsIntoGroups({
        activeStudents,
        numGroups,
        selectedThemeId,
        balanceGender,
        balancePoints
      });

      setGeneratedGroups(newGroups);
      setIsShuffling(false);
      setHasGenerated(true);

      if (soundEnabled) playSound('tada');
      triggerConfetti();
      showToast(`Đã chia ngẫu nhiên thành công ${numGroups} tổ!`);
    }, 1600);
  };

  // Change group leader
  const handleSetLeader = (groupId: string, studentId: string) => {
    setGeneratedGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return { ...g, leaderId: g.leaderId === studentId ? undefined : studentId };
      }
      return g;
    }));
    if (soundEnabled) playSound('pop');
  };

  // Move student between groups manually
  const handleMoveStudent = (studentId: string, targetGroupId: string) => {
    setGeneratedGroups(prev => prev.map(g => {
      // Remove from current group
      const filtered = g.studentIds.filter(id => id !== studentId);
      // Add to target group
      if (g.id === targetGroupId) {
        return {
          ...g,
          studentIds: [...filtered, studentId],
        };
      }
      return {
        ...g,
        studentIds: filtered,
        leaderId: g.leaderId === studentId ? undefined : g.leaderId,
      };
    }));
    setMovingStudentId(null);
    if (soundEnabled) playSound('pop');
  };

  // Rename group
  const handleRenameGroup = (groupId: string, newName: string) => {
    setGeneratedGroups(prev => prev.map(g => g.id === groupId ? { ...g, name: newName } : g));
  };

  // Apply to active class data in store
  const handleApplyToClass = () => {
    if (generatedGroups.length === 0) return;

    const formattedGroups: Group[] = generatedGroups.map(g => ({
      id: g.id,
      name: g.name,
      leaderId: g.leaderId, icon: g.icon, color: g.color,
    }));

    const studentGroupMap: Record<string, string> = {};
    generatedGroups.forEach(g => {
      g.studentIds.forEach(stId => {
        studentGroupMap[stId] = g.id;
      });
    });

    batchApplyGroups(formattedGroups, studentGroupMap);
    showToast('Đã lưu và áp dụng toàn bộ tổ mới vào lớp học!');
    onClose();
  };

  // Export to Excel
  const handleExportExcel = () => {
    try {
      const items: Array<{
        groupName: string;
        stt: number;
        student: Student;
        isLeader: boolean;
      }> = [];

      generatedGroups.forEach(grp => {
        grp.studentIds.forEach((stId, sIndex) => {
          const student = activeClass.students.find(s => s.id === stId);
          if (student) {
            items.push({
              groupName: grp.name,
              stt: sIndex + 1,
              student,
              isLeader: grp.leaderId === student.id,
            });
          }
        });
      });

      const fileName = `Danh_Sach_Chia_To_${activeClass.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;

      exportToExcel(
        items,
        [
          { header: 'Tên Tổ', key: item => item.groupName, width: 20 },
          { header: 'STT', key: item => item.stt, width: 8 },
          { header: 'Họ và Tên', key: item => item.student.name, width: 25 },
          { header: 'Giới tính', key: item => item.student.gender, width: 12 },
          { header: 'Vai trò', key: item => item.isLeader ? '⭐ Tổ Trưởng' : 'Thành viên', width: 16 },
          { header: 'Điểm hiện tại', key: item => item.student.points, width: 15 },
        ],
        fileName,
        'Ket_Qua_Chia_To'
      );

      showToast('Đã xuất file Excel phân tổ thành công!');
    } catch (e) {
      console.error(e);
      showToast('Không thể xuất file', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className={cn(
        "bg-white rounded-3xl shadow-2xl border border-indigo-100 flex flex-col transition-all duration-300 overflow-hidden",
        isFullscreen ? "w-full h-full max-w-none rounded-none" : "w-full max-w-6xl max-h-[92vh]"
      )}>
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Shuffle className="text-yellow-300 animate-pulse" size={22} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
                Hệ Thống Chia Tổ Ngẫu Nhiên Thông Minh
                <span className="px-2.5 py-0.5 bg-yellow-400 text-slate-900 rounded-full text-xs font-black uppercase tracking-wider">
                  Mới
                </span>
              </h2>
              <p className="text-xs text-indigo-100 font-medium">
                Lớp {activeClass.name} • {activeStudents.length}/{totalStudents} học sinh tham gia ({boyCount} Nam, {girlCount} Nữ)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
              title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình trình chiếu"}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/60 flex flex-col lg:flex-row gap-6">
          
          {/* Left / Settings Sidebar */}
          <div className="w-full lg:w-80 shrink-0 space-y-4">
            
            {/* Mode & Number of groups Card */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2 text-indigo-950 font-black text-sm">
                <Settings2 size={18} className="text-indigo-600" />
                <span>Phương thức phân chia</span>
              </div>

              {/* Mode Switcher */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setDivisionMode('byGroupCount')}
                  className={cn(
                    "py-2 text-xs font-black rounded-xl transition-all cursor-pointer",
                    divisionMode === 'byGroupCount' 
                      ? "bg-indigo-600 text-white shadow-sm" 
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Số lượng tổ
                </button>
                <button
                  onClick={() => setDivisionMode('byMemberCount')}
                  className={cn(
                    "py-2 text-xs font-black rounded-xl transition-all cursor-pointer",
                    divisionMode === 'byMemberCount' 
                      ? "bg-indigo-600 text-white shadow-sm" 
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Số bạn / tổ
                </button>
              </div>

              {/* Quantity Selectors */}
              {divisionMode === 'byGroupCount' ? (
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                    <span>Chia thành:</span>
                    <span className="text-indigo-600 font-black text-sm">{groupCount} Tổ</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[2, 3, 4, 5, 6, 7, 8, 10].map(n => (
                      <button
                        key={n}
                        onClick={() => setGroupCount(n)}
                        className={cn(
                          "py-2 text-xs font-black rounded-xl border transition-all cursor-pointer",
                          groupCount === n
                            ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs scale-105"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        )}
                      >
                        {n} tổ
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 italic text-center">
                    ~ {Math.ceil(activeStudents.length / Math.max(1, groupCount))} học sinh / mỗi tổ
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                    <span>Mỗi tổ có:</span>
                    <span className="text-indigo-600 font-black text-sm">{membersPerGroup} Bạn</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[2, 3, 4, 5, 6, 7, 8, 10].map(n => (
                      <button
                        key={n}
                        onClick={() => setMembersPerGroup(n)}
                        className={cn(
                          "py-2 text-xs font-black rounded-xl border transition-all cursor-pointer",
                          membersPerGroup === n
                            ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs scale-105"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        )}
                      >
                        {n} bạn
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 italic text-center">
                    Tạo ra ~ {Math.ceil(activeStudents.length / Math.max(1, membersPerGroup))} tổ
                  </p>
                </div>
              )}
            </div>

            {/* Smart Balancing Options */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-indigo-950 font-black text-sm">
                <Sliders size={18} className="text-purple-600" />
                <span>Tiêu chí cân bằng thông minh</span>
              </div>

              {/* Balance Gender */}
              <label className="flex items-center justify-between p-3 bg-slate-50 hover:bg-purple-50/50 rounded-2xl border border-slate-200/70 cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-black text-xs">
                    🚻
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-800">Cân bằng Nam / Nữ</div>
                    <div className="text-[11px] text-slate-500">Chia đều số bạn nam & nữ</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={balanceGender}
                  onChange={(e) => setBalanceGender(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-400"
                />
              </label>

              {/* Balance Points */}
              <label className="flex items-center justify-between p-3 bg-slate-50 hover:bg-purple-50/50 rounded-2xl border border-slate-200/70 cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-black text-xs">
                    ⭐
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-800">Cân bằng Thành tích</div>
                    <div className="text-[11px] text-slate-500">Trộn đều điểm cao và điểm thấp</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={balancePoints}
                  onChange={(e) => setBalancePoints(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-400"
                />
              </label>
            </div>

            {/* Theme Selector */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-indigo-950 font-black text-sm">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" />
                  <span>Chủ đề tên tổ</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {GROUP_THEMES.map(th => (
                  <button
                    key={th.id}
                    onClick={() => setSelectedThemeId(th.id)}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-2xl border text-xs font-black text-left transition-all cursor-pointer",
                      selectedThemeId === th.id
                        ? "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-500 text-purple-900 shadow-xs"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    <span>{th.name}</span>
                    {selectedThemeId === th.id && <Check size={14} className="text-purple-600 font-bold" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Student Filter Trigger */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80">
              <button
                onClick={() => setShowStudentPicker(!showStudentPicker)}
                className="w-full flex items-center justify-between text-xs font-black text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-slate-500" />
                  <span>Danh sách học sinh ({activeStudents.length}/{totalStudents})</span>
                </div>
                <ChevronDown size={16} className={cn("transition-transform", showStudentPicker ? "rotate-180" : "")} />
              </button>

              {showStudentPicker && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span className="text-slate-500">Đã chọn: {activeStudents.length}</span>
                    <button
                      onClick={handleToggleSelectAll}
                      className="text-indigo-600 hover:underline cursor-pointer"
                    >
                      {includedStudentIds.length === totalStudents ? 'Bỏ chọn hết' : 'Chọn tất cả'}
                    </button>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                    {activeClass.students.map(s => {
                      const isChecked = includedStudentIds.includes(s.id);
                      return (
                        <label
                          key={s.id}
                          className="flex items-center justify-between px-2 py-1 hover:bg-slate-50 rounded-lg text-xs cursor-pointer"
                        >
                          <span className={cn("truncate font-medium", isChecked ? "text-slate-800" : "text-slate-400 line-through")}>
                            {s.name} ({s.gender})
                          </span>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleStudent(s.id)}
                            className="w-3.5 h-3.5 text-indigo-600 rounded"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Action Button: Start Shuffling */}
            <button
              onClick={executeRandomDivision}
              disabled={isShuffling || activeStudents.length === 0}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white rounded-3xl font-black text-sm shadow-xl hover:shadow-2xl transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Shuffle className={cn(isShuffling ? "animate-spin" : "")} size={20} />
              {isShuffling ? 'ĐANG XÁO TRỘN NGẪU NHIÊN...' : hasGenerated ? 'XÁO LẠI (CHIA MỚI)' : 'BẮT ĐẦU CHIA NGẪU NHIÊN'}
            </button>
          </div>

          {/* Right / Results Showcase Board */}
          <div className="flex-1 flex flex-col space-y-4">
            
            {/* Top Toolbar for Results */}
            {hasGenerated && (
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl shadow-sm border border-slate-200/80">
                <div className="flex items-center gap-2">
                  <Trophy className="text-yellow-500" size={20} />
                  <span className="font-black text-slate-800 text-sm">
                    Kết quả phân chia ({generatedGroups.length} tổ)
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    • Nhấp vào ⭐ để chọn tổ trưởng
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportExcel}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-xs font-black border border-green-200 transition-colors cursor-pointer"
                  >
                    <Download size={14} /> Xuất Excel
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-black transition-colors cursor-pointer"
                  >
                    <Printer size={14} /> In danh sách
                  </button>
                  <button
                    onClick={handleApplyToClass}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
                  >
                    <Check size={14} /> Áp dụng vào Lớp
                  </button>
                </div>
              </div>
            )}

            {/* Live Animation Overlay or Groups Grid */}
            {isShuffling ? (
              <div className="flex-1 min-h-[400px] bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-8 flex flex-col items-center justify-center text-center text-white relative overflow-hidden shadow-2xl">
                {/* Floating animated sparkles */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl animate-pulse"></div>
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl animate-bounce">
                    <Shuffle className="text-yellow-400 animate-spin" size={48} />
                  </div>

                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-200">
                      Đang Xáo Trộn Học Sinh...
                    </h3>
                    <p className="text-indigo-200 text-sm font-medium mt-1">
                      Đang tính toán phân bổ đều giới tính và thành tích học tập
                    </p>
                  </div>

                  {/* Animated rotating cards preview */}
                  <div className="flex justify-center gap-3 overflow-hidden py-2">
                    {activeStudents.slice(0, 5).map((st, i) => (
                      <div 
                        key={st.id} 
                        className={cn(
                          "w-14 h-18 rounded-2xl bg-white/20 backdrop-blur-md p-1 flex flex-col items-center justify-center border border-white/30 transform transition-all duration-150",
                          (shuffleTick + i) % 2 === 0 ? "translate-y-2 rotate-3" : "-translate-y-2 -rotate-3"
                        )}
                      >
                        <img 
                          src={getAvatarUrl(st.avatarId, activeClass.customAvatars)} 
                          alt="" 
                          className="w-8 h-8 rounded-full object-cover shadow-inner"
                        />
                        <span className="text-[9px] font-bold text-white truncate w-full text-center mt-1">
                          {st.name.split(' ').pop()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : hasGenerated && generatedGroups.length > 0 ? (
              /* Generated Groups Grid */
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 overflow-y-auto pr-1">
                {generatedGroups.map((group, gIdx) => {
                  const groupStudents = group.studentIds
                    .map(id => activeClass.students.find(s => s.id === id))
                    .filter(Boolean) as Student[];

                  const groupBoys = groupStudents.filter(s => s.gender === 'Nam').length;
                  const groupGirls = groupStudents.filter(s => s.gender === 'Nữ').length;
                  const groupPoints = groupStudents.reduce((sum, s) => sum + s.points, 0);

                  return (
                    <div 
                      key={group.id}
                      className="bg-white rounded-3xl p-4 shadow-md border-2 border-slate-100 hover:border-indigo-200 transition-all flex flex-col"
                    >
                      {/* Group Header */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            "w-10 h-10 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center shadow-md text-lg font-black shrink-0",
                            group.color
                          )}>
                            {group.icon}
                          </div>
                          <div>
                            <input 
                              type="text" 
                              value={group.name} 
                              onChange={(e) => handleRenameGroup(group.id, e.target.value)}
                              className="font-black text-slate-800 text-sm bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-indigo-400 rounded px-1 -ml-1 w-32 truncate"
                            />
                            <div className="text-[11px] font-bold text-slate-500">
                              {groupStudents.length} bạn ({groupBoys}👦 {groupGirls}👧) • {groupPoints} điểm
                            </div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-black text-[11px]">
                          #{gIdx + 1}
                        </span>
                      </div>

                      {/* Student Cards in Group */}
                      <div className="flex-1 space-y-2 max-h-[360px] overflow-y-auto pr-1">
                        {groupStudents.map(student => {
                          const isLeader = group.leaderId === student.id;
                          const isMoving = movingStudentId === student.id;

                          return (
                            <div 
                              key={student.id}
                              className={cn(
                                "flex items-center justify-between p-2 rounded-2xl border transition-all relative group",
                                isLeader 
                                  ? "bg-amber-50/70 border-amber-300 shadow-xs" 
                                  : "bg-slate-50/70 border-slate-200/60 hover:bg-indigo-50/40"
                              )}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="relative shrink-0">
                                  <img 
                                    src={getAvatarUrl(student.avatarId, activeClass.customAvatars)} 
                                    alt={student.name}
                                    className="w-9 h-9 rounded-full object-cover bg-white shadow-2xs border border-slate-200" 
                                  />
                                  {isLeader && (
                                    <span className="absolute -top-1 -right-1 text-xs animate-bounce" title="Tổ trưởng">
                                      👑
                                    </span>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-black text-slate-800 text-xs truncate">
                                      {student.name}
                                    </span>
                                    {isLeader && (
                                      <span className="px-1.5 py-0.2 bg-amber-400 text-amber-950 rounded text-[9px] font-black shrink-0">
                                        Trưởng
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                                    <span>{student.gender}</span>
                                    <span>•</span>
                                    <span className={student.points >= 0 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                                      {student.points}đ
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Student Quick Controls */}
                              <div className="flex items-center gap-1">
                                {/* Leader toggle */}
                                <button
                                  onClick={() => handleSetLeader(group.id, student.id)}
                                  className={cn(
                                    "p-1.5 rounded-xl text-xs transition-colors cursor-pointer",
                                    isLeader ? "text-amber-600 bg-amber-100" : "text-slate-300 hover:text-amber-500 opacity-0 group-hover:opacity-100"
                                  )}
                                  title={isLeader ? "Bỏ chức tổ trưởng" : "Chọn làm tổ trưởng"}
                                >
                                  <Crown size={14} />
                                </button>

                                {/* Move student to another group dropdown */}
                                <div className="relative">
                                  <button
                                    onClick={() => setMovingStudentId(isMoving ? null : student.id)}
                                    className="p-1.5 text-slate-300 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                    title="Chuyển sang tổ khác"
                                  >
                                    <ArrowRightLeft size={13} />
                                  </button>

                                  {isMoving && (
                                    <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 p-1 z-30 animate-fade-in">
                                      <div className="text-[10px] font-black text-slate-400 px-2 py-1">Chuyển sang:</div>
                                      {generatedGroups.filter(g => g.id !== group.id).map(tg => (
                                        <button
                                          key={tg.id}
                                          onClick={() => handleMoveStudent(student.id, tg.id)}
                                          className="w-full text-left px-2 py-1.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors truncate flex items-center gap-1.5 cursor-pointer"
                                        >
                                          <span>{tg.icon}</span>
                                          <span className="truncate">{tg.name}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {groupStudents.length === 0 && (
                          <div className="text-center py-6 text-slate-300 text-xs font-bold border-2 border-dashed border-slate-200 rounded-2xl">
                            Tổ trống
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty Initial State */
              <div className="flex-1 min-h-[400px] bg-white rounded-3xl border-2 border-dashed border-indigo-200 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-4 shadow-sm">
                  <Shuffle size={36} />
                </div>
                <h3 className="text-lg font-black text-slate-800">Sẵn Sàng Chia Tổ Ngẫu Nhiên</h3>
                <p className="text-sm text-slate-500 max-w-md mt-1 mb-6">
                  Tùy chỉnh số lượng tổ, phương thức cân bằng nam/nữ, thành tích ở cột bên trái và nhấn nút <strong>Bắt đầu chia ngẫu nhiên</strong> để hệ thống tự động sắp xếp tổ công bằng và vui nhộn!
                </p>
                <button
                  onClick={executeRandomDivision}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  <Shuffle size={16} /> Bắt đầu chia ngay
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}


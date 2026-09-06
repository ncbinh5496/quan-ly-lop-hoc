import { useShallow } from 'zustand/react/shallow';
import { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Clock, Check, Sparkles, UserCheck, Award } from 'lucide-react';
import { useClassroomDate } from '../../utils/useClassroomDate';
import { Student } from '../../types';
import { useStore } from '../../store';
import { cn, getAvatarUrl, playSound, triggerConfetti } from '../../utils/helpers';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AttendanceStatus = 'present' | 'late' | 'excused' | 'unexcused';

export function AttendanceModal({ isOpen, onClose }: AttendanceModalProps) {
  const { classes, activeClassId, addPoints, saveAttendance, showToast, soundEnabled } = useStore(useShallow(state => ({ classes: state.classes, activeClassId: state.activeClassId, addPoints: state.addPoints, saveAttendance: state.saveAttendance, showToast: state.showToast, soundEnabled: state.soundEnabled })));
  const activeClass = classes.find(c => c.id === activeClassId);

  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [rewardPoints, setRewardPoints] = useState(true);

  const todayStr = useClassroomDate();
  const todayRecord = activeClass?.attendanceRecords?.find(r => r.date === todayStr);
  const legacyRecord = !!todayRecord && todayRecord.rewardAmounts === undefined;

  // Sync with today's record on open
  useEffect(() => {
    if (isOpen && activeClass) {
      const todayRecord = activeClass.attendanceRecords?.find(r => r.date === todayStr);
      setRewardPoints(todayRecord ? (todayRecord.rewardEnabled ?? false) : true);
      if (todayRecord?.studentStatuses) {
        setAttendanceMap(Object.fromEntries(activeClass.students.map(s => [s.id, todayRecord.studentStatuses[s.id] || 'present'])));
      } else {
        const initialMap: Record<string, AttendanceStatus> = {};
        activeClass.students.forEach(s => {
          initialMap[s.id] = 'present';
        });
        setAttendanceMap(initialMap);
      }
    }
  }, [isOpen, activeClassId, todayStr]);

  if (!isOpen || !activeClass) return null;

  const students = activeClass.students;

  // Initialize or get status
  const getStatus = (id: string): AttendanceStatus => {
    return attendanceMap[id] || 'present';
  };

  const setStatus = (id: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({ ...prev, [id]: status }));
  };

  const handleMarkAllPresent = () => {
    const newMap: Record<string, AttendanceStatus> = {};
    students.forEach(s => {
      newMap[s.id] = 'present';
    });
    setAttendanceMap(newMap);
    showToast('Đã đánh dấu tất cả học sinh Có mặt');
  };

  const handleSaveAttendance = () => {
    const presentStudents = students.filter(s => getStatus(s.id) === 'present');
    const lateStudents = students.filter(s => getStatus(s.id) === 'late');
    const absentStudents = students.filter(s => getStatus(s.id) === 'excused' || getStatus(s.id) === 'unexcused');

    // Save attendance record to persistent store
    const saved = saveAttendance(activeClass.id, {
      date: todayStr,
      presentCount: presentStudents.length,
      lateCount: lateStudents.length,
      absentCount: absentStudents.length,
      totalStudents: students.length,
      studentStatuses: Object.fromEntries(students.map(s => [s.id, getStatus(s.id)])),
    }, rewardPoints);
    if (!saved) return;

    if (soundEnabled) playSound('tada');
    triggerConfetti();
    showToast(`Đã lưu điểm danh! Có mặt: ${presentStudents.length + lateStudents.length}/${students.length} học sinh.`);
    onClose();
  };

  const presentCount = students.filter(s => getStatus(s.id) === 'present').length;
  const lateCount = students.filter(s => getStatus(s.id) === 'late').length;
  const absentCount = students.filter(s => getStatus(s.id) === 'excused' || getStatus(s.id) === 'unexcused').length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-3xl w-full shadow-2xl animate-bounce-in relative max-h-[90vh] flex flex-col border border-purple-100">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2.5 rounded-full transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl shadow-md shadow-purple-500/20">
            📋
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Điểm danh nhanh lớp {activeClass.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Kiểm diện sĩ số và thưởng điểm chuyên cần hôm nay
            </p>
          </div>
        </div>

        {/* Summary Pill Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-purple-50/60 rounded-2xl border border-purple-100 shrink-0 mb-4">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
              Có mặt: {presentCount}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
              Đi trễ: {lateCount}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-rose-100 text-rose-800 border border-rose-200">
              Vắng: {absentCount}
            </span>
          </div>

          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check size={14} /> Tất cả có mặt
          </button>
        </div>

        {/* Students List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-4">
          {students.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Lớp chưa có học sinh nào.
            </div>
          ) : (
            students.map(student => {
              const status = getStatus(student.id);
              const avatarUrl = getAvatarUrl(student.avatarId, activeClass.customAvatars);

              return (
                <div
                  key={student.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100 border border-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={avatarUrl}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-2xs shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-800 truncate">
                        {student.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {student.gender} • {student.points} sao tích lũy
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setStatus(student.id, 'present')}
                      className={cn(
                        "px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                        status === 'present'
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50"
                      )}
                    >
                      Có mặt
                    </button>
                    <button
                      onClick={() => setStatus(student.id, 'late')}
                      className={cn(
                        "px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                        status === 'late'
                          ? "bg-amber-500 text-white shadow-xs"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-amber-50"
                      )}
                    >
                      Đi trễ
                    </button>
                    <button
                      onClick={() => setStatus(student.id, 'excused')}
                      className={cn(
                        "px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                        status === 'excused'
                          ? "bg-rose-500 text-white shadow-xs"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-rose-50"
                      )}
                    >
                      Vắng
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rewardPoints}
              disabled={legacyRecord}
              onChange={(e) => setRewardPoints(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded-md focus:ring-purple-400 cursor-pointer"
            />
            <span>{legacyRecord ? 'Bản điểm danh cũ: giữ nguyên điểm đã ghi trước đây' : 'Thưởng chuyên cần: đúng giờ +2, đi trễ +1 (lưu lại không cộng lặp)'}</span>
          </label>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={handleSaveAttendance}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-2xl font-black text-xs shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <CheckCircle2 size={16} /> Lưu điểm danh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


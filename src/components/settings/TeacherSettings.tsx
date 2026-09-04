import React, { useState } from 'react';
import { useStore } from '../../store';
import { UserCheck, School, GraduationCap, BookOpen, Calendar, Save } from 'lucide-react';

export default function TeacherSettings() {
  const teacher = useStore(state => state.teacher);
  const setTeacher = useStore(state => state.setTeacher);
  const showToast = useStore(state => state.showToast);

  const [teacherName, setTeacherName] = useState(teacher?.name || '');
  const [schoolName, setSchoolName] = useState(teacher?.schoolName || '');
  const [homeroomClass, setHomeroomClass] = useState(teacher?.homeroomClass || '');
  const [subject, setSubject] = useState(teacher?.subject || '');
  const [academicYear, setAcademicYear] = useState(teacher?.academicYear || '');

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) {
      showToast('Vui lòng nhập họ tên giáo viên', 'error');
      return;
    }

    setTeacher({
      id: teacher?.id || 't1',
      name: teacherName.trim(),
      schoolName: schoolName.trim(),
      homeroomClass: homeroomClass.trim(),
      grade: teacher?.grade || '',
      subject: subject.trim(),
      academicYear: academicYear.trim(),
    });

    showToast('Đã lưu thông tin giáo viên thành công!');
  };

  return (
    <div className="bg-white/95 rounded-[28px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80 space-y-6">
      <div className="flex items-center justify-between border-b border-purple-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100/80 flex items-center justify-center text-purple-600 text-xl border border-purple-200">
            👩‍🏫
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-800">Thông tin Giáo viên</h3>
            <p className="text-xs text-slate-500">Tên giáo viên và trường lớp hiển thị trên toàn hệ thống</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveTeacher} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <UserCheck size={15} className="text-purple-600" /> Họ và tên Giáo viên <span className="text-rose-500">*</span>
            </label>
            <input 
              type="text" 
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-bold text-slate-800 text-sm"
              placeholder="VD: Cô Phương Anh..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <School size={15} className="text-purple-600" /> Trường học
            </label>
            <input 
              type="text" 
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs font-semibold text-slate-800"
              placeholder="VD: Tiểu học Hùng Vương"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <GraduationCap size={15} className="text-purple-600" /> Lớp chủ nhiệm
            </label>
            <input 
              type="text" 
              value={homeroomClass}
              onChange={(e) => setHomeroomClass(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs font-semibold text-slate-800"
              placeholder="VD: 2A6"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <BookOpen size={15} className="text-purple-600" /> Phụ trách / Môn
            </label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs font-semibold text-slate-800"
              placeholder="VD: Chủ nhiệm"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar size={15} className="text-purple-600" /> Năm học
            </label>
            <input 
              type="text" 
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs font-semibold text-slate-800"
              placeholder="VD: 2026-2027"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-2xl font-black text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Save size={16} /> Lưu thông tin giáo viên
          </button>
        </div>
      </form>
    </div>
  );
}

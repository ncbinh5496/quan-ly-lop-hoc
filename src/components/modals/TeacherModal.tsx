import React, { useState, useEffect, useRef } from 'react';
import { X, Save, UserCheck, School, BookOpen, Calendar, GraduationCap, Camera, Upload, Trash2 } from 'lucide-react';
import { useStore } from '../../store';
import { compressImageToBase64 } from '../../utils/helpers';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TeacherModal({ isOpen, onClose }: TeacherModalProps) {
  const { teacher, setTeacher, showToast } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    avatarUrl: '',
    schoolName: '',
    grade: '',
    subject: '',
    academicYear: '',
    homeroomClass: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name || '',
        avatarUrl: teacher.avatarUrl || '',
        schoolName: teacher.schoolName || '',
        grade: teacher.grade || '',
        subject: teacher.subject || '',
        academicYear: teacher.academicYear || '',
        homeroomClass: teacher.homeroomClass || '',
      });
    }
  }, [teacher, isOpen]);

  if (!isOpen) return null;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn file hình ảnh (PNG, JPG, WEBP)', 'error');
      return;
    }

    try {
      const base64 = await compressImageToBase64(file, 400, 400, 0.8);
      setFormData(prev => ({ ...prev, avatarUrl: base64 }));
      showToast('Đã tải ảnh đại diện lên!');
    } catch (err) {
      showToast('Lỗi khi tải ảnh đại diện', 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Vui lòng nhập họ và tên giáo viên', 'error');
      return;
    }

    setTeacher({
      id: teacher?.id || 't1',
      name: formData.name.trim(),
      avatarUrl: formData.avatarUrl,
      schoolName: formData.schoolName.trim(),
      grade: formData.grade.trim(),
      subject: formData.subject.trim(),
      academicYear: formData.academicYear.trim(),
      homeroomClass: formData.homeroomClass.trim(),
    });

    showToast('Đã lưu thông tin giáo viên thành công!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-6 md:p-8 max-w-lg w-full shadow-2xl animate-bounce-in relative max-h-[92vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 text-2xl shadow-sm">
            👩‍🏫
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">Thông tin Giáo viên</h3>
            <p className="text-slate-500 text-sm">Chỉnh sửa hồ sơ, ảnh đại diện và trường lớp</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload Box (Facebook Profile Avatar Style) */}
          <div className="flex items-center gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
            <div className="relative group">
              <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-black overflow-hidden ring-4 ring-white shadow-md">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>👩‍🏫</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-md border-2 border-white transition-transform hover:scale-110"
                title="Thay ảnh đại diện"
              >
                <Camera size={14} />
              </button>
            </div>

            <div className="flex-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden"
              />
              <div className="font-bold text-slate-800 text-sm">Ảnh đại diện Giáo viên</div>
              <p className="text-xs text-slate-500 mt-0.5">Hiển thị tròn nổi bật trên thanh bìa Facebook Header</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 bg-white hover:bg-slate-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Upload size={12} /> Tải ảnh lên
                </button>
                {formData.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, avatarUrl: '' }))}
                    className="px-2.5 py-1 text-slate-400 hover:text-red-600 text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Xóa ảnh
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <UserCheck size={16} className="text-purple-600" /> Họ và tên Giáo viên <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium text-slate-800"
              placeholder="VD: Cô Phương Anh, Thầy Minh Tuấn..."
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <School size={16} className="text-purple-600" /> Trường học
              </label>
              <input 
                type="text" 
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm font-medium text-slate-800"
                placeholder="VD: Tiểu học Hùng Vương"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <GraduationCap size={16} className="text-purple-600" /> Khối / Lớp chủ nhiệm
              </label>
              <input 
                type="text" 
                value={formData.homeroomClass}
                onChange={(e) => setFormData({ ...formData, homeroomClass: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm font-medium text-slate-800"
                placeholder="VD: 2A6"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <BookOpen size={16} className="text-purple-600" /> Môn học / Vai trò
              </label>
              <input 
                type="text" 
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm font-medium text-slate-800"
                placeholder="VD: Chủ nhiệm, Tiếng Việt..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar size={16} className="text-purple-600" /> Năm học
              </label>
              <input 
                type="text" 
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm font-medium text-slate-800"
                placeholder="VD: 2026-2027"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-200 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} /> Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useMemo, useCallback } from 'react';
import { useStore, useActiveClass } from '../store';
import { StudentCard } from '../components/ui/StudentCard';
import { Plus } from 'lucide-react';
import { Student } from '../types';
import { AvatarModal } from '../components/modals/AvatarModal';
import { AwardBadgeModal } from '../components/modals/AwardBadgeModal';
import { StudentsHeader } from '../components/students/StudentsHeader';
import { StudentFilterBar } from '../components/students/StudentFilterBar';
import { StudentEditModal } from '../components/students/StudentEditModal';

export default function Students() {
  const setPointModal = useStore(state => state.setPointModal);
  const showToast = useStore(state => state.showToast);
  const addStudent = useStore(state => state.addStudent);
  const updateStudent = useStore(state => state.updateStudent);
  const deleteStudent = useStore(state => state.deleteStudent);
  const userRole = useStore(state => state.userRole);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');
  const [sortOrder, setSortOrder] = useState<'points-desc' | 'points-asc' | 'name-asc'>('points-desc');
  
  // Modal State
  const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(null);
  const [isClassGalleryOpen, setIsClassGalleryOpen] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [isAwardBadgeOpen, setIsAwardBadgeOpen] = useState(false);
  
  const activeClass = useActiveClass();
  const isParent = userRole === 'parent';

  const customAvatarsCount = activeClass?.customAvatars?.length || 0;

  const filteredStudents = useMemo(() => {
    if (!activeClass) return [];
    let list = activeClass.students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterGroup !== 'all') {
      list = list.filter(s => s.groupId === filterGroup);
    }

    // Sorting
    return [...list].sort((a, b) => {
      if (sortOrder === 'points-desc') return b.points - a.points;
      if (sortOrder === 'points-asc') return a.points - b.points;
      if (sortOrder === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [activeClass, searchTerm, filterGroup, sortOrder]);

  const groupsMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (activeClass?.groups) {
      for (const g of activeClass.groups) {
        map[g.id] = g.name;
      }
    }
    return map;
  }, [activeClass?.groups]);

  const handleSaveStudent = useCallback(() => {
    if (!editingStudent?.name?.trim()) {
      showToast('Vui lòng nhập tên học sinh', 'error');
      return;
    }

    if (editingStudent.id) {
      updateStudent(editingStudent.id, {
        name: editingStudent.name.trim(),
        gender: editingStudent.gender,
        groupId: editingStudent.groupId,
        avatarId: editingStudent.avatarId,
      });
      showToast('Đã cập nhật thông tin học sinh');
    } else {
      const isBoy = editingStudent.gender === 'Nam';
      const defaultAvatar = isBoy ? `boy-${Math.floor(Math.random() * 5) + 1}` : `girl-${Math.floor(Math.random() * 5) + 1}`;
      addStudent({
        name: editingStudent.name.trim(),
        gender: editingStudent.gender || 'Nữ',
        groupId: editingStudent.groupId,
        avatarId: editingStudent.avatarId || defaultAvatar,
        status: 'active',
      });
      showToast('Đã thêm học sinh mới');
    }
    setEditingStudent(null);
  }, [editingStudent, updateStudent, addStudent, showToast]);

  const handleDeleteStudent = useCallback((id: string) => {
    deleteStudent(id);
    showToast('Đã xóa học sinh');
    setEditingStudent(null);
  }, [deleteStudent, showToast]);

  const handleAddPoint = useCallback((studentId: string) => {
    setPointModal({ studentId, type: 'positive' });
  }, [setPointModal]);

  const handleMinusPoint = useCallback((studentId: string) => {
    setPointModal({ studentId, type: 'negative' });
  }, [setPointModal]);

  if (!activeClass) {
    return (
      <div className="bg-white/90 rounded-3xl p-12 text-center text-slate-500 border border-purple-100 max-w-lg mx-auto mt-12">
        <h3 className="text-xl font-black text-slate-800 mb-2">Chưa chọn lớp học</h3>
        <p className="text-sm text-slate-500">Vui lòng tạo hoặc chọn một lớp học để xem danh sách học sinh.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Header & Quick Action Row */}
      <StudentsHeader
        activeClass={activeClass}
        customAvatarsCount={customAvatarsCount}
        isParent={isParent}
        onOpenAwardBadge={() => setIsAwardBadgeOpen(true)}
        onOpenClassGallery={() => setIsClassGalleryOpen(true)}
        onAddNewStudent={() => setEditingStudent({ name: '', gender: 'Nữ', groupId: undefined, avatarId: 'girl-1' })}
      />

      {/* 2. Search & Filter Bar */}
      <StudentFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterGroup={filterGroup}
        onFilterGroupChange={setFilterGroup}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        groups={activeClass.groups}
      />

      {/* 3. Students Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Quick Add Card (Teacher Only) */}
        {!isParent && (
          <button 
            onClick={() => setEditingStudent({ name: '', gender: 'Nữ', groupId: undefined, avatarId: 'girl-1' })}
            className="group bg-white/70 hover:bg-purple-50/80 border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-[24px] p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 text-purple-600 min-h-[220px] shadow-2xs hover:shadow-md cursor-pointer"
          >
            <div className="w-14 h-14 bg-purple-100 group-hover:bg-purple-600 group-hover:text-white rounded-2xl flex items-center justify-center shadow-xs text-purple-600 transition-colors">
              <Plus size={28} strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <span className="block font-black text-sm text-slate-800 group-hover:text-purple-700">Thêm học sinh mới</span>
              <span className="text-[11px] text-slate-400">Tạo hồ sơ & tích điểm</span>
            </div>
          </button>
        )}

        {filteredStudents.map(student => (
          <StudentCard
            key={student.id}
            student={student}
            groupName={student.groupId ? groupsMap[student.groupId] : undefined}
            customAvatars={activeClass.customAvatars}
            onAddPoint={() => handleAddPoint(student.id)}
            onMinusPoint={() => handleMinusPoint(student.id)}
            onEdit={() => setEditingStudent(student)}
          />
        ))}
      </div>

      {/* 4. Editing Student Modal */}
      {editingStudent && (
        <StudentEditModal
          editingStudent={editingStudent}
          activeClass={activeClass}
          onClose={() => setEditingStudent(null)}
          onChange={setEditingStudent}
          onOpenAvatarPicker={() => setIsAvatarPickerOpen(true)}
          onSave={handleSaveStudent}
          onDelete={handleDeleteStudent}
        />
      )}

      {/* 5. Class Avatar Gallery Modal */}
      <AvatarModal
        isOpen={isClassGalleryOpen}
        onClose={() => setIsClassGalleryOpen(false)}
        targetClassId={activeClass.id}
      />

      {/* 6. Avatar Picker Modal */}
      {editingStudent && (
        <AvatarModal
          isOpen={isAvatarPickerOpen}
          onClose={() => setIsAvatarPickerOpen(false)}
          student={editingStudent as Student}
          targetClassId={activeClass.id}
          onSelectAvatar={(avatarId) => {
            setEditingStudent({
              ...editingStudent,
              avatarId,
            });
            setIsAvatarPickerOpen(false);
          }}
        />
      )}

      {/* 7. Award Badge Modal */}
      <AwardBadgeModal
        isOpen={isAwardBadgeOpen}
        onClose={() => setIsAwardBadgeOpen(false)}
      />
    </div>
  );
}

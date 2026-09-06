import React, { useState, useMemo } from 'react';
import { useStore, useActiveClass } from '../store';
import { UsersRound, Shuffle, Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import { StudentCard } from '../components/ui/StudentCard';
import RandomGroupModal from '../components/modals/RandomGroupModal';

export default function Groups() {
  const addGroup = useStore(state => state.addGroup);
  const updateGroup = useStore(state => state.updateGroup);
  const deleteGroup = useStore(state => state.deleteGroup);
  const assignStudentToGroup = useStore(state => state.assignStudentToGroup);
  const setPointModal = useStore(state => state.setPointModal);
  const showToast = useStore(state => state.showToast);

  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<{ id: string; name: string } | null>(null);
  
  const activeClass = useActiveClass();

  // Group students by group ID and collect unassigned in a single pass
  const { unassignedStudents, groupStudentsMap } = useMemo(() => {
    const unassigned: typeof activeClass.students = [];
    const map = new Map<string, { students: typeof activeClass.students; totalPoints: number }>();

    if (activeClass) {
      // Initialize map with all groups
      activeClass.groups.forEach(g => {
        map.set(g.id, { students: [], totalPoints: 0 });
      });

      // Single pass over students
      activeClass.students.forEach(s => {
        if (!s.groupId) {
          unassigned.push(s);
        } else {
          const entry = map.get(s.groupId);
          if (entry) {
            entry.students.push(s);
            entry.totalPoints += s.points;
          } else {
            unassigned.push(s);
          }
        }
      });
    }

    return { unassignedStudents: unassigned, groupStudentsMap: map };
  }, [activeClass?.students, activeClass?.groups]);

  if (!activeClass) {
    return (
      <div className="bg-white/90 rounded-3xl p-12 text-center text-slate-500 border border-purple-100 max-w-lg mx-auto mt-12">
        <h3 className="text-xl font-black text-slate-800 mb-2">Chưa chọn lớp học</h3>
        <p className="text-sm text-slate-500">Vui lòng tạo hoặc chọn một lớp học để quản lý nhóm/tổ.</p>
      </div>
    );
  }

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim());
      setNewGroupName('');
      showToast('Đã thêm tổ mới');
    }
  };

  const handleUpdateGroup = (id: string) => {
    if (editingName.trim()) {
      updateGroup(id, editingName.trim());
      setEditingGroupId(null);
      showToast('Đã cập nhật tên tổ');
    }
  };

  const confirmDeleteGroup = () => {
    if (groupToDelete) {
      deleteGroup(groupToDelete.id);
      showToast(`Đã xóa tổ ${groupToDelete.name}`);
      setGroupToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/95 p-5 sm:p-6 rounded-[28px] border border-purple-100/80 shadow-[0_8px_30px_rgba(124,58,237,0.05)]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-sm shadow-purple-500/20">
            <UsersRound size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Quản lý Nhóm / Tổ thi đua</h2>
            <p className="text-slate-500 text-xs font-semibold">
              Lớp {activeClass.name} • {activeClass.groups.length} tổ • {activeClass.students.length} học sinh
            </p>
          </div>
        </div>

        <button 
          onClick={() => setIsRandomModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-2xl font-black text-xs transition-all shadow-md shadow-purple-500/20 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Shuffle size={15} /> Chia tổ ngẫu nhiên thông minh
        </button>
      </div>

      {/* Add New Group Input Card */}
      <div className="bg-white/95 rounded-[22px] p-4 shadow-2xs border border-purple-100/80 flex items-center gap-3 max-w-md">
        <input 
          type="text" 
          placeholder="Tên tổ mới (ví dụ: Tổ 1 - Sóc Nâu)..." 
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-slate-400"
          onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
        />
        <button 
          onClick={handleAddGroup}
          disabled={!newGroupName.trim()}
          className="p-2.5 bg-purple-600 text-white hover:bg-purple-700 rounded-xl disabled:opacity-50 transition-all shadow-2xs cursor-pointer active:scale-95"
          title="Tạo tổ"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Groups Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Unassigned Students */}
        {unassignedStudents.length > 0 && (
          <div className="bg-white/90 rounded-[28px] p-5 border border-slate-200 shadow-2xs">
            <h3 className="font-black text-slate-700 mb-4 flex items-center justify-between">
              <span>Chưa phân tổ</span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-black">
                {unassignedStudents.length} bạn
              </span>
            </h3>
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {unassignedStudents.map(student => (
                <div key={student.id} className="relative">
                  <StudentCard 
                    student={student}
                    customAvatars={activeClass.customAvatars}
                    onAddPoint={() => setPointModal({ studentId: student.id, type: 'positive' })}
                    onMinusPoint={() => setPointModal({ studentId: student.id, type: 'negative' })}
                  />
                  {activeClass.groups.length > 0 && (
                    <select 
                      className="absolute top-2 right-2 bg-white/95 border border-purple-200 text-[11px] rounded-xl px-2 py-1 focus:outline-none z-10 font-bold text-purple-700 shadow-2xs cursor-pointer"
                      onChange={(e) => {
                        assignStudentToGroup(student.id, e.target.value);
                        showToast(`Đã chuyển ${student.name} vào tổ mới`);
                      }}
                      value=""
                    >
                      <option value="" disabled>Chuyển vào...</option>
                      {activeClass.groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Groups */}
        {activeClass.groups.map(group => {
          const entry = groupStudentsMap.get(group.id) || { students: [], totalPoints: 0 };
          const groupStudents = entry.students;
          const totalPoints = entry.totalPoints;
          
          return (
            <div key={group.id} className="bg-white/95 rounded-[28px] p-5 border border-purple-100 shadow-[0_8px_24px_rgba(124,58,237,0.04)] relative group">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-purple-50">
                {editingGroupId === group.id ? (
                  <div className="flex items-center gap-2 flex-1 mr-3">
                    <input 
                      type="text" 
                      value={editingName} 
                      onChange={e => setEditingName(e.target.value)} 
                      className="flex-1 bg-slate-50 border border-purple-200 rounded-xl px-3 py-1.5 focus:outline-none font-black text-sm text-slate-800"
                      autoFocus
                    />
                    <button onClick={() => handleUpdateGroup(group.id)} className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg cursor-pointer"><Check size={16}/></button>
                    <button onClick={() => setEditingGroupId(null)} className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg cursor-pointer"><X size={16}/></button>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                      {group.name}
                      <button 
                        onClick={() => { setEditingGroupId(group.id); setEditingName(group.name); }}
                        className="text-slate-300 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Đổi tên tổ"
                      >
                        <Pencil size={13} />
                      </button>
                    </h3>
                    <div className="text-xs font-bold text-purple-600 mt-0.5">
                      {groupStudents.length} thành viên • {totalPoints} sao ⭐
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={() => setGroupToDelete({ id: group.id, name: group.name })}
                  className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Xóa tổ này"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {groupStudents.map(student => (
                  <div key={student.id} className="relative">
                    <StudentCard 
                      student={student} 
                      groupName={group.name}
                      customAvatars={activeClass.customAvatars}
                      onAddPoint={() => setPointModal({ studentId: student.id, type: 'positive' })}
                      onMinusPoint={() => setPointModal({ studentId: student.id, type: 'negative' })}
                    />
                    <button 
                      onClick={() => {
                        assignStudentToGroup(student.id, undefined);
                        showToast(`Đã đưa ${student.name} ra khỏi tổ`);
                      }}
                      className="absolute top-3 right-16 text-[10px] bg-rose-50 text-rose-600 hover:bg-rose-100 px-2 py-1 rounded-lg transition-colors z-10 font-bold cursor-pointer"
                    >
                      Rời tổ
                    </button>
                  </div>
                ))}
                {groupStudents.length === 0 && (
                  <div className="text-center py-8 text-slate-400 border-2 border-dashed border-purple-100 rounded-2xl font-bold text-xs">
                    Chưa có học sinh trong tổ
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Group Delete Confirmation Modal */}
      {groupToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-rose-100 text-center animate-bounce-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-3">
              <Trash2 size={24} />
            </div>
            <h3 className="font-black text-slate-800 text-base mb-1">
              Xóa tổ "{groupToDelete.name}"?
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Các thành viên trong tổ sẽ được chuyển về nhóm "Chưa phân tổ". Điểm số và dữ liệu học sinh không bị ảnh hưởng.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGroupToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmDeleteGroup}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-md shadow-rose-500/20 cursor-pointer"
              >
                Xóa tổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Random Group Generator Modal */}
      <RandomGroupModal 
        isOpen={isRandomModalOpen} 
        onClose={() => setIsRandomModalOpen(false)} 
      />
    </div>
  );
}


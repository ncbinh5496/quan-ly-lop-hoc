import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';
import { 
  Users, 
  ChevronDown, 
  Check, 
  Plus, 
  Settings2, 
  ExternalLink, 
  Share2,
  Sparkles,
  School,
  Lock,
  Search,
  ShieldCheck
} from 'lucide-react';
import { TeacherWorkspaceModal } from '../modals/TeacherWorkspaceModal';
import { DepartmentModal } from '../modals/DepartmentModal';

export function TeacherWorkspaceSwitcher() {
  const workspaces = useStore(state => state.workspaces);
  const activeWorkspaceId = useStore(state => state.activeWorkspaceId);
  const switchWorkspace = useStore(state => state.switchWorkspace);
  const workspaceModal = useStore(state => state.workspaceModal);
  const setWorkspaceModal = useStore(state => state.setWorkspaceModal);
  const departmentModal = useStore(state => state.departmentModal);
  const setDepartmentModal = useStore(state => state.setDepartmentModal);
  const departmentInfo = useStore(state => state.departmentInfo);
  const userRole = useStore(state => state.userRole);
  const setPinAuthModal = useStore(state => state.setPinAuthModal);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeWs = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!workspaces || workspaces.length === 0) return null;

  const filteredWorkspaces = workspaces.filter(ws => 
    ws.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ws.homeroomClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ws.schoolName && ws.schoolName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectWorkspace = (wsId: string) => {
    if (wsId === activeWorkspaceId) {
      setIsOpen(false);
      return;
    }
    switchWorkspace(wsId);
    setIsOpen(false);
  };

  return (
    <>
      <div ref={dropdownRef} className="relative inline-block shrink-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100/90 via-pink-50/80 to-indigo-100/90 hover:from-purple-200/90 hover:to-indigo-200/90 border border-purple-200 text-purple-900 text-xs font-black shadow-2xs transition-all cursor-pointer group active:scale-95 shrink-0 min-h-[36px]"
          title="Chuyển đổi nhanh giữa các lớp trong Tổ Chuyên Môn"
        >
          <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold overflow-hidden shrink-0 shadow-2xs">
            {activeWs?.avatarUrl ? (
              <img src={activeWs.avatarUrl} alt={activeWs.name} className="w-full h-full object-cover" />
            ) : (
              <span>👩‍🏫</span>
            )}
          </div>

          <div className="text-left flex items-center gap-1">
            <span className="truncate max-w-[65px] xs:max-w-[90px] sm:max-w-[120px] md:max-w-[150px]">
              {activeWs?.name || 'Giáo viên'}
            </span>
            <span className="inline-block text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-indigo-200/90 text-indigo-900 shrink-0">
              {activeWs?.homeroomClass || 'Lớp'}
            </span>
          </div>

          <ChevronDown 
            size={13} 
            className={`text-purple-600 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 sm:right-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-[320px] sm:w-84 bg-white rounded-2xl shadow-2xl border border-purple-100 p-2.5 space-y-2 animate-bounce-in z-50">
            
            {/* Header with Department Info */}
            <div className="px-2 py-1.5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <School size={13} className="text-indigo-600" /> {departmentInfo?.name || 'Tổ Chuyên Môn'}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                {workspaces.length} Lớp (300 HS)
              </span>
            </div>

            {/* Quick Filter Input */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Tìm lớp (2A1..2A10) hoặc tên GV..."
                className="w-full pl-7 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* 10 Classes List */}
            <div className="max-h-60 overflow-y-auto py-0.5 space-y-1 pr-0.5">
              {filteredWorkspaces.map((ws, idx) => {
                const isSelected = ws.id === activeWorkspaceId;
                const studentCount = (ws.classes || []).reduce((acc, c) => acc + (c.students?.length || 0), 0);

                return (
                  <button
                    key={`${ws.id}_${ws.homeroomClass}_${idx}`}
                    onClick={() => handleSelectWorkspace(ws.id)}
                    className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                      isSelected 
                        ? 'bg-indigo-50 text-indigo-900 border border-indigo-200/90 font-bold' 
                        : 'hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs text-white shrink-0 font-black shadow-2xs">
                        {ws.homeroomClass}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black truncate text-slate-800 flex items-center gap-1">
                          <span>{ws.name}</span>
                          {ws.isDepartmentLeader && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-purple-100 text-purple-800 font-bold">
                              Tổ trưởng
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          Lớp {ws.homeroomClass} • {studentCount} học sinh
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <Check size={15} className="text-indigo-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer Quick Actions */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setDepartmentModal(true);
                }}
                className="py-2 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <ShieldCheck size={13} />
                <span>Bảng Thi Đua Tổ</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setWorkspaceModal(true);
                }}
                className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95"
              >
                <Settings2 size={13} />
                <span>Quản lý 10 lớp</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <TeacherWorkspaceModal 
        isOpen={workspaceModal} 
        onClose={() => setWorkspaceModal(false)} 
      />

      <DepartmentModal 
        isOpen={departmentModal} 
        onClose={() => setDepartmentModal(false)} 
      />
    </>
  );
}


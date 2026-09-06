import { useShallow } from 'zustand/react/shallow';
import { useState } from 'react';
import { X, Star, AlertTriangle, Settings, Plus, Pencil } from 'lucide-react';
import { Student } from '../../types';
import { useStore } from '../../store';
import { cn, playSound, triggerConfetti, getAvatarUrl } from '../../utils/helpers';
import { CriteriaModal } from '../modals/CriteriaModal';

interface PointModalProps {
  student: Student;
  type: 'positive' | 'negative';
  onClose: () => void;
}

export function PointModal({ student, type, onClose }: PointModalProps) {
  const { classes, activeClassId, pointCriteria, addPoints, soundEnabled } = useStore(useShallow(state => ({ classes: state.classes, activeClassId: state.activeClassId, pointCriteria: state.pointCriteria, addPoints: state.addPoints, soundEnabled: state.soundEnabled })));
  const [customReason, setCustomReason] = useState('');
  const [customAmount, setCustomAmount] = useState(type === 'positive' ? 1 : -1);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [editingCriteriaId, setEditingCriteriaId] = useState<string | null>(null);

  const activeClass = classes.find(c => c.id === activeClassId);
  const criteria = pointCriteria.filter(c => c.type === type);

  const handleAssign = (amount: number, reason: string) => {
    addPoints(student.id, amount, reason);
    if (soundEnabled) {
      playSound(amount > 0 ? 'success' : 'error');
    }
    if (amount > 0) {
      triggerConfetti();
    }
    onClose();
  };

  const handleCustomAssign = () => {
    if (!customReason) return;
    handleAssign(customAmount, customReason);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div 
          className={cn(
            "bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all max-h-[90vh] flex flex-col",
            type === 'positive' ? "border-t-8 border-purple-500" : "border-t-8 border-orange-500"
          )}
        >
          <div className="p-4 border-b flex items-center justify-between shrink-0">
            <h2 className="text-xl font-black flex items-center gap-2">
              {type === 'positive' ? (
                <><Star className="text-yellow-400 fill-yellow-400" /> TUYÊN DƯƠNG</>
              ) : (
                <><AlertTriangle className="text-orange-500" /> NHẮC NHỞ</>
              )}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setEditingCriteriaId(null);
                  setShowCriteriaModal(true);
                }}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-purple-600"
                title="Thêm hoặc tùy chỉnh tiêu chí"
              >
                <Settings size={18} />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 p-1 border-2 border-purple-200 shadow-md mb-2 overflow-hidden shrink-0">
                <img 
                  src={getAvatarUrl(student.avatarId, activeClass?.customAvatars)} 
                  alt={student.name}
                  className="w-full h-full rounded-xl object-cover" 
                />
              </div>
              <div className="text-2xl font-black text-slate-800">{student.name}</div>
              <div className="text-sm font-bold mt-1">
                Điểm hiện tại: <span className={student.points >= 0 ? "text-green-600 font-black" : "text-red-600 font-black"}>{student.points} điểm</span>
              </div>
            </div>

            {/* Criteria Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Chọn tiêu chí ({criteria.length})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCriteriaId(null);
                    setShowCriteriaModal(true);
                  }}
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <Plus size={14} /> Thêm tiêu chí
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {criteria.map(c => (
                  <div
                    key={c.id}
                    className={cn(
                      "group relative p-3.5 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between min-h-[90px] border shadow-2xs cursor-pointer",
                      type === 'positive' 
                        ? "bg-purple-50/70 hover:bg-purple-100 border-purple-100 text-purple-950" 
                        : "bg-orange-50/70 hover:bg-orange-100 border-orange-100 text-orange-950"
                    )}
                    onClick={() => handleAssign(c.amount, c.reason)}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {c.icon && <span className="text-lg shrink-0">{c.icon}</span>}
                        <span className="font-bold text-xs leading-tight line-clamp-2">{c.reason}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCriteriaId(c.id);
                          setShowCriteriaModal(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/80 rounded-md text-slate-400 hover:text-slate-700 transition-all shrink-0"
                        title="Chỉnh sửa tiêu chí này"
                      >
                        <Pencil size={12} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5">
                      <span className="text-[10px] font-bold opacity-60">Nhấn để cộng</span>
                      <span className={cn(
                        "font-black text-base px-2 py-0.5 rounded-lg bg-white shadow-2xs",
                        type === 'positive' ? "text-purple-600" : "text-orange-600"
                      )}>
                        {c.amount > 0 ? `+${c.amount}` : c.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="border-t pt-4">
              <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Tùy chỉnh lý do khác</div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Nhập lý do tùy chỉnh..." 
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                />
                <input 
                  type="number" 
                  className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400 text-center font-black text-sm"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(parseInt(e.target.value) || 0)}
                />
                <button 
                  onClick={handleCustomAssign}
                  disabled={!customReason}
                  className={cn(
                    "px-5 rounded-xl font-bold text-white disabled:opacity-50 transition-colors text-sm shadow-sm shrink-0",
                    type === 'positive' ? "bg-purple-600 hover:bg-purple-700" : "bg-orange-600 hover:bg-orange-700"
                  )}
                >
                  Ghi điểm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CriteriaModal
        isOpen={showCriteriaModal}
        onClose={() => {
          setShowCriteriaModal(false);
          setEditingCriteriaId(null);
        }}
        editingCriteriaId={editingCriteriaId}
        defaultType={type}
      />
    </>
  );
}



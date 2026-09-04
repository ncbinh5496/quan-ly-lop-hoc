import React, { useState } from 'react';
import { useStore } from '../../store';
import { Sparkles, RotateCcw, Plus, Star, AlertTriangle, Pencil, Trash2 } from 'lucide-react';

interface PointCriteriaSectionProps {
  onAddCriteria: (type: 'positive' | 'negative') => void;
  onEditCriteria: (id: string, type: 'positive' | 'negative') => void;
}

export default function PointCriteriaSection({ onAddCriteria, onEditCriteria }: PointCriteriaSectionProps) {
  const pointCriteria = useStore(state => state.pointCriteria);
  const deletePointCriteria = useStore(state => state.deletePointCriteria);
  const resetPointCriteria = useStore(state => state.resetPointCriteria);
  const showToast = useStore(state => state.showToast);

  const [activeCriteriaTab, setActiveCriteriaTab] = useState<'positive' | 'negative'>('positive');
  const [criteriaToDelete, setCriteriaToDelete] = useState<{ id: string; reason: string } | null>(null);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const confirmDeleteCriteria = () => {
    if (criteriaToDelete) {
      deletePointCriteria(criteriaToDelete.id);
      showToast(`Đã xóa tiêu chí "${criteriaToDelete.reason}"`);
      setCriteriaToDelete(null);
    }
  };

  const confirmResetCriteria = () => {
    resetPointCriteria();
    showToast('Đã khôi phục danh sách tiêu chí về mặc định!');
    setIsConfirmingReset(false);
  };

  return (
    <div className="bg-white/95 rounded-[28px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100/80 flex items-center justify-center text-purple-600 border border-purple-200">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-800">Quản lý Tiêu chí Điểm</h3>
            <p className="text-xs text-slate-500">Tùy chỉnh lý do, biểu tượng và số điểm cộng/trừ</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsConfirmingReset(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
            title="Khôi phục danh sách tiêu chí về ban đầu"
          >
            <RotateCcw size={14} /> Mặc định
          </button>
          <button
            onClick={() => onAddCriteria(activeCriteriaTab)}
            className={`px-4 py-2 text-white rounded-2xl font-black transition-all shadow-md flex items-center gap-1.5 text-xs cursor-pointer hover:scale-105 active:scale-95 ${
              activeCriteriaTab === 'positive' 
                ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20' 
                : 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/20'
            }`}
          >
            <Plus size={16} /> Thêm tiêu chí {activeCriteriaTab === 'positive' ? 'cộng' : 'trừ'}
          </button>
        </div>
      </div>

      {/* Tabs switcher */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100/80 rounded-2xl">
        <button
          onClick={() => setActiveCriteriaTab('positive')}
          className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeCriteriaTab === 'positive'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Star size={15} className="text-amber-500 fill-amber-400" />
          <span>Tiêu chí Cộng (+) ({pointCriteria.filter(c => c.type === 'positive').length})</span>
        </button>
        <button
          onClick={() => setActiveCriteriaTab('negative')}
          className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeCriteriaTab === 'negative'
              ? 'bg-white text-orange-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle size={15} className="text-orange-500" />
          <span>Tiêu chí Trừ (-) ({pointCriteria.filter(c => c.type === 'negative').length})</span>
        </button>
      </div>

      {/* Criteria List */}
      {activeCriteriaTab === 'positive' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {pointCriteria.filter(c => c.type === 'positive').map(c => (
              <div 
                key={c.id} 
                className="bg-purple-50/50 border border-purple-100 hover:border-purple-300 p-4 rounded-2xl flex flex-col justify-between transition-all group shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl shrink-0">{c.icon || '⭐'}</span>
                    <span className="font-bold text-xs text-purple-950 truncate">{c.reason}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditCriteria(c.id, 'positive')}
                      className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                      title="Sửa tiêu chí"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => setCriteriaToDelete({ id: c.id, reason: c.reason })}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa tiêu chí"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-purple-100/60">
                  <span className="text-[11px] font-medium text-purple-700/70">Mức điểm thưởng</span>
                  <span className="font-black text-xs text-purple-700 bg-white px-2 py-0.5 rounded-lg shadow-2xs border border-purple-100">
                    +{Math.abs(c.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onAddCriteria('positive')}
            className="w-full py-3 border-2 border-dashed border-purple-200 hover:border-purple-400 hover:bg-purple-50/50 rounded-2xl text-purple-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus size={16} /> Thêm tiêu chí điểm cộng mới
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {pointCriteria.filter(c => c.type === 'negative').map(c => (
              <div 
                key={c.id} 
                className="bg-orange-50/50 border border-orange-100 hover:border-orange-300 p-4 rounded-2xl flex flex-col justify-between transition-all group shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl shrink-0">{c.icon || '⚠️'}</span>
                    <span className="font-bold text-xs text-orange-950 truncate">{c.reason}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditCriteria(c.id, 'negative')}
                      className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                      title="Sửa tiêu chí"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => setCriteriaToDelete({ id: c.id, reason: c.reason })}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa tiêu chí"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-orange-100/60">
                  <span className="text-[11px] font-medium text-orange-700/70">Mức điểm trừ</span>
                  <span className="font-black text-xs text-orange-700 bg-white px-2 py-0.5 rounded-lg shadow-2xs border border-orange-100">
                    -{Math.abs(c.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onAddCriteria('negative')}
            className="w-full py-3 border-2 border-dashed border-orange-200 hover:border-orange-400 hover:bg-orange-50/50 rounded-2xl text-orange-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus size={16} /> Thêm tiêu chí điểm trừ mới
          </button>
        </div>
      )}

      {/* Delete Criteria Confirmation Modal */}
      {criteriaToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-rose-100 text-center animate-bounce-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-3">
              <Trash2 size={24} />
            </div>
            <h3 className="font-black text-slate-800 text-base mb-1">
              Xóa tiêu chí "{criteriaToDelete.reason}"?
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Tiêu chí này sẽ bị xóa khỏi danh sách chọn nhanh. Các điểm số đã cộng/trừ trước đây vẫn được bảo lưu.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCriteriaToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmDeleteCriteria}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-md shadow-rose-500/20 cursor-pointer"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Criteria Confirmation Modal */}
      {isConfirmingReset && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-purple-100 text-center animate-bounce-in">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl mx-auto mb-3">
              <RotateCcw size={24} />
            </div>
            <h3 className="font-black text-slate-800 text-base mb-1">
              Khôi phục tiêu chí mặc định?
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Toàn bộ danh sách tiêu chí cộng & trừ điểm sẽ được hoàn tác về cấu hình mẫu ban đầu của hệ thống.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsConfirmingReset(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmResetCriteria}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-md shadow-purple-500/20 cursor-pointer"
              >
                Khôi phục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useStore } from '../../store';
import { Download, Upload, AlertTriangle, RotateCcw } from 'lucide-react';

export default function DataBackupSection() {
  const resetData = useStore(state => state.resetData);
  const restoreData = useStore(state => state.restoreData);
  const showToast = useStore(state => state.showToast);

  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<any | null>(null);

  const handleExportData = () => {
    const stateStr = localStorage.getItem('htcvq-storage');
    if (!stateStr) return;
    
    const blob = new Blob([stateStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hanh-trinh-vinh-quang-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Đã xuất file sao lưu dữ liệu thành công!');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && json.state) {
          setPendingImportData(json.state);
        } else {
          showToast('File sao lưu không hợp lệ hoặc thiếu cấu trúc dữ liệu.', 'error');
        }
      } catch (err) {
        showToast('File sao lưu không hợp lệ.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const confirmImport = () => {
    if (pendingImportData) {
      restoreData(pendingImportData);
      showToast('Khôi phục dữ liệu thành công!');
      setPendingImportData(null);
    }
  };

  const confirmReset = () => {
    resetData();
    showToast('Đã khôi phục dữ liệu gốc thành công!');
    setIsConfirmingReset(false);
  };

  return (
    <div className="bg-white/95 rounded-[28px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80 space-y-6">
      <h3 className="font-black text-lg text-slate-800 border-b border-purple-50 pb-4">Sao lưu & Phục hồi dữ liệu</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          onClick={handleExportData}
          className="flex items-center justify-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-2xl font-bold transition-colors cursor-pointer border border-purple-100"
        >
          <Download size={18} /> Sao lưu dữ liệu (.json)
        </button>
        
        <label className="flex items-center justify-center gap-2 p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl font-bold transition-colors cursor-pointer border border-emerald-100">
          <Upload size={18} /> Phục hồi dữ liệu
          <input type="file" accept=".json" className="hidden" onChange={handleImportData} />
        </label>
      </div>

      <div className="mt-6 pt-6 border-t border-rose-100">
        <div className="flex items-start gap-4 p-4 bg-rose-50/80 rounded-2xl border border-rose-100">
          <AlertTriangle className="text-rose-500 shrink-0 mt-1" size={22} />
          <div>
            <h4 className="font-black text-rose-800 mb-1 text-sm">Xóa toàn bộ dữ liệu</h4>
            <p className="text-rose-600/90 text-xs mb-3 font-medium">
              Hành động này sẽ xóa tất cả học sinh, điểm số, lịch sử và đưa hệ thống về trạng thái ban đầu với dữ liệu mẫu.
            </p>
            <button 
              onClick={() => setIsConfirmingReset(true)}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-colors shadow-sm cursor-pointer"
            >
              Xóa toàn bộ
            </button>
          </div>
        </div>
      </div>

      {/* Restore Import Confirmation Modal */}
      {pendingImportData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-emerald-100 text-center animate-bounce-in">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl mx-auto mb-3">
              <Upload size={24} />
            </div>
            <h3 className="font-black text-slate-800 text-base mb-1">
              Phục hồi dữ liệu từ file?
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Toàn bộ dữ liệu hiện tại sẽ được ghi đè bằng dữ liệu trong file sao lưu vừa chọn. Bạn có muốn tiếp tục?
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPendingImportData(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmImport}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                Khôi phục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Entire App Confirmation Modal */}
      {isConfirmingReset && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-rose-100 text-center animate-bounce-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto mb-3">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-black text-slate-800 text-base mb-1">
              Xóa toàn bộ dữ liệu ứng dụng?
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Tất cả danh sách học sinh, điểm số, lịch sử và tùy biến sẽ được đưa về cài đặt gốc ban đầu. Hành động này không thể hoàn tác!
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsConfirmingReset(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-md shadow-rose-500/20 cursor-pointer"
              >
                Xóa tất cả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

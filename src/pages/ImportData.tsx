import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle2, ChevronRight, X, Sparkles, UserPlus } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { useStore } from '../store';

import { Gender } from '../types';

type ImportedRow = Record<string, any>;

export default function ImportData() {
  const importStudents = useStore(state => state.importStudents);
  const showToast = useStore(state => state.showToast);

  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ImportedRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2>(1);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      processFile(droppedFile);
    }
  };

  const processFile = (file: File) => {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExt === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          handleDataParsed(results.data, results.meta.fields || []);
        },
        error: (err) => {
          showToast(`Lỗi đọc file CSV: ${err.message}`, 'error');
        }
      });
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          
          if (json.length > 0) {
            const cols = Object.keys(json[0] as object);
            handleDataParsed(json, cols);
          } else {
            showToast('File Excel trống.', 'error');
          }
        } catch (error) {
          showToast('Không thể đọc file Excel. Vui lòng kiểm tra lại.', 'error');
        }
      };
      reader.readAsBinaryString(file);
    } else {
      showToast('Định dạng file không được hỗ trợ. Vui lòng dùng .xlsx hoặc .csv', 'error');
    }
  };

  const handleDataParsed = (data: any[], cols: string[]) => {
    setColumns(cols);
    setPreviewData(data);
    setStep(2);
  };

  const getMappedStudents = () => {
    return previewData.map(row => {
      let name = row['Họ và tên'] || row['Họ tên'] || row['Name'] || row['Tên'] || '';
      if (!name) {
        const nameCol = columns.find(c => c.toLowerCase().includes('tên') || c.toLowerCase().includes('name'));
        if (nameCol) name = row[nameCol];
      }

      let gender = row['Giới tính'] || row['Gender'] || row['Phái'] || 'Nữ';
      const genderCol = columns.find(c => c.toLowerCase().includes('giới tính') || c.toLowerCase().includes('gender'));
      if (!row['Giới tính'] && genderCol) {
         gender = row[genderCol];
      }

      return {
        name: name.toString().trim(),
        gender: gender.toString().trim(),
      };
    }).filter(s => s.name);
  };

  const handleConfirmImport = () => {
    const studentsToImport = getMappedStudents();
    if (studentsToImport.length === 0) {
      showToast('Không tìm thấy dữ liệu hợp lệ để nhập.', 'error');
      return;
    }
    
    const mappedToStore: Array<{ name: string; gender: Gender; avatarId: string }> = studentsToImport.map(s => {
       const isBoy = s.gender.toLowerCase() === 'nam' || s.gender.toLowerCase() === 'boy' || s.gender.toLowerCase() === 'm';
       return {
         name: s.name,
         gender: (isBoy ? 'Nam' : 'Nữ') as Gender,
         avatarId: isBoy ? `boy-${Math.floor(Math.random() * 5) + 1}` : `girl-${Math.floor(Math.random() * 5) + 1}`,
       };
    });

    importStudents(mappedToStore);
    showToast(`Đã nhập thành công ${mappedToStore.length} học sinh!`);
    
    // Reset state
    setFile(null);
    setPreviewData([]);
    setColumns([]);
    setStep(1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const cancelImport = () => {
    setFile(null);
    setPreviewData([]);
    setColumns([]);
    setStep(1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const studentsToImport = step === 2 ? getMappedStudents() : [];
  const validCount = studentsToImport.length;
  const invalidCount = previewData.length - validCount;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex items-center gap-3.5 bg-white/95 p-5 sm:p-6 rounded-[28px] border border-purple-100/80 shadow-[0_8px_30px_rgba(124,58,237,0.05)]">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <FileSpreadsheet size={24} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Nhập Dữ Liệu Học Sinh</h2>
          <p className="text-slate-500 text-xs font-semibold">Tải danh sách học sinh từ file Excel hoặc CSV tự động</p>
        </div>
      </div>

      <div className="bg-white/95 rounded-[32px] shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80 overflow-hidden">
        {/* Step Flow Bar */}
        <div className="flex border-b border-purple-50 bg-slate-50/50 p-2">
          <div className={`flex-1 py-3 px-6 text-center font-black text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-2 ${
            step >= 1 ? 'bg-white text-purple-700 shadow-xs border border-purple-100' : 'text-slate-400'
          }`}>
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs">1</span>
            Tải file Excel / CSV
          </div>
          <div className="flex items-center px-2 text-slate-300">
            <ChevronRight size={18} />
          </div>
          <div className={`flex-1 py-3 px-6 text-center font-black text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-2 ${
            step === 2 ? 'bg-white text-purple-700 shadow-xs border border-purple-100' : 'text-slate-400'
          }`}>
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs">2</span>
            Xem trước & Nhập lớp
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {step === 1 && (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center py-14 px-6 border-3 border-dashed rounded-[28px] transition-all cursor-pointer ${
                isDragging 
                  ? 'border-purple-500 bg-purple-100/50 scale-[1.01]' 
                  : 'border-purple-200 bg-purple-50/30 hover:bg-purple-50/60 hover:border-purple-400'
              }`}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl flex items-center justify-center text-white mb-5 shadow-lg shadow-purple-500/20">
                <Upload size={32} />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-1">
                Kéo thả file vào đây hoặc bấm để chọn tệp
              </h3>
              <p className="text-slate-500 text-xs font-semibold text-center mb-6">
                Hỗ trợ định dạng: <span className="text-purple-600 font-bold">.xlsx, .xls, .csv</span> (Tự động nhận diện cột Họ tên & Giới tính)
              </p>
              
              <button 
                type="button"
                className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-2xl font-black text-xs shadow-md shadow-purple-500/20 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <FileSpreadsheet size={16} /> Chọn tệp từ máy tính
              </button>
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Stats Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0">
                    <FileSpreadsheet size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-purple-700 uppercase tracking-wider mb-0.5">Tệp đã chọn</p>
                    <p className="font-black text-slate-800 text-xs truncate">{file?.name}</p>
                  </div>
                </div>
                
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0">
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider mb-0.5">Hợp lệ</p>
                    <p className="font-black text-emerald-800 text-base">{validCount} <span className="text-xs font-semibold">học sinh</span></p>
                  </div>
                </div>

                <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0">
                    <AlertTriangle size={22} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-rose-700 uppercase tracking-wider mb-0.5">Bỏ qua / Lỗi</p>
                    <p className="font-black text-rose-800 text-base">{invalidCount} <span className="text-xs font-semibold">dòng</span></p>
                  </div>
                </div>
              </div>

              {/* Data Preview Table */}
              <div className="border border-purple-100/80 rounded-2xl overflow-hidden shadow-2xs">
                <div className="bg-purple-50/50 px-4 py-3 border-b border-purple-100 font-bold text-slate-700 flex flex-wrap justify-between items-center gap-2">
                  <span className="text-xs font-black text-slate-800">
                    Xem trước ({Math.min(studentsToImport.length, 6)} dòng đầu tiên)
                  </span>
                  <span className="text-[11px] font-bold bg-white text-purple-700 px-2.5 py-0.5 rounded-lg border border-purple-200">
                    ✨ Tự động nhận diện Họ tên & Giới tính
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80">
                        <th className="px-4 py-2.5 border-b border-purple-100 text-slate-500 font-black text-xs uppercase tracking-wider">STT</th>
                        <th className="px-4 py-2.5 border-b border-purple-100 text-slate-500 font-black text-xs uppercase tracking-wider">Họ và tên học sinh</th>
                        <th className="px-4 py-2.5 border-b border-purple-100 text-slate-500 font-black text-xs uppercase tracking-wider">Giới tính</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-50">
                      {studentsToImport.slice(0, 6).map((s, idx) => (
                        <tr key={idx} className="hover:bg-purple-50/30 transition-colors">
                          <td className="px-4 py-2.5 text-slate-600 font-bold text-xs">{idx + 1}</td>
                          <td className="px-4 py-2.5 font-bold text-slate-800 text-xs">{s.name}</td>
                          <td className="px-4 py-2.5">
                            <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-black ${
                              s.gender.toLowerCase().includes('nam') || s.gender.toLowerCase() === 'boy' 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'bg-pink-100 text-pink-700'
                            }`}>
                              {s.gender || 'Nữ'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {studentsToImport.length > 6 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-center text-slate-500 text-xs font-semibold italic bg-slate-50/40">
                            ... và {studentsToImport.length - 6} học sinh khác sẽ được thêm tự động
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button"
                  onClick={cancelImport}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <X size={15} /> Hủy bỏ
                </button>
                <button 
                  type="button"
                  onClick={handleConfirmImport}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-2xl font-black text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <UserPlus size={16} /> Xác nhận nhập vào lớp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

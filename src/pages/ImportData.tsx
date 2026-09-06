import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  Sparkles, 
  UserPlus, 
  Download, 
  RefreshCw, 
  SlidersHorizontal, 
  Trash2, 
  Search, 
  Check, 
  FileText, 
  ClipboardList,
  Layers,
  ArrowRight
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useStore } from '../store';
import { Gender } from '../types';
import { 
  readExcelWorkbook, 
  getSheetRawRows, 
  detectHeaderRowIndex, 
  detectColumnMapping, 
  extractStudentsFromRawRows, 
  parsePastedText, 
  downloadSampleStudentExcel,
  ParsedStudentItem,
  DetectedMapping
} from '../utils/excelParser';
import { playSound, triggerConfetti } from '../utils/helpers';

interface ImportDataProps {
  onNavigateTab?: (tab: string) => void;
}

export default function ImportData({ onNavigateTab }: ImportDataProps) {
  const classes = useStore(state => state.classes);
  const activeClassId = useStore(state => state.activeClassId);
  const importStudents = useStore(state => state.importStudents);
  const showToast = useStore(state => state.showToast);

  // Active source mode
  const [sourceMode, setSourceMode] = useState<'excel' | 'paste'>('excel');
  const [step, setStep] = useState<1 | 2>(1);

  // Target class selection
  const [targetClassId, setTargetClassId] = useState<string>(activeClassId || classes[0]?.id || '');
  const [importOption, setImportOption] = useState<'append' | 'replace'>('append');
  const [confirmReplaceChecked, setConfirmReplaceChecked] = useState(false);

  // Excel State
  const [file, setFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedSheetName, setSelectedSheetName] = useState<string>('');
  const [rawRows, setRawRows] = useState<any[][]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mapping state
  const [mapping, setMapping] = useState<DetectedMapping>({
    headerRowIndex: 0,
    nameMode: 'single',
    fullNameColIndex: 0,
    lastNameColIndex: 0,
    firstNameColIndex: 1,
    genderMode: 'gender_col',
    genderColIndex: 1,
    femaleMarkColIndex: -1,
    groupColIndex: -1,
  });
  const [isMappingExpanded, setIsMappingExpanded] = useState(false);

  // Parsed students list
  const [students, setStudents] = useState<ParsedStudentItem[]>([]);

  // Text Paste State
  const [pastedText, setPastedText] = useState('');

  // Table filtering & search
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Nam' | 'Nữ'>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep target class in sync if activeClass changes
  useEffect(() => {
    if (activeClassId && !targetClassId) {
      setTargetClassId(activeClassId);
    }
  }, [activeClassId, targetClassId]);

  const targetClass = useMemo(() => {
    return classes.find(c => c.id === targetClassId) || classes[0];
  }, [classes, targetClassId]);

  // Handle Excel/CSV file processing
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
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
      processFile(droppedFile);
    }
  };

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsLoading(true);
    setErrorMessage(null);

    const ext = selectedFile.name.split('.').pop()?.toLowerCase();

    try {
      if (ext === 'csv') {
        // Read CSV using PapaParse into 2D array
        Papa.parse(selectedFile, {
          header: false,
          skipEmptyLines: false,
          complete: (results) => {
            const rows = (results.data as any[][]) || [];
            if (rows.length === 0) {
              setErrorMessage('Tệp CSV trống hoặc không có nội dung.');
              setIsLoading(false);
              return;
            }
            processRawMatrix(rows, selectedFile.name, ['Sheet1'], 'Sheet1', null);
            setIsLoading(false);
          },
          error: (err) => {
            setErrorMessage(`Không thể đọc file CSV: ${err.message}`);
            setIsLoading(false);
          }
        });
      } else if (ext === 'xlsx' || ext === 'xls') {
        // Modern array buffer reading
        const wb = await readExcelWorkbook(selectedFile);
        if (!wb || !wb.SheetNames || wb.SheetNames.length === 0) {
          throw new Error('File Excel không chứa trang tính (Sheet) nào.');
        }

        const sheets = wb.SheetNames;
        // Find sheet with maximum rows, or fallback to first
        let bestSheet = sheets[0];
        let maxNonEmptyRows = -1;

        for (const sName of sheets) {
          const ws = wb.Sheets[sName];
          if (ws) {
            const rows = getSheetRawRows(ws);
            if (rows.length > maxNonEmptyRows) {
              maxNonEmptyRows = rows.length;
              bestSheet = sName;
            }
          }
        }

        const currentWs = wb.Sheets[bestSheet];
        const sheetRows = getSheetRawRows(currentWs);

        if (sheetRows.length === 0) {
          setErrorMessage(`Trang tính "${bestSheet}" trong file Excel trống.`);
          setIsLoading(false);
          return;
        }

        processRawMatrix(sheetRows, selectedFile.name, sheets, bestSheet, wb);
        setIsLoading(false);
      } else {
        setErrorMessage('Định dạng file chưa được hỗ trợ. Vui lòng chọn tệp .xlsx, .xls hoặc .csv');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('File parsing error:', err);
      setErrorMessage(
        err?.message || 'Không thể đọc file Excel. Vui lòng kiểm tra lại xem file có bị khóa mật khẩu hoặc lỗi định dạng không.'
      );
      setIsLoading(false);
    }
  };

  const processRawMatrix = (
    rows: any[][],
    fileName: string,
    sheets: string[],
    activeSheet: string,
    wb: XLSX.WorkBook | null
  ) => {
    setRawRows(rows);
    setAvailableSheets(sheets);
    setSelectedSheetName(activeSheet);
    if (wb) setWorkbook(wb);

    // Auto-detect header row
    const detectedHeaderIndex = detectHeaderRowIndex(rows);
    const headerCells = (rows[detectedHeaderIndex] || []).map((c: any, i: number) => 
      String(c || '').trim() || `Cột ${i + 1}`
    );

    // Auto-detect column mapping
    const detectedMapping = detectColumnMapping(headerCells, rows, detectedHeaderIndex);
    setMapping(detectedMapping);

    // Extract student rows
    const extracted = extractStudentsFromRawRows(rows, detectedMapping);
    setStudents(extracted);

    if (extracted.length === 0) {
      // Auto-open mapping panel if no students were found initially so user can easily adjust
      setIsMappingExpanded(true);
      setErrorMessage('Chưa tự động nhận diện được học sinh. Bạn có thể kiểm tra và chọn lại cột Họ tên hoặc Dòng tiêu đề ở bảng tùy chỉnh bên dưới.');
    } else {
      setErrorMessage(null);
    }

    setStep(2);
  };

  // Switch Sheet if workbook has multiple sheets
  const handleSwitchSheet = (newSheetName: string) => {
    if (!workbook) return;
    const ws = workbook.Sheets[newSheetName];
    if (!ws) return;

    setSelectedSheetName(newSheetName);
    const sheetRows = getSheetRawRows(ws);
    setRawRows(sheetRows);

    const detectedHeaderIndex = detectHeaderRowIndex(sheetRows);
    const headerCells = (sheetRows[detectedHeaderIndex] || []).map((c: any, i: number) => 
      String(c || '').trim() || `Cột ${i + 1}`
    );

    const detectedMapping = detectColumnMapping(headerCells, sheetRows, detectedHeaderIndex);
    setMapping(detectedMapping);

    const extracted = extractStudentsFromRawRows(sheetRows, detectedMapping);
    setStudents(extracted);

    if (extracted.length === 0) {
      setIsMappingExpanded(true);
      setErrorMessage(`Trang tính "${newSheetName}" chưa tìm thấy danh sách học sinh. Vui lòng chọn dòng tiêu đề và cột tên phù hợp.`);
    } else {
      setErrorMessage(null);
    }
  };

  // Re-run extraction whenever user manually tweaks mapping
  const applyMappingUpdate = (newMapping: DetectedMapping) => {
    setMapping(newMapping);
    if (rawRows.length > 0) {
      const extracted = extractStudentsFromRawRows(rawRows, newMapping);
      setStudents(extracted);
      if (extracted.length > 0) {
        setErrorMessage(null);
      }
    }
  };

  // Process text pasted from clipboard
  const handleProcessPastedText = () => {
    if (!pastedText.trim()) {
      showToast('Vui lòng dán danh sách học sinh vào ô văn bản.', 'error');
      return;
    }

    const parsed = parsePastedText(pastedText);
    if (parsed.length === 0) {
      showToast('Không tìm thấy học sinh nào từ văn bản đã dán. Vui lòng xem định dạng mẫu.', 'error');
      return;
    }

    setStudents(parsed);
    setFile(null);
    setWorkbook(null);
    setStep(2);
    setErrorMessage(null);
    showToast(`Đã nhận diện ${parsed.length} học sinh từ văn bản!`);
  };

  // Available column headers for mapping dropdowns
  const currentHeaderCells = useMemo(() => {
    if (!rawRows || rawRows.length === 0) return [];
    const hRow = rawRows[mapping.headerRowIndex] || [];
    return hRow.map((cell: any, idx: number) => {
      const val = String(cell || '').trim();
      const sample = rawRows[mapping.headerRowIndex + 1]?.[idx];
      const sampleStr = sample ? ` (vd: "${String(sample).trim().slice(0, 15)}")` : '';
      return {
        index: idx,
        label: `${val || `Cột ${idx + 1}`}${sampleStr}`,
        rawLabel: val || `Cột ${idx + 1}`
      };
    });
  }, [rawRows, mapping.headerRowIndex]);

  // Toggle student selection
  const toggleStudentSelection = (id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, isSelected: !s.isSelected } : s));
  };

  // Toggle all students selection
  const toggleSelectAll = (selectAll: boolean) => {
    setStudents(prev => prev.map(s => ({ ...s, isSelected: selectAll })));
  };

  // Toggle gender of a student
  const toggleGender = (id: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const nextGender: Gender = s.gender === 'Nam' ? 'Nữ' : 'Nam';
        return { ...s, gender: nextGender };
      }
      return s;
    }));
  };

  // Edit student name
  const updateStudentName = (id: string, newName: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
  };

  // Delete student row from preview
  const removeStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  // Add manual student to preview
  const addBlankStudent = () => {
    const newStudent: ParsedStudentItem = {
      id: `manual-${Date.now()}`,
      name: 'Học sinh mới',
      gender: 'Nam',
      originalRowIndex: -1,
      isSelected: true,
    };
    setStudents(prev => [newStudent, ...prev]);
    showToast('Đã thêm 1 dòng học sinh mới');
  };

  // Filtered students for preview table
  const displayStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGender = genderFilter === 'all' || s.gender === genderFilter;
      return matchesSearch && matchesGender;
    });
  }, [students, searchQuery, genderFilter]);

  const selectedCount = useMemo(() => {
    return students.filter(s => s.isSelected).length;
  }, [students]);

  const boyCount = useMemo(() => {
    return students.filter(s => s.isSelected && s.gender === 'Nam').length;
  }, [students]);

  const girlCount = useMemo(() => {
    return students.filter(s => s.isSelected && s.gender === 'Nữ').length;
  }, [students]);

  // Confirm and save to store
  const handleConfirmImport = () => {
    const activeSelected = students.filter(s => s.isSelected && s.name.trim());
    if (activeSelected.length === 0) {
      showToast('Vui lòng chọn ít nhất 1 học sinh để nhập vào lớp.', 'error');
      return;
    }

    if (!targetClassId) {
      showToast('Vui lòng chọn lớp học cần nhập dữ liệu.', 'error');
      return;
    }

    if (importOption === 'replace' && !confirmReplaceChecked) {
      showToast('Vui lòng tích xác nhận đồng ý thay thế danh sách học sinh.', 'error');
      return;
    }

    // Map to student items with cute random avatars
    const mappedToStore = activeSelected.map(s => {
      const isBoy = s.gender === 'Nam';
      const randomAvatarNum = Math.floor(Math.random() * 8) + 1;
      return {
        name: s.name.trim(),
        gender: s.gender,
        avatarId: isBoy ? `boy-${randomAvatarNum}` : `girl-${randomAvatarNum}`,
      };
    });

    importStudents(mappedToStore, {
      replace: importOption === 'replace',
      classId: targetClassId,
    });

    playSound('success');
    triggerConfetti();

    const classLabel = targetClass?.name ? `lớp ${targetClass.name}` : 'lớp học';
    showToast(
      importOption === 'replace'
        ? `Đã thay thế và nhập thành công ${mappedToStore.length} học sinh vào ${classLabel}!`
        : `Đã thêm thành công ${mappedToStore.length} học sinh vào ${classLabel}!`,
      'success'
    );

    // Reset view
    setStep(1);
    setFile(null);
    setWorkbook(null);
    setRawRows([]);
    setStudents([]);
    setPastedText('');
    setConfirmReplaceChecked(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const cancelImport = () => {
    setStep(1);
    setFile(null);
    setWorkbook(null);
    setRawRows([]);
    setStudents([]);
    setErrorMessage(null);
    setIsMappingExpanded(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-20">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/95 p-5 sm:p-6 rounded-[28px] border border-purple-100/80 shadow-[0_8px_30px_rgba(124,58,237,0.05)]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <FileSpreadsheet size={26} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Nhập Dữ Liệu Học Sinh
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                Excel & CSV
              </span>
            </h2>
            <p className="text-slate-500 text-xs font-semibold">
              Tự động nhận diện cột Họ tên, Giới tính, hỗ trợ định dạng VnEdu, SMAS, CSDL ngành
            </p>
          </div>
        </div>

        {/* Action button: Download template */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={downloadSampleStudentExcel}
            className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-xs cursor-pointer hover:scale-105 active:scale-95"
            title="Tải file Excel mẫu chuẩn đã định dạng sẵn"
          >
            <Download size={15} />
            <span>Tải file Excel mẫu (.xlsx)</span>
          </button>

          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('students')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Xem danh sách lớp</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white/95 rounded-[32px] shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80 overflow-hidden">
        {/* Step Flow Bar */}
        <div className="flex border-b border-purple-50 bg-slate-50/50 p-2">
          <div className={`flex-1 py-3 px-4 sm:px-6 text-center font-black text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-2 ${
            step === 1 ? 'bg-white text-purple-700 shadow-xs border border-purple-100' : 'text-slate-400'
          }`}>
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs">1</span>
            Chọn nguồn dữ liệu
          </div>
          <div className="flex items-center px-2 text-slate-300">
            <ChevronRight size={18} />
          </div>
          <div className={`flex-1 py-3 px-4 sm:px-6 text-center font-black text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-2 ${
            step === 2 ? 'bg-white text-purple-700 shadow-xs border border-purple-100' : 'text-slate-400'
          }`}>
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs">2</span>
            Xem trước & Cấu hình cột
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Target Class Selector Bar */}
          <div className="mb-6 p-4 rounded-2xl bg-purple-50/50 border border-purple-100/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                🏫
              </span>
              <div>
                <span className="text-[11px] font-black uppercase text-purple-700 tracking-wider block">
                  Lớp tiếp nhận dữ liệu
                </span>
                <span className="font-black text-slate-800 text-sm">
                  {targetClass?.name ? `Lớp ${targetClass.name}` : 'Chưa chọn lớp'}
                </span>
              </div>
            </div>

            {classes.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Đổi lớp:</span>
                <select
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-purple-500"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.students.length} học sinh)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* STEP 1: SOURCE SELECTION */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Method Switcher Tabs */}
              <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-full sm:w-fit">
                <button
                  type="button"
                  onClick={() => setSourceMode('excel')}
                  className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    sourceMode === 'excel'
                      ? 'bg-white text-purple-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileSpreadsheet size={16} />
                  <span>Tải file Excel / CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSourceMode('paste')}
                  className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    sourceMode === 'paste'
                      ? 'bg-white text-purple-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ClipboardList size={16} />
                  <span>Dán văn bản (Copy & Paste)</span>
                </button>
              </div>

              {/* Error Box if any */}
              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700">
                  <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                  <div className="text-xs">
                    <p className="font-bold">{errorMessage}</p>
                    <p className="mt-1 text-rose-600">
                      Gợi ý: Bạn có thể tải file Excel mẫu để điền, hoặc chuyển sang tab "Dán văn bản" để copy danh sách vào nhanh chóng.
                    </p>
                  </div>
                </div>
              )}

              {/* Mode A: Drag & Drop File Upload */}
              {sourceMode === 'excel' && (
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
                    {isLoading ? (
                      <RefreshCw size={32} className="animate-spin" />
                    ) : (
                      <Upload size={32} />
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-1 text-center">
                    {isLoading ? 'Đang đọc và phân tích file Excel...' : 'Kéo thả file vào đây hoặc bấm để chọn tệp'}
                  </h3>
                  <p className="text-slate-500 text-xs font-semibold text-center mb-6 max-w-md">
                    Hỗ trợ định dạng: <span className="text-purple-600 font-bold">.xlsx, .xls, .csv</span>
                    <br />
                    Tự động nhận diện dòng tiêu đề kể cả khi có banner trường học ở trên đầu!
                  </p>
                  
                  <button 
                    type="button"
                    disabled={isLoading}
                    className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-2xl font-black text-xs shadow-md shadow-purple-500/20 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
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

              {/* Mode B: Copy & Paste Text */}
              {sourceMode === 'paste' && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
                    <p className="text-xs font-bold text-purple-900 mb-1">
                      📋 Hướng dẫn dán danh sách học sinh:
                    </p>
                    <p className="text-xs text-purple-700 font-medium">
                      Mỗi học sinh một dòng. Bạn có thể copy từ Zalo, Word, hoặc copy các cột trực tiếp từ file Excel/Google Sheets rồi dán vào đây:
                    </p>
                    <div className="mt-2.5 p-3 bg-white/80 rounded-xl font-mono text-[11px] text-slate-700 border border-purple-200/60">
                      1. Nguyễn Văn An - Nam<br />
                      2. Trần Thị Bình - Nữ<br />
                      3. Lê Hoàng Cúc, Nữ<br />
                      4. Phạm Minh Dũng (Nam)
                    </div>
                  </div>

                  <textarea
                    rows={8}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Dán danh sách học sinh vào đây..."
                    className="w-full p-4 border border-purple-200 rounded-2xl focus:outline-none focus:border-purple-500 text-xs font-medium text-slate-800 bg-white shadow-inner resize-y"
                  />

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setPastedText('')}
                      className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Xóa nội dung
                    </button>
                    <button
                      type="button"
                      onClick={handleProcessPastedText}
                      className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-2xl font-black text-xs shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <Sparkles size={16} /> Chuyển sang xem trước
                    </button>
                  </div>
                </div>
              )}

              {/* Supported Features Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-start gap-2.5">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <div className="text-[11px]">
                    <span className="font-bold text-slate-800 block">Dòng tiêu đề tự động</span>
                    <span className="text-slate-500">Tự lọc bỏ các dòng tiêu đề trường, lớp ở trên cùng</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-start gap-2.5">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <div className="text-[11px]">
                    <span className="font-bold text-slate-800 block">Ghép Họ đệm + Tên</span>
                    <span className="text-slate-500">Tự nhận diện khi file tách riêng cột Họ đệm và Tên</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-start gap-2.5">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <div className="text-[11px]">
                    <span className="font-bold text-slate-800 block">Cột Nữ đánh dấu x</span>
                    <span className="text-slate-500">Hỗ trợ cột Nữ (đánh dấu x = Nữ, để trống = Nam)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PREVIEW & MAPPING */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Sheet Switcher (if file has multiple sheets) */}
              {availableSheets.length > 1 && (
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-purple-900 mr-2">
                    <Layers size={16} />
                    <span>File có {availableSheets.length} trang tính (Sheet):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {availableSheets.map(sName => (
                      <button
                        key={sName}
                        type="button"
                        onClick={() => handleSwitchSheet(sName)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedSheetName === sName
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white text-purple-700 hover:bg-purple-100 border border-purple-200'
                        }`}
                      >
                        {sName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-purple-700 uppercase tracking-wider">Nguồn</p>
                    <p className="font-black text-slate-800 text-xs truncate">
                      {file ? file.name : 'Dán văn bản'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Đã chọn</p>
                    <p className="font-black text-emerald-800 text-sm">
                      {selectedCount} <span className="text-[11px] font-semibold">/ {students.length} em</span>
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white text-base shadow-xs shrink-0">
                    👦
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-700 uppercase tracking-wider">Nam</p>
                    <p className="font-black text-blue-800 text-sm">{boyCount} <span className="text-[11px] font-semibold">em</span></p>
                  </div>
                </div>

                <div className="bg-pink-50/60 p-3.5 rounded-2xl border border-pink-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white text-base shadow-xs shrink-0">
                    👧
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-pink-700 uppercase tracking-wider">Nữ</p>
                    <p className="font-black text-pink-800 text-sm">{girlCount} <span className="text-[11px] font-semibold">em</span></p>
                  </div>
                </div>
              </div>

              {/* Import Mode: Append or Replace */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="text-xs font-black text-slate-800 block">
                  Tùy chọn nhập vào Lớp {targetClass?.name || ''} (hiện có {targetClass?.students?.length || 0} học sinh):
                </span>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className={`flex-1 p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                    importOption === 'append'
                      ? 'bg-purple-50/80 border-purple-300 text-purple-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="importOption"
                      checked={importOption === 'append'}
                      onChange={() => setImportOption('append')}
                      className="accent-purple-600"
                    />
                    <div className="text-xs">
                      <span className="font-black block">➕ Thêm tiếp vào lớp</span>
                      <span className="text-[11px] text-slate-500">Giữ nguyên danh sách học sinh hiện có của lớp</span>
                    </div>
                  </label>

                  <label className={`flex-1 p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                    importOption === 'replace'
                      ? 'bg-rose-50/80 border-rose-300 text-rose-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}>
                    <input
                      type="radio"
                      name="importOption"
                      checked={importOption === 'replace'}
                      onChange={() => setImportOption('replace')}
                      className="accent-rose-600"
                    />
                    <div className="text-xs">
                      <span className="font-black text-rose-700 block">🔄 Thay thế toàn bộ danh sách lớp</span>
                      <span className="text-[11px] text-slate-500">Xóa danh sách cũ và tạo mới hoàn toàn</span>
                    </div>
                  </label>
                </div>

                {importOption === 'replace' && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs font-bold text-rose-800">
                    <input
                      type="checkbox"
                      id="confirmReplace"
                      checked={confirmReplaceChecked}
                      onChange={(e) => setConfirmReplaceChecked(e.target.checked)}
                      className="w-4 h-4 accent-rose-600 rounded"
                    />
                    <label htmlFor="confirmReplace" className="cursor-pointer">
                      Tôi xác nhận muốn thay thế danh sách học sinh hiện tại của lớp này
                    </label>
                  </div>
                )}
              </div>

              {/* Collapsible Column & Header Mapping Bar (Only for Excel/CSV) */}
              {rawRows.length > 0 && (
                <div className="border border-purple-100 rounded-2xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setIsMappingExpanded(!isMappingExpanded)}
                    className="w-full p-4 bg-purple-50/40 hover:bg-purple-50/80 transition-colors flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal size={16} className="text-purple-600" />
                      <span className="text-xs font-black text-slate-800">
                        ⚙️ Cấu hình cột & Dòng tiêu đề Excel
                      </span>
                      <span className="text-[11px] text-purple-600 font-semibold hidden sm:inline">
                        (Bấm để sửa nếu nhận diện chưa đúng)
                      </span>
                    </div>
                    <span className="text-xs font-bold text-purple-700">
                      {isMappingExpanded ? 'Thu gọn ▲' : 'Mở rộng ▼'}
                    </span>
                  </button>

                  {isMappingExpanded && (
                    <div className="p-5 border-t border-purple-100 bg-slate-50/30 space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Header Row Selector */}
                        <div>
                          <label className="font-bold text-slate-700 block mb-1.5">
                            Dòng tiêu đề bắt đầu từ:
                          </label>
                          <select
                            value={mapping.headerRowIndex}
                            onChange={(e) => {
                              const newRow = parseInt(e.target.value, 10);
                              const hCells = (rawRows[newRow] || []).map((c: any, i: number) => 
                                String(c || '').trim() || `Cột ${i + 1}`
                              );
                              const newMap = detectColumnMapping(hCells, rawRows, newRow);
                              applyMappingUpdate(newMap);
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-purple-500"
                          >
                            {rawRows.slice(0, Math.min(rawRows.length, 15)).map((r, idx) => {
                              const sampleText = (r || []).slice(0, 4).filter(Boolean).join(' | ');
                              return (
                                <option key={idx} value={idx}>
                                  Dòng {idx + 1}: {sampleText.slice(0, 30)}...
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        {/* Name Mode */}
                        <div>
                          <label className="font-bold text-slate-700 block mb-1.5">
                            Chế độ cột Họ tên:
                          </label>
                          <select
                            value={mapping.nameMode}
                            onChange={(e) => {
                              const mode = e.target.value as 'single' | 'split';
                              applyMappingUpdate({ ...mapping, nameMode: mode });
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-purple-500"
                          >
                            <option value="single">1 cột đầy đủ Họ và tên</option>
                            <option value="split">Ghép 2 cột: Họ đệm + Tên</option>
                          </select>
                        </div>

                        {/* Gender Mode */}
                        <div>
                          <label className="font-bold text-slate-700 block mb-1.5">
                            Chế độ cột Giới tính:
                          </label>
                          <select
                            value={mapping.genderMode}
                            onChange={(e) => {
                              const mode = e.target.value as any;
                              applyMappingUpdate({ ...mapping, genderMode: mode });
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-purple-500"
                          >
                            <option value="gender_col">Cột Giới tính (Nam / Nữ)</option>
                            <option value="female_mark">Cột 'Nữ' đánh dấu (x = Nữ, trống = Nam)</option>
                            <option value="all_male">Tất cả là Nam</option>
                            <option value="all_female">Tất cả là Nữ</option>
                          </select>
                        </div>
                      </div>

                      {/* Column Picker Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
                        {mapping.nameMode === 'single' ? (
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">
                              Chọn Cột Họ và tên:
                            </label>
                            <select
                              value={mapping.fullNameColIndex}
                              onChange={(e) => {
                                applyMappingUpdate({ ...mapping, fullNameColIndex: parseInt(e.target.value, 10) });
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-purple-500"
                            >
                              {currentHeaderCells.map(c => (
                                <option key={c.index} value={c.index}>{c.label}</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="font-bold text-slate-700 block mb-1">
                                Cột Họ và đệm:
                              </label>
                              <select
                                value={mapping.lastNameColIndex}
                                onChange={(e) => {
                                  applyMappingUpdate({ ...mapping, lastNameColIndex: parseInt(e.target.value, 10) });
                                }}
                                className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl font-medium"
                              >
                                {currentHeaderCells.map(c => (
                                  <option key={c.index} value={c.index}>{c.label}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="font-bold text-slate-700 block mb-1">
                                Cột Tên:
                              </label>
                              <select
                                value={mapping.firstNameColIndex}
                                onChange={(e) => {
                                  applyMappingUpdate({ ...mapping, firstNameColIndex: parseInt(e.target.value, 10) });
                                }}
                                className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl font-medium"
                              >
                                {currentHeaderCells.map(c => (
                                  <option key={c.index} value={c.index}>{c.label}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {mapping.genderMode === 'gender_col' && (
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">
                              Chọn Cột Giới tính:
                            </label>
                            <select
                              value={mapping.genderColIndex}
                              onChange={(e) => {
                                applyMappingUpdate({ ...mapping, genderColIndex: parseInt(e.target.value, 10) });
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-purple-500"
                            >
                              {currentHeaderCells.map(c => (
                                <option key={c.index} value={c.index}>{c.label}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {mapping.genderMode === 'female_mark' && (
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">
                              Chọn Cột 'Nữ' (đánh dấu x):
                            </label>
                            <select
                              value={mapping.femaleMarkColIndex}
                              onChange={(e) => {
                                applyMappingUpdate({ ...mapping, femaleMarkColIndex: parseInt(e.target.value, 10) });
                              }}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-purple-500"
                            >
                              {currentHeaderCells.map(c => (
                                <option key={c.index} value={c.index}>{c.label}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Data Preview Table */}
              <div className="border border-purple-100/80 rounded-2xl overflow-hidden shadow-2xs bg-white">
                {/* Search & Filter Toolbar */}
                <div className="p-3.5 bg-slate-50/80 border-b border-purple-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm tên học sinh..."
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setGenderFilter('all')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          genderFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        Tất cả
                      </button>
                      <button
                        type="button"
                        onClick={() => setGenderFilter('Nam')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          genderFilter === 'Nam' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        Nam
                      </button>
                      <button
                        type="button"
                        onClick={() => setGenderFilter('Nữ')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          genderFilter === 'Nữ' ? 'bg-pink-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        Nữ
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => toggleSelectAll(selectedCount < students.length)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      {selectedCount === students.length ? 'Bỏ chọn hết' : 'Chọn tất cả'}
                    </button>
                    <button
                      type="button"
                      onClick={addBlankStudent}
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-black transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <UserPlus size={13} /> Thêm 1 bạn
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-100/95 backdrop-blur-xs z-10">
                      <tr>
                        <th className="px-3 py-2.5 border-b border-purple-100 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={selectedCount === students.length && students.length > 0}
                            onChange={(e) => toggleSelectAll(e.target.checked)}
                            className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                          />
                        </th>
                        <th className="px-3 py-2.5 border-b border-purple-100 text-slate-500 font-black text-xs uppercase tracking-wider w-12 text-center">STT</th>
                        <th className="px-4 py-2.5 border-b border-purple-100 text-slate-500 font-black text-xs uppercase tracking-wider">Họ và tên học sinh (Bấm để sửa)</th>
                        <th className="px-4 py-2.5 border-b border-purple-100 text-slate-500 font-black text-xs uppercase tracking-wider text-center w-28">Giới tính</th>
                        <th className="px-3 py-2.5 border-b border-purple-100 text-slate-500 font-black text-xs uppercase tracking-wider text-right w-16">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-50 text-xs">
                      {displayStudents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400 font-semibold">
                            {students.length === 0
                              ? 'Không tìm thấy dữ liệu học sinh nào. Hãy kiểm tra lại dòng tiêu đề hoặc chọn lại cột.'
                              : 'Không có học sinh nào phù hợp với bộ lọc tìm kiếm.'}
                          </td>
                        </tr>
                      ) : (
                        displayStudents.map((s, idx) => (
                          <tr key={s.id} className={`hover:bg-purple-50/40 transition-colors ${!s.isSelected ? 'opacity-40 bg-slate-50/50' : ''}`}>
                            <td className="px-3 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={s.isSelected}
                                onChange={() => toggleStudentSelection(s.id)}
                                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                              />
                            </td>
                            <td className="px-3 py-2 text-slate-500 font-bold text-center">{idx + 1}</td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={s.name}
                                onChange={(e) => updateStudentName(s.id, e.target.value)}
                                className="w-full px-2.5 py-1 rounded-lg border border-transparent hover:border-purple-200 focus:border-purple-500 focus:bg-white font-black text-slate-800 focus:outline-none transition-all"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => toggleGender(s.id)}
                                title="Bấm để chuyển đổi Nam / Nữ"
                                className={`px-3 py-1 rounded-lg text-xs font-black transition-transform hover:scale-105 active:scale-95 cursor-pointer ${
                                  s.gender === 'Nam'
                                    ? 'bg-blue-100 hover:bg-blue-200 text-blue-700' 
                                    : 'bg-pink-100 hover:bg-pink-200 text-pink-700'
                                }`}
                              >
                                {s.gender === 'Nam' ? '👦 Nam' : '👧 Nữ'}
                              </button>
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button
                                type="button"
                                onClick={() => removeStudent(s.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Xóa học sinh này khỏi danh sách nhập"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-purple-50/30 border-t border-purple-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>
                    💡 Mẹo: Bạn có thể bấm trực tiếp vào tên để sửa lỗi chính tả, hoặc bấm vào nút Giới tính để đổi Nam / Nữ.
                  </span>
                  <span className="font-bold text-purple-700">
                    Tổng: {students.length} học sinh
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-2">
                <button 
                  type="button"
                  onClick={cancelImport}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <X size={15} /> Quay lại chọn tệp khác
                </button>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button 
                    type="button"
                    disabled={selectedCount === 0}
                    onClick={handleConfirmImport}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 via-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-2xl font-black text-xs shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <UserPlus size={16} />
                    <span>
                      {importOption === 'replace' ? 'Thay thế' : 'Nhập'} {selectedCount} học sinh vào lớp {targetClass?.name || ''}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

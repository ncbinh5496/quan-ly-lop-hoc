import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  Search, 
  Sparkles, 
  FolderHeart, 
  Camera, 
  Link as LinkIcon, 
  Pencil, 
  Save,
  RotateCcw,
  User,
  Plus,
  Loader2,
  ListPlus
} from 'lucide-react';
import { useStore } from '../../store';
import { Student } from '../../types';
import { AVATAR_CATEGORIES, PRESET_AVATARS, AvatarPreset } from '../../utils/avatarCatalog';
import { cn, getAvatarUrl, compressImageToBase64 } from '../../utils/helpers';

interface StagedAvatarItem {
  id: string;
  name: string;
  url: string;
  sizeText?: string;
}

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student | null;
  targetClassId?: string;
  onSelectAvatar?: (avatarIdOrUrl: string) => void;
}

export function AvatarModal({
  isOpen,
  onClose,
  student,
  targetClassId,
  onSelectAvatar,
}: AvatarModalProps) {
  const { 
    classes, 
    activeClassId, 
    addCustomAvatar, 
    addMultipleCustomAvatars,
    deleteCustomAvatar, 
    updateCustomAvatar, 
    setStudentAvatar, 
    showToast 
  } = useStore();

  const classId = targetClassId || activeClassId;
  const currentClass = classes.find(c => c.id === classId) || classes[0];
  const customAvatars = currentClass?.customAvatars || [];

  // Selected avatar state
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(student?.avatarId || 'boy-1');
  const [activeTab, setActiveTab] = useState<'class-gallery' | 'presets' | 'upload'>('presets');
  const [presetCategory, setPresetCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Upload Tab State
  const [uploadUrl, setUploadUrl] = useState('');
  const [urlItemName, setUrlItemName] = useState('');
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [avatarName, setAvatarName] = useState('');
  const [saveToClassGallery, setSaveToClassGallery] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<{ current: number; total: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [stagedAvatars, setStagedAvatars] = useState<StagedAvatarItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Edit custom avatar name
  const [editingAvatarId, setEditingAvatarId] = useState<string | null>(null);
  const [editingAvatarName, setEditingAvatarName] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (student) {
        setSelectedAvatarId(student.avatarId || (student.gender === 'Nam' ? 'boy-1' : 'girl-1'));
        if (customAvatars.length > 0 && customAvatars.some(a => a.id === student.avatarId)) {
          setActiveTab('class-gallery');
        } else {
          setActiveTab('presets');
          if (student.gender === 'Nam') setPresetCategory('boys');
          else if (student.gender === 'Nữ') setPresetCategory('girls');
        }
      } else {
        setActiveTab(customAvatars.length > 0 ? 'class-gallery' : 'presets');
      }
      setUploadPreview(null);
      setUploadUrl('');
      setUrlItemName('');
      setAvatarName('');
      setStagedAvatars([]);
      setIsProcessing(false);
      setProcessingProgress(null);
      setIsCameraActive(false);
    } else {
      stopCamera();
    }
  }, [isOpen, student]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 400 }, height: { ideal: 400 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error('Camera error:', err);
      showToast('Không thể mở camera. Vui lòng cấp quyền hoặc tải ảnh từ máy.', 'error');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    const size = Math.min(videoRef.current.videoWidth, videoRef.current.videoHeight) || 300;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crop center square
    const sx = (videoRef.current.videoWidth - size) / 2;
    const sy = (videoRef.current.videoHeight - size) / 2;
    ctx.drawImage(videoRef.current, sx, sy, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setUploadPreview(dataUrl);
    setAvatarName(`Ảnh chụp ${student?.name || 'HS'} ${new Date().toLocaleDateString('vi-VN')}`);
    stopCamera();
  };

  // Helper to process multiple avatar files
  const processAvatarFiles = async (files: FileList | File[]) => {
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      showToast('Vui lòng chọn các file hình ảnh hợp lệ (.png, .jpg, .webp, .gif)', 'error');
      return;
    }

    // If single file and user is editing a single student, also set upload preview
    if (validFiles.length === 1 && !stagedAvatars.length) {
      try {
        setIsProcessing(true);
        const singleFile = validFiles[0];
        const base64 = await compressImageToBase64(singleFile, 180, 180, 0.75);
        setUploadPreview(base64);
        const cleanName = singleFile.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .trim();
        setAvatarName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1) || `Ảnh ${student?.name || 'Học sinh'}`);
      } catch (err) {
        showToast('Lỗi khi xử lý hình ảnh', 'error');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Multiple files: process into staged list
    setIsProcessing(true);
    setProcessingProgress({ current: 0, total: validFiles.length });

    const newStaged: StagedAvatarItem[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      try {
        setProcessingProgress({ current: i + 1, total: validFiles.length });
        const base64 = await compressImageToBase64(file, 180, 180, 0.75);
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .trim();
        const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

        newStaged.push({
          id: `stage-avt-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          name: formattedName || `Avatar ${i + 1}`,
          url: base64,
          sizeText: `${(file.size / 1024).toFixed(0)} KB`,
        });
      } catch (err) {
        console.error('Error compressing image:', file.name, err);
      }
    }

    setStagedAvatars(prev => [...prev, ...newStaged]);
    setIsProcessing(false);
    setProcessingProgress(null);
    showToast(`Đã tải & xử lý ${newStaged.length} ảnh avatar!`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processAvatarFiles(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processAvatarFiles(e.dataTransfer.files);
    }
  };

  // Add single URL to staged or preview
  const handleAddUrl = () => {
    if (!uploadUrl.trim()) return;
    const url = uploadUrl.trim();
    const name = urlItemName.trim() || `Ảnh web ${stagedAvatars.length + 1}`;

    if (!stagedAvatars.length && !uploadPreview) {
      setUploadPreview(url);
      setAvatarName(name);
    } else {
      setStagedAvatars(prev => [
        ...prev,
        {
          id: `stage-url-${Date.now()}`,
          name,
          url,
          sizeText: 'Link URL'
        }
      ]);
      showToast('Đã thêm ảnh vào danh sách chờ lưu!');
    }
    setUploadUrl('');
    setUrlItemName('');
  };

  // Save all staged avatars into class custom avatars
  const handleSaveAllStaged = () => {
    if (!classId) {
      showToast('Chưa chọn lớp học', 'error');
      return;
    }
    if (stagedAvatars.length === 0) return;

    const ids = addMultipleCustomAvatars(
      classId,
      stagedAvatars.map(item => ({ name: item.name, url: item.url }))
    );

    showToast(`Đã lưu thành công ${stagedAvatars.length} ảnh đại diện vào kho của lớp!`);

    // If only 1 item and user was selecting for a student
    if (ids.length > 0 && student && stagedAvatars.length === 1) {
      setStudentAvatar(student.id, ids[0]);
      if (onSelectAvatar) onSelectAvatar(ids[0]);
      onClose();
      return;
    }

    setStagedAvatars([]);
    setActiveTab('class-gallery');
  };

  const handleApplyUpload = () => {
    const finalUrl = uploadPreview || uploadUrl.trim();
    if (!finalUrl) {
      showToast('Vui lòng tải ảnh lên hoặc nhập đường dẫn ảnh', 'error');
      return;
    }

    if (!classId) {
      showToast('Chưa chọn lớp học', 'error');
      return;
    }

    let resultingAvatarId = finalUrl;

    if (saveToClassGallery) {
      resultingAvatarId = addCustomAvatar(classId, {
        name: avatarName.trim() || `Ảnh ${student?.name || 'Học sinh'}`,
        url: finalUrl,
      });
      showToast('Đã lưu ảnh vào kho lưu trữ của lớp!');
    }

    setSelectedAvatarId(resultingAvatarId);

    if (student) {
      setStudentAvatar(student.id, resultingAvatarId);
      showToast(`Đã đổi ảnh đại diện cho ${student.name}`);
    }

    if (onSelectAvatar) {
      onSelectAvatar(resultingAvatarId);
    }

    onClose();
  };

  const handleSelectPresetOrCustom = (id: string) => {
    setSelectedAvatarId(id);
  };

  const handleConfirmSelect = () => {
    if (!selectedAvatarId) return;

    if (student) {
      setStudentAvatar(student.id, selectedAvatarId);
      showToast(`Đã đổi ảnh đại diện cho ${student.name}`);
    }

    if (onSelectAvatar) {
      onSelectAvatar(selectedAvatarId);
    }

    onClose();
  };

  const handleDeleteCustomAvatar = (e: React.MouseEvent, avatarId: string, name: string) => {
    e.stopPropagation();
    if (!classId) return;

    const countUsing = currentClass.students.filter(s => s.avatarId === avatarId).length;
    let confirmMsg = `Bạn có chắc muốn xóa ảnh "${name}" khỏi kho lưu trữ của lớp?`;
    if (countUsing > 0) {
      confirmMsg += `\n(Có ${countUsing} học sinh đang dùng ảnh này, hệ thống sẽ tự chuyển về ảnh mặc định).`;
    }

    if (confirm(confirmMsg)) {
      deleteCustomAvatar(classId, avatarId);
      if (selectedAvatarId === avatarId) {
        setSelectedAvatarId('boy-1');
      }
      showToast(`Đã xóa ảnh "${name}" khỏi kho lớp`);
    }
  };

  const handleSaveRename = (avatarId: string) => {
    if (!classId || !editingAvatarName.trim()) return;
    updateCustomAvatar(classId, avatarId, editingAvatarName.trim());
    setEditingAvatarId(null);
    showToast('Đã đổi tên ảnh đại diện');
  };

  if (!isOpen) return null;

  // Filter preset avatars
  const filteredPresets = PRESET_AVATARS.filter(p => {
    const matchCategory = presetCategory === 'all' || p.category === presetCategory;
    const matchSearch = !searchQuery.trim() || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.emoji.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-scale-in">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-purple-100 p-1 flex items-center justify-center overflow-hidden shrink-0">
              <img 
                src={getAvatarUrl(selectedAvatarId, customAvatars)} 
                alt="Selected" 
                className="w-full h-full rounded-xl object-cover" 
              />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <span>{student ? `Đổi ảnh đại diện: ${student.name}` : `Kho ảnh đại diện: ${currentClass?.name || 'Lớp'}`}</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {student ? `Lớp ${currentClass?.name || ''} • Điểm hiện tại: ${student.points}` : 'Quản lý kho ảnh riêng của từng lớp học'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-full transition-colors text-slate-400 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-3 bg-slate-50 border-b border-slate-200/70 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('class-gallery')}
            className={cn(
              "px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0",
              activeTab === 'class-gallery'
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            )}
          >
            <FolderHeart size={15} />
            <span>Kho ảnh của lớp ({customAvatars.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={cn(
              "px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0",
              activeTab === 'presets'
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            )}
          >
            <Sparkles size={15} />
            <span>Bộ sưu tập có sẵn ({PRESET_AVATARS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={cn(
              "px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shrink-0",
              activeTab === 'upload'
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            )}
          >
            <Upload size={15} />
            <span>Tải ảnh / Chụp ảnh mới</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* TAB 1: KHO ẢNH CỦA LỚP */}
          {activeTab === 'class-gallery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm text-slate-800 flex items-center gap-1.5">
                    <FolderHeart size={16} className="text-purple-600" />
                    <span>Ảnh đã lưu của {currentClass?.name || 'lớp'}</span>
                  </h3>
                  <p className="text-xs text-slate-500">Mỗi lớp có kho ảnh riêng để giáo viên tùy ý lưu trữ và gán cho học sinh</p>
                </div>

                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Plus size={14} /> Thêm ảnh mới
                </button>
              </div>

              {customAvatars.length === 0 ? (
                <div className="py-12 px-4 text-center border-2 border-dashed border-slate-200 rounded-3xl space-y-3 bg-slate-50/50">
                  <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                    🖼️
                  </div>
                  <div className="max-w-xs mx-auto">
                    <p className="font-bold text-sm text-slate-700">Chưa có ảnh tải lên cho {currentClass?.name}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Bạn có thể tải ảnh chụp thật của học sinh, avatar nhân vật yêu thích hoặc chụp trực tiếp từ camera.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors inline-flex items-center gap-1.5"
                  >
                    <Upload size={14} /> Tải ảnh đầu tiên cho lớp
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {customAvatars.map(av => {
                    const isSelected = selectedAvatarId === av.id;
                    const usingCount = currentClass?.students.filter(s => s.avatarId === av.id).length || 0;
                    const isEditing = editingAvatarId === av.id;

                    return (
                      <div
                        key={av.id}
                        onClick={() => handleSelectPresetOrCustom(av.id)}
                        className={cn(
                          "relative rounded-2xl p-2.5 flex flex-col items-center transition-all cursor-pointer group border text-center select-none",
                          isSelected 
                            ? "bg-purple-50 border-purple-500 shadow-md ring-2 ring-purple-400" 
                            : "bg-slate-50/80 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                        )}
                      >
                        {isSelected && (
                          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs shadow-xs z-10">
                            <Check size={12} />
                          </div>
                        )}

                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden mb-2 bg-white shadow-2xs border border-slate-100 flex items-center justify-center">
                          <img 
                            src={av.url} 
                            alt={av.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>

                        {/* Name or Rename Input */}
                        {isEditing ? (
                          <div className="w-full flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editingAvatarName}
                              onChange={(e) => setEditingAvatarName(e.target.value)}
                              className="w-full text-xs font-bold px-1.5 py-0.5 border border-purple-300 rounded bg-white"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(av.id);
                              }}
                            />
                            <button
                              onClick={() => handleSaveRename(av.id)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                              <Save size={12} />
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs font-black text-slate-800 truncate w-full" title={av.name}>
                            {av.name}
                          </p>
                        )}

                        <div className="flex items-center justify-between w-full mt-1.5 pt-1.5 border-t border-slate-200/60 text-[10px]">
                          <span className="text-slate-400 font-medium">{usingCount} HS dùng</span>
                          
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingAvatarId(av.id);
                                setEditingAvatarName(av.name);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white rounded"
                              title="Đổi tên"
                            >
                              <Pencil size={11} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteCustomAvatar(e, av.id, av.name)}
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Xóa ảnh này"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BỘ SƯU TẬP CÓ SẴN */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              {/* Category Filter & Search */}
              <div className="flex flex-col sm:flex-row gap-2.5 justify-between items-stretch sm:items-center">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {AVATAR_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setPresetCategory(cat.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors",
                        presetCategory === cat.id
                          ? "bg-purple-600 text-white shadow-xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm ảnh mẫu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-44 font-medium"
                  />
                </div>
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {filteredPresets.map(preset => {
                  const isSelected = selectedAvatarId === preset.id;

                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPresetOrCustom(preset.id)}
                      className={cn(
                        "relative rounded-2xl p-2.5 flex flex-col items-center justify-center transition-all cursor-pointer border text-center select-none group",
                        isSelected
                          ? "bg-purple-50 border-purple-500 shadow-md ring-2 ring-purple-400 scale-[1.02]"
                          : preset.isFeatured
                          ? "bg-gradient-to-b from-amber-50/50 to-white border-amber-200 hover:border-amber-400 hover:shadow-md hover:scale-[1.02]"
                          : "bg-white border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 hover:scale-[1.02]"
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] shadow-xs z-10">
                          <Check size={10} />
                        </div>
                      )}

                      {preset.isFeatured && !isSelected && (
                        <span className="absolute top-1.5 left-1.5 px-1 py-0.2 bg-amber-400 text-amber-950 font-black text-[8px] rounded-md shadow-2xs z-10">
                          MỚI
                        </span>
                      )}

                      <div 
                        className="w-14 h-14 rounded-2xl overflow-hidden mb-1.5 shadow-xs group-hover:scale-105 transition-transform bg-slate-50 flex items-center justify-center border border-slate-100"
                      >
                        <img 
                          src={getAvatarUrl(preset.id)} 
                          alt={preset.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <p className="text-[11px] font-black text-slate-800 truncate w-full">
                        {preset.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: TẢI ẢNH MỚI / CHỤP CAMERA / TẢI NHIỀU ẢNH */}
          {activeTab === 'upload' && (
            <div className="space-y-5">
              
              {/* Method choice: File / Camera / URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Multi-File Upload Box with Drag and Drop */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group",
                    isDragging
                      ? "border-purple-500 bg-purple-100/80 scale-[1.02] shadow-lg shadow-purple-100"
                      : "border-purple-200 hover:border-purple-400 bg-purple-50/40 hover:bg-purple-50"
                  )}
                >
                  <input 
                    type="file" 
                    multiple
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {isProcessing ? (
                      <Loader2 size={22} className="animate-spin" />
                    ) : (
                      <Upload size={22} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-black text-purple-950">Chọn 1 hoặc nhiều ảnh từ máy</p>
                    <p className="text-xs text-slate-500 mt-0.5">Giữ Ctrl/Shift để chọn nhiều ảnh (.png, .jpg, .webp)</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-white rounded-lg text-purple-600 shadow-2xs border border-purple-100">
                    {isProcessing ? 'Đang đọc & nén ảnh...' : '📁 Bấm để chọn nhiều tệp'}
                  </span>
                </div>

                {/* Camera / URL Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                      <Camera size={14} className="text-orange-500" />
                      <span>Chụp ảnh trực tiếp hoặc nhập link</span>
                    </h4>
                    
                    {!isCameraActive ? (
                      <button
                        onClick={startCamera}
                        className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                      >
                        <Camera size={15} /> Mở Camera chụp ảnh
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-40 flex items-center justify-center">
                          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={capturePhoto}
                            className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Check size={14} /> Chụp hình này
                          </button>
                          <button
                            onClick={stopCamera}
                            className="px-3 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
                          >
                            Đóng
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <label className="text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                      <LinkIcon size={12} /> Hoặc nhập đường dẫn ảnh (URL)
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="url"
                        placeholder="https://..."
                        value={uploadUrl}
                        onChange={(e) => setUploadUrl(e.target.value)}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                      />
                      <button
                        type="button"
                        onClick={handleAddUrl}
                        disabled={!uploadUrl.trim()}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress indicator */}
              {isProcessing && processingProgress && (
                <div className="max-w-md mx-auto p-3 bg-purple-50 rounded-2xl border border-purple-200 space-y-1.5 text-center">
                  <div className="flex justify-between text-xs font-bold text-purple-800">
                    <span>Đang nén & tối ưu ảnh...</span>
                    <span>{processingProgress.current}/{processingProgress.total}</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-purple-600 h-2 transition-all duration-200 rounded-full"
                      style={{ width: `${(processingProgress.current / processingProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* STAGED MULTI-AVATARS LIST */}
              {stagedAvatars.length > 0 && (
                <div className="p-4 bg-purple-50/60 rounded-3xl border-2 border-purple-300 space-y-3.5 animate-slide-up">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-purple-200">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black text-xs">
                        {stagedAvatars.length}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800">
                          Danh sách {stagedAvatars.length} ảnh avatar chuẩn bị thêm
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Bạn có thể sửa tên từng avatar trước khi lưu vào kho lớp
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white text-purple-600 hover:bg-purple-100 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <ListPlus size={13} /> Thêm ảnh
                      </button>
                      <button
                        type="button"
                        onClick={() => setStagedAvatars([])}
                        className="px-3 py-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Xóa hết
                      </button>
                    </div>
                  </div>

                  {/* Grid of staged avatars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-1 custom-scrollbar">
                    {stagedAvatars.map((item, idx) => (
                      <div 
                        key={item.id}
                        className="p-2 bg-white rounded-2xl border border-purple-200 flex items-center gap-2 shadow-2xs"
                      >
                        <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-slate-400 font-bold">#{idx + 1} • {item.sizeText}</div>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const newName = e.target.value;
                              setStagedAvatars(prev => prev.map(a => a.id === item.id ? { ...a, name: newName } : a));
                            }}
                            className="w-full px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-400"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setStagedAvatars(prev => prev.filter(a => a.id !== item.id))}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-purple-200 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveAllStaged}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-md transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save size={14} /> Lưu tất cả ({stagedAvatars.length}) vào kho của lớp
                    </button>
                  </div>
                </div>
              )}

              {/* Single Preview & Save Form (When 1 photo is taken via Camera or uploaded individually) */}
              {uploadPreview && stagedAvatars.length === 0 && (
                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-3xl flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-md border-2 border-purple-300 shrink-0">
                    <img src={uploadPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Đặt tên cho ảnh đại diện này
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Ảnh thẻ Minh Anh, Avatar Doremon..."
                        value={avatarName}
                        onChange={(e) => setAvatarName(e.target.value)}
                        className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-purple-900 select-none">
                      <input
                        type="checkbox"
                        checked={saveToClassGallery}
                        onChange={(e) => setSaveToClassGallery(e.target.checked)}
                        className="rounded text-purple-600 focus:ring-purple-400 w-4 h-4"
                      />
                      <span>Lưu vào kho ảnh của {currentClass?.name} để các bạn khác cũng có thể dùng</span>
                    </label>
                  </div>

                  <button
                    onClick={handleApplyUpload}
                    disabled={isProcessing}
                    className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Check size={16} /> Lưu & Áp dụng
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 p-0.5 flex items-center justify-center overflow-hidden">
              <img 
                src={getAvatarUrl(selectedAvatarId, customAvatars)} 
                alt="Selected" 
                className="w-full h-full rounded-lg object-cover" 
              />
            </div>
            <span className="text-xs font-bold text-slate-600 hidden sm:inline">
              Đang chọn: <strong className="text-purple-700">{selectedAvatarId.startsWith('custom') ? 'Ảnh riêng của lớp' : selectedAvatarId}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition-colors"
            >
              Hủy
            </button>

            <button
              onClick={handleConfirmSelect}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <Check size={16} /> {student ? 'Xác nhận đổi ảnh' : 'Lưu ảnh đang chọn'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

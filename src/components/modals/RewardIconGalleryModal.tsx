import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  Search, 
  Sparkles, 
  FolderHeart, 
  Link as LinkIcon, 
  Pencil, 
  Save,
  Plus,
  Gift,
  ExternalLink,
  Layers,
  Loader2,
  CheckCircle2,
  ListPlus,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../../store';
import { CustomRewardIcon } from '../../types';
import { PRESET_REWARD_ICONS, REWARD_ICON_CATEGORIES } from '../../utils/rewardCatalog';
import { cn, compressImageToBase64, playSound } from '../../utils/helpers';
import { RewardIconRenderer, isImageIcon } from '../ui/RewardIconRenderer';

interface StagedUploadItem {
  id: string;
  name: string;
  url: string;
  sizeText?: string;
}

interface RewardIconGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon?: (iconValue: string, iconName?: string) => void;
  currentSelectedIcon?: string;
}

export function RewardIconGalleryModal({
  isOpen,
  onClose,
  onSelectIcon,
  currentSelectedIcon = '🎁',
}: RewardIconGalleryModalProps) {
  const { 
    customRewardIcons = [], 
    addCustomRewardIcon, 
    addMultipleCustomRewardIcons,
    updateCustomRewardIcon, 
    deleteCustomRewardIcon, 
    showToast,
    soundEnabled 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | 'custom' | 'upload'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Staged & Multi-upload State
  const [stagedItems, setStagedItems] = useState<StagedUploadItem[]>([]);
  const [uploadUrl, setUploadUrl] = useState('');
  const [urlItemName, setUrlItemName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<{ current: number; total: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit custom icon inline in custom gallery tab
  const [editingIconId, setEditingIconId] = useState<string | null>(null);
  const [editingIconName, setEditingIconName] = useState('');

  if (!isOpen) return null;

  // Filter preset icons
  const filteredPresets = PRESET_REWARD_ICONS.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      item.icon.includes(searchQuery.trim());
    return matchesCat && matchesSearch;
  });

  // Filter custom icons
  const filteredCustoms = customRewardIcons.filter(item => {
    const matchesSearch = searchQuery.trim() === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesSearch;
  });

  // Helper to process multiple files
  const processFiles = async (files: FileList | File[]) => {
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      showToast('Vui lòng chọn các file hình ảnh hợp lệ (PNG, JPG, SVG, WebP, GIF)', 'error');
      return;
    }

    setIsProcessing(true);
    setProcessingProgress({ current: 0, total: validFiles.length });

    const newStaged: StagedUploadItem[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      try {
        setProcessingProgress({ current: i + 1, total: validFiles.length });
        const base64 = await compressImageToBase64(file, 120, 120, 0.75);
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .trim();
        
        // Capitalize first letter
        const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

        newStaged.push({
          id: `stage-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          name: formattedName || `Biểu tượng ${i + 1}`,
          url: base64,
          sizeText: `${(file.size / 1024).toFixed(0)} KB`,
        });
      } catch (err) {
        console.error('Error compressing image:', file.name, err);
      }
    }

    setStagedItems(prev => [...prev, ...newStaged]);
    setIsProcessing(false);
    setProcessingProgress(null);

    if (soundEnabled) playSound('pop');
    showToast(`Đã nạp ${newStaged.length} ảnh vào danh sách chờ lưu!`);
  };

  // Handle Multi-file input
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
      // Reset input value so user can pick same file again if desired
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Drag and Drop
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
      await processFiles(e.dataTransfer.files);
    }
  };

  // Add from URL into Staged list
  const handleAddUrlToStaged = () => {
    const trimmed = uploadUrl.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image')) {
      showToast('Đường dẫn ảnh không hợp lệ (cần bắt đầu bằng https:// hoặc data:image)', 'error');
      return;
    }

    const name = urlItemName.trim() || 'Icon từ liên kết mạng';
    const newItem: StagedUploadItem = {
      id: `stage-url-${Date.now()}`,
      name,
      url: trimmed,
      sizeText: 'URL Web',
    };

    setStagedItems(prev => [...prev, newItem]);
    setUploadUrl('');
    setUrlItemName('');
    showToast('Đã thêm icon từ URL vào danh sách chờ!');
    if (soundEnabled) playSound('pop');
  };

  // Save all staged icons
  const handleSaveAllStaged = () => {
    if (stagedItems.length === 0) {
      showToast('Danh sách tải lên đang trống', 'error');
      return;
    }

    const iconsToSave = stagedItems.map(item => ({
      name: item.name.trim() || 'Icon phần thưởng',
      url: item.url,
    }));

    if (iconsToSave.length === 1) {
      const savedId = addCustomRewardIcon(iconsToSave[0]);
      showToast(`Đã lưu icon "${iconsToSave[0].name}" vào kho!`);
      if (onSelectIcon) {
        onSelectIcon(iconsToSave[0].url, iconsToSave[0].name);
        onClose();
        return;
      }
    } else {
      addMultipleCustomRewardIcons(iconsToSave);
      showToast(`Đã lưu thành công ${iconsToSave.length} icon vào kho phần thưởng!`);
    }

    if (soundEnabled) playSound('success');
    setStagedItems([]);
    setActiveTab('custom');
  };

  // Update staged item name
  const handleUpdateStagedName = (id: string, newName: string) => {
    setStagedItems(prev => prev.map(item => item.id === id ? { ...item, name: newName } : item));
  };

  // Remove single staged item
  const handleRemoveStagedItem = (id: string) => {
    setStagedItems(prev => prev.filter(item => item.id !== id));
  };

  // Clear all staged items
  const handleClearAllStaged = () => {
    setStagedItems([]);
  };

  const handleSelect = (iconValue: string, name?: string) => {
    if (soundEnabled) playSound('pop');
    if (onSelectIcon) {
      onSelectIcon(iconValue, name);
      onClose();
    } else {
      showToast(`Đã chọn icon "${name || iconValue}"`);
    }
  };

  const handleStartEdit = (icon: CustomRewardIcon, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingIconId(icon.id);
    setEditingIconName(icon.name);
  };

  const handleSaveEdit = (iconId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editingIconName.trim()) {
      showToast('Tên icon không được để trống', 'error');
      return;
    }
    updateCustomRewardIcon(iconId, editingIconName.trim());
    setEditingIconId(null);
    showToast('Đã đổi tên icon thành công!');
  };

  const handleDeleteCustom = (icon: CustomRewardIcon, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc muốn xóa icon "${icon.name}" khỏi kho không?`)) {
      deleteCustomRewardIcon(icon.id);
      showToast(`Đã xóa icon "${icon.name}"`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col transform transition-all">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner shrink-0">
              🎁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black tracking-tight">
                  Kho Icon & Thư Viện Quà Tặng
                </h3>
                <span className="px-2.5 py-0.5 bg-white/25 rounded-full text-xs font-black text-white">
                  {customRewardIcons.length} ảnh tải lên
                </span>
              </div>
              <p className="text-white/85 text-xs">
                {onSelectIcon 
                  ? 'Bấm chọn một biểu tượng hoặc nạp thêm ảnh mới từ máy tính để gắn vào quà tặng' 
                  : 'Quản lý, tải lên và lưu trữ các biểu tượng quà tặng phong phú'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs & Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="flex p-1 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                "px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer",
                activeTab === 'all'
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <Sparkles size={14} /> Tất cả mẫu ({PRESET_REWARD_ICONS.length + customRewardIcons.length})
            </button>

            <button
              onClick={() => setActiveTab('custom')}
              className={cn(
                "px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer relative",
                activeTab === 'custom'
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <FolderHeart size={14} /> Kho ảnh tải lên ({customRewardIcons.length})
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={cn(
                "px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer",
                activeTab === 'upload'
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <Plus size={14} /> + Nạp icon ngoài
            </button>
          </div>

          {activeTab !== 'upload' && (
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm icon quà tặng..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto min-h-[360px] space-y-5">
          {/* TAB 1: ALL & PRESET ICONS */}
          {activeTab === 'all' && (
            <div className="space-y-5">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {REWARD_ICON_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border shadow-2xs",
                      selectedCategory === cat.id
                        ? "bg-pink-600 text-white border-pink-600"
                        : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Custom Uploaded Row if any */}
              {customRewardIcons.length > 0 && selectedCategory === 'all' && (
                <div className="p-4 bg-gradient-to-r from-pink-50/70 to-rose-50/50 rounded-2xl border border-pink-200/80">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FolderHeart size={16} className="text-pink-600" />
                      <h4 className="text-xs font-black text-pink-900 uppercase tracking-wide">
                        Icon ảnh đã tải lên ({customRewardIcons.length})
                      </h4>
                    </div>
                    <button
                      onClick={() => setActiveTab('custom')}
                      className="text-xs font-bold text-pink-600 hover:text-pink-800"
                    >
                      Xem tất cả & sửa tên →
                    </button>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5">
                    {customRewardIcons.slice(0, 8).map(custom => {
                      const isSelected = currentSelectedIcon === custom.url;
                      return (
                        <button
                          key={custom.id}
                          onClick={() => handleSelect(custom.url, custom.name)}
                          className={cn(
                            "group p-2 bg-white rounded-2xl border transition-all flex flex-col items-center justify-center text-center relative cursor-pointer hover:shadow-md hover:-translate-y-0.5",
                            isSelected 
                              ? "border-pink-500 ring-2 ring-pink-300 bg-pink-50/40" 
                              : "border-slate-200 hover:border-pink-300"
                          )}
                          title={custom.name}
                        >
                          {isSelected && (
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-pink-600 text-white rounded-full flex items-center justify-center shadow-xs">
                              <Check size={11} />
                            </div>
                          )}
                          <div className="w-10 h-10 flex items-center justify-center overflow-hidden mb-1">
                            <RewardIconRenderer icon={custom.url} name={custom.name} className="w-10 h-10" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 truncate w-full">
                            {custom.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Presets Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                  Bộ sưu tập mẫu 3D phong phú ({filteredPresets.length})
                </h4>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {filteredPresets.map(preset => {
                    const isSelected = currentSelectedIcon === preset.icon;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleSelect(preset.icon, preset.name)}
                        className={cn(
                          "group p-3 bg-white rounded-2xl border transition-all flex flex-col items-center justify-center text-center relative cursor-pointer hover:shadow-md hover:-translate-y-0.5",
                          isSelected 
                            ? "border-pink-500 ring-2 ring-pink-300 bg-pink-50/40" 
                            : "border-slate-200 hover:border-pink-300"
                        )}
                        title={preset.name}
                      >
                        {isSelected && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-pink-600 text-white rounded-full flex items-center justify-center shadow-xs">
                            <Check size={11} />
                          </div>
                        )}
                        <span className="text-3xl sm:text-4xl mb-1.5 transform group-hover:scale-115 transition-transform duration-200 drop-shadow-xs">
                          {preset.icon}
                        </span>
                        <span className="text-[10px] font-bold text-slate-700 leading-tight line-clamp-2 w-full">
                          {preset.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM UPLOADED GALLERY */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-800">
                    Kho biểu tượng tải lên của bạn
                  </h4>
                  <p className="text-xs text-slate-500">
                    Bấm vào để chọn cho phần thưởng, hoặc đổi tên và quản lý hình ảnh
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-3.5 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus size={14} /> Nạp thêm ảnh mới
                </button>
              </div>

              {filteredCustoms.length === 0 ? (
                <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <FolderHeart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-700 text-sm mb-1">
                    {searchQuery ? 'Không tìm thấy icon nào' : 'Chưa có biểu tượng ảnh nào được nạp'}
                  </p>
                  <p className="text-slate-400 text-xs mb-4">
                    Tải ảnh từ máy tính hoặc dán link ảnh từ internet vào kho phần thưởng
                  </p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-200 transition-all hover:scale-105"
                  >
                    + Nạp icon ngay
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                  {filteredCustoms.map(custom => {
                    const isSelected = currentSelectedIcon === custom.url;
                    const isEditing = editingIconId === custom.id;

                    return (
                      <div
                        key={custom.id}
                        onClick={() => !isEditing && handleSelect(custom.url, custom.name)}
                        className={cn(
                          "group bg-white rounded-2xl p-3 border transition-all flex flex-col justify-between text-center relative shadow-xs",
                          isSelected 
                            ? "border-pink-500 ring-2 ring-pink-300 bg-pink-50/30" 
                            : "border-slate-200 hover:border-pink-300 hover:shadow-md",
                          !isEditing && "cursor-pointer hover:-translate-y-0.5"
                        )}
                      >
                        {/* Top Action buttons */}
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button
                            onClick={(e) => handleStartEdit(custom, e)}
                            className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 shadow-2xs"
                            title="Đổi tên icon"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteCustom(custom, e)}
                            className="p-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 shadow-2xs"
                            title="Xóa icon"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-pink-600 text-white rounded-full text-[9px] font-black uppercase flex items-center gap-0.5 shadow-xs">
                            <Check size={10} /> Đang chọn
                          </div>
                        )}

                        <div className="w-16 h-16 mx-auto my-2 flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 border border-slate-100 p-1">
                          <RewardIconRenderer icon={custom.url} name={custom.name} className="w-14 h-14" />
                        </div>

                        {/* Name or inline edit */}
                        {isEditing ? (
                          <div className="flex items-center gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editingIconName}
                              onChange={(e) => setEditingIconName(e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-pink-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500"
                              autoFocus
                            />
                            <button
                              onClick={(e) => handleSaveEdit(custom.id, e)}
                              className="p-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingIconId(null);
                              }}
                              className="p-1 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="font-bold text-slate-800 text-xs truncate w-full mt-1">
                            {custom.name}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: UPLOAD / IMPORT MULTIPLE EXTERNAL ICONS */}
          {activeTab === 'upload' && (
            <div className="max-w-2xl mx-auto space-y-5">
              {/* Dropzone with Drag & Drop and Multi-select */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "p-6 rounded-3xl border-2 border-dashed transition-all text-center space-y-3.5",
                  isDragging 
                    ? "border-pink-500 bg-pink-50/80 scale-[1.01] shadow-lg shadow-pink-100" 
                    : "border-pink-200 bg-slate-50/80 hover:border-pink-400 hover:bg-pink-50/30"
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center mx-auto shadow-md shadow-pink-200">
                  {isProcessing ? (
                    <Loader2 size={26} className="animate-spin" />
                  ) : (
                    <Upload size={26} />
                  )}
                </div>

                <div>
                  <h4 className="text-base font-black text-slate-800 mb-1">
                    Tải nhiều ảnh biểu tượng cùng lúc
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Kéo thả nhiều file ảnh vào đây hoặc bấm nút bên dưới. Giữ phím <span className="font-bold text-pink-600 bg-pink-100 px-1.5 py-0.5 rounded">Ctrl</span> hoặc <span className="font-bold text-pink-600 bg-pink-100 px-1.5 py-0.5 rounded">Shift</span> để chọn nhiều ảnh 1 lúc từ máy tính.
                  </p>
                </div>

                {/* Processing Progress */}
                {isProcessing && processingProgress && (
                  <div className="max-w-xs mx-auto space-y-1.5 bg-white p-3 rounded-2xl border border-pink-200 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-pink-700">
                      <span>Đang nén & xử lý ảnh...</span>
                      <span>{processingProgress.current}/{processingProgress.total}</span>
                    </div>
                    <div className="w-full bg-pink-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 transition-all duration-200 rounded-full"
                        style={{ width: `${(processingProgress.current / processingProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-black text-xs shadow-md shadow-pink-200 transition-all hover:scale-105 cursor-pointer inline-flex items-center gap-2"
                  >
                    <ImageIcon size={16} />
                    <span>{isProcessing ? 'Đang đọc ảnh...' : '📁 Chọn nhiều file ảnh từ máy'}</span>
                  </button>
                </div>
              </div>

              {/* Or Add single URL */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <LinkIcon size={14} className="text-pink-500" />
                    <span>Hoặc thêm ảnh từ đường dẫn mạng (Image URL)</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <input
                    type="url"
                    value={uploadUrl}
                    onChange={(e) => setUploadUrl(e.target.value)}
                    placeholder="https://example.com/hinh-anh.png"
                    className="sm:col-span-7 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-400 font-medium"
                  />
                  <input
                    type="text"
                    value={urlItemName}
                    onChange={(e) => setUrlItemName(e.target.value)}
                    placeholder="Tên icon (tùy chọn)"
                    className="sm:col-span-3 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrlToStaged}
                    disabled={!uploadUrl.trim()}
                    className="sm:col-span-2 px-3 py-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus size={14} /> Thêm
                  </button>
                </div>
              </div>

              {/* STAGED ITEMS PREVIEW & BATCH SAVE */}
              {stagedItems.length > 0 && (
                <div className="p-4.5 bg-gradient-to-b from-pink-50/70 to-rose-50/50 rounded-3xl border-2 border-pink-300 shadow-md space-y-4 animate-slide-up">
                  {/* Top Bar of Staging Area */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-pink-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                        {stagedItems.length}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <span>Danh sách ảnh sẵn sàng nạp vào kho</span>
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Bạn có thể chỉnh sửa tên từng biểu tượng bên dưới trước khi lưu
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white text-pink-600 hover:bg-pink-100 border border-pink-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <ListPlus size={13} /> Thêm ảnh khác
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAllStaged}
                        className="px-3 py-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Xóa tất cả ({stagedItems.length})
                      </button>
                    </div>
                  </div>

                  {/* Grid of staged items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-72 overflow-y-auto p-1 custom-scrollbar">
                    {stagedItems.map((item, idx) => (
                      <div 
                        key={item.id}
                        className="p-2.5 bg-white rounded-2xl border border-pink-200 shadow-xs flex items-center gap-2.5 hover:border-pink-400 transition-all group"
                      >
                        {/* Thumbnail */}
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                          <RewardIconRenderer icon={item.url} name={item.name} className="w-10 h-10" />
                        </div>

                        {/* Editable Name Input */}
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                            <span>#{idx + 1} {item.sizeText && `• ${item.sizeText}`}</span>
                          </div>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleUpdateStagedName(item.id, e.target.value)}
                            placeholder="Tên icon..."
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-400"
                          />
                        </div>

                        {/* Remove item */}
                        <button
                          type="button"
                          onClick={() => handleRemoveStagedItem(item.id)}
                          className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Bỏ ảnh này"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Save Action Bar */}
                  <div className="pt-3 border-t border-pink-200 flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-slate-600">
                      Tổng cộng: <strong className="text-pink-700 font-black">{stagedItems.length}</strong> hình ảnh
                    </span>

                    <button
                      type="button"
                      onClick={handleSaveAllStaged}
                      className="px-6 py-3 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:from-pink-700 hover:to-rose-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-pink-200 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
                    >
                      <Save size={16} />
                      <span>
                        {onSelectIcon && stagedItems.length === 1 
                          ? 'Lưu & Chọn quà ngay' 
                          : `Lưu tất cả ${stagedItems.length} ảnh vào kho icon`}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-500" />
            <span>Mẹo: Bạn có thể tải ảnh PNG nền trong suốt để icon hiển thị đẹp nhất trên thẻ quà.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

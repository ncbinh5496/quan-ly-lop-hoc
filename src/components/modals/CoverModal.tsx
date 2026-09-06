import { useShallow } from 'zustand/react/shallow';
import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Upload, Link, Check, Sparkles, RefreshCw, Smile, Palette, Award, Heart } from 'lucide-react';
import { useStore } from '../../store';
import { compressImageToBase64 } from '../../utils/helpers';
import { CHIBI_STUDENT_COVERS, ChibiCoverPreset } from '../../utils/chibiThemes';

interface CoverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PRESET_COVERS = CHIBI_STUDENT_COVERS;

export function CoverModal({ isOpen, onClose }: CoverModalProps) {
  const { headerCoverUrl, setHeaderCoverUrl, showToast } = useStore(useShallow(state => ({ headerCoverUrl: state.headerCoverUrl, setHeaderCoverUrl: state.setHeaderCoverUrl, showToast: state.showToast })));
  const [activeTab, setActiveTab] = useState<'preset' | 'upload' | 'url'>('preset');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'chibi-student' | 'classroom' | 'galaxy-nature'>('chibi-student');
  const [urlInput, setUrlInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState(headerCoverUrl || CHIBI_STUDENT_COVERS[0].url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filteredPresets = CHIBI_STUDENT_COVERS.filter(cov => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'chibi-student') return cov.category === 'chibi-student' || cov.category === 'art-pastel';
    return cov.category === categoryFilter;
  });

  const selectedPresetObj = CHIBI_STUDENT_COVERS.find(c => c.url === previewUrl);

  const handleSelectPreset = (url: string) => {
    setPreviewUrl(url);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Kích thước ảnh tối đa là 5MB', 'error');
      return;
    }

    try {
      const base64 = await compressImageToBase64(file, 1400, 600, 0.75);
      setPreviewUrl(base64);
      showToast('Đã tải ảnh lên và tối ưu hóa thành công!');
    } catch (err) {
      showToast('Lỗi khi đọc file ảnh', 'error');
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      showToast('Vui lòng nhập link ảnh hợp lệ', 'error');
      return;
    }
    setPreviewUrl(urlInput.trim());
    showToast('Đã áp dụng đường dẫn ảnh!');
  };

  const handleSave = () => {
    setHeaderCoverUrl(previewUrl);
    showToast('🎉 Đã cập nhật ảnh bìa header phong cách Facebook thành công!');
    onClose();
  };

  const handleRemoveCover = () => {
    const defaultUrl = CHIBI_STUDENT_COVERS[0].url;
    setPreviewUrl(defaultUrl);
    setHeaderCoverUrl(defaultUrl);
    showToast('Đã khôi phục ảnh bìa mặc định!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 animate-slide-up">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-200">
              <ImageIcon size={20} />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-800 tracking-tight">Đổi Ảnh Bìa Header (Cover Photo)</h3>
              <p className="text-xs text-slate-500">Tùy biến ảnh bìa trang trọng theo phong cách Facebook cá nhân</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="p-6 pb-2">
          <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden shadow-inner border border-slate-200 group bg-slate-900">
            <img
              src={previewUrl}
              alt="Cover Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = CHIBI_STUDENT_COVERS[0].url;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-4 text-white">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-white border border-white/30">
                  Xem trước ảnh bìa
                </span>
                {selectedPresetObj && (
                  <span className="text-xs font-bold text-amber-300 drop-shadow flex items-center gap-1">
                    ✨ {selectedPresetObj.name}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/85 mt-1 line-clamp-1">
                {selectedPresetObj?.description || 'Tùy chỉnh ảnh bìa sắc nét, tươi vui cho lớp học'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-3">
          <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
            <button
              onClick={() => setActiveTab('preset')}
              className={`flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'preset'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles size={14} className="text-amber-500" /> Mẫu có sẵn ({CHIBI_STUDENT_COVERS.length})
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'upload'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload size={14} /> Tải ảnh từ máy
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'url'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Link size={14} /> Dán link Web
            </button>
          </div>
        </div>

        {/* Preset Category Chips */}
        {activeTab === 'preset' && (
          <div className="px-6 pt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setCategoryFilter('chibi-student')}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 shrink-0 ${
                categoryFilter === 'chibi-student'
                  ? 'bg-gradient-to-r from-pink-500 to-amber-500 text-white shadow-sm scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>🧸 Chibi & Học sinh</span>
              <span className="px-1.5 py-0.2 text-[9px] bg-white/30 rounded-full font-extrabold">Hot</span>
            </button>

            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                categoryFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({CHIBI_STUDENT_COVERS.length})
            </button>

            <button
              onClick={() => setCategoryFilter('classroom')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                categoryFilter === 'classroom'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🏫 Lớp học & Tri thức
            </button>

            <button
              onClick={() => setCategoryFilter('galaxy-nature')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                categoryFilter === 'galaxy-nature'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🌌 Vũ trụ & Tự nhiên
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-6 flex-1 overflow-y-auto min-h-[220px]">
          {activeTab === 'preset' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredPresets.map((cov) => {
                const isSelected = previewUrl === cov.url;
                const isChibi = cov.category === 'chibi-student' || cov.category === 'art-pastel';
                return (
                  <button
                    key={cov.id}
                    onClick={() => handleSelectPreset(cov.url)}
                    className={`relative rounded-2xl overflow-hidden border-2 text-left group transition-all h-28 sm:h-32 flex flex-col justify-between p-2.5 ${
                      isSelected
                        ? 'border-pink-500 ring-4 ring-pink-200 shadow-lg scale-[1.02]'
                        : 'border-slate-200 hover:border-pink-300 opacity-90 hover:opacity-100 hover:scale-[1.01]'
                    }`}
                  >
                    <img
                      src={cov.url}
                      alt={cov.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    
                    {/* Top tags */}
                    <div className="relative z-10 flex items-center justify-between w-full">
                      {isChibi ? (
                        <span className="px-2 py-0.5 bg-pink-500/90 text-white font-black text-[9px] rounded-full shadow-xs backdrop-blur-xs flex items-center gap-0.5">
                          <span>✨ Chibi</span>
                        </span>
                      ) : (
                        <span className="text-[9px] text-white/80 bg-black/40 px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                          {cov.tag}
                        </span>
                      )}

                      {isSelected && (
                        <div className="w-5 h-5 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-md">
                          <Check size={12} />
                        </div>
                      )}
                    </div>

                    {/* Bottom title */}
                    <div className="relative z-10">
                      <p className="text-white text-xs font-black leading-tight drop-shadow-md">{cov.name}</p>
                      {cov.description && (
                        <p className="text-[9px] text-amber-200/90 line-clamp-1 mt-0.5 font-medium">{cov.description}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4 text-center py-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-3xl p-8 cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/50 flex flex-col items-center justify-center gap-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl shadow-inner">
                  <Upload size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Bấm vào đây để chọn ảnh từ máy tính / điện thoại</p>
                  <p className="text-slate-400 text-xs mt-0.5">Hỗ trợ JPG, PNG, WEBP, GIF (Dưới 5MB)</p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                >
                  Chọn tệp từ máy tính
                </button>
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-4 py-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nhập link ảnh bìa trên mạng (URL):
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/banner-hinh-anh.jpg"
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleApplyUrl}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shrink-0 shadow-sm"
                >
                  Áp dụng
                </button>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                💡 Mẹo: Bạn có thể sao chép địa chỉ hình ảnh từ bất kỳ trang web nào (Facebook, Unsplash, Google Drive công khai, Canva...) rồi dán vào đây.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={handleRemoveCover}
            className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1"
          >
            <RefreshCw size={12} /> Khôi phục ảnh gốc
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-200 transition-all flex items-center gap-1.5"
            >
              <Check size={15} /> Lưu Ảnh Bìa Này
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


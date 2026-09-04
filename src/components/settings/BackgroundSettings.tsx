import React, { useState, useRef } from 'react';
import { useStore } from '../../store';
import { 
  Palette, Paintbrush, Image as ImageIcon, RotateCcw, Check, 
  Upload, Sliders, Layers 
} from 'lucide-react';
import { PRESET_GRADIENTS, PRESET_WALLPAPERS } from '../../utils/backgroundThemes';
import { compressImageToBase64 } from '../../utils/helpers';

export default function BackgroundSettings() {
  const backgroundConfig = useStore(state => state.backgroundConfig);
  const setBackgroundConfig = useStore(state => state.setBackgroundConfig);
  const showToast = useStore(state => state.showToast);

  const [bgTab, setBgTab] = useState<'preset' | 'custom' | 'wallpaper'>('preset');
  const [customColor1, setCustomColor1] = useState(backgroundConfig?.customColor1 || '#6366f1');
  const [customColor2, setCustomColor2] = useState(backgroundConfig?.customColor2 || '#ec4899');
  const [solidColor, setSolidColor] = useState(backgroundConfig?.solidColor || '#1e1b4b');
  const [gradientAngle, setGradientAngle] = useState(backgroundConfig?.gradientAngle || 135);
  const [customColorMode, setCustomColorMode] = useState<'gradient' | 'solid'>(
    backgroundConfig?.type === 'solid' ? 'solid' : 'gradient'
  );
  const [imageUrlInput, setImageUrlInput] = useState(backgroundConfig?.imageUrl || '');
  const [overlayDarkness, setOverlayDarkness] = useState(backgroundConfig?.overlayOpacity ?? 20);
  const [blurLevel, setBlurLevel] = useState(backgroundConfig?.blur ?? 0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickSolidColors = [
    { name: 'Xanh Navy', color: '#0f172a' },
    { name: 'Tím Than', color: '#1e1b4b' },
    { name: 'Xanh Rừng', color: '#022c22' },
    { name: 'Đỏ Mận', color: '#450a0a' },
    { name: 'Nâu Ấm', color: '#271708' },
    { name: 'Xám Đen', color: '#18181b' },
    { name: 'Xanh Cổ Điển', color: '#172554' },
    { name: 'Tím Sâu', color: '#3b0764' },
  ];

  const handleSelectPreset = (id: string) => {
    setBackgroundConfig({
      type: 'preset-gradient',
      presetGradientId: id,
    });
    showToast('Đã áp dụng màu nền giao diện!');
  };

  const handleApplyCustomColors = () => {
    if (customColorMode === 'gradient') {
      setBackgroundConfig({
        type: 'custom-gradient',
        customColor1,
        customColor2,
        gradientAngle: Number(gradientAngle),
      });
      showToast('Đã áp dụng màu Gradient tự phối!');
    } else {
      setBackgroundConfig({
        type: 'solid',
        solidColor,
      });
      showToast('Đã áp dụng màu nền đơn sắc!');
    }
  };

  const handleSelectWallpaper = (url: string) => {
    setImageUrlInput(url);
    setBackgroundConfig({
      type: 'image',
      imageUrl: url,
      overlayOpacity: overlayDarkness,
      blur: blurLevel,
    });
    showToast('Đã đổi hình nền thành công!');
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn tệp hình ảnh (PNG, JPG, WebP...)', 'error');
      return;
    }

    try {
      // Compress image to reasonable resolution max 1280x1280 to save memory & Firestore bandwidth
      const dataUrl = await compressImageToBase64(file, 1280, 1280, 0.75);
      setImageUrlInput(dataUrl);
      setBackgroundConfig({
        type: 'image',
        imageUrl: dataUrl,
        overlayOpacity: overlayDarkness,
        blur: blurLevel,
      });
      showToast('Đã tải lên và tối ưu hóa ảnh nền thành công!');
    } catch (err) {
      showToast('Không thể xử lý hình ảnh này', 'error');
    }
  };

  const handleApplyCustomImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) {
      showToast('Vui lòng nhập đường dẫn URL ảnh', 'error');
      return;
    }

    setBackgroundConfig({
      type: 'image',
      imageUrl: imageUrlInput.trim(),
      overlayOpacity: overlayDarkness,
      blur: blurLevel,
    });
    showToast('Đã áp dụng hình nền từ đường dẫn URL!');
  };

  const handleUpdateImageOverlay = (opacity: number) => {
    setOverlayDarkness(opacity);
    if (backgroundConfig?.type === 'image') {
      setBackgroundConfig({ overlayOpacity: opacity });
    }
  };

  const handleUpdateImageBlur = (blur: number) => {
    setBlurLevel(blur);
    if (backgroundConfig?.type === 'image') {
      setBackgroundConfig({ blur });
    }
  };

  const handleResetBackground = () => {
    setBackgroundConfig({
      type: 'preset-gradient',
      presetGradientId: 'sunset',
      overlayOpacity: 20,
      blur: 0,
    });
    showToast('Đã khôi phục nền mặc định!');
  };

  return (
    <div className="bg-white/95 rounded-[28px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100/80 flex items-center justify-center text-purple-600 text-xl border border-purple-200">
            🎨
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-800">Màu Sắc & Hình Nền Giao Diện</h3>
            <p className="text-xs text-slate-500">Thay đổi màu gradient, màu đơn sắc hoặc hình nền lớp học tùy thích</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetBackground}
          className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw size={13} /> Về nền mặc định
        </button>
      </div>

      {/* Tab Selection */}
      <div className="flex p-1.5 bg-slate-100/80 rounded-2xl gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setBgTab('preset')}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            bgTab === 'preset'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Palette size={15} /> 🌈 Gradient Mẫu ({PRESET_GRADIENTS.length})
        </button>

        <button
          type="button"
          onClick={() => setBgTab('custom')}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            bgTab === 'custom'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Paintbrush size={15} /> 🎨 Tự Phối Màu
        </button>

        <button
          type="button"
          onClick={() => setBgTab('wallpaper')}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            bgTab === 'wallpaper'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon size={15} /> 🖼️ Hình Nền & Tải Ảnh
        </button>
      </div>

      {/* TAB 1: PRESET GRADIENTS */}
      {bgTab === 'preset' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {PRESET_GRADIENTS.map((preset) => {
              const isSelected = 
                backgroundConfig?.type === 'preset-gradient' &&
                (backgroundConfig.presetGradientId === preset.id || (!backgroundConfig.presetGradientId && preset.id === 'sunset'));

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`relative text-left p-3.5 rounded-2xl border-2 transition-all group overflow-hidden flex items-center gap-3.5 cursor-pointer ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/50 shadow-md ring-2 ring-purple-400/30'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-slate-50'
                  }`}
                >
                  <div 
                    className="w-12 h-12 rounded-xl shadow-inner shrink-0 border border-white/40 flex items-center justify-center text-white"
                    style={{ background: preset.preview }}
                  >
                    {isSelected && <Check size={18} className="drop-shadow" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800 text-sm truncate">{preset.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{preset.description}</p>
                  </div>

                  {isSelected && (
                    <span className="px-2 py-0.5 bg-purple-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                      Đang chọn
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOM COLORS */}
      {bgTab === 'custom' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600">Kiểu phối màu:</span>
            <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setCustomColorMode('gradient')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  customColorMode === 'gradient'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌈 Gradient 2 Màu
              </button>
              <button
                type="button"
                onClick={() => setCustomColorMode('solid')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  customColorMode === 'solid'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⬛ Màu Đơn Sắc
              </button>
            </div>
          </div>

          {customColorMode === 'gradient' ? (
            <div className="space-y-4 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Màu bắt đầu (Màu 1):</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={customColor1}
                      onChange={(e) => setCustomColor1(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 bg-white p-1 shrink-0"
                    />
                    <input 
                      type="text" 
                      value={customColor1}
                      onChange={(e) => setCustomColor1(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono font-bold uppercase bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="#6366F1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Màu kết thúc (Màu 2):</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={customColor2}
                      onChange={(e) => setCustomColor2(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 bg-white p-1 shrink-0"
                    />
                    <input 
                      type="text" 
                      value={customColor2}
                      onChange={(e) => setCustomColor2(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono font-bold uppercase bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="#EC4899"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Góc xoay Gradient ({gradientAngle}°):</label>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="0" 
                    max="360" 
                    step="15"
                    value={gradientAngle}
                    onChange={(e) => setGradientAngle(Number(e.target.value))}
                    className="flex-1 accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex gap-1 shrink-0">
                    {[45, 90, 135, 180].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setGradientAngle(deg)}
                        className={`px-2 py-1 text-[10px] font-bold rounded-lg border cursor-pointer ${
                          gradientAngle === deg 
                            ? 'bg-purple-600 text-white border-purple-600' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div 
                  className="w-full sm:w-48 h-10 rounded-xl border border-white/50 shadow-inner flex items-center justify-center text-white text-xs font-black drop-shadow"
                  style={{ background: `linear-gradient(${gradientAngle}deg, ${customColor1} 0%, ${customColor2} 100%)` }}
                >
                  Xem trước màu
                </div>

                <button
                  type="button"
                  onClick={handleApplyCustomColors}
                  className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md shadow-purple-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Check size={16} /> Áp dụng Gradient này
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Chọn mã màu đơn sắc:</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer border border-slate-200 bg-white p-1 shrink-0"
                  />
                  <input 
                    type="text" 
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs font-mono font-bold uppercase bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="#1E1B4B"
                  />
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-500 mb-2">Màu sắc đề xuất:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {quickSolidColors.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSolidColor(item.color);
                        setBackgroundConfig({ type: 'solid', solidColor: item.color });
                        showToast(`Đã áp dụng màu ${item.name}!`);
                      }}
                      className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                        solidColor.toLowerCase() === item.color.toLowerCase() && backgroundConfig?.type === 'solid'
                          ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-300'
                          : 'border-slate-200 bg-white hover:bg-slate-100'
                      }`}
                    >
                      <div 
                        className="w-5 h-5 rounded-lg shrink-0 border border-white/30" 
                        style={{ backgroundColor: item.color }} 
                      />
                      <span className="text-[11px] font-bold text-slate-700 truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleApplyCustomColors}
                  className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md shadow-purple-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Check size={16} /> Áp dụng màu đơn sắc
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WALLPAPERS & IMAGE UPLOAD */}
      {bgTab === 'wallpaper' && (
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-3">
              Hình nền chủ đề lớp học có sẵn:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {PRESET_WALLPAPERS.map((wp) => {
                const isSelected = 
                  backgroundConfig?.type === 'image' && backgroundConfig.imageUrl === wp.url;

                return (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => handleSelectWallpaper(wp.url)}
                    className={`group relative text-left rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-purple-600 shadow-md ring-2 ring-purple-400/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="h-28 w-full relative overflow-hidden bg-slate-900">
                      <img 
                        src={wp.url} 
                        alt={wp.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 text-white">
                        <p className="font-bold text-xs truncate drop-shadow">{wp.name}</p>
                        <p className="text-[10px] text-white/80 truncate">{wp.description}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow">
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Image Upload */}
          <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Upload size={14} className="text-purple-600" /> Tải ảnh riêng từ máy tính hoặc nhập URL:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageFileUpload}
                  accept="image/*"
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 bg-white hover:bg-purple-50 text-purple-700 border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <Upload size={16} /> Chọn tệp ảnh từ máy tính (PNG, JPG)
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-1">Hỗ trợ tối đa 5MB</p>
              </div>

              <form onSubmit={handleApplyCustomImageUrl} className="flex gap-2">
                <input 
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Dán đường dẫn ảnh (https://...)"
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer"
                >
                  Áp dụng
                </button>
              </form>
            </div>

            {backgroundConfig?.type === 'image' && (
              <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span className="flex items-center gap-1"><Sliders size={13} className="text-purple-600" /> Độ tối nền:</span>
                    <span className="text-purple-600">{overlayDarkness}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="70"
                    step="5"
                    value={overlayDarkness}
                    onChange={(e) => handleUpdateImageOverlay(Number(e.target.value))}
                    className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span className="flex items-center gap-1"><Layers size={13} className="text-purple-600" /> Độ mờ hậu cảnh (Blur):</span>
                    <span className="text-purple-600">{blurLevel}px</span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="8"
                    step="1"
                    value={blurLevel}
                    onChange={(e) => handleUpdateImageBlur(Number(e.target.value))}
                    className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

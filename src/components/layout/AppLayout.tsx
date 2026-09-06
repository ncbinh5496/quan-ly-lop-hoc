import { useState, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomNavigation } from './BottomNavigation';
import { MobileDrawer } from './MobileDrawer';
import { Toast } from '../ui/Toast';
import { StudentEmulationReportModal } from '../modals/StudentEmulationReportModal';
import { TeacherModal } from '../modals/TeacherModal';
import { ClassModal } from '../modals/ClassModal';
import { useStore } from '../../store';
import { PRESET_GRADIENTS } from '../../utils/backgroundThemes';

// Pages
import Dashboard from '../../pages/Dashboard';
import Students from '../../pages/Students';
import Groups from '../../pages/Groups';
import Leaderboard from '../../pages/Leaderboard';
import History from '../../pages/History';
import Rewards from '../../pages/Rewards';
import Reports from '../../pages/Reports';
import Badges from '../../pages/Badges';
import Tools from '../../pages/Tools';
import Settings from '../../pages/Settings';
import ImportData from '../../pages/ImportData';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);

  const backgroundConfig = useStore(state => state.backgroundConfig);
  const studentReportModal = useStore(state => state.studentReportModal);
  const setStudentReportModal = useStore(state => state.setStudentReportModal);

  const backgroundStyle = useMemo(() => {
    if (!backgroundConfig) return { backgroundColor: '#F8F7FB' };

    if (backgroundConfig.type === 'solid') {
      return { backgroundColor: backgroundConfig.solidColor || '#F8F7FB' };
    }

    if (backgroundConfig.type === 'custom-gradient') {
      const angle = backgroundConfig.gradientAngle || 135;
      const c1 = backgroundConfig.customColor1 || '#EDE9FE';
      const c2 = backgroundConfig.customColor2 || '#FCE7F3';
      return { background: `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 100%)` };
    }

    if (backgroundConfig.type === 'image' && backgroundConfig.imageUrl) {
      return {};
    }

    // Default: light pastel or preset
    const preset = PRESET_GRADIENTS.find(p => p.id === (backgroundConfig.presetGradientId || 'soft-pastel')) || PRESET_GRADIENTS[0];
    return { background: preset?.style || 'linear-gradient(135deg, #F8F7FB 0%, #FAF5FF 100%)' };
  }, [backgroundConfig]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigateTab={setActiveTab} />;
      case 'students': return <Students onNavigateTab={setActiveTab} />;
      case 'groups': return <Groups />;
      case 'leaderboard': return <Leaderboard />;
      case 'import': return <ImportData onNavigateTab={setActiveTab} />;
      case 'history': return <History />;
      case 'rewards': return <Rewards />;
      case 'reports': return <Reports />;
      case 'badges': return <Badges />;
      case 'tools': return <Tools />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNavigateTab={setActiveTab} />;
    }
  };

  const isImageBg = backgroundConfig?.type === 'image' && !!backgroundConfig?.imageUrl;
  const overlayOpacity = (backgroundConfig?.overlayOpacity ?? 20) / 100;
  const blurAmount = backgroundConfig?.blur ?? 0;

  return (
    <div 
      className="flex h-screen w-full overflow-hidden font-sans relative bg-[#F8F7FB]" 
      style={!isImageBg ? backgroundStyle : undefined}
    >
      {/* Background Image Layer if selected */}
      {isImageBg && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-300 pointer-events-none"
          style={{ 
            backgroundImage: `url(${backgroundConfig.imageUrl})`,
            filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
            transform: blurAmount > 0 ? 'scale(1.03)' : 'none',
          }}
        />
      )}

      {/* Overlay for readability */}
      {isImageBg && (
        <div 
          className="absolute inset-0 z-0 pointer-events-none transition-colors duration-300"
          style={{ backgroundColor: `rgba(248, 247, 251, ${overlayOpacity})` }}
        />
      )}

      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:flex">
        <Sidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-screen relative z-10 min-w-0 overflow-hidden">
        <Topbar 
          activeTab={activeTab} 
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderContent()}
          </div>
        </main>

        {/* Desktop Footer (hidden on mobile to save space for BottomNavigation) */}
        <footer className="hidden md:flex h-10 bg-white/70 backdrop-blur-md border-t border-purple-100/60 items-center justify-between px-4 sm:px-6 text-slate-500 text-[11px] font-bold shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-purple-600 font-extrabold flex items-center gap-1.5">
              <span>📘 Lớp Học Hạnh Phúc</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="hidden sm:inline">Năm học 2026–2027</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              💾 Dữ liệu lưu trữ nội bộ trên máy tính (Chạy Offline 100%)
            </span>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation (Visible on mobile only) */}
      <BottomNavigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        isMobileDrawerOpen={isMobileDrawerOpen}
      />

      {/* Mobile Slide-over Menu Drawer */}
      <MobileDrawer 
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTeacherModal={() => setShowTeacherModal(true)}
        onOpenClassModal={() => setShowClassModal(true)}
      />
      
      <Toast />
      {studentReportModal && (
        <StudentEmulationReportModal 
          studentId={studentReportModal} 
          onClose={() => setStudentReportModal(null)} 
        />
      )}

      {/* Global Action Modals triggered from Mobile Drawer */}
      <TeacherModal 
        isOpen={showTeacherModal} 
        onClose={() => setShowTeacherModal(false)} 
      />
      <ClassModal 
        isOpen={showClassModal} 
        onClose={() => setShowClassModal(false)} 
      />
    </div>
  );
}

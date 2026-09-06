import React, { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import BrandingSettings from '../components/settings/BrandingSettings';
import BackgroundSettings from '../components/settings/BackgroundSettings';
import TeacherSettings from '../components/settings/TeacherSettings';
import ClassSettings from '../components/settings/ClassSettings';
import ClassAvatarGallerySection from '../components/settings/ClassAvatarGallerySection';
import PointCriteriaSection from '../components/settings/PointCriteriaSection';
import BadgesSettingsSection from '../components/settings/BadgesSettingsSection';
import RewardsSettingsSection from '../components/settings/RewardsSettingsSection';
import ResetProgressSection from '../components/settings/ResetProgressSection';
import DataBackupSection from '../components/settings/DataBackupSection';

import { ClassModal } from '../components/modals/ClassModal';
import { CriteriaModal } from '../components/modals/CriteriaModal';
import { AvatarModal } from '../components/modals/AvatarModal';
import { BadgeModal } from '../components/modals/BadgeModal';
import { RewardModal } from '../components/modals/RewardModal';
import { CoverModal } from '../components/modals/CoverModal';
import { ResetProgressModal } from '../components/modals/ResetProgressModal';

export default function Settings() {
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);

  const [avatarGalleryClassId, setAvatarGalleryClassId] = useState<string | null>(null);

  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [editingBadgeId, setEditingBadgeId] = useState<string | null>(null);

  const [showRewardModal, setShowRewardModal] = useState(false);
  const [editingRewardId, setEditingRewardId] = useState<string | null>(null);

  const [showCoverModal, setShowCoverModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetModalTab, setResetModalTab] = useState<'all' | 'points' | 'badges' | 'rewards' | 'catalog'>('all');

  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [editingCriteriaId, setEditingCriteriaId] = useState<string | null>(null);
  const [criteriaModalType, setCriteriaModalType] = useState<'positive' | 'negative'>('positive');

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex items-center gap-3.5 bg-white/95 p-5 sm:p-6 rounded-[28px] border border-purple-100/80 shadow-[0_8px_30px_rgba(124,58,237,0.05)]">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-purple-500/20">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Cài đặt hệ thống</h2>
          <p className="text-slate-500 text-xs font-semibold">Tùy biến thương hiệu, giáo viên, danh sách lớp học và quản lý dữ liệu</p>
        </div>
      </div>

      {/* 1. Tên Ứng Dụng & Khẩu Hiệu Lớp Học */}
      <BrandingSettings />

      {/* 2. Màu Sắc & Hình Nền Giao Diện */}
      <BackgroundSettings />

      {/* 3. Thông Tin Giáo Viên */}
      <TeacherSettings />

      {/* 4. Quản Lý Lớp Học */}
      <ClassSettings 
        onAddClass={() => {
          setEditingClassId(null);
          setShowClassModal(true);
        }}
        onEditClass={(id) => {
          setEditingClassId(id);
          setShowClassModal(true);
        }}
      />

      {/* 5. Kho Ảnh Đại Diện Theo Từng Lớp */}
      <ClassAvatarGallerySection 
        onOpenAvatarGallery={(classId) => setAvatarGalleryClassId(classId)}
      />

      {/* 6. Quản Lý Tiêu Chí Điểm */}
      <PointCriteriaSection 
        onAddCriteria={(type) => {
          setEditingCriteriaId(null);
          setCriteriaModalType(type);
          setShowCriteriaModal(true);
        }}
        onEditCriteria={(id, type) => {
          setEditingCriteriaId(id);
          setCriteriaModalType(type);
          setShowCriteriaModal(true);
        }}
      />

      {/* 7. Quản Lý Huy Hiệu Danh Dự */}
      <BadgesSettingsSection 
        onAddBadge={() => {
          setEditingBadgeId(null);
          setShowBadgeModal(true);
        }}
        onEditBadge={(id) => {
          setEditingBadgeId(id);
          setShowBadgeModal(true);
        }}
      />

      {/* 8. Quản Lý Kho Phần Thưởng */}
      <RewardsSettingsSection 
        onAddReward={() => {
          setEditingRewardId(null);
          setShowRewardModal(true);
        }}
        onEditReward={(id) => {
          setEditingRewardId(id);
          setShowRewardModal(true);
        }}
      />

      {/* 9. Trung Tâm Reset & Làm Mới Dữ Liệu Thi Đua */}
      <ResetProgressSection 
        onOpenResetModal={(tab) => {
          setResetModalTab(tab);
          setShowResetModal(true);
        }}
      />

      {/* 10. Sao Lưu & Phục Hồi Dữ Liệu */}
      <DataBackupSection />

      {/* Modals */}
      <ClassModal 
        isOpen={showClassModal} 
        onClose={() => {
          setShowClassModal(false);
          setEditingClassId(null);
        }} 
        editingClassId={editingClassId}
      />

      <CriteriaModal
        isOpen={showCriteriaModal}
        onClose={() => {
          setShowCriteriaModal(false);
          setEditingCriteriaId(null);
        }}
        editingCriteriaId={editingCriteriaId}
        defaultType={criteriaModalType}
      />

      <BadgeModal
        isOpen={showBadgeModal}
        onClose={() => {
          setShowBadgeModal(false);
          setEditingBadgeId(null);
        }}
        editingBadgeId={editingBadgeId}
      />

      <RewardModal
        isOpen={showRewardModal}
        onClose={() => {
          setShowRewardModal(false);
          setEditingRewardId(null);
        }}
        editingRewardId={editingRewardId}
      />

      <AvatarModal
        isOpen={Boolean(avatarGalleryClassId)}
        onClose={() => setAvatarGalleryClassId(null)}
        targetClassId={avatarGalleryClassId || undefined}
      />

      <CoverModal
        isOpen={showCoverModal}
        onClose={() => setShowCoverModal(false)}
      />

      <ResetProgressModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        defaultTab={resetModalTab}
      />
    </div>
  );
}

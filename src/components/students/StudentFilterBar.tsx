import React, { memo } from 'react';
import { Search } from 'lucide-react';
import { Group } from '../../types';

interface StudentFilterBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  filterGroup: string;
  onFilterGroupChange: (val: string) => void;
  sortOrder: 'points-desc' | 'points-asc' | 'name-asc';
  onSortOrderChange: (val: 'points-desc' | 'points-asc' | 'name-asc') => void;
  groups: Group[];
}

export const StudentFilterBar = memo(function StudentFilterBar({
  searchTerm,
  onSearchChange,
  filterGroup,
  onFilterGroupChange,
  sortOrder,
  onSortOrderChange,
  groups,
}: StudentFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white/95 rounded-[22px] border border-purple-100/70 shadow-2xs">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Tìm theo tên học sinh..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-xs font-medium text-slate-800 placeholder-slate-400"
        />
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        <select 
          value={filterGroup}
          onChange={(e) => onFilterGroupChange(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-700 text-xs font-bold cursor-pointer"
        >
          <option value="all">Tất cả các tổ</option>
          {groups.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        <select 
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as any)}
          className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-700 text-xs font-bold cursor-pointer"
        >
          <option value="points-desc">Điểm: Cao → Thấp</option>
          <option value="points-asc">Điểm: Thấp → Cao</option>
          <option value="name-asc">Tên: A → Z</option>
        </select>
      </div>
    </div>
  );
});

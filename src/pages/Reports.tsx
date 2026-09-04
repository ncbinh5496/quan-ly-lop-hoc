import React, { useMemo } from 'react';
import { useStore, useActiveClass } from '../store';
import { BarChart2, Download, Printer, Star, TrendingUp, HeartHandshake } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { exportToExcel } from '../utils/excelExporter';
import { getRankedStudents } from '../utils/scoreCalculator';

export default function Reports() {
  const showToast = useStore(state => state.showToast);
  const activeClass = useActiveClass();

  if (!activeClass) {
    return (
      <div className="bg-white/90 rounded-3xl p-12 text-center text-slate-500 border border-purple-100 max-w-lg mx-auto mt-12">
        <h3 className="text-xl font-black text-slate-800 mb-2">Chưa chọn lớp học</h3>
        <p className="text-sm text-slate-500">Vui lòng tạo hoặc chọn một lớp học để xem báo cáo.</p>
      </div>
    );
  }

  const sortedByPoints = useMemo(() => {
    return getRankedStudents(activeClass.students);
  }, [activeClass.students]);
  
  // Analytics
  const { mostPositive, needEncouragement } = useMemo(() => {
    const students = activeClass.students || [];
    if (students.length === 0) return { mostPositive: undefined, needEncouragement: undefined };
    
    let maxPos = students[0];
    let minPts = students[0];

    for (let i = 1; i < students.length; i++) {
      const s = students[i];
      if ((s.totalPositivePoints || 0) > (maxPos.totalPositivePoints || 0)) {
        maxPos = s;
      }
      if (s.points < minPts.points) {
        minPts = s;
      }
    }
    return { mostPositive: maxPos, needEncouragement: minPts };
  }, [activeClass.students]);

  const chartData = useMemo(() => {
    return activeClass.students
      .map(s => ({
        name: s.name.split(' ').pop() || s.name,
        fullName: s.name,
        points: s.points,
      }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);
  }, [activeClass.students]);

  const groupsMap = useMemo(() => {
    const map = new Map<string, string>();
    activeClass.groups.forEach(g => map.set(g.id, g.name));
    return map;
  }, [activeClass.groups]);

  const handleExportExcel = () => {
    try {
      const fileName = `Bao_Cao_Thi_Dua_${activeClass.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      
      exportToExcel(
        activeClass.students,
        [
          { header: 'STT', key: (_, idx) => idx + 1, width: 8 },
          { header: 'Họ và Tên', key: 'name', width: 25 },
          { header: 'Giới tính', key: s => s.gender || 'Khác', width: 12 },
          { 
            header: 'Tổ / Nhóm', 
            key: s => (s.groupId ? groupsMap.get(s.groupId) : undefined) || 'Chưa phân tổ', 
            width: 15 
          },
          { header: 'Tổng Điểm', key: 'points', width: 12 },
          { header: 'Điểm Cộng', key: s => s.totalPositivePoints || 0, width: 12 },
          { header: 'Điểm Trừ', key: s => s.totalNegativePoints || 0, width: 12 },
          { header: 'Số Huy Hiệu', key: s => s.badgeIds?.length || 0, width: 12 },
        ],
        fileName,
        'Báo Cáo Thi Đua'
      );
      showToast('Đã xuất file báo cáo Excel thành công!');
    } catch (e) {
      console.error(e);
      showToast('Không thể xuất file', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/95 p-5 sm:p-6 rounded-[28px] border border-purple-100/80 shadow-[0_8px_30px_rgba(124,58,237,0.05)]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-sm shadow-blue-500/20">
            <BarChart2 size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Báo cáo & Thống kê thi đua</h2>
            <p className="text-slate-500 text-xs font-semibold">
              Tổng quan kết quả rèn luyện và tiến độ thi đua lớp {activeClass.name}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Download size={15} /> <span>Xuất Excel</span>
          </button>
          <button 
            onClick={() => window.print()} 
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-xs transition-colors cursor-pointer"
          >
            <Printer size={15} /> <span>In báo cáo</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Most Positive */}
        <div className="bg-white/95 rounded-[24px] p-5 shadow-[0_8px_24px_rgba(124,58,237,0.04)] border border-purple-100/80 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 text-xl">
            <Star size={24} className="fill-amber-400 text-amber-500" />
          </div>
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Tích cực nhất</div>
            {mostPositive ? (
              <>
                <div className="font-black text-slate-800 text-base leading-tight mt-0.5">{mostPositive.name}</div>
                <div className="text-emerald-600 text-xs font-black mt-1">+{mostPositive.totalPositivePoints} sao tích lũy</div>
              </>
            ) : <div className="text-slate-400 text-xs font-bold mt-1">Chưa có dữ liệu</div>}
          </div>
        </div>

        {/* Current Champion */}
        <div className="bg-white/95 rounded-[24px] p-5 shadow-[0_8px_24px_rgba(124,58,237,0.04)] border border-purple-100/80 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100/80 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0 text-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Quán quân hiện tại</div>
            {sortedByPoints[0] && sortedByPoints[0].points > 0 ? (
              <>
                <div className="font-black text-slate-800 text-base leading-tight mt-0.5">{sortedByPoints[0].name}</div>
                <div className="text-purple-600 text-xs font-black mt-1">{sortedByPoints[0].points} điểm ròng ⭐</div>
              </>
            ) : <div className="text-slate-400 text-xs font-bold mt-1">Chưa có dữ liệu</div>}
          </div>
        </div>

        {/* Need Encouragement */}
        <div className="bg-white/95 rounded-[24px] p-5 shadow-[0_8px_24px_rgba(124,58,237,0.04)] border border-purple-100/80 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100/80 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 text-xl">
            <HeartHandshake size={24} />
          </div>
          <div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Cần khích lệ thêm</div>
            {needEncouragement ? (
              <>
                <div className="font-black text-slate-800 text-base leading-tight mt-0.5">{needEncouragement.name}</div>
                <div className="text-rose-600 text-xs font-bold mt-1">Hãy khích lệ và tặng sao cho em nhé!</div>
              </>
            ) : <div className="text-slate-400 text-xs font-bold mt-1">Chưa có dữ liệu</div>}
          </div>
        </div>
      </div>

      {/* Chart Top 10 */}
      <div className="bg-white/95 rounded-[28px] p-6 shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80">
        <h3 className="font-black text-slate-800 text-base mb-6">Biểu đồ Top 10 học sinh xuất sắc nhất</h3>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
              <Tooltip 
                cursor={{fill: '#f3e8ff', opacity: 0.5}}
                contentStyle={{borderRadius: '1rem', border: '1px solid #e9d5ff', boxShadow: '0 8px 24px rgba(124,58,237,0.12)', fontWeight: 'bold'}}
                labelStyle={{fontWeight: '900', color: '#7c3aed'}}
              />
              <Bar dataKey="points" radius={[10, 10, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.points >= 0 ? '#8b5cf6' : '#f43f5e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

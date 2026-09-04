import { useState, useMemo } from 'react';
import { useStore, useActiveClass } from '../store';
import { History as HistoryIcon, Clock, ArrowRight, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn, getAvatarUrl, formatDate } from '../utils/helpers';

export default function History() {
  const undoLastTransaction = useStore(state => state.undoLastTransaction);
  const [filterType, setFilterType] = useState('all');
  
  const activeClass = useActiveClass();

  if (!activeClass) {
    return (
      <div className="bg-white/90 rounded-3xl p-12 text-center text-slate-500 border border-purple-100 max-w-lg mx-auto mt-12">
        <h3 className="text-xl font-black text-slate-800 mb-2">Chưa chọn lớp học</h3>
        <p className="text-sm text-slate-500">Vui lòng tạo hoặc chọn một lớp học để xem lịch sử điểm.</p>
      </div>
    );
  }

  // Pre-index students for O(1) row lookups
  const studentsMap = useMemo(() => {
    const map = new Map<string, typeof activeClass.students[0]>();
    activeClass.students.forEach(s => map.set(s.id, s));
    return map;
  }, [activeClass.students]);

  const { positiveCount, negativeCount } = useMemo(() => {
    let pos = 0;
    let neg = 0;
    const txs = activeClass.transactions || [];
    for (let i = 0; i < txs.length; i++) {
      if (txs[i].amount > 0) pos++;
      else if (txs[i].amount < 0) neg++;
    }
    return { positiveCount: pos, negativeCount: neg };
  }, [activeClass.transactions]);

  const transactions = useMemo(() => {
    const rawTxs = activeClass.transactions || [];
    let list = [...rawTxs].reverse();
    
    if (filterType === 'positive') {
      list = list.filter(t => t.amount > 0);
    } else if (filterType === 'negative') {
      list = list.filter(t => t.amount < 0);
    }
    return list;
  }, [activeClass.transactions, filterType]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/95 p-5 sm:p-6 rounded-[28px] border border-purple-100/80 shadow-[0_8px_30px_rgba(124,58,237,0.05)]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-sm shadow-purple-500/20">
            <HistoryIcon size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Lịch sử cộng / trừ điểm</h2>
            <p className="text-slate-500 text-xs font-semibold">
              Lớp {activeClass.name} • {positiveCount} lần cộng điểm • {negativeCount} lần nhắc nhở
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-700 text-xs font-bold cursor-pointer"
          >
            <option value="all">Tất cả giao dịch ({activeClass.transactions.length})</option>
            <option value="positive">Chỉ điểm cộng (+{positiveCount})</option>
            <option value="negative">Chỉ điểm trừ (-{negativeCount})</option>
          </select>

          <button
            onClick={undoLastTransaction}
            className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl border border-rose-200 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Hoàn tác điểm vừa ghi nhận"
          >
            <RotateCcw size={14} />
            <span>Hoàn tác</span>
          </button>
        </div>
      </div>

      {/* Main Transactions List */}
      <div className="bg-white/95 rounded-[28px] p-6 shadow-[0_8px_30px_rgba(124,58,237,0.05)] border border-purple-100/80 max-h-[70vh] overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="text-center text-slate-400 py-16">
            <p className="text-4xl mb-2">📜</p>
            <p className="font-bold text-sm text-slate-700">Chưa có giao dịch điểm nào</p>
            <p className="text-xs text-slate-400 mt-1">Khi ghi nhận điểm cho học sinh, toàn bộ nhật ký sẽ hiển thị ở đây.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map(tx => {
              const student = studentsMap.get(tx.studentId);
              if (!student) return null;
              
              const isPositive = tx.amount > 0;

              return (
                <div key={tx.id} className="py-3.5 flex items-center gap-4 hover:bg-purple-50/40 px-3 rounded-2xl transition-colors">
                  <div className={cn(
                    "w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-2xs",
                    isPositive ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-rose-100 text-rose-700 border border-rose-200"
                  )}>
                    {isPositive ? `+${tx.amount}` : tx.amount}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-purple-100">
                        <img src={getAvatarUrl(student.avatarId, activeClass.customAvatars)} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-black text-slate-800 text-sm">{student.name}</span>
                      <ArrowRight size={12} className="text-slate-300" />
                      <span className="text-slate-600 font-bold text-xs">{tx.reason}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mt-0.5">
                      <Clock size={11} />
                      {formatDate(tx.timestamp)}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-black",
                      isPositive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    )}>
                      {isPositive ? 'Tích cực' : 'Nhắc nhở'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

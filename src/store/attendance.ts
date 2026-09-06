import type { AttendanceRecord, ClassData, PointTransaction } from '../types';
export type AttendanceStatus = AttendanceRecord['studentStatuses'][string];
export function applyAttendance(c: ClassData, date: string, input: Record<string,AttendanceStatus>, rewardEnabled: boolean, teacherId: string): ClassData {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Ngày điểm danh không hợp lệ');
  const studentStatuses = Object.fromEntries(c.students.map(s => {
    const value=input[s.id];
    if (!['present','late','excused','unexcused'].includes(value)) throw new Error('Thiếu trạng thái điểm danh học sinh');
    return [s.id,value];
  }));
  const old = c.attendanceRecords?.find(r => r.date === date);
  // Legacy records lack a reliable reward ledger; never guess or re-award them.
  const legacy = !!old && old.rewardAmounts === undefined;
  const rewardAmounts = legacy ? undefined : Object.fromEntries(c.students.map(s => [s.id,
    rewardEnabled ? (studentStatuses[s.id] === 'present' ? 2 : studentStatuses[s.id] === 'late' ? 1 : 0) : 0,
  ]));
  const previous = old?.rewardAmounts || {};
  if (old && JSON.stringify(old.studentStatuses)===JSON.stringify(studentStatuses) && JSON.stringify(previous)===JSON.stringify(rewardAmounts || {}) && (legacy || old.rewardEnabled===rewardEnabled)) return c;
  const timestamp=Date.now(),batchId=crypto.randomUUID();
  const changedRewards = !legacy && c.students.some(s => (previous[s.id]||0)!==(rewardAmounts?.[s.id]||0));
  const grants: PointTransaction[] = changedRewards ? c.students.filter(s => rewardAmounts![s.id]>0).map(s=>({
    id:crypto.randomUUID(),studentId:s.id,classId:c.id,amount:rewardAmounts![s.id],
    reason:studentStatuses[s.id]==='present'?'Chuyên cần - Đi học đúng giờ':'Chuyên cần - Đi học',
    timestamp,teacherId,attendanceDate:date,batchId,
  })) : [];
  const statuses=Object.values(studentStatuses);
  const record: AttendanceRecord = {
    id:old?.id || crypto.randomUUID(),date,timestamp,studentStatuses,
    presentCount:statuses.filter(s=>s==='present').length,lateCount:statuses.filter(s=>s==='late').length,
    absentCount:statuses.filter(s=>s==='excused'||s==='unexcused').length,totalStudents:statuses.length,
    ...(legacy ? {} : { rewardAmounts, rewardEnabled }),
  };
  return {
    ...c, attendanceRecords:[record,...(c.attendanceRecords||[]).filter(r=>r.date!==date)],
    transactions:changedRewards ? [...grants,...c.transactions.filter(t=>t.attendanceDate!==date)] : c.transactions,
    students:changedRewards ? c.students.map(s=>{
      const delta=(rewardAmounts![s.id]||0)-(previous[s.id]||0);
      return delta ? {...s,points:s.points+delta,totalPositivePoints:s.totalPositivePoints+delta} : s;
    }) : c.students,
  };
}
export function undoPoints(c: ClassData): ClassData {
  const last=c.transactions[0];
  if (!last) return c;
  const removed=last.batchId ? c.transactions.filter(t=>t.batchId===last.batchId) : [last];
  const removedIds=new Set(removed.map(t=>t.id));
  return {
    ...c,transactions:c.transactions.filter(t=>!removedIds.has(t.id)),
    students:c.students.map(s=>{
      const tx=removed.filter(t=>t.studentId===s.id);
      if (!tx.length) return s;
      return {...s,points:s.points-tx.reduce((a,t)=>a+t.amount,0),
        totalPositivePoints:s.totalPositivePoints-tx.reduce((a,t)=>a+Math.max(0,t.amount),0),
        totalNegativePoints:s.totalNegativePoints-tx.reduce((a,t)=>a+Math.max(0,-t.amount),0)};
    }),
    attendanceRecords:c.attendanceRecords?.map(r=>{
      const tx=removed.filter(t=>t.attendanceDate===r.date);
      if (!tx.length || !r.rewardAmounts) return r;
      const rewards={...r.rewardAmounts};
      tx.forEach(t=>{rewards[t.studentId]=Math.max(0,(rewards[t.studentId]||0)-t.amount)});
      return {...r,rewardAmounts:rewards,rewardEnabled:false};
    }),
  };
}

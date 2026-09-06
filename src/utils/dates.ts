// All classroom calendar dates use Vietnam time, independent of the device timezone.
const partsFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year:'numeric',month:'2-digit',day:'2-digit' });
export function classroomDate(date: Date | number = new Date()): string {
  const parts = partsFormatter.formatToParts(date);
  return ['year','month','day'].map(type => parts.find(p => p.type === type)!.value).join('-');
}
export function periodStart(period: 'today'|'week'|'month'|'all', now = new Date()): number {
  if (period === 'all') return -Infinity;
  const key = classroomDate(now);
  const day = new Date(key+'T00:00:00+07:00');
  if (period === 'today') return day.getTime();
  if (period === 'month') return new Date(key.slice(0,7)+'-01T00:00:00+07:00').getTime();
  const weekday = new Date(key+'T00:00:00Z').getUTCDay();
  return day.getTime() - ((weekday+6)%7)*86400000;
}

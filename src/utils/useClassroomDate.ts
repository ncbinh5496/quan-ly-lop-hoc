import { useEffect, useState } from 'react';
import { classroomDate } from './dates';
export function useClassroomDate() {
  const [date,setDate] = useState(classroomDate);
  useEffect(() => {
    const refresh=()=>setDate(classroomDate());
    const timer=window.setInterval(refresh,30000);
    window.addEventListener('focus',refresh);
    document.addEventListener('visibilitychange',refresh);
    return ()=>{ clearInterval(timer); window.removeEventListener('focus',refresh); document.removeEventListener('visibilitychange',refresh); };
  },[]);
  return date;
}

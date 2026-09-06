import { lazy, Suspense, useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { useStore } from './store';
const PointModal = lazy(() => import('./components/ui/PointModal').then(m => ({default:m.PointModal})));
const DataBackupSection = lazy(() => import('./components/settings/DataBackupSection'));

function GlobalPointModal() {
  const modal=useStore(s=>s.pointModal);
  const student=useStore(s=>s.classes[0]?.students.find(st=>st.id===s.pointModal?.studentId));
  const close=useStore(s=>s.setPointModal);
  return modal && student ? <Suspense fallback={null}><PointModal student={student} type={modal.type} onClose={()=>close(null)} /></Suspense> : null;
}
function StorageNotice() {
  const error=useStore(s=>s.storageError);
  return error ? <div role="alert" className="fixed bottom-4 left-4 right-4 z-[100] bg-rose-100 text-rose-900 border border-rose-400 p-4 rounded-xl shadow-lg no-print">{error}</div> : null;
}
export default function App() {
  const title=useStore(s=>s.appTitle);
  const blocked=useStore(s=>s.storageBlocked);
  useEffect(()=>{ document.title=`${title || 'Hành Trình Vinh Quang'} - Quản Lý Lớp Học`; },[title]);
  if (blocked) return <div className="max-w-3xl mx-auto p-6 space-y-5">
    <h1 className="text-xl font-bold">Cần phục hồi dữ liệu đã lưu</h1>
    <p>Bản dữ liệu gốc được giữ nguyên. Hãy tải bản sao lưu trước khi phục hồi từ file hợp lệ.</p>
    <Suspense fallback={<p>Đang mở công cụ sao lưu…</p>}><DataBackupSection /></Suspense><StorageNotice />
  </div>;
  return <><AppLayout /><GlobalPointModal /><StorageNotice /></>;
}

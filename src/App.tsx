import { useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { PointModal } from './components/ui/PointModal';
import { useStore } from './store';

export default function App() {
  const { appTitle, pointModal, setPointModal, classes, activeClassId } = useStore();
  const activeClass = classes.find(c => c.id === activeClassId);
  const selectedStudent = activeClass?.students.find(s => s.id === pointModal?.studentId);

  useEffect(() => {
    if (appTitle) {
      document.title = `${appTitle} - Quản Lý Lớp Học`;
    }
  }, [appTitle]);

  return (
    <>
      <AppLayout />
      {pointModal && selectedStudent && (
        <PointModal 
          student={selectedStudent} 
          type={pointModal.type} 
          onClose={() => setPointModal(null)} 
        />
      )}
    </>
  );
}

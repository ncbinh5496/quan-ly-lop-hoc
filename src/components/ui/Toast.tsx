import { useShallow } from 'zustand/react/shallow';
import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useStore } from '../../store';

export function Toast() {
  const { toast, hideToast } = useStore(useShallow(state => ({ toast: state.toast, hideToast: state.hideToast })));

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle2 className="text-green-500" />;
      case 'error': return <XCircle className="text-red-500" />;
      case 'info': return <Info className="text-blue-500" />;
    }
  };

  const getBgClass = () => {
    switch (toast.type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'info': return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg ${getBgClass()}`}>
        {getIcon()}
        <span className="font-medium text-slate-800">{toast.message}</span>
        <button onClick={hideToast} className="p-1 hover:bg-black/5 rounded-full ml-2">
          <X size={16} className="text-slate-500" />
        </button>
      </div>
    </div>
  );
}


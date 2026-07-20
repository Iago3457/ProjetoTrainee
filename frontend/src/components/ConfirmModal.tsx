import { useEffect, useRef } from 'react';
import { XIcon } from '../assets/icons';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

export default function ConfirmModal({
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  isConfirming = false,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ui-dark/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between p-5 border-b border-ui-border">
          <h3 className="font-bold text-xl text-ui-dark leading-tight pr-4">
            {title}
          </h3>
          <button 
            onClick={onCancel}
            className="text-ui-muted hover:text-ui-dark p-1.5 rounded-lg hover:bg-ui-bg transition-colors shrink-0"
            aria-label="Fechar"
            disabled={isConfirming}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <p className="text-ui-medium text-sm">
            {message}
          </p>
        </div>

        <div className="p-5 border-t border-ui-border bg-ui-bg flex items-center justify-end gap-3 mt-auto">
          <button
            onClick={onCancel}
            disabled={isConfirming}
            className="px-4 py-2 bg-white border border-ui-border text-ui-dark font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="px-4 py-2 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
          >
            {isConfirming ? 'Processando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

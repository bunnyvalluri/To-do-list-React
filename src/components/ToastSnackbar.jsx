import React, { useEffect } from 'react';
import { FiInfo, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export function ToastSnackbar({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/90 dark:bg-slate-100/90 backdrop-blur-md text-white dark:text-slate-900 shadow-2xl border border-white/10 dark:border-slate-800 text-xs font-semibold max-w-md"
        >
          <FiInfo className="w-4 h-4 text-indigo-400 dark:text-indigo-600 shrink-0" />
          <span className="flex-1 leading-snug">{toast.text}</span>

          {toast.action && (
            <button
              onClick={() => {
                toast.action.onClick();
                onClose();
              }}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-colors"
            >
              {toast.action.label}
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 dark:hover:bg-slate-800 text-slate-400 hover:text-white dark:hover:text-slate-900 transition-colors"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

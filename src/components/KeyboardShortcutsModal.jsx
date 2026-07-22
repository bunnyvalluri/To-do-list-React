import React from 'react';
import { FiX, FiCommand, FiCornerDownLeft, FiTrash2, FiSlash } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Enter ↵', description: 'Save task / Add new task' },
    { key: 'Ctrl + Enter', description: 'Save task inline edit' },
    { key: 'Escape', description: 'Cancel task inline edit' },
    { key: 'Delete', description: 'Delete selected tasks' },
    { key: 'Shift + Drag', description: 'Drag to reorder tasks' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md glass-card rounded-3xl p-6 border border-indigo-500/30 shadow-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 relative"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
              <FiCommand className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                Keyboard Shortcuts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Speed up your task management flow
              </p>
            </div>
          </div>

          <div className="space-y-2.5 mb-6">
            {shortcuts.map((sc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs"
              >
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {sc.description}
                </span>
                <kbd className="px-2 py-1 rounded-lg bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-mono font-bold border border-slate-200 dark:border-slate-600 shadow-xs">
                  {sc.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-colors"
            >
              Got it!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

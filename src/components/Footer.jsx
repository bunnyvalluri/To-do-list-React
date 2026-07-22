import React from 'react';
import { FiCheckCircle, FiHeart, FiCommand } from 'react-icons/fi';

export function Footer({ totalTasks, completedTasks }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto pt-8 pb-6 border-t border-slate-200/60 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-300 font-medium">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: App Version & Copyright */}
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-800 dark:text-slate-100">
            TaskFlow v1.0.0
          </span>
          <span>•</span>
          <span>© {currentYear} All Rights Reserved</span>
        </div>

        {/* Center: Live Task Stats */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/90 text-[11px] font-bold text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50">
          <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>
            {completedTasks} of {totalTasks} tasks completed
          </span>
        </div>

        {/* Right: Keyboard Shortcut Info */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-400 font-semibold">
          <FiCommand className="w-3.5 h-3.5" />
          <span>Local Storage Enabled</span>
        </div>
      </div>
    </footer>
  );
}

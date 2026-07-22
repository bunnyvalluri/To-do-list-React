import React from 'react';
import {
  FiSearch,
  FiCommand,
  FiCalendar,
  FiPrinter,
  FiDownload,
  FiUpload,
  FiGrid,
  FiCheckSquare,
  FiBarChart2,
  FiClock,
  FiSettings
} from 'react-icons/fi';
import { ThemeToggle } from '../ThemeToggle';
import { printTaskList, exportTasksToJSON } from '../../utils/helpers';
import { motion } from 'framer-motion';

export function Header({
  theme,
  toggleTheme,
  tasks,
  activePage,
  setActivePage,
  onOpenCommandPalette,
  onImportClick
}) {
  const currentHour = new Date().getHours();
  let greeting = 'Good Morning 👋';
  if (currentHour >= 12 && currentHour < 17) greeting = 'Good Afternoon ☀️';
  if (currentHour >= 17) greeting = 'Good Evening 🌙';

  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const mobileNavItems = [
    { id: 'dashboard', label: 'Dash', icon: <FiGrid className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <FiCheckSquare className="w-4 h-4" /> },
    { id: 'calendar', label: 'Cal', icon: <FiCalendar className="w-4 h-4" /> },
    { id: 'analytics', label: 'Stats', icon: <FiBarChart2 className="w-4 h-4" /> },
    { id: 'focus', label: 'Focus', icon: <FiClock className="w-4 h-4" /> },
    { id: 'settings', label: 'Set', icon: <FiSettings className="w-4 h-4" /> }
  ];

  return (
    <header className="w-full glass-card sticky top-3 z-40 rounded-3xl px-4 sm:px-6 py-3.5 shadow-lg border border-white/40 dark:border-slate-800/80 mb-6 transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Time Greeting & Title */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              {greeting}
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              TaskFlow <span className="text-indigo-600 dark:text-indigo-400">Pro</span>
            </h1>
          </div>

          {/* Date Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
            <FiCalendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>{currentDate}</span>
          </div>
        </div>

        {/* Center: Command Palette Trigger Button (Ctrl + K) */}
        <div className="w-full md:w-auto flex-1 max-w-md px-0 md:px-4">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl glass-input text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:border-indigo-500/50 transition-all shadow-xs"
          >
            <div className="flex items-center gap-2">
              <FiSearch className="w-4 h-4 text-indigo-500" />
              <span>Search commands, tasks, or jump to page...</span>
            </div>
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold border border-slate-300 dark:border-slate-700">
              <FiCommand className="w-3 h-3" /> K
            </kbd>
          </button>
        </div>

        {/* Right: Quick Action Controls & Theme Toggle */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => exportTasksToJSON(tasks)}
              className="p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Export Tasks to JSON"
            >
              <FiDownload className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onImportClick}
              className="p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Import Tasks from JSON"
            >
              <FiUpload className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={printTaskList}
              className="p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Print Task List"
            >
              <FiPrinter className="w-4 h-4" />
            </motion.button>
          </div>

          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>

      {/* Mobile Page Navigation Bar */}
      <div className="flex md:hidden items-center justify-between gap-1 mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 overflow-x-auto scrollbar-none">
        {mobileNavItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}

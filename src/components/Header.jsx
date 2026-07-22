import React from 'react';
import { FiCheckSquare, FiCalendar, FiPrinter, FiDownload, FiUpload } from 'react-icons/fi';
import { ThemeToggle } from './ThemeToggle';
import { printTaskList, exportTasksToJSON } from '../utils/helpers';
import { motion } from 'framer-motion';

export function Header({ theme, toggleTheme, tasks, onImportClick }) {
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="w-full glass-card sticky top-3 z-40 rounded-2xl px-4 sm:px-6 py-3.5 shadow-lg border border-white/40 dark:border-slate-800/80 mb-6 transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo & App Name */}
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 12, scale: 1.1 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25"
          >
            <FiCheckSquare className="w-6 h-6 stroke-[2.5]" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Master your day, one task at a time
            </p>
          </div>
        </div>

        {/* Date, Actions & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Current Date */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
            <FiCalendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>{currentDate}</span>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => exportTasksToJSON(tasks)}
              className="p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Export Tasks to JSON"
              aria-label="Export tasks to JSON"
            >
              <FiDownload className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onImportClick}
              className="p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Import Tasks from JSON"
              aria-label="Import tasks from JSON"
            >
              <FiUpload className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={printTaskList}
              className="p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Print Task List"
              aria-label="Print task list"
            >
              <FiPrinter className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { FiDownload, FiUpload, FiTrash2, FiExternalLink, FiUser, FiHardDrive, FiMoon, FiSun } from 'react-icons/fi';
import { exportTasksToJSON } from '../utils/helpers';
import { motion } from 'framer-motion';

export function SettingsPage({
  theme,
  toggleTheme,
  tasks,
  onImportClick,
  onClearCompleted,
  showToast
}) {
  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all LocalStorage tasks? This action cannot be undone.')) {
      localStorage.removeItem('taskflow_tasks');
      window.location.reload();
    }
  };

  return (
    <div className="w-full space-y-6 max-w-3xl mx-auto mb-8">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
          Application Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          Manage your local preferences, backup data, and developer info
        </p>
      </div>

      {/* Theme Settings Section */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/70 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          {theme === 'dark' ? <FiMoon className="w-4 h-4 text-indigo-400" /> : <FiSun className="w-4 h-4 text-amber-500" />}
          <span>Appearance & Theme</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Switch between Light Mode and Dark Mode for optimal eye comfort.
        </p>
        <button
          onClick={toggleTheme}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-500/25 transition-all"
        >
          Toggle Theme (Currently: {theme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'})
        </button>
      </div>

      {/* Data Management Section */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200/70 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <FiHardDrive className="w-4 h-4 text-emerald-500" />
          <span>Data Storage & Backups</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          TaskFlow Pro operates completely client-side in your browser using LocalStorage.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => exportTasksToJSON(tasks)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export Backup (.JSON)</span>
          </button>

          <button
            onClick={onImportClick}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs flex items-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <FiUpload className="w-4 h-4" />
            <span>Import Backup (.JSON)</span>
          </button>

          <button
            onClick={handleClearAllData}
            className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Clear All Local Storage</span>
          </button>
        </div>
      </div>

      {/* Developer & Credits Section */}
      <div className="glass-card p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 space-y-3">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <FiUser className="w-4 h-4 text-indigo-500" />
          <span>Developer Credits</span>
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          TaskFlow Pro was designed & built with ❤️ by <strong className="text-indigo-600 dark:text-indigo-400">VALLURI RAHUL</strong>.
        </p>

        <a
          href="https://valluri-rahul-portfolio.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-500/25 transition-all"
        >
          <span>Visit Portfolio</span>
          <FiExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

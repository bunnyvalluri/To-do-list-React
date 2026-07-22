import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';

export function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3.5 py-2 rounded-full glass-card hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all text-xs font-bold text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
      aria-label={`Toggle theme (Current: ${isDark ? 'Dark Mode' : 'Light Mode'})`}
      title={`Current: ${isDark ? 'Dark Mode' : 'Light Mode'} (Click to switch)`}
    >
      {isDark ? (
        <FiMoon className="w-4 h-4 text-indigo-400" />
      ) : (
        <FiSun className="w-4 h-4 text-amber-500" />
      )}
      <span className="hidden sm:inline font-bold">
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </span>
    </motion.button>
  );
}

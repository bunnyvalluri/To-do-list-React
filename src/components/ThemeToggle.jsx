import React from 'react';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { motion } from 'framer-motion';

export function ThemeToggle({ theme, toggleTheme }) {
  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <FiSun className="w-5 h-5 text-amber-500" />;
      case 'dark':
        return <FiMoon className="w-5 h-5 text-indigo-400" />;
      case 'system':
      default:
        return <FiMonitor className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light': return 'Light Mode';
      case 'dark': return 'Dark Mode';
      default: return 'System Theme';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3.5 py-2 rounded-full glass-card hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label={`Toggle theme (Current: ${getLabel()})`}
      title={`Theme: ${getLabel()} (Click to toggle)`}
    >
      {getIcon()}
      <span className="hidden sm:inline font-medium">{getLabel()}</span>
    </motion.button>
  );
}

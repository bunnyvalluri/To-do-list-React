import React, { useState, useEffect } from 'react';
import {
  FiSearch,
  FiPlus,
  FiGrid,
  FiCheckSquare,
  FiCalendar,
  FiBarChart2,
  FiClock,
  FiSettings,
  FiMoon,
  FiSun,
  FiDownload,
  FiUpload,
  FiTrash2,
  FiCornerDownLeft
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export function CommandPalette({
  isOpen,
  onClose,
  onOpenTaskModal,
  setActivePage,
  toggleTheme,
  theme,
  onExport,
  onImportClick,
  onClearCompleted
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    {
      id: 'create-task',
      label: 'Create New Task',
      category: 'Actions',
      icon: <FiPlus className="w-4 h-4 text-indigo-500" />,
      action: () => { onOpenTaskModal(); onClose(); }
    },
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard Overview',
      category: 'Navigation',
      icon: <FiGrid className="w-4 h-4 text-purple-500" />,
      action: () => { setActivePage('dashboard'); onClose(); }
    },
    {
      id: 'nav-tasks',
      label: 'Go to Tasks Workspace',
      category: 'Navigation',
      icon: <FiCheckSquare className="w-4 h-4 text-emerald-500" />,
      action: () => { setActivePage('tasks'); onClose(); }
    },
    {
      id: 'nav-calendar',
      label: 'Go to Calendar Schedule',
      category: 'Navigation',
      icon: <FiCalendar className="w-4 h-4 text-rose-500" />,
      action: () => { setActivePage('calendar'); onClose(); }
    },
    {
      id: 'nav-analytics',
      label: 'Go to Analytics & Charts',
      category: 'Navigation',
      icon: <FiBarChart2 className="w-4 h-4 text-amber-500" />,
      action: () => { setActivePage('analytics'); onClose(); }
    },
    {
      id: 'nav-focus',
      label: 'Go to Pomodoro Focus Room',
      category: 'Navigation',
      icon: <FiClock className="w-4 h-4 text-cyan-500" />,
      action: () => { setActivePage('focus'); onClose(); }
    },
    {
      id: 'nav-settings',
      label: 'Go to Settings',
      category: 'Navigation',
      icon: <FiSettings className="w-4 h-4 text-slate-500" />,
      action: () => { setActivePage('settings'); onClose(); }
    },
    {
      id: 'toggle-theme',
      label: `Switch to ${theme === 'dark' ? 'Light Mode' : 'Dark Mode'}`,
      category: 'Preferences',
      icon: theme === 'dark' ? <FiSun className="w-4 h-4 text-amber-500" /> : <FiMoon className="w-4 h-4 text-indigo-400" />,
      action: () => { toggleTheme(); onClose(); }
    },
    {
      id: 'export-tasks',
      label: 'Export Tasks to JSON',
      category: 'Data Backup',
      icon: <FiDownload className="w-4 h-4 text-emerald-500" />,
      action: () => { onExport(); onClose(); }
    },
    {
      id: 'import-tasks',
      label: 'Import Tasks from JSON',
      category: 'Data Backup',
      icon: <FiUpload className="w-4 h-4 text-indigo-500" />,
      action: () => { onImportClick(); onClose(); }
    },
    {
      id: 'clear-completed',
      label: 'Clear Completed Tasks',
      category: 'Actions',
      icon: <FiTrash2 className="w-4 h-4 text-rose-500" />,
      action: () => { onClearCompleted(); onClose(); }
    }
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="w-full max-w-xl glass-card rounded-3xl overflow-hidden border border-indigo-500/30 shadow-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
        >
          {/* Command Search Bar */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-200/60 dark:border-slate-800">
            <FiSearch className="w-5 h-5 text-indigo-500 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search action..."
              className="w-full bg-transparent text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
              autoFocus
            />
            <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-mono font-bold">
              ESC
            </kbd>
          </div>

          {/* Commands List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1 scrollbar-none">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                No commands matching "{query}"
              </div>
            ) : (
              filteredCommands.map((cmd, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
                        {cmd.icon}
                      </div>
                      <div className="text-left">
                        <div>{cmd.label}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'}`}>
                          {cmd.category}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex items-center gap-1 text-[10px] font-mono text-white/80">
                        <span>Select</span>
                        <FiCornerDownLeft className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Guide */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            <div className="flex items-center gap-3">
              <span>↑↓ Navigate</span>
              <span>↵ Execute</span>
            </div>
            <span>TaskFlow Command Palette</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

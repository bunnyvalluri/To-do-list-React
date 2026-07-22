import React, { useState } from 'react';
import {
  FiGrid,
  FiCheckSquare,
  FiCalendar,
  FiBarChart2,
  FiClock,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiPlus
} from 'react-icons/fi';
import { motion } from 'framer-motion';

export function Sidebar({ activePage, setActivePage, stats, onOpenTaskModal }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiGrid className="w-5 h-5" /> },
    { id: 'tasks', label: 'Tasks Workspace', icon: <FiCheckSquare className="w-5 h-5" />, badge: stats.pending },
    { id: 'calendar', label: 'Calendar Schedule', icon: <FiCalendar className="w-5 h-5" />, badge: stats.todayTasks },
    { id: 'analytics', label: 'Analytics', icon: <FiBarChart2 className="w-5 h-5" /> },
    { id: 'focus', label: 'Focus Room', icon: <FiClock className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" /> }
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="hidden md:flex flex-col h-screen sticky top-0 z-30 glass-card border-r border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 p-4 shrink-0 overflow-hidden"
    >
      {/* Sidebar Header / Logo */}
      <div className="flex items-center justify-between mb-8 px-1">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 shrink-0">
            <FiCheckSquare className="w-6 h-6 stroke-[2.5]" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h2 className="text-lg font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                TaskFlow
              </h2>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500">
                PRO PLATFORM
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <FiChevronRight className="w-5 h-5" /> : <FiChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Quick Action Button */}
      <div className="mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenTaskModal}
          className={`w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all ${
            isCollapsed ? 'px-0' : 'px-4'
          }`}
        >
          <FiPlus className="w-4 h-4 stroke-[3]" />
          {!isCollapsed && <span>New Task</span>}
        </motion.button>
      </div>

      {/* Navigation Items List */}
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all relative ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3.5 overflow-hidden">
                <span className="shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isCollapsed && item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile / Storage Status */}
      {!isCollapsed && (
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
            VR
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 truncate">
              VALLURI RAHUL
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate">
              Pro Member • LocalStorage
            </p>
          </div>
        </div>
      )}
    </motion.aside>
  );
}

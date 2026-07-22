import React from 'react';
import { FiList, FiColumns, FiCalendar, FiGrid } from 'react-icons/fi';
import { motion } from 'framer-motion';

export function ViewToggle({ activeView, setActiveView }) {
  const views = [
    { id: 'list', label: 'List View', icon: <FiList className="w-4 h-4" /> },
    { id: 'kanban', label: 'Kanban Board', icon: <FiColumns className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar View', icon: <FiCalendar className="w-4 h-4" /> },
    { id: 'grid', label: 'Grid Matrix', icon: <FiGrid className="w-4 h-4" /> }
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-card border border-slate-200/60 dark:border-slate-800 shadow-xs">
      {views.map((v) => {
        const isActive = activeView === v.id;
        return (
          <motion.button
            key={v.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveView(v.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {v.icon}
            <span className="hidden sm:inline">{v.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

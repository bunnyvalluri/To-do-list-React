import React from 'react';
import { motion } from 'framer-motion';

const BASE_FILTERS = [
  { id: 'All', label: 'All' },
  { id: 'Pending', label: 'Pending' },
  { id: 'Completed', label: 'Completed' },
  { id: 'Pinned', label: 'Pinned' },
  { id: 'Favorites', label: 'Favorites' },
  { id: 'High Priority', label: 'High Priority' },
  { id: 'Medium Priority', label: 'Medium Priority' },
  { id: 'Low Priority', label: 'Low Priority' },
  { id: 'Due Today', label: 'Due Today' },
  { id: 'Overdue', label: 'Overdue' }
];

export function FilterTabs({ activeFilter, setActiveFilter, tasks, dynamicCategories = [] }) {
  const getFilterCount = (filterId) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    if (filterId.startsWith('cat:')) {
      const catName = filterId.replace('cat:', '');
      return tasks.filter((t) => t.category === catName).length;
    }

    switch (filterId) {
      case 'All': return tasks.length;
      case 'Completed': return tasks.filter((t) => t.completed).length;
      case 'Pending': return tasks.filter((t) => !t.completed).length;
      case 'Pinned': return tasks.filter((t) => t.pinned).length;
      case 'Favorites': return tasks.filter((t) => t.favorite).length;
      case 'High Priority': return tasks.filter((t) => t.priority === 'High').length;
      case 'Medium Priority': return tasks.filter((t) => t.priority === 'Medium').length;
      case 'Low Priority': return tasks.filter((t) => t.priority === 'Low').length;
      case 'Due Today': return tasks.filter((t) => t.dueDate === todayStr).length;
      case 'Overdue':
        return tasks.filter((t) => {
          if (!t.dueDate || t.completed) return false;
          const due = new Date(t.dueDate);
          due.setHours(23, 59, 59, 999);
          return due < todayStart;
        }).length;
      default: return 0;
    }
  };

  // Build full list of filters including dynamic categories
  const allFilters = [
    ...BASE_FILTERS,
    ...dynamicCategories
      .filter((c) => !['Work', 'Personal', 'Shopping', 'Health', 'Other'].includes(c))
      .map((c) => ({ id: `cat:${c}`, label: `#${c}` }))
  ];

  return (
    <div className="w-full mb-6 overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        {allFilters.map((tab) => {
          const isActive = activeFilter === tab.id;
          const count = getFilterCount(tab.id);

          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveFilter(tab.id)}
              className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'glass-card text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200/50 dark:border-slate-800'
              }`}
              aria-label={`Filter by ${tab.label}`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300/40 dark:border-slate-700/50'
                }`}
              >
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

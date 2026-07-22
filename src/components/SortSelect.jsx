import React from 'react';
import { FiArrowUpRight, FiSliders } from 'react-icons/fi';

const SORT_OPTIONS = [
  'Newest First',
  'Oldest First',
  'Alphabetical A-Z',
  'Alphabetical Z-A',
  'Priority',
  'Due Date',
  'Completed First',
  'Pending First'
];

export function SortSelect({ sortOption, setSortOption }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-card text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 shadow-xs">
        <FiSliders className="w-3.5 h-3.5 text-indigo-500" />
        <span className="hidden sm:inline">Sort by:</span>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="bg-transparent text-slate-800 dark:text-slate-100 font-bold focus:outline-none cursor-pointer pr-1"
          aria-label="Sort tasks by"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="dark:bg-slate-900 dark:text-slate-100 font-medium">
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

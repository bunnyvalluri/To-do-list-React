import React from 'react';
import { FiCheckSquare, FiSquare, FiCheckCircle, FiTrash2, FiX } from 'react-icons/fi';
import { SortSelect } from './SortSelect';
import { ViewToggle } from './ui/ViewToggle';
import { motion, AnimatePresence } from 'framer-motion';

export function BulkActions({
  totalVisibleTasks,
  selectedTaskIds,
  onSelectAll,
  onDeselectAll,
  onBulkComplete,
  onBulkDeleteRequest,
  onClearCompleted,
  sortOption,
  setSortOption,
  activeView,
  setActiveView,
  visibleTaskIds
}) {
  const isAllSelected =
    visibleTaskIds.length > 0 &&
    visibleTaskIds.every((id) => selectedTaskIds.includes(id));
  const hasSelection = selectedTaskIds.length > 0;

  const handleMasterCheckboxChange = () => {
    if (isAllSelected) {
      onDeselectAll();
    } else {
      onSelectAll(visibleTaskIds);
    }
  };

  return (
    <div className="w-full glass-card p-3 sm:p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
      {/* Master Select All Checkbox */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-extrabold text-slate-800 dark:text-slate-100 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleMasterCheckboxChange}
            disabled={visibleTaskIds.length === 0}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
          />
          <span>
            {hasSelection
              ? `${selectedTaskIds.length} of ${totalVisibleTasks} Selected`
              : `Select All (${totalVisibleTasks})`}
          </span>
        </label>
      </div>

      {/* View Toggle + Bulk Action Controls */}
      <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
        {/* View Switcher (List, Kanban, Grid) */}
        {activeView && setActiveView && (
          <ViewToggle activeView={activeView} setActiveView={setActiveView} />
        )}

        <AnimatePresence>
          {hasSelection && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2"
            >
              <button
                onClick={onBulkComplete}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                title="Mark selected tasks complete"
              >
                <FiCheckCircle className="w-3.5 h-3.5" />
                <span>Complete Selected</span>
              </button>

              <button
                onClick={onBulkDeleteRequest}
                className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                title="Delete selected tasks"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
              </button>

              <button
                onClick={onDeselectAll}
                className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                title="Deselect All"
              >
                <FiX className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clear Completed Tasks Button */}
        {!hasSelection && (
          <button
            onClick={onClearCompleted}
            className="px-3 py-1.5 rounded-xl glass-card hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold border border-slate-200/50 dark:border-slate-800 transition-colors"
          >
            Clear Completed
          </button>
        )}

        {/* Sort Select */}
        <SortSelect sortOption={sortOption} setSortOption={setSortOption} />
      </div>
    </div>
  );
}

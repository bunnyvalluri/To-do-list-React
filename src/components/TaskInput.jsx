import React, { useState } from 'react';
import { FiPlus, FiX, FiTag, FiAlertCircle, FiFlag, FiCalendar } from 'react-icons/fi';
import { validateTaskInput } from '../utils/validation';
import { motion, AnimatePresence } from 'framer-motion';

const PRIORITIES = ['Low', 'Medium', 'High'];

export function TaskInput({ onAddTask, existingTasks, categories = [] }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [warningMsg, setWarningMsg] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (errorMsg) setErrorMsg(null);
    if (warningMsg) setWarningMsg(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const validation = validateTaskInput(title, existingTasks);

    if (!validation.isValid) {
      setErrorMsg(validation.error);
      return;
    }

    if (validation.warning) {
      setWarningMsg(validation.warning);
    }

    const finalCategory = isCustomCategory ? customCategory.trim() || 'Personal' : category;

    onAddTask({
      title: validation.sanitized,
      priority,
      category: finalCategory,
      dueDate: dueDate || null
    });

    setTitle('');
    setDueDate('');
    setCustomCategory('');
    setIsCustomCategory(false);
    setErrorMsg(null);
    setWarningMsg(null);
  };

  const handleClear = () => {
    setTitle('');
    setDueDate('');
    setCustomCategory('');
    setErrorMsg(null);
    setWarningMsg(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  const allCategoryList = Array.from(new Set(['Personal', 'Work', 'Shopping', 'Health', 'Other', ...categories]));

  return (
    <div className="w-full mb-6">
      <form
        onSubmit={handleFormSubmit}
        className="glass-card p-4 sm:p-5 rounded-3xl border border-indigo-500/20 shadow-xl relative transition-all"
      >
        {/* Main Input Line */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsExpanded(true)}
              maxLength={200}
              placeholder="What would you like to accomplish today?"
              className="w-full px-4 py-3.5 rounded-2xl glass-input text-base font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pr-16"
              aria-label="New task input"
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 select-none">
              {title.length}/200
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end">
            {title && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClear}
                className="px-3 py-3 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
                title="Clear Input"
              >
                <FiX className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </motion.button>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <FiPlus className="w-5 h-5 stroke-[3]" />
              <span>Add Task</span>
            </motion.button>
          </div>
        </div>

        {/* Dynamic Options Bar */}
        <AnimatePresence>
          {(isExpanded || title.length > 0) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pt-4 mt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="flex flex-wrap items-center gap-3">
                {/* Priority Selector */}
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <FiFlag className="w-3.5 h-3.5 ml-1.5 text-slate-400" />
                  {PRIORITIES.map((p) => {
                    const isSelected = priority === p;
                    let activeBg = 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs';
                    if (p === 'High') activeBg = isSelected ? 'bg-rose-500 text-white shadow-xs' : '';
                    if (p === 'Medium') activeBg = isSelected ? 'bg-amber-500 text-white shadow-xs' : '';
                    if (p === 'Low') activeBg = isSelected ? 'bg-emerald-500 text-white shadow-xs' : '';

                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                          isSelected ? activeBg : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Category Selector */}
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <FiTag className="w-3.5 h-3.5 text-slate-400" />
                  {isCustomCategory ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="New category..."
                        className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold focus:outline-none w-24"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setIsCustomCategory(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <select
                      value={category}
                      onChange={(e) => {
                        if (e.target.value === '__NEW__') {
                          setIsCustomCategory(true);
                        } else {
                          setCategory(e.target.value);
                        }
                      }}
                      className="bg-transparent text-slate-700 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
                    >
                      {allCategoryList.map((c) => (
                        <option key={c} value={c} className="dark:bg-slate-900 dark:text-slate-100">
                          {c}
                        </option>
                      ))}
                      <option value="__NEW__" className="dark:bg-slate-900 text-indigo-500 font-bold">
                        + Add Custom Category...
                      </option>
                    </select>
                  )}
                </div>

                {/* Due Date Input */}
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 px-2.5 py-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                    className="bg-transparent text-slate-700 dark:text-slate-200 font-semibold focus:outline-none text-xs cursor-pointer"
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]">Enter ↵</kbd> to quickly save
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Validation Errors & Warnings */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-semibold flex items-center gap-2"
            >
              <FiAlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
          {warningMsg && !errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-300 text-xs font-semibold flex items-center gap-2"
            >
              <FiAlertCircle className="w-4 h-4 shrink-0" />
              <span>{warningMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}

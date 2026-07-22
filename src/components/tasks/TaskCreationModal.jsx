import React, { useState } from 'react';
import { FiX, FiPlus, FiClock, FiCalendar, FiTag, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const COLOR_LABELS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'];

export function TaskCreationModal({ isOpen, onClose, onAddTask, categories = [] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Personal');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCat, setIsCustomCat] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [colorLabel, setColorLabel] = useState('#6366f1');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCategory = isCustomCat ? (customCategory.trim() || 'Personal') : category;

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      category: finalCategory,
      dueDate: dueDate || null,
      estimatedTime: Number(estimatedTime) || 15,
      colorLabel
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    setCustomCategory('');
    setIsCustomCat(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg glass-card rounded-3xl p-6 border border-indigo-500/30 shadow-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 relative my-8"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-1">
            Create New Task
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6">
            Add task details to your TaskFlow Pro workspace
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                Task Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to get done?"
                maxLength={200}
                required
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add extra context, notes, or details..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            {/* Priority & Category Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold focus:outline-none border border-slate-200 dark:border-slate-700"
                >
                  <option value="High">🔴 High Priority</option>
                  <option value="Medium">🟡 Medium Priority</option>
                  <option value="Low">🟢 Low Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category Tag
                </label>
                {isCustomCat ? (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom category..."
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs font-bold focus:outline-none"
                  />
                ) : (
                  <select
                    value={category}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') setIsCustomCat(true);
                      else setCategory(e.target.value);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold focus:outline-none border border-slate-200 dark:border-slate-700"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        #{cat}
                      </option>
                    ))}
                    <option value="__custom__">+ Add Custom Category...</option>
                  </select>
                )}
              </div>
            </div>

            {/* Due Date & Estimated Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold focus:outline-none border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                  Est. Time (Mins)
                </label>
                <input
                  type="number"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  min={5}
                  max={480}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold focus:outline-none border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Color Label Selector */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-1.5">
                Color Label Tag
              </label>
              <div className="flex items-center gap-2">
                {COLOR_LABELS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setColorLabel(col)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      colorLabel === col ? 'scale-125 ring-2 ring-offset-2 ring-indigo-500' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-md shadow-indigo-500/25 flex items-center gap-1.5"
              >
                <FiPlus className="w-4 h-4 stroke-[3]" />
                <span>Create Task</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

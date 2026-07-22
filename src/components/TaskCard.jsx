import React, { useState, useRef, useEffect } from 'react';
import {
  FiCheck,
  FiEdit2,
  FiTrash2,
  FiCopy,
  FiCornerDownRight,
  FiStar,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiX,
  FiSave
} from 'react-icons/fi';
import { BsPinAngle } from 'react-icons/bs';
import { formatDate, getDueDateInfo, copyToClipboard } from '../utils/helpers';

import { motion, AnimatePresence } from 'framer-motion';

export function TaskCard({
  task,
  searchQuery,
  isSelected,
  onToggleSelect,
  onToggleComplete,
  onEditTask,
  onDeleteRequest,
  onDuplicate,
  onTogglePin,
  onToggleFavorite,
  onShowToast
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editCategory, setEditCategory] = useState(task.category);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Highlight search text helper
  const renderHighlightedTitle = (text, query) => {
    if (!query || !query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={index}
              className="bg-amber-300 dark:bg-amber-500/60 text-slate-900 dark:text-white px-0.5 rounded font-semibold"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const handleSaveEdit = () => {
    const trimmed = editTitle.trim();
    if (!trimmed) return;
    onEditTask(task.id, {
      title: trimmed,
      category: editCategory,
      priority: editPriority,
      dueDate: editDueDate || null
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || (e.ctrlKey && e.key === 'Enter')) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(task.title);
    if (success && onShowToast) {
      onShowToast('Task title copied to clipboard!');
    }
  };

  const dueInfo = getDueDateInfo(task.dueDate);

  // Badge priority styling
  const priorityStyles = {
    High: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    Medium: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    Low: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`group relative glass-card p-4 sm:p-5 rounded-3xl border transition-all duration-200 shadow-sm ${
        task.completed
          ? 'bg-slate-50/60 dark:bg-slate-900/40 opacity-80 border-slate-200/50 dark:border-slate-800/60'
          : isSelected
          ? 'ring-2 ring-indigo-500 border-indigo-500/50 bg-indigo-50/30 dark:bg-indigo-950/20'
          : task.pinned
          ? 'border-indigo-400/50 dark:border-indigo-600/50 shadow-md'
          : 'border-slate-200/80 dark:border-slate-800'
      }`}
    >
      {/* Pinned Ribbon Badge */}
      {task.pinned && (
        <div className="absolute -top-2.5 right-6 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-[10px] font-extrabold text-white shadow-xs flex items-center gap-1">
          <BsPinAngle className="w-3 h-3" />
          <span>PINNED</span>
        </div>
      )}

      <div className="flex items-start gap-3 sm:gap-4">
        {/* Multi-Select Checkbox */}
        <div className="pt-1 flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(task.id)}
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            aria-label={`Select task: ${task.title}`}
          />
        </div>

        {/* Completion Check Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleComplete(task.id)}
          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
              : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-400'
          }`}
          aria-label={task.completed ? 'Mark task pending' : 'Mark task completed'}
        >
          {task.completed && <FiCheck className="w-4 h-4 stroke-[3]" />}
        </motion.button>

        {/* Main Content / Inline Edit */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            /* Inline Edit Mode */
            <div className="space-y-3">
              <input
                ref={inputRef}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={200}
                className="w-full px-3 py-2 rounded-xl glass-input text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Priority Selector */}
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold focus:outline-none border border-slate-300 dark:border-slate-700"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>

                {/* Category Input */}
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  placeholder="Category"
                  className="px-2 py-1 rounded-lg glass-input text-slate-700 dark:text-slate-200 font-semibold focus:outline-none border border-slate-300 dark:border-slate-700 w-28"
                />

                {/* Due Date */}
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="px-2 py-1 rounded-lg glass-input text-slate-700 dark:text-slate-200 font-semibold focus:outline-none border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center gap-1"
                >
                  <FiX className="w-3.5 h-3.5" />
                  <span>Cancel (Esc)</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  <FiSave className="w-3.5 h-3.5" />
                  <span>Save (Enter)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Normal Display Mode */
            <div>
              {/* Task Title */}
              <h3
                onClick={() => onToggleComplete(task.id)}
                className={`text-sm sm:text-base font-semibold leading-snug cursor-pointer transition-all ${
                  task.completed
                    ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
                    : 'text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                {renderHighlightedTitle(task.title, searchQuery)}
              </h3>

              {/* Task Metadata Badges & Timestamps */}
              <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs">
                {/* Category Badge */}
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border border-slate-200/60 dark:border-slate-700/60">
                  #{task.category}
                </span>

                {/* Priority Badge */}
                <span
                  className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${
                    priorityStyles[task.priority] || priorityStyles.Medium
                  }`}
                >
                  {task.priority}
                </span>

                {/* Due Date Badge */}
                {dueInfo.formatted && (
                  <span
                    className={`px-2 py-0.5 rounded-md font-semibold text-[11px] flex items-center gap-1 border ${
                      dueInfo.isOverdue && !task.completed
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 animate-pulse'
                        : dueInfo.isDueToday && !task.completed
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/50'
                    }`}
                  >
                    {dueInfo.isOverdue && !task.completed ? (
                      <FiAlertTriangle className="w-3 h-3 text-rose-500" />
                    ) : (
                      <FiCalendar className="w-3 h-3" />
                    )}
                    <span>
                      {dueInfo.isOverdue && !task.completed ? 'Overdue: ' : 'Due: '}
                      {dueInfo.formatted}
                    </span>
                  </span>
                )}

                {/* Creation Timestamp */}
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1 ml-auto">
                  <FiClock className="w-3 h-3" />
                  <span>{formatDate(task.createdAt)}</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Card Action Buttons Bar */}
        {!isEditing && (
          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Pin Toggle */}
            <button
              onClick={() => onTogglePin(task.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                task.pinned
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950'
                  : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={task.pinned ? 'Unpin Task' : 'Pin Task to Top'}
              aria-label={task.pinned ? 'Unpin task' : 'Pin task'}
            >
              <BsPinAngle className="w-4 h-4" />
            </button>

            {/* Favorite Toggle */}
            <button
              onClick={() => onToggleFavorite(task.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                task.favorite
                  ? 'text-amber-500 fill-amber-500'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={task.favorite ? 'Remove Favorite' : 'Mark Favorite'}
              aria-label={task.favorite ? 'Unfavorite task' : 'Favorite task'}
            >
              <FiStar className="w-4 h-4" />
            </button>

            {/* Edit */}
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Task"
              aria-label="Edit task"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>

            {/* Duplicate */}
            <button
              onClick={() => onDuplicate(task.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Duplicate Task"
              aria-label="Duplicate task"
            >
              <FiCornerDownRight className="w-4 h-4" />
            </button>

            {/* Copy Clipboard */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Copy to Clipboard"
              aria-label="Copy task title to clipboard"
            >
              <FiCopy className="w-4 h-4" />
            </button>

            {/* Delete */}
            <button
              onClick={() => onDeleteRequest(task.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
              title="Delete Task"
              aria-label="Delete task"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

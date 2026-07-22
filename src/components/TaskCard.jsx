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
  FiAlertTriangle,
  FiX,
  FiSave,
  FiPlus,
  FiList
} from 'react-icons/fi';
import { BsPinAngle, BsGripVertical } from 'react-icons/bs';
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
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onMoveTask,
  onShowToast
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
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

  const renderHighlightedTitle = (text, query) => {
    if (!query || !query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={index}
              className="bg-amber-300 dark:bg-amber-500/60 text-slate-900 dark:text-white px-0.5 rounded font-bold"
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

  const handleAddSubtaskSubmit = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    onAddSubtask(task.id, newSubtaskTitle);
    setNewSubtaskTitle('');
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(task.title);
    if (success && onShowToast) {
      onShowToast('Task copied to clipboard!');
    }
  };

  const dueInfo = getDueDateInfo(task.dueDate);

  const priorityStyles = {
    High: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    Medium: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    Low: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
  };

  const subtasks = task.subtasks || [];
  const completedSubsCount = subtasks.filter(s => s.completed).length;

  const renderActionButtons = () => (
    <>
      <button
        onClick={() => onTogglePin(task.id)}
        className={`p-1.5 rounded-lg transition-colors ${
          task.pinned
            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950'
            : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
        title={task.pinned ? 'Unpin Task' : 'Pin Task to Top'}
      >
        <BsPinAngle className="w-4 h-4" />
      </button>

      <button
        onClick={() => onToggleFavorite(task.id)}
        className={`p-1.5 rounded-lg transition-colors ${
          task.favorite
            ? 'text-amber-500 fill-amber-500'
            : 'text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
        title={task.favorite ? 'Remove Favorite' : 'Mark Favorite'}
      >
        <FiStar className="w-4 h-4" />
      </button>

      <button
        onClick={() => setIsEditing(true)}
        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        title="Edit Task"
      >
        <FiEdit2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => onDuplicate(task.id)}
        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        title="Duplicate Task"
      >
        <FiCornerDownRight className="w-4 h-4" />
      </button>

      <button
        onClick={handleCopy}
        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        title="Copy to Clipboard"
      >
        <FiCopy className="w-4 h-4" />
      </button>

      <button
        onClick={() => onDeleteRequest(task.id)}
        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
        title="Delete Task"
      >
        <FiTrash2 className="w-4 h-4" />
      </button>
    </>
  );

  return (
    <motion.div
      layout
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }}
      onDrop={(e) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        if (draggedId && onMoveTask) {
          onMoveTask(draggedId, task.id);
        }
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`group relative glass-card p-4 sm:p-5 rounded-3xl border transition-all duration-200 shadow-xs ${
        task.completed
          ? 'bg-emerald-500/5 dark:bg-emerald-950/15 border-emerald-500/20 dark:border-emerald-900/30'
          : isSelected
          ? 'ring-2 ring-indigo-500 border-indigo-500/50 bg-indigo-50/40 dark:bg-indigo-950/30'
          : task.pinned
          ? 'border-indigo-400/60 dark:border-indigo-600/60 shadow-md'
          : 'border-slate-200/80 dark:border-slate-800'
      }`}
    >
      {/* Drag Grip handle */}
      <div className="absolute left-1.5 top-5 opacity-0 group-hover:opacity-60 cursor-grab active:cursor-grabbing text-slate-400 hover:text-indigo-500 transition-opacity">
        <BsGripVertical className="w-5 h-5" />
      </div>

      {/* Pinned Ribbon Badge */}
      {task.pinned && (
        <div className="absolute -top-2.5 right-6 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-[10px] font-extrabold text-white shadow-xs flex items-center gap-1">
          <BsPinAngle className="w-3 h-3" />
          <span>PINNED</span>
        </div>
      )}

      <div className="flex flex-col gap-3 pl-2">
        {/* Top Header Row: Checkbox + Checkmark + Title + Desktop Action Bar */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Multi-Select Checkbox */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(task.id)}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0 mt-1"
              aria-label={`Select task: ${task.title}`}
            />

            {/* Completion Check Button */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onToggleComplete(task.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                task.completed
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/30'
                  : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-400'
              }`}
              aria-label={task.completed ? 'Mark task pending' : 'Mark task completed'}
            >
              {task.completed && <FiCheck className="w-4 h-4 stroke-[3]" />}
            </motion.button>

            {/* Task Title */}
            {!isEditing && (
              <h3
                onClick={() => onToggleComplete(task.id)}
                className={`text-sm sm:text-base font-semibold leading-snug cursor-pointer transition-colors break-words ${
                  task.completed
                    ? 'line-through text-slate-500 dark:text-slate-400 font-medium'
                    : 'text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                {renderHighlightedTitle(task.title, searchQuery)}
              </h3>
            )}
          </div>

          {/* Desktop Floating Action Toolbar (Top right on desktop) */}
          {!isEditing && (
            <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-xs shrink-0 items-start">
              {renderActionButtons()}
            </div>
          )}
        </div>

        {/* Mobile Action Buttons Toolbar (Dedicated clean line below title on mobile) */}
        {!isEditing && (
          <div className="flex sm:hidden items-center gap-1 bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 w-fit pl-1 ml-9">
            {renderActionButtons()}
          </div>
        )}

        {/* Inline Edit Form */}
        {isEditing && (
          <div className="space-y-3 pl-9">
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
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold focus:outline-none border border-slate-300 dark:border-slate-700"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>

              <input
                type="text"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                placeholder="Category"
                className="px-2.5 py-1.5 rounded-lg glass-input text-slate-800 dark:text-slate-100 font-semibold focus:outline-none border border-slate-300 dark:border-slate-700 w-28"
              />

              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg glass-input text-slate-800 dark:text-slate-100 font-semibold focus:outline-none border border-slate-300 dark:border-slate-700"
              />
            </div>

            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center gap-1"
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
        )}

        {/* Bottom Badges Row */}
        {!isEditing && (
          <div className="flex flex-wrap items-center gap-2 pl-9 text-xs">
            {/* Category Badge */}
            <span className="whitespace-nowrap px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 font-bold border border-slate-200/60 dark:border-slate-700/60">
              #{task.category}
            </span>

            {/* Priority Badge */}
            <span
              className={`whitespace-nowrap px-2 py-0.5 rounded-md font-extrabold text-[11px] border ${
                priorityStyles[task.priority] || priorityStyles.Medium
              }`}
            >
              {task.priority}
            </span>

            {/* Subtask Pill */}
            <button
              type="button"
              onClick={() => setShowSubtasks(!showSubtasks)}
              className={`whitespace-nowrap px-2 py-0.5 rounded-md font-bold text-[11px] flex items-center gap-1 border transition-colors ${
                subtasks.length > 0
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <FiList className="w-3 h-3" />
              <span>
                {subtasks.length > 0 ? `${completedSubsCount}/${subtasks.length} Subtasks` : '+ Subtasks'}
              </span>
            </button>

            {/* Due Date Badge */}
            {dueInfo.formatted && (
              <span
                className={`whitespace-nowrap px-2 py-0.5 rounded-md font-semibold text-[11px] flex items-center gap-1 border ${
                  dueInfo.isOverdue && !task.completed
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 animate-pulse font-bold'
                    : dueInfo.isDueToday && !task.completed
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/50 dark:border-slate-700/50'
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
            <span className="whitespace-nowrap text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1 ml-auto">
              <FiClock className="w-3 h-3" />
              <span>{formatDate(task.createdAt)}</span>
            </span>
          </div>
        )}

        {/* Expandable Dynamic Subtasks Container */}
        <AnimatePresence>
          {showSubtasks && !isEditing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs space-y-2 pl-9"
            >
              {subtasks.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between gap-2 pl-2">
                  <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => onToggleSubtask(task.id, sub.id)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span
                      className={`truncate ${
                        sub.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-700 dark:text-slate-200 font-medium'
                      }`}
                    >
                      {sub.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => onDeleteSubtask(task.id, sub.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ))}

              <form onSubmit={handleAddSubtaskSubmit} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="Add a step / subtask..."
                  className="flex-1 px-3 py-1.5 rounded-lg glass-input text-xs focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-500 flex items-center gap-1"
                >
                  <FiPlus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

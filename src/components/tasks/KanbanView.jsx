import React from 'react';
import { TaskCard } from '../TaskCard';
import { FiClock, FiZap, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export function KanbanView({
  tasks,
  searchQuery,
  selectedTaskIds,
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
  onUpdateTaskStatus,
  onShowToast
}) {
  const columns = [
    { id: 'pending', label: 'Pending Tasks', icon: <FiClock className="w-4 h-4 text-amber-500" />, color: 'border-amber-500/30' },
    { id: 'in_progress', label: 'In Progress', icon: <FiZap className="w-4 h-4 text-indigo-500" />, color: 'border-indigo-500/30' },
    { id: 'completed', label: 'Completed', icon: <FiCheckCircle className="w-4 h-4 text-emerald-500" />, color: 'border-emerald-500/30' }
  ];

  const getColumnTasks = (statusId) => {
    return tasks.filter((t) => {
      if (statusId === 'completed') return t.completed || t.status === 'completed';
      if (statusId === 'in_progress') return !t.completed && t.status === 'in_progress';
      return !t.completed && (t.status === 'pending' || !t.status);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnColumn = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && onUpdateTaskStatus) {
      onUpdateTaskStatus(taskId, targetStatus);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {columns.map((col) => {
        const colTasks = getColumnTasks(col.id);

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropOnColumn(e, col.id)}
            className={`glass-card p-4 rounded-3xl border ${col.color} bg-slate-100/40 dark:bg-slate-900/40 min-h-[450px] flex flex-col`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {col.icon}
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                  {col.label}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                {colTasks.length}
              </span>
            </div>

            {/* Column Tasks Container */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-none">
              {colTasks.length === 0 ? (
                <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                  Drag tasks here
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    searchQuery={searchQuery}
                    isSelected={selectedTaskIds.includes(task.id)}
                    onToggleSelect={onToggleSelect}
                    onToggleComplete={onToggleComplete}
                    onEditTask={onEditTask}
                    onDeleteRequest={onDeleteRequest}
                    onDuplicate={onDuplicate}
                    onTogglePin={onTogglePin}
                    onToggleFavorite={onToggleFavorite}
                    onAddSubtask={onAddSubtask}
                    onToggleSubtask={onToggleSubtask}
                    onDeleteSubtask={onDeleteSubtask}
                    onMoveTask={onMoveTask}
                    onShowToast={onShowToast}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

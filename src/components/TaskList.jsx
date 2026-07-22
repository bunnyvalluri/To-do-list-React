import React from 'react';
import { TaskCard } from './TaskCard';
import { EmptyState } from './EmptyState';
import { AnimatePresence } from 'framer-motion';

export function TaskList({
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
  onShowToast,
  onCreateFirstTask
}) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        searchQuery={searchQuery}
        onCreateFirstTask={onCreateFirstTask}
      />
    );
  }

  return (
    <div className="w-full space-y-3 mb-8">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
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
        ))}
      </AnimatePresence>
    </div>
  );
}

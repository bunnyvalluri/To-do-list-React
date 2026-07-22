import React from 'react';
import { HeroDashboard } from '../components/dashboard/HeroDashboard';
import { Statistics } from '../components/Statistics';
import { PomodoroWidget } from '../components/dashboard/PomodoroWidget';
import { TaskList } from '../components/TaskList';
import { FiCheckSquare, FiArrowRight } from 'react-icons/fi';

export function DashboardPage({
  stats,
  tasks,
  onOpenTaskModal,
  setActivePage,
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
  const topPriorityTasks = tasks.filter(t => !t.completed).slice(0, 5);

  return (
    <div className="w-full space-y-6">
      {/* Hero SaaS Overview Banner */}
      <HeroDashboard stats={stats} onOpenTaskModal={onOpenTaskModal} />

      {/* Statistics Dashboard Widgets */}
      <Statistics stats={stats} />

      {/* Pomodoro Focus & Quick Priority Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Priority Tasks List */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiCheckSquare className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Priority Action Items
              </h3>
            </div>
            <button
              onClick={() => setActivePage('tasks')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All Tasks Workspace</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <TaskList
            tasks={topPriorityTasks}
            searchQuery=""
            selectedTaskIds={[]}
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
            onCreateFirstTask={onCreateFirstTask}
          />
        </div>

        {/* Right Column: Compact Focus Timer Widget */}
        <div>
          <PomodoroWidget />
        </div>
      </div>
    </div>
  );
}

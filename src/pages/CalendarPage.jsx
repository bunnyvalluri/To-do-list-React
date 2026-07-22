import React from 'react';
import { CalendarView } from '../components/tasks/CalendarView';

export function CalendarPage({ tasks, toggleComplete }) {
  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
          Calendar Schedule
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          Monthly timeline view of task due dates and deliverables
        </p>
      </div>

      <CalendarView tasks={tasks} onToggleComplete={toggleComplete} />
    </div>
  );
}

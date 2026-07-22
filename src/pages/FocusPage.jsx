import React from 'react';
import { PomodoroWidget } from '../components/dashboard/PomodoroWidget';

export function FocusPage() {
  return (
    <div className="w-full space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
          Focus Room
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          Eliminate distractions with the Pomodoro technique
        </p>
      </div>

      <PomodoroWidget />
    </div>
  );
}

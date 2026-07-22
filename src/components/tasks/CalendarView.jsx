import React, { useState } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths
} from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';

export function CalendarView({ tasks, onToggleComplete }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="w-full glass-card p-6 rounded-3xl border border-slate-200/70 dark:border-slate-800 mb-8">
      {/* Calendar Month Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FiCalendar className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl glass-card hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs hover:bg-indigo-500 transition-colors"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl glass-card hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-extrabold text-slate-400 uppercase tracking-wider">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>

      {/* Days Matrix */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const dayTasks = tasks.filter((t) => t.dueDate === dayStr);
          const isSelectedMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={idx}
              className={`min-h-[90px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                isToday
                  ? 'bg-indigo-500/10 border-indigo-500/50 shadow-xs'
                  : isSelectedMonth
                  ? 'glass-card border-slate-200/60 dark:border-slate-800'
                  : 'opacity-40 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-extrabold px-1.5 py-0.5 rounded-md ${
                    isToday ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {format(day, 'd')}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                    {dayTasks.length}
                  </span>
                )}
              </div>

              {/* Day Tasks Pills */}
              <div className="space-y-1 mt-1 overflow-y-auto max-h-14 scrollbar-none">
                {dayTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onToggleComplete(t.id)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate cursor-pointer transition-opacity ${
                      t.completed
                        ? 'line-through bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                        : 'bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-200'
                    }`}
                    title={t.title}
                  >
                    {t.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

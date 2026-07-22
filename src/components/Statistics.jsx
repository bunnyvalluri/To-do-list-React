import React from 'react';
import { FiCheckCircle, FiClock, FiLayers, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import { BsPinAngle } from 'react-icons/bs';
import { motion } from 'framer-motion';

export function Statistics({ stats }) {
  const { total, completed, pending, pinned, todayTasks, completionPercentage } = stats;

  const statCards = [
    {
      id: 'total',
      label: 'Total Tasks',
      value: total,
      icon: <FiLayers className="w-5 h-5 text-indigo-500" />,
      bgGradient: 'from-indigo-500/15 via-indigo-500/5 to-transparent',
      borderColor: 'border-indigo-500/25',
      textColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      id: 'completed',
      label: 'Completed',
      value: completed,
      icon: <FiCheckCircle className="w-5 h-5 text-emerald-500" />,
      bgGradient: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-500/25',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 'pending',
      label: 'Pending',
      value: pending,
      icon: <FiClock className="w-5 h-5 text-amber-500" />,
      bgGradient: 'from-amber-500/15 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-500/25',
      textColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      id: 'pinned',
      label: 'Pinned',
      value: pinned,
      icon: <BsPinAngle className="w-5 h-5 text-purple-500" />,
      bgGradient: 'from-purple-500/15 via-purple-500/5 to-transparent',
      borderColor: 'border-purple-500/25',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      id: 'today',
      label: "Due Today",
      value: todayTasks,
      icon: <FiCalendar className="w-5 h-5 text-rose-500" />,
      bgGradient: 'from-rose-500/15 via-rose-500/5 to-transparent',
      borderColor: 'border-rose-500/25',
      textColor: 'text-rose-600 dark:text-rose-400'
    }
  ];

  return (
    <div className="w-full glass-card p-4 sm:p-5 rounded-3xl mb-6 shadow-sm border border-slate-200/70 dark:border-slate-800">
      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            className={`p-3.5 rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.bgGradient} flex flex-col justify-between hover:scale-[1.02] transition-transform`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                {card.label}
              </span>
              <div className="p-1.5 rounded-xl bg-white/90 dark:bg-slate-800/90 shadow-xs">
                {card.icon}
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <motion.span
                key={card.value}
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${card.textColor}`}
              >
                {card.value}
              </motion.span>
              <span className="text-[11px] text-slate-400 dark:text-slate-400 font-semibold">items</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Embedded Productivity Goal Bar inside same card */}
      <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiTrendingUp className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Productivity Goal Progress
            </span>
            {completionPercentage === 100 && total > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 animate-pulse">
                🎉 100% Completed!
              </span>
            )}
          </div>
          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800/60">
            {completionPercentage}% Done
          </span>
        </div>

        {/* Animated Bar */}
        <div className="w-full h-2.5 bg-slate-200/80 dark:bg-slate-800/90 rounded-full overflow-hidden p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-purple-500 to-emerald-400 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}

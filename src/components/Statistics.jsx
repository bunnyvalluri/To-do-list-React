import React from 'react';
import { FiCheckCircle, FiClock, FiLayers, FiCalendar } from 'react-icons/fi';
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
      bgGradient: 'from-indigo-500/10 to-indigo-500/5',
      borderColor: 'border-indigo-500/20',
      textColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      id: 'completed',
      label: 'Completed',
      value: completed,
      icon: <FiCheckCircle className="w-5 h-5 text-emerald-500" />,
      bgGradient: 'from-emerald-500/10 to-emerald-500/5',
      borderColor: 'border-emerald-500/20',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 'pending',
      label: 'Pending',
      value: pending,
      icon: <FiClock className="w-5 h-5 text-amber-500" />,
      bgGradient: 'from-amber-500/10 to-amber-500/5',
      borderColor: 'border-amber-500/20',
      textColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      id: 'pinned',
      label: 'Pinned',
      value: pinned,
      icon: <BsPinAngle className="w-5 h-5 text-purple-500" />,
      bgGradient: 'from-purple-500/10 to-purple-500/5',
      borderColor: 'border-purple-500/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      id: 'today',
      label: "Due Today",
      value: todayTasks,
      icon: <FiCalendar className="w-5 h-5 text-rose-500" />,
      bgGradient: 'from-rose-500/10 to-rose-500/5',
      borderColor: 'border-rose-500/20',
      textColor: 'text-rose-600 dark:text-rose-400'
    }
  ];

  return (
    <div className="w-full mb-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-4">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className={`glass-card p-4 rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.bgGradient} flex flex-col justify-between hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-200">
                {card.label}
              </span>
              <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/90 shadow-xs">
                {card.icon}
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <motion.span
                key={card.value}
                initial={{ scale: 0.8 }}
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

      {/* Progress Bar Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass-card p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Overall Productivity Goal
            </span>

            {completionPercentage === 100 && total > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 animate-pulse">
                🎉 All Done!
              </span>
            )}
          </div>
          <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
            {completionPercentage}%
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-3 bg-slate-200/70 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 shadow-sm"
          />
        </div>
      </motion.div>
    </div>
  );
}

import React from 'react';
import { FiZap, FiCheckCircle, FiPlus, FiTrendingUp } from 'react-icons/fi';
import { BsFire } from 'react-icons/bs';
import { motion } from 'framer-motion';

const MOTIVATIONAL_QUOTES = [
  "Focus on being productive instead of busy. — Tim Ferriss",
  "Action is the foundational key to all success. — Pablo Picasso",
  "The secret of getting ahead is getting started. — Mark Twain",
  "Small daily improvements over time lead to stunning results. — Robin Sharma",
  "You don't need to see the whole staircase, just take the first step. — Martin Luther King Jr."
];

export function HeroDashboard({ stats, onOpenTaskModal }) {
  const currentHour = new Date().getHours();
  let timeGreeting = 'Good Morning';
  if (currentHour >= 12 && currentHour < 17) timeGreeting = 'Good Afternoon';
  if (currentHour >= 17) timeGreeting = 'Good Evening';

  const randomQuote = MOTIVATIONAL_QUOTES[new Date().getDate() % MOTIVATIONAL_QUOTES.length];

  return (
    <div className="w-full glass-card p-6 sm:p-8 rounded-3xl mb-8 relative overflow-hidden border border-indigo-500/20 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-transparent shadow-xl">
      {/* Background Glowing Mesh Accent */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Column: Greeting & Quote */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs border border-indigo-200 dark:border-indigo-800/60 flex items-center gap-1.5">
              <FiZap className="w-3.5 h-3.5 fill-indigo-500" />
              <span>SaaS Productivity Platform</span>
            </span>

            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-extrabold text-xs border border-amber-200 dark:border-amber-800/60 flex items-center gap-1.5">
              <BsFire className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{stats.streak} Day Streak</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            {timeGreeting}, <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">Champion 👋</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-xl italic">
            "{randomQuote}"
          </p>

          <div className="pt-2 flex items-center justify-center md:justify-start gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenTaskModal}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-md shadow-indigo-500/30 flex items-center gap-2"
            >
              <FiPlus className="w-5 h-5 stroke-[3]" />
              <span>Quick Create Task</span>
            </motion.button>
          </div>
        </div>

        {/* Right Column: Animated Circular Progress Ring & Score Gauge */}
        <div className="flex items-center gap-6 shrink-0 bg-white/60 dark:bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
          {/* Circular Ring */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="3.8"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                className="text-indigo-600 dark:text-indigo-400"
                strokeDasharray={`${stats.completionPercentage}, 100`}
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${stats.completionPercentage}, 100` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-xl font-black text-slate-900 dark:text-slate-100">
                {stats.completionPercentage}%
              </span>
              <span className="block text-[9px] font-bold uppercase text-slate-400">Done</span>
            </div>
          </div>

          {/* Productivity Score */}
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
              <FiTrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Productivity Score</span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {stats.productivityScore} <span className="text-xs text-slate-400 font-bold">/100</span>
            </div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              {stats.completed} of {stats.total} Tasks Finished
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { FiPlay, FiPause, FiRotateCcw, FiClock, FiCheckCircle } from 'react-icons/fi';
import { usePomodoro } from '../../hooks/usePomodoro';
import { motion } from 'framer-motion';

export function PomodoroWidget() {
  const {
    mode,
    modes,
    formattedTime,
    isRunning,
    sessionsCompleted,
    toggleTimer,
    resetTimer,
    switchMode
  } = usePomodoro();

  return (
    <div className="w-full glass-card p-6 sm:p-8 rounded-3xl mb-8 border border-indigo-500/20 shadow-xl text-center flex flex-col items-center justify-center">
      {/* Widget Header */}
      <div className="flex items-center gap-2 mb-4">
        <FiClock className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
          Pomodoro Focus Room
        </h3>
      </div>

      {/* Mode Switches */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-6 border border-slate-200/60 dark:border-slate-700/60">
        {Object.keys(modes).map((mKey) => {
          const isActive = mode === mKey;
          return (
            <button
              key={mKey}
              onClick={() => switchMode(mKey)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {modes[mKey].label}
            </button>
          );
        })}
      </div>

      {/* Timer Counter Display */}
      <motion.div
        key={formattedTime}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-slate-900 dark:text-slate-100 mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
      >
        {formattedTime}
      </motion.div>

      {/* Play / Pause / Reset Controls */}
      <div className="flex items-center gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTimer}
          className={`px-8 py-3.5 rounded-2xl font-extrabold text-sm text-white shadow-lg flex items-center gap-2 transition-all ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
              : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25'
          }`}
        >
          {isRunning ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5 fill-current" />}
          <span>{isRunning ? 'Pause Focus' : 'Start Focus'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetTimer}
          className="p-3.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold transition-colors"
          title="Reset Timer"
        >
          <FiRotateCcw className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Session Counter */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700">
        <FiCheckCircle className="w-4 h-4 text-emerald-500" />
        <span>{sessionsCompleted} Focus Sessions Completed Today</span>
      </div>
    </div>
  );
}

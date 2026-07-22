import React from 'react';
import { FiCheckCircle, FiSearch, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

export function EmptyState({ searchQuery, onCreateFirstTask }) {
  const isSearch = Boolean(searchQuery && searchQuery.trim());

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full glass-card rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center my-6 border border-dashed border-slate-300 dark:border-slate-800"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 border border-indigo-500/30 shadow-inner"
      >
        {isSearch ? (
          <FiSearch className="w-10 h-10" />
        ) : (
          <FiCheckCircle className="w-10 h-10" />
        )}
      </motion.div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
        {isSearch ? 'No Matching Tasks Found' : 'No Tasks Yet'}
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 font-medium">
        {isSearch
          ? `We couldn't find any tasks matching "${searchQuery}". Try searching with different keywords.`
          : 'Your list is completely clear! Add your first task to start organizing your workflow.'}
      </p>

      {!isSearch && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateFirstTask}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-md shadow-indigo-500/25 flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4 stroke-[3]" />
          <span>Create First Task</span>
        </motion.button>
      )}
    </motion.div>
  );
}

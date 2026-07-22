import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { FiBarChart2, FiPieChart, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export function AnalyticsDashboard({ tasks, stats }) {
  // Category Breakdown Data
  const categoryCounts = {};
  tasks.forEach((t) => {
    const cat = t.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoryData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    count: categoryCounts[cat]
  }));

  // Priority Distribution Data
  const priorityData = [
    { name: 'High', value: tasks.filter((t) => t.priority === 'High').length, color: '#f43f5e' },
    { name: 'Medium', value: tasks.filter((t) => t.priority === 'Medium').length, color: '#f59e0b' },
    { name: 'Low', value: tasks.filter((t) => t.priority === 'Low').length, color: '#10b981' }
  ];

  // Weekly Completion Trend Mock/Real Data
  const trendData = [
    { day: 'Mon', completed: Math.max(1, stats.completed - 3) },
    { day: 'Tue', completed: Math.max(2, stats.completed - 2) },
    { day: 'Wed', completed: Math.max(1, stats.completed - 1) },
    { day: 'Thu', completed: stats.completed },
    { day: 'Fri', completed: stats.completed + 1 },
    { day: 'Sat', completed: stats.completed },
    { day: 'Sun', completed: stats.completed + 2 }
  ];

  return (
    <div className="w-full space-y-6 mb-8">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-3xl border border-indigo-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400">
              Completion Rate
            </span>
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {stats.completionPercentage}%
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
            <FiCheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-purple-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400">
              Productivity Score
            </span>
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
              {stats.productivityScore}/100
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 flex items-center justify-center">
            <FiTrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-amber-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400">
              Active Streak
            </span>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {stats.streak} Days 🔥
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 flex items-center justify-center">
            <FiBarChart2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-3xl border border-slate-200/70 dark:border-slate-800"
        >
          <div className="flex items-center gap-2 mb-4">
            <FiBarChart2 className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Task Breakdown by Category
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Priority Breakdown Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-3xl border border-slate-200/70 dark:border-slate-800"
        >
          <div className="flex items-center gap-2 mb-4">
            <FiPieChart className="w-5 h-5 text-purple-500" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Priority Distribution
            </h3>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={5}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Weekly Completion Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 rounded-3xl border border-slate-200/70 dark:border-slate-800"
      >
        <div className="flex items-center gap-2 mb-4">
          <FiTrendingUp className="w-5 h-5 text-emerald-500" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            Weekly Completion Velocity
          </h3>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Area type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

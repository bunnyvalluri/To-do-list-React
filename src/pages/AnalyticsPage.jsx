import React from 'react';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';

export function AnalyticsPage({ tasks, stats }) {
  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
          Analytics & Productivity Insights
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          Real-time metrics, breakdown charts, and completion velocity
        </p>
      </div>

      <AnalyticsDashboard tasks={tasks} stats={stats} />
    </div>
  );
}

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { MonthlyObservation } from '../../types/project';
import { useTheme } from '../../context/ThemeContext';

interface ProgressTrendChartProps {
  data: MonthlyObservation[];
  title?: string;
}

export const ProgressTrendChart: React.FC<ProgressTrendChartProps> = ({
  data,
  title = 'Execution Progress Trajectory (Planned vs Actual S-Curve)',
}) => {
  const { isDark } = useTheme();

  if (!data || data.length === 0) {
    return <div className="p-4 text-xs text-slate-500">No time-series data available.</div>;
  }

  const formattedData = data.map(d => ({
    month: d.month,
    'Planned Progress (%)': d.planned_progress,
    'Actual Progress (%)': d.actual_progress,
  }));

  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const tickColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#cbd5e1';
  const tooltipText = isDark ? '#f8fafc' : '#0f172a';

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider font-mono">{title}</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">12-Month Historical Trajectory & Convergence</p>
        </div>
        <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 px-2 py-0.5 rounded">
          S-Curve Analysis
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" stroke={tickColor} tick={{ fontSize: 10, fill: tickColor }} />
            <YAxis domain={[0, 100]} stroke={tickColor} tick={{ fontSize: 10, fill: tickColor }} unit="%" />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                borderRadius: '0.375rem',
                fontSize: '12px',
                color: tooltipText,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            <Line
              type="monotone"
              dataKey="Planned Progress (%)"
              stroke="#0284c7"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Actual Progress (%)"
              stroke="#e11d48"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#e11d48' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface RiskDistributionDonutProps {
  critical: number;
  high: number;
  moderate: number;
  low: number;
}

export const RiskDistributionDonut: React.FC<RiskDistributionDonutProps> = ({
  critical,
  high,
  moderate,
  low,
}) => {
  const { isDark } = useTheme();

  const data = [
    { name: 'Critical Risk (75-100)', value: critical, color: '#ef4444' },
    { name: 'High Risk (50-74)', value: high, color: '#f97316' },
    { name: 'Moderate Risk (25-49)', value: moderate, color: '#f59e0b' },
    { name: 'Low Risk (0-24)', value: low, color: '#10b981' },
  ];

  const total = critical + high + moderate + low;

  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#cbd5e1';
  const tooltipText = isDark ? '#f8fafc' : '#0f172a';
  const strokeColor = isDark ? '#0f172a' : '#ffffff';

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-4 h-full flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider font-mono">
            Portfolio Risk Health
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Classification of {total} Monitored Projects</p>
        </div>
        <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 px-2 py-0.5 rounded">
          Risk Index
        </span>
      </div>

      <div className="h-64 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={strokeColor} strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val: any) => [`${val} Projects (${Math.round((Number(val) / total) * 100)}%)`]}
              contentStyle={{
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                borderRadius: '0.375rem',
                fontSize: '12px',
                color: tooltipText,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

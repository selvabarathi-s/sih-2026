import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface CostEscalationChartProps {
  originalCost: number;
  revisedCost: number;
  cumulativeExpenditure: number;
  predictedExposure: number;
}

export const CostEscalationChart: React.FC<CostEscalationChartProps> = ({
  originalCost,
  revisedCost,
  cumulativeExpenditure,
  predictedExposure,
}) => {
  const { isDark } = useTheme();

  const data = [
    {
      name: 'Financial Parameters (₹ Cr)',
      'Original Sanctioned': originalCost,
      'Revised Baseline': revisedCost,
      'Cumulative Expended': cumulativeExpenditure,
      'Total Predicted Exposure': revisedCost + predictedExposure,
    },
  ];

  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const tickColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#cbd5e1';
  const tooltipText = isDark ? '#f8fafc' : '#0f172a';

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider font-mono">
            Financial Exposure & Escalation Trajectory
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Values in ₹ Crores</p>
        </div>
        <span className="text-[10px] font-mono bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 px-2 py-0.5 rounded">
          Cost Exposure Breakdown
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={tickColor} tick={{ fontSize: 11, fill: tickColor }} />
            <YAxis stroke={tickColor} tick={{ fontSize: 10, fill: tickColor }} />
            <Tooltip
              formatter={(value: any) => [`₹${Number(value).toLocaleString()} Cr`]}
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
            <Bar dataKey="Original Sanctioned" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Revised Baseline" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Cumulative Expended" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Total Predicted Exposure" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

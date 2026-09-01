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

interface SectorRiskBarChartProps {
  data: {
    sector: string;
    criticalCount: number;
    highCount: number;
    moderateCount: number;
    lowCount: number;
  }[];
}

export const SectorRiskBarChart: React.FC<SectorRiskBarChartProps> = ({ data }) => {
  const { isDark } = useTheme();

  const formatted = data.map(d => ({
    name: d.sector.replace(' & ', ' &\n').replace('Infrastructure', 'Infra'),
    'Critical Risk': d.criticalCount,
    'High Risk': d.highCount,
    'Moderate Risk': d.moderateCount,
    'Low Risk': d.lowCount,
  }));

  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const tickColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? '#0f172a' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#cbd5e1';
  const tooltipText = isDark ? '#f8fafc' : '#0f172a';

  return (
    <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-lg p-4 h-full flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider font-mono">
            Sector-Wise Risk Exposure
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Distribution across 8 National Infrastructure Sectors</p>
        </div>
        <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
          Portfolio Breakdown
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formatted} margin={{ top: 10, right: 10, bottom: 25, left: -15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="name"
              stroke={tickColor}
              interval={0}
              angle={-20}
              textAnchor="end"
              tick={{ fontSize: 9, fill: tickColor }}
            />
            <YAxis stroke={tickColor} tick={{ fontSize: 10, fill: tickColor }} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                borderRadius: '0.375rem',
                fontSize: '11px',
                color: tooltipText,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Bar dataKey="Critical Risk" stackId="a" fill="#ef4444" />
            <Bar dataKey="High Risk" stackId="a" fill="#f97316" />
            <Bar dataKey="Moderate Risk" stackId="a" fill="#f59e0b" />
            <Bar dataKey="Low Risk" stackId="a" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

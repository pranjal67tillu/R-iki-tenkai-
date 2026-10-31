/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Activity, ShieldCheck, Flame, TrendingUp, Calendar } from 'lucide-react';

interface DayRecord {
  date: string;
  dayNum: number;
  cleanHours: number; // 0 to 24
  cursedEnergy: number; // cumulative score
  urgesCleaved: number;
  isCurseFree: boolean;
}

interface MonthlyCurseChartProps {
  currentStreakDays: number;
}

export const MonthlyCurseChart: React.FC<MonthlyCurseChartProps> = ({ currentStreakDays }) => {
  const [chartMode, setChartMode] = useState<'energy' | 'hours'>('energy');

  // Generate 30 days of past-month data tied to current streak
  const monthlyData: DayRecord[] = useMemo(() => {
    const records: DayRecord[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Determine if this day is part of the active streak
      const daysAgo = i;
      const isClean = daysAgo <= currentStreakDays || (daysAgo > currentStreakDays && (daysAgo % 9 !== 0));
      const cleanHours = isClean ? 24 : Math.floor(8 + Math.random() * 8);

      // Urges cleaved: more during early days of streak, then stabilizing
      const baseUrges = isClean ? (daysAgo < 5 ? Math.floor(2 + (5 - daysAgo) * 0.8) : Math.floor(1 + Math.random() * 2)) : 0;
      
      // Cumulative cursed energy calculation
      const cumulativeEnergy = Math.round(
        Math.max(100, (30 - i) * 260 + (isClean ? 350 : 50) + (cleanHours * 15))
      );

      records.push({
        date: dateStr,
        dayNum: 30 - i,
        cleanHours,
        cursedEnergy: cumulativeEnergy,
        urgesCleaved: baseUrges,
        isCurseFree: cleanHours >= 20
      });
    }

    return records;
  }, [currentStreakDays]);

  // Aggregate stats
  const totalCleanDays = monthlyData.filter(d => d.isCurseFree).length;
  const purityPercentage = Math.round((totalCleanDays / 30) * 100);
  const totalUrgesRepelled = monthlyData.reduce((acc, curr) => acc + curr.urgesCleaved, 0);
  const maxEnergy = monthlyData[monthlyData.length - 1]?.cursedEnergy || 7500;

  return (
    <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 shadow-2xl space-y-5" data-testid="curse-free-chart-container">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold font-cinzel text-white">
              Past 30 Days 'Curse-Free' Trajectory
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking daily unbroken purity hours, urge resistance, and innate domain refinement.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setChartMode('energy')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              chartMode === 'energy'
                ? 'bg-red-950 text-red-200 border border-red-500/50 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cursed Energy Output
          </button>
          <button
            onClick={() => setChartMode('hours')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              chartMode === 'hours'
                ? 'bg-red-950 text-red-200 border border-red-500/50 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Clean Hours & Urges
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-1">
          <span className="text-slate-400 font-mono block text-[11px]">30-Day Purity Rate:</span>
          <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            {purityPercentage}%
          </span>
          <p className="text-[10px] text-slate-500">{totalCleanDays}/30 Days Clean</p>
        </div>

        <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-1">
          <span className="text-slate-400 font-mono block text-[11px]">Urges Cleaved:</span>
          <span className="text-xl font-bold font-mono text-red-400 tabular-nums">
            {totalUrgesRepelled}
          </span>
          <p className="text-[10px] text-slate-500">Impulses Cut Down</p>
        </div>

        <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-1">
          <span className="text-slate-400 font-mono block text-[11px]">Refined Energy:</span>
          <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
            {maxEnergy.toLocaleString()} CE
          </span>
          <p className="text-[10px] text-slate-500">Accumulated Power</p>
        </div>

        <div className="p-3.5 bg-black/50 rounded-xl border border-white/5 space-y-1">
          <span className="text-slate-400 font-mono block text-[11px]">Active Streak:</span>
          <span className="text-xl font-bold font-mono text-sky-400 tabular-nums">
            {currentStreakDays} Days
          </span>
          <p className="text-[10px] text-slate-500">Unbroken Protection</p>
        </div>
      </div>

      {/* Main Recharts Visualization */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'energy' ? (
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                interval={4}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as DayRecord;
                    return (
                      <div className="bg-slate-950 border border-red-500/50 p-3 rounded-xl shadow-2xl text-xs space-y-1 font-mono">
                        <p className="text-white font-bold">{label} (Day {data.dayNum})</p>
                        <p className="text-red-400">
                          Refined Energy: <span className="text-white font-bold">{data.cursedEnergy} CE</span>
                        </p>
                        <p className="text-emerald-400">
                          Curse-Free Hours: <span className="text-white">{data.cleanHours}/24h</span>
                        </p>
                        <p className="text-amber-400">
                          Urges Repelled: <span className="text-white">{data.urgesCleaved}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="cursedEnergy"
                name="Cursed Energy (CE)"
                stroke="#ef4444"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#energyGrad)"
              />
            </AreaChart>
          ) : (
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                interval={4}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                domain={[0, 24]}
                ticks={[0, 6, 12, 18, 24]}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as DayRecord;
                    return (
                      <div className="bg-slate-950 border border-red-500/50 p-3 rounded-xl shadow-2xl text-xs space-y-1 font-mono">
                        <p className="text-white font-bold">{label}</p>
                        <p className="text-sky-400">Clean Hours: {data.cleanHours}h / 24h</p>
                        <p className="text-red-400">Urges Cleaved: {data.urgesCleaved}</p>
                        <p className={data.isCurseFree ? 'text-emerald-400' : 'text-amber-400'}>
                          Status: {data.isCurseFree ? 'Curse-Free Shield' : 'Partial Struggle'}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                formatter={(value) => <span className="text-slate-300 font-mono">{value}</span>}
              />
              <Bar
                dataKey="cleanHours"
                name="Curse-Free Hours (Max 24h)"
                fill="#38bdf8"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="urgesCleaved"
                name="Urges Repelled"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-3">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Curse-Free days reflect zero visits to adult domains & blocked incognito attempts</span>
        </span>
        <span className="font-mono text-red-400">Domain Refinement: Level 3</span>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Flame, Shield, Award, AlertTriangle, RefreshCw, Zap, Heart, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { MonthlyCurseChart } from './MonthlyCurseChart';

export const PurityDashboard: React.FC = () => {
  // Load streak from localStorage or default to 3 days
  const [streakSeconds, setStreakSeconds] = useState<number>(() => {
    const saved = localStorage.getItem('ryoiki_streak_seconds');
    return saved ? parseInt(saved, 10) : 3600 * 74; // 3 days, 2 hours
  });

  const [isUrgeModalOpen, setIsUrgeModalOpen] = useState(false);
  const [breatheSeconds, setBreatheSeconds] = useState(60);
  const [breathePhase, setBreathePhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  // Live timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setStreakSeconds(prev => {
        const next = prev + 1;
        localStorage.setItem('ryoiki_streak_seconds', next.toString());
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Urge Breather countdown
  useEffect(() => {
    if (!isUrgeModalOpen) return;
    const interval = setInterval(() => {
      setBreatheSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        const next = prev - 1;
        // 4s inhale, 4s hold, 4s exhale cycle
        const cycle = next % 12;
        if (cycle >= 8) setBreathePhase('inhale');
        else if (cycle >= 4) setBreathePhase('hold');
        else setBreathePhase('exhale');
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isUrgeModalOpen]);

  const days = Math.floor(streakSeconds / 86400);
  const hours = Math.floor((streakSeconds % 86400) / 3600);
  const minutes = Math.floor((streakSeconds % 3600) / 60);
  const seconds = streakSeconds % 60;

  // Rank determination
  let rankTitle = 'Grade 4 Weakling';
  let rankBadge = 'border-slate-500 text-slate-400';
  let rankProgress = Math.min(100, Math.round((days / 90) * 100));

  if (days >= 90) {
    rankTitle = 'Special Grade Sorcerer (Supreme Master)';
    rankBadge = 'border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.5)]';
  } else if (days >= 60) {
    rankTitle = 'Supreme Grade 1 Sorcerer';
    rankBadge = 'border-red-500 text-red-400';
  } else if (days >= 30) {
    rankTitle = 'Grade 1 Sorcerer';
    rankBadge = 'border-purple-500 text-purple-400';
  } else if (days >= 15) {
    rankTitle = 'Semi-Grade 1 Sorcerer';
    rankBadge = 'border-blue-500 text-blue-400';
  } else if (days >= 7) {
    rankTitle = 'Grade 2 Sorcerer';
    rankBadge = 'border-emerald-500 text-emerald-400';
  } else if (days >= 3) {
    rankTitle = 'Grade 3 Sorcerer';
    rankBadge = 'border-cyan-500 text-cyan-400';
  }

  const handleOpenUrgeProtocol = () => {
    setIsUrgeModalOpen(true);
    setBreatheSeconds(60);
    soundManager.playSlashStrike();
  };

  const handleRelapseReset = () => {
    if (window.confirm("Do you admit you gave in to weakness? Sukuna will reset your Cursed Energy streak to zero.")) {
      setStreakSeconds(0);
      localStorage.setItem('ryoiki_streak_seconds', '0');
      soundManager.playBarrierBreak();
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-[#050608] via-[#090b10] to-[#050608] p-6 lg:p-8 text-slate-200">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Title & Emergency Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-red-500" />
              <h1 className="text-2xl lg:text-3xl font-bold font-cinzel text-white">
                Cursed Energy Purity Dashboard
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Maintain your streak to refine your soul barrier and forge unyielding self-mastery.
            </p>
          </div>

          <button
            onClick={handleOpenUrgeProtocol}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-red-700 hover:bg-red-600 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-400 transition-all cursor-pointer animate-pulse"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Emergency Urge Cleaver</span>
          </button>
        </div>

        {/* Live Clean Streak Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 font-cinzel text-9xl select-none pointer-events-none text-red-500">
            宿
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-semibold text-red-400 font-mono uppercase tracking-wider">
                Unbroken Purity Streak (Pure Mind & Body):
              </span>
              <div className={`px-3 py-1 rounded-full border text-xs font-semibold font-mono ${rankBadge}`}>
                {rankTitle}
              </div>
            </div>

            {/* Huge Digits */}
            <div className="grid grid-cols-4 gap-3 sm:gap-6 text-center py-4">
              <div className="p-3 sm:p-4 rounded-xl bg-black/60 border border-white/5">
                <span className="text-3xl sm:text-5xl font-extrabold font-mono text-white block tabular-nums">
                  {days}
                </span>
                <span className="text-[11px] text-slate-400 uppercase font-mono mt-1 block">Days</span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-black/60 border border-white/5">
                <span className="text-3xl sm:text-5xl font-extrabold font-mono text-white block tabular-nums">
                  {hours.toString().padStart(2, '0')}
                </span>
                <span className="text-[11px] text-slate-400 uppercase font-mono mt-1 block">Hours</span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-black/60 border border-white/5">
                <span className="text-3xl sm:text-5xl font-extrabold font-mono text-white block tabular-nums">
                  {minutes.toString().padStart(2, '0')}
                </span>
                <span className="text-[11px] text-slate-400 uppercase font-mono mt-1 block">Minutes</span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-black/60 border border-white/5">
                <span className="text-3xl sm:text-5xl font-extrabold font-mono text-red-400 block tabular-nums">
                  {seconds.toString().padStart(2, '0')}
                </span>
                <span className="text-[11px] text-slate-400 uppercase font-mono mt-1 block">Seconds</span>
              </div>
            </div>

            {/* Rank Progress Bar towards Special Grade (90 Days) */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Refinement to Special Grade (90 Days):</span>
                <span>{rankProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-amber-300 transition-all duration-500"
                  style={{ width: `${rankProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 30-Day Curse-Free Recharts Data Visualization */}
        <MonthlyCurseChart currentStreakDays={days} />

        {/* Jujutsu Hierarchy of Purity */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
          <h3 className="text-base font-bold font-cinzel text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Jujutsu Ranks of Self-Mastery</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className={`p-3.5 rounded-xl border ${days >= 3 ? 'bg-cyan-950/40 border-cyan-500/40' : 'bg-black/40 border-white/5 opacity-60'}`}>
              <div className="flex justify-between items-center font-semibold">
                <span className="text-cyan-300">Grade 3 Sorcerer</span>
                <span className="font-mono">3 Days</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Brain fog recedes, sleep deepens, dopamine cravings steady.</p>
            </div>

            <div className={`p-3.5 rounded-xl border ${days >= 7 ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-black/40 border-white/5 opacity-60'}`}>
              <div className="flex justify-between items-center font-semibold">
                <span className="text-emerald-300">Grade 2 Sorcerer</span>
                <span className="font-mono">7 Days</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Testosterone surge, sharper eyes, innate barrier begins to form.</p>
            </div>

            <div className={`p-3.5 rounded-xl border ${days >= 14 ? 'bg-blue-950/40 border-blue-500/40' : 'bg-black/40 border-white/5 opacity-60'}`}>
              <div className="flex justify-between items-center font-semibold">
                <span className="text-blue-300">Semi-Grade 1</span>
                <span className="font-mono">14 Days</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Mental resilience solidifies; urges easily recognized and cleaved.</p>
            </div>

            <div className={`p-3.5 rounded-xl border ${days >= 30 ? 'bg-purple-950/40 border-purple-500/40' : 'bg-black/40 border-white/5 opacity-60'}`}>
              <div className="flex justify-between items-center font-semibold">
                <span className="text-purple-300">Grade 1 Elite</span>
                <span className="font-mono">30 Days</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Full month of purity. Neuroplastic healing and confidence surge.</p>
            </div>

            <div className={`p-3.5 rounded-xl border ${days >= 60 ? 'bg-red-950/40 border-red-500/40' : 'bg-black/40 border-white/5 opacity-60'}`}>
              <div className="flex justify-between items-center font-semibold">
                <span className="text-red-300">Supreme Grade 1</span>
                <span className="font-mono">60 Days</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Mastery over instincts. Sexual energy channeled into creative power.</p>
            </div>

            <div className={`p-3.5 rounded-xl border ${days >= 90 ? 'bg-amber-950/40 border-amber-500/60' : 'bg-black/40 border-white/5 opacity-60'}`}>
              <div className="flex justify-between items-center font-semibold">
                <span className="text-amber-300">Special Grade</span>
                <span className="font-mono">90 Days</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Supreme domain refinement. Complete freedom from degenerate chains.</p>
            </div>
          </div>
        </div>

        {/* Reset / Relapse Confession */}
        <div className="flex justify-between items-center p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-400">
          <span>Stumbled or relapsed? Confess honestly to Sukuna to begin anew.</span>
          <button
            onClick={handleRelapseReset}
            className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            Confess Relapse & Reset
          </button>
        </div>
      </div>

      {/* Emergency Urge Grounding Modal */}
      {isUrgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-950 border border-red-500/60 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-red-400 font-mono">
                EMERGENCY URGE CLEAVER PROTOCOL
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white">
                Breathe & Ground Your Soul
              </h2>
            </div>

            {/* Breathing Animation Circle */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div
                className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 ${
                  breathePhase === 'inhale'
                    ? 'border-sky-400 scale-110 shadow-[0_0_30px_rgba(56,189,248,0.5)]'
                    : breathePhase === 'hold'
                    ? 'border-amber-400 scale-110 shadow-[0_0_30px_rgba(251,191,36,0.5)]'
                    : 'border-red-500 scale-90 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                }`}
              >
                <span className="text-xs font-mono uppercase text-slate-300">
                  {breathePhase}
                </span>
                <span className="text-3xl font-extrabold font-mono text-white mt-1">
                  {breatheSeconds}s
                </span>
              </div>
            </div>

            <div className="bg-black/60 p-4 rounded-xl border border-white/10 text-xs text-slate-300 leading-relaxed text-left space-y-2">
              <p className="font-semibold text-white">
                Sukuna’s Directive:
              </p>
              <p>
                "The urge is merely a phantom impulse of unguided cursed energy. Do not fight it with weakness—Cleave it with physical action! Drop right now and execute 20 deep squats or splash freezing water on your neck."
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsUrgeModalOpen(false)}
                className="w-full py-3 text-xs font-bold uppercase tracking-wider text-white bg-red-700 hover:bg-red-600 rounded-xl transition-colors cursor-pointer"
              >
                I Have Severed The Urge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

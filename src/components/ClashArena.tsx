/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Swords, ShieldAlert, Zap, RefreshCw, Sparkles, Shield, AlertTriangle } from 'lucide-react';
import { DomainDefinition } from '../data/domains';
import { resolveDomainClash, DomainStats, ClashResult } from '../utils/clashRules';
import { soundManager } from '../utils/audio';

interface ClashArenaProps {
  domains: DomainDefinition[];
  onBackToVisualizer: () => void;
}

export const ClashArena: React.FC<ClashArenaProps> = ({
  domains,
  onBackToVisualizer
}) => {
  const [caster1Id, setCaster1Id] = useState<string>('unlimited_void');
  const [caster2Id, setCaster2Id] = useState<string>('malevolent_shrine');

  const [caster1Stats, setCaster1Stats] = useState<DomainStats | null>(null);
  const [caster2Stats, setCaster2Stats] = useState<DomainStats | null>(null);

  const [clashResult, setClashResult] = useState<ClashResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Initialize stats when caster IDs change
  useEffect(() => {
    const d1 = domains.find(d => d.id === caster1Id) || domains[0];
    const d2 = domains.find(d => d.id === caster2Id) || domains[1] || domains[0];

    const s1: DomainStats = {
      id: d1.id,
      name: d1.name,
      japaneseName: d1.japaneseName,
      user: d1.user,
      cursedEnergyOutput: d1.cursedEnergyOutput,
      barrierRefinement: d1.barrierRefinement,
      barrierType: d1.barrierType,
      radiusMeters: d1.radiusMeters,
      sureHitType: 'instant_lethal',
      sureHitPower: d1.sureHit.power,
      antiDomainActive: 'none',
      antiDomainIntegrity: 100
    };

    const s2: DomainStats = {
      id: d2.id,
      name: d2.name,
      japaneseName: d2.japaneseName,
      user: d2.user,
      cursedEnergyOutput: d2.cursedEnergyOutput,
      barrierRefinement: d2.barrierRefinement,
      barrierType: d2.barrierType,
      radiusMeters: d2.radiusMeters,
      sureHitType: 'instant_lethal',
      sureHitPower: d2.sureHit.power,
      antiDomainActive: 'none',
      antiDomainIntegrity: 100
    };

    setCaster1Stats(s1);
    setCaster2Stats(s2);
    const res = resolveDomainClash(s1, s2);
    setClashResult(res);
  }, [caster1Id, caster2Id, domains]);

  const runClash = (s1 = caster1Stats, s2 = caster2Stats) => {
    if (!s1 || !s2) return;
    setIsSimulating(true);
    soundManager.playDomainExpand();

    setTimeout(() => {
      const res = resolveDomainClash(s1, s2);
      setClashResult(res);
      setIsSimulating(false);
      if (res.winnerId !== 'stalemate') {
        soundManager.playSlashStrike();
      } else {
        soundManager.playBarrierBreak();
      }
    }, 400);
  };

  const handleApplyCountermeasure = (casterNum: 1 | 2, countermeasure: 'simple_domain' | 'falling_blossom' | 'condensed' | 'inverted' | 'output_boost') => {
    if (!caster1Stats || !caster2Stats) return;

    if (casterNum === 1) {
      const updated = { ...caster1Stats };
      if (countermeasure === 'condensed') {
        updated.barrierType = updated.barrierType === 'compressed' ? 'closed' : 'compressed';
      } else if (countermeasure === 'inverted') {
        updated.barrierType = updated.barrierType === 'inverted' ? 'closed' : 'inverted';
      } else if (countermeasure === 'output_boost') {
        updated.cursedEnergyOutput = Math.min(100, updated.cursedEnergyOutput + 15);
      } else {
        updated.antiDomainActive = updated.antiDomainActive === countermeasure ? 'none' : countermeasure;
        soundManager.playSimpleDomain();
      }
      setCaster1Stats(updated);
      runClash(updated, caster2Stats);
    } else {
      const updated = { ...caster2Stats };
      if (countermeasure === 'condensed') {
        updated.barrierType = updated.barrierType === 'compressed' ? 'closed' : 'compressed';
      } else if (countermeasure === 'inverted') {
        updated.barrierType = updated.barrierType === 'inverted' ? 'closed' : 'inverted';
      } else if (countermeasure === 'output_boost') {
        updated.cursedEnergyOutput = Math.min(100, updated.cursedEnergyOutput + 15);
      } else {
        updated.antiDomainActive = updated.antiDomainActive === countermeasure ? 'none' : countermeasure;
        soundManager.playSimpleDomain();
      }
      setCaster2Stats(updated);
      runClash(caster1Stats, updated);
    }
  };

  const domain1 = domains.find(d => d.id === caster1Id) || domains[0];
  const domain2 = domains.find(d => d.id === caster2Id) || domains[1] || domains[0];

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-[#050608] via-[#090b10] to-[#050608] p-6 lg:p-8 text-slate-200">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header & Arena Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Swords className="w-6 h-6 text-red-500" />
              <h1 className="text-2xl lg:text-3xl font-bold font-cinzel text-white">
                Domain Tug-of-War Arena
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Simulate barrier intersection, refinement supremacy, exterior open-barrier strikes, and anti-domain countermeasures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => runClash()}
              disabled={isSimulating}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 border border-red-500/60 hover:bg-red-950/80 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Recalculate Clash</span>
            </button>
          </div>
        </div>

        {/* Duelist Selection & Stat Boards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Caster 1 Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-sky-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                Primary Invoker
              </span>
              <select
                value={caster1Id}
                onChange={(e) => setCaster1Id(e.target.value)}
                className="bg-black/60 text-white text-xs border border-white/15 rounded-lg px-2.5 py-1.5 cursor-pointer focus:outline-none focus:border-sky-400"
              >
                {domains.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.user})</option>
                ))}
              </select>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white font-cinzel">{domain1.name}</h2>
              <p className="text-xs text-sky-400 font-medium">{domain1.user} · {domain1.kanji}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Barrier Type:</span>
                <span className="font-mono uppercase text-sky-300 font-semibold">{caster1Stats?.barrierType}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Cursed Energy Output:</span>
                <span className="font-mono text-white">{caster1Stats?.cursedEnergyOutput}/100</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Barrier Refinement:</span>
                <span className="font-mono text-white">{caster1Stats?.barrierRefinement}/100</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Barrier Integrity:</span>
                <span className="font-mono text-emerald-400">{clashResult?.barrierIntegrity1 ?? 100}%</span>
              </div>
            </div>

            {/* Tactical Adaptations for Caster 1 */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Tactical Adaptations:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  onClick={() => handleApplyCountermeasure(1, 'simple_domain')}
                  className={`px-2 py-1.5 rounded border text-left cursor-pointer transition-colors ${
                    caster1Stats?.antiDomainActive === 'simple_domain'
                      ? 'bg-sky-950 border-sky-400 text-sky-200'
                      : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/25'
                  }`}
                >
                  Simple Domain
                </button>
                <button
                  onClick={() => handleApplyCountermeasure(1, 'falling_blossom')}
                  className={`px-2 py-1.5 rounded border text-left cursor-pointer transition-colors ${
                    caster1Stats?.antiDomainActive === 'falling_blossom'
                      ? 'bg-sky-950 border-sky-400 text-sky-200'
                      : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/25'
                  }`}
                >
                  Falling Blossom
                </button>
                <button
                  onClick={() => handleApplyCountermeasure(1, 'condensed')}
                  className={`px-2 py-1.5 rounded border text-left cursor-pointer transition-colors ${
                    caster1Stats?.barrierType === 'compressed'
                      ? 'bg-purple-950 border-purple-400 text-purple-200'
                      : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/25'
                  }`}
                >
                  Condense Barrier
                </button>
                <button
                  onClick={() => handleApplyCountermeasure(1, 'output_boost')}
                  className="px-2 py-1.5 rounded border bg-black/40 border-white/10 text-slate-300 hover:border-white/25 text-left cursor-pointer"
                >
                  +15% Output Surge
                </button>
              </div>
            </div>
          </div>

          {/* Caster 2 Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-red-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                Opposing Invoker
              </span>
              <select
                value={caster2Id}
                onChange={(e) => setCaster2Id(e.target.value)}
                className="bg-black/60 text-white text-xs border border-white/15 rounded-lg px-2.5 py-1.5 cursor-pointer focus:outline-none focus:border-red-400"
              >
                {domains.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.user})</option>
                ))}
              </select>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white font-cinzel">{domain2.name}</h2>
              <p className="text-xs text-red-400 font-medium">{domain2.user} · {domain2.kanji}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Barrier Type:</span>
                <span className="font-mono uppercase text-red-300 font-semibold">{caster2Stats?.barrierType}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Cursed Energy Output:</span>
                <span className="font-mono text-white">{caster2Stats?.cursedEnergyOutput}/100</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Barrier Refinement:</span>
                <span className="font-mono text-white">{caster2Stats?.barrierRefinement}/100</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Barrier Integrity:</span>
                <span className="font-mono text-emerald-400">{clashResult?.barrierIntegrity2 ?? 100}%</span>
              </div>
            </div>

            {/* Tactical Adaptations for Caster 2 */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Tactical Adaptations:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  onClick={() => handleApplyCountermeasure(2, 'simple_domain')}
                  className={`px-2 py-1.5 rounded border text-left cursor-pointer transition-colors ${
                    caster2Stats?.antiDomainActive === 'simple_domain'
                      ? 'bg-red-950 border-red-400 text-red-200'
                      : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/25'
                  }`}
                >
                  Simple Domain
                </button>
                <button
                  onClick={() => handleApplyCountermeasure(2, 'falling_blossom')}
                  className={`px-2 py-1.5 rounded border text-left cursor-pointer transition-colors ${
                    caster2Stats?.antiDomainActive === 'falling_blossom'
                      ? 'bg-red-950 border-red-400 text-red-200'
                      : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/25'
                  }`}
                >
                  Falling Blossom
                </button>
                <button
                  onClick={() => handleApplyCountermeasure(2, 'condensed')}
                  className={`px-2 py-1.5 rounded border text-left cursor-pointer transition-colors ${
                    caster2Stats?.barrierType === 'compressed'
                      ? 'bg-purple-950 border-purple-400 text-purple-200'
                      : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/25'
                  }`}
                >
                  Condense Barrier
                </button>
                <button
                  onClick={() => handleApplyCountermeasure(2, 'output_boost')}
                  className="px-2 py-1.5 rounded border bg-black/40 border-white/10 text-slate-300 hover:border-white/25 text-left cursor-pointer"
                >
                  +15% Output Surge
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Dominance Meter */}
        {clashResult && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 shadow-xl space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-sky-400">
                {domain1.name}: {clashResult.caster1Dominance}%
              </span>
              <span className="font-mono text-slate-400 text-[11px] uppercase tracking-wider">
                Territorial Dominance Tug-of-War
              </span>
              <span className="font-semibold text-red-400">
                {clashResult.caster2Dominance}%: {domain2.name}
              </span>
            </div>

            {/* Split Progress Bar */}
            <div className="relative w-full h-4 bg-slate-900 rounded-full overflow-hidden flex border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-sky-600 to-sky-400 transition-all duration-500"
                style={{ width: `${clashResult.caster1Dominance}%` }}
              />
              <div
                className="h-full bg-gradient-to-l from-red-600 to-red-400 transition-all duration-500"
                style={{ width: `${clashResult.caster2Dominance}%` }}
              />
            </div>

            {/* Result Verdict banner */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-slate-300 font-medium">
                  {clashResult.tacticalAdvantage}
                </span>
              </div>
              <div className="font-mono font-semibold">
                {clashResult.winnerId === 'stalemate' ? (
                  <span className="text-yellow-400">DEADLOCK STALEMATE</span>
                ) : clashResult.winnerId === domain1.id ? (
                  <span className="text-sky-400">{domain1.name} LEADS</span>
                ) : (
                  <span className="text-red-400">{domain2.name} LEADS</span>
                )}
              </div>
            </div>

            {/* Live Jujutsu Combat Events Log */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Barrier Interaction Events:
              </span>
              <div className="p-3 bg-black/50 rounded-xl border border-white/5 space-y-1.5 font-mono text-xs max-h-48 overflow-y-auto">
                {clashResult.events.map((ev, i) => (
                  <p key={i} className="text-slate-300 flex items-start gap-2">
                    <span className="text-sky-400 shrink-0">›</span>
                    <span>{ev}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

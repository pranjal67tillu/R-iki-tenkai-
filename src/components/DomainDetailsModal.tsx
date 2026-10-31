/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Shield, Zap, Sparkles, ScrollText, Flame } from 'lucide-react';
import { DomainDefinition } from '../data/domains';

interface DomainDetailsModalProps {
  domain: DomainDefinition;
  isOpen: boolean;
  onClose: () => void;
  onCastFromModal: () => void;
}

export const DomainDetailsModal: React.FC<DomainDetailsModalProps> = ({
  domain,
  isOpen,
  onClose,
  onCastFromModal
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border border-white/15 rounded-2xl p-6 shadow-2xl text-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold text-white font-cinzel">{domain.name}</h2>
              <span className="text-sm font-normal text-slate-400 font-cinzel">({domain.japaneseName} · {domain.kanji})</span>
            </div>
            <p className="text-xs text-sky-400 font-medium mt-0.5">{domain.user} · {domain.epithet}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close domain details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-5 pt-4 text-sm">
          {/* Incantation Chant Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
              <ScrollText className="w-3.5 h-3.5" />
              <span>Incantation & Chant</span>
            </div>
            <p className="font-cinzel text-base text-slate-100 italic">
              "{domain.chant}"
            </p>
          </div>

          {/* Mudra / Hand Sign */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Hand Sign / Mudra (印相)
              </span>
              <p className="font-semibold text-white">{domain.handSign.name}</p>
              <p className="text-xs text-slate-400 mt-1">{domain.handSign.origin}</p>
              <p className="text-xs text-slate-300 mt-2 bg-black/40 p-2 rounded border border-white/5">
                {domain.handSign.gesture}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Barrier Specifications
              </span>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Barrier Type:</span>
                <span className="font-mono uppercase text-sky-400 font-semibold">{domain.barrierType}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Effective Radius:</span>
                <span className="font-mono text-white">{domain.radiusMeters}m</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Cursed Energy Output:</span>
                <span className="font-mono text-emerald-400">{domain.cursedEnergyOutput}/100</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Barrier Refinement:</span>
                <span className="font-mono text-amber-400">{domain.barrierRefinement}/100</span>
              </div>
            </div>
          </div>

          {/* Sure-Hit Technique */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10">
            <div className="flex items-center gap-2 text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Infallible Sure-Hit Guarantee</span>
            </div>
            <p className="font-semibold text-white text-base">{domain.sureHit.name}</p>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {domain.sureHit.description}
            </p>
          </div>

          {/* Lore & Famous Quote */}
          <div className="space-y-2 text-xs text-slate-400 leading-relaxed border-t border-white/10 pt-4">
            <blockquote className="border-l-2 border-sky-400 pl-3 italic text-slate-300">
              "{domain.quote}"
            </blockquote>
            <p className="pt-2">{domain.lore}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 border-t border-white/10 pt-4 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 rounded-lg border border-white/10 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onCastFromModal();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-950 border border-sky-500/80 hover:bg-sky-900 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            Manifest This Domain
          </button>
        </div>
      </div>
    </div>
  );
};

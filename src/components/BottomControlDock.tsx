/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, Zap, Compass, Shield, Maximize2, Radio } from 'lucide-react';
import { DomainDefinition } from '../data/domains';

interface BottomControlDockProps {
  domains: DomainDefinition[];
  currentDomain: DomainDefinition;
  onSelectDomain: (domain: DomainDefinition) => void;
  barrierExpanded: boolean;
  onToggleExpand: () => void;
  barrierRadius: number;
  onChangeRadius: (radius: number) => void;
  showBarrierShell: boolean;
  onToggleShell: () => void;
  onTriggerSureHit: () => void;
  cameraPreset: 'orbit' | 'inside' | 'cinematic' | 'top';
  onChangeCamera: (preset: 'orbit' | 'inside' | 'cinematic' | 'top') => void;
  onOpenDetails: () => void;
}

export const BottomControlDock: React.FC<BottomControlDockProps> = ({
  domains,
  currentDomain,
  onSelectDomain,
  barrierExpanded,
  onToggleExpand,
  barrierRadius,
  onChangeRadius,
  showBarrierShell,
  onToggleShell,
  onTriggerSureHit,
  cameraPreset,
  onChangeCamera,
  onOpenDetails
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-5xl transition-transform duration-300 pointer-events-auto ${
        isCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
      }`}
    >
      {/* Collapse Toggle Handle */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-300 bg-black/80 hover:bg-slate-900 border border-white/10 rounded-t-lg backdrop-blur-md cursor-pointer transition-colors"
          aria-label={isCollapsed ? 'Expand Control Dock' : 'Collapse Control Dock'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
              <span>Show Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Hide Controls</span>
            </>
          )}
        </button>
      </div>

      {/* Main Glass Control Dock */}
      <div className="bg-slate-950/90 border border-white/10 rounded-xl p-3.5 backdrop-blur-xl shadow-2xl space-y-3">
        {/* Row 1: Domain Selector Ribbon */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Domains:
          </span>
          {domains.map((dom) => {
            const isSelected = dom.id === currentDomain.id;
            return (
              <button
                key={dom.id}
                onClick={() => onSelectDomain(dom)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-slate-800 text-white border-sky-400/80 shadow-sm'
                    : 'bg-black/40 text-slate-400 border-white/5 hover:text-white hover:border-white/20'
                }`}
              >
                <span>{dom.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">({dom.user.split(' ')[0]})</span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Tactical Controls & Sure-Hit */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center pt-2 border-t border-white/10 text-xs">
          {/* Barrier Expansion Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleExpand}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                barrierExpanded
                  ? 'bg-sky-950/80 border-sky-500 text-sky-200 shadow-sm'
                  : 'bg-slate-900 border-white/10 text-slate-300 hover:border-white/25'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${barrierExpanded ? 'text-sky-400' : 'text-slate-400'}`} />
              <span>{barrierExpanded ? 'Barrier Manifested' : 'Manifest Domain'}</span>
            </button>
          </div>

          {/* Sure-Hit Execution */}
          <div className="flex items-center gap-2">
            <button
              onClick={onTriggerSureHit}
              disabled={!barrierExpanded}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                barrierExpanded
                  ? 'bg-red-950/80 border-red-500/80 hover:bg-red-900 text-red-200 shadow-sm'
                  : 'bg-slate-900/50 border-white/5 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-red-400" />
              <span>Unleash Sure-Hit</span>
            </button>
          </div>

          {/* Barrier Radius Slider */}
          <div className="flex items-center gap-2 px-2 bg-black/40 rounded-lg py-1.5 border border-white/5">
            <span className="text-[11px] text-slate-400 shrink-0 font-mono">Radius:</span>
            <input
              type="range"
              min="5"
              max={currentDomain.barrierType === 'open' ? 200 : 50}
              value={barrierRadius}
              onChange={(e) => onChangeRadius(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <span className="text-[11px] font-mono text-sky-400 w-10 text-right shrink-0">
              {barrierRadius}m
            </span>
          </div>

          {/* Camera Angles & Shell Toggle */}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
              {(['orbit', 'inside', 'cinematic', 'top'] as const).map((cam) => (
                <button
                  key={cam}
                  onClick={() => onChangeCamera(cam)}
                  className={`px-2 py-1 text-[11px] font-medium rounded capitalize cursor-pointer transition-colors ${
                    cameraPreset === cam
                      ? 'bg-white/20 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={`${cam} camera perspective`}
                >
                  {cam}
                </button>
              ))}
            </div>

            <button
              onClick={onToggleShell}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                showBarrierShell
                  ? 'bg-sky-950/60 border-sky-500/60 text-sky-300'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
              }`}
              title="Toggle Barrier Boundary Mesh"
              aria-label="Toggle Barrier Boundary Mesh"
            >
              <Shield className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenDetails}
              className="p-2 rounded-lg bg-black/40 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="View Domain Lore & Technique Details"
              aria-label="View Domain Lore"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

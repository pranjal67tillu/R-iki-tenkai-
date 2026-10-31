/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

export type ActiveTab = 'manifest' | 'clash' | 'forge' | 'codex';

interface NavigationHeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  onQuickCast: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeTab,
  onTabChange,
  isAudioMuted,
  onToggleAudio,
  onQuickCast
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-white/10 bg-black/60 backdrop-blur-md relative z-30 shrink-0">
      {/* Zone 1: Single element brand wordmark */}
      <div className="flex items-baseline gap-2 shrink-0">
        <button
          onClick={() => onTabChange('manifest')}
          className="text-lg font-bold tracking-wider text-white hover:text-sky-400 transition-colors whitespace-nowrap font-cinzel text-left cursor-pointer"
        >
          Rōiki Tenkai <span className="text-xs font-normal text-slate-400 ml-1">領域展開</span>
        </button>
      </div>

      {/* Zone 2: Clean single-line nav links */}
      <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => onTabChange('manifest')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'manifest' ? 'text-white border-b-2 border-sky-400 pb-0.5' : 'text-slate-400'
          }`}
        >
          Manifest Domain
        </button>
        <button
          onClick={() => onTabChange('clash')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'clash' ? 'text-white border-b-2 border-red-400 pb-0.5' : 'text-slate-400'
          }`}
        >
          Clash Arena
        </button>
        <button
          onClick={() => onTabChange('forge')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'forge' ? 'text-white border-b-2 border-purple-400 pb-0.5' : 'text-slate-400'
          }`}
        >
          Domain Forge
        </button>
        <button
          onClick={() => onTabChange('codex')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'codex' ? 'text-white border-b-2 border-amber-400 pb-0.5' : 'text-slate-400'
          }`}
        >
          Jujutsu Codex
        </button>
      </nav>

      {/* Zone 3: 1 primary action + audio control */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleAudio}
          className="p-2 text-slate-400 hover:text-white rounded-lg border border-white/10 hover:border-white/20 transition-colors"
          title={isAudioMuted ? 'Unmute Audio Synthesis' : 'Mute Audio'}
          aria-label={isAudioMuted ? 'Unmute sound effects' : 'Mute sound effects'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
        </button>

        <button
          onClick={onQuickCast}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 border border-sky-500/50 hover:bg-sky-950/80 hover:border-sky-400 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Expand Domain</span>
        </button>
      </div>
    </header>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationHeader, ActiveTab } from './components/NavigationHeader';
import { SukunaOpening } from './components/SukunaOpening';
import { SukunaMentorChat } from './components/SukunaMentorChat';
import { AntiPornBarrier } from './components/AntiPornBarrier';
import { PurityDashboard } from './components/PurityDashboard';
import { DomainCanvas } from './components/DomainCanvas';
import { BottomControlDock } from './components/BottomControlDock';
import { DomainDetailsModal } from './components/DomainDetailsModal';
import { ClashArena } from './components/ClashArena';
import { CANON_DOMAINS, INITIAL_CUSTOM_DOMAIN, DomainDefinition } from './data/domains';
import { soundManager } from './utils/audio';
import { MessageSquare, Shield, Flame, Box, Swords, Play } from 'lucide-react';

export default function App() {
  const [showOpening, setShowOpening] = useState(true);
  const [activeTab, setActiveTab] = useState<'mentor' | 'blocker' | 'purity' | 'domain3d' | 'clash'>('mentor');
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // 3D Canvas states
  const [domains, setDomains] = useState<DomainDefinition[]>([
    CANON_DOMAINS[1], // Malevolent Shrine default
    CANON_DOMAINS[0], // Unlimited Void
    CANON_DOMAINS[2], // Chimera Shadow Garden
    CANON_DOMAINS[3], // Authentic Mutual Love
    CANON_DOMAINS[4], // Self-Embodiment of Perfection
    CANON_DOMAINS[5], // Coffin of the Iron Mountain
    CANON_DOMAINS[6], // Deadly Sentencing
    INITIAL_CUSTOM_DOMAIN
  ]);
  const [selectedDomain, setSelectedDomain] = useState<DomainDefinition>(CANON_DOMAINS[1]);
  const [barrierExpanded, setBarrierExpanded] = useState(true);
  const [barrierRadius, setBarrierRadius] = useState(200);
  const [showBarrierShell, setShowBarrierShell] = useState(true);
  const [sureHitTriggered, setSureHitTriggered] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<'orbit' | 'inside' | 'cinematic' | 'top'>('orbit');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleToggleAudio = () => {
    const muted = soundManager.toggleMute();
    setIsAudioMuted(muted);
  };

  const handleTriggerSureHit = () => {
    setSureHitTriggered(true);
    soundManager.playSlashStrike();
    setTimeout(() => {
      setSureHitTriggered(false);
    }, 1200);
  };

  const handleQuickCast = () => {
    setBarrierExpanded(prev => !prev);
    soundManager.playDomainExpand();
  };

  return (
    <div className="min-h-screen bg-[#050608] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Cinematic Sukuna Opening (on first load or replay) */}
      {showOpening && (
        <SukunaOpening
          onComplete={() => setShowOpening(false)}
          isMuted={isAudioMuted}
          onToggleMute={handleToggleAudio}
        />
      )}

      {/* Main Top Navigation Bar (3-Zone Contract) */}
      <header className="flex items-center justify-between gap-6 px-6 py-3.5 border-b border-white/10 bg-black/80 backdrop-blur-md relative z-30 shrink-0">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('mentor')}
            className="text-lg font-bold tracking-wider text-white hover:text-red-400 transition-colors whitespace-nowrap font-cinzel text-left cursor-pointer flex items-center gap-2"
          >
            <span className="w-7 h-7 rounded-full bg-red-950 border border-red-500/60 flex items-center justify-center text-red-400 text-xs font-bold font-mono">
              宿
            </span>
            <span>Rōiki tenkai</span>
            <span className="text-xs font-normal text-slate-400 font-cinzel hidden sm:inline">領域展開</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('mentor')}
            className={`flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'mentor' ? 'text-white border-b-2 border-red-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-red-400" />
            <span>Sukuna Mentor</span>
          </button>

          <button
            onClick={() => setActiveTab('blocker')}
            className={`flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'blocker' ? 'text-white border-b-2 border-red-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span>Content Blocker</span>
          </button>

          <button
            onClick={() => setActiveTab('purity')}
            className={`flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'purity' ? 'text-white border-b-2 border-amber-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Purity Streak</span>
          </button>

          <button
            onClick={() => setActiveTab('domain3d')}
            className={`flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'domain3d' ? 'text-white border-b-2 border-sky-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-sky-400" />
            <span>3D Domain</span>
          </button>

          <button
            onClick={() => setActiveTab('clash')}
            className={`flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'clash' ? 'text-white border-b-2 border-purple-400 pb-0.5' : 'text-slate-400'
            }`}
          >
            <Swords className="w-3.5 h-3.5 text-purple-400" />
            <span>Clash Arena</span>
          </button>
        </nav>

        {/* Zone 3: Replay Opening & Audio Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setShowOpening(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-black/40 hover:bg-red-950/40 border border-white/10 hover:border-red-500/40 rounded-lg transition-colors cursor-pointer"
            title="Replay Sukuna Domain Expansion Opening"
          >
            <Play className="w-3 h-3 text-red-400" />
            <span className="hidden sm:inline">Replay Intro</span>
          </button>

          <button
            onClick={handleToggleAudio}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
            title={isAudioMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            aria-label={isAudioMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          >
            <span className="text-xs font-mono font-semibold text-red-400">
              {isAudioMuted ? 'MUTED' : 'SFX ON'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        {/* Tab 1: Sukuna Mentor Chat */}
        {activeTab === 'mentor' && (
          <div className="h-full">
            <SukunaMentorChat />
          </div>
        )}

        {/* Tab 2: Anti-Porn & Chrome Incognito Blocker */}
        {activeTab === 'blocker' && (
          <div className="h-full overflow-y-auto">
            <AntiPornBarrier />
          </div>
        )}

        {/* Tab 3: Purity & Streak Dashboard */}
        {activeTab === 'purity' && (
          <div className="h-full overflow-y-auto">
            <PurityDashboard />
          </div>
        )}

        {/* Tab 4: 3D Domain Manifestation */}
        {activeTab === 'domain3d' && (
          <div className="relative w-full h-[calc(100vh-65px)] overflow-hidden">
            <DomainCanvas
              domain={selectedDomain}
              barrierExpanded={barrierExpanded}
              barrierRadius={barrierRadius}
              showBarrierShell={showBarrierShell}
              sureHitTriggered={sureHitTriggered}
              cameraPreset={cameraPreset}
            />

            {/* 3D Viewport Title Badge */}
            <div className="absolute top-4 left-6 z-10 pointer-events-none">
              <h2 className="text-lg sm:text-xl font-bold font-cinzel text-white drop-shadow">
                {selectedDomain.name}
              </h2>
              <p className="text-xs text-sky-400 font-mono">
                {selectedDomain.user} · {selectedDomain.kanji} ({selectedDomain.barrierType.toUpperCase()} BARRIER)
              </p>
            </div>

            {/* Collapsible Ergonomic Bottom Dock */}
            <BottomControlDock
              domains={domains}
              currentDomain={selectedDomain}
              onSelectDomain={(d) => {
                setSelectedDomain(d);
                setBarrierRadius(d.radiusMeters);
                soundManager.playDomainExpand();
              }}
              barrierExpanded={barrierExpanded}
              onToggleExpand={handleQuickCast}
              barrierRadius={barrierRadius}
              onChangeRadius={setBarrierRadius}
              showBarrierShell={showBarrierShell}
              onToggleShell={() => setShowBarrierShell(prev => !prev)}
              onTriggerSureHit={handleTriggerSureHit}
              cameraPreset={cameraPreset}
              onChangeCamera={setCameraPreset}
              onOpenDetails={() => setIsDetailsOpen(true)}
            />

            {/* Domain Details Modal */}
            <DomainDetailsModal
              domain={selectedDomain}
              isOpen={isDetailsOpen}
              onClose={() => setIsDetailsOpen(false)}
              onCastFromModal={handleQuickCast}
            />
          </div>
        )}

        {/* Tab 5: Clash Arena */}
        {activeTab === 'clash' && (
          <div className="h-full overflow-y-auto">
            <ClashArena
              domains={domains}
              onBackToVisualizer={() => setActiveTab('domain3d')}
            />
          </div>
        )}
      </main>
    </div>
  );
}

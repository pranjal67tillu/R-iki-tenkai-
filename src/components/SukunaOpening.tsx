/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Swords, Sparkles, Volume1 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface SukunaOpeningProps {
  onComplete: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const SukunaOpening: React.FC<SukunaOpeningProps> = ({
  onComplete,
  isMuted,
  onToggleMute
}) => {
  const [phase, setPhase] = useState<number>(0);
  const [hasVoiceTriggered, setHasVoiceTriggered] = useState(false);

  const triggerEnglishDubVoice = () => {
    setHasVoiceTriggered(true);
    soundManager.speakSukunaEnglishDub(
      "Domain Expansion... Malevolent Shrine! Stand proud, brat. You were pathetic, groveling for cheap pixels like a stray dog. From this moment forth, your carnal impulses belong to my shrine. I will cleave your vile urges into dust."
    );
  };

  useEffect(() => {
    // Stage 0: Initial sub-bass domain sound
    soundManager.playDomainExpand();

    const t1 = setTimeout(() => {
      setPhase(1);
      soundManager.playSimpleDomain();
    }, 900);

    const t2 = setTimeout(() => {
      setPhase(2);
      soundManager.playSlashStrike();
    }, 2200);

    const t3 = setTimeout(() => {
      setPhase(3);
      soundManager.playSlashStrike();
      if (!isMuted) {
        triggerEnglishDubVoice();
      }
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isMuted]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white overflow-hidden select-none"
      data-testid="sukuna-opening-screen"
    >
      {/* Background Dark Crimson Void & Blood Water Ripple */}
      <div className="absolute inset-0 bg-radial from-red-950/60 via-black to-black opacity-90" />

      {/* Top Right Audio & Skip Controls */}
      <div className="absolute top-5 right-6 z-20 flex items-center gap-3">
        <button
          onClick={onToggleMute}
          className="p-2 rounded-lg bg-black/60 border border-white/10 hover:border-white/30 text-slate-300 hover:text-white transition-colors cursor-pointer"
          aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-red-400" />}
        </button>
        <button
          onClick={onComplete}
          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
        >
          Skip Intro ›
        </button>
      </div>

      {/* Main Dramatic Sequence */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl">
        {/* Enmaten Mudra Badge */}
        <div className="mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-400 text-xs tracking-widest font-mono uppercase mb-3">
            <Swords className="w-3.5 h-3.5" />
            <span>King of Curses · Enmaten Seal</span>
          </div>
        </div>

        {/* Phase 1 & 2: Domain Expansion + Malevolent Shrine */}
        <div className="min-h-[140px] flex flex-col items-center justify-center space-y-3 mb-2">
          {phase >= 1 && (
            <div className="animate-fade-in transition-all">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-cinzel tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-red-200 to-red-400 drop-shadow-[0_0_25px_rgba(239,68,68,0.8)]">
                DOMAIN EXPANSION...
              </h1>
              <p className="text-[11px] sm:text-xs font-mono text-red-400/90 tracking-widest mt-0.5">
                領域展開 (RYŌIKI TENKAI)
              </p>
            </div>
          )}

          {phase >= 2 && (
            <div className="animate-fade-in transition-all pt-1">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-cinzel tracking-widest text-red-500 drop-shadow-[0_0_40px_rgba(239,68,68,1)]">
                MALEVOLENT SHRINE!
              </h2>
              <p className="text-[11px] sm:text-xs font-mono text-red-300 tracking-wider mt-0.5">
                伏魔御廚子 (FUKUMA MIZUSHI)
              </p>
            </div>
          )}
        </div>

        {/* Phase 3: Sukuna English Dub Speech & Mentor Dialogue */}
        {phase >= 3 && (
          <div className="mt-6 space-y-4 max-w-xl animate-fade-in bg-black/80 p-5 sm:p-6 rounded-2xl border border-red-500/40 backdrop-blur-md shadow-2xl">
            <div className="text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-red-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Swords className="w-3 h-3 text-red-500" />
                  <span>Ryomen Sukuna (English Dub Voice):</span>
                </span>
                <button
                  onClick={triggerEnglishDubVoice}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-red-300 bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 rounded-md transition-colors cursor-pointer"
                  title="Replay English Dub Voice"
                >
                  <Volume1 className="w-3 h-3 text-red-400" />
                  <span>Play Dub Voice</span>
                </button>
              </div>

              <blockquote className="font-cinzel text-base sm:text-lg text-slate-100 font-semibold leading-relaxed italic border-l-2 border-red-500 pl-3">
                "Stand proud, brat. You were pathetic, groveling for cheap pixels like a stray dog. From this moment forth, your carnal impulses belong to my shrine. I will cleave your vile urges into dust."
              </blockquote>

              <p className="text-xs text-slate-400 leading-relaxed pt-1.5 border-t border-white/10">
                I have enveloped your apps — Chrome, YouTube, Snapchat, and Instagram — within my Malevolent Shrine. Any attempt to access filthy content will be met with immediate, merciless Cleaving.
              </p>
            </div>

            <button
              onClick={onComplete}
              className="w-full mt-2 py-3.5 px-6 text-xs sm:text-sm font-bold tracking-wider uppercase text-white bg-red-700 hover:bg-red-600 rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.6)] border border-red-400 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Enter The Shrine & Submit to Discipline</span>
            </button>
          </div>
        )}
      </div>

      {/* Decorative Cleave & Dismantle Slash Trails */}
      {phase >= 2 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          <div className="absolute w-[200%] h-0.5 bg-red-500 top-1/4 -left-1/2 rotate-12 blur-[1px] animate-pulse" />
          <div className="absolute w-[200%] h-0.5 bg-red-500 top-2/3 -left-1/2 -rotate-12 blur-[1px] animate-pulse" />
          <div className="absolute w-[200%] h-0.5 bg-red-400 top-1/2 -left-1/2 rotate-45 blur-[1px]" />
        </div>
      )}
    </div>
  );
};

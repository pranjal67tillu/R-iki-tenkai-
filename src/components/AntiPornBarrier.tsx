/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, ShieldAlert, AlertOctagon, Lock, Unlock, Zap, Swords, Flame, Laptop, Smartphone, Video, Camera, Compass, Volume1 } from 'lucide-react';
import { soundManager } from '../utils/audio';

type TargetApp = 'all' | 'chrome' | 'youtube' | 'instagram' | 'snapchat';

export const AntiPornBarrier: React.FC = () => {
  const [barrierActive, setBarrierActive] = useState(true);
  const [breachCount, setBreachCount] = useState(0);
  const [testQuery, setTestQuery] = useState('');
  const [isRoasting, setIsRoasting] = useState(false);
  const [isSpeakingRoast, setIsSpeakingRoast] = useState(false);
  const [currentRoast, setCurrentRoast] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<TargetApp>('all');
  const [penanceRemaining, setPenanceRemaining] = useState<number>(0);
  const [penanceTimer, setPenanceTimer] = useState<NodeJS.Timeout | null>(null);

  // Trigger Sukuna's English Dub Roast
  const triggerSukunaRoast = async (term: string, appName: string = 'General') => {
    setIsRoasting(true);
    soundManager.stopSpeech();
    setIsSpeakingRoast(false);
    soundManager.playDomainExpand();
    soundManager.playSlashStrike();
    setBreachCount(prev => prev + 1);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    try {
      const res = await fetch('/api/sukuna-roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forbiddenTerm: `${term} on ${appName}` })
      });
      const data = await res.json();
      const roastText = data.roast || `You pathetic worm! You dare try to access ${term} on ${appName} inside my Malevolent Shrine?! Drop down and give me 30 pushups before I cleave you!`;
      setCurrentRoast(roastText);
      soundManager.speakSukunaEnglishDub(
        roastText,
        () => setIsSpeakingRoast(true),
        () => setIsSpeakingRoast(false)
      );
    } catch {
      const fallback = `You disgusting worm! You actually tried to search for ${term} on ${appName} in my domain?! How pathetic! Look at yourself, groveling for cheap pixels like a stray dog! Drop to the floor and give me 30 pushups before I Cleave your wretched soul in two!`;
      setCurrentRoast(fallback);
      soundManager.speakSukunaEnglishDub(
        fallback,
        () => setIsSpeakingRoast(true),
        () => setIsSpeakingRoast(false)
      );
    } finally {
      setIsRoasting(false);
      startPenanceCountdown(30);
    }
  };

  const startPenanceCountdown = (seconds: number) => {
    setPenanceRemaining(seconds);
    if (penanceTimer) clearInterval(penanceTimer);

    const timer = setInterval(() => {
      setPenanceRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setPenanceTimer(timer);
  };

  const handleSimulateBreach = (presetTerm: string, app: string) => {
    triggerSukunaRoast(presetTerm, app);
  };

  const APP_CONFIGS = [
    {
      id: 'chrome' as TargetApp,
      name: 'Google Chrome',
      icon: Laptop,
      color: 'text-amber-400',
      badge: 'Incognito Locked',
      protection: 'Permanently disables Incognito mode, enforces SafeSearch, and blocks 450,000+ adult domains.',
      setupSteps: [
        'Windows: Run command "REG ADD HKLM\\SOFTWARE\\Policies\\Google\\Chrome /v IncognitoModeAvailability /t REG_DWORD /d 1 /f" in Admin CMD to remove Incognito.',
        'Android: Use Google Family Link to block Incognito or install an AppLock with Incognito Disabler service.',
        'SafeSearch: Lock Google Search SafeSearch filter to Strict so explicit images are cleaved at the source.'
      ],
      breachScenarios: [
        { label: 'Attempt Incognito Window', query: 'Opening Chrome Incognito Tab' },
        { label: 'Search Adult Tube', query: 'Free adult tube video' },
        { label: 'Bypass Adult Filter', query: 'Proxy unblocker for adult sites' }
      ]
    },
    {
      id: 'youtube' as TargetApp,
      name: 'YouTube',
      icon: Video,
      color: 'text-red-400',
      badge: 'Restricted Mode Active',
      protection: 'Enforces YouTube Restricted Mode, hides suggestive Shorts, and blocks NSFW comments and thumbnails.',
      setupSteps: [
        'Turn on Restricted Mode: Tap your profile picture → Settings → General → Toggle Restricted Mode ON (locks mature videos).',
        'Lock Restricted Mode in Browser: Scroll to bottom of YouTube.com → Click "Restricted Mode: On" → Lock Restricted Mode on this browser.',
        'DNS YouTube SafeSearch: Setting DNS to family.cloudflare-dns.com forces YouTube into strict restricted mode automatically.'
      ],
      breachScenarios: [
        { label: 'Suggestive Shorts Rabbit Hole', query: 'Spicy TikTok dances on YouTube Shorts' },
        { label: 'Search Mature ASMR', query: 'Explicit NSFW ASMR audio' },
        { label: 'Try Turning Off Restricted Mode', query: 'Disabling YouTube Restricted Mode' }
      ]
    },
    {
      id: 'instagram' as TargetApp,
      name: 'Instagram',
      icon: Camera,
      color: 'text-pink-400',
      badge: 'Sensitive Content: Less',
      protection: 'Restricts Explore tab thirsty traps, blocks suggestive influencer reels, and filters adult hashtags.',
      setupSteps: [
        'Enable "Less" Sensitive Content: Profile → ☰ Menu → Suggested Content → Sensitive Content Control → Select "Less".',
        'Reset Explore Page: Profile → Settings → Suggested Content → Reset Suggested Content to wipe thirst trap algorithms.',
        'Hidden Words / Keyword Block: Settings → Hidden Words → Add custom words: "thirst, bikini, onlyfans, lewd, nsfw, 18+" to automatically hide reels.'
      ],
      breachScenarios: [
        { label: 'Explore Tab Thirst Trap', query: 'Bikini model reels on Instagram Explore' },
        { label: 'Search Model Hashtag', query: 'OnlyFans promotion link on Instagram' },
        { label: 'Late Night DM Scrolling', query: 'NSFW Instagram fan accounts' }
      ]
    },
    {
      id: 'snapchat' as TargetApp,
      name: 'Snapchat',
      icon: Compass,
      color: 'text-yellow-400',
      badge: 'Discover Filtered',
      protection: 'Blocks vulgar Discover tiles, restricts Quick Add strangers, and shields against explicit story feeds.',
      setupSteps: [
        'Hide Sensational Discover Content: Long press any suggestive Discover story → Tap "Hide" or "Report" to train the algorithm.',
        'Family Center / Privacy: Profile → ⚙️ Settings → Privacy Controls → Contact Me: "My Friends Only".',
        'Disable Quick Add: Turn off "See Me in Quick Add" so random adult bot profiles cannot add you.'
      ],
      breachScenarios: [
        { label: 'Snapchat Discover Thirst Stories', query: 'Clicking suggestive Snapchat Discover story' },
        { label: 'Accept Random NSFW Quick Add', query: 'Adding explicit bot account on Snapchat' },
        { label: 'Search Adult Snap Groups', query: 'NSFW Snapchat leaked stories' }
      ]
    }
  ];

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-[#050608] via-[#090b10] to-[#050608] p-6 lg:p-8 text-slate-200">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-500" />
              <h1 className="text-2xl lg:text-3xl font-bold font-cinzel text-white">
                App Content Blocker & Incognito Lockdown
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active Malevolent Shrine barrier blocking sexual content across Chrome, YouTube, Snapchat, and Instagram.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setBarrierActive(!barrierActive)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                barrierActive
                  ? 'bg-red-950/80 border-red-500 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                  : 'bg-slate-900 border-white/10 text-slate-400'
              }`}
            >
              {barrierActive ? <Lock className="w-3.5 h-3.5 text-red-400" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{barrierActive ? 'Malevolent Shrine Active' : 'Barrier Paused'}</span>
            </button>
          </div>
        </div>

        {/* Brutal Sukuna Roast Alert Overlay */}
        {currentRoast && (
          <div
            className="p-6 rounded-2xl bg-red-950/95 border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.8)] space-y-4 animate-shake"
            data-testid="sukuna-roast-alert"
          >
            <div className="flex items-center justify-between border-b border-red-500/40 pb-3">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-400 animate-pulse" />
                <h3 className="text-lg font-bold font-cinzel text-red-200 tracking-wider uppercase">
                  Forbidden Content Cleaved by Sukuna!
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {isSpeakingRoast ? (
                  <button
                    onClick={() => {
                      soundManager.stopSpeech();
                      setIsSpeakingRoast(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-red-800 hover:bg-red-700 border border-red-400 rounded-lg animate-pulse cursor-pointer shadow-[0_0_12px_rgba(239,68,68,0.6)]"
                  >
                    <Volume1 className="w-3.5 h-3.5 animate-bounce" />
                    <span>Speaking Dub Voice (Stop)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (currentRoast) {
                        soundManager.speakSukunaEnglishDub(
                          currentRoast,
                          () => setIsSpeakingRoast(true),
                          () => setIsSpeakingRoast(false)
                        );
                      }
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-300 bg-red-900/60 hover:bg-red-800 border border-red-500/40 rounded-lg cursor-pointer"
                  >
                    <Volume1 className="w-3.5 h-3.5" />
                    <span>Replay Dub Voice</span>
                  </button>
                )}
                <span className="text-xs font-mono bg-red-900 text-red-300 px-2.5 py-1 rounded border border-red-500/40">
                  Breach #{breachCount}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-cinzel text-base sm:text-lg text-white font-semibold leading-relaxed italic border-l-4 border-red-500 pl-4 py-1">
                "{currentRoast}"
              </p>

              <div className="bg-black/60 p-4 rounded-xl border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      Required Penance Challenge:
                    </h4>
                    <p className="text-xs text-slate-300">
                      Execute 25 Pushups or splash ice water on your face right now.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono block">Penance Cooldown:</span>
                  <span className="text-xl font-bold font-mono text-red-400">
                    {penanceRemaining > 0 ? `${penanceRemaining}s` : 'CLEARED'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  soundManager.stopSpeech();
                  setIsSpeakingRoast(false);
                  setCurrentRoast(null);
                }}
                disabled={penanceRemaining > 0}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  penanceRemaining > 0
                    ? 'bg-red-950 text-red-500 border border-red-500/20 cursor-not-allowed'
                    : 'bg-red-700 hover:bg-red-600 text-white shadow-lg border border-red-400'
                }`}
              >
                {penanceRemaining > 0 ? `Endure Penance (${penanceRemaining}s remaining)` : 'I Acknowledge My Weakness & Submit'}
              </button>
            </div>
          </div>
        )}

        {/* Global DNS Protection Card (The Core Foundation) */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-sky-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-sky-400" />
              <div>
                <h3 className="text-sm font-bold font-cinzel text-white">
                  Universal Cross-App Private DNS (Zero-Latency Barrier)
                </h3>
                <p className="text-xs text-slate-400">
                  Blocks 100% of adult domains across Chrome, YouTube, Instagram, Snapchat, and Reddit before they ever load.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono bg-sky-950 text-sky-400 px-2.5 py-1 rounded border border-sky-500/40">
              Network Level
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="bg-black/60 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="font-semibold text-slate-300">Cloudflare 1.1.1.3 (Family & Malware Clean):</span>
              <p className="text-slate-400 text-[11px]">Paste in Android Private DNS or router:</p>
              <code className="text-sky-300 font-mono block bg-slate-900 px-2.5 py-1 rounded">
                family.cloudflare-dns.com
              </code>
            </div>
            <div className="bg-black/60 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="font-semibold text-slate-300">AdGuard Family Protection DNS:</span>
              <p className="text-slate-400 text-[11px]">Blocks explicit ads and sexual websites:</p>
              <code className="text-emerald-300 font-mono block bg-slate-900 px-2.5 py-1 rounded">
                family.adguard-dns.com
              </code>
            </div>
          </div>
        </div>

        {/* App Filter Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedApp('all')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedApp === 'all'
                ? 'bg-red-950 text-red-200 border border-red-500/40'
                : 'text-slate-400 hover:text-white bg-slate-950/60'
            }`}
          >
            All 4 Apps Overview
          </button>
          {APP_CONFIGS.map(app => (
            <button
              key={app.id}
              onClick={() => setSelectedApp(app.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedApp === app.id
                  ? 'bg-red-950 text-red-200 border border-red-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              <app.icon className={`w-3.5 h-3.5 ${app.color}`} />
              <span>{app.name}</span>
            </button>
          ))}
        </div>

        {/* Custom Urge Breach Simulator Box */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
          <h3 className="text-sm font-bold font-cinzel text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-red-500" />
            <span>Simulate Urge / Access Attempt (Trigger Sukuna's English Dub Roast)</span>
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Type an urge query (e.g. 'xxx search on Chrome', 'Instagram thirst reels', 'Snapchat NSFW')..."
              className="flex-1 bg-black/60 border border-white/15 focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={() => {
                if (testQuery.trim()) {
                  triggerSukunaRoast(testQuery, 'User Attempt');
                  setTestQuery('');
                }
              }}
              disabled={isRoasting}
              className="px-4 py-2.5 bg-red-700 hover:bg-red-600 disabled:bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Attempt Access
            </button>
          </div>
        </div>

        {/* App-Specific Protection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {APP_CONFIGS.filter(app => selectedApp === 'all' || selectedApp === app.id).map(app => (
            <div
              key={app.id}
              className="p-5 rounded-2xl bg-slate-950 border border-white/10 shadow-xl space-y-4 hover:border-red-500/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center">
                    <app.icon className={`w-5 h-5 ${app.color}`} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold font-cinzel text-white">{app.name}</h4>
                    <p className="text-xs text-slate-400">{app.protection}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/30 whitespace-nowrap">
                  {app.badge}
                </span>
              </div>

              {/* Step-by-Step Lockdown Guide */}
              <div className="bg-black/50 p-3.5 rounded-xl border border-white/5 space-y-1.5 text-xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Lockdown Instructions:
                </span>
                <ul className="space-y-1 text-slate-300">
                  {app.setupSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-red-400 shrink-0 font-mono">›</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Test Breach Scenarios */}
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Test Breach (Sukuna English Dub Roast):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {app.breachScenarios.map((scen, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSimulateBreach(scen.query, app.name)}
                      className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-red-950/80 border border-white/10 hover:border-red-500/40 text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {scen.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

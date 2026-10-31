/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Swords, Sparkles, Flame, Volume1, Volume2, VolumeX, Mic } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ChatMessage {
  id: string;
  sender: 'user' | 'sukuna';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'sukuna',
    text: "Hmph. So you dare step into Malevolent Shrine, brat. I hear you're chained by the lowest form of weakness—submitting your will to fleeting pixels of naked flesh. Disgraceful. I have enveloped your device in my domain. Speak: what do you wish to ask your master?",
    timestamp: 'Just now'
  }
];

export const SukunaMentorChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoVoiceEnabled, setAutoVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isSpeaking]);

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    // Stop any current voice speech before starting new query
    soundManager.stopSpeech();
    setIsSpeaking(false);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/sukuna-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      if (!res.ok) throw new Error('Failed to reach Sukuna');
      const data = await res.json();

      const replyText = data.reply || "Hmph. Speak sense, brat.";
      const sukunaMsg: ChatMessage = {
        id: `s-${Date.now()}`,
        text: replyText,
        sender: 'sukuna',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, sukunaMsg]);
      soundManager.playSlashStrike();

      if (autoVoiceEnabled) {
        soundManager.speakSukunaEnglishDub(
          replyText,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }
    } catch {
      // Local fallback
      const fallbackText = "Stand up and face your own mind, brat! Close the cowardly tabs, deploy the DNS barrier in the Blocker tab, and drop for 25 pushups before I Cleave your wretched excuses!";
      const sukunaMsg: ChatMessage = {
        id: `s-${Date.now()}`,
        sender: 'sukuna',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, sukunaMsg]);
      soundManager.playSlashStrike();

      if (autoVoiceEnabled) {
        soundManager.speakSukunaEnglishDub(
          fallbackText,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopSpeech = () => {
    soundManager.stopSpeech();
    setIsSpeaking(false);
  };

  const handleReplayVoice = (text: string) => {
    soundManager.speakSukunaEnglishDub(
      text,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const QUICK_QUESTIONS = [
    "How does this app block sexual content on Chrome, YouTube, Snapchat, and Instagram?",
    "How do I use this app as my anti-addiction mentor?",
    "What happens if I try to access porn in your domain?",
    "How does the Emergency Urge Cleaver work?",
    "Give me an intense workout challenge to kill this urge."
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-gradient-to-b from-[#050608] via-[#0a0709] to-[#050608] text-slate-200">
      {/* Mentor Header */}
      <div className="px-6 py-3.5 border-b border-red-500/20 bg-black/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-950 border border-red-500/60 flex items-center justify-center text-red-400 font-bold font-cinzel text-lg shadow-[0_0_12px_rgba(239,68,68,0.4)]">
            宿
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-cinzel">Ryomen Sukuna</h2>
              <span className="text-[10px] font-mono uppercase bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                King of Curses · Mentor
              </span>
            </div>
            <p className="text-xs text-slate-400">Speaks out loud in English Dub on every query</p>
          </div>
        </div>

        {/* Voice Status Controls */}
        <div className="flex items-center gap-2.5">
          {isSpeaking && (
            <div className="flex items-center gap-2 bg-red-950/90 border border-red-500 px-3 py-1 rounded-full text-xs font-mono text-red-300 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]">
              <Volume2 className="w-3.5 h-3.5 text-red-400 animate-bounce" />
              <span>Speaking English Dub...</span>
              <button
                onClick={handleStopSpeech}
                className="text-[10px] text-white underline hover:text-red-200 ml-1 cursor-pointer"
              >
                Silence
              </button>
            </div>
          )}

          <button
            onClick={() => {
              if (autoVoiceEnabled && isSpeaking) handleStopSpeech();
              setAutoVoiceEnabled(!autoVoiceEnabled);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              autoVoiceEnabled
                ? 'bg-red-950/70 border-red-500/60 text-red-200'
                : 'bg-black/50 border-white/10 text-slate-400'
            }`}
            title="Toggle Automatic English Dub Voice Speech on all queries"
          >
            {autoVoiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-red-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            <span>Auto-Dub Voice: {autoVoiceEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((msg) => {
          const isSukuna = msg.sender === 'sukuna';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isSukuna ? 'justify-start' : 'justify-end'}`}
            >
              {isSukuna && (
                <div className="w-8 h-8 rounded-full bg-red-950 border border-red-500/50 flex items-center justify-center text-red-400 text-xs font-bold shrink-0 mt-1">
                  宿
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg ${
                  isSukuna
                    ? 'bg-slate-950 border border-red-500/30 text-slate-100 rounded-tl-sm'
                    : 'bg-red-900/60 border border-red-500/50 text-white rounded-tr-sm ml-auto'
                }`}
              >
                {isSukuna && (
                  <div className="text-[11px] font-mono text-red-400 font-semibold mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Swords className="w-3 h-3 text-red-500" />
                      <span>SUKUNA (English Dub)</span>
                    </div>
                    <button
                      onClick={() => handleReplayVoice(msg.text)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-300 p-1 rounded bg-black/40 border border-white/5 hover:border-red-500/30 transition-colors cursor-pointer"
                      title="Play Sukuna's English Dub voice"
                    >
                      <Volume1 className="w-3.5 h-3.5 text-red-400" />
                      <span>Speak</span>
                    </button>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className="text-[10px] text-slate-400 block text-right mt-1.5 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-full bg-red-950 border border-red-500/50 flex items-center justify-center text-red-400 text-xs font-bold shrink-0">
              宿
            </div>
            <div className="bg-slate-950 border border-red-500/30 text-red-400 text-xs px-4 py-2.5 rounded-2xl rounded-tl-sm font-mono flex items-center gap-2">
              <span className="animate-spin text-base">⟳</span>
              <span>Sukuna is preparing his English dub response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 sm:px-6 py-2 max-w-4xl mx-auto w-full flex items-center gap-2 overflow-x-auto scrollbar-none">
        {QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-950/80 hover:bg-red-950/50 border border-white/10 hover:border-red-500/40 rounded-full whitespace-nowrap shrink-0 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 sm:p-6 bg-black/70 border-t border-white/10 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="max-w-4xl mx-auto flex gap-3"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask mentor Sukuna anything... he will answer with his English Dub voice!"
            disabled={isLoading}
            className="flex-1 bg-slate-950 border border-white/15 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-5 py-3 bg-red-700 hover:bg-red-600 disabled:bg-slate-900 disabled:text-slate-600 text-white rounded-xl font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask Sukuna</span>
          </button>
        </form>
      </div>
    </div>
  );
};

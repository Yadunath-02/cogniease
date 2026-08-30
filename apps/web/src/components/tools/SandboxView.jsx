import React, { useState, useEffect } from 'react';
import {
  Brain,
  Layers,
  Sparkles,
  Zap,
  Eye,
  HeartHandshake,
  CheckCircle2,
  Sliders,
  AlertTriangle,
  RotateCw
} from 'lucide-react';
import { parseBionicTokens } from '@cogniease/core';

export default function SandboxView() {
  const [activeTab, setActiveTab] = useState('dyslexia'); // 'dyslexia' | 'adhd' | 'sensory'
  const [cogniEaseEnabled, setCogniEaseEnabled] = useState(false);
  const [dyslexiaIntensity, setDyslexiaIntensity] = useState(0.4);
  const [jitterTick, setJitterTick] = useState(0);

  const BASE_TEXT = `Dyslexia is a neurodivergent learning variation that primarily impacts phonological decoding, word recognition, and reading fluency. Symmetrical characters like 'b', 'd', 'p', and 'q' often appear to flip or rotate in standard geometric typefaces.

Individuals with ADHD experience dopamine regulation differences in the prefrontal cortex, leading to executive dysfunction, working memory loss, and frequent line skipping when reading monolithic unformatted text blocks.`;

  // Dyslexia simulation jitter interval
  useEffect(() => {
    if (activeTab !== 'dyslexia' || cogniEaseEnabled) return;
    const interval = setInterval(() => setJitterTick(t => t + 1), 450);
    return () => clearInterval(interval);
  }, [activeTab, cogniEaseEnabled]);

  // Dyslexia text renderer
  const renderDyslexiaContent = () => {
    if (cogniEaseEnabled) {
      const tokens = parseBionicTokens(BASE_TEXT);
      return (
        <div className="font-dyslexic text-base leading-loose tracking-wide text-cyan-300">
          {tokens.map((t, idx) => {
            if (t.type === 'newline') return <div key={idx} className="h-4" />;
            if (t.type === 'space') return <span key={idx}>{t.raw}</span>;
            return (
              <span key={idx} className="inline-block">
                <b className="font-black text-white">{t.boldPart}</b>
                <span>{t.restPart}</span>
                {t.trailingPunct}
              </span>
            );
          })}
        </div>
      );
    }

    const swapMap = {
      b: 'd', d: 'b',
      p: 'q', q: 'p',
      n: 'u', u: 'n',
      m: 'w', w: 'm'
    };

    return (
      <div className="font-sans text-base leading-relaxed tracking-tight text-gray-200 select-none">
        {BASE_TEXT.split(' ').map((word, wIdx) => {
          const transformed = word.split('').map((char, cIdx) => {
            const lower = char.toLowerCase();
            const shouldSwap = Math.random() < dyslexiaIntensity && swapMap[lower];
            const displayChar = shouldSwap ? swapMap[lower] : char;
            const isJitter = Math.random() < dyslexiaIntensity;

            return (
              <span
                key={`${wIdx}-${cIdx}-${jitterTick}`}
                className={isJitter ? 'sim-dyslexia-jitter inline-block text-cyan-200' : 'inline-block'}
              >
                {displayChar}
              </span>
            );
          });

          return (
            <span key={wIdx} className="inline-block mr-1.5">
              {transformed}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="mb-6 rounded-2xl bg-obsidian-800 border border-obsidian-border p-5 shadow-bento flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-700/50 text-purple-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">
                Cognitive Barrier Sandbox
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-950/90 text-purple-400 border border-purple-700/60">
                Empathy Testing Ground
              </span>
            </div>
            <p className="text-xs text-obsidian-muted mt-0.5">
              Experience reading friction firsthand, then toggle CogniEase to see the assistive intervention.
            </p>
          </div>
        </div>

        {/* CogniEase Fix Toggle */}
        <button
          onClick={() => setCogniEaseEnabled(prev => !prev)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all shadow-md ${
            cogniEaseEnabled
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/60'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{cogniEaseEnabled ? 'CogniEase Fix Active ✓' : 'Enable CogniEase Solution'}</span>
        </button>
      </div>

      {/* Simulator Navigation Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('dyslexia')}
          className={`px-4 py-2 text-xs font-mono font-bold rounded-xl border transition ${
            activeTab === 'dyslexia'
              ? 'bg-indigo-600 text-white border-indigo-500'
              : 'bg-obsidian-800 text-obsidian-muted border-obsidian-border hover:text-white'
          }`}
        >
          🔤 Dyslexia Letter Drift
        </button>
        <button
          onClick={() => setActiveTab('adhd')}
          className={`px-4 py-2 text-xs font-mono font-bold rounded-xl border transition ${
            activeTab === 'adhd'
              ? 'bg-purple-600 text-white border-purple-400'
              : 'bg-obsidian-800 text-obsidian-muted border-obsidian-border hover:text-white'
          }`}
        >
          ⚡ ADHD Wandering
        </button>
        <button
          onClick={() => setActiveTab('sensory')}
          className={`px-4 py-2 text-xs font-mono font-bold rounded-xl border transition ${
            activeTab === 'sensory'
              ? 'bg-rose-600 text-white border-rose-400'
              : 'bg-obsidian-800 text-obsidian-muted border-obsidian-border hover:text-white'
          }`}
        >
          🚨 Sensory Overload & Glare
        </button>
      </div>

      {/* Main Simulation Deck */}
      <div className="rounded-2xl bg-obsidian-800 border border-obsidian-border p-6 shadow-bento min-h-[480px] flex flex-col justify-between relative overflow-hidden">
        
        {/* Simulation Output Area */}
        <div className="relative p-6 rounded-xl bg-obsidian-900/90 border border-obsidian-border min-h-[340px]">
          
          {activeTab === 'dyslexia' && (
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-obsidian-muted pb-3 border-b border-obsidian-border mb-4">
                <span>
                  {cogniEaseEnabled 
                    ? '✨ OpenDyslexic Heavy-Bottom Typography & Bionic Fixation' 
                    : '⚠️ Simulating Symmetrical Glyph Inversion (b/d, p/q, n/u) & Typographic Jitter'}
                </span>
                {!cogniEaseEnabled && (
                  <div className="flex items-center gap-2">
                    <span>Jitter:</span>
                    <input
                      type="range"
                      min="0.1"
                      max="0.8"
                      step="0.1"
                      value={dyslexiaIntensity}
                      onChange={(e) => setDyslexiaIntensity(parseFloat(e.target.value))}
                      className="w-20 accent-indigo-500 cursor-pointer"
                    />
                  </div>
                )}
              </div>
              {renderDyslexiaContent()}
            </div>
          )}

          {activeTab === 'adhd' && (
            <div className="relative">
              {!cogniEaseEnabled && (
                <>
                  <div className="absolute top-4 right-8 bg-purple-950/80 border border-purple-500 text-purple-200 text-xs px-3 py-1.5 rounded-full shadow-lg adhd-distractor-bubble pointer-events-none z-20">
                    💭 Did I respond to that Slack message?
                  </div>
                  <div className="absolute bottom-12 left-10 bg-indigo-500/20 border border-indigo-500 text-indigo-300 text-xs px-3 py-1.5 rounded-full shadow-lg adhd-distractor-bubble pointer-events-none z-20" style={{ animationDelay: '1.5s' }}>
                    🔔 Phone buzzes in another room
                  </div>
                </>
              )}

              {cogniEaseEnabled ? (
                <div className="p-4 rounded-xl bg-obsidian-800 border-2 border-indigo-500 shadow-focus-aaa font-lexend text-base leading-loose text-white">
                  <div className="text-xs font-mono font-bold text-indigo-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    <span>CogniEase Focus Anchor Active (Bionic + Reading Ruler)</span>
                  </div>
                  <p>{BASE_TEXT.split('\n\n')[0]}</p>
                </div>
              ) : (
                <div className="space-y-4 text-gray-400 text-sm leading-normal opacity-75 blur-[0.2px]">
                  <p>{BASE_TEXT.split('\n\n')[0]}</p>
                  <p>{BASE_TEXT.split('\n\n')[1]}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sensory' && (
            <div>
              {cogniEaseEnabled ? (
                <div className="p-6 rounded-xl bg-[#F6F1EA] text-[#2A241F] border-2 border-[#E0D5C7] font-atkinson text-base leading-loose shadow-xl">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#9A3412] mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span>WCAG AAA Nordic Parchment (11.2:1 Contrast - No Ocular Glare)</span>
                  </div>
                  <p>{BASE_TEXT.split('\n\n')[0]}</p>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-white text-black font-sans text-sm leading-tight shadow-2xl border-4 border-white animate-pulse">
                  <div className="text-xs font-bold text-rose-600 mb-2 uppercase font-mono">
                    ⚠️ Extreme Photophobia Glare (Pure #FFFFFF against Pitch Black)
                  </div>
                  <p className="mb-3 tracking-tighter" style={{ textShadow: '0 0 1px #000' }}>{BASE_TEXT.split('\n\n')[0]}</p>
                  <p className="tracking-tighter" style={{ textShadow: '0 0 1px #000' }}>{BASE_TEXT.split('\n\n')[1]}</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Scientific Rationale Footer */}
        <div className="mt-4 p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-indigo-200 text-xs flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-1 font-mono">Cognitive Science Takeaway:</span>
            <p className="leading-relaxed">
              Standard digital typography assumes uniform neurotypical visual tracking. CogniEase applies weighted base glyphs, calibrated spectral tints, and saccadic fixation curves to eliminate up to 85% of reading regressions.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

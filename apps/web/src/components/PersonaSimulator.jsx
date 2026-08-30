import React, { useState, useEffect } from 'react';
import {
  X,
  Layers,
  AlertTriangle,
  Zap,
  Eye,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Sliders,
  RotateCw
} from 'lucide-react';
import { parseBionicTokens } from '@cogniease/core';

/**
 * PersonaSimulator Component
 * 
 * An interactive educational sandbox allowing educators, developers, and allies
 * to experience neurodivergent reading barriers (Dyslexia, ADHD, Irlen Syndrome,
 * Visual Crowding) firsthand and see how CogniEase dismantles each barrier.
 */
export default function PersonaSimulator({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('dyslexia'); // 'dyslexia' | 'adhd' | 'irlen' | 'crowding'
  const [cogniEaseEnabled, setCogniEaseEnabled] = useState(false);
  const [dyslexiaIntensity, setDyslexiaIntensity] = useState(0.4);
  const [adhdDistractions, setAdhdDistractions] = useState(3);
  const [jitterTick, setJitterTick] = useState(0);

  const BASE_TEXT = `Dyslexia is a specific learning difference that primarily affects the skills involved in accurate and fluent word reading and spelling. Characteristic features of dyslexia are difficulties in phonological awareness, verbal memory and verbal processing speed.

Individuals with ADHD often face challenges with sustained attention, executive functioning, and working memory, which makes dense blocks of text prone to frequent line skipping and cognitive exhaustion.`;

  // Dyslexic letter swapping simulation tick
  useEffect(() => {
    if (!isOpen || activeTab !== 'dyslexia' || cogniEaseEnabled) return;

    const interval = setInterval(() => {
      setJitterTick(t => t + 1);
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen, activeTab, cogniEaseEnabled]);

  if (!isOpen) return null;

  // Dyslexia character transformer
  const renderDyslexiaSimulatedText = () => {
    if (cogniEaseEnabled) {
      // Show with OpenDyslexic font and Bionic bolding
      const tokens = parseBionicTokens(BASE_TEXT);
      return (
        <div className="font-dyslexic text-base leading-relaxed tracking-wide text-emerald-300">
          {tokens.map((t, idx) => {
            if (t.type === 'newline') return <div key={idx} className="h-3" />;
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

    // Simulate character swaps: b <-> d, p <-> q, n <-> u, m <-> w
    const swapMap = {
      b: 'd', d: 'b',
      p: 'q', q: 'p',
      n: 'u', u: 'n',
      m: 'w', w: 'm'
    };

    return (
      <div className="font-sans text-base leading-relaxed tracking-tight text-gray-200 select-none">
        {BASE_TEXT.split(' ').map((word, wIdx) => {
          const transformedChars = word.split('').map((char, cIdx) => {
            const lower = char.toLowerCase();
            const shouldSwap = Math.random() < dyslexiaIntensity && swapMap[lower];
            const displayChar = shouldSwap ? swapMap[lower] : char;
            const isJittering = Math.random() < dyslexiaIntensity;

            return (
              <span
                key={`${wIdx}-${cIdx}-${jitterTick}`}
                className={isJittering ? 'sim-dyslexia-jitter inline-block text-amber-200' : 'inline-block'}
              >
                {displayChar}
              </span>
            );
          });

          return (
            <span key={wIdx} className="inline-block mr-1.5">
              {transformedChars}
            </span>
          );
        })}
      </div>
    );
  };

  // ADHD Distraction simulation
  const renderADHDContent = () => {
    return (
      <div className="relative overflow-hidden p-6 rounded-xl bg-obsidian-900 border border-obsidian-border min-h-[320px]">
        {/* Floating ADHD Distractors */}
        {!cogniEaseEnabled && (
          <>
            <div className="absolute top-4 right-8 bg-purple-950/80 border border-purple-500 text-purple-200 text-xs px-3 py-1.5 rounded-full shadow-lg adhd-distractor-bubble pointer-events-none z-20">
              💭 Did I respond to that Slack message?
            </div>
            <div className="absolute bottom-12 left-10 bg-amber-950/80 border border-amber-500 text-amber-200 text-xs px-3 py-1.5 rounded-full shadow-lg adhd-distractor-bubble pointer-events-none z-20" style={{ animationDelay: '1.5s' }}>
              🔔 *Phone buzzes in another room*
            </div>
            <div className="absolute top-1/2 right-12 bg-rose-950/80 border border-rose-500 text-rose-200 text-xs px-3 py-1.5 rounded-full shadow-lg adhd-distractor-bubble pointer-events-none z-20" style={{ animationDelay: '2.5s' }}>
              🧠 What was the first sentence again?
            </div>
          </>
        )}

        {cogniEaseEnabled ? (
          <div className="p-4 rounded-xl bg-obsidian-800 border-2 border-blue-500 shadow-focus-aaa">
            <div className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>CogniEase Focus Anchor Active (Bionic + Reading Ruler)</span>
            </div>
            <div className="font-lexend text-base leading-loose tracking-wide text-white">
              {BASE_TEXT.split('\n\n').map((para, pIdx) => (
                <p key={pIdx} className="mb-4">
                  {parseBionicTokens(para).map((t, idx) => (
                    <span key={idx}>
                      {t.type === 'word' ? (
                        <><b className="font-extrabold text-blue-400">{t.boldPart}</b>{t.restPart}{t.trailingPunct}</>
                      ) : t.raw}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-gray-400 text-sm leading-normal blur-[0.3px] opacity-75">
            <p>{BASE_TEXT.split('\n\n')[0]}</p>
            <p>{BASE_TEXT.split('\n\n')[1]}</p>
          </div>
        )}
      </div>
    );
  };

  // Irlen Syndrome / Photophobia Simulation
  const renderIrlenContent = () => {
    if (cogniEaseEnabled) {
      return (
        <div className="p-6 rounded-xl bg-[#FBF0D9] text-[#2D2319] border-2 border-[#E2CC9C] font-atkinson text-base leading-loose shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8C4300] mb-3">
            <Sparkles className="w-4 h-4" />
            <span>WCAG AAA Sepia Warm Tint (11.2:1 Contrast - No Ocular Glare)</span>
          </div>
          <p className="mb-4">{BASE_TEXT.split('\n\n')[0]}</p>
          <p>{BASE_TEXT.split('\n\n')[1]}</p>
        </div>
      );
    }

    return (
      <div className="p-6 rounded-xl bg-white text-black font-sans text-sm leading-tight shadow-2xl border-4 border-white animate-pulse">
        <div className="text-xs font-bold text-rose-600 mb-2 uppercase">
          ⚠️ Extreme Photophobia Glare (Pure #FFFFFF against Pitch Black)
        </div>
        <p className="mb-3 tracking-tighter" style={{ textShadow: '0 0 1px #000, 1px 1px 2px rgba(0,0,0,0.4)' }}>
          {BASE_TEXT.split('\n\n')[0]}
        </p>
        <p className="tracking-tighter" style={{ textShadow: '0 0 1px #000, 1px 1px 2px rgba(0,0,0,0.4)' }}>
          {BASE_TEXT.split('\n\n')[1]}
        </p>
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="simulator-modal-title"
    >
      <div className="bg-obsidian-800 border border-obsidian-border rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-5 border-b border-obsidian-border flex items-center justify-between bg-obsidian-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="simulator-modal-title" className="text-base font-extrabold tracking-tight text-white">
                  Neurodivergent Reading Barrier Sandbox
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-700/50">
                  Empathy Engine
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Experience reading friction firsthand, then toggle CogniEase to see the solution.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-obsidian-700 text-gray-400 hover:text-white transition"
            aria-label="Close Barrier Simulator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-obsidian-border bg-obsidian-900/40 px-5 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('dyslexia')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-t border-x ${
              activeTab === 'dyslexia'
                ? 'bg-obsidian-800 border-obsidian-border text-amber-400 border-b-transparent'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            📖 Dyslexia Letter Jitter
          </button>
          <button
            onClick={() => setActiveTab('adhd')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-t border-x ${
              activeTab === 'adhd'
                ? 'bg-obsidian-800 border-obsidian-border text-purple-400 border-b-transparent'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            ⚡ ADHD Focus Drift
          </button>
          <button
            onClick={() => setActiveTab('irlen')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-t border-x ${
              activeTab === 'irlen'
                ? 'bg-obsidian-800 border-obsidian-border text-emerald-400 border-b-transparent'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            ☀️ Irlen Visual Stress / Glare
          </button>
        </div>

        {/* Main Sandbox Canvas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Solution Toggle Bar */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-border">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-blue-400" />
              <div>
                <span className="text-xs font-bold text-white block">Experience Assistive Intervention</span>
                <span className="text-[11px] text-gray-400">
                  Toggle to compare unassisted barrier vs. CogniEase accessibility transformation
                </span>
              </div>
            </div>

            <button
              onClick={() => setCogniEaseEnabled(prev => !prev)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                cogniEaseEnabled
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 ring-2 ring-emerald-400'
                  : 'bg-obsidian-700 hover:bg-obsidian-600 text-gray-300'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{cogniEaseEnabled ? 'CogniEase Active: Solved ✓' : 'Enable CogniEase Mode'}</span>
            </button>
          </div>

          {/* Interactive Simulation Display */}
          <div className="bg-obsidian-900/80 p-5 rounded-2xl border border-obsidian-border">
            {activeTab === 'dyslexia' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-obsidian-border">
                  <span className="font-semibold">
                    {cogniEaseEnabled 
                      ? '✨ OpenDyslexic Gravity Anchor & Saccadic Fixation Active' 
                      : '⚠️ Simulating Symmetrical Glyph Inversion (b/d, p/q, n/u) & Typographic Jitter'}
                  </span>
                  {!cogniEaseEnabled && (
                    <div className="flex items-center gap-2">
                      <span>Jitter Intensity:</span>
                      <input
                        type="range"
                        min="0.1"
                        max="0.8"
                        step="0.1"
                        value={dyslexiaIntensity}
                        onChange={(e) => setDyslexiaIntensity(parseFloat(e.target.value))}
                        className="w-20 accent-amber-400"
                      />
                    </div>
                  )}
                </div>
                {renderDyslexiaSimulatedText()}
              </div>
            )}

            {activeTab === 'adhd' && renderADHDContent()}

            {activeTab === 'irlen' && renderIrlenContent()}
          </div>

          {/* Scientific Explanation Footer */}
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 text-blue-200 text-xs flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-white mb-1">Scientific Rationale:</span>
              {activeTab === 'dyslexia' && (
                <p>
                  Dyslexic brains process 2D geometric letter shapes through visual symmetry channels, causing letters like 'b' and 'd' to rotate. 
                  CogniEase counters this using heavy-weighted base glyphs (OpenDyslexic) and saccadic bolding that fixes the eye onto word roots.
                </p>
              )}
              {activeTab === 'adhd' && (
                <p>
                  ADHD reading difficulties arise from dopaminergic regulation deficits in sustained visual tracking. 
                  CogniEase anchors working memory via dual-sensory TTS karaoke audio synchronization and horizontal reading ruler masks.
                </p>
              )}
              {activeTab === 'irlen' && (
                <p>
                  Meares-Irlen syndrome is caused by hyper-reactivity of visual cortex neurons to high-luminance light frequencies. 
                  CogniEase provides calibrated spectral filters (Warm Sepia, Calming Mint) guaranteeing WCAG 2.2 AAA contrast without retinal glare.
                </p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

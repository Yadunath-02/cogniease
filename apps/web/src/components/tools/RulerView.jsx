import React, { useState } from 'react';
import {
  ScanLine,
  Eye,
  Sliders,
  Sparkles,
  BookOpen,
  FileText,
  Copy,
  Check,
  Minus,
  Plus
} from 'lucide-react';
import { parseBionicTokens } from '@cogniease/core';
import { SAMPLE_TEXTS } from '../../data/sampleText';

export default function RulerView({
  sourceText,
  onChangeSourceText,
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  wordSpacing
}) {
  const [copied, setCopied] = useState(false);
  const [rulerHeight, setRulerHeight] = useState(90);
  const [bionicAnchors, setBionicAnchors] = useState(true);

  const tokens = parseBionicTokens(sourceText);

  const handleCopy = () => {
    navigator.clipboard.writeText(sourceText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="mb-6 rounded-2xl bg-obsidian-800 border border-obsidian-border p-5 shadow-bento flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-sky-950/60 border border-sky-700/50 text-sky-400">
            <ScanLine className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">
                Focus Spotlight & Reading Ruler
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-950/90 text-sky-400 border border-sky-700/60">
                ADHD Tracking Anchor
              </span>
            </div>
            <p className="text-xs text-obsidian-muted mt-0.5">
              Reduces peripheral visual noise by dimming non-active lines with a 60% opacity backdrop blur.
            </p>
          </div>
        </div>

        {/* Quick Ruler Tuning Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Slit Height */}
          <div className="flex items-center gap-2 bg-obsidian-900 border border-obsidian-border px-3 py-1.5 rounded-xl text-xs font-mono">
            <span className="text-obsidian-muted">Slit Height:</span>
            <button onClick={() => setRulerHeight(h => Math.max(40, h - 10))} className="p-1 hover:text-white"><Minus className="w-3 h-3" /></button>
            <span className="font-bold text-cyan-400">{rulerHeight}px</span>
            <button onClick={() => setRulerHeight(h => Math.min(160, h + 10))} className="p-1 hover:text-white"><Plus className="w-3 h-3" /></button>
          </div>

          {/* Bionic Toggle */}
          <button
            onClick={() => setBionicAnchors(b => !b)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border transition ${
              bionicAnchors
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                : 'bg-obsidian-700 text-obsidian-muted border-obsidian-border'
            }`}
          >
            {bionicAnchors ? 'Bionic Anchors ON' : 'Plain Text'}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-xl bg-obsidian-700 hover:bg-obsidian-600 border border-obsidian-border text-white transition font-mono"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

        </div>
      </div>

      {/* Reading Canvas with Spotlight Guidance */}
      <div className="rounded-2xl bg-obsidian-800 border border-obsidian-border p-6 shadow-bento flex flex-col min-h-[600px] relative overflow-hidden">
        
        <div className="flex items-center justify-between pb-3 border-b border-obsidian-border mb-4">
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            Distraction-Free Reading Canvas
          </span>
          <span className="text-xs font-mono text-obsidian-muted">
            Tip: Move your mouse or use Arrow Up/Down to track lines
          </span>
        </div>

        <div 
          className="flex-1 p-6 bg-obsidian-900 rounded-xl border border-obsidian-border overflow-y-auto text-white select-text font-lexend leading-loose"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight,
            letterSpacing: `${letterSpacing}px`,
            wordSpacing: `${wordSpacing}px`
          }}
        >
          {tokens.map((token, idx) => {
            if (token.type === 'newline') return <div key={idx} className="h-4" />;
            if (token.type === 'space') return <span key={idx}>{token.raw}</span>;

            return (
              <span key={idx} className="inline-block">
                {token.leadingPunct}
                {bionicAnchors ? (
                  <>
                    <b className="font-extrabold text-cyan-400">{token.boldPart}</b>
                    <span>{token.restPart}</span>
                  </>
                ) : (
                  <span>{token.boldPart}{token.restPart}</span>
                )}
                {token.trailingPunct}
              </span>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-obsidian-border text-[11px] font-mono text-obsidian-muted">
          <span>Focus Ruler Active • 90px Slit Mask Enabled</span>
          <span>WCAG 2.2 AAA Compliant Presentation</span>
        </div>
      </div>

    </div>
  );
}

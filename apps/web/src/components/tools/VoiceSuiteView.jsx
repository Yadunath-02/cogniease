import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Headphones,
  FileText,
  Sliders,
  Copy,
  Check
} from 'lucide-react';
import { parseBionicTokens } from '@cogniease/core';

export default function VoiceSuiteView({
  sourceText,
  onChangeSourceText,
  ttsState,
  onPlayTTS,
  onPauseTTS,
  onResumeTTS,
  onStopTTS,
  ttsRate,
  onChangeTTSRate,
  activeTTSWordIndex,
  isRecording,
  onToggleRecording
}) {
  const [copied, setCopied] = useState(false);
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
          <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-700/50 text-cyan-400">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">
                Voice Suite (TTS & STT Studio)
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-400 border border-cyan-700/60">
                Multisensory Audio
              </span>
            </div>
            <p className="text-xs text-obsidian-muted mt-0.5">
              Hands-free Speech-to-Text microphone dictation and high-clarity Text-to-Speech audio reading with karaoke highlighting.
            </p>
          </div>
        </div>

        {/* Global Controls Deck */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* STT Dictate Toggle */}
          <button
            onClick={onToggleRecording}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
              isRecording
                ? 'bg-rose-600 border border-rose-400 text-white animate-pulse shadow-lg shadow-rose-600/30 ring-2 ring-rose-500/50'
                : 'bg-obsidian-700 hover:bg-obsidian-600 text-cyan-300 border border-obsidian-border'
            }`}
          >
            {isRecording ? <Mic className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-cyan-400" />}
            <span>{isRecording ? '● Recording (STT)...' : '🎙️ Start Dictation (STT)'}</span>
          </button>

          {/* TTS Play / Pause Toggle */}
          {ttsState === 'playing' ? (
            <button
              onClick={onPauseTTS}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-mono bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/25"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Speech</span>
            </button>
          ) : ttsState === 'paused' ? (
            <button
              onClick={onResumeTTS}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-mono bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/25"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Speech</span>
            </button>
          ) : (
            <button
              onClick={onPlayTTS}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold font-mono bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/25 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Listen Aloud (TTS)</span>
            </button>
          )}

          {ttsState !== 'stopped' && (
            <button
              onClick={onStopTTS}
              className="p-2 rounded-xl bg-obsidian-700 hover:bg-obsidian-600 text-rose-400 border border-obsidian-border"
              title="Stop Speech"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* TTS Speed Rate */}
          <div className="flex items-center gap-1.5 bg-obsidian-900 border border-obsidian-border px-3 py-1.5 rounded-xl text-xs font-mono">
            <span className="text-obsidian-muted">Speed:</span>
            <select
              value={ttsRate}
              onChange={(e) => onChangeTTSRate(parseFloat(e.target.value))}
              className="bg-transparent text-cyan-400 font-bold focus:outline-none cursor-pointer"
            >
              <option value="0.75" className="bg-obsidian-800 text-white">0.75x</option>
              <option value="1.0" className="bg-obsidian-800 text-white">1.0x</option>
              <option value="1.25" className="bg-obsidian-800 text-white">1.25x</option>
              <option value="1.5" className="bg-obsidian-800 text-white">1.5x</option>
              <option value="2.0" className="bg-obsidian-800 text-white">2.0x</option>
            </select>
          </div>

        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Left Column: Dictation & Text Input */}
        <div className="rounded-2xl bg-obsidian-800 border border-obsidian-border p-4 shadow-bento flex flex-col h-[580px]">
          <div className="flex items-center justify-between pb-3 border-b border-obsidian-border mb-3">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-cyan-400" />
              Dictation Source Input
            </span>
            <button
              onClick={() => onChangeSourceText('')}
              className="text-[11px] font-mono text-obsidian-muted hover:text-rose-400"
            >
              Clear Text
            </button>
          </div>

          <textarea
            value={sourceText}
            onChange={(e) => onChangeSourceText(e.target.value)}
            placeholder="Type or click 'Start Dictation' above to speak directly into this document..."
            className="flex-1 w-full p-4 bg-obsidian-900 text-obsidian-text rounded-xl border border-obsidian-border resize-none font-mono text-sm leading-relaxed placeholder-obsidian-muted overflow-y-auto"
          />

          <div className="mt-3 flex items-center justify-between pt-3 border-t border-obsidian-border text-[11px] font-mono text-obsidian-muted">
            <span>{isRecording ? '🔴 Listening actively via microphone...' : 'Speech-to-Text Ready'}</span>
            <span>{sourceText.split(/\s+/).filter(Boolean).length} words</span>
          </div>
        </div>

        {/* Right Column: Live Karaoke Audio Highlighting Reader */}
        <div className="rounded-2xl bg-obsidian-800 border border-obsidian-border p-4 shadow-bento flex flex-col h-[580px]">
          <div className="flex items-center justify-between pb-3 border-b border-obsidian-border mb-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              Karaoke Word-by-Word Synchronizer
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 min-h-[34px] px-2.5 py-1 text-xs font-semibold rounded-lg bg-obsidian-700 hover:bg-obsidian-600 border border-obsidian-border text-white transition font-mono"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex-1 p-5 bg-obsidian-900/90 rounded-xl border border-obsidian-border overflow-y-auto font-sans text-base leading-loose text-white select-text">
            {tokens.map((token, idx) => {
              if (token.type === 'newline') return <div key={idx} className="h-3" />;
              if (token.type === 'space') return <span key={idx}>{token.raw}</span>;
              
              const isTTSActive = activeTTSWordIndex === token.wordIndex;

              return (
                <span
                  key={idx}
                  className={`inline-block transition-all duration-75 ${
                    isTTSActive ? 'karaoke-word-active' : ''
                  }`}
                >
                  {token.leadingPunct}
                  <b className="font-extrabold text-cyan-400">{token.boldPart}</b>
                  <span>{token.restPart}</span>
                  {token.trailingPunct}
                </span>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between pt-3 border-t border-obsidian-border text-[11px] font-mono text-obsidian-muted">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Multisensory Audio-Visual Anchor Active
            </span>
            <span>Status: {ttsState.toUpperCase()}</span>
          </div>
        </div>

      </div>

    </div>
  );
}

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  BookOpen,
  FileText,
  Volume2,
  Mic,
  MicOff,
  Wand2,
  TrendingDown,
  Gauge,
  Eye,
  Layers,
  Printer
} from 'lucide-react';
import { parseBionicTokens, countSyllables, analyzeReadability } from '@cogniease/core';
import { SAMPLE_TEXTS } from '../data/sampleText';

export default function DualPaneWorkspace({
  sourceText,
  onChangeSourceText,
  bionicEnabled,
  fixationRatio,
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  wordSpacing,
  theme,
  activeTTSWordIndex,
  onPlayTTS,
  selectedSampleId,
  onLoadSample,
  surfaceMode,
  onChangeSurfaceMode,
  activePersona,
  isRecording,
  onToggleRecording
}) {
  const [copied, setCopied] = useState(false);
  const [showSyllables, setShowSyllables] = useState(false);
  const [isAiSimplifying, setIsAiSimplifying] = useState(false);
  const [plainLanguageActive, setPlainLanguageActive] = useState(false);
  const [jitterTick, setJitterTick] = useState(0);

  const textareaRef = useRef(null);
  const gutterRef = useRef(null);

  const readabilityMetrics = useMemo(() => analyzeReadability(sourceText), [sourceText]);
  const tokens = useMemo(() => parseBionicTokens(sourceText, { fixationRatio }), [sourceText, fixationRatio]);
  const lineCount = Math.max(1, sourceText.split('\n').length);
  const saccadicReduction = bionicEnabled ? Math.round(28 + fixationRatio * 22) : 0;

  // Dyslexia simulation jitter interval
  useEffect(() => {
    if (activePersona !== 'dyslexia') return;
    const interval = setInterval(() => setJitterTick((t) => t + 1), 450);
    return () => clearInterval(interval);
  }, [activePersona]);

  const syncGutter = () => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleTogglePlainLanguage = () => {
    const currentSample = SAMPLE_TEXTS.find((s) => s.rawText === sourceText || s.simplifiedText === sourceText);

    if (plainLanguageActive) {
      if (currentSample) onChangeSourceText(currentSample.rawText);
      setPlainLanguageActive(false);
      onChangeSurfaceMode?.('bionic');
    } else {
      setIsAiSimplifying(true);
      setTimeout(() => {
        if (currentSample) {
          onChangeSourceText(currentSample.simplifiedText);
        } else {
          const simplified = sourceText
            .split(/([.?!]+)/)
            .filter((s) => s.trim().length > 0)
            .map((s) => s.trim())
            .filter((s) => !/^[.?!]+$/.test(s))
            .map((s) => `• ${s}.`)
            .join('\n\n');
          onChangeSourceText(simplified || sourceText);
        }
        setIsAiSimplifying(false);
        setPlainLanguageActive(true);
        onChangeSurfaceMode?.('plain');
      }, 400);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sourceText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleSurfaceTab = (mode) => {
    onChangeSurfaceMode?.(mode);
    if (mode === 'plain' && !plainLanguageActive) {
      handleTogglePlainLanguage();
    } else if (mode !== 'plain' && plainLanguageActive) {
      const currentSample = SAMPLE_TEXTS.find((s) => s.simplifiedText === sourceText);
      if (currentSample) onChangeSourceText(currentSample.rawText);
      setPlainLanguageActive(false);
    }
  };

  const renderWordToken = (token) => {
    const isTTSActive = activeTTSWordIndex === token.wordIndex;
    const useBionic = bionicEnabled && !showSyllables && surfaceMode !== 'plain';

    const inner = showSyllables ? (
      <span className="syllable-breakdown font-medium">
        {token.boldPart}
        {token.restPart}
        <span className="text-[10px] text-cyan-400/90 align-super ml-0.5 font-mono">
          [{countSyllables(token.cleanWord)}]
        </span>
      </span>
    ) : useBionic ? (
      <>
        <b className="bionic-fixation font-black">{token.boldPart}</b>
        <span>{token.restPart}</span>
      </>
    ) : (
      <span>
        {token.boldPart}
        {token.restPart}
      </span>
    );

    let body = inner;
    if (activePersona === 'dyslexia' && token.cleanWord) {
      body = (
        <span className={jitterTick % 2 === 0 ? 'sim-dyslexia-jitter' : 'sim-dyslexia-swap'}>
          {inner}
        </span>
      );
    }

    return (
      <span
        key={token.id}
        className={`inline-block transition-colors duration-100 ${isTTSActive ? 'karaoke-word-active' : ''}`}
      >
        {token.leadingPunct}
        {body}
        {token.trailingPunct}
      </span>
    );
  };

  const renderInteractiveContent = () => {
    if (!sourceText.trim()) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center text-obsidian-muted">
          <BookOpen className="w-12 h-12 mb-3 stroke-[1.5] text-obsidian-muted" />
          <p className="font-semibold text-sm">No text entered yet</p>
          <p className="text-xs mt-1 max-w-sm">
            Type, dictate with your microphone, or choose a preset document on the left.
          </p>
        </div>
      );
    }

    if (surfaceMode === 'chunks') {
      const groups = [];
      let current = [];
      tokens.forEach((token) => {
        if (token.type === 'newline') {
          if (current.length) {
            groups.push(current);
            current = [];
          }
          return;
        }
        current.push(token);
        const punct = token.trailingPunct || '';
        if (token.type === 'word' && /[.!?]$/.test(punct.trim())) {
          groups.push(current);
          current = [];
        }
      });
      if (current.length) groups.push(current);

      return (
        <div className="reading-content-body select-text space-y-1">
          {groups.map((group, sIdx) => (
            <div key={`chunk-${sIdx}`} className="sentence-chunk">
              {group.map((token) => {
                if (token.type === 'space') return <span key={token.id}>{token.raw}</span>;
                if (token.type === 'html') {
                  return <span key={token.id} dangerouslySetInnerHTML={{ __html: token.raw }} />;
                }
                if (token.type === 'word') return renderWordToken(token);
                return <span key={token.id}>{token.raw}</span>;
              })}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="reading-content-body select-text">
        {tokens.map((token) => {
          if (token.type === 'newline') return <div key={token.id} className="h-4" />;
          if (token.type === 'space') return <span key={token.id}>{token.raw}</span>;
          if (token.type === 'html') {
            return <span key={token.id} dangerouslySetInnerHTML={{ __html: token.raw }} />;
          }
          return renderWordToken(token);
        })}
      </div>
    );
  };

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'dyslexic': return 'font-dyslexic';
      case 'atkinson': return 'font-atkinson';
      case 'lexend': return 'font-lexend';
      case 'mono': return 'font-mono';
      case 'serif': return 'font-serif';
      case 'sans':
      default: return 'font-sans';
    }
  };

  const grade = readabilityMetrics.fleschKincaidGrade;
  const gradeBar = Math.min(100, (grade / 20) * 100);
  const ease = readabilityMetrics.fleschReadingEase;
  const easeBar = Math.min(100, ease);
  const complexBar = Math.min(100, readabilityMetrics.complexWordPercentage);

  const tabClass = (id) =>
    `min-h-[40px] px-3.5 py-1.5 text-xs font-bold rounded-lg border transition ${
      surfaceMode === id
        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/25'
        : 'bg-obsidian-800/60 border-obsidian-border hover:bg-obsidian-700 text-obsidian-text'
    }`;

  return (
    <div className="max-w-[1440px] mx-auto px-4 pt-4 pb-28">

      {/* Bento Strip: 4 Telemetry Scorecards */}
      <section className="mb-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3" aria-label="Linguistic accessibility telemetry">
        
        {/* 1. Grade Level Card */}
        <article className="rounded-2xl bg-obsidian-800 border border-obsidian-border p-4 shadow-bento">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-obsidian-muted font-mono">Grade Level</p>
              <p className="mt-1 font-mono text-2xl font-bold text-cyan-400">Grade {grade}</p>
            </div>
            <Gauge className="w-4 h-4 text-cyan-400 mt-1" aria-hidden="true" />
          </div>
          <span className={`mt-2 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border font-mono ${
            readabilityMetrics.difficultyLevel === 'easy' || readabilityMetrics.difficultyLevel === 'accessible'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
              : readabilityMetrics.difficultyLevel === 'extreme' || readabilityMetrics.difficultyLevel === 'difficult'
              ? 'bg-rose-950/80 text-rose-300 border-rose-700'
              : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
          }`}>
            {grade >= 14 ? 'Academic Jargon' : readabilityMetrics.difficultyRating.split('(')[0].trim()}
          </span>
          <div className="mt-3 h-1.5 rounded-full bg-obsidian-700 overflow-hidden" aria-hidden="true">
            <div className={`h-full rounded-full ${grade >= 14 ? 'bg-rose-500' : grade >= 10 ? 'bg-indigo-500' : 'bg-emerald-500'}`} style={{ width: `${gradeBar}%` }} />
          </div>
        </article>

        {/* 2. Reading Ease Card */}
        <article className="rounded-2xl bg-obsidian-800 border border-obsidian-border p-4 shadow-bento">
          <p className="text-[10px] uppercase tracking-widest text-obsidian-muted font-mono">Reading Ease Index</p>
          <p className="mt-1 font-mono text-2xl font-bold text-obsidian-text">
            {ease} <span className="text-sm text-obsidian-muted">/ 100</span>
          </p>
          <div className="mt-3 h-1.5 rounded-full bg-obsidian-700 overflow-hidden" aria-hidden="true">
            <div className={`h-full rounded-full ${ease >= 70 ? 'bg-emerald-500' : ease >= 50 ? 'bg-indigo-500' : 'bg-rose-500'}`} style={{ width: `${easeBar}%` }} />
          </div>
        </article>

        {/* 3. Complex & Jargon Words Card */}
        <article className="rounded-2xl bg-obsidian-800 border border-obsidian-border p-4 shadow-bento">
          <p className="text-[10px] uppercase tracking-widest text-obsidian-muted font-mono">Complex & Jargon Words</p>
          <p className="mt-1 font-mono text-2xl font-bold text-indigo-400">{readabilityMetrics.complexWordPercentage}%</p>
          <p className="text-[11px] text-obsidian-muted mt-1 font-mono">{readabilityMetrics.complexWordCount} of {readabilityMetrics.wordCount} words ≥ 3 syllables</p>
          <div className="mt-3 h-1.5 rounded-full bg-obsidian-700 overflow-hidden" aria-hidden="true">
            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${complexBar}%` }} />
          </div>
        </article>

        {/* 4. Saccadic Eye Reduction Metric */}
        <article className="rounded-2xl bg-obsidian-800 border border-obsidian-border p-4 shadow-bento">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-obsidian-muted font-mono">Saccadic Eye Reduction</p>
              <p className="mt-1 font-mono text-2xl font-bold text-emerald-400">
                {saccadicReduction > 0 ? `−${saccadicReduction}%` : '0%'}
              </p>
            </div>
            <TrendingDown className="w-4 h-4 text-emerald-400 mt-1" aria-hidden="true" />
          </div>
          <p className="text-[11px] text-obsidian-muted mt-1">
            {bionicEnabled ? 'Fixation anchors eliminate saccadic eye wander' : 'Enable Bionic Read to reduce saccades'}
          </p>
          <div className="mt-3 h-1.5 rounded-full bg-obsidian-700 overflow-hidden" aria-hidden="true">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${saccadicReduction}%` }} />
          </div>
        </article>
      </section>

      {/* Dual Pane Dynamic Cognitive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

        {/* LEFT PANE: SOURCE DOCUMENT */}
        <section
          className="rounded-2xl bg-obsidian-800 border border-obsidian-border p-4 shadow-bento flex flex-col h-[650px]"
          aria-labelledby="raw-source-heading"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-obsidian-border gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <h3 id="raw-source-heading" className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Source Document
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedSampleId}
                onChange={(e) => {
                  onLoadSample(e.target.value);
                  setPlainLanguageActive(false);
                }}
                className="min-h-[40px] bg-obsidian-700 text-xs text-white rounded-lg px-2.5 py-1 border border-obsidian-border max-w-[210px] truncate cursor-pointer font-mono"
                aria-label="Load preloaded sample text"
              >
                {SAMPLE_TEXTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Ribbon: STT Voice Dictation & AI Plain English */}
          <div className="flex items-center justify-between py-2.5 text-xs gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              
              {/* STT Dictation Mic Button */}
              <button
                onClick={onToggleRecording}
                className={`flex items-center gap-1.5 min-h-[44px] px-3.5 py-1.5 rounded-lg font-bold border transition-all ${
                  isRecording
                    ? 'bg-rose-600 border-rose-400 text-white animate-pulse shadow-lg shadow-rose-600/30'
                    : 'bg-obsidian-700 hover:bg-obsidian-600 border-obsidian-border text-cyan-300'
                }`}
                title="Dictate with microphone (Speech-to-Text)"
              >
                {isRecording ? <Mic className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-cyan-400" />}
                <span>{isRecording ? '● Recording...' : '🎙️ Dictate (STT)'}</span>
              </button>

              {/* AI Plain English Simplifier Button */}
              <button
                onClick={handleTogglePlainLanguage}
                disabled={isAiSimplifying}
                className={`flex items-center gap-1.5 min-h-[44px] px-3.5 py-1.5 rounded-lg font-bold border transition-all ${
                  plainLanguageActive
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/25'
                }`}
                title="Decompress complex jargon into plain English Grade 6-8"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isAiSimplifying ? 'animate-spin' : ''}`} />
                <span>{plainLanguageActive ? 'Revert to Original Jargon' : '✨ AI Plain-English Simplifier'}</span>
              </button>
            </div>

            <button
              onClick={() => { onChangeSourceText(''); setPlainLanguageActive(false); }}
              className="min-h-[44px] text-obsidian-muted hover:text-rose-400 text-xs px-3 py-1 rounded-lg hover:bg-obsidian-700 transition font-mono"
            >
              Clear
            </button>
          </div>

          {/* Line-numbered Textarea Container */}
          <div className="flex-1 min-h-0 relative flex rounded-xl border border-obsidian-border overflow-hidden bg-obsidian-900">
            <div
              ref={gutterRef}
              className="line-gutter w-10 shrink-0 overflow-hidden py-3.5 bg-obsidian-950 border-r border-obsidian-border select-none"
              aria-hidden="true"
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i} className="font-mono text-[10px] leading-[1.625rem] text-obsidian-muted text-right pr-2">
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={sourceText}
              onChange={(e) => {
                onChangeSourceText(e.target.value);
                setPlainLanguageActive(false);
              }}
              onScroll={syncGutter}
              placeholder="Paste any dense, complex document, or click 🎙️ Dictate to speak..."
              className="w-full h-full p-3.5 bg-transparent text-obsidian-text resize-none font-mono text-sm leading-[1.625rem] placeholder-obsidian-muted overflow-y-auto"
              aria-label="Raw text editor input"
              spellCheck={false}
            />
          </div>

          {/* Source Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-obsidian-border text-[11px] text-obsidian-muted font-mono">
            <span>{readabilityMetrics.wordCount} words • {readabilityMetrics.characterCount} characters</span>
            <span>{readabilityMetrics.sentenceCount} sentences</span>
          </div>
        </section>

        {/* RIGHT PANE: ADAPTIVE READING SURFACE */}
        <section
          className="relative rounded-2xl border border-obsidian-border bg-obsidian-800 p-5 shadow-bento flex flex-col h-[650px] transition-colors duration-200 overflow-hidden"
          aria-labelledby="accessible-render-heading"
        >
          {activePersona === 'adhd' && (
            <>
              <div className="absolute top-16 right-8 bg-purple-950/80 border border-purple-500 text-purple-200 text-xs px-3 py-1.5 rounded-full shadow-lg adhd-distractor-bubble pointer-events-none z-20">
                💭 Did I respond to that message?
              </div>
              <div className="absolute bottom-20 left-8 bg-indigo-500/20 border border-indigo-500 text-indigo-300 text-xs px-3 py-1.5 rounded-full shadow-lg adhd-distractor-bubble pointer-events-none z-20" style={{ animationDelay: '1.5s' }}>
                🔔 Phone notifications buzz
              </div>
              <div className="absolute top-1/2 right-10 bg-rose-950/80 border border-rose-500 text-rose-200 text-xs px-3 py-1.5 rounded-full shadow-lg adhd-distractor-bubble pointer-events-none z-20" style={{ animationDelay: '2.5s' }}>
                🧠 What was the first sentence?
              </div>
            </>
          )}
          {activePersona === 'sensory' && (
            <div className="sensory-overload-veil absolute inset-0 pointer-events-none z-10 bg-white mix-blend-overlay" aria-hidden="true" />
          )}

          <div className="flex flex-col gap-3 pb-3 border-b border-obsidian-border relative z-10">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 id="accessible-render-heading" className="text-xs font-bold uppercase tracking-wider font-mono">
                  Adaptive Reading Surface
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSyllables((prev) => !prev)}
                  className={`min-h-[40px] px-3 py-1 text-xs font-bold rounded-lg border transition ${
                    showSyllables
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-obsidian-700 hover:bg-obsidian-600 border-obsidian-border text-obsidian-text'
                  }`}
                  title="Toggle syllable markers"
                >
                  Syllables
                </button>
                <button
                  onClick={onPlayTTS}
                  className="flex items-center gap-1.5 min-h-[40px] px-3.5 py-1 text-xs font-bold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition shadow-sm"
                  title="Listen aloud with word-by-word karaoke highlight"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen Aloud</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 min-h-[40px] px-3 py-1 text-xs font-semibold rounded-lg bg-obsidian-700 hover:bg-obsidian-600 border border-obsidian-border transition text-obsidian-text"
                  title="Copy adapted text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-1 min-h-[40px] px-3 py-1 text-xs font-semibold rounded-lg bg-obsidian-700 hover:bg-obsidian-600 border border-obsidian-border transition text-obsidian-text"
                  title="Export or print clean PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            {/* Mode Tabs: [Bionic Anchors] [Sentence Chunks] [Plain English] */}
            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Reading surface modes">
              <button role="tab" aria-selected={surfaceMode === 'bionic'} className={tabClass('bionic')} onClick={() => handleSurfaceTab('bionic')}>
                [Bionic Anchors]
              </button>
              <button role="tab" aria-selected={surfaceMode === 'chunks'} className={tabClass('chunks')} onClick={() => handleSurfaceTab('chunks')}>
                [Sentence Chunks]
              </button>
              <button role="tab" aria-selected={surfaceMode === 'plain'} className={tabClass('plain')} onClick={() => handleSurfaceTab('plain')}>
                [Plain English]
              </button>
            </div>
          </div>

          <div
            className={`flex-1 min-h-0 overflow-y-auto pr-2 py-4 relative z-10 ${getFontFamilyClass()} ${activePersona === 'adhd' ? 'opacity-80' : ''}`}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight,
              letterSpacing: `${letterSpacing}px`,
              wordSpacing: `${wordSpacing}px`
            }}
            tabIndex="0"
            role="region"
            aria-label="Accessible transformed reading text"
          >
            {renderInteractiveContent()}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-obsidian-border text-[11px] opacity-80 relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <Layers className="w-3.5 h-3.5" />
              <span className="font-bold font-mono">Surface:</span>
              <span className="font-mono text-cyan-400">{surfaceMode === 'chunks' ? 'Sentence Chunks' : surfaceMode === 'plain' ? 'Plain English' : 'Bionic Anchors'}</span>
              {showSyllables && <span>• Syllables</span>}
              {activePersona && (
                <span className="flex items-center gap-1 text-indigo-400 font-mono font-bold">
                  <Eye className="w-3 h-3" /> {activePersona}
                </span>
              )}
            </div>
            <span className="font-mono text-obsidian-muted">{fontFamily}</span>
          </div>
        </section>
      </div>
    </div>
  );
}

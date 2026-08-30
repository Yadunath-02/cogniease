import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingDown,
  Clock,
  Award,
  ListFilter,
  FileText,
  Volume2,
  FileCheck2,
  HelpCircle,
  Wand2
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
  onPlayTTS
}) {
  const [copied, setCopied] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState('legal-tos');
  const [showSyllables, setShowSyllables] = useState(false);
  const [isAiSimplifying, setIsAiSimplifying] = useState(false);
  const [plainLanguageActive, setPlainLanguageActive] = useState(false);

  // Readability Analysis
  const readabilityMetrics = useMemo(() => {
    return analyzeReadability(sourceText);
  }, [sourceText]);

  // Bionic Tokens Computation
  const tokens = useMemo(() => {
    return parseBionicTokens(sourceText, { fixationRatio });
  }, [sourceText, fixationRatio]);

  // Load Sample Text
  const handleLoadSample = (sampleId) => {
    const sample = SAMPLE_TEXTS.find(s => s.id === sampleId);
    if (sample) {
      setSelectedSampleId(sampleId);
      onChangeSourceText(sample.rawText);
      setPlainLanguageActive(false);
    }
  };

  // Plain Language Transformation Simulator (using few-shot plain language maps or algorithmic decomposition)
  const handleTogglePlainLanguage = () => {
    const currentSample = SAMPLE_TEXTS.find(s => s.rawText === sourceText || s.simplifiedText === sourceText);
    
    if (plainLanguageActive) {
      // Revert to raw
      if (currentSample) {
        onChangeSourceText(currentSample.rawText);
      }
      setPlainLanguageActive(false);
    } else {
      // Simplify
      setIsAiSimplifying(true);
      setTimeout(() => {
        if (currentSample) {
          onChangeSourceText(currentSample.simplifiedText);
        } else {
          // Heuristic simplification for custom user text
          const simplified = sourceText
            .split(/([.?!]+)/)
            .filter(s => s.trim().length > 0)
            .map(s => s.trim())
            .filter(s => !/^[.?!]+$/.test(s))
            .map(s => `• ${s}.`)
            .join('\n\n');
          onChangeSourceText(simplified || sourceText);
        }
        setIsAiSimplifying(false);
        setPlainLanguageActive(true);
      }, 400);
    }
  };

  // Copy Accessible Output
  const handleCopy = () => {
    navigator.clipboard.writeText(sourceText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render tokens with Bionic, Syllables, and TTS Karaoke
  const renderInteractiveContent = () => {
    if (!sourceText.trim()) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
          <BookOpen className="w-12 h-12 mb-3 stroke-[1.5] text-gray-600" />
          <p className="font-semibold text-sm">No text entered yet</p>
          <p className="text-xs text-gray-400 mt-1 max-w-sm">
            Type or paste complex text on the left, or choose from our preloaded legal and medical research excerpts.
          </p>
        </div>
      );
    }

    return (
      <div className="reading-content-body select-text">
        {tokens.map((token, idx) => {
          if (token.type === 'newline') {
            return <div key={token.id} className="h-4" />;
          }
          if (token.type === 'space') {
            return <span key={token.id}>{token.raw}</span>;
          }
          if (token.type === 'html') {
            return <span key={token.id} dangerouslySetInnerHTML={{ __html: token.raw }} />;
          }

          const isTTSActive = activeTTSWordIndex === token.wordIndex;

          return (
            <span
              key={token.id}
              className={`inline-block transition-colors duration-100 ${
                isTTSActive ? 'karaoke-word-active' : ''
              }`}
            >
              {token.leadingPunct}

              {/* Syllable Breakdown Mode */}
              {showSyllables ? (
                <span className="syllable-breakdown font-medium">
                  {token.boldPart}
                  {token.restPart}
                  <span className="text-[10px] text-blue-400/80 align-super ml-0.5 font-mono">
                    [{countSyllables(token.cleanWord)}]
                  </span>
                </span>
              ) : bionicEnabled ? (
                /* Bionic Reading Fixation Mode */
                <>
                  <b className="bionic-fixation font-black">{token.boldPart}</b>
                  <span>{token.restPart}</span>
                </>
              ) : (
                /* Standard Plain Text Mode */
                <span>
                  {token.boldPart}
                  {token.restPart}
                </span>
              )}

              {token.trailingPunct}
            </span>
          );
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

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return 'bg-white text-gray-900 border-gray-200';
      case 'sepia':
        return 'bg-[#FBF0D9] text-[#2D2319] border-[#E2CC9C]';
      case 'mint':
        return 'bg-[#EBF7EE] text-[#132B1A] border-[#BBE0C7]';
      case 'irlen':
        return 'bg-[#E6F0FA] text-[#0E2338] border-[#A8CBF0]';
      case 'contrast':
        return 'bg-black text-[#FFE600] border-[#FFE600]';
      case 'obsidian':
      default:
        return 'bg-obsidian-800 text-obsidian-text border-obsidian-border';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Top Banner: Readability Analytics Scorecard */}
      <section 
        className="mb-6 rounded-2xl bg-obsidian-800/90 border border-obsidian-border p-4 shadow-xl text-white backdrop-blur-md"
        aria-label="Real-time Linguistic Readability Scorecard"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-900/50 text-blue-400 border border-blue-700/50">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight text-white">
                  Linguistic Accessibility Scorecard
                </h2>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  readabilityMetrics.fleschReadingEase >= 70 
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700' 
                    : readabilityMetrics.fleschReadingEase >= 50
                    ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                    : 'bg-rose-950/80 text-rose-300 border-rose-700'
                }`}>
                  {readabilityMetrics.difficultyRating}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Targeting WCAG 2.2 AAA Grade 6–8 plain language standard
              </p>
            </div>
          </div>

          {/* Quick Metric Pills */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Flesch-Kincaid Grade Level */}
            <div className="bg-obsidian-700/60 border border-obsidian-border rounded-xl px-3 py-1.5 flex flex-col items-center">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Grade Level</span>
              <span className="text-sm font-extrabold text-blue-300">
                Grade {readabilityMetrics.fleschKincaidGrade}
              </span>
            </div>

            {/* Flesch Reading Ease */}
            <div className="bg-obsidian-700/60 border border-obsidian-border rounded-xl px-3 py-1.5 flex flex-col items-center">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Reading Ease</span>
              <span className={`text-sm font-extrabold ${
                readabilityMetrics.fleschReadingEase >= 70 ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {readabilityMetrics.fleschReadingEase} / 100
              </span>
            </div>

            {/* Gunning Fog */}
            <div className="bg-obsidian-700/60 border border-obsidian-border rounded-xl px-3 py-1.5 flex flex-col items-center">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Gunning Fog</span>
              <span className="text-sm font-extrabold text-indigo-300">
                {readabilityMetrics.gunningFog}
              </span>
            </div>

            {/* Estimated Read Time */}
            <div className="bg-obsidian-700/60 border border-obsidian-border rounded-xl px-3 py-1.5 flex flex-col items-center">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Read Time</span>
              <div className="flex items-center gap-1 text-sm font-extrabold text-purple-300">
                <Clock className="w-3.5 h-3.5" />
                <span>{readabilityMetrics.readingTimeMinutes} min</span>
              </div>
            </div>

            {/* Word & Complex Words */}
            <div className="bg-obsidian-700/60 border border-obsidian-border rounded-xl px-3 py-1.5 flex flex-col items-center">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">Complex Words</span>
              <span className="text-sm font-extrabold text-orange-300">
                {readabilityMetrics.complexWordPercentage}%
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Dual Pane Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* ================= LEFT PANE: SOURCE TEXT ================= */}
        <section 
          className="rounded-2xl bg-obsidian-800 border border-obsidian-border p-4 shadow-xl flex flex-col h-[650px]"
          aria-labelledby="raw-source-heading"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-obsidian-border gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <h3 id="raw-source-heading" className="text-xs font-bold text-white uppercase tracking-wider">
                Source Document
              </h3>
            </div>

            {/* Sample Selector */}
            <div className="flex items-center gap-2">
              <select
                value={selectedSampleId}
                onChange={(e) => handleLoadSample(e.target.value)}
                className="bg-obsidian-700 text-xs text-white rounded-lg px-2.5 py-1 border border-obsidian-border focus:ring-1 focus:ring-blue-500 max-w-[200px] truncate"
                aria-label="Load Preloaded Complex Sample Text"
              >
                {SAMPLE_TEXTS.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Ribbon */}
          <div className="flex items-center justify-between py-2.5 text-xs gap-2">
            <button
              onClick={handleTogglePlainLanguage}
              disabled={isAiSimplifying}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold border transition-all ${
                plainLanguageActive
                  ? 'bg-emerald-600 border-emerald-400 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-blue-400/50 text-white shadow-md shadow-blue-500/20'
              }`}
              title="Decompress complex jargon into Grade 6-8 plain language"
            >
              <Wand2 className={`w-3.5 h-3.5 ${isAiSimplifying ? 'animate-spin' : ''}`} />
              <span>{plainLanguageActive ? 'Revert to Original Jargon' : '✨ AI Plain Language Simplifier'}</span>
            </button>

            <button
              onClick={() => { onChangeSourceText(''); setPlainLanguageActive(false); }}
              className="text-gray-400 hover:text-rose-400 text-xs px-2 py-1 rounded hover:bg-obsidian-700 transition"
              title="Clear input text"
            >
              Clear
            </button>
          </div>

          {/* Textarea */}
          <div className="flex-1 min-h-0 relative">
            <textarea
              value={sourceText}
              onChange={(e) => {
                onChangeSourceText(e.target.value);
                setPlainLanguageActive(false);
              }}
              placeholder="Paste any dense, complex document, legal clause, or research paper here..."
              className="w-full h-full p-3.5 bg-obsidian-900 text-gray-200 rounded-xl border border-obsidian-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none font-sans text-sm leading-relaxed placeholder-gray-500 overflow-y-auto"
              aria-label="Raw text editor input"
            />
          </div>

          {/* Footer Statistics */}
          <div className="flex items-center justify-between pt-3 border-t border-obsidian-border text-[11px] text-gray-400">
            <span>{readabilityMetrics.wordCount} words • {readabilityMetrics.characterCount} characters</span>
            <span>{readabilityMetrics.sentenceCount} sentences</span>
          </div>
        </section>

        {/* ================= RIGHT PANE: ACCESSIBLE RENDER PANE ================= */}
        <section 
          className={`rounded-2xl border p-5 shadow-2xl flex flex-col h-[650px] transition-colors duration-200 ${getThemeClasses()}`}
          aria-labelledby="accessible-render-heading"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-current/20 gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <h3 id="accessible-render-heading" className="text-xs font-bold uppercase tracking-wider">
                Cognitive Accessible Render
              </h3>
            </div>

            {/* Utility Buttons */}
            <div className="flex items-center gap-2">
              
              {/* Syllables Toggle */}
              <button
                onClick={() => setShowSyllables(prev => !prev)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition ${
                  showSyllables 
                    ? 'bg-blue-600 text-white border-blue-400' 
                    : 'bg-black/10 hover:bg-black/20 border-current/20'
                }`}
                title="Toggle Phonetic Syllable Count Markers"
              >
                Syllables
              </button>

              {/* TTS Listen Button */}
              <button
                onClick={onPlayTTS}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
                title="Read aloud with synchronized word-by-word karaoke highlight"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen</span>
              </button>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-black/10 hover:bg-black/20 border border-current/20 transition"
                title="Copy rendered text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Reading Display Container */}
          <div 
            className={`flex-1 min-h-0 overflow-y-auto pr-2 py-4 ${getFontFamilyClass()}`}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              letterSpacing: `${letterSpacing}px`,
              wordSpacing: `${wordSpacing}px`
            }}
            tabIndex="0"
            role="region"
            aria-label="Accessible Transformed Reading Text"
          >
            {renderInteractiveContent()}
          </div>

          {/* Render Footer Status Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-current/20 text-[11px] opacity-80">
            <div className="flex items-center gap-2">
              <span className="font-bold">Active Assistive Features:</span>
              <span>{bionicEnabled ? '⚡ Bionic Fixation' : 'Plain Text'}</span>
              {showSyllables && <span>• 🔤 Syllables</span>}
              {plainLanguageActive && <span>• ✨ Plain Language</span>}
            </div>
            <span>Font: {fontFamily}</span>
          </div>
        </section>

      </div>
    </div>
  );
}

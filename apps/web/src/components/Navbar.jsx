import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Type,
  Palette,
  FileText,
  Zap,
  ChevronDown
} from 'lucide-react';
import { SAMPLE_TEXTS } from '../data/sampleText';

export default function Navbar({
  bionicEnabled,
  onToggleBionic,
  rulerEnabled,
  onToggleRuler,
  ttsState, // 'playing' | 'paused' | 'stopped'
  onPlayTTS,
  onPauseTTS,
  onResumeTTS,
  onStopTTS,
  ttsRate,
  onChangeTTSRate,
  activeTTSWordIndex,
  totalWords = 100,
  fontFamily,
  onChangeFontFamily,
  fontSize,
  onChangeFontSize,
  lineHeight,
  onChangeLineHeight,
  letterSpacing,
  onChangeLetterSpacing,
  wordSpacing,
  onChangeWordSpacing,
  theme,
  onChangeTheme,
  onApplyPreset,
  selectedSampleId,
  onLoadSample,
  onOpenDeliverablesModal,
  onSelectView
}) {
  const [showTypographyMenu, setShowTypographyMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showDocsMenu, setShowDocsMenu] = useState(false);
  const navRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setShowTypographyMenu(false);
        setShowThemeMenu(false);
        setShowPresetsMenu(false);
        setShowDocsMenu(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const closeMenus = () => {
    setShowTypographyMenu(false);
    setShowThemeMenu(false);
    setShowPresetsMenu(false);
    setShowDocsMenu(false);
  };

  // Compute live playback timer (e.g. 0:12 / 0:38)
  const totalSeconds = Math.max(1, Math.round((totalWords / (180 * ttsRate)) * 60));
  const currentWord = activeTTSWordIndex != null ? Math.min(activeTTSWordIndex, totalWords) : 0;
  const elapsedSeconds = ttsState === 'stopped' ? 0 : Math.min(totalSeconds, Math.round((currentWord / Math.max(1, totalWords)) * totalSeconds));

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const THEMES = [
    { id: 'obsidian', name: 'Midnight Slate (Default)', bg: '#0B0F17', text: '#F9FAFB' },
    { id: 'light', name: 'Crisp Day Light', bg: '#F8FAFC', text: '#0F172A' },
    { id: 'sepia', name: 'Nordic Parchment (Sepia)', bg: '#F6F1EA', text: '#2A241F' },
    { id: 'mint', name: 'Calming Sage (Mint)', bg: '#EEF8F2', text: '#132E1D' },
    { id: 'irlen', name: 'Irlen Soft Blue', bg: '#EAF2FD', text: '#0E2540' },
    { id: 'contrast', name: 'High Contrast Mode', bg: '#000000', text: '#FFFFFF' }
  ];

  const FONTS = [
    { id: 'dyslexic', name: 'OpenDyslexic (Heavy Bottom)' },
    { id: 'atkinson', name: 'Atkinson Hyperlegible (Braille Inst.)' },
    { id: 'lexend', name: 'Lexend (Visual Crowding Aid)' },
    { id: 'sans', name: 'Inter (Clean Sans)' },
    { id: 'mono', name: 'Geist Mono (Telemetry Grid)' },
    { id: 'serif', name: 'Merriweather (Book Serif)' }
  ];

  const toolBtn = (active) =>
    `flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all ${
      active
        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/25 font-bold'
        : 'bg-obsidian-800 hover:bg-obsidian-700 border-obsidian-border text-obsidian-text'
    }`;

  const menuBtn =
    'flex items-center gap-1.5 min-h-[44px] px-3 py-2 text-xs font-semibold rounded-xl bg-obsidian-800 hover:bg-obsidian-700 border border-obsidian-border text-obsidian-text';

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-30 border-b border-obsidian-border bg-obsidian-900/95 backdrop-blur-md text-obsidian-text px-4 py-2.5 font-ui"
    >
      <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3">

        {/* Brand Pill with Green [WCAG 2.2 AAA] tag */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectView && onSelectView('home')}
            className="flex items-center gap-2.5 min-h-[44px] pl-1.5 pr-3.5 py-1 rounded-full border border-obsidian-border bg-obsidian-800/90 hover:bg-obsidian-800 shadow-sm transition group"
            title="Return to Home Grid"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              🧠
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              CogniEase
            </span>
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-700/60 font-mono shadow-sm">
              [WCAG 2.2 AAA]
            </span>
          </button>
        </div>

        {/* Center: Controls Ribbon */}
        <div className="flex items-center flex-wrap gap-2">

          {/* Preset Documents Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowDocsMenu((p) => !p); setShowPresetsMenu(false); setShowTypographyMenu(false); setShowThemeMenu(false); }}
              className={menuBtn}
              title="Load a preset source document"
              aria-expanded={showDocsMenu}
              aria-haspopup="listbox"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Documents</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {showDocsMenu && (
              <div className="absolute top-full left-0 mt-1.5 w-72 bg-obsidian-800 border border-obsidian-border rounded-xl shadow-2xl p-2 z-50 animate-in fade-in">
                <div className="text-[10px] font-bold text-obsidian-muted uppercase px-2 py-1 font-mono">Preset documents</div>
                {SAMPLE_TEXTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { onLoadSample(s.id); closeMenus(); }}
                    className={`w-full text-left px-2.5 py-2 min-h-[44px] rounded-lg text-xs transition ${
                      selectedSampleId === s.id
                        ? 'bg-indigo-500/15 text-indigo-300 font-bold'
                        : 'hover:bg-obsidian-700 text-obsidian-text'
                    }`}
                  >
                    <span className="block font-semibold">{s.title}</span>
                    <span className="text-[10px] text-obsidian-muted font-normal">{s.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Presets Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowPresetsMenu((p) => !p); setShowDocsMenu(false); setShowTypographyMenu(false); setShowThemeMenu(false); }}
              className={menuBtn}
              title="Cognitive accessibility presets"
              aria-expanded={showPresetsMenu}
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Presets</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {showPresetsMenu && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-obsidian-800 border border-obsidian-border rounded-xl shadow-2xl p-2 z-50 animate-in fade-in">
                <div className="text-[10px] font-bold text-obsidian-muted uppercase px-2 py-1 font-mono">Neurodivergent profiles</div>
                <button onClick={() => { onApplyPreset('adhd'); closeMenus(); }} className="w-full text-left px-2.5 py-2 min-h-[44px] rounded-lg text-xs hover:bg-obsidian-700">
                  <span className="font-semibold text-indigo-400">⚡ ADHD Focus</span>
                  <span className="block text-[10px] text-obsidian-muted">Bionic saccades + focus ruler</span>
                </button>
                <button onClick={() => { onApplyPreset('dyslexia'); closeMenus(); }} className="w-full text-left px-2.5 py-2 min-h-[44px] rounded-lg text-xs hover:bg-obsidian-700">
                  <span className="font-semibold text-cyan-400">📖 Dyslexia Comfort</span>
                  <span className="block text-[10px] text-obsidian-muted">OpenDyslexic + wide tracking</span>
                </button>
                <button onClick={() => { onApplyPreset('sensory'); closeMenus(); }} className="w-full text-left px-2.5 py-2 min-h-[44px] rounded-lg text-xs hover:bg-obsidian-700">
                  <span className="font-semibold text-emerald-400">🌿 Sensory Rest</span>
                  <span className="block text-[10px] text-obsidian-muted">Soft sage tint, glare reduction</span>
                </button>
                <button onClick={() => { onApplyPreset('contrast'); closeMenus(); }} className="w-full text-left px-2.5 py-2 min-h-[44px] rounded-lg text-xs hover:bg-obsidian-700">
                  <span className="font-semibold text-sky-400">☀️ High Contrast</span>
                  <span className="block text-[10px] text-obsidian-muted">Maximum AAA luminance pairing</span>
                </button>
                <div className="border-t border-obsidian-border my-1" />
                <button onClick={() => { onApplyPreset('default'); closeMenus(); }} className="w-full text-left px-2.5 py-2 min-h-[44px] rounded-lg text-xs hover:bg-obsidian-700 text-obsidian-muted">
                  Reset to Default
                </button>
              </div>
            )}
          </div>

          {/* Quick Toggle: Bionic Read */}
          <button
            onClick={onToggleBionic}
            className={toolBtn(bionicEnabled)}
            title="Toggle Saccadic Bionic Fixation (Alt+B)"
            aria-pressed={bionicEnabled}
          >
            <Zap className={`w-3.5 h-3.5 ${bionicEnabled ? 'fill-white' : 'text-cyan-400'}`} />
            <span>Bionic Read</span>
          </button>

          {/* Quick Toggle: Focus Ruler */}
          <button
            onClick={onToggleRuler}
            className={toolBtn(rulerEnabled)}
            title="Toggle Focus Reading Ruler (Alt+R)"
            aria-pressed={rulerEnabled}
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Focus Ruler</span>
          </button>

          {/* Audio TTS Playback Pill with Timer */}
          <div className={`flex items-center gap-1.5 min-h-[44px] px-2.5 rounded-full border transition-all ${
            ttsState === 'playing'
              ? 'bg-indigo-500/15 border-indigo-500/60 shadow-md shadow-indigo-500/20'
              : 'bg-obsidian-800 border-obsidian-border'
          }`}>
            {ttsState === 'playing' ? (
              <button onClick={onPauseTTS} className="p-1.5 rounded-full hover:bg-obsidian-700 text-indigo-400 min-w-[36px] min-h-[36px] flex items-center justify-center" aria-label="Pause Speech">
                <Pause className="w-4 h-4 fill-indigo-400" />
              </button>
            ) : ttsState === 'paused' ? (
              <button onClick={onResumeTTS} className="p-1.5 rounded-full hover:bg-obsidian-700 text-indigo-400 min-w-[36px] min-h-[36px] flex items-center justify-center" aria-label="Resume Speech">
                <Play className="w-4 h-4 fill-indigo-400" />
              </button>
            ) : (
              <button onClick={onPlayTTS} className="p-1.5 rounded-full hover:bg-obsidian-700 text-obsidian-muted hover:text-cyan-300 min-w-[36px] min-h-[36px] flex items-center justify-center" aria-label="Play Speech">
                <Play className="w-4 h-4 fill-current" />
              </button>
            )}

            {/* Timer Display */}
            <span className="text-[11px] font-mono font-bold text-obsidian-text px-1 select-none">
              {formatTime(elapsedSeconds)} <span className="text-obsidian-muted font-normal">/ {formatTime(totalSeconds)}</span>
            </span>

            {/* Animated Waveform */}
            <div className={`flex items-end gap-[2.5px] h-3.5 px-1 ${ttsState === 'playing' ? '' : 'tts-wave-idle'}`} aria-hidden="true">
              <span className="tts-wave-bar" />
              <span className="tts-wave-bar" />
              <span className="tts-wave-bar" />
              <span className="tts-wave-bar" />
            </div>

            {ttsState !== 'stopped' && (
              <button onClick={onStopTTS} className="p-1 rounded hover:bg-obsidian-700 text-rose-400 flex items-center justify-center" aria-label="Stop Speech">
                <RotateCcw className="w-3 h-3" />
              </button>
            )}

            {/* Speed Selector */}
            <select
              value={ttsRate}
              onChange={(e) => onChangeTTSRate(parseFloat(e.target.value))}
              className="bg-transparent text-[11px] text-cyan-400 font-bold font-mono px-1 py-1 focus:outline-none cursor-pointer border-l border-obsidian-border/80 ml-0.5"
              aria-label="Voice Playback Speed"
            >
              <option value={0.75} className="bg-obsidian-800 text-white">0.75x</option>
              <option value={1} className="bg-obsidian-800 text-white">1.0x</option>
              <option value={1.25} className="bg-obsidian-800 text-white">1.25x</option>
              <option value={1.5} className="bg-obsidian-800 text-white">1.5x</option>
              <option value={2} className="bg-obsidian-800 text-white">2.0x</option>
            </select>
          </div>

          {/* Typography Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowTypographyMenu((p) => !p); setShowThemeMenu(false); setShowDocsMenu(false); setShowPresetsMenu(false); }}
              className={menuBtn}
              title="Adjust Font, Line Spacing, and Letter Spacing"
              aria-expanded={showTypographyMenu}
            >
              <Type className="w-3.5 h-3.5 text-cyan-400" />
              <span>Typography</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {showTypographyMenu && (
              <div className="absolute top-full right-0 mt-1.5 w-72 bg-obsidian-800 border border-obsidian-border rounded-xl shadow-2xl p-4 z-50 space-y-3.5 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-obsidian-border pb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Typography & Spacing</span>
                  <span className="text-[10px] text-cyan-400 font-semibold font-mono">WCAG AAA</span>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-obsidian-muted mb-1" htmlFor="font-family">Font Family</label>
                  <select
                    id="font-family"
                    value={fontFamily}
                    onChange={(e) => onChangeFontFamily(e.target.value)}
                    className="w-full min-h-[44px] bg-obsidian-700 text-white rounded-lg px-2.5 py-1.5 text-xs border border-obsidian-border"
                  >
                    {FONTS.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-obsidian-muted mb-1">
                    <span>Font Size</span>
                    <span className="font-mono text-cyan-400">{fontSize}px</span>
                  </div>
                  <input type="range" min="14" max="28" step="1" value={fontSize} onChange={(e) => onChangeFontSize(parseInt(e.target.value, 10))} className="w-full accent-indigo-500 cursor-pointer" aria-label="Font size" />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-obsidian-muted mb-1">
                    <span>Line Height</span>
                    <span className="font-mono text-cyan-400">{lineHeight}</span>
                  </div>
                  <input type="range" min="1.3" max="2.4" step="0.1" value={lineHeight} onChange={(e) => onChangeLineHeight(parseFloat(e.target.value))} className="w-full accent-indigo-500 cursor-pointer" aria-label="Line height" />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-obsidian-muted mb-1">
                    <span>Letter Spacing</span>
                    <span className="font-mono text-cyan-400">{letterSpacing}px</span>
                  </div>
                  <input type="range" min="0" max="4" step="0.5" value={letterSpacing} onChange={(e) => onChangeLetterSpacing(parseFloat(e.target.value))} className="w-full accent-indigo-500 cursor-pointer" aria-label="Letter spacing" />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-obsidian-muted mb-1">
                    <span>Word Spacing</span>
                    <span className="font-mono text-cyan-400">{wordSpacing}px</span>
                  </div>
                  <input type="range" min="0" max="8" step="1" value={wordSpacing} onChange={(e) => onChangeWordSpacing(parseInt(e.target.value, 10))} className="w-full accent-indigo-500 cursor-pointer" aria-label="Word spacing" />
                </div>
              </div>
            )}
          </div>

          {/* Theme Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setShowThemeMenu((p) => !p); setShowTypographyMenu(false); setShowDocsMenu(false); setShowPresetsMenu(false); }}
              className={menuBtn}
              title="Change Color Theme & Overlays"
              aria-expanded={showThemeMenu}
            >
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span>Theme</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {showThemeMenu && (
              <div className="absolute top-full right-0 mt-1.5 w-64 bg-obsidian-800 border border-obsidian-border rounded-xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in">
                <div className="text-[10px] font-bold text-obsidian-muted uppercase px-2 py-1 font-mono">WCAG 2.2 AAA palettes</div>
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { onChangeTheme(t.id); closeMenus(); }}
                    className={`w-full min-h-[44px] flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                      theme === t.id ? 'bg-indigo-500/15 text-indigo-300 font-bold' : 'hover:bg-obsidian-700 text-obsidian-text'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border border-obsidian-border shadow-sm" style={{ backgroundColor: t.bg }} />
                      <span>{t.name}</span>
                    </div>
                    {theme === t.id && <span className="text-indigo-400 text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Deliverables Button */}
        <button
          onClick={onOpenDeliverablesModal}
          className="flex items-center gap-1.5 min-h-[44px] px-4 py-2 text-xs font-bold rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-md shadow-indigo-500/25 transition-all active:scale-95"
          title="View Hackathon Deliverables (Alt+D)"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Deliverables</span>
        </button>
      </div>
    </header>
  );
}

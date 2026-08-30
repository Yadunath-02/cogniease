import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Sparkles,
  Eye,
  Type,
  Sun,
  Moon,
  Palette,
  FileText,
  HelpCircle,
  Zap,
  Layers,
  ChevronDown
} from 'lucide-react';

export default function Navbar({
  // Bionic Reading
  bionicEnabled,
  onToggleBionic,
  fixationRatio,
  onChangeFixationRatio,

  // Reading Ruler
  rulerEnabled,
  onToggleRuler,
  rulerMode,
  onChangeRulerMode,

  // Speech Synthesis
  ttsState, // 'playing' | 'paused' | 'stopped'
  onPlayTTS,
  onPauseTTS,
  onResumeTTS,
  onStopTTS,
  ttsRate,
  onChangeTTSRate,

  // Typography Settings
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

  // Theme Settings
  theme,
  onChangeTheme,

  // Quick Presets
  onApplyPreset,

  // Modals
  onOpenPersonaSimulator,
  onOpenDeliverablesModal
}) {
  const [showTypographyMenu, setShowTypographyMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showTTSMenu, setShowTTSMenu] = useState(false);

  const THEMES = [
    { id: 'obsidian', name: 'Obsidian AAA Dark', bg: '#0D1117', text: '#F0F6FC' },
    { id: 'light', name: 'Crisp Day Light', bg: '#FFFFFF', text: '#0A0D14' },
    { id: 'sepia', name: 'Warm Sepia (Low Strain)', bg: '#FBF0D9', text: '#2D2319' },
    { id: 'mint', name: 'Calming Mint (Photophobia)', bg: '#EBF7EE', text: '#132B1A' },
    { id: 'irlen', name: 'Irlen Soft Blue', bg: '#E6F0FA', text: '#0E2338' },
    { id: 'contrast', name: 'High Contrast Gold/Black', bg: '#000000', text: '#FFE600' }
  ];

  const FONTS = [
    { id: 'dyslexic', name: 'OpenDyslexic (Heavy Bottom)' },
    { id: 'atkinson', name: 'Atkinson Hyperlegible (Braille Inst.)' },
    { id: 'lexend', name: 'Lexend (Visual Crowding Aid)' },
    { id: 'sans', name: 'Inter (Clean Sans)' },
    { id: 'mono', name: 'Monospace (Uniform Grid)' },
    { id: 'serif', name: 'Merriweather (Book Serif)' }
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-obsidian-border bg-obsidian-900/90 backdrop-blur-md text-obsidian-text px-4 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-xl">
              🧠
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-white bg-clip-text text-transparent">
                  CogniEase
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  WCAG AAA
                </span>
              </div>
              <p className="text-[11px] text-obsidian-muted font-medium">Neurodivergent Reading Engine</p>
            </div>
          </div>
        </div>

        {/* Center: Accessibility Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Quick Presets Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPresetsMenu(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-obsidian-800 hover:bg-obsidian-700 border border-obsidian-border text-blue-300 hover:text-white transition-all shadow-sm"
              title="Select a cognitive accessibility preset"
              aria-expanded={showPresetsMenu}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Presets</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showPresetsMenu && (
              <div className="absolute top-full left-0 mt-1.5 w-60 bg-obsidian-800 border border-obsidian-border rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="text-[10px] font-bold text-obsidian-muted uppercase px-2 py-1">Neurodivergent Profiles</div>
                <button
                  onClick={() => { onApplyPreset('adhd'); setShowPresetsMenu(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-obsidian-700 flex flex-col transition"
                >
                  <span className="font-semibold text-amber-300">⚡ ADHD Focus</span>
                  <span className="text-[10px] text-gray-400">Bionic Saccade + Reading Ruler + High Spacing</span>
                </button>
                <button
                  onClick={() => { onApplyPreset('dyslexia'); setShowPresetsMenu(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-obsidian-700 flex flex-col transition"
                >
                  <span className="font-semibold text-emerald-300">📖 Dyslexia Comfort</span>
                  <span className="text-[10px] text-gray-400">OpenDyslexic Font + Wide Letter Spacing</span>
                </button>
                <button
                  onClick={() => { onApplyPreset('sensory'); setShowPresetsMenu(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-obsidian-700 flex flex-col transition"
                >
                  <span className="font-semibold text-blue-300">🌿 Sensory Rest / Calming</span>
                  <span className="text-[10px] text-gray-400">Warm Sepia Tint + Soft Contrast</span>
                </button>
                <button
                  onClick={() => { onApplyPreset('contrast'); setShowPresetsMenu(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-obsidian-700 flex flex-col transition"
                >
                  <span className="font-semibold text-yellow-400">☀️ High Contrast Gold (17:1)</span>
                  <span className="text-[10px] text-gray-400">Pure Black + High Luminance Yellow</span>
                </button>
                <div className="border-t border-obsidian-border my-1"></div>
                <button
                  onClick={() => { onApplyPreset('default'); setShowPresetsMenu(false); }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-obsidian-700 text-gray-400 hover:text-white"
                >
                  Reset to Default
                </button>
              </div>
            )}
          </div>

          {/* Saccadic Bionic Reading Toggle */}
          <button
            onClick={onToggleBionic}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              bionicEnabled
                ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-500/25'
                : 'bg-obsidian-800 hover:bg-obsidian-700 border-obsidian-border text-gray-300'
            }`}
            title="Toggle Saccadic Bionic Fixation (Alt+B)"
            aria-pressed={bionicEnabled}
          >
            <Zap className={`w-3.5 h-3.5 ${bionicEnabled ? 'text-yellow-300 fill-yellow-300' : 'text-gray-400'}`} />
            <span>Bionic Read</span>
          </button>

          {/* Reading Ruler Toggle */}
          <button
            onClick={onToggleRuler}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              rulerEnabled
                ? 'bg-amber-600 border-amber-400 text-white shadow-md shadow-amber-500/25'
                : 'bg-obsidian-800 hover:bg-obsidian-700 border-obsidian-border text-gray-300'
            }`}
            title="Toggle Reading Ruler Mask (Alt+R)"
            aria-pressed={rulerEnabled}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Reading Ruler</span>
          </button>

          {/* Text-to-Speech (TTS) Karaoke Audio Controls */}
          <div className="flex items-center bg-obsidian-800 border border-obsidian-border rounded-lg p-0.5">
            {ttsState === 'playing' ? (
              <button
                onClick={onPauseTTS}
                className="p-1.5 rounded hover:bg-obsidian-700 text-amber-400"
                title="Pause Speech"
                aria-label="Pause Speech"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
            ) : ttsState === 'paused' ? (
              <button
                onClick={onResumeTTS}
                className="p-1.5 rounded hover:bg-obsidian-700 text-emerald-400"
                title="Resume Speech"
                aria-label="Resume Speech"
              >
                <Play className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onPlayTTS}
                className="p-1.5 rounded hover:bg-obsidian-700 text-blue-400 hover:text-white"
                title="Listen with Word-by-Word Karaoke (Space)"
                aria-label="Play Speech"
              >
                <Play className="w-3.5 h-3.5" />
              </button>
            )}

            {ttsState !== 'stopped' && (
              <button
                onClick={onStopTTS}
                className="p-1.5 rounded hover:bg-obsidian-700 text-rose-400"
                title="Stop Speech"
                aria-label="Stop Speech"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* TTS Speed Rate Selector */}
            <select
              value={ttsRate}
              onChange={(e) => onChangeTTSRate(parseFloat(e.target.value))}
              className="bg-transparent text-[11px] text-gray-300 font-semibold px-1 py-1 focus:outline-none cursor-pointer"
              title="Voice Playback Speed"
              aria-label="Voice Playback Speed"
            >
              <option value="0.75" className="bg-obsidian-800">0.75x</option>
              <option value="1.0" className="bg-obsidian-800">1.0x</option>
              <option value="1.25" className="bg-obsidian-800">1.25x</option>
              <option value="1.5" className="bg-obsidian-800">1.5x</option>
              <option value="2.0" className="bg-obsidian-800">2.0x</option>
            </select>
          </div>

          {/* Typography Controls Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTypographyMenu(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-obsidian-800 hover:bg-obsidian-700 border border-obsidian-border text-gray-200"
              title="Adjust Font, Line Spacing, and Letter Spacing"
              aria-expanded={showTypographyMenu}
            >
              <Type className="w-3.5 h-3.5 text-indigo-400" />
              <span>Typography</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showTypographyMenu && (
              <div className="absolute top-full right-0 mt-1.5 w-72 bg-obsidian-800 border border-obsidian-border rounded-xl shadow-2xl p-4 z-50 animate-in fade-in space-y-3.5">
                <div className="flex items-center justify-between border-b border-obsidian-border pb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Typography & Spacing</span>
                  <span className="text-[10px] text-blue-400 font-semibold">WCAG AAA compliant</span>
                </div>

                {/* Font Selector */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1">Font Family</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => onChangeFontFamily(e.target.value)}
                    className="w-full bg-obsidian-700 text-white rounded-lg px-2.5 py-1.5 text-xs border border-obsidian-border focus:ring-1 focus:ring-blue-500"
                  >
                    {FONTS.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <div className="flex justify-between text-[11px] text-gray-300 mb-1">
                    <span>Font Size</span>
                    <span className="font-mono text-blue-300">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="28"
                    step="1"
                    value={fontSize}
                    onChange={(e) => onChangeFontSize(parseInt(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                {/* Line Height */}
                <div>
                  <div className="flex justify-between text-[11px] text-gray-300 mb-1">
                    <span>Line Height</span>
                    <span className="font-mono text-blue-300">{lineHeight}</span>
                  </div>
                  <input
                    type="range"
                    min="1.3"
                    max="2.4"
                    step="0.1"
                    value={lineHeight}
                    onChange={(e) => onChangeLineHeight(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                {/* Letter Spacing */}
                <div>
                  <div className="flex justify-between text-[11px] text-gray-300 mb-1">
                    <span>Letter Spacing</span>
                    <span className="font-mono text-blue-300">{letterSpacing}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.5"
                    value={letterSpacing}
                    onChange={(e) => onChangeLetterSpacing(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                {/* Word Spacing */}
                <div>
                  <div className="flex justify-between text-[11px] text-gray-300 mb-1">
                    <span>Word Spacing</span>
                    <span className="font-mono text-blue-300">{wordSpacing}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="1"
                    value={wordSpacing}
                    onChange={(e) => onChangeWordSpacing(parseInt(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-obsidian-800 hover:bg-obsidian-700 border border-obsidian-border text-gray-200"
              title="Change Color Theme & Irlen Tint Overlays"
              aria-expanded={showThemeMenu}
            >
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              <span>Theme</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showThemeMenu && (
              <div className="absolute top-full right-0 mt-1.5 w-60 bg-obsidian-800 border border-obsidian-border rounded-xl shadow-2xl p-2 z-50 animate-in fade-in space-y-1">
                <div className="text-[10px] font-bold text-obsidian-muted uppercase px-2 py-1">WCAG 2.2 AAA Palettes</div>
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { onChangeTheme(t.id); setShowThemeMenu(false); }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                      theme === t.id ? 'bg-blue-900/40 text-blue-300 font-bold' : 'hover:bg-obsidian-700 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-500" style={{ backgroundColor: t.bg }}></span>
                      <span>{t.name}</span>
                    </div>
                    {theme === t.id && <span className="text-blue-400 text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Hackathon Modals (Persona Simulator & Deliverables) */}
        <div className="flex items-center gap-2">
          
          {/* Persona Barrier Simulator Trigger */}
          <button
            onClick={onOpenPersonaSimulator}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white shadow-md shadow-orange-500/20 transition-all active:scale-95"
            title="Interactive ADHD & Dyslexia Barrier Simulator (Alt+S)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Barrier Sandbox</span>
          </button>

          {/* Hackathon Deliverables Modal Trigger */}
          <button
            onClick={onOpenDeliverablesModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-500/20 transition-all active:scale-95"
            title="View Hackathon Deliverables: WCAG, User Research & Prompt Logs (Alt+D)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Deliverables</span>
          </button>
        </div>

      </div>
    </header>
  );
}

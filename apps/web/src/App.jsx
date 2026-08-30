import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import DualPaneWorkspace from './components/DualPaneWorkspace';
import ReadingRuler from './components/ReadingRuler';
import PersonaSimulator from './components/PersonaSimulator';
import DeliverablesModal from './components/DeliverablesModal';
import { SpeechEngine, extractWords } from '@cogniease/core';
import { SAMPLE_TEXTS } from './data/sampleText';

export default function App() {
  // 1. Text Content & Sample Selection State
  const [sourceText, setSourceText] = useState(SAMPLE_TEXTS[0].rawText);
  const [selectedSampleId, setSelectedSampleId] = useState(SAMPLE_TEXTS[0].id);
  const [surfaceMode, setSurfaceMode] = useState('bionic'); // 'bionic' | 'chunks' | 'plain'
  const [activePersona, setActivePersona] = useState(null); // null | 'adhd' | 'dyslexia' | 'sensory'

  // 2. Assistive Feature States
  const [bionicEnabled, setBionicEnabled] = useState(true);
  const [fixationRatio, setFixationRatio] = useState(0.45);

  const [rulerEnabled, setRulerEnabled] = useState(false);
  const [rulerMode, setRulerMode] = useState('focus-line');

  // 3. Typography States
  const [fontFamily, setFontFamily] = useState('dyslexic');
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.85);
  const [letterSpacing, setLetterSpacing] = useState(1.0);
  const [wordSpacing, setWordSpacing] = useState(2.0);

  // 4. Theme State
  const [theme, setTheme] = useState('obsidian');

  // 5. Speech Synthesis States
  const [ttsState, setTtsState] = useState('stopped');
  const [ttsRate, setTtsRate] = useState(1.0);
  const [activeTTSWordIndex, setActiveTTSWordIndex] = useState(null);
  const speechEngineRef = useRef(null);

  // 6. Modals
  const [isPersonaSimulatorOpen, setIsPersonaSimulatorOpen] = useState(false);
  const [isDeliverablesModalOpen, setIsDeliverablesModalOpen] = useState(false);

  // 7. ARIA Live Screen Reader Announcer
  const [a11yAnnouncement, setA11yAnnouncement] = useState('CogniEase Loaded. Bionic reading active.');

  const announce = (msg) => {
    setA11yAnnouncement(msg);
  };

  const totalWords = extractWords(sourceText).length;

  const handleLoadSample = (sampleId) => {
    const sample = SAMPLE_TEXTS.find((s) => s.id === sampleId);
    if (sample) {
      setSelectedSampleId(sampleId);
      setSourceText(sample.rawText);
      setSurfaceMode('bionic');
      announce(`Loaded ${sample.title}`);
    }
  };

  // Initialize Speech Synthesis Engine
  useEffect(() => {
    speechEngineRef.current = new SpeechEngine({ rate: ttsRate });

    speechEngineRef.current.onWordBoundary = ({ globalWordIndex }) => {
      setActiveTTSWordIndex(globalWordIndex);
    };

    speechEngineRef.current.onStateChange = (state) => {
      setTtsState(state);
      if (state === 'stopped') {
        setActiveTTSWordIndex(null);
      }
    };

    speechEngineRef.current.onEnd = () => {
      setTtsState('stopped');
      setActiveTTSWordIndex(null);
      announce('Speech finished.');
    };

    return () => {
      if (speechEngineRef.current) {
        speechEngineRef.current.stop();
      }
    };
  }, []);

  const handleChangeTTSRate = (rate) => {
    setTtsRate(rate);
    if (speechEngineRef.current) {
      speechEngineRef.current.setRate(rate);
    }
  };

  const handlePlayTTS = () => {
    if (!speechEngineRef.current) return;
    announce('Starting speech with word-by-word karaoke highlight.');
    speechEngineRef.current.speak(sourceText, { rate: ttsRate });
  };

  const handlePauseTTS = () => {
    if (speechEngineRef.current) {
      speechEngineRef.current.pause();
      announce('Speech paused.');
    }
  };

  const handleResumeTTS = () => {
    if (speechEngineRef.current) {
      speechEngineRef.current.resume();
      announce('Speech resumed.');
    }
  };

  const handleStopTTS = () => {
    if (speechEngineRef.current) {
      speechEngineRef.current.stop();
      announce('Speech stopped.');
    }
  };

  const handleApplyPreset = (presetKey) => {
    switch (presetKey) {
      case 'adhd':
        setBionicEnabled(true);
        setFixationRatio(0.5);
        setRulerEnabled(true);
        setRulerMode('focus-line');
        setFontFamily('lexend');
        setFontSize(19);
        setLineHeight(2.0);
        setLetterSpacing(1.5);
        setWordSpacing(3.0);
        setTheme('obsidian');
        setSurfaceMode('bionic');
        announce('Applied ADHD Focus preset with Bionic Saccades and Reading Ruler.');
        break;

      case 'dyslexia':
        setBionicEnabled(true);
        setFixationRatio(0.45);
        setRulerEnabled(false);
        setFontFamily('dyslexic');
        setFontSize(20);
        setLineHeight(2.1);
        setLetterSpacing(2.0);
        setWordSpacing(4.0);
        setTheme('sepia');
        setSurfaceMode('bionic');
        announce('Applied Dyslexia Comfort preset with OpenDyslexic typeface and Warm Sepia tint.');
        break;

      case 'sensory':
        setBionicEnabled(false);
        setRulerEnabled(false);
        setFontFamily('atkinson');
        setFontSize(18);
        setLineHeight(1.9);
        setLetterSpacing(1.0);
        setWordSpacing(2.0);
        setTheme('mint');
        setSurfaceMode('chunks');
        announce('Applied Sensory Calming preset with Soft Mint tint.');
        break;

      case 'contrast':
        setBionicEnabled(true);
        setFixationRatio(0.45);
        setRulerEnabled(false);
        setFontFamily('atkinson');
        setFontSize(20);
        setLineHeight(1.9);
        setLetterSpacing(1.5);
        setWordSpacing(3.0);
        setTheme('contrast');
        setSurfaceMode('bionic');
        announce('Applied High Contrast Gold preset with 17:1 contrast ratio.');
        break;

      case 'default':
      default:
        setBionicEnabled(true);
        setFixationRatio(0.45);
        setRulerEnabled(false);
        setFontFamily('dyslexic');
        setFontSize(18);
        setLineHeight(1.85);
        setLetterSpacing(1.0);
        setWordSpacing(2.0);
        setTheme('obsidian');
        setSurfaceMode('bionic');
        announce('Reset to Default settings.');
        break;
    }
  };

  const handlePersonaDock = (personaId) => {
    if (activePersona === personaId) {
      setActivePersona(null);
      handleApplyPreset('default');
      announce('Persona sandbox cleared.');
      return;
    }

    setActivePersona(personaId);
    if (personaId === 'adhd') {
      handleApplyPreset('adhd');
      announce('ADHD Wandering simulation active. Distractors overlay the reading surface.');
    } else if (personaId === 'dyslexia') {
      handleApplyPreset('dyslexia');
      announce('Dyslexia Drift simulation active. Glyph jitter is applied to the reading surface.');
    } else if (personaId === 'sensory') {
      handleApplyPreset('sensory');
      announce('Sensory Overload simulation active. Glare veil is applied to the reading surface.');
    }
  };

  // Keyboard Navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      if (e.altKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setBionicEnabled((b) => {
          const next = !b;
          announce(next ? 'Bionic reading enabled' : 'Bionic reading disabled');
          return next;
        });
        setSurfaceMode('bionic');
      }

      if (e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setRulerEnabled((r) => {
          const next = !r;
          announce(next ? 'Reading ruler enabled' : 'Reading ruler disabled');
          return next;
        });
      }

      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsPersonaSimulatorOpen((prev) => !prev);
      }

      if (e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsDeliverablesModalOpen((prev) => !prev);
      }

      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        const themes = ['obsidian', 'light', 'sepia', 'mint', 'irlen', 'contrast'];
        setTheme((current) => {
          const next = themes[(themes.indexOf(current) + 1) % themes.length];
          announce(`Switched theme to ${next}`);
          return next;
        });
      }

      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        if (ttsState === 'playing') {
          handlePauseTTS();
        } else if (ttsState === 'paused') {
          handleResumeTTS();
        } else {
          handlePlayTTS();
        }
      }

      if (e.key === 'Escape') {
        setIsPersonaSimulatorOpen(false);
        setIsDeliverablesModalOpen(false);
        setActivePersona(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ttsState, sourceText, ttsRate]);

  const dockPill = (id, emoji, label) => {
    const active = activePersona === id;
    return (
      <button
        type="button"
        onClick={() => handlePersonaDock(id)}
        onDoubleClick={() => setIsPersonaSimulatorOpen(true)}
        aria-pressed={active}
        className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap flex items-center gap-1.5 ${
          active
            ? 'bg-ambergold-500 border-ambergold-400 text-obsidian-900 shadow-md shadow-ambergold-500/30'
            : 'bg-obsidian-800 border-obsidian-border text-obsidian-text hover:border-ambergold-500/50 hover:text-ambergold-400'
        }`}
      >
        <span>{emoji}</span>
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 theme-${theme} bg-obsidian-900 text-obsidian-text font-ui`}>

      {/* ARIA Live Region for Screen Readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="a11y-status">
        {a11yAnnouncement}
      </div>

      {/* Skip to Main Content Link */}
      <a
        href="#main-workspace"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-ambergold-500 focus:text-obsidian-900 focus:rounded-lg font-bold shadow-2xl"
      >
        Skip to main reading workspace
      </a>

      {/* Sticky Top Navigation */}
      <Navbar
        bionicEnabled={bionicEnabled}
        onToggleBionic={() => {
          setBionicEnabled((b) => !b);
          announce(!bionicEnabled ? 'Bionic reading enabled' : 'Bionic reading disabled');
          setSurfaceMode('bionic');
        }}
        fixationRatio={fixationRatio}
        onChangeFixationRatio={setFixationRatio}
        rulerEnabled={rulerEnabled}
        onToggleRuler={() => {
          setRulerEnabled((r) => !r);
          announce(!rulerEnabled ? 'Reading ruler active' : 'Reading ruler disabled');
        }}
        rulerMode={rulerMode}
        onChangeRulerMode={setRulerMode}
        ttsState={ttsState}
        onPlayTTS={handlePlayTTS}
        onPauseTTS={handlePauseTTS}
        onResumeTTS={handleResumeTTS}
        onStopTTS={handleStopTTS}
        ttsRate={ttsRate}
        onChangeTTSRate={handleChangeTTSRate}
        activeTTSWordIndex={activeTTSWordIndex}
        totalWords={totalWords}
        fontFamily={fontFamily}
        onChangeFontFamily={setFontFamily}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        lineHeight={lineHeight}
        onChangeLineHeight={setLineHeight}
        letterSpacing={letterSpacing}
        onChangeLetterSpacing={setLetterSpacing}
        wordSpacing={wordSpacing}
        onChangeWordSpacing={setWordSpacing}
        theme={theme}
        onChangeTheme={setTheme}
        onApplyPreset={handleApplyPreset}
        selectedSampleId={selectedSampleId}
        onLoadSample={handleLoadSample}
        onOpenDeliverablesModal={() => setIsDeliverablesModalOpen(true)}
      />

      {/* Main Dual-Pane Cognitive Workspace & Bento Telemetry */}
      <main id="main-workspace" role="main" className="flex-1">
        <DualPaneWorkspace
          sourceText={sourceText}
          onChangeSourceText={setSourceText}
          bionicEnabled={bionicEnabled}
          fixationRatio={fixationRatio}
          fontFamily={fontFamily}
          fontSize={fontSize}
          lineHeight={lineHeight}
          letterSpacing={letterSpacing}
          wordSpacing={wordSpacing}
          theme={theme}
          activeTTSWordIndex={activeTTSWordIndex}
          onPlayTTS={handlePlayTTS}
          selectedSampleId={selectedSampleId}
          onLoadSample={handleLoadSample}
          surfaceMode={surfaceMode}
          onChangeSurfaceMode={setSurfaceMode}
          activePersona={activePersona}
        />
      </main>

      {/* Reading Ruler Spotlight Component */}
      <ReadingRuler
        enabled={rulerEnabled}
        mode={rulerMode}
        onToggle={() => setRulerEnabled(false)}
        onModeChange={setRulerMode}
      />

      {/* Persona Barrier Simulator Modal */}
      <PersonaSimulator
        isOpen={isPersonaSimulatorOpen}
        onClose={() => setIsPersonaSimulatorOpen(false)}
      />

      {/* Deliverables Modal */}
      <DeliverablesModal
        isOpen={isDeliverablesModalOpen}
        onClose={() => setIsDeliverablesModalOpen(false)}
      />

      {/* Bottom Persona Simulator Floating Dock */}
      <nav
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-2 rounded-full bg-obsidian-900/95 border border-obsidian-border shadow-dock backdrop-blur-md"
        aria-label="Persona sandbox dock"
      >
        {dockPill('adhd', '⚡', 'ADHD Wandering')}
        {dockPill('dyslexia', '🔤', 'Dyslexia Drift')}
        {dockPill('sensory', '🚨', 'Sensory Overload')}
        <button
          type="button"
          onClick={() => setIsPersonaSimulatorOpen(true)}
          className="min-h-[44px] px-3 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider text-obsidian-muted hover:text-ambergold-400 border border-transparent hover:border-obsidian-border"
          title="Open full barrier sandbox (Alt+S)"
        >
          Sandbox
        </button>
      </nav>
    </div>
  );
}

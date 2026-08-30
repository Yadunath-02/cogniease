import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import DualPaneWorkspace from './components/DualPaneWorkspace';
import ReadingRuler from './components/ReadingRuler';
import PersonaSimulator from './components/PersonaSimulator';
import DeliverablesModal from './components/DeliverablesModal';
import { SpeechEngine } from '@cogniease/core';
import { SAMPLE_TEXTS } from './data/sampleText';

export default function App() {
  // 1. Text Content State
  const [sourceText, setSourceText] = useState(SAMPLE_TEXTS[0].rawText);

  // 2. Assistive Feature States
  const [bionicEnabled, setBionicEnabled] = useState(true);
  const [fixationRatio, setFixationRatio] = useState(0.45);
  
  const [rulerEnabled, setRulerEnabled] = useState(false);
  const [rulerMode, setRulerMode] = useState('focus-line');

  // 3. Typography States
  const [fontFamily, setFontFamily] = useState('dyslexic'); // 'dyslexic' | 'atkinson' | 'lexend' | 'sans' | 'mono' | 'serif'
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.85);
  const [letterSpacing, setLetterSpacing] = useState(1.0);
  const [wordSpacing, setWordSpacing] = useState(2.0);

  // 4. Theme State
  const [theme, setTheme] = useState('obsidian'); // 'obsidian' | 'light' | 'sepia' | 'mint' | 'irlen' | 'contrast'

  // 5. Speech Synthesis States
  const [ttsState, setTtsState] = useState('stopped'); // 'playing' | 'paused' | 'stopped'
  const [ttsRate, setTtsRate] = useState(1.0);
  const [activeTTSWordIndex, setActiveTTSWordIndex] = useState(null);
  const speechEngineRef = useRef(null);

  // 6. Modals
  const [isPersonaSimulatorOpen, setIsPersonaSimulatorOpen] = useState(false);
  const [isDeliverablesModalOpen, setIsDeliverablesModalOpen] = useState(false);

  // 7. ARIA Screen Reader Live Region Announcer
  const [a11yAnnouncement, setA11yAnnouncement] = useState('CogniEase Loaded. Bionic reading active.');

  const announce = (msg) => {
    setA11yAnnouncement(msg);
  };

  // Initialize Web Speech Engine
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

  // Update TTS Rate dynamically
  const handleChangeTTSRate = (rate) => {
    setTtsRate(rate);
    if (speechEngineRef.current) {
      speechEngineRef.current.setRate(rate);
    }
  };

  // TTS Controls
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

  // Presets Handler
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
        announce('Reset to Default settings.');
        break;
    }
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore when typing inside text inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      // Alt + B: Toggle Bionic
      if (e.altKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setBionicEnabled(b => {
          const next = !b;
          announce(next ? 'Bionic reading enabled' : 'Bionic reading disabled');
          return next;
        });
      }

      // Alt + R: Toggle Reading Ruler
      if (e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setRulerEnabled(r => {
          const next = !r;
          announce(next ? 'Reading ruler enabled' : 'Reading ruler disabled');
          return next;
        });
      }

      // Alt + S: Open Persona Simulator
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsPersonaSimulatorOpen(prev => !prev);
      }

      // Alt + D: Open Deliverables
      if (e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsDeliverablesModalOpen(prev => !prev);
      }

      // Alt + T: Cycle Themes
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        const themes = ['obsidian', 'light', 'sepia', 'mint', 'irlen', 'contrast'];
        setTheme(current => {
          const next = themes[(themes.indexOf(current) + 1) % themes.length];
          announce(`Switched theme to ${next}`);
          return next;
        });
      }

      // Space: Toggle Speech Play / Pause
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

      // Escape: Close active modals
      if (e.key === 'Escape') {
        setIsPersonaSimulatorOpen(false);
        setIsDeliverablesModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ttsState, sourceText, ttsRate]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 theme-${theme} bg-obsidian-900 text-obsidian-text`}>
      
      {/* ARIA Live Region for Screen Readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="a11y-status">
        {a11yAnnouncement}
      </div>

      {/* Skip to Main Content Link */}
      <a 
        href="#main-workspace" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg font-bold shadow-2xl"
      >
        Skip to main reading workspace
      </a>

      {/* Sticky Accessibility Navigation Bar */}
      <Navbar
        bionicEnabled={bionicEnabled}
        onToggleBionic={() => {
          setBionicEnabled(b => !b);
          announce(!bionicEnabled ? 'Bionic reading enabled' : 'Bionic reading disabled');
        }}
        fixationRatio={fixationRatio}
        onChangeFixationRatio={setFixationRatio}

        rulerEnabled={rulerEnabled}
        onToggleRuler={() => {
          setRulerEnabled(r => !r);
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

        onOpenPersonaSimulator={() => setIsPersonaSimulatorOpen(true)}
        onOpenDeliverablesModal={() => setIsDeliverablesModalOpen(true)}
      />

      {/* Main Dual-Pane Reading Workspace */}
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
        />
      </main>

      {/* Cursor-Tracking Focus Reading Ruler Overlay */}
      <ReadingRuler
        enabled={rulerEnabled}
        mode={rulerMode}
        onToggle={() => setRulerEnabled(false)}
        onModeChange={setRulerMode}
      />

      {/* Interactive Persona Barrier Simulator Modal */}
      <PersonaSimulator
        isOpen={isPersonaSimulatorOpen}
        onClose={() => setIsPersonaSimulatorOpen(false)}
      />

      {/* Hackathon Deliverables Viewer Modal */}
      <DeliverablesModal
        isOpen={isDeliverablesModalOpen}
        onClose={() => setIsDeliverablesModalOpen(false)}
      />

      {/* Accessible Footer */}
      <footer className="border-t border-obsidian-border bg-obsidian-900/90 py-4 px-6 text-center text-xs text-obsidian-muted">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>🧠 CogniEase • Built for <b>THRIVE 26 Hackathon</b></span>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Hotkeys: <kbd className="bg-obsidian-800 px-1.5 py-0.5 rounded border border-obsidian-border">Alt+B</kbd> Bionic • <kbd className="bg-obsidian-800 px-1.5 py-0.5 rounded border border-obsidian-border">Alt+R</kbd> Ruler • <kbd className="bg-obsidian-800 px-1.5 py-0.5 rounded border border-obsidian-border">Space</kbd> Speech</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

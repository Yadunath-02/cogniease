import React, { useState, useEffect } from 'react';
import { Minus, Plus, X, MoveVertical } from 'lucide-react';

/**
 * ReadingRuler Component
 * 
 * Provides an interactive visual tracking anchor following the user's cursor
 * or keyboard arrows. Bounded by sleek Cyan/Indigo lines, dimming the background
 * to 60% opacity with backdrop blur to prevent vertical line skipping.
 */
export default function ReadingRuler({
  enabled,
  mode = 'focus-line', // 'focus-line' | 'guide-bar' | 'spotlight'
  onToggle,
  onModeChange
}) {
  const [positionY, setPositionY] = useState(300);
  const [rulerHeight, setRulerHeight] = useState(90); // 90px slit
  const [opacity, setOpacity] = useState(0.60); // 60% opacity dimming
  const [tintColor, setTintColor] = useState('cyan'); // 'cyan' | 'indigo' | 'emerald'

  // Mouse, Touch & Keyboard Tracking
  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e) => {
      setPositionY(e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        setPositionY(e.touches[0].clientY);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        setPositionY(prev => Math.max(50, prev - 24));
      } else if (e.key === 'ArrowDown') {
        setPositionY(prev => Math.min(window.innerHeight - 50, prev + 24));
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled]);

  if (!enabled) return null;

  const topOverlayHeight = Math.max(0, positionY - rulerHeight / 2);
  const bottomOverlayTop = Math.min(window.innerHeight, positionY + rulerHeight / 2);

  const getBorderColor = () => {
    switch (tintColor) {
      case 'indigo': return '#818CF8';
      case 'emerald': return '#34D399';
      case 'cyan':
      default: return '#38BDF8';
    }
  };

  const getGuideBg = () => {
    switch (tintColor) {
      case 'indigo': return 'rgba(99, 102, 241, 0.08)';
      case 'emerald': return 'rgba(16, 185, 129, 0.08)';
      case 'cyan':
      default: return 'rgba(56, 189, 248, 0.08)';
    }
  };

  return (
    <>
      {/* 1. FOCUS LINE MODE (Top & Bottom 60% Dimming with Backdrop Blur) */}
      {mode === 'focus-line' && (
        <>
          <div 
            className="reading-ruler-overlay-top pointer-events-none"
            style={{ 
              height: `${topOverlayHeight}px`,
              backgroundColor: `rgba(0, 0, 0, ${opacity})`,
              backdropFilter: 'blur(2px)'
            }}
            aria-hidden="true"
          />
          <div 
            className="reading-ruler-overlay-bottom pointer-events-none"
            style={{ 
              top: `${bottomOverlayTop}px`,
              backgroundColor: `rgba(0, 0, 0, ${opacity})`,
              backdropFilter: 'blur(2px)'
            }}
            aria-hidden="true"
          />
          {/* 90px Spotlight Slit with Cyan/Indigo Borders */}
          <div
            className="fixed left-0 right-0 pointer-events-none z-40 border-y-2 transition-all duration-75 shadow-ruler-glow"
            style={{
              top: `${topOverlayHeight}px`,
              height: `${rulerHeight}px`,
              borderColor: getBorderColor(),
              backgroundColor: getGuideBg()
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* 2. GUIDE BAR MODE */}
      {mode === 'guide-bar' && (
        <div
          className="reading-ruler-guide-bar border-t-2 border-b-2 transition-all duration-75"
          style={{
            top: `${positionY - rulerHeight / 2}px`,
            height: `${rulerHeight}px`,
            backgroundColor: 'rgba(56, 189, 248, 0.20)',
            borderColor: getBorderColor()
          }}
          aria-hidden="true"
        />
      )}

      {/* 3. SPOTLIGHT MODE */}
      {mode === 'spotlight' && (
        <div
          className="fixed inset-0 pointer-events-none z-40 transition-all duration-75"
          style={{
            background: `radial-gradient(circle 200px at 50% ${positionY}px, transparent 0%, rgba(0, 0, 0, ${opacity + 0.15}) 100%)`,
            backdropFilter: 'blur(1px)'
          }}
          aria-hidden="true"
        />
      )}

      {/* Floating Ruler Controls HUD */}
      <div 
        className="fixed bottom-20 right-6 z-50 flex items-center gap-2 bg-obsidian-900/95 border border-obsidian-border text-white px-3.5 py-2 rounded-full shadow-dock backdrop-blur-md text-xs font-mono"
        role="region"
        aria-label="Reading Ruler Quick Controls"
      >
        <div className="flex items-center gap-1.5 font-bold pr-2 border-r border-obsidian-border text-cyan-400">
          <MoveVertical className="w-4 h-4" />
          <span>Focus Ruler</span>
        </div>

        {/* Height Adjust */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setRulerHeight(h => Math.max(40, h - 10))}
            className="p-1 rounded hover:bg-obsidian-700 active:scale-95 text-obsidian-muted hover:text-white"
            title="Narrow Ruler Height"
            aria-label="Decrease Ruler Height"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center text-obsidian-text font-bold">{rulerHeight}px</span>
          <button
            onClick={() => setRulerHeight(h => Math.min(180, h + 10))}
            className="p-1 rounded hover:bg-obsidian-700 active:scale-95 text-obsidian-muted hover:text-white"
            title="Expand Ruler Height"
            aria-label="Increase Ruler Height"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onToggle}
          className="p-1 rounded-full hover:bg-rose-900/50 text-obsidian-muted hover:text-rose-300 ml-1"
          title="Turn Off Reading Ruler"
          aria-label="Disable Reading Ruler"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { Eye, Minus, Plus, Settings2, X, MoveVertical } from 'lucide-react';

/**
 * ReadingRuler Component
 * 
 * Provides an interactive visual tracking anchor following the user's cursor
 * or keyboard arrows to eliminate vertical line skipping, reduce visual crowding,
 * and support readers with ADHD, Dyslexia, and Visual Stress.
 */
export default function ReadingRuler({
  enabled,
  mode = 'focus-line', // 'focus-line' | 'guide-bar' | 'spotlight'
  onToggle,
  onModeChange
}) {
  const [positionY, setPositionY] = useState(300);
  const [rulerHeight, setRulerHeight] = useState(54);
  const [opacity, setOpacity] = useState(0.65);
  const [tintColor, setTintColor] = useState('yellow'); // 'yellow' | 'blue' | 'mint' | 'rose'
  const [showControls, setShowControls] = useState(false);

  // Mouse & Touch Tracking
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

  const getGuideColor = () => {
    switch (tintColor) {
      case 'blue': return 'rgba(56, 189, 248, 0.35)';
      case 'mint': return 'rgba(52, 211, 153, 0.35)';
      case 'rose': return 'rgba(251, 113, 133, 0.35)';
      case 'yellow':
      default: return 'rgba(250, 204, 21, 0.35)';
    }
  };

  const getBorderColor = () => {
    switch (tintColor) {
      case 'blue': return '#38BDF8';
      case 'mint': return '#34D399';
      case 'rose': return '#FB7185';
      case 'yellow':
      default: return '#FACC15';
    }
  };

  return (
    <>
      {/* 1. FOCUS LINE MODE (Top & Bottom Dimming Masks) */}
      {mode === 'focus-line' && (
        <>
          <div 
            className="reading-ruler-overlay-top pointer-events-none"
            style={{ 
              height: `${topOverlayHeight}px`,
              backgroundColor: `rgba(0, 0, 0, ${opacity})`
            }}
            aria-hidden="true"
          />
          <div 
            className="reading-ruler-overlay-bottom pointer-events-none"
            style={{ 
              top: `${bottomOverlayTop}px`,
              backgroundColor: `rgba(0, 0, 0, ${opacity})`
            }}
            aria-hidden="true"
          />
          {/* Active Highlight Slot */}
          <div
            className="fixed left-0 right-0 pointer-events-none z-40 border-y-2 transition-all duration-75"
            style={{
              top: `${topOverlayHeight}px`,
              height: `${rulerHeight}px`,
              borderColor: getBorderColor(),
              backgroundColor: getGuideColor().replace('0.35', '0.08')
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* 2. GUIDE BAR MODE (Translucent horizontal reading ruler bar) */}
      {mode === 'guide-bar' && (
        <div
          className="reading-ruler-guide-bar border-t-2 border-b-2 transition-all duration-75"
          style={{
            top: `${positionY - rulerHeight / 2}px`,
            height: `${rulerHeight}px`,
            backgroundColor: getGuideColor(),
            borderColor: getBorderColor()
          }}
          aria-hidden="true"
        />
      )}

      {/* 3. SPOTLIGHT MODE (Radial focal mask) */}
      {mode === 'spotlight' && (
        <div
          className="fixed inset-0 pointer-events-none z-40 transition-all duration-75"
          style={{
            background: `radial-gradient(circle 180px at 50% ${positionY}px, transparent 0%, rgba(0, 0, 0, ${opacity + 0.1}) 100%)`
          }}
          aria-hidden="true"
        />
      )}

      {/* Floating Ruler Controls HUD */}
      <div 
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-obsidian-800/95 border border-obsidian-border text-white px-3 py-2 rounded-full shadow-2xl backdrop-blur-md text-xs"
        role="region"
        aria-label="Reading Ruler Quick Controls"
      >
        <div className="flex items-center gap-1.5 font-medium pr-2 border-r border-obsidian-border text-amber-400">
          <MoveVertical className="w-4 h-4" />
          <span>Ruler Active</span>
        </div>

        {/* Mode Selector */}
        <select
          value={mode}
          onChange={(e) => onModeChange && onModeChange(e.target.value)}
          className="bg-obsidian-700 text-white rounded px-2 py-1 text-xs border border-obsidian-border focus:ring-1 focus:ring-amber-400"
          aria-label="Ruler Mode"
        >
          <option value="focus-line">Focus Line (Masked)</option>
          <option value="guide-bar">Guide Bar (Translucent)</option>
          <option value="spotlight">Spotlight Circle</option>
        </select>

        {/* Height Adjust */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setRulerHeight(h => Math.max(30, h - 8))}
            className="p-1 rounded hover:bg-obsidian-700 active:scale-95 text-gray-300 hover:text-white"
            title="Narrow Ruler Height"
            aria-label="Decrease Ruler Height"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-gray-300">{rulerHeight}px</span>
          <button
            onClick={() => setRulerHeight(h => Math.min(140, h + 8))}
            className="p-1 rounded hover:bg-obsidian-700 active:scale-95 text-gray-300 hover:text-white"
            title="Expand Ruler Height"
            aria-label="Increase Ruler Height"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Color Tint Cycle */}
        <button
          onClick={() => {
            const tints = ['yellow', 'blue', 'mint', 'rose'];
            const nextIdx = (tints.indexOf(tintColor) + 1) % tints.length;
            setTintColor(tints[nextIdx]);
          }}
          className="px-2 py-1 rounded bg-obsidian-700 hover:bg-obsidian-600 font-medium capitalize border border-obsidian-border text-gray-200"
          title="Cycle Color Tint"
        >
          Tint: {tintColor}
        </button>

        {/* Close Button */}
        <button
          onClick={onToggle}
          className="p-1 rounded-full hover:bg-rose-900/50 text-gray-400 hover:text-rose-300 ml-1"
          title="Turn Off Reading Ruler"
          aria-label="Disable Reading Ruler"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}

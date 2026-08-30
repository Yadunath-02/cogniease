import React from 'react';
import {
  ArrowLeft,
  Zap,
  Sparkles,
  Volume2,
  Mic,
  Eye,
  Layers,
  ScanLine,
  Brain
} from 'lucide-react';

/**
 * ToolNav Component - Persistent horizontal tool switching bar
 */
export default function ToolNav({ currentView, onSelectView }) {
  const tools = [
    { id: 'bionic', label: 'Bionic Read', icon: Zap },
    { id: 'simplifier', label: 'AI Simplifier', icon: Sparkles },
    { id: 'voice', label: 'Voice Suite', icon: Mic },
    { id: 'ruler', label: 'Focus Ruler', icon: ScanLine },
    { id: 'sandbox', label: 'Barrier Sandbox', icon: Brain }
  ];

  return (
    <nav 
      className="sticky top-[61px] z-20 border-b border-obsidian-border bg-obsidian-950/95 backdrop-blur-md px-4 py-2 font-ui"
      aria-label="Workspace tool switcher"
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3 overflow-x-auto">
        
        {/* Back to Home Grid */}
        <button
          onClick={() => onSelectView('home')}
          className="flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-obsidian-800 hover:bg-obsidian-700 text-obsidian-muted hover:text-white border border-obsidian-border transition shrink-0"
          title="Return to Tool Grid (Home)"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Tools</span>
        </button>

        {/* Horizontal Tool Switching Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {tools.map((t) => {
            const Icon = t.icon;
            const isActive = currentView === t.id;

            return (
              <button
                key={t.id}
                onClick={() => onSelectView(t.id)}
                className={`flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 border border-indigo-500 text-white font-extrabold shadow-md shadow-indigo-500/25'
                    : 'bg-obsidian-800/80 hover:bg-obsidian-800 text-obsidian-text border border-obsidian-border/80 hover:border-indigo-500/40'
                }`}
                aria-pressed={isActive}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Current Mode Badge */}
        <div className="hidden md:flex items-center gap-1 text-[11px] font-mono text-obsidian-muted shrink-0">
          <span>Active:</span>
          <span className="font-bold text-indigo-400 uppercase">{currentView}</span>
        </div>

      </div>
    </nav>
  );
}

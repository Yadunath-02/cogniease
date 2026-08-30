import React from 'react';
import {
  Zap,
  Sparkles,
  Volume2,
  Mic,
  Eye,
  Layers,
  FileText,
  ShieldAlert,
  Brain,
  ScanLine,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Award
} from 'lucide-react';

/**
 * HomeGrid Component - Goblin.tools inspired 2x3 tool selector grid
 */
export default function HomeGrid({ onSelectView, onOpenDeliverables }) {
  const tools = [
    {
      id: 'bionic',
      title: 'Bionic Reading Engine',
      subtitle: 'Saccadic eye-anchoring & fixation guidance for ADHD & Dyslexia',
      icon: Zap,
      iconColor: 'text-cyan-400',
      badge: 'Saccadic Fixation',
      badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      tag: 'Speed +35%',
      glowColor: 'bg-cyan-500/5 group-hover:bg-cyan-500/10'
    },
    {
      id: 'simplifier',
      title: 'AI Plain-Language Simplifier',
      subtitle: 'Translates dense legal & academic jargon into Grade-5 clarity',
      icon: Sparkles,
      iconColor: 'text-emerald-400',
      badge: 'De-Jargonizer',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      tag: 'Grade 5-8',
      glowColor: 'bg-emerald-500/5 group-hover:bg-emerald-500/10'
    },
    {
      id: 'voice',
      title: 'Voice Suite (TTS & STT)',
      subtitle: 'High-speed audio reader with real-time Speech-to-Text dictation',
      icon: Mic,
      iconColor: 'text-indigo-400',
      badge: 'Multisensory Audio',
      badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      tag: 'Karaoke Sync',
      glowColor: 'bg-indigo-500/5 group-hover:bg-indigo-500/10'
    },
    {
      id: 'ruler',
      title: 'Focus Spotlight Ruler',
      subtitle: 'Peripheral noise reduction slit tracking your cursor position',
      icon: ScanLine,
      iconColor: 'text-sky-400',
      badge: 'ADHD Anchor',
      badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      tag: '60% Dimming',
      glowColor: 'bg-sky-500/5 group-hover:bg-sky-500/10'
    },
    {
      id: 'sandbox',
      title: 'Cognitive Barrier Sandbox',
      subtitle: 'Simulate ADHD wandering, dyslexia drift, and sensory overload',
      icon: Brain,
      iconColor: 'text-purple-400',
      badge: 'Empathy Engine',
      badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      tag: 'Simulations',
      glowColor: 'bg-purple-500/5 group-hover:bg-purple-500/10'
    },
    {
      id: 'deliverables',
      title: 'Research & Deliverables',
      subtitle: 'WCAG 2.2 AAA audits, prompt logs, and neurodiversity specs',
      icon: FileText,
      iconColor: 'text-teal-400',
      badge: 'THRIVE 26',
      badgeColor: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
      tag: 'Audits & Prompts',
      glowColor: 'bg-teal-500/5 group-hover:bg-teal-500/10',
      onClick: onOpenDeliverables
    }
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-12 animate-in fade-in duration-300">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        
        {/* Brand Icon + Name Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-obsidian-800/90 border border-obsidian-border shadow-sm mb-6 backdrop-blur-md">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-xs">
            CE
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">
            CogniEase
          </span>
          <span className="text-obsidian-muted">•</span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-700/60">
            [WCAG 2.2 AAA]
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            [Neurodiversity Engine]
          </span>
        </div>

        {/* Tagline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
          A collection of cognitive accessibility tools for when reading and decoding feel{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
            too overwhelming.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-obsidian-muted font-medium leading-relaxed max-w-2xl mx-auto">
          Single-purpose, distraction-free assistive utilities engineered to dismantle neurodivergent friction, reduce cognitive load, and restore focus.
        </p>
      </div>

      {/* 2x3 Bento Tool Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isModalTrigger = tool.id === 'deliverables';

          return (
            <button
              key={tool.id}
              onClick={() => {
                if (isModalTrigger && tool.onClick) {
                  tool.onClick();
                } else {
                  onSelectView(tool.id);
                }
              }}
              className="text-left p-6 rounded-2xl bg-obsidian-800/80 hover:bg-obsidian-800 border border-obsidian-border hover:border-indigo-500/60 transition-all flex flex-col justify-between group hover:-translate-y-1.5 duration-200 shadow-bento relative overflow-hidden"
            >
              {/* Subtle accent hover glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${tool.glowColor} rounded-full blur-2xl transition-colors pointer-events-none`} />

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="p-3 rounded-xl bg-obsidian-900 border border-obsidian-border group-hover:border-indigo-500/50 transition-colors shadow-inner">
                    <Icon className={`w-6 h-6 ${tool.iconColor}`} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>
                </div>

                <h2 className="text-base font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {tool.title}
                </h2>

                <p className="text-xs text-obsidian-muted leading-relaxed mb-6 font-normal">
                  {tool.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-obsidian-border/80 flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-indigo-400 group-hover:text-indigo-300 group-hover:underline">
                  {isModalTrigger ? 'View Documentation →' : 'Launch Tool Workspace →'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-obsidian-900 border border-obsidian-border text-obsidian-muted group-hover:text-white">
                  {tool.tag}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Scientific Trust Badges */}
      <div className="p-4 rounded-2xl bg-obsidian-800/40 border border-obsidian-border/80 flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-obsidian-muted">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>7:1 AAA Contrast Ratios</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>Saccadic Bionic Fixation Curve</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          <span>Chromium-Resilient TTS + STT</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-purple-400" />
          <span>Sweller's Cognitive Load Optimized</span>
        </div>
      </div>

    </div>
  );
}

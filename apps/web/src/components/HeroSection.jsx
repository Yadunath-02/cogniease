import React from 'react';
import {
  Zap,
  Volume2,
  Mic,
  Wand2,
  Eye,
  Layers,
  ArrowDown,
  Sparkles,
  ShieldCheck,
  Headphones,
  Sliders
} from 'lucide-react';

export default function HeroSection({
  onLaunchTool,
  bionicEnabled,
  rulerEnabled,
  ttsState,
  isRecording
}) {
  const tools = [
    {
      id: 'bionic',
      title: 'Bionic Saccadic Engine',
      icon: Zap,
      iconColor: 'text-ambergold-400',
      badge: 'Cognitive Eye-Tracking',
      badgeColor: 'bg-ambergold-500/15 text-ambergold-400 border-ambergold-500/40',
      desc: 'Guided eye-fixation reading with real-time syllable detection and gold-weighted glyph anchors to eliminate tracking fatigue.',
      actionText: bionicEnabled ? 'Active in Workspace ✓' : 'Launch Bionic Mode →',
      active: bionicEnabled
    },
    {
      id: 'voice',
      title: 'Voice Suite (TTS & STT)',
      icon: Headphones,
      iconColor: 'text-cyan-400',
      badge: 'Multisensory Audio',
      badgeColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40',
      desc: 'High-precision Web Speech TTS with word-by-word karaoke highlighting plus live hands-free browser Speech-to-Text dictation.',
      actionText: ttsState === 'playing' || isRecording ? 'Audio Active 🎙️' : 'Launch Voice Suite →',
      active: ttsState === 'playing' || isRecording
    },
    {
      id: 'simplifier',
      title: 'AI Plain-Language Simplifier',
      icon: Wand2,
      iconColor: 'text-emerald-400',
      badge: 'De-Jargon Engine',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
      desc: 'Instantly decompresses dense multi-clause legal contracts, clinical abstracts, and RFCs into Grade 6–8 plain-language summaries.',
      actionText: 'Simplify Jargon →',
      active: false
    },
    {
      id: 'ruler',
      title: 'Focus Spotlight & Ruler',
      icon: Eye,
      iconColor: 'text-amber-400',
      badge: 'ADHD Attention Mask',
      badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
      desc: 'Dims peripheral visual distractions with a 60% opacity backdrop blur, isolating active lines to eliminate line-skipping errors.',
      actionText: rulerEnabled ? 'Ruler Active ✓' : 'Launch Spotlight Ruler →',
      active: rulerEnabled
    },
    {
      id: 'sandbox',
      title: 'Barrier Simulator Sandbox',
      icon: Layers,
      iconColor: 'text-purple-400',
      badge: 'Empathy Engine',
      badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/40',
      desc: 'Interactive testing ground simulating Dyslexic character-drift, ADHD wandering thoughts, and Irlen visual photophobia glare.',
      actionText: 'Open Sandbox →',
      active: false
    }
  ];

  return (
    <section className="relative pt-8 pb-12 px-4 border-b border-obsidian-border bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-900 overflow-hidden">
      
      {/* Decorative Glow Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-ambergold-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto relative z-10">
        
        {/* Header Badge & Headline */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-obsidian-800/90 border border-obsidian-border shadow-sm mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-ambergold-400" />
            <span className="text-[11px] font-bold font-mono text-white tracking-wide">
              ✦ AI & Cognitive Accessibility Studio
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-700/60">
              WCAG 2.2 AAA
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            Cognitive Freedom for{' '}
            <span className="bg-gradient-to-r from-ambergold-400 via-yellow-200 to-emerald-400 bg-clip-text text-transparent">
              Every Mind.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-obsidian-muted font-medium leading-relaxed max-w-2xl mx-auto">
            Choose an intelligent assistive engine to eliminate reading fatigue, decode complex literature, or dictate hands-free with studio-grade accessibility tools.
          </p>
        </div>

        {/* 5-Card Modular Bento Tool Launcher Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onLaunchTool(tool.id)}
                className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between group hover:-translate-y-1 duration-200 shadow-bento ${
                  tool.active
                    ? 'bg-obsidian-800/95 border-ambergold-500/80 shadow-focus-aaa'
                    : 'bg-obsidian-800/60 hover:bg-obsidian-800 border-obsidian-border hover:border-ambergold-500/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className={`p-2.5 rounded-xl bg-obsidian-900 border border-obsidian-border group-hover:border-ambergold-500/50 transition-colors shadow-inner`}>
                      <Icon className={`w-5 h-5 ${tool.iconColor}`} />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-ambergold-400 transition-colors">
                    {tool.title}
                  </h3>

                  <p className="text-xs text-obsidian-muted leading-relaxed mb-4">
                    {tool.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-obsidian-border/70 flex items-center justify-between text-xs font-mono font-bold">
                  <span className={tool.active ? 'text-ambergold-400' : 'text-gray-300 group-hover:text-white'}>
                    {tool.actionText}
                  </span>
                  <span className="text-obsidian-muted group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Scroll Indicator Prompt */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-mono font-semibold text-obsidian-muted select-none">
          <span>Active Cognitive Workspace Below</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-ambergold-400" />
        </div>

      </div>
    </section>
  );
}

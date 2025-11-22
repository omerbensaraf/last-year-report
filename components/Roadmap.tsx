

import React from 'react';
import { SECTIONS } from '../constants';
import { SectionId } from '../types';
import { Circle, CheckCircle2, Radio } from 'lucide-react';

interface RoadmapProps {
  activeSectionId: string;
  onSelectSection: (id: SectionId) => void;
}

export const Roadmap: React.FC<RoadmapProps> = ({ activeSectionId, onSelectSection }) => {
  const activeIndex = SECTIONS.findIndex(s => s.id === activeSectionId);

  return (
    <nav className="relative h-full w-full flex flex-col p-6 z-10 border-r border-white/5 bg-void/40 backdrop-blur-md shadow-[5px_0_30px_rgba(0,0,0,0.5)] overflow-hidden">
      <style>{`
        @keyframes beam-flow-up {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% -200%; }
        }
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes hue-shift {
          0% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(30deg); }
          100% { filter: hue-rotate(0deg); }
        }
        @keyframes gradient-text {
           0% { background-position: 0% 50%; }
           50% { background-position: 100% 50%; }
           100% { background-position: 0% 50%; }
        }
        .active-path-animated {
          background: linear-gradient(to top, 
            #0ea5e9 0%, 
            #7dd3fc 50%, 
            #0ea5e9 100%
          );
          background-size: 100% 200%;
          animation: beam-flow-up 3s linear infinite;
        }
        .animate-subtle-float {
           animation: subtle-float 5s ease-in-out infinite;
        }
        .animate-logo-text {
           background-size: 200% auto;
           animation: gradient-text 4s ease infinite;
        }
      `}</style>

      {/* Header - Elbit Identity */}
      <div className="mb-10 pl-2 relative flex-shrink-0 border-b border-white/10 pb-6 group">
        <div className="flex flex-col items-start animate-subtle-float">
           <div className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyber-300 to-white animate-logo-text leading-none drop-shadow-lg mb-1">
              Elbit Systems
           </div>
           <div className="text-[10px] font-bold text-cyber-500 uppercase tracking-[0.2em] mb-3 transition-colors duration-500 group-hover:text-cyber-300">
              Software Applications
           </div>
           
           {/* Mini Logo Graphic */}
           <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-gradient-to-r from-gold-500 to-gold-300 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              <div className="h-1 w-2 bg-cyber-500 rounded-full" />
           </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 mt-4">
           <span className="animate-pulse bg-green-500 w-1.5 h-1.5 rounded-full shadow-[0_0_5px_#22c55e]"></span>
           <span>SYSTEM_ONLINE // 2025_REPORT</span>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative flex-1 flex flex-col justify-between py-2">
        
        {/* Path Container */}
        <div className="absolute left-[35px] top-[28px] bottom-[28px] w-[2px]">
            {/* Background Line */}
            <div className="absolute inset-0 bg-slate-800/50 rounded-full" />

            {/* Active Path (Progress Line) */}
            <div 
                className="absolute top-0 left-0 w-full rounded-full active-path-animated shadow-[0_0_15px_#0ea5e9] transition-all duration-700 ease-in-out"
                style={{ 
                    height: `${ (activeIndex / (SECTIONS.length - 1)) * 100 }%`
                }}
            />
        </div>

        {SECTIONS.map((section, index) => {
          const isActive = activeSectionId === section.id;
          const isPast = activeIndex > index;
          
          return (
            <button
              key={section.id}
              onClick={() => onSelectSection(section.id as SectionId)}
              className={`group relative flex items-center w-full py-4 pl-2 pr-4 transition-all duration-500 outline-none text-left`}
            >
              {/* Node Visualization */}
              <div className={`
                relative z-10 flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-500 shrink-0
                ${isActive 
                  ? 'border-cyber-400 bg-cyber-950 shadow-[0_0_20px_rgba(14,165,233,0.6)] scale-110' 
                  : isPast 
                    ? 'border-cyber-700 bg-cyber-900/80 text-cyber-400'
                    : 'border-slate-800 bg-slate-950/50 opacity-60 group-hover:border-slate-600 group-hover:opacity-100'
                }
              `}>
                {/* Inner Dot/Icon */}
                {isActive ? (
                   <Radio size={24} className="text-cyber-300 animate-pulse" />
                ) : isPast ? (
                   <CheckCircle2 size={20} className="text-cyber-600" />
                ) : (
                   <Circle size={16} className="text-slate-600" />
                )}
                
                {/* Connecting ring for active */}
                {isActive && (
                    <div className="absolute inset-0 rounded-full border border-cyber-400/30 animate-ping" />
                )}
              </div>

              {/* Connector Line Segment to Text */}
              <div className={`h-[1px] w-4 transition-all duration-500 ${isActive ? 'bg-cyber-500 w-8 shadow-[0_0_5px_#0ea5e9]' : 'bg-transparent w-2'}`} />

              {/* Label Container */}
              <div className={`flex flex-col items-start transition-all duration-500 ${isActive ? 'translate-x-2' : ''}`}>
                <span className={`text-[10px] font-mono mb-1 uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-cyber-400' : 'text-slate-600'}`}>
                  Step 0{index + 1}
                </span>
                <span className={`text-sm md:text-base font-bold tracking-wide transition-all duration-300 ${isActive ? 'text-white drop-shadow-md' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {section.title}
                </span>
              </div>

              {/* Hover/Active Glow Background for Item */}
              <div className={`absolute inset-0 rounded-xl transition-opacity duration-500 pointer-events-none
                 ${isActive ? 'bg-gradient-to-r from-cyber-500/10 to-transparent opacity-100' : 'opacity-0 group-hover:bg-white/5'}
              `} />
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pl-4 flex items-center gap-2 opacity-50 flex-shrink-0 border-t border-white/5 pt-4">
         <div className="w-2 h-2 bg-slate-600 rounded-full animate-pulse" />
         <span className="text-[10px] text-slate-500 font-mono uppercase">Elbit / Sec_Level_4</span>
      </div>
    </nav>
  );
};
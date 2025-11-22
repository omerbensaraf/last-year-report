
import React, { useState, useEffect } from 'react';
import { ChevronRight, QrCode, X, ExternalLink, Copy, AlertTriangle } from 'lucide-react';

interface IntroProps {
  onStart: () => void;
}

export const Intro: React.FC<IntroProps> = ({ onStart }) => {
  const [exiting, setExiting] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    // Robust URL generation
    const currentUrl = window.location.href.split('?')[0];
    const uploadLink = `${currentUrl}?mode=upload`;
    
    setLinkText(uploadLink);
    setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    // Generate QR Code URL using the API
    const apiSrc = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&bgcolor=1e293b&color=ffffff&data=${encodeURIComponent(uploadLink)}`;
    setQrUrl(apiSrc);
  }, []);

  const handleClick = () => {
    setExiting(true);
    setTimeout(onStart, 800); // Wait for animation
  };

  const copyLink = () => {
    navigator.clipboard.writeText(linkText);
    alert("Link copied to clipboard!");
  };

  const openLink = () => {
    window.open(linkText, '_blank');
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ${exiting ? 'opacity-0 scale-150 blur-sm' : 'opacity-100 scale-100'}`}>
      
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-void/10" />

      {/* Modal for QR Code */}
      {showQr && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fade-in">
          <div className="relative bg-slate-900 border border-cyber-500/30 rounded-2xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(14,165,233,0.2)]">
            <button 
              onClick={() => setShowQr(false)} 
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-bold text-white mb-2">Share Memories</h3>
            <p className="text-slate-400 text-sm mb-6">
              Scan to upload photos to the event album.
            </p>
            
            {/* QR Code Display */}
            <div className="bg-slate-800 p-2 rounded-xl mb-6 mx-auto w-64 h-64 shadow-inner flex items-center justify-center overflow-hidden">
              {qrUrl ? (
                  <img 
                    src={qrUrl} 
                    alt="Scan to upload" 
                    className="w-full h-full object-contain"
                  />
              ) : (
                  <div className="text-white animate-pulse">Generating Code...</div>
              )}
            </div>

            {isLocalhost && (
               <div className="mb-6 p-3 bg-orange-500/10 border border-orange-500/30 rounded text-left flex gap-3">
                  <AlertTriangle className="text-orange-500 shrink-0" size={20} />
                  <p className="text-[11px] text-orange-200 leading-tight">
                    <strong>Localhost Detected:</strong> Your phone cannot reach "localhost". To test with a phone, deploy this app (Vercel/Netlify). <br/><br/>
                    <strong>For Demo:</strong> Click "Open Upload Tool" below to open a new tab on this computer.
                  </p>
               </div>
            )}
            
            {/* Action Buttons for Fallback */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <button 
                  onClick={openLink}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-cyber-600 hover:bg-cyber-500 text-white rounded-lg transition-colors text-sm font-bold"
                >
                   <ExternalLink size={16} /> Open Upload Tool
                </button>
                <button 
                  onClick={copyLink}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-sm font-bold"
                >
                   <Copy size={16} /> Copy Link
                </button>
            </div>

            <div className="text-[10px] text-slate-500 font-mono bg-black/30 p-2 rounded border border-white/5 break-all">
              {linkText}
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center text-center p-4 w-full h-full justify-center">
        
        {/* TOP LEFT: REAL ELBIT LOGO */}
        <div className="absolute top-8 left-8 flex items-center gap-4 opacity-90 hover:opacity-100 transition-opacity">
             {/* The Logo Mark */}
             <svg viewBox="0 0 300 150" className="w-16 h-auto md:w-32 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                <path d="M75 60 L150 15 L225 60" stroke="white" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M30 105 L110 105 L130 90 L270 90" stroke="white" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
             </svg>
             <div className="text-left border-l-2 border-white/20 pl-4">
                 <div className="text-xl md:text-2xl font-black italic text-white leading-none tracking-tighter uppercase">Elbit Systems</div>
             </div>
        </div>

        {/* CENTER LOGO ANIMATION */}
        <div className="mb-12 mt-8 relative group flex justify-center items-center perspective-1000">
             <style>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                @keyframes float-3d {
                  0%, 100% { transform: rotateX(10deg) rotateY(-10deg) translateY(0); }
                  50% { transform: rotateX(5deg) rotateY(10deg) translateY(-20px); }
                }
                @keyframes text-color-cycle {
                  0%, 100% { fill: #ffffff; }
                  33% { fill: #0ea5e9; } /* Cyber Blue */
                  66% { fill: #fbbf24; } /* Gold */
                }
                .animate-float-3d { animation: float-3d 8s ease-in-out infinite; }
                .animate-text-cycle { animation: text-color-cycle 8s ease-in-out infinite; }
             `}</style>

             {/* Ambient Glow */}
             <div className="absolute w-[500px] h-[300px] bg-cyber-500/20 rounded-full blur-[80px] animate-pulse-slow" />
             
             {/* The 3D Logo Container */}
             <div className="relative w-[400px] h-[200px] md:w-[700px] md:h-[350px] preserve-3d animate-float-3d">
                 
                 <svg viewBox="0 0 300 150" className="w-full h-full overflow-visible drop-shadow-[0_0_40px_rgba(14,165,233,0.6)]">
                    <defs>
                        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="50%" stopColor="#0ea5e9" />
                            <stop offset="100%" stopColor="#ffffff" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Top Roof Path */}
                    <path 
                        id="roofPath"
                        d="M75 60 L150 15 L225 60" 
                        stroke="url(#logoGradient)" 
                        strokeWidth="8" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        fill="none"
                        filter="url(#glow)"
                        className="opacity-90"
                    />

                    {/* Bottom Road Path */}
                    <path 
                        id="roadPath"
                        d="M30 105 L110 105 L130 90 L270 90" 
                        stroke="url(#logoGradient)" 
                        strokeWidth="8" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        fill="none"
                        filter="url(#glow)"
                        className="opacity-90"
                    />

                    {/* Text Integration - WITH COLOR CYCLE */}
                    <text 
                        x="150" y="85" 
                        textAnchor="middle" 
                        fill="white" 
                        className="text-4xl font-black italic tracking-tighter animate-text-cycle" 
                        style={{ fontFamily: 'sans-serif', fontWeight: 900 }}
                    >
                        ELBIT SYSTEMS
                    </text>

                    {/* Traveling Particles (Simulating Data/Code) */}
                    <circle r="4" fill="#fbbf24">
                        <animateMotion dur="3s" repeatCount="indefinite" path="M75 60 L150 15 L225 60" rotate="auto">
                            <mpath href="#roofPath"/>
                        </animateMotion>
                    </circle>
                     <circle r="4" fill="#fbbf24">
                        <animateMotion dur="4s" begin="1.5s" repeatCount="indefinite" path="M75 60 L150 15 L225 60" rotate="auto">
                            <mpath href="#roofPath"/>
                        </animateMotion>
                    </circle>

                    <circle r="4" fill="#22d3ee">
                        <animateMotion dur="4s" repeatCount="indefinite" path="M30 105 L110 105 L130 90 L270 90" rotate="auto">
                             <mpath href="#roadPath"/>
                        </animateMotion>
                    </circle>
                    <circle r="4" fill="#22d3ee">
                        <animateMotion dur="3.5s" begin="1s" repeatCount="indefinite" path="M30 105 L110 105 L130 90 L270 90" rotate="auto">
                             <mpath href="#roadPath"/>
                        </animateMotion>
                    </circle>
                 </svg>
             </div>
        </div>

        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-cyber-200 to-cyber-600 tracking-widest outline-text drop-shadow-lg uppercase mb-6 mt-4">
          Software Applications Group
        </h2>

        {/* Slogan */}
        <p className="text-xl md:text-3xl lg:text-4xl text-white font-slogan transform -rotate-1 mb-16 animate-pulse-slow drop-shadow-[0_5px_5px_rgba(0,0,0,1)] opacity-90">
          "Code the Future. Innovate Every Line"
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-6 scale-100 md:scale-110 origin-top">
          
          {/* Start Button */}
          <button 
            onClick={handleClick}
            className="group relative w-72 px-8 py-4 bg-transparent overflow-hidden rounded-none border border-cyber-500 transition-all duration-300 hover:bg-cyber-500/10 hover:border-cyber-400 hover:shadow-[0_0_30px_rgba(14,165,233,0.4)]"
          >
            <div className="absolute inset-0 w-0 bg-cyber-500 transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
            <div className="flex items-center justify-center gap-3">
                <span className="text-xl font-mono tracking-widest text-cyber-300 group-hover:text-white">INITIALIZE</span>
                <ChevronRight className="text-cyber-500 group-hover:text-white group-hover:translate-x-1 transition-transform" size={24} />
            </div>
          </button>

          {/* QR Code Button */}
          <button 
            onClick={() => setShowQr(true)}
            className="group relative w-72 px-8 py-4 bg-transparent overflow-hidden rounded-none border border-slate-600 transition-all duration-300 hover:bg-slate-800/50 hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <div className="flex items-center justify-center gap-3">
                <QrCode className="text-slate-400 group-hover:text-white transition-colors" size={24} />
                <span className="text-xl font-mono tracking-widest text-slate-400 group-hover:text-white">CONTRIBUTE</span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};


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

      <div className="relative z-10 flex flex-col items-center text-center p-4">
        
        {/* Elbit Systems Logo Header */}
        <div className="absolute top-8 left-8 flex items-center gap-3 opacity-80">
             <div className="w-12 h-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-white transform -skew-x-12"></div>
             </div>
             <div className="text-left">
                 <div className="text-xl font-black italic text-white leading-none tracking-tighter">Elbit Systems</div>
             </div>
        </div>

        {/* CENTER 3D LOGO ANIMATION */}
        <div className="mb-16 mt-12 relative group perspective-1000">
             {/* Glow Effect */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyber-500/20 rounded-full blur-[80px] animate-pulse-slow" />
             
             {/* The 3D E Shape */}
             <div className="relative w-48 h-48 md:w-64 md:h-64 transform-style-3d animate-float">
                 <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_40px_rgba(14,165,233,0.6)]">
                    <defs>
                        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#e0f2fe" />
                            <stop offset="40%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#0ea5e9" />
                        </linearGradient>
                        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                             <stop offset="0%" stopColor="#fbbf24" />
                             <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                        <filter id="glowFilter">
                             <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                             <feMerge>
                                 <feMergeNode in="coloredBlur"/>
                                 <feMergeNode in="SourceGraphic"/>
                             </feMerge>
                        </filter>
                    </defs>
                    
                    {/* Outer Shield / Circuit Hexagon Context */}
                    <path 
                        d="M100 10 L180 50 L180 150 L100 190 L20 150 L20 50 Z" 
                        fill="none" 
                        stroke="rgba(14,165,233,0.3)" 
                        strokeWidth="1"
                        className="animate-spin-slow" 
                        style={{ transformOrigin: '100px 100px' }}
                    />

                    {/* The Main E Block */}
                    <path 
                        d="M50 40 L160 40 L150 70 L90 70 L90 95 L140 95 L130 120 L90 120 L90 145 L150 145 L140 175 L50 175 Z" 
                        fill="url(#logoGrad)"
                        stroke="white"
                        strokeWidth="0.5"
                        filter="url(#glowFilter)"
                        className="opacity-90"
                    />
                    
                    {/* The Lightning/Arrow Accent (The 'S' implied) */}
                    <path 
                        d="M110 20 L130 20 L110 100 L130 100 L110 180 L90 180 L110 100 L90 100 Z" 
                        fill="url(#goldGrad)" 
                        className="mix-blend-overlay opacity-60 animate-pulse"
                    />
                 </svg>
                 
                 {/* Floating Particles */}
                 <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '20s' }}>
                     <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
                     <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-gold-400 rounded-full shadow-[0_0_10px_#fbbf24]" />
                 </div>
             </div>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-cyber-200 to-cyber-600 tracking-widest outline-text drop-shadow-lg uppercase mb-2">
          Software Applications Group
        </h2>

        {/* Slogan */}
        <p className="text-xl md:text-3xl text-white font-slogan transform -rotate-1 mb-16 animate-pulse-slow drop-shadow-[0_5px_5px_rgba(0,0,0,1)] opacity-90">
          "Code the Future. Innovate Every Line"
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          
          {/* Start Button */}
          <button 
            onClick={handleClick}
            className="group relative w-64 px-8 py-4 bg-transparent overflow-hidden rounded-none border border-cyber-500 transition-all duration-300 hover:bg-cyber-500/10 hover:border-cyber-400 hover:shadow-[0_0_30px_rgba(14,165,233,0.4)]"
          >
            <div className="absolute inset-0 w-0 bg-cyber-500 transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
            <div className="flex items-center justify-center gap-3">
                <span className="text-lg font-mono tracking-widest text-cyber-300 group-hover:text-white">INITIALIZE</span>
                <ChevronRight className="text-cyber-500 group-hover:text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* QR Code Button */}
          <button 
            onClick={() => setShowQr(true)}
            className="group relative w-64 px-8 py-4 bg-transparent overflow-hidden rounded-none border border-slate-600 transition-all duration-300 hover:bg-slate-800/50 hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <div className="flex items-center justify-center gap-3">
                <QrCode className="text-slate-400 group-hover:text-white transition-colors" size={20} />
                <span className="text-lg font-mono tracking-widest text-slate-400 group-hover:text-white">CONTRIBUTE</span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};

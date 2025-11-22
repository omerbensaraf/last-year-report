
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { SectionContent } from '../types';
import { CheckCircle2, Quote, Upload, Wand2, Plus, Hash, Wifi, WifiOff, Maximize2, X } from 'lucide-react';
import { INNOVATION_QUOTES } from '../constants';
import { isFirebaseReady } from '../firebase';

interface ContentSlideProps {
  data: SectionContent;
  liveImages?: string[];
  connectionStatus?: 'connected' | 'disconnected' | 'error';
}

// Helper to format text with bold segments using **text** syntax
const formatText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={index} className="font-bold text-cyber-400 drop-shadow-[0_0_5px_rgba(56,189,248,0.5)]">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

// Robust Component to animate numbers counting up
const CountUp: React.FC<{ value: string }> = ({ value }) => {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const numberPattern = /([\d,]+(?:\.\d+)?)/g;
    const matches = value.match(numberPattern);
    if (!matches) {
        setDisplay(value);
        return;
    }

    const targets = matches.map(str => parseFloat(str.replace(/,/g, '')));
    const duration = 2000; 
    const start = performance.now();
    let frameId: number;

    const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); 

        let matchIndex = 0;
        const nextDisplay = value.replace(numberPattern, (matchedStr) => {
             const target = targets[matchIndex];
             const current = target * ease;
             matchIndex++;

             const isDecimal = matchedStr.includes('.');
             const decimalPlaces = isDecimal ? matchedStr.split('.')[1].length : 0;

             let formattedString = isDecimal ? current.toFixed(decimalPlaces) : Math.floor(current).toString();
             
             if (matchedStr.includes(',')) {
                 const parts = formattedString.split('.');
                 parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                 formattedString = parts.join('.');
             }
             return formattedString;
        });

        setDisplay(nextDisplay);
        if (progress < 1) {
            frameId = requestAnimationFrame(animate);
        } else {
            setDisplay(value);
        }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return <span>{display}</span>;
};

// Quote Ticker Component
const QuoteTicker: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * INNOVATION_QUOTES.length));
  const [animClass, setAnimClass] = useState('anim-fade-in');
  const [trigger, setTrigger] = useState(0);

  const animations = ['anim-fade-in', 'anim-slide-up', 'anim-mask-reveal', 'anim-zoom-in'];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % INNOVATION_QUOTES.length);
      setAnimClass(animations[Math.floor(Math.random() * animations.length)]);
      setTrigger(prev => prev + 1); 
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full relative overflow-hidden">
       <div key={trigger} className={`flex items-start gap-4 text-cyber-300/90 font-mono text-sm md:text-base tracking-wide leading-relaxed ${animClass}`}>
         <Quote size={20} className="text-gold-500 shrink-0 mt-1 opacity-80" />
         <span className="block flex-1 whitespace-normal break-words">"{INNOVATION_QUOTES[quoteIndex]}"</span>
       </div>
    </div>
  );
};

export const ContentSlide: React.FC<ContentSlideProps> = ({ data, liveImages = [], connectionStatus = 'disconnected' }) => {
  const [animate, setAnimate] = useState(false);
  const [localImages, setLocalImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [focusedImage, setFocusedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local storage fallback just in case
  useEffect(() => {
    if (!isFirebaseReady) {
        const loadImages = () => {
            try {
                const stored = localStorage.getItem('gallery_uploads');
                if (stored) {
                    setLocalImages(JSON.parse(stored));
                }
            } catch (e) {
                console.error("Failed to load local images", e);
            }
        };
        loadImages();
    }
  }, []);

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 10);
    return () => clearTimeout(timer);
  }, [data.id]);

  // Handle Drop for Direct Upload (Local only for simplicity here, or trigger upload logic)
  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          processFile(e.dataTransfer.files[0]);
      }
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
  };

  const handleDragLeave = () => {
      setIsDragging(false);
  };

  const processFile = (file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
          const newImage = reader.result as string;
          // For drag and drop we add to local state for immediate feedback
          setLocalImages(prev => [newImage, ...prev]);
      };
      reader.readAsDataURL(file);
  };

  const addSimulationImages = () => {
      const demoImages = [
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=500&q=80'
      ];
      setLocalImages(prev => [...demoImages, ...prev]);
  }

  // Project Grid Config
  const projectConfig = useMemo(() => {
    if (!data.projects) return [];
    const items = data.projects;
    const cols = 4; 
    const rows = Math.ceil(items.length / cols);
    
    return items.map((project, i) => {
       const r = Math.floor(i / cols);
       const c = i % cols;
       
       // Safe margins to prevent clipping (10% - 80%)
       const availableW = 80; 
       const availableH = 80; 
       
       const top = 10 + (r * (availableH/rows)) + (Math.random() * 5);
       const left = 5 + (c * (availableW/cols)) + (Math.random() * 5);

       // Use brighter colors for visibility
       const colors = [
           'text-cyber-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]', 
           'text-gold-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]', 
           'text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]', 
           'text-purple-300 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]'
       ];

       return {
         name: project,
         top, left,
         color: colors[i % colors.length],
         // Stagger entrance by 0.2s for "popping in every second" effect
         entranceDelay: i * 0.2, 
         floatDuration: 4 + Math.random() * 4, 
         floatDelay: Math.random() * -2
       };
    });
  }, [data.projects]);

  // Gallery Configuration
  const galleryConfig = useMemo(() => {
     // Merge standard gallery images, live firebase images, and local interactions
     const allImages = [...(data.galleryImages || []), ...liveImages, ...localImages];
     const uniqueImages = Array.from(new Set(allImages));
     const total = uniqueImages.length;

     // Grid Calculation:
     // Calculate columns based on square root to get a roughly rectangular/square grid
     // Multiplier 1.8 biases towards landscape (more columns, fewer rows) which fits screens better
     const cols = Math.ceil(Math.sqrt(total * 1.8));
     const rows = Math.ceil(total / cols);

     return uniqueImages.map((src, i) => {
         const isNew = i >= (data.galleryImages?.length || 0);
         
         // Deterministic Seed for consistent rendering during re-renders (unless images change)
         const seed = (i * 9301 + 49297) % 233280;
         const rnd = seed / 233280; // 0 to 1
         
         // Calculate Grid Cell
         const c = i % cols;
         const r = Math.floor(i / cols);

         // Calculate Base Percentage Position
         // We use 90% of width and 75% of height to avoid edges and header overlap
         const xStep = 90 / cols;
         const yStep = 75 / rows;

         // Random Jitter within the cell to avoid "Grid" look
         // Limit jitter to 40% of cell size to prevent significant overlap
         const jitterX = (rnd - 0.5) * (xStep * 0.5); 
         const jitterY = ((rnd * 100 % 1) - 0.5) * (yStep * 0.5);

         // Final Coordinates
         const left = 5 + (c * xStep) + (xStep / 2) + jitterX; // Center in cell + jitter
         const top = 15 + (r * yStep) + (yStep / 2) + jitterY; // Start lower (15%) for headers

         // Visual Randomization
         const rotation = (rnd - 0.5) * 16; // -8 to 8 degrees
         const scale = 0.9 + (rnd * 0.2); // 0.9 to 1.1 size variation

         // Float Animation Params
         // Reduced movement range to prevent collisions during animation
         const floatDuration = 8 + (rnd * 8); 
         const delay = i * 0.15;
         const xMove = (rnd > 0.5 ? 1 : -1) * 12; 
         const yMove = (rnd > 0.5 ? 1 : -1) * 12;

         return {
             src,
             rotation,
             scale,
             top,
             left,
             floatDuration,
             delay,
             xMove,
             yMove,
             isNew
         };
     });
  }, [data.galleryImages, localImages, liveImages]);

  // --- GALLERY MODE ---
  if (data.id === 'gallery') {
      return (
        <main 
            className={`relative w-full h-full overflow-hidden ${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 bg-black`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
             <style>{`
                @keyframes spaceFloat {
                    0% { transform: translate(-50%, -50%) translate(0px, 0px) rotate(var(--rot)) scale(var(--sc)); }
                    33% { transform: translate(-50%, -50%) translate(var(--mx), var(--my)) rotate(var(--rot)) scale(var(--sc)); }
                    66% { transform: translate(-50%, -50%) translate(calc(var(--mx) * -0.5), calc(var(--my) * 0.5)) rotate(var(--rot)) scale(var(--sc)); }
                    100% { transform: translate(-50%, -50%) translate(0px, 0px) rotate(var(--rot)) scale(var(--sc)); }
                }
                .gallery-card-container {
                    perspective: 1000px;
                    will-change: transform, z-index;
                }
                /* Apply z-index boost to container on hover to escape stacking context issues */
                .gallery-card-container:hover {
                    z-index: 9999 !important;
                }
                /* Pause animation on hover */
                .gallery-card-container:hover {
                    animation-play-state: paused;
                }

                .gallery-card {
                    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
                }
                
                /* The pop effect happens on the inner card when the container is hovered */
                .gallery-card-container:hover .gallery-card {
                    transform: rotate(0deg) scale(1.35); /* 35% larger on hover */
                    box-shadow: 0 20px 60px rgba(14, 165, 233, 0.4), 0 0 30px rgba(14, 165, 233, 0.2);
                    border-color: #38bdf8;
                }

                /* Glare effect */
                .gallery-card::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(125deg, rgba(255,255,255,0.3) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.1) 100%);
                    opacity: 0.4;
                    pointer-events: none;
                    transition: opacity 0.3s;
                }
             `}</style>
             
             {isDragging && (
                 <div className="absolute inset-0 z-50 bg-cyber-500/20 backdrop-blur-sm border-4 border-dashed border-cyber-400 flex items-center justify-center">
                     <div className="text-4xl font-bold text-white animate-bounce">DROP PHOTOS HERE</div>
                 </div>
             )}

             {/* Focused Image Overlay */}
             {focusedImage && (
                 <div 
                    className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-16 animate-fade-in"
                    onClick={() => setFocusedImage(null)}
                 >
                     <img src={focusedImage} className="max-w-full max-h-full rounded shadow-[0_0_100px_rgba(14,165,233,0.5)] border border-cyber-500/50" />
                     <button className="absolute top-8 right-8 text-white hover:text-cyber-400 bg-black/50 rounded-full p-2">
                         <X size={32} />
                     </button>
                 </div>
             )}

             <div className="absolute top-0 left-0 w-full z-30 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-8 pb-24 pointer-events-none">
                 <div className="flex items-center justify-between max-w-6xl">
                    <div className="flex items-center gap-4">
                        <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-2">{data.title}</h2>
                        
                        {connectionStatus === 'connected' && (
                            <div className="flex items-center gap-2 px-2 py-1 rounded bg-green-900/30 border border-green-500/30 text-green-400 text-xs font-mono animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                                <Wifi size={12} /> CLOUD_LINKED
                            </div>
                        )}
                        {connectionStatus === 'error' && (
                            <div className="flex items-center gap-2 px-2 py-1 rounded bg-red-900/30 border border-red-500/30 text-red-400 text-xs font-mono">
                                <WifiOff size={12} /> OFFLINE_MODE
                            </div>
                        )}
                    </div>
                 </div>
                 <p className="text-xl text-cyber-300 flex items-center gap-2">
                    {data.subtitle}
                    <span className="text-xs bg-cyber-900/50 border border-cyber-500/30 px-2 py-1 rounded text-slate-400">
                        {galleryConfig.length} Items
                    </span>
                 </p>
             </div>

             <div className="absolute bottom-8 right-8 z-40 flex flex-col gap-2">
                 <button 
                    onClick={addSimulationImages}
                    className="bg-slate-800/80 hover:bg-slate-700 text-white p-3 rounded-full backdrop-blur-md border border-white/10 shadow-lg group transition-all"
                    title="Simulate Incoming Photos"
                 >
                     <Wand2 size={20} className="group-hover:rotate-12 transition-transform text-purple-400" />
                 </button>
                 <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-cyber-600 hover:bg-cyber-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:scale-110 transition-all"
                    title="Upload Photo"
                 >
                     <Plus size={24} />
                 </button>
                 <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={(e) => e.target.files && e.target.files[0] && processFile(e.target.files[0])} 
                 />
             </div>

             <div className="absolute inset-0 overflow-visible pointer-events-none">
                {galleryConfig.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 font-mono animate-pulse opacity-50">
                        <Upload size={48} className="mb-4" />
                        <span>DRAG PHOTOS HERE OR UPLOAD</span>
                    </div>
                )}

                {galleryConfig.map((img, idx) => (
                    <div
                        key={`${idx}-${img.src}`}
                        className="absolute gallery-card-container pointer-events-auto cursor-pointer"
                        style={{
                            top: `${img.top}%`,
                            left: `${img.left}%`,
                            // Use a clamped width to keep them large but responsive
                            width: 'clamp(200px, 25vw, 320px)',
                            // @ts-ignore
                            '--rot': `${img.rotation}deg`,
                            // @ts-ignore
                            '--sc': `${img.scale}`,
                             // @ts-ignore
                            '--mx': `${img.xMove}px`,
                             // @ts-ignore
                            '--my': `${img.yMove}px`,
                            animation: `spaceFloat ${img.floatDuration}s ease-in-out infinite`,
                            animationDelay: `${img.delay}s`,
                            zIndex: Math.floor(img.scale * 10)
                        }}
                        onClick={() => setFocusedImage(img.src)}
                    >
                        {/* 
                          We render the card with a high aspect ratio of 4/3.
                          The 'transform: translate(-50%, -50%)' is handled in the keyframes
                          to center the card on its grid coordinate.
                        */}
                        <div className="gallery-card relative aspect-[4/3] overflow-hidden rounded-sm bg-slate-900 border-[6px] border-white/90 outline outline-1 outline-black/50">
                            <img src={img.src} alt="Memory" className="w-full h-full object-cover" />
                            
                            {img.isNew && (
                                <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded shadow-lg animate-pulse z-10">
                                    NEW
                                </div>
                            )}
                            
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="text-[8px] text-cyber-300 font-mono">IMG_{1000+idx}_RAW</div>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
        </main>
      );
  }

  // --- STANDARD CONTENT MODE ---
  return (
    <main className={`relative w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth ${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { 
            0% { opacity: 0; transform: scale(0); } 
            70% { opacity: 1; transform: scale(1.1); } 
            100% { opacity: 1; transform: scale(1); } 
        }
        @keyframes floatWander { 
           0% { transform: translate(0,0); } 
           25% { transform: translate(10px, -5px); }
           50% { transform: translate(0, -10px); } 
           75% { transform: translate(-10px, -5px); }
           100% { transform: translate(0,0); } 
        }
        .anim-fade-in { animation: fadeIn 1s ease-out forwards; }
        .anim-slide-up { animation: slideUp 1s ease-out forwards; }
      `}</style>

      {/* Sticky Ticker */}
      <div className="sticky top-0 z-40 w-full bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-2">
         <div className="max-w-6xl mx-auto flex items-center gap-3">
            <span className="text-[10px] text-cyber-400 font-mono uppercase px-2 py-1 bg-cyber-900/50 rounded border border-cyber-500/20">Live_Feed</span>
            <QuoteTicker />
         </div>
      </div>

      <div className="p-8 lg:p-16 max-w-7xl mx-auto">
            <header className="mb-12 animate-slide-in">
                <h2 className="text-5xl md:text-7xl font-bold text-white mb-2 tracking-tighter">{data.title}</h2>
                <h3 className="text-2xl text-slate-400 font-light border-l-4 border-cyber-500 pl-4">{data.subtitle}</h3>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-24">
                {/* Left: Text & Bullets */}
                <div className="lg:col-span-7 space-y-8">
                    <p className="text-xl leading-relaxed text-slate-300 font-light anim-fade-in">{data.description}</p>

                    {/* Render Tags */}
                    {data.tags && (
                      <div className="flex flex-wrap gap-2 mt-4 anim-slide-up">
                        {data.tags.map((tag, i) => (
                          <span 
                            key={i} 
                            className="flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs md:text-sm font-mono text-cyber-300 hover:bg-cyber-500/20 hover:border-cyber-400 hover:text-white transition-all"
                          >
                            <Hash size={12} className="opacity-50"/> {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {data.bullets && (
                        <div className="space-y-6 mt-8">
                            {data.bullets.map((b, i) => (
                                <div key={i} className="flex items-start space-x-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all anim-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                                    <CheckCircle2 className="text-cyber-500 mt-1 shrink-0" size={20} />
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-1">{b.title}</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">{formatText(b.description)}</p>
                                        {b.lesson && (
                                            <div className="mt-3 inline-block px-3 py-1 rounded bg-black/40 border-l-2 border-slate-600">
                                                <span className="text-xs text-slate-500 uppercase mr-2">Lesson:</span>
                                                <span className={`font-slogan ${b.lessonColor || 'text-white'}`}>{b.lesson}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Projects Cloud */}
                    {data.projects && (
                        <div className="mt-12 relative h-[450px] w-full bg-gradient-to-b from-cyber-900/20 to-transparent rounded-2xl border border-white/10 overflow-hidden shadow-inner group">
                            <div className="absolute top-3 left-4 text-xs font-mono text-cyber-500 uppercase tracking-wider z-10 bg-black/40 px-2 rounded">Project_Matrix_Active</div>
                            {projectConfig.map((p, i) => (
                                <div 
                                    key={i} 
                                    className={`absolute font-bold text-2xl md:text-3xl lg:text-4xl ${p.color} whitespace-nowrap hover:scale-110 hover:z-20 transition-transform cursor-default drop-shadow-lg`}
                                    style={{
                                        top: `${p.top}%`,
                                        left: `${p.left}%`,
                                        // 'backwards' ensures the opacity is 0 before animation starts
                                        animation: `popIn 0.6s cubic-bezier(0.17, 0.67, 0.83, 0.67) backwards, floatWander ${p.floatDuration}s ease-in-out infinite alternate`,
                                        animationDelay: `${p.entranceDelay}s, ${p.entranceDelay}s` 
                                    }}
                                >
                                    {p.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: KPIs & Images */}
                <div className="lg:col-span-5 space-y-8">
                    {data.illustration && (
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group anim-zoom-in">
                            <img src={data.illustration} className="w-full h-auto object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Visual" />
                            <div className="absolute inset-0 bg-cyber-500/10 mix-blend-overlay" />
                        </div>
                    )}

                    {data.kpis && (
                        <div className="grid grid-cols-1 gap-4">
                            {data.kpis.map((k, i) => (
                                <div key={i} className="bg-slate-900/50 border border-white/10 p-6 rounded-xl relative group overflow-hidden hover:border-cyber-500/40 transition-colors anim-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="text-xs text-slate-500 uppercase font-mono mb-2">{k.label}</div>
                                    
                                    {/* Special Font for "5 Networks" */}
                                    {k.label === '5 Networks' ? (
                                        <div className="text-lg md:text-xl font-mono font-bold text-cyber-300 leading-relaxed tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyber-300 via-white to-cyber-300">
                                            {k.value}
                                        </div>
                                    ) : (
                                        <div className="text-3xl md:text-4xl font-bold text-cyber-400">
                                            {/\d/.test(k.value) && k.value.length < 15 ? <CountUp value={k.value} /> : k.value}
                                        </div>
                                    )}

                                    {k.trend && (
                                        <div className={`absolute top-6 right-6 text-xs font-bold px-2 py-1 rounded ${k.positive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                            {k.trend}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
      </div>
    </main>
  );
};

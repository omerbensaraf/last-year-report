
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { SectionContent } from '../types';
import { CheckCircle2, Quote, Upload, Wand2, Plus, Hash } from 'lucide-react';
import { INNOVATION_QUOTES } from '../constants';

interface ContentSlideProps {
  data: SectionContent;
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

export const ContentSlide: React.FC<ContentSlideProps> = ({ data }) => {
  const [animate, setAnimate] = useState(false);
  const [localImages, setLocalImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load images from storage and listen for changes (cross-tab sync)
  useEffect(() => {
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
    
    // Listen for updates from other tabs
    const handleStorage = (e: StorageEvent) => {
        if (e.key === 'gallery_uploads') loadImages();
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    setAnimate(false);
    const timer = setTimeout(() => setAnimate(true), 10);
    return () => clearTimeout(timer);
  }, [data.id]);

  // Handle Drop for Direct Upload
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
          const updated = [...localImages, newImage];
          setLocalImages(updated);
          localStorage.setItem('gallery_uploads', JSON.stringify(updated));
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
      const updated = [...localImages, ...demoImages];
      setLocalImages(updated);
      localStorage.setItem('gallery_uploads', JSON.stringify(updated));
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
     const allImages = [...(data.galleryImages || []), ...localImages];
     return allImages.map((src, i) => {
         const isNew = i >= (data.galleryImages?.length || 0);
         const seed = (i * 9301 + 49297) % 233280;
         const random = seed / 233280;
         const top = 5 + (random * 70); 
         const left = 5 + ((seed % 100) / 100) * 80; 
         const rotation = (random - 0.5) * 40;
         const scale = 0.7 + (random * 0.5);

         return {
             src,
             rotation,
             scale,
             top,
             left,
             floatDuration: 8 + (random * 8),
             delay: i * 0.2,
             isNew
         };
     });
  }, [data.galleryImages, localImages]);

  // --- GALLERY MODE ---
  if (data.id === 'gallery') {
      return (
        <main 
            className={`relative w-full h-full overflow-hidden ${animate ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
             <style>{`
                @keyframes floatCard {
                    0%, 100% { transform: translateY(0) rotate(var(--rot)) scale(var(--sc)); }
                    50% { transform: translateY(-20px) rotate(var(--rot)) scale(var(--sc)); }
                }
             `}</style>
             
             {isDragging && (
                 <div className="absolute inset-0 z-50 bg-cyber-500/20 backdrop-blur-sm border-4 border-dashed border-cyber-400 flex items-center justify-center">
                     <div className="text-4xl font-bold text-white animate-bounce">DROP PHOTOS HERE</div>
                 </div>
             )}

             <div className="absolute top-0 left-0 w-full z-30 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-8 pb-24 pointer-events-none">
                 <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-2">{data.title}</h2>
                 <p className="text-xl text-cyber-300 flex items-center gap-2">
                    {data.subtitle}
                    <span className="text-xs bg-cyber-900/50 border border-cyber-500/30 px-2 py-1 rounded text-slate-400">
                        {galleryConfig.length} Memories
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

             <div className="absolute inset-0 overflow-hidden">
                {galleryConfig.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 font-mono animate-pulse opacity-50">
                        <Upload size={48} className="mb-4" />
                        <span>DRAG PHOTOS HERE OR UPLOAD</span>
                    </div>
                )}

                {galleryConfig.map((img, idx) => (
                    <div
                        key={`${idx}-${img.src}`}
                        className="absolute p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl hover:z-50 transition-all duration-500 cursor-pointer group"
                        style={{
                            top: `${img.top}%`,
                            left: `${img.left}%`,
                            width: '220px',
                            // @ts-ignore
                            '--rot': `${img.rotation}deg`,
                            // @ts-ignore
                            '--sc': `${img.scale}`,
                            animation: `floatCard ${img.floatDuration}s ease-in-out infinite`,
                            animationDelay: `${img.delay}s`,
                            transition: 'top 1s, left 1s'
                        }}
                    >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-900">
                            <img src={img.src} alt="Memory" className="w-full h-full object-cover opacity-90 group-hover:opacity-100" />
                            {img.isNew && (
                                <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded shadow-lg animate-pulse">
                                    NEW
                                </div>
                            )}
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

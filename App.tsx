
import React, { useState, useEffect } from 'react';
import { Background } from './components/Background';
import { Roadmap } from './components/Roadmap';
import { ContentSlide } from './components/ContentSlide';
import { Intro } from './components/Intro';
import { UploadView } from './components/UploadView';
import { SECTIONS } from './constants';
import { SectionId } from './types';
import { Menu, X } from 'lucide-react';
import { db, isFirebaseReady } from './firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

const App: React.FC = () => {
  // Lazy initialization for upload mode to prevent main app render on mobile
  const [isUploadMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('mode') === 'upload';
    }
    return false;
  });

  const [showIntro, setShowIntro] = useState(true);
  const [warpSpeed, setWarpSpeed] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<SectionId>('identity');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [liveMemories, setLiveMemories] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');

  useEffect(() => {
    // If we are in upload mode, do NOT setup the listener for downloading images
    if (isUploadMode) return;

    // --- GLOBAL FIREBASE LISTENER ---
    let unsubscribe: () => void;

    if (isFirebaseReady && db) {
      try {
        // We use a basic query without 'orderBy' to avoid "Missing Index" errors during prototype phase.
        // We will sort in Javascript instead.
        const q = query(collection(db, "memories"));
        
        unsubscribe = onSnapshot(q, (snapshot) => {
           const docs = snapshot.docs.map(doc => doc.data());
           // Client-side sort by timestamp descending
           docs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
           
           const urls = docs.map(d => d.url).filter(u => !!u);
           setLiveMemories(urls);
           setConnectionStatus('connected');
        }, (error) => {
           console.error("Firebase Live Sync Error:", error);
           setConnectionStatus('error');
        });
      } catch (err) {
        console.error("Failed to setup Firebase listener:", err);
        setConnectionStatus('error');
      }
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isUploadMode]);

  // If in upload mode, render the upload interface immediately
  if (isUploadMode) {
    return <UploadView />;
  }

  const activeSectionData = SECTIONS.find(s => s.id === activeSectionId) || SECTIONS[0];

  const handleStart = () => {
    setWarpSpeed(true); // Engage warp speed
    setTimeout(() => {
      setShowIntro(false);
      setWarpSpeed(false); // Return to normal speed after transition
    }, 800);
  };

  const handleSectionChange = (id: SectionId) => {
    setActiveSectionId(id);
    setMobileMenuOpen(false);
  };

  // Key to force remounting of content when intro finishes or section changes
  const contentKey = `${activeSectionId}-${showIntro ? 'intro' : 'main'}`;

  return (
    <div className="relative w-screen h-screen flex overflow-hidden font-sans text-white">
      <Background warpSpeed={warpSpeed} />

      {showIntro && (
        <Intro onStart={handleStart} />
      )}

      {/* Main App Transition Wrapper */}
      <div className={`absolute inset-0 flex transition-opacity duration-1000 ${showIntro ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
        
        {/* Desktop Layout */}
        <div className="hidden lg:flex w-full h-full z-10">
          {/* Sidebar (Roadmap) - Fixed width */}
          <div className="w-80 h-full flex-shrink-0">
            <Roadmap activeSectionId={activeSectionId} onSelectSection={handleSectionChange} />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 h-full relative">
            <ContentSlide 
              key={contentKey} 
              data={activeSectionData} 
              liveImages={liveMemories}
              connectionStatus={connectionStatus}
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden w-full h-full z-10 flex flex-col">
          {/* Mobile Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-void/80 backdrop-blur-md">
            <span className="font-bold text-lg tracking-wider italic">Elbit Systems</span>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div className="absolute top-16 left-0 w-full h-[calc(100%-4rem)] bg-void/95 backdrop-blur-xl z-50 overflow-y-auto">
              <Roadmap activeSectionId={activeSectionId} onSelectSection={handleSectionChange} />
            </div>
          )}

          {/* Mobile Content */}
          <div className="flex-1 overflow-hidden">
            <ContentSlide 
              key={`${contentKey}-mobile`} 
              data={activeSectionData} 
              liveImages={liveMemories}
              connectionStatus={connectionStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

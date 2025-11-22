
import React, { useState } from 'react';
import { Upload, Check, Camera, ArrowLeft, RefreshCcw } from 'lucide-react';

export const UploadView: React.FC = () => {
  const [uploaded, setUploaded] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if (!preview) return;
    
    setIsUploading(true);

    // Save to local storage
    try {
        const existing = localStorage.getItem('gallery_uploads');
        const uploads = existing ? JSON.parse(existing) : [];
        uploads.push(preview);
        localStorage.setItem('gallery_uploads', JSON.stringify(uploads));
        
        // Trigger storage event for current window if opened in same window context (edge case)
        window.dispatchEvent(new Event('storage'));
    } catch (e) {
        console.error("Storage failed", e);
    }

    setTimeout(() => {
      setIsUploading(false);
      setUploaded(true);
    }, 1000);
  };

  const reset = () => {
    setUploaded(false);
    setPreview(null);
  };

  if (uploaded) {
    return (
      <div className="min-h-screen bg-[#05050a] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full" />
            <div className="relative w-24 h-24 bg-gradient-to-tr from-green-500 to-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-bounce">
                <Check size={48} className="text-white" />
            </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Upload Complete</h1>
        <p className="text-slate-400 max-w-xs mx-auto leading-relaxed">
            Your photo is now live in the presentation gallery.
        </p>
        
        <button 
          onClick={reset}
          className="mt-12 flex items-center gap-2 px-8 py-3 rounded-full bg-slate-800 border border-slate-700 text-white font-mono text-sm hover:bg-slate-700 transition-all"
        >
          <RefreshCcw size={16} /> UPLOAD ANOTHER
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05050a] text-white flex flex-col relative overflow-hidden font-sans">
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyber-900/20 via-[#05050a] to-[#05050a] pointer-events-none" />

       <div className="flex items-center p-6 relative z-10">
         <div className="p-2 bg-cyber-900/50 rounded-lg border border-cyber-500/20 mr-4">
            <Camera className="text-cyber-400" size={24} />
         </div>
         <div>
            <h1 className="font-bold text-lg leading-none">Photo Contribution</h1>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Secure_Link</span>
         </div>
       </div>
       
       <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 relative z-10 w-full max-w-md mx-auto">
          
          <div className="w-full aspect-[4/5] rounded-3xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center bg-slate-900/20 relative overflow-hidden group transition-all duration-300 hover:border-cyber-500/50 hover:bg-slate-900/40 shadow-2xl">
             {preview ? (
               <div className="relative w-full h-full">
                   <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                   <button 
                     onClick={() => setPreview(null)}
                     className="absolute top-4 left-4 p-3 bg-black/60 rounded-full text-white backdrop-blur-md hover:bg-red-500/80 transition-colors"
                   >
                       <ArrowLeft size={20} />
                   </button>
               </div>
             ) : (
               <>
                 <div className="w-24 h-24 rounded-full bg-slate-800/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Upload size={40} className="text-slate-400 group-hover:text-cyber-400 transition-colors" />
                 </div>
                 <h3 className="text-xl font-semibold text-slate-300 mb-2">Tap to Upload</h3>
                 <p className="text-slate-500 text-sm text-center px-8">
                    Select a photo from your library or take a new one.
                 </p>
               </>
             )}
             <input 
                type="file" 
                accept="image/*" 
                className={`absolute inset-0 w-full h-full cursor-pointer ${preview ? 'pointer-events-none' : 'opacity-0'}`} 
                onChange={handleFile} 
             />
          </div>

          <button 
              onClick={handleSend}
              disabled={!preview || isUploading}
              className={`w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 flex items-center justify-center gap-2 shadow-lg
                  ${!preview 
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-cyber-600 to-cyber-500 hover:from-cyber-500 hover:to-cyber-400 text-white shadow-cyber-500/20'
                  }
              `}
          >
              {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>SENDING...</span>
                  </>
              ) : (
                  <span>SEND TO SCREEN</span>
              )}
          </button>
       </div>
    </div>
  );
}

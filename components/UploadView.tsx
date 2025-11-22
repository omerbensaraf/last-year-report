
import React, { useState } from 'react';
import { Upload, Check, Camera, ArrowLeft, RefreshCcw, CloudUpload } from 'lucide-react';
import { db, storage, isFirebaseReady } from '../firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

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

  const handleSend = async () => {
    if (!preview) return;
    
    setIsUploading(true);

    try {
        if (isFirebaseReady && storage && db) {
            // --- CLOUD UPLOAD (Production) ---
            // 1. Create a unique filename
            const filename = `memories/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
            const storageRef = ref(storage, filename);

            // 2. Upload the base64 string
            // Add a timeout to prevent infinite hanging
            const uploadTask = uploadString(storageRef, preview, 'data_url');
            
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Upload timed out")), 15000);
            });

            await Promise.race([uploadTask, timeoutPromise]);

            // 3. Get the public URL
            const downloadURL = await getDownloadURL(storageRef);

            // 4. Save metadata to Firestore for real-time syncing
            // Note: We store timestamp as a number for easier sorting
            await addDoc(collection(db, 'memories'), {
                url: downloadURL,
                timestamp: Date.now(),
                type: 'photo'
            });
        } else {
            // --- LOCAL FALLBACK (Demo/No Config) ---
            // This only works if the presentation is running on the SAME device as the uploader
            console.warn("Firebase not configured. Falling back to local storage.");
            const existing = localStorage.getItem('gallery_uploads');
            const uploads = existing ? JSON.parse(existing) : [];
            uploads.push(preview);
            localStorage.setItem('gallery_uploads', JSON.stringify(uploads));
            window.dispatchEvent(new Event('storage'));
        }
        
        setTimeout(() => {
            setIsUploading(false);
            setUploaded(true);
        }, 800);

    } catch (error) {
        console.error("Upload failed:", error);
        setIsUploading(false);
        alert("Upload failed. Please try again.");
    }
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

       <div className="flex items-center p-6 relative z-10 justify-between">
         <div className="flex items-center">
            <div className="p-2 bg-cyber-900/50 rounded-lg border border-cyber-500/20 mr-4">
                <Camera className="text-cyber-400" size={24} />
            </div>
            <div>
                <h1 className="font-bold text-lg leading-none">Photo Contribution</h1>
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                    {isFirebaseReady ? 'Secure_Cloud_Link' : 'Demo_Local_Link'}
                </span>
            </div>
         </div>
         {!isFirebaseReady && (
             <div className="text-[10px] text-orange-500 bg-orange-900/20 px-2 py-1 rounded border border-orange-500/30">
                 Demo Mode
             </div>
         )}
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
                    <span>UPLOADING...</span>
                  </>
              ) : (
                  <>
                    <CloudUpload size={20} />
                    <span>SEND TO SCREEN</span>
                  </>
              )}
          </button>
       </div>
    </div>
  );
}

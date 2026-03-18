import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Loader2, X, AlertCircle, FileDown, ShieldCheck } from 'lucide-react';

// সাবজেক্ট লিস্ট এবং ড্রাইভ লিঙ্কসমূহ (আপনার দেওয়া ৩টি লিঙ্কসহ)
const SUBJECTS = [
  { id: '241101', code: '241101', title: '19th Century Novel', driveUrl: 'https://drive.google.com/file/d/1RHU_MaDGJKjHuN_-xtX3h-diDQx_0HHc/view?usp=drivesdk' },
  { id: '241103', code: '241103', title: '20th Century Poetry', driveUrl: 'https://drive.google.com/file/d/1LhRMna6wShn2jp4Al_oDGyJBXXmi5fYv/view?usp=drivesdk' },
  { id: '241105', code: '241105', title: 'Modern Drama', driveUrl: '#' },
  { id: '241107', code: '241107', title: '20th Century Novel', driveUrl: '#' },
  { id: '241109', code: '241109', title: 'American Poetry', driveUrl: '#' },
  { id: '241111', code: '241111', title: 'American Literature', driveUrl: '#' },
  { id: '241113', code: '241113', title: 'Classics in Translation', driveUrl: '#' },
  { id: '241115', code: '241115', title: 'Literary Criticism', driveUrl: 'https://drive.google.com/file/d/1IzaFvp7N3CPJeh6kCmyDYV_MxzaB60dt/view?usp=drivesdk' },
  { id: '241119', code: '241119', title: 'Methods of Language Teaching', driveUrl: '#' },
];

const App = () => {
  const [downloadingId, setDownloadingId] = useState(null);
  const [cachedFiles, setCachedFiles] = useState({});
  const [viewerUrl, setViewerUrl] = useState(null);
  const [errorToast, setErrorToast] = useState(null);
  const [popupSubject, setPopupSubject] = useState(null);

  useEffect(() => {
    // ক্যাশ চেক করা
    const saved = JSON.parse(localStorage.getItem('saved_notes_final') || '{}');
    setCachedFiles(saved);
  }, []);

  const getFileId = (url) => {
    if (!url || url === '#') return null;
    const match = url.match(/\/d\/(.+?)\//);
    return match ? match[1] : null;
  };

  const handleSubjectClick = (subject) => {
    if (cachedFiles[subject.id]) {
      openViewer(subject);
    } else {
      setPopupSubject(subject);
    }
  };

  const openViewer = (subject) => {
    const id = getFileId(subject.driveUrl);
    if (!id) {
      showError("ফাইলটি এখনো আপলোড করা হয়নি!");
      return;
    }
    setViewerUrl(`https://drive.google.com/file/d/${id}/preview`);
  };

  const startDownload = async (subject) => {
    setPopupSubject(null);
    const id = getFileId(subject.driveUrl);
    if (!id) return;

    setDownloadingId(subject.id);
    
    // ক্যাশিং সিমুলেশন
    setTimeout(() => {
      const updated = { ...cachedFiles, [subject.id]: true };
      setCachedFiles(updated);
      localStorage.setItem('saved_notes_final', JSON.stringify(updated));
      setDownloadingId(null);
      openViewer(subject);
    }, 1200);
  };

  const showError = (msg) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 4000);
  };

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex flex-col overflow-hidden font-sans select-none">
      
      {/* Header */}
      <header className="bg-[#5C42EB] text-white px-5 py-5 shadow-lg z-50 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tighter uppercase leading-none">HandNote 2024</h1>
          <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1.5">Offline Ready System</p>
        </div>
        <div className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
          <span className="text-[8px] font-black uppercase tracking-wider">System Ready</span>
        </div>
      </header>

      {/* Subject Grid - No scrolling on mobile */}
      <main className="flex-1 p-3 grid grid-rows-9 gap-2.5 bg-slate-50/50">
        {SUBJECTS.map((s) => (
          <div 
            key={s.id}
            onClick={() => !downloadingId && handleSubjectClick(s)}
            className={`flex items-center justify-between px-5 rounded-2xl border transition-all active:scale-[0.98] cursor-pointer shadow-sm
              ${cachedFiles[s.id] ? 'bg-white border-green-200 ring-1 ring-green-50' : 'bg-white border-slate-100'}
              ${downloadingId === s.id ? 'opacity-50' : 'hover:border-purple-200'}
            `}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-xl transition-all ${cachedFiles[s.id] ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-[#5C42EB]'}`}>
                {downloadingId === s.id ? <Loader2 size={18} className="animate-spin" /> : <BookOpen size={18} />}
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-[#5C42EB] uppercase tracking-tighter">Code: {s.code}</span>
                <h3 className="text-[12px] font-black text-slate-800 leading-none truncate w-52 tracking-tight">{s.title}</h3>
              </div>
            </div>
            {cachedFiles[s.id] && <CheckCircle size={14} className="text-green-500 opacity-60" />}
          </div>
        ))}
      </main>

      {/* Download Popup */}
      {popupSubject && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#5C42EB] p-8 text-center text-white">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                <FileDown size={32} />
              </div>
              <h2 className="text-xl font-black uppercase">Offline Access?</h2>
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-2">
                Download "{popupSubject.title}" for offline use?
              </p>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4 bg-white">
              <button onClick={() => setPopupSubject(null)} className="py-4 rounded-3xl border-2 border-slate-100 text-slate-400 font-black text-xs uppercase">No</button>
              <button onClick={() => startDownload(popupSubject)} className="py-4 rounded-3xl bg-[#5C42EB] text-white font-black text-xs uppercase flex items-center justify-center gap-2">
                <ShieldCheck size={16} /> Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Super Clean Viewer */}
      {viewerUrl && (
        <div className="fixed inset-0 bg-[#0F172A] z-[250] flex flex-col animate-in fade-in duration-300">
          <div className="flex-1 relative bg-slate-900">
            <button 
              onClick={() => setViewerUrl(null)} 
              className="absolute top-6 left-6 z-[260] p-3 bg-black/30 backdrop-blur-md text-white/60 hover:text-white rounded-full border border-white/10 active:scale-90"
            >
              <X size={26}/>
            </button>
            <iframe src={viewerUrl} className="w-full h-full border-none" allow="autoplay" title="Reader"></iframe>
          </div>
        </div>
      )}

      {/* Toast Error */}
      {errorToast && (
        <div className="fixed bottom-20 left-4 right-4 bg-[#1E293B] text-white p-4 rounded-2xl flex items-center gap-4 shadow-2xl z-[300] animate-in slide-in-from-bottom-5">
          <div className="bg-[#FFD700] p-2 rounded-xl text-slate-900"><AlertCircle size={22} fill="currentColor" stroke="white" /></div>
          <span className="text-[13px] font-black">{errorToast}</span>
        </div>
      )}

      {/* Footer Nav */}
      <footer className="bg-white border-t border-slate-100 p-2 flex justify-around items-center h-16">
        <div className="flex flex-col items-center gap-1 text-[#5C42EB]">
          <div className="w-1.5 h-1.5 bg-[#5C42EB] rounded-full"></div>
          <span className="text-[10px] font-black uppercase">Books</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-200 opacity-50"><span className="text-[10px] font-black uppercase">About</span></div>
        <div className="flex flex-col items-center gap-1 text-slate-200 opacity-50"><span className="text-[10px] font-black uppercase">Help</span></div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `.grid-rows-9 { grid-template-rows: repeat(9, minmax(0, 1fr)); }` }} />
    </div>
  );
};

export default App;


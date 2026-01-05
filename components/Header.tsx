
import React from 'react';

interface Props {
  lang: 'zh' | 'en';
  setLang: (lang: 'zh' | 'en') => void;
}

const Header: React.FC<Props> = ({ lang, setLang }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fas fa-fingerprint text-white text-xl"></i>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">
              {lang === 'zh' ? 'AI 鉴别专家' : 'AI Detective'}
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
              {lang === 'zh' ? '图像真实性鉴定工具' : 'FORENSIC ANALYSIS TOOL'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
          >
            <i className="fas fa-globe text-indigo-400"></i>
            {lang === 'zh' ? 'ENGLISH' : '中文'}
          </button>
          
          <nav className="hidden md:flex items-center gap-6">
            <button className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 rounded-lg text-sm font-semibold transition-all">
              <i className="fas fa-cog"></i>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

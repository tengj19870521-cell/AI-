
import React from 'react';
import { AppTheme } from '../types';

interface Props {
  lang: 'zh' | 'en';
  setLang: (lang: 'zh' | 'en') => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

const Header: React.FC<Props> = ({ lang, setLang, theme, setTheme }) => {
  const themes: { id: AppTheme; color: string; label: string }[] = [
    { id: 'midnight', color: 'bg-purple-600', label: '午夜' },
    { id: 'pure', color: 'bg-slate-200', label: '纯净' },
    { id: 'cyberpunk', color: 'bg-pink-500', label: '赛博' },
    { id: 'nordic', color: 'bg-emerald-600', label: '北欧' },
  ];

  return (
    <header className={`border-b transition-colors duration-500 ${theme === 'pure' ? 'border-slate-200 bg-white/80' : 'border-white/10 bg-black/40'} backdrop-blur-md sticky top-0 z-50`}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg transition-all duration-500 ${
            theme === 'midnight' ? 'bg-indigo-600 shadow-indigo-500/20' :
            theme === 'pure' ? 'bg-slate-800' :
            theme === 'cyberpunk' ? 'bg-pink-600 shadow-pink-500/20' :
            'bg-emerald-600 shadow-emerald-500/20'
          }`}>
            <i className="fas fa-fingerprint text-white text-xl"></i>
          </div>
          <div className="hidden sm:block">
            <h1 className={`font-bold text-lg leading-none transition-colors ${theme === 'pure' ? 'text-slate-900' : 'text-white'}`}>
              {lang === 'zh' ? 'AI 鉴别专家' : 'AI Detective'}
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
              {lang === 'zh' ? '图像真实性鉴定工具' : 'FORENSIC ANALYSIS TOOL'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme Switcher */}
          <div className="flex items-center gap-2 p-1.5 bg-black/20 rounded-full border border-white/5 no-print">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                title={t.label}
                className={`w-6 h-6 rounded-full transition-all duration-300 transform hover:scale-125 ${t.color} ${
                  theme === t.id ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100'
                }`}
              />
            ))}
          </div>

          <button 
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-all flex items-center gap-2 no-print ${
              theme === 'pure' ? 'bg-slate-100 border-slate-200 text-slate-800 hover:border-slate-400' : 'bg-white/5 border-white/10 text-white hover:border-white/30'
            }`}
          >
            <i className="fas fa-globe"></i>
            {lang === 'zh' ? 'EN' : 'ZH'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

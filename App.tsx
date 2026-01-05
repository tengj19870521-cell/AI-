
import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import VerdictBadge from './components/VerdictBadge';
import { analyzeImage } from './services/geminiService';
import { AppState, DetectionVerdict, AppTheme } from './types';

declare const html2canvas: any;

const translations = {
  zh: {
    uploadTitle: "丢张图进来检测",
    uploadHint: "点击或拖拽上传图片",
    analyzeBtn: "一键探测",
    distTitle: "来源可能性分布",
    aiLabel: "AI 生成几率",
    renderLabel: "CG 渲染几率",
    photoLabel: "真实照片几率",
    summaryLabel: "分析摘要",
    metricsLabel: "数字指纹分析",
    promptLabel: "推测 AI 生成咒语",
    resetBtn: "再测一张",
    exportBtn: "导出报告卡片",
    exporting: "正在生成...",
    modelLabel: "疑似机型/软件",
    analyzing: "正在破解像素密码...",
    footerNote: "本实验室结果通过像素指纹分析得出，仅供交流研究参考。"
  },
  en: {
    uploadTitle: "Drop image here",
    uploadHint: "Click or drag to upload",
    analyzeBtn: "Detect",
    distTitle: "Probability Distribution",
    aiLabel: "AI Prob.",
    renderLabel: "CG Prob.",
    photoLabel: "Photo Prob.",
    summaryLabel: "Summary",
    metricsLabel: "Fingerprint Analysis",
    promptLabel: "Prompt Reversal",
    resetBtn: "New Scan",
    exportBtn: "Export Report",
    exporting: "Generating...",
    modelLabel: "Suspected Engine",
    analyzing: "Cracking pixels...",
    footerNote: "Results based on digital fingerprint analysis."
  }
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState & { isExporting: boolean }>({
    image: null,
    isAnalyzing: false,
    result: null,
    error: null,
    language: 'zh',
    theme: (localStorage.getItem('app-theme') as AppTheme) || 'midnight',
    isExporting: false
  });

  const t = translations[state.language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('app-theme', state.theme);
  }, [state.theme]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, image: reader.result as string, result: null, error: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!state.image) return;
    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));
    try {
      const result = await analyzeImage(state.image, state.language);
      setState(prev => ({ ...prev, result, isAnalyzing: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isAnalyzing: false, error: err.message }));
    }
  };

  const exportReport = async () => {
    if (!resultCardRef.current || state.isExporting) return;
    setState(prev => ({ ...prev, isExporting: true }));
    try {
      await new Promise(r => setTimeout(r, 100));
      const canvas = await html2canvas(resultCardRef.current, {
        backgroundColor: state.theme === 'pure' ? '#ffffff' : '#06080c',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.download = `AI-Lab-Report-${Date.now()}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
      window.print();
    } finally {
      setState(prev => ({ ...prev, isExporting: false }));
    }
  };

  const themeClasses = {
    midnight: {
      bg: "bg-[#06080c]",
      text: "text-slate-100",
      card: "bg-[#0f121a] border-white/5",
      accent: "from-purple-600 via-indigo-600 to-cyan-600",
      subAccent: "from-purple-400 to-cyan-400",
      secondaryBtn: "bg-slate-800/40 text-slate-500",
      inputBg: "bg-[#0f121a] border-slate-800",
    },
    pure: {
      bg: "bg-slate-50",
      text: "text-slate-900",
      card: "bg-white border-slate-200 shadow-xl",
      accent: "from-slate-800 to-slate-600",
      subAccent: "from-slate-700 to-slate-900",
      secondaryBtn: "bg-slate-200 text-slate-600",
      inputBg: "bg-white border-slate-200",
    },
    cyberpunk: {
      bg: "bg-black",
      text: "text-white",
      card: "bg-black border-pink-500/30",
      accent: "from-pink-600 via-purple-600 to-amber-500",
      subAccent: "from-pink-400 to-amber-400",
      secondaryBtn: "bg-pink-900/20 text-pink-500 border-pink-500/20",
      inputBg: "bg-black border-pink-500/20",
    },
    nordic: {
      bg: "bg-[#0a1a1a]",
      text: "text-emerald-50",
      card: "bg-[#0d2222] border-emerald-900/50",
      accent: "from-emerald-700 via-teal-700 to-cyan-700",
      subAccent: "from-emerald-400 to-cyan-400",
      secondaryBtn: "bg-emerald-900/20 text-emerald-400",
      inputBg: "bg-[#0d2222] border-emerald-900/30",
    }
  }[state.theme];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${themeClasses.bg} ${themeClasses.text} selection:bg-indigo-500/30`}>
      <div className="no-print">
        <Header 
          lang={state.language} 
          setLang={(l) => setState(prev => ({...prev, language: l}))}
          theme={state.theme}
          setTheme={(t) => setState(prev => ({...prev, theme: t}))}
        />
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Left Panel: Input */}
          <div className="space-y-6 no-print">
            <div className={`relative rounded-[2.5rem] p-1.5 border-2 transition-all duration-700 ${state.image ? 'border-indigo-500/40' : 'border-black/5'}`}>
              <div className={`${themeClasses.inputBg} rounded-[2.3rem] overflow-hidden transition-colors duration-500`}>
                {!state.image ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.03] transition-colors group"
                  >
                    <div className={`w-24 h-24 bg-gradient-to-tr ${themeClasses.accent} rounded-[2rem] flex items-center justify-center mb-8 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-xl`}>
                      <i className="fas fa-plus text-4xl text-white"></i>
                    </div>
                    <h3 className="text-3xl font-black mb-3 tracking-tight">{t.uploadTitle}</h3>
                    <p className="opacity-50 font-medium">{t.uploadHint}</p>
                  </div>
                ) : (
                  <div className="p-4 relative">
                    <img src={state.image} alt="Target" className="w-full aspect-square object-contain rounded-3xl bg-black/20 shadow-inner" />
                    <button 
                      onClick={() => setState(prev => ({...prev, image: null, result: null}))} 
                      className="absolute top-8 right-8 w-12 h-12 bg-black/80 backdrop-blur-xl rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all shadow-xl"
                    >
                      <i className="fas fa-times text-xl"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {state.image && !state.result && (
              <button 
                onClick={handleAnalyze}
                disabled={state.isAnalyzing}
                className={`w-full py-6 bg-gradient-to-r ${themeClasses.accent} hover:brightness-110 active:scale-95 transition-all rounded-3xl text-2xl font-black shadow-2xl disabled:opacity-50 text-white`}
              >
                {state.isAnalyzing ? (
                  <span className="flex items-center justify-center gap-4">
                    <i className="fas fa-circle-notch fa-spin"></i>
                    {t.analyzing}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <i className="fas fa-bolt-lightning"></i>
                    {t.analyzeBtn}
                  </span>
                )}
              </button>
            )}
            
            {state.error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center font-bold">
                {state.error}
              </div>
            )}
          </div>

          {/* Right Panel: Result */}
          <div className="space-y-6">
            {state.result ? (
              <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 space-y-6">
                
                {/* Result Hero */}
                <div ref={resultCardRef} className={`${themeClasses.card} rounded-[2.5rem] p-8 md:p-10 border relative shadow-2xl overflow-hidden group transition-all duration-500`}>
                   {state.theme !== 'pure' && (
                     <>
                      <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-500/10 blur-[100px]"></div>
                      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-cyan-500/10 blur-[100px]"></div>
                     </>
                   )}

                   <div className="flex justify-center mb-8">
                    <VerdictBadge verdict={state.result.verdict} lang={state.language} />
                   </div>
                   
                   <div className="space-y-6 mb-10">
                      <div className="flex justify-between items-end mb-2">
                        <h4 className="text-[11px] font-black opacity-50 uppercase tracking-[0.2em]">{t.distTitle}</h4>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{state.result.suggestedModel || "DNA-LAB V5"}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-5">
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-black">
                            <span className={state.theme === 'pure' ? 'text-indigo-600' : 'text-purple-400'}>{t.aiLabel}</span>
                            <span>{state.result.probabilities.ai}%</span>
                          </div>
                          <div className={`h-3 rounded-full overflow-hidden border ${state.theme === 'pure' ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                            <div className={`h-full bg-gradient-to-r ${themeClasses.subAccent} transition-all duration-1000`} style={{ width: `${state.result.probabilities.ai}%` }}></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-black">
                            <span className={state.theme === 'pure' ? 'text-indigo-600' : 'text-cyan-400'}>{t.renderLabel}</span>
                            <span>{state.result.probabilities.render}%</span>
                          </div>
                          <div className={`h-3 rounded-full overflow-hidden border ${state.theme === 'pure' ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                            <div className={`h-full bg-gradient-to-r ${themeClasses.subAccent} opacity-80 transition-all duration-1000`} style={{ width: `${state.result.probabilities.render}%` }}></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-black">
                            <span className={state.theme === 'pure' ? 'text-indigo-600' : 'text-emerald-400'}>{t.photoLabel}</span>
                            <span>{state.result.probabilities.photo}%</span>
                          </div>
                          <div className={`h-3 rounded-full overflow-hidden border ${state.theme === 'pure' ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                            <div className={`h-full bg-gradient-to-r ${themeClasses.subAccent} opacity-60 transition-all duration-1000`} style={{ width: `${state.result.probabilities.photo}%` }}></div>
                          </div>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="text-[11px] font-black opacity-50 uppercase tracking-[0.2em]">{t.summaryLabel}</div>
                      <div className={`text-lg leading-relaxed font-semibold p-6 rounded-3xl border transition-colors duration-500 ${
                        state.theme === 'pure' ? 'bg-slate-50 border-slate-100 text-slate-700' : 'bg-black/40 border-white/5 text-slate-300'
                      }`}>
                        {state.result.summary}
                      </div>
                   </div>

                   {state.result.verdict === DetectionVerdict.AI_GENERATED && state.result.suggestedPrompt && (
                    <div className="mt-8 pt-8 border-t border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <i className={`fas fa-magic ${state.theme === 'pure' ? 'text-indigo-600' : 'text-purple-400'}`}></i>
                            <h4 className={`text-[11px] font-black uppercase tracking-[0.2em] ${state.theme === 'pure' ? 'text-slate-500' : 'text-purple-300'}`}>{t.promptLabel}</h4>
                        </div>
                        <div className={`p-4 rounded-2xl font-mono text-[13px] leading-relaxed border italic transition-colors ${
                          state.theme === 'pure' ? 'bg-indigo-50 border-indigo-100 text-indigo-900' : 'bg-black/60 border-white/10 text-indigo-200'
                        }`}>
                            {state.result.suggestedPrompt}
                        </div>
                    </div>
                   )}

                   <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center opacity-40">
                      <span className="text-[10px] font-black tracking-widest uppercase">AI-Detector Lab</span>
                      <span className="text-[9px] font-mono">HASH_{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                   </div>
                </div>

                {/* Actions Panel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
                  <div className={`${themeClasses.card} rounded-[2rem] p-8 border transition-all duration-500`}>
                    <h4 className="text-[11px] font-black opacity-50 uppercase tracking-[0.2em] mb-6">{t.metricsLabel}</h4>
                    <div className="space-y-6">
                      {state.result.metrics.map((m, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-[11px] mb-2 font-bold">
                            <span className="opacity-60">{m.name}</span>
                            <span>{m.value}%</span>
                          </div>
                          <div className={`h-1 rounded-full overflow-hidden ${state.theme === 'pure' ? 'bg-slate-100' : 'bg-slate-800'}`}>
                            <div className={`h-full bg-gradient-to-r ${themeClasses.accent} transition-all duration-1000`} style={{ width: `${m.value}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                     <button 
                        onClick={exportReport} 
                        disabled={state.isExporting}
                        className={`flex-1 border rounded-[2rem] flex flex-col items-center justify-center gap-3 font-black transition-all group py-6 disabled:opacity-50 ${
                          state.theme === 'pure' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {state.isExporting ? (
                          <i className="fas fa-circle-notch fa-spin text-2xl text-cyan-400"></i>
                        ) : (
                          <i className="fas fa-image text-2xl text-cyan-400 group-hover:scale-110 transition-transform"></i>
                        )}
                        <span className="text-xs uppercase tracking-widest">{state.isExporting ? t.exporting : t.exportBtn}</span>
                     </button>
                     <button 
                        onClick={() => setState(prev => ({...prev, result: null, image: null}))} 
                        className={`flex-1 rounded-[2rem] flex items-center justify-center gap-3 font-bold transition-all py-4 border transition-all ${
                          themeClasses.secondaryBtn
                        }`}
                      >
                        <i className="fas fa-redo text-sm"></i>
                        <span className="text-xs uppercase tracking-widest">{t.resetBtn}</span>
                     </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className={`h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-[2.5rem] opacity-20 transition-colors duration-500 ${
                state.theme === 'pure' ? 'border-slate-300' : 'border-slate-800'
              }`}>
                <i className="fas fa-crosshairs text-7xl mb-8 animate-pulse"></i>
                <p className="text-2xl font-black mb-3">实验室待命</p>
                <p className="text-sm font-medium px-8 leading-relaxed">请上传待检测图像，我们将多维度识别 AI 痕迹、渲染特征或物理真实度。</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-12 text-center border-t border-white/5 mt-10 no-print opacity-50">
        <p className="text-[10px] font-black tracking-[0.6em] uppercase mb-4">Laboratory Analysis // Pixels Never Lie</p>
        <p className="text-xs max-w-xl mx-auto px-4 italic leading-relaxed">
          {t.footerNote}
        </p>
      </footer>
      
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
    </div>
  );
};

export default App;

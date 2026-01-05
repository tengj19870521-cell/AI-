
import React from 'react';
import { DetectionVerdict } from '../types';

interface Props {
  verdict: DetectionVerdict;
  lang: 'zh' | 'en';
}

const VerdictBadge: React.FC<Props> = ({ verdict, lang }) => {
  const getStyles = () => {
    switch (verdict) {
      case DetectionVerdict.AI_GENERATED: 
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]";
      case DetectionVerdict.DIGITAL_RENDER: 
        return "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]";
      case DetectionVerdict.AUTHENTIC_PHOTO: 
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]";
      default: 
        return "bg-slate-700 text-slate-200";
    }
  };

  const getLabel = () => {
    const isZH = lang === 'zh';
    switch (verdict) {
      case DetectionVerdict.AI_GENERATED: return isZH ? "🤖 AI 魔法产物" : "AI CREATED";
      case DetectionVerdict.DIGITAL_RENDER: return isZH ? "🎮 3D 虚拟渲染" : "DIGITAL RENDER";
      case DetectionVerdict.AUTHENTIC_PHOTO: return isZH ? "📷 现实相机实拍" : "REAL PHOTO";
      default: return isZH ? "还在思考中..." : "THINKING...";
    }
  };

  return (
    <div className={`px-6 py-3 rounded-2xl text-lg font-black uppercase tracking-tight flex items-center gap-3 transform hover:scale-105 transition-transform ${getStyles()}`}>
      {getLabel()}
    </div>
  );
};

export default VerdictBadge;

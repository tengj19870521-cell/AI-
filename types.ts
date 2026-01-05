
export enum DetectionVerdict {
  AI_GENERATED = 'AI_GENERATED',
  DIGITAL_RENDER = 'DIGITAL_RENDER',
  AUTHENTIC_PHOTO = 'AUTHENTIC_PHOTO',
  UNCERTAIN = 'UNCERTAIN'
}

export type AppTheme = 'midnight' | 'pure' | 'cyberpunk' | 'nordic';

export interface forensicMetric {
  name: string;
  value: number; // 0-100
  status: 'clean' | 'suspicious' | 'ai_confirmed';
}

export interface Artifact {
  label: string;
  description: string;
}

export interface AnalysisResult {
  verdict: DetectionVerdict;
  probabilities: {
    ai: number;
    render: number;
    photo: number;
  };
  summary: string; // 必须是中文
  artifacts: Artifact[];
  suggestedModel?: string; 
  metrics: forensicMetric[];
  suggestedPrompt?: string; // 反向推导的 AI 提示词
}

export interface AppState {
  image: string | null;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
  language: 'zh' | 'en';
  theme: AppTheme;
}

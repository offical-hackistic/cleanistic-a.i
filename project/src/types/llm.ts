export interface LLMAnalysisMetrics {
  windowCount: number;
  gutterLengthFt: number;
  wallAreaSqFt: number;
  dimensions: {
    heightFt: number;
    widthFt: number;
  };
  stories: number;
  difficulty: {
    height: string;
    accessibility: string;
    condition: string;
  };
  side?: 'front' | 'back' | 'left' | 'right' | 'roof' | string;
}

export interface LLMAnalyzeResult {
  metrics: LLMAnalysisMetrics;
  raw: any;
}

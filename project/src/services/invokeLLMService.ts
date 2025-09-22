import { LLMAnalyzeResult, LLMAnalysisMetrics } from '@/types/llm';

const URL = import.meta.env.VITE_INVOKELLM_URL as string | undefined;
const KEY = import.meta.env.VITE_INVOKELLM_KEY as string | undefined;

const PROMPT_TEMPLATE = (
  side: string,
) => `Analyze this house exterior image for cleaning service estimation. Provide detailed measurements and counts:

CRITICAL REQUIREMENTS:
1. Count all visible windows (including different sizes and types)
2. Measure gutter length in linear feet 
3. Calculate wall/siding surface area in square feet
4. Estimate building dimensions (height and width in feet)
5. Determine number of stories
6. Assess difficulty factors (height, accessibility, condition)

Return precise measurements suitable for professional service quotes.
Be conservative but accurate in your estimates.

Image side: ${side}

Return a valid JSON object with keys: windowCount, gutterLengthFt, wallAreaSqFt, dimensions {heightFt, widthFt}, stories, difficulty {height, accessibility, condition}.`;

async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);
  return `data:${file.type};base64,${base64}`;
}

function coerceNumber(v: any, fallback = 0): number {
  const n = typeof v === 'string' ? parseFloat(v.replace(/[^0-9.\-]/g, '')) : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function parseLLMJson(text: any): LLMAnalysisMetrics | null {
  try {
    const data = typeof text === 'string' ? JSON.parse(text) : text;
    const metrics: LLMAnalysisMetrics = {
      windowCount: coerceNumber(data.windowCount, 0),
      gutterLengthFt: coerceNumber(data.gutterLengthFt, 0),
      wallAreaSqFt: coerceNumber(data.wallAreaSqFt, 0),
      dimensions: {
        heightFt: coerceNumber(data?.dimensions?.heightFt, 0),
        widthFt: coerceNumber(data?.dimensions?.widthFt, 0),
      },
      stories: coerceNumber(data.stories, 1),
      difficulty: {
        height: String(data?.difficulty?.height || ''),
        accessibility: String(data?.difficulty?.accessibility || ''),
        condition: String(data?.difficulty?.condition || ''),
      },
      side: String(data?.side || ''),
    };
    return metrics;
  } catch {
    return null;
  }
}

export class InvokeLLMService {
  isConfigured(): boolean {
    return Boolean(URL && KEY);
  }

  async analyzeImage(file: File, side: string): Promise<LLMAnalyzeResult> {
    // If not configured, synthesize a conservative mock for smooth UX
    if (!this.isConfigured()) {
      const fallback: LLMAnalysisMetrics = {
        windowCount: 12,
        gutterLengthFt: 120,
        wallAreaSqFt: 1800,
        dimensions: { heightFt: 18, widthFt: 40 },
        stories: 2,
        difficulty: { height: 'moderate', accessibility: 'good', condition: 'average' },
        side,
      };
      return { metrics: fallback, raw: fallback };
    }

    const imageBase64 = await fileToBase64(file);

    const body = {
      prompt: PROMPT_TEMPLATE(side),
      image: imageBase64,
      side,
    } as any;

    const res = await fetch(URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KEY}`,
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let json: any = null;
    try { json = JSON.parse(text); } catch { /* keep text */ }

    const parsed = parseLLMJson(json ?? text);
    if (!parsed) {
      // Best-effort regex extraction as a fallback
      const numbers = (text.match(/[0-9]+(?:\.[0-9]+)?/g) || []).map(Number);
      const metrics: LLMAnalysisMetrics = {
        windowCount: numbers[0] ?? 0,
        gutterLengthFt: numbers[1] ?? 0,
        wallAreaSqFt: numbers[2] ?? 0,
        dimensions: { heightFt: numbers[3] ?? 0, widthFt: numbers[4] ?? 0 },
        stories: numbers[5] ?? 1,
        difficulty: { height: '', accessibility: '', condition: '' },
        side,
      };
      return { metrics, raw: text };
    }

    return { metrics: parsed, raw: json ?? text };
  }
}

export const invokeLLMService = new InvokeLLMService();

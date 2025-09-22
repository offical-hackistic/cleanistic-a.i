import { describe, it, expect } from 'vitest';
import { parseLLMJson } from '@/services/invokeLLMService';

describe('parseLLMJson', () => {
  it('parses valid JSON object', () => {
    const input = {
      windowCount: 14,
      gutterLengthFt: 180,
      wallAreaSqFt: 2200,
      dimensions: { heightFt: 20, widthFt: 45 },
      stories: 2,
      difficulty: { height: 'moderate', accessibility: 'limited', condition: 'weathered' },
    };
    const m = parseLLMJson(input)!;
    expect(m.windowCount).toBe(14);
    expect(m.gutterLengthFt).toBe(180);
    expect(m.wallAreaSqFt).toBe(2200);
    expect(m.dimensions.heightFt).toBe(20);
    expect(m.dimensions.widthFt).toBe(45);
    expect(m.stories).toBe(2);
    expect(m.difficulty.accessibility).toBe('limited');
  });

  it('parses stringified JSON', () => {
    const s = JSON.stringify({ windowCount: '10', gutterLengthFt: '150ft', wallAreaSqFt: '1900 sq ft', dimensions: { heightFt: '18', widthFt: '40' }, stories: '2' });
    const m = parseLLMJson(s)!;
    expect(m.windowCount).toBe(10);
    expect(m.gutterLengthFt).toBe(150);
    expect(m.wallAreaSqFt).toBe(1900);
    expect(m.dimensions.heightFt).toBe(18);
    expect(m.dimensions.widthFt).toBe(40);
    expect(m.stories).toBe(2);
  });
});

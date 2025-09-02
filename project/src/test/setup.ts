import '@testing-library/jest-dom';

// Mock TensorFlow.js
vi.mock('@tensorflow/tfjs', () => ({
  browser: {
    fromPixels: vi.fn().mockReturnValue({
      resizeNearestNeighbor: vi.fn().mockReturnValue({
        expandDims: vi.fn().mockReturnValue({
          div: vi.fn().mockReturnValue({
            dispose: vi.fn()
          })
        })
      })
    })
  },
  loadLayersModel: vi.fn().mockResolvedValue({})
}));

// Mock file operations
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock Image constructor
global.Image = class {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src: string = '';
  width: number = 1920;
  height: number = 1080;
  
  constructor() {
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 100);
  }
} as any;
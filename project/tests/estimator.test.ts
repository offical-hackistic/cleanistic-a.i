import { describe, it, expect, beforeEach, vi } from 'vitest';
import { aiVisionService } from '@/services/aiVisionService';
import { estimationService } from '@/services/estimationService';
import { propertyDataService } from '@/services/propertyDataService';

describe('AI Vision Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should analyze image and detect features', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    const result = await aiVisionService.analyzeImage(mockFile);
    
    expect(result).toHaveProperty('features');
    expect(result).toHaveProperty('confidence');
    expect(result).toHaveProperty('processingTime');
    expect(result.confidence).toBeGreaterThan(0.8);
    expect(result.features).toBeInstanceOf(Array);
  });

  it('should calculate square footage from features', () => {
    const mockFeatures = [
      { type: 'window', area: 100 },
      { type: 'window', area: 120 },
      { type: 'door', area: 200 }
    ];
    
    const sqft = aiVisionService.calculateSquareFootage(mockFeatures, 1920, 1080);
    
    expect(sqft).toBeGreaterThan(800);
    expect(sqft).toBeLessThan(5000);
  });
});

describe('Estimation Service', () => {
  it('should calculate house washing estimate correctly', () => {
    const mockFeatures = [
      { type: 'window', confidence: 0.9 },
      { type: 'window', confidence: 0.85 },
      { type: 'door', confidence: 0.95 }
    ];
    
    const config = estimationService.getDefaultConfig();
    const estimate = estimationService.calculateEstimate(
      mockFeatures, 
      2000, 
      'house_washing', 
      config
    );
    
    expect(estimate.serviceType).toBe('house_washing');
    expect(estimate.totalPrice).toBeGreaterThan(0);
    expect(estimate.breakdown).toBeInstanceOf(Array);
    expect(estimate.breakdown.length).toBeGreaterThan(0);
  });

  it('should calculate roof cleaning estimate correctly', () => {
    const mockFeatures = [];
    const config = estimationService.getDefaultConfig();
    
    const estimate = estimationService.calculateEstimate(
      mockFeatures, 
      2000, 
      'roof_cleaning', 
      config
    );
    
    expect(estimate.serviceType).toBe('roof_cleaning');
    expect(estimate.totalPrice).toBeGreaterThan(config.pricing.roofCleaning.basePrice);
  });

  it('should throw error for unsupported service type', () => {
    const config = estimationService.getDefaultConfig();
    
    expect(() => {
      estimationService.calculateEstimate([], 2000, 'invalid_service', config);
    }).toThrow('Unsupported service type');
  });
});

describe('Property Data Service', () => {
  it('should validate valid addresses', async () => {
    const validAddresses = [
      '123 Main St, City, State 12345',
      '456 Oak Avenue, Town, ST 67890'
    ];
    
    for (const address of validAddresses) {
      const isValid = await propertyDataService.validateAddress(address);
      expect(isValid).toBe(true);
    }
  });

  it('should reject invalid addresses', async () => {
    const invalidAddresses = [
      'Not an address',
      '123',
      ''
    ];
    
    for (const address of invalidAddresses) {
      const isValid = await propertyDataService.validateAddress(address);
      expect(isValid).toBe(false);
    }
  });

  it('should lookup property data', async () => {
    const address = '123 Main St, City, State 12345';
    
    const result = await propertyDataService.lookupProperty(address);
    
    expect(result).toHaveProperty('address');
    expect(result).toHaveProperty('squareFootage');
    expect(result).toHaveProperty('confidence');
    expect(result.confidence).toBeGreaterThan(0.8);
  });
});

describe('Integration Tests', () => {
  it('should complete full estimation workflow', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const address = '123 Main St, City, State 12345';
    const serviceTypes = ['house_washing', 'roof_cleaning'];
    
    // Step 1: Analyze image
    const analysisResult = await aiVisionService.analyzeImage(mockFile);
    expect(analysisResult.features.length).toBeGreaterThan(0);
    
    // Step 2: Lookup property data
    const propertyData = await propertyDataService.lookupProperty(address);
    expect(propertyData).toBeTruthy();
    
    // Step 3: Calculate estimates
    const config = estimationService.getDefaultConfig();
    const estimates = serviceTypes.map(serviceType =>
      estimationService.calculateEstimate(
        analysisResult.features,
        propertyData.squareFootage || 2000,
        serviceType,
        config
      )
    );
    
    expect(estimates.length).toBe(2);
    expect(estimates[0].totalPrice).toBeGreaterThan(0);
    expect(estimates[1].totalPrice).toBeGreaterThan(0);
    
    const totalEstimate = estimates.reduce((sum, est) => sum + est.totalPrice, 0);
    expect(totalEstimate).toBeGreaterThan(0);
  });
});
import { DetectedFeature, ServiceEstimate, EstimateBreakdown, EstimatorConfig } from '@/types/estimator';

export class EstimationService {
  calculateEstimate(
    features: DetectedFeature[],
    squareFootage: number,
    serviceType: string,
    config: EstimatorConfig
  ): ServiceEstimate {
    const windows = features.filter(f => f.type === 'window').length;
    const doors = features.filter(f => f.type === 'door').length;
    
    let breakdown: EstimateBreakdown[] = [];
    let totalPrice = 0;

    switch (serviceType) {
      case 'house_washing':
        return this.calculateHouseWashing(windows, doors, squareFootage, config);
      case 'roof_cleaning':
        return this.calculateRoofCleaning(squareFootage, config);
      case 'gutter_cleaning':
        return this.calculateGutterCleaning(squareFootage, config);
      default:
        throw new Error(`Unsupported service type: ${serviceType}`);
    }
  }

  calculateEstimateFromMetrics(
    metrics: { windowCount: number; gutterLengthFt?: number; wallAreaSqFt?: number },
    serviceType: string,
    config: EstimatorConfig
  ): ServiceEstimate {
    const squareFootage = Math.max(800, Math.min(5000, Math.round((metrics.wallAreaSqFt ?? 1600) / 2)));
    switch (serviceType) {
      case 'house_washing':
        return this.calculateHouseWashing(metrics.windowCount ?? 0, 0, squareFootage, config);
      case 'roof_cleaning':
        return this.calculateRoofCleaning(squareFootage, config);
      case 'gutter_cleaning': {
        const pricing = config.pricing.gutterCleaning;
        const linearFeet = Math.round(metrics.gutterLengthFt ?? Math.sqrt(squareFootage) * 4 * 1.2);
        const breakdown: EstimateBreakdown[] = [
          { item: 'Base Gutter Cleaning Service', quantity: 1, unitPrice: pricing.basePrice, totalPrice: pricing.basePrice },
          { item: `Gutter Cleaning (${linearFeet} linear ft)`, quantity: linearFeet, unitPrice: pricing.pricePerLinearFt, totalPrice: linearFeet * pricing.pricePerLinearFt },
        ];
        const totalPrice = breakdown.reduce((s, i) => s + i.totalPrice, 0);
        return { id: this.generateId(), analysisId: '', serviceType: 'gutter_cleaning', basePrice: pricing.basePrice, squareFootagePrice: linearFeet * pricing.pricePerLinearFt, windowPrice: 0, totalPrice: Math.round(totalPrice * 100) / 100, breakdown };
      }
      default:
        throw new Error(`Unsupported service type: ${serviceType}`);
    }
  }

  private calculateHouseWashing(
    windows: number,
    doors: number,
    squareFootage: number,
    config: EstimatorConfig
  ): ServiceEstimate {
    const pricing = config.pricing.houseWashing;
    const breakdown: EstimateBreakdown[] = [];

    // Base service charge
    breakdown.push({
      item: 'Base House Washing Service',
      quantity: 1,
      unitPrice: pricing.basePrice,
      totalPrice: pricing.basePrice
    });

    // Square footage charge
    const sqftCharge = squareFootage * pricing.pricePerSqFt;
    breakdown.push({
      item: `House Washing (${squareFootage} sq ft)`,
      quantity: squareFootage,
      unitPrice: pricing.pricePerSqFt,
      totalPrice: sqftCharge
    });

    // Window cleaning add-on
    if (windows > 0) {
      const windowCharge = windows * pricing.pricePerWindow;
      breakdown.push({
        item: `Window Cleaning (${windows} windows)`,
        quantity: windows,
        unitPrice: pricing.pricePerWindow,
        totalPrice: windowCharge
      });
    }

    const totalPrice = breakdown.reduce((sum, item) => sum + item.totalPrice, 0);

    return {
      id: this.generateId(),
      analysisId: '',
      serviceType: 'house_washing',
      basePrice: pricing.basePrice,
      squareFootagePrice: sqftCharge,
      windowPrice: windows * pricing.pricePerWindow,
      totalPrice: Math.round(totalPrice * 100) / 100,
      breakdown
    };
  }

  private calculateRoofCleaning(
    squareFootage: number,
    config: EstimatorConfig
  ): ServiceEstimate {
    const pricing = config.pricing.roofCleaning;
    const breakdown: EstimateBreakdown[] = [];

    // Base service charge
    breakdown.push({
      item: 'Base Roof Cleaning Service',
      quantity: 1,
      unitPrice: pricing.basePrice,
      totalPrice: pricing.basePrice
    });

    // Roof area (typically 1.3x house square footage)
    const roofArea = Math.round(squareFootage * 1.3);
    const roofCharge = roofArea * pricing.pricePerSqFt;
    breakdown.push({
      item: `Roof Cleaning (${roofArea} sq ft)`,
      quantity: roofArea,
      unitPrice: pricing.pricePerSqFt,
      totalPrice: roofCharge
    });

    const totalPrice = breakdown.reduce((sum, item) => sum + item.totalPrice, 0);

    return {
      id: this.generateId(),
      analysisId: '',
      serviceType: 'roof_cleaning',
      basePrice: pricing.basePrice,
      squareFootagePrice: roofCharge,
      windowPrice: 0,
      totalPrice: Math.round(totalPrice * 100) / 100,
      breakdown
    };
  }

  private calculateGutterCleaning(
    squareFootage: number,
    config: EstimatorConfig
  ): ServiceEstimate {
    const pricing = config.pricing.gutterCleaning;
    const breakdown: EstimateBreakdown[] = [];

    // Base service charge
    breakdown.push({
      item: 'Base Gutter Cleaning Service',
      quantity: 1,
      unitPrice: pricing.basePrice,
      totalPrice: pricing.basePrice
    });

    // Estimate linear feet (perimeter approximation)
    const linearFeet = Math.round(Math.sqrt(squareFootage) * 4 * 1.2);
    const gutterCharge = linearFeet * pricing.pricePerLinearFt;
    breakdown.push({
      item: `Gutter Cleaning (${linearFeet} linear ft)`,
      quantity: linearFeet,
      unitPrice: pricing.pricePerLinearFt,
      totalPrice: gutterCharge
    });

    const totalPrice = breakdown.reduce((sum, item) => sum + item.totalPrice, 0);

    return {
      id: this.generateId(),
      analysisId: '',
      serviceType: 'gutter_cleaning',
      basePrice: pricing.basePrice,
      squareFootagePrice: gutterCharge,
      windowPrice: 0,
      totalPrice: Math.round(totalPrice * 100) / 100,
      breakdown
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getDefaultConfig(): EstimatorConfig {
    return {
      companyId: 'demo',
      branding: {
        primaryColor: '#3b82f6',
        secondaryColor: '#10b981',
        companyName: 'Demo Cleaning Co'
      },
      pricing: {
        houseWashing: {
          basePrice: 150,
          pricePerSqFt: 0.15,
          pricePerWindow: 8
        },
        roofCleaning: {
          basePrice: 200,
          pricePerSqFt: 0.25
        },
        gutterCleaning: {
          basePrice: 100,
          pricePerLinearFt: 3.50
        }
      },
      features: {
        enableHouseWashing: true,
        enableRoofCleaning: true,
        enableGutterCleaning: true,
        requireAddress: false,
        enablePropertyLookup: true
      }
    };
  }
}

export const estimationService = new EstimationService();

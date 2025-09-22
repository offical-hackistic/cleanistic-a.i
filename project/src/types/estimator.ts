export interface PropertyImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  uploadedAt: Date;
}

export interface DetectedFeature {
  type: 'window' | 'door' | 'roof' | 'wall';
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  area: number;
}

export interface PropertyAnalysis {
  id: string;
  imageId: string;
  features: DetectedFeature[];
  totalWindows: number;
  totalDoors: number;
  estimatedSquareFootage: number;
  confidence: number;
  processingTime: number;
  createdAt: Date;
}

export interface ServiceEstimate {
  id: string;
  analysisId: string;
  serviceType: 'house_washing' | 'roof_cleaning' | 'gutter_cleaning' | 'window_cleaning';
  basePrice: number;
  squareFootagePrice: number;
  windowPrice: number;
  totalPrice: number;
  breakdown: EstimateBreakdown[];
}

export interface EstimateBreakdown {
  item: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PropertyData {
  address: string;
  squareFootage?: number;
  propertyType?: string;
  yearBuilt?: number;
  bedrooms?: number;
  bathrooms?: number;
  lotSize?: number;
  zillowId?: string;
}

export interface EstimatorConfig {
  companyId: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
    companyName: string;
  };
  pricing: {
    houseWashing: {
      basePrice: number;
      pricePerSqFt: number;
      pricePerWindow: number;
    };
    roofCleaning: {
      basePrice: number;
      pricePerSqFt: number;
    };
    gutterCleaning: {
      basePrice: number;
      pricePerLinearFt: number;
    };
    windowCleaning: {
      basePrice: number;
      pricePerWindow: number;
    };
  };
  features: {
    enableHouseWashing: boolean;
    enableRoofCleaning: boolean;
    enableGutterCleaning: boolean;
    enableWindowCleaning: boolean;
    requireAddress: boolean;
    enablePropertyLookup: boolean;
  };
}

export interface AnalysisRequest {
  images: File[];
  address?: string;
  serviceTypes: string[];
  companyId: string;
}

export interface AnalysisResponse {
  success: boolean;
  analysisId: string;
  propertyData?: PropertyData;
  analysis: PropertyAnalysis;
  estimates: ServiceEstimate[];
  totalEstimate: number;
  processingTime: number;
}

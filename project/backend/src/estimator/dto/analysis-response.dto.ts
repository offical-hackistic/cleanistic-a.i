import { ApiProperty } from '@nestjs/swagger';

export class DetectedFeatureDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  confidence: number;

  @ApiProperty()
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  @ApiProperty()
  area: number;
}

export class PropertyAnalysisDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  imageId: string;

  @ApiProperty({ type: [DetectedFeatureDto] })
  features: DetectedFeatureDto[];

  @ApiProperty()
  totalWindows: number;

  @ApiProperty()
  totalDoors: number;

  @ApiProperty()
  estimatedSquareFootage: number;

  @ApiProperty()
  confidence: number;

  @ApiProperty()
  processingTime: number;

  @ApiProperty()
  createdAt: Date;
}

export class EstimateBreakdownDto {
  @ApiProperty()
  item: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  totalPrice: number;
}

export class ServiceEstimateDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  analysisId: string;

  @ApiProperty()
  serviceType: string;

  @ApiProperty()
  basePrice: number;

  @ApiProperty()
  squareFootagePrice: number;

  @ApiProperty()
  windowPrice: number;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty({ type: [EstimateBreakdownDto] })
  breakdown: EstimateBreakdownDto[];
}

export class PropertyDataDto {
  @ApiProperty()
  address: string;

  @ApiProperty({ required: false })
  squareFootage?: number;

  @ApiProperty({ required: false })
  propertyType?: string;

  @ApiProperty({ required: false })
  yearBuilt?: number;

  @ApiProperty({ required: false })
  bedrooms?: number;

  @ApiProperty({ required: false })
  bathrooms?: number;

  @ApiProperty({ required: false })
  lotSize?: number;

  @ApiProperty({ required: false })
  zillowId?: string;
}

export class AnalysisResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  analysisId: string;

  @ApiProperty({ type: PropertyDataDto, required: false })
  propertyData?: PropertyDataDto;

  @ApiProperty({ type: PropertyAnalysisDto })
  analysis: PropertyAnalysisDto;

  @ApiProperty({ type: [ServiceEstimateDto] })
  estimates: ServiceEstimateDto[];

  @ApiProperty()
  totalEstimate: number;

  @ApiProperty()
  processingTime: number;
}
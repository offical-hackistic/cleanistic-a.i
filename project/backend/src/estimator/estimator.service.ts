import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { StorageService } from '../storage/storage.service';
import { AIVisionService } from './ai-vision.service';
import { PropertyDataService } from './property-data.service';
import { AnalyzePropertyDto } from './dto/analyze-property.dto';
import { AnalysisResponseDto } from './dto/analysis-response.dto';

@Injectable()
export class EstimatorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly aiVision: AIVisionService,
    private readonly propertyData: PropertyDataService,
    private readonly config: ConfigService,
  ) {}

  async analyzeProperty(
    images: Express.Multer.File[],
    analyzeDto: AnalyzePropertyDto,
  ): Promise<AnalysisResponseDto> {
    const startTime = Date.now();

    try {
      // 1. Upload images to S3
      const uploadPromises = images.map(image => 
        this.storage.uploadImage(image, 'property-images')
      );
      const uploadedImages = await Promise.all(uploadPromises);

      // 2. Property data lookup (if address provided)
      let propertyData = null;
      if (analyzeDto.address) {
        propertyData = await this.propertyData.lookupProperty(analyzeDto.address);
      }

      // 3. AI image analysis
      const analysisPromises = uploadedImages.map(imageUrl => 
        this.aiVision.analyzeImage(imageUrl)
      );
      const analysisResults = await Promise.all(analysisPromises);

      // 4. Combine and process results
      const combinedFeatures = analysisResults.flatMap(result => result.features);
      const avgConfidence = analysisResults.reduce((sum, r) => sum + r.confidence, 0) / analysisResults.length;
      
      // 5. Calculate square footage
      const estimatedSqFt = propertyData?.squareFootage || 
        this.calculateSquareFootage(combinedFeatures);

      // 6. Generate estimates for requested services
      const estimates = await Promise.all(
        analyzeDto.serviceTypes.map(serviceType =>
          this.generateServiceEstimate(combinedFeatures, estimatedSqFt, serviceType, analyzeDto.companyId)
        )
      );

      // 7. Save analysis to database
      const analysis = await this.prisma.propertyAnalysis.create({
        data: {
          companyId: analyzeDto.companyId,
          images: uploadedImages,
          features: combinedFeatures,
          totalWindows: combinedFeatures.filter(f => f.type === 'window').length,
          totalDoors: combinedFeatures.filter(f => f.type === 'door').length,
          estimatedSquareFootage: estimatedSqFt,
          confidence: avgConfidence,
          processingTime: Date.now() - startTime,
          propertyData: propertyData || undefined,
        },
      });

      const totalEstimate = estimates.reduce((sum, est) => sum + est.totalPrice, 0);

      return {
        success: true,
        analysisId: analysis.id,
        propertyData,
        analysis: {
          id: analysis.id,
          imageId: uploadedImages[0],
          features: combinedFeatures,
          totalWindows: analysis.totalWindows,
          totalDoors: analysis.totalDoors,
          estimatedSquareFootage: analysis.estimatedSquareFootage,
          confidence: analysis.confidence,
          processingTime: analysis.processingTime,
          createdAt: analysis.createdAt,
        },
        estimates,
        totalEstimate,
        processingTime: Date.now() - startTime,
      };

    } catch (error) {
      console.error('Property analysis failed:', error);
      throw new BadRequestException('Failed to analyze property');
    }
  }

  async generateEstimate(estimateData: any) {
    // Implementation for generating estimates from existing analysis
    return { message: 'Estimate generated successfully' };
  }

  private calculateSquareFootage(features: any[]): number {
    const windowCount = features.filter(f => f.type === 'window').length;
    // Rough estimation: 100-150 sq ft per window
    const baseSqFt = windowCount * 125;
    const variation = Math.random() * 400 - 200; // ±200 sq ft variation
    
    return Math.max(800, Math.min(5000, Math.round(baseSqFt + variation)));
  }

  private async generateServiceEstimate(
    features: any[],
    squareFootage: number,
    serviceType: string,
    companyId: string,
  ) {
    // Get company pricing configuration
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: { pricingConfig: true },
    });

    if (!company) {
      throw new BadRequestException('Company not found');
    }

    // Calculate estimate based on service type and company pricing
    const windows = features.filter(f => f.type === 'window').length;
    const doors = features.filter(f => f.type === 'door').length;

    // Use default pricing if company config not found
    const defaultPricing = {
      houseWashing: { basePrice: 150, pricePerSqFt: 0.15, pricePerWindow: 8 },
      roofCleaning: { basePrice: 200, pricePerSqFt: 0.25 },
      gutterCleaning: { basePrice: 100, pricePerLinearFt: 3.50 },
    };

    const pricing = company.pricingConfig || defaultPricing;

    switch (serviceType) {
      case 'house_washing':
        const houseTotal = pricing.houseWashing.basePrice + 
          (squareFootage * pricing.houseWashing.pricePerSqFt) +
          (windows * pricing.houseWashing.pricePerWindow);
        
        return {
          id: `est_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          serviceType,
          basePrice: pricing.houseWashing.basePrice,
          squareFootagePrice: squareFootage * pricing.houseWashing.pricePerSqFt,
          windowPrice: windows * pricing.houseWashing.pricePerWindow,
          totalPrice: Math.round(houseTotal * 100) / 100,
          breakdown: [
            { item: 'Base Service', quantity: 1, unitPrice: pricing.houseWashing.basePrice, totalPrice: pricing.houseWashing.basePrice },
            { item: `House Washing (${squareFootage} sq ft)`, quantity: squareFootage, unitPrice: pricing.houseWashing.pricePerSqFt, totalPrice: squareFootage * pricing.houseWashing.pricePerSqFt },
            { item: `Window Cleaning (${windows} windows)`, quantity: windows, unitPrice: pricing.houseWashing.pricePerWindow, totalPrice: windows * pricing.houseWashing.pricePerWindow },
          ],
        };

      case 'roof_cleaning':
        const roofArea = Math.round(squareFootage * 1.3);
        const roofTotal = pricing.roofCleaning.basePrice + (roofArea * pricing.roofCleaning.pricePerSqFt);
        
        return {
          id: `est_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          serviceType,
          basePrice: pricing.roofCleaning.basePrice,
          squareFootagePrice: roofArea * pricing.roofCleaning.pricePerSqFt,
          windowPrice: 0,
          totalPrice: Math.round(roofTotal * 100) / 100,
          breakdown: [
            { item: 'Base Service', quantity: 1, unitPrice: pricing.roofCleaning.basePrice, totalPrice: pricing.roofCleaning.basePrice },
            { item: `Roof Cleaning (${roofArea} sq ft)`, quantity: roofArea, unitPrice: pricing.roofCleaning.pricePerSqFt, totalPrice: roofArea * pricing.roofCleaning.pricePerSqFt },
          ],
        };

      case 'gutter_cleaning':
        const linearFeet = Math.round(Math.sqrt(squareFootage) * 4 * 1.2);
        const gutterTotal = pricing.gutterCleaning.basePrice + (linearFeet * pricing.gutterCleaning.pricePerLinearFt);
        
        return {
          id: `est_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          serviceType,
          basePrice: pricing.gutterCleaning.basePrice,
          squareFootagePrice: linearFeet * pricing.gutterCleaning.pricePerLinearFt,
          windowPrice: 0,
          totalPrice: Math.round(gutterTotal * 100) / 100,
          breakdown: [
            { item: 'Base Service', quantity: 1, unitPrice: pricing.gutterCleaning.basePrice, totalPrice: pricing.gutterCleaning.basePrice },
            { item: `Gutter Cleaning (${linearFeet} linear ft)`, quantity: linearFeet, unitPrice: pricing.gutterCleaning.pricePerLinearFt, totalPrice: linearFeet * pricing.gutterCleaning.pricePerLinearFt },
          ],
        };

      default:
        throw new BadRequestException(`Unsupported service type: ${serviceType}`);
    }
  }
}
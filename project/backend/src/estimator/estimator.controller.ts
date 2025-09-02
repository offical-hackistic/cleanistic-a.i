import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { EstimatorService } from './estimator.service';
import { AnalyzePropertyDto } from './dto/analyze-property.dto';
import { AnalysisResponseDto } from './dto/analysis-response.dto';

@ApiTags('estimator')
@Controller('api/estimator')
@UseGuards(ThrottlerGuard)
export class EstimatorController {
  constructor(private readonly estimatorService: EstimatorService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze property images for estimation' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Analysis completed successfully', type: AnalysisResponseDto })
  @UseInterceptors(FilesInterceptor('images', 5, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB per file
    },
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.startsWith('image/')) {
        return callback(new BadRequestException('Only image files are allowed'), false);
      }
      callback(null, true);
    },
  }))
  async analyzeProperty(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() analyzeDto: AnalyzePropertyDto,
  ): Promise<AnalysisResponseDto> {
    if (!images || images.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    return this.estimatorService.analyzeProperty(images, analyzeDto);
  }

  @Post('estimate')
  @ApiOperation({ summary: 'Generate estimate from analysis results' })
  async generateEstimate(@Body() estimateData: any) {
    return this.estimatorService.generateEstimate(estimateData);
  }
}
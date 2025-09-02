import { IsString, IsArray, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzePropertyDto {
  @ApiProperty({ description: 'Property address for data lookup', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Array of service types to estimate', example: ['house_washing', 'roof_cleaning'] })
  @IsArray()
  @IsNotEmpty()
  serviceTypes: string[];

  @ApiProperty({ description: 'Company ID for pricing configuration' })
  @IsString()
  @IsNotEmpty()
  companyId: string;
}
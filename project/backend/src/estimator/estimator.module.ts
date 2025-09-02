import { Module } from '@nestjs/common';
import { EstimatorController } from './estimator.controller';
import { EstimatorService } from './estimator.service';
import { AIVisionService } from './ai-vision.service';
import { PropertyDataService } from './property-data.service';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [EstimatorController],
  providers: [EstimatorService, AIVisionService, PropertyDataService],
  exports: [EstimatorService],
})
export class EstimatorModule {}
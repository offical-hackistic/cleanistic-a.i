import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EstimatorModule } from './estimator/estimator.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { DatabaseModule } from './database/database.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute for AI analysis
      },
    ]),
    DatabaseModule,
    StorageModule,
    AuthModule,
    CompanyModule,
    EstimatorModule,
  ],
})
export class AppModule {}
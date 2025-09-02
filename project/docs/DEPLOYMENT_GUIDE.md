# Cleanistic AI Deployment Guide

## Infrastructure Overview

Cleanistic AI uses a modern, scalable architecture designed for high availability and performance.

### Architecture Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CloudFront    │    │   Application   │    │   AI/ML Stack   │
│   (CDN/WAF)     │───▶│  Load Balancer  │───▶│   (SageMaker)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   S3 Storage    │    │   ECS Fargate   │    │   PostgreSQL    │
│  (Images/CDN)   │    │  (API Servers)  │    │    (RDS)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ ElastiCache     │
                       │ (Redis Cache)   │
                       └─────────────────┘
```

## AWS Infrastructure Setup

### 1. VPC and Networking

```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=cleanistic-ai-vpc}]'

# Create subnets
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b

# Create Internet Gateway
aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=cleanistic-ai-igw}]'
```

### 2. RDS PostgreSQL Setup

```bash
# Create DB subnet group
aws rds create-db-subnet-group \
  --db-subnet-group-name cleanistic-ai-db-subnet \
  --db-subnet-group-description "Cleanistic AI Database Subnet Group" \
  --subnet-ids subnet-xxx subnet-yyy

# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier cleanistic-ai-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 14.9 \
  --allocated-storage 100 \
  --storage-type gp2 \
  --db-name cleanistic_ai \
  --master-username cleanistic_admin \
  --master-user-password your-secure-password \
  --db-subnet-group-name cleanistic-ai-db-subnet \
  --vpc-security-group-ids sg-xxx
```

### 3. ElastiCache Redis Setup

```bash
# Create cache subnet group
aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name cleanistic-ai-cache-subnet \
  --cache-subnet-group-description "Cleanistic AI Cache Subnet Group" \
  --subnet-ids subnet-xxx subnet-yyy

# Create Redis cluster
aws elasticache create-replication-group \
  --replication-group-id cleanistic-ai-redis \
  --description "Cleanistic AI Redis Cache" \
  --node-type cache.t3.micro \
  --engine redis \
  --engine-version 7.0 \
  --num-cache-clusters 2 \
  --cache-subnet-group-name cleanistic-ai-cache-subnet \
  --security-group-ids sg-xxx
```

### 4. S3 Bucket Setup

```bash
# Create S3 bucket
aws s3 mb s3://cleanistic-ai-images-prod

# Configure bucket policy
aws s3api put-bucket-policy --bucket cleanistic-ai-images-prod --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCleanisticAIAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT-ID:role/CleanisticAIRole"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::cleanistic-ai-images-prod/*"
    }
  ]
}'

# Enable versioning
aws s3api put-bucket-versioning --bucket cleanistic-ai-images-prod --versioning-configuration Status=Enabled
```

### 5. CloudFront CDN Setup

```bash
# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config '{
  "CallerReference": "cleanistic-ai-'$(date +%s)'",
  "Comment": "Cleanistic AI CDN",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 2,
    "Items": [
      {
        "Id": "S3-cleanistic-ai-images",
        "DomainName": "cleanistic-ai-images-prod.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      },
      {
        "Id": "ALB-cleanistic-ai-api",
        "DomainName": "api.cleanistic.ai",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "https-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "ALB-cleanistic-ai-api",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": true,
      "Cookies": {
        "Forward": "none"
      }
    }
  }
}'
```

## ECS Fargate Deployment

### 1. Create Task Definition

```json
{
  "family": "cleanistic-ai-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::ACCOUNT-ID:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::ACCOUNT-ID:role/CleanisticAITaskRole",
  "containerDefinitions": [
    {
      "name": "cleanistic-ai-api",
      "image": "your-account.dkr.ecr.us-east-1.amazonaws.com/cleanistic-ai:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "3001"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT-ID:secret:cleanistic-ai/database-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT-ID:secret:cleanistic-ai/jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/cleanistic-ai",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3001/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    }
  ]
}
```

### 2. Create ECS Service

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name cleanistic-ai-cluster

# Create service
aws ecs create-service \
  --cluster cleanistic-ai-cluster \
  --service-name cleanistic-ai-api \
  --task-definition cleanistic-ai-api:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration 'awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}' \
  --load-balancers 'targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:ACCOUNT-ID:targetgroup/cleanistic-ai-tg/xxx,containerName=cleanistic-ai-api,containerPort=3001'
```

## SageMaker Model Deployment

### 1. Model Preparation

```python
# model_deployment.py
import boto3
import sagemaker
from sagemaker.pytorch import PyTorchModel

def deploy_property_detector():
    sagemaker_session = sagemaker.Session()
    role = 'arn:aws:iam::ACCOUNT-ID:role/SageMakerExecutionRole'
    
    # Create PyTorch model
    pytorch_model = PyTorchModel(
        model_data='s3://cleanistic-ai-models/property-detector/model.tar.gz',
        role=role,
        entry_point='inference.py',
        framework_version='1.12',
        py_version='py38',
        name='cleanistic-property-detector'
    )
    
    # Deploy to endpoint
    predictor = pytorch_model.deploy(
        initial_instance_count=2,
        instance_type='ml.m5.large',
        endpoint_name='cleanistic-property-detector-endpoint'
    )
    
    return predictor.endpoint_name

if __name__ == "__main__":
    endpoint_name = deploy_property_detector()
    print(f"Model deployed to endpoint: {endpoint_name}")
```

### 2. Auto Scaling Configuration

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace sagemaker \
  --resource-id endpoint/cleanistic-property-detector-endpoint/variant/AllTraffic \
  --scalable-dimension sagemaker:variant:DesiredInstanceCount \
  --min-capacity 1 \
  --max-capacity 10

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --policy-name cleanistic-ai-scaling-policy \
  --service-namespace sagemaker \
  --resource-id endpoint/cleanistic-property-detector-endpoint/variant/AllTraffic \
  --scalable-dimension sagemaker:variant:DesiredInstanceCount \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration '{
    "TargetValue": 70.0,
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "SageMakerVariantInvocationsPerInstance"
    },
    "ScaleOutCooldown": 300,
    "ScaleInCooldown": 300
  }'
```

## Docker Configuration

### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS production

RUN apk add --no-cache curl

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

USER node

CMD ["node", "dist/main.js"]
```

### Frontend Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## Environment Configuration

### Production Environment Variables

```bash
# .env.production
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=postgresql://username:password@cleanistic-ai-db.cluster-xxx.us-east-1.rds.amazonaws.com:5432/cleanistic_ai

# Redis
REDIS_URL=redis://cleanistic-ai-redis.xxx.cache.amazonaws.com:6379

# AWS
AWS_REGION=us-east-1
AWS_S3_BUCKET=cleanistic-ai-images-prod
AWS_CLOUDFRONT_DOMAIN=d123456789.cloudfront.net

# AI/ML
SAGEMAKER_ENDPOINT=cleanistic-property-detector-endpoint
AI_MODEL_CONFIDENCE_THRESHOLD=0.8

# External APIs
ZILLOW_API_KEY=your-production-zillow-key
MELISSA_API_KEY=your-production-melissa-key
GOOGLE_MAPS_API_KEY=your-production-maps-key

# Security
JWT_SECRET=your-super-secure-jwt-secret-256-bits
API_RATE_LIMIT=100
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
NEW_RELIC_LICENSE_KEY=your-newrelic-key
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy Cleanistic AI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: cleanistic-ai

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          npm ci
          cd backend && npm ci
      
      - name: Run tests
        run: |
          npm run test
          cd backend && npm run test
      
      - name: Run E2E tests
        run: npm run test:e2e

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push backend image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd backend
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
      
      - name: Build frontend
        run: |
          npm ci
          npm run build
      
      - name: Deploy to S3
        run: |
          aws s3 sync dist/ s3://cleanistic-ai-frontend-prod --delete
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
      
      - name: Update ECS service
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          # Update task definition
          aws ecs register-task-definition \
            --family cleanistic-ai-api \
            --container-definitions '[{
              "name": "cleanistic-ai-api",
              "image": "'$ECR_REGISTRY'/'$ECR_REPOSITORY':'$IMAGE_TAG'",
              "portMappings": [{"containerPort": 3001}],
              "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                  "awslogs-group": "/ecs/cleanistic-ai",
                  "awslogs-region": "'$AWS_REGION'",
                  "awslogs-stream-prefix": "ecs"
                }
              }
            }]'
          
          # Update service
          aws ecs update-service \
            --cluster cleanistic-ai-cluster \
            --service cleanistic-ai-api \
            --task-definition cleanistic-ai-api
```

## Database Migrations

### Setup Prisma Migrations

```bash
# Initialize Prisma
cd backend
npx prisma init

# Generate migration
npx prisma migrate dev --name init

# Deploy to production
npx prisma migrate deploy
```

### Migration Script

```javascript
// scripts/migrate.js
const { PrismaClient } = require('@prisma/client');

async function migrate() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Running database migrations...');
    
    // Run migrations
    await prisma.$executeRaw`
      -- Enable required extensions
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE EXTENSION IF NOT EXISTS "pg_trgm";
    `;
    
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
```

## Monitoring and Logging

### CloudWatch Setup

```bash
# Create log group
aws logs create-log-group --log-group-name /ecs/cleanistic-ai

# Create custom metrics
aws cloudwatch put-metric-data \
  --namespace "CleanisticAI/API" \
  --metric-data MetricName=EstimateRequests,Value=1,Unit=Count
```

### Application Monitoring

```javascript
// monitoring/metrics.js
const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();

class MetricsService {
  async recordEstimateRequest(companyId, serviceType) {
    await cloudwatch.putMetricData({
      Namespace: 'CleanisticAI/API',
      MetricData: [
        {
          MetricName: 'EstimateRequests',
          Value: 1,
          Unit: 'Count',
          Dimensions: [
            { Name: 'CompanyId', Value: companyId },
            { Name: 'ServiceType', Value: serviceType }
          ]
        }
      ]
    }).promise();
  }

  async recordProcessingTime(duration) {
    await cloudwatch.putMetricData({
      Namespace: 'CleanisticAI/Performance',
      MetricData: [
        {
          MetricName: 'ProcessingTime',
          Value: duration,
          Unit: 'Milliseconds'
        }
      ]
    }).promise();
  }
}
```

## Security Configuration

### WAF Rules

```bash
# Create WAF Web ACL
aws wafv2 create-web-acl \
  --name cleanistic-ai-waf \
  --scope CLOUDFRONT \
  --default-action Allow={} \
  --rules '[
    {
      "Name": "RateLimitRule",
      "Priority": 1,
      "Statement": {
        "RateBasedStatement": {
          "Limit": 2000,
          "AggregateKeyType": "IP"
        }
      },
      "Action": {
        "Block": {}
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "RateLimitRule"
      }
    }
  ]'
```

### SSL/TLS Configuration

```bash
# Request SSL certificate
aws acm request-certificate \
  --domain-name api.cleanistic.ai \
  --subject-alternative-names "*.cleanistic.ai" \
  --validation-method DNS
```

## Performance Optimization

### Database Optimization

```sql
-- Add indexes for performance
CREATE INDEX CONCURRENTLY idx_property_analyses_company_id ON property_analyses(company_id);
CREATE INDEX CONCURRENTLY idx_property_analyses_created_at ON property_analyses(created_at);
CREATE INDEX CONCURRENTLY idx_service_estimates_analysis_id ON service_estimates(analysis_id);
CREATE INDEX CONCURRENTLY idx_service_estimates_company_id ON service_estimates(company_id);

-- Optimize for analytics queries
CREATE INDEX CONCURRENTLY idx_estimates_company_date ON service_estimates(company_id, created_at);
```

### Redis Caching Strategy

```javascript
// caching/redis.service.js
class RedisCacheService {
  constructor(redisClient) {
    this.redis = redisClient;
  }

  async cacheAnalysisResult(imageHash, result, ttl = 3600) {
    const key = `analysis:${imageHash}`;
    await this.redis.setex(key, ttl, JSON.stringify(result));
  }

  async getCachedAnalysis(imageHash) {
    const key = `analysis:${imageHash}`;
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async cachePropertyData(address, data, ttl = 86400) {
    const key = `property:${Buffer.from(address).toString('base64')}`;
    await this.redis.setex(key, ttl, JSON.stringify(data));
  }
}
```

## Backup and Disaster Recovery

### Database Backup

```bash
# Automated RDS backups
aws rds modify-db-instance \
  --db-instance-identifier cleanistic-ai-db \
  --backup-retention-period 30 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00"

# Manual snapshot
aws rds create-db-snapshot \
  --db-instance-identifier cleanistic-ai-db \
  --db-snapshot-identifier cleanistic-ai-manual-snapshot-$(date +%Y%m%d)
```

### S3 Cross-Region Replication

```json
{
  "Role": "arn:aws:iam::ACCOUNT-ID:role/replication-role",
  "Rules": [
    {
      "ID": "ReplicateImages",
      "Status": "Enabled",
      "Prefix": "property-images/",
      "Destination": {
        "Bucket": "arn:aws:s3:::cleanistic-ai-images-backup",
        "StorageClass": "STANDARD_IA"
      }
    }
  ]
}
```

## Scaling Considerations

### Horizontal Scaling

- **API Servers**: Auto-scale ECS tasks based on CPU/memory
- **Database**: Use read replicas for analytics queries
- **Cache**: Redis cluster mode for high availability
- **AI Models**: SageMaker auto-scaling for inference endpoints

### Vertical Scaling

- **Database**: Scale RDS instance types as needed
- **Cache**: Increase ElastiCache node types
- **Compute**: Adjust ECS task CPU/memory allocation

## Cost Optimization

### Reserved Instances

```bash
# Purchase RDS reserved instance
aws rds purchase-reserved-db-instances-offering \
  --reserved-db-instances-offering-id xxx \
  --reserved-db-instance-id cleanistic-ai-db-reserved

# Purchase ElastiCache reserved nodes
aws elasticache purchase-reserved-cache-nodes-offering \
  --reserved-cache-nodes-offering-id xxx \
  --reserved-cache-node-id cleanistic-ai-cache-reserved
```

### S3 Lifecycle Policies

```json
{
  "Rules": [
    {
      "ID": "ImageLifecycle",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "property-images/"
      },
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        },
        {
          "Days": 365,
          "StorageClass": "DEEP_ARCHIVE"
        }
      ]
    }
  ]
}
```

## Health Checks and Monitoring

### Application Health Check

```javascript
// health/health.controller.js
@Controller('health')
export class HealthController {
  @Get()
  async checkHealth() {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkS3(),
      this.checkAIModel()
    ]);

    const status = checks.every(check => check.status === 'fulfilled') ? 'healthy' : 'unhealthy';

    return {
      status,
      timestamp: new Date().toISOString(),
      checks: {
        database: checks[0].status,
        redis: checks[1].status,
        s3: checks[2].status,
        aiModel: checks[3].status
      }
    };
  }
}
```

### CloudWatch Alarms

```bash
# High error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "CleanisticAI-HighErrorRate" \
  --alarm-description "High error rate detected" \
  --metric-name ErrorRate \
  --namespace CleanisticAI/API \
  --statistic Average \
  --period 300 \
  --threshold 5.0 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2

# High response time alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "CleanisticAI-HighLatency" \
  --alarm-description "High response time detected" \
  --metric-name ResponseTime \
  --namespace CleanisticAI/API \
  --statistic Average \
  --period 300 \
  --threshold 3000 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

## Troubleshooting

### Common Deployment Issues

1. **ECS Task Fails to Start**
   - Check CloudWatch logs: `/ecs/cleanistic-ai`
   - Verify environment variables and secrets
   - Ensure security groups allow traffic

2. **Database Connection Issues**
   - Verify RDS security groups
   - Check VPC routing and NAT gateway
   - Validate connection string format

3. **S3 Upload Failures**
   - Verify IAM permissions
   - Check bucket policy and CORS
   - Ensure proper AWS credentials

4. **AI Model Inference Errors**
   - Check SageMaker endpoint status
   - Verify model artifacts in S3
   - Monitor endpoint CloudWatch metrics

### Debug Commands

```bash
# Check ECS service status
aws ecs describe-services --cluster cleanistic-ai-cluster --services cleanistic-ai-api

# View application logs
aws logs tail /ecs/cleanistic-ai --follow

# Check RDS status
aws rds describe-db-instances --db-instance-identifier cleanistic-ai-db

# Test SageMaker endpoint
aws sagemaker-runtime invoke-endpoint \
  --endpoint-name cleanistic-property-detector-endpoint \
  --content-type application/json \
  --body '{"image_url": "test-image.jpg"}' \
  output.json
```

## Maintenance

### Regular Tasks

1. **Weekly**: Review CloudWatch metrics and alarms
2. **Monthly**: Update dependencies and security patches
3. **Quarterly**: Review and optimize costs
4. **Annually**: Disaster recovery testing

### Update Procedures

1. **Rolling Updates**: Use ECS rolling deployments
2. **Database Migrations**: Run during maintenance windows
3. **Model Updates**: Blue/green deployment for SageMaker
4. **Frontend Updates**: CloudFront invalidation after S3 sync

This deployment guide provides a complete production-ready infrastructure for Cleanistic AI with enterprise-grade security, monitoring, and scalability.
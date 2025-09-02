# Cleanistic AI API Documentation

## Overview

The Cleanistic AI API provides endpoints for AI-powered property analysis and estimation services. This RESTful API enables integration of computer vision capabilities into cleaning service websites.

## Base URL

```
Production: https://api.cleanistic.ai
Development: http://localhost:3001
```

## Authentication

All API requests require authentication using API keys or JWT tokens.

### API Key Authentication
```http
Authorization: Bearer your-api-key
```

### JWT Authentication
```http
Authorization: Bearer your-jwt-token
```

## Rate Limiting

- **Analysis Endpoints**: 10 requests per minute per IP
- **General Endpoints**: 100 requests per 15 minutes per IP

## Endpoints

### Property Analysis

#### POST /api/estimator/analyze

Analyzes property images using AI vision to detect features and generate estimates.

**Request:**
```http
POST /api/estimator/analyze
Content-Type: multipart/form-data
Authorization: Bearer your-api-key

{
  "images": [File, File, ...], // Max 5 images, 10MB each
  "address": "123 Main St, City, State 12345", // Optional
  "serviceTypes": ["house_washing", "roof_cleaning"],
  "companyId": "your-company-id"
}
```

**Response:**
```json
{
  "success": true,
  "analysisId": "analysis_abc123",
  "propertyData": {
    "address": "123 Main St, City, State 12345",
    "squareFootage": 2400,
    "propertyType": "Single Family",
    "yearBuilt": 1995,
    "bedrooms": 4,
    "bathrooms": 3
  },
  "analysis": {
    "id": "analysis_abc123",
    "features": [
      {
        "type": "window",
        "confidence": 0.94,
        "boundingBox": { "x": 100, "y": 150, "width": 80, "height": 100 },
        "area": 8000
      }
    ],
    "totalWindows": 18,
    "totalDoors": 2,
    "estimatedSquareFootage": 2400,
    "confidence": 0.95,
    "processingTime": 2847
  },
  "estimates": [
    {
      "id": "est_xyz789",
      "serviceType": "house_washing",
      "totalPrice": 485.50,
      "breakdown": [
        {
          "item": "Base House Washing Service",
          "quantity": 1,
          "unitPrice": 150.00,
          "totalPrice": 150.00
        }
      ]
    }
  ],
  "totalEstimate": 485.50,
  "processingTime": 2847
}
```

### Company Management

#### GET /api/company/config

Retrieves company configuration including branding and pricing.

**Response:**
```json
{
  "companyId": "company_123",
  "branding": {
    "primaryColor": "#3b82f6",
    "secondaryColor": "#10b981",
    "logo": "https://cdn.example.com/logo.png",
    "companyName": "ABC Cleaning Co"
  },
  "pricing": {
    "houseWashing": {
      "basePrice": 150,
      "pricePerSqFt": 0.15,
      "pricePerWindow": 8
    }
  },
  "features": {
    "enableHouseWashing": true,
    "enableRoofCleaning": true,
    "enableGutterCleaning": true
  }
}
```

#### PUT /api/company/config

Updates company configuration.

### Analytics

#### GET /api/analytics/dashboard

Retrieves dashboard analytics data.

**Response:**
```json
{
  "totalEstimates": 1247,
  "conversionRate": 0.685,
  "averageEstimateValue": 342.50,
  "aiAccuracy": 0.948,
  "recentEstimates": [...]
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "images",
      "reason": "At least one image is required"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Invalid input parameters
- `UNAUTHORIZED`: Invalid or missing authentication
- `RATE_LIMITED`: Too many requests
- `ANALYSIS_FAILED`: AI analysis could not be completed
- `INTERNAL_ERROR`: Server-side error

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @cleanistic/ai-estimator
```

```javascript
import { CleanisticAI } from '@cleanistic/ai-estimator';

const estimator = new CleanisticAI({
  apiKey: 'your-api-key',
  environment: 'production' // or 'sandbox'
});

const result = await estimator.analyzeProperty({
  images: imageFiles,
  address: '123 Main St',
  serviceTypes: ['house_washing']
});
```

### Python
```bash
pip install cleanistic-ai
```

```python
from cleanistic_ai import CleanisticAI

estimator = CleanisticAI(api_key='your-api-key')
result = estimator.analyze_property(
    images=['image1.jpg', 'image2.jpg'],
    address='123 Main St',
    service_types=['house_washing']
)
```

## Webhooks

Configure webhooks to receive real-time notifications about estimate events.

### Webhook Events

- `estimate.created`: New estimate generated
- `estimate.accepted`: Customer accepted estimate
- `estimate.rejected`: Customer rejected estimate

### Webhook Payload Example

```json
{
  "event": "estimate.created",
  "data": {
    "estimateId": "est_abc123",
    "companyId": "company_xyz",
    "totalAmount": 485.50,
    "customerEmail": "customer@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## Testing

### Sandbox Environment

Use the sandbox environment for testing:

```
Base URL: https://sandbox-api.cleanistic.ai
API Key: sk_test_your-sandbox-key
```

### Test Images

We provide test property images for development:

```
https://cdn.cleanistic.ai/test-images/house-front.jpg
https://cdn.cleanistic.ai/test-images/house-side.jpg
https://cdn.cleanistic.ai/test-images/roof-view.jpg
```

## Support

- **Documentation**: https://docs.cleanistic.ai
- **Support Email**: support@cleanistic.ai
- **Status Page**: https://status.cleanistic.ai
- **Community**: https://community.cleanistic.ai
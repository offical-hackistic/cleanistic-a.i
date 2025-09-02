# Cleanistic AI Integration Guide

## Quick Start

Get your AI estimator running in under 5 minutes with these simple integration methods.

## Method 1: Web Component (Recommended)

The easiest way to add Cleanistic AI to any website.

### Step 1: Add the Script

```html
<script src="https://cdn.cleanistic.ai/widget.js"></script>
```

### Step 2: Add the Widget

```html
<cleanistic-estimator 
  company-id="your-company-id"
  api-key="your-api-key"
  primary-color="#3b82f6"
  company-name="Your Cleaning Company">
</cleanistic-estimator>
```

### Step 3: Customize (Optional)

```html
<cleanistic-estimator 
  company-id="your-company-id"
  api-key="your-api-key"
  primary-color="#10b981"
  secondary-color="#3b82f6"
  company-name="ABC Cleaning Co"
  enable-house-washing="true"
  enable-roof-cleaning="true"
  enable-gutter-cleaning="false"
  require-address="true">
</cleanistic-estimator>
```

## Method 2: React Component

For React applications, use our React component.

### Installation

```bash
npm install @cleanistic/react-estimator
```

### Usage

```jsx
import { CleanisticEstimator } from '@cleanistic/react-estimator';

function App() {
  const handleEstimateComplete = (result) => {
    console.log('Estimate completed:', result);
    // Handle the estimate result
  };

  return (
    <CleanisticEstimator
      companyId="your-company-id"
      apiKey="your-api-key"
      config={{
        branding: {
          primaryColor: "#3b82f6",
          companyName: "Your Cleaning Co"
        },
        features: {
          enableHouseWashing: true,
          enableRoofCleaning: true,
          requireAddress: false
        }
      }}
      onEstimateComplete={handleEstimateComplete}
    />
  );
}
```

## Method 3: WordPress Plugin

### Installation

1. Download the Cleanistic AI WordPress plugin
2. Upload to `/wp-content/plugins/cleanistic-ai/`
3. Activate the plugin in WordPress admin

### Configuration

1. Go to **Settings > Cleanistic AI**
2. Enter your API credentials
3. Customize appearance and features
4. Use shortcode `[cleanistic-estimator]` in posts/pages

### Shortcode Options

```
[cleanistic-estimator 
  company_id="your-company-id" 
  primary_color="#3b82f6"
  services="house_washing,roof_cleaning"]
```

## Method 4: Direct API Integration

For custom implementations, use our REST API directly.

### Basic Example

```javascript
const analyzeProperty = async (images, address, services) => {
  const formData = new FormData();
  
  images.forEach(image => formData.append('images', image));
  formData.append('address', address);
  formData.append('serviceTypes', JSON.stringify(services));
  formData.append('companyId', 'your-company-id');

  const response = await fetch('https://api.cleanistic.ai/estimator/analyze', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer your-api-key'
    },
    body: formData
  });

  return response.json();
};
```

## Configuration Options

### Branding Customization

```javascript
{
  branding: {
    primaryColor: "#3b82f6",      // Main brand color
    secondaryColor: "#10b981",    // Accent color
    logo: "https://your-logo.png", // Company logo URL
    companyName: "Your Company",   // Display name
    fontFamily: "Inter, sans-serif" // Custom font
  }
}
```

### Feature Configuration

```javascript
{
  features: {
    enableHouseWashing: true,     // Show house washing option
    enableRoofCleaning: true,     // Show roof cleaning option
    enableGutterCleaning: true,   // Show gutter cleaning option
    requireAddress: false,        // Make address required
    enablePropertyLookup: true,   // Auto-lookup property data
    maxImages: 5,                 // Maximum images allowed
    allowedFormats: ["jpg", "png", "webp"] // Supported formats
  }
}
```

### Pricing Configuration

```javascript
{
  pricing: {
    houseWashing: {
      basePrice: 150,        // Base service fee
      pricePerSqFt: 0.15,   // Price per square foot
      pricePerWindow: 8      // Price per window
    },
    roofCleaning: {
      basePrice: 200,
      pricePerSqFt: 0.25
    },
    gutterCleaning: {
      basePrice: 100,
      pricePerLinearFt: 3.50
    }
  }
}
```

## Event Handling

### JavaScript Events

```javascript
// Listen for estimate completion
document.addEventListener('cleanistic:estimate-complete', (event) => {
  const { analysisId, totalEstimate, estimates } = event.detail;
  console.log('New estimate:', totalEstimate);
});

// Listen for analysis progress
document.addEventListener('cleanistic:analysis-progress', (event) => {
  const { progress, stage } = event.detail;
  console.log(`Analysis ${progress}% complete: ${stage}`);
});

// Listen for errors
document.addEventListener('cleanistic:error', (event) => {
  const { error } = event.detail;
  console.error('Estimator error:', error);
});
```

### React Callbacks

```jsx
<CleanisticEstimator
  onEstimateComplete={(result) => {
    // Handle successful estimate
    console.log('Estimate:', result);
  }}
  onAnalysisProgress={(progress) => {
    // Handle progress updates
    console.log('Progress:', progress);
  }}
  onError={(error) => {
    // Handle errors
    console.error('Error:', error);
  }}
/>
```

## Styling and Customization

### CSS Custom Properties

Override default styles using CSS custom properties:

```css
cleanistic-estimator {
  --cleanistic-primary-color: #3b82f6;
  --cleanistic-secondary-color: #10b981;
  --cleanistic-border-radius: 8px;
  --cleanistic-font-family: 'Inter', sans-serif;
  --cleanistic-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### Custom CSS Classes

```css
.cleanistic-estimator {
  max-width: 600px;
  margin: 0 auto;
}

.cleanistic-estimator .upload-area {
  border: 2px dashed var(--cleanistic-primary-color);
}

.cleanistic-estimator .estimate-result {
  background: linear-gradient(135deg, 
    var(--cleanistic-primary-color), 
    var(--cleanistic-secondary-color)
  );
}
```

## Advanced Integration

### Custom UI with API

Build your own interface using our API:

```javascript
class CustomEstimator {
  constructor(apiKey, companyId) {
    this.apiKey = apiKey;
    this.companyId = companyId;
    this.baseUrl = 'https://api.cleanistic.ai';
  }

  async analyzeProperty(images, options = {}) {
    const formData = new FormData();
    
    images.forEach(image => formData.append('images', image));
    formData.append('companyId', this.companyId);
    formData.append('serviceTypes', JSON.stringify(options.services || ['house_washing']));
    
    if (options.address) {
      formData.append('address', options.address);
    }

    const response = await fetch(`${this.baseUrl}/api/estimator/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getCompanyConfig() {
    const response = await fetch(`${this.baseUrl}/api/company/config`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    return response.json();
  }
}
```

### Webhook Integration

Set up webhooks to receive real-time notifications:

```javascript
// Express.js webhook handler
app.post('/webhooks/cleanistic', (req, res) => {
  const { event, data } = req.body;
  
  switch (event) {
    case 'estimate.created':
      // Handle new estimate
      console.log('New estimate:', data.totalAmount);
      break;
      
    case 'estimate.accepted':
      // Handle accepted estimate
      console.log('Estimate accepted:', data.estimateId);
      break;
  }
  
  res.status(200).send('OK');
});
```

## Testing

### Test Mode

Use test mode for development:

```javascript
const estimator = new CleanisticEstimator({
  apiKey: 'sk_test_your-test-key',
  environment: 'sandbox'
});
```

### Test Images

Use our test images for development:

```javascript
const testImages = [
  'https://cdn.cleanistic.ai/test/house-front.jpg',
  'https://cdn.cleanistic.ai/test/house-side.jpg'
];
```

## Performance Optimization

### Image Optimization

Optimize images before upload:

```javascript
const optimizeImage = async (file) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  return new Promise((resolve) => {
    img.onload = () => {
      // Resize to max 1920x1080
      const maxWidth = 1920;
      const maxHeight = 1080;
      
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(resolve, 'image/jpeg', 0.85);
    };
    
    img.src = URL.createObjectURL(file);
  });
};
```

### Caching

Implement client-side caching for repeated analyses:

```javascript
const cacheKey = `analysis_${imageHash}_${serviceTypes.join('_')}`;
const cachedResult = localStorage.getItem(cacheKey);

if (cachedResult && Date.now() - JSON.parse(cachedResult).timestamp < 3600000) {
  return JSON.parse(cachedResult).data;
}
```

## Security Best Practices

### API Key Security

- Never expose API keys in client-side code
- Use environment variables for API keys
- Rotate API keys regularly
- Implement IP whitelisting for production

### Image Security

- Validate image types and sizes
- Scan uploads for malware
- Use signed URLs for image access
- Implement automatic image deletion

### Data Privacy

- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement GDPR compliance measures
- Provide data deletion capabilities

## Troubleshooting

### Common Issues

**Issue**: "Analysis failed with 429 error"
**Solution**: You've hit the rate limit. Wait 1 minute or upgrade your plan.

**Issue**: "Invalid image format"
**Solution**: Ensure images are JPEG, PNG, or WebP format under 10MB.

**Issue**: "Company not found"
**Solution**: Verify your company ID and API key are correct.

**Issue**: "Low confidence results"
**Solution**: Use higher quality images with clear views of the property.

### Debug Mode

Enable debug mode for detailed logging:

```javascript
const estimator = new CleanisticEstimator({
  apiKey: 'your-api-key',
  debug: true
});
```

## Support

- **Email**: support@cleanistic.ai
- **Documentation**: https://docs.cleanistic.ai
- **Status**: https://status.cleanistic.ai
- **Community**: https://community.cleanistic.ai

## Changelog

### v1.0.0 (Latest)
- Initial release
- AI vision analysis
- Multi-service estimation
- White-label customization
- Real-time property data lookup
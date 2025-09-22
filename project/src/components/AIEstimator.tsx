import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Camera, 
  MapPin, 
  Calculator, 
  CheckCircle, 
  AlertCircle,
  FileImage,
  X
} from 'lucide-react';
import { aiVisionService } from '@/services/aiVisionService';
import { propertyDataService } from '@/services/propertyDataService';
import { estimationService } from '@/services/estimationService';
import { EstimatorConfig, AnalysisResponse } from '@/types/estimator';

interface AIEstimatorProps {
  config?: EstimatorConfig;
  onEstimateComplete?: (result: AnalysisResponse) => void;
  embedded?: boolean;
}

export const AIEstimator: React.FC<AIEstimatorProps> = ({
  config = estimationService.getDefaultConfig(),
  onEstimateComplete,
  embedded = false
}) => {
  const [step, setStep] = useState<'upload' | 'processing' | 'results'>('upload');
  const [images, setImages] = useState<File[]>([]);
  const [imageSides, setImageSides] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(['house_washing']);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      setImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
      setImageSides(prev => {
        const add = new Array(Math.min(files.length, 5)).fill('front');
        return [...prev, ...add].slice(0, 5);
      });
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 5));
    setImageSides(prev => {
      const add = new Array(Math.min(files.length, 5)).fill('front');
      return [...prev, ...add].slice(0, 5);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageSides(prev => prev.filter((_, i) => i !== index));
  };

  const handleServiceToggle = (service: string, checked: boolean) => {
    setSelectedServices(prev => 
      checked 
        ? [...prev, service]
        : prev.filter(s => s !== service)
    );
  };

  const processEstimate = async () => {
    if (images.length === 0) {
      setError('Please upload at least one property image');
      return;
    }

    if (selectedServices.length === 0) {
      setError('Please select at least one service');
      return;
    }

    setError(null);
    setStep('processing');
    setProgress(0);

    try {
      // Step 1: Property data lookup (if address provided)
      let propertyData = null;
      if (address && config.features.enablePropertyLookup) {
        setProgress(20);
        propertyData = await propertyDataService.lookupProperty(address);
      }

      // Step 2: AI image analysis
      setProgress(40);
      const analysisResults = await Promise.all(
        images.map(image => aiVisionService.analyzeImage(image))
      );

      // Combine results from all images
      const allFeatures = analysisResults.flatMap(result => result.features);
      const avgConfidence = analysisResults.reduce((sum, r) => sum + r.confidence, 0) / analysisResults.length;
      const totalProcessingTime = analysisResults.reduce((sum, r) => sum + r.processingTime, 0);

      setProgress(70);

      // Step 3: Calculate square footage
      const estimatedSqFt = propertyData?.squareFootage || 
        aiVisionService.calculateSquareFootage(allFeatures, 1920, 1080);

      // Step 4: Generate estimates for selected services
      setProgress(90);
      const estimates = selectedServices.map(serviceType => 
        estimationService.calculateEstimate(allFeatures, estimatedSqFt, serviceType, config)
      );

      const totalEstimate = estimates.reduce((sum, est) => sum + est.totalPrice, 0);

      setProgress(100);

      const response: AnalysisResponse = {
        success: true,
        analysisId: `analysis_${Date.now()}`,
        propertyData: propertyData || undefined,
        analysis: {
          id: `analysis_${Date.now()}`,
          imageId: `img_${Date.now()}`,
          features: allFeatures,
          totalWindows: allFeatures.filter(f => f.type === 'window').length,
          totalDoors: allFeatures.filter(f => f.type === 'door').length,
          estimatedSquareFootage: estimatedSqFt,
          confidence: avgConfidence,
          processingTime: totalProcessingTime,
          createdAt: new Date()
        },
        estimates,
        totalEstimate,
        processingTime: totalProcessingTime
      };

      setResults(response);
      setStep('results');
      onEstimateComplete?.(response);

    } catch (error) {
      console.error('Estimation failed:', error);
      setError('Failed to process estimate. Please try again.');
      setStep('upload');
    }
  };

  const resetEstimator = () => {
    setStep('upload');
    setImages([]);
    setAddress('');
    setSelectedServices(['house_washing']);
    setProgress(0);
    setResults(null);
    setError(null);
  };

  const containerClass = embedded 
    ? 'w-full max-w-2xl mx-auto' 
    : 'container mx-auto px-4';

  return (
    <div className={containerClass}>
      <Card className="p-6 shadow-tech">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2" style={{ color: config.branding.primaryColor }}>
            {config.companyName} AI Estimator
          </h2>
          <p className="text-muted-foreground">
            Upload property photos for instant, accurate estimates
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'upload' && (
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Property Images</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Drag and drop property images here, or click to select
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="image-upload"
                />
                <Button variant="outline" asChild>
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Camera className="mr-2 h-4 w-4" />
                    Select Images
                  </label>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports JPEG, PNG, WebP (max 5 images)
                </p>
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Property ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {Math.round(image.size / 1024)}KB
                      </div>
                      <div className="mt-2">
                        <label className="block text-xs text-muted-foreground mb-1">Image Side</label>
                        <select
                          className="w-full text-xs border rounded px-2 py-1 bg-background"
                          value={imageSides[index] ?? 'front'}
                          onChange={(e) => {
                            const side = e.target.value;
                            setImageSides(prev => prev.map((s, i) => i === index ? side : s));
                          }}
                        >
                          <option value="front">Front</option>
                          <option value="back">Back</option>
                          <option value="left">Left</option>
                          <option value="right">Right</option>
                          <option value="roof">Roof</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Address Input */}
            {config.features.enablePropertyLookup && (
              <div className="space-y-2">
                <Label htmlFor="address">Property Address {config.features.requireAddress && '*'}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    placeholder="123 Main St, City, State 12345"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {/* Service Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Services Needed</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {config.features.enableHouseWashing && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="house_washing"
                      checked={selectedServices.includes('house_washing')}
                      onCheckedChange={(checked) => 
                        handleServiceToggle('house_washing', checked as boolean)
                      }
                    />
                    <Label htmlFor="house_washing">House Washing</Label>
                  </div>
                )}
                {config.features.enableRoofCleaning && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="roof_cleaning"
                      checked={selectedServices.includes('roof_cleaning')}
                      onCheckedChange={(checked) => 
                        handleServiceToggle('roof_cleaning', checked as boolean)
                      }
                    />
                    <Label htmlFor="roof_cleaning">Roof Cleaning</Label>
                  </div>
                )}
                {config.features.enableGutterCleaning && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gutter_cleaning"
                      checked={selectedServices.includes('gutter_cleaning')}
                      onCheckedChange={(checked) => 
                        handleServiceToggle('gutter_cleaning', checked as boolean)
                      }
                    />
                    <Label htmlFor="gutter_cleaning">Gutter Cleaning</Label>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Estimate Button */}
            <Button 
              onClick={processEstimate}
              className="w-full"
              size="lg"
              style={{ backgroundColor: config.branding.primaryColor }}
              disabled={images.length === 0 || selectedServices.length === 0}
            >
              <Calculator className="mr-2 h-5 w-5" />
              Generate AI Estimate
            </Button>
          </div>
        )}

        {step === 'processing' && (
          <div className="text-center space-y-6">
            <div className="animate-pulse">
              <FileImage className="mx-auto h-16 w-16 text-primary mb-4" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Analyzing Your Property</h3>
              <p className="text-muted-foreground">
                Our AI is detecting windows, doors, and calculating square footage...
              </p>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {progress < 30 && "Loading property data..."}
                {progress >= 30 && progress < 70 && "Analyzing images with AI..."}
                {progress >= 70 && progress < 95 && "Calculating estimates..."}
                {progress >= 95 && "Finalizing results..."}
              </p>
            </div>
          </div>
        )}

        {step === 'results' && results && (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Analysis Complete!</h3>
              <p className="text-muted-foreground">
                Processed in {results.processingTime}ms with {Math.round(results.analysis.confidence * 100)}% confidence
              </p>
            </div>

            {/* Property Analysis Results */}
            <Card className="p-4 bg-muted/50">
              <h4 className="font-semibold mb-3">Property Analysis</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Windows</div>
                  <div className="text-xl font-bold" style={{ color: config.branding.primaryColor }}>
                    {results.analysis.totalWindows}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Doors</div>
                  <div className="text-xl font-bold" style={{ color: config.branding.primaryColor }}>
                    {results.analysis.totalDoors}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Square Footage</div>
                  <div className="text-xl font-bold" style={{ color: config.branding.primaryColor }}>
                    {results.analysis.estimatedSquareFootage.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Confidence</div>
                  <div className="text-xl font-bold" style={{ color: config.branding.primaryColor }}>
                    {Math.round(results.analysis.confidence * 100)}%
                  </div>
                </div>
              </div>
            </Card>

            {/* Service Estimates */}
            <div className="space-y-4">
              <h4 className="font-semibold">Service Estimates</h4>
              {results.estimates.map((estimate, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-medium capitalize">
                      {estimate.serviceType.replace('_', ' ')}
                    </h5>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: config.branding.primaryColor }}>
                        ${estimate.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {estimate.breakdown.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.item}</span>
                        <span>${item.totalPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Total */}
            <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Estimate</span>
                <span className="text-3xl font-bold" style={{ color: config.branding.primaryColor }}>
                  ${results.totalEstimate.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Professional estimate based on AI analysis • Valid for 30 days
              </p>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                onClick={resetEstimator}
                className="flex-1"
              >
                New Estimate
              </Button>
              <Button 
                className="flex-1"
                style={{ backgroundColor: config.branding.primaryColor }}
              >
                Request Service
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

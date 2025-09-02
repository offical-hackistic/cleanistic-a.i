import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AIEstimator } from './AIEstimator';
import { AdminDashboard } from './AdminDashboard';
import { EmbeddableWidget } from './EmbeddableWidget';
import { AnalysisResponse } from '@/types/estimator';
import { 
  Calculator, 
  Settings, 
  Code, 
  Eye,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

export const EstimatorDemo: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState('estimator');
  const [lastEstimate, setLastEstimate] = useState<AnalysisResponse | null>(null);

  const handleEstimateComplete = (result: AnalysisResponse) => {
    setLastEstimate(result);
    console.log('Estimate completed:', result);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold gradient-text">Cleanistic AI Demo</h1>
              <p className="text-muted-foreground">
                Experience the power of AI-driven property estimation
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                <CheckCircle className="mr-1 h-3 w-3" />
                Production Ready
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <Clock className="mr-1 h-3 w-3" />
                Sub-3s Analysis
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                <Target className="mr-1 h-3 w-3" />
                94%+ Accuracy
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeDemo} onValueChange={setActiveDemo} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="estimator">
              <Calculator className="mr-2 h-4 w-4" />
              AI Estimator
            </TabsTrigger>
            <TabsTrigger value="widget">
              <Code className="mr-2 h-4 w-4" />
              Embeddable Widget
            </TabsTrigger>
            <TabsTrigger value="admin">
              <Settings className="mr-2 h-4 w-4" />
              Admin Dashboard
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="mr-2 h-4 w-4" />
              Live Preview
            </TabsTrigger>
          </TabsList>

          {/* AI Estimator Demo */}
          <TabsContent value="estimator" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">AI Property Estimator</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Upload property images and watch our AI analyze windows, doors, and square footage 
                to generate accurate service estimates in seconds.
              </p>
            </div>
            <AIEstimator onEstimateComplete={handleEstimateComplete} />
          </TabsContent>

          {/* Embeddable Widget Demo */}
          <TabsContent value="widget" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Embeddable Widget</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See how the estimator looks when embedded in a third-party website. 
                Fully customizable and framework-agnostic.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Integration Code</h3>
                <Card className="p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`<!-- Simple Integration -->
<script src="https://cdn.cleanistic.ai/widget.js"></script>
<cleanistic-estimator 
  company-id="your-company-id"
  primary-color="#3b82f6"
  company-name="Your Cleaning Co">
</cleanistic-estimator>

<!-- React Integration -->
import { EmbeddableWidget } from '@cleanistic/react';

<EmbeddableWidget
  companyId="your-company-id"
  customConfig={{
    branding: {
      primaryColor: "#3b82f6",
      companyName: "Your Cleaning Co"
    }
  }}
  onEstimateComplete={handleEstimate}
/>`}</code>
                  </pre>
                </Card>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Live Widget</h3>
                <EmbeddableWidget
                  companyId="demo"
                  customConfig={{
                    branding: {
                      primaryColor: "#10b981",
                      companyName: "Demo Cleaning Co"
                    }
                  }}
                  onEstimateComplete={handleEstimateComplete}
                />
              </div>
            </div>
          </TabsContent>

          {/* Admin Dashboard Demo */}
          <TabsContent value="admin">
            <AdminDashboard />
          </TabsContent>

          {/* Live Preview */}
          <TabsContent value="preview" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Live System Preview</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Real-time demonstration of the complete AI estimation system in action.
              </p>
            </div>

            {lastEstimate ? (
              <Card className="p-6">
                <div className="text-center mb-6">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold">Latest Estimate Results</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">
                      {lastEstimate.analysis.totalWindows}
                    </div>
                    <div className="text-sm text-muted-foreground">Windows Detected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">
                      {lastEstimate.analysis.totalDoors}
                    </div>
                    <div className="text-sm text-muted-foreground">Doors Detected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">
                      {lastEstimate.analysis.estimatedSquareFootage.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Square Feet</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">
                      ${lastEstimate.totalEstimate.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Estimate</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Service Breakdown</h4>
                  {lastEstimate.estimates.map((estimate, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="capitalize">{estimate.serviceType.replace('_', ' ')}</span>
                      <span className="font-semibold">${estimate.totalPrice.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center">
                <Calculator className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Estimates Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Try the AI Estimator tab to generate your first estimate and see the results here.
                </p>
                <Button onClick={() => setActiveDemo('estimator')}>
                  Try AI Estimator
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
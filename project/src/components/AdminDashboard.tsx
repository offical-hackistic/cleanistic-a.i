import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Upload } from "lucide-react";
import { 
  Settings, 
  Palette, 
  DollarSign, 
  BarChart3, 
  Users, 
  FileText,
  Eye,
  Download
} from 'lucide-react';
import { EstimatorConfig } from '@/types/estimator';
import { estimationService } from '@/services/estimationService';

export const AdminDashboard: React.FC = () => {
  const [config, setConfig] = useState<EstimatorConfig>(estimationService.getDefaultConfig());
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);

  const handleConfigUpdate = (updates: Partial<EstimatorConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...updates,
      branding: { ...prev.branding, ...updates.branding },
      pricing: { ...prev.pricing, ...updates.pricing },
      features: { ...prev.features, ...updates.features }
    }));
  };

  const saveConfiguration = async () => {
    setIsSaving(true);
    try {
      // In production, save to backend API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Configuration saved:', config);
    } catch (error) {
      console.error('Failed to save configuration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const generateEmbedCode = () => {
    return `<!-- Cleanistic AI Estimator Widget -->
<script src="https://cdn.cleanistic.ai/widget.js"></script>
<cleanistic-estimator 
  company-id="${config.companyId}"
  primary-color="${config.branding.primaryColor}"
  company-name="${config.branding.companyName}">
</cleanistic-estimator>`;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your AI estimator configuration and view analytics
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="branding">
              <Palette className="mr-2 h-4 w-4" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="pricing">
              <DollarSign className="mr-2 h-4 w-4" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="features">
              <Settings className="mr-2 h-4 w-4" />
              Features
            </TabsTrigger>
            <TabsTrigger value="integration">
              <FileText className="mr-2 h-4 w-4" />
              Integration
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68.5%</div>
                  <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Estimate Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$342</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94.8%</div>
                  <p className="text-xs text-muted-foreground">Consistent performance</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Estimates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: '1', address: '123 Oak Street', service: 'House Washing', amount: '$285', status: 'completed' },
                    { id: '2', address: '456 Pine Avenue', service: 'Roof Cleaning', amount: '$420', status: 'pending' },
                    { id: '3', address: '789 Maple Drive', service: 'Full Service', amount: '$650', status: 'completed' }
                  ].map((estimate) => (
                    <div key={estimate.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{estimate.address}</p>
                        <p className="text-sm text-muted-foreground">{estimate.service}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{estimate.amount}</p>
                        <Badge variant={estimate.status === 'completed' ? 'default' : 'secondary'}>
                          {estimate.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Customization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={config.branding.companyName}
                        onChange={(e) => handleConfigUpdate({
                          branding: { ...config.branding, companyName: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={config.branding.primaryColor}
                          onChange={(e) => handleConfigUpdate({
                            branding: { ...config.branding, primaryColor: e.target.value }
                          })}
                          className="w-20"
                        />
                        <Input
                          value={config.branding.primaryColor}
                          onChange={(e) => handleConfigUpdate({
                            branding: { ...config.branding, primaryColor: e.target.value }
                          })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={config.branding.secondaryColor}
                          onChange={(e) => handleConfigUpdate({
                            branding: { ...config.branding, secondaryColor: e.target.value }
                          })}
                          className="w-20"
                        />
                        <Input
                          value={config.branding.secondaryColor}
                          onChange={(e) => handleConfigUpdate({
                            branding: { ...config.branding, secondaryColor: e.target.value }
                          })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label>Preview</Label>
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold" style={{ color: config.branding.primaryColor }}>
                          {config.branding.companyName} AI Estimator
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Upload property photos for instant estimates
                        </p>
                      </div>
                      <Button 
                        className="w-full"
                        style={{ backgroundColor: config.branding.primaryColor }}
                      >
                        Generate Estimate
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>House Washing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Base Price ($)</Label>
                    <Input
                      type="number"
                      value={config.pricing.houseWashing.basePrice}
                      onChange={(e) => handleConfigUpdate({
                        pricing: {
                          ...config.pricing,
                          houseWashing: {
                            ...config.pricing.houseWashing,
                            basePrice: Number(e.target.value)
                          }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Price per Sq Ft ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={config.pricing.houseWashing.pricePerSqFt}
                      onChange={(e) => handleConfigUpdate({
                        pricing: {
                          ...config.pricing,
                          houseWashing: {
                            ...config.pricing.houseWashing,
                            pricePerSqFt: Number(e.target.value)
                          }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Price per Window ($)</Label>
                    <Input
                      type="number"
                      value={config.pricing.houseWashing.pricePerWindow}
                      onChange={(e) => handleConfigUpdate({
                        pricing: {
                          ...config.pricing,
                          houseWashing: {
                            ...config.pricing.houseWashing,
                            pricePerWindow: Number(e.target.value)
                          }
                        }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Roof Cleaning</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Base Price ($)</Label>
                    <Input
                      type="number"
                      value={config.pricing.roofCleaning.basePrice}
                      onChange={(e) => handleConfigUpdate({
                        pricing: {
                          ...config.pricing,
                          roofCleaning: {
                            ...config.pricing.roofCleaning,
                            basePrice: Number(e.target.value)
                          }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Price per Sq Ft ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={config.pricing.roofCleaning.pricePerSqFt}
                      onChange={(e) => handleConfigUpdate({
                        pricing: {
                          ...config.pricing,
                          roofCleaning: {
                            ...config.pricing.roofCleaning,
                            pricePerSqFt: Number(e.target.value)
                          }
                        }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gutter Cleaning</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Base Price ($)</Label>
                    <Input
                      type="number"
                      value={config.pricing.gutterCleaning.basePrice}
                      onChange={(e) => handleConfigUpdate({
                        pricing: {
                          ...config.pricing,
                          gutterCleaning: {
                            ...config.pricing.gutterCleaning,
                            basePrice: Number(e.target.value)
                          }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Price per Linear Ft ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={config.pricing.gutterCleaning.pricePerLinearFt}
                      onChange={(e) => handleConfigUpdate({
                        pricing: {
                          ...config.pricing,
                          gutterCleaning: {
                            ...config.pricing.gutterCleaning,
                            pricePerLinearFt: Number(e.target.value)
                          }
                        }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableHouseWashing">House Washing Service</Label>
                      <Switch
                        id="enableHouseWashing"
                        checked={config.features.enableHouseWashing}
                        onCheckedChange={(checked) => handleConfigUpdate({
                          features: { ...config.features, enableHouseWashing: checked }
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableRoofCleaning">Roof Cleaning Service</Label>
                      <Switch
                        id="enableRoofCleaning"
                        checked={config.features.enableRoofCleaning}
                        onCheckedChange={(checked) => handleConfigUpdate({
                          features: { ...config.features, enableRoofCleaning: checked }
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableGutterCleaning">Gutter Cleaning Service</Label>
                      <Switch
                        id="enableGutterCleaning"
                        checked={config.features.enableGutterCleaning}
                        onCheckedChange={(checked) => handleConfigUpdate({
                          features: { ...config.features, enableGutterCleaning: checked }
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="requireAddress">Require Address Input</Label>
                      <Switch
                        id="requireAddress"
                        checked={config.features.requireAddress}
                        onCheckedChange={(checked) => handleConfigUpdate({
                          features: { ...config.features, requireAddress: checked }
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enablePropertyLookup">Property Data Lookup</Label>
                      <Switch
                        id="enablePropertyLookup"
                        checked={config.features.enablePropertyLookup}
                        onCheckedChange={(checked) => handleConfigUpdate({
                          features: { ...config.features, enablePropertyLookup: checked }
                        })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integration Tab */}
          <TabsContent value="integration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Widget Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Embed Code</Label>
                  <div className="mt-2">
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{generateEmbedCode()}</code>
                    </pre>
                  </div>
                  <Button variant="outline" className="mt-2">
                    <Download className="mr-2 h-4 w-4" />
                    Copy Embed Code
                  </Button>
                </div>

                <div className="space-y-4">
                  <Label>Widget Preview</Label>
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="max-w-md mx-auto">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold" style={{ color: config.branding.primaryColor }}>
                          {config.branding.companyName} AI Estimator
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Upload property photos for instant estimates
                        </p>
                      </div>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Drop images here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <Button 
            onClick={saveConfiguration}
            disabled={isSaving}
            size="lg"
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </div>
    </div>
  );
};
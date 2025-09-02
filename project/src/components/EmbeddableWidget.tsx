import React, { useEffect, useState } from 'react';
import { AIEstimator } from './AIEstimator';
import { EstimatorConfig, AnalysisResponse } from '@/types/estimator';

interface EmbeddableWidgetProps {
  companyId: string;
  apiKey?: string;
  customConfig?: Partial<EstimatorConfig>;
  onEstimateComplete?: (result: AnalysisResponse) => void;
}

export const EmbeddableWidget: React.FC<EmbeddableWidgetProps> = ({
  companyId,
  apiKey,
  customConfig,
  onEstimateComplete
}) => {
  const [config, setConfig] = useState<EstimatorConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCompanyConfig();
  }, [companyId]);

  const loadCompanyConfig = async () => {
    try {
      // In production, this would fetch from your API
      // For demo, use default config with customizations
      const defaultConfig = {
        companyId,
        branding: {
          primaryColor: '#3b82f6',
          secondaryColor: '#10b981',
          companyName: 'Your Cleaning Company',
          ...customConfig?.branding
        },
        pricing: {
          houseWashing: {
            basePrice: 150,
            pricePerSqFt: 0.15,
            pricePerWindow: 8
          },
          roofCleaning: {
            basePrice: 200,
            pricePerSqFt: 0.25
          },
          gutterCleaning: {
            basePrice: 100,
            pricePerLinearFt: 3.50
          },
          ...customConfig?.pricing
        },
        features: {
          enableHouseWashing: true,
          enableRoofCleaning: true,
          enableGutterCleaning: true,
          requireAddress: false,
          enablePropertyLookup: true,
          ...customConfig?.features
        }
      };

      setConfig(defaultConfig);
      setLoading(false);
    } catch (err) {
      setError('Failed to load estimator configuration');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">{error || 'Configuration not found'}</p>
      </div>
    );
  }

  return (
    <AIEstimator
      config={config}
      onEstimateComplete={onEstimateComplete}
      embedded={true}
    />
  );
};

// Web Component wrapper for framework-agnostic embedding
export class CleanisticEstimatorElement extends HTMLElement {
  private root: any;

  static get observedAttributes() {
    return ['company-id', 'api-key', 'primary-color', 'company-name'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    const companyId = this.getAttribute('company-id') || 'demo';
    const apiKey = this.getAttribute('api-key') || undefined;
    const primaryColor = this.getAttribute('primary-color') || '#3b82f6';
    const companyName = this.getAttribute('company-name') || 'Your Cleaning Company';

    const customConfig = {
      branding: {
        primaryColor,
        companyName
      }
    };

    // In a real implementation, you'd use React.render here
    this.innerHTML = `
      <div id="cleanistic-estimator-${companyId}">
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: ${primaryColor}; font-size: 24px; font-weight: bold; margin-bottom: 8px;">
                ${companyName} AI Estimator
              </h2>
              <p style="color: #6b7280;">Upload property photos for instant, accurate estimates</p>
            </div>
            <div style="border: 2px dashed #d1d5db; border-radius: 8px; padding: 32px; text-align: center;">
              <p style="color: #6b7280; margin-bottom: 16px;">Drag and drop property images here</p>
              <button style="background: ${primaryColor}; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;">
                Select Images
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Register the custom element
if (typeof window !== 'undefined' && !customElements.get('cleanistic-estimator')) {
  customElements.define('cleanistic-estimator', CleanisticEstimatorElement);
}
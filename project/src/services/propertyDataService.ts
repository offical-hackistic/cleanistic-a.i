export interface PropertyLookupResult {
  address: string;
  squareFootage?: number;
  propertyType?: string;
  yearBuilt?: number;
  bedrooms?: number;
  bathrooms?: number;
  lotSize?: number;
  zillowId?: string;
  confidence: number;
}

export class PropertyDataService {
  private readonly ZILLOW_API_KEY = import.meta.env.VITE_ZILLOW_API_KEY;
  private readonly MELISSA_API_KEY = import.meta.env.VITE_MELISSA_API_KEY;

  async lookupProperty(address: string): Promise<PropertyLookupResult | null> {
    try {
      // Standardize address first
      const standardizedAddress = await this.standardizeAddress(address);
      
      // Lookup property data
      const propertyData = await this.fetchPropertyData(standardizedAddress);
      
      return propertyData;
    } catch (error) {
      console.error('Property lookup failed:', error);
      return this.generateMockPropertyData(address);
    }
  }

  private async standardizeAddress(address: string): Promise<string> {
    // In production, integrate with Melissa Data API
    // For demo, return cleaned address
    return address.trim().replace(/\s+/g, ' ');
  }

  private async fetchPropertyData(address: string): Promise<PropertyLookupResult> {
    // In production, integrate with Zillow API
    // For demo, simulate realistic property data
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

    return this.generateMockPropertyData(address);
  }

  private generateMockPropertyData(address: string): PropertyLookupResult {
    const propertyTypes = ['Single Family', 'Townhouse', 'Condo', 'Multi-Family'];
    const sqFootageRanges = [
      [1200, 1800], [1800, 2400], [2400, 3200], [3200, 4500]
    ];
    
    const typeIndex = Math.floor(Math.random() * propertyTypes.length);
    const sqftRange = sqFootageRanges[typeIndex];
    
    return {
      address,
      squareFootage: Math.floor(Math.random() * (sqftRange[1] - sqftRange[0]) + sqftRange[0]),
      propertyType: propertyTypes[typeIndex],
      yearBuilt: Math.floor(Math.random() * 50) + 1970,
      bedrooms: Math.floor(Math.random() * 4) + 2,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      lotSize: Math.floor(Math.random() * 8000) + 5000,
      zillowId: `zw_${Math.random().toString(36).substr(2, 9)}`,
      confidence: 0.88 + Math.random() * 0.11
    };
  }

  async validateAddress(address: string): Promise<boolean> {
    // Basic address validation
    const addressRegex = /^\d+\s+[A-Za-z0-9\s,.-]+$/;
    return addressRegex.test(address.trim());
  }
}

export const propertyDataService = new PropertyDataService();
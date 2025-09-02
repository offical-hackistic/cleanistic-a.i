import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Camera, Calculator, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleDemo = () => {
    navigate('/demo');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(217_91%_60%_/_0.05),transparent)]" />
      
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Content */}
        <div className="space-y-8 animate-slide-up">
          <div className="space-y-4">
            <div className="text-center space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Cleanistic AI
              </h1>
              <h2 className="text-2xl lg:text-4xl font-bold text-foreground">
                Instant Property Estimates
              </h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-lg">
              Revolutionary AI that counts windows, analyzes properties, and generates 
              accurate cleaning estimates in seconds. Transform your business today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="lg" onClick={handleDemo}>
              <Calculator className="mr-2 h-5 w-5" />
              Try AI Demo
            </Button>
            <Button variant="ai" size="lg">
              View Integration
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">99.5%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">3 sec</div>
              <div className="text-sm text-muted-foreground">Analysis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">85%</div>
              <div className="text-sm text-muted-foreground">Time Saved</div>
            </div>
          </div>
        </div>

        {/* Demo Interface */}
        <div className="relative animate-fade-in">
          <Card className="p-6 space-y-6 shadow-tech animate-float">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">AI Property Analyzer</h3>
              <p className="text-muted-foreground">Upload photos for instant estimates</p>
            </div>

            {/* Upload Area */}
            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              isAnalyzing ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}>
              {!showResults ? (
                <div className="space-y-4">
                  <Upload className={`mx-auto h-12 w-12 ${isAnalyzing ? 'animate-pulse text-primary' : 'text-muted-foreground'}`} />
                  {isAnalyzing ? (
                    <div className="space-y-2">
                      <p className="text-primary font-medium">Analyzing property...</p>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full animate-pulse" style={{width: '70%'}} />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Drop property photos here or click to upload
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Select Photos
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 animate-slide-up">
                  <CheckCircle className="mx-auto h-12 w-12 text-accent" />
                  <div className="space-y-3">
                    <h4 className="font-semibold text-accent">Analysis Complete!</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-secondary/50 p-3 rounded">
                        <div className="font-medium">Windows Detected</div>
                        <div className="text-2xl font-bold gradient-text">24</div>
                      </div>
                      <div className="bg-secondary/50 p-3 rounded">
                        <div className="font-medium">Property Size</div>
                        <div className="text-2xl font-bold gradient-text">2,400 sq ft</div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Estimate:</span>
                        <span className="text-xl font-bold gradient-text">$289</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Floating elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse" />
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-accent/20 rounded-full animate-pulse delay-700" />
        </div>
      </div>
    </section>
  );
};

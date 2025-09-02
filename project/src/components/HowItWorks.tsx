import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Brain, FileText, ArrowRight } from "lucide-react";
import windowCleaningImage from "@/assets/window-cleaning-ai.jpg";

const steps = [
  {
    icon: Upload,
    title: "Customer Uploads Photos",
    description: "Customers simply drag and drop property photos into your website's AI estimator.",
    step: "01"
  },
  {
    icon: Brain,
    title: "AI Analyzes Property",
    description: "Our vision AI counts windows, measures surfaces, and looks up property data automatically.",
    step: "02"
  },
  {
    icon: FileText,
    title: "Instant Detailed Quote",
    description: "Professional estimate generated with itemized pricing for all requested services.",
    step: "03"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-foreground">How It</span>
            <br />
            <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your estimation process forever
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card key={index} className="p-6 hover:shadow-tech transition-all duration-300 group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-3">
                      <step.icon className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-tech">
              <img 
                src={windowCleaningImage} 
                alt="AI analyzing property for cleaning services"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              
              {/* Overlay UI Elements */}
              <div className="absolute bottom-6 left-6 right-6">
                <Card className="p-4 bg-background/95 backdrop-blur">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Analysis Progress</span>
                      <span className="text-xs text-muted-foreground">95% Complete</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full" style={{width: '95%'}} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground">Windows:</span>
                        <span className="ml-2 font-semibold gradient-text">18 detected</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Est. Total:</span>
                        <span className="ml-2 font-semibold gradient-text">$245</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Floating indicators */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent/20 rounded-full animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary/20 rounded-full animate-pulse delay-1000" />
          </div>
        </div>

        <div className="text-center mt-12">
          <Button variant="hero" size="lg">
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
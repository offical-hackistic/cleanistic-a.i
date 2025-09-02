import { Card } from "@/components/ui/card";
import { 
  Eye, 
  MapPin, 
  Calculator, 
  Clock, 
  DollarSign, 
  Zap,
  Shield,
  Smartphone
} from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "AI Vision Analysis",
    description: "Advanced computer vision accurately counts windows, doors, and architectural features from any photo angle.",
    color: "text-primary"
  },
  {
    icon: MapPin,
    title: "Automatic Property Lookup",
    description: "Instantly retrieves property data from Zillow, Melissa Data, and other databases using just an address.",
    color: "text-accent"
  },
  {
    icon: Calculator,
    title: "Multi-Service Pricing",
    description: "Calculates estimates for window cleaning, pressure washing, gutter cleaning, and roof services.",
    color: "text-primary"
  },
  {
    icon: Clock,
    title: "3-Second Processing",
    description: "From photo upload to detailed estimate in under 3 seconds. No waiting, no delays.",
    color: "text-accent"
  },
  {
    icon: DollarSign,
    title: "ROI Optimization",
    description: "Reduces estimate costs by 85% while increasing quote accuracy and customer satisfaction.",
    color: "text-primary"
  },
  {
    icon: Zap,
    title: "Instant Integration",
    description: "Seamlessly embeds into your existing website with a simple code snippet. No technical expertise required.",
    color: "text-accent"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption protects customer data and property information at all times.",
    color: "text-primary"
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Perfect performance on all devices. Customers can get quotes anywhere, anytime.",
    color: "text-accent"
  }
];

export const Features = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-transparent" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="gradient-text">Powerful Features</span>
            <br />
            <span className="text-foreground">Built for Results</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every feature designed to save time, increase accuracy, and grow your business. 
            See why cleaning companies choose Cleanistic AI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 hover:shadow-tech transition-all duration-300 hover:-translate-y-1 group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
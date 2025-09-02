import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Clock, Target } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "85% Cost Reduction",
    subtitle: "Estimation Expenses",
    description: "Eliminate travel time, fuel costs, and labor hours for on-site estimates. Pay for itself in weeks.",
    metrics: ["$50 → $7.50 per estimate", "Save 45 min per quote", "Zero travel required"],
    color: "from-primary to-primary-glow"
  },
  {
    icon: Users,
    title: "300% More Leads",
    subtitle: "Customer Conversion",
    description: "Instant quotes remove friction. Customers love getting immediate pricing without waiting for callbacks.",
    metrics: ["Higher conversion rate", "24/7 availability", "Zero wait time"],
    color: "from-accent to-accent-glow"
  },
  {
    icon: Clock,
    title: "10x Faster Quotes",
    subtitle: "Response Time",
    description: "From days to seconds. Your competition can't match instant AI-powered estimates.",
    metrics: ["3 seconds vs 3 days", "Automatic follow-up", "Professional reports"],
    color: "from-primary to-accent"
  },
  {
    icon: Target,
    title: "99.5% Accuracy",
    subtitle: "Pricing Precision",
    description: "Advanced AI delivers more accurate estimates than traditional methods. Build customer trust.",
    metrics: ["Consistent pricing", "No human error", "Data-driven decisions"],
    color: "from-accent to-primary"
  }
];

export const Benefits = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/10 via-transparent to-muted/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="px-4 py-2 text-sm">
            Business Impact
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="text-foreground">Transform Your</span>
            <br />
            <span className="gradient-text">Business Results</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real metrics from cleaning companies using Cleanistic AI. 
            These aren't projections – they're proven results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <Card 
              key={index}
              className="p-8 hover:shadow-tech transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-start justify-between">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs px-3 py-1">
                    Proven Results
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold gradient-text">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{benefit.subtitle}</p>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <h4 className="text-sm font-semibold text-foreground">Key Metrics:</h4>
                  <div className="space-y-2">
                    {benefit.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-sm text-muted-foreground">{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Card className="inline-block p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Ready to see these results?</h3>
              <p className="text-muted-foreground">Join hundreds of cleaning companies already using Cleanistic AI</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <span>✓ Free 30-day trial</span>
                <span>✓ Setup in 5 minutes</span>
                <span>✓ Cancel anytime</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};